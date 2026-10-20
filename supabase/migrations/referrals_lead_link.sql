-- ============================================================================
-- Phase 5L-B: unified "Patients" list -- link `referrals` to its mirrored
-- `leads` row. PREPARED LOCALLY -- NOT YET RUN. Must run AFTER
-- leads_owner.sql (adds the columns this one's FK target depends on
-- existing) and BEFORE leads_partner_backfill.sql (which populates it).
--
-- One direction only: referrals.lead_id -> leads.id. There is no
-- leads.referral_id column -- "find the referral for this patient row"
-- is a reverse lookup (where referrals.lead_id = leads.id), which is fine
-- for a 1:1 relationship and avoids ever having two FK columns that must
-- be kept in agreement.
--
-- Nullable: historical referrals are null until leads_partner_backfill.sql
-- runs; a referral created by the partner portal going forward (Phase
-- 5L, Step B) sets this at insert time.
--
-- The partner-portal pages/API routes (app/(dashboard)/partner-portal/**,
-- app/api/partner-portal/**) already select explicit column lists that
-- do not include lead_id, and are not changed by this migration -- a
-- partner session gains no new visibility from this column existing.
-- ============================================================================

alter table referrals
  add column if not exists lead_id uuid references leads(id);

create unique index if not exists referrals_lead_id_uidx on referrals(lead_id) where lead_id is not null;

-- No RLS/grant change: existing authenticated column-grants on referrals
-- (see referrals.sql) are an explicit column list that does not include
-- lead_id, so it is not exposed to partners by this migration.

-- ============================================================================
-- Rollback (not applied -- for reference only if this migration needs to
-- be reversed):
--
-- drop index if exists referrals_lead_id_uidx;
-- alter table referrals drop column if exists lead_id;
-- ============================================================================
