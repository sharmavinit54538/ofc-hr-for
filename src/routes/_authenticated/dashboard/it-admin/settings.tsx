import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Settings, Bell, Shield, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";

export const Route = createFileRoute("/_authenticated/dashboard/it-admin/settings")({
  component: ItAdminSettingsPage,
});

function ItAdminSettingsPage() {
  const [threatAlerts, setThreatAlerts] = useState(true);
  const [backupAlerts, setBackupAlerts] = useState(true);

  const handleSave = () => {
    toast.success("IT Admin Preferences Saved", { description: "Updated security & webhook notification rules." });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="IT Admin Settings & Webhook Alerts"
        description="Configure IT admin notification preferences, critical threat webhooks, and backup alerts."
        breadcrumbs={[{ label: "IT Admin", href: "/dashboard/it-admin" }, { label: "Settings" }]}
        backHref="/dashboard/it-admin"
      />

      <div className="glass-tile rounded-2xl p-5 space-y-4 max-w-xl text-xs">
        <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2">
          <Bell className="size-4 text-amber-500" /> IT Operations Webhook Notifications
        </h3>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-foreground">Critical Threat Detections</p>
              <p className="text-[11px] text-muted-foreground">Receive instant PagerDuty / Slack alerts on high-severity security incidents</p>
            </div>
            <input
              type="checkbox"
              checked={threatAlerts}
              onChange={(e) => setThreatAlerts(e.target.checked)}
              className="size-4 rounded accent-primary cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-border/40">
            <div>
              <p className="font-bold text-foreground">Daily DB Backup Snapshot Confirmations</p>
              <p className="text-[11px] text-muted-foreground">Receive daily status reports on automated database backups</p>
            </div>
            <input
              type="checkbox"
              checked={backupAlerts}
              onChange={(e) => setBackupAlerts(e.target.checked)}
              className="size-4 rounded accent-primary cursor-pointer"
            />
          </div>
        </div>

        <button
          onClick={handleSave}
          className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-gradient-brand px-4 py-2 text-xs font-semibold text-primary-foreground shadow-glow"
        >
          <CheckCircle2 className="size-3.5" /> Save Preferences
        </button>
      </div>
    </div>
  );
}
