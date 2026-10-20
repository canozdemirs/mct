"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { COUNTRIES, LEAD_SOURCE_OPTIONS, LEAD_SOURCES_REQUIRING_PHONE, UNKNOWN_LABEL } from "@/lib/constants";
import { TREATMENT_OPTIONS } from "@/components/marketing/consultation-form";
import { isValidEmail } from "@/lib/validation";
import { useCountryDialCode } from "@/lib/hooks/use-country-dial-code";

type ClickInfo = {
  reference_code: string;
  channel: string;
  created_at: string;
  lead_id: string | null;
  inferred_channel?: string | null;
  last_touch_utm_campaign?: string | null;
};

type DuplicateInfo = { id: string; name: string; created_at: string };

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function clientFieldError(source: string, name: string, phone: string, email: string): string | null {
  if (!source) return "Please select a source.";
  if (!name.trim()) return "Please enter the patient's name.";
  const hasPhone = phone.replace(/[^0-9]/g, "").length >= 7;
  const hasEmail = !!email.trim() && isValidEmail(email);
  if (LEAD_SOURCES_REQUIRING_PHONE.includes(source) && !hasPhone) {
    return `Phone is required for the "${source}" source.`;
  }
  if (!hasPhone && !hasEmail) {
    return "Please provide at least a phone number or an email address.";
  }
  return null;
}

export function AddManualLeadForm({ attributionAvailable }: { attributionAvailable: boolean }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [source, setSource] = useState(LEAD_SOURCE_OPTIONS[0]);
  const [name, setName] = useState("");
  const [nameUnknown, setNameUnknown] = useState(false);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [emailUnknown, setEmailUnknown] = useState(false);
  const [country, setCountry] = useState("");
  const [treatment, setTreatment] = useState("");
  const [internalNotes, setInternalNotes] = useState("");
  const [firstContactedAt, setFirstContactedAt] = useState(todayIso);
  const [refCode, setRefCode] = useState("");
  const [clickInfo, setClickInfo] = useState<ClickInfo | null>(null);
  const [refLookupState, setRefLookupState] = useState<"idle" | "loading" | "found" | "not_found">("idle");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [duplicate, setDuplicate] = useState<DuplicateInfo | null>(null);

  useCountryDialCode(country, phone, setPhone);

  function resetForm() {
    setSource(LEAD_SOURCE_OPTIONS[0]);
    setName("");
    setNameUnknown(false);
    setPhone("");
    setEmail("");
    setEmailUnknown(false);
    setCountry("");
    setTreatment("");
    setInternalNotes("");
    setFirstContactedAt(todayIso());
    setRefCode("");
    setClickInfo(null);
    setRefLookupState("idle");
    setFormError("");
    setDuplicate(null);
  }

  function closeModal() {
    if (submitting) return;
    setOpen(false);
    resetForm();
  }

  async function lookupRefCode() {
    const code = refCode.trim().toUpperCase();
    if (!code) return;
    setRefLookupState("loading");
    try {
      const res = await fetch(`/api/admin/leads/manual?ref=${encodeURIComponent(code)}`);
      if (res.ok) {
        const json = await res.json();
        setClickInfo(json.record);
        setRefLookupState("found");
      } else {
        setClickInfo(null);
        setRefLookupState("not_found");
      }
    } catch {
      setClickInfo(null);
      setRefLookupState("not_found");
    }
  }

  async function submit(force: boolean) {
    setSubmitting(true);
    setFormError("");
    try {
      const res = await fetch("/api/admin/leads/manual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source,
          name: nameUnknown ? "Unknown" : name,
          phone,
          email: emailUnknown ? "" : email,
          country,
          treatment,
          internalNotes,
          firstContactedAt,
          refCode: refCode.trim() || undefined,
          force,
        }),
      });
      const json = await res.json().catch(() => ({}));

      if (res.status === 409 && json.existing) {
        setDuplicate(json.existing);
        return;
      }
      if (!res.ok) {
        setFormError(json.error || "Could not create the lead.");
        return;
      }

      setOpen(false);
      resetForm();
      router.refresh();
    } catch {
      setFormError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const effectiveName = nameUnknown ? "Unknown" : name;
    const effectiveEmail = emailUnknown ? "" : email;
    const error = clientFieldError(source, effectiveName, phone, effectiveEmail);
    if (error) {
      setFormError(error);
      return;
    }
    submit(false);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="px-4 py-2 rounded-xl bg-brand text-white text-sm font-semibold hover:bg-[#154d8a] transition-colors"
      >
        + Add new patient
      </button>

      {open && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={closeModal} />
          <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-brand-dark mb-4">Add new patient</h3>

            {duplicate ? (
              <div className="space-y-4">
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm">
                  <p className="font-semibold text-amber-800 mb-1">A record with this phone/email already exists:</p>
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
                    onClick={() => submit(true)}
                    disabled={submitting}
                    className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-brand hover:bg-[#154d8a] disabled:opacity-50"
                  >
                    {submitting ? "Adding..." : "Add anyway"}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Source *</label>
                  <select
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-sm mt-1"
                  >
                    {LEAD_SOURCE_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Full name *</label>
                    <label className="flex items-center gap-1.5 text-xs text-gray-500">
                      <input
                        type="checkbox"
                        checked={nameUnknown}
                        onChange={(e) => setNameUnknown(e.target.checked)}
                        className="accent-brand"
                      />
                      Unknown
                    </label>
                  </div>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={nameUnknown}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-sm mt-1 disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Phone {LEAD_SOURCES_REQUIRING_PHONE.includes(source) ? "*" : ""}
                  </label>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-sm mt-1"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</label>
                    <label className="flex items-center gap-1.5 text-xs text-gray-500">
                      <input
                        type="checkbox"
                        checked={emailUnknown}
                        onChange={(e) => setEmailUnknown(e.target.checked)}
                        className="accent-brand"
                      />
                      Unknown
                    </label>
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={emailUnknown}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-sm mt-1 disabled:opacity-50"
                  />
                </div>

                <p className="text-xs text-gray-400">At least one of phone or email is required (unless both are unknown and the source doesn&apos;t require a phone).</p>

                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Country</label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-sm mt-1"
                  >
                    <option value="">Select...</option>
                    <option value={UNKNOWN_LABEL}>{UNKNOWN_LABEL}</option>
                    {COUNTRIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Treatment</label>
                  <select
                    value={treatment}
                    onChange={(e) => setTreatment(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-sm mt-1"
                  >
                    <option value="">Select...</option>
                    <option value={UNKNOWN_LABEL}>{UNKNOWN_LABEL}</option>
                    {TREATMENT_OPTIONS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Internal notes</label>
                  <textarea
                    value={internalNotes}
                    onChange={(e) => setInternalNotes(e.target.value)}
                    rows={2}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-sm mt-1"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">First contact date</label>
                  <input
                    type="date"
                    value={firstContactedAt}
                    onChange={(e) => setFirstContactedAt(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-sm mt-1"
                  />
                </div>

                {attributionAvailable && (
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Reference code (optional)</label>
                    <div className="flex gap-2 mt-1">
                      <input
                        value={refCode}
                        onChange={(e) => {
                          setRefCode(e.target.value);
                          setRefLookupState("idle");
                          setClickInfo(null);
                        }}
                        placeholder="MCT-A7K2P9"
                        className="flex-1 bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-sm uppercase"
                      />
                      <button
                        type="button"
                        onClick={lookupRefCode}
                        disabled={!refCode.trim() || refLookupState === "loading"}
                        className="px-3 py-2 rounded-xl bg-gray-100 text-gray-700 text-xs font-semibold hover:bg-gray-200 disabled:opacity-50"
                      >
                        {refLookupState === "loading" ? "..." : "Find"}
                      </button>
                    </div>
                    {refLookupState === "found" && clickInfo && (
                      <div className="mt-2 bg-teal-50 border border-teal-100 rounded-xl p-3 text-xs space-y-1">
                        <div>
                          <span className="text-gray-400">Channel:</span> {clickInfo.channel}
                        </div>
                        {clickInfo.inferred_channel && (
                          <div>
                            <span className="text-gray-400">Source:</span> {clickInfo.inferred_channel}
                          </div>
                        )}
                        {clickInfo.last_touch_utm_campaign && (
                          <div>
                            <span className="text-gray-400">Campaign:</span> {clickInfo.last_touch_utm_campaign}
                          </div>
                        )}
                        <div>
                          <span className="text-gray-400">Date:</span> {new Date(clickInfo.created_at).toLocaleString("en-GB")}
                        </div>
                      </div>
                    )}
                    {refLookupState === "not_found" && <p className="mt-1 text-xs text-red-500">No record found for that code.</p>}
                  </div>
                )}

                {formError && <p className="text-sm text-red-600">{formError}</p>}

                <div className="flex gap-3 justify-end pt-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    disabled={submitting}
                    className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-500 border border-gray-200 hover:border-gray-300 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-brand hover:bg-[#154d8a] disabled:opacity-50"
                  >
                    {submitting ? "Adding..." : "Add"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
