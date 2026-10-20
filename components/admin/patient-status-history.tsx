import { REFERRAL_STATUS_LABELS, type ReferralStatus } from "@/types";

export type StatusHistoryEntry = {
  id: string;
  old_status: string | null;
  new_status: string;
  changed_by: string | null;
  changed_at: string;
};

function label(status: string) {
  return REFERRAL_STATUS_LABELS[status as ReferralStatus] ?? status;
}

export function PatientStatusHistory({ entries }: { entries: StatusHistoryEntry[] }) {
  if (entries.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mt-8">
      <h3 className="text-base font-bold text-gray-900 mb-4">Status History</h3>
      <ul className="space-y-3">
        {entries.map((e) => (
          <li key={e.id} className="flex items-start justify-between gap-4 text-sm border-b border-gray-50 last:border-0 pb-3 last:pb-0">
            <div>
              <span className="text-gray-700 font-medium">
                {e.old_status ? `${label(e.old_status)} → ${label(e.new_status)}` : label(e.new_status)}
              </span>
              <div className="text-xs text-gray-400 mt-0.5">{e.changed_by || "—"}</div>
            </div>
            <span className="text-xs text-gray-400 whitespace-nowrap">{new Date(e.changed_at).toLocaleString("en-GB")}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
