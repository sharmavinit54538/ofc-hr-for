import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Bell, Crown, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";
import { useAuthStore } from "@/hooks/useAuthStore";

export const Route = createFileRoute("/_authenticated/dashboard/executive/settings")({
  component: ExecutiveSettingsPage,
});

function ExecutiveSettingsPage() {
  const user = useAuthStore((s) => s.user);
  const [boardDigest, setBoardDigest] = useState(true);
  const [anomalyAlerts, setAnomalyAlerts] = useState(true);

  const initial = user?.fullName ? user.fullName.charAt(0).toUpperCase() : "E";

  const handleSave = () => {
    toast.success("Executive Preferences Saved", { description: "Updated executive telemetry and report notification rules." });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Executive Settings & Credentials"
        description="Configure executive intelligence preferences, board meeting alerts, and C-level security settings."
        breadcrumbs={[{ label: "Executive", href: "/dashboard/executive" }, { label: "Settings" }]}
        backHref="/dashboard/executive"
      />

      {/* Executive Card */}
      <div className="glass-tile rounded-2xl p-6 md:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="flex size-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-brand font-display text-3xl font-bold text-primary-foreground shadow-glow">
            {initial}
          </div>
          <div className="space-y-1.5">
            <h1 className="font-display text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              {user?.fullName || "Executive Member"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {user?.jobTitle || "Executive Leadership"} · Executive Office
            </p>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-xs font-bold text-purple-400">
                <Crown className="size-3.5 text-purple-400" /> Executive Suite ({user?.role || "EXECUTIVE"})
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400">
                <ShieldCheck className="size-3.5 text-emerald-400" /> Account Active
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="glass-tile rounded-2xl p-5 space-y-4 max-w-xl text-xs">
        <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2">
          <Bell className="size-4 text-amber-500" /> Executive Telemetry Alerts
        </h3>

        <div className="space-y-3 divide-y divide-border/40">
          <div className="flex items-center justify-between pt-1">
            <div>
              <p className="font-bold text-foreground">Weekly Executive Digest</p>
              <p className="text-muted-foreground">Receive weekly workforce summary report via email.</p>
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
              <p className="text-muted-foreground">Immediate alerts on department capacity changes.</p>
            </div>
            <input
              type="checkbox"
              checked={anomalyAlerts}
              onChange={(e) => setAnomalyAlerts(e.target.checked)}
              className="size-4 accent-primary rounded cursor-pointer"
            />
          </div>
        </div>

        <div className="pt-2">
          <button
            onClick={handleSave}
            className="rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow hover:bg-primary/90 transition-all"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
}
