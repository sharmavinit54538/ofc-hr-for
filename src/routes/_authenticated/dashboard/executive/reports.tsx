import { createFileRoute } from "@tanstack/react-router";
import { Download, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";
import { useExportEmployeesMutation } from "@/services/employeeApi";

export const Route = createFileRoute("/_authenticated/dashboard/executive/reports")({
  component: ExecutiveReportsPage,
});

function ExecutiveReportsPage() {
  const [exportEmployees, { isLoading: isExporting }] = useExportEmployeesMutation();

  const handleExport = async (format: "csv" | "excel" | "pdf", reportName: string) => {
    try {
      toast.info(`Generating ${reportName}...`);
      const blob = await exportEmployees({ format }).unwrap();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `executive-${reportName.toLowerCase().replace(/[^a-z0-9]/g, "-")}.${format === "excel" ? "xlsx" : format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success(`${reportName} downloaded successfully!`);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to export report.");
    }
  };

  const reports = [
    { title: "Organization Workforce Directory Report", type: "Full Directory", format: "excel" as const },
    { title: "Department Headcount & Budget Allocation Report", type: "Financial & Org", format: "csv" as const },
    { title: "Executive Personnel Audit Export", type: "Security & Governance", format: "pdf" as const },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Executive Reports & Export Intelligence"
        description="Generate and download live C-level workforce summaries, organization exports, and database audits."
        breadcrumbs={[{ label: "Executive", href: "/dashboard/executive" }, { label: "Reports" }]}
        backHref="/dashboard/executive"
      />

      <div className="grid gap-4 sm:grid-cols-3">
        {reports.map((r) => (
          <div key={r.title} className="glass-tile rounded-2xl p-5 flex flex-col justify-between space-y-4">
            <div>
              <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold text-primary mb-2">
                {r.type}
              </span>
              <h3 className="font-display text-sm font-bold text-foreground leading-snug">{r.title}</h3>
            </div>
            <button
              disabled={isExporting}
              onClick={() => handleExport(r.format, r.title)}
              className="glass-tile w-full inline-flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-semibold hover:bg-secondary transition-all disabled:opacity-50"
            >
              {isExporting ? <Loader2 className="size-3.5 animate-spin" /> : <Download className="size-3.5 text-primary" />}
              Export ({r.format.toUpperCase()})
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
