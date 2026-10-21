"use client";

import { useState } from "react";
import { MessageCircle, Send } from "lucide-react";
import { CountrySelect } from "@/components/marketing/country-select";
import { PhoneInput } from "@/components/marketing/phone-input";
import { FieldError } from "@/components/marketing/field-error";
import { FormSuccessMessage } from "@/components/marketing/form-success-message";
import { useCountryDialCode } from "@/lib/hooks/use-country-dial-code";
import { validateRequiredLeadFields, type LeadFieldErrors } from "@/lib/validation";
import { openWhatsAppTransition, getCapturedAttribution } from "@/lib/attribution";
import { getSessionEntry } from "@/lib/session-entry";
import { trackGenerateLead } from "@/lib/analytics";

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
  /** Isolated Turkish display-text option for the one Turkish corporate
   * page. Defaults to "en", so every existing call site (homepage, hospital
   * pages, package popups, the Get Quote modal) renders and behaves exactly
   * as before — only a caller that explicitly passes locale="tr" sees any
   * difference. The underlying validation rules, fields sent to /api/leads,
   * consent/lead/email/WhatsApp mechanics are identical in both locales;
   * only visible labels, placeholders, and messages change. */
  locale?: "en" | "tr";
}

const emptyForm = { name: "", email: "", phone: "", country: "", treatment: "", message: "" };

// Turkish display text only — field names, validation rules, and the data
// sent to /api/leads are shared and unaffected by this map.
const TR_TEXT = {
  fullName: "Ad Soyad *",
  fullNamePlaceholder: "Ad Soyad",
  country: "Ülke *",
  email: "E-posta *",
  emailPlaceholder: "ornek@eposta.com",
  phone: "Telefon *",
  treatment: "Talep Edilen Tedavi",
  selectTreatment: "Bir tedavi seçin",
  message: "Mesaj",
  messagePlaceholder: "Tedavi ihtiyaçlarınızı, sorularınızı veya paylaşmak istediğiniz diğer detayları bize yazın...",
  consentPrefix: "Medical Center Turkey'nin",
  terms: "Kullanım Şartları'nı",
  consentMiddle: "kabul ediyorum,",
  privacy: "Gizlilik Politikası'nı (KVKK)",
  consentSuffix: "okudum ve sağlık verilerim dahil paylaştığım bilgilerin Medical Center Turkey tarafından teklif hazırlama amacıyla işlenmesini kabul ediyorum.",
  sendWhatsApp: "WhatsApp ile Gönder",
  sendRequest: "Talebi Gönder",
  sending: "Gönderiliyor...",
  fixFields: "Lütfen işaretli alanları düzeltin.",
  genericError: "Bir hata oluştu. Lütfen tekrar deneyin.",
  networkError: "Bağlantı hatası. Lütfen tekrar deneyin.",
};

const FIELD_ERROR_TR: Record<string, string> = {
  "Please enter your full name.": "Lütfen adınızı ve soyadınızı girin.",
  "Please enter your email address.": "Lütfen e-posta adresinizi girin.",
  "Please enter a valid email address.": "Lütfen geçerli bir e-posta adresi girin.",
  "Please enter your phone number.": "Lütfen telefon numaranızı girin.",
  "Please enter a valid international phone number, starting with +.": "Lütfen + ile başlayan geçerli bir uluslararası telefon numarası girin.",
  "Please select your country.": "Lütfen ülkenizi seçin.",
};

export function ConsultationForm({ initialTreatment = "", source = "", onSuccess, onClose, locale = "en" }: ConsultationFormProps) {
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
    if (!touched[field]) return undefined;
    const msg = currentErrors[field];
    if (!msg) return undefined;
    return locale === "tr" ? FIELD_ERROR_TR[msg] || msg : msg;
  }

  async function submitLead() {
    setTouched({ name: true, email: true, phone: true, country: true });
    if (Object.keys(currentErrors).length > 0) {
      setError(locale === "tr" ? TR_TEXT.fixFields : "Please fix the highlighted fields.");
      return false;
    }
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Phase 5K-C: keeps this request alive if the tab is closed/
        // navigated away from shortly after WhatsApp opens in a new tab --
        // does not guarantee server-side success, only that the request
        // itself isn't cancelled by the browser mid-flight.
        keepalive: true,
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
          sessionEntry: getSessionEntry(),
          ...getCapturedAttribution(),
        }),
      });
      const json = await res.json() as { ok?: boolean; error?: string };
      if (!res.ok) {
        setError(json.error || (locale === "tr" ? TR_TEXT.genericError : "Something went wrong. Please try again."));
        return false;
      }
      // Only after the backend has confirmed successful storage -- never
      // on click, invalid input, or a failed/pending request.
      trackGenerateLead();
      return true;
    } catch {
      setError(locale === "tr" ? TR_TEXT.networkError : "Network error. Please try again.");
      return false;
    } finally {
      setSubmitting(false);
    }
  }

  function handleWhatsApp() {
    if (submitting) return;
    setTouched({ name: true, email: true, phone: true, country: true });
    if (Object.keys(currentErrors).length > 0) {
      setError(locale === "tr" ? TR_TEXT.fixFields : "Please fix the highlighted fields.");
      return;
    }

    // Phase 5K-A: the transition tab must open synchronously, in direct
    // response to this click, before anything asynchronous runs -- so it
    // happens first, and the lead save (submitLead, which is itself
    // asynchronous) runs alongside it rather than gating it. This is a
    // deliberate change from the previous sequencing (submit, then open
    // only on success): the two outcomes -- "the patient's own inquiry is
    // saved" and "the patient reaches WhatsApp" -- are independent, and the
    // patient must never be blocked from the second by a delay or failure
    // in the first. The message content/structure sent to WhatsApp is
    // unchanged from before; only the reference code is newly appended by
    // the transition page itself.
    const sourceLine = source ? `\nSource: ${source}` : "";
    const message = `Hello MCT,\n\nName: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\nCountry: ${form.country}\nTreatment: ${form.treatment}${sourceLine}\n\n${form.message}`;
    openWhatsAppTransition(message);

    setSubmitting(true);
    submitLead().then((ok) => {
      setSubmitting(false);
      if (ok) {
        setSucceeded(true);
        onSuccess?.();
      }
      // If the save failed, the patient has already reached WhatsApp with
      // their full message -- `error` is still set by submitLead() so a
      // retry affordance remains visible if they return to this tab.
    });
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
    return <FormSuccessMessage name={form.name} email={form.email} onClose={onClose} locale={locale} />;
  }

  return (
    <form className="space-y-4" onSubmit={e => e.preventDefault()}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">{locale === "tr" ? TR_TEXT.fullName : "Full Name *"}</label>
          <input
            type="text"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            onBlur={() => markTouched("name")}
            placeholder={locale === "tr" ? TR_TEXT.fullNamePlaceholder : "John Smith"}
            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-teal focus:bg-white transition-all"
          />
          <FieldError message={fieldError("name")} />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">{locale === "tr" ? TR_TEXT.country : "Country *"}</label>
          <CountrySelect value={form.country} onChange={(v) => setForm({ ...form, country: v })} onBlur={() => markTouched("country")} />
          <FieldError message={fieldError("country")} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">{locale === "tr" ? TR_TEXT.email : "Email *"}</label>
          <input
            type="email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            onBlur={() => markTouched("email")}
            placeholder={locale === "tr" ? TR_TEXT.emailPlaceholder : "john@example.com"}
            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-teal focus:bg-white transition-all"
          />
          <FieldError message={fieldError("email")} />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">{locale === "tr" ? TR_TEXT.phone : "Phone *"}</label>
          <PhoneInput value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} onBlur={() => markTouched("phone")} />
          <FieldError message={fieldError("phone")} />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">{locale === "tr" ? TR_TEXT.treatment : "Treatment Interest"}</label>
        <select
          value={form.treatment}
          onChange={e => setForm({ ...form, treatment: e.target.value })}
          className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-teal focus:bg-white transition-all"
        >
          <option value="">{locale === "tr" ? TR_TEXT.selectTreatment : "Select a treatment"}</option>
          {TREATMENT_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">{locale === "tr" ? TR_TEXT.message : "Message"}</label>
        <textarea
          rows={4}
          value={form.message}
          onChange={e => setForm({ ...form, message: e.target.value })}
          placeholder={locale === "tr" ? TR_TEXT.messagePlaceholder : "Tell us about your treatment needs, questions or any details you'd like to share..."}
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
          {locale === "tr" ? (
            <>
              {TR_TEXT.consentPrefix}{" "}
              <a href="/terms" target="_blank" rel="noopener noreferrer" className="underline text-gray-500 hover:text-gray-700">
                {TR_TEXT.terms}
              </a>{" "}
              {TR_TEXT.consentMiddle}{" "}
              <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" className="underline text-gray-500 hover:text-gray-700">
                {TR_TEXT.privacy}
              </a>{" "}
              {TR_TEXT.consentSuffix}
            </>
          ) : (
            <>
              I agree to Medical Center Turkey&apos;s{" "}
              <a href="/terms" target="_blank" rel="noopener noreferrer" className="underline text-gray-500 hover:text-gray-700">
                Terms and Conditions
              </a>
              , I have read the{" "}
              <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" className="underline text-gray-500 hover:text-gray-700">
                Privacy Policy
              </a>{" "}
              and I agree that my given details including health data may be processed by Medical Center Turkey for the purpose of obtaining quotes.
            </>
          )}
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
          {submitting ? (locale === "tr" ? TR_TEXT.sending : "Sending...") : (locale === "tr" ? TR_TEXT.sendWhatsApp : "Send via WhatsApp")}
        </button>
        <button
          type="button"
          onClick={handleEmail}
          disabled={submitting || !agreed}
          className="flex items-center justify-center gap-2 bg-brand text-white px-6 py-3.5 rounded-full font-semibold text-sm hover:bg-[#154d8a] transition-colors shadow-lg shadow-brand/20 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Send size={15} />
          {submitting ? (locale === "tr" ? TR_TEXT.sending : "Sending...") : (locale === "tr" ? TR_TEXT.sendRequest : "Send Request")}
        </button>
      </div>
    </form>
  );
}
