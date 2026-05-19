import { isAxiosError } from "axios";

import axiosInstance from "../axiosInstance";

export type SalesRecord = {
  _id: string;
  salesId: number;
  userId: string;
  morning: number;
  evening: number;
  date: string;
  createdAt: string;
  updatedAt: string;
  total: number;
  __v: number;
};

export type SalesApiResponse = {
  success: boolean;
  message: string;
  status: number;
  data: SalesRecord[];
};

export const MORNING_COLOR = "#378ADD";
export const EVENING_COLOR = "#EF9F27";
export const TOTAL_COLOR = "#1D9E75";

type ApiErrorBody = {
  message?: string;
};

export const formatInr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

export const sortSalesByDate = (records: SalesRecord[]) =>
  [...records].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

export type SalesChartPoint = {
  label: string;
  date: string;
  total: number;
  morning: number;
  evening: number;
  salesId: number;
};

export const toSalesChartData = (records: SalesRecord[]): SalesChartPoint[] =>
  sortSalesByDate(records).map((record) => ({
    label: `${new Date(record.date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
    })} #${record.salesId}`,
    date: new Date(record.date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
    total: record.total,
    morning: record.morning,
    evening: record.evening,
    salesId: record.salesId,
  }));

export type SalesMetrics = {
  totalMorning: number;
  totalEvening: number;
  grandTotal: number;
  avgPerDay: number;
};

export const computeSalesMetrics = (records: SalesRecord[]): SalesMetrics => {
  const totalMorning = records.reduce((sum, r) => sum + r.morning, 0);
  const totalEvening = records.reduce((sum, r) => sum + r.evening, 0);
  const grandTotal = records.reduce((sum, r) => sum + r.total, 0);
  const avgPerDay = records.length
    ? Math.round(grandTotal / records.length)
    : 0;

  return { totalMorning, totalEvening, grandTotal, avgPerDay };
};

export type CreateSalePayload = {
  morning: number;
  evening: number;
  date: string;
};

export type CreateSaleResponse = {
  success: boolean;
  message: string;
  status: number;
  data?: SalesRecord;
};

export const createSale = async (
  payload: CreateSalePayload,
): Promise<CreateSaleResponse> => {
  try {
    const response =
      await axiosInstance.post<CreateSaleResponse>("/sales", payload);
    return response.data;
  } catch (error) {
    if (isAxiosError<ApiErrorBody>(error)) {
      const message =
        error.response?.data?.message ??
        (error.response?.status === 401
          ? "Please log in to create a sale"
          : error.message);
      throw new Error(message);
    }
    throw error;
  }
};

export const updateSale = async (
  salesId: number,
  payload: CreateSalePayload,
): Promise<CreateSaleResponse> => {
  try {
    const response = await axiosInstance.put<CreateSaleResponse>(
      `/sales/${salesId}`,
      payload,
    );
    return response.data;
  } catch (error) {
    if (isAxiosError<ApiErrorBody>(error)) {
      const message =
        error.response?.data?.message ??
        (error.response?.status === 401
          ? "Please log in to update a sale"
          : error.message);
      throw new Error(message);
    }
    throw error;
  }
};

export const deleteSale = async (salesId: number): Promise<CreateSaleResponse> => {
  try {
    const response = await axiosInstance.delete<CreateSaleResponse>(`/sales/${salesId}`);
    return response.data;
  } catch (error) {
    if (isAxiosError<ApiErrorBody>(error)) {
      const message =
        error.response?.data?.message ??
        (error.response?.status === 401
          ? "Please log in to delete a sale"
          : error.message);
      throw new Error(message);
    }
    throw error;
  }
};

export const getSales = async (): Promise<SalesApiResponse> => {
  try {
    const response = await axiosInstance.get<SalesApiResponse>("/sales");
    return response.data;
  } catch (error) {
    if (isAxiosError<ApiErrorBody>(error)) {
      const message =
        error.response?.data?.message ??
        (error.response?.status === 401
          ? "Please log in to view sales"
          : error.message);
      throw new Error(message);
    }
    throw error;
  }
};
