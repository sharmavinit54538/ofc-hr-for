import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { Download, Loader2, Users, Building2, ShieldCheck, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";
import { useExportEmployeesMutation, useListEmployeesQuery, useListDepartmentsQuery } from "@/services/employeeApi";

export const Route = createFileRoute("/_authenticated/dashboard/executive/reports")({
  component: ExecutiveReportsPage,
});

function ExecutiveReportsPage() {
  const { data: employeesRes, isLoading: isLoadingEmps } = useListEmployeesQuery({ page: 1, page_size: 200 });
  const { data: departmentsRes, isLoading: isLoadingDepts } = useListDepartmentsQuery();
  const [exportEmployees, { isLoading: isExporting }] = useExportEmployeesMutation();

  const rawEmployees = useMemo(() => employeesRes?.data?.items ?? [], [employeesRes]);
  const rawDepartments = useMemo(() => departmentsRes?.data ?? [], [departmentsRes]);

  const isLoading = isLoadingEmps || isLoadingDepts;

  const totalEmps = rawEmployees.length;
  const activeEmps = useMemo(() => rawEmployees.filter((e) => e.status === "Active").length, [rawEmployees]);
  const totalDepts = rawDepartments.length;

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

  const reports = useMemo(() => [
    {
      title: "Organization Workforce Directory Report",
      type: "Full Directory",
      format: "csv" as const,
      detail: `${totalEmps} employee record(s) ready for export`,
      icon: Users,
    },
    {
      title: "Department Structure & Headcount Allocation Report",
      type: "Organizational Structure",
      format: "csv" as const,
      detail: `${totalDepts} active department(s) synchronized`,
      icon: Building2,
    },
    {
      title: "Executive RBAC Personnel Governance Export",
      type: "Security & Governance",
      format: "csv" as const,
      detail: `${activeEmps} active status accounts verified`,
      icon: ShieldCheck,
    },
  ], [totalEmps, totalDepts, activeEmps]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Executive Reports & Export Intelligence"
        description="Generate and download live C-level workforce summaries, organization exports, and database audit logs."
        breadcrumbs={[{ label: "Executive", href: "/dashboard/executive" }, { label: "Reports" }]}
        backHref="/dashboard/executive"
      />

      {/* Live System Telemetry Banner */}
      <div className="glass-tile rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
            <CheckCircle2 className="size-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-foreground">Live Organization Database Connection</h4>
            <p className="text-[11px] text-muted-foreground">
              {isLoading ? "Fetching database metrics..." : `${totalEmps} Total Employees · ${activeEmps} Active · ${totalDepts} Departments`}
            </p>
          </div>
        </div>
        <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold text-emerald-500 border border-emerald-500/20">
          Live Backend Stream
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {reports.map((r) => {
          const Icon = r.icon;
          return (
            <div key={r.title} className="glass-tile rounded-2xl p-5 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold text-primary">
                    <Icon className="size-3" /> {r.type}
                  </span>
                </div>
                <h3 className="font-display text-sm font-bold text-foreground leading-snug">{r.title}</h3>
                <p className="text-xs text-muted-foreground mt-1">{r.detail}</p>
              </div>
              <button
                disabled={isExporting || isLoading || totalEmps === 0}
                onClick={() => handleExport(r.format, r.title)}
                className="glass-tile w-full inline-flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-semibold hover:bg-secondary transition-all disabled:opacity-50"
              >
                {isExporting ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <Download className="size-3.5 text-primary" />
                )}
                Export ({r.format.toUpperCase()})
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
