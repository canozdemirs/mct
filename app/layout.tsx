import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist } from "next/font/google";
import { ConsultationModalProvider } from "@/components/marketing/consultation-modal";
import { ConsentDefaultInit } from "@/components/analytics/consent-default-init";
import { GoogleTagManager } from "@/components/analytics/google-tag-manager";
import { RouteChangeTracker } from "@/components/analytics/route-change-tracker";
import { AttributionCapture } from "@/components/analytics/attribution-capture";
import { ConsentBanner } from "@/components/analytics/consent-banner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  // Phase 5C (2026-10-10): canonical domain standard is HTTPS + WWW,
  // confirmed against the live WordPress site's own redirect chain
  // (apex -> https -> www). This resolves any *relative* canonical URL
  // (e.g. alternates.canonical: "/some-slug") against this base — it does
  // NOT retroactively fix pages whose canonical was already written as an
  // absolute non-www URL; those were corrected individually (see the
  // Phase 5C report for the full list).
  metadataBase: new URL("https://www.medicalcenterturkey.com"),
  title: "Medical Center Turkey",
  description: "Medical Center Turkey — healthcare services",
  // Phase 5K-D: the unconditional noindex this field carried has been
  // removed. On its own this field is now the real "approved default" —
  // no restriction, so any page that sets no robots field of its own
  // (every one of the 608 blog posts, the homepage, every hospital page,
  // every treatment page, legal pages, etc. — none currently sets its own
  // robots field) is indexable the moment it's served on the production
  // host. Preview is protected by a SEPARATE, non-static mechanism
  // instead: proxy.ts sets an X-Robots-Tag: noindex, nofollow response
  // header for any non-production host (lib/site-host.ts's
  // isProductionHost() — the same proven hostname check robots.ts/
  // sitemap.ts already use, deliberately not process.env.VERCEL_ENV; see
  // that file's own comment for the prior incident that ruled it out).
  // Doing it in proxy.ts rather than here keeps the whole site static —
  // making this a request-time check here (via generateMetadata()) would
  // force every one of the 608 blog posts and 38 hospital pages dynamic.
  //
  // Phase 4 follow-up (2026-10-14), correction: this comment previously
  // claimed the homepage, /hospitals-in-turkey, every /[hospital], and all
  // 12 treatment pages "already set their own robots field" and were
  // therefore unaffected by this change. That was checked and found false
  // — none of those pages (or any other page) sets a robots field. In
  // practice this means indexing today is an all-or-nothing switch tied
  // purely to hostname, not staged by page: the instant the production
  // hostname serves this app, every page becomes indexable simultaneously.
  // If a staged rollout across page categories is ever wanted, per-page
  // robots overrides would need to be added — they do not exist today.
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col overflow-x-hidden">
        <ConsentDefaultInit />
        <GoogleTagManager />
        <Suspense fallback={null}>
          <RouteChangeTracker />
          <AttributionCapture />
        </Suspense>
        <ConsultationModalProvider>{children}</ConsultationModalProvider>
        <ConsentBanner />
      </body>
    </html>
  );
}
