import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { ADMIN_EMAILS } from "@/lib/admin";

// Catches up any `referrals` row whose mirrored `leads` row was never
// created -- the dual-write in app/api/partner-portal/referrals/route.ts
// is best-effort (never allowed to fail the referral itself), so this is
// the recovery path if that insert/link ever failed. Same mapping as
// supabase/migrations/leads_partner_backfill.sql, just re-runnable: it
// only ever touches referrals where lead_id is still null.
export async function POST() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !ADMIN_EMAILS.includes(user.email ?? "")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const adminSupabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: unsynced, error } = await adminSupabase
    .from("referrals")
    .select("id, partner_id, patient_full_name, patient_country, patient_phone, patient_email, treatment, notes, patient_consent, status, created_at")
    .is("lead_id", null);

  if (error) {
    console.error("Sync referrals fetch error:", error);
    return NextResponse.json({ error: "Failed to look up unsynced referrals." }, { status: 500 });
  }

  let synced = 0;
  const failed: { id: string; error: string }[] = [];

  for (const r of unsynced ?? []) {
    const { data: newLead, error: insertError } = await adminSupabase
      .from("leads")
      .insert({
        source: "Partner Referral",
        name: r.patient_full_name,
        email: r.patient_email,
        phone: r.patient_phone,
        country: r.patient_country,
        treatment: r.treatment,
        message: r.notes,
        details: {},
        page_url: null,
        consent: r.patient_consent,
        owner_type: "partner",
        partner_id: r.partner_id,
        status: r.status,
        created_at: r.created_at,
      })
      .select("id")
      .single();

    if (insertError || !newLead) {
      console.error("Sync referrals insert error:", r.id, insertError);
      failed.push({ id: r.id, error: insertError?.message ?? "insert failed" });
      continue;
    }

    const { error: linkError } = await adminSupabase.from("referrals").update({ lead_id: newLead.id }).eq("id", r.id);
    if (linkError) {
      console.error("Sync referrals link error:", r.id, linkError);
      failed.push({ id: r.id, error: linkError.message });
      continue;
    }

    synced++;
  }

  revalidatePath("/admin/leads");

  return NextResponse.json({ ok: true, synced, failed });
}
