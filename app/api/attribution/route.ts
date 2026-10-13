import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { isValidChannel } from "@/lib/attribution";
import { createReferenceCodeWithRetry, checkAttributionRateLimit, isPlausibleTouchPayload, type TouchPayload } from "@/lib/attribution-server";

// Phase 5K-A: generates a reference code for the whatsapp/email channels
// (the form channel generates its own code server-side inside
// app/api/leads/route.ts -- see that file for why). Write-only: this
// endpoint never accepts or returns anything beyond a freshly generated
// code for the SAME caller. There is no lookup/read capability here and
// never should be -- staff lookup is a separate, authenticated,
// server-side-authorized page (app/(dashboard)/admin/attribution).
//
// Phase 5K-C: optionally accepts first-touch/session-touch marketing
// evidence (lib/attribution.ts's getCapturedAttribution() output) -- only
// ever whatever the CLIENT already captured under consent (see
// captureTouchIfConsented()); this route does not decide consent itself,
// it just stores what it's handed. Every field is treated as untrusted,
// unverified browser input (see attribution-server.ts's sanitizeField) --
// never as confirmed campaign data.

// Same best-effort, resets-on-cold-start pattern as /api/leads -- a cheap
// first line of defense against one warm instance being hammered.
// attribution_rate_limits.sql (not yet applied) is the cross-instance
// second layer once deployed.
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 5;
const rateLimitLog = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (rateLimitLog.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  recent.push(now);
  rateLimitLog.set(ip, recent);
  return recent.length > RATE_LIMIT_MAX;
}

export async function POST(req: NextRequest) {
  let body: { channel?: unknown; firstTouch?: unknown; sessionTouch?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!isValidChannel(body.channel) || body.channel === "form") {
    // "form" deliberately rejected here -- that channel's code is created
    // inside app/api/leads/route.ts, in the same request as the lead
    // insert, per the Phase 5K-A correction (no second client-side
    // attribution request for form submissions).
    return NextResponse.json({ error: "Invalid channel." }, { status: 400 });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  }

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    console.error("Attribution route: SUPABASE_SERVICE_ROLE_KEY is not configured.");
    return NextResponse.json({ error: "Attribution unavailable." }, { status: 503 });
  }

  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, serviceRoleKey);

  // Cross-instance rate limit. Security requirement explicitly allows this
  // control to be prepared now and activated once attribution_rate_limits
  // is applied to a real database -- until then, a missing table is caught
  // and logged, never allowed to block the patient-facing action.
  try {
    const result = await checkAttributionRateLimit(supabase, ip, serviceRoleKey);
    if (!result.allowed) {
      return NextResponse.json({ error: "Too many requests." }, { status: 429 });
    }
  } catch (err) {
    console.error("Attribution rate-limit check failed (table likely not yet deployed):", err);
  }

  const touch = {
    firstTouch: isPlausibleTouchPayload(body.firstTouch) ? (body.firstTouch as TouchPayload) : null,
    sessionTouch: isPlausibleTouchPayload(body.sessionTouch) ? (body.sessionTouch as TouchPayload) : null,
  };

  const code = await createReferenceCodeWithRetry(supabase, body.channel, undefined, undefined, touch);
  if (!code) {
    // Never a hard failure for the caller -- the WhatsApp/email flow's own
    // fallback (no Ref: line) covers this exactly as it covers a timeout.
    return NextResponse.json({ error: "Could not generate a reference code." }, { status: 503 });
  }

  return NextResponse.json({ code });
}
