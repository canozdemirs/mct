-- ============================================================================
-- Phase 5L-E: single-patient owner switching (the "Edit" modal's
-- MCT <-> Partner toggle). PREPARED LOCALLY -- NOT YET RUN. Independent
-- of the other four 5L migrations in terms of execution order, but
-- requires leads.owner_type/partner_id (5L-A) and referrals.lead_id
-- (5L-B) to already exist, and reuses deleted_records_log (5L-D).
--
-- attach_patient_to_partner: used when an admin converts an existing
-- MCT-direct patient into a partner patient. Creates a brand-new
-- `referrals` row with status = 'new' from the lead's current fields --
-- NEVER a commission, since this only makes the partner eligible for
-- commission on this patient's FUTURE treatment, not anything that may
-- have already happened. The caller (app/api/admin/leads/[id]/owner/
-- route.ts) is expected to validate that country/phone/treatment are
-- already filled in before calling this -- all three are NOT NULL on
-- referrals, and this function intentionally does not paper over a
-- missing one with a placeholder value.
--
-- detach_single_patient: the one-referral version of
-- detach_partner_patients (5L-D) -- same log-then-delete pattern, same
-- "patient survives, referral/commission history doesn't" outcome, just
-- scoped to a single lead_id instead of every referral for a partner.
-- ============================================================================

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
        message = trim(
          coalesce(message, '') ||
          case when coalesce(message, '') = '' then '' else E'\n' end ||
          'Former partner: ' || coalesce(v_partner_name, 'Unknown')
        )
    where id = p_lead_id;

  delete from referrals where id = v_referral.id;

  return jsonb_build_object('ok', true);
end;
$$;

revoke all on function detach_single_patient(uuid, text) from public;
grant execute on function detach_single_patient(uuid, text) to service_role;

-- ============================================================================
-- Rollback (not applied -- for reference only if this migration needs to
-- be reversed):
--
-- drop function if exists detach_single_patient(uuid, text);
-- drop function if exists attach_patient_to_partner(uuid, uuid);
-- ============================================================================
