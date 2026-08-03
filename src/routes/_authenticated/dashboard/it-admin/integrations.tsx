import { createFileRoute } from "@tanstack/react-router";
import { Plug, CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";

export const Route = createFileRoute("/_authenticated/dashboard/it-admin/integrations")({
  component: ItAdminIntegrationsPage,
});

function ItAdminIntegrationsPage() {
  const tools = [
    { name: "Slack Enterprise Grid", category: "Chat & Alerts", status: "Connected" },
    { name: "Jamf Pro MDM", category: "Device Management", status: "Connected" },
    { name: "Datadog Telemetry", category: "Monitoring", status: "Connected" },
    { name: "Splunk SIEM Log Exporter", category: "Security", status: "Connected" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="IT Infrastructure Integrations"
        description="Manage connected developer tools, SIEM exporters, device MDMs, and alert webhooks."
        breadcrumbs={[{ label: "IT Admin", href: "/dashboard/it-admin" }, { label: "Integrations" }]}
        backHref="/dashboard/it-admin"
      />

      <div className="grid gap-4 sm:grid-cols-2">
        {tools.map((t) => (
          <div key={t.name} className="glass-tile rounded-2xl p-5 flex items-center justify-between text-xs">
            <div>
              <span className="inline-flex rounded-full bg-primary/10 px-2 py-0.5 text-[9px] font-bold text-primary mb-1">
                {t.category}
              </span>
              <h3 className="font-display text-sm font-bold text-foreground">{t.name}</h3>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-500">
              <CheckCircle2 className="size-3" /> {t.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
