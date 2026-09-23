-- ============================================================================
-- Phase 5: Commission System
-- Run this once in Supabase Dashboard -> SQL Editor, AFTER referrals.sql.
-- ============================================================================

-- Commissions table -----------------------------------------------------
-- One row per "Treatment Completed" episode. A referral can accumulate more
-- than one row over time (e.g. completed -> reverted -> completed again),
-- but the partial unique index below guarantees at most one non-cancelled
-- (i.e. "active") commission per referral at any given moment — cancelled
-- rows are kept for history, never deleted.
create table if not exists commissions (
  id uuid primary key default gen_random_uuid(),
  referral_id uuid not null references referrals(id),

  institution_type text not null check (institution_type in ('mct_package', 'external_institution')),
  institution_name text,
  net_amount numeric(12,2) not null check (net_amount > 0),
  currency text not null check (currency in ('EUR', 'USD', 'GBP', 'TRY')),
  commission_percentage numeric(5,2) not null check (commission_percentage > 0),
  commission_amount numeric(12,2) not null check (commission_amount >= 0),

  status text not null default 'pending' check (status in ('pending', 'paid', 'cancelled')),
  payment_date date,
  cancelled_reason text,

  reconciliation_status text not null default 'none' check (
    reconciliation_status in ('none', 'needs_reconciliation', 'resolved')
  ),
  resolved_by text,
  resolved_at timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint institution_name_required_when_external
    check (institution_type = 'mct_package' or institution_name is not null)
);

create index if not exists commissions_referral_id_idx on commissions(referral_id);
create index if not exists commissions_status_idx on commissions(status);
create index if not exists commissions_currency_idx on commissions(currency);

-- At most one active (non-cancelled) commission per referral.
create unique index if not exists commissions_one_active_per_referral
  on commissions(referral_id)
  where status <> 'cancelled';

drop trigger if exists commissions_set_updated_at on commissions;
create trigger commissions_set_updated_at
  before update on commissions
  for each row
  execute function set_updated_at();

-- Referral status audit trail --------------------------------------------
-- Every status change (admin-driven) gets logged here going forward. Purely
-- an internal record — never exposed to partners.
create table if not exists referral_status_history (
  id uuid primary key default gen_random_uuid(),
  referral_id uuid not null references referrals(id),
  old_status text,
  new_status text not null,
  changed_by text,
  changed_at timestamptz not null default now()
);

create index if not exists referral_status_history_referral_id_idx on referral_status_history(referral_id);

alter table referral_status_history enable row level security;
revoke all on referral_status_history from authenticated;
grant all on referral_status_history to service_role;
-- No policies for `authenticated` at all — same "zero policies = fully
-- blocked" pattern as partner_applications. Only admin server code (service
-- role) ever touches this table.

-- RLS on commissions ------------------------------------------------------
alter table commissions enable row level security;

-- Partners may see their own referrals' commissions, but never a cancelled
-- one (per spec: a cancelled commission should look like "no commission" to
-- the partner, not a visible cancelled state).
drop policy if exists "partners_select_own_active_commissions" on commissions;
create policy "partners_select_own_active_commissions"
  on commissions for select
  to authenticated
  using (
    status <> 'cancelled'
    and exists (
      select 1 from referrals r
      where r.id = commissions.referral_id
        and r.partner_id = current_partner_id()
    )
  );

drop policy if exists "admins_select_all_commissions" on commissions;
create policy "admins_select_all_commissions"
  on commissions for select
  to authenticated
  using (is_mct_admin());

drop policy if exists "admins_insert_all_commissions" on commissions;
create policy "admins_insert_all_commissions"
  on commissions for insert
  to authenticated
  with check (is_mct_admin());

drop policy if exists "admins_update_all_commissions" on commissions;
create policy "admins_update_all_commissions"
  on commissions for update
  to authenticated
  using (is_mct_admin())
  with check (is_mct_admin());

drop policy if exists "admins_delete_all_commissions" on commissions;
create policy "admins_delete_all_commissions"
  on commissions for delete
  to authenticated
  using (is_mct_admin());

-- Column-level privacy ------------------------------------------------------
-- Partners get the final amount and payment status only — never the net
-- amount, institution, or percentage used to calculate it.
revoke all on commissions from authenticated;

grant select (
  id, referral_id, commission_amount, currency, status, payment_date
) on commissions to authenticated;

grant all on commissions to service_role;
-- Partners have no insert/update/delete grant at all — writes are
-- admin/service-role only, matching the spec's "cannot write/modify
-- commissions at all".
