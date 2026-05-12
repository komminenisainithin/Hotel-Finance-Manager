"use client";

import { AuthProvider } from "./context/AuthContext";
import AuthGuard from "./components/AuthGuard";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AuthGuard>{children}</AuthGuard>
    </AuthProvider>
  );
}
