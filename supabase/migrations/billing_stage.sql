-- ============================================================================
-- Phase 5O: hospital-billing stage (Sales Pipeline: Treatment Done ->
-- Invoice -> Earned), kept entirely separate from patient status and
-- never touched by the commission (partner) or revenue (MCT)
-- status-transition logic. Lives only on `leads`, invisible to the
-- partner portal (zero authenticated grants on that table).
-- APPLIED 2026-10-20 via Supabase SQL Editor (not run by Claude).
--
-- Per the approved plan, invoice_number/invoice_institution/
-- invoice_amount/invoice_currency are never collected in any form --
-- only invoiced_at/earned_at get stamped; amounts are always read live
-- from patient_revenues/commissions instead of a stored snapshot. The
-- unused invoice_* columns are kept for a possible future need but are
-- not referenced by any app code.
-- ============================================================================

begin;

alter table leads
  add column if not exists billing_stage text
    check (billing_stage is null or billing_stage in ('treatment_done', 'invoiced', 'earned')),
  add column if not exists invoice_number text,
  add column if not exists invoice_institution text,
  add column if not exists invoice_amount numeric(12,2),
  add column if not exists invoice_currency text
    check (invoice_currency is null or invoice_currency in ('EUR', 'USD', 'GBP', 'TRY')),
  add column if not exists invoiced_at date,
  add column if not exists earned_at date;

create index if not exists leads_billing_stage_idx on leads(billing_stage);

create table if not exists billing_stage_history (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references leads(id),
  old_stage text,
  new_stage text not null,
  changed_by text,
  changed_at timestamptz not null default now()
);

create index if not exists billing_stage_history_lead_id_idx on billing_stage_history(lead_id);

alter table billing_stage_history enable row level security;
revoke all on billing_stage_history from anon, authenticated;
grant all on billing_stage_history to service_role;

commit;

notify pgrst, 'reload schema';
