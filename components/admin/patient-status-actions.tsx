"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { REFERRAL_STATUSES, REFERRAL_STATUS_LABELS, type ReferralStatus } from "@/types";
import {
  MoneyFormFields,
  initialMoneyFormState,
  validateMoneyForm,
  moneyFormPayload,
  inputClass,
  labelClass,
} from "./money-form-fields";

type Variant =
  | { kind: "partner"; referralId: string; currentAdminNotes: string | null }
  | { kind: "mct"; leadId: string };

// Shared by partner referrals and MCT-direct patients -- the "Treatment
// Completed requires money details up front" gate (fields themselves are
// money-form-fields.tsx, also reused by pipeline-complete-modal.tsx) and
// the save target are the only things that differ. Partner variant POSTs
// to the UNCHANGED /api/admin/referrals/[id] (commission creation/
// cancellation logic there is untouched); MCT variant POSTs to
// /api/admin/leads/[id]/status (revenue, no percentage).
export function PatientStatusActions({
  variant,
  currentStatus,
  hasActiveMoney,
}: {
  variant: Variant;
  currentStatus: ReferralStatus;
  hasActiveMoney: boolean;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<ReferralStatus>(currentStatus);
  const [adminNotes, setAdminNotes] = useState(variant.kind === "partner" ? variant.currentAdminNotes ?? "" : "");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [moneyForm, setMoneyForm] = useState(initialMoneyFormState);
  const [notifyPartner, setNotifyPartner] = useState(true);

  const needsMoneyForm = status === "treatment_completed" && !hasActiveMoney;
  const moneyLabel = variant.kind === "partner" ? "Commission" : "Revenue";

  async function handleSave() {
    if (needsMoneyForm) {
      const validationError = validateMoneyForm(moneyForm);
      if (validationError) {
        setMessage({ type: "error", text: validationError });
        return;
      }
    }

    setSaving(true);
    setMessage(null);

    const moneyPayload = needsMoneyForm ? moneyFormPayload(moneyForm) : undefined;

    try {
      let res: Response;
      if (variant.kind === "partner") {
        const payload: Record<string, unknown> = { status, admin_notes: adminNotes, notifyPartner };
        if (moneyPayload) payload.commission = moneyPayload;
        res = await fetch(`/api/admin/referrals/${variant.referralId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        const payload: Record<string, unknown> = { status };
        if (moneyPayload) payload.revenue = moneyPayload;
        res = await fetch(`/api/admin/leads/${variant.leadId}/status`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      const json = await res.json() as { ok?: boolean; error?: string };

      if (!res.ok) {
        setMessage({ type: "error", text: json.error ?? "Something went wrong." });
      } else {
        setMessage({
          type: "success",
          text: variant.kind === "partner" ? (notifyPartner ? "Referral updated. The partner has been notified by email." : "Referral updated. The partner was not notified.") : "Patient updated.",
        });
        router.refresh();
      }
    } catch {
      setMessage({ type: "error", text: "Network error. Please try again." });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mt-8">
      <h3 className="text-base font-bold text-gray-900 mb-5">Admin Actions</h3>

      <div className="mb-5">
        <label className={labelClass}>Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as ReferralStatus)}
          className={inputClass}
        >
          {REFERRAL_STATUSES.map((s) => (
            <option key={s} value={s}>
              {REFERRAL_STATUS_LABELS[s]}
            </option>
          ))}
        </select>
      </div>

      {needsMoneyForm && (
        <MoneyFormFields
          label={moneyLabel}
          state={moneyForm}
          onChange={setMoneyForm}
          showPercentage={variant.kind === "partner"}
        />
      )}

      {variant.kind === "partner" && (
        <>
          <div className="mb-5">
            <label className={labelClass}>Internal Notes (never visible to the partner)</label>
            <textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              rows={4}
              placeholder="Internal notes about this referral..."
              className={`${inputClass} resize-none`}
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-600 mb-5">
            <input type="checkbox" checked={notifyPartner} onChange={(e) => setNotifyPartner(e.target.checked)} className="accent-brand" />
            Notify partner by email
          </label>
        </>
      )}

      {message && (
        <div
          className={`mb-5 px-4 py-3 rounded-xl text-sm font-medium ${
            message.type === "success" ? "bg-green-50 border border-green-200 text-green-800" : "bg-red-50 border border-red-200 text-red-800"
          }`}
        >
          {message.text}
        </div>
      )}

      <button
        onClick={handleSave}
        disabled={saving}
        className="px-5 py-2.5 rounded-xl bg-brand text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {saving ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
}
