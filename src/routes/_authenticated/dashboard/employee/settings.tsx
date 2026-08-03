import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Bell, Lock, User, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { getApiErrorMessage } from "@/utils/api-error";

import { useAuthStore } from "@/hooks/useAuthStore";

import {
  useGetEmployeeProfileQuery,
  useGetEmployeePreferencesQuery,
  useUpdateEmployeePreferencesMutation,
  useChangeEmployeePasswordMutation,
} from "@/services/employeeSettingsApi";

export const Route = createFileRoute("/_authenticated/dashboard/employee/settings")({
  component: EmployeeSettingsPage,
});

function EmployeeSettingsPage() {
  const storeUser = useAuthStore((s) => s.user);

  const { data: profileRes, isLoading: isProfileLoading } = useGetEmployeeProfileQuery();
  const { data: prefRes, isLoading: isPrefLoading } = useGetEmployeePreferencesQuery();

  const [updatePreferences, { isLoading: isUpdatingPref }] =
    useUpdateEmployeePreferencesMutation();
  const [changePassword, { isLoading: isChangingPassword }] =
    useChangeEmployeePasswordMutation();

  const profile = profileRes?.data;

  const fullName = profile?.full_name || storeUser?.fullName || storeUser?.email || "Employee";
  const workEmail = profile?.work_email || storeUser?.email || "";
  const employeeId =
    profile?.employee_id ||
    storeUser?.employeeId ||
    (storeUser?.id ? `EMP-${storeUser.id.replace(/-/g, "").slice(0, 6).toUpperCase()}` : "EMP-000101");
  const roleDisplay =
    profile?.role ||
    (storeUser?.role ? storeUser.role.replace(/_/g, " ").toUpperCase() : "Employee");

  const [emailNotifications, setEmailNotifications] = useState(true);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (prefRes?.data) {
      setEmailNotifications(prefRes.data.email_notifications);
    }
  }, [prefRes]);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    const curr = currentPassword.trim();
    const next = newPassword.trim();
    const conf = confirmPassword.trim();

    if (!curr || !next || !conf) {
      toast.error("Validation Error", { description: "All password fields are required." });
      return;
    }

    if (next !== conf) {
      toast.error("Validation Error", { description: "New password and confirm password do not match." });
      return;
    }

    if (next.length < 8 || next.length > 128) {
      toast.error("Validation Error", {
        description: "Password must be between 8 and 128 characters long.",
      });
      return;
    }

    if (!/[A-Z]/.test(next)) {
      toast.error("Validation Error", {
        description: "Password must contain at least one uppercase letter.",
      });
      return;
    }

    if (!/[a-z]/.test(next)) {
      toast.error("Validation Error", {
        description: "Password must contain at least one lowercase letter.",
      });
      return;
    }

    if (!/[0-9]/.test(next)) {
      toast.error("Validation Error", {
        description: "Password must contain at least one number.",
      });
      return;
    }

    if (!/[^a-zA-Z0-9]/.test(next)) {
      toast.error("Validation Error", {
        description: "Password must contain at least one special character.",
      });
      return;
    }

    if (curr === next) {
      toast.error("Validation Error", {
        description: "New password cannot be the same as current password.",
      });
      return;
    }

    try {
      const response = await changePassword({
        current_password: curr,
        new_password: next,
        confirm_password: conf,
      }).unwrap();

      toast.success(response.message || "Password updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast.error("Password Update Failed", {
        description: getApiErrorMessage(err as FetchBaseQueryError),
      });
    }
  };

  const handleSavePreferences = async () => {
    try {
      const response = await updatePreferences({
        email_notifications: emailNotifications,
      }).unwrap();

      toast.success(response.message || "Preferences Saved", {
        description: "Your email notification preferences have been saved successfully.",
      });
    } catch (err) {
      toast.error("Preferences Update Failed", {
        description: getApiErrorMessage(err as FetchBaseQueryError),
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          Account Settings
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Manage your personal account preferences, notifications, and security options.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Profile Preferences */}
        <div className="glass-tile rounded-2xl p-5 space-y-4">
          <h2 className="font-display text-base font-bold text-foreground flex items-center gap-2">
            <User className="size-4 text-primary" /> Profile Summary
          </h2>

          {isProfileLoading ? (
            <div className="space-y-3 py-4">
              <div className="h-4 w-full animate-pulse rounded bg-secondary/60" />
              <div className="h-4 w-full animate-pulse rounded bg-secondary/60" />
              <div className="h-4 w-full animate-pulse rounded bg-secondary/60" />
              <div className="h-4 w-full animate-pulse rounded bg-secondary/60" />
            </div>
          ) : (
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-border/40 pb-2">
                <span className="text-muted-foreground">Full Name</span>
                <span className="font-bold text-foreground">{fullName}</span>
              </div>
              <div className="flex items-center justify-between border-b border-border/40 pb-2">
                <span className="text-muted-foreground">Work Email</span>
                <span className="font-bold text-foreground">{workEmail}</span>
              </div>
              <div className="flex items-center justify-between border-b border-border/40 pb-2">
                <span className="text-muted-foreground">Employee ID</span>
                <span className="font-mono font-bold text-primary">{employeeId}</span>
              </div>
              <div className="flex items-center justify-between border-b border-border/40 pb-2">
                <span className="text-muted-foreground">Role</span>
                <span className="font-bold text-emerald-500">{roleDisplay}</span>
              </div>
            </div>
          )}
        </div>

        {/* Notifications Settings */}
        <div className="glass-tile rounded-2xl p-5 space-y-4">
          <h2 className="font-display text-base font-bold text-foreground flex items-center gap-2">
            <Bell className="size-4 text-amber-500" /> Notifications & Alerts
          </h2>

          {isPrefLoading ? (
            <div className="space-y-3 py-4">
              <div className="h-4 w-full animate-pulse rounded bg-secondary/60" />
            </div>
          ) : (
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-foreground">Email Notifications</p>
                  <p className="text-[11px] text-muted-foreground">
                    Receive payslip, leave approval, and announcement alerts
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={emailNotifications}
                  onChange={(e) => setEmailNotifications(e.target.checked)}
                  disabled={isUpdatingPref}
                  className="size-4 rounded accent-primary cursor-pointer disabled:opacity-50"
                />
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={handleSavePreferences}
            disabled={isUpdatingPref || isPrefLoading}
            className="mt-2 inline-flex items-center gap-1.5 rounded-xl bg-gradient-brand px-4 py-2 text-xs font-semibold text-primary-foreground shadow-glow transition-all hover:shadow-glow-lg disabled:opacity-60"
          >
            {isUpdatingPref ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <CheckCircle2 className="size-3.5" />
            )}
            <span>{isUpdatingPref ? "Saving…" : "Save Preferences"}</span>
          </button>
        </div>

        {/* Password & Security */}
        <div className="glass-tile rounded-2xl p-5 space-y-4 lg:col-span-2">
          <h2 className="font-display text-base font-bold text-foreground flex items-center gap-2">
            <Lock className="size-4 text-rose-500" /> Password & Security
          </h2>

          <form onSubmit={handlePasswordChange} className="grid gap-4 sm:grid-cols-3 text-xs">
            <div>
              <label className="block font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                Current Password
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                disabled={isChangingPassword}
                className="w-full rounded-xl border border-input bg-card/70 px-3 py-2.5 outline-none transition-all focus:border-ring focus:shadow-glow disabled:opacity-60"
              />
            </div>
            <div>
              <label className="block font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                New Password
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={isChangingPassword}
                className="w-full rounded-xl border border-input bg-card/70 px-3 py-2.5 outline-none transition-all focus:border-ring focus:shadow-glow disabled:opacity-60"
              />
            </div>
            <div>
              <label className="block font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isChangingPassword}
                className="w-full rounded-xl border border-input bg-card/70 px-3 py-2.5 outline-none transition-all focus:border-ring focus:shadow-glow disabled:opacity-60"
              />
            </div>

            <div className="sm:col-span-3 flex justify-end">
              <button
                type="submit"
                disabled={isChangingPassword}
                className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-brand px-5 py-2 text-xs font-semibold text-primary-foreground shadow-glow transition-all hover:shadow-glow-lg disabled:opacity-60"
              >
                {isChangingPassword ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <Lock className="size-3.5" />
                )}
                <span>{isChangingPassword ? "Updating Password…" : "Update Password"}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
