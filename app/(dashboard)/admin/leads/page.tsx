import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { ADMIN_EMAILS } from "@/lib/admin";
import { LeadsTable } from "@/components/admin/leads-table";

export type Lead = {
  id: string;
  created_at: string;
  source: string;
  name: string;
  email: string | null;
  phone: string | null;
  country: string | null;
  treatment: string | null;
  message: string | null;
  details: Record<string, unknown>;
  page_url: string | null;
  consent: boolean;
  status: "new" | "contacted" | "closed";
};

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ source?: string; treatment?: string; status?: string }>;
}) {
  const { source, treatment, status } = await searchParams;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !ADMIN_EMAILS.includes(user.email ?? "")) {
    redirect("/agency");
  }

  const adminSupabase = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  let query = adminSupabase.from("leads").select("*").order("created_at", { ascending: false });

  if (source) query = query.ilike("source", `%${source}%`);
  if (treatment) query = query.ilike("treatment", `%${treatment}%`);
  if (status && status !== "all") query = query.eq("status", status);

  const { data: leads } = await query;
  const list = (leads ?? []) as Lead[];

  const { data: allForCounts } = await adminSupabase.from("leads").select("status");
  const counts = {
    all: (allForCounts ?? []).length,
    new: (allForCounts ?? []).filter((l) => l.status === "new").length,
    contacted: (allForCounts ?? []).filter((l) => l.status === "contacted").length,
    closed: (allForCounts ?? []).filter((l) => l.status === "closed").length,
  };

  const activeStatus = status || "all";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center gap-4 mb-2">
          <div>
            <h1 className="text-2xl font-bold text-brand-dark">Leads</h1>
            <p className="text-sm text-gray-500 mt-1">Every enquiry submitted across the marketing site</p>
          </div>
          <span className="ml-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-brand text-white">
            {counts.all} total
          </span>
        </div>
        <div className="flex gap-4 mb-6">
          <Link href="/admin/partner-applications" className="text-sm text-gray-400 hover:text-brand transition-colors">
            ← Partner Applications
          </Link>
          <Link href="/admin/referrals" className="text-sm text-gray-400 hover:text-brand transition-colors">
            Referrals →
          </Link>
        </div>

        <div className="flex gap-2 mb-6 flex-wrap">
          {["all", "new", "contacted", "closed"].map((s) => (
            <Link
              key={s}
              href={s === "all" ? "/admin/leads" : `/admin/leads?status=${s}`}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                activeStatus === s ? "bg-brand text-white" : "bg-white text-gray-600 border border-gray-200 hover:border-brand hover:text-brand"
              }`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeStatus === s ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"}`}>
                {counts[s as keyof typeof counts]}
              </span>
            </Link>
          ))}
        </div>

        <form method="get" className="flex flex-wrap gap-3 mb-6 bg-white border border-gray-100 rounded-2xl p-4">
          {status && <input type="hidden" name="status" value={status} />}
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
          <button type="submit" className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 text-sm font-semibold hover:bg-gray-200 transition-colors">
            Apply
          </button>
          <Link href="/admin/leads" className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-400 hover:text-gray-600 transition-colors">
            Clear
          </Link>
        </form>

        <LeadsTable leads={list} />
      </div>
    </div>
  );
}
