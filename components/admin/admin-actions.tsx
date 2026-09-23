"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Action = "approve" | "rejected" | "needs_info";

const ACTION_CONFIG: Record<Action, { label: string; className: string; confirmText: string }> = {
  approve: {
    label: "Approve Partner",
    className:
      "px-5 py-2.5 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition-colors disabled:opacity-50",
    confirmText: "This will send the partner an invitation email and create their account. Continue?",
  },
  needs_info: {
    label: "Request More Info",
    className:
      "px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50",
    confirmText: "Mark this application as needing more information?",
  },
  rejected: {
    label: "Reject",
    className:
      "px-5 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors disabled:opacity-50",
    confirmText: "Reject this partner application?",
  },
};

const DELETE_STEP_LABELS: Record<string, string> = {
  fetch_application: "looking up the application",
  fetch_partner: "looking up the linked partner",
  fetch_referrals: "looking up linked referrals",
  delete_commissions: "deleting linked commissions",
  delete_status_history: "deleting referral status history",
  delete_storage_files: "deleting uploaded referral files",
  delete_referrals: "deleting linked referrals",
  delete_partner: "deleting the linked partner record",
  delete_application: "deleting the application",
  delete_auth_user: "deleting the login account",
};

export function AdminActions({
  applicationId,
  currentStatus,
  linkedReferralsCount,
  linkedCommissionsCount,
}: {
  applicationId: string;
  currentStatus: string;
  linkedReferralsCount: number;
  linkedCommissionsCount: number;
}) {
  const router = useRouter();
  const [adminNotes, setAdminNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function handleAction(action: Action) {
    const config = ACTION_CONFIG[action];
    if (!confirm(config.confirmText)) return;

    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch(`/api/admin/partner-applications/${applicationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, admin_notes: adminNotes }),
      });

      const json = await res.json() as { ok?: boolean; error?: string; status?: number; code?: string };

      if (!res.ok) {
        const detail = action === "approve" && (json.status || json.code)
          ? ` (Supabase ${[json.status, json.code].filter(Boolean).join(" / ")})`
          : "";
        setMessage({ type: "error", text: (json.error ?? "Something went wrong. Please try again.") + detail });
      } else {
        setMessage({
          type: "success",
          text:
            action === "approve"
              ? "Partner approved successfully. An invitation email has been sent."
              : action === "needs_info"
              ? "Application marked as needing more information. The applicant has been notified by email."
              : "Application rejected. The applicant has been notified by email.",
        });
        router.refresh();
      }
    } catch {
      setMessage({ type: "error", text: "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    let confirmText = "Bu başvuruyu kalıcı olarak silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.";
    if (linkedReferralsCount > 0) {
      confirmText =
        `Bu başvuruyu silmek, buna bağlı ${linkedReferralsCount} referral` +
        (linkedCommissionsCount > 0 ? ` ve ${linkedCommissionsCount} komisyon` : "") +
        ` kaydını da kalıcı olarak silecek (yüklenen dosyalar dahil). Bu işlem geri alınamaz. Devam edilsin mi?`;
    }

    if (!confirm(confirmText)) return;

    setDeleting(true);
    setMessage(null);

    try {
      const res = await fetch(`/api/admin/partner-applications/${applicationId}`, {
        method: "DELETE",
      });

      const json = await res.json() as { ok?: boolean; error?: string; warning?: string; failedStep?: string };

      if (!res.ok) {
        const stepLabel = json.failedStep ? DELETE_STEP_LABELS[json.failedStep] ?? json.failedStep : null;
        setMessage({
          type: "error",
          text: stepLabel
            ? `${json.error ?? "Failed to delete application."} (failed at: ${stepLabel})`
            : json.error ?? "Failed to delete application.",
        });
        setDeleting(false);
        return;
      }

      if (json.warning) {
        alert(json.warning);
      }

      router.push("/admin/partner-applications");
      router.refresh();
    } catch {
      setMessage({ type: "error", text: "Network error. Please try again." });
      setDeleting(false);
    }
  }

  const isApproved = currentStatus === "approved";
  const busy = loading || deleting;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mt-8">
      <h3 className="text-base font-bold text-gray-900 mb-1">Admin Actions</h3>
      <p className="text-sm text-gray-500 mb-5">
        Current status:{" "}
        <span className="font-semibold text-brand capitalize">{currentStatus.replace("_", " ")}</span>
      </p>

      {linkedReferralsCount > 0 && (
        <div className="mb-5 px-4 py-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm">
          This partner has <strong>{linkedReferralsCount}</strong> referral{linkedReferralsCount !== 1 ? "s" : ""}
          {linkedCommissionsCount > 0 ? ` and ${linkedCommissionsCount} commission record${linkedCommissionsCount !== 1 ? "s" : ""}` : ""}.
          Deleting this application will permanently delete all of it.
        </div>
      )}

      <div className="mb-5">
        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
          Admin Notes (optional)
        </label>
        <textarea
          value={adminNotes}
          onChange={(e) => setAdminNotes(e.target.value)}
          rows={4}
          placeholder="Add notes about this application (internal only)..."
          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-teal focus:bg-white transition-all resize-none"
        />
      </div>

      {message && (
        <div
          className={`mb-5 px-4 py-3 rounded-xl text-sm font-medium ${
            message.type === "success"
              ? "bg-green-50 border border-green-200 text-green-800"
              : "bg-red-50 border border-red-200 text-red-800"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-3">
          {!isApproved && (
            <button
              onClick={() => handleAction("approve")}
              disabled={busy}
              className={ACTION_CONFIG.approve.className}
            >
              {loading ? "Processing..." : ACTION_CONFIG.approve.label}
            </button>
          )}
          <button
            onClick={() => handleAction("needs_info")}
            disabled={busy}
            className={ACTION_CONFIG.needs_info.className}
          >
            {loading ? "Processing..." : ACTION_CONFIG.needs_info.label}
          </button>
          <button
            onClick={() => handleAction("rejected")}
            disabled={busy}
            className={ACTION_CONFIG.rejected.className}
          >
            {loading ? "Processing..." : ACTION_CONFIG.rejected.label}
          </button>
        </div>

        <button
          onClick={handleDelete}
          disabled={busy}
          className="px-5 py-2.5 rounded-xl border-2 border-red-600 text-red-600 text-sm font-semibold hover:bg-red-600 hover:text-white transition-colors disabled:opacity-50"
        >
          {deleting ? "Deleting..." : "Delete Application"}
        </button>
      </div>
    </div>
  );
}
