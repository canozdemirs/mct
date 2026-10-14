"use client";

import { createContext, useContext, useState } from "react";
import { X } from "lucide-react";
import { ConsultationForm } from "./consultation-form";

// Site-wide lead-attribution fix (2026-10-14): openConsultation() now
// accepts an optional source label. Every call site previously opened this
// modal with no way to say where the patient was -- the form inside it
// always used the hardcoded "Get Quote Popup" string, on every page on the
// site, regardless of whether the patient was on a hospital page, a blog
// article, or anywhere else. The two real call sites (whatsapp-float.tsx,
// blog-article-content.tsx) now pass a page-aware label; any future call
// site that doesn't pass one still gets the same generic fallback as
// before, so this is purely additive.
type ConsultationModalContextValue = {
  openConsultation: (source?: string) => void;
};

const ConsultationModalContext = createContext<ConsultationModalContextValue | null>(null);

const DEFAULT_SOURCE = "Get Quote Popup";

export function ConsultationModalProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [source, setSource] = useState(DEFAULT_SOURCE);

  function openConsultation(nextSource?: string) {
    setSource(nextSource || DEFAULT_SOURCE);
    setOpen(true);
  }

  return (
    <ConsultationModalContext.Provider value={{ openConsultation }}>
      {children}

      {open && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative z-10 bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white rounded-t-3xl px-8 pt-8 pb-4 border-b border-gray-50 flex items-start justify-between gap-4">
              <div>
                <span className="inline-block text-xs font-bold uppercase tracking-widest text-teal mb-2">Free Consultation</span>
                <h3 className="text-2xl font-bold text-brand">Get Your Free Treatment Plan</h3>
                <p className="text-gray-400 text-sm mt-1 leading-relaxed">Fill in the form and we will get back to you within 48 hours — no commitment required.</p>
              </div>
              <button onClick={() => setOpen(false)} className="shrink-0 mt-1 text-gray-400 hover:text-gray-600 transition-colors">
                <X size={22} />
              </button>
            </div>
            <div className="px-8 py-6">
              <ConsultationForm source={source} onClose={() => setOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </ConsultationModalContext.Provider>
  );
}

export function useConsultationModal() {
  const ctx = useContext(ConsultationModalContext);
  if (!ctx) {
    throw new Error("useConsultationModal must be used within a ConsultationModalProvider");
  }
  return ctx;
}
