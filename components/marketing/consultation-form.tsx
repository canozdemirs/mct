"use client";

import { useState } from "react";
import { useForm, ValidationError } from "@formspree/react";
import { MessageCircle, Send, CheckCircle } from "lucide-react";

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
  const [state, handleFormspreeSubmit] = useForm("maewyylb");
  const [form, setForm] = useState({
    name: "", email: "", phone: "", treatment: initialTreatment, message: "",
  });
  const [agreed, setAgreed] = useState(false);

  const handleWhatsApp = () => {
    const text = `Hello MCT,%0A%0AName: ${form.name}%0AEmail: ${form.email}%0APhone: ${form.phone}%0ATreatment: ${form.treatment}%0A%0A${form.message}`;
    window.open(`https://wa.me/908508888911?text=${text}`, "_blank");
    onSuccess?.();
  };

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleFormspreeSubmit({
      name: form.name,
      email: form.email,
      phone: form.phone,
      treatment: form.treatment,
      message: form.message,
      _subject: `Quote Request: ${form.treatment} — Medical Center Turkey`,
      _replyto: form.email,
    } as never);
    onSuccess?.();
  };

  if (state.succeeded) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center gap-4">
        <CheckCircle size={48} className="text-teal" />
        <h3 className="text-lg font-bold text-brand">Request Sent!</h3>
        <p className="text-sm text-gray-500 max-w-xs">We&apos;ve received your consultation request and will get back to you within 24 hours.</p>
      </div>
    );
  }

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
        <ValidationError field="email" errors={state.errors} className="text-red-500 text-xs mt-1" />
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

      <label className="flex items-start gap-2.5 cursor-pointer">
        <input
          type="checkbox"
          checked={agreed}
          onChange={e => setAgreed(e.target.checked)}
          className="mt-0.5 shrink-0 accent-teal"
        />
        <span className="text-xs text-gray-400 leading-relaxed">
          I agree to Medical Center Turkey&apos;s{" "}
          <a href="/terms" target="_blank" rel="noopener noreferrer" className="underline text-gray-500 hover:text-gray-700">
            Terms and Conditions
          </a>
          , I have read the{" "}
          <a href="/terms" target="_blank" rel="noopener noreferrer" className="underline text-gray-500 hover:text-gray-700">
            Privacy Policy
          </a>{" "}
          and I agree that my given details including health data may be processed by Medical Center Turkey for the purpose of obtaining quotes.
        </span>
      </label>

      <div className="flex flex-col sm:flex-row gap-3 pt-1">
        <button
          type="button"
          onClick={handleWhatsApp}
          disabled={!agreed}
          className="flex items-center justify-center gap-2 bg-[#25D366] text-white px-6 py-3.5 rounded-full font-semibold text-sm hover:bg-[#1ebe5a] transition-colors shadow-lg shadow-[#25D366]/20 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <MessageCircle size={15} />
          Send via WhatsApp
        </button>
        <button
          type="button"
          onClick={handleEmail}
          disabled={state.submitting || !agreed}
          className="flex items-center justify-center gap-2 bg-brand text-white px-6 py-3.5 rounded-full font-semibold text-sm hover:bg-[#154d8a] transition-colors shadow-lg shadow-brand/20 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Send size={15} />
          {state.submitting ? "Sending..." : "Send Request"}
        </button>
      </div>
    </form>
  );
}
