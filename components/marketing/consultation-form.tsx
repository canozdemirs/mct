"use client";

import { useState } from "react";
import { MessageCircle, Send } from "lucide-react";

export const TREATMENT_OPTIONS = [
  "Hair Transplant", "Rhinoplasty", "Breast Augmentation", "Gynecomastia",
  "Dental Implant", "All-on-4 Dental Implants", "Blepharoplasty", "Liposuction",
  "LASIK Eye Surgery", "Cataract Surgery", "IVF", "Check-Up", "Other",
];

interface ConsultationFormProps {
  initialTreatment?: string;
  onSuccess?: () => void;
}

export function ConsultationForm({ initialTreatment = "", onSuccess }: ConsultationFormProps) {
  const [form, setForm] = useState({
    name: "", email: "", phone: "", treatment: initialTreatment, message: "",
  });

  const handleWhatsApp = () => {
    const text = `Hello MCT,%0A%0AName: ${form.name}%0AEmail: ${form.email}%0APhone: ${form.phone}%0ATreatment: ${form.treatment}%0A%0A${form.message}`;
    window.open(`https://wa.me/908508888911?text=${text}`, "_blank");
    onSuccess?.();
  };

  const handleEmail = () => {
    const body = `Hello MCT,\n\nName: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\nTreatment: ${form.treatment}\n\n${form.message}`;
    window.location.href = `mailto:hello@medicalcenterturkey.com?subject=${encodeURIComponent(`Quote Request: ${form.treatment}`)}&body=${encodeURIComponent(body)}`;
    onSuccess?.();
  };

  return (
    <form className="space-y-4" onSubmit={e => e.preventDefault()}>
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
          {TREATMENT_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
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
          type="button"
          onClick={handleWhatsApp}
          className="flex items-center justify-center gap-2 bg-teal text-white px-6 py-3.5 rounded-full font-semibold text-sm hover:bg-[#159fb3] transition-colors shadow-lg shadow-teal/20"
        >
          <MessageCircle size={15} />
          Send via WhatsApp
        </button>
        <button
          type="button"
          onClick={handleEmail}
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
  );
}
