// Phase 5K-C: minimal Consent Mode v2 state management. This is NOT a legal
// consent mechanism by itself -- it only governs whether Google's tags are
// told they may use analytics/advertising storage. The actual legal
// adequacy of the banner text, KVKK/GDPR basis, and retention is a separate
// review this module does not attempt to satisfy.

export type ConsentCategory = "analytics" | "advertising";

export type ConsentState = {
  analytics: boolean;
  advertising: boolean;
  decidedAt: number;
};

const STORAGE_KEY = "mct_consent_v1";

/** Reads the stored consent choice, or null if the visitor has never decided
 * (banner should be shown) or storage is unavailable (private browsing, etc
 * -- treated the same as "no choice yet", i.e. denied by default). */
export function getStoredConsent(): ConsentState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (typeof parsed?.analytics !== "boolean" || typeof parsed?.advertising !== "boolean") return null;
    return parsed as ConsentState;
  } catch {
    return null;
  }
}

export function storeConsent(state: Omit<ConsentState, "decidedAt">): ConsentState {
  const full: ConsentState = { ...state, decidedAt: Date.now() };
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(full));
    } catch {
      // Storage unavailable -- the consent update below still runs for this
      // page view, it just won't be remembered on the next one. Fail open
      // toward "ask again", never toward "silently assume granted".
    }
  }
  return full;
}

/** Checks whether a specific category is currently granted. Missing/invalid
 * stored state is treated as NOT granted -- the safe default. */
export function hasConsent(category: ConsentCategory): boolean {
  const stored = getStoredConsent();
  if (!stored) return false;
  return category === "analytics" ? stored.analytics : stored.advertising;
}

/** Pushes a Consent Mode v2 update via the gtag-shim (see
 * components/analytics/google-tag-manager.tsx for why a shim is used
 * instead of loading gtag.js directly). Safe no-op if dataLayer doesn't
 * exist yet (e.g. GTM gated off on a non-production host). */
export function updateConsentSignals(state: { analytics: boolean; advertising: boolean }) {
  if (typeof window === "undefined") return;
  const w = window as unknown as { gtag?: (...args: unknown[]) => void };
  if (typeof w.gtag !== "function") return;
  w.gtag("consent", "update", {
    analytics_storage: state.analytics ? "granted" : "denied",
    ad_storage: state.advertising ? "granted" : "denied",
    ad_user_data: state.advertising ? "granted" : "denied",
    ad_personalization: state.advertising ? "granted" : "denied",
  });
}
