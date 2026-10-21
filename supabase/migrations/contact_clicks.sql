begin;

-- Phase 5S: standalone table for WhatsApp/email reference-code clicks.
-- Deliberately NOT a resurrection of lead_attributions (consent-gated
-- multi-touch infrastructure, never applied to this database -- every
-- reference code generated before this change was silently unrecorded).
-- One unconditional snapshot per click: landing page, UTM, referrer
-- domain, and a best-effort treatment guess, all captured client-side
-- with no consent gate (same posture as leads.page_url).
create table if not exists contact_clicks (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  reference_code text not null unique,
  channel text not null check (channel in ('whatsapp', 'email')),
  landing_page text,
  referrer_domain text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  treatment text,
  -- on delete set null (2026-10-21, owner's own change when running this):
  -- deleting the linked lead (delete_patient()) must never be blocked by,
  -- or cascade into deleting, this click-evidence row.
  lead_id uuid references leads(id) on delete set null
);

create index if not exists contact_clicks_created_at_idx on contact_clicks (created_at desc);

alter table contact_clicks enable row level security;

-- service_role only -- zero anon/authenticated grants, per CLAUDE.md's
-- Supabase table-grant policy. This is CRM-adjacent marketing-click data
-- tied to reference codes staff later link to real patients.
grant select, insert, update, delete on contact_clicks to service_role;

-- Phase 5T: "Registered Date" (CLAUDE.md-adjacent rename of "First contact
-- date") must always equal the instant the record was created, never a
-- manually picked value. A DB-level default covers every insert path
-- (public form, manual add, partner-portal mirror, sync-referrals) in one
-- place rather than needing each route to remember to set it.
alter table leads alter column first_contacted_at set default now();

-- One-time backfill for existing rows that predate this column being
-- populated on every path (e.g. form-submitted leads, which never set it
-- at all until now) -- created_at is the closest true "registered at"
-- value available for them.
update leads
set first_contacted_at = created_at
where first_contacted_at is null;

-- Phase 5R follow-up: referrer-domain fallback for the Patients list
-- Channel column (utm_source, else this, else "Direct"). No backfill --
-- no referrer was ever captured before this change.
alter table leads add column if not exists referrer_domain text;

commit;

notify pgrst, 'reload schema';
