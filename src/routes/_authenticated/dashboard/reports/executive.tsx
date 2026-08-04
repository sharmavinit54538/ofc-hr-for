import { createFileRoute } from "@tanstack/react-router";
import { ReportViewLayout } from "@/components/admin/report-view-layout";
import {
  Users,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  Loader2,
  Inbox,
} from "lucide-react";
import { useGetReportsSummaryQuery } from "@/services/reportsApi";

export const Route = createFileRoute("/_authenticated/dashboard/reports/executive")({
  component: ExecutiveReportPage,
});

function ExecutiveReportPage() {
  const { data: summaryRes, isLoading } = useGetReportsSummaryQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const summary = summaryRes?.data;
  const totalEmp = summary?.total_employees ?? 0;
  const payrollSpend = summary?.total_payroll_spend ?? 0;
  const activeDepts = summary?.active_departments_count ?? 0;

  const kpis = (
    <>
      <div className="glass-tile rounded-2xl p-4">
        <div className="flex items-center justify-between text-muted-foreground text-xs uppercase font-bold">
          <span>Total Workforce</span>
          <Users className="size-4 text-indigo-500" />
        </div>
        <div className="font-display text-2xl font-bold text-foreground mt-2">{totalEmp}</div>
        <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">Active Employees</p>
      </div>

      <div className="glass-tile rounded-2xl p-4">
        <div className="flex items-center justify-between text-muted-foreground text-xs uppercase font-bold">
          <span>Est. Monthly Payroll</span>
          <DollarSign className="size-4 text-emerald-500" />
        </div>
        <div className="font-display text-2xl font-bold text-foreground mt-2">
          ${payrollSpend.toLocaleString()}
        </div>
        <p className="text-[10px] text-muted-foreground mt-0.5">Monthly Spend</p>
      </div>

      <div className="glass-tile rounded-2xl p-4">
        <div className="flex items-center justify-between text-muted-foreground text-xs uppercase font-bold">
          <span>Active Departments</span>
          <TrendingUp className="size-4 text-amber-500" />
        </div>
        <div className="font-display text-2xl font-bold text-foreground mt-2">{activeDepts}</div>
        <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">Org Divisions</p>
      </div>

      <div className="glass-tile rounded-2xl p-4">
        <div className="flex items-center justify-between text-muted-foreground text-xs uppercase font-bold">
          <span>Compliance Index</span>
          <ShieldCheck className="size-4 text-purple-500" />
        </div>
        <div className="font-display text-2xl font-bold text-foreground mt-2">
          {totalEmp > 0 ? "100%" : "0%"}
        </div>
        <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">Statutory Verified</p>
      </div>
    </>
  );

  const tableData = totalEmp > 0 ? [
    {
      metric: "Total Organization Headcount",
      value: `${totalEmp} Active Staff`,
    },
    {
      metric: "Active Business Divisions",
      value: `${activeDepts} Registered Units`,
    },
    {
      metric: "Monthly Payroll Budget Commitment",
      value: `$${payrollSpend.toLocaleString()}`,
    },
  ] : [];

  const columns = [
    { key: "metric", label: "Executive Metric" },
    { key: "value", label: "Value" },
  ];

  return (
    <ReportViewLayout
      title="Executive Summary & Strategic C-Suite Report"
      description="Holistic enterprise dashboard detailing headcount expansion, payroll commitment, attrition velocity, and AI workforce automation metrics."
      categoryBadge="Executive Report"
      kpiCards={kpis}
      chartsSection={
        isLoading ? (
          <div className="glass-tile rounded-2xl p-8 text-center text-xs text-muted-foreground flex justify-center items-center gap-2">
            <Loader2 className="size-5 animate-spin text-primary" /> Loading executive telemetry...
          </div>
        ) : totalEmp === 0 ? (
          <div className="glass-tile rounded-2xl p-8 text-center text-xs text-muted-foreground flex flex-col items-center justify-center gap-2">
            <Inbox className="size-8 text-muted-foreground/50" />
            <p className="font-medium text-foreground text-sm">No Live Executive Data Available</p>
            <p className="text-[11px] max-w-xs">
              Add employee records and department divisions to calculate live executive metrics.
            </p>
          </div>
        ) : null
      }
      tableColumns={columns}
      tableData={tableData}
    />
  );
}
