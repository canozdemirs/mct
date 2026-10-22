// HTTP 301 redirects for pre-migration (WordPress) URLs that have a real
// equivalent on the new site — 404-audit follow-up (2026-10-22). Checked
// first in proxy.ts, before isGonePath() — single-hop even when the
// request has a trailing slash (segments are already slash-agnostic, same
// as isGonePath() relies on), now that next.config.ts sets
// skipTrailingSlashRedirect: true and proxy.ts replicates that default
// behavior itself for every other path. Every target below was verified
// to return 200 live immediately before this file was written.
//
// First block (9 entries) migrated from next.config.ts's old redirects()
// function -- those entries previously chained Next's own trailing-slash-
// strip 308 in front of the 301 for any request with a trailing slash
// (the exact chain this file exists to eliminate), so they moved here
// rather than staying split across two mechanisms.
//
// Second block: new findings from the 2026-10-22 404 audit (Wayback
// Machine CDX + GA4 + Vercel production logs, cross-checked against the
// live site). Grouped loosely by topic for readability; not otherwise
// ordered.
export const LEGACY_REDIRECTS: Readonly<Record<string, string>> = {
  "hair-transplant-turkey": "/hair-transplant-packages",
  "rhinoplasty-in-turkey": "/rhinoplasty-turkey",
  "termsandconditions": "/terms",
  "liposuction-surgery-in-turkey": "/liposuction-turkey",
  "rhinoplasty-packages": "/rhinoplasty-turkey",
  "gynecomastia-surgery": "/gynecomastia-turkey",
  "breast-enlargement-in-turkey": "/breast-augmentation-turkey",
  "gizlilik-ilkesi": "/privacy-policy",
  "sitemap_index.xml": "/sitemap.xml",

  // Old hospital URLs (no hyphens / different naming) -> current
  // lib/hospitals.ts slugs.
  "acibadem-taksim": "/acibadem-taksim-hospital",
  "acibademadana": "/acibadem-adana-hospital",
  "acibademankara": "/acibadem-ankara-hospital",
  "acibadematasehir": "/acibadem-atasehir-hospital",
  "acibadematasehir/clinicsportfolio": "/acibadem-atasehir-hospital",
  "acibadematasehir/hospitals-portfolio": "/acibadem-atasehir-hospital",
  "acibadembakirkoy": "/acibadem-bakirkoy-hospital",
  "acibadembodrum": "/acibadem-bodrum-hospital",
  "acibadembursa": "/acibadem-bursa-hospital",
  "acibademeskisehir": "/acibadem-eskisehir-hospital",
  "acibademfulya": "/acibadem-fulya-hospital",
  "acibademinternational": "/acibadem-international-hospital",
  "acibademkadikoy": "/acibadem-kadikoy-hospital",
  "acibademkayseri": "/acibadem-kayseri-hospital",
  "acibademkocaeli": "/acibadem-kocaeli-hospital",
  "acibademkozyatagi": "/acibadem-kozyatagi-hospital",
  "acibademmaslakhospital": "/acibadem-maslak-hospital",
  "americanhospital": "/american-hospital",
  "kocunivesityhospital": "/koc-university-hospital",

  // Old blog posts / landing pages with a close current equivalent.
  "10-things-to-know-about-hair-transplantation": "/hair-transplant-packages",
  "4-good-reasons-to-undergo-treatment-in-turkey": "/medical-tourism-turkey",
  "breast-enlargement-before-after": "/breast-augmentation-turkey",
  "dental-before-after": "/dental-implants-turkey",
  "dental-implants-in-turkey": "/dental-implants-turkey",
  "dental-treatment-guide-in-turkey": "/dental-treatment-guide-in-turkey-2",
  "dentistry": "/dentistry-in-turkey",
  "facelift-before-after": "/what-changes-can-be-expected-after-facelift-surgery",
  "fue-hair-transplant-in-turkey": "/fue-hair-transplant-in-turkey-2025",
  "goodreasonstogototurkey": "/medical-tourism-turkey",
  "hair-restoration-treatment-medical-center-turkey": "/hair-transplant-packages",
  "hair-transplant": "/hair-transplant-packages",
  "hair-transplant-before-after": "/hair-transplant-surgery-before-and-after-turkey",
  "hair-transplant-cost": "/hair-transplant-packages",
  "hair-transplant-surgery-before-and-after": "/hair-transplant-surgery-before-and-after-turkey",
  "how-a-butt-lift-can-boost-your-confidence-in-2025": "/how-a-butt-lift-can-boost-your-confidence-in-2026",
  "liposuction-before-after": "/vaser-liposuction-turkey-before-and-after",
  "liposuction-surgery-in-turkey/embed": "/liposuction-turkey",
  "medical-tourism-in-turkey": "/medical-tourism-turkey",
  "medical-travel-news": "/medical-tourism-turkey",
  "premium-hair-transplant-package": "/hair-transplant-packages",
  "rhinoplasty-before-after": "/rhinoplast-nose-job-before-and-after-turkey",
  "skin-care-treatment-cost-in-turkey-2022": "/skin-care-treatment-cost-in-turkey-2025",
  "the-best-dentists-in-turkey": "/the-best-dental-clinic-in-turkey",
  "the-best-doctors-in-turkey": "/the-best-hospitals-in-turkey",
  "the-best-oncologists-in-turkey": "/the-best-hospitals-in-turkey",
  "the-best-ophthalmologist-in-turkey": "/the-best-hospitals-in-turkey",
  "the-best-plastic-surgeon-in-turkey": "/plastic-surgery-in-turkey",
  "tounge-cancer": "/tongue-cancer",
  "everything-you-need-to-know-about-dht": "/everything-you-need-to-know-about-dht-blockers",

  // Search Console follow-up (2026-10-22): WordPress-era comment/trackback
  // style suffix on an otherwise-valid slug. Covers both the single- and
  // double-slash variant reported (/dhi-vs-fue-hair-transplant-procedures/1000
  // and .../1000 with a doubled slash before it) -- proxy.ts's segment
  // normalization (split("/").filter(Boolean)) already collapses the
  // doubled slash to the same key before this map is checked.
  "dhi-vs-fue-hair-transplant-procedures/1000": "/dhi-vs-fue-hair-transplant-procedures",
  "what-are-10-ways-to-prevent-cancer-2": "/what-are-10-ways-to-prevent-cancer",
  "what-is-medical-travel": "/medical-tourism-turkey",
  "what-medication-do-you-take-after-hair-transplant/embed": "/what-medication-do-you-take-after-hair-transplant",
  "why-does-hair-transplant-fails": "/does-hair-transplant-work",
};

/**
 * Checked against the same normalized, non-empty path segments
 * isGonePath() uses. Handles the fixed LEGACY_REDIRECTS map above, plus
 * the old WordPress root-level pagination scheme (/page/2, /page/3, ...),
 * which predates the new site's /blog/page/N -- /page/1 has no
 * equivalent (blog page 1 is just /blog, which is never itself
 * generated as /blog/page/1 -- see app/blog/page/[page]/page.tsx).
 */
export function getLegacyRedirect(segments: string[]): string | null {
  if (segments.length === 0) return null;

  const key = segments.join("/");
  if (key in LEGACY_REDIRECTS) return LEGACY_REDIRECTS[key];

  if (segments.length === 2 && segments[0] === "page" && /^[0-9]+$/.test(segments[1])) {
    const page = parseInt(segments[1], 10);
    return page <= 1 ? "/blog" : `/blog/page/${page}`;
  }

  return null;
}
