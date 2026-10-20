import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { ADMIN_EMAILS } from "@/lib/admin";
import { PipelineBoard, type PipelineCard, type PipelineColumnId } from "@/components/admin/pipeline-board";
import type { BillingStage } from "@/types";

type LeadRow = {
  id: string;
  name: string;
  country: string | null;
  treatment: string | null;
  hospital: string | null;
  owner_type: "mct" | "partner";
  partner_id: string | null;
  status: string;
  billing_stage: string | null;
  created_at: string;
};

function columnFor(status: string, billingStage: string | null): PipelineColumnId | null {
  if (status === "consultation") return "offered";
  if (status === "treatment_planned") return "treatment_planned";
  if (status === "treatment_completed") {
    const stage = (billingStage as BillingStage | null) ?? "treatment_done";
    if (stage === "treatment_done") return "treatment_done";
    if (stage === "invoiced") return "invoiced";
    if (stage === "earned") return "earned";
  }
  return null;
}

export default async function SalesPipelinePage({
  searchParams,
}: {
  searchParams: Promise<{ owner?: string; hospital?: string; treatment?: string }>;
}) {
  const { owner: ownerRaw, hospital, treatment } = await searchParams;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !ADMIN_EMAILS.includes(user.email ?? "")) {
    redirect("/agency");
  }

  const adminSupabase = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  let ownerType: "mct" | "partner" | undefined;
  let partnerId: string | undefined;
  if (ownerRaw === "mct") {
    ownerType = "mct";
  } else if (ownerRaw?.startsWith("partner:")) {
    ownerType = "partner";
    partnerId = ownerRaw.slice("partner:".length);
  }

  let query = adminSupabase
    .from("leads")
    .select("id, name, country, treatment, hospital, owner_type, partner_id, status, billing_stage, created_at")
    .in("status", ["consultation", "treatment_planned", "treatment_completed"]);
  if (ownerType) query = query.eq("owner_type", ownerType);
  if (partnerId) query = query.eq("partner_id", partnerId);
  if (hospital) query = query.ilike("hospital", `%${hospital}%`);
  if (treatment) query = query.ilike("treatment", `%${treatment}%`);

  const { data: leadRows } = await query;
  const leads = (leadRows ?? []) as LeadRow[];
  const leadIds = leads.map((l) => l.id);
  const partnerLeadIds = leads.filter((l) => l.owner_type === "partner").map((l) => l.id);
  const mctLeadIds = leads.filter((l) => l.owner_type === "mct").map((l) => l.id);

  const { data: partnerRows } = await adminSupabase.from("partners").select("id, company_name, full_name");
  const partnerNameById = new Map((partnerRows ?? []).map((p) => [p.id, p.company_name || p.full_name || "Unnamed partner"]));

  // Partner-owned cards need their referral's id (to call the unchanged
  // /api/admin/referrals/[id] route for status moves) and the active
  // commission's net_amount/currency (display only -- never a stored
  // snapshot).
  const referralByLeadId = new Map<string, { id: string; partnerId: string }>();
  const commissionByReferralId = new Map<string, { amount: number; currency: string }>();
  if (partnerLeadIds.length > 0) {
    const { data: referrals } = await adminSupabase
      .from("referrals")
      .select("id, lead_id, partner_id")
      .in("lead_id", partnerLeadIds);
    for (const r of referrals ?? []) {
      if (r.lead_id) referralByLeadId.set(r.lead_id, { id: r.id, partnerId: r.partner_id });
    }
    const referralIds = (referrals ?? []).map((r) => r.id);
    if (referralIds.length > 0) {
      const { data: commissions } = await adminSupabase
        .from("commissions")
        .select("referral_id, net_amount, currency")
        .in("referral_id", referralIds)
        .neq("status", "cancelled");
      for (const c of commissions ?? []) {
        commissionByReferralId.set(c.referral_id, { amount: c.net_amount, currency: c.currency });
      }
    }
  }

  const revenueByLeadId = new Map<string, { amount: number; currency: string }>();
  if (mctLeadIds.length > 0) {
    const { data: revenues } = await adminSupabase
      .from("patient_revenues")
      .select("lead_id, net_amount, currency")
      .in("lead_id", mctLeadIds)
      .neq("payment_status", "cancelled");
    for (const r of revenues ?? []) {
      revenueByLeadId.set(r.lead_id, { amount: r.net_amount, currency: r.currency });
    }
  }

  // "Days in this stage" -- Offered/Treatment Planned read lead_status_history
  // (MCT) or referral_status_history (partner); the three billing
  // sub-stages read billing_stage_history (same table either way, since
  // billing_stage always lives on `leads`).
  const enteredAtByLeadId = new Map<string, string>();

  if (mctLeadIds.length > 0) {
    const { data: rows } = await adminSupabase
      .from("lead_status_history")
      .select("lead_id, new_status, changed_at")
      .in("lead_id", mctLeadIds)
      .in("new_status", ["consultation", "treatment_planned"])
      .order("changed_at", { ascending: false });
    for (const row of rows ?? []) {
      const lead = leads.find((l) => l.id === row.lead_id);
      if (lead && lead.status === row.new_status && !enteredAtByLeadId.has(row.lead_id)) {
        enteredAtByLeadId.set(row.lead_id, row.changed_at);
      }
    }
  }

  if (partnerLeadIds.length > 0) {
    const referralIds = [...referralByLeadId.values()].map((r) => r.id);
    if (referralIds.length > 0) {
      const { data: rows } = await adminSupabase
        .from("referral_status_history")
        .select("referral_id, new_status, changed_at")
        .in("referral_id", referralIds)
        .in("new_status", ["consultation", "treatment_planned"])
        .order("changed_at", { ascending: false });
      const leadIdByReferralId = new Map([...referralByLeadId.entries()].map(([leadId, r]) => [r.id, leadId]));
      for (const row of rows ?? []) {
        const leadId = leadIdByReferralId.get(row.referral_id);
        const lead = leadId ? leads.find((l) => l.id === leadId) : undefined;
        if (leadId && lead && lead.status === row.new_status && !enteredAtByLeadId.has(leadId)) {
          enteredAtByLeadId.set(leadId, row.changed_at);
        }
      }
    }
  }

  const completedLeadIds = leads.filter((l) => l.status === "treatment_completed").map((l) => l.id);
  if (completedLeadIds.length > 0) {
    const { data: rows } = await adminSupabase
      .from("billing_stage_history")
      .select("lead_id, new_stage, changed_at")
      .in("lead_id", completedLeadIds)
      .order("changed_at", { ascending: false });
    for (const row of rows ?? []) {
      const lead = leads.find((l) => l.id === row.lead_id);
      const currentStage = lead ? (lead.billing_stage ?? "treatment_done") : null;
      if (lead && currentStage === row.new_stage && !enteredAtByLeadId.has(row.lead_id)) {
        enteredAtByLeadId.set(row.lead_id, row.changed_at);
      }
    }
  }

  const now = Date.now();
  const cards: PipelineCard[] = [];
  for (const lead of leads) {
    const column = columnFor(lead.status, lead.billing_stage);
    if (!column) continue;

    const referral = lead.owner_type === "partner" ? referralByLeadId.get(lead.id) : undefined;
    const money =
      lead.owner_type === "partner"
        ? (referral ? commissionByReferralId.get(referral.id) : undefined)
        : revenueByLeadId.get(lead.id);

    const enteredAt = enteredAtByLeadId.get(lead.id) ?? lead.created_at;
    const daysInStage = Math.max(0, Math.floor((now - new Date(enteredAt).getTime()) / (1000 * 60 * 60 * 24)));

    cards.push({
      id: lead.id,
      referralId: referral?.id,
      name: lead.name,
      country: lead.country,
      treatment: lead.treatment,
      hospital: lead.hospital,
      ownerType: lead.owner_type,
      ownerLabel: lead.owner_type === "partner" ? partnerNameById.get(lead.partner_id ?? "") || "Partner" : "MCT",
      daysInStage,
      amount: money?.amount ?? null,
      currency: money?.currency ?? null,
      column,
    });
  }

  const { data: allPartnerRows } = await adminSupabase
    .from("partners")
    .select("id, company_name, full_name")
    .eq("status", "active")
    .order("company_name");
  const partners = (allPartnerRows ?? []).map((p) => ({ id: p.id, name: p.company_name || p.full_name || "Unnamed partner" }));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center gap-4 mb-6 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-brand-dark">Sales Pipeline</h1>
            <p className="text-sm text-gray-500 mt-1">Offered patients through to earned hospital-billing revenue</p>
          </div>
        </div>

        <form method="get" className="flex flex-wrap gap-3 mb-6 bg-white border border-gray-100 rounded-2xl p-4">
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
            name="hospital"
            defaultValue={hospital}
            placeholder="Hospital"
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
          <a href="/admin/pipeline" className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-400 hover:text-gray-600 transition-colors">
            Clear
          </a>
        </form>

        <PipelineBoard cards={cards} />
      </div>
    </div>
  );
}
