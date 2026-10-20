-- ============================================================================
-- Phase 5N: hospital selection on leads, admin-only, never synced to
-- referrals/partner portal. Free text (not a FK/enum) because the value
-- can be a hospital's display name from lib/hospitals.ts, the literal
-- "Not decided yet", or free text when "Other" is picked.
-- APPLIED 2026-10-20 via Supabase SQL Editor (not run by Claude).
-- ============================================================================

alter table leads add column if not exists hospital text;
create index if not exists leads_hospital_idx on leads(hospital);

notify pgrst, 'reload schema';
