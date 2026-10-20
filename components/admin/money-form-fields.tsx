"use client";

import { EXTERNAL_INSTITUTIONS, CURRENCIES, commissionRateFor, type InstitutionType, type Currency } from "@/types";

export const inputClass =
  "w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-teal focus:bg-white transition-all";
export const labelClass = "block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2";

// Shared by the "Treatment Completed requires money details" gate in
// patient-status-actions.tsx (Admin Actions panel) and
// pipeline-complete-modal.tsx (dragging a card into Treatment Done) --
// same fields, same validation, same preview math either way; only the
// surrounding form differs.
export type MoneyFormState = {
  institutionType: InstitutionType;
  institutionPreset: string;
  institutionOther: string;
  netAmount: string;
  currency: Currency;
};

export function initialMoneyFormState(): MoneyFormState {
  return {
    institutionType: "mct_package",
    institutionPreset: EXTERNAL_INSTITUTIONS[0],
    institutionOther: "",
    netAmount: "",
    currency: "EUR",
  };
}

export function resolvedInstitutionName(state: MoneyFormState): string {
  return state.institutionPreset === "Other" ? state.institutionOther.trim() : state.institutionPreset;
}

export function validateMoneyForm(state: MoneyFormState): string | null {
  if (!state.netAmount || Number(state.netAmount) <= 0) {
    return "Please enter a valid net amount.";
  }
  if (state.institutionType === "external_institution" && !resolvedInstitutionName(state)) {
    return "Please provide the institution name.";
  }
  return null;
}

export function moneyFormPayload(state: MoneyFormState) {
  return {
    institution_type: state.institutionType,
    institution_name: state.institutionType === "external_institution" ? resolvedInstitutionName(state) : undefined,
    net_amount: Number(state.netAmount),
    currency: state.currency,
  };
}

export function MoneyFormFields({
  label,
  state,
  onChange,
  showPercentage,
}: {
  label: string;
  state: MoneyFormState;
  onChange: (next: MoneyFormState) => void;
  showPercentage: boolean;
}) {
  const percentage = showPercentage ? commissionRateFor(state.institutionType) : null;
  const previewAmount = Number(state.netAmount) > 0 ? (percentage !== null ? (Number(state.netAmount) * percentage) / 100 : Number(state.netAmount)) : 0;

  function set<K extends keyof MoneyFormState>(key: K, value: MoneyFormState[K]) {
    onChange({ ...state, [key]: value });
  }

  return (
    <div className="mb-5 p-4 rounded-xl bg-teal/5 border border-teal/20">
      <div className="text-xs font-bold text-teal uppercase tracking-widest mb-4">{label} Details (required to complete)</div>

      <div className="mb-4">
        <label className={labelClass}>Institution Type</label>
        <select
          value={state.institutionType}
          onChange={(e) => set("institutionType", e.target.value as InstitutionType)}
          className={inputClass}
        >
          <option value="mct_package">MCT Package</option>
          <option value="external_institution">External Institution</option>
        </select>
      </div>

      {state.institutionType === "external_institution" && (
        <div className="mb-4">
          <label className={labelClass}>Institution Name</label>
          <select
            value={state.institutionPreset}
            onChange={(e) => set("institutionPreset", e.target.value)}
            className={inputClass}
          >
            {EXTERNAL_INSTITUTIONS.map((i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>
          {state.institutionPreset === "Other" && (
            <input
              className={`${inputClass} mt-2`}
              value={state.institutionOther}
              onChange={(e) => set("institutionOther", e.target.value)}
              placeholder="Institution name"
            />
          )}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <label className={labelClass}>Net Amount</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={state.netAmount}
            onChange={(e) => set("netAmount", e.target.value)}
            className={inputClass}
            placeholder="0.00"
          />
        </div>
        <div>
          <label className={labelClass}>Currency</label>
          <select value={state.currency} onChange={(e) => set("currency", e.target.value as Currency)} className={inputClass}>
            {CURRENCIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {percentage !== null ? (
        <p className="text-xs text-gray-500">
          Commission: <span className="font-semibold text-brand-dark">{percentage}%</span> ={" "}
          <span className="font-semibold text-brand-dark">
            {previewAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {state.currency}
          </span>
        </p>
      ) : (
        <p className="text-xs text-gray-500">
          Revenue: <span className="font-semibold text-brand-dark">
            {previewAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {state.currency}
          </span>
        </p>
      )}
    </div>
  );
}
