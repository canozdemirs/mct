begin;

-- Phase 5V: Channel as a real, filterable column -- single source of
-- truth for both the Patients list's Channel column and its filter
-- dropdown, mirroring lib/patient-channel.ts's computePatientChannel()
-- exactly (keep them in sync if that logic ever changes). A partner-
-- owned patient didn't arrive through any web channel at all; a
-- WhatsApp/email-added one has no utm_source/referrer_domain on its own
-- row (only the public form's insert ever sets those), so it's detected
-- from the `source` label instead (auto-filled to "WhatsApp"/"Email" by
-- add-manual-lead-form.tsx's "Add from WhatsApp" lookup).
create or replace function compute_patient_channel(
  p_owner_type text,
  p_source text,
  p_utm_source text,
  p_referrer_domain text
) returns text
language sql
immutable
as $$
  select case
    when p_owner_type = 'partner' then 'Partner'
    when p_source ilike 'whatsapp%' then 'WhatsApp'
    when p_source ilike 'email%' then 'Email'
    when p_utm_source is not null and p_utm_source <> '' then p_utm_source
    when p_referrer_domain is not null and p_referrer_domain <> '' then p_referrer_domain
    else 'Direct'
  end;
$$;

alter table leads add column if not exists channel text
  generated always as (
    compute_patient_channel(owner_type, source, utm_source, referrer_domain)
  ) stored;

create index if not exists leads_channel_idx on leads (channel);

commit;

notify pgrst, 'reload schema';
