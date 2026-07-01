"use client";

import { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";

const treatments = [
  "Hair Transplant", "Rhinoplasty", "Breast Augmentation", "Gynecomastia",
  "Dental Implant", "Blepharoplasty", "Liposuction", "Check-Up", "Other",
];

export function WhatsAppFloat() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", treatment: "", message: "" });

  const handleWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `Hello MCT,%0A%0AName: ${form.name}%0AEmail: ${form.email}%0APhone: ${form.phone}%0ATreatment: ${form.treatment}%0A%0A${form.message}`;
    window.open(`https://wa.me/908508888911?text=${text}`, "_blank");
    setOpen(false);
    setForm({ name: "", email: "", phone: "", treatment: "", message: "" });
  };

  const handleEmail = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Treatment Inquiry from ${form.name}`);
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\nTreatment: ${form.treatment}\n\n${form.message}`
    );
    window.location.href = `mailto:hello@medicalcenterturkey.com?subject=${subject}&body=${body}`;
    setOpen(false);
    setForm({ name: "", email: "", phone: "", treatment: "", message: "" });
  };

  return (
    <>
      {/* Floating buttons */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">

        {/* Get Free Quote button */}
        <button
          onClick={() => setOpen(true)}
          className="flex flex-col items-center justify-center gap-1 bg-brand text-white w-16 h-16 rounded-2xl shadow-xl hover:bg-[#154d8a] transition-all hover:scale-105"
        >
          <Send size={18} />
          <span className="text-[10px] font-bold leading-none">Get Quote</span>
        </button>

        {/* WhatsApp button */}
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
        <div
          className="fixed inset-0 z-[999] bg-black/50 flex items-center justify-center p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <span className="inline-block text-xs font-bold uppercase tracking-widest text-teal mb-2">Free Consultation</span>
                <h3 className="text-2xl font-bold text-brand">Get Your Free Treatment Plan</h3>
                <p className="text-gray-400 text-sm mt-1 leading-relaxed">Fill in the form and we will get back to you within 24 hours — no commitment required.</p>
              </div>
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors ml-4 mt-1 shrink-0">
                <X size={22} />
              </button>
            </div>

            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
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
                  rows={3}
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  placeholder="Tell us about your treatment needs, questions or any details you'd like to share..."
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-teal focus:bg-white transition-all resize-none"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-1">
                <button
                  type="button"
                  onClick={handleWhatsApp}
                  className="flex items-center justify-center gap-2 bg-[#25D366] text-white px-6 py-3.5 rounded-full font-semibold text-sm hover:bg-[#1fb55a] transition-colors shadow-lg"
                >
                  <MessageCircle size={15} />
                  Send via WhatsApp
                </button>
                <button
                  type="button"
                  onClick={handleEmail}
                  className="flex items-center justify-center gap-2 bg-brand text-white px-6 py-3.5 rounded-full font-semibold text-sm hover:bg-[#154d8a] transition-colors shadow-lg"
                >
                  <Send size={15} />
                  Send via Email
                </button>
              </div>

              <p className="text-xs text-gray-300 pt-1">
                Your information is kept strictly confidential. We never share patient data with third parties.
              </p>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
