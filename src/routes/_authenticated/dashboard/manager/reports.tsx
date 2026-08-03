import { createFileRoute } from "@tanstack/react-router";
import { BarChart3, Download } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";

export const Route = createFileRoute("/_authenticated/dashboard/manager/reports")({
  component: ManagerReportsPage,
});

interface ReportItem {
  title: string;
  type: string;
  format: string;
  metric: string;
}

function ManagerReportsPage() {
  const reports: ReportItem[] = [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Team Analytics & Reports"
        description="Download team productivity, attendance, and goal completion reports for management reviews."
        breadcrumbs={[{ label: "Manager", href: "/dashboard/manager" }, { label: "Reports" }]}
        backHref="/dashboard/manager"
      />

      {reports.length === 0 ? (
        <div className="glass-tile flex flex-col items-center justify-center p-12 text-center rounded-2xl space-y-3">
          <BarChart3 className="size-10 text-muted-foreground/60" />
          <h3 className="font-display text-base font-bold text-foreground">No Analytics Reports Available</h3>
          <p className="text-xs text-muted-foreground max-w-sm">
            Quarterly attendance, performance telemetry, and leave consumption reports will appear here when generated.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {reports.map((r) => (
            <div key={r.title} className="glass-tile rounded-2xl p-5 space-y-3 justify-between flex flex-col">
              <div>
                <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold text-primary mb-2">
                  {r.type}
                </span>
                <h3 className="font-display text-sm font-bold text-foreground">{r.title}</h3>
                <p className="text-xs text-muted-foreground mt-1">Telemetry metric: <strong className="text-primary">{r.metric}</strong></p>
              </div>
              <button
                onClick={() => toast.success(`Exporting ${r.title}`)}
                className="glass-tile w-full mt-2 inline-flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-semibold hover:bg-secondary"
              >
                <Download className="size-3.5" /> Export Report ({r.format})
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
