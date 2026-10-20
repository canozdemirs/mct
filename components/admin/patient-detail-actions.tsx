"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { REFERRAL_STATUS_LABELS, type ReferralStatus } from "@/types";
import type { Lead } from "@/app/(dashboard)/admin/leads/page";

type DeletePreview = {
  ownerType: "mct" | "partner";
  partnerName: string | null;
  referralStatus: ReferralStatus | null;
  commission: { amount: number; currency: string; status: string } | null;
};

// Editing lives directly on the patient card now (patient-edit-card.tsx)
// -- this component is Delete only.
export function PatientDetailActions({ lead }: { lead: Lead }) {
  const router = useRouter();
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [preview, setPreview] = useState<DeletePreview | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function openDeleteConfirm() {
    setLoadingPreview(true);
    try {
      const res = await fetch(`/api/admin/leads/delete-preview?ids=${lead.id}`);
      const json = await res.json().catch(() => ({}));
      const row = json.previews?.[0];
      setPreview(row ? { ownerType: row.ownerType, partnerName: row.partnerName, referralStatus: row.referralStatus, commission: row.commission } : {
        ownerType: lead.owner_type, partnerName: null, referralStatus: null, commission: null,
      });
    } catch {
      setPreview({ ownerType: lead.owner_type, partnerName: null, referralStatus: null, commission: null });
    } finally {
      setLoadingPreview(false);
    }
  }

  async function confirmDelete() {
    setDeleting(true);
    try {
      const res = await fetch("/api/admin/leads", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: [lead.id] }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || (json.failed && json.failed.length > 0)) {
        alert(json.error || json.failed?.[0]?.error || "Failed to delete this patient.");
        setDeleting(false);
        return;
      }
      router.push("/admin/leads");
    } catch {
      alert("Network error. Please try again.");
      setDeleting(false);
    }
  }

  return (
    <div className="flex gap-3 mt-6">
      <button
        type="button"
        onClick={openDeleteConfirm}
        disabled={loadingPreview}
        className="px-5 py-2.5 rounded-xl border-2 border-red-600 text-red-600 text-sm font-semibold hover:bg-red-600 hover:text-white transition-colors disabled:opacity-50"
      >
        {loadingPreview ? "Loading..." : "Delete patient"}
      </button>

      {preview && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => !deleting && setPreview(null)} />
          <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-lg font-bold text-brand-dark mb-2">Delete {lead.name}?</h3>
            <p className="text-sm text-red-600 font-medium mb-4">This action cannot be undone.</p>
            {preview.ownerType === "partner" && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2.5 text-xs text-amber-800 mb-4">
                Partner: <strong>{preview.partnerName || "Unknown"}</strong>
                {preview.referralStatus && <> · Referral: {REFERRAL_STATUS_LABELS[preview.referralStatus] ?? preview.referralStatus}</>}
                {preview.commission && (
                  <>
                    {" "}· Commission: {preview.commission.amount.toLocaleString()} {preview.commission.currency} ({preview.commission.status})
                  </>
                )}
                <div className="mt-1 font-medium">This will also remove it from the partner&apos;s portal and delete the commission record (logged for accounting).</div>
              </div>
            )}
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setPreview(null)}
                disabled={deleting}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-500 border border-gray-200 hover:border-gray-300 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={deleting}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-red-600 hover:bg-red-700 disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
