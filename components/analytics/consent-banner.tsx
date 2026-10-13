"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { isProductionHost } from "@/lib/site-host";
import { getStoredConsent, storeConsent, updateConsentSignals } from "@/lib/consent";

// Phase 5K-C: minimal consent UI -- Accept all / Reject all / a single
// Preferences toggle (Analytics vs Advertising, matching the two
// categories lib/consent.ts actually governs). This is NOT presented as a
// complete legal compliance solution -- see the Phase 5K-C report for what
// still needs legal/owner review (banner copy, KVKK/GDPR basis, retention
// language in the privacy policy).
//
// Host-gated to production only, same reasoning as GoogleTagManager: there
// is nothing to consent to on a host where no tracking loads at all.
export function ConsentBanner() {
  // Starts false on both server and client -- no hydration mismatch, so no
  // separate "mounted" flag is needed before deciding visibility client-side.
  const [visible, setVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [analyticsChecked, setAnalyticsChecked] = useState(false);
  const [advertisingChecked, setAdvertisingChecked] = useState(false);

  useEffect(() => {
    if (!isProductionHost(window.location.hostname)) return;
    if (getStoredConsent() === null) setVisible(true);
  }, []);

  function applyAndClose(analytics: boolean, advertising: boolean) {
    storeConsent({ analytics, advertising });
    updateConsentSignals({ analytics, advertising });
    setVisible(false);
    setShowPreferences(false);
  }

  function reopenForWithdrawal() {
    const stored = getStoredConsent();
    setAnalyticsChecked(stored?.analytics ?? false);
    setAdvertisingChecked(stored?.advertising ?? false);
    setShowPreferences(true);
    setVisible(true);
  }

  // Exposed so a "Cookie Preferences" link elsewhere (e.g. the footer) can
  // reopen this same banner to change or withdraw a prior choice.
  useEffect(() => {
    if (typeof window === "undefined") return;
    (window as unknown as { mctReopenConsent?: () => void }).mctReopenConsent = reopenForWithdrawal;
  }, []);

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie and privacy preferences"
      className="fixed bottom-0 inset-x-0 z-[1000] bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] p-4 sm:p-5"
    >
      <div className="max-w-4xl mx-auto">
        {!showPreferences ? (
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <p className="text-sm text-gray-600 flex-1">
              We use cookies for site analytics and advertising measurement. You can accept, reject, or choose
              your preferences. See our{" "}
              <Link href="/privacy-policy" className="underline text-teal">Privacy Policy</Link>.
            </p>
            <div className="flex gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setShowPreferences(true)}
                className="px-4 py-2 rounded-full text-sm font-semibold text-gray-600 border border-gray-200 hover:border-gray-300"
              >
                Preferences
              </button>
              <button
                type="button"
                onClick={() => applyAndClose(false, false)}
                className="px-4 py-2 rounded-full text-sm font-semibold text-gray-600 border border-gray-200 hover:border-gray-300"
              >
                Reject All
              </button>
              <button
                type="button"
                onClick={() => applyAndClose(true, true)}
                className="px-4 py-2 rounded-full text-sm font-semibold text-white bg-brand hover:bg-[#154d8a]"
              >
                Accept All
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" checked={analyticsChecked} onChange={(e) => setAnalyticsChecked(e.target.checked)} className="accent-teal" />
              Analytics (helps us understand site usage)
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" checked={advertisingChecked} onChange={(e) => setAdvertisingChecked(e.target.checked)} className="accent-teal" />
              Advertising (measures ad campaign performance)
            </label>
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setShowPreferences(false)}
                className="px-4 py-2 rounded-full text-sm font-semibold text-gray-600 border border-gray-200"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => applyAndClose(analyticsChecked, advertisingChecked)}
                className="px-4 py-2 rounded-full text-sm font-semibold text-white bg-brand hover:bg-[#154d8a]"
              >
                Save Preferences
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/** Minimal helper for a "Cookie Preferences" link/button elsewhere in the
 * UI (e.g. footer.tsx) to reopen the banner for withdrawal/change. */
export function reopenConsentBanner() {
  if (typeof window === "undefined") return;
  (window as unknown as { mctReopenConsent?: () => void }).mctReopenConsent?.();
}
