"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function SyncReferralsBanner({ count }: { count: number }) {
  const router = useRouter();
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState("");

  if (count === 0) return null;

  async function handleSync() {
    setSyncing(true);
    setError("");
    try {
      const res = await fetch("/api/admin/leads/sync-referrals", { method: "POST" });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(json.error || "Sync failed.");
        return;
      }
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSyncing(false);
    }
  }

  return (
    <div className="flex items-center justify-between bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-4">
      <span className="text-sm text-amber-800 font-medium">
        {count} partner patient{count !== 1 ? "s" : ""} not synced to Patients yet.
        {error && <span className="block text-red-600 mt-1">{error}</span>}
      </span>
      <button
        type="button"
        onClick={handleSync}
        disabled={syncing}
        className="px-4 py-1.5 rounded-lg bg-amber-600 text-white text-xs font-semibold hover:bg-amber-700 transition-colors disabled:opacity-50"
      >
        {syncing ? "Syncing..." : "Sync now"}
      </button>
    </div>
  );
}
