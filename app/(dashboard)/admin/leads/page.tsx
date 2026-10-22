import { redirect } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { ADMIN_EMAILS } from "@/lib/admin";
import { COUNTRIES } from "@/lib/constants";
import { LeadsTable, type SortField } from "@/components/admin/leads-table";
import { AddManualLeadForm } from "@/components/admin/add-manual-lead-form";
import { SyncReferralsBanner } from "@/components/admin/sync-referrals-banner";
import { PatientsFilters } from "@/components/admin/patients-filters";
import { TREATMENT_OPTIONS } from "@/components/marketing/consultation-form";
import { foldSearchText } from "@/lib/search-fold";
import { computePatientChannel } from "@/lib/patient-channel";
import { REFERRAL_STATUSES, REFERRAL_STATUS_LABELS, type ReferralFile, type ReferralStatus } from "@/types";

export type Lead = {
  id: string;
  created_at: string;
  source: string;
  name: string;
  email: string | null;
  phone: string | null;
  country: string | null;
  treatment: string | null;
  hospital: string | null;
  message: string | null;
  internal_notes: string | null;
  details: Record<string, unknown>;
  page_url: string | null;
  consent: boolean;
  status: ReferralStatus;
  is_manual?: boolean;
  first_contacted_at?: string | null;
  owner_type: "mct" | "partner";
  partner_id: string | null;
  files: ReferralFile[];
  billing_stage?: string | null;
  invoiced_at?: string | null;
  earned_at?: string | null;
  confirmed_at?: string | null;
  landing_page?: string | null;
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  referrer_domain?: string | null;
  linked_reference_code?: string | null;
  channel?: string | null;
};

export type PartnerOption = { id: string; name: string };

const PAGE_SIZE = 50;

const SORTABLE_FIELDS: SortField[] = ["first_contacted_at", "name", "treatment", "status", "confirmed_at"];
const DEFAULT_DIR: Record<SortField, "asc" | "desc"> = {
  first_contacted_at: "desc",
  confirmed_at: "desc",
  name: "asc",
  treatment: "asc",
  status: "asc",
};

function registeredDateBounds(dateFrom?: string, dateTo?: string): { gte?: string; lte?: string } {
  return {
    gte: dateFrom ? `${dateFrom}T00:00:00.000Z` : undefined,
    lte: dateTo ? `${dateTo}T23:59:59.999Z` : undefined,
  };
}

type Filters = {
  treatment?: string;
  owner?: string;
  hospital?: string;
  source?: string;
  country?: string;
  channel?: string;
  dateFrom?: string;
  dateTo?: string;
  confirmedFrom?: string;
  confirmedTo?: string;
  q?: string;
};

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    treatment?: string;
    status?: string;
    owner?: string;
    hospital?: string;
    source?: string;
    country?: string;
    channel?: string;
    dateFrom?: string;
    dateTo?: string;
    confirmedFrom?: string;
    confirmedTo?: string;
    sort?: string;
    dir?: string;
    page?: string;
  }>;
}) {
  const {
    q, treatment, status, owner: ownerRaw, hospital, source, country, channel,
    dateFrom, dateTo, confirmedFrom, confirmedTo, sort, dir, page: pageRaw,
  } = await searchParams;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !ADMIN_EMAILS.includes(user.email ?? "")) {
    redirect("/agency");
  }

  const adminSupabase = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Single <select name="owner"> encodes three states as one value:
  // "all" | "mct" | "partner:<uuid>" -- avoids a second, dependent
  // dropdown and any client JS just to keep them in sync.
  let ownerType: "mct" | "partner" | undefined;
  let partnerId: string | undefined;
  if (ownerRaw === "mct") {
    ownerType = "mct";
  } else if (ownerRaw?.startsWith("partner:")) {
    ownerType = "partner";
    partnerId = ownerRaw.slice("partner:".length);
  }

  function withParams(extra: Record<string, string | undefined>) {
    const params = new URLSearchParams();
    const merged = {
      q, treatment, status, owner: ownerRaw, hospital, source, country, channel,
      dateFrom, dateTo, confirmedFrom, confirmedTo, sort, dir, page: pageRaw,
      ...extra,
    };
    for (const [k, v] of Object.entries(merged)) {
      if (v) params.set(k, v);
    }
    const qs = params.toString();
    return qs ? `/admin/leads?${qs}` : "/admin/leads";
  }

  const sortField: SortField = SORTABLE_FIELDS.includes(sort as SortField) ? (sort as SortField) : "first_contacted_at";
  const sortDir: "asc" | "desc" = dir === "asc" ? "asc" : "desc";
  const sortHrefs = Object.fromEntries(
    SORTABLE_FIELDS.map((field) => {
      const nextDir = sortField === field ? (sortDir === "asc" ? "desc" : "asc") : DEFAULT_DIR[field];
      // Changing sort resets back to page 1 -- a stale page number into a
      // differently-ordered result set would otherwise show nonsense.
      return [field, withParams({ sort: field, dir: nextDir, page: undefined })];
    })
  ) as Record<SortField, string>;

  const page = Math.max(1, parseInt(pageRaw || "1", 10) || 1);

  // search_text (supabase/migrations/leads_search.sql) may not exist yet
  // in every environment -- probed once, only when actually searching,
  // same non-blocking posture as the attributionAvailable probe below.
  let searchAvailable = true;
  if (q) {
    try {
      const { error } = await adminSupabase.from("leads").select("search_text").limit(1);
      searchAvailable = !error;
    } catch {
      searchAvailable = false;
    }
  }

  // channel (supabase/migrations/leads_channel.sql) -- same posture.
  // Probed unconditionally (not just when filtering) since the Channel
  // dropdown's option list needs it on every page load, not only when
  // a channel filter is active.
  let channelAvailable = true;
  try {
    const { error } = await adminSupabase.from("leads").select("channel").limit(1);
    channelAvailable = !error;
  } catch {
    channelAvailable = false;
  }

  const { gte: regGte, lte: regLte } = registeredDateBounds(dateFrom, dateTo);

  function applyCommonFilters<T>(q0: T, filters: Filters): T {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let q1 = q0 as any;
    if (filters.treatment) q1 = q1.eq("treatment", filters.treatment);
    if (ownerType) q1 = q1.eq("owner_type", ownerType);
    if (partnerId) q1 = q1.eq("partner_id", partnerId);
    if (filters.hospital) q1 = q1.ilike("hospital", `%${filters.hospital}%`);
    if (filters.source) q1 = q1.eq("source", filters.source);
    if (filters.country) q1 = q1.eq("country", filters.country);
    if (filters.channel && channelAvailable) q1 = q1.eq("channel", filters.channel);
    if (regGte) q1 = q1.gte("first_contacted_at", regGte);
    if (regLte) q1 = q1.lte("first_contacted_at", regLte);
    if (confirmedFrom) q1 = q1.gte("confirmed_at", confirmedFrom);
    if (confirmedTo) q1 = q1.lte("confirmed_at", confirmedTo);
    if (filters.q && searchAvailable) q1 = q1.ilike("search_text", `%${foldSearchText(filters.q)}%`);
    return q1 as T;
  }

  const filters: Filters = { treatment, hospital, source, country, channel, q };

  let mainQuery = applyCommonFilters(
    adminSupabase.from("leads").select("*", { count: "exact" }).order(sortField, { ascending: sortDir === "asc", nullsFirst: false }),
    filters
  );
  if (status && status !== "all") mainQuery = mainQuery.eq("status", status);
  mainQuery = mainQuery.range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);

  const { data: leadRows, count: filteredCount } = await mainQuery;
  const list = (leadRows ?? []) as Lead[];
  const totalPages = Math.max(1, Math.ceil((filteredCount ?? 0) / PAGE_SIZE));

  // Status tab counts -- respect every OTHER active filter (so "if I
  // also picked this status, how many would I see"), but never the
  // status filter itself. One skinny query (just the status column).
  const { data: statusRows } = await applyCommonFilters(adminSupabase.from("leads").select("status"), filters);
  const statusCounts: Record<string, number> = { all: (statusRows ?? []).length };
  for (const s of REFERRAL_STATUSES) {
    statusCounts[s] = (statusRows ?? []).filter((r) => r.status === s).length;
  }
  const activeStatus = status || "all";

  // Stable Source option list -- every distinct value ever stored,
  // regardless of the other active filters, so the dropdown doesn't
  // reshuffle as the admin filters.
  const { data: sourceRows } = await adminSupabase.from("leads").select("source");
  const sourceOptions = Array.from(new Set((sourceRows ?? []).map((r) => r.source).filter(Boolean))).sort((a, b) =>
    a.localeCompare(b)
  );

  // Stable Channel option list, same spirit as Source above. Reads the
  // generated column directly once migrated; falls back to computing it
  // in JS (lib/patient-channel.ts, kept byte-for-byte equivalent to the
  // SQL function) so the dropdown still works before that migration runs.
  let channelOptions: string[];
  if (channelAvailable) {
    const { data: channelRows } = await adminSupabase.from("leads").select("channel");
    channelOptions = Array.from(new Set((channelRows ?? []).map((r) => r.channel).filter(Boolean))) as string[];
  } else {
    const { data: channelSourceRows } = await adminSupabase.from("leads").select("owner_type, source, utm_source, referrer_domain");
    channelOptions = Array.from(new Set((channelSourceRows ?? []).map((l) => computePatientChannel(l as Lead))));
  }
  channelOptions.sort((a, b) => a.localeCompare(b));

  // Partners list, for the Owner filter dropdown and resolving each
  // partner-owned row's display name.
  const { data: partnerRows } = await adminSupabase
    .from("partners")
    .select("id, company_name, full_name")
    .eq("status", "active")
    .order("company_name");
  const partners: PartnerOption[] = (partnerRows ?? []).map((p) => ({
    id: p.id,
    name: p.company_name || p.full_name || "Unnamed partner",
  }));
  const partnerNameById = new Map(partners.map((p) => [p.id, p.name]));

  // Best-effort mirror-create (app/api/partner-portal/referrals/route.ts)
  // can fail silently -- this surfaces any referral it left unsynced so
  // no partner patient is ever quietly missing from this list.
  const { data: unsyncedReferrals } = await adminSupabase.from("referrals").select("id").is("lead_id", null);
  const unsyncedCount = unsyncedReferrals?.length ?? 0;

  // Probe only -- determines whether the "Add from WhatsApp (reference
  // code)" field in "Add new patient" is shown at all. contact_clicks
  // (supabase/migrations/contact_clicks.sql) may not exist yet in this
  // project; when it doesn't, PostgREST returns PGRST205 here and the
  // field is hidden client-side instead of failing the whole form.
  let attributionAvailable = false;
  try {
    const { error } = await adminSupabase.from("contact_clicks").select("reference_code").limit(1);
    attributionAvailable = !error;
  } catch {
    attributionAvailable = false;
  }

  const { count: totalCount } = await adminSupabase.from("leads").select("id", { count: "exact", head: true });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center gap-4 mb-2 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-brand-dark">Patients</h1>
            <p className="text-sm text-gray-500 mt-1">Every patient, direct or partner-referred, in one place</p>
          </div>
          <span className="ml-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-brand text-white">
            {totalCount ?? 0} total
          </span>
          <div className="ml-auto">
            <AddManualLeadForm attributionAvailable={attributionAvailable} />
          </div>
        </div>
        <SyncReferralsBanner count={unsyncedCount} />

        <div className="flex gap-2 mb-6 flex-wrap">
          <Link
            href={withParams({ status: undefined, page: undefined })}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-colors whitespace-nowrap ${
              activeStatus === "all" ? "bg-brand text-white" : "bg-white text-gray-600 border border-gray-200 hover:border-brand hover:text-brand"
            }`}
          >
            All
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeStatus === "all" ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"}`}>
              {statusCounts.all}
            </span>
          </Link>
          {REFERRAL_STATUSES.map((s) => (
            <Link
              key={s}
              href={withParams({ status: s, page: undefined })}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-colors whitespace-nowrap ${
                activeStatus === s ? "bg-brand text-white" : "bg-white text-gray-600 border border-gray-200 hover:border-brand hover:text-brand"
              }`}
            >
              {REFERRAL_STATUS_LABELS[s]}
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeStatus === s ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"}`}>
                {statusCounts[s]}
              </span>
            </Link>
          ))}
        </div>

        <Suspense fallback={<div className="h-[72px] mb-6 rounded-2xl bg-white border border-gray-100" />}>
          <PatientsFilters
            treatmentOptions={TREATMENT_OPTIONS}
            countryOptions={COUNTRIES}
            sourceOptions={sourceOptions}
            channelOptions={channelOptions}
            partners={partners}
            resultCount={filteredCount ?? 0}
          />
        </Suspense>

        <LeadsTable
          leads={list}
          partnerNameById={Object.fromEntries(partnerNameById)}
          sortHrefs={sortHrefs}
          activeSort={sortField}
          activeDir={sortDir}
        />

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-6">
            <Link
              href={withParams({ page: page > 1 ? String(page - 1) : undefined })}
              aria-disabled={page <= 1}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                page <= 1 ? "text-gray-300 cursor-not-allowed pointer-events-none" : "text-gray-600 bg-white border border-gray-200 hover:border-brand hover:text-brand"
              }`}
            >
              ← Previous
            </Link>
            <span className="text-sm text-gray-500">
              Page {page} of {totalPages}
            </span>
            <Link
              href={withParams({ page: page < totalPages ? String(page + 1) : undefined })}
              aria-disabled={page >= totalPages}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                page >= totalPages ? "text-gray-300 cursor-not-allowed pointer-events-none" : "text-gray-600 bg-white border border-gray-200 hover:border-brand hover:text-brand"
              }`}
            >
              Next →
            </Link>
          </div>
        )}

        <div className="text-center mt-6">
          <Link href="/admin/deleted-records" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
            Deleted records log
          </Link>
        </div>
      </div>
    </div>
  );
}
