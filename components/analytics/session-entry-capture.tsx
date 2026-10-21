"use client";

import { useEffect } from "react";
import { captureSessionEntryOnce } from "@/lib/session-entry";

// Mounted once in the root layout. Unlike AttributionCapture (consent-
// gated, re-runs on every route change for session/last-touch), this only
// ever needs to fire once per tab session -- see lib/session-entry.ts.
export function SessionEntryCapture() {
  useEffect(() => {
    captureSessionEntryOnce();
  }, []);
  return null;
}
