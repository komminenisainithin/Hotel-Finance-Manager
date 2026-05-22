"use client";

import { useCallback, useEffect, useState } from "react";

import FilterBar from "@/app/components/dashboard/FilterBar";
import KpiCards from "@/app/components/dashboard/KpiCards";
import OverviewChart from "@/app/components/dashboard/OverviewChart";
import RecentActivity from "@/app/components/dashboard/RecentActivity";
import { useAuth } from "@/app/context/AuthContext";
import {
  getDashboard,
  type DashboardData,
  type DashboardFilter,
} from "@/app/lib/apis/dashboard";

const FILTER_LABELS: Record<DashboardFilter, string> = {
  all: "All time",
  today: "Today",
  weekly: "This week",
  monthly: "This month",
  yearly: "This year",
  custom: "Custom range",
};

function KpiSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, idx) => (
        <div
          key={idx}
          className="h-[112px] animate-pulse rounded-2xl border border-gray-200 bg-gray-100/60"
        />
      ))}
    </div>
  );
}

function PanelSkeleton({ height = 260 }: { height?: number }) {
  return (
    <div
      className="animate-pulse rounded-2xl border border-gray-200 bg-gray-100/60"
      style={{ height }}
    />
  );
}

export default function DashboardPage() {
  const { token, loading: authLoading } = useAuth();
  const [filter, setFilter] = useState<DashboardFilter>("all");
  const [startDate, setStartDate] = useState<string | undefined>();
  const [endDate, setEndDate] = useState<string | undefined>();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = useCallback(() => {
    setLoading(true);
    setError(null);
    getDashboard({ filter, startDate, endDate })
      .then((res) => {
        if (res.success && res.data) {
          setData(res.data);
        } else {
          setError(res.message ?? "Failed to load dashboard");
        }
      })
      .catch((err: unknown) =>
        setError(
          err instanceof Error ? err.message : "Failed to load dashboard",
        ),
      )
      .finally(() => setLoading(false));
  }, [filter, startDate, endDate]);

  useEffect(() => {
    if (authLoading || !token) return;
    if (filter === "custom" && (!startDate || !endDate)) return;
    fetchDashboard();
  }, [token, authLoading, filter, startDate, endDate, fetchDashboard]);

  const customWaiting =
    filter === "custom" && (!startDate || !endDate);

  return (
    <div className="w-full">
      <div className="flex flex-col gap-3 border-b border-gray-200 px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-lg font-medium text-gray-900">Dashboard</h1>
          <p className="text-xs text-gray-500">
            {FILTER_LABELS[filter]}
            {filter === "custom" && startDate && endDate && (
              <span className="ml-1 text-gray-400">
                · {startDate} → {endDate}
              </span>
            )}
          </p>
        </div>
        <FilterBar
          filter={filter}
          startDate={startDate}
          endDate={endDate}
          onChange={(next) => {
            setFilter(next.filter);
            setStartDate(next.startDate);
            setEndDate(next.endDate);
          }}
        />
      </div>

      <div className="flex flex-col gap-5 p-4">
        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        {customWaiting && !data && (
          <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
            Pick a start and end date, then press Apply to load the dashboard.
          </div>
        )}

        {loading || !data ? (
          <>
            <KpiSkeleton />
            <PanelSkeleton height={260} />
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              <PanelSkeleton height={280} />
              <PanelSkeleton height={280} />
              <PanelSkeleton height={280} />
            </div>
          </>
        ) : (
          <>
            <KpiCards totals={data.totals} counts={data.counts} />
            <OverviewChart totals={data.totals} />
            <RecentActivity recent={data.recent} />
          </>
        )}
      </div>
    </div>
  );
}
