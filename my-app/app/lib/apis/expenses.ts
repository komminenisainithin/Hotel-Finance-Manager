import { isAxiosError } from "axios";

import axiosInstance from "../axiosInstance";
import { formatInr } from "./sales";

export type ExpenseRecord = {
  _id: string;
  userId: string;
  amount: number;
  purpose: string;
  date: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type ExpensesApiResponse = {
  success: boolean;
  message: string;
  status: number;
  data: ExpenseRecord[];
};

export type ExpenseMutationResponse = {
  success: boolean;
  message: string;
  status: number;
  data?: ExpenseRecord;
};

export type CreateExpensePayload = {
  amount: number;
  purpose: string;
  date: string;
};

type ApiErrorBody = {
  message?: string;
};

export { formatInr };

export const sortExpensesByDate = (records: ExpenseRecord[]) =>
  [...records].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

export const createExpense = async (
  payload: CreateExpensePayload,
): Promise<ExpenseMutationResponse> => {
  try {
    const response = await axiosInstance.post<ExpenseMutationResponse>(
      "/expenses",
      payload,
    );
    return response.data;
  } catch (error) {
    if (isAxiosError<ApiErrorBody>(error)) {
      const message =
        error.response?.data?.message ??
        (error.response?.status === 401
          ? "Please log in to create an expense"
          : error.message);
      throw new Error(message);
    }
    throw error;
  }
};

export const updateExpense = async (
  id: string,
  payload: CreateExpensePayload,
): Promise<ExpenseMutationResponse> => {
  try {
    const response = await axiosInstance.put<ExpenseMutationResponse>(
      `/expenses/${id}`,
      payload,
    );
    return response.data;
  } catch (error) {
    if (isAxiosError<ApiErrorBody>(error)) {
      const message =
        error.response?.data?.message ??
        (error.response?.status === 401
          ? "Please log in to update an expense"
          : error.message);
      throw new Error(message);
    }
    throw error;
  }
};

export const deleteExpense = async (
  id: string,
): Promise<ExpenseMutationResponse> => {
  try {
    const response = await axiosInstance.delete<ExpenseMutationResponse>(
      `/expenses/${id}`,
    );
    return response.data;
  } catch (error) {
    if (isAxiosError<ApiErrorBody>(error)) {
      const message =
        error.response?.data?.message ??
        (error.response?.status === 401
          ? "Please log in to delete an expense"
          : error.message);
      throw new Error(message);
    }
    throw error;
  }
};

export const getExpenseById = async (
  id: string,
): Promise<ExpenseMutationResponse> => {
  try {
    const response = await axiosInstance.get<ExpenseMutationResponse>(
      `/expenses/${id}`,
    );
    return response.data;
  } catch (error) {
    if (isAxiosError<ApiErrorBody>(error)) {
      const message =
        error.response?.data?.message ??
        (error.response?.status === 401
          ? "Please log in to view this expense"
          : error.message);
      throw new Error(message);
    }
    throw error;
  }
};

export const getExpenses = async (): Promise<ExpensesApiResponse> => {
  try {
    const response = await axiosInstance.get<ExpensesApiResponse>("/expenses");
    return response.data;
  } catch (error) {
    if (isAxiosError<ApiErrorBody>(error)) {
      const message =
        error.response?.data?.message ??
        (error.response?.status === 401
          ? "Please log in to view expenses"
          : error.message);
      throw new Error(message);
    }
    throw error;
  }
};
