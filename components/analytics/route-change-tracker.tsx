"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { trackPageView } from "@/lib/analytics";

// Phase 5K-C: Next.js App Router client-side navigation does not reload
// the page, so GTM's own initial page-view (fired once, on the real
// browser navigation that loaded gtm.js) never fires again on a
// client-side route change. This pushes one page_view per SUBSEQUENT
// route change -- the very first render is deliberately skipped (a ref
// guard, not a path comparison) so the initial load is never double
// counted against GTM's own implicit first page view.
export function RouteChangeTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const query = searchParams.toString();
    trackPageView(query ? `${pathname}?${query}` : pathname);
  }, [pathname, searchParams]);

  return null;
}
