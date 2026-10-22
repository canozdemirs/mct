// Phase 5K-A: unified patient reference-code system. Server-safe pure logic
// (code generation, HMAC rate-limit bucketing, decision logic) lives here so
// it can be unit-tested with node:test without touching Supabase or Next.js
// request/response types. Consent-gated marketing attribution (UTM/gclid,
// first-touch/session-touch capture) is explicitly OUT OF SCOPE for this
// phase -- see Phase 5K-A approval, section 6. Only reference_code, channel,
// created_at, lead_id and status exist in this phase's schema.

import { createHmac, randomBytes } from "crypto";
import { trackWhatsAppInitiated } from "./analytics.ts";
import { getSessionEntry } from "./session-entry.ts";

export type AttributionChannel = "whatsapp" | "email" | "form";

// Excludes 0/O and 1/I to avoid visual ambiguity when a patient reads the
// code aloud or a staff member transcribes it from a WhatsApp message.
const CODE_ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
const CODE_LENGTH = 6;
const CODE_PREFIX = "MCT-";

/** Generates one candidate reference code. Not guaranteed unique on its own
 * -- callers must check/retry against the database (see
 * createReferenceCodeWithRetry in the server-only attribution route). */
export function generateReferenceCode(): string {
  const bytes = randomBytes(CODE_LENGTH);
  let code = "";
  for (let i = 0; i < CODE_LENGTH; i++) {
    code += CODE_ALPHABET[bytes[i] % CODE_ALPHABET.length];
  }
  return CODE_PREFIX + code;
}

const REFERENCE_CODE_PATTERN = /^MCT-[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{6}$/;

export function isValidReferenceCodeFormat(code: string): boolean {
  return REFERENCE_CODE_PATTERN.test(code);
}

export function isValidChannel(value: unknown): value is AttributionChannel {
  return value === "whatsapp" || value === "email" || value === "form";
}

/**
 * HMAC-based rate-limit bucket key. Never store the raw IP -- only this
 * irreversible, keyed hash. Reuses SUPABASE_SERVICE_ROLE_KEY as the HMAC
 * secret rather than requiring a brand-new env var (it is already
 * server-only and already rotatable independently if needed).
 */
export function rateLimitBucketKey(ip: string, secret: string): string {
  return createHmac("sha256", secret).update(`attribution:${ip}`).digest("hex");
}

export type RateLimitDecisionInput = {
  windowStart: Date;
  requestCount: number;
  now: Date;
  windowMs: number;
  maxRequests: number;
};

export type RateLimitDecision =
  | { allowed: true; resetWindow: boolean }
  | { allowed: false; resetWindow: false };

/** Pure decision logic for the Supabase-backed rate limiter, isolated from
 * any DB call so it can be unit-tested directly. The caller is responsible
 * for reading the current bucket row and writing back the result. */
export function decideRateLimit(input: RateLimitDecisionInput): RateLimitDecision {
  const elapsed = input.now.getTime() - input.windowStart.getTime();
  if (elapsed >= input.windowMs) {
    // Window has expired -- this request starts a fresh window.
    return { allowed: true, resetWindow: true };
  }
  if (input.requestCount >= input.maxRequests) {
    return { allowed: false, resetWindow: false };
  }
  return { allowed: true, resetWindow: false };
}

const WHATSAPP_PENDING_STORAGE_KEY = "mct_wa_pending";
const WHATSAPP_PENDING_MAX_AGE_MS = 60_000;

export type PendingWhatsAppMessage = {
  message: string;
  createdAt: number;
};

/** Writes the prefilled WhatsApp message to localStorage immediately before
 * opening the transition tab/route. Deliberately uses localStorage (not
 * sessionStorage): it is unconditionally shared by origin regardless of how
 * the destination tab was opened, so the transition page does not have to
 * assume sessionStorage was copied to a new browsing context. Never placed
 * in a URL, query string, or sent to a server -- it never reaches browser
 * history or server logs. */
export function writePendingWhatsAppMessage(message: string): void {
  if (typeof window === "undefined") return;
  try {
    const payload: PendingWhatsAppMessage = { message, createdAt: Date.now() };
    window.localStorage.setItem(WHATSAPP_PENDING_STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // localStorage can throw (private browsing, quota, disabled) -- the
    // transition page's own fallback (generic message, no ref) covers this.
  }
}

/** Reads and immediately clears the pending WhatsApp message. Returns null
 * if absent, malformed, or older than WHATSAPP_PENDING_MAX_AGE_MS (guards
 * against a stale leftover value from an earlier, already-completed click
 * being reused by an unrelated later visit to the same route). */
export function readAndClearPendingWhatsAppMessage(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(WHATSAPP_PENDING_STORAGE_KEY);
    if (!raw) return null;
    window.localStorage.removeItem(WHATSAPP_PENDING_STORAGE_KEY);
    const parsed = JSON.parse(raw) as PendingWhatsAppMessage;
    if (typeof parsed.message !== "string" || typeof parsed.createdAt !== "number") return null;
    if (Date.now() - parsed.createdAt > WHATSAPP_PENDING_MAX_AGE_MS) return null;
    return parsed.message;
  } catch {
    return null;
  }
}

const WHATSAPP_CLICK_CONTEXT_KEY = "mct_wa_click_context";
const WHATSAPP_CLICK_CONTEXT_MAX_AGE_MS = 60_000;

export type WhatsAppClickContext = {
  landingPage: string | null;
  referrer: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  treatment: string | null;
  googleClickId: string | null;
};

// Best-effort, auto-derived from the page's own path -- mirrors the
// labels in components/marketing/CostCalculator.tsx's TREATMENT_OPTIONS,
// duplicated here (rather than imported) to keep this server-safe pure
// module decoupled from a "use client" marketing component. Pages that
// aren't treatment-specific (homepage, pricing overview, blog posts)
// correctly resolve to null -- the admin "Add from WhatsApp" flow still
// lets staff pick/correct the treatment manually either way.
const PATH_TO_TREATMENT: Record<string, string> = {
  "/hair-transplant-packages": "Hair Transplant",
  "/rhinoplasty-turkey": "Rhinoplasty",
  "/breast-augmentation-turkey": "Breast Augmentation",
  "/gynecomastia-turkey": "Gynecomastia",
  "/dental-implants-turkey": "Dental Implant",
  "/all-on-4-dental-implants-turkey": "All-on-4 Dental Implants",
  "/blepharoplasty-turkey": "Blepharoplasty",
  "/liposuction-turkey": "Liposuction",
  "/lasik-eye-surgery-turkey": "LASIK Eye Surgery",
  "/cataract-surgery-turkey": "Cataract Surgery",
  "/ivf-treatment-turkey": "IVF",
  "/medical-check-up-turkey": "Check-Up",
};

function guessTreatmentFromPath(pathname: string): string | null {
  return PATH_TO_TREATMENT[pathname] ?? null;
}

/** Captures the clicked-from page's own landing page/UTM, the session's
 * original entry referrer (lib/session-entry.ts -- more meaningful than
 * document.referrer at this point if the visitor has already navigated
 * internally), and a best-effort treatment guess. Stored the same
 * short-lived way as the pending message (localStorage, max age 60s) so
 * the /go/whatsapp transition page can read it after navigating. */
function captureWhatsAppClickContext(): void {
  if (typeof window === "undefined") return;
  try {
    const params = new URLSearchParams(window.location.search);
    const context: WhatsAppClickContext = {
      landingPage: window.location.pathname || null,
      referrer: getSessionEntry()?.referrer ?? (document.referrer || null),
      utmSource: params.get("utm_source"),
      utmMedium: params.get("utm_medium"),
      utmCampaign: params.get("utm_campaign"),
      treatment: guessTreatmentFromPath(window.location.pathname),
      googleClickId: params.get("gclid") || params.get("gbraid") || params.get("wbraid"),
    };
    window.localStorage.setItem(WHATSAPP_CLICK_CONTEXT_KEY, JSON.stringify({ context, createdAt: Date.now() }));
  } catch {
    // Same non-fatal posture as writePendingWhatsAppMessage -- the
    // transition page's own fallback covers a missing context.
  }
}

export function readAndClearWhatsAppClickContext(): WhatsAppClickContext | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(WHATSAPP_CLICK_CONTEXT_KEY);
    if (!raw) return null;
    window.localStorage.removeItem(WHATSAPP_CLICK_CONTEXT_KEY);
    const parsed = JSON.parse(raw) as { context: WhatsAppClickContext; createdAt: number };
    if (typeof parsed.createdAt !== "number") return null;
    if (Date.now() - parsed.createdAt > WHATSAPP_CLICK_CONTEXT_MAX_AGE_MS) return null;
    return parsed.context;
  } catch {
    return null;
  }
}

export const WHATSAPP_NUMBER = "908508888911";
export const WHATSAPP_GENERIC_MESSAGE = "Hello, I would like information about your treatments.";

export function buildWhatsAppUrl(message: string, referenceCode: string | null): string {
  const text = referenceCode ? `${message}\n\nRef: ${referenceCode}` : message;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

// ============================================================================
// Phase 5K-C: patient acquisition-source attribution.
//
// Three things that must never be confused (per the task's own explicit
// requirement):
//   1. Observed technical evidence   -- a UTM string or gclid that was
//      literally present in a URL. Verbatim, never altered.
//   2. Inferred acquisition channel  -- a label this module computes FROM
//      that evidence using the heuristic below. Always a guess, never a
//      proof -- a visitor can manually add "?utm_source=google" to any
//      link.
//   3. Verified Google Ads conversion -- only Google Ads itself can state
//      this, by actually recording a conversion in its own system. Nothing
//      in this file ever claims to produce #3.
// ============================================================================

export type InferredChannel =
  | "google_ads"
  | "google_organic"
  | "other_paid"
  | "referral"
  | "direct_inferred"
  | "unknown";

export type AttributionEvidence = {
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  utmContent?: string | null;
  utmTerm?: string | null;
  gclid?: string | null;
  gbraid?: string | null;
  wbraid?: string | null;
  referrer?: string | null;
  landingPage?: string | null;
};

// Exported for reuse by lib/patient-source.ts's computePatientSource()
// (the Patients list "Source" acquisition-category classifier) -- kept
// here since this file owns the canonical definition.
export const PAID_MEDIA_MEDIUMS = ["cpc", "ppc", "paid", "display", "paidsocial", "paid-social"];

// Google's actual search-results hostnames (any subdomain of these, e.g.
// "www.google.com", "google.co.uk") -- a finite, known list, not a loose
// regex. A naive "hostname contains 'google'" or "ends in letters/dots
// after 'google.'" check would incorrectly match an attacker- or
// third-party-controlled host like "google.evil.com" (every label after
// "google." there is still just letters/dots). Checking against this
// explicit suffix list avoids that false positive.
export const GOOGLE_SEARCH_SUFFIXES = [
  "google.com", "google.co.uk", "google.ca", "google.com.au", "google.co.jp",
  "google.co.in", "google.de", "google.fr", "google.it", "google.es", "google.nl",
  "google.com.tr", "google.com.br", "google.co.id", "google.co.nz", "google.ie",
  "google.com.mx", "google.ae", "google.ch", "google.at", "google.be", "google.se",
];

function isGoogleSearchHostname(hostname: string): boolean {
  if (!hostname) return false;
  return GOOGLE_SEARCH_SUFFIXES.some((suffix) => hostname === suffix || hostname.endsWith(`.${suffix}`));
}

/**
 * Pure, testable classification. Every branch is a heuristic, never a
 * certainty -- callers (the admin UI especially) must present the result
 * as "inferred", not as fact. "unknown" is returned whenever evidence is
 * genuinely insufficient, rather than guessing toward a specific channel.
 */
export function inferChannel(evidence: AttributionEvidence): InferredChannel {
  const hasGoogleClickId = Boolean(evidence.gclid || evidence.gbraid || evidence.wbraid);
  const source = (evidence.utmSource || "").trim().toLowerCase();
  const medium = (evidence.utmMedium || "").trim().toLowerCase();
  const isPaidMedium = PAID_MEDIA_MEDIUMS.includes(medium);

  if (hasGoogleClickId) return "google_ads";
  if (isPaidMedium && source === "google") return "google_ads";
  if (isPaidMedium && source && source !== "google") return "other_paid";

  let referrerHost = "";
  try {
    if (evidence.referrer) referrerHost = new URL(evidence.referrer).hostname.toLowerCase();
  } catch {
    referrerHost = "";
  }
  const referrerIsGoogle = isGoogleSearchHostname(referrerHost);

  if (referrerIsGoogle && !source && !medium) return "google_organic";
  if (referrerHost && !referrerIsGoogle && !source && !medium) return "referral";
  if (!evidence.referrer && !source && !medium && !hasGoogleClickId) return "direct_inferred";

  return "unknown";
}

const FIRST_TOUCH_STORAGE_KEY = "mct_attribution_first_touch";
const SESSION_TOUCH_STORAGE_KEY = "mct_attribution_session_touch";

type CapturedTouch = AttributionEvidence & { capturedAt: number };

function readUtmFromLocation(): AttributionEvidence {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  return {
    utmSource: params.get("utm_source"),
    utmMedium: params.get("utm_medium"),
    utmCampaign: params.get("utm_campaign"),
    utmContent: params.get("utm_content"),
    utmTerm: params.get("utm_term"),
    gclid: params.get("gclid"),
    gbraid: params.get("gbraid"),
    wbraid: params.get("wbraid"),
    referrer: document.referrer || null,
    landingPage: window.location.pathname,
  };
}

/**
 * Captures first-touch (written once, never overwritten, localStorage) and
 * session/last-touch (overwritten every page view, sessionStorage) touch
 * data -- but ONLY when the relevant consent category is granted:
 * `ad_storage` for gclid/gbraid/wbraid (Google's own click identifiers),
 * `analytics_storage` for everything else (UTM fields, referrer, landing
 * page). Call on every page load; it is a no-op (writes nothing) when
 * neither consent category is granted, and partially writes only the
 * categories that ARE granted otherwise. Never throws if storage is
 * unavailable.
 */
export function captureTouchIfConsented(consent: { analytics: boolean; advertising: boolean }): void {
  if (typeof window === "undefined") return;
  if (!consent.analytics && !consent.advertising) return;

  const raw = readUtmFromLocation();
  const evidence: AttributionEvidence = {};
  if (consent.analytics) {
    evidence.utmSource = raw.utmSource;
    evidence.utmMedium = raw.utmMedium;
    evidence.utmCampaign = raw.utmCampaign;
    evidence.utmContent = raw.utmContent;
    evidence.utmTerm = raw.utmTerm;
    evidence.referrer = raw.referrer;
    evidence.landingPage = raw.landingPage;
  }
  if (consent.advertising) {
    evidence.gclid = raw.gclid;
    evidence.gbraid = raw.gbraid;
    evidence.wbraid = raw.wbraid;
  }
  // Nothing granted produced any evidence worth storing (e.g. analytics
  // granted but the URL had no UTM/referrer at all) -- still fine to skip.
  const hasAnyValue = Object.values(evidence).some((v) => v);
  if (!hasAnyValue) return;

  const touch: CapturedTouch = { ...evidence, capturedAt: Date.now() };
  try {
    if (!window.localStorage.getItem(FIRST_TOUCH_STORAGE_KEY)) {
      window.localStorage.setItem(FIRST_TOUCH_STORAGE_KEY, JSON.stringify(touch));
    }
    window.sessionStorage.setItem(SESSION_TOUCH_STORAGE_KEY, JSON.stringify(touch));
  } catch {
    // Storage unavailable -- nothing to capture this visit, not an error.
  }
}

function readTouch(key: string, storage: "local" | "session"): CapturedTouch | null {
  if (typeof window === "undefined") return null;
  try {
    const store = storage === "local" ? window.localStorage : window.sessionStorage;
    const raw = store.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as CapturedTouch;
  } catch {
    return null;
  }
}

/** Reads back whatever was captured (first-touch, session-touch), for
 * inclusion in a /api/attribution or /api/leads request body. Returns
 * nulls for everything if nothing was ever captured (e.g. consent never
 * granted) -- callers must send this as "no evidence", never fabricate. */
export function getCapturedAttribution(): { firstTouch: CapturedTouch | null; sessionTouch: CapturedTouch | null } {
  return {
    firstTouch: readTouch(FIRST_TOUCH_STORAGE_KEY, "local"),
    sessionTouch: readTouch(SESSION_TOUCH_STORAGE_KEY, "session"),
  };
}

/**
 * Site-wide lead-attribution fix (2026-10-14): every direct/quick WhatsApp
 * entry point (floating buttons, contact bar, the 11 landing-page hero
 * CTAs, the hospital-page sidebar link, the post-submit "message us"
 * CTA) previously called this with a flat, page-agnostic message -- staff
 * receiving the WhatsApp chat had no way to tell which hospital, treatment
 * or blog article the patient had been looking at. Appending the clean
 * page URL here, once, fixes all of those call sites together without
 * touching each one individually. Deliberately origin+pathname only, never
 * the full href -- the query string can carry UTM/gclid tracking
 * parameters, and this line is appended to a message the patient
 * themselves sees and sends, so no tracking parameter should ever be
 * surfaced to them. The one call site that already builds a rich,
 * page-aware message (consultation-form.tsx, which includes an explicit
 * "Source: <label>" line) still benefits from this -- it gains a precise,
 * clickable URL in addition to its existing human-readable label, not a
 * duplicate of it.
 */
function appendPageContext(message: string): string {
  if (typeof window === "undefined") return message;
  const page = `${window.location.origin}${window.location.pathname}`;
  return `${message}\n\nPage: ${page}`;
}

/**
 * Every WhatsApp entry point that hasn't collected any patient input yet
 * (floating button, contact bar, the 12 landing pages' hero CTAs, the
 * post-submit "message us" CTA) passes the shared WHATSAPP_GENERIC_MESSAGE
 * constant verbatim. Centralizing the page-awareness here, rather than
 * editing each of those call sites individually, guarantees it can never
 * be missed at one of them -- same reasoning as appendPageContext() above.
 * A caller that already built its own specific message (the consultation/
 * landing forms, which include the patient's own answers) is untouched.
 */
function resolveGenericMessage(message: string): string {
  if (message !== WHATSAPP_GENERIC_MESSAGE || typeof window === "undefined") return message;
  const treatment = guessTreatmentFromPath(window.location.pathname);
  return treatment ? `Hello, I would like information about ${treatment}.` : message;
}

/**
 * Opens the WhatsApp transition route synchronously, in direct response to
 * a user click (must be called from inside the click handler itself, with
 * no `await` before it -- that is what keeps this from being treated as a
 * non-user-initiated popup). Writes the prefilled message to localStorage
 * first, then tries window.open(); if the browser blocked it (returns
 * null/undefined, as virtually all browsers do for a blocked popup), falls
 * back to a same-tab navigation to the same route instead -- the patient
 * always ends up on /go/whatsapp, in a new tab when allowed, in the
 * current tab otherwise.
 */
export function openWhatsAppTransition(message: string): void {
  writePendingWhatsAppMessage(appendPageContext(resolveGenericMessage(message)));
  captureWhatsAppClickContext();
  // Fired exactly once per call -- this function is the single, shared
  // entry point used by all 15 WhatsApp links/buttons on the site, so
  // centralizing the event push here (rather than at each call site)
  // guarantees it can never be duplicated or missed at one of them.
  trackWhatsAppInitiated();
  const win = window.open("/go/whatsapp", "_blank");
  if (!win) {
    window.location.href = "/go/whatsapp";
  }
}
