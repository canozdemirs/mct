"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { EXTERNAL_INSTITUTIONS, CURRENCIES, type InstitutionType, type Currency } from "@/types";

const inputClass =
  "w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-teal focus:bg-white transition-all";
const labelClass = "block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  received: "bg-green-100 text-green-800",
  cancelled: "bg-gray-200 text-gray-600",
};

export type PatientRevenue = {
  id: string;
  institution_type: InstitutionType;
  institution_name: string | null;
  net_amount: number;
  currency: Currency;
  payment_status: "pending" | "received" | "cancelled";
  payment_date: string | null;
  reconciliation_status: "none" | "needs_reconciliation" | "resolved";
  resolved_by: string | null;
  resolved_at: string | null;
};

function Field({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div>
      <dt className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{label}</dt>
      <dd className="text-sm text-gray-800 font-medium">{value || "—"}</dd>
    </div>
  );
}

export function RevenuePanel({ revenue }: { revenue: PatientRevenue }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().slice(0, 10));
  const [showReceivedForm, setShowReceivedForm] = useState(false);

  const [institutionType, setInstitutionType] = useState<InstitutionType>(revenue.institution_type);
  const isKnownPreset = EXTERNAL_INSTITUTIONS.includes(revenue.institution_name ?? "");
  const [institutionPreset, setInstitutionPreset] = useState(
    isKnownPreset ? revenue.institution_name! : revenue.institution_name ? "Other" : EXTERNAL_INSTITUTIONS[0]
  );
  const [institutionOther, setInstitutionOther] = useState(isKnownPreset ? "" : revenue.institution_name ?? "");
  const [netAmount, setNetAmount] = useState(String(revenue.net_amount));
  const [currency, setCurrency] = useState<Currency>(revenue.currency);

  const resolvedInstitutionName = institutionPreset === "Other" ? institutionOther.trim() : institutionPreset;

  async function callAction(body: object) {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/patient-revenues/${revenue.id}`, {
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

  async function handleMarkReceived() {
    if (!paymentDate) {
      setMessage({ type: "error", text: "Please select a payment date." });
      return;
    }
    const ok = await callAction({ action: "mark_received", payment_date: paymentDate });
    if (ok) setShowReceivedForm(false);
  }

  async function handleMarkReconciled() {
    if (!confirm("Confirm this received revenue has been manually reconciled outside the system?")) return;
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
        <h3 className="text-base font-bold text-gray-900">Revenue</h3>
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[revenue.payment_status]}`}>
          {revenue.payment_status === "pending" ? "Pending" : revenue.payment_status === "received" ? "Received" : "Cancelled"}
        </span>
      </div>

      {revenue.reconciliation_status === "needs_reconciliation" && (
        <div className="mb-5 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm font-medium">
          ⚠️ Received revenue — needs manual reconciliation. This patient&apos;s status was changed away from
          Treatment Completed after the revenue was already marked received.
          <button
            onClick={handleMarkReconciled}
            disabled={saving}
            className="block mt-2 text-red-700 font-semibold underline disabled:opacity-50"
          >
            Mark as Reconciled
          </button>
        </div>
      )}
      {revenue.reconciliation_status === "resolved" && (
        <div className="mb-5 px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-600 text-xs">
          Reconciled by {revenue.resolved_by} on{" "}
          {revenue.resolved_at ? new Date(revenue.resolved_at).toLocaleDateString("en-GB") : "—"}.
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
          <div className="grid grid-cols-2 gap-3 mb-4">
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
          <Field label="Institution Type" value={revenue.institution_type === "mct_package" ? "MCT Package" : "External Institution"} />
          <Field label="Institution" value={revenue.institution_name} />
          <Field label="Net Amount" value={`${revenue.net_amount.toLocaleString()} ${revenue.currency}`} />
          <Field label="Payment Date" value={revenue.payment_date ? new Date(revenue.payment_date).toLocaleDateString("en-GB") : "—"} />
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

      {!editing && revenue.payment_status === "pending" && (
        <div className="flex flex-wrap gap-3 items-center">
          {!showReceivedForm ? (
            <button
              onClick={() => setShowReceivedForm(true)}
              className="px-4 py-2 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-700"
            >
              Mark as Received
            </button>
          ) : (
            <div className="flex flex-wrap items-center gap-2">
              <input type="date" value={paymentDate} onChange={(e) => setPaymentDate(e.target.value)} className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm" />
              <button onClick={handleMarkReceived} disabled={saving} className="px-4 py-2 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-700 disabled:opacity-50">
                Confirm Received
              </button>
              <button onClick={() => setShowReceivedForm(false)} className="text-sm text-gray-400 hover:text-gray-600">
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
