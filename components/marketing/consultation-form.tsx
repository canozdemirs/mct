"use client";

import { useState } from "react";
import { MessageCircle, Send, CheckCircle } from "lucide-react";

export const TREATMENT_OPTIONS = [
  "Hair Transplant", "Rhinoplasty", "Breast Augmentation", "Gynecomastia",
  "Dental Implant", "All-on-4 Dental Implants", "Blepharoplasty", "Liposuction",
  "LASIK Eye Surgery", "Cataract Surgery", "IVF", "Check-Up", "Other",
];

interface ConsultationFormProps {
  initialTreatment?: string;
  source?: string;
  onSuccess?: () => void;
}

export function ConsultationForm({ initialTreatment = "", source = "", onSuccess }: ConsultationFormProps) {
  const [form, setForm] = useState({
    name: "", email: "", phone: "", treatment: initialTreatment, message: "",
  });
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [succeeded, setSucceeded] = useState(false);
  const [error, setError] = useState("");

  async function submitLead() {
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: source || "Consultation Form",
          name: form.name,
          email: form.email || undefined,
          phone: form.phone || undefined,
          treatment: form.treatment || undefined,
          message: form.message || undefined,
          consent: agreed,
          page_url: typeof window !== "undefined" ? window.location.href : undefined,
        }),
      });
      const json = await res.json() as { ok?: boolean; error?: string };
      if (!res.ok) {
        setError(json.error || "Something went wrong. Please try again.");
        return false;
      }
      return true;
    } catch {
      setError("Network error. Please try again.");
      return false;
    } finally {
      setSubmitting(false);
    }
  }

  async function handleWhatsApp() {
    if (submitting) return;
    const ok = await submitLead();
    if (!ok) return;

    const sourceLine = source ? `%0ASource: ${encodeURIComponent(source)}` : "";
    const text = `Hello MCT,%0A%0AName: ${form.name}%0AEmail: ${form.email}%0APhone: ${form.phone}%0ATreatment: ${form.treatment}${sourceLine}%0A%0A${form.message}`;
    window.open(`https://wa.me/908508888911?text=${text}`, "_blank");
    onSuccess?.();
  }

  async function handleEmail(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;
    const ok = await submitLead();
    if (!ok) return;
    setSucceeded(true);
    onSuccess?.();
  }

  if (succeeded) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center gap-4">
        <CheckCircle size={48} className="text-teal" />
        <h3 className="text-lg font-bold text-brand">Request Sent!</h3>
        <p className="text-sm text-gray-500 max-w-xs">We&apos;ve received your consultation request and will get back to you within 48 hours.</p>
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
          <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" className="underline text-gray-500 hover:text-gray-700">
            Privacy Policy
          </a>{" "}
          and I agree that my given details including health data may be processed by Medical Center Turkey for the purpose of obtaining quotes.
        </span>
      </label>

      {error && (
        <p className="text-red-600 text-xs font-medium">{error}</p>
      )}

      <div className="flex flex-col sm:flex-row gap-3 pt-1">
        <button
          type="button"
          onClick={handleWhatsApp}
          disabled={!agreed || submitting}
          className="flex items-center justify-center gap-2 bg-[#25D366] text-white px-6 py-3.5 rounded-full font-semibold text-sm hover:bg-[#1ebe5a] transition-colors shadow-lg shadow-[#25D366]/20 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <MessageCircle size={15} />
          {submitting ? "Sending..." : "Send via WhatsApp"}
        </button>
        <button
          type="button"
          onClick={handleEmail}
          disabled={submitting || !agreed}
          className="flex items-center justify-center gap-2 bg-brand text-white px-6 py-3.5 rounded-full font-semibold text-sm hover:bg-[#154d8a] transition-colors shadow-lg shadow-brand/20 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Send size={15} />
          {submitting ? "Sending..." : "Send Request"}
        </button>
      </div>
    </form>
  );
}
