import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { ADMIN_EMAILS } from "@/lib/admin";
import { isValidReferenceCodeFormat } from "@/lib/attribution";
import { validateLeadContactFields, findDuplicateLead } from "@/lib/admin-lead-helpers";

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

async function requireAdmin() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !ADMIN_EMAILS.includes(user.email ?? "")) {
    return null;
  }
  return user;
}

// --- GET: look up a reference code's click info (contact_clicks -- see
// supabase/migrations/contact_clicks.sql) before linking it to a
// manually-entered lead, powering the "Add from WhatsApp" flow in
// add-manual-lead-form.tsx. Any error (including PGRST205 if the
// migration hasn't been run yet) is treated as "not found" -- the form
// already hides this field entirely when the table is inaccessible
// (checked once, server-side, on page load), so this is just a second
// line of defense, not the primary gate.
type ClickInfo = {
  reference_code: string;
  channel: "whatsapp" | "email";
  created_at: string;
  lead_id: string | null;
  landing_page: string | null;
  referrer_domain: string | null;
  utm_source: string | null;
  utm_campaign: string | null;
  treatment: string | null;
};

const CLICK_COLUMNS = "reference_code, channel, created_at, lead_id, landing_page, referrer_domain, utm_source, utm_campaign, treatment";

async function fetchClickInfo(adminSupabase: SupabaseClient, code: string): Promise<ClickInfo | null> {
  const { data, error } = await adminSupabase
    .from("contact_clicks")
    .select(CLICK_COLUMNS)
    .eq("reference_code", code)
    .maybeSingle();

  if (error) return null;
  return data as ClickInfo | null;
}

export async function GET(req: NextRequest) {
  const user = await requireAdmin();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const code = (req.nextUrl.searchParams.get("ref") || "").trim().toUpperCase();
  if (!code || !isValidReferenceCodeFormat(code)) {
    return NextResponse.json({ error: "Invalid reference code format." }, { status: 400 });
  }

  const record = await fetchClickInfo(adminClient(), code);
  if (!record) {
    return NextResponse.json({ error: "No record found for that reference code." }, { status: 404 });
  }

  return NextResponse.json({ record });
}

// --- POST: create a manually-entered lead.
type ManualLeadBody = {
  source?: string;
  name?: string;
  phone?: string;
  email?: string;
  country?: string;
  treatment?: string;
  internalNotes?: string;
  refCode?: string;
  force?: boolean;
};

export async function POST(req: NextRequest) {
  const user = await requireAdmin();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null) as ManualLeadBody | null;
  if (!body) {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const source = (body.source || "").trim();
  const name = (body.name || "").trim();
  const phone = (body.phone || "").trim();
  const email = (body.email || "").trim();
  const country = (body.country || "").trim();
  const treatment = (body.treatment || "").trim();
  const internalNotes = (body.internalNotes || "").trim();
  const refCode = (body.refCode || "").trim().toUpperCase();

  const fieldError = validateLeadContactFields({ source, name, phone, email });
  if (fieldError) {
    return NextResponse.json({ error: fieldError }, { status: 400 });
  }
  if (refCode && !isValidReferenceCodeFormat(refCode)) {
    return NextResponse.json({ error: "That reference code doesn't look valid (expected format: MCT-XXXXXX)." }, { status: 400 });
  }

  const adminSupabase = adminClient();

  if (!body.force) {
    const duplicate = await findDuplicateLead(adminSupabase, phone, email);
    if (duplicate) {
      return NextResponse.json({ duplicate: true, existing: duplicate }, { status: 409 });
    }
  }

  const sourceLabel = `${source} (manual)`;
  const basePayload = {
    source: sourceLabel,
    name,
    email: email || null,
    phone: phone || null,
    country: country || null,
    treatment: treatment || null,
    internal_notes: internalNotes || null,
    details: {},
    page_url: null,
    consent: false,
  };

  // is_manual requires supabase/migrations/leads_manual_entry.sql to have
  // been run. If it hasn't yet, PostgREST returns 42703/PGRST204 for the
  // unknown column -- retry without it so the lead is still saved, same
  // graceful-degradation pattern as lib/attribution-server.ts's
  // createReferenceCodeWithRetry. first_contacted_at is no longer set
  // here at all -- "Registered Date" is now a DB-level default (now()),
  // never a manually picked value (supabase/migrations/contact_clicks.sql).
  const fullPayload = { ...basePayload, is_manual: true };

  let inserted: { id: string } | null = null;
  const { data: fullInsert, error: fullError } = await adminSupabase
    .from("leads")
    .insert(fullPayload)
    .select("id")
    .single();

  if (!fullError) {
    inserted = fullInsert;
  } else if (["42703", "PGRST204"].includes((fullError as { code?: string }).code ?? "")) {
    const { data: fallbackInsert, error: fallbackError } = await adminSupabase
      .from("leads")
      .insert(basePayload)
      .select("id")
      .single();
    if (fallbackError) {
      console.error("Manual lead insert error (fallback):", fallbackError);
      return NextResponse.json({ error: "Failed to create lead." }, { status: 500 });
    }
    inserted = fallbackInsert;
  } else {
    console.error("Manual lead insert error:", fullError);
    return NextResponse.json({ error: "Failed to create lead." }, { status: 500 });
  }

  if (refCode && inserted) {
    // Best-effort link -- supabase-js never throws here, it returns
    // { error }, which is deliberately ignored: a missing/inaccessible
    // contact_clicks table (PGRST205) or an unmatched code must never
    // undo the lead that was already saved above.
    await adminSupabase
      .from("contact_clicks")
      .update({ lead_id: inserted.id })
      .eq("reference_code", refCode);
  }

  revalidatePath("/admin/leads");

  return NextResponse.json({ ok: true, id: inserted?.id });
}
