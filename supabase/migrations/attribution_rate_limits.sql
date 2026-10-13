-- ============================================================================
-- Phase 5K-A: Supabase-backed rate limiting for the public
-- POST /api/attribution endpoint.
-- PREPARED LOCALLY -- NOT YET RUN. Do not run against production or any
-- shared Supabase project until the owner explicitly approves deployment.
-- ============================================================================
--
-- The existing in-memory per-IP limiter (app/api/leads/route.ts's pattern)
-- resets on cold start and is not shared across serverless instances -- an
-- accepted tradeoff there, but explicitly called out as insufficient on its
-- own for /api/attribution (Phase 5K-A approval, section 7). This table is
-- the cross-instance-consistent second layer. bucket_key is an
-- HMAC-SHA256 digest (lib/attribution.ts, rateLimitBucketKey()) -- the raw
-- IP address is never written to this table, only an irreversible keyed
-- hash, so no personal data is persisted here.
-- ============================================================================

create table if not exists attribution_rate_limits (
  bucket_key text primary key,
  window_start timestamptz not null default now(),
  request_count int not null default 1
);

alter table attribution_rate_limits enable row level security;

revoke all on attribution_rate_limits from anon, authenticated;
grant all on attribution_rate_limits to service_role;
