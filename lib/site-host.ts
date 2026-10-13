// Hostname-based environment detection for robots.ts / sitemap.ts.
//
// Deliberately NOT based on `process.env.VERCEL_ENV`: this project has
// already seen a Production-environment deployment aliased to the preview
// hostname (preview.medicalcenterturkey.com), which would make a
// VERCEL_ENV === "production" check report "production" while actually
// serving preview traffic. The only thing that can't lie here is the
// actual Host header of the incoming request, so that's what gates
// indexability. Anything that isn't exactly the live production host
// (preview deployments, the bare apex, *.vercel.app, localhost, or a
// missing/spoofed header) is treated as non-production and kept closed.
export const PRODUCTION_HOST = "www.medicalcenterturkey.com";

export function isProductionHost(host: string | null | undefined): boolean {
  return host === PRODUCTION_HOST;
}
