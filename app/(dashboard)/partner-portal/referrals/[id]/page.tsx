import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ReferralForm } from "@/components/partner/referral-form";
import { REFERRAL_STATUS_LABELS, type Referral, type CommissionPartnerView } from "@/types";

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

export default async function ReferralDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ edit?: string }>;
}) {
  const { id } = await params;
  const { edit } = await searchParams;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/agency");
  }

  const { data: referral, error } = await supabase
    .from("referrals")
    .select(
      "id, partner_id, patient_full_name, patient_country, patient_phone, patient_email, treatment, notes, files, status, created_at, commissions(commission_amount, currency, status, payment_date)"
    )
    .eq("id", id)
    .single();

  if (error || !referral) {
    notFound();
  }

  const r = referral as unknown as Referral & { commissions: CommissionPartnerView[] };
  const commission = r.commissions?.[0];
  const isEditable = r.status === "new";

  if (edit === "1" && isEditable) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
            <Link href="/partner-portal/referrals" className="hover:text-brand transition-colors">
              My Referrals
            </Link>
            <span>/</span>
            <span className="text-gray-700 font-medium">Edit Referral</span>
          </div>

          <h1 className="text-2xl font-bold text-brand-dark mb-8">Edit Referral</h1>

          <ReferralForm
            mode="edit"
            referralId={r.id}
            partnerId={r.partner_id}
            initialData={{
              patient_full_name: r.patient_full_name,
              patient_country: r.patient_country,
              patient_phone: r.patient_phone,
              patient_email: r.patient_email ?? "",
              treatment: r.treatment,
              notes: r.notes ?? "",
            }}
            initialFiles={r.files ?? []}
          />
        </div>
      </div>
    );
  }

  const signedFiles = await Promise.all(
    (r.files ?? []).map(async (f) => {
      const { data } = await supabase.storage.from("referral-files").createSignedUrl(f.path, 300);
      return { ...f, url: data?.signedUrl ?? null };
    })
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
          <Link href="/partner-portal/referrals" className="hover:text-brand transition-colors">
            My Referrals
          </Link>
          <span>/</span>
          <span className="text-gray-700 font-medium">{r.patient_full_name}</span>
        </div>

        <div className="flex items-start justify-between flex-wrap gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-brand-dark">{r.patient_full_name}</h1>
            <p className="text-gray-500 text-sm mt-1">{r.treatment}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold ${STATUS_COLORS[r.status] ?? "bg-gray-100 text-gray-600"}`}>
              {REFERRAL_STATUS_LABELS[r.status] ?? r.status}
            </span>
            {isEditable && (
              <Link
                href={`/partner-portal/referrals/${r.id}?edit=1`}
                className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:border-brand hover:text-brand transition-colors"
              >
                Edit
              </Link>
            )}
          </div>
        </div>

        {!isEditable && (
          <div className="mb-6 px-4 py-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-sm">
            This referral is now read-only. Contact Medical Center Turkey if any details need to change.
          </div>
        )}

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
          <div className="mb-6">
            <div className="text-xs font-bold text-teal uppercase tracking-widest mb-4 pb-2 border-b border-gray-100">
              Patient Information
            </div>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label="Full Name" value={r.patient_full_name} />
              <Field label="Country" value={r.patient_country} />
              <Field label="Phone / WhatsApp" value={r.patient_phone} />
              <Field label="Email" value={r.patient_email} />
              <Field label="Treatment" value={r.treatment} />
              <Field
                label="Submitted"
                value={new Date(r.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
              />
            </dl>
          </div>

          <div className="mb-6">
            <div className="text-xs font-bold text-teal uppercase tracking-widest mb-4 pb-2 border-b border-gray-100">
              Notes
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

        {commission && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="text-xs font-bold text-teal uppercase tracking-widest mb-4 pb-2 border-b border-gray-100">
              Commission
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-brand-dark">
                  {commission.commission_amount.toLocaleString()} {commission.currency}
                </div>
                {commission.payment_date && (
                  <div className="text-xs text-gray-400 mt-1">
                    Paid on {new Date(commission.payment_date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                  </div>
                )}
              </div>
              <span
                className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold ${
                  commission.status === "paid" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {commission.status === "paid" ? "Paid" : "Pending"}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
