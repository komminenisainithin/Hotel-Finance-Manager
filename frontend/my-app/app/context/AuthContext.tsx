"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";

import axiosInstance from "../lib/axiosInstance";

type User = {
  name: string;
  email: string;
  mobile: string;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  logout: () => void;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  logout: () => {},
  loading: true,
  login: async () => {},
});

export const AuthProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  const [token, setToken] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    const clearSession = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    };

    if (storedUser === "undefined" || storedUser === "null") {
      clearSession();
    } else if (storedToken && !storedUser) {
      clearSession();
    } else if (!storedToken && storedUser) {
      clearSession();
    } else if (storedToken && storedUser) {
      try {
        const parsed: unknown = JSON.parse(storedUser);
        if (
          parsed &&
          typeof parsed === "object" &&
          "email" in parsed &&
          typeof (parsed as { email: unknown }).email === "string"
        ) {
          setToken(storedToken);
          setUser(parsed as User);
        } else {
          clearSession();
        }
      } catch {
        clearSession();
      }
    }

    setLoading(false);
  }, []);

  const login = async (
    email: string,
    password: string
  ) => {
    setLoading(true);

    try {
      const response = await axiosInstance.post(
        "/auth/login",
        {
          email,
          password,
        }
      );

      if (
        response.status === 200 &&
        response.data?.success &&
        response.data.token &&
        response.data.data
      ) {
        const nextToken = response.data.token as string;
        const nextUser = response.data.data as User;

        localStorage.setItem("token", nextToken);
        localStorage.setItem("user", JSON.stringify(nextUser));

        setToken(nextToken);
        setUser(nextUser);

        router.replace("/dashboard");
      }
    } catch (error) {
      console.log("Login Error:", error);

      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);

    setUser(null);

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    router.replace("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        logout,
        loading,
        login,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);