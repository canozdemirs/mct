"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { REFERRAL_STATUSES, REFERRAL_STATUS_LABELS } from "@/types";

type DateRangeKey = "today" | "7d" | "30d" | "month" | "custom";

const DATE_RANGE_LABELS: Record<DateRangeKey, string> = {
  today: "Today",
  "7d": "Last 7 days",
  "30d": "Last 30 days",
  month: "This month",
  custom: "Custom range",
};

const SELECT_CLASS = "bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-sm text-gray-700";

// All filter state lives in the URL (?q=&owner=&treatment=&status=&
// channel=&dateRange=&dateFrom=&dateTo=&sort=&dir=) so it survives a
// refresh and stays shareable -- this component only ever reads
// useSearchParams() and pushes updates back to it, it never holds its
// own source of truth besides the debounced search input (which needs
// local state so typing doesn't feel like it's fighting a server round
// trip on every keystroke).
export function PatientsFilters({
  treatmentOptions,
  partners,
  channelOptions,
  resultCount,
}: {
  treatmentOptions: string[];
  partners: { id: string; name: string }[];
  channelOptions: string[];
  resultCount: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const q = searchParams.get("q") || "";
  const owner = searchParams.get("owner") || "all";
  const treatment = searchParams.get("treatment") || "";
  const status = searchParams.get("status") || "all";
  const channel = searchParams.get("channel") || "";
  const dateRange = searchParams.get("dateRange") || "";
  const dateFrom = searchParams.get("dateFrom") || "";
  const dateTo = searchParams.get("dateTo") || "";

  const [searchInput, setSearchInput] = useState(q);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Keeps the box in sync when the URL changes from elsewhere (e.g. a
  // chip removal or "Clear filters"), without fighting the debounce
  // timer for ordinary typing.
  useEffect(() => {
    setSearchInput(q);
  }, [q]);

  function updateParams(updates: Record<string, string | undefined>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value) params.set(key, value);
      else params.delete(key);
    }
    router.push(params.toString() ? `${pathname}?${params.toString()}` : pathname);
  }

  function handleSearchChange(value: string) {
    setSearchInput(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => updateParams({ q: value || undefined }), 300);
  }

  function clearAll() {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setSearchInput("");
    router.push(pathname);
  }

  const chips: { key: string; label: string }[] = [];
  if (q) chips.push({ key: "q", label: `Search: "${q}"` });
  if (owner !== "all") {
    const ownerLabel = owner === "mct" ? "MCT (direct)" : partners.find((p) => `partner:${p.id}` === owner)?.name || "Partner";
    chips.push({ key: "owner", label: `Owner: ${ownerLabel}` });
  }
  if (treatment) chips.push({ key: "treatment", label: `Treatment: ${treatment}` });
  if (status !== "all") {
    chips.push({ key: "status", label: `Status: ${REFERRAL_STATUS_LABELS[status as keyof typeof REFERRAL_STATUS_LABELS] ?? status}` });
  }
  if (channel) chips.push({ key: "channel", label: `Channel: ${channel}` });
  if (dateRange) {
    const label =
      dateRange === "custom"
        ? `Registered: ${dateFrom || "…"} – ${dateTo || "…"}`
        : `Registered: ${DATE_RANGE_LABELS[dateRange as DateRangeKey] ?? dateRange}`;
    chips.push({ key: "dateRange", label });
  }

  function removeChip(key: string) {
    if (key === "dateRange") {
      updateParams({ dateRange: undefined, dateFrom: undefined, dateTo: undefined });
    } else if (key === "q") {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      setSearchInput("");
      updateParams({ q: undefined });
    } else {
      updateParams({ [key]: undefined });
    }
  }

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4 mb-6 space-y-3">
      <div className="flex flex-wrap gap-3">
        <input
          value={searchInput}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Search name, email, phone, or reference code..."
          className="flex-1 min-w-[240px] bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-sm text-gray-700"
        />
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
        <select value={status} onChange={(e) => updateParams({ status: e.target.value === "all" ? undefined : e.target.value })} className={SELECT_CLASS}>
          <option value="all">All statuses</option>
          {REFERRAL_STATUSES.map((s) => (
            <option key={s} value={s}>
              {REFERRAL_STATUS_LABELS[s]}
            </option>
          ))}
        </select>
        <select value={channel} onChange={(e) => updateParams({ channel: e.target.value || undefined })} className={SELECT_CLASS}>
          <option value="">All channels</option>
          {channelOptions.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          value={dateRange}
          onChange={(e) => {
            const value = e.target.value;
            if (value === "custom") updateParams({ dateRange: "custom" });
            else updateParams({ dateRange: value || undefined, dateFrom: undefined, dateTo: undefined });
          }}
          className={SELECT_CLASS}
        >
          <option value="">Any Registered Date</option>
          <option value="today">Today</option>
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="month">This month</option>
          <option value="custom">Custom range</option>
        </select>
        {dateRange === "custom" && (
          <>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => updateParams({ dateFrom: e.target.value || undefined })}
              className={SELECT_CLASS}
            />
            <input
              type="date"
              value={dateTo}
              onChange={(e) => updateParams({ dateTo: e.target.value || undefined })}
              className={SELECT_CLASS}
            />
          </>
        )}
      </div>

      <div className="flex items-center justify-between flex-wrap gap-2">
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
