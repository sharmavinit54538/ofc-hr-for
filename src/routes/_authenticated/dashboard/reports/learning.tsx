import { createFileRoute } from "@tanstack/react-router";
import { ReportViewLayout } from "@/components/admin/report-view-layout";
import { Inbox } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard/reports/learning")({
  component: LearningReportPage,
});

function LearningReportPage() {
  const kpis = (
    <>
      <div className="glass-tile rounded-2xl p-4">
        <span className="text-xs uppercase font-bold text-muted-foreground">Active Courses</span>
        <div className="font-display text-2xl font-bold text-foreground mt-2">0 Courses</div>
        <p className="text-[10px] text-muted-foreground mt-0.5">Upskilling Hub</p>
      </div>
    </>
  );

  const tableData: any[] = [];

  const columns = [
    { key: "course", label: "Course Name" },
    { key: "category", label: "Domain" },
    { key: "enrolled", label: "Enrolled Staff" },
    { key: "completion", label: "Completion Rate" },
  ];

  return (
    <ReportViewLayout
      title="Learning & Upskilling Metrics Report"
      description="Course enrollment velocity, compliance training completions, and learning hours logged."
      categoryBadge="Learning Report"
      kpiCards={kpis}
      chartsSection={
        tableData.length === 0 ? (
          <div className="glass-tile rounded-2xl p-8 text-center text-xs text-muted-foreground flex flex-col items-center justify-center gap-2">
            <Inbox className="size-8 text-muted-foreground/50" />
            <p className="font-medium text-foreground text-sm">No Active Learning Courses Found</p>
          </div>
        ) : null
      }
      tableColumns={columns}
      tableData={tableData}
    />
  );
}
