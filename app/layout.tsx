import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist } from "next/font/google";
import { ConsultationModalProvider } from "@/components/marketing/consultation-modal";
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
  // (most of the 608 blog posts, legal pages, etc.) is indexable on
  // production. Preview is protected by a SEPARATE, non-static mechanism
  // instead: proxy.ts sets an X-Robots-Tag: noindex, nofollow response
  // header for any non-production host (lib/site-host.ts's
  // isProductionHost() — the same proven hostname check robots.ts/
  // sitemap.ts already use, deliberately not process.env.VERCEL_ENV; see
  // that file's own comment for the prior incident that ruled it out).
  // Doing it in proxy.ts rather than here keeps the whole site static —
  // making this a request-time check here (via generateMetadata()) would
  // force every one of the 608 blog posts and 38 hospital pages dynamic.
  // Pages with their own deliberate noindex (homepage, /hospitals-in-turkey,
  // every /[hospital], all 12 treatment pages) are UNAFFECTED by this
  // change — they already set their own robots field, which always took
  // precedence over this one regardless.
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
