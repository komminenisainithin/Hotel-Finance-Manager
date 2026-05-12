import axios from "axios";
import { AUTH_TOKEN_KEY } from "../lib/authStorage";

const baseURL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

const axiosInstance = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json",
    accept: "application/json",
   },
});

axiosInstance.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default axiosInstance;
