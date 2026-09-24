-- ============================================================================
-- PENDING — NOT YET APPLIED.
-- Canlıya geçmeden önce Supabase Dashboard -> SQL Editor'de çalıştırılacak,
-- ardından partner akışı (başvuru formu, partner portal, admin panel) test
-- edilecek. Bir sorun çıkarsa aynı klasördeki rollback_revoke_anon_grants.sql
-- ile geri alınabilir.
-- ============================================================================
--
-- Harden anon grants on partner_applications, partners, referrals,
-- commissions, referral_status_history.
-- Run this once in Supabase Dashboard -> SQL Editor.
-- ============================================================================
--
-- These five tables were always designed to be reached only via the
-- service_role key (admin routes/pages, the public partner-application
-- endpoint, partner-portal status/list lookups) or, for referrals and
-- commissions, via RLS-scoped `authenticated` sessions in the partner
-- portal. RLS already blocked `anon` from ever seeing or writing a row on
-- all five — but the underlying table-level GRANT to `anon` (applied
-- automatically by Supabase when each table was created) was never
-- explicitly revoked, except on `leads`. This closes that gap: `anon` loses
-- every privilege on these tables outright, so a direct anon-key REST call
-- now gets a 401 permission-denied (like `leads` already does) instead of a
-- 200 with an empty array. RLS stops being the only layer.
--
-- `authenticated` is intentionally left untouched by this migration — the
-- partner portal reads/writes `referrals` and `commissions` as
-- `authenticated`, scoped by the RLS policies already defined in
-- referrals.sql / commissions.sql.
--
-- Verified before writing this migration: every code path touching these
-- five tables uses either the service_role key, or the session-bound
-- Supabase client only after an explicit `auth.getUser()` check (so it
-- always hits Postgres as `authenticated`, never `anon`). No API route,
-- server component, or client component queries these tables directly with
-- the anon key. Confirmed live: anon-key REST probes against all five
-- returned `200 []` (RLS-blocked, not grant-blocked) before this migration.
-- ============================================================================

revoke all on partner_applications from anon;
revoke all on partners from anon;
revoke all on referrals from anon;
revoke all on commissions from anon;
revoke all on referral_status_history from anon;
