"use client";

import Image from "next/image";
import { useEffect } from "react";

import DateRangeFilter from "@/app/components/DateRangeFilter";
import { useDashboard } from "@/app/components/dashboard/DashboardContext";
import KpiCards from "@/app/components/dashboard/KpiCards";
import OverviewChart from "@/app/components/dashboard/OverviewChart";
import { useAuth } from "@/app/context/AuthContext";
import {
  getDashboard,
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
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
      {Array.from({ length: 4 }).map((_, idx) => (
        <div
          key={idx}
          className="h-[112px] animate-pulse rounded-2xl border border-gray-200/80 bg-white"
        />
      ))}
    </div>
  );
}

function ChartSkeleton() {
  return (
    <div className="h-[320px] animate-pulse rounded-2xl border border-gray-200/80 bg-white" />
  );
}

export default function DashboardPage() {
  const { token, loading: authLoading } = useAuth();
  const {
    filter,
    startDate,
    endDate,
    setRange,
    data,
    setData,
    loading,
    setLoading,
    error,
    setError,
  } = useDashboard();

  useEffect(() => {
    if (authLoading || !token) return;
    if (filter === "custom" && (!startDate || !endDate)) return;

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
  }, [
    token,
    authLoading,
    filter,
    startDate,
    endDate,
    setData,
    setLoading,
    setError,
  ]);

  const customWaiting = filter === "custom" && (!startDate || !endDate);

  const rangeLabel =
    filter === "custom" && startDate && endDate
      ? `${startDate} → ${endDate}`
      : FILTER_LABELS[filter];

  return (
    <>
      {/* Mobile-only brand bar — desktop keeps logo in the sidebar */}
      <div className="flex items-center border-b border-gray-200 bg-white px-4 py-3 lg:hidden">
        <Image
          src="/logo2.svg"
          alt="Tiffin Books"
          width={148}
          height={44}
          priority
          unoptimized
          className="h-9 w-auto"
        />
      </div>

      <header className="border-b border-gray-200 bg-white px-4 py-4 lg:px-6">
        <div className="min-w-0">
          <h1 className="text-xl font-semibold tracking-tight text-[#132745]">
            Dashboard
          </h1>
          <p className="mt-0.5 text-sm text-[#6B7C93]">
            Overview for{" "}
            <span className="font-medium text-[#1F3A5F]">{rangeLabel}</span>
          </p>
        </div>
      </header>

      <div className="px-4 pt-4 lg:px-6">
        <DateRangeFilter
          value={{
            preset: filter,
            startDate,
            endDate,
          }}
          onChange={(next) =>
            setRange({
              filter: next.preset,
              startDate: next.startDate,
              endDate: next.endDate,
            })
          }
          emptyLabel="Showing all time"
        />
      </div>

      <div className="flex flex-col gap-5 p-4 lg:p-6">
        {error && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-sm text-rose-700">
            {error}
          </div>
        )}

        {customWaiting && !data && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-2.5 text-sm text-amber-900">
            Pick a start and end date, then press Apply to load the dashboard.
          </div>
        )}

        {loading || !data ? (
          <>
            <KpiSkeleton />
            <ChartSkeleton />
          </>
        ) : (
          <>
            <KpiCards totals={data.totals} counts={data.counts} />
            <OverviewChart totals={data.totals} />
          </>
        )}
      </div>
    </>
  );
}
