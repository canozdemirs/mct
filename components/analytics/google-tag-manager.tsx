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
// Consent Mode v2 defaults are set via a tiny gtag-shim BEFORE gtm.js
// loads (Google's documented pattern for GTM-only setups that still want
// Consent Mode signals -- GTM reads the same dataLayer-based consent
// commands regardless of whether a standalone gtag.js is also present).
// Default is fully denied; a previously-stored choice (ConsentBanner) is
// applied immediately afterward so a returning visitor who already
// granted consent doesn't have to re-decide on every page load.
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
    w.dataLayer = w.dataLayer || [];
    w.gtag = function gtag(...args: unknown[]) {
      w.dataLayer.push(args);
    };

    w.gtag("consent", "default", {
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      wait_for_update: 500,
    });

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
