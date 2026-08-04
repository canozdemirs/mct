"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { ConsultationForm } from "./consultation-form";

const faqs = [
  {
    q: "Why do people choose Turkey for medical treatments?",
    a: "Turkey has become one of the world's leading destinations for medical treatments, combining internationally accredited hospitals, experienced specialists, and significantly lower costs compared to the UK, USA, and Europe — without compromising on quality or safety.",
  },
  {
    q: "How much can I save by getting treatment in Turkey?",
    a: "Treatment costs in Turkey are typically 50-70% lower than in the UK, USA, or Western Europe, while using the same internationally recognized standards, technology, and techniques.",
  },
  {
    q: "What treatments does Medical Center Turkey coordinate?",
    a: "We coordinate care across a wide range of treatments, including hair transplantation, cosmetic and plastic surgery, dental treatments, and other specialist procedures, matching each patient with the right hospital and specialist for their needs.",
  },
  {
    q: "Do I need a visa to travel to Turkey for medical treatment?",
    a: "Many nationalities, including the UK, USA, and most EU countries, can enter Turkey visa-free or obtain an e-visa online in minutes. We can guide you through the exact requirements based on your nationality.",
  },
  {
    q: "How long do I need to stay in Turkey for treatment?",
    a: "Stay duration depends on the treatment type, typically ranging from 3 days to 2 weeks. We'll provide a personalized itinerary as part of your treatment plan, including recovery time before you fly home.",
  },
  {
    q: "Are the hospitals in Turkey internationally accredited?",
    a: "Yes. We work exclusively with Ministry of Health certified hospitals that meet international healthcare standards, ensuring the same level of safety and quality you'd expect at home.",
  },
  {
    q: "How do I get a personalized treatment plan and price quote?",
    a: "Simply send us your details and photos (if relevant) through our consultation form or WhatsApp. Our case management team reviews your case and prepares a personalized treatment plan and quote within 24 hours.",
  },
];

export function ContactFAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section
      id="consultation"
      className="relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #f0f6ff 0%, #f5feff 100%)" }}
    >
      {/* Decorative blobs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none" style={{ background: "#1b5fa8" }} />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full opacity-15 blur-3xl pointer-events-none" style={{ background: "#1ab3c8" }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-stretch">

          {/* Contact Form */}
          <div className="bg-white rounded-3xl shadow-xl shadow-brand/5 p-8 sm:p-10 flex flex-col h-full">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-teal mb-3">Free Consultation</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-brand mb-2">Get Your Free Treatment Plan</h2>
            <p className="text-gray-400 text-sm mb-8 leading-relaxed">Fill in the form and we will get back to you within 24 hours — no commitment required.</p>

            <ConsultationForm />
          </div>

          {/* FAQ */}
          <div className="bg-white rounded-3xl shadow-xl shadow-brand/5 p-8 sm:p-10 flex flex-col h-full">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-teal mb-3">FAQ</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-brand mb-8">Frequently Asked Questions</h2>

            <div className="space-y-2">
              {faqs.map((faq, i) => (
                <div
                  key={i}
                  className={`rounded-2xl overflow-hidden transition-all border ${open === i ? "border-teal/30 bg-white shadow-md shadow-teal/5" : "border-transparent bg-white/60 hover:bg-white"}`}
                >
                  <button
                    onClick={() => setOpen(open === i ? null : i)}
                    className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                  >
                    <span className={`text-sm font-semibold transition-colors ${open === i ? "text-brand" : "text-gray-700"}`}>{faq.q}</span>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all ${open === i ? "bg-teal" : "bg-gray-100"}`}>
                      <ChevronDown
                        size={13}
                        className={`transition-transform duration-200 ${open === i ? "rotate-180 text-white" : "text-gray-400"}`}
                      />
                    </div>
                  </button>
                  {open === i && (
                    <div className="px-5 pb-5 text-sm text-gray-500 leading-relaxed border-t border-gray-50">
                      <p className="pt-3">{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

    </section>
  );
}
