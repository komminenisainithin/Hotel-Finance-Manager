"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type {
  DashboardData,
  DashboardFilter,
} from "@/app/lib/apis/dashboard";

type DashboardContextValue = {
  filter: DashboardFilter;
  startDate?: string;
  endDate?: string;
  setRange: (next: {
    filter: DashboardFilter;
    startDate?: string;
    endDate?: string;
  }) => void;
  data: DashboardData | null;
  setData: (data: DashboardData | null) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
};

const DashboardContext = createContext<DashboardContextValue | null>(null);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [filter, setFilter] = useState<DashboardFilter>("all");
  const [startDate, setStartDate] = useState<string | undefined>();
  const [endDate, setEndDate] = useState<string | undefined>();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const setRange = useCallback(
    (next: {
      filter: DashboardFilter;
      startDate?: string;
      endDate?: string;
    }) => {
      setFilter(next.filter);
      setStartDate(next.startDate);
      setEndDate(next.endDate);
    },
    [],
  );

  const value = useMemo(
    () => ({
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
    }),
    [filter, startDate, endDate, setRange, data, loading, error],
  );

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) {
    throw new Error("useDashboard must be used within DashboardProvider");
  }
  return ctx;
}
