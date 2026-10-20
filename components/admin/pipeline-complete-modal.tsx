"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  MoneyFormFields,
  initialMoneyFormState,
  validateMoneyForm,
  moneyFormPayload,
} from "./money-form-fields";

// Dragging a card from Treatment Planned into Treatment Done enters
// Treatment Completed for the first time -- same money-required gate as
// the Admin Actions panel (patient-status-actions.tsx), just triggered
// from the pipeline instead. Posts to the exact same, unchanged routes.
export function PipelineCompleteModal({
  leadId,
  referralId,
  ownerType,
  onClose,
}: {
  leadId: string;
  referralId?: string;
  ownerType: "mct" | "partner";
  onClose: () => void;
}) {
  const router = useRouter();
  const [moneyForm, setMoneyForm] = useState(initialMoneyFormState);
  const [notifyPartner, setNotifyPartner] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit() {
    const validationError = validateMoneyForm(moneyForm);
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      let res: Response;
      if (ownerType === "partner" && referralId) {
        res = await fetch(`/api/admin/referrals/${referralId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "treatment_completed", commission: moneyFormPayload(moneyForm), notifyPartner }),
        });
      } else {
        res = await fetch(`/api/admin/leads/${leadId}/status`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "treatment_completed", revenue: moneyFormPayload(moneyForm) }),
        });
      }

      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(json.error || "Could not complete treatment.");
        return;
      }

      router.refresh();
      onClose();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={() => !submitting && onClose()} />
      <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <h3 className="text-lg font-bold text-brand-dark mb-1">Mark Treatment Done</h3>
        <p className="text-sm text-gray-500 mb-4">
          {ownerType === "partner" ? "Commission" : "Revenue"} details are required to move this patient to Treatment Completed.
        </p>

        <MoneyFormFields
          label={ownerType === "partner" ? "Commission" : "Revenue"}
          state={moneyForm}
          onChange={setMoneyForm}
          showPercentage={ownerType === "partner"}
        />

        {ownerType === "partner" && (
          <label className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <input type="checkbox" checked={notifyPartner} onChange={(e) => setNotifyPartner(e.target.checked)} className="accent-brand" />
            Notify partner by email
          </label>
        )}

        {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-500 border border-gray-200 hover:border-gray-300 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-brand hover:bg-[#154d8a] disabled:opacity-50"
          >
            {submitting ? "Saving..." : "Mark Treatment Done"}
          </button>
        </div>
      </div>
    </div>
  );
}
