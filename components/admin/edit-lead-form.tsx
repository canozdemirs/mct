"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { COUNTRIES, LEAD_SOURCE_OPTIONS, UNKNOWN_LABEL } from "@/lib/constants";
import { TREATMENT_OPTIONS } from "@/components/marketing/consultation-form";
import { isValidEmail } from "@/lib/validation";
import type { Lead, PartnerOption } from "@/app/(dashboard)/admin/leads/page";

type DuplicateInfo = { id: string; name: string; created_at: string };

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

export function EditLeadForm({ lead, partners, onClose }: { lead: Lead; partners: PartnerOption[]; onClose: () => void }) {
  const router = useRouter();
  const [convertPartnerId, setConvertPartnerId] = useState("");
  const [converting, setConverting] = useState(false);
  const [source, setSource] = useState(lead.source);
  const [name, setName] = useState(lead.name);
  const [nameUnknown, setNameUnknown] = useState(lead.name === "Unknown");
  const [phone, setPhone] = useState(lead.phone || "");
  const [email, setEmail] = useState(lead.email || "");
  const [emailUnknown, setEmailUnknown] = useState(!lead.email);
  const [country, setCountry] = useState(lead.country || "");
  const [treatment, setTreatment] = useState(lead.treatment || "");
  const [internalNotes, setInternalNotes] = useState(lead.internal_notes || "");
  const [firstContactedAt, setFirstContactedAt] = useState(toDateInputValue(lead.first_contacted_at));
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [duplicate, setDuplicate] = useState<DuplicateInfo | null>(null);

  const referenceCode = typeof lead.details?.reference_code === "string" ? lead.details.reference_code : null;

  async function submit(force: boolean) {
    setSubmitting(true);
    setFormError("");
    try {
      const res = await fetch(`/api/admin/leads/${lead.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source,
          name: nameUnknown ? "Unknown" : name,
          phone,
          email: emailUnknown ? "" : email,
          country,
          treatment,
          internalNotes,
          firstContactedAt: firstContactedAt || undefined,
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

      router.refresh();
      onClose();
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
      onClose();
    } catch {
      setFormError("Network error. Please try again.");
    } finally {
      setConverting(false);
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const effectiveName = nameUnknown ? "Unknown" : name;
    if (!effectiveName.trim()) {
      setFormError("Please enter the patient's name.");
      return;
    }
    const hasPhone = phone.replace(/[^0-9]/g, "").length >= 7;
    const hasEmail = !emailUnknown && !!email.trim() && isValidEmail(email);
    if (!hasPhone && !hasEmail) {
      setFormError("Please provide at least a phone number or an email address.");
      return;
    }
    submit(false);
  }

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={() => !submitting && onClose()} />
      <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-bold text-brand-dark mb-1">Edit patient</h3>
        <p className="text-xs text-gray-400 mb-4">
          Created {new Date(lead.created_at).toLocaleString("en-GB")}
          {referenceCode ? ` · Reference ${referenceCode}` : ""}
        </p>

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
                onClick={() => submit(true)}
                disabled={submitting}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-brand hover:bg-[#154d8a] disabled:opacity-50"
              >
                {submitting ? "Saving..." : "Save anyway"}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Source *</label>
              <input
                value={source}
                onChange={(e) => setSource(e.target.value)}
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
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Full name *</label>
                <label className="flex items-center gap-1.5 text-xs text-gray-500">
                  <input type="checkbox" checked={nameUnknown} onChange={(e) => setNameUnknown(e.target.checked)} className="accent-brand" />
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
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Phone</label>
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
                  <input type="checkbox" checked={emailUnknown} onChange={(e) => setEmailUnknown(e.target.checked)} className="accent-brand" />
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

            <p className="text-xs text-gray-400">At least one of phone or email is required.</p>

            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Country</label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-sm mt-1"
              >
                <option value="">Select...</option>
                <option value={UNKNOWN_LABEL}>{UNKNOWN_LABEL}</option>
                {withCurrentValue(COUNTRIES, country).map((c) => (
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
                {withCurrentValue(TREATMENT_OPTIONS, treatment).map((t) => (
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

            {lead.owner_type === "mct" && partners.length > 0 && (
              <div className="pt-2 border-t border-gray-100">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Convert to partner patient</label>
                <p className="text-xs text-gray-400 mt-1 mb-2">Links this patient to a partner's referral pipeline going forward. Does not create any retroactive commission.</p>
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

            {formError && <p className="text-sm text-red-600">{formError}</p>}

            <div className="flex gap-3 justify-end pt-2">
              <button
                type="button"
                onClick={onClose}
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
                {submitting ? "Saving..." : "Save changes"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
