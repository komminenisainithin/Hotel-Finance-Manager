import { isAxiosError } from "axios";

import axiosInstance from "../axiosInstance";
import { formatInr, type SalesRecord } from "./sales";
import type { PurchaseRecord } from "./purchases";
import type { ExpenseRecord } from "./expenses";

export type DashboardFilter =
  | "all"
  | "today"
  | "weekly"
  | "monthly"
  | "yearly"
  | "custom";

export type DashboardTotals = {
  sales: number;
  purchases: number;
  expenses: number;
  profit: number;
};

export type DashboardCounts = {
  sales: number;
  purchases: number;
  expenses: number;
};

export type DashboardRecent = {
  sales: SalesRecord[];
  purchases: PurchaseRecord[];
  expenses: ExpenseRecord[];
};

export type DashboardData = {
  filter: DashboardFilter;
  totals: DashboardTotals;
  counts: DashboardCounts;
  recent: DashboardRecent;
};

export type DashboardApiResponse = {
  success: boolean;
  message: string;
  status: number;
  data: DashboardData;
};

type ApiErrorBody = {
  message?: string;
};

export type GetDashboardParams = {
  filter?: DashboardFilter;
  startDate?: string;
  endDate?: string;
};

export { formatInr };

export const getDashboard = async (
  options: GetDashboardParams = {},
): Promise<DashboardApiResponse> => {
  const { filter, startDate, endDate } = options;
  const params: Record<string, string> = {};
  if (filter && filter !== "all") params.filter = filter;
  if (filter === "custom") {
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
  }

  try {
    const response = await axiosInstance.get<DashboardApiResponse>(
      "/dashboard",
      Object.keys(params).length ? { params } : undefined,
    );
    return response.data;
  } catch (error) {
    if (isAxiosError<ApiErrorBody>(error)) {
      const message =
        error.response?.data?.message ??
        (error.response?.status === 401
          ? "Please log in to view the dashboard"
          : error.message);
      throw new Error(message);
    }
    throw error;
  }
};
