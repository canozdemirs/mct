"use client";

import { useEffect, useRef, useState } from "react";
import {
  readAndClearPendingWhatsAppMessage,
  buildWhatsAppUrl,
  WHATSAPP_GENERIC_MESSAGE,
  getCapturedAttribution,
} from "@/lib/attribution";

// Phase 5K-A: same-origin WhatsApp transition route. Opened synchronously
// (window.open, or a same-tab navigation if that was blocked) from the
// click handler itself, BEFORE anything asynchronous happens -- this page
// then does the async reference-code work on its own, inside a browsing
// context that already exists, which is what keeps WhatsApp reachable
// even on browsers that are strict about popups triggered indirectly.
//
// No patient-entered or medical content ever reaches this page via the
// URL -- there are no query parameters here at all. The prefilled message
// (which DOES contain patient-entered content for the consultation/landing
// forms) travels via localStorage, written by the opener immediately
// before navigation and read + immediately deleted here. localStorage was
// chosen specifically because it is unconditionally shared by origin,
// unlike sessionStorage, whose copy-to-a-new-tab behavior this
// implementation does not rely on or assume.
//
// Nothing here is sent to a server except the POST to /api/attribution,
// whose body is `{ channel: "whatsapp" }` plus (Phase 5K-C) whatever
// consent-gated first/session-touch marketing evidence was already
// captured elsewhere (lib/attribution.ts's getCapturedAttribution()) --
// no message content, no patient data, ever reaches a server log from
// this flow.
const TIMEOUT_MS = 1500;

export default function WhatsAppTransitionPage() {
  const [status, setStatus] = useState<"opening" | "redirecting">("opening");
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (hasRedirected.current) return; // StrictMode/dev double-invoke guard
    hasRedirected.current = true;

    const message = readAndClearPendingWhatsAppMessage() ?? WHATSAPP_GENERIC_MESSAGE;

    let settled = false;
    function redirect(code: string | null) {
      if (settled) return;
      settled = true;
      setStatus("redirecting");
      window.location.replace(buildWhatsAppUrl(message, code));
    }

    const timeoutId = window.setTimeout(() => redirect(null), TIMEOUT_MS);

    const { firstTouch, sessionTouch } = getCapturedAttribution();

    fetch("/api/attribution", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      keepalive: true,
      body: JSON.stringify({ channel: "whatsapp", firstTouch, sessionTouch }),
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((json: { code?: string } | null) => {
        window.clearTimeout(timeoutId);
        redirect(json?.code ?? null);
      })
      .catch(() => {
        window.clearTimeout(timeoutId);
        redirect(null);
      });

    return () => window.clearTimeout(timeoutId);
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-white px-6 text-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-[#25D366]" />
      <p className="text-sm font-medium text-gray-500">
        {status === "opening" ? "Opening WhatsApp…" : "Redirecting to WhatsApp…"}
      </p>
      <noscript>
        <p className="text-sm text-gray-500">
          <a href="https://wa.me/908508888911" className="underline text-[#25D366]">
            Continue to WhatsApp
          </a>
        </p>
      </noscript>
    </main>
  );
}
