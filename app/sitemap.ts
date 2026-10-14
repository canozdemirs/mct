import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { isProductionHost, PRODUCTION_HOST } from "@/lib/site-host";
import { getAllHospitalSlugs } from "@/lib/hospitals";
import { SORTED_BLOG_POSTS, TOTAL_BLOG_PAGES } from "@/lib/blog-listing";

const BASE = `https://${PRODUCTION_HOST}`;

// Static pages only — every URL here is one that's actually meant to be
// indexable at launch. Deliberately excludes: every 301 redirect source,
// every 410 Gone path (tag/category/profiles/project/pj-categs/pl-categs
// prefixes, the 37 exact one-off slugs, the GTranslate tr/fr/de prefixes —
// see lib/gone-paths.ts), /posts/[slug] (internal-only, see proxy.ts), and
// admin/partner-portal/api/auth.
//
// Phase 4 follow-up (2026-10-14), correction: this comment previously
// claimed the homepage, /hospitals-in-turkey, every /[hospital] page, and
// all 12 treatment pages each carry their own page-level
// `robots: { index: false }` override that would need removing at launch.
// That was checked directly against every one of those page files and
// found false — none of them sets a robots field. The real mechanism is
// entirely in proxy.ts: any request whose Host header isn't the exact
// production hostname (lib/site-host.ts's isProductionHost()) gets an
// X-Robots-Tag: noindex, nofollow response header, regardless of page.
// There is currently no page-level or staged indexing control — the
// instant the production hostname serves this app, every URL listed below
// becomes indexable simultaneously. That's a simple, correct design for a
// single-day cutover; it only becomes a problem if a staged, page-by-page
// rollout is ever wanted, since that would need new per-page robots
// overrides that don't exist today.
const STATIC_PATHS: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "/", priority: 1.0, changeFrequency: "weekly" },
  { path: "/hospitals-in-turkey", priority: 0.7, changeFrequency: "monthly" },
  { path: "/medical-tourism-turkey", priority: 0.7, changeFrequency: "monthly" },
  { path: "/treatment-prices-in-turkey", priority: 0.6, changeFrequency: "monthly" },
  { path: "/agency", priority: 0.3, changeFrequency: "yearly" },
  { path: "/privacy-policy", priority: 0.2, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.2, changeFrequency: "yearly" },
  { path: "/blog", priority: 0.8, changeFrequency: "daily" },
];

const TREATMENT_SLUGS = [
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
];

function postDate(dateStr: string): Date {
  // post_date_gmt format: "YYYY-MM-DD HH:MM:SS" (UTC, no explicit offset).
  // Real WordPress dates only — never a fabricated "today".
  return new Date(dateStr.replace(" ", "T") + "Z");
}

// Calling headers() makes this a request-time route (opts out of the
// default build-time caching) — see lib/site-host.ts for why this can't
// be decided from a build-time env var alone.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const headersList = await headers();
  const host = headersList.get("host");

  if (!isProductionHost(host)) {
    // Ambiguous/non-production host: emit no URLs rather than guess.
    return [];
  }

  const entries: MetadataRoute.Sitemap = [];

  for (const { path, priority, changeFrequency } of STATIC_PATHS) {
    entries.push({ url: `${BASE}${path}`, priority, changeFrequency });
  }

  for (let page = 2; page <= TOTAL_BLOG_PAGES; page++) {
    entries.push({
      url: `${BASE}/blog/page/${page}`,
      priority: 0.5,
      changeFrequency: "weekly",
    });
  }

  for (const slug of TREATMENT_SLUGS) {
    entries.push({
      url: `${BASE}/${slug}`,
      priority: 0.9,
      changeFrequency: "monthly",
    });
  }

  for (const slug of getAllHospitalSlugs()) {
    entries.push({
      url: `${BASE}/${slug}`,
      priority: 0.6,
      changeFrequency: "monthly",
    });
  }

  for (const post of SORTED_BLOG_POSTS) {
    entries.push({
      url: `${BASE}/${post.slug}`,
      lastModified: postDate(post.date),
      priority: 0.6,
      changeFrequency: "monthly",
    });
  }

  return entries;
}
