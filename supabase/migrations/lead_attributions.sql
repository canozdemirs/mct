-- ============================================================================
-- Phase 5K-A: unified patient reference-code system.
-- PREPARED LOCALLY -- NOT YET RUN. Do not run against production or any
-- shared Supabase project until the owner explicitly approves Phase 5K-A for
-- deployment. Run once in Supabase Dashboard -> SQL Editor when approved.
-- ============================================================================
--
-- Deliberately minimal for this phase. Per the Phase 5K-A approval (section
-- 6), no CMP / Consent Mode v2 exists yet, so no marketing attribution data
-- (utm_*, gclid/gbraid/wbraid, landing_page, referrer, first-touch/
-- session-touch) is captured or stored here. This table only maps a
-- reference_code to a contact channel and, once a real inquiry is
-- confirmed, to the resulting lead. Full acquisition-source attribution is
-- Phase 5K-B's job, gated behind a separate owner approval once a CMP is in
-- place.
--
-- reference_code is generated server-side (lib/attribution.ts,
-- generateReferenceCode()) and checked for uniqueness by the caller before
-- insert (retry loop, not a DB-level generator) -- the unique index below
-- is the actual correctness guarantee; the application-level check is only
-- an optimization to avoid exhausting retries under contention.
-- ============================================================================

create table if not exists lead_attributions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  reference_code text not null,
  channel text not null check (channel in ('whatsapp', 'email', 'form')),

  lead_id uuid references leads(id),
  status text not null default 'contact_initiated' check (status in ('contact_initiated', 'lead_confirmed'))
);

create unique index if not exists lead_attributions_reference_code_idx on lead_attributions(reference_code);
create index if not exists lead_attributions_lead_id_idx on lead_attributions(lead_id);
create index if not exists lead_attributions_created_at_idx on lead_attributions(created_at desc);

alter table lead_attributions enable row level security;

-- Same pattern as leads.sql: no policies and no grants for anon/
-- authenticated at all -- every insert/update goes through
-- app/api/attribution/route.ts or app/api/leads/route.ts using the service
-- role key. Staff reads go through app/(dashboard)/admin/attribution/page.tsx,
-- also via the service role key, after an explicit ADMIN_EMAILS check.
revoke all on lead_attributions from anon, authenticated;
grant all on lead_attributions to service_role;
