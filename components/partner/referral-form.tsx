"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TREATMENTS } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";
import type { ReferralFile } from "@/types";

const MAX_FILES = 5;
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "application/pdf"];

const inputClass =
  "w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-teal focus:bg-white transition-all";
const labelClass = "block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2";

type ReferralFormData = {
  patient_full_name: string;
  patient_country: string;
  patient_phone: string;
  patient_email: string;
  treatment: string;
  notes: string;
};

const emptyForm: ReferralFormData = {
  patient_full_name: "",
  patient_country: "",
  patient_phone: "",
  patient_email: "",
  treatment: "",
  notes: "",
};

export function ReferralForm({
  mode,
  referralId,
  partnerId,
  initialData,
  initialFiles = [],
}: {
  mode: "create" | "edit";
  referralId?: string;
  partnerId: string;
  initialData?: ReferralFormData;
  initialFiles?: ReferralFile[];
}) {
  const router = useRouter();
  const [supabase] = useState(() => createClient());

  const [form, setForm] = useState<ReferralFormData>(initialData ?? emptyForm);
  const [consent, setConsent] = useState(false);
  const [keptFiles, setKeptFiles] = useState<ReferralFile[]>(initialFiles);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [duplicateLink, setDuplicateLink] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function handleFilesSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files ?? []);
    setError("");

    const totalCount = keptFiles.length + newFiles.length + selected.length;
    if (totalCount > MAX_FILES) {
      setError(`You can upload a maximum of ${MAX_FILES} files.`);
      e.target.value = "";
      return;
    }
    for (const file of selected) {
      if (file.size > MAX_FILE_SIZE) {
        setError(`"${file.name}" exceeds the 10MB size limit.`);
        e.target.value = "";
        return;
      }
      if (!ALLOWED_TYPES.includes(file.type)) {
        setError(`"${file.name}" has an unsupported format. Only JPG, PNG, and PDF files are allowed.`);
        e.target.value = "";
        return;
      }
    }

    setNewFiles((f) => [...f, ...selected]);
    e.target.value = "";
  }

  function removeNewFile(index: number) {
    setNewFiles((files) => files.filter((_, i) => i !== index));
  }

  function removeKeptFile(path: string) {
    setKeptFiles((files) => files.filter((f) => f.path !== path));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;

    if (!form.patient_full_name || !form.patient_country || !form.patient_phone || !form.treatment) {
      setError("Please fill in all required fields.");
      return;
    }
    if (mode === "create" && !consent) {
      setError("Please confirm patient consent before submitting.");
      return;
    }

    setSubmitting(true);
    setError("");
    setDuplicateLink(null);

    // Files go straight from the browser to Supabase Storage — RLS scopes the
    // upload to this partner's own folder. This keeps large files off Vercel's
    // serverless function body-size limit; only the resulting metadata (name/
    // path/size/type) travels through the API route.
    const groupId = referralId ?? crypto.randomUUID();
    const uploadedFiles: ReferralFile[] = [];

    for (const file of newFiles) {
      const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
      const path = `${partnerId}/${groupId}/${Date.now()}-${safeName}`;

      const { error: uploadError } = await supabase.storage
        .from("referral-files")
        .upload(path, file, { contentType: file.type, upsert: false });

      if (uploadError) {
        if (uploadedFiles.length > 0) {
          await supabase.storage.from("referral-files").remove(uploadedFiles.map((f) => f.path));
        }
        setSubmitting(false);
        setError(`Failed to upload "${file.name}". Please try again.`);
        return;
      }

      uploadedFiles.push({ name: file.name, path, size: file.size, type: file.type });
    }

    const finalFiles = [...keptFiles, ...uploadedFiles];

    const payload =
      mode === "create"
        ? {
            patient_full_name: form.patient_full_name,
            patient_country: form.patient_country,
            patient_phone: form.patient_phone,
            patient_email: form.patient_email,
            treatment: form.treatment,
            notes: form.notes,
            patient_consent: true,
            files: finalFiles,
          }
        : {
            patient_full_name: form.patient_full_name,
            patient_country: form.patient_country,
            patient_phone: form.patient_phone,
            patient_email: form.patient_email,
            treatment: form.treatment,
            notes: form.notes,
            files: finalFiles,
          };

    try {
      const res = await fetch(
        mode === "create" ? "/api/partner-portal/referrals" : `/api/partner-portal/referrals/${referralId}`,
        {
          method: mode === "create" ? "POST" : "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const json = await res.json() as { ok?: boolean; error?: string; id?: string; existingReferralId?: string };

      if (!res.ok) {
        if (uploadedFiles.length > 0) {
          await supabase.storage.from("referral-files").remove(uploadedFiles.map((f) => f.path));
        }
        setSubmitting(false);
        if (res.status === 409 && json.existingReferralId) {
          setDuplicateLink(json.existingReferralId);
        }
        setError(json.error || "Something went wrong. Please try again.");
        return;
      }

      if (mode === "create") {
        setSubmitted(true);
      } else {
        router.push(`/partner-portal/referrals/${referralId}`);
        router.refresh();
      }
    } catch {
      setSubmitting(false);
      setError("Network error. Please try again.");
    }
  }

  if (submitted) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center max-w-lg mx-auto">
        <div className="w-16 h-16 rounded-full bg-teal/10 border-2 border-teal flex items-center justify-center mx-auto mb-6">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1ab3c8" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-brand-dark mb-2">Referral Submitted</h2>
        <p className="text-sm text-gray-500 mb-8 leading-relaxed">
          Thank you — your referral for {form.patient_full_name} has been received. Our team will review it
          and keep you updated on its status.
        </p>
        <Link
          href="/partner-portal/referrals"
          className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-brand text-white text-sm font-bold hover:opacity-90 transition-opacity"
        >
          View My Referrals
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
        <div className="sm:col-span-2">
          <label className={labelClass}>Patient Full Name *</label>
          <input
            className={inputClass}
            name="patient_full_name"
            value={form.patient_full_name}
            onChange={handleChange}
            required
            placeholder="Patient's full name"
          />
        </div>
        <div>
          <label className={labelClass}>Country *</label>
          <input
            className={inputClass}
            name="patient_country"
            value={form.patient_country}
            onChange={handleChange}
            required
            placeholder="e.g. United Kingdom"
          />
        </div>
        <div>
          <label className={labelClass}>Phone / WhatsApp *</label>
          <input
            className={inputClass}
            type="tel"
            name="patient_phone"
            value={form.patient_phone}
            onChange={handleChange}
            required
            placeholder="+1 234 567 8900"
          />
        </div>
        <div>
          <label className={labelClass}>Email Address</label>
          <input
            className={inputClass}
            type="email"
            name="patient_email"
            value={form.patient_email}
            onChange={handleChange}
            placeholder="patient@email.com"
          />
        </div>
        <div>
          <label className={labelClass}>Interested Treatment / Procedure *</label>
          <select className={inputClass} name="treatment" value={form.treatment} onChange={handleChange} required>
            <option value="">Select treatment...</option>
            {TREATMENTS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>Additional Notes</label>
          <textarea
            className={`${inputClass} resize-none`}
            name="notes"
            value={form.notes}
            onChange={handleChange}
            rows={4}
            placeholder="Any relevant details about the patient or their request..."
          />
        </div>
      </div>

      <div className="mb-5">
        <label className={labelClass}>Patient Photos / Documents</label>
        <p className="text-xs text-gray-400 mb-3">
          Up to {MAX_FILES} files, 10MB each. JPG, PNG, or PDF only.
        </p>

        {keptFiles.length > 0 && (
          <ul className="mb-3 space-y-2">
            {keptFiles.map((f) => (
              <li
                key={f.path}
                className="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm text-gray-700"
              >
                <span className="truncate">{f.name}</span>
                <button
                  type="button"
                  onClick={() => removeKeptFile(f.path)}
                  className="text-red-500 text-xs font-semibold hover:text-red-700 ml-3 shrink-0"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}

        {newFiles.length > 0 && (
          <ul className="mb-3 space-y-2">
            {newFiles.map((f, i) => (
              <li
                key={`${f.name}-${i}`}
                className="flex items-center justify-between bg-teal/5 border border-teal/20 rounded-xl px-4 py-2.5 text-sm text-gray-700"
              >
                <span className="truncate">{f.name}</span>
                <button
                  type="button"
                  onClick={() => removeNewFile(i)}
                  className="text-red-500 text-xs font-semibold hover:text-red-700 ml-3 shrink-0"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}

        {keptFiles.length + newFiles.length < MAX_FILES && (
          <input
            type="file"
            multiple
            accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf"
            onChange={handleFilesSelected}
            className="w-full text-sm text-gray-600 file:mr-4 file:py-2.5 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand file:text-white hover:file:opacity-90 file:cursor-pointer cursor-pointer"
          />
        )}
      </div>

      {mode === "create" && (
        <label className="flex items-start gap-3 mb-6 cursor-pointer">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-1 w-4 h-4 accent-brand"
          />
          <span className="text-xs text-gray-500 leading-relaxed">
            I confirm the patient has consented to sharing this information with Medical Center Turkey for
            the purpose of coordinating their treatment.
          </span>
        </label>
      )}

      {error && (
        <div className="mb-5 px-4 py-3 rounded-xl text-sm font-medium bg-red-50 border border-red-200 text-red-800">
          {error}
          {duplicateLink && (
            <>
              {" "}
              <Link href={`/partner-portal/referrals/${duplicateLink}`} className="underline font-semibold">
                View existing referral
              </Link>
            </>
          )}
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-brand text-white rounded-full py-3 text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? "Submitting..." : mode === "create" ? "Submit Referral" : "Save Changes"}
      </button>
    </form>
  );
}
