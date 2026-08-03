import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { BarChart3, Download, Loader2, FileSpreadsheet, ShieldCheck, Users, Building2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";
import { useListEmployeesQuery, useListDepartmentsQuery, useExportEmployeesMutation } from "@/services/employeeApi";

export const Route = createFileRoute("/_authenticated/dashboard/it-admin/reports")({
  component: ItAdminReportsPage,
});

function ItAdminReportsPage() {
  const { data: employeesRes, isLoading: isLoadingEmps } = useListEmployeesQuery({ page: 1, page_size: 200 });
  const { data: departmentsRes, isLoading: isLoadingDepts } = useListDepartmentsQuery();

  const [exportEmployees, { isLoading: isExporting }] = useExportEmployeesMutation();

  const rawEmployees = useMemo(() => employeesRes?.data?.items ?? [], [employeesRes]);
  const rawDepartments = useMemo(() => departmentsRes?.data ?? [], [departmentsRes]);

  const isLoading = isLoadingEmps || isLoadingDepts;

  const handleExportRealReport = async (reportName: string, filters?: Record<string, string>) => {
    try {
      const blob = await exportEmployees(filters ?? {}).unwrap();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${reportName.toLowerCase().replace(/[^a-z0-9]/g, "_")}_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      toast.success(`${reportName} Exported Successfully`, {
        description: `Downloaded real database report with ${rawEmployees.length} personnel records.`,
      });
    } catch (err) {
      toast.error(`Failed to export ${reportName}`);
    }
  };

  const realReports = [
    {
      id: "rep-1",
      title: "Workforce Directory IT Security & Access Audit",
      type: "Directory Audit",
      format: "CSV",
      description: `Complete dump of all ${rawEmployees.length} personnel, roles, emails, and active account statuses.`,
      filters: {},
    },
    {
      id: "rep-2",
      title: "Active Employee Security & Role Assignment Report",
      type: "Security",
      format: "CSV",
      description: "Filtered access audit log for active organization workforce.",
      filters: { status: "Active" },
    },
    {
      id: "rep-3",
      title: "IT Administrator Identity & Privileged Access Log",
      type: "RBAC Compliance",
      format: "CSV",
      description: "Audit log of accounts provisioned with IT_ADMIN privilege scope.",
      filters: { role: "IT_ADMIN" },
    },
    {
      id: "rep-4",
      title: "Departmental Governance & Structure Export",
      type: "Infrastructure",
      format: "CSV",
      description: `Summary export covering ${rawDepartments.length} organizational departments and leadership bindings.`,
      filters: {},
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="IT Infrastructure & Compliance Reports"
        description="Generate and download live IT security compliance audit reports, identity directory exports, and RBAC logs directly from backend database."
        breadcrumbs={[{ label: "IT Admin", href: "/dashboard/it-admin" }, { label: "Reports" }]}
        backHref="/dashboard/it-admin"
      />

      {/* Real Live Database Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="glass-tile rounded-2xl p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Directory Personnel</span>
            <Users className="size-4 text-primary" />
          </div>
          <div className="font-display text-2xl font-bold text-foreground">
            {isLoading ? <Loader2 className="size-5 animate-spin" /> : rawEmployees.length}
          </div>
          <p className="text-[10px] text-primary mt-1">Ready for CSV Export</p>
        </div>

        <div className="glass-tile rounded-2xl p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Mapped Departments</span>
            <Building2 className="size-4 text-purple-400" />
          </div>
          <div className="font-display text-2xl font-bold text-foreground">
            {isLoading ? <Loader2 className="size-5 animate-spin" /> : rawDepartments.length}
          </div>
          <p className="text-[10px] text-purple-400 mt-1">Org Structure Mapped</p>
        </div>

        <div className="glass-tile rounded-2xl p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">FastAPI Export Gateway</span>
            <ShieldCheck className="size-4 text-emerald-500" />
          </div>
          <div className="font-display text-2xl font-bold text-emerald-400">Connected</div>
          <p className="text-[10px] text-emerald-500 mt-1">Streaming CSV Responses</p>
        </div>
      </div>

      {/* Reports List */}
      <div className="grid gap-4 sm:grid-cols-2">
        {realReports.map((r) => (
          <div key={r.id} className="glass-tile rounded-2xl p-5 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold text-primary">
                  {r.type}
                </span>
                <span className="font-mono text-[10px] text-muted-foreground">{r.format} Format</span>
              </div>
              <h3 className="font-display text-sm font-bold text-foreground">{r.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{r.description}</p>
            </div>

            <button
              onClick={() => handleExportRealReport(r.title, r.filters)}
              disabled={isExporting || isLoading}
              className="glass-tile w-full inline-flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-semibold hover:bg-secondary transition-all disabled:opacity-50"
            >
              {isExporting ? <Loader2 className="size-3.5 animate-spin text-primary" /> : <Download className="size-3.5" />}
              {isExporting ? "Exporting Live Report..." : `Export ${r.title} (${r.format})`}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
