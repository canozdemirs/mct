"use client";

import { openWhatsAppTransition, WHATSAPP_GENERIC_MESSAGE } from "@/lib/attribution";

// Phase 5K-A: generic wrapper for a static, no-prefilled-message WhatsApp
// link embedded in a Server Component (hospital pages, partner portal)
// that otherwise has no reason to become a Client Component itself. Same
// synchronous-transition behavior as every other WhatsApp entry point on
// the site (whatsapp-float.tsx, contact-bar.tsx, form-success-message.tsx,
// the 11 landing pages' hero CTAs) -- kept here as a shared component
// instead of duplicating the onClick inline, since more server-component
// call sites may need this same wrapper later.
export function WhatsAppLink({
  className,
  message = WHATSAPP_GENERIC_MESSAGE,
  children,
}: {
  className?: string;
  message?: string;
  children: React.ReactNode;
}) {
  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    openWhatsAppTransition(message);
  }

  return (
    <a href="https://wa.me/908508888911" onClick={handleClick} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
    </a>
  );
}
