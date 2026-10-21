// Unconditional (no consent gate), first-touch-of-session capture of the
// visitor's original entry referrer/landing page/UTM. Distinct from this
// file's sibling, lib/attribution.ts's captureTouchIfConsented(), which is
// consent-gated and feeds the separate (still-unapplied) lead_attributions
// pipeline. This one is consistent with leads.page_url itself already
// being captured unconditionally on every lead -- it just also remembers
// the FIRST page of the session, not only whichever page the form was
// finally submitted from, so a visitor who lands via a UTM-tagged ad link
// and then browses to another page before submitting still has that first
// touch preserved. Written once per browser tab session (sessionStorage),
// read back by lead forms and the WhatsApp click handler.
const SESSION_ENTRY_KEY = "mct_session_entry";

export type SessionEntry = {
  referrer: string | null;
  landingPage: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
};

export function captureSessionEntryOnce(): void {
  if (typeof window === "undefined") return;
  try {
    if (window.sessionStorage.getItem(SESSION_ENTRY_KEY)) return;
    const params = new URLSearchParams(window.location.search);
    const entry: SessionEntry = {
      referrer: document.referrer || null,
      landingPage: window.location.pathname || null,
      utmSource: params.get("utm_source"),
      utmMedium: params.get("utm_medium"),
      utmCampaign: params.get("utm_campaign"),
    };
    window.sessionStorage.setItem(SESSION_ENTRY_KEY, JSON.stringify(entry));
  } catch {
    // sessionStorage unavailable (private browsing, quota, disabled) --
    // callers already fall back to the current page's own page_url parse
    // server-side, so there's nothing else to do here.
  }
}

export function getSessionEntry(): SessionEntry | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(SESSION_ENTRY_KEY);
    return raw ? (JSON.parse(raw) as SessionEntry) : null;
  } catch {
    return null;
  }
}
