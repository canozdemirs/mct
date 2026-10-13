// Phase 5K-C unit tests for lib/consent.ts. Uses a minimal in-memory
// localStorage stand-in (global.window / global.localStorage) -- no real
// browser, no network.
import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";

function makeFakeLocalStorage() {
  const store = new Map();
  return {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k),
    clear: () => store.clear(),
  };
}

let consent;

beforeEach(async () => {
  global.window = global.window || {};
  global.window.localStorage = makeFakeLocalStorage();
  delete global.window.gtag;
  // Re-import fresh each time isn't necessary -- the module has no
  // top-level mutable state, so a single dynamic import is reused; only
  // the fake localStorage/gtag needs resetting per test.
  if (!consent) consent = await import("./consent.ts");
});

test("getStoredConsent returns null when nothing was ever stored", () => {
  assert.equal(consent.getStoredConsent(), null);
});

test("storeConsent + getStoredConsent round-trips the exact choice made", () => {
  consent.storeConsent({ analytics: true, advertising: false });
  const stored = consent.getStoredConsent();
  assert.equal(stored.analytics, true);
  assert.equal(stored.advertising, false);
  assert.equal(typeof stored.decidedAt, "number");
});

test("getStoredConsent returns null for malformed stored JSON rather than throwing", () => {
  global.window.localStorage.setItem("mct_consent_v1", "{not valid json");
  assert.doesNotThrow(() => consent.getStoredConsent());
  assert.equal(consent.getStoredConsent(), null);
});

test("hasConsent defaults to false (denied) when no choice was ever made", () => {
  global.window.localStorage.clear();
  assert.equal(consent.hasConsent("analytics"), false);
  assert.equal(consent.hasConsent("advertising"), false);
});

test("hasConsent reflects a granted choice per category independently", () => {
  consent.storeConsent({ analytics: true, advertising: false });
  assert.equal(consent.hasConsent("analytics"), true);
  assert.equal(consent.hasConsent("advertising"), false);
});

test("updateConsentSignals is a safe no-op when gtag doesn't exist (GTM gated off this host)", () => {
  delete global.window.gtag;
  assert.doesNotThrow(() => consent.updateConsentSignals({ analytics: true, advertising: true }));
});

test("updateConsentSignals calls gtag('consent','update', {...}) with all four Consent Mode v2 signals", () => {
  const calls = [];
  global.window.gtag = (...args) => calls.push(args);
  consent.updateConsentSignals({ analytics: true, advertising: false });
  assert.equal(calls.length, 1);
  const [command, action, payload] = calls[0];
  assert.equal(command, "consent");
  assert.equal(action, "update");
  assert.equal(payload.analytics_storage, "granted");
  assert.equal(payload.ad_storage, "denied");
  assert.equal(payload.ad_user_data, "denied");
  assert.equal(payload.ad_personalization, "denied");
});

test("updateConsentSignals grants ad_user_data/ad_personalization together with ad_storage, never independently", () => {
  const calls = [];
  global.window.gtag = (...args) => calls.push(args);
  consent.updateConsentSignals({ analytics: false, advertising: true });
  const payload = calls[0][2];
  assert.equal(payload.ad_storage, "granted");
  assert.equal(payload.ad_user_data, "granted");
  assert.equal(payload.ad_personalization, "granted");
  assert.equal(payload.analytics_storage, "denied");
});
