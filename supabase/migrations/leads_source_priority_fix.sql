begin;

-- Phase 5Y: compute_patient_source() precedence reorder -- real web
-- evidence (gclid/UTM/referrer) now wins over a manually-typed source
-- label (WhatsApp/Phone/Email/Social Media/Word of Mouth) whenever
-- both are present. Previously a WhatsApp-added patient whose linked
-- click evidence pointed at e.g. ChatGPT would still classify as
-- "WhatsApp" (checked first, before any web signal was even looked at)
-- -- the manual labels are now only a fallback for when there's
-- genuinely no web evidence at all. lib/patient-source.ts's
-- computePatientSource() is the byte-for-byte JS twin -- keep both in
-- sync.
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
    when p_source ilike 'whatsapp%' then 'WhatsApp'
    when p_source ilike 'phone%' then 'Phone'
    when p_source ilike 'email%' then 'Email'
    when p_source ilike 'instagram%' or p_source ilike 'facebook%' then 'Social Media'
    when p_source ilike 'referral%' then 'Word of Mouth'
    else 'Direct'
  end;
$$;

-- contact_clicks needs its own google_click_id to copy onto a linked
-- lead (lib/attribution-server.ts's linkContactClickToLead()) -- not
-- captured before this change.
alter table contact_clicks add column if not exists google_click_id text;

-- Backfill: copy every already-linked patient's click evidence onto
-- their own leads row (only ever filling columns that are currently
-- empty, never overwriting anything a lead already has) -- the exact
-- logic linkContactClickToLead() applies going forward, run once here
-- for patients linked before that function existed (e.g. Milozs).
update leads l
set
  landing_page = coalesce(l.landing_page, cc.landing_page),
  referrer_domain = coalesce(l.referrer_domain, cc.referrer_domain),
  utm_source = coalesce(l.utm_source, cc.utm_source),
  utm_medium = coalesce(l.utm_medium, cc.utm_medium),
  utm_campaign = coalesce(l.utm_campaign, cc.utm_campaign),
  google_click_id = coalesce(l.google_click_id, cc.google_click_id)
from contact_clicks cc
where cc.reference_code = l.linked_reference_code
  and l.linked_reference_code is not null;

-- Forces every row's stored acquisition_source to recompute against
-- the function above -- Postgres only recomputes a stored generated
-- column on INSERT/UPDATE of that row, never retroactively just
-- because the function it calls was replaced. Harmless no-op write
-- (rows already touched by the backfill above were already covered by
-- that UPDATE; this catches every other row too).
update leads set source = source;

commit;

notify pgrst, 'reload schema';
