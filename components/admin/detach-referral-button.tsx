"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function DetachReferralButton({
  leadId,
  patientName,
  partnerName,
  hasActiveCommission,
}: {
  leadId: string;
  patientName: string;
  partnerName: string | null;
  hasActiveCommission: boolean;
}) {
  const router = useRouter();
  const [working, setWorking] = useState(false);
  const [error, setError] = useState("");

  async function handleDetach() {
    const warning = hasActiveCommission
      ? `This will permanently delete this referral AND its active commission (logged for accounting). "${patientName}" will become a direct MCT patient, no longer linked to ${partnerName || "this partner"}. Continue?`
      : `This will permanently delete this referral. "${patientName}" will become a direct MCT patient, no longer linked to ${partnerName || "this partner"}. Continue?`;

    if (!confirm(warning)) return;

    setWorking(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/leads/${leadId}/owner`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "detach" }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(json.error || "Could not detach this patient.");
        return;
      }
      router.push("/admin/leads");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setWorking(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mt-8">
      <h3 className="text-base font-bold text-gray-900 mb-1">Detach from Partner</h3>
      <p className="text-sm text-gray-500 mb-4">
        Converts this patient to a direct MCT patient and removes this referral (and its commission, if any) from the partner's portal. The patient record itself is kept.
      </p>
      {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
      <button
        type="button"
        onClick={handleDetach}
        disabled={working}
        className="px-5 py-2.5 rounded-xl border-2 border-red-600 text-red-600 text-sm font-semibold hover:bg-red-600 hover:text-white transition-colors disabled:opacity-50"
      >
        {working ? "Detaching..." : "Detach from Partner"}
      </button>
    </div>
  );
}
