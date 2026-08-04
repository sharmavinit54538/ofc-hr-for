import { createFileRoute } from "@tanstack/react-router";
import { ReportViewLayout } from "@/components/admin/report-view-layout";
import { Inbox } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard/reports/onboarding")({
  component: OnboardingReportPage,
});

function OnboardingReportPage() {
  const kpis = (
    <>
      <div className="glass-tile rounded-2xl p-4">
        <span className="text-xs uppercase font-bold text-muted-foreground">Active Onboarding</span>
        <div className="font-display text-2xl font-bold text-foreground mt-2">0 Hires</div>
        <p className="text-[10px] text-muted-foreground mt-0.5">Verification Pipeline</p>
      </div>
    </>
  );

  const tableData: any[] = [];

  const columns = [
    { key: "candidate", label: "New Joiner Name" },
    { key: "role", label: "Designation" },
    { key: "department", label: "Department" },
    { key: "progress", label: "Checklist Progress" },
    { key: "status", label: "Status" },
  ];

  return (
    <ReportViewLayout
      title="New Hire Onboarding Tracker Report"
      description="Orientation progress, verification document completion, hardware dispatch, and 30-day onboarding milestones."
      categoryBadge="Onboarding Report"
      kpiCards={kpis}
      chartsSection={
        tableData.length === 0 ? (
          <div className="glass-tile rounded-2xl p-8 text-center text-xs text-muted-foreground flex flex-col items-center justify-center gap-2">
            <Inbox className="size-8 text-muted-foreground/50" />
            <p className="font-medium text-foreground text-sm">No Active Onboarding Trackers Found</p>
          </div>
        ) : null
      }
      tableColumns={columns}
      tableData={tableData}
    />
  );
}
