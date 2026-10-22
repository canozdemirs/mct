"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

const SELECT_CLASS = "bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-sm text-gray-700";

function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

// Quick Registered-date presets just fill dateFrom/dateTo directly --
// there's no separate "preset" concept kept in the URL, so a manually
// edited date range and a quick-picked one are indistinguishable (and
// equally easy to clear via the one chip that covers both).
function quickRange(key: "today" | "7d" | "30d" | "month"): { from: string; to: string } {
  const now = new Date();
  const to = isoDate(now);
  if (key === "today") return { from: to, to };
  if (key === "7d") return { from: isoDate(new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000)), to };
  if (key === "30d") return { from: isoDate(new Date(now.getTime() - 29 * 24 * 60 * 60 * 1000)), to };
  return { from: isoDate(new Date(now.getFullYear(), now.getMonth(), 1)), to };
}

// All filter state lives in the URL (?q=&treatment=&owner=&hospital=&
// source=&country=&dateFrom=&dateTo=&confirmedFrom=&confirmedTo=&sort=&
// dir=&page=) so it survives a refresh, a back-navigation from a
// patient card, and stays shareable. Status itself is driven by the
// tabs above this component (same `status` param) -- not duplicated
// here. This component only ever reads useSearchParams() and pushes
// updates back to it; the debounced search input is the only local
// state, so typing doesn't feel like it's fighting a server round trip
// on every keystroke.
export function PatientsFilters({
  treatmentOptions,
  countryOptions,
  sourceOptions,
  acqSourceOptions,
  partners,
  resultCount,
}: {
  treatmentOptions: string[];
  countryOptions: string[];
  sourceOptions: string[];
  acqSourceOptions: string[];
  partners: { id: string; name: string }[];
  resultCount: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const q = searchParams.get("q") || "";
  const owner = searchParams.get("owner") || "all";
  const treatment = searchParams.get("treatment") || "";
  const hospital = searchParams.get("hospital") || "";
  const source = searchParams.get("source") || "";
  const country = searchParams.get("country") || "";
  const acqSource = searchParams.get("acqSource") || "";
  const dateFrom = searchParams.get("dateFrom") || "";
  const dateTo = searchParams.get("dateTo") || "";
  const confirmedFrom = searchParams.get("confirmedFrom") || "";
  const confirmedTo = searchParams.get("confirmedTo") || "";

  const [searchInput, setSearchInput] = useState(q);
  const [hospitalInput, setHospitalInput] = useState(hospital);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hospitalDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Keeps the boxes in sync when the URL changes from elsewhere (e.g. a
  // chip removal or "Clear filters"), without fighting the debounce
  // timers for ordinary typing.
  useEffect(() => setSearchInput(q), [q]);
  useEffect(() => setHospitalInput(hospital), [hospital]);

  function updateParams(updates: Record<string, string | undefined>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value) params.set(key, value);
      else params.delete(key);
    }
    // Any filter change invalidates the current page number.
    params.delete("page");
    router.push(params.toString() ? `${pathname}?${params.toString()}` : pathname);
  }

  function debounced(ref: typeof debounceRef, field: string, value: string, setLocal: (v: string) => void) {
    setLocal(value);
    if (ref.current) clearTimeout(ref.current);
    ref.current = setTimeout(() => updateParams({ [field]: value || undefined }), 300);
  }

  function clearAll() {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (hospitalDebounceRef.current) clearTimeout(hospitalDebounceRef.current);
    setSearchInput("");
    setHospitalInput("");
    const params = new URLSearchParams();
    const statusParam = searchParams.get("status");
    if (statusParam) params.set("status", statusParam); // tabs stay as they are
    router.push(params.toString() ? `${pathname}?${params.toString()}` : pathname);
  }

  const chips: { key: string; label: string }[] = [];
  if (q) chips.push({ key: "q", label: `Search: "${q}"` });
  if (owner !== "all") {
    const ownerLabel = owner === "mct" ? "MCT (direct)" : partners.find((p) => `partner:${p.id}` === owner)?.name || "Partner";
    chips.push({ key: "owner", label: `Owner: ${ownerLabel}` });
  }
  if (treatment) chips.push({ key: "treatment", label: `Treatment: ${treatment}` });
  if (hospital) chips.push({ key: "hospital", label: `Hospital: ${hospital}` });
  if (source) chips.push({ key: "source", label: `Form / Page: ${source}` });
  if (country) chips.push({ key: "country", label: `Country: ${country}` });
  if (acqSource) chips.push({ key: "acqSource", label: `Source: ${acqSource}` });
  if (dateFrom || dateTo) chips.push({ key: "registered", label: `Registered: ${dateFrom || "…"} – ${dateTo || "…"}` });
  if (confirmedFrom || confirmedTo) chips.push({ key: "confirmed", label: `Confirmed: ${confirmedFrom || "…"} – ${confirmedTo || "…"}` });

  function removeChip(key: string) {
    if (key === "registered") {
      updateParams({ dateFrom: undefined, dateTo: undefined });
    } else if (key === "confirmed") {
      updateParams({ confirmedFrom: undefined, confirmedTo: undefined });
    } else if (key === "q") {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      setSearchInput("");
      updateParams({ q: undefined });
    } else if (key === "hospital") {
      if (hospitalDebounceRef.current) clearTimeout(hospitalDebounceRef.current);
      setHospitalInput("");
      updateParams({ hospital: undefined });
    } else {
      updateParams({ [key]: undefined });
    }
  }

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4 mb-6 space-y-3">
      <input
        value={searchInput}
        onChange={(e) => debounced(debounceRef, "q", e.target.value, setSearchInput)}
        placeholder="Search name, email, phone, or reference code..."
        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-sm text-gray-700"
      />

      <div className="flex flex-wrap gap-3">
        <select value={owner} onChange={(e) => updateParams({ owner: e.target.value === "all" ? undefined : e.target.value })} className={SELECT_CLASS}>
          <option value="all">All owners</option>
          <option value="mct">MCT (direct)</option>
          {partners.map((p) => (
            <option key={p.id} value={`partner:${p.id}`}>
              {p.name}
            </option>
          ))}
        </select>
        <select value={treatment} onChange={(e) => updateParams({ treatment: e.target.value || undefined })} className={SELECT_CLASS}>
          <option value="">All treatments</option>
          {treatmentOptions.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <input
          value={hospitalInput}
          onChange={(e) => debounced(hospitalDebounceRef, "hospital", e.target.value, setHospitalInput)}
          placeholder="Hospital"
          className="bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-sm text-gray-700 w-40"
        />
        <select value={source} onChange={(e) => updateParams({ source: e.target.value || undefined })} className={SELECT_CLASS}>
          <option value="">All forms / pages</option>
          {sourceOptions.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select value={country} onChange={(e) => updateParams({ country: e.target.value || undefined })} className={SELECT_CLASS}>
          <option value="">All countries</option>
          {countryOptions.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select value={acqSource} onChange={(e) => updateParams({ acqSource: e.target.value || undefined })} className={SELECT_CLASS}>
          <option value="">All sources</option>
          {acqSourceOptions.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-gray-50">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mr-1">Registered</span>
        <input type="date" value={dateFrom} onChange={(e) => updateParams({ dateFrom: e.target.value || undefined })} className={SELECT_CLASS} />
        <span className="text-gray-300 text-xs">to</span>
        <input type="date" value={dateTo} onChange={(e) => updateParams({ dateTo: e.target.value || undefined })} className={SELECT_CLASS} />
        {(["today", "7d", "30d", "month"] as const).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => {
              const range = quickRange(key);
              updateParams({ dateFrom: range.from, dateTo: range.to });
            }}
            className="px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-100 text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
          >
            {key === "today" ? "Today" : key === "7d" ? "Last 7 days" : key === "30d" ? "Last 30 days" : "This month"}
          </button>
        ))}

        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mr-1 ml-4">Confirmed</span>
        <input
          type="date"
          value={confirmedFrom}
          onChange={(e) => updateParams({ confirmedFrom: e.target.value || undefined })}
          className={SELECT_CLASS}
        />
        <span className="text-gray-300 text-xs">to</span>
        <input type="date" value={confirmedTo} onChange={(e) => updateParams({ confirmedTo: e.target.value || undefined })} className={SELECT_CLASS} />
      </div>

      <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-semibold text-gray-600">
            {resultCount} patient{resultCount !== 1 ? "s" : ""}
          </span>
          {chips.map((chip) => (
            <span key={chip.key} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-700">
              {chip.label}
              <button type="button" onClick={() => removeChip(chip.key)} aria-label={`Remove ${chip.label} filter`} className="hover:text-teal-900">
                ×
              </button>
            </span>
          ))}
        </div>
        {chips.length > 0 && (
          <button type="button" onClick={clearAll} className="text-xs font-semibold text-gray-400 hover:text-gray-600 transition-colors">
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}
