-- ============================================================================
-- Phase 5L-A: unified "Patients" list -- owner tracking on `leads`.
-- PREPARED LOCALLY -- NOT YET RUN.
--
-- Do not run against production or any shared Supabase project until the
-- owner has explicitly verified this targets the correct project and
-- explicitly approves execution.
--
-- owner_type distinguishes a direct MCT patient (site forms, WhatsApp,
-- phone, manually added) from a patient who arrived via a partner's
-- referral. partner_id is only ever set when owner_type = 'partner' --
-- enforced by the CHECK constraint below, not just convention.
--
-- Every existing row defaults to owner_type = 'mct', which is correct:
-- every row that already exists today came from a public form or manual
-- entry, never from a partner (that concept doesn't exist on `leads` yet).
-- ============================================================================

alter table leads
  add column if not exists owner_type text not null default 'mct' check (owner_type in ('mct', 'partner')),
  add column if not exists partner_id uuid references partners(id);

alter table leads
  add constraint leads_partner_owner_consistency
    check ((owner_type = 'partner') = (partner_id is not null));

create index if not exists leads_owner_type_idx on leads(owner_type);
create index if not exists leads_partner_id_idx on leads(partner_id) where partner_id is not null;

-- No GRANT/RLS change needed: leads already has
-- "revoke all from anon, authenticated; grant all to service_role",
-- which applies automatically to new columns on the same table.

-- ============================================================================
-- Rollback (not applied -- for reference only if this migration needs to
-- be reversed):
--
-- drop index if exists leads_partner_id_idx;
-- drop index if exists leads_owner_type_idx;
-- alter table leads drop constraint if exists leads_partner_owner_consistency;
-- alter table leads
--   drop column if exists owner_type,
--   drop column if exists partner_id;
-- ============================================================================
