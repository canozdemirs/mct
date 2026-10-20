"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { COUNTRIES, LEAD_SOURCE_OPTIONS, UNKNOWN_LABEL } from "@/lib/constants";
import { TREATMENT_OPTIONS } from "@/components/marketing/consultation-form";
import { isValidEmail } from "@/lib/validation";
import { hospitals, hospitalGroups } from "@/lib/hospitals";
import type { Lead, PartnerOption } from "@/app/(dashboard)/admin/leads/page";

const NOT_DECIDED = "Not decided yet";
const OTHER_HOSPITAL = "Other";

// Grouped once at module scope -- admin-only, never shown to partners
// (leads.hospital has no equivalent column on referrals and is never
// included in the referral mirror-sync below).
const HOSPITAL_GROUPS = Object.entries(hospitalGroups).map(([key, g]) => ({
  key,
  label: g.name,
  names: hospitals.filter((h) => h.group === key).map((h) => h.name),
}));
const KNOWN_HOSPITAL_NAMES = new Set(hospitals.map((h) => h.name));

function resolveHospitalPreset(current: string | null): { preset: string; other: string } {
  if (!current || current === NOT_DECIDED) return { preset: NOT_DECIDED, other: "" };
  if (KNOWN_HOSPITAL_NAMES.has(current)) return { preset: current, other: "" };
  return { preset: OTHER_HOSPITAL, other: current };
}

function toDateInputValue(iso: string | null | undefined) {
  if (!iso) return "";
  return iso.slice(0, 10);
}

// Country/Treatment are plain <select>s with a fixed option list -- if an
// existing lead's stored value isn't in that list (an older free-text
// value, or a value this list has since dropped), it's appended so the
// select has somewhere to point without silently discarding or
// overwriting it on save.
function withCurrentValue(options: string[], current: string) {
  if (!current || options.includes(current) || current === UNKNOWN_LABEL) return options;
  return [current, ...options];
}

type FormState = {
  source: string;
  name: string;
  nameUnknown: boolean;
  phone: string;
  email: string;
  emailUnknown: boolean;
  country: string;
  treatment: string;
  hospitalPreset: string;
  hospitalOther: string;
  patientMessage: string;
  internalNotes: string;
  firstContactedAt: string;
};

function buildFormState(lead: Lead): FormState {
  const h = resolveHospitalPreset(lead.hospital);
  return {
    source: lead.source,
    name: lead.name,
    nameUnknown: lead.name === "Unknown",
    phone: lead.phone || "",
    email: lead.email || "",
    emailUnknown: !lead.email,
    country: lead.country || "",
    treatment: lead.treatment || "",
    hospitalPreset: h.preset,
    hospitalOther: h.other,
    patientMessage: lead.message || "",
    internalNotes: lead.internal_notes || "",
    firstContactedAt: toDateInputValue(lead.first_contacted_at),
  };
}

type DuplicateInfo = { id: string; name: string; created_at: string };

// Every patient field lives directly on this card (no separate Edit
// modal) -- a single "Save changes" button (top and bottom, mirrored)
// is enabled only once something actually changed. Status is NOT here:
// it stays in Admin Actions (patient-status-actions.tsx) because
// entering Treatment Completed requires a Revenue/Commission form this
// card has no UI for.
export function PatientEditCard({ lead, partners }: { lead: Lead; partners: PartnerOption[] }) {
  const router = useRouter();
  const initialRef = useRef(buildFormState(lead));
  const [form, setForm] = useState<FormState>(initialRef.current);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [saved, setSaved] = useState(false);
  const [duplicate, setDuplicate] = useState<DuplicateInfo | null>(null);
  const [convertPartnerId, setConvertPartnerId] = useState("");
  const [converting, setConverting] = useState(false);

  const isDirty = JSON.stringify(form) !== JSON.stringify(initialRef.current);

  useEffect(() => {
    function handleBeforeUnload(e: BeforeUnloadEvent) {
      if (!isDirty) return;
      e.preventDefault();
      e.returnValue = "";
    }
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  async function save(force: boolean) {
    const effectiveName = form.nameUnknown ? "Unknown" : form.name;

    if (!force) {
      if (!effectiveName.trim()) {
        setFormError("Please enter the patient's name.");
        return;
      }
      const hasPhone = form.phone.replace(/[^0-9]/g, "").length >= 7;
      const hasEmail = !form.emailUnknown && !!form.email.trim() && isValidEmail(form.email);
      if (!hasPhone && !hasEmail) {
        setFormError("Please provide at least a phone number or an email address.");
        return;
      }
    }

    const resolvedHospital = form.hospitalPreset === OTHER_HOSPITAL ? form.hospitalOther.trim() : form.hospitalPreset;

    setSubmitting(true);
    setFormError("");
    try {
      const res = await fetch(`/api/admin/leads/${lead.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: form.source,
          name: effectiveName,
          phone: form.phone,
          email: form.emailUnknown ? "" : form.email,
          country: form.country,
          treatment: form.treatment,
          hospital: resolvedHospital,
          message: form.patientMessage,
          internalNotes: form.internalNotes,
          firstContactedAt: form.firstContactedAt || undefined,
          force,
        }),
      });
      const json = await res.json().catch(() => ({}));

      if (res.status === 409 && json.existing) {
        setDuplicate(json.existing);
        return;
      }
      if (!res.ok) {
        setFormError(json.error || "Could not save changes.");
        return;
      }

      initialRef.current = form;
      setDuplicate(null);
      setSaved(true);
      router.refresh();
    } catch {
      setFormError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleConvert() {
    if (!convertPartnerId) return;
    const partnerName = partners.find((p) => p.id === convertPartnerId)?.name || "this partner";
    const ok = confirm(
      `This will create a new partner referral for this patient under "${partnerName}". ` +
      `${partnerName} becomes eligible for commission on this patient's FUTURE treatment only -- no retroactive commission is created. Continue?`
    );
    if (!ok) return;

    setConverting(true);
    setFormError("");
    try {
      const res = await fetch(`/api/admin/leads/${lead.id}/owner`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "attach", partnerId: convertPartnerId }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setFormError(json.error || "Could not convert this patient to a partner patient.");
        return;
      }
      router.refresh();
    } catch {
      setFormError("Network error. Please try again.");
    } finally {
      setConverting(false);
    }
  }

  const SaveButton = () => (
    <button
      type="button"
      onClick={() => save(false)}
      disabled={!isDirty || submitting}
      className="px-5 py-2 rounded-xl text-sm font-semibold text-white bg-brand hover:bg-[#154d8a] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
    >
      {submitting ? "Saving..." : "Save changes"}
    </button>
  );

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-gray-900">Patient Details</h3>
        <div className="flex items-center gap-3">
          {saved && !isDirty && <span className="text-sm text-green-600 font-medium">Saved</span>}
          {isDirty && <span className="text-sm text-amber-600 font-medium">Unsaved changes</span>}
          <SaveButton />
        </div>
      </div>

      {duplicate ? (
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm">
            <p className="font-semibold text-amber-800 mb-1">This phone/email belongs to another record:</p>
            <p className="text-amber-700">
              {duplicate.name} — {new Date(duplicate.created_at).toLocaleDateString("en-GB")}
            </p>
          </div>
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={() => setDuplicate(null)}
              disabled={submitting}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-500 border border-gray-200 hover:border-gray-300 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => save(true)}
              disabled={submitting}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-brand hover:bg-[#154d8a] disabled:opacity-50"
            >
              {submitting ? "Saving..." : "Save anyway"}
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Source *</label>
            <input
              value={form.source}
              onChange={(e) => set("source", e.target.value)}
              list="lead-source-suggestions"
              required
              className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-sm mt-1"
            />
            <datalist id="lead-source-suggestions">
              {LEAD_SOURCE_OPTIONS.map((s) => (
                <option key={s} value={s} />
              ))}
            </datalist>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">First contact date</label>
            <input
              type="date"
              value={form.firstContactedAt}
              onChange={(e) => set("firstContactedAt", e.target.value)}
              className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-sm mt-1"
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Full name *</label>
              <label className="flex items-center gap-1.5 text-xs text-gray-500">
                <input type="checkbox" checked={form.nameUnknown} onChange={(e) => set("nameUnknown", e.target.checked)} className="accent-brand" />
                Unknown
              </label>
            </div>
            <input
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              disabled={form.nameUnknown}
              className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-sm mt-1 disabled:opacity-50"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Phone</label>
            <input
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
              className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-sm mt-1"
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</label>
              <label className="flex items-center gap-1.5 text-xs text-gray-500">
                <input type="checkbox" checked={form.emailUnknown} onChange={(e) => set("emailUnknown", e.target.checked)} className="accent-brand" />
                Unknown
              </label>
            </div>
            <input
              type="email"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              disabled={form.emailUnknown}
              className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-sm mt-1 disabled:opacity-50"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Country</label>
            <select
              value={form.country}
              onChange={(e) => set("country", e.target.value)}
              className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-sm mt-1"
            >
              <option value="">Select...</option>
              <option value={UNKNOWN_LABEL}>{UNKNOWN_LABEL}</option>
              {withCurrentValue(COUNTRIES, form.country).map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Treatment</label>
            <select
              value={form.treatment}
              onChange={(e) => set("treatment", e.target.value)}
              className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-sm mt-1"
            >
              <option value="">Select...</option>
              <option value={UNKNOWN_LABEL}>{UNKNOWN_LABEL}</option>
              {withCurrentValue(TREATMENT_OPTIONS, form.treatment).map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Hospital</label>
            <select
              value={form.hospitalPreset}
              onChange={(e) => set("hospitalPreset", e.target.value)}
              className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-sm mt-1"
            >
              <option value={NOT_DECIDED}>{NOT_DECIDED}</option>
              {HOSPITAL_GROUPS.map((g) => (
                <optgroup key={g.key} label={g.label}>
                  {g.names.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </optgroup>
              ))}
              <option value={OTHER_HOSPITAL}>{OTHER_HOSPITAL}</option>
            </select>
            {form.hospitalPreset === OTHER_HOSPITAL && (
              <input
                value={form.hospitalOther}
                onChange={(e) => set("hospitalOther", e.target.value)}
                placeholder="Hospital name"
                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-sm mt-2"
              />
            )}
          </div>

          <div className="sm:col-span-2">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Patient message</label>
            <textarea
              value={form.patientMessage}
              onChange={(e) => set("patientMessage", e.target.value)}
              rows={2}
              placeholder="The patient's own request/message, e.g. from a WhatsApp or phone conversation"
              className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-sm mt-1"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Internal notes</label>
            <textarea
              value={form.internalNotes}
              onChange={(e) => set("internalNotes", e.target.value)}
              rows={2}
              className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-sm mt-1"
            />
          </div>

          {lead.owner_type === "mct" && partners.length > 0 && (
            <div className="sm:col-span-2 pt-2 border-t border-gray-100">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Convert to partner patient</label>
              <p className="text-xs text-gray-400 mt-1 mb-2">Links this patient to a partner&apos;s referral pipeline going forward. Does not create any retroactive commission.</p>
              <div className="flex gap-2">
                <select
                  value={convertPartnerId}
                  onChange={(e) => setConvertPartnerId(e.target.value)}
                  className="flex-1 bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-sm"
                >
                  <option value="">Select a partner...</option>
                  {partners.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={handleConvert}
                  disabled={!convertPartnerId || converting || submitting}
                  className="px-3 py-2 rounded-xl bg-gray-100 text-gray-700 text-xs font-semibold hover:bg-gray-200 disabled:opacity-50"
                >
                  {converting ? "Converting..." : "Convert"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {formError && <p className="text-sm text-red-600 mt-4">{formError}</p>}

      {!duplicate && (
        <div className="flex justify-end mt-5 pt-4 border-t border-gray-100">
          <SaveButton />
        </div>
      )}
    </div>
  );
}
