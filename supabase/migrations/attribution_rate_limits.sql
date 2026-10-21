-- ============================================================================
-- Phase 5K-A: Supabase-backed rate limiting for the public
-- POST /api/attribution endpoint.
-- ============================================================================
--
-- The existing in-memory per-IP limiter (app/api/leads/route.ts's pattern,
-- reused as-is in app/api/attribution/route.ts) resets on cold start and is
-- not shared across serverless instances -- an accepted tradeoff for a
-- cheap first line of defense, but explicitly insufficient on its own for
-- a public endpoint that now persists a real row per call (contact_clicks,
-- since 2026-10-21). This table is the cross-instance-consistent second
-- layer: lib/attribution-server.ts's checkAttributionRateLimit() already
-- calls it and degrades gracefully (logs, never blocks the patient-facing
-- action) when this table doesn't exist -- so this migration only
-- activates code that has been live and waiting since Phase 5K-A. bucket_key
-- is an HMAC-SHA256 digest (lib/attribution.ts, rateLimitBucketKey()) -- the
-- raw IP address is never written to this table, only an irreversible
-- keyed hash, so no personal data is persisted here.
-- ============================================================================

begin;

create table if not exists attribution_rate_limits (
  bucket_key text primary key,
  window_start timestamptz not null default now(),
  request_count int not null default 1
);

alter table attribution_rate_limits enable row level security;

revoke all on attribution_rate_limits from anon, authenticated;
grant all on attribution_rate_limits to service_role;

commit;

notify pgrst, 'reload schema';
