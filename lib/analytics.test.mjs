// Phase 5K-C unit tests for lib/analytics.ts's dataLayer push helpers.
// Pure logic, no browser, no network -- global.window is a minimal stand-in.
import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";

let analytics;

beforeEach(async () => {
  global.window = global.window || {};
  global.window.dataLayer = [];
  if (!analytics) analytics = await import("./analytics.ts");
});

test("trackGenerateLead pushes exactly {event: 'generate_lead'}, nothing else", () => {
  analytics.trackGenerateLead();
  assert.deepEqual(window.dataLayer, [{ event: "generate_lead" }]);
});

test("trackWhatsAppInitiated pushes exactly {event: 'whatsapp_button'}, nothing else", () => {
  analytics.trackWhatsAppInitiated();
  assert.deepEqual(window.dataLayer, [{ event: "whatsapp_button" }]);
});

test("trackPageView includes only event and page_path -- no PII fields", () => {
  analytics.trackPageView("/hair-transplant-packages");
  assert.deepEqual(window.dataLayer, [{ event: "page_view", page_path: "/hair-transplant-packages" }]);
});

test("every tracker is a safe no-op when window.dataLayer is not an array (GTM gated off this host)", () => {
  window.dataLayer = undefined;
  assert.doesNotThrow(() => {
    analytics.trackGenerateLead();
    analytics.trackWhatsAppInitiated();
    analytics.trackPageView("/x");
  });
  assert.equal(window.dataLayer, undefined, "must not create a dataLayer that didn't already exist");
});

test("multiple calls push multiple independent events, never merged or deduplicated at this layer", () => {
  analytics.trackWhatsAppInitiated();
  analytics.trackWhatsAppInitiated();
  assert.equal(window.dataLayer.length, 2, "dedup/guarding against double-firing is the CALLER's responsibility (e.g. openWhatsAppTransition being called once per click), not this layer's");
});
