import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/email";
import type { ReferralFile } from "@/types";

const MAX_FILES = 5;
const ADMIN_RECIPIENTS = ["hello@medicalcenterturkey.com", "can.ozdemir@medicalcenterturkey.com"];

function normalizeName(name: string) {
  return name.trim().toLowerCase().replace(/\s+/g, " ");
}

function normalizePhone(phone: string) {
  return phone.replace(/[^0-9]/g, "");
}

export async function POST(req: NextRequest) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const adminSupabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: partner } = await adminSupabase
    .from("partners")
    .select("id, status, company_name, full_name")
    .eq("auth_user_id", user.id)
    .single();

  if (!partner || partner.status !== "active") {
    return NextResponse.json({ error: "No active partner account found." }, { status: 403 });
  }

  const body = await req.json() as {
    patient_full_name?: string;
    patient_country?: string;
    patient_phone?: string;
    patient_email?: string;
    treatment?: string;
    notes?: string;
    patient_consent?: boolean;
    files?: ReferralFile[];
  };

  const patient_full_name = (body.patient_full_name || "").trim();
  const patient_country = (body.patient_country || "").trim();
  const patient_phone = (body.patient_phone || "").trim();
  const patient_email = (body.patient_email || "").trim();
  const treatment = (body.treatment || "").trim();
  const notes = (body.notes || "").trim();
  const files = Array.isArray(body.files) ? body.files.slice(0, MAX_FILES) : [];

  if (!patient_full_name || !patient_country || !patient_phone || !treatment) {
    return NextResponse.json({ error: "Please fill in all required fields." }, { status: 400 });
  }
  if (!body.patient_consent) {
    return NextResponse.json({ error: "Patient consent confirmation is required." }, { status: 400 });
  }

  // Duplicate patient check — same partner, same name + phone (case-insensitive).
  const { data: existingReferrals } = await supabase
    .from("referrals")
    .select("id, patient_full_name, patient_phone");

  const normalizedNewName = normalizeName(patient_full_name);
  const normalizedNewPhone = normalizePhone(patient_phone);

  const duplicate = (existingReferrals ?? []).find(
    (r) =>
      normalizeName(r.patient_full_name) === normalizedNewName &&
      normalizePhone(r.patient_phone) === normalizedNewPhone
  );

  if (duplicate) {
    // Files were already uploaded client-side before this check ran — clean them up.
    if (files.length > 0) {
      await supabase.storage.from("referral-files").remove(files.map((f) => f.path));
    }
    return NextResponse.json(
      { error: "This patient has already been referred.", existingReferralId: duplicate.id },
      { status: 409 }
    );
  }

  const { data: inserted, error: insertError } = await supabase
    .from("referrals")
    .insert({
      patient_full_name,
      patient_country,
      patient_phone,
      patient_email: patient_email || null,
      treatment,
      notes: notes || null,
      patient_consent: true,
      files,
    })
    .select("id")
    .single();

  if (insertError || !inserted) {
    console.error("Referral insert error:", insertError);
    if (files.length > 0) {
      await supabase.storage.from("referral-files").remove(files.map((f) => f.path));
    }
    return NextResponse.json({ error: "Failed to create referral. Please try again." }, { status: 500 });
  }

  const partnerName = partner.company_name || partner.full_name || "A partner";
  await sendEmail({
    to: ADMIN_RECIPIENTS,
    subject: `New Referral Received — ${patient_full_name}`,
    text: [
      "A new patient referral has been submitted.",
      "",
      `Partner: ${partnerName}`,
      `Patient: ${patient_full_name}`,
      `Treatment: ${treatment}`,
      `Country: ${patient_country}`,
      "",
      `View it in the admin panel: ${process.env.NEXT_PUBLIC_APP_URL || "https://medicalcenterturkey.com"}/admin/referrals/${inserted.id}`,
    ].join("\n"),
  });

  return NextResponse.json({ ok: true, id: inserted.id });
}
