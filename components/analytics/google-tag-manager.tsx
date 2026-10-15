"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { isProductionHost } from "@/lib/site-host";
import { getStoredConsent } from "@/lib/consent";

const GTM_CONTAINER_ID = "GTM-KDKNM5D";

// Phase 5K-C: loads the EXISTING GTM container -- no new container, no new
// GA4 property, so historical reporting is preserved.
//
// Host-gated to production ONLY (window.location.hostname check, client
// side -- this keeps the root layout itself static/server-rendered rather
// than forcing the whole site dynamic just to read a request header here).
// On preview, *.vercel.app, or localhost, this component renders nothing
// and injects no script at all -- not "loaded but inert", genuinely never
// requested. This is the explicit, conservative reading of "do not enable
// analytics on the preview website without a controlled testing plan": no
// uncontrolled testing path exists at all today. A deliberate, separate,
// explicitly-approved mechanism would be needed to test on preview later.
//
// Post-launch fix (2026-10-15): the Consent Mode v2 DEFAULT is no longer
// set here -- it moved to a synchronous, pre-hydration inline script (see
// components/analytics/consent-default-init.tsx for the full why). By the
// time this effect runs, window.dataLayer/window.gtag are already set up
// and the default has already been pushed on production hosts. This effect
// now only re-applies a returning visitor's previously STORED choice
// (unchanged from before -- that part was never the problem) and triggers
// the actual gtm.js load.
export function GoogleTagManager() {
  const injected = useRef(false);
  // Starts false on both server and client render -- the <Script> tag
  // below is only ever rendered (and the real gtm.js request only ever
  // made) once this flips true, which only happens on the production
  // host. This is the actual gate: the earlier effect-only check here was
  // a bug (fixed) -- the dataLayer/consent-default setup running without
  // the script tag being conditionally rendered meant gtm.js was being
  // requested on every host regardless.
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    if (injected.current) return;
    if (!isProductionHost(window.location.hostname)) return;
    injected.current = true;

    const w = window as unknown as {
      dataLayer: unknown[];
      gtag: (...args: unknown[]) => void;
    };
    // Set up by ConsentDefaultInit's beforeInteractive script already on
    // production -- these fallbacks only matter if that script somehow
    // didn't run (defensive, not the primary path).
    w.dataLayer = w.dataLayer || [];
    w.gtag = w.gtag || function gtag(...args: unknown[]) {
      w.dataLayer.push(args);
    };

    const stored = getStoredConsent();
    if (stored) {
      w.gtag("consent", "update", {
        analytics_storage: stored.analytics ? "granted" : "denied",
        ad_storage: stored.advertising ? "granted" : "denied",
        ad_user_data: stored.advertising ? "granted" : "denied",
        ad_personalization: stored.advertising ? "granted" : "denied",
      });
    }

    w.dataLayer.push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
    setShouldLoad(true);
  }, []);

  if (!shouldLoad) return null;

  return (
    <Script
      id="gtm-container-loader"
      strategy="afterInteractive"
      src={`https://www.googletagmanager.com/gtm.js?id=${GTM_CONTAINER_ID}`}
      onError={() => {
        // Blocked by an ad-blocker or network issue -- page rendering is
        // already unaffected (Script with afterInteractive never blocks
        // render either way); nothing further to do here.
      }}
    />
  );
}

// Deliberately NO <noscript> GTM iframe fallback: rendering it would
// require a server-side host check (the root layout is intentionally
// static, no request-time headers() call), and doing it unconditionally
// would load GTM for JS-disabled visitors on every host including
// preview -- the one case this component exists to prevent. The resulting
// gap (GTM never fires for visitors with JavaScript fully disabled) is a
// deliberate, accepted tradeoff: the site already requires JavaScript for
// every conversion path (forms, WhatsApp), so this population converts at
// zero regardless of whether GTM sees them.
