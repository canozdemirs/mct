// Parses the handful of UTM parameters out of the raw page_url a lead form
// already sends (window.location.href, full URL incl. query string) -- no
// consent gating, no dependency on the separate (currently unapplied)
// lead_attributions pipeline in lib/attribution.ts, which only runs
// client-side and only when analytics/advertising consent was granted.
export type PageUrlAttribution = {
  landingPage: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
};

export function parsePageUrlAttribution(pageUrl: string | null | undefined): PageUrlAttribution {
  if (!pageUrl) {
    return { landingPage: null, utmSource: null, utmMedium: null, utmCampaign: null };
  }
  try {
    const url = new URL(pageUrl);
    return {
      landingPage: url.pathname || null,
      utmSource: url.searchParams.get("utm_source"),
      utmMedium: url.searchParams.get("utm_medium"),
      utmCampaign: url.searchParams.get("utm_campaign"),
    };
  } catch {
    return { landingPage: null, utmSource: null, utmMedium: null, utmCampaign: null };
  }
}

// Re-derived server-side from the raw referrer URL the client sent, rather
// than trusting a client-computed domain string -- same "parse the raw
// value ourselves" posture as parsePageUrlAttribution above. Used as the
// Channel fallback (leads.utm_source, else this, else "Direct") and for
// the contact_clicks table (WhatsApp/email click tracking).
export function parseReferrerDomain(referrer: string | null | undefined): string | null {
  if (!referrer) return null;
  try {
    const hostname = new URL(referrer).hostname.replace(/^www\./, "");
    return hostname || null;
  } catch {
    return null;
  }
}
