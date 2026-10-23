"use client";

import { Analytics, type BeforeSendEvent } from "@vercel/analytics/next";
import { PRODUCTION_HOST } from "@/lib/site-host";

// 2026-10-23: Vercel Web Analytics, enabled for this project in the
// dashboard. `beforeSend` has to live in a client component -- it's a
// function prop, and functions can't cross the server/client boundary
// from app/layout.tsx (a Server Component).
//
// Excluded entirely, independent of any cookie-consent state: admin,
// partner-portal, auth, and api routes (internal/operational traffic, not
// visitor analytics), and any non-production hostname (preview deploys,
// *.vercel.app, localhost) -- same PRODUCTION_HOST check proxy.ts/
// sitemap.ts/robots.ts already use, so preview and prod can never get
// confused here either (see lib/site-host.ts's own comment for why this
// is hostname-based, not process.env.VERCEL_ENV).
//
// Deliberately NOT gated on cookie consent (components/analytics/consent-
// banner.tsx) -- Vercel Web Analytics is aggregate, cookie-less traffic
// measurement, kept entirely separate from the GTM/consent pipeline that
// governs actual tracking cookies.
const EXCLUDED_PATH_PREFIXES = ["/admin", "/partner-portal", "/auth", "/api"];

function isExcludedPath(pathname: string): boolean {
  return EXCLUDED_PATH_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

function beforeSend(event: BeforeSendEvent): BeforeSendEvent | null {
  let url: URL;
  try {
    url = new URL(event.url);
  } catch {
    return null;
  }
  if (url.hostname !== PRODUCTION_HOST) return null;
  if (isExcludedPath(url.pathname)) return null;
  return event;
}

export function VercelWebAnalytics() {
  return <Analytics beforeSend={beforeSend} />;
}
