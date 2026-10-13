import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { BLOG_SLUGS } from "@/lib/blog-slugs.generated";
import { isGonePath } from "@/lib/gone-paths";
import { isProductionHost } from "@/lib/site-host";

// Next.js 16 renamed `middleware.ts` to `proxy.ts` (same API, same
// execution order — runs before filesystem routes are resolved).
//
// Why this file exists: `app/[hospital]/page.tsx` already owns the only
// dynamic segment Next.js allows at the site root (you cannot have a second,
// differently-named dynamic segment — e.g. `app/[slug]/page.tsx` — at the
// same path level; Next.js throws a build error). Rather than touch the
// existing, working hospital route, blog posts live at a separate internal
// path (`app/(blog-engine)/posts/[slug]/page.tsx`) and this proxy silently
// rewrites the public root-level URL to that internal path. The visible URL
// in the browser never changes — only Next.js's internal routing does.
//
// Hospital slugs always win if a name were ever to collide (none do today
// — verified against all 611 migrated blog slugs).
//
// Direct requests to /posts/<slug> (the internal path, not the public one)
// are permanently redirected back to the public root URL here, so that
// path is never a second, publicly indexable copy of the article. This
// used to live inside the page component via a `headers()` check, which
// forced the whole route to render dynamically on every request. Moving it
// here instead means the page itself needs no request-time API and can go
// back to being fully statically generated — proxy already runs on every
// request regardless, so this adds no new cost, it just relocates work
// that was happening anyway.
//
// No loop risk: a direct hit to /posts/<slug> gets a redirect response sent
// to the browser, which then makes a brand-new request for /<slug> — that
// new request matches the BLOG_SLUGS branch below and gets rewritten (not
// redirected) to /posts/<slug>, which resolves normally. Two separate
// request cycles, not a recursive one — Next.js does not re-run proxy
// against a URL a rewrite resolves to within the same request.
// Phase 5A (2026-10-10): HTTP 410 Gone for every URL the migration map
// approved as 410 (see lib/gone-paths.ts), plus the historical GTranslate
// /tr, /fr, /de prefixes. Checked first and returns immediately — these
// paths never overlap with BLOG_SLUGS or any hospital/treatment/static
// route (verified before writing lib/gone-paths.ts), so this can never
// shadow /medical-tourism-turkey, /medicaltourismturkey, a blog post, a
// hospital page, or a treatment page.
function goneResponse() {
  return new NextResponse("Gone", {
    status: 410,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

// Phase 5C (2026-10-10): www is the proven canonical (see the live
// WordPress redirect-chain evidence in the Phase 5C report). This apex
// -> www redirect is the part of that standard that's controllable purely
// in application code; it's a defense-in-depth layer only — the primary
// enforcement still has to happen at the Vercel/Cloudflare domain
// configuration on launch day (that part is out of scope here, no DNS/
// Cloudflare/Vercel settings were touched). Matches the literal apex
// hostname only, so it never fires for preview.medicalcenterturkey.com,
// *.vercel.app, or localhost.
const APEX_HOST = "medicalcenterturkey.com";

// Phase 5K-D: applied to every response this function returns, right
// before it goes out, regardless of which branch produced it (redirect,
// gone, rewrite, or plain pass-through) -- one place, so no future new
// branch can accidentally skip it. Non-production hosts (preview, the
// apex before its own redirect completes, *.vercel.app, localhost, or a
// missing/spoofed Host header) always get this; the production host
// never does, leaving each page's own `robots` metadata (or its absence)
// as the real, approved answer. See app/layout.tsx for why this lives
// here instead of a request-time check in the root layout: this keeps
// the entire site statically generated.
function withRobotsTag(response: NextResponse, host: string | null): NextResponse {
  if (!isProductionHost(host)) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }
  return response;
}

export function proxy(request: NextRequest) {
  const host = request.headers.get("host");
  if (host === APEX_HOST) {
    const url = new URL(request.url);
    url.protocol = "https";
    url.hostname = "www.medicalcenterturkey.com";
    // Setting `.host` alone doesn't clear a pre-existing port (verified —
    // it's preserved as-is), so `.port` is cleared explicitly.
    url.port = "";
    return withRobotsTag(NextResponse.redirect(url, 301), host);
  }

  const { pathname } = request.nextUrl;
  const segments = pathname.split("/").filter(Boolean);

  if (isGonePath(segments)) {
    return withRobotsTag(goneResponse(), host);
  }

  if (segments.length === 1) {
    const slug = segments[0];
    if (BLOG_SLUGS.has(slug)) {
      return withRobotsTag(NextResponse.rewrite(new URL(`/posts/${slug}`, request.url)), host);
    }
  }

  if (segments.length === 2 && segments[0] === "posts" && BLOG_SLUGS.has(segments[1])) {
    return withRobotsTag(NextResponse.redirect(new URL(`/${segments[1]}`, request.url), 308), host);
  }

  return withRobotsTag(NextResponse.next(), host);
}

export const config = {
  matcher: [
    "/((?!api|_next|admin|partner-portal|auth|favicon.ico).*)",
  ],
};
