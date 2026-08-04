import { createFileRoute } from "@tanstack/react-router";
import { ReportViewLayout } from "@/components/admin/report-view-layout";
import { Users2, TrendingUp, UserPlus, Building2, Loader2 } from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import { useGetHeadcountReportQuery } from "@/services/reportsApi";

export const Route = createFileRoute("/_authenticated/dashboard/reports/headcount")({
  component: HeadcountReportPage,
});

function HeadcountReportPage() {
  const { data: headcountRes, isLoading } = useGetHeadcountReportQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const data = headcountRes?.data;
  const totalHeadcount = data?.total_headcount ?? 0;
  const activeCount = data?.active_employees ?? 0;
  const deptDist = data?.department_distribution ?? [];

  const COLORS = ["#6366f1", "#06b6d4", "#a855f7", "#10b981", "#f59e0b", "#ef4444"];

  const kpis = (
    <>
      <div className="glass-tile rounded-2xl p-4">
        <div className="flex items-center justify-between text-muted-foreground text-xs uppercase font-bold">
          <span>Active Headcount</span>
          <Users2 className="size-4 text-indigo-500" />
        </div>
        <div className="font-display text-2xl font-bold text-foreground mt-2">{activeCount}</div>
        <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">Active Workforce</p>
      </div>

      <div className="glass-tile rounded-2xl p-4">
        <div className="flex items-center justify-between text-muted-foreground text-xs uppercase font-bold">
          <span>Total Registered</span>
          <TrendingUp className="size-4 text-emerald-500" />
        </div>
        <div className="font-display text-2xl font-bold text-foreground mt-2">{totalHeadcount}</div>
        <p className="text-[10px] text-muted-foreground mt-0.5">Database records</p>
      </div>

      <div className="glass-tile rounded-2xl p-4">
        <div className="flex items-center justify-between text-muted-foreground text-xs uppercase font-bold">
          <span>Inactive Accounts</span>
          <UserPlus className="size-4 text-sky-500" />
        </div>
        <div className="font-display text-2xl font-bold text-foreground mt-2">{data?.inactive_employees ?? 0}</div>
        <p className="text-[10px] text-muted-foreground mt-0.5">Deactivated / Exit</p>
      </div>

      <div className="glass-tile rounded-2xl p-4">
        <div className="flex items-center justify-between text-muted-foreground text-xs uppercase font-bold">
          <span>Departments</span>
          <Building2 className="size-4 text-purple-500" />
        </div>
        <div className="font-display text-2xl font-bold text-foreground mt-2">{deptDist.length} Units</div>
        <p className="text-[10px] text-muted-foreground mt-0.5">Org Divisions</p>
      </div>
    </>
  );

  const charts = (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Pie Chart */}
      <div className="glass-tile space-y-3 rounded-2xl p-5 lg:col-span-2">
        <h3 className="font-display text-base font-bold text-foreground">Department Headcount Share</h3>
        {isLoading ? (
          <div className="h-64 flex items-center justify-center text-xs text-muted-foreground gap-2">
            <Loader2 className="size-5 animate-spin text-primary" /> Loading headcount telemetry...
          </div>
        ) : deptDist.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-xs text-muted-foreground">
            No department distribution data available.
          </div>
        ) : (
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={deptDist} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {deptDist.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "#1e1b4b", borderRadius: "12px", fontSize: "12px" }} />
                <Legend wrapperStyle={{ fontSize: "11px" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );

  const columns = [
    { key: "name", label: "Department Name" },
    { key: "count", label: "Total Headcount" },
  ];

  return (
    <ReportViewLayout
      title="Headcount & Workforce Demographics"
      description="Detailed headcount expansion metrics, gender balance, remote ratios, and business unit distribution."
      categoryBadge="Headcount Analytics"
      kpiCards={kpis}
      chartsSection={charts}
      tableColumns={columns}
      tableData={deptDist}
    />
  );
}
