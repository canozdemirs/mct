import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { ADMIN_EMAILS } from "@/lib/admin";

// Read-only -- builds the richer confirmation-dialog content for deleting
// one or more Patients rows. For a partner-owned patient this surfaces
// the partner name, real referral status, and any active commission
// BEFORE the admin confirms delete_patient() (app/api/admin/leads/
// route.ts DELETE), since that function permanently removes all three.
export async function GET(req: NextRequest) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !ADMIN_EMAILS.includes(user.email ?? "")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const idsParam = req.nextUrl.searchParams.get("ids") || "";
  const ids = idsParam.split(",").map((s) => s.trim()).filter(Boolean);
  if (ids.length === 0) {
    return NextResponse.json({ error: "No ids provided." }, { status: 400 });
  }

  const adminSupabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: leadRows } = await adminSupabase
    .from("leads")
    .select("id, name, created_at, owner_type, partner_id")
    .in("id", ids);

  const leads = leadRows ?? [];
  const partnerLeadIds = leads.filter((l) => l.owner_type === "partner").map((l) => l.id);

  const referralByLeadId = new Map<string, { id: string; status: string; partner_id: string }>();
  const partnerNameById = new Map<string, string>();
  const commissionByReferralId = new Map<string, { amount: number; currency: string; status: string }>();

  if (partnerLeadIds.length > 0) {
    const { data: referrals } = await adminSupabase
      .from("referrals")
      .select("id, lead_id, status, partner_id")
      .in("lead_id", partnerLeadIds);

    for (const r of referrals ?? []) {
      if (r.lead_id) referralByLeadId.set(r.lead_id, r);
    }

    const partnerIds = [...new Set((referrals ?? []).map((r) => r.partner_id))];
    if (partnerIds.length > 0) {
      const { data: partnerRows } = await adminSupabase.from("partners").select("id, company_name, full_name").in("id", partnerIds);
      for (const p of partnerRows ?? []) {
        partnerNameById.set(p.id, p.company_name || p.full_name || "Unnamed partner");
      }
    }

    const referralIds = (referrals ?? []).map((r) => r.id);
    if (referralIds.length > 0) {
      const { data: commissions } = await adminSupabase
        .from("commissions")
        .select("referral_id, commission_amount, currency, status")
        .in("referral_id", referralIds)
        .neq("status", "cancelled");
      for (const c of commissions ?? []) {
        commissionByReferralId.set(c.referral_id, { amount: c.commission_amount, currency: c.currency, status: c.status });
      }
    }
  }

  const previews = leads.map((l) => {
    const referral = l.owner_type === "partner" ? referralByLeadId.get(l.id) : undefined;
    return {
      id: l.id,
      name: l.name,
      date: l.created_at,
      ownerType: l.owner_type,
      partnerName: referral ? partnerNameById.get(referral.partner_id) ?? null : null,
      referralStatus: referral?.status ?? null,
      commission: referral ? commissionByReferralId.get(referral.id) ?? null : null,
    };
  });

  return NextResponse.json({ previews });
}
