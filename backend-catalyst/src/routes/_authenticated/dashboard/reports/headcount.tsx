import { createFileRoute } from "@tanstack/react-router";
import { ReportViewLayout } from "@/components/admin/report-view-layout";
import { Users2, TrendingUp, UserPlus, Building2 } from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  MONTHLY_HEADCOUNT_TREND,
  DEPARTMENT_DISTRIBUTION,
} from "@/lib/reports/mock-data";

export const Route = createFileRoute("/_authenticated/dashboard/reports/headcount")({
  component: HeadcountReportPage,
});

function HeadcountReportPage() {
  const kpis = (
    <>
      <div className="glass-tile rounded-2xl p-4">
        <div className="flex items-center justify-between text-muted-foreground text-xs uppercase font-bold">
          <span>Active Headcount</span>
          <Users2 className="size-4 text-indigo-500" />
        </div>
        <div className="font-display text-2xl font-bold text-foreground mt-2">1,248</div>
        <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">+148 New Joiners YTD</p>
      </div>

      <div className="glass-tile rounded-2xl p-4">
        <div className="flex items-center justify-between text-muted-foreground text-xs uppercase font-bold">
          <span>Net Growth Rate</span>
          <TrendingUp className="size-4 text-emerald-500" />
        </div>
        <div className="font-display text-2xl font-bold text-foreground mt-2">+12.4%</div>
        <p className="text-[10px] text-muted-foreground mt-0.5">Annualized expansion</p>
      </div>

      <div className="glass-tile rounded-2xl p-4">
        <div className="flex items-center justify-between text-muted-foreground text-xs uppercase font-bold">
          <span>Joining Velocity</span>
          <UserPlus className="size-4 text-sky-500" />
        </div>
        <div className="font-display text-2xl font-bold text-foreground mt-2">30 / Mo</div>
        <p className="text-[10px] text-muted-foreground mt-0.5">Average monthly hires</p>
      </div>

      <div className="glass-tile rounded-2xl p-4">
        <div className="flex items-center justify-between text-muted-foreground text-xs uppercase font-bold">
          <span>Departments</span>
          <Building2 className="size-4 text-purple-500" />
        </div>
        <div className="font-display text-2xl font-bold text-foreground mt-2">18 Units</div>
        <p className="text-[10px] text-muted-foreground mt-0.5">Across 8 global campuses</p>
      </div>
    </>
  );

  const charts = (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Line Chart */}
      <div className="glass-tile space-y-3 rounded-2xl p-5">
        <h3 className="font-display text-base font-bold text-foreground">Monthly Headcount Growth Curve</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={MONTHLY_HEADCOUNT_TREND}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="month" stroke="#888888" fontSize={11} />
              <YAxis stroke="#888888" fontSize={11} domain={[1000, 1300]} />
              <Tooltip contentStyle={{ backgroundColor: "#1e1b4b", borderRadius: "12px", fontSize: "12px" }} />
              <Line type="monotone" dataKey="headcount" stroke="#6366f1" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pie Chart */}
      <div className="glass-tile space-y-3 rounded-2xl p-5">
        <h3 className="font-display text-base font-bold text-foreground">Department Headcount Share</h3>
        <div className="h-64 w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={DEPARTMENT_DISTRIBUTION} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {DEPARTMENT_DISTRIBUTION.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: "#1e1b4b", borderRadius: "12px", fontSize: "12px" }} />
              <Legend wrapperStyle={{ fontSize: "11px" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const tableData = [
    { department: "Product Engineering", count: 640, male: 420, female: 220, remotePct: "65%", status: "Active" },
    { department: "Information Technology", count: 210, male: 140, female: 70, remotePct: "40%", status: "Active" },
    { department: "Human Resources", count: 95, male: 30, female: 65, remotePct: "20%", status: "Active" },
    { department: "Finance Operations", count: 140, male: 80, female: 60, remotePct: "30%", status: "Active" },
    { department: "Executive Office", count: 45, male: 25, female: 20, remotePct: "10%", status: "Active" },
  ];

  const columns = [
    { key: "department", label: "Department" },
    { key: "count", label: "Total Headcount" },
    { key: "male", label: "Male Staff" },
    { key: "female", label: "Female Staff" },
    { key: "remotePct", label: "Remote Ratio" },
  ];

  return (
    <ReportViewLayout
      title="Headcount & Workforce Demographics"
      description="Detailed headcount expansion metrics, gender balance, remote ratios, and business unit distribution."
      categoryBadge="Headcount Analytics"
      kpiCards={kpis}
      chartsSection={charts}
      tableColumns={columns}
      tableData={tableData}
    />
  );
}
