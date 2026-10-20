-- ============================================================================
-- Phase 5M: unified patient detail card (MCT-direct and partner-owned
-- patients share one set of components) -- schema support.
-- APPLIED 2026-10-20 via Supabase SQL Editor (not run by Claude).
-- ============================================================================

begin;

-- Phase 5M-A: unify leads.status onto the same 6-state enum as referrals.
alter table leads drop constraint if exists leads_status_check;

update leads set status = 'cancelled_lost' where status = 'closed';

alter table leads add constraint leads_status_check
  check (status in ('new', 'contacted', 'consultation', 'treatment_planned', 'treatment_completed', 'cancelled_lost'));

-- One-time catch-up: partner-owned leads were only ever getting a coarse
-- new/contacted/closed mirror of their referral's real status. Now that
-- all 6 states fit, give them their real status immediately rather than
-- waiting for the next status change event.
update leads l set status = r.status from referrals r where r.lead_id = l.id;

alter table leads add column if not exists files jsonb not null default '[]'::jsonb;

-- Phase 5M-A2: patient's own message (read-only on the card) vs.
-- admin-only internal notes (editable, parallel to referrals.admin_notes).
alter table leads add column if not exists internal_notes text;

-- Phase 5M-B: MCT-side status audit trail, mirrors referral_status_history.
create table if not exists lead_status_history (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references leads(id),
  old_status text,
  new_status text not null,
  changed_by text,
  changed_at timestamptz not null default now()
);

create index if not exists lead_status_history_lead_id_idx on lead_status_history(lead_id);

alter table lead_status_history enable row level security;
revoke all on lead_status_history from anon, authenticated;
grant all on lead_status_history to service_role;

-- Phase 5M-C: MCT-side revenue tracking, mirrors commissions (no
-- percentage/commission_amount split -- net_amount IS the revenue).
create table if not exists patient_revenues (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references leads(id),

  institution_type text not null check (institution_type in ('mct_package', 'external_institution')),
  institution_name text,
  net_amount numeric(12,2) not null check (net_amount > 0),
  currency text not null check (currency in ('EUR', 'USD', 'GBP', 'TRY')),

  payment_status text not null default 'pending' check (payment_status in ('pending', 'received', 'cancelled')),
  payment_date date,

  reconciliation_status text not null default 'none' check (reconciliation_status in ('none', 'needs_reconciliation', 'resolved')),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint institution_name_required_when_external
    check (institution_type = 'mct_package' or institution_name is not null)
);

create index if not exists patient_revenues_lead_id_idx on patient_revenues(lead_id);
create unique index if not exists patient_revenues_one_active_per_lead on patient_revenues(lead_id) where payment_status <> 'cancelled';

create trigger patient_revenues_set_updated_at before update on patient_revenues
  for each row execute function set_updated_at();

alter table patient_revenues enable row level security;
revoke all on patient_revenues from anon, authenticated;
grant all on patient_revenues to service_role;

-- Phase 5M-D: private bucket for MCT patient files -- admin-only via
-- service role, same "no policy needed" posture as leads/deleted_records_log.
insert into storage.buckets (id, name, public)
values ('mct-patient-files', 'mct-patient-files', false)
on conflict (id) do nothing;

-- Phase 5M-E: delete_patient() now also logs+removes an MCT patient's
-- active revenue and status history.
create or replace function delete_patient(p_lead_id uuid, p_deleted_by text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_lead record;
  v_referral record;
  v_revenue record;
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
  else
    select * into v_revenue from patient_revenues
      where lead_id = p_lead_id and payment_status <> 'cancelled'
      limit 1;

    if v_revenue.id is not null then
      v_comm_amount := v_revenue.net_amount;
      v_comm_currency := v_revenue.currency;
      v_comm_status := v_revenue.payment_status;
      v_comm_payment_date := v_revenue.payment_date;
    end if;
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

  delete from patient_revenues where lead_id = p_lead_id;
  delete from lead_status_history where lead_id = p_lead_id;
  delete from lead_attributions where lead_id = p_lead_id;
  delete from leads where id = p_lead_id;

  return jsonb_build_object('ok', true, 'log_id', v_log_id);
end;
$$;

revoke all on function delete_patient(uuid, text) from public;
grant execute on function delete_patient(uuid, text) to service_role;

-- Phase 5M-F: detach_partner_patients() / detach_single_patient() now
-- write "Former partner: X" to internal_notes, never to message (the
-- patient's own original text, kept read-only on the card).
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
            internal_notes = trim(
              coalesce(internal_notes, '') ||
              case when coalesce(internal_notes, '') = '' then '' else E'\n' end ||
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

create or replace function detach_single_patient(p_lead_id uuid, p_deleted_by text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_referral record;
  v_partner_name text;
  v_comm_amount numeric(12,2);
  v_comm_currency text;
  v_comm_status text;
  v_comm_payment_date date;
begin
  select * into v_referral from referrals where lead_id = p_lead_id;
  if v_referral.id is null then
    raise exception 'No referral linked to lead %', p_lead_id;
  end if;

  select commission_amount, currency, status, payment_date
    into v_comm_amount, v_comm_currency, v_comm_status, v_comm_payment_date
    from commissions
    where referral_id = v_referral.id and status <> 'cancelled'
    limit 1;

  select company_name into v_partner_name from partners where id = v_referral.partner_id;

  insert into deleted_records_log (
    deleted_by, patient_name, owner_type, partner_name,
    lead_id, referral_id, referral_status,
    commission_amount, commission_currency, commission_status, commission_payment_date
  ) values (
    p_deleted_by, v_referral.patient_full_name, 'partner', v_partner_name,
    p_lead_id, v_referral.id, v_referral.status,
    v_comm_amount, v_comm_currency, v_comm_status, v_comm_payment_date
  );

  delete from commissions where referral_id = v_referral.id;
  delete from referral_status_history where referral_id = v_referral.id;

  update leads
    set owner_type = 'mct',
        partner_id = null,
        internal_notes = trim(
          coalesce(internal_notes, '') ||
          case when coalesce(internal_notes, '') = '' then '' else E'\n' end ||
          'Former partner: ' || coalesce(v_partner_name, 'Unknown')
        )
    where id = p_lead_id;

  delete from referrals where id = v_referral.id;

  return jsonb_build_object('ok', true);
end;
$$;

revoke all on function detach_single_patient(uuid, text) from public;
grant execute on function detach_single_patient(uuid, text) to service_role;

-- Phase 5M-G: attach_patient_to_partner() refuses to attach a patient
-- with unresolved money on it -- an active (non-cancelled) revenue
-- record, or a Treatment Completed status (which implies revenue should
-- exist even if not entered) -- so no financial record is ever silently
-- orphaned by the ownership change.
create or replace function attach_patient_to_partner(p_lead_id uuid, p_partner_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_lead record;
  new_referral_id uuid;
begin
  select * into v_lead from leads where id = p_lead_id;
  if v_lead.id is null then
    raise exception 'Lead % not found', p_lead_id;
  end if;
  if v_lead.owner_type = 'partner' then
    raise exception 'Lead % is already partner-owned', p_lead_id;
  end if;

  if v_lead.status = 'treatment_completed' then
    raise exception 'Cannot attach to a partner while status is Treatment Completed. Change the status first.';
  end if;

  if exists (select 1 from patient_revenues where lead_id = p_lead_id and payment_status <> 'cancelled') then
    raise exception 'Cancel the revenue record first.';
  end if;

  insert into referrals (
    partner_id, patient_full_name, patient_country, patient_phone, patient_email,
    treatment, notes, patient_consent, status, lead_id
  ) values (
    p_partner_id, v_lead.name, v_lead.country, v_lead.phone, v_lead.email,
    v_lead.treatment, v_lead.message, v_lead.consent, 'new', p_lead_id
  )
  returning id into new_referral_id;

  update leads set owner_type = 'partner', partner_id = p_partner_id where id = p_lead_id;

  return new_referral_id;
end;
$$;

revoke all on function attach_patient_to_partner(uuid, uuid) from public;
grant execute on function attach_patient_to_partner(uuid, uuid) to service_role;

commit;

notify pgrst, 'reload schema';

-- ============================================================================
-- One-time data migration (applied separately, 2026-10-20): moved
-- existing manually-added leads' notes from `message` (now read-only,
-- patient-facing) to `internal_notes` (admin-editable).
--
-- update leads set internal_notes = message, message = null where is_manual = true and message is not null;
-- ============================================================================
