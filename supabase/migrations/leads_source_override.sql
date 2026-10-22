begin;

-- Phase 5X: manual override for the Source acquisition category. When
-- set, source_override takes absolute priority over every other signal
-- (even Partner/WhatsApp/Phone/Email) -- a staff member's explicit
-- judgment call always wins. Values are constrained to the exact same
-- category labels compute_patient_source() can already produce
-- automatically.
alter table leads add column if not exists source_override text
  check (source_override is null or source_override in (
    'Google Ads', 'Google (SEO)', 'AI', 'Social Media', 'Other Search',
    'Other Websites', 'Word of Mouth', 'Direct', 'WhatsApp', 'Phone',
    'Email', 'Partner'
  ));

-- acquisition_source's generated expression must change to check
-- source_override first. Postgres has no ALTER COLUMN ... SET
-- EXPRESSION for generated columns, so the column (and its index) are
-- dropped and recreated against the updated function -- the data
-- itself is recomputed automatically from the still-present source
-- columns, nothing is lost.
drop index if exists leads_acquisition_source_idx;
alter table leads drop column if exists acquisition_source;
drop function if exists compute_patient_source(text, text, text, text, text, text);

create or replace function compute_patient_source(
  p_owner_type text,
  p_source text,
  p_utm_source text,
  p_utm_medium text,
  p_referrer_domain text,
  p_google_click_id text,
  p_source_override text
) returns text
language sql
immutable
as $$
  select case
    when p_source_override is not null and p_source_override <> '' then p_source_override
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

alter table leads add column acquisition_source text
  generated always as (
    compute_patient_source(owner_type, source, utm_source, utm_medium, referrer_domain, google_click_id, source_override)
  ) stored;

create index if not exists leads_acquisition_source_idx on leads (acquisition_source);

commit;

notify pgrst, 'reload schema';
