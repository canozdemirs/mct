import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { ADMIN_EMAILS } from "@/lib/admin";
import { TREATMENTS } from "@/lib/constants";
import {
  REFERRAL_STATUS_LABELS,
  REFERRAL_STATUSES,
  CURRENCIES,
  type ReferralWithPartner,
  type Commission,
} from "@/types";

const STATUS_COLORS: Record<string, string> = {
  new: "bg-yellow-100 text-yellow-800",
  contacted: "bg-blue-100 text-blue-800",
  consultation: "bg-purple-100 text-purple-800",
  treatment_planned: "bg-indigo-100 text-indigo-800",
  treatment_completed: "bg-green-100 text-green-800",
  cancelled_lost: "bg-red-100 text-red-800",
};

const COMMISSION_STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  paid: "bg-green-100 text-green-800",
  cancelled: "bg-gray-200 text-gray-600",
};

export default async function AdminReferralsPage({
  searchParams,
}: {
  searchParams: Promise<{
    status?: string;
    treatment?: string;
    country?: string;
    partner?: string;
    patient?: string;
    from?: string;
    to?: string;
    commission_status?: string;
    currency?: string;
    institution_type?: string;
  }>;
}) {
  const {
    status,
    treatment,
    country,
    partner,
    patient,
    from,
    to,
    commission_status,
    currency,
    institution_type,
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

  let query = adminSupabase
    .from("referrals")
    .select(
      "id, patient_full_name, patient_country, patient_phone, patient_email, treatment, status, created_at, partner:partners(company_name, full_name, email)"
    )
    .order("created_at", { ascending: false });

  if (status && status !== "all") query = query.eq("status", status);
  if (treatment && treatment !== "all") query = query.eq("treatment", treatment);
  if (country) query = query.ilike("patient_country", `%${country}%`);
  if (patient) query = query.ilike("patient_full_name", `%${patient}%`);
  if (from) query = query.gte("created_at", from);
  if (to) query = query.lte("created_at", `${to}T23:59:59`);

  const { data: referrals } = await query;
  let list = (referrals ?? []) as unknown as ReferralWithPartner[];

  if (partner) {
    const needle = partner.toLowerCase();
    list = list.filter((r) =>
      (r.partner?.company_name ?? "").toLowerCase().includes(needle) ||
      (r.partner?.full_name ?? "").toLowerCase().includes(needle)
    );
  }

  // All non-cancelled-only? No — we need cancelled ones too for the
  // commission_status=cancelled filter and for totals bookkeeping context,
  // but totals themselves only count pending/paid.
  const { data: allCommissions } = await adminSupabase
    .from("commissions")
    .select("referral_id, status, currency, commission_amount, institution_type");
  const commissions = (allCommissions ?? []) as Pick<Commission, "referral_id" | "status" | "currency" | "commission_amount" | "institution_type">[];
  const commissionByReferral = new Map(commissions.map((c) => [c.referral_id, c]));

  if (commission_status || currency || institution_type) {
    list = list.filter((r) => {
      const c = commissionByReferral.get(r.id);
      if (!c) return false;
      if (commission_status && commission_status !== "all" && c.status !== commission_status) return false;
      if (currency && currency !== "all" && c.currency !== currency) return false;
      if (institution_type && institution_type !== "all" && c.institution_type !== institution_type) return false;
      return true;
    });
  }

  // Totals — global, per currency, pending vs paid (never summed across currencies).
  const totals: Record<string, { pending: number; paid: number }> = {};
  for (const c of commissions) {
    if (c.status === "cancelled") continue;
    if (!totals[c.currency]) totals[c.currency] = { pending: 0, paid: 0 };
    totals[c.currency][c.status === "paid" ? "paid" : "pending"] += Number(c.commission_amount);
  }

  const { data: allForCounts } = await adminSupabase.from("referrals").select("status");
  const counts: Record<string, number> = { all: (allForCounts ?? []).length };
  for (const s of REFERRAL_STATUSES) {
    counts[s] = (allForCounts ?? []).filter((r) => r.status === s).length;
  }

  const activeStatus = status || "all";
  const activeCount = counts.new + counts.contacted + counts.consultation + counts.treatment_planned;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center gap-4 mb-2">
          <div>
            <h1 className="text-2xl font-bold text-brand-dark">Referrals</h1>
            <p className="text-sm text-gray-500 mt-1">Review and manage partner patient referrals</p>
          </div>
          <span className="ml-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-brand text-white">
            {counts.all} total
          </span>
        </div>
        <div className="flex gap-4">
          <Link href="/admin/partner-applications" className="text-sm text-gray-400 hover:text-brand transition-colors">
            ← Partner Applications
          </Link>
          <Link href="/admin/leads" className="text-sm text-gray-400 hover:text-brand transition-colors">
            Leads →
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 my-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <div className="text-xl font-bold text-brand-dark">{counts.all}</div>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-1">Total</div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <div className="text-xl font-bold text-brand-dark">{counts.new}</div>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-1">New</div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <div className="text-xl font-bold text-brand-dark">{activeCount}</div>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-1">Active</div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <div className="text-xl font-bold text-brand-dark">{counts.treatment_planned}</div>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-1">Treatment Planned</div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <div className="text-xl font-bold text-brand-dark">{counts.treatment_completed}</div>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-1">Completed</div>
          </div>
        </div>

        {/* Commission totals */}
        {Object.keys(totals).length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">
            <div className="text-xs font-bold text-teal uppercase tracking-widest mb-4">Commission Totals</div>
            <div className="flex flex-wrap gap-6">
              {Object.entries(totals).map(([cur, t]) => (
                <div key={cur} className="flex gap-6">
                  <div>
                    <div className="text-lg font-bold text-brand-dark">
                      {t.pending.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {cur}
                    </div>
                    <div className="text-xs text-gray-400">Pending</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-brand-dark">
                      {t.paid.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {cur}
                    </div>
                    <div className="text-xs text-gray-400">Paid</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-2 mb-6 flex-wrap">
          <Link
            href="/admin/referrals"
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
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
              href={`/admin/referrals?status=${s}`}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
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
          <input
            name="partner"
            defaultValue={partner}
            placeholder="Partner / Agency"
            className="bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-sm text-gray-700 w-40"
          />
          <input
            name="patient"
            defaultValue={patient}
            placeholder="Patient name"
            className="bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-sm text-gray-700 w-40"
          />
          <input
            name="country"
            defaultValue={country}
            placeholder="Country"
            className="bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-sm text-gray-700 w-32"
          />
          <select
            name="treatment"
            defaultValue={treatment || "all"}
            className="bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-sm text-gray-700"
          >
            <option value="all">All Treatments</option>
            {TREATMENTS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <select
            name="commission_status"
            defaultValue={commission_status || "all"}
            className="bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-sm text-gray-700"
          >
            <option value="all">All Commission Statuses</option>
            <option value="pending">Commission: Pending</option>
            <option value="paid">Commission: Paid</option>
            <option value="cancelled">Commission: Cancelled</option>
          </select>
          <select
            name="currency"
            defaultValue={currency || "all"}
            className="bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-sm text-gray-700"
          >
            <option value="all">All Currencies</option>
            {CURRENCIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <select
            name="institution_type"
            defaultValue={institution_type || "all"}
            className="bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-sm text-gray-700"
          >
            <option value="all">All Institution Types</option>
            <option value="mct_package">MCT Package</option>
            <option value="external_institution">External Institution</option>
          </select>
          <input type="date" name="from" defaultValue={from} className="bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-sm text-gray-700" />
          <input type="date" name="to" defaultValue={to} className="bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-sm text-gray-700" />
          <button type="submit" className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 text-sm font-semibold hover:bg-gray-200 transition-colors">
            Apply
          </button>
          <Link href="/admin/referrals" className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-400 hover:text-gray-600 transition-colors">
            Clear
          </Link>
        </form>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {list.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="font-medium">No referrals found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Patient</th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Partner</th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden lg:table-cell">Treatment</th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden md:table-cell">Country</th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden xl:table-cell">Contact</th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden md:table-cell">Date</th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Commission</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {list.map((r) => {
                    const c = commissionByReferral.get(r.id);
                    return (
                      <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-4">
                          <Link href={`/admin/referrals/${r.id}`} className="block font-semibold text-brand-dark hover:text-brand transition-colors">
                            {r.patient_full_name}
                          </Link>
                        </td>
                        <td className="px-5 py-4 text-gray-700">{r.partner?.company_name || r.partner?.full_name || "—"}</td>
                        <td className="px-5 py-4 text-gray-500 hidden lg:table-cell">{r.treatment}</td>
                        <td className="px-5 py-4 text-gray-500 hidden md:table-cell">{r.patient_country}</td>
                        <td className="px-5 py-4 text-gray-500 hidden xl:table-cell">
                          <div>{r.patient_phone}</div>
                          <div className="text-xs text-gray-400">{r.patient_email}</div>
                        </td>
                        <td className="px-5 py-4 text-gray-500 hidden md:table-cell">
                          {new Date(r.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                        </td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[r.status] ?? "bg-gray-100 text-gray-600"}`}>
                            {REFERRAL_STATUS_LABELS[r.status] ?? r.status}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          {c ? (
                            <div>
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${COMMISSION_STATUS_COLORS[c.status]}`}>
                                {c.commission_amount.toLocaleString()} {c.currency}
                              </span>
                            </div>
                          ) : (
                            <span className="text-gray-300">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
