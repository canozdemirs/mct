-- ============================================================================
-- Phase 3: Partner Referral Workflow
-- Run this once in Supabase Dashboard -> SQL Editor (or `supabase db push`).
-- ============================================================================

-- Referrals table -------------------------------------------------------
create table if not exists referrals (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid not null references partners(id),

  patient_full_name text not null,
  patient_country text not null,
  patient_phone text not null,
  patient_email text,
  treatment text not null,
  notes text,
  patient_consent boolean not null default false,
  files jsonb not null default '[]'::jsonb,

  status text not null default 'new' check (
    status in ('new', 'contacted', 'consultation', 'treatment_planned', 'treatment_completed', 'cancelled_lost')
  ),
  admin_notes text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists referrals_partner_id_idx on referrals(partner_id);
create index if not exists referrals_status_idx on referrals(status);
create index if not exists referrals_created_at_idx on referrals(created_at desc);

-- Keep updated_at current on every row change.
create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists referrals_set_updated_at on referrals;
create trigger referrals_set_updated_at
  before update on referrals
  for each row
  execute function set_updated_at();

-- Helper functions --------------------------------------------------------
-- SECURITY DEFINER is required here: `partners` has RLS enabled with no
-- SELECT policy (by design, see partner_applications.sql), so a plain
-- subquery run as the `authenticated` role would see zero rows and every
-- policy below would silently evaluate to false for everyone. These
-- functions run with the privileges of their owner, bypassing that.
create or replace function current_partner_id()
returns uuid
language sql
security definer
set search_path = public
stable
as $$
  select id from partners where auth_user_id = auth.uid();
$$;

create or replace function is_mct_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select coalesce((auth.jwt() ->> 'email') in (
    'hello@medicalcenterturkey.com',
    'can.ozdemir@medicalcenterturkey.com'
  ), false);
$$;

-- Referrals get their owner automatically from the session — the app never
-- has to (and, per the grants below, cannot) set partner_id explicitly.
alter table referrals alter column partner_id set default current_partner_id();

-- Row Level Security --------------------------------------------------------
alter table referrals enable row level security;

drop policy if exists "partners_select_own_referrals" on referrals;
create policy "partners_select_own_referrals"
  on referrals for select
  to authenticated
  using (partner_id = current_partner_id());

drop policy if exists "partners_insert_own_referrals" on referrals;
create policy "partners_insert_own_referrals"
  on referrals for insert
  to authenticated
  with check (partner_id = current_partner_id());

-- Partners may only edit patient-facing fields, and only while status='new'.
-- Combined with the column grants below (which exclude `status`), this means
-- a partner cannot use this policy to change status even indirectly.
drop policy if exists "partners_update_own_referrals_while_new" on referrals;
create policy "partners_update_own_referrals_while_new"
  on referrals for update
  to authenticated
  using (partner_id = current_partner_id() and status = 'new')
  with check (partner_id = current_partner_id() and status = 'new');

-- Admin panel currently reads/writes via the service_role key (BYPASSRLS),
-- same pattern as partner_applications/partners. These policies are kept as
-- defense-in-depth in case any future code queries referrals as the admin's
-- own authenticated session instead.
drop policy if exists "admins_select_all_referrals" on referrals;
create policy "admins_select_all_referrals"
  on referrals for select
  to authenticated
  using (is_mct_admin());

drop policy if exists "admins_update_all_referrals" on referrals;
create policy "admins_update_all_referrals"
  on referrals for update
  to authenticated
  using (is_mct_admin())
  with check (is_mct_admin());

drop policy if exists "admins_delete_all_referrals" on referrals;
create policy "admins_delete_all_referrals"
  on referrals for delete
  to authenticated
  using (is_mct_admin());

-- Column-level privacy ------------------------------------------------------
-- Row Level Security only ever decides WHICH ROWS a role can see — by
-- default Supabase grants full column access to `authenticated` on new
-- tables, which would let a partner read admin_notes (or write id/partner_id/
-- status/created_at) on their own row. Column grants close that: a partner's
-- REST/SDK call is restricted to exactly these columns, full stop, even if
-- they bypass the app entirely and call the API directly.
revoke all on referrals from authenticated;

grant select (
  id, partner_id, patient_full_name, patient_country, patient_phone, patient_email,
  treatment, notes, patient_consent, files, status, created_at, updated_at
) on referrals to authenticated;

grant insert (
  patient_full_name, patient_country, patient_phone, patient_email,
  treatment, notes, patient_consent, files
) on referrals to authenticated;

grant update (
  patient_full_name, patient_country, patient_phone, patient_email,
  treatment, notes, files
) on referrals to authenticated;

grant all on referrals to service_role;

-- Storage: private bucket for referral attachments ---------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'referral-files', 'referral-files', false, 10485760,
  array['image/jpeg', 'image/png', 'application/pdf']
)
on conflict (id) do update set
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types,
  public = excluded.public;

-- Objects are stored as `{partner_id}/{referral_id}/{filename}` so the first
-- path segment can be checked directly against the caller's own partner id.
drop policy if exists "partners_upload_own_referral_files" on storage.objects;
create policy "partners_upload_own_referral_files"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'referral-files'
    and (storage.foldername(name))[1] = current_partner_id()::text
  );

drop policy if exists "partners_read_own_referral_files" on storage.objects;
create policy "partners_read_own_referral_files"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'referral-files'
    and (storage.foldername(name))[1] = current_partner_id()::text
  );

drop policy if exists "partners_delete_own_referral_files" on storage.objects;
create policy "partners_delete_own_referral_files"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'referral-files'
    and (storage.foldername(name))[1] = current_partner_id()::text
  );

drop policy if exists "admins_read_all_referral_files" on storage.objects;
create policy "admins_read_all_referral_files"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'referral-files'
    and is_mct_admin()
  );
