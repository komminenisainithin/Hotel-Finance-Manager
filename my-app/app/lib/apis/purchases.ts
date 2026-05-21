import { isAxiosError } from "axios";

import axiosInstance from "../axiosInstance";
import { formatInr } from "./sales";

export type PurchaseRecord = {
  _id: string;
  userId: string;
  amount: number;
  description: string;
  date: string;
  __v: number;
};

export type PurchasesApiResponse = {
  success: boolean;
  message: string;
  status: number;
  data: PurchaseRecord[];
};

export type PurchaseMutationResponse = {
  success: boolean;
  message: string;
  status: number;
  data?: PurchaseRecord;
};

export type CreatePurchasePayload = {
  amount: number;
  description: string;
  date: string;
};

type ApiErrorBody = {
  message?: string;
};

export { formatInr };

export const sortPurchasesByDate = (records: PurchaseRecord[]) =>
  [...records].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

export const createPurchase = async (
  payload: CreatePurchasePayload,
): Promise<PurchaseMutationResponse> => {
  try {
    const response = await axiosInstance.post<PurchaseMutationResponse>(
      "/purchases",
      payload,
    );
    return response.data;
  } catch (error) {
    if (isAxiosError<ApiErrorBody>(error)) {
      const message =
        error.response?.data?.message ??
        (error.response?.status === 401
          ? "Please log in to create a purchase"
          : error.message);
      throw new Error(message);
    }
    throw error;
  }
};

export const updatePurchase = async (
  id: string,
  payload: CreatePurchasePayload,
): Promise<PurchaseMutationResponse> => {
  try {
    const response = await axiosInstance.put<PurchaseMutationResponse>(
      `/purchases/${id}`,
      payload,
    );
    return response.data;
  } catch (error) {
    if (isAxiosError<ApiErrorBody>(error)) {
      const message =
        error.response?.data?.message ??
        (error.response?.status === 401
          ? "Please log in to update a purchase"
          : error.message);
      throw new Error(message);
    }
    throw error;
  }
};

export const deletePurchase = async (
  id: string,
): Promise<PurchaseMutationResponse> => {
  try {
    const response = await axiosInstance.delete<PurchaseMutationResponse>(
      `/purchases/${id}`,
    );
    return response.data;
  } catch (error) {
    if (isAxiosError<ApiErrorBody>(error)) {
      const message =
        error.response?.data?.message ??
        (error.response?.status === 401
          ? "Please log in to delete a purchase"
          : error.message);
      throw new Error(message);
    }
    throw error;
  }
};

export const getPurchases = async (): Promise<PurchasesApiResponse> => {
  try {
    const response =
      await axiosInstance.get<PurchasesApiResponse>("/purchases");
    return response.data;
  } catch (error) {
    if (isAxiosError<ApiErrorBody>(error)) {
      const message =
        error.response?.data?.message ??
        (error.response?.status === 401
          ? "Please log in to view purchases"
          : error.message);
      throw new Error(message);
    }
    throw error;
  }
};
