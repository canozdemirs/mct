-- ============================================================================
-- Lead capture: unifies every patient-facing form on the marketing site.
-- Run this once in Supabase Dashboard -> SQL Editor.
-- ============================================================================

create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  source text not null,
  name text not null,
  email text,
  phone text,
  country text,
  treatment text,
  message text,
  details jsonb not null default '{}'::jsonb,
  page_url text,
  consent boolean not null default false,

  status text not null default 'new' check (status in ('new', 'contacted', 'closed'))
);

create index if not exists leads_created_at_idx on leads(created_at desc);
create index if not exists leads_source_idx on leads(source);
create index if not exists leads_status_idx on leads(status);

alter table leads enable row level security;

-- No policies and no grants for anon/authenticated at all — every insert
-- must go through app/api/leads/route.ts using the service role key. Admin
-- reads also go through the service role, matching the partner_applications
-- pattern already used elsewhere in this project.
revoke all on leads from anon, authenticated;
grant all on leads to service_role;
