"use client";

import { useEffect } from "react";

import { useRouter } from "next/navigation";

import { useAuth } from "./context/AuthContext";

export default function Home() {
  const { token, loading } = useAuth();

  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (token) {
        router.push("/dashboard");
      } else {
        router.push("/login");
      }
    }
  }, [token, loading, router]);

  return <div>Loading...</div>;
}