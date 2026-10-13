import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/hair-transplant-turkey",
        destination: "/hair-transplant-packages",
        statusCode: 301,
      },
      // Phase 5A (2026-10-10): the remaining 6 of the 7 previously-missing
      // 301s approved in MCT_Master_URL_Migration_Map_FINAL_REVIEW_v2.xlsx.
      {
        source: "/rhinoplasty-in-turkey",
        destination: "/rhinoplasty-turkey",
        statusCode: 301,
      },
      {
        source: "/termsandconditions",
        destination: "/terms",
        statusCode: 301,
      },
      {
        source: "/liposuction-surgery-in-turkey",
        destination: "/liposuction-turkey",
        statusCode: 301,
      },
      {
        source: "/rhinoplasty-packages",
        destination: "/rhinoplasty-turkey",
        statusCode: 301,
      },
      {
        source: "/gynecomastia-surgery",
        destination: "/gynecomastia-turkey",
        statusCode: 301,
      },
      {
        source: "/breast-enlargement-in-turkey",
        destination: "/breast-augmentation-turkey",
        statusCode: 301,
      },
      // Phase 5A closeout (2026-10-10): the migration map's original target
      // for this one ("/tr/privacy-policy") is no longer valid — there is
      // no /tr/ page and none is being built. Site owner approved
      // redirecting to the English /privacy-policy instead, as a deliberate
      // exception to the map (the map itself was left unchanged — see the
      // Phase 5A closeout report). Known, accepted risk: a Turkish-language
      // link now lands on an English-only legal page.
      {
        source: "/gizlilik-ilkesi",
        destination: "/privacy-policy",
        statusCode: 301,
      },
      // Phase 5C (2026-10-10): the old WordPress sitemap index URL. Not in
      // the migration map (it's a technical URL, not content) and not a
      // 410 candidate — crawlers/tools with the old URL cached should land
      // on the new app/sitemap.ts output rather than get a 404.
      {
        source: "/sitemap_index.xml",
        destination: "/sitemap.xml",
        statusCode: 301,
      },
    ];
  },
};

export default nextConfig;
