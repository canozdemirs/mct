"use client";

import { useState } from "react";
import { MessageCircle, Send } from "lucide-react";
import { CountrySelect } from "@/components/marketing/country-select";
import { PhoneInput } from "@/components/marketing/phone-input";
import { FieldError } from "@/components/marketing/field-error";
import { FormSuccessMessage } from "@/components/marketing/form-success-message";
import { useCountryDialCode } from "@/lib/hooks/use-country-dial-code";
import { validateRequiredLeadFields, type LeadFieldErrors } from "@/lib/validation";

export const TREATMENT_OPTIONS = [
  "Hair Transplant", "Rhinoplasty", "Breast Augmentation", "Gynecomastia",
  "Dental Implant", "All-on-4 Dental Implants", "Blepharoplasty", "Liposuction",
  "LASIK Eye Surgery", "Cataract Surgery", "IVF", "Check-Up", "Other",
];

interface ConsultationFormProps {
  initialTreatment?: string;
  source?: string;
  onSuccess?: () => void;
  onClose?: () => void;
}

const emptyForm = { name: "", email: "", phone: "", country: "", treatment: "", message: "" };

export function ConsultationForm({ initialTreatment = "", source = "", onSuccess, onClose }: ConsultationFormProps) {
  const [form, setForm] = useState({ ...emptyForm, treatment: initialTreatment });
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [succeeded, setSucceeded] = useState(false);
  const [error, setError] = useState("");
  const [touched, setTouched] = useState<Partial<Record<keyof LeadFieldErrors, boolean>>>({});

  useCountryDialCode(form.country, form.phone, (phone) => setForm((f) => ({ ...f, phone })));

  function markTouched(field: keyof LeadFieldErrors) {
    setTouched((t) => ({ ...t, [field]: true }));
  }

  const currentErrors = validateRequiredLeadFields({ name: form.name, email: form.email, phone: form.phone, country: form.country });

  function fieldError(field: keyof LeadFieldErrors) {
    return touched[field] ? currentErrors[field] : undefined;
  }

  async function submitLead() {
    setTouched({ name: true, email: true, phone: true, country: true });
    if (Object.keys(currentErrors).length > 0) {
      setError("Please fix the highlighted fields.");
      return false;
    }
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: source || "Consultation Form",
          name: form.name,
          email: form.email,
          phone: form.phone,
          country: form.country,
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
    const text = `Hello MCT,%0A%0AName: ${form.name}%0AEmail: ${form.email}%0APhone: ${form.phone}%0ACountry: ${form.country}%0ATreatment: ${form.treatment}${sourceLine}%0A%0A${form.message}`;
    window.open(`https://wa.me/908508888911?text=${text}`, "_blank");
    setSucceeded(true);
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
    return <FormSuccessMessage name={form.name} email={form.email} onClose={onClose} />;
  }

  return (
    <form className="space-y-4" onSubmit={e => e.preventDefault()}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Full Name *</label>
          <input
            type="text"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            onBlur={() => markTouched("name")}
            placeholder="John Smith"
            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-teal focus:bg-white transition-all"
          />
          <FieldError message={fieldError("name")} />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Country *</label>
          <CountrySelect value={form.country} onChange={(v) => setForm({ ...form, country: v })} onBlur={() => markTouched("country")} />
          <FieldError message={fieldError("country")} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Email *</label>
          <input
            type="email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            onBlur={() => markTouched("email")}
            placeholder="john@example.com"
            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-teal focus:bg-white transition-all"
          />
          <FieldError message={fieldError("email")} />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Phone *</label>
          <PhoneInput value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} onBlur={() => markTouched("phone")} />
          <FieldError message={fieldError("phone")} />
        </div>
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
