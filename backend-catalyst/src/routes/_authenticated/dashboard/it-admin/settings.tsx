import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Settings, Bell, Shield, CheckCircle2, Lock, KeyRound, Loader2, UserCheck } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";
import { useAuthStore } from "@/hooks/useAuthStore";
import {
  useGetEmployeePreferencesQuery,
  useUpdateEmployeePreferencesMutation,
  useChangeEmployeePasswordMutation,
  useGetEmployeeProfileQuery,
} from "@/services/employeeSettingsApi";

export const Route = createFileRoute("/_authenticated/dashboard/it-admin/settings")({
  component: ItAdminSettingsPage,
});

function ItAdminSettingsPage() {
  const user = useAuthStore((s) => s.user);

  const { data: profileRes } = useGetEmployeeProfileQuery();
  const profile = profileRes?.data;

  const { data: prefsRes, isLoading: isLoadingPrefs } = useGetEmployeePreferencesQuery();
  const [updatePreferences, { isLoading: isUpdatingPrefs }] = useUpdateEmployeePreferencesMutation();
  const [changePassword, { isLoading: isChangingPassword }] = useChangeEmployeePasswordMutation();

  const [emailNotifications, setEmailNotifications] = useState(true);
  const [securityAlerts, setSecurityAlerts] = useState(true);

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (prefsRes?.data) {
      setEmailNotifications(prefsRes.data.email_notifications);
    }
  }, [prefsRes]);

  const handleSavePreferences = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updatePreferences({
        email_notifications: emailNotifications,
      }).unwrap();
      toast.success("IT Admin Preferences Saved", {
        description: "Updated notification gateways and active alert preferences in backend.",
      });
    } catch (err: any) {
      toast.error(err?.data?.detail || "Failed to update preferences.");
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      await changePassword({
        current_password: currentPassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
      }).unwrap();
      toast.success("Security Credentials Updated", {
        description: "Password changed successfully for IT Administrator account.",
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      toast.error(err?.data?.detail || "Failed to change password.");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="IT Admin Account & Security Settings"
        description="Manage IT administrator profile preferences, security password credentials, and automated notification alerts."
        breadcrumbs={[{ label: "IT Admin", href: "/dashboard/it-admin" }, { label: "Settings" }]}
        backHref="/dashboard/it-admin"
      />

      {/* Admin Profile Overview */}
      <div className="glass-tile rounded-2xl p-5 md:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="grid size-12 place-items-center rounded-2xl bg-gradient-brand font-display text-lg font-bold text-primary-foreground">
            {profile?.full_name?.charAt(0) ?? user?.fullName?.charAt(0) ?? "A"}
          </div>
          <div>
            <h3 className="font-display text-base font-bold text-foreground">
              {profile?.full_name ?? user?.fullName ?? "IT Administrator"}
            </h3>
            <p className="text-xs text-muted-foreground">
              {profile?.work_email ?? user?.email ?? "it.admin@system"} · Role: <strong className="text-primary">{profile?.role ?? user?.role ?? "IT_ADMIN"}</strong>
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-500 self-start sm:self-center">
          <UserCheck className="size-3.5" /> Authenticated IT Admin
        </span>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Notification & Operations Preferences */}
        <form onSubmit={handleSavePreferences} className="glass-tile rounded-2xl p-5 md:p-6 space-y-4 text-xs">
          <div className="flex items-center gap-2 border-b border-border/40 pb-3">
            <Bell className="size-4 text-amber-500" />
            <h3 className="font-display text-sm font-bold text-foreground">Notification & Webhook Preferences</h3>
          </div>

          {isLoadingPrefs ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="size-5 animate-spin text-primary" />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-foreground">Email Notifications</p>
                  <p className="text-[11px] text-muted-foreground">Receive system notifications via registered work email</p>
                </div>
                <input
                  type="checkbox"
                  checked={emailNotifications}
                  onChange={(e) => setEmailNotifications(e.target.checked)}
                  className="size-4 rounded accent-primary cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border/40">
                <div>
                  <p className="font-bold text-foreground">Critical Security Threat Alerts</p>
                  <p className="text-[11px] text-muted-foreground">Instant notifications on unusual login attempts or locked accounts</p>
                </div>
                <input
                  type="checkbox"
                  checked={securityAlerts}
                  onChange={(e) => setSecurityAlerts(e.target.checked)}
                  className="size-4 rounded accent-primary cursor-pointer"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isUpdatingPrefs}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-brand px-5 py-2 text-xs font-semibold text-primary-foreground shadow-glow hover:shadow-glow-lg transition-all disabled:opacity-50"
                >
                  {isUpdatingPrefs ? <Loader2 className="size-3.5 animate-spin" /> : <CheckCircle2 className="size-3.5" />}
                  {isUpdatingPrefs ? "Saving Preferences..." : "Save Preferences"}
                </button>
              </div>
            </div>
          )}
        </form>

        {/* Change Admin Password Form */}
        <form onSubmit={handleChangePassword} className="glass-tile rounded-2xl p-5 md:p-6 space-y-4 text-xs">
          <div className="flex items-center gap-2 border-b border-border/40 pb-3">
            <Lock className="size-4 text-primary" />
            <h3 className="font-display text-sm font-bold text-foreground">Security & Credential Settings</h3>
          </div>

          <div className="space-y-3">
            <div className="space-y-1">
              <label className="font-bold text-foreground">Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                className="w-full rounded-xl border border-border/60 bg-card/60 px-3.5 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-foreground">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full rounded-xl border border-border/60 bg-card/60 px-3.5 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-foreground">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="w-full rounded-xl border border-border/60 bg-card/60 px-3.5 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                required
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isChangingPassword}
                className="inline-flex items-center gap-2 rounded-xl bg-secondary px-5 py-2 text-xs font-semibold text-foreground hover:bg-secondary/80 transition-all disabled:opacity-50"
              >
                {isChangingPassword ? <Loader2 className="size-3.5 animate-spin text-primary" /> : <KeyRound className="size-3.5 text-primary" />}
                {isChangingPassword ? "Updating Password..." : "Change Password"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
