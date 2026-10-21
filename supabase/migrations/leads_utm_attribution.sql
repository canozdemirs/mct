begin;

-- Phase 5R: lightweight landing-page/UTM attribution parsed server-side
-- from leads.page_url (already captured, unconditionally, at submit time)
-- -- independent of the separate lead_attributions pipeline, which is
-- consent-gated, client-side-only, and not yet applied to this database.
-- `leads` is already service_role-only (see CLAUDE.md), so no new GRANTs
-- are needed for these columns.
alter table leads
  add column if not exists landing_page text,
  add column if not exists utm_source text,
  add column if not exists utm_medium text,
  add column if not exists utm_campaign text;

-- Backfill from each row's existing page_url. Plain regex extraction, no
-- percent-decoding -- correct for the overwhelming majority of real-world
-- UTM values (plain tokens like google, chatgpt.com, newsletter, cpc).
-- Only touches rows that have a page_url and don't already have a
-- landing_page (so re-running this block is a no-op).
update leads
set
  landing_page = regexp_replace(split_part(page_url, '?', 1), '^https?://[^/]+', ''),
  utm_source = substring(page_url from 'utm_source=([^&]+)'),
  utm_medium = substring(page_url from 'utm_medium=([^&]+)'),
  utm_campaign = substring(page_url from 'utm_campaign=([^&]+)')
where page_url is not null
  and landing_page is null;

commit;

notify pgrst, 'reload schema';
