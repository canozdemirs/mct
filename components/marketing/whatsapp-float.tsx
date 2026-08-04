"use client";

import { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { ConsultationForm } from "./consultation-form";

export function WhatsAppFloat() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating buttons */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        <button
          onClick={() => setOpen(true)}
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

      {/* Popup form */}
      {open && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative z-10 bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white rounded-t-3xl px-8 pt-8 pb-4 border-b border-gray-50 flex items-start justify-between gap-4">
              <div>
                <span className="inline-block text-xs font-bold uppercase tracking-widest text-teal mb-2">Free Consultation</span>
                <h3 className="text-2xl font-bold text-brand">Get Your Free Treatment Plan</h3>
                <p className="text-gray-400 text-sm mt-1 leading-relaxed">Fill in the form and we will get back to you within 24 hours — no commitment required.</p>
              </div>
              <button onClick={() => setOpen(false)} className="shrink-0 mt-1 text-gray-400 hover:text-gray-600 transition-colors">
                <X size={22} />
              </button>
            </div>
            <div className="px-8 py-6">
              <ConsultationForm onSuccess={() => setOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
