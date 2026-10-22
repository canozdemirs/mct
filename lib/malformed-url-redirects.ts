// Search Console 404 follow-up (2026-10-22): two GENERAL malformed-URL
// patterns, distinct from the fixed LEGACY_REDIRECTS map because they're
// shapes, not specific slugs -- any current or future report matching
// either shape should resolve the same way, not require a new hardcoded
// entry each time.
//
// Both patterns reduce to the same question: "once the junk is stripped
// off, is what's left a real, known path on this site?" -- answered by
// checking the cleaned segments against every source this app already
// trusts as "real": the fixed legacy-redirect map (chased to its own
// final target, so this never produces a second hop), blog post slugs,
// hospital slugs, and the small fixed set of top-level treatment/static
// pages. TREATMENT_SLUGS and STATIC_SLUGS below intentionally mirror
// app/sitemap.ts's own lists -- duplicated rather than imported so this
// file never has a reason to touch that production SEO file; keep both
// in sync if either changes.
import { BLOG_SLUGS } from "@/lib/blog-slugs.generated";
import { getAllHospitalSlugs } from "@/lib/hospitals";
import { getLegacyRedirect } from "@/lib/legacy-redirects";

const TREATMENT_SLUGS: ReadonlySet<string> = new Set([
  "hair-transplant-packages",
  "dental-implants-turkey",
  "gynecomastia-turkey",
  "rhinoplasty-turkey",
  "liposuction-turkey",
  "cataract-surgery-turkey",
  "lasik-eye-surgery-turkey",
  "medical-check-up-turkey",
  "all-on-4-dental-implants-turkey",
  "breast-augmentation-turkey",
  "ivf-treatment-turkey",
  "blepharoplasty-turkey",
]);

const STATIC_SLUGS: ReadonlySet<string> = new Set([
  "hospitals-in-turkey",
  "medical-tourism-turkey",
  "treatment-prices-in-turkey",
  "agency",
  "privacy-policy",
  "terms",
  "blog",
]);

const HOSPITAL_SLUGS: ReadonlySet<string> = new Set(getAllHospitalSlugs());

/** True for the homepage (no segments) or any single-segment slug this app
 * actually serves a real page at. Multi-segment paths are deliberately not
 * considered "known" here -- the only multi-segment destinations this site
 * has are already covered by LEGACY_REDIRECTS, which is checked first in
 * both callers below. */
function isKnownRealPath(segments: string[]): boolean {
  if (segments.length === 0) return true;
  if (segments.length !== 1) return false;
  const slug = segments[0];
  return (
    BLOG_SLUGS.has(slug) ||
    HOSPITAL_SLUGS.has(slug) ||
    TREATMENT_SLUGS.has(slug) ||
    STATIC_SLUGS.has(slug)
  );
}

/** Chases a cleaned segment list to its final single-hop target: a further
 * legacy-redirect target if one applies, the path itself if it's already a
 * real known page, or null if neither -- meaning "don't know this path". */
function resolveCleanedSegments(segments: string[]): string | null {
  const legacyTarget = getLegacyRedirect(segments);
  if (legacyTarget) return legacyTarget;
  if (isKnownRealPath(segments)) {
    return segments.length === 0 ? "/" : `/${segments.join("/")}`;
  }
  return null;
}

const SCHEME_SEGMENTS: ReadonlySet<string> = new Set(["https:", "http:"]);

/**
 * Rule 1: a reported URL whose path literally has another full URL pasted
 * into it, e.g. /https://www.medicalcenterturkey.com/how-to-recover-after-arm-lift//
 * -- segments[0] is "https:" or "http:" and segments[1] names this domain.
 * Returns the single-hop 301 target for the embedded path, or {gone:true}
 * if that embedded path isn't a real page (never a redirect-to-a-404).
 * Returns null if this request doesn't match the pattern at all.
 */
export function resolveEmbeddedUrlRedirect(
  segments: string[],
): { target: string } | { gone: true } | null {
  if (segments.length < 2) return null;
  if (!SCHEME_SEGMENTS.has(segments[0])) return null;
  if (!segments[1].includes("medicalcenterturkey.com")) return null;

  // segments[2..] is already slash-normalized (split("/").filter(Boolean)
  // drops the doubled/trailing slashes the reported URLs have).
  const inner = segments.slice(2);
  const target = resolveCleanedSegments(inner);
  return target ? { target } : { gone: true };
}

const TRAILING_JUNK = /(?:%20|%0A|;|\s)+$/i;

/**
 * Rule 3: a reported URL whose last segment ends in stray whitespace, %20,
 * %0A, or ";" (e.g. /how-to-make-your-breasts-grow-bigger-naturally/; --
 * the ";" arrives as its own trailing segment here, which collapses to
 * nothing once stripped). Returns the single-hop 301 target once the junk
 * is removed, but ONLY if the cleaned path is a real page -- if it isn't,
 * returns null so the request falls through to an ordinary 404 rather than
 * manufacturing a redirect to somewhere that doesn't exist.
 */
export function resolveTrailingJunkRedirect(segments: string[]): { target: string } | null {
  if (segments.length === 0) return null;
  const last = segments[segments.length - 1];
  const cleanedLast = last.replace(TRAILING_JUNK, "");
  if (cleanedLast === last) return null;

  const cleanedSegments = segments.slice(0, -1);
  if (cleanedLast.length > 0) cleanedSegments.push(cleanedLast);

  const target = resolveCleanedSegments(cleanedSegments);
  return target ? { target } : null;
}
