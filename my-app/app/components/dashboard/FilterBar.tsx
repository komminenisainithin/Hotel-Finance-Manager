"use client";

import { useEffect, useState } from "react";
import { CalendarRange } from "lucide-react";

import type { DashboardFilter } from "@/app/lib/apis/dashboard";

type FilterValue = {
  filter: DashboardFilter;
  startDate?: string;
  endDate?: string;
};

type Props = {
  filter: DashboardFilter;
  startDate?: string;
  endDate?: string;
  onChange: (next: FilterValue) => void;
};

const PILLS: { id: DashboardFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "today", label: "Today" },
  { id: "weekly", label: "Week" },
  { id: "monthly", label: "Month" },
  { id: "yearly", label: "Year" },
  { id: "custom", label: "Custom" },
];

export default function FilterBar({
  filter,
  startDate,
  endDate,
  onChange,
}: Props) {
  const [draftStart, setDraftStart] = useState(startDate ?? "");
  const [draftEnd, setDraftEnd] = useState(endDate ?? "");
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    setDraftStart(startDate ?? "");
    setDraftEnd(endDate ?? "");
  }, [startDate, endDate]);

  function handlePill(next: DashboardFilter) {
    setLocalError(null);
    if (next === "custom") {
      onChange({ filter: "custom", startDate, endDate });
      return;
    }
    onChange({ filter: next });
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
      filter: "custom",
      startDate: draftStart,
      endDate: draftEnd,
    });
  }

  return (
    <div className="flex flex-col items-stretch gap-2 sm:items-end">
      <div
        role="tablist"
        aria-label="Time range"
        className="flex flex-wrap gap-1 rounded-lg bg-gray-100 p-1"
      >
        {PILLS.map((pill) => {
          const active = filter === pill.id;
          return (
            <button
              key={pill.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => handlePill(pill.id)}
              className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium transition ${
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

      {filter === "custom" && (
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5">
            <input
              type="date"
              aria-label="Start date"
              value={draftStart}
              onChange={(e) => setDraftStart(e.target.value)}
              className={`min-w-0 border-0 bg-transparent text-sm outline-none focus:ring-0 ${
                draftStart ? "text-[#132745]" : "text-[#6B7C93]"
              }`}
            />
            <span className="text-xs text-[#6B7C93]">–</span>
            <input
              type="date"
              aria-label="End date"
              value={draftEnd}
              onChange={(e) => setDraftEnd(e.target.value)}
              className={`min-w-0 border-0 bg-transparent text-sm outline-none focus:ring-0 ${
                draftEnd ? "text-[#132745]" : "text-[#6B7C93]"
              }`}
            />
          </div>
          <button
            type="button"
            onClick={handleApply}
            className="rounded-lg bg-[#E96B2E] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#D45A1F]"
          >
            Apply
          </button>
          {localError && (
            <p className="w-full text-xs text-red-600 sm:text-right">
              {localError}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
