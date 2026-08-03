import { createFileRoute } from "@tanstack/react-router";
import { ReportViewLayout } from "@/components/admin/report-view-layout";
import { TrendingDown, Users, AlertTriangle, CheckCircle2 } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export const Route = createFileRoute("/_authenticated/dashboard/reports/attrition")({
  component: AttritionReportPage,
});

function AttritionReportPage() {
  const kpis = (
    <>
      <div className="glass-tile rounded-2xl p-4">
        <span className="text-xs uppercase font-bold text-muted-foreground">Annualized Attrition Rate</span>
        <div className="font-display text-2xl font-bold text-foreground mt-2">4.2%</div>
        <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">Top Decile Retention</p>
      </div>

      <div className="glass-tile rounded-2xl p-4">
        <span className="text-xs uppercase font-bold text-muted-foreground">Voluntary Exits YTD</span>
        <div className="font-display text-2xl font-bold text-foreground mt-2">42 Staff</div>
        <p className="text-[10px] text-muted-foreground mt-0.5">Primary Reason: Higher Education</p>
      </div>

      <div className="glass-tile rounded-2xl p-4">
        <span className="text-xs uppercase font-bold text-muted-foreground">Involuntary Turnover</span>
        <div className="font-display text-2xl font-bold text-foreground mt-2">12 Staff</div>
        <p className="text-[10px] text-muted-foreground mt-0.5">Performance Calibration</p>
      </div>

      <div className="glass-tile rounded-2xl p-4">
        <span className="text-xs uppercase font-bold text-muted-foreground">Early Flight Risk Flagged</span>
        <div className="font-display text-2xl font-bold text-foreground mt-2">5 Staff</div>
        <p className="text-[10px] text-amber-400 font-semibold mt-0.5">AI Sentiment Prediction</p>
      </div>
    </>
  );

  const exitReasons = [
    { reason: "Higher Compensation Offer", count: 18 },
    { reason: "Career Growth / Relocation", count: 12 },
    { reason: "Higher Education / Upskilling", count: 8 },
    { reason: "Personal / Family Reasons", count: 4 },
  ];

  const charts = (
    <div className="glass-tile space-y-3 rounded-2xl p-5">
      <h3 className="font-display text-base font-bold text-foreground">Exit Interview Primary Reasons</h3>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={exitReasons}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis dataKey="reason" stroke="#888888" fontSize={11} />
            <YAxis stroke="#888888" fontSize={11} />
            <Tooltip contentStyle={{ backgroundColor: "#1e1b4b", borderRadius: "12px", fontSize: "12px" }} />
            <Bar dataKey="count" fill="#f43f5e" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  const mockAttritionDept = [
    { department: "Product Engineering", headcount: 640, exitsYtd: 20, attritionPct: "3.1%", riskLevel: "Low" },
    { department: "Finance Operations", headcount: 140, exitsYtd: 7, attritionPct: "5.0%", riskLevel: "Medium" },
    { department: "Customer Success", headcount: 180, exitsYtd: 12, attritionPct: "6.6%", riskLevel: "Medium" },
    { department: "Human Resources", headcount: 95, exitsYtd: 1, attritionPct: "1.0%", riskLevel: "Low" },
  ];

  const columns = [
    { key: "department", label: "Department" },
    { key: "headcount", label: "Active Headcount" },
    { key: "exitsYtd", label: "Exits YTD" },
    { key: "attritionPct", label: "Attrition %" },
    { key: "riskLevel", label: "Flight Risk Warning" },
  ];

  return (
    <ReportViewLayout
      title="Attrition Analytics & Flight Risk Report"
      description="Workforce turnover trends, exit interview reasons, department attrition comparisons, and AI predictive flight risk indicators."
      categoryBadge="Attrition Report"
      kpiCards={kpis}
      chartsSection={charts}
      tableColumns={columns}
      tableData={mockAttritionDept}
    />
  );
}
