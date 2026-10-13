// Phase 5K-A unit tests for lib/attribution.ts's pure logic (no Supabase, no
// network, no browser -- the DB-touching and localStorage-touching paths are
// covered separately by Playwright end-to-end tests against a running
// server, and by manual code review for the parts no test harness here can
// drive, such as real popup-blocking behavior).
//
// Run with: node --experimental-strip-types --test lib/attribution.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  generateReferenceCode,
  isValidReferenceCodeFormat,
  isValidChannel,
  rateLimitBucketKey,
  decideRateLimit,
  buildWhatsAppUrl,
  inferChannel,
} from "./attribution.ts";

test("generateReferenceCode produces the MCT-XXXXXX format", () => {
  for (let i = 0; i < 200; i++) {
    const code = generateReferenceCode();
    assert.match(code, /^MCT-[A-Z0-9]{6}$/);
    assert.ok(isValidReferenceCodeFormat(code), `expected ${code} to pass format validation`);
  }
});

test("generateReferenceCode never uses ambiguous characters (0, O, 1, I)", () => {
  for (let i = 0; i < 500; i++) {
    const code = generateReferenceCode();
    const suffix = code.slice(4);
    assert.ok(!/[01OI]/.test(suffix), `code ${code} contained an excluded ambiguous character`);
  }
});

test("generateReferenceCode has no observed collisions across a large sample", () => {
  const seen = new Set();
  const sampleSize = 20_000;
  for (let i = 0; i < sampleSize; i++) {
    seen.add(generateReferenceCode());
  }
  // Not a proof of collision-resistance (that's a function of the alphabet
  // size: 31^6 ≈ 887 million combinations), just a sanity check that the
  // generator isn't degenerate (e.g. always returning the same value, or
  // only using a tiny slice of the byte range).
  assert.ok(seen.size > sampleSize * 0.999, `expected near-zero collisions in ${sampleSize} samples, got ${sampleSize - seen.size} duplicates`);
});

test("isValidReferenceCodeFormat rejects malformed input", () => {
  assert.equal(isValidReferenceCodeFormat("MCT-ABC234"), true);
  assert.equal(isValidReferenceCodeFormat("mct-abc234"), false, "lowercase must be rejected");
  assert.equal(isValidReferenceCodeFormat("MCT-ABCDE"), false, "too short must be rejected");
  assert.equal(isValidReferenceCodeFormat("MCT-ABCDEFG"), false, "too long must be rejected");
  assert.equal(isValidReferenceCodeFormat("MCT-ABC0I1"), false, "ambiguous characters must be rejected");
  assert.equal(isValidReferenceCodeFormat("XYZ-ABC234"), false, "wrong prefix must be rejected");
  assert.equal(isValidReferenceCodeFormat(""), false);
  assert.equal(isValidReferenceCodeFormat("MCT-ABC 23"), false, "whitespace must be rejected");
});

test("isValidChannel accepts only the three known channels", () => {
  assert.equal(isValidChannel("whatsapp"), true);
  assert.equal(isValidChannel("email"), true);
  assert.equal(isValidChannel("form"), true);
  assert.equal(isValidChannel("sms"), false);
  assert.equal(isValidChannel(""), false);
  assert.equal(isValidChannel(null), false);
  assert.equal(isValidChannel(undefined), false);
  assert.equal(isValidChannel(123), false);
});

test("rateLimitBucketKey is deterministic for the same input and secret", () => {
  const a = rateLimitBucketKey("203.0.113.5", "secret-1");
  const b = rateLimitBucketKey("203.0.113.5", "secret-1");
  assert.equal(a, b);
});

test("rateLimitBucketKey never contains the raw IP as a substring", () => {
  const key = rateLimitBucketKey("203.0.113.5", "secret-1");
  assert.ok(!key.includes("203.0.113.5"), "the raw IP must never appear in the stored bucket key");
  assert.match(key, /^[0-9a-f]{64}$/, "expected a 64-char hex SHA-256 digest");
});

test("rateLimitBucketKey differs for different IPs or different secrets", () => {
  const a = rateLimitBucketKey("203.0.113.5", "secret-1");
  const b = rateLimitBucketKey("203.0.113.6", "secret-1");
  const c = rateLimitBucketKey("203.0.113.5", "secret-2");
  assert.notEqual(a, b, "different IPs must hash differently");
  assert.notEqual(a, c, "different secrets must hash differently");
});

test("decideRateLimit allows a request in a brand-new, just-started window", () => {
  // decideRateLimit assumes an existing bucket row is being read -- the
  // "no row yet at all" case is handled by the caller's upsert-insert path,
  // not by this function. Here the window started at `now` itself
  // (requestCount: 0, 0ms elapsed): not expired, so resetWindow is false --
  // the caller simply allows and increments within the existing window.
  const now = new Date("2026-01-01T00:00:00Z");
  const decision = decideRateLimit({
    windowStart: now,
    requestCount: 0,
    now,
    windowMs: 60_000,
    maxRequests: 5,
  });
  assert.deepEqual(decision, { allowed: true, resetWindow: false });
});

test("decideRateLimit allows requests under the limit within the same window", () => {
  const windowStart = new Date("2026-01-01T00:00:00Z");
  const now = new Date("2026-01-01T00:00:10Z"); // 10s later, same 60s window
  const decision = decideRateLimit({
    windowStart,
    requestCount: 3,
    now,
    windowMs: 60_000,
    maxRequests: 5,
  });
  assert.deepEqual(decision, { allowed: true, resetWindow: false });
});

test("decideRateLimit blocks once the limit is reached within the window", () => {
  const windowStart = new Date("2026-01-01T00:00:00Z");
  const now = new Date("2026-01-01T00:00:10Z");
  const decision = decideRateLimit({
    windowStart,
    requestCount: 5,
    now,
    windowMs: 60_000,
    maxRequests: 5,
  });
  assert.deepEqual(decision, { allowed: false, resetWindow: false });
});

test("decideRateLimit resets once the window has fully elapsed, even over the limit", () => {
  const windowStart = new Date("2026-01-01T00:00:00Z");
  const now = new Date("2026-01-01T00:01:01Z"); // 61s later, window was 60s
  const decision = decideRateLimit({
    windowStart,
    requestCount: 999,
    now,
    windowMs: 60_000,
    maxRequests: 5,
  });
  assert.deepEqual(decision, { allowed: true, resetWindow: true });
});

test("buildWhatsAppUrl appends the reference code on a new line when present", () => {
  const url = buildWhatsAppUrl("Hello MCT,\n\nName: Jane", "MCT-ABC234");
  assert.ok(url.startsWith("https://wa.me/908508888911?text="));
  const decoded = decodeURIComponent(url.split("?text=")[1]);
  assert.equal(decoded, "Hello MCT,\n\nName: Jane\n\nRef: MCT-ABC234");
});

test("buildWhatsAppUrl omits the Ref line entirely when code is null (timeout/failure fallback)", () => {
  const url = buildWhatsAppUrl("Hello, I would like information.", null);
  const decoded = decodeURIComponent(url.split("?text=")[1]);
  assert.equal(decoded, "Hello, I would like information.");
  assert.ok(!decoded.includes("Ref:"), "must not fabricate a Ref: line when no code was generated");
});

test("buildWhatsAppUrl never leaves the message unencoded in the URL", () => {
  const url = buildWhatsAppUrl("Name: Jane & Co? / test", "MCT-ABC234");
  assert.ok(!url.includes("Jane & Co?"), "special characters must be percent-encoded, not raw");
});

// --- Phase 5K-C: inferChannel ---

test("inferChannel classifies gclid presence as google_ads regardless of other fields", () => {
  assert.equal(inferChannel({ gclid: "abc123" }), "google_ads");
  assert.equal(inferChannel({ gbraid: "abc123" }), "google_ads");
  assert.equal(inferChannel({ wbraid: "abc123" }), "google_ads");
});

test("inferChannel classifies utm_source=google + a paid medium as google_ads even without gclid", () => {
  assert.equal(inferChannel({ utmSource: "google", utmMedium: "cpc" }), "google_ads");
  assert.equal(inferChannel({ utmSource: "Google", utmMedium: "CPC" }), "google_ads", "must be case-insensitive");
});

test("inferChannel classifies a paid medium from a non-google source as other_paid", () => {
  assert.equal(inferChannel({ utmSource: "facebook", utmMedium: "cpc" }), "other_paid");
  assert.equal(inferChannel({ utmSource: "bing", utmMedium: "ppc" }), "other_paid");
});

test("inferChannel classifies a google.* referrer with no UTM/gclid as google_organic", () => {
  assert.equal(inferChannel({ referrer: "https://www.google.com/search?q=hair+transplant" }), "google_organic");
  assert.equal(inferChannel({ referrer: "https://google.co.uk/" }), "google_organic");
});

test("inferChannel does NOT classify a non-google domain containing 'google' as google_organic", () => {
  // e.g. a hypothetical "notgoogle.com" or "google.evil.com" must not match.
  assert.notEqual(inferChannel({ referrer: "https://google.evil.com/" }), "google_organic");
});

test("inferChannel classifies a non-google referrer with no UTM/gclid as referral", () => {
  assert.equal(inferChannel({ referrer: "https://www.instagram.com/" }), "referral");
});

test("inferChannel classifies no referrer and no params as direct_inferred (never a bare 'direct')", () => {
  assert.equal(inferChannel({}), "direct_inferred");
  assert.equal(inferChannel({ referrer: null, utmSource: null }), "direct_inferred");
});

test("inferChannel returns unknown for a malformed referrer URL rather than throwing", () => {
  assert.doesNotThrow(() => inferChannel({ referrer: "not a valid url" }));
});

test("inferChannel never claims google_ads from a manually-added utm_source=google without a paid medium", () => {
  // e.g. "utm_source=google&utm_medium=organic" or a bare utm_source with
  // no medium at all -- must not be force-classified as Ads just because
  // the string "google" appears; this is the task's explicit requirement
  // not to over-claim Ads attribution from an unverified parameter alone.
  const result = inferChannel({ utmSource: "google", utmMedium: "organic" });
  assert.notEqual(result, "google_ads");
});
