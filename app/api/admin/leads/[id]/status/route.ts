import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { ADMIN_EMAILS } from "@/lib/admin";
import { REFERRAL_STATUSES, CURRENCIES, type InstitutionType, type Currency } from "@/types";

// MCT-patient equivalent of app/api/admin/referrals/[id]/route.ts --
// same status-transition gating (Treatment Completed requires money
// details up front; leaving it cancels a pending one or flags a
// received one for reconciliation, never deletes either), just against
// patient_revenues/lead_status_history instead of
// commissions/referral_status_history. That referral route itself is
// untouched by this feature.
type RevenueInput = {
  institution_type: InstitutionType;
  institution_name?: string;
  net_amount: number;
  currency: Currency;
};

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
  const body = await req.json() as { status?: string; revenue?: RevenueInput };

  if (!body.status || !REFERRAL_STATUSES.includes(body.status as typeof REFERRAL_STATUSES[number])) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const adminSupabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: existing, error: fetchError } = await adminSupabase
    .from("leads")
    .select("id, status, owner_type")
    .eq("id", id)
    .single();

  if (fetchError || !existing) {
    return NextResponse.json({ error: "Patient not found" }, { status: 404 });
  }
  if (existing.owner_type === "partner") {
    return NextResponse.json({ error: "This patient's status is managed through their referral." }, { status: 400 });
  }

  const oldStatus = existing.status;
  const newStatus = body.status;
  const isEnteringCompleted = newStatus === "treatment_completed" && oldStatus !== "treatment_completed";
  const isLeavingCompleted = oldStatus === "treatment_completed" && newStatus !== "treatment_completed";

  const { data: activeRevenue } = await adminSupabase
    .from("patient_revenues")
    .select("*")
    .eq("lead_id", id)
    .neq("payment_status", "cancelled")
    .maybeSingle();

  if (isEnteringCompleted && !activeRevenue) {
    const revenue = body.revenue;
    if (!revenue) {
      return NextResponse.json(
        { error: "Revenue details are required to mark a patient as Treatment Completed." },
        { status: 400 }
      );
    }

    if (revenue.institution_type !== "mct_package" && revenue.institution_type !== "external_institution") {
      return NextResponse.json({ error: "Invalid institution type." }, { status: 400 });
    }
    const institutionName = (revenue.institution_name || "").trim();
    if (revenue.institution_type === "external_institution" && !institutionName) {
      return NextResponse.json({ error: "Institution name is required for external institutions." }, { status: 400 });
    }
    if (!revenue.net_amount || revenue.net_amount <= 0) {
      return NextResponse.json({ error: "Net amount must be a positive number." }, { status: 400 });
    }
    if (!CURRENCIES.includes(revenue.currency)) {
      return NextResponse.json({ error: "Invalid currency." }, { status: 400 });
    }

    const { error: revenueError } = await adminSupabase.from("patient_revenues").insert({
      lead_id: id,
      institution_type: revenue.institution_type,
      institution_name: revenue.institution_type === "external_institution" ? institutionName : null,
      net_amount: revenue.net_amount,
      currency: revenue.currency,
      payment_status: "pending",
    });

    if (revenueError) {
      console.error("Revenue insert error:", revenueError);
      return NextResponse.json({ error: "Failed to create revenue record." }, { status: 500 });
    }
  }

  if (isLeavingCompleted && activeRevenue) {
    if (activeRevenue.payment_status === "pending") {
      await adminSupabase
        .from("patient_revenues")
        .update({ payment_status: "cancelled" })
        .eq("id", activeRevenue.id);
    } else if (activeRevenue.payment_status === "received") {
      await adminSupabase
        .from("patient_revenues")
        .update({ reconciliation_status: "needs_reconciliation" })
        .eq("id", activeRevenue.id);
    }
  }

  const { error: updateError } = await adminSupabase
    .from("leads")
    .update({ status: newStatus })
    .eq("id", id);

  if (updateError) {
    console.error("Lead status update error:", updateError);
    return NextResponse.json({ error: "Failed to update patient" }, { status: 500 });
  }

  if (oldStatus !== newStatus) {
    await adminSupabase.from("lead_status_history").insert({
      lead_id: id,
      old_status: oldStatus,
      new_status: newStatus,
      changed_by: user.email,
    });
  }

  revalidatePath("/admin/leads");
  revalidatePath(`/admin/leads/${id}`);

  return NextResponse.json({ ok: true });
}
