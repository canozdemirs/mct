-- ============================================================================
-- Phase 5L-C: one-time backfill -- create a mirrored `leads` row for every
-- EXISTING `referrals` row, and link it back via referrals.lead_id.
-- PREPARED LOCALLY -- NOT YET RUN. Must run AFTER leads_owner.sql and
-- referrals_lead_link.sql.
--
-- Idempotent by construction: the loop only visits referrals where
-- lead_id is still null, so running this twice (or re-running it after a
-- partial failure) never double-inserts.
--
-- Read-only pre-check run against the live project on 2026-10-20:
--   referrals to backfill: 1
--   existing leads rows:   8
--   phone/email collisions between them (last-10-digit phone match or
--   case-insensitive exact email match): 0
-- -- i.e. this creates exactly one new leads row, with no ambiguity
-- against anything already in leads.
--
-- Status mapping is DELIBERATELY coarse -- it exists only so the unified
-- Patients list's New/Contacted/Closed quick-filter tabs include partner
-- rows at a glance. It is NEVER the source of truth: the real 6-state
-- referral status lives on referrals.status and is what
-- app/(dashboard)/admin/referrals/[id]/page.tsx and the commission logic
-- in app/api/admin/referrals/[id]/route.ts always read/write. This
-- mapping is written once here, and going forward only ever rewritten by
-- that same route (Phase 5L, Step B adds one best-effort sync line there)
-- -- never by any other code path.
-- ============================================================================

do $$
declare
  r record;
  new_lead_id uuid;
begin
  for r in select * from referrals where lead_id is null loop
    insert into leads (
      source, name, email, phone, country, treatment, message,
      status, owner_type, partner_id, consent, created_at
    )
    values (
      'Partner Referral',
      r.patient_full_name,
      r.patient_email,
      r.patient_phone,
      r.patient_country,
      r.treatment,
      r.notes,
      case r.status
        when 'new' then 'new'
        when 'cancelled_lost' then 'closed'
        when 'treatment_completed' then 'closed'
        else 'contacted'
      end,
      'partner',
      r.partner_id,
      r.patient_consent,
      r.created_at
    )
    returning id into new_lead_id;

    update referrals set lead_id = new_lead_id where id = r.id;
  end loop;
end $$;

-- ============================================================================
-- Rollback (not applied -- for reference only if this migration needs to
-- be reversed). Safe because these are newly-created mirror rows, never
-- the authoritative referrals/commissions data:
--
-- update referrals set lead_id = null where lead_id in (select id from leads where owner_type = 'partner');
-- delete from leads where owner_type = 'partner';
-- ============================================================================
