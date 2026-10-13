"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { captureTouchIfConsented } from "@/lib/attribution";
import { hasConsent } from "@/lib/consent";

// Phase 5K-C: captures first-touch/session-touch marketing evidence on
// every page view. Deliberately NOT host-gated the way GoogleTagManager/
// ConsentBanner are -- this writes to OUR OWN Supabase attribution system,
// not to Google. It naturally ends up a no-op on non-production hosts
// anyway, because ConsentBanner (which is the only thing that ever grants
// consent) only renders on production -- hasConsent() stays false
// everywhere else, and captureTouchIfConsented() already treats "nothing
// granted" as "capture nothing".
export function AttributionCapture() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    captureTouchIfConsented({
      analytics: hasConsent("analytics"),
      advertising: hasConsent("advertising"),
    });
    // Re-run on every route change (not just mount) -- session/last-touch
    // should reflect the most recent landing page+params, e.g. a visitor
    // who first arrives direct, then later clicks a different ad.
  }, [pathname, searchParams]);

  return null;
}
