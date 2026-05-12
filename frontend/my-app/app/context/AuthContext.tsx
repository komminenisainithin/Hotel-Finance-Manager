"use client";

import { isAxiosError } from "axios";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import axiosInstance from "../utils/axiosInstance";
import { AUTH_TOKEN_KEY, AUTH_USER_KEY } from "../lib/authStorage";

export type LoginResult =
  | { ok: true }
  | { ok: false; message: string };

type AuthUser = Record<string, unknown>;

type AuthContextValue = {
  token: string | null;
  user: AuthUser | null;
  isReady: boolean;
  login: (email: string, password: string) => Promise<LoginResult>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      try {
        const storedToken = localStorage.getItem(AUTH_TOKEN_KEY);
        const storedUser = localStorage.getItem(AUTH_USER_KEY);
        if (storedToken) setToken(storedToken);
        if (storedUser) setUser(JSON.parse(storedUser) as AuthUser);
      } catch {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        localStorage.removeItem(AUTH_USER_KEY);
      } finally {
        setIsReady(true);
      }
    });
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const { data } = await axiosInstance.post<{
        success?: boolean;
        message?: string;
        token?: string;
        data?: AuthUser;
      }>("/auth/login", { email, password });
      if (data.success && data.token) {
        localStorage.setItem(AUTH_TOKEN_KEY, data.token);
        if (data.data) {
          localStorage.setItem(AUTH_USER_KEY, JSON.stringify(data.data));
          setUser(data.data);
        } else {
          localStorage.removeItem(AUTH_USER_KEY);
          setUser(null);
        }
        setToken(data.token);
        return { ok: true as const };
      }
      const message = data.message ?? "Login failed";
      return { ok: false as const, message };
    } catch (err: unknown) {
      let message = "Login failed";
      if (isAxiosError(err)) {
        const body = err.response?.data as { message?: string } | undefined;
        message = body?.message ?? err.message ?? message;
      } else if (err instanceof Error) {
        message = err.message;
      }
      return { ok: false as const, message };
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      user,
      isReady,
      login,
      logout,
    }),
    [token, user, isReady, login, logout]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
