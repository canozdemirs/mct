"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LeadStatusSelect } from "./lead-status-select";
import type { Lead } from "@/app/(dashboard)/admin/leads/page";

type ConfirmTarget = {
  ids: string[];
  rows: { name: string; date: string }[];
};

export function LeadsTable({ leads }: { leads: Lead[] }) {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [confirmTarget, setConfirmTarget] = useState<ConfirmTarget | null>(null);
  const [deleting, setDeleting] = useState(false);

  function toggleOne(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    setSelected((prev) => (prev.size === leads.length ? new Set() : new Set(leads.map((l) => l.id))));
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  }

  function requestDeleteOne(lead: Lead) {
    setConfirmTarget({ ids: [lead.id], rows: [{ name: lead.name, date: formatDate(lead.created_at) }] });
  }

  function requestDeleteSelected() {
    const rows = leads
      .filter((l) => selected.has(l.id))
      .map((l) => ({ name: l.name, date: formatDate(l.created_at) }));
    setConfirmTarget({ ids: Array.from(selected), rows });
  }

  async function confirmDelete() {
    if (!confirmTarget) return;
    setDeleting(true);
    try {
      const res = await fetch("/api/admin/leads", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: confirmTarget.ids }),
      });
      if (res.ok) {
        setSelected((prev) => {
          const next = new Set(prev);
          for (const id of confirmTarget.ids) next.delete(id);
          return next;
        });
        setConfirmTarget(null);
        router.refresh();
      } else {
        const json = await res.json().catch(() => ({}));
        alert(json.error || "Failed to delete lead(s).");
      }
    } catch {
      alert("Network error. Please try again.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      {selected.size > 0 && (
        <div className="flex items-center justify-between bg-red-50 border border-red-100 rounded-xl px-4 py-3 mb-4">
          <span className="text-sm text-red-700 font-medium">{selected.size} selected</span>
          <button
            type="button"
            onClick={requestDeleteSelected}
            className="px-4 py-1.5 rounded-lg bg-red-600 text-white text-xs font-semibold hover:bg-red-700 transition-colors"
          >
            Delete selected ({selected.size})
          </button>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {leads.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="font-medium">No leads found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-5 py-3.5 w-10">
                    <input
                      type="checkbox"
                      checked={selected.size === leads.length && leads.length > 0}
                      onChange={toggleAll}
                      aria-label="Select all"
                      className="accent-brand"
                    />
                  </th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Date</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Name</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden xl:table-cell">Contact</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden md:table-cell">Country</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Treatment</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden lg:table-cell">Source</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Details</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {leads.map((lead) => {
                  const hasExtra = lead.message || Object.keys(lead.details || {}).length > 0;
                  return (
                    <tr key={lead.id} className="hover:bg-gray-50 transition-colors align-top">
                      <td className="px-5 py-4">
                        <input
                          type="checkbox"
                          checked={selected.has(lead.id)}
                          onChange={() => toggleOne(lead.id)}
                          aria-label={`Select ${lead.name}`}
                          className="accent-brand"
                        />
                      </td>
                      <td className="px-5 py-4 text-gray-500 whitespace-nowrap">{formatDate(lead.created_at)}</td>
                      <td className="px-5 py-4 font-semibold text-brand-dark">{lead.name}</td>
                      <td className="px-5 py-4 text-gray-500 hidden xl:table-cell">
                        <div>{lead.email || "—"}</div>
                        <div className="text-xs text-gray-400">{lead.phone || ""}</div>
                      </td>
                      <td className="px-5 py-4 text-gray-500 hidden md:table-cell">{lead.country || "—"}</td>
                      <td className="px-5 py-4 text-gray-700">{lead.treatment || "—"}</td>
                      <td className="px-5 py-4 text-gray-500 hidden lg:table-cell">{lead.source}</td>
                      <td className="px-5 py-4">
                        <LeadStatusSelect leadId={lead.id} currentStatus={lead.status} />
                      </td>
                      <td className="px-5 py-4 max-w-xs">
                        {hasExtra ? (
                          <details>
                            <summary className="cursor-pointer text-brand text-xs font-semibold">View</summary>
                            <div className="mt-2 text-xs text-gray-600 space-y-1">
                              {lead.message && <p className="whitespace-pre-line">{lead.message}</p>}
                              {Object.entries(lead.details || {}).map(([k, v]) => (
                                <div key={k}>
                                  <span className="text-gray-400">{k}:</span> {String(v)}
                                </div>
                              ))}
                            </div>
                          </details>
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <button
                          type="button"
                          onClick={() => requestDeleteOne(lead)}
                          className="px-3 py-1.5 rounded-lg border border-red-200 text-red-600 text-xs font-semibold hover:bg-red-50 transition-colors"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {confirmTarget && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => !deleting && setConfirmTarget(null)} />
          <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-lg font-bold text-brand-dark mb-2">
              {confirmTarget.ids.length} kaydı silmek istediğine emin misin?
            </h3>
            <p className="text-sm text-red-600 font-medium mb-4">Bu işlem geri alınamaz.</p>
            <ul className="max-h-48 overflow-y-auto text-sm text-gray-600 space-y-1 mb-6 border border-gray-100 rounded-xl p-3">
              {confirmTarget.rows.map((r, i) => (
                <li key={i} className="flex justify-between gap-3">
                  <span className="font-medium text-gray-700">{r.name}</span>
                  <span className="text-gray-400 shrink-0">{r.date}</span>
                </li>
              ))}
            </ul>
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setConfirmTarget(null)}
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
    </>
  );
}
