import { redirect } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { ADMIN_EMAILS } from "@/lib/admin";
import { LeadsTable, type SortField } from "@/components/admin/leads-table";
import { AddManualLeadForm } from "@/components/admin/add-manual-lead-form";
import { SyncReferralsBanner } from "@/components/admin/sync-referrals-banner";
import { PatientsFilters } from "@/components/admin/patients-filters";
import { TREATMENT_OPTIONS } from "@/components/marketing/consultation-form";
import { computePatientChannel } from "@/lib/patient-channel";
import { foldSearchText } from "@/lib/search-fold";
import type { ReferralFile, ReferralStatus } from "@/types";

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
};

export type PartnerOption = { id: string; name: string };

const SORTABLE_FIELDS: SortField[] = ["first_contacted_at", "name", "treatment", "status", "confirmed_at"];
const DEFAULT_DIR: Record<SortField, "asc" | "desc"> = {
  first_contacted_at: "desc",
  confirmed_at: "desc",
  name: "asc",
  treatment: "asc",
  status: "asc",
};

function dateRangeBounds(range: string | undefined, dateFrom?: string, dateTo?: string): { gte?: string; lte?: string } {
  const now = new Date();
  if (range === "today") {
    return { gte: new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())).toISOString() };
  }
  if (range === "7d") {
    return { gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString() };
  }
  if (range === "30d") {
    return { gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString() };
  }
  if (range === "month") {
    return { gte: new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)).toISOString() };
  }
  if (range === "custom") {
    return {
      gte: dateFrom ? `${dateFrom}T00:00:00.000Z` : undefined,
      lte: dateTo ? `${dateTo}T23:59:59.999Z` : undefined,
    };
  }
  return {};
}

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    treatment?: string;
    status?: string;
    owner?: string;
    channel?: string;
    dateRange?: string;
    dateFrom?: string;
    dateTo?: string;
    sort?: string;
    dir?: string;
  }>;
}) {
  const { q, treatment, status, owner: ownerRaw, channel, dateRange, dateFrom, dateTo, sort, dir } = await searchParams;

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
    const merged = { q, treatment, status, owner: ownerRaw, channel, dateRange, dateFrom, dateTo, sort, dir, ...extra };
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
      return [field, withParams({ sort: field, dir: nextDir })];
    })
  ) as Record<SortField, string>;

  let query = adminSupabase
    .from("leads")
    .select("*")
    .order(sortField, { ascending: sortDir === "asc", nullsFirst: false });
  if (treatment) query = query.eq("treatment", treatment);
  if (status && status !== "all") query = query.eq("status", status);
  if (ownerType) query = query.eq("owner_type", ownerType);
  if (partnerId) query = query.eq("partner_id", partnerId);

  const { gte, lte } = dateRangeBounds(dateRange, dateFrom, dateTo);
  if (gte) query = query.gte("first_contacted_at", gte);
  if (lte) query = query.lte("first_contacted_at", lte);

  const { data: leadRows } = await query;
  let list = (leadRows ?? []) as Lead[];

  // Reference codes live in two different places depending on how the
  // patient was added: leads.details.reference_code (form channel, set
  // at insert time) or contact_clicks.reference_code (WhatsApp/email,
  // linked via the "Add from WhatsApp" lookup) -- merged here so the
  // search box can match either without the admin needing to know which.
  // contact_clicks may not exist yet in every environment (same
  // PGRST205-tolerant pattern used elsewhere for this table).
  const refCodeByLeadId = new Map<string, string>();
  try {
    const { data: clickRows } = await adminSupabase
      .from("contact_clicks")
      .select("lead_id, reference_code")
      .not("lead_id", "is", null);
    for (const row of clickRows ?? []) {
      if (row.lead_id) refCodeByLeadId.set(row.lead_id as string, row.reference_code as string);
    }
  } catch {
    // Table not deployed in this environment -- ref-code search just
    // falls back to whatever's in leads.details for form-channel leads.
  }

  function searchBlobFor(lead: Lead): string {
    const formRefCode = typeof lead.details?.reference_code === "string" ? lead.details.reference_code : null;
    const parts = [lead.name, lead.email, lead.phone, formRefCode, refCodeByLeadId.get(lead.id)].filter(
      (v): v is string => typeof v === "string" && v.length > 0
    );
    return foldSearchText(parts.join(" "));
  }

  // Channel and the search term both depend on values that aren't plain
  // indexed columns (channel is computed; search needs Turkish-aware
  // folding Postgres collation doesn't do) -- applied here in JS, after
  // the DB-level filters/sort above. Array#filter preserves order, so
  // the .order() above still holds for whatever survives this.
  if (channel) {
    list = list.filter((l) => computePatientChannel(l) === channel);
  }
  if (q) {
    const foldedQ = foldSearchText(q);
    list = list.filter((l) => searchBlobFor(l).includes(foldedQ));
  }

  // Stable channel option list -- computed from ALL patients regardless
  // of the other active filters, so the dropdown doesn't reshuffle as
  // the admin filters. Lightweight columns only.
  const { data: channelSourceRows } = await adminSupabase
    .from("leads")
    .select("owner_type, source, utm_source, referrer_domain");
  const channelOptions = Array.from(
    new Set((channelSourceRows ?? []).map((l) => computePatientChannel(l as Lead)))
  ).sort((a, b) => a.localeCompare(b));

  // True, filter-independent total for the header badge -- the filter
  // bar's own count reflects the current (possibly filtered) view.
  const { count: totalCount } = await adminSupabase.from("leads").select("id", { count: "exact", head: true });

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

        <Suspense fallback={<div className="h-[72px] mb-6 rounded-2xl bg-white border border-gray-100" />}>
          <PatientsFilters
            treatmentOptions={TREATMENT_OPTIONS}
            partners={partners}
            channelOptions={channelOptions}
            resultCount={list.length}
          />
        </Suspense>

        <LeadsTable
          leads={list}
          partnerNameById={Object.fromEntries(partnerNameById)}
          sortHrefs={sortHrefs}
          activeSort={sortField}
          activeDir={sortDir}
        />

        <div className="text-center mt-6">
          <Link href="/admin/deleted-records" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
            Deleted records log
          </Link>
        </div>
      </div>
    </div>
  );
}
