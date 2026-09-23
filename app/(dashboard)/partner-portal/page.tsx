import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { SignOutButton } from "@/components/partner/sign-out-button";
import type { CommissionPartnerView } from "@/types";

type Partner = {
  id: string;
  company_name: string | null;
  partner_type: string | null;
  full_name: string | null;
  email: string | null;
  status: string;
};

export default async function PartnerPortalPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/agency");
  }

  const adminSupabase = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: partner } = await adminSupabase
    .from("partners")
    .select("id, company_name, partner_type, full_name, email, status")
    .eq("auth_user_id", user.id)
    .single();

  if (!partner || partner.status !== "active") {
    redirect("/agency");
  }

  const p = partner as Partner;

  // RLS-scoped (not service role) — this only ever returns this partner's own rows.
  const { data: referralStatuses } = await supabase.from("referrals").select("status");
  const referrals = referralStatuses ?? [];
  const totalReferrals = referrals.length;
  const completedTreatments = referrals.filter((r) => r.status === "treatment_completed").length;
  const activeReferrals = referrals.filter(
    (r) => r.status !== "treatment_completed" && r.status !== "cancelled_lost"
  ).length;

  const { data: commissionRows } = await supabase
    .from("commissions")
    .select("commission_amount, currency, status");
  const commissions = (commissionRows ?? []) as Pick<CommissionPartnerView, "commission_amount" | "currency" | "status">[];

  const commissionTotals: Record<string, { pending: number; paid: number }> = {};
  for (const c of commissions) {
    if (!commissionTotals[c.currency]) commissionTotals[c.currency] = { pending: 0, paid: 0 };
    commissionTotals[c.currency][c.status === "paid" ? "paid" : "pending"] += Number(c.commission_amount);
  }
  const currencies = Object.keys(commissionTotals);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <Image src="/mct_logo.png" alt="Medical Center Turkey" width={140} height={38} priority />
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500 hidden sm:inline">
              {p.email}
            </span>
            <SignOutButton />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome */}
        <div className="mb-8">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-3xl font-bold text-brand-dark">
              Welcome, {p.company_name || p.full_name}
            </h1>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
              Active Partner
            </span>
          </div>
          {p.partner_type && (
            <p className="text-gray-500 text-sm mt-1">{p.partner_type}</p>
          )}
        </div>

        {/* Referral stats */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="text-2xl font-bold text-brand-dark">{totalReferrals}</div>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-1">Total Referrals</div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="text-2xl font-bold text-brand-dark">{activeReferrals}</div>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-1">Active Referrals</div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="text-2xl font-bold text-brand-dark">{completedTreatments}</div>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-1">Completed Treatments</div>
          </div>
        </div>

        {/* Commission summary */}
        {currencies.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-10">
            <div className="text-xs font-bold text-teal uppercase tracking-widest mb-3">Commission</div>
            <div className="flex flex-wrap gap-x-8 gap-y-3">
              <div>
                <div className="text-lg font-bold text-brand-dark">
                  {currencies
                    .filter((cur) => commissionTotals[cur].pending > 0)
                    .map((cur) => `${commissionTotals[cur].pending.toLocaleString()} ${cur}`)
                    .join(" · ") || "—"}
                </div>
                <div className="text-xs text-gray-400 mt-0.5">Pending Commission</div>
              </div>
              <div>
                <div className="text-lg font-bold text-brand-dark">
                  {currencies
                    .filter((cur) => commissionTotals[cur].paid > 0)
                    .map((cur) => `${commissionTotals[cur].paid.toLocaleString()} ${cur}`)
                    .join(" · ") || "—"}
                </div>
                <div className="text-xs text-gray-400 mt-0.5">Paid Commission</div>
              </div>
            </div>
          </div>
        )}

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* Refer a Patient */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
              style={{ background: "linear-gradient(135deg, #0d2d52, #1b5fa8)" }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
              </svg>
            </div>
            <h3 className="text-base font-bold text-brand-dark mb-2">Refer a Patient</h3>
            <p className="text-sm text-gray-500 flex-1 leading-relaxed mb-5">
              Submit your patient&apos;s details directly through the portal. Our team will take care of everything from consultation to aftercare.
            </p>
            <Link
              href="/partner-portal/referrals/new"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-brand text-white text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              Refer a Patient
            </Link>
          </div>

          {/* Your Referrals */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
              style={{ background: "linear-gradient(135deg, #0a7a8f, #1ab3c8)" }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
              </svg>
            </div>
            <h3 className="text-base font-bold text-brand-dark mb-2">Your Referrals</h3>
            <p className="text-sm text-gray-500 flex-1 leading-relaxed mb-5">
              Track the patients you&apos;ve referred to Medical Center Turkey and see their current status.
            </p>
            <Link
              href="/partner-portal/referrals"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border border-brand text-brand text-sm font-semibold hover:bg-brand hover:text-white transition-colors"
            >
              View My Referrals
            </Link>
          </div>

          {/* Partner Support */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
              style={{ background: "linear-gradient(135deg, #1b5fa8, #1ab3c8)" }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z" />
              </svg>
            </div>
            <h3 className="text-base font-bold text-brand-dark mb-2">Partner Support</h3>
            <p className="text-sm text-gray-500 flex-1 leading-relaxed mb-5">
              Your dedicated partner manager is here to help. Reach out anytime for questions, patient updates, or partnership inquiries.
            </p>
            <div className="space-y-2 mb-5">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-brand">
                  <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
                hello@medicalcenterturkey.com
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-brand">
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                </svg>
                +90 850 888 8911
              </div>
            </div>
            <a
              href="https://wa.me/908508888911"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border border-brand text-brand text-sm font-semibold hover:bg-brand hover:text-white transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Contact via WhatsApp
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
