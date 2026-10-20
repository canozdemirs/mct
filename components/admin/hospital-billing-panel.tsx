"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BILLING_STAGE_LABELS, type BillingStage, type Currency } from "@/types";

const STAGE_ORDER: BillingStage[] = ["treatment_done", "invoiced", "earned"];

// Hospital-billing progress for an already-Treatment-Completed patient.
// Deliberately has no invoice-detail fields (number/institution/amount/
// currency) -- the amount shown is read live from patient_revenues (MCT)
// or commissions (partner), never a separate stored snapshot. Moving
// backward always asks for confirmation; moving into/out of Earned on an
// MCT patient best-effort syncs patient_revenues (never touches
// commissions.status for a partner patient).
export function HospitalBillingPanel({
  leadId,
  ownerType,
  billingStage,
  moneyAmount,
  moneyCurrency,
  invoicedAt,
  earnedAt,
}: {
  leadId: string;
  ownerType: "mct" | "partner";
  billingStage: BillingStage;
  moneyAmount: number | null;
  moneyCurrency: Currency | null;
  invoicedAt: string | null;
  earnedAt: string | null;
}) {
  const router = useRouter();
  const [working, setWorking] = useState(false);
  const [error, setError] = useState("");

  async function moveTo(stage: BillingStage, backward: boolean) {
    if (backward) {
      const ok = confirm(`Move this patient back to "${BILLING_STAGE_LABELS[stage]}"? This can be redone later.`);
      if (!ok) return;
    }

    setWorking(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/leads/${leadId}/billing`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(json.error || "Failed to update billing stage.");
        return;
      }
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setWorking(false);
    }
  }

  const currentIndex = STAGE_ORDER.indexOf(billingStage);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mt-8">
      <h3 className="text-base font-bold text-gray-900 mb-4">Hospital Billing</h3>

      <div className="flex items-center gap-2 mb-5">
        {STAGE_ORDER.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <span
              className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                i === currentIndex ? "bg-brand text-white" : i < currentIndex ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-400"
              }`}
            >
              {BILLING_STAGE_LABELS[s]}
            </span>
            {i < STAGE_ORDER.length - 1 && <span className="text-gray-300">→</span>}
          </div>
        ))}
      </div>

      <dl className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-5 text-sm">
        <div>
          <dt className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
            {ownerType === "mct" ? "Revenue" : "Commission (net)"}
          </dt>
          <dd className="font-medium text-gray-800">
            {moneyAmount !== null && moneyCurrency ? `${moneyAmount.toLocaleString()} ${moneyCurrency}` : "—"}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Invoiced</dt>
          <dd className="font-medium text-gray-800">{invoicedAt ? new Date(invoicedAt).toLocaleDateString("en-GB") : "—"}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Earned</dt>
          <dd className="font-medium text-gray-800">{earnedAt ? new Date(earnedAt).toLocaleDateString("en-GB") : "—"}</dd>
        </div>
      </dl>

      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

      <div className="flex flex-wrap gap-3">
        {billingStage === "treatment_done" && (
          <button
            type="button"
            onClick={() => moveTo("invoiced", false)}
            disabled={working}
            className="px-4 py-2 rounded-xl bg-brand text-white text-sm font-semibold hover:opacity-90 disabled:opacity-50"
          >
            {working ? "Saving..." : "Mark as Invoiced"}
          </button>
        )}
        {billingStage === "invoiced" && (
          <>
            <button
              type="button"
              onClick={() => moveTo("earned", false)}
              disabled={working}
              className="px-4 py-2 rounded-xl bg-brand text-white text-sm font-semibold hover:opacity-90 disabled:opacity-50"
            >
              {working ? "Saving..." : "Mark as Earned"}
            </button>
            <button
              type="button"
              onClick={() => moveTo("treatment_done", true)}
              disabled={working}
              className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 disabled:opacity-50"
            >
              Back to Treatment Done
            </button>
          </>
        )}
        {billingStage === "earned" && (
          <button
            type="button"
            onClick={() => moveTo("invoiced", true)}
            disabled={working}
            className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 disabled:opacity-50"
          >
            Back to Invoice
          </button>
        )}
      </div>
    </div>
  );
}
