"use client";

import { MessageCircle, Send } from "lucide-react";
import { useConsultationModal } from "./consultation-modal";

export function WhatsAppFloat() {
  const { openConsultation } = useConsultationModal();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <button
        onClick={openConsultation}
        className="flex flex-col items-center justify-center gap-1 bg-brand text-white w-16 h-16 rounded-2xl shadow-xl hover:bg-[#154d8a] transition-all hover:scale-105"
      >
        <Send size={18} />
        <span className="text-[10px] font-bold leading-none">Get Quote</span>
      </button>

      <a
        href="https://wa.me/908508888911"
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
