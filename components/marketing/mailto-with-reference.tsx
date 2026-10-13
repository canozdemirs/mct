"use client";

import { getCapturedAttribution } from "@/lib/attribution";

// Phase 5K-A: wraps a real mailto: link so a reference code is appended to
// the subject line where feasible, without changing its visible text or
// behavior if anything fails. A mailto: hand-off is a protocol-handler
// navigation, not a new browsing context -- it is not subject to the same
// popup-blocking heuristics as window.open(), so the simpler
// "fetch, then navigate" sequence used here (rather than the WhatsApp
// transition route's synchronous-open pattern) is sufficient and reliable.
//
// A click here is NOT proof that an email was sent -- same caveat as every
// other channel in this phase.
export function MailtoWithReference({
  address,
  subject,
  className,
  children,
}: {
  address: string;
  subject: string;
  className?: string;
  children: React.ReactNode;
}) {
  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    const plainMailto = `mailto:${address}?subject=${encodeURIComponent(subject)}`;

    const { firstTouch, sessionTouch } = getCapturedAttribution();

    fetch("/api/attribution", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      keepalive: true,
      body: JSON.stringify({ channel: "email", firstTouch, sessionTouch }),
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((json: { code?: string } | null) => {
        window.location.href = json?.code
          ? `mailto:${address}?subject=${encodeURIComponent(`${subject} - Ref ${json.code}`)}`
          : plainMailto;
      })
      .catch(() => {
        window.location.href = plainMailto;
      });
  }

  return (
    <a href={`mailto:${address}`} onClick={handleClick} className={className}>
      {children}
    </a>
  );
}
