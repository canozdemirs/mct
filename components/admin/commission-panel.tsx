"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  EXTERNAL_INSTITUTIONS,
  CURRENCIES,
  commissionRateFor,
  type Commission,
  type InstitutionType,
  type Currency,
} from "@/types";

const inputClass =
  "w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-teal focus:bg-white transition-all";
const labelClass = "block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  paid: "bg-green-100 text-green-800",
  cancelled: "bg-gray-200 text-gray-600",
};

function Field({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div>
      <dt className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{label}</dt>
      <dd className="text-sm text-gray-800 font-medium">{value || "—"}</dd>
    </div>
  );
}

export function CommissionPanel({ commission }: { commission: Commission }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().slice(0, 10));
  const [showPaidForm, setShowPaidForm] = useState(false);

  const [institutionType, setInstitutionType] = useState<InstitutionType>(commission.institution_type);
  const isKnownPreset = EXTERNAL_INSTITUTIONS.includes(commission.institution_name ?? "");
  const [institutionPreset, setInstitutionPreset] = useState(
    isKnownPreset ? commission.institution_name! : commission.institution_name ? "Other" : EXTERNAL_INSTITUTIONS[0]
  );
  const [institutionOther, setInstitutionOther] = useState(isKnownPreset ? "" : commission.institution_name ?? "");
  const [netAmount, setNetAmount] = useState(String(commission.net_amount));
  const [currency, setCurrency] = useState<Currency>(commission.currency);

  const resolvedInstitutionName = institutionPreset === "Other" ? institutionOther.trim() : institutionPreset;
  const percentage = commissionRateFor(institutionType);
  const previewAmount = Number(netAmount) > 0 ? (Number(netAmount) * percentage) / 100 : 0;

  async function callAction(body: object) {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/commissions/${commission.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json() as { ok?: boolean; error?: string };
      if (!res.ok) {
        setMessage({ type: "error", text: json.error ?? "Something went wrong." });
        return false;
      }
      router.refresh();
      return true;
    } catch {
      setMessage({ type: "error", text: "Network error. Please try again." });
      return false;
    } finally {
      setSaving(false);
    }
  }

  async function handleMarkPaid() {
    if (!paymentDate) {
      setMessage({ type: "error", text: "Please select a payment date." });
      return;
    }
    const ok = await callAction({ action: "mark_paid", payment_date: paymentDate });
    if (ok) setShowPaidForm(false);
  }

  async function handleMarkReconciled() {
    if (!confirm("Confirm this paid commission has been manually reconciled/clawed back outside the system?")) return;
    await callAction({ action: "mark_reconciled" });
  }

  async function handleSaveEdit() {
    if (!netAmount || Number(netAmount) <= 0) {
      setMessage({ type: "error", text: "Net amount must be a positive number." });
      return;
    }
    if (institutionType === "external_institution" && !resolvedInstitutionName) {
      setMessage({ type: "error", text: "Institution name is required." });
      return;
    }
    const ok = await callAction({
      action: "edit",
      institution_type: institutionType,
      institution_name: institutionType === "external_institution" ? resolvedInstitutionName : undefined,
      net_amount: Number(netAmount),
      currency,
    });
    if (ok) setEditing(false);
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mt-8">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-base font-bold text-gray-900">Commission</h3>
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[commission.status]}`}>
          {commission.status === "pending" ? "Pending" : commission.status === "paid" ? "Paid" : "Cancelled"}
        </span>
      </div>

      {commission.reconciliation_status === "needs_reconciliation" && (
        <div className="mb-5 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm font-medium">
          ⚠️ Paid commission — needs clawback/reconciliation. This referral&apos;s status was changed away from
          Treatment Completed after the commission was already paid.
          <button
            onClick={handleMarkReconciled}
            disabled={saving}
            className="block mt-2 text-red-700 font-semibold underline disabled:opacity-50"
          >
            Mark as Reconciled
          </button>
        </div>
      )}
      {commission.reconciliation_status === "resolved" && (
        <div className="mb-5 px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-600 text-xs">
          Reconciled by {commission.resolved_by} on{" "}
          {commission.resolved_at ? new Date(commission.resolved_at).toLocaleDateString("en-GB") : "—"}.
        </div>
      )}
      {commission.status === "cancelled" && commission.cancelled_reason && (
        <div className="mb-5 px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-500 text-xs">
          Cancelled: {commission.cancelled_reason}
        </div>
      )}

      {editing ? (
        <div className="mb-5">
          <div className="mb-4">
            <label className={labelClass}>Institution Type</label>
            <select value={institutionType} onChange={(e) => setInstitutionType(e.target.value as InstitutionType)} className={inputClass}>
              <option value="mct_package">MCT Package</option>
              <option value="external_institution">External Institution</option>
            </select>
          </div>
          {institutionType === "external_institution" && (
            <div className="mb-4">
              <label className={labelClass}>Institution Name</label>
              <select value={institutionPreset} onChange={(e) => setInstitutionPreset(e.target.value)} className={inputClass}>
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
              <input type="number" min="0" step="0.01" value={netAmount} onChange={(e) => setNetAmount(e.target.value)} className={inputClass} />
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
          <p className="text-xs text-gray-500 mb-4">
            Commission: <span className="font-semibold text-brand-dark">{percentage}%</span> ={" "}
            <span className="font-semibold text-brand-dark">
              {previewAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {currency}
            </span>
          </p>
          <div className="flex gap-3">
            <button onClick={handleSaveEdit} disabled={saving} className="px-4 py-2 rounded-xl bg-brand text-white text-sm font-semibold hover:opacity-90 disabled:opacity-50">
              {saving ? "Saving..." : "Save"}
            </button>
            <button onClick={() => setEditing(false)} className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:border-gray-300">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-5">
          <Field label="Institution Type" value={commission.institution_type === "mct_package" ? "MCT Package" : "External Institution"} />
          <Field label="Institution" value={commission.institution_name} />
          <Field label="Net Amount" value={`${commission.net_amount.toLocaleString()} ${commission.currency}`} />
          <Field label="Commission %" value={`${commission.commission_percentage}%`} />
          <Field label="Commission Amount" value={`${commission.commission_amount.toLocaleString()} ${commission.currency}`} />
          <Field label="Payment Date" value={commission.payment_date ? new Date(commission.payment_date).toLocaleDateString("en-GB") : "—"} />
        </dl>
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

      {!editing && commission.status === "pending" && (
        <div className="flex flex-wrap gap-3 items-center">
          {!showPaidForm ? (
            <button
              onClick={() => setShowPaidForm(true)}
              className="px-4 py-2 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-700"
            >
              Mark as Paid
            </button>
          ) : (
            <div className="flex flex-wrap items-center gap-2">
              <input type="date" value={paymentDate} onChange={(e) => setPaymentDate(e.target.value)} className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm" />
              <button onClick={handleMarkPaid} disabled={saving} className="px-4 py-2 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-700 disabled:opacity-50">
                Confirm Paid
              </button>
              <button onClick={() => setShowPaidForm(false)} className="text-sm text-gray-400 hover:text-gray-600">
                Cancel
              </button>
            </div>
          )}
          <button onClick={() => setEditing(true)} className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:border-gray-300">
            Edit Details
          </button>
        </div>
      )}
    </div>
  );
}
