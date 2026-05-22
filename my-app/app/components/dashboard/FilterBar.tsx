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
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-1.5">
        {PILLS.map((pill) => {
          const active = filter === pill.id;
          return (
            <button
              key={pill.id}
              type="button"
              onClick={() => handlePill(pill.id)}
              className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
                active
                  ? "bg-[#185FA5] text-white shadow-sm"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {pill.id === "custom" && <CalendarRange className="h-3.5 w-3.5" />}
              {pill.label}
            </button>
          );
        })}
      </div>

      {filter === "custom" && (
        <div className="flex flex-wrap items-end gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2.5">
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-medium uppercase tracking-wide text-gray-500">
              Start
            </label>
            <input
              type="date"
              value={draftStart}
              onChange={(e) => setDraftStart(e.target.value)}
              className="rounded-md border border-gray-300 px-2.5 py-1.5 text-sm outline-none focus:border-[#185FA5] focus:ring-1 focus:ring-[#185FA5]"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-medium uppercase tracking-wide text-gray-500">
              End
            </label>
            <input
              type="date"
              value={draftEnd}
              onChange={(e) => setDraftEnd(e.target.value)}
              className="rounded-md border border-gray-300 px-2.5 py-1.5 text-sm outline-none focus:border-[#185FA5] focus:ring-1 focus:ring-[#185FA5]"
            />
          </div>
          <button
            type="button"
            onClick={handleApply}
            className="rounded-md bg-[#185FA5] px-3.5 py-1.5 text-sm font-medium text-white hover:bg-[#0C447C]"
          >
            Apply
          </button>
          {localError && (
            <p className="w-full text-xs text-red-600">{localError}</p>
          )}
        </div>
      )}
    </div>
  );
}
