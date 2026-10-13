import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { isProductionHost, PRODUCTION_HOST } from "@/lib/site-host";

// Calling headers() makes this a request-time route (opts out of the
// default build-time caching) — required, since the rules below depend on
// which host actually served the request, not on build-time env vars.
// See lib/site-host.ts for why.
export default async function robots(): Promise<MetadataRoute.Robots> {
  const headersList = await headers();
  const host = headersList.get("host");

  if (!isProductionHost(host)) {
    // Preview deployments, the bare apex, *.vercel.app, localhost, or an
    // ambiguous/missing Host header: stay fully closed. Ambiguous must
    // default to safe, never to open.
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
    };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin",
        "/partner-portal",
        "/api",
        "/auth",
        // Internal implementation detail (see proxy.ts) — every blog post
        // is actually served at its root-level slug; nothing ever links
        // to /posts/*, but this is disallowed anyway as defense-in-depth.
        "/posts/",
      ],
    },
    // 410 Gone paths are intentionally left crawlable (not disallowed) so
    // Googlebot can fetch them and register the 410 status directly,
    // rather than being blocked from ever seeing it.
    sitemap: `https://${PRODUCTION_HOST}/sitemap.xml`,
  };
}
