"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading, token } = useAuth();

  useEffect(() => {
    if (!loading && token) {
      router.replace("/dashboard");
    }
  }, [loading, token, router]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    login(email, password);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAFBFC] text-[#6B7C93]">
        Loading…
      </div>
    );
  }

  if (token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAFBFC] text-[#6B7C93]">
        Redirecting…
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(160deg,#FFF7F2_0%,#FAFBFC_45%,#EEF2F6_100%)] px-4">
      <div className="w-full max-w-[420px] rounded-2xl border border-[#1F3A5F]/10 bg-white p-6 shadow-lg shadow-[#132745]/5 sm:p-8">
        <div className="mb-6 flex flex-col items-center text-center">
          <Image
            src="/logo2.svg"
            alt="Tiffin Books"
            width={220}
            height={64}
            priority
            unoptimized
            className="h-14 w-auto"
          />
          <p className="mt-3 text-sm text-[#6B7C93]">
            Sign in to your Tiffin Books account
          </p>
        </div>

        <form className="flex flex-col gap-4" onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="rounded-xl border border-[#1F3A5F]/15 bg-white px-3.5 py-2.5 text-sm text-[#132745] outline-none transition focus:border-[#E96B2E] focus:ring-2 focus:ring-[#E96B2E]/20"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-xl border border-[#1F3A5F]/15 bg-white px-3.5 py-2.5 pr-10 text-sm text-[#132745] outline-none transition focus:border-[#E96B2E] focus:ring-2 focus:ring-[#E96B2E]/20"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-[#6B7C93]"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <button
            className="rounded-xl bg-[#1F3A5F] px-3.5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#132745] disabled:opacity-60"
            type="submit"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
