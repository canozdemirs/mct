import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { ADMIN_EMAILS } from "@/lib/admin";
import { validateLeadContactFields, findDuplicateLead } from "@/lib/admin-lead-helpers";

const VALID_STATUSES = ["new", "contacted", "closed"];

type EditLeadBody = {
  status?: string;
  source?: string;
  name?: string;
  phone?: string;
  email?: string;
  country?: string;
  treatment?: string;
  note?: string;
  firstContactedAt?: string;
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

  // Every field below is optional on this type, so a request with ONLY
  // `status` (the existing per-row status dropdown, components/admin/
  // lead-status-select.tsx) falls through to this exact same branch and
  // behavior it always had -- no validation, no dedupe check, just the
  // status column. The fuller "Edit" modal always sends every field
  // together, which is what routes it into the extended path below.
  const hasExtendedFields = [
    body.source, body.name, body.phone, body.email,
    body.country, body.treatment, body.note, body.firstContactedAt,
  ].some((v) => v !== undefined);

  if (!hasExtendedFields) {
    if (!body.status || !VALID_STATUSES.includes(body.status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const { error } = await adminSupabase.from("leads").update({ status: body.status }).eq("id", id);
    if (error) {
      console.error("Lead status update error:", error);
      return NextResponse.json({ error: "Failed to update lead status." }, { status: 500 });
    }

    revalidatePath("/admin/leads");
    return NextResponse.json({ ok: true });
  }

  if (body.status && !VALID_STATUSES.includes(body.status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const source = (body.source || "").trim();
  const name = (body.name || "").trim();
  const phone = (body.phone || "").trim();
  const email = (body.email || "").trim();
  const country = (body.country || "").trim();
  const treatment = (body.treatment || "").trim();
  const note = (body.note || "").trim();

  const fieldError = validateLeadContactFields({ source, name, phone, email }, false);
  if (fieldError) {
    return NextResponse.json({ error: fieldError }, { status: 400 });
  }

  let firstContactedAtIso: string | null = null;
  if (body.firstContactedAt) {
    const parsed = new Date(body.firstContactedAt);
    if (Number.isNaN(parsed.getTime())) {
      return NextResponse.json({ error: "Invalid first-contact date." }, { status: 400 });
    }
    firstContactedAtIso = parsed.toISOString();
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
    message: note || null,
    first_contacted_at: firstContactedAtIso,
  };
  if (body.status) {
    updatePayload.status = body.status;
  }

  const { error } = await adminSupabase.from("leads").update(updatePayload).eq("id", id);

  if (error) {
    // first_contacted_at may not exist yet if leads_manual_entry.sql
    // hasn't been run in this environment -- retry without it so the
    // rest of the edit still saves, mirroring the manual-create route's
    // graceful degradation.
    if (["42703", "PGRST204"].includes((error as { code?: string }).code ?? "")) {
      const { first_contacted_at, ...fallbackPayload } = updatePayload;
      void first_contacted_at;
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

  revalidatePath("/admin/leads");
  return NextResponse.json({ ok: true });
}
