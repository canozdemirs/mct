import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient, type SupabaseClient } from "@supabase/supabase-js";
import { ADMIN_EMAILS } from "@/lib/admin";
import { PatientDetailHeader } from "@/components/admin/patient-detail-header";
import { PartnerInfoBox } from "@/components/admin/partner-info-box";
import { SourceInfoBox, type AttributionInfo } from "@/components/admin/source-info-box";
import { PatientNotesCard } from "@/components/admin/patient-notes-card";
import { PatientFilesCard } from "@/components/admin/patient-files-card";
import { PatientEditCard } from "@/components/admin/patient-edit-card";
import { PatientStatusActions } from "@/components/admin/patient-status-actions";
import { PatientStatusHistory } from "@/components/admin/patient-status-history";
import { PatientDetailActions } from "@/components/admin/patient-detail-actions";
import { DetachReferralButton } from "@/components/admin/detach-referral-button";
import { CommissionPanel } from "@/components/admin/commission-panel";
import { RevenuePanel } from "@/components/admin/revenue-panel";
import { HospitalBillingPanel } from "@/components/admin/hospital-billing-panel";
import type { BillingStage, Commission, ReferralFile } from "@/types";
import type { PatientRevenue } from "@/components/admin/revenue-panel";
import type { Lead, PartnerOption } from "@/app/(dashboard)/admin/leads/page";

const ATTRIBUTION_BASE_COLUMNS = "reference_code, channel, created_at, lead_id";
const ATTRIBUTION_SOURCE_COLUMNS = "last_touch_landing_page, last_touch_utm_source, last_touch_utm_medium, last_touch_utm_campaign";

async function fetchAttribution(adminSupabase: SupabaseClient, code: string): Promise<AttributionInfo | null> {
  const { data, error } = await adminSupabase
    .from("lead_attributions")
    .select(`${ATTRIBUTION_BASE_COLUMNS}, ${ATTRIBUTION_SOURCE_COLUMNS}`)
    .eq("reference_code", code)
    .maybeSingle();

  if (error || !data) return null;
  const d = data as { channel: string; last_touch_landing_page?: string | null; last_touch_utm_source?: string | null; last_touch_utm_medium?: string | null; last_touch_utm_campaign?: string | null };
  return {
    channel: d.channel,
    landingPage: d.last_touch_landing_page ?? null,
    utmSource: d.last_touch_utm_source ?? null,
    utmMedium: d.last_touch_utm_medium ?? null,
    utmCampaign: d.last_touch_utm_campaign ?? null,
  };
}

export default async function PatientDetailPage({
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

  const { data: leadRow, error } = await adminSupabase.from("leads").select("*").eq("id", id).single();
  if (error || !leadRow) {
    notFound();
  }
  const lead = leadRow as Lead;

  const { data: partnerRows } = await adminSupabase
    .from("partners")
    .select("id, company_name, full_name")
    .eq("status", "active")
    .order("company_name");
  const partners: PartnerOption[] = (partnerRows ?? []).map((p) => ({ id: p.id, name: p.company_name || p.full_name || "Unnamed partner" }));

  if (lead.owner_type === "partner") {
    const { data: referral } = await adminSupabase
      .from("referrals")
      .select("*, partner:partners(company_name, full_name, email, partner_type)")
      .eq("lead_id", id)
      .maybeSingle();

    if (!referral) {
      // Shouldn't happen once synced, but fall through to a minimal MCT-style render
      // rather than crashing if a partner-owned lead's referral link is missing.
      notFound();
    }

    const signedFiles = await Promise.all(
      ((referral.files ?? []) as ReferralFile[]).map(async (f) => {
        const { data } = await adminSupabase.storage.from("referral-files").createSignedUrl(f.path, 300);
        return { name: f.name, path: f.path, url: data?.signedUrl ?? null };
      })
    );

    const { data: activeCommission } = await adminSupabase
      .from("commissions")
      .select("*")
      .eq("referral_id", referral.id)
      .neq("status", "cancelled")
      .maybeSingle();

    const { data: history } = await adminSupabase
      .from("referral_status_history")
      .select("id, old_status, new_status, changed_by, changed_at")
      .eq("referral_id", referral.id)
      .order("changed_at", { ascending: false });

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <PatientDetailHeader name={referral.patient_full_name} subtitle={referral.treatment} status={referral.status} />

          <PatientEditCard lead={lead} partners={partners} />

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
            <PartnerInfoBox
              companyName={referral.partner?.company_name ?? null}
              contactName={referral.partner?.full_name ?? null}
              email={referral.partner?.email ?? null}
              partnerType={referral.partner?.partner_type ?? null}
            />
            <PatientNotesCard title="Partner Notes" notes={referral.notes} />
            <PatientFilesCard files={signedFiles} />
          </div>

          <PatientStatusActions
            variant={{ kind: "partner", referralId: referral.id, currentAdminNotes: referral.admin_notes }}
            currentStatus={referral.status}
            hasActiveMoney={!!activeCommission}
          />

          {activeCommission && <CommissionPanel commission={activeCommission as Commission} />}

          {lead.status === "treatment_completed" && (
            <HospitalBillingPanel
              leadId={id}
              ownerType="partner"
              billingStage={(lead.billing_stage as BillingStage | null) ?? "treatment_done"}
              moneyAmount={activeCommission?.net_amount ?? null}
              moneyCurrency={activeCommission?.currency ?? null}
              invoicedAt={lead.invoiced_at ?? null}
              earnedAt={lead.earned_at ?? null}
            />
          )}

          <PatientStatusHistory entries={history ?? []} />

          <DetachReferralButton
            leadId={id}
            patientName={referral.patient_full_name}
            partnerName={referral.partner?.company_name || referral.partner?.full_name || null}
            hasActiveCommission={!!activeCommission}
          />

          <PatientDetailActions lead={lead} />
        </div>
      </div>
    );
  }

  // owner_type === "mct"
  const referenceCode = typeof lead.details?.reference_code === "string" ? lead.details.reference_code : null;
  const fallbackAttribution = referenceCode ? await fetchAttribution(adminSupabase, referenceCode) : null;

  // leads.landing_page/utm_* (parsed server-side from page_url at submit
  // time, unconditional) take priority; lead_attributions.last_touch_*
  // (consent-gated, client-side-only) only fills in what that doesn't have.
  const hasOwnAttribution = !!(lead.landing_page || lead.utm_source || lead.utm_medium || lead.utm_campaign);
  const attribution: AttributionInfo | null =
    hasOwnAttribution || fallbackAttribution
      ? {
          channel: fallbackAttribution?.channel ?? null,
          landingPage: lead.landing_page ?? fallbackAttribution?.landingPage ?? null,
          utmSource: lead.utm_source ?? fallbackAttribution?.utmSource ?? null,
          utmMedium: lead.utm_medium ?? fallbackAttribution?.utmMedium ?? null,
          utmCampaign: lead.utm_campaign ?? fallbackAttribution?.utmCampaign ?? null,
        }
      : null;

  const signedFiles = await Promise.all(
    ((lead.files as unknown as ReferralFile[]) ?? []).map(async (f) => {
      const { data } = await adminSupabase.storage.from("mct-patient-files").createSignedUrl(f.path, 300);
      return { name: f.name, path: f.path, url: data?.signedUrl ?? null };
    })
  );

  const { data: activeRevenue } = await adminSupabase
    .from("patient_revenues")
    .select("*")
    .eq("lead_id", id)
    .neq("payment_status", "cancelled")
    .maybeSingle();

  const { data: history } = await adminSupabase
    .from("lead_status_history")
    .select("id, old_status, new_status, changed_by, changed_at")
    .eq("lead_id", id)
    .order("changed_at", { ascending: false });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <PatientDetailHeader name={lead.name} subtitle={lead.treatment} status={lead.status} />

        <PatientEditCard lead={lead} partners={partners} />

        {(referenceCode || attribution) && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
            <SourceInfoBox referenceCode={referenceCode} attribution={attribution} />
          </div>
        )}

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
          <PatientFilesCard files={signedFiles} leadId={id} />
        </div>

        <PatientStatusActions
          variant={{ kind: "mct", leadId: id }}
          currentStatus={lead.status}
          hasActiveMoney={!!activeRevenue}
        />

        {activeRevenue && <RevenuePanel revenue={activeRevenue as PatientRevenue} />}

        {lead.status === "treatment_completed" && (
          <HospitalBillingPanel
            leadId={id}
            ownerType="mct"
            billingStage={(lead.billing_stage as BillingStage | null) ?? "treatment_done"}
            moneyAmount={activeRevenue?.net_amount ?? null}
            moneyCurrency={activeRevenue?.currency ?? null}
            invoicedAt={lead.invoiced_at ?? null}
            earnedAt={lead.earned_at ?? null}
          />
        )}

        <PatientStatusHistory entries={history ?? []} />

        <PatientDetailActions lead={lead} />
      </div>
    </div>
  );
}
