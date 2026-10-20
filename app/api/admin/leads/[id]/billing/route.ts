import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { ADMIN_EMAILS } from "@/lib/admin";
import { BILLING_STAGES, type BillingStage } from "@/types";

// Advances/reverses a patient's hospital-billing stage (Treatment Done ->
// Invoice -> Earned) -- a dimension entirely separate from `status`
// (which stays 'treatment_completed' throughout all three) and from
// commissions.status (partners' own payout, never touched here). No
// invoice form/fields: per the approved plan, invoice_number/
// invoice_institution/invoice_amount/invoice_currency are never
// collected anywhere -- only invoiced_at/earned_at get stamped, and the
// pipeline/card read the amount live from patient_revenues (MCT) or
// commissions (partner) instead of storing a separate snapshot.
const STAGE_ORDER: Record<BillingStage, number> = { treatment_done: 0, invoiced: 1, earned: 2 };

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !ADMIN_EMAILS.includes(user.email ?? "")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json().catch(() => null) as { stage?: string } | null;

  if (!body?.stage || !BILLING_STAGES.includes(body.stage as BillingStage)) {
    return NextResponse.json({ error: "Invalid billing stage." }, { status: 400 });
  }
  const targetStage = body.stage as BillingStage;

  const adminSupabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: lead, error: fetchError } = await adminSupabase
    .from("leads")
    .select("id, status, owner_type, billing_stage")
    .eq("id", id)
    .single();

  if (fetchError || !lead) {
    return NextResponse.json({ error: "Patient not found." }, { status: 404 });
  }
  if (lead.status !== "treatment_completed") {
    return NextResponse.json({ error: "Hospital billing only applies once a patient is Treatment Completed." }, { status: 400 });
  }

  const currentStage: BillingStage = (lead.billing_stage as BillingStage | null) ?? "treatment_done";
  if (currentStage === targetStage) {
    return NextResponse.json({ error: "Already at this stage." }, { status: 400 });
  }

  const movingForward = STAGE_ORDER[targetStage] > STAGE_ORDER[currentStage];
  const movingBackwardFromEarned = !movingForward && currentStage === "earned";

  // Entering Earned (MCT only) -- mirrors the existing "Mark as Received"
  // action in revenue-panel.tsx, just triggered from the pipeline/card
  // instead of that panel's own button. Partner-owned patients never
  // have commissions.status touched here, per the approved plan.
  if (movingForward && targetStage === "earned" && lead.owner_type === "mct") {
    const { data: activeRevenue } = await adminSupabase
      .from("patient_revenues")
      .select("id, payment_status")
      .eq("lead_id", id)
      .neq("payment_status", "cancelled")
      .maybeSingle();

    if (activeRevenue && activeRevenue.payment_status === "pending") {
      await adminSupabase
        .from("patient_revenues")
        .update({ payment_status: "received", payment_date: new Date().toISOString().slice(0, 10) })
        .eq("id", activeRevenue.id);
    }
  }

  // Leaving Earned backward (MCT only) -- never silently un-receive a
  // payment that may already have landed; flag it for manual
  // reconciliation instead, same philosophy as leaving Treatment
  // Completed with an already-received revenue/commission.
  if (movingBackwardFromEarned && lead.owner_type === "mct") {
    const { data: activeRevenue } = await adminSupabase
      .from("patient_revenues")
      .select("id, payment_status")
      .eq("lead_id", id)
      .neq("payment_status", "cancelled")
      .maybeSingle();

    if (activeRevenue && activeRevenue.payment_status === "received") {
      await adminSupabase
        .from("patient_revenues")
        .update({ reconciliation_status: "needs_reconciliation" })
        .eq("id", activeRevenue.id);
    }
  }

  const updatePayload: Record<string, unknown> = { billing_stage: targetStage };
  if (movingForward) {
    if (targetStage === "invoiced") updatePayload.invoiced_at = new Date().toISOString().slice(0, 10);
    if (targetStage === "earned") updatePayload.earned_at = new Date().toISOString().slice(0, 10);
  } else {
    // Backward: clear the stamp(s) for stage(s) being left behind.
    if (currentStage === "earned") updatePayload.earned_at = null;
    if (targetStage === "treatment_done") updatePayload.invoiced_at = null;
  }

  const { error: updateError } = await adminSupabase.from("leads").update(updatePayload).eq("id", id);
  if (updateError) {
    console.error("Billing stage update error:", updateError);
    return NextResponse.json({ error: "Failed to update billing stage." }, { status: 500 });
  }

  await adminSupabase.from("billing_stage_history").insert({
    lead_id: id,
    old_stage: currentStage,
    new_stage: targetStage,
    changed_by: user.email,
  });

  revalidatePath("/admin/leads");
  revalidatePath(`/admin/leads/${id}`);
  revalidatePath("/admin/pipeline");

  return NextResponse.json({ ok: true });
}
