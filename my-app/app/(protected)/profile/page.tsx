"use client";

import { useEffect, useState } from "react";
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  LogOut,
  Mail,
  Phone,
  Shield,
  User,
  UserCircle2,
  UserPen,
} from "lucide-react";

import { useAuth } from "@/app/context/AuthContext";
import {
  getUser,
  updatePassword,
  updateUser,
  type UserRecord,
} from "@/app/lib/apis/auth";

function formatMemberSince(date: string) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function ProfileSkeleton() {
  return (
    <div className="flex flex-col gap-6 p-4 lg:p-6">
      <div className="h-40 animate-pulse rounded-2xl bg-gray-100/80" />
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="h-80 animate-pulse rounded-2xl bg-gray-100/80" />
        <div className="h-80 animate-pulse rounded-2xl bg-gray-100/80" />
      </div>
    </div>
  );
}

type AlertProps = {
  type: "error" | "success";
  message: string;
};

function AlertBanner({ type, message }: AlertProps) {
  const isError = type === "error";
  return (
    <div
      className={`flex items-start gap-2.5 rounded-xl border px-4 py-3 text-sm ${
        isError
          ? "border-red-200 bg-red-50 text-red-700"
          : "border-emerald-200 bg-emerald-50 text-emerald-700"
      }`}
    >
      {isError ? (
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
      ) : (
        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
      )}
      <span>{message}</span>
    </div>
  );
}

type FieldProps = {
  id: string;
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  hint?: string;
};

function FieldGroup({ id, label, icon, children, hint }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          {icon}
        </span>
        {children}
      </div>
      {hint && <p className="text-xs text-gray-500">{hint}</p>}
    </div>
  );
}

const inputClassName =
  "w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#185FA5] focus:ring-2 focus:ring-[#185FA5]/20 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500";

export default function ProfilePage() {
  const { token, loading: authLoading, syncUser, logout } = useAuth();

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [createdAt, setCreatedAt] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [profileSubmitting, setProfileSubmitting] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordSubmitting, setPasswordSubmitting] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

  const [loggingOut, setLoggingOut] = useState(false);

  function applyUserData(user: UserRecord) {
    setName(user.name);
    setEmail(user.email);
    setMobile(user.mobile);
    setCreatedAt(user.createdAt);
  }

  function fetchUser() {
    setLoading(true);
    setLoadError(null);
    getUser()
      .then((res) => {
        if (res.success && res.data) {
          applyUserData(res.data);
        } else {
          setLoadError(res.message ?? "Failed to load profile");
        }
      })
      .catch((err: unknown) =>
        setLoadError(
          err instanceof Error ? err.message : "Failed to load profile",
        ),
      )
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    if (authLoading || !token) return;
    fetchUser();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, authLoading]);

  async function handleProfileSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setProfileError(null);
    setProfileSuccess(null);
    setProfileSubmitting(true);
    try {
      const res = await updateUser({
        name: name.trim(),
        mobile: mobile.trim(),
      });
      if (res.success && res.data) {
        applyUserData(res.data);
        syncUser({
          name: res.data.name,
          email: res.data.email,
          mobile: res.data.mobile,
        });
        setProfileSuccess(res.message ?? "Profile updated successfully");
      } else {
        setProfileError(res.message ?? "Failed to update profile");
      }
    } catch (err) {
      setProfileError(
        err instanceof Error ? err.message : "Something went wrong",
      );
    } finally {
      setProfileSubmitting(false);
    }
  }

  async function handlePasswordSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);
    setPasswordSubmitting(true);
    try {
      const res = await updatePassword({ oldPassword, newPassword });
      if (res.success) {
        setOldPassword("");
        setNewPassword("");
        setPasswordSuccess(res.message ?? "Password updated successfully");
      } else {
        setPasswordError(res.message ?? "Failed to update password");
      }
    } catch (err) {
      setPasswordError(
        err instanceof Error ? err.message : "Something went wrong",
      );
    } finally {
      setPasswordSubmitting(false);
    }
  }

  async function handleLogout() {
    setLoggingOut(true);
    await logout();
  }

  if (authLoading || loading) {
    return (
      <div className="w-full">
        <div className="border-b border-gray-200 px-4 py-4 lg:px-6">
          <div className="h-7 w-32 animate-pulse rounded-lg bg-gray-100" />
        </div>
        <ProfileSkeleton />
      </div>
    );
  }

  return (
    <div className="w-full min-h-full bg-gray-50/60">
      <div className="border-b border-gray-200 bg-white px-4 py-4 lg:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#185FA5]/10">
            <UserCircle2 className="h-5 w-5 text-[#185FA5]" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Profile</h1>
            <p className="text-sm text-gray-500">
              Manage your account settings and security
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6 p-4 lg:p-6">
        {loadError && <AlertBanner type="error" message={loadError} />}

        {/* Hero banner */}
        <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="absolute inset-0 bg-gradient-to-br from-[#185FA5]/10 via-blue-50/50 to-transparent" />
          <div className="relative flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#185FA5] to-[#0C447C] text-xl font-bold text-white shadow-md">
                {getInitials(name || "U")}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {name || "User"}
                </h2>
                <p className="mt-0.5 text-sm text-gray-500">{email}</p>
                {createdAt && (
                  <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-white/80 px-2.5 py-1 text-xs font-medium text-gray-600 ring-1 ring-gray-200">
                    <CalendarDays className="h-3.5 w-3.5 text-[#185FA5]" />
                    Member since {formatMemberSince(createdAt)}
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-wrap gap-2 sm:justify-end">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Active account
              </span>
            </div>
          </div>
        </div>

        {/* Two-column cards */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Profile details */}
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50">
                <UserPen className="h-4 w-4 text-[#185FA5]" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-gray-900">
                  Profile details
                </h2>
                <p className="text-xs text-gray-500">
                  Update your personal information
                </p>
              </div>
            </div>

            <form onSubmit={handleProfileSubmit} className="flex flex-col gap-5">
              <FieldGroup id="name" label="Full name" icon={<User className="h-4 w-4" />}>
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputClassName}
                  placeholder="Your name"
                />
              </FieldGroup>

              <FieldGroup
                id="email"
                label="Email address"
                icon={<Mail className="h-4 w-4" />}
                hint="Email cannot be changed"
              >
                <input
                  id="email"
                  type="email"
                  value={email}
                  disabled
                  className={inputClassName}
                />
              </FieldGroup>

              <FieldGroup id="mobile" label="Mobile number" icon={<Phone className="h-4 w-4" />}>
                <input
                  id="mobile"
                  type="tel"
                  required
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className={inputClassName}
                  placeholder="10-digit mobile number"
                />
              </FieldGroup>

              {profileError && <AlertBanner type="error" message={profileError} />}
              {profileSuccess && (
                <AlertBanner type="success" message={profileSuccess} />
              )}

              <button
                type="submit"
                disabled={profileSubmitting}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#185FA5] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#0C447C] disabled:opacity-60"
              >
                {profileSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving…
                  </>
                ) : (
                  "Save changes"
                )}
              </button>
            </form>
          </section>

          {/* Security */}
          <div className="flex flex-col gap-6">
            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50">
                  <Shield className="h-4 w-4 text-amber-600" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-gray-900">
                    Change password
                  </h2>
                  <p className="text-xs text-gray-500">
                    Keep your account secure with a strong password
                  </p>
                </div>
              </div>

              <form
                onSubmit={handlePasswordSubmit}
                className="flex flex-col gap-5"
              >
                <FieldGroup
                  id="oldPassword"
                  label="Current password"
                  icon={<Lock className="h-4 w-4" />}
                >
                  <input
                    id="oldPassword"
                    type={showOldPassword ? "text" : "password"}
                    required
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className={`${inputClassName} pr-10`}
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-0.5 text-gray-400 transition hover:text-gray-600"
                  >
                    {showOldPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </FieldGroup>

                <FieldGroup
                  id="newPassword"
                  label="New password"
                  icon={<Lock className="h-4 w-4" />}
                >
                  <input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className={`${inputClassName} pr-10`}
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-0.5 text-gray-400 transition hover:text-gray-600"
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </FieldGroup>

                {passwordError && (
                  <AlertBanner type="error" message={passwordError} />
                )}
                {passwordSuccess && (
                  <AlertBanner type="success" message={passwordSuccess} />
                )}

                <button
                  type="submit"
                  disabled={passwordSubmitting}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#185FA5] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#0C447C] disabled:opacity-60"
                >
                  {passwordSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Updating…
                    </>
                  ) : (
                    "Update password"
                  )}
                </button>
              </form>
            </section>

            {/* Session */}
            <section className="rounded-2xl border border-red-100 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50">
                  <LogOut className="h-4 w-4 text-red-500" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-gray-900">
                    Sign out
                  </h2>
                  <p className="text-xs text-gray-500">
                    End your current session on this device
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-100 disabled:opacity-60 sm:w-auto"
              >
                {loggingOut ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Logging out…
                  </>
                ) : (
                  <>
                    <LogOut className="h-4 w-4" />
                    Log out
                  </>
                )}
              </button>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
