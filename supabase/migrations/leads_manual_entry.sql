-- ============================================================================
-- Phase 5K-D: manual lead entry support ("Yeni hasta ekle" in /admin/leads).
-- PREPARED LOCALLY -- NOT YET RUN.
--
-- Do not run against production or any shared Supabase project until the
-- owner has explicitly verified this targets the correct project and
-- explicitly approves execution.
--
-- is_manual distinguishes staff-entered leads (WhatsApp/phone/Instagram
-- etc. relayed by a coordinator) from ones the public site's own forms
-- inserted directly. Existing rows default to false, which is correct:
-- every row that already exists came from a public form.
--
-- first_contacted_at records when the patient actually first reached out
-- (which staff knows and enters), distinct from created_at (when the row
-- was typed into the admin panel, which can be days later). Nullable
-- because it is only meaningful for manual entries -- existing and future
-- form-submitted rows leave it null.
--
-- No GRANT/RLS change needed: leads already has
-- "revoke all from anon, authenticated; grant all to service_role" (see
-- leads.sql), which applies automatically to new columns on the same
-- table.
-- ============================================================================

alter table leads
  add column if not exists is_manual boolean not null default false,
  add column if not exists first_contacted_at timestamptz;

create index if not exists leads_is_manual_idx on leads(is_manual);

-- ============================================================================
-- Rollback (not applied -- for reference only if this migration needs to
-- be reversed):
--
-- drop index if exists leads_is_manual_idx;
-- alter table leads
--   drop column if exists is_manual,
--   drop column if exists first_contacted_at;
-- ============================================================================
