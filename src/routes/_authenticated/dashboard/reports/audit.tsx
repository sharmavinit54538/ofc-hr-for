import { createFileRoute } from "@tanstack/react-router";
import { ReportViewLayout } from "@/components/admin/report-view-layout";
import { Loader2, Inbox } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard/reports/audit")({
  component: AuditReportPage,
});

function AuditReportPage() {
  const kpis = (
    <>
      <div className="glass-tile rounded-2xl p-4">
        <span className="text-xs uppercase font-bold text-muted-foreground">Admin Actions Logged</span>
        <div className="font-display text-2xl font-bold text-foreground mt-2">0 Logs</div>
        <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">Audit Trail Active</p>
      </div>
    </>
  );

  const tableData: any[] = [];

  const columns = [
    { key: "timestamp", label: "Timestamp" },
    { key: "actor", label: "Performed By" },
    { key: "action", label: "Action Description" },
    { key: "target", label: "Target Resource" },
  ];

  return (
    <ReportViewLayout
      title="System Security Audit Log Report"
      description="Immutable admin action history, data access events, role modification logs, and SOC2 audit compliance."
      categoryBadge="Audit Report"
      kpiCards={kpis}
      chartsSection={
        tableData.length === 0 ? (
          <div className="glass-tile rounded-2xl p-8 text-center text-xs text-muted-foreground flex flex-col items-center justify-center gap-2">
            <Inbox className="size-8 text-muted-foreground/50" />
            <p className="font-medium text-foreground text-sm">No Security Audit Logs Found</p>
          </div>
        ) : null
      }
      tableColumns={columns}
      tableData={tableData}
    />
  );
}
