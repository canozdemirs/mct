import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { TREATMENTS } from "@/lib/constants";
import { REFERRAL_STATUS_LABELS, REFERRAL_STATUSES, type Referral, type CommissionPartnerView } from "@/types";

const STATUS_COLORS: Record<string, string> = {
  new: "bg-yellow-100 text-yellow-800",
  contacted: "bg-blue-100 text-blue-800",
  consultation: "bg-purple-100 text-purple-800",
  treatment_planned: "bg-indigo-100 text-indigo-800",
  treatment_completed: "bg-green-100 text-green-800",
  cancelled_lost: "bg-red-100 text-red-800",
};

export default async function MyReferralsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; treatment?: string; from?: string; to?: string }>;
}) {
  const { status, treatment, from, to } = await searchParams;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/agency");
  }

  let query = supabase
    .from("referrals")
    .select(
      "id, patient_full_name, patient_country, treatment, status, created_at, commissions(commission_amount, currency, status, payment_date)"
    )
    .order("created_at", { ascending: false });

  if (status && status !== "all") query = query.eq("status", status);
  if (treatment && treatment !== "all") query = query.eq("treatment", treatment);
  if (from) query = query.gte("created_at", from);
  if (to) query = query.lte("created_at", `${to}T23:59:59`);

  const { data: referrals } = await query;
  const list = (referrals ?? []) as unknown as (Pick<
    Referral,
    "id" | "patient_full_name" | "patient_country" | "treatment" | "status" | "created_at"
  > & { commissions: CommissionPartnerView[] })[];

  const { data: allForCounts } = await supabase.from("referrals").select("status");
  const counts: Record<string, number> = { all: (allForCounts ?? []).length };
  for (const s of REFERRAL_STATUSES) {
    counts[s] = (allForCounts ?? []).filter((r) => r.status === s).length;
  }

  const activeStatus = status || "all";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
          <Link href="/partner-portal" className="hover:text-brand transition-colors">
            Partner Portal
          </Link>
          <span>/</span>
          <span className="text-gray-700 font-medium">My Referrals</span>
        </div>

        <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-brand-dark">My Referrals</h1>
            <p className="text-sm text-gray-500 mt-1">Track the patients you&apos;ve referred to Medical Center Turkey</p>
          </div>
          <Link
            href="/partner-portal/referrals/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand text-white text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Refer a Patient
          </Link>
        </div>

        {/* Status tabs */}
        <div className="flex gap-2 mb-4 flex-wrap">
          <Link
            href="/partner-portal/referrals"
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
              href={`/partner-portal/referrals?status=${s}`}
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

        {/* Treatment + date filters */}
        <form method="get" className="flex flex-wrap gap-3 mb-6 bg-white border border-gray-100 rounded-2xl p-4">
          {status && <input type="hidden" name="status" value={status} />}
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
          <input
            type="date"
            name="from"
            defaultValue={from}
            className="bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-sm text-gray-700"
          />
          <input
            type="date"
            name="to"
            defaultValue={to}
            className="bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-sm text-gray-700"
          />
          <button type="submit" className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 text-sm font-semibold hover:bg-gray-200 transition-colors">
            Apply
          </button>
          <Link href="/partner-portal/referrals" className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-400 hover:text-gray-600 transition-colors">
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
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Treatment</th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden md:table-cell">Country</th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden md:table-cell">Date</th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Commission</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {list.map((r) => {
                    const commission = r.commissions?.[0];
                    return (
                      <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-4">
                          <Link href={`/partner-portal/referrals/${r.id}`} className="block font-semibold text-brand-dark hover:text-brand transition-colors">
                            {r.patient_full_name}
                          </Link>
                        </td>
                        <td className="px-5 py-4 text-gray-700">{r.treatment}</td>
                        <td className="px-5 py-4 text-gray-500 hidden md:table-cell">{r.patient_country}</td>
                        <td className="px-5 py-4 text-gray-500 hidden md:table-cell">
                          {new Date(r.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                        </td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[r.status] ?? "bg-gray-100 text-gray-600"}`}>
                            {REFERRAL_STATUS_LABELS[r.status] ?? r.status}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          {commission ? (
                            <span
                              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                                commission.status === "paid" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {commission.commission_amount.toLocaleString()} {commission.currency}
                            </span>
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
