// Phase 5K-A: server-only Supabase-touching attribution helpers, shared by
// app/api/attribution/route.ts (whatsapp/email channels) and
// app/api/leads/route.ts (form channel, generated before insert per the
// corrected flow -- see that route for the exact sequencing). Never
// imported by a "use client" file.

import type { SupabaseClient } from "@supabase/supabase-js";
import {
  generateReferenceCode,
  rateLimitBucketKey,
  decideRateLimit,
  inferChannel,
  type AttributionChannel,
  type AttributionEvidence,
} from "./attribution.ts";

const MAX_CODE_RETRIES = 5;
const MAX_FIELD_LENGTH = 500;

export type TouchPayload = (AttributionEvidence & { capturedAt?: number }) | null | undefined;

/** Loose shape check for a JSON-parsed request body field that's supposed
 * to be touch evidence -- rejects anything that isn't at least an object,
 * without otherwise validating field-by-field (sanitizeField/
 * buildTouchColumns already treat every individual field as untrusted). */
export function isPlausibleTouchPayload(value: unknown): value is TouchPayload {
  return typeof value === "object" && value !== null;
}

// Browser-supplied UTM/gclid/referrer values are not verified data -- a
// visitor's own browser controls every one of them. Treated here purely
// as untrusted input: capped in length (a crafted request pasting a huge
// string gains nothing) and passed through as opaque text, never
// interpreted as markup or executed. The admin lookup page (a React
// Server Component rendering plain text, not dangerouslySetInnerHTML)
// already HTML-escapes on render, same as the rest of this project's
// lead-detail displays.
function sanitizeField(value: string | null | undefined): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  return trimmed.slice(0, MAX_FIELD_LENGTH);
}

function buildTouchColumns(prefix: "first_touch" | "last_touch", touch: TouchPayload) {
  if (!touch) {
    return {
      [`${prefix}_landing_page`]: null,
      [`${prefix}_referrer`]: null,
      [`${prefix}_utm_source`]: null,
      [`${prefix}_utm_medium`]: null,
      [`${prefix}_utm_campaign`]: null,
      [`${prefix}_utm_content`]: null,
      [`${prefix}_utm_term`]: null,
      [`${prefix}_gclid`]: null,
      [`${prefix}_gbraid`]: null,
      [`${prefix}_wbraid`]: null,
      [`${prefix}_at`]: null,
    };
  }
  return {
    [`${prefix}_landing_page`]: sanitizeField(touch.landingPage),
    [`${prefix}_referrer`]: sanitizeField(touch.referrer),
    [`${prefix}_utm_source`]: sanitizeField(touch.utmSource),
    [`${prefix}_utm_medium`]: sanitizeField(touch.utmMedium),
    [`${prefix}_utm_campaign`]: sanitizeField(touch.utmCampaign),
    [`${prefix}_utm_content`]: sanitizeField(touch.utmContent),
    [`${prefix}_utm_term`]: sanitizeField(touch.utmTerm),
    [`${prefix}_gclid`]: sanitizeField(touch.gclid),
    [`${prefix}_gbraid`]: sanitizeField(touch.gbraid),
    [`${prefix}_wbraid`]: sanitizeField(touch.wbraid),
    [`${prefix}_at`]: touch.capturedAt ? new Date(touch.capturedAt).toISOString() : null,
  };
}

/**
 * Generates a reference code and inserts a new lead_attributions row,
 * retrying on a unique-constraint collision (astronomically unlikely with
 * this alphabet/length, but handled rather than assumed away). Returns the
 * created row's code, or null if every retry collided (never thrown --
 * callers must treat a null return the same as "attribution unavailable
 * right now" and continue the patient-facing action regardless).
 */
export async function createReferenceCodeWithRetry(
  supabase: SupabaseClient,
  channel: AttributionChannel,
  leadId?: string,
  preferredCode?: string,
  touch?: { firstTouch?: TouchPayload; sessionTouch?: TouchPayload }
): Promise<string | null> {
  // inferred_channel is computed from the session/last touch -- the
  // evidence closest to the actual conversion action -- per the plan's
  // "last-touch drives the classification, first-touch is additional
  // context" design. Requires the lead_attributions_source_fields.sql
  // migration to be applied; if the columns don't exist yet, this insert
  // simply fails the same graceful way any other missing-table case
  // already does (caught by the existing non-collision error branch
  // below, logged, returns null, never blocks the patient-facing action).
  const inferredChannel = touch?.sessionTouch ? inferChannel(touch.sessionTouch) : null;

  // Columns-not-yet-migrated detection: Postgres undefined_column (42703)
  // or PostgREST's own "column not found in schema cache" code (PGRST204).
  // lead_attributions_source_fields.sql may not be applied yet -- this
  // function must work correctly either way, in either order relative to
  // that migration, never breaking the base (Phase 5K-A) reference-code
  // system just because the newer source-attribution columns don't exist.
  function isMissingColumnError(err: unknown): boolean {
    const code = (err as { code?: string } | null)?.code;
    return code === "42703" || code === "PGRST204";
  }

  let sourceFieldsUnavailable = false;

  for (let attempt = 0; attempt < MAX_CODE_RETRIES; attempt++) {
    const code = attempt === 0 && preferredCode ? preferredCode : generateReferenceCode();
    const baseRow = {
      reference_code: code,
      channel,
      lead_id: leadId ?? null,
      status: leadId ? "lead_confirmed" : "contact_initiated",
    };
    const row = sourceFieldsUnavailable
      ? baseRow
      : {
          ...baseRow,
          inferred_channel: inferredChannel,
          ...buildTouchColumns("first_touch", touch?.firstTouch),
          ...buildTouchColumns("last_touch", touch?.sessionTouch),
        };

    const { error } = await supabase.from("lead_attributions").insert(row);
    if (!error) return code;

    if (!sourceFieldsUnavailable && isMissingColumnError(error)) {
      // Migration not applied yet -- retry this SAME code immediately
      // without the new columns, rather than consuming a collision-retry
      // attempt or giving up. Does not advance the loop's attempt count
      // semantics in a harmful way: worst case we use one extra iteration.
      sourceFieldsUnavailable = true;
      console.error("lead_attributions: source-attribution columns not yet migrated, inserting without them");
      const { error: retryError } = await supabase.from("lead_attributions").insert(baseRow);
      if (!retryError) return code;
      if ((retryError as { code?: string }).code !== "23505") {
        console.error("lead_attributions insert error (non-collision):", retryError);
        return null;
      }
      continue;
    }

    // Postgres unique_violation is 23505 -- only that specific error is
    // worth retrying with a new code; any other error (RLS, connectivity,
    // etc.) will fail identically on retry, so stop immediately.
    if ((error as { code?: string }).code !== "23505") {
      console.error("lead_attributions insert error (non-collision):", error);
      return null;
    }
  }
  console.error(`lead_attributions: exhausted ${MAX_CODE_RETRIES} reference-code collision retries`);
  return null;
}

/**
 * Generates a reference code WITHOUT inserting a lead_attributions row yet
 * -- used by the form flow, which must decide the code string before the
 * `leads` insert (so it can be embedded in `details.reference_code`), then
 * create the linked lead_attributions row only after the lead itself
 * exists. The uniqueness check here is a best-effort pre-check (a SELECT,
 * not an insert) so the lead insert never has to wait on a second table's
 * write lock; the actual correctness guarantee is still the unique index
 * in lead_attributions, enforced at the real insert in step 4.
 */
export async function reserveReferenceCode(supabase: SupabaseClient): Promise<string> {
  for (let attempt = 0; attempt < MAX_CODE_RETRIES; attempt++) {
    const code = generateReferenceCode();
    const { data } = await supabase
      .from("lead_attributions")
      .select("id")
      .eq("reference_code", code)
      .maybeSingle();
    if (!data) return code;
  }
  // Even if every pre-check attempt somehow collided (astronomically
  // unlikely), returning the last-generated code is still safe: the real
  // insert in createReferenceCodeWithRetry() has its own collision retry.
  return generateReferenceCode();
}

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 5;

/**
 * Supabase-backed, cross-instance rate limiter for POST /api/attribution.
 * Complements (does not replace) the in-memory per-IP limiter already used
 * by /api/leads -- that one is a cheap first line of defense against a
 * burst hitting one warm instance; this one survives cold starts and is
 * consistent across concurrent serverless instances. Never stores the raw
 * IP, only its HMAC digest (lib/attribution.ts, rateLimitBucketKey()).
 */
export async function checkAttributionRateLimit(
  supabase: SupabaseClient,
  ip: string,
  hmacSecret: string
): Promise<{ allowed: boolean }> {
  const bucketKey = rateLimitBucketKey(ip, hmacSecret);
  const now = new Date();

  const { data: existing } = await supabase
    .from("attribution_rate_limits")
    .select("window_start, request_count")
    .eq("bucket_key", bucketKey)
    .maybeSingle();

  if (!existing) {
    const { error } = await supabase
      .from("attribution_rate_limits")
      .insert({ bucket_key: bucketKey, window_start: now.toISOString(), request_count: 1 });
    // A unique-violation here means a concurrent request just created the
    // same bucket first -- treat as allowed; the next request will see it.
    if (error && (error as { code?: string }).code !== "23505") {
      console.error("attribution_rate_limits insert error:", error);
    }
    return { allowed: true };
  }

  const decision = decideRateLimit({
    windowStart: new Date(existing.window_start),
    requestCount: existing.request_count,
    now,
    windowMs: RATE_LIMIT_WINDOW_MS,
    maxRequests: RATE_LIMIT_MAX_REQUESTS,
  });

  if (!decision.allowed) return { allowed: false };

  const { error } = await supabase
    .from("attribution_rate_limits")
    .update(
      decision.resetWindow
        ? { window_start: now.toISOString(), request_count: 1 }
        : { request_count: existing.request_count + 1 }
    )
    .eq("bucket_key", bucketKey);
  if (error) console.error("attribution_rate_limits update error:", error);

  return { allowed: true };
}
