import type { NextConfig } from "next";

// 404-audit follow-up (2026-10-22): the 9 legacy redirects that used to
// live in this file's own redirects() moved to lib/legacy-redirects.ts,
// alongside the much larger set of new ones from that audit -- single
// source of truth, checked in proxy.ts. skipTrailingSlashRedirect turns
// off Next's own automatic trailing-slash-strip redirect (which otherwise
// runs BEFORE any redirect source/middleware gets a chance, turning every
// trailing-slash request into a 308-then-301 chain -- confirmed on the
// live site before this change). proxy.ts now owns trailing-slash
// handling entirely: it replicates that same default behavior for every
// path NOT in lib/legacy-redirects.ts or lib/gone-paths.ts, so nothing
// else on the site changes behavior -- only the legacy/gone paths become
// genuinely single-hop even when the request has a trailing slash.
const nextConfig: NextConfig = {
  skipTrailingSlashRedirect: true,
};

export default nextConfig;
