import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const {
    full_name,
    email,
    phone,
    country,
    city,
    partner_type,
    partner_type_other,
    company_name,
    website,
    social_media,
    company_address,
    years_in_business,
    markets,
    monthly_patients,
    treatments_interest,
    business_description,
    how_heard,
  } = body as {
    full_name: string;
    email: string;
    phone: string;
    country: string;
    city?: string;
    partner_type: string;
    partner_type_other?: string;
    company_name: string;
    website?: string;
    social_media?: string;
    company_address?: string;
    years_in_business?: string;
    markets?: string;
    monthly_patients: string;
    treatments_interest?: string[];
    business_description: string;
    how_heard?: string;
  };

  if (!full_name || !email || !phone || !country || !partner_type || !company_name || !monthly_patients || !business_description) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const adminSupabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: inserted, error: dbError } = await adminSupabase
    .from("partner_applications")
    .insert({
      full_name,
      email,
      phone,
      country,
      city: city || null,
      partner_type,
      partner_type_other: partner_type_other || null,
      company_name,
      website: website || null,
      social_media: social_media || null,
      company_address: company_address || null,
      years_in_business: years_in_business || null,
      markets: markets || null,
      monthly_patients,
      treatments_interest: treatments_interest || [],
      business_description,
      how_heard: how_heard || null,
    })
    .select("id, created_at")
    .single();

  if (dbError) {
    console.error("DB insert error:", dbError);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }

  const emailText = [
    "New Partner Application",
    "=======================",
    `Full Name: ${full_name}`,
    `Company: ${company_name}`,
    `Partner Type: ${partner_type}${partner_type_other ? ` (${partner_type_other})` : ""}`,
    `Country / City: ${country}${city ? ` / ${city}` : ""}`,
    `Email: ${email}`,
    `WhatsApp: ${phone}`,
    `Website: ${website || "—"}`,
    `Social Media: ${social_media || "—"}`,
    `Company Address: ${company_address || "—"}`,
    `Years in Business: ${years_in_business || "—"}`,
    `Patient Volume/Month: ${monthly_patients}`,
    `Main Markets: ${markets || "—"}`,
    `Treatments of Interest: ${treatments_interest && treatments_interest.length > 0 ? treatments_interest.join(", ") : "—"}`,
    `Business Description: ${business_description}`,
    `How They Found MCT: ${how_heard || "—"}`,
    `Application Date: ${inserted?.created_at ? new Date(inserted.created_at).toISOString() : new Date().toISOString()}`,
    `Application ID: ${inserted?.id || "—"}`,
  ].join("\n");

  await sendEmail({
    to: "hello@medicalcenterturkey.com",
    subject: `New MCT Partner Application — ${company_name} — ${country}`,
    text: emailText,
  });

  return NextResponse.json({ ok: true });
}
