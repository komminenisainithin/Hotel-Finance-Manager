"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const PUBLIC_PATHS = ["/login"];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { token, isReady } = useAuth();

  const isPublic = PUBLIC_PATHS.includes(pathname ?? "");

  useEffect(() => {
    if (!isReady) return;
    if (!token && !isPublic) {
      router.replace("/login");
      return;
    }
    if (token && pathname === "/login") {
      router.replace("/");
    }
  }, [isReady, token, isPublic, pathname, router]);

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-600">
        Loading…
      </div>
    );
  }

  if (!token && !isPublic) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-600">
        Redirecting…
      </div>
    );
  }

  if (token && pathname === "/login") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-600">
        Redirecting…
      </div>
    );
  }

  return <>{children}</>;
}
