import { createFileRoute } from "@tanstack/react-router";
import { ReportViewLayout } from "@/components/admin/report-view-layout";
import {
  Users,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  Sparkles,
  UserPlus,
  Briefcase,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";
import { MONTHLY_HEADCOUNT_TREND, AI_IMPACT_METRICS } from "@/lib/reports/mock-data";

export const Route = createFileRoute("/_authenticated/dashboard/reports/executive")({
  component: ExecutiveReportPage,
});

function ExecutiveReportPage() {
  const kpis = (
    <>
      <div className="glass-tile rounded-2xl p-4">
        <div className="flex items-center justify-between text-muted-foreground text-xs uppercase font-bold">
          <span>Total Workforce</span>
          <Users className="size-4 text-indigo-500" />
        </div>
        <div className="font-display text-2xl font-bold text-foreground mt-2">1,248</div>
        <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">+12% YoY Expansion</p>
      </div>

      <div className="glass-tile rounded-2xl p-4">
        <div className="flex items-center justify-between text-muted-foreground text-xs uppercase font-bold">
          <span>Est. Monthly Payroll</span>
          <DollarSign className="size-4 text-emerald-500" />
        </div>
        <div className="font-display text-2xl font-bold text-foreground mt-2">$482,500</div>
        <p className="text-[10px] text-muted-foreground mt-0.5">Aug 2026 Run</p>
      </div>

      <div className="glass-tile rounded-2xl p-4">
        <div className="flex items-center justify-between text-muted-foreground text-xs uppercase font-bold">
          <span>Annual Attrition</span>
          <TrendingUp className="size-4 text-amber-500" />
        </div>
        <div className="font-display text-2xl font-bold text-foreground mt-2">4.2%</div>
        <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">-1.8% vs Industry Benchmark</p>
      </div>

      <div className="glass-tile rounded-2xl p-4">
        <div className="flex items-center justify-between text-muted-foreground text-xs uppercase font-bold">
          <span>Compliance Index</span>
          <ShieldCheck className="size-4 text-purple-500" />
        </div>
        <div className="font-display text-2xl font-bold text-foreground mt-2">99.8%</div>
        <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">SOC2 & Statutory Verified</p>
      </div>
    </>
  );

  const charts = (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Headcount vs Payroll Area Chart */}
      <div className="glass-tile space-y-3 rounded-2xl p-5">
        <h3 className="font-display text-base font-bold text-foreground">
          Workforce Growth vs Payroll Expense ($)
        </h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={MONTHLY_HEADCOUNT_TREND}>
              <defs>
                <linearGradient id="payrollGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="month" stroke="#888888" fontSize={11} />
              <YAxis stroke="#888888" fontSize={11} />
              <Tooltip
                contentStyle={{ backgroundColor: "#1e1b4b", borderColor: "#4338ca", borderRadius: "12px", fontSize: "12px" }}
              />
              <Area type="monotone" dataKey="payrollCost" name="Payroll Cost ($)" stroke="#6366f1" fillOpacity={1} fill="url(#payrollGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Workforce Impact Bar Chart */}
      <div className="glass-tile space-y-3 rounded-2xl p-5">
        <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2">
          <Sparkles className="size-4 text-primary" /> Autonomous AI Tasks Completed
        </h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={AI_IMPACT_METRICS}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="month" stroke="#888888" fontSize={11} />
              <YAxis stroke="#888888" fontSize={11} />
              <Tooltip
                contentStyle={{ backgroundColor: "#1e1b4b", borderColor: "#4338ca", borderRadius: "12px", fontSize: "12px" }}
              />
              <Bar dataKey="tasksAutomated" name="Tasks Completed" fill="#10b981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const mockExecData = [
    { department: "Product Engineering", headcount: 640, hiresThisQuarter: 48, attritionPct: "3.1%", payrollMonthly: "$280,000", aiOpsCompleted: 1240, status: "Active" },
    { department: "Information Technology", headcount: 210, hiresThisQuarter: 18, attritionPct: "2.4%", payrollMonthly: "$95,000", aiOpsCompleted: 680, status: "Active" },
    { department: "Human Resources", headcount: 95, hiresThisQuarter: 6, attritionPct: "1.2%", payrollMonthly: "$42,000", aiOpsCompleted: 350, status: "Active" },
    { department: "Finance Operations", headcount: 140, hiresThisQuarter: 12, attritionPct: "4.8%", payrollMonthly: "$68,000", aiOpsCompleted: 420, status: "Active" },
    { department: "Executive Office", headcount: 45, hiresThisQuarter: 2, attritionPct: "0.0%", payrollMonthly: "$55,000", aiOpsCompleted: 110, status: "Active" },
  ];

  const columns = [
    { key: "department", label: "Business Unit / Department" },
    { key: "headcount", label: "Headcount" },
    { key: "hiresThisQuarter", label: "Q3 Hires" },
    { key: "attritionPct", label: "Attrition Rate" },
    { key: "payrollMonthly", label: "Monthly Payroll" },
    { key: "aiOpsCompleted", label: "AI Ops Automated" },
  ];

  return (
    <ReportViewLayout
      title="Executive Summary & Strategic C-Suite Report"
      description="Holistic enterprise dashboard detailing headcount expansion, payroll commitment, attrition velocity, and AI workforce automation metrics."
      categoryBadge="Executive Report"
      kpiCards={kpis}
      chartsSection={charts}
      tableColumns={columns}
      tableData={mockExecData}
    />
  );
}
