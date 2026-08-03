import { createFileRoute } from "@tanstack/react-router";
import { ReportViewLayout } from "@/components/admin/report-view-layout";
import { History, Shield, Lock, FileLock } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard/reports/audit")({
  component: AuditLogsReportPage,
});

function AuditLogsReportPage() {
  const kpis = (
    <>
      <div className="glass-tile rounded-2xl p-4">
        <span className="text-xs uppercase font-bold text-muted-foreground">Total Audit Events</span>
        <div className="font-display text-2xl font-bold text-foreground mt-2">142,800 Logs</div>
        <p className="text-[10px] text-muted-foreground mt-0.5">Immutable Ledger</p>
      </div>

      <div className="glass-tile rounded-2xl p-4">
        <span className="text-xs uppercase font-bold text-muted-foreground">Admin Actions Today</span>
        <div className="font-display text-2xl font-bold text-foreground mt-2">480 Events</div>
        <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">100% Authorized</p>
      </div>

      <div className="glass-tile rounded-2xl p-4">
        <span className="text-xs uppercase font-bold text-muted-foreground">Security Violations</span>
        <div className="font-display text-2xl font-bold text-foreground mt-2">0 Alerts</div>
        <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">SOC2 Compliant</p>
      </div>

      <div className="glass-tile rounded-2xl p-4">
        <span className="text-xs uppercase font-bold text-muted-foreground">Log Retention Policy</span>
        <div className="font-display text-2xl font-bold text-foreground mt-2">7 Years</div>
        <p className="text-[10px] text-muted-foreground mt-0.5">Encrypted AWS S3 Glacier</p>
      </div>
    </>
  );

  const mockAuditLogs = [
    { timestamp: "2026-08-02 10:14:22", actor: "Aarav Mehta (HR Admin)", action: "UPDATE_EMPLOYEE_ROLE", target: "NW-1042 (Aarav S.)", ipAddress: "14.99.120.4", status: "Success" },
    { timestamp: "2026-08-02 09:45:10", actor: "Priya N. (IT Admin)", action: "ASSIGN_ASSET_HARDWARE", target: "AST-8841 (MacBook)", ipAddress: "106.51.88.14", status: "Success" },
    { timestamp: "2026-08-02 08:30:00", actor: "System Automated Engine", action: "PAYROLL_TDS_CALCULATION", target: "Aug 2026 Batch", ipAddress: "127.0.0.1", status: "Success" },
  ];

  const columns = [
    { key: "timestamp", label: "Event Timestamp" },
    { key: "actor", label: "User / Actor" },
    { key: "action", label: "System Operation" },
    { key: "target", label: "Target Entity" },
    { key: "ipAddress", label: "IP Address" },
    { key: "status", label: "Result" },
  ];

  return (
    <ReportViewLayout
      title="System Security & Access Audit Log Report"
      description="Immutable administrative action history, role-based permission changes, data modification logs, and security compliance verification."
      categoryBadge="Audit Logs Report"
      kpiCards={kpis}
      tableColumns={columns}
      tableData={mockAuditLogs}
    />
  );
}
