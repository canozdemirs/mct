import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { ADMIN_EMAILS } from "@/lib/admin";
import { sendEmail, buildReferralStatusEmail } from "@/lib/email";
import { REFERRAL_STATUSES, CURRENCIES, commissionRateFor, type InstitutionType, type Currency } from "@/types";

type CommissionInput = {
  institution_type: InstitutionType;
  institution_name?: string;
  net_amount: number;
  currency: Currency;
};

function revalidateAll(id: string) {
  revalidatePath("/admin/referrals");
  revalidatePath(`/admin/referrals/${id}`);
  revalidatePath("/partner-portal/referrals");
  revalidatePath(`/partner-portal/referrals/${id}`);
  revalidatePath("/partner-portal");
}

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
  const body = await req.json() as {
    status?: string;
    admin_notes?: string;
    commission?: CommissionInput;
  };

  if (!body.status || !REFERRAL_STATUSES.includes(body.status as typeof REFERRAL_STATUSES[number])) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const adminSupabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: existing, error: fetchError } = await adminSupabase
    .from("referrals")
    .select("id, status, patient_full_name, partner_id, partners(email)")
    .eq("id", id)
    .single();

  if (fetchError || !existing) {
    return NextResponse.json({ error: "Referral not found" }, { status: 404 });
  }

  const oldStatus = existing.status;
  const newStatus = body.status;
  const isEnteringCompleted = newStatus === "treatment_completed" && oldStatus !== "treatment_completed";
  const isLeavingCompleted = oldStatus === "treatment_completed" && newStatus !== "treatment_completed";

  const { data: activeCommission } = await adminSupabase
    .from("commissions")
    .select("*")
    .eq("referral_id", id)
    .neq("status", "cancelled")
    .maybeSingle();

  // Entering Treatment Completed for the first time (no active commission
  // yet) requires the commission details up front — the transition is
  // rejected outright if they're missing or invalid.
  if (isEnteringCompleted && !activeCommission) {
    const commission = body.commission;
    if (!commission) {
      return NextResponse.json(
        { error: "Commission details are required to mark a referral as Treatment Completed." },
        { status: 400 }
      );
    }

    if (commission.institution_type !== "mct_package" && commission.institution_type !== "external_institution") {
      return NextResponse.json({ error: "Invalid institution type." }, { status: 400 });
    }
    const institutionName = (commission.institution_name || "").trim();
    if (commission.institution_type === "external_institution" && !institutionName) {
      return NextResponse.json({ error: "Institution name is required for external institutions." }, { status: 400 });
    }
    if (!commission.net_amount || commission.net_amount <= 0) {
      return NextResponse.json({ error: "Net amount must be a positive number." }, { status: 400 });
    }
    if (!CURRENCIES.includes(commission.currency)) {
      return NextResponse.json({ error: "Invalid currency." }, { status: 400 });
    }

    const percentage = commissionRateFor(commission.institution_type);
    const commissionAmount = Math.round(commission.net_amount * (percentage / 100) * 100) / 100;

    const { error: commissionError } = await adminSupabase.from("commissions").insert({
      referral_id: id,
      institution_type: commission.institution_type,
      institution_name: commission.institution_type === "external_institution" ? institutionName : null,
      net_amount: commission.net_amount,
      currency: commission.currency,
      commission_percentage: percentage,
      commission_amount: commissionAmount,
      status: "pending",
    });

    if (commissionError) {
      console.error("Commission insert error:", commissionError);
      return NextResponse.json({ error: "Failed to create commission record." }, { status: 500 });
    }
  }

  // Leaving Treatment Completed — void a pending commission, or flag a paid
  // one for manual reconciliation. Never delete either.
  if (isLeavingCompleted && activeCommission) {
    if (activeCommission.status === "pending") {
      await adminSupabase
        .from("commissions")
        .update({ status: "cancelled", cancelled_reason: "Referral status reverted from Treatment Completed" })
        .eq("id", activeCommission.id);
    } else if (activeCommission.status === "paid") {
      await adminSupabase
        .from("commissions")
        .update({ reconciliation_status: "needs_reconciliation" })
        .eq("id", activeCommission.id);
    }
  }

  const { error: updateError } = await adminSupabase
    .from("referrals")
    .update({
      status: newStatus,
      admin_notes: body.admin_notes !== undefined ? body.admin_notes || null : undefined,
    })
    .eq("id", id);

  if (updateError) {
    console.error("Referral status update error:", updateError);
    return NextResponse.json({ error: "Failed to update referral" }, { status: 500 });
  }

  if (oldStatus !== newStatus) {
    await adminSupabase.from("referral_status_history").insert({
      referral_id: id,
      old_status: oldStatus,
      new_status: newStatus,
      changed_by: user.email,
    });
  }

  const partnerEmail = (existing as unknown as { partners: { email: string | null } | null }).partners?.email;
  if (partnerEmail && oldStatus !== newStatus) {
    const { subject, text } = buildReferralStatusEmail({
      patientName: existing.patient_full_name,
      referralId: existing.id,
      status: newStatus,
    });
    await sendEmail({ to: partnerEmail, subject, text });
  }

  revalidateAll(id);

  return NextResponse.json({ ok: true });
}
