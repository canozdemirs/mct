-- ============================================================================
-- SADECE bir sorun olursa çalıştır.
-- Rollback for revoke_anon_grants.sql — restores anon to the same "GRANT
-- ALL" state it had before that migration (i.e. back to relying on RLS
-- alone, as it did prior to hardening). Only run this if revoking anon's
-- grants on partner_applications, partners, referrals, commissions, or
-- referral_status_history broke something unexpected after applying
-- revoke_anon_grants.sql.
-- ============================================================================

grant all on partner_applications to anon;
grant all on partners to anon;
grant all on referrals to anon;
grant all on commissions to anon;
grant all on referral_status_history to anon;
