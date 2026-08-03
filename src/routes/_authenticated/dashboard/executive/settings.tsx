import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Bell, Crown, ShieldCheck, User, Lock, Loader2, Save, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";
import { useAuthStore } from "@/hooks/useAuthStore";
import {
  useGetEmployeeProfileQuery,
  useGetEmployeePreferencesQuery,
  useUpdateEmployeePreferencesMutation,
  useChangeEmployeePasswordMutation,
} from "@/services/employeeSettingsApi";

export const Route = createFileRoute("/_authenticated/dashboard/executive/settings")({
  component: ExecutiveSettingsPage,
});

function ExecutiveSettingsPage() {
  const authUser = useAuthStore((s) => s.user);

  const { data: profileRes, isLoading: isLoadingProfile } = useGetEmployeeProfileQuery();
  const { data: prefRes, isLoading: isLoadingPref } = useGetEmployeePreferencesQuery();
  const [updatePreferences, { isLoading: isUpdatingPref }] = useUpdateEmployeePreferencesMutation();
  const [changePassword, { isLoading: isChangingPassword }] = useChangeEmployeePasswordMutation();

  const profile = profileRes?.data;
  const preferences = prefRes?.data;

  const [emailNotifications, setEmailNotifications] = useState(true);
  const [boardDigest, setBoardDigest] = useState(true);
  const [anomalyAlerts, setAnomalyAlerts] = useState(true);

  // Security password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (preferences) {
      setEmailNotifications(preferences.email_notifications ?? true);
    }
  }, [preferences]);

  const fullName = profile?.full_name || authUser?.fullName || "Executive Member";
  const jobTitle = profile?.job_title || authUser?.jobTitle || "Executive Leadership";
  const email = profile?.work_email || authUser?.email || "executive@organization.com";
  const role = profile?.role || authUser?.role || "EXECUTIVE";
  const initial = fullName ? fullName.charAt(0).toUpperCase() : "E";

  const handleSavePreferences = async () => {
    try {
      await updatePreferences({ email_notifications: emailNotifications }).unwrap();
      toast.success("Executive Preferences Saved", {
        description: "Updated real-time telemetry and email alert preferences in backend.",
      });
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update preferences.");
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match.");
      return;
    }
    try {
      await changePassword({ current_password: currentPassword, new_password: newPassword, confirm_password: confirmPassword }).unwrap();
      toast.success("Password Updated Successfully", { description: "Executive security credentials updated in backend database." });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update password. Verify current password.");
    }
  };

  const isLoading = isLoadingProfile || isLoadingPref;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Executive Settings & Credentials"
        description="Configure executive intelligence preferences, board meeting telemetry alerts, and C-level security settings."
        breadcrumbs={[{ label: "Executive", href: "/dashboard/executive" }, { label: "Settings" }]}
        backHref="/dashboard/executive"
      />

      {/* Executive Card */}
      <div className="glass-tile rounded-2xl p-6 md:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="flex size-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-brand font-display text-3xl font-bold text-primary-foreground shadow-glow">
            {isLoading ? <Loader2 className="size-8 animate-spin" /> : initial}
          </div>
          <div className="space-y-1.5">
            <h1 className="font-display text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              {fullName}
            </h1>
            <p className="text-xs text-muted-foreground sm:text-sm">
              {jobTitle} · {email}
            </p>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-xs font-bold text-purple-400">
                <Crown className="size-3.5 text-purple-400" /> Executive Suite ({role})
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400">
                <ShieldCheck className="size-3.5 text-emerald-400" /> Backend Profile Active
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Notification Preferences */}
        <div className="glass-tile rounded-2xl p-5 space-y-4 text-xs">
          <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2">
            <Bell className="size-4 text-amber-500" /> Executive Telemetry Alerts
          </h3>

          <div className="space-y-3 divide-y divide-border/40">
            <div className="flex items-center justify-between pt-1">
              <div>
                <p className="font-bold text-foreground">Email Notifications & Summaries</p>
                <p className="text-muted-foreground">Receive real-time system alerts via verified email.</p>
              </div>
              <input
                type="checkbox"
                checked={emailNotifications}
                onChange={(e) => setEmailNotifications(e.target.checked)}
                className="size-4 accent-primary rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between pt-3">
              <div>
                <p className="font-bold text-foreground">Weekly Executive Digest</p>
                <p className="text-muted-foreground">Receive weekly workforce summary report.</p>
              </div>
              <input
                type="checkbox"
                checked={boardDigest}
                onChange={(e) => setBoardDigest(e.target.checked)}
                className="size-4 accent-primary rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between pt-3">
              <div>
                <p className="font-bold text-foreground">Operational Anomaly Notifications</p>
                <p className="text-muted-foreground">Immediate alerts on department capacity & governance changes.</p>
              </div>
              <input
                type="checkbox"
                checked={anomalyAlerts}
                onChange={(e) => setAnomalyAlerts(e.target.checked)}
                className="size-4 accent-primary rounded cursor-pointer"
              />
            </div>
          </div>

          <div className="pt-3">
            <button
              disabled={isUpdatingPref}
              onClick={handleSavePreferences}
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground shadow hover:bg-primary/90 transition-all disabled:opacity-50"
            >
              {isUpdatingPref ? <Loader2 className="size-3.5 animate-spin" /> : <Save className="size-3.5" />}
              Save Preference Changes
            </button>
          </div>
        </div>

        {/* Security Credentials */}
        <form onSubmit={handleChangePassword} className="glass-tile rounded-2xl p-5 space-y-4 text-xs">
          <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2">
            <Lock className="size-4 text-purple-400" /> Security Credentials & Password
          </h3>

          <div className="space-y-3">
            <div>
              <label className="font-semibold text-muted-foreground block mb-1">Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                className="w-full rounded-xl border border-border/60 bg-card/60 px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="font-semibold text-muted-foreground block mb-1">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new secure password"
                className="w-full rounded-xl border border-border/60 bg-card/60 px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="font-semibold text-muted-foreground block mb-1">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                className="w-full rounded-xl border border-border/60 bg-card/60 px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isChangingPassword}
              className="inline-flex items-center gap-1.5 rounded-xl bg-purple-600 px-4 py-2.5 text-xs font-semibold text-white shadow hover:bg-purple-700 transition-all disabled:opacity-50"
            >
              {isChangingPassword ? <Loader2 className="size-3.5 animate-spin" /> : <CheckCircle2 className="size-3.5" />}
              Update Security Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
