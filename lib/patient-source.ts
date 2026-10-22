import { PAID_MEDIA_MEDIUMS } from "./attribution";

// Single source of truth for the Patients list "Source" acquisition
// category (distinct from `leads.source`, the raw form/page label now
// shown as "Form / Page" -- and distinct from the "Channel" column,
// which stays as the detailed raw value, e.g. "chatgpt.com"). This is
// the JS twin of compute_patient_source() in
// supabase/migrations/leads_source_category.sql -- keep both in sync if
// this logic ever changes.
export const AI_DOMAINS = ["chatgpt.com", "chat.openai.com", "gemini.google.com", "perplexity.ai", "copilot.microsoft.com", "claude.ai"];
export const SOCIAL_DOMAINS = ["instagram.com", "facebook.com", "tiktok.com", "youtube.com", "linkedin.com", "twitter.com", "x.com"];
export const OTHER_SEARCH_DOMAINS = ["bing.com", "yandex.com", "yandex.ru", "duckduckgo.com"];

// Matches any google.* search-results domain (google.com, google.co.uk,
// google.com.tr, ...) without needing a maintained country-suffix list --
// mirrors the SQL side's `~ '(^|\.)google\.[a-z]{2,3}(\.[a-z]{2})?$'`.
const GOOGLE_HOSTNAME_PATTERN = /(^|\.)google\.[a-z]{2,3}(\.[a-z]{2})?$/i;

function hostMatchesAny(host: string | null | undefined, domains: string[]): boolean {
  if (!host) return false;
  const h = host.toLowerCase();
  return domains.some((d) => h === d || h.endsWith(`.${d}`));
}

export function computePatientSource(lead: {
  owner_type: "mct" | "partner";
  source: string;
  utm_source?: string | null;
  utm_medium?: string | null;
  referrer_domain?: string | null;
  google_click_id?: string | null;
}): string {
  if (lead.owner_type === "partner") return "Partner";

  const source = lead.source || "";
  if (/^whatsapp/i.test(source)) return "WhatsApp";
  if (/^phone/i.test(source)) return "Phone";
  if (/^email/i.test(source)) return "Email";
  if (/^instagram/i.test(source) || /^facebook/i.test(source)) return "Social Media";
  if (/^referral/i.test(source)) return "Word of Mouth";

  if (lead.google_click_id) return "Google Ads";
  if (
    lead.utm_medium &&
    PAID_MEDIA_MEDIUMS.includes(lead.utm_medium.toLowerCase()) &&
    (lead.utm_source || "").toLowerCase().startsWith("google")
  ) {
    return "Google Ads";
  }

  if (hostMatchesAny(lead.utm_source, AI_DOMAINS) || hostMatchesAny(lead.referrer_domain, AI_DOMAINS)) return "AI";
  if (hostMatchesAny(lead.utm_source, SOCIAL_DOMAINS) || hostMatchesAny(lead.referrer_domain, SOCIAL_DOMAINS)) return "Social Media";
  if (lead.referrer_domain && GOOGLE_HOSTNAME_PATTERN.test(lead.referrer_domain)) return "Google (SEO)";
  if (hostMatchesAny(lead.referrer_domain, OTHER_SEARCH_DOMAINS)) return "Other Search";
  if (lead.referrer_domain || lead.utm_source) return "Other Websites";

  return "Direct";
}
