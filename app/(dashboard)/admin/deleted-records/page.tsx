import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { ADMIN_EMAILS } from "@/lib/admin";

type DeletedRecord = {
  id: string;
  deleted_at: string;
  deleted_by: string;
  patient_name: string;
  owner_type: "mct" | "partner";
  partner_name: string | null;
  referral_status: string | null;
  commission_amount: number | null;
  commission_currency: string | null;
  commission_status: string | null;
  commission_payment_date: string | null;
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-gray-400">{label}</span>
      <span className="text-gray-800 font-medium text-right">{value}</span>
    </div>
  );
}

export default async function DeletedRecordsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !ADMIN_EMAILS.includes(user.email ?? "")) {
    redirect("/agency");
  }

  const adminSupabase = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data } = await adminSupabase
    .from("deleted_records_log")
    .select("*")
    .order("deleted_at", { ascending: false })
    .limit(200);

  const records = (data ?? []) as DeletedRecord[];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center gap-4 mb-2">
          <h1 className="text-2xl font-bold text-brand-dark">Deleted Records</h1>
        </div>
        <p className="text-sm text-gray-500 mt-1 mb-6">
          Read-only audit log — every patient (and, for partner patients, their referral/commission) deleted via /admin/leads or a partner application deletion.
        </p>

        <div className="flex gap-4 mb-6">
          <Link href="/admin/leads" className="text-sm text-gray-400 hover:text-brand transition-colors">
            ← Patients
          </Link>
        </div>

        {records.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-sm text-gray-400 text-center">
            No deletions recorded yet.
          </div>
        ) : (
          <div className="space-y-3">
            {records.map((r) => (
              <div key={r.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 text-sm space-y-2">
                <Row label="Deleted at" value={new Date(r.deleted_at).toLocaleString("en-GB")} />
                <Row label="Deleted by" value={r.deleted_by} />
                <Row label="Patient" value={r.patient_name} />
                <Row label="Owner" value={r.owner_type === "partner" ? r.partner_name || "Partner" : "MCT"} />
                {r.referral_status && <Row label="Referral status" value={r.referral_status} />}
                {r.commission_amount !== null && (
                  <Row
                    label="Commission"
                    value={`${r.commission_amount.toLocaleString()} ${r.commission_currency ?? ""} (${r.commission_status ?? "—"})`}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
