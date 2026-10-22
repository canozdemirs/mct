"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Lead } from "@/app/(dashboard)/admin/leads/page";
import { computePatientChannel } from "@/lib/patient-channel";
import { REFERRAL_STATUS_LABELS, type ReferralStatus } from "@/types";

export type SortField = "first_contacted_at" | "name" | "treatment" | "status" | "confirmed_at";

const STATUS_COLORS: Record<ReferralStatus, string> = {
  new: "bg-yellow-100 text-yellow-800",
  contacted: "bg-blue-100 text-blue-800",
  consultation: "bg-purple-100 text-purple-800",
  treatment_planned: "bg-indigo-100 text-indigo-800",
  treatment_completed: "bg-green-100 text-green-800",
  cancelled_lost: "bg-red-100 text-red-800",
};

type DeletePreviewRow = {
  id: string;
  name: string;
  date: string;
  ownerType: "mct" | "partner";
  partnerName: string | null;
  referralStatus: ReferralStatus | null;
  commission: { amount: number; currency: string; status: string } | null;
};

type ConfirmTarget = {
  ids: string[];
  rows: DeletePreviewRow[];
};

// Edit/Delete per row were retired -- clicking anywhere on a row opens
// the full patient card (/admin/leads/[id]), which now carries both.
// Only bulk delete (checkbox + "Delete selected") stays in the list.
export function LeadsTable({
  leads,
  partnerNameById,
  sortHrefs,
  activeSort,
  activeDir,
}: {
  leads: Lead[];
  partnerNameById: Record<string, string>;
  sortHrefs: Partial<Record<SortField, string>>;
  activeSort?: SortField;
  activeDir?: "asc" | "desc";
}) {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [confirmTarget, setConfirmTarget] = useState<ConfirmTarget | null>(null);
  const [loadingPreview, setLoadingPreview] = useState(false);
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

  function SortableHeader({ field, label }: { field: SortField; label: string }) {
    const href = sortHrefs[field];
    if (!href) return <>{label}</>;
    return (
      <Link href={href} className="inline-flex items-center gap-1 hover:text-gray-600" onClick={(e) => e.stopPropagation()}>
        {label}
        {activeSort === field && <span>{activeDir === "asc" ? "↑" : "↓"}</span>}
      </Link>
    );
  }

  function fallbackRows(ids: string[]): DeletePreviewRow[] {
    return ids.map((id) => {
      const l = leads.find((x) => x.id === id);
      return {
        id,
        name: l?.name ?? id,
        date: l?.created_at ?? new Date().toISOString(),
        ownerType: l?.owner_type ?? "mct",
        partnerName: l?.partner_id ? partnerNameById[l.partner_id] ?? null : null,
        referralStatus: null,
        commission: null,
      };
    });
  }

  async function openDeleteConfirm(ids: string[]) {
    setLoadingPreview(true);
    try {
      const res = await fetch(`/api/admin/leads/delete-preview?ids=${ids.join(",")}`);
      if (res.ok) {
        const json = await res.json() as { previews: DeletePreviewRow[] };
        setConfirmTarget({ ids, rows: json.previews });
      } else {
        setConfirmTarget({ ids, rows: fallbackRows(ids) });
      }
    } catch {
      setConfirmTarget({ ids, rows: fallbackRows(ids) });
    } finally {
      setLoadingPreview(false);
    }
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
      const json = await res.json().catch(() => ({})) as { ok?: boolean; error?: string; failed?: { id: string; error: string }[] };
      if (res.ok) {
        setSelected((prev) => {
          const next = new Set(prev);
          for (const id of confirmTarget.ids) next.delete(id);
          return next;
        });
        setConfirmTarget(null);
        router.refresh();
        if (json.failed && json.failed.length > 0) {
          alert(`${json.failed.length} record(s) could not be deleted:\n` + json.failed.map((f) => `${f.id}: ${f.error}`).join("\n"));
        }
      } else {
        alert(json.error || "Failed to delete record(s).");
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
            onClick={() => openDeleteConfirm(Array.from(selected))}
            disabled={loadingPreview}
            className="px-4 py-1.5 rounded-lg bg-red-600 text-white text-xs font-semibold hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {loadingPreview ? "Loading..." : `Delete selected (${selected.size})`}
          </button>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {leads.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="font-medium">No patients found</p>
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
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">
                    <SortableHeader field="first_contacted_at" label="Registered Date" />
                  </th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    <SortableHeader field="name" label="Name" />
                  </th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden xl:table-cell">Contact</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden lg:table-cell">Owner</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden md:table-cell">Country</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    <SortableHeader field="treatment" label="Treatment" />
                  </th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Hospital</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden lg:table-cell">Source</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden lg:table-cell">Channel</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    <SortableHeader field="status" label="Status" />
                  </th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">
                    <SortableHeader field="confirmed_at" label="Confirmation date" />
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {leads.map((lead) => {
                  const partnerName = lead.partner_id ? partnerNameById[lead.partner_id] : null;
                  return (
                    <tr
                      key={lead.id}
                      className="hover:bg-gray-50 transition-colors align-top cursor-pointer"
                      onClick={() => router.push(`/admin/leads/${lead.id}`)}
                    >
                      <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={selected.has(lead.id)}
                          onChange={() => toggleOne(lead.id)}
                          aria-label={`Select ${lead.name}`}
                          className="accent-brand"
                        />
                      </td>
                      <td className="px-5 py-4 text-gray-500 whitespace-nowrap">{formatDate(lead.first_contacted_at ?? lead.created_at)}</td>
                      <td className="px-5 py-4 font-semibold text-brand-dark">
                        {lead.name}
                        {lead.name === "Unknown" && lead.phone ? (
                          <span className="font-normal text-gray-400"> ({lead.phone})</span>
                        ) : null}
                      </td>
                      <td className="px-5 py-4 text-gray-500 hidden xl:table-cell">
                        <div>{lead.email || "—"}</div>
                        <div className="text-xs text-gray-400">{lead.phone || ""}</div>
                      </td>
                      <td className="px-5 py-4 hidden lg:table-cell">
                        {lead.owner_type === "partner" ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-700">
                            {partnerName || "Partner"}
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">MCT</span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-gray-500 hidden md:table-cell">{lead.country || "—"}</td>
                      <td className="px-5 py-4 text-gray-700">{lead.treatment || "—"}</td>
                      <td className="px-5 py-4 text-gray-500">{lead.hospital || "—"}</td>
                      <td className="px-5 py-4 text-gray-500 hidden lg:table-cell">{lead.source}</td>
                      <td className="px-5 py-4 text-gray-500 hidden lg:table-cell">{lead.channel ?? computePatientChannel(lead)}</td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[lead.status] ?? "bg-gray-100 text-gray-600"}`}>
                          {REFERRAL_STATUS_LABELS[lead.status] ?? lead.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-gray-500 whitespace-nowrap">
                        {lead.confirmed_at ? formatDate(lead.confirmed_at) : "—"}
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
              Are you sure you want to delete {confirmTarget.ids.length} record{confirmTarget.ids.length !== 1 ? "s" : ""}?
            </h3>
            <p className="text-sm text-red-600 font-medium mb-4">This action cannot be undone.</p>
            <ul className="max-h-64 overflow-y-auto text-sm text-gray-600 space-y-2 mb-6 border border-gray-100 rounded-xl p-3">
              {confirmTarget.rows.map((r) => (
                <li key={r.id} className="border-b border-gray-50 last:border-0 pb-2 last:pb-0">
                  <div className="flex justify-between gap-3">
                    <span className="font-medium text-gray-700">{r.name}</span>
                    <span className="text-gray-400 shrink-0">{formatDate(r.date)}</span>
                  </div>
                  {r.ownerType === "partner" && (
                    <div className="mt-1 bg-amber-50 border border-amber-200 rounded-lg px-2.5 py-2 text-xs text-amber-800">
                      Partner: <strong>{r.partnerName || "Unknown"}</strong>
                      {r.referralStatus && <> · Referral: {REFERRAL_STATUS_LABELS[r.referralStatus] ?? r.referralStatus}</>}
                      {r.commission && (
                        <>
                          {" "}· Commission: {r.commission.amount.toLocaleString()} {r.commission.currency} ({r.commission.status})
                        </>
                      )}
                      <div className="mt-1 font-medium">This will also remove it from the partner&apos;s portal and delete the commission record (logged for accounting).</div>
                    </div>
                  )}
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
