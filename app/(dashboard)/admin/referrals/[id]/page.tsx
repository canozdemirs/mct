import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { ADMIN_EMAILS } from "@/lib/admin";
import { ReferralStatusActions } from "@/components/admin/referral-status-actions";
import { CommissionPanel } from "@/components/admin/commission-panel";
import { REFERRAL_STATUS_LABELS, type ReferralWithPartner, type Commission } from "@/types";

const STATUS_COLORS: Record<string, string> = {
  new: "bg-yellow-100 text-yellow-800",
  contacted: "bg-blue-100 text-blue-800",
  consultation: "bg-purple-100 text-purple-800",
  treatment_planned: "bg-indigo-100 text-indigo-800",
  treatment_completed: "bg-green-100 text-green-800",
  cancelled_lost: "bg-red-100 text-red-800",
};

function Field({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div>
      <dt className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{label}</dt>
      <dd className="text-sm text-gray-800 font-medium">{value || "—"}</dd>
    </div>
  );
}

export default async function AdminReferralDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !ADMIN_EMAILS.includes(user.email ?? "")) {
    redirect("/agency");
  }

  const adminSupabase = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: referral, error } = await adminSupabase
    .from("referrals")
    .select("*, partner:partners(company_name, full_name, email, partner_type)")
    .eq("id", id)
    .single();

  if (error || !referral) {
    notFound();
  }

  const r = referral as ReferralWithPartner & { partner: (ReferralWithPartner["partner"] & { partner_type: string | null }) | null };

  const signedFiles = await Promise.all(
    (r.files ?? []).map(async (f) => {
      const { data } = await adminSupabase.storage.from("referral-files").createSignedUrl(f.path, 300);
      return { ...f, url: data?.signedUrl ?? null };
    })
  );

  const { data: activeCommission } = await adminSupabase
    .from("commissions")
    .select("*")
    .eq("referral_id", id)
    .neq("status", "cancelled")
    .maybeSingle();

  const commission = activeCommission as Commission | null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
          <Link href="/admin/referrals" className="hover:text-brand transition-colors">
            Referrals
          </Link>
          <span>/</span>
          <span className="text-gray-700 font-medium">{r.patient_full_name}</span>
        </div>

        <div className="flex items-start justify-between flex-wrap gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-brand-dark">{r.patient_full_name}</h1>
            <p className="text-gray-500 text-sm mt-1">{r.treatment}</p>
          </div>
          <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold ${STATUS_COLORS[r.status] ?? "bg-gray-100 text-gray-600"}`}>
            {REFERRAL_STATUS_LABELS[r.status] ?? r.status}
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
          <div className="mb-6">
            <div className="text-xs font-bold text-teal uppercase tracking-widest mb-4 pb-2 border-b border-gray-100">
              Partner
            </div>
            <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <Field label="Company / Agency" value={r.partner?.company_name} />
              <Field label="Contact Name" value={r.partner?.full_name} />
              <Field label="Partner Email" value={r.partner?.email} />
              <Field label="Partner Type" value={r.partner?.partner_type} />
            </dl>
          </div>

          <div className="mb-6">
            <div className="text-xs font-bold text-teal uppercase tracking-widest mb-4 pb-2 border-b border-gray-100">
              Patient Information
            </div>
            <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <Field label="Full Name" value={r.patient_full_name} />
              <Field label="Country" value={r.patient_country} />
              <Field label="Phone / WhatsApp" value={r.patient_phone} />
              <Field label="Email" value={r.patient_email} />
              <Field label="Treatment" value={r.treatment} />
              <Field
                label="Submitted"
                value={new Date(r.created_at).toLocaleString("en-GB", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
              />
            </dl>
          </div>

          <div className="mb-6">
            <div className="text-xs font-bold text-teal uppercase tracking-widest mb-4 pb-2 border-b border-gray-100">
              Partner Notes
            </div>
            <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-line">{r.notes || "—"}</p>
          </div>

          <div>
            <div className="text-xs font-bold text-teal uppercase tracking-widest mb-4 pb-2 border-b border-gray-100">
              Files
            </div>
            {signedFiles.length === 0 ? (
              <p className="text-sm text-gray-400">No files uploaded.</p>
            ) : (
              <ul className="space-y-2">
                {signedFiles.map((f) => (
                  <li key={f.path} className="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm">
                    <span className="text-gray-700 truncate">{f.name}</span>
                    {f.url ? (
                      <a href={f.url} target="_blank" rel="noopener noreferrer" className="text-brand font-semibold hover:underline ml-3 shrink-0">
                        View
                      </a>
                    ) : (
                      <span className="text-gray-300 ml-3 shrink-0">Unavailable</span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <ReferralStatusActions
          referralId={r.id}
          currentStatus={r.status}
          currentAdminNotes={r.admin_notes}
          hasActiveCommission={!!commission}
        />

        {commission && <CommissionPanel commission={commission} />}
      </div>
    </div>
  );
}
