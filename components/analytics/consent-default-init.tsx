import Script from "next/script";
import { PRODUCTION_HOST } from "@/lib/site-host";

// Post-launch fix (2026-10-15): the Consent Mode v2 default was previously
// set inside google-tag-manager.tsx's useEffect, which only runs after
// React hydrates -- a live Tag Assistant session confirmed GTM's own
// gtm.init_consent check was seeing NO default at all (not denied --
// absent), because gtm.js could be requested before hydration finished.
// Empirical timing trace: consent default landed ~600ms into page load in
// a clean run, only ~20ms before the gtm.js request -- a race GTM's
// consent engine can and did lose under real conditions, which is why
// Conversion Linker / GA4 / Ads Remarketing / Meta Pixel were observed
// firing (and writing cookies) with no consent signal present at all.
//
// This component renders a `beforeInteractive` inline script instead --
// Next.js guarantees this runs before ANY other page JS, hydration
// included, regardless of where in the tree it's declared (it's hoisted
// into the document <head>). No framework, no network request, nothing to
// race: by the time gtm.js can possibly be requested, this has already run.
//
// Deliberately sets ONLY the consent default -- nothing else. Loading
// gtm.js itself stays the sole responsibility of <GoogleTagManager />
// (components/analytics/google-tag-manager.tsx), unchanged, so there is
// exactly one place that ever requests the GTM container and no risk of
// duplicate loading. Re-applying a returning visitor's STORED consent
// choice also stays exactly where it already was (GoogleTagManager's own
// effect) -- only the DEFAULT needed to move; that part was never broken.
//
// Host-gated inline, using the same PRODUCTION_HOST constant
// GoogleTagManager/ConsentBanner already gate on (interpolated here, not
// hand-duplicated as a second literal, so there is one source of truth and
// nothing to drift) -- preview/localhost/*.vercel.app get an inline script
// that runs and immediately no-ops, matching the existing "genuinely never
// requested" behavior for anything GTM-related on non-production hosts.
export function ConsentDefaultInit() {
  return (
    <Script
      id="consent-default-init"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            if (window.location.hostname !== ${JSON.stringify(PRODUCTION_HOST)}) return;
            window.dataLayer = window.dataLayer || [];
            window.gtag = window.gtag || function() { window.dataLayer.push(arguments); };
            window.gtag("consent", "default", {
              analytics_storage: "denied",
              ad_storage: "denied",
              ad_user_data: "denied",
              ad_personalization: "denied",
              wait_for_update: 500
            });
          })();
        `,
      }}
    />
  );
}
