"use client";

import { useState } from "react";
import { ChevronDown, MessageCircle, Send } from "lucide-react";

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
  const [form, setForm] = useState({ name: "", email: "", phone: "", treatment: "", message: "" });

  const treatments = [
    "Hair Transplant", "Rhinoplasty", "Breast Augmentation", "Gynecomastia",
    "Dental Implant", "Blepharoplasty", "Liposuction", "Check-Up", "Other",
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
