"use client";

import { useEffect, useState } from "react";
import { CalendarRange, X } from "lucide-react";

export type DateFilterPreset =
  | "all"
  | "today"
  | "weekly"
  | "monthly"
  | "yearly"
  | "custom";

export type DateRangeValue = {
  preset: DateFilterPreset;
  startDate?: string;
  endDate?: string;
};

type Props = {
  value: DateRangeValue;
  onChange: (next: DateRangeValue) => void;
  /** Shown under the title when no range is active */
  emptyLabel?: string;
  /** card = full-width bar (sales/expenses); inline = compact header (dashboard) */
  variant?: "card" | "inline";
};

const PILLS: { id: DateFilterPreset; label: string }[] = [
  { id: "all", label: "All" },
  { id: "today", label: "Today" },
  { id: "weekly", label: "Week" },
  { id: "monthly", label: "Month" },
  { id: "yearly", label: "Year" },
  { id: "custom", label: "Custom" },
];

const PRESET_LABELS: Record<DateFilterPreset, string> = {
  all: "All time",
  today: "Today",
  weekly: "This week",
  monthly: "This month",
  yearly: "This year",
  custom: "Custom range",
};

function toYmd(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Resolve preset → concrete dates (for list APIs that only take start/end). */
export function resolvePresetDates(
  preset: DateFilterPreset,
  startDate?: string,
  endDate?: string,
): { startDate?: string; endDate?: string } {
  if (preset === "all") return {};
  if (preset === "custom") {
    return startDate && endDate ? { startDate, endDate } : {};
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const end = toYmd(today);
  const start = new Date(today);

  if (preset === "today") {
    return { startDate: end, endDate: end };
  }
  if (preset === "weekly") {
    const day = start.getDay();
    const mondayOffset = day === 0 ? -6 : 1 - day;
    start.setDate(start.getDate() + mondayOffset);
    return { startDate: toYmd(start), endDate: end };
  }
  if (preset === "monthly") {
    start.setDate(1);
    return { startDate: toYmd(start), endDate: end };
  }
  // yearly
  start.setMonth(0, 1);
  return { startDate: toYmd(start), endDate: end };
}

function rangeSummary(value: DateRangeValue, emptyLabel: string) {
  if (value.preset === "custom" && value.startDate && value.endDate) {
    return `${value.startDate} → ${value.endDate}`;
  }
  if (value.preset === "all") return emptyLabel;
  return PRESET_LABELS[value.preset];
}

export default function DateRangeFilter({
  value,
  onChange,
  emptyLabel = "Showing all records",
  variant = "card",
}: Props) {
  const [draftStart, setDraftStart] = useState(value.startDate ?? "");
  const [draftEnd, setDraftEnd] = useState(value.endDate ?? "");
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    setDraftStart(value.startDate ?? "");
    setDraftEnd(value.endDate ?? "");
  }, [value.startDate, value.endDate]);

  function handlePill(preset: DateFilterPreset) {
    setLocalError(null);
    if (preset === "custom") {
      onChange({
        preset: "custom",
        startDate: value.startDate,
        endDate: value.endDate,
      });
      return;
    }
    if (preset === "all") {
      setDraftStart("");
      setDraftEnd("");
      onChange({ preset: "all" });
      return;
    }
    const resolved = resolvePresetDates(preset);
    setDraftStart(resolved.startDate ?? "");
    setDraftEnd(resolved.endDate ?? "");
    onChange({ preset, ...resolved });
  }

  function handleApply() {
    if (!draftStart || !draftEnd) {
      setLocalError("Pick both start and end dates");
      return;
    }
    if (new Date(draftStart).getTime() > new Date(draftEnd).getTime()) {
      setLocalError("Start date must be on or before end date");
      return;
    }
    setLocalError(null);
    onChange({
      preset: "custom",
      startDate: draftStart,
      endDate: draftEnd,
    });
  }

  function handleClear() {
    setLocalError(null);
    setDraftStart("");
    setDraftEnd("");
    onChange({ preset: "all" });
  }

  const showCustom = value.preset === "custom";
  const showClear =
    value.preset !== "all" || Boolean(draftStart || draftEnd);

  const pills = (
    <div
      role="tablist"
      aria-label="Time range"
      className="flex flex-wrap gap-1 rounded-xl bg-gray-100 p-1"
    >
      {PILLS.map((pill) => {
        const active = value.preset === pill.id;
        return (
          <button
            key={pill.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => handlePill(pill.id)}
            className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${
              active
                ? "bg-white text-[#132745] shadow-sm"
                : "text-[#6B7C93] hover:text-[#132745]"
            }`}
          >
            {pill.id === "custom" && (
              <CalendarRange className="h-3.5 w-3.5" />
            )}
            {pill.label}
          </button>
        );
      })}
    </div>
  );

  const customControls = showCustom && (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-2.5 py-1.5">
        <input
          type="date"
          aria-label="Start date"
          value={draftStart}
          autoComplete="off"
          onChange={(e) => setDraftStart(e.target.value)}
          className={`min-w-0 border-0 bg-transparent text-sm outline-none focus:ring-0 ${
            draftStart ? "text-[#132745]" : "text-[#6B7C93]"
          }`}
        />
        <span className="text-xs font-medium text-[#6B7C93]">to</span>
        <input
          type="date"
          aria-label="End date"
          value={draftEnd}
          autoComplete="off"
          onChange={(e) => setDraftEnd(e.target.value)}
          className={`min-w-0 border-0 bg-transparent text-sm outline-none focus:ring-0 ${
            draftEnd ? "text-[#132745]" : "text-[#6B7C93]"
          }`}
        />
      </div>
      <button
        type="button"
        onClick={handleApply}
        className="rounded-xl bg-[#E96B2E] px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-[#D45A1F]"
      >
        Apply
      </button>
      {showClear && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear date filter"
          className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-[#6B7C93] transition hover:bg-gray-50 hover:text-[#132745]"
        >
          <X className="h-3.5 w-3.5" />
          Clear
        </button>
      )}
      {localError && (
        <p className="w-full text-xs text-red-600">{localError}</p>
      )}
    </div>
  );

  if (variant === "inline") {
    return (
      <div className="flex flex-col items-stretch gap-2 sm:items-end">
        {pills}
        {customControls}
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-3 shadow-sm sm:px-4 sm:py-3">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#E96B2E]/10">
            <CalendarRange className="h-4 w-4 text-[#E96B2E]" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[#132745]">Date range</p>
            <p className="text-xs text-[#6B7C93]">
              {rangeSummary(value, emptyLabel)}
            </p>
          </div>
        </div>
        {pills}
      </div>
      {customControls && <div className="mt-3">{customControls}</div>}
    </div>
  );
}
