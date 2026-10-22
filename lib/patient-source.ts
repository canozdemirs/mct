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

// Every value leads.source_override is allowed to hold (DB check
// constraint mirrors this exact list) -- a staff member's explicit
// pick always wins over every automatic signal below, including
// Partner/WhatsApp/Phone/Email.
export const SOURCE_CATEGORIES = [
  "Google Ads", "Google (SEO)", "AI", "Social Media", "Other Search",
  "Other Websites", "Word of Mouth", "Direct", "WhatsApp", "Phone",
  "Email", "Partner",
] as const;

// Matches any google.* search-results domain (google.com, google.co.uk,
// google.com.tr, ...) without needing a maintained country-suffix list --
// mirrors the SQL side's `~ '(^|\.)google\.[a-z]{2,3}(\.[a-z]{2})?$'`.
const GOOGLE_HOSTNAME_PATTERN = /(^|\.)google\.[a-z]{2,3}(\.[a-z]{2})?$/i;

function hostMatchesAny(host: string | null | undefined, domains: string[]): boolean {
  if (!host) return false;
  const h = host.toLowerCase();
  return domains.some((d) => h === d || h.endsWith(`.${d}`));
}

// Order matters: real web evidence (gclid/UTM/referrer) always wins
// over a manually-typed source label when BOTH are present -- a
// WhatsApp-added patient whose linked click came from ChatGPT should
// classify as "AI", not "WhatsApp", just because the admin picked
// "WhatsApp" as the entry-point label. The manually-entered labels
// (WhatsApp/Phone/Email/Social Media/Word of Mouth) are only a
// fallback for when there's genuinely no web evidence at all.
export function computePatientSource(lead: {
  owner_type: "mct" | "partner";
  source: string;
  utm_source?: string | null;
  utm_medium?: string | null;
  referrer_domain?: string | null;
  google_click_id?: string | null;
  source_override?: string | null;
}): string {
  if (lead.source_override) return lead.source_override;
  if (lead.owner_type === "partner") return "Partner";

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

  const source = lead.source || "";
  if (/^whatsapp/i.test(source)) return "WhatsApp";
  if (/^phone/i.test(source)) return "Phone";
  if (/^email/i.test(source)) return "Email";
  if (/^instagram/i.test(source) || /^facebook/i.test(source)) return "Social Media";
  if (/^referral/i.test(source)) return "Word of Mouth";

  return "Direct";
}

// Distinct from computePatientSource (WHERE the patient came from) --
// this is HOW they first reached MCT. A web-form submission is always
// "Website form" regardless of acquisition channel; a manually-added
// patient's method is whatever the admin recorded at entry.
export function computeContactMethod(source: string): string {
  const s = source || "";
  if (/^whatsapp/i.test(s)) return "WhatsApp";
  if (/^phone/i.test(s)) return "Phone";
  if (/^email/i.test(s)) return "Email";
  if (/^instagram/i.test(s) || /^facebook/i.test(s)) return "Instagram/Facebook";
  if (/^referral/i.test(s)) return "Referral (word of mouth)";
  if (/^partner/i.test(s)) return "Partner";
  if (/^other/i.test(s)) return "Other";
  return "Website form";
}
