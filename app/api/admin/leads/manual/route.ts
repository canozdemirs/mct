import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { ADMIN_EMAILS } from "@/lib/admin";
import { isValidReferenceCodeFormat, type InferredChannel } from "@/lib/attribution";

const SOURCE_OPTIONS = [
  "WhatsApp",
  "Telefon",
  "E-posta",
  "Instagram/Facebook",
  "Tavsiye",
  "Partner",
  "Diğer",
];

function normalizeDigits(value: string) {
  return value.replace(/[^0-9]/g, "");
}

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

// --- GET: look up a reference code's click info before linking it to a
// manually-entered lead. Mirrors app/(dashboard)/admin/attribution/page.tsx's
// fetchAttributionRecord fallback (Phase 5K-C columns -> Phase 5K-A base
// columns if that migration isn't applied yet). Any other error (including
// PGRST205 if the table doesn't exist at all) is treated as "not found" --
// the form already hides this field entirely when the table is inaccessible
// (checked once, server-side, on page load), so this is just a second line
// of defense, not the primary gate.
type ClickInfo = {
  reference_code: string;
  channel: "whatsapp" | "email" | "form";
  created_at: string;
  lead_id: string | null;
  inferred_channel?: InferredChannel | null;
  last_touch_landing_page?: string | null;
  last_touch_utm_source?: string | null;
  last_touch_utm_campaign?: string | null;
};

const BASE_COLUMNS = "reference_code, channel, created_at, lead_id";
const SOURCE_COLUMNS = "inferred_channel, last_touch_landing_page, last_touch_utm_source, last_touch_utm_campaign";

async function fetchClickInfo(adminSupabase: SupabaseClient, code: string): Promise<ClickInfo | null> {
  const { data, error } = await adminSupabase
    .from("lead_attributions")
    .select(`${BASE_COLUMNS}, ${SOURCE_COLUMNS}`)
    .eq("reference_code", code)
    .maybeSingle();

  if (!error) return data as ClickInfo | null;

  const code_ = (error as { code?: string }).code;
  if (code_ === "42703" || code_ === "PGRST204") {
    const { data: baseData } = await adminSupabase
      .from("lead_attributions")
      .select(BASE_COLUMNS)
      .eq("reference_code", code)
      .maybeSingle();
    return baseData as ClickInfo | null;
  }

  return null;
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
  note?: string;
  firstContactedAt?: string;
  refCode?: string;
  force?: boolean;
};

type ExistingLeadRow = { id: string; name: string; phone: string | null; email: string | null; created_at: string };

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
  const note = (body.note || "").trim();
  const refCode = (body.refCode || "").trim().toUpperCase();

  if (!SOURCE_OPTIONS.includes(source)) {
    return NextResponse.json({ error: "Please select a valid source." }, { status: 400 });
  }
  if (!name) {
    return NextResponse.json({ error: "Please enter the patient's name." }, { status: 400 });
  }
  const phoneDigits = normalizeDigits(phone);
  if (phoneDigits.length < 7) {
    return NextResponse.json({ error: "Please enter a valid phone number." }, { status: 400 });
  }
  if (refCode && !isValidReferenceCodeFormat(refCode)) {
    return NextResponse.json({ error: "That reference code doesn't look valid (expected format: MCT-XXXXXX)." }, { status: 400 });
  }

  let firstContactedAtIso: string | null = null;
  if (body.firstContactedAt) {
    const parsed = new Date(body.firstContactedAt);
    if (Number.isNaN(parsed.getTime())) {
      return NextResponse.json({ error: "Invalid first-contact date." }, { status: 400 });
    }
    firstContactedAtIso = parsed.toISOString();
  }

  const adminSupabase = adminClient();
  const phoneTail = phoneDigits.slice(-10);

  if (!body.force) {
    const [{ data: phoneCandidates }, { data: emailCandidates }] = await Promise.all([
      adminSupabase
        .from("leads")
        .select("id, name, phone, email, created_at")
        .ilike("phone", `%${phoneTail}%`)
        .limit(5),
      email
        ? adminSupabase.from("leads").select("id, name, phone, email, created_at").ilike("email", email).limit(5)
        : Promise.resolve({ data: [] as ExistingLeadRow[] }),
    ]);

    const candidates = [...(phoneCandidates ?? []), ...(emailCandidates ?? [])] as ExistingLeadRow[];
    const duplicate = candidates.find((c) => {
      const phoneMatch = !!c.phone && phoneTail.length >= 7 && normalizeDigits(c.phone).slice(-10) === phoneTail;
      const emailMatch = !!email && !!c.email && c.email.toLowerCase() === email.toLowerCase();
      return phoneMatch || emailMatch;
    });

    if (duplicate) {
      return NextResponse.json(
        { duplicate: true, existing: { id: duplicate.id, name: duplicate.name, created_at: duplicate.created_at } },
        { status: 409 }
      );
    }
  }

  const sourceLabel = `${source} (manuel)`;
  const basePayload = {
    source: sourceLabel,
    name,
    email: email || null,
    phone,
    country: country || null,
    treatment: treatment || null,
    message: note || null,
    details: {},
    page_url: null,
    consent: false,
  };

  // is_manual / first_contacted_at require supabase/migrations/leads_manual_entry.sql
  // to have been run. If it hasn't yet, PostgREST returns 42703/PGRST204 for
  // the unknown columns -- retry without them so the lead is still saved,
  // same graceful-degradation pattern as lib/attribution-server.ts's
  // createReferenceCodeWithRetry.
  const fullPayload = { ...basePayload, is_manual: true, first_contacted_at: firstContactedAtIso };

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
    // lead_attributions table (PGRST205) or an unmatched code must never
    // undo the lead that was already saved above.
    await adminSupabase
      .from("lead_attributions")
      .update({ lead_id: inserted.id, status: "lead_confirmed" })
      .eq("reference_code", refCode);
  }

  revalidatePath("/admin/leads");

  return NextResponse.json({ ok: true, id: inserted?.id });
}
