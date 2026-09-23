import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { ADMIN_EMAILS } from "@/lib/admin";

type PartnerApplication = {
  id: string;
  created_at: string;
  full_name: string;
  email: string;
  phone: string;
  country: string;
  city: string | null;
  partner_type: string;
  company_name: string;
  monthly_patients: string;
  status: "pending" | "approved" | "rejected" | "needs_info";
};

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
  needs_info: "Needs Info",
};

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  needs_info: "bg-blue-100 text-blue-800",
};

export default async function PartnerApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status: filterStatus } = await searchParams;

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
    .from("partner_applications")
    .select("id, created_at, full_name, email, phone, country, city, partner_type, company_name, monthly_patients, status")
    .order("created_at", { ascending: false });

  if (filterStatus && filterStatus !== "all") {
    query = query.eq("status", filterStatus);
  }

  const { data: applications } = await query;
  const apps = (applications ?? []) as PartnerApplication[];

  // Counts for tabs
  const { data: allApps } = await adminSupabase
    .from("partner_applications")
    .select("status");

  const counts = {
    all: (allApps ?? []).length,
    pending: (allApps ?? []).filter((a) => a.status === "pending").length,
    approved: (allApps ?? []).filter((a) => a.status === "approved").length,
    rejected: (allApps ?? []).filter((a) => a.status === "rejected").length,
    needs_info: (allApps ?? []).filter((a) => a.status === "needs_info").length,
  };

  const tabs = [
    { key: "all", label: "All", count: counts.all },
    { key: "pending", label: "Pending", count: counts.pending },
    { key: "approved", label: "Approved", count: counts.approved },
    { key: "rejected", label: "Rejected", count: counts.rejected },
    { key: "needs_info", label: "Needs Info", count: counts.needs_info },
  ];

  const activeTab = filterStatus || "all";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-brand-dark">Partner Applications</h1>
            <p className="text-sm text-gray-500 mt-1">Review and manage MCT partner applications</p>
          </div>
          <span className="ml-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-brand text-white">
            {counts.all} total
          </span>
        </div>
        <div className="flex gap-4 mb-6">
          <Link href="/admin/referrals" className="text-sm text-gray-400 hover:text-brand transition-colors">
            Referrals →
          </Link>
          <Link href="/admin/leads" className="text-sm text-gray-400 hover:text-brand transition-colors">
            Leads →
          </Link>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {tabs.map((tab) => (
            <Link
              key={tab.key}
              href={tab.key === "all" ? "/admin/partner-applications" : `/admin/partner-applications?status=${tab.key}`}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                activeTab === tab.key
                  ? "bg-brand text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-brand hover:text-brand"
              }`}
            >
              {tab.label}
              <span
                className={`text-xs px-1.5 py-0.5 rounded-full ${
                  activeTab === tab.key ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
                }`}
              >
                {tab.count}
              </span>
            </Link>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {apps.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <svg className="mx-auto mb-3 text-gray-300" width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
              </svg>
              <p className="font-medium">No applications found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Name</th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Company</th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden lg:table-cell">Type</th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden md:table-cell">Country</th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden xl:table-cell">Email</th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden xl:table-cell">WhatsApp</th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden md:table-cell">Applied</th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {apps.map((app) => (
                    <tr
                      key={app.id}
                      className="hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <td className="px-5 py-4">
                        <Link href={`/admin/partner-applications/${app.id}`} className="block font-semibold text-brand-dark hover:text-brand transition-colors">
                          {app.full_name}
                        </Link>
                      </td>
                      <td className="px-5 py-4 text-gray-700">
                        <Link href={`/admin/partner-applications/${app.id}`} className="block hover:text-brand transition-colors">
                          {app.company_name}
                        </Link>
                      </td>
                      <td className="px-5 py-4 text-gray-500 hidden lg:table-cell">{app.partner_type}</td>
                      <td className="px-5 py-4 text-gray-500 hidden md:table-cell">
                        {app.country}{app.city ? `, ${app.city}` : ""}
                      </td>
                      <td className="px-5 py-4 text-gray-500 hidden xl:table-cell">{app.email}</td>
                      <td className="px-5 py-4 text-gray-500 hidden xl:table-cell">{app.phone}</td>
                      <td className="px-5 py-4 text-gray-500 hidden md:table-cell">
                        {new Date(app.created_at).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[app.status] ?? "bg-gray-100 text-gray-600"}`}
                        >
                          {STATUS_LABELS[app.status] ?? app.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
