"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  REFERRAL_STATUSES,
  REFERRAL_STATUS_LABELS,
  EXTERNAL_INSTITUTIONS,
  CURRENCIES,
  commissionRateFor,
  type ReferralStatus,
  type InstitutionType,
  type Currency,
} from "@/types";

const inputClass =
  "w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-teal focus:bg-white transition-all";
const labelClass = "block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2";

type Variant =
  | { kind: "partner"; referralId: string; currentAdminNotes: string | null }
  | { kind: "mct"; leadId: string };

// Shared by partner referrals and MCT-direct patients -- the "Treatment
// Completed requires money details up front" gate, the preview-amount
// math, and the leaving-completed warning text are identical for both;
// only the save target and whether a commission % is shown differ.
// Partner variant POSTs to the UNCHANGED /api/admin/referrals/[id]
// (commission creation/cancellation logic there is untouched); MCT
// variant POSTs to /api/admin/leads/[id]/status (revenue, no percentage).
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

  const [institutionType, setInstitutionType] = useState<InstitutionType>("mct_package");
  const [institutionPreset, setInstitutionPreset] = useState(EXTERNAL_INSTITUTIONS[0]);
  const [institutionOther, setInstitutionOther] = useState("");
  const [netAmount, setNetAmount] = useState("");
  const [currency, setCurrency] = useState<Currency>("EUR");

  const needsMoneyForm = status === "treatment_completed" && !hasActiveMoney;
  const resolvedInstitutionName = institutionPreset === "Other" ? institutionOther.trim() : institutionPreset;
  const percentage = variant.kind === "partner" ? commissionRateFor(institutionType) : null;
  const previewAmount = Number(netAmount) > 0 ? (percentage !== null ? (Number(netAmount) * percentage) / 100 : Number(netAmount)) : 0;
  const moneyLabel = variant.kind === "partner" ? "Commission" : "Revenue";

  async function handleSave() {
    if (needsMoneyForm) {
      if (!netAmount || Number(netAmount) <= 0) {
        setMessage({ type: "error", text: `Please enter a valid net amount to complete this ${variant.kind === "partner" ? "referral" : "patient record"}.` });
        return;
      }
      if (institutionType === "external_institution" && !resolvedInstitutionName) {
        setMessage({ type: "error", text: "Please provide the institution name." });
        return;
      }
    }

    setSaving(true);
    setMessage(null);

    const moneyPayload = needsMoneyForm
      ? {
          institution_type: institutionType,
          institution_name: institutionType === "external_institution" ? resolvedInstitutionName : undefined,
          net_amount: Number(netAmount),
          currency,
        }
      : undefined;

    try {
      let res: Response;
      if (variant.kind === "partner") {
        const payload: Record<string, unknown> = { status, admin_notes: adminNotes };
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
        setMessage({ type: "success", text: variant.kind === "partner" ? "Referral updated. The partner has been notified by email." : "Patient updated." });
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
        <div className="mb-5 p-4 rounded-xl bg-teal/5 border border-teal/20">
          <div className="text-xs font-bold text-teal uppercase tracking-widest mb-4">
            {moneyLabel} Details (required to complete)
          </div>

          <div className="mb-4">
            <label className={labelClass}>Institution Type</label>
            <select
              value={institutionType}
              onChange={(e) => setInstitutionType(e.target.value as InstitutionType)}
              className={inputClass}
            >
              <option value="mct_package">MCT Package</option>
              <option value="external_institution">External Institution</option>
            </select>
          </div>

          {institutionType === "external_institution" && (
            <div className="mb-4">
              <label className={labelClass}>Institution Name</label>
              <select
                value={institutionPreset}
                onChange={(e) => setInstitutionPreset(e.target.value)}
                className={inputClass}
              >
                {EXTERNAL_INSTITUTIONS.map((i) => (
                  <option key={i} value={i}>
                    {i}
                  </option>
                ))}
              </select>
              {institutionPreset === "Other" && (
                <input
                  className={`${inputClass} mt-2`}
                  value={institutionOther}
                  onChange={(e) => setInstitutionOther(e.target.value)}
                  placeholder="Institution name"
                />
              )}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className={labelClass}>Net Amount</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={netAmount}
                onChange={(e) => setNetAmount(e.target.value)}
                className={inputClass}
                placeholder="0.00"
              />
            </div>
            <div>
              <label className={labelClass}>Currency</label>
              <select value={currency} onChange={(e) => setCurrency(e.target.value as Currency)} className={inputClass}>
                {CURRENCIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {percentage !== null ? (
            <p className="text-xs text-gray-500">
              Commission: <span className="font-semibold text-brand-dark">{percentage}%</span> ={" "}
              <span className="font-semibold text-brand-dark">
                {previewAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {currency}
              </span>
            </p>
          ) : (
            <p className="text-xs text-gray-500">
              Revenue: <span className="font-semibold text-brand-dark">
                {previewAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {currency}
              </span>
            </p>
          )}
        </div>
      )}

      {variant.kind === "partner" && (
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
