import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { createClient as createServerClient } from "@/lib/supabase/server";
import type { ReferralFile } from "@/types";

const MAX_FILES = 5;

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  // RLS already scopes this to the caller's own referrals, but we need the
  // current row (status + files) to validate the edit before writing.
  const { data: existing, error: fetchError } = await supabase
    .from("referrals")
    .select("id, partner_id, status, files, lead_id")
    .eq("id", id)
    .single();

  if (fetchError || !existing) {
    return NextResponse.json({ error: "Referral not found." }, { status: 404 });
  }

  if (existing.status !== "new") {
    return NextResponse.json(
      { error: "This referral can no longer be edited because its status has changed." },
      { status: 403 }
    );
  }

  const body = await req.json() as {
    patient_full_name?: string;
    patient_country?: string;
    patient_phone?: string;
    patient_email?: string;
    treatment?: string;
    notes?: string;
    files?: ReferralFile[];
  };

  const patient_full_name = (body.patient_full_name || "").trim();
  const patient_country = (body.patient_country || "").trim();
  const patient_phone = (body.patient_phone || "").trim();
  const patient_email = (body.patient_email || "").trim();
  const treatment = (body.treatment || "").trim();
  const notes = (body.notes || "").trim();
  const finalFiles = Array.isArray(body.files) ? body.files.slice(0, MAX_FILES) : [];

  if (!patient_full_name || !patient_country || !patient_phone || !treatment) {
    return NextResponse.json({ error: "Please fill in all required fields." }, { status: 400 });
  }

  const { error: updateError } = await supabase
    .from("referrals")
    .update({
      patient_full_name,
      patient_country,
      patient_phone,
      patient_email: patient_email || null,
      treatment,
      notes: notes || null,
      files: finalFiles,
    })
    .eq("id", id);

  if (updateError) {
    console.error("Referral update error:", updateError);
    return NextResponse.json({ error: "Failed to update referral. Please try again." }, { status: 500 });
  }

  // Best-effort cleanup of files the partner removed during this edit.
  const originalFiles: ReferralFile[] = existing.files ?? [];
  const removedPaths = originalFiles
    .filter((f) => !finalFiles.some((k) => k.path === f.path))
    .map((f) => f.path);
  if (removedPaths.length > 0) {
    await supabase.storage.from("referral-files").remove(removedPaths);
  }

  // Best-effort sync onto the mirrored Patients (leads) row -- the
  // partner's own session client can't write to `leads` (service-role
  // only), so this needs the admin client. A failure here never undoes
  // the referral edit that already succeeded above.
  if (existing.lead_id) {
    try {
      const adminSupabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );
      await adminSupabase
        .from("leads")
        .update({
          name: patient_full_name,
          phone: patient_phone,
          email: patient_email || null,
          country: patient_country,
          treatment,
          message: notes || null,
        })
        .eq("id", existing.lead_id);
    } catch (mirrorError) {
      console.error("Patients mirror-sync error (non-fatal):", mirrorError);
    }
  }

  return NextResponse.json({ ok: true });
}
