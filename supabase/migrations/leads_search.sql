-- Must run AFTER contact_clicks.sql (already applied) -- the backfill
-- below reads from that table.
begin;

-- Phase 5U: server-side, scalable search for the Patients list.
-- fold_search_text() maps the handful of Turkish letters that need
-- case/diacritic-insensitive search (ı/İ/I, ş, ğ, ü, ö, ç) to their
-- plain-ASCII equivalents. A small, explicit translate() table rather
-- than the unaccent extension -- unaccent's dictionary doesn't fold
-- Turkish's dotless ı correctly either way, so a custom mapping was
-- needed regardless, and doing the whole thing via translate() keeps
-- this genuinely IMMUTABLE (safe to use in a generated column/index)
-- with no extension dependency. lib/search-fold.ts's foldSearchText()
-- is the byte-for-byte JS twin of this -- keep them in sync.
create or replace function fold_search_text(input text)
returns text
language sql
immutable
as $$
  select lower(translate(
    coalesce(input, ''),
    'İIıŞşĞğÜüÖöÇç',
    'iiisSgGuUoOcC'
  ));
$$;

-- Denormalized onto `leads` the instant a WhatsApp/email reference code
-- is linked (app/api/admin/leads/manual/route.ts's "Add from WhatsApp"),
-- so the search index stays single-table instead of needing a
-- cross-table join at search time. Backfilled once below for patients
-- already linked before this migration.
alter table leads add column if not exists linked_reference_code text;

update leads l
set linked_reference_code = cc.reference_code
from contact_clicks cc
where cc.lead_id = l.id
  and l.linked_reference_code is null;

-- Recomputed automatically by Postgres on every insert/update to any of
-- the source columns -- no trigger, no application code keeps this in
-- sync.
alter table leads add column if not exists search_text text
  generated always as (
    fold_search_text(
      coalesce(name, '') || ' ' ||
      coalesce(email, '') || ' ' ||
      coalesce(phone, '') || ' ' ||
      coalesce(details->>'reference_code', '') || ' ' ||
      coalesce(linked_reference_code, '')
    )
  ) stored;

-- Trigram index -- keeps a `search_text ilike '%term%'` (a match
-- anywhere in the string, not just a prefix) fast as the patient count
-- grows, instead of a full sequential scan per search.
create extension if not exists pg_trgm;

create index if not exists leads_search_text_trgm_idx on leads using gin (search_text gin_trgm_ops);

commit;

notify pgrst, 'reload schema';
