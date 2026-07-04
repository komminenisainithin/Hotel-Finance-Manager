import { isAxiosError } from "axios";

import axiosInstance from "../axiosInstance";

export type UserRecord = {
  _id: string;
  name: string;
  email: string;
  mobile: string;
  createdAt: string;
  updatedAt: string;
};

export type AuthApiResponse<T = UserRecord> = {
  success: boolean;
  message: string;
  status: number;
  data?: T;
};

export type UpdateUserPayload = {
  name: string;
  mobile: string;
};

export type UpdatePasswordPayload = {
  oldPassword: string;
  newPassword: string;
};

type ApiErrorBody = {
  message?: string;
};

export const getUser = async (): Promise<AuthApiResponse> => {
  try {
    const response = await axiosInstance.get<AuthApiResponse>("/auth/getUser");
    return response.data;
  } catch (error) {
    if (isAxiosError<ApiErrorBody>(error)) {
      throw new Error(
        error.response?.data?.message ??
          (error.response?.status === 401
            ? "Please log in to view your profile"
            : error.message),
      );
    }
    throw error;
  }
};

export const updateUser = async (
  payload: UpdateUserPayload,
): Promise<AuthApiResponse> => {
  try {
    const response = await axiosInstance.put<AuthApiResponse>(
      "/auth/updateUser",
      payload,
    );
    return response.data;
  } catch (error) {
    if (isAxiosError<ApiErrorBody>(error)) {
      throw new Error(
        error.response?.data?.message ??
          (error.response?.status === 401
            ? "Please log in to update your profile"
            : error.message),
      );
    }
    throw error;
  }
};

export const updatePassword = async (
  payload: UpdatePasswordPayload,
): Promise<AuthApiResponse> => {
  try {
    const response = await axiosInstance.put<AuthApiResponse>(
      "/auth/updatePassword",
      payload,
    );
    return response.data;
  } catch (error) {
    if (isAxiosError<ApiErrorBody>(error)) {
      throw new Error(
        error.response?.data?.message ??
          (error.response?.status === 401
            ? "Please log in to change your password"
            : error.message),
      );
    }
    throw error;
  }
};

export const logoutUser = async (): Promise<AuthApiResponse> => {
  try {
    const response = await axiosInstance.post<AuthApiResponse>("/auth/logout");
    return response.data;
  } catch (error) {
    if (isAxiosError<ApiErrorBody>(error)) {
      throw new Error(
        error.response?.data?.message ?? error.message,
      );
    }
    throw error;
  }
};
