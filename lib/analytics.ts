// Phase 5K-C: dataLayer event helpers. Deliberately separate from
// lib/attribution.ts -- that module is about the MCT-XXXXXX reference-code
// system (business data, stored in Supabase); this one is about what (if
// anything) gets pushed to Google's dataLayer (GTM/GA4/Ads). Centralizing
// the push calls here, instead of duplicating them at each of the many
// call sites, is what guarantees the event name/payload stays identical
// everywhere and is never fired twice by accident.
//
// Every payload here is intentionally minimal: no name, email, phone,
// treatment, message content, or reference code is ever included. A
// reference code is deliberately excluded too -- even though it's not
// personal data by itself, there is no reason for Google to ever see it.

type DataLayerWindow = Window & { dataLayer?: unknown[] };

function pushDataLayerEvent(eventName: string) {
  if (typeof window === "undefined") return;
  const w = window as DataLayerWindow;
  if (!Array.isArray(w.dataLayer)) return; // GTM not loaded on this host (see google-tag-manager.tsx) -- no-op, not an error.
  w.dataLayer.push({ event: eventName });
}

/** Call ONLY after /api/leads has returned a confirmed {ok:true} response
 * -- never on button click, invalid form, or a failed/pending request. */
export function trackGenerateLead() {
  pushDataLayerEvent("generate_lead");
}

/** Call when the visitor intentionally initiates the WhatsApp contact flow
 * (i.e. from inside openWhatsAppTransition() itself, once, per click) --
 * this records "contact initiated", never "message sent" or "patient
 * confirmed". */
export function trackWhatsAppInitiated() {
  pushDataLayerEvent("whatsapp_button");
}

/** Fired once per client-side route change (not on the very first page
 * load -- GTM's own container load already accounts for that one). See
 * components/analytics/route-change-tracker.tsx. */
export function trackPageView(pagePath: string) {
  if (typeof window === "undefined") return;
  const w = window as DataLayerWindow;
  if (!Array.isArray(w.dataLayer)) return;
  w.dataLayer.push({ event: "page_view", page_path: pagePath });
}
