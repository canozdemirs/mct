begin;

-- Phase 5W: "Source" acquisition category -- distinct from leads.source
-- (the raw form/page label, now labeled "Form / Page" in the UI) and
-- from the Channel column (stays as the detailed raw value, e.g.
-- "chatgpt.com"). Single source of truth, kept byte-for-byte equivalent
-- to lib/patient-source.ts's computePatientSource() -- update both if
-- this logic ever changes.

-- Captured the same unconditional, no-consent-gate way as utm_source/
-- referrer_domain (app/api/leads/route.ts, lib/session-entry.ts):
-- gclid/gbraid/wbraid all serve the same purpose here (presence == a
-- Google Ads click), so only one combined column is kept.
alter table leads add column if not exists google_click_id text;

create or replace function host_matches_any(host text, domains text[])
returns boolean
language sql
immutable
as $$
  select host is not null and exists (
    select 1 from unnest(domains) d
    where lower(host) = d or lower(host) like ('%.' || d)
  );
$$;

create or replace function compute_patient_source(
  p_owner_type text,
  p_source text,
  p_utm_source text,
  p_utm_medium text,
  p_referrer_domain text,
  p_google_click_id text
) returns text
language sql
immutable
as $$
  select case
    when p_owner_type = 'partner' then 'Partner'
    when p_source ilike 'whatsapp%' then 'WhatsApp'
    when p_source ilike 'phone%' then 'Phone'
    when p_source ilike 'email%' then 'Email'
    when p_source ilike 'instagram%' or p_source ilike 'facebook%' then 'Social Media'
    when p_source ilike 'referral%' then 'Word of Mouth'
    when p_google_click_id is not null and p_google_click_id <> '' then 'Google Ads'
    when lower(p_utm_medium) in ('cpc', 'ppc', 'paid', 'display', 'paidsocial', 'paid-social')
      and lower(p_utm_source) like 'google%' then 'Google Ads'
    when host_matches_any(p_utm_source, array['chatgpt.com','chat.openai.com','gemini.google.com','perplexity.ai','copilot.microsoft.com','claude.ai'])
      or host_matches_any(p_referrer_domain, array['chatgpt.com','chat.openai.com','gemini.google.com','perplexity.ai','copilot.microsoft.com','claude.ai'])
      then 'AI'
    when host_matches_any(p_utm_source, array['instagram.com','facebook.com','tiktok.com','youtube.com','linkedin.com','twitter.com','x.com'])
      or host_matches_any(p_referrer_domain, array['instagram.com','facebook.com','tiktok.com','youtube.com','linkedin.com','twitter.com','x.com'])
      then 'Social Media'
    when lower(p_referrer_domain) ~ '(^|\.)google\.[a-z]{2,3}(\.[a-z]{2})?$' then 'Google (SEO)'
    when host_matches_any(p_referrer_domain, array['bing.com','yandex.com','yandex.ru','duckduckgo.com']) then 'Other Search'
    when (p_referrer_domain is not null and p_referrer_domain <> '') or (p_utm_source is not null and p_utm_source <> '') then 'Other Websites'
    else 'Direct'
  end;
$$;

alter table leads add column if not exists acquisition_source text
  generated always as (
    compute_patient_source(owner_type, source, utm_source, utm_medium, referrer_domain, google_click_id)
  ) stored;

create index if not exists leads_acquisition_source_idx on leads (acquisition_source);

commit;

notify pgrst, 'reload schema';
