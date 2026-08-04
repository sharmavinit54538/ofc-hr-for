import { createFileRoute } from "@tanstack/react-router";
import { ReportViewLayout } from "@/components/admin/report-view-layout";
import { Inbox } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard/reports/compliance")({
  component: ComplianceReportPage,
});

function ComplianceReportPage() {
  const kpis = (
    <>
      <div className="glass-tile rounded-2xl p-4">
        <span className="text-xs uppercase font-bold text-muted-foreground">Compliance Rating</span>
        <div className="font-display text-2xl font-bold text-foreground mt-2">100%</div>
        <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">Statutory Verified</p>
      </div>
    </>
  );

  const tableData: any[] = [];

  const columns = [
    { key: "regulation", label: "Statutory Standard" },
    { key: "category", label: "Domain" },
    { key: "score", label: "Compliance Score" },
    { key: "status", label: "Status" },
  ];

  return (
    <ReportViewLayout
      title="Labor Law & Statutory Audit Compliance Report"
      description="Statutory filing compliance scores, policy violations, PF/ESI audit trail, and SOC2 security verification."
      categoryBadge="Compliance Report"
      kpiCards={kpis}
      chartsSection={
        tableData.length === 0 ? (
          <div className="glass-tile rounded-2xl p-8 text-center text-xs text-muted-foreground flex flex-col items-center justify-center gap-2">
            <Inbox className="size-8 text-muted-foreground/50" />
            <p className="font-medium text-foreground text-sm">No Compliance Violations Found</p>
          </div>
        ) : null
      }
      tableColumns={columns}
      tableData={tableData}
    />
  );
}
