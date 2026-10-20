import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { ADMIN_EMAILS } from "@/lib/admin";
import { LeadsTable } from "@/components/admin/leads-table";
import { AddManualLeadForm } from "@/components/admin/add-manual-lead-form";
import { SyncReferralsBanner } from "@/components/admin/sync-referrals-banner";
import { REFERRAL_STATUSES, REFERRAL_STATUS_LABELS, type ReferralStatus, type ReferralFile } from "@/types";

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
};

export type PartnerOption = { id: string; name: string };

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ source?: string; treatment?: string; hospital?: string; status?: string; owner?: string }>;
}) {
  const { source, treatment, hospital, status, owner: ownerRaw } = await searchParams;

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
    const merged = { source, treatment, hospital, status, owner: ownerRaw, ...extra };
    for (const [k, v] of Object.entries(merged)) {
      if (v) params.set(k, v);
    }
    const qs = params.toString();
    return qs ? `/admin/leads?${qs}` : "/admin/leads";
  }

  let query = adminSupabase.from("leads").select("*").order("created_at", { ascending: false });
  if (source) query = query.ilike("source", `%${source}%`);
  if (treatment) query = query.ilike("treatment", `%${treatment}%`);
  if (hospital) query = query.ilike("hospital", `%${hospital}%`);
  if (status && status !== "all") query = query.eq("status", status);
  if (ownerType) query = query.eq("owner_type", ownerType);
  if (partnerId) query = query.eq("partner_id", partnerId);

  const { data: leads } = await query;
  const list = (leads ?? []) as Lead[];

  let countsQuery = adminSupabase.from("leads").select("status");
  if (source) countsQuery = countsQuery.ilike("source", `%${source}%`);
  if (treatment) countsQuery = countsQuery.ilike("treatment", `%${treatment}%`);
  if (hospital) countsQuery = countsQuery.ilike("hospital", `%${hospital}%`);
  if (ownerType) countsQuery = countsQuery.eq("owner_type", ownerType);
  if (partnerId) countsQuery = countsQuery.eq("partner_id", partnerId);
  const { data: allForCounts } = await countsQuery;
  const counts: Record<string, number> = { all: (allForCounts ?? []).length };
  for (const s of REFERRAL_STATUSES) {
    counts[s] = (allForCounts ?? []).filter((l) => l.status === s).length;
  }

  const activeStatus = status || "all";

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

  // Probe only -- determines whether the "Reference code" field in "Add
  // new patient" is shown at all. lead_attributions is a dormant table
  // (see app/api/admin/leads/route.ts) that may not exist yet in this
  // project; when it doesn't, PostgREST returns PGRST205 here and the
  // field is hidden client-side instead of failing the whole form.
  let attributionAvailable = false;
  try {
    const { error } = await adminSupabase.from("lead_attributions").select("reference_code").limit(1);
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
            {counts.all} total
          </span>
          <div className="ml-auto">
            <AddManualLeadForm attributionAvailable={attributionAvailable} />
          </div>
        </div>
        <SyncReferralsBanner count={unsyncedCount} />

        <div className="flex gap-2 mb-6 flex-wrap">
          <Link
            href={withParams({ status: undefined })}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-colors whitespace-nowrap ${
              activeStatus === "all" ? "bg-brand text-white" : "bg-white text-gray-600 border border-gray-200 hover:border-brand hover:text-brand"
            }`}
          >
            All
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeStatus === "all" ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"}`}>
              {counts.all}
            </span>
          </Link>
          {REFERRAL_STATUSES.map((s) => (
            <Link
              key={s}
              href={withParams({ status: s })}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-colors whitespace-nowrap ${
                activeStatus === s ? "bg-brand text-white" : "bg-white text-gray-600 border border-gray-200 hover:border-brand hover:text-brand"
              }`}
            >
              {REFERRAL_STATUS_LABELS[s]}
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeStatus === s ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"}`}>
                {counts[s]}
              </span>
            </Link>
          ))}
        </div>

        <form method="get" className="flex flex-wrap gap-3 mb-6 bg-white border border-gray-100 rounded-2xl p-4">
          {status && <input type="hidden" name="status" value={status} />}
          <select
            name="owner"
            defaultValue={ownerRaw || "all"}
            className="bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-sm text-gray-700"
          >
            <option value="all">All owners</option>
            <option value="mct">MCT (direct)</option>
            {partners.map((p) => (
              <option key={p.id} value={`partner:${p.id}`}>
                {p.name}
              </option>
            ))}
          </select>
          <input
            name="source"
            defaultValue={source}
            placeholder="Source"
            className="bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-sm text-gray-700 w-40"
          />
          <input
            name="treatment"
            defaultValue={treatment}
            placeholder="Treatment"
            className="bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-sm text-gray-700 w-40"
          />
          <input
            name="hospital"
            defaultValue={hospital}
            placeholder="Hospital"
            className="bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-sm text-gray-700 w-40"
          />
          <button type="submit" className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 text-sm font-semibold hover:bg-gray-200 transition-colors">
            Apply
          </button>
          <Link href="/admin/leads" className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-400 hover:text-gray-600 transition-colors">
            Clear
          </Link>
        </form>

        <LeadsTable leads={list} partnerNameById={Object.fromEntries(partnerNameById)} />

        <div className="text-center mt-6">
          <Link href="/admin/deleted-records" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
            Deleted records log
          </Link>
        </div>
      </div>
    </div>
  );
}
