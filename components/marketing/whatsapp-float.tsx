"use client";

import { usePathname } from "next/navigation";
import { MessageCircle, Send } from "lucide-react";
import { useConsultationModal } from "./consultation-modal";
import { openWhatsAppTransition, WHATSAPP_GENERIC_MESSAGE } from "@/lib/attribution";

// Site-wide lead-attribution fix (2026-10-14): this component renders
// identically on every page via a single <WhatsAppFloat /> call, so it has
// no page-specific props to work with -- it derives its own context from
// usePathname() instead, fixing the "Get Quote Popup" modal's source label
// on every page that uses it without having to touch each one.
export function WhatsAppFloat() {
  const { openConsultation } = useConsultationModal();
  const pathname = usePathname();

  function handleGetQuote() {
    openConsultation(`Floating Get Quote (${pathname})`);
  }

  function handleWhatsApp(e: React.MouseEvent) {
    e.preventDefault();
    openWhatsAppTransition(WHATSAPP_GENERIC_MESSAGE);
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <button
        onClick={handleGetQuote}
        className="flex flex-col items-center justify-center gap-1 bg-brand text-white w-16 h-16 rounded-2xl shadow-xl hover:bg-[#154d8a] transition-all hover:scale-105"
      >
        <Send size={18} />
        <span className="text-[10px] font-bold leading-none">Get Quote</span>
      </button>

      {/* href is the plain WhatsApp link as a no-JS fallback -- onClick
          preventDefault()s and runs the reference-code transition only
          when JavaScript is actually active. */}
      <a
        href="https://wa.me/908508888911"
        onClick={handleWhatsApp}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col items-center justify-center gap-1 bg-[#25D366] text-white w-16 h-16 rounded-2xl shadow-xl hover:bg-[#1fb55a] transition-all hover:scale-105"
      >
        <MessageCircle size={20} />
        <span className="text-[10px] font-bold leading-none">WhatsApp</span>
      </a>
    </div>
  );
}
