"use client";

import { useState } from "react";

// Used only for partner-owned cards moving between Offered/Treatment
// Planned (either direction) or backward out of Treatment Done -- the
// only pipeline moves that can trigger the partner status-update email.
// MCT cards skip this entirely (no email path exists for them) and go
// straight through; billing-stage moves (Treatment Done <-> Invoice <->
// Earned) never send email either way, so they keep their plain
// confirm() for backward moves instead of this modal.
export function PipelineStatusConfirmModal({
  title,
  warningText,
  onConfirm,
  onCancel,
}: {
  title: string;
  warningText?: string;
  onConfirm: (notifyPartner: boolean) => void;
  onCancel: () => void;
}) {
  const [notifyPartner, setNotifyPartner] = useState(true);

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onCancel} />
      <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
        <h3 className="text-lg font-bold text-brand-dark mb-2">{title}</h3>
        {warningText && <p className="text-sm text-amber-700 mb-4">{warningText}</p>}

        <label className="flex items-center gap-2 text-sm text-gray-600 mb-5">
          <input type="checkbox" checked={notifyPartner} onChange={(e) => setNotifyPartner(e.target.checked)} className="accent-brand" />
          Notify partner by email
        </label>

        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-500 border border-gray-200 hover:border-gray-300"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onConfirm(notifyPartner)}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-brand hover:bg-[#154d8a]"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
