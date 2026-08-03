import { createFileRoute } from "@tanstack/react-router";
import { ClipboardList } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
const AUDIT_LOGS = [
  { id: "LOG-1001", timestamp: "2026-08-02 10:15", method: "Password Authenticated", location: "Bengaluru, IN", ip: "103.21.244.18", status: "success" },
  { id: "LOG-1002", timestamp: "2026-08-02 09:40", method: "OAuth SSO Login", location: "Mumbai, IN", ip: "103.21.244.61", status: "success" },
];

export const Route = createFileRoute("/_authenticated/dashboard/it-admin/audit")({
  component: ItAdminAuditPage,
});

function ItAdminAuditPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Audit Logs & Access History"
        description="Immutable real-time audit trail of administrator actions, login attempts, and policy modifications."
        breadcrumbs={[{ label: "IT Admin", href: "/dashboard/it-admin" }, { label: "Audit Logs" }]}
        backHref="/dashboard/it-admin"
      />

      <div className="glass-tile overflow-hidden rounded-2xl border border-border">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border/60 bg-card/60 uppercase tracking-[0.08em] text-muted-foreground">
              <tr>
                <th className="px-5 py-3.5 font-bold">Event ID</th>
                <th className="px-5 py-3.5 font-bold">Timestamp</th>
                <th className="px-5 py-3.5 font-bold">Method</th>
                <th className="px-5 py-3.5 font-bold">Location</th>
                <th className="px-5 py-3.5 font-bold">IP Address</th>
                <th className="px-5 py-3.5 font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {AUDIT_LOGS.map((log) => (
                <tr key={log.id} className="transition-colors hover:bg-secondary/40">
                  <td className="px-5 py-4 font-mono font-bold text-primary">{log.id}</td>
                  <td className="px-5 py-4 text-muted-foreground">{log.timestamp}</td>
                  <td className="px-5 py-4 font-medium text-foreground">{log.method}</td>
                  <td className="px-5 py-4 text-muted-foreground">{log.location}</td>
                  <td className="px-5 py-4 font-mono text-muted-foreground">{log.ip}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
                      log.status === "success" ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-500" : "border-rose-500/20 bg-rose-500/10 text-rose-500"
                    }`}>
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
