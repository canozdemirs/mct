import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { ADMIN_EMAILS } from "@/lib/admin";
import { validateLeadContactFields, findDuplicateLead } from "@/lib/admin-lead-helpers";
import { SOURCE_CATEGORIES } from "@/lib/patient-source";

// Full-field edit for a Patients row, either owner type. Status is
// deliberately NOT handled here -- it moved to
// app/api/admin/leads/[id]/status/route.ts (MCT) and
// app/api/admin/referrals/[id]/route.ts (partner, unchanged), both of
// which gate Treatment Completed on a money form this route has no UI
// for; a bare status field here could otherwise bypass that gate.
type EditLeadBody = {
  source?: string;
  name?: string;
  phone?: string;
  email?: string;
  country?: string;
  treatment?: string;
  hospital?: string;
  message?: string;
  internalNotes?: string;
  confirmedAt?: string;
  sourceOverride?: string;
  force?: boolean;
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
  const body = await req.json().catch(() => null) as EditLeadBody | null;
  if (!body) {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const adminSupabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const source = (body.source || "").trim();
  const name = (body.name || "").trim();
  const phone = (body.phone || "").trim();
  const email = (body.email || "").trim();
  const country = (body.country || "").trim();
  const treatment = (body.treatment || "").trim();
  const hospital = (body.hospital || "").trim();
  const message = (body.message || "").trim();
  const internalNotes = (body.internalNotes || "").trim();

  const fieldError = validateLeadContactFields({ source, name, phone, email }, false);
  if (fieldError) {
    return NextResponse.json({ error: fieldError }, { status: 400 });
  }

  // Plain "date" column (no time component) -- stored as-is, no
  // ISO/timezone conversion.
  let confirmedAtDate: string | null = null;
  if (body.confirmedAt) {
    const parsed = new Date(body.confirmedAt);
    if (Number.isNaN(parsed.getTime())) {
      return NextResponse.json({ error: "Invalid confirmation date." }, { status: 400 });
    }
    confirmedAtDate = body.confirmedAt;
  }

  const sourceOverrideValue = (body.sourceOverride || "").trim();
  if (sourceOverrideValue && !(SOURCE_CATEGORIES as readonly string[]).includes(sourceOverrideValue)) {
    return NextResponse.json({ error: "Invalid source override category." }, { status: 400 });
  }

  if (!body.force) {
    const duplicate = await findDuplicateLead(adminSupabase, phone, email, id);
    if (duplicate) {
      return NextResponse.json({ duplicate: true, existing: duplicate }, { status: 409 });
    }
  }

  // source is stored as-is here (no "(manual)" suffix added/removed on
  // edit) -- editing an existing lead's source just corrects the label,
  // it doesn't retroactively change whether the row is flagged is_manual.
  const updatePayload: Record<string, unknown> = {
    source,
    name,
    email: email || null,
    phone: phone || null,
    country: country || null,
    treatment: treatment || null,
    hospital: hospital || null,
    message: message || null,
    internal_notes: internalNotes || null,
    confirmed_at: confirmedAtDate,
    source_override: sourceOverrideValue || null,
  };

  const { error } = await adminSupabase.from("leads").update(updatePayload).eq("id", id);

  if (error) {
    // internal_notes/hospital/confirmed_at/source_override may not exist
    // yet in an environment that hasn't run the relevant migration --
    // retry without them so the rest of the edit still saves, mirroring
    // the manual-create route's graceful degradation. first_contacted_at
    // is no longer settable here at all -- "Registered Date" is a
    // DB-level default now, never a manually picked value.
    if (["42703", "PGRST204"].includes((error as { code?: string }).code ?? "")) {
      const { internal_notes, hospital: _hospital, confirmed_at, source_override, ...fallbackPayload } = updatePayload;
      void internal_notes;
      void _hospital;
      void confirmed_at;
      void source_override;
      const { error: fallbackError } = await adminSupabase.from("leads").update(fallbackPayload).eq("id", id);
      if (fallbackError) {
        console.error("Lead update error (fallback):", fallbackError);
        return NextResponse.json({ error: "Failed to update lead." }, { status: 500 });
      }
    } else {
      console.error("Lead update error:", error);
      return NextResponse.json({ error: "Failed to update lead." }, { status: 500 });
    }
  }

  // Best-effort mirror onto the linked referral, if this lead is
  // partner-owned -- a no-op (0 rows matched, no error) for an MCT
  // patient. referrals.patient_country/patient_phone are NOT NULL, so
  // this is skipped (not attempted with nulls that would violate that
  // constraint) when either is blank; logged, never allowed to undo the
  // edit that already succeeded above.
  if (country && phone) {
    const { error: mirrorError } = await adminSupabase
      .from("referrals")
      .update({
        patient_full_name: name,
        patient_country: country,
        patient_phone: phone,
        patient_email: email || null,
        treatment: treatment || null,
      })
      .eq("lead_id", id);
    if (mirrorError) {
      console.error("Referral mirror-sync error (non-fatal):", mirrorError);
    }
  }

  revalidatePath("/admin/leads");
  revalidatePath(`/admin/leads/${id}`);
  return NextResponse.json({ ok: true });
}
