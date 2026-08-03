import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck, AlertTriangle, Lock } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
const SECURITY_ALERTS = [
  { id: "SEC-901", title: "Unusual Login Location", description: "Login attempt detected from a new IP subnet.", severity: "high", timestamp: "10 mins ago" },
  { id: "SEC-902", title: "MFA Token Reset Triggered", description: "Manual TOTP token reset initiated for user.", severity: "medium", timestamp: "1 hour ago" },
];

export const Route = createFileRoute("/_authenticated/dashboard/it-admin/security")({
  component: ItAdminSecurityPage,
});

function ItAdminSecurityPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Security Operations Center (SOC)"
        description="Monitor automated threat detection events, impossible travel alerts, and active IP blocklists."
        breadcrumbs={[{ label: "IT Admin", href: "/dashboard/it-admin" }, { label: "Security Center" }]}
        backHref="/dashboard/it-admin"
      />

      <div className="space-y-3">
        {SECURITY_ALERTS.map((alert) => (
          <div key={alert.id} className="glass-tile rounded-2xl p-5 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-rose-500">{alert.id}</span>
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
                alert.severity === "high" ? "border-rose-500/20 bg-rose-500/10 text-rose-500" : "border-amber-500/20 bg-amber-500/10 text-amber-500"
              }`}>
                {alert.severity} priority
              </span>
            </div>
            <h3 className="font-display text-sm font-bold text-foreground">{alert.title}</h3>
            <p className="text-muted-foreground">{alert.description}</p>
            <p className="text-[10px] text-muted-foreground pt-1">{alert.timestamp}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
