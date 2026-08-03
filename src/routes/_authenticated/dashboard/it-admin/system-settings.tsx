import { createFileRoute } from "@tanstack/react-router";
import { Sliders, CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";

export const Route = createFileRoute("/_authenticated/dashboard/it-admin/system-settings")({
  component: ItAdminSystemSettingsPage,
});

function ItAdminSystemSettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Global System Settings"
        description="Configure domain settings, SMTP email gateways, custom branding, and maintenance window schedules."
        breadcrumbs={[{ label: "IT Admin", href: "/dashboard/it-admin" }, { label: "System Settings" }]}
        backHref="/dashboard/it-admin"
      />

      <div className="glass-tile rounded-2xl p-5 space-y-4 max-w-xl text-xs">
        <h3 className="font-display text-base font-bold text-foreground">SMTP & Email Gateway Configuration</h3>
        <div className="space-y-2">
          <div className="flex justify-between border-b border-border/40 pb-2">
            <span className="text-muted-foreground">Gateway Host</span>
            <span className="font-mono font-bold text-foreground">smtp.sendgrid.net</span>
          </div>
          <div className="flex justify-between border-b border-border/40 pb-2">
            <span className="text-muted-foreground">Port</span>
            <span className="font-mono font-bold text-foreground">587 (TLS Enabled)</span>
          </div>
          <div className="flex justify-between pt-1">
            <span className="text-muted-foreground">Status</span>
            <span className="font-bold text-emerald-500">Connected & Verified</span>
          </div>
        </div>
      </div>
    </div>
  );
}
