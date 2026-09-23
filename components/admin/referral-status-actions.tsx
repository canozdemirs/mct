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

export function ReferralStatusActions({
  referralId,
  currentStatus,
  currentAdminNotes,
  hasActiveCommission,
}: {
  referralId: string;
  currentStatus: ReferralStatus;
  currentAdminNotes: string | null;
  hasActiveCommission: boolean;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<ReferralStatus>(currentStatus);
  const [adminNotes, setAdminNotes] = useState(currentAdminNotes ?? "");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [institutionType, setInstitutionType] = useState<InstitutionType>("mct_package");
  const [institutionPreset, setInstitutionPreset] = useState(EXTERNAL_INSTITUTIONS[0]);
  const [institutionOther, setInstitutionOther] = useState("");
  const [netAmount, setNetAmount] = useState("");
  const [currency, setCurrency] = useState<Currency>("EUR");

  const needsCommissionForm = status === "treatment_completed" && !hasActiveCommission;
  const resolvedInstitutionName = institutionPreset === "Other" ? institutionOther.trim() : institutionPreset;
  const percentage = commissionRateFor(institutionType);
  const previewAmount = Number(netAmount) > 0 ? (Number(netAmount) * percentage) / 100 : 0;

  async function handleSave() {
    if (needsCommissionForm) {
      if (!netAmount || Number(netAmount) <= 0) {
        setMessage({ type: "error", text: "Please enter a valid net amount to complete this referral." });
        return;
      }
      if (institutionType === "external_institution" && !resolvedInstitutionName) {
        setMessage({ type: "error", text: "Please provide the institution name." });
        return;
      }
    }

    setSaving(true);
    setMessage(null);

    const payload: Record<string, unknown> = { status, admin_notes: adminNotes };
    if (needsCommissionForm) {
      payload.commission = {
        institution_type: institutionType,
        institution_name: institutionType === "external_institution" ? resolvedInstitutionName : undefined,
        net_amount: Number(netAmount),
        currency,
      };
    }

    try {
      const res = await fetch(`/api/admin/referrals/${referralId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json() as { ok?: boolean; error?: string };

      if (!res.ok) {
        setMessage({ type: "error", text: json.error ?? "Something went wrong." });
      } else {
        setMessage({ type: "success", text: "Referral updated. The partner has been notified by email." });
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

      {needsCommissionForm && (
        <div className="mb-5 p-4 rounded-xl bg-teal/5 border border-teal/20">
          <div className="text-xs font-bold text-teal uppercase tracking-widest mb-4">
            Commission Details (required to complete)
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

          <p className="text-xs text-gray-500">
            Commission: <span className="font-semibold text-brand-dark">{percentage}%</span> ={" "}
            <span className="font-semibold text-brand-dark">
              {previewAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {currency}
            </span>
          </p>
        </div>
      )}

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
