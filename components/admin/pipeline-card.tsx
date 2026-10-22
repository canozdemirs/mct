"use client";

import { useRouter } from "next/navigation";
import type { PipelineCard as PipelineCardData } from "./pipeline-board";

export function PipelineCard({
  card,
  onDragStart,
}: {
  card: PipelineCardData;
  onDragStart: (e: React.DragEvent) => void;
}) {
  const router = useRouter();

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onClick={() => router.push(`/admin/leads/${card.id}`)}
      className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm hover:shadow-md hover:border-brand/30 transition-all cursor-pointer"
    >
      <div className="font-semibold text-sm text-brand-dark truncate">{card.name}</div>
      <div className="text-xs text-gray-500 mt-1 truncate">{card.treatment || "—"}</div>
      <div className="text-xs text-gray-400 truncate">{card.country || "—"}{card.hospital ? ` · ${card.hospital}` : ""}</div>
      <div className="flex items-center justify-between mt-2">
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
            card.ownerType === "partner" ? "bg-teal-50 text-teal-700" : "bg-gray-100 text-gray-600"
          }`}
        >
          {card.ownerLabel}
        </span>
        <span className="text-[11px] text-gray-400">{card.daysInStage}d</span>
      </div>
      <div className="text-[11px] text-gray-400 mt-1 truncate">{card.sourceCategory}</div>
      {card.amount !== null && card.currency && (
        <div className="text-xs font-semibold text-brand-dark mt-1.5">
          {card.amount.toLocaleString()} {card.currency}
        </div>
      )}
      {card.confirmedAt && (
        <div className="text-[11px] text-gray-400 mt-1">
          Confirmed {new Date(card.confirmedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
        </div>
      )}
    </div>
  );
}
