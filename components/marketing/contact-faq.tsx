"use client";

import { useState } from "react";
import { ChevronDown, MessageCircle, Send } from "lucide-react";

const faqs = [
  {
    q: "Is Medical Center Turkey a hospital?",
    a: "No. MCT is an International Patient Center and Health Tourism Coordinator. We connect you with Ministry of Health certified partner hospitals and manage your entire treatment journey — we are not a healthcare provider.",
  },
  {
    q: "Is the coordination service free?",
    a: "Yes, 100% free of charge. MCT's coordination, consultation, hospital matching, and package planning services are completely free for patients.",
  },
  {
    q: "Which hospital will perform my treatment?",
    a: "The most suitable hospital is selected according to your medical needs, treatment requirements, doctor availability, travel dates and package type. All our partner hospitals are Ministry of Health certified.",
  },
  {
    q: "How do I get started?",
    a: "Simply fill out the contact form or reach us via WhatsApp. We will assess your case, answer all your questions and prepare a personalised treatment plan — no pressure, no commitment.",
  },
  {
    q: "What is included in the Hassle-Free Package?",
    a: "Hospital coordination, appointment scheduling, VIP airport transfer, hotel accommodation, treatment support, post-op care kit and follow-up support. Everything managed from first inquiry to safe return home.",
  },
  {
    q: "Can I get a price quote before travelling?",
    a: "Yes. Send us your details and medical reports (if available) and we will prepare a full price quote and treatment plan within 24 hours, free of charge.",
  },
  {
    q: "Is Istanbul safe for medical travel?",
    a: "Istanbul is one of the world's leading medical tourism destinations. Turkey's healthcare infrastructure is internationally accredited and thousands of patients travel each year for safe, high-quality treatment.",
  },
];

export function ContactFAQ() {
  const [open, setOpen] = useState<number | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", treatment: "", message: "" });

  const treatments = [
    "Hair Transplant", "Rhinoplasty", "Breast Augmentation", "Gynecomastia",
    "Dental Implant", "Hollywood Smile", "Liposuction", "Check-Up", "Other",
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `Hello MCT,%0A%0AName: ${form.name}%0AEmail: ${form.email}%0APhone: ${form.phone}%0ATreatment: ${form.treatment}%0A%0A${form.message}`;
    window.open(`https://wa.me/908508888911?text=${text}`, "_blank");
  };

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

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Full Name</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="John Smith"
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-teal focus:bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Phone</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                    placeholder="+1 234 567 8900"
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-teal focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Email</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="john@example.com"
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-teal focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Treatment Interest</label>
                <select
                  value={form.treatment}
                  onChange={e => setForm({ ...form, treatment: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-teal focus:bg-white transition-all"
                >
                  <option value="">Select a treatment</option>
                  {treatments.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Message</label>
                <textarea
                  rows={4}
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  placeholder="Tell us about your treatment needs, questions or any details you'd like to share..."
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-teal focus:bg-white transition-all resize-none"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 bg-teal text-white px-6 py-3.5 rounded-full font-semibold text-sm hover:bg-[#159fb3] transition-colors shadow-lg shadow-teal/20"
                >
                  <MessageCircle size={15} />
                  Send via WhatsApp
                </button>
                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 bg-brand text-white px-6 py-3.5 rounded-full font-semibold text-sm hover:bg-[#154d8a] transition-colors shadow-lg shadow-brand/20"
                >
                  <Send size={15} />
                  Send Request
                </button>
              </div>

              <p className="text-xs text-gray-300 pt-1">
                Your information is kept strictly confidential. We never share patient data with third parties.
              </p>
            </form>
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
