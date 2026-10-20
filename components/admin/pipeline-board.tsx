"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PipelineCard as PipelineCardView } from "./pipeline-card";
import { PipelineCompleteModal } from "./pipeline-complete-modal";
import { PipelineStatusConfirmModal } from "./pipeline-status-confirm-modal";
import type { BillingStage } from "@/types";

export type PipelineColumnId = "offered" | "treatment_planned" | "treatment_done" | "invoiced" | "earned";

export type PipelineCard = {
  id: string;
  referralId?: string;
  name: string;
  country: string | null;
  treatment: string | null;
  hospital: string | null;
  ownerType: "mct" | "partner";
  ownerLabel: string;
  daysInStage: number;
  amount: number | null;
  currency: string | null;
  column: PipelineColumnId;
};

const COLUMNS: { id: PipelineColumnId; label: string; showTotals: boolean }[] = [
  { id: "offered", label: "Offered", showTotals: false },
  { id: "treatment_planned", label: "Confirmed", showTotals: false },
  { id: "treatment_done", label: "Treatment Done", showTotals: false },
  { id: "invoiced", label: "Invoice", showTotals: true },
  { id: "earned", label: "Earned", showTotals: true },
];

const COLUMN_INDEX: Record<PipelineColumnId, number> = {
  offered: 0,
  treatment_planned: 1,
  treatment_done: 2,
  invoiced: 3,
  earned: 4,
};

const BILLING_STAGE_FOR_COLUMN: Partial<Record<PipelineColumnId, BillingStage>> = {
  treatment_done: "treatment_done",
  invoiced: "invoiced",
  earned: "earned",
};

function columnTotals(cards: PipelineCard[]): Map<string, number> {
  const byCurrency = new Map<string, number>();
  for (const c of cards) {
    if (c.amount !== null && c.currency) {
      byCurrency.set(c.currency, (byCurrency.get(c.currency) ?? 0) + c.amount);
    }
  }
  return byCurrency;
}

// Native HTML5 drag-and-drop -- no new dependency, desktop-focused (same
// as the rest of this admin panel). Each drop is resolved to exactly one
// of three existing, unchanged server actions depending on which columns
// are involved:
//  - offered <-> treatment_planned: plain status change, no money.
//  - treatment_planned -> treatment_done: opens PipelineCompleteModal
//    (money required, same gate as Admin Actions) before calling status.
//  - treatment_done -> treatment_planned (backward): status change,
//    reuses the existing leaving-completed commission/revenue handling.
//  - treatment_done <-> invoiced <-> earned: the new billing route,
//    which never touches `status` or commissions.status, and never
//    emails the partner either way.
// Any non-adjacent drop (skipping a column) is rejected client-side.
// Any status move on a PARTNER card (the three cases above that can
// actually change referrals.status) goes through
// PipelineStatusConfirmModal first, so the partner-notification email
// stays opt-out rather than silent; MCT cards skip that modal entirely
// since no email path exists for them.
type StatusConfirmTarget = { card: PipelineCard; status: string; title: string; warningText?: string };

export function PipelineBoard({ cards }: { cards: PipelineCard[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [completeModalCard, setCompleteModalCard] = useState<PipelineCard | null>(null);
  const [statusConfirmTarget, setStatusConfirmTarget] = useState<StatusConfirmTarget | null>(null);

  function handleDragStart(e: React.DragEvent, card: PipelineCard) {
    e.dataTransfer.setData("text/plain", card.id);
  }

  async function callStatusRoute(card: PipelineCard, status: string, notifyPartner?: boolean) {
    setBusyId(card.id);
    try {
      const res =
        card.ownerType === "partner" && card.referralId
          ? await fetch(`/api/admin/referrals/${card.referralId}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ status, notifyPartner }),
            })
          : await fetch(`/api/admin/leads/${card.id}/status`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ status }),
            });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(json.error || "Failed to move this patient.");
        return;
      }
      router.refresh();
    } catch {
      alert("Network error. Please try again.");
    } finally {
      setBusyId(null);
    }
  }

  async function callBillingRoute(card: PipelineCard, stage: BillingStage) {
    setBusyId(card.id);
    try {
      const res = await fetch(`/api/admin/leads/${card.id}/billing`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(json.error || "Failed to update billing stage.");
        return;
      }
      router.refresh();
    } catch {
      alert("Network error. Please try again.");
    } finally {
      setBusyId(null);
    }
  }

  function handleDrop(e: React.DragEvent, targetColumn: PipelineColumnId) {
    e.preventDefault();
    const cardId = e.dataTransfer.getData("text/plain");
    const card = cards.find((c) => c.id === cardId);
    if (!card || card.column === targetColumn) return;

    const sourceIndex = COLUMN_INDEX[card.column];
    const targetIndex = COLUMN_INDEX[targetColumn];
    if (Math.abs(targetIndex - sourceIndex) !== 1) {
      alert("Please move one stage at a time.");
      return;
    }
    const forward = targetIndex > sourceIndex;

    if (card.column === "treatment_planned" && targetColumn === "treatment_done") {
      setCompleteModalCard(card);
      return;
    }

    if (card.column === "treatment_done" && targetColumn === "treatment_planned") {
      const warningText = "Any pending revenue/commission will be cancelled; an already-received one will be flagged for reconciliation.";
      if (card.ownerType === "partner") {
        setStatusConfirmTarget({ card, status: "treatment_planned", title: `Move "${card.name}" back to Confirmed?`, warningText });
      } else {
        if (!confirm(`Move "${card.name}" back to Confirmed? ${warningText}`)) return;
        callStatusRoute(card, "treatment_planned");
      }
      return;
    }

    if (card.column === "offered" && targetColumn === "treatment_planned") {
      if (card.ownerType === "partner") {
        setStatusConfirmTarget({ card, status: "treatment_planned", title: `Move "${card.name}" to Confirmed?` });
      } else {
        callStatusRoute(card, "treatment_planned");
      }
      return;
    }
    if (card.column === "treatment_planned" && targetColumn === "offered") {
      if (card.ownerType === "partner") {
        setStatusConfirmTarget({ card, status: "consultation", title: `Move "${card.name}" back to Offered?` });
      } else {
        if (!confirm(`Move "${card.name}" back to Offered?`)) return;
        callStatusRoute(card, "consultation");
      }
      return;
    }

    const billingTarget = BILLING_STAGE_FOR_COLUMN[targetColumn];
    if (billingTarget) {
      if (!forward && !confirm(`Move "${card.name}" back to "${COLUMNS.find((c) => c.id === targetColumn)?.label}"?`)) return;
      callBillingRoute(card, billingTarget);
    }
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {COLUMNS.map((col) => {
          const colCards = cards.filter((c) => c.column === col.id);
          const totals = col.showTotals ? columnTotals(colCards) : null;

          return (
            <div
              key={col.id}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDrop(e, col.id)}
              className="bg-gray-100/60 rounded-2xl p-3 min-h-[200px]"
            >
              <div className="flex items-center justify-between mb-3 px-1">
                <h3 className="text-sm font-bold text-gray-700">{col.label}</h3>
                <span className="text-xs font-semibold text-gray-400 bg-white px-2 py-0.5 rounded-full">{colCards.length}</span>
              </div>
              {totals && totals.size > 0 && (
                <div className="mb-3 px-1 text-xs text-gray-500 space-y-0.5">
                  {[...totals.entries()].map(([currency, amount]) => (
                    <div key={currency} className="font-semibold text-brand-dark">
                      {amount.toLocaleString()} {currency}
                    </div>
                  ))}
                </div>
              )}
              <div className="space-y-2">
                {colCards.map((card) => (
                  <div key={card.id} className={busyId === card.id ? "opacity-50 pointer-events-none" : ""}>
                    <PipelineCardView card={card} onDragStart={(e) => handleDragStart(e, card)} />
                  </div>
                ))}
                {colCards.length === 0 && <p className="text-xs text-gray-400 px-1">No patients</p>}
              </div>
            </div>
          );
        })}
      </div>

      {completeModalCard && (
        <PipelineCompleteModal
          leadId={completeModalCard.id}
          referralId={completeModalCard.referralId}
          ownerType={completeModalCard.ownerType}
          onClose={() => setCompleteModalCard(null)}
        />
      )}

      {statusConfirmTarget && (
        <PipelineStatusConfirmModal
          title={statusConfirmTarget.title}
          warningText={statusConfirmTarget.warningText}
          onCancel={() => setStatusConfirmTarget(null)}
          onConfirm={(notifyPartner) => {
            callStatusRoute(statusConfirmTarget.card, statusConfirmTarget.status, notifyPartner);
            setStatusConfirmTarget(null);
          }}
        />
      )}
    </>
  );
}
