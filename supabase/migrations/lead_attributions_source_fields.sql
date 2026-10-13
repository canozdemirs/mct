-- ============================================================================
-- Phase 5K-C: additive schema extension for patient acquisition-source
-- attribution. PREPARED LOCALLY -- NOT YET RUN.
--
-- Do not run against production or any shared Supabase project until the
-- owner has explicitly verified which project this would target (see the
-- Phase 5K-C report, section H) and explicitly approves execution. This
-- file must be applied AFTER lead_attributions.sql (it extends that
-- table) -- ordering: leads.sql -> lead_attributions.sql ->
-- lead_attributions_source_fields.sql -> attribution_rate_limits.sql
-- (the last one has no dependency on the others and can run any time
-- relative to them).
--
-- Every column is nullable with no default beyond NULL -- "no evidence
-- captured" is the normal, expected state for a visitor who denied
-- consent or whose URL had no UTM/gclid parameters at all, not an error
-- condition. inferred_channel is deliberately a free-text CHECK-constrained
-- column, not a foreign key or enum type, to keep this migration a single
-- additive statement with no new types to manage.
--
-- No existing column is altered, renamed, or dropped. No existing row's
-- data is touched (new columns on existing rows default to NULL). RLS and
-- grants already defined on lead_attributions in lead_attributions.sql
-- apply automatically to these new columns -- no separate GRANT/RLS
-- statement is needed or included here.
-- ============================================================================

alter table lead_attributions
  add column if not exists first_touch_landing_page text,
  add column if not exists first_touch_referrer text,
  add column if not exists first_touch_utm_source text,
  add column if not exists first_touch_utm_medium text,
  add column if not exists first_touch_utm_campaign text,
  add column if not exists first_touch_utm_content text,
  add column if not exists first_touch_utm_term text,
  add column if not exists first_touch_gclid text,
  add column if not exists first_touch_gbraid text,
  add column if not exists first_touch_wbraid text,
  add column if not exists first_touch_at timestamptz,

  add column if not exists last_touch_landing_page text,
  add column if not exists last_touch_referrer text,
  add column if not exists last_touch_utm_source text,
  add column if not exists last_touch_utm_medium text,
  add column if not exists last_touch_utm_campaign text,
  add column if not exists last_touch_utm_content text,
  add column if not exists last_touch_utm_term text,
  add column if not exists last_touch_gclid text,
  add column if not exists last_touch_gbraid text,
  add column if not exists last_touch_wbraid text,
  add column if not exists last_touch_at timestamptz,

  add column if not exists inferred_channel text
    check (inferred_channel is null or inferred_channel in (
      'google_ads', 'google_organic', 'other_paid', 'referral', 'direct_inferred', 'unknown'
    ));

create index if not exists lead_attributions_inferred_channel_idx on lead_attributions(inferred_channel);

-- ============================================================================
-- Rollback (not applied -- for reference only if this migration needs to
-- be reversed):
--
-- alter table lead_attributions
--   drop column if exists first_touch_landing_page,
--   drop column if exists first_touch_referrer,
--   drop column if exists first_touch_utm_source,
--   drop column if exists first_touch_utm_medium,
--   drop column if exists first_touch_utm_campaign,
--   drop column if exists first_touch_utm_content,
--   drop column if exists first_touch_utm_term,
--   drop column if exists first_touch_gclid,
--   drop column if exists first_touch_gbraid,
--   drop column if exists first_touch_wbraid,
--   drop column if exists first_touch_at,
--   drop column if exists last_touch_landing_page,
--   drop column if exists last_touch_referrer,
--   drop column if exists last_touch_utm_source,
--   drop column if exists last_touch_utm_medium,
--   drop column if exists last_touch_utm_campaign,
--   drop column if exists last_touch_utm_content,
--   drop column if exists last_touch_utm_term,
--   drop column if exists last_touch_gclid,
--   drop column if exists last_touch_gbraid,
--   drop column if exists last_touch_wbraid,
--   drop column if exists last_touch_at,
--   drop column if exists inferred_channel;
-- drop index if exists lead_attributions_inferred_channel_idx;
-- ============================================================================
