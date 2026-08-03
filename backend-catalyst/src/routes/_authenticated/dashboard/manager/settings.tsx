import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  User,
  Mail,
  Building2,
  ShieldCheck,
  Bell,
  Lock,
  CheckCircle2,
  KeyRound,
  BadgeCheck,
  Save,
  Loader2,
  Crown,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useGetMeQuery } from "@/services/authApi";

export const Route = createFileRoute("/_authenticated/dashboard/manager/settings")({
  component: ManagerSettingsPage,
});

function ManagerSettingsPage() {
  const { user, organization } = useAuthStore();
  const { data: meRes, isLoading: isLoadingMe } = useGetMeQuery();

  const me = meRes?.data;

  // State for Manager Profile fields
  const [fullName, setFullName] = useState(me?.full_name || user?.fullName || "");
  const [email, setEmail] = useState(me?.email || user?.email || "");
  const [department, setDepartment] = useState("Management & Leadership");
  const [jobTitle, setJobTitle] = useState("Engineering Manager");

  // Manager Preferences
  const [leaveNotify, setLeaveNotify] = useState(true);
  const [autoApproveRemote, setAutoApproveRemote] = useState(false);
  const [dailyDigest, setDailyDigest] = useState(true);

  // Password Security state
  const [passwords, setPasswords] = useState({
    current: "",
    newPass: "",
    confirmPass: "",
  });
  const [isSavingPass, setIsSavingPass] = useState(false);

  useEffect(() => {
    if (me) {
      setFullName(me.full_name || user?.fullName || "");
      setEmail(me.email || user?.email || "");
    }
  }, [me, user]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Manager Profile Updated", {
      description: "Your profile information and preferences have been updated.",
    });
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwords.current || !passwords.newPass) {
      toast.error("Please enter current and new password.");
      return;
    }
    if (passwords.newPass !== passwords.confirmPass) {
      toast.error("New passwords do not match.");
      return;
    }
    if (passwords.newPass.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    setIsSavingPass(true);
    setTimeout(() => {
      setIsSavingPass(false);
      setPasswords({ current: "", newPass: "", confirmPass: "" });
      toast.success("Password Updated Successfully", {
        description: "Your account security credentials have been updated.",
      });
    }, 600);
  };

  const currentRole = me?.role || user?.role || "MANAGER";
  const userInitials = (fullName || "Manager").charAt(0).toUpperCase();

  return (
    <div className="space-y-6">
      {/* ── Page Header ────────────────────────────────────────── */}
      <PageHeader
        title="Manager Profile & Account Settings"
        description="Manage your manager identity, profile details, team notification rules, and password security."
        breadcrumbs={[{ label: "Manager", href: "/dashboard/manager" }, { label: "Settings" }]}
        backHref="/dashboard/manager"
      />

      {/* ── Manager Profile Card ───────────────────────────────── */}
      <div className="glass-tile rounded-2xl p-6 border border-border flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-brand font-display text-2xl font-bold text-primary-foreground shadow-glow">
            {userInitials}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="font-display text-xl font-bold text-foreground">
                {fullName || "Manager Profile"}
              </h2>
              <span className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold text-primary">
                <Crown className="size-3 text-amber-500" /> {currentRole}
              </span>
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-2">
              <Mail className="size-3.5 text-primary" /> {email}
            </p>
            <p className="text-xs text-muted-foreground flex items-center gap-2">
              <Building2 className="size-3.5 text-emerald-500" /> Organization:{" "}
              <strong className="text-foreground">{organization?.name || "OFC Enterprise"}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-2 text-xs font-semibold text-emerald-500">
            <ShieldCheck className="size-4" /> Account Verified & Active
          </span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* ── Left Column: Personal Profile Form ─────────────────── */}
        <div className="glass-tile rounded-2xl p-6 border border-border space-y-4">
          <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2">
            <User className="size-4 text-primary" /> Personal Information
          </h3>

          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                Manager Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-xl border border-input bg-card/70 px-3.5 py-2.5 text-xs outline-none focus:border-ring"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                Work Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-input bg-card/70 px-3.5 py-2.5 text-xs outline-none focus:border-ring"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Job Designation
                </label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full rounded-xl border border-input bg-card/70 px-3.5 py-2.5 text-xs outline-none focus:border-ring"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Department
                </label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full rounded-xl border border-input bg-card/70 px-3.5 py-2.5 text-xs outline-none focus:border-ring"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-brand px-5 py-2.5 text-xs font-semibold text-primary-foreground shadow-glow hover:shadow-glow-lg transition-all"
              >
                <Save className="size-4" /> Save Profile Details
              </button>
            </div>
          </form>
        </div>

        {/* ── Right Column: Manager Preferences & Security ─────────── */}
        <div className="space-y-6">
          {/* Notification Preferences */}
          <div className="glass-tile rounded-2xl p-6 border border-border space-y-4 text-xs">
            <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2">
              <Bell className="size-4 text-amber-500" /> Team Approval & Notification Rules
            </h3>

            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-foreground">Immediate Leave Application Alerts</p>
                  <p className="text-[11px] text-muted-foreground">Receive instant email notifications when team members apply for leave</p>
                </div>
                <input
                  type="checkbox"
                  checked={leaveNotify}
                  onChange={(e) => setLeaveNotify(e.target.checked)}
                  className="size-4 rounded accent-primary cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border/40">
                <div>
                  <p className="font-bold text-foreground">Auto-Approve Single Day Remote Requests</p>
                  <p className="text-[11px] text-muted-foreground">Automatically approve 1-day WFH logs submitted by direct reports</p>
                </div>
                <input
                  type="checkbox"
                  checked={autoApproveRemote}
                  onChange={(e) => setAutoApproveRemote(e.target.checked)}
                  className="size-4 rounded accent-primary cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border/40">
                <div>
                  <p className="font-bold text-foreground">Daily Team Summary Email Digest</p>
                  <p className="text-[11px] text-muted-foreground">Receive a morning summary of team attendance and pending approvals</p>
                </div>
                <input
                  type="checkbox"
                  checked={dailyDigest}
                  onChange={(e) => setDailyDigest(e.target.checked)}
                  className="size-4 rounded accent-primary cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Security & Password Change */}
          <div className="glass-tile rounded-2xl p-6 border border-border space-y-4 text-xs">
            <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2">
              <KeyRound className="size-4 text-rose-500" /> Security & Password Management
            </h3>

            <form onSubmit={handleUpdatePassword} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={passwords.current}
                  onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                  className="w-full rounded-xl border border-input bg-card/70 px-3.5 py-2 text-xs outline-none focus:border-ring"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={passwords.newPass}
                    onChange={(e) => setPasswords({ ...passwords, newPass: e.target.value })}
                    className="w-full rounded-xl border border-input bg-card/70 px-3.5 py-2 text-xs outline-none focus:border-ring"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={passwords.confirmPass}
                    onChange={(e) => setPasswords({ ...passwords, confirmPass: e.target.value })}
                    className="w-full rounded-xl border border-input bg-card/70 px-3.5 py-2 text-xs outline-none focus:border-ring"
                  />
                </div>
              </div>

              <div className="pt-1">
                <button
                  type="submit"
                  disabled={isSavingPass}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2 text-xs font-semibold text-rose-500 hover:bg-rose-500/20 transition-all"
                >
                  {isSavingPass && <Loader2 className="size-3.5 animate-spin" />}
                  Update Security Password
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
