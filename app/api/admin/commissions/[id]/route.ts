import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { ADMIN_EMAILS } from "@/lib/admin";
import { CURRENCIES, commissionRateFor, type InstitutionType, type Currency } from "@/types";

type Body =
  | { action: "mark_paid"; payment_date: string }
  | { action: "mark_reconciled" }
  | { action: "edit"; institution_type: InstitutionType; institution_name?: string; net_amount: number; currency: Currency };

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
  const body = await req.json() as Body;

  const adminSupabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: commission, error: fetchError } = await adminSupabase
    .from("commissions")
    .select("*, referrals(id)")
    .eq("id", id)
    .single();

  if (fetchError || !commission) {
    return NextResponse.json({ error: "Commission not found" }, { status: 404 });
  }

  if (body.action === "mark_paid") {
    if (commission.status !== "pending") {
      return NextResponse.json({ error: "Only a pending commission can be marked as paid." }, { status: 400 });
    }
    if (!body.payment_date) {
      return NextResponse.json({ error: "Payment date is required." }, { status: 400 });
    }

    const { error } = await adminSupabase
      .from("commissions")
      .update({ status: "paid", payment_date: body.payment_date })
      .eq("id", id);

    if (error) {
      console.error("Mark paid error:", error);
      return NextResponse.json({ error: "Failed to mark commission as paid." }, { status: 500 });
    }
  } else if (body.action === "mark_reconciled") {
    if (commission.reconciliation_status !== "needs_reconciliation") {
      return NextResponse.json({ error: "This commission does not need reconciliation." }, { status: 400 });
    }

    const { error } = await adminSupabase
      .from("commissions")
      .update({
        reconciliation_status: "resolved",
        resolved_by: user.email,
        resolved_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      console.error("Mark reconciled error:", error);
      return NextResponse.json({ error: "Failed to mark commission as reconciled." }, { status: 500 });
    }
  } else if (body.action === "edit") {
    if (commission.status !== "pending") {
      return NextResponse.json(
        { error: "This commission has already been paid or cancelled and can no longer be edited." },
        { status: 403 }
      );
    }
    if (body.institution_type !== "mct_package" && body.institution_type !== "external_institution") {
      return NextResponse.json({ error: "Invalid institution type." }, { status: 400 });
    }
    const institutionName = (body.institution_name || "").trim();
    if (body.institution_type === "external_institution" && !institutionName) {
      return NextResponse.json({ error: "Institution name is required for external institutions." }, { status: 400 });
    }
    if (!body.net_amount || body.net_amount <= 0) {
      return NextResponse.json({ error: "Net amount must be a positive number." }, { status: 400 });
    }
    if (!CURRENCIES.includes(body.currency)) {
      return NextResponse.json({ error: "Invalid currency." }, { status: 400 });
    }

    const percentage = commissionRateFor(body.institution_type);
    const commissionAmount = Math.round(body.net_amount * (percentage / 100) * 100) / 100;

    const { error } = await adminSupabase
      .from("commissions")
      .update({
        institution_type: body.institution_type,
        institution_name: body.institution_type === "external_institution" ? institutionName : null,
        net_amount: body.net_amount,
        currency: body.currency,
        commission_percentage: percentage,
        commission_amount: commissionAmount,
      })
      .eq("id", id);

    if (error) {
      console.error("Commission edit error:", error);
      return NextResponse.json({ error: "Failed to update commission." }, { status: 500 });
    }
  } else {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  const referralId = (commission as unknown as { referrals: { id: string } | null }).referrals?.id;
  revalidatePath("/admin/referrals");
  if (referralId) {
    revalidatePath(`/admin/referrals/${referralId}`);
    revalidatePath(`/partner-portal/referrals/${referralId}`);
  }
  revalidatePath("/partner-portal/referrals");
  revalidatePath("/partner-portal");

  return NextResponse.json({ ok: true });
}
