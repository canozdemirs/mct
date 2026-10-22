import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { BLOG_SLUGS } from "@/lib/blog-slugs.generated";
import { isGonePath } from "@/lib/gone-paths";
import { getLegacyRedirect } from "@/lib/legacy-redirects";
import { resolveEmbeddedUrlRedirect, resolveTrailingJunkRedirect } from "@/lib/malformed-url-redirects";
import { GONE_PAGE_HTML } from "@/lib/gone-page";
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
// Search Console follow-up (2026-10-22): branded HTML body instead of
// plain text -- see lib/gone-page.ts for why this has to be a static
// string rather than a rendered page. Status stays 410; the page's own
// <meta name="robots" content="noindex"> is unconditional (unlike
// withRobotsTag's X-Robots-Tag header below, which only fires off the
// production host) since a 410 should never be indexable regardless of
// host.
function goneResponse() {
  return new NextResponse(GONE_PAGE_HTML, {
    status: 410,
    headers: { "Content-Type": "text/html; charset=utf-8" },
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

  // Search Console follow-up (2026-10-22): checked before anything else --
  // a request whose path has a whole second URL pasted into it
  // (/https://www.medicalcenterturkey.com/<real-path>) can never itself be
  // a real route, legacy-redirect key, or gone slug, so there's no risk of
  // this shadowing any of the checks below. Resolves straight to the
  // embedded path's own final target (single hop) or 410 if that embedded
  // path isn't real.
  const embedded = resolveEmbeddedUrlRedirect(segments);
  if (embedded) {
    if ("gone" in embedded) {
      return withRobotsTag(goneResponse(), host);
    }
    return withRobotsTag(NextResponse.redirect(new URL(embedded.target, request.url), 301), host);
  }

  // 404-audit follow-up (2026-10-22): checked first, ahead of isGonePath,
  // since the two sets are disjoint by construction (verified when
  // lib/legacy-redirects.ts was written) -- order between them doesn't
  // matter, but a redirect answering "where do I go" reads more naturally
  // before a flat "this is gone".
  const legacyTarget = getLegacyRedirect(segments);
  if (legacyTarget) {
    return withRobotsTag(NextResponse.redirect(new URL(legacyTarget, request.url), 301), host);
  }

  if (isGonePath(segments)) {
    return withRobotsTag(goneResponse(), host);
  }

  // Search Console follow-up (2026-10-22): a path with stray trailing
  // whitespace/%20/%0A/";" (often arriving as its own trailing segment,
  // e.g. .../how-to-make-your-breasts-grow-bigger-naturally/;). Only
  // redirects when the cleaned path is a real page -- otherwise falls
  // through to the ordinary 404 below rather than manufacturing a redirect
  // to somewhere that doesn't exist.
  const trailingJunk = resolveTrailingJunkRedirect(segments);
  if (trailingJunk) {
    return withRobotsTag(NextResponse.redirect(new URL(trailingJunk.target, request.url), 301), host);
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

  // next.config.ts sets skipTrailingSlashRedirect: true so the two legacy
  // mechanisms above can be genuinely single-hop even when the incoming
  // request has a trailing slash (Next's own automatic trailing-slash
  // redirect would otherwise run BEFORE any of this code, turning every
  // one of them into a 308-then-redirect chain). This replicates that
  // same default behavior for every other path, so nothing else on the
  // site changes: strip exactly one trailing slash, same 308, same
  // destination Next would have produced on its own.
  if (pathname.length > 1 && pathname.endsWith("/")) {
    const url = new URL(request.url);
    url.pathname = pathname.slice(0, -1);
    return withRobotsTag(NextResponse.redirect(url, 308), host);
  }

  return withRobotsTag(NextResponse.next(), host);
}

// 404-audit follow-up (2026-10-22) bug fix: the previous pattern excluded
// any path merely STARTING WITH these literal characters, with no word
// boundary -- "auth" (meant to exclude only /auth/*) also matched
// /author/*, since "author" begins with the four characters "auth".
// This silently made AUTHOR_PREFIX in lib/gone-paths.ts dead code: every
// /author/* request bypassed this whole function and fell through to
// Next's default 404 instead of ever reaching isGonePath(). Each
// alternative now requires a following "/" or end-of-string.
export const config = {
  matcher: [
    "/((?!(?:api|_next|admin|partner-portal|auth|favicon\\.ico)(?:/|$)).*)",
  ],
};
