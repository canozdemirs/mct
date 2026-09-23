"use client";

import { useState } from "react";
import { useCountryDialCode } from "./use-country-dial-code";
import { validateRequiredLeadFields, type LeadFieldErrors } from "@/lib/validation";

export type LandingLeadFormState = {
  name: string;
  country: string;
  email: string;
  phone: string;
  pkg: string;
  message: string;
};

const emptyForm: LandingLeadFormState = { name: "", country: "", email: "", phone: "", pkg: "", message: "" };

// Shared submission logic for the ~12 near-identical treatment landing page
// forms — each page keeps its own JSX/styling, this just centralizes the
// POST to /api/leads, field validation, and dial-code sync so we don't
// duplicate the same logic in every file.
export function useLandingLeadForm(treatment: string) {
  const [form, setForm] = useState<LandingLeadFormState>(emptyForm);
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [succeeded, setSucceeded] = useState(false);
  const [error, setError] = useState("");
  const [touched, setTouched] = useState<Partial<Record<keyof LeadFieldErrors, boolean>>>({});

  useCountryDialCode(form.country, form.phone, (phone) => setForm((f) => ({ ...f, phone })));

  function markTouched(field: keyof LeadFieldErrors) {
    setTouched((t) => ({ ...t, [field]: true }));
  }

  const currentErrors = validateRequiredLeadFields({
    name: form.name,
    email: form.email,
    phone: form.phone,
    country: form.country,
  });
  const isValid = Object.keys(currentErrors).length === 0;

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
          source: `Landing Page: ${treatment}`,
          name: form.name,
          email: form.email,
          phone: form.phone,
          country: form.country,
          treatment,
          message: form.message || undefined,
          details: form.pkg ? { package: form.pkg } : undefined,
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
    const text = `Hello MCT,%0A%0AName: ${form.name}%0ACountry: ${form.country}%0AEmail: ${form.email}%0APhone: ${form.phone}%0APackage: ${form.pkg}%0A%0A${form.message}`;
    window.open(`https://wa.me/908508888911?text=${text}`, "_blank");
    setSucceeded(true);
  }

  async function handleEmail(e: React.MouseEvent) {
    e.preventDefault();
    if (submitting) return;
    const ok = await submitLead();
    if (ok) setSucceeded(true);
  }

  return {
    form,
    setForm,
    agreed,
    setAgreed,
    submitting,
    succeeded,
    error,
    isValid,
    fieldError,
    markTouched,
    handleWhatsApp,
    handleEmail,
  };
}
