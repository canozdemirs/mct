-- ============================================================================
-- Phase 5L-D: audited, atomic patient deletion. PREPARED LOCALLY -- NOT
-- YET RUN. Independent of the other three 5L migrations (no column
-- dependency), but conceptually part of the same Patients merge and
-- meant to land in the same batch.
--
-- Replaces the manual, un-logged cascade-delete in
-- app/api/admin/partner-applications/[id]/route.ts (flagged there as
-- unsafe for real partner data) with two functions that always log
-- before deleting, inside the same transaction as the deletes
-- themselves -- the log can never exist without the deletion actually
-- happening, or vice versa, because a failure anywhere in the function
-- body rolls back the whole thing, log insert included.
--
-- deleted_records_log deliberately excludes phone, email, treatment, and
-- any other free-text patient detail -- only the fields needed to
-- reconcile accounting for a deleted patient's commission history:
-- when, by whom, whose record (name + owner), and the referral/
-- commission snapshot. lead_id/referral_id are plain uuid columns, NOT
-- foreign keys -- the whole point is this row survives after the
-- referenced leads/referrals rows are gone.
--
-- plpgsql correctness note (both functions below): a bare `record`
-- variable that is never actually assigned a row by a SELECT INTO --
-- because that statement sits inside a branch that doesn't run -- stays
-- in a true "unassigned" state, and reading ANY field off it raises
-- "record ... is not assigned yet", not a NULL. Commission lookups are
-- exactly this case (no active commission is the common case), so those
-- are scalar variables instead (always NULL by default, never
-- "unassigned"). Separately, `v_referral IS NOT NULL` / `v_lead IS NULL`
-- on a *found* composite row use SQL row-NULL semantics -- true only if
-- EVERY column is non-null / every column is null -- which is wrong the
-- moment a real row has so much as one nullable column actually NULL
-- (patient_email, notes, ...). Both checks below instead test `.id`,
-- the primary key, which is never null on a row that was actually found.
-- ============================================================================

create table if not exists deleted_records_log (
  id uuid primary key default gen_random_uuid(),
  deleted_at timestamptz not null default now(),
  deleted_by text not null,

  patient_name text not null,
  owner_type text not null check (owner_type in ('mct', 'partner')),
  partner_name text,

  -- Nullable on purpose (live schema, run 2026-10-20): a referral without
  -- a linked lead_id (shouldn't happen post-backfill, but detach must
  -- never be blocked by it) still needs to log and delete cleanly.
  lead_id uuid,
  referral_id uuid,
  referral_status text,
  commission_amount numeric(12,2),
  commission_currency text,
  commission_status text,
  commission_payment_date date
);

create index if not exists deleted_records_log_deleted_at_idx on deleted_records_log(deleted_at desc);

alter table deleted_records_log enable row level security;
revoke all on deleted_records_log from anon, authenticated;
grant all on deleted_records_log to service_role;

-- ----------------------------------------------------------------------------
-- delete_patient(p_lead_id, p_deleted_by)
--
-- Used by the "Delete" action on /admin/leads (Patients) for ANY patient,
-- MCT-direct or partner-owned. For a partner-owned patient this removes
-- the patient entirely: the leads row, its referral, that referral's
-- status history, and any commission on it (pending or paid) -- which is
-- why the admin-facing confirmation dialog (Step B) must show the
-- partner name + referral status + commission status/amount before this
-- is ever called, per the approved plan.
--
-- Bulk delete calls this once per selected id, independently -- each
-- patient's deletion is its own all-or-nothing unit; one failure does
-- not block or roll back any other patient in the same batch.
-- ----------------------------------------------------------------------------
create or replace function delete_patient(p_lead_id uuid, p_deleted_by text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_lead record;
  v_referral record;
  v_partner_name text;
  v_log_id uuid;
  v_comm_amount numeric(12,2);
  v_comm_currency text;
  v_comm_status text;
  v_comm_payment_date date;
begin
  select * into v_lead from leads where id = p_lead_id;
  if v_lead.id is null then
    raise exception 'Lead % not found', p_lead_id;
  end if;

  select * into v_referral from referrals where lead_id = p_lead_id;

  if v_referral.id is not null then
    select commission_amount, currency, status, payment_date
      into v_comm_amount, v_comm_currency, v_comm_status, v_comm_payment_date
      from commissions
      where referral_id = v_referral.id and status <> 'cancelled'
      limit 1;

    select company_name into v_partner_name from partners where id = v_referral.partner_id;
  end if;

  insert into deleted_records_log (
    deleted_by, patient_name, owner_type, partner_name,
    lead_id, referral_id, referral_status,
    commission_amount, commission_currency, commission_status, commission_payment_date
  ) values (
    p_deleted_by, v_lead.name, v_lead.owner_type, v_partner_name,
    v_lead.id, v_referral.id, v_referral.status,
    v_comm_amount, v_comm_currency, v_comm_status, v_comm_payment_date
  ) returning id into v_log_id;

  if v_referral.id is not null then
    delete from commissions where referral_id = v_referral.id;
    delete from referral_status_history where referral_id = v_referral.id;
    delete from referrals where id = v_referral.id;
  end if;

  delete from lead_attributions where lead_id = p_lead_id;
  delete from leads where id = p_lead_id;

  return jsonb_build_object('ok', true, 'log_id', v_log_id);
end;
$$;

revoke all on function delete_patient(uuid, text) from public;
grant execute on function delete_patient(uuid, text) to service_role;

-- ----------------------------------------------------------------------------
-- detach_partner_patients(p_partner_id, p_deleted_by)
--
-- Used when a whole PARTNER is deleted (the existing "Delete Application"
-- flow in app/(dashboard)/admin/partner-applications/[id]/page.tsx /
-- components/admin/admin-actions.tsx, backed by
-- app/api/admin/partner-applications/[id]/route.ts). Per the approved
-- decision, this does NOT delete the partner's patients from `leads` --
-- their referral/commission history is logged and removed, but the
-- patient themselves survives as a direct MCT patient: owner_type is
-- reset to 'mct', partner_id to null, and "Former partner: <name>" is
-- appended to their note so the context isn't silently lost.
--
-- The caller (app/api/admin/partner-applications/[id]/route.ts) runs this
-- once, BEFORE deleting the partners/partner_applications rows and the
-- Supabase Auth user -- those three are not patient financial records and
-- keep being deleted exactly as today, unchanged by this migration.
-- ----------------------------------------------------------------------------
create or replace function detach_partner_patients(p_partner_id uuid, p_deleted_by text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_partner_name text;
  r record;
  v_count int := 0;
  v_comm_amount numeric(12,2);
  v_comm_currency text;
  v_comm_status text;
  v_comm_payment_date date;
begin
  select company_name into v_partner_name from partners where id = p_partner_id;

  for r in select * from referrals where partner_id = p_partner_id loop
    v_comm_amount := null;
    v_comm_currency := null;
    v_comm_status := null;
    v_comm_payment_date := null;

    select commission_amount, currency, status, payment_date
      into v_comm_amount, v_comm_currency, v_comm_status, v_comm_payment_date
      from commissions
      where referral_id = r.id and status <> 'cancelled'
      limit 1;

    insert into deleted_records_log (
      deleted_by, patient_name, owner_type, partner_name,
      lead_id, referral_id, referral_status,
      commission_amount, commission_currency, commission_status, commission_payment_date
    ) values (
      p_deleted_by, r.patient_full_name, 'partner', v_partner_name,
      r.lead_id, r.id, r.status,
      v_comm_amount, v_comm_currency, v_comm_status, v_comm_payment_date
    );

    delete from commissions where referral_id = r.id;
    delete from referral_status_history where referral_id = r.id;

    if r.lead_id is not null then
      update leads
        set owner_type = 'mct',
            partner_id = null,
            message = trim(
              coalesce(message, '') ||
              case when coalesce(message, '') = '' then '' else E'\n' end ||
              'Former partner: ' || coalesce(v_partner_name, 'Unknown')
            )
        where id = r.lead_id;
    end if;

    delete from referrals where id = r.id;
    v_count := v_count + 1;
  end loop;

  return jsonb_build_object('ok', true, 'detached_count', v_count);
end;
$$;

revoke all on function detach_partner_patients(uuid, text) from public;
grant execute on function detach_partner_patients(uuid, text) to service_role;

-- ============================================================================
-- Rollback (not applied -- for reference only if this migration needs to
-- be reversed). deleted_records_log rows are never recreated by a
-- rollback -- they are an audit trail, not application state:
--
-- drop function if exists detach_partner_patients(uuid, text);
-- drop function if exists delete_patient(uuid, text);
-- drop table if exists deleted_records_log;
-- ============================================================================
