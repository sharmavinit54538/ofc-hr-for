import { createFileRoute } from "@tanstack/react-router";
import { ReportViewLayout } from "@/components/admin/report-view-layout";
import { Award, Target, MessageSquare, TrendingUp } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export const Route = createFileRoute("/_authenticated/dashboard/reports/performance")({
  component: PerformanceReportPage,
});

function PerformanceReportPage() {
  const kpis = (
    <>
      <div className="glass-tile rounded-2xl p-4">
        <span className="text-xs uppercase font-bold text-muted-foreground">OKR Target Progress</span>
        <div className="font-display text-2xl font-bold text-foreground mt-2">84.2%</div>
        <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">Q3 Targets On Track</p>
      </div>

      <div className="glass-tile rounded-2xl p-4">
        <span className="text-xs uppercase font-bold text-muted-foreground">Active Review Cycle</span>
        <div className="font-display text-2xl font-bold text-foreground mt-2">H2 Appraisals</div>
        <p className="text-[10px] text-muted-foreground mt-0.5">Calibration Stage</p>
      </div>

      <div className="glass-tile rounded-2xl p-4">
        <span className="text-xs uppercase font-bold text-muted-foreground">Average Appraisal Rating</span>
        <div className="font-display text-2xl font-bold text-foreground mt-2">4.2 / 5.0</div>
        <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">Top Performer Density</p>
      </div>

      <div className="glass-tile rounded-2xl p-4">
        <span className="text-xs uppercase font-bold text-muted-foreground">360 Feedbacks Logged</span>
        <div className="font-display text-2xl font-bold text-foreground mt-2">340 Submissions</div>
        <p className="text-[10px] text-muted-foreground mt-0.5">Peer & Upward Reviews</p>
      </div>
    </>
  );

  const ratingsData = [
    { rating: "5.0 (Exceeds)", count: 180 },
    { rating: "4.0 (Meets)", count: 640 },
    { rating: "3.0 (Satisfactory)", count: 310 },
    { rating: "2.0 (Needs Imp)", count: 40 },
    { rating: "1.0 (Unsatisfactory)", count: 8 },
  ];

  const charts = (
    <div className="glass-tile space-y-3 rounded-2xl p-5">
      <h3 className="font-display text-base font-bold text-foreground">Appraisal Rating Distribution</h3>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={ratingsData}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis dataKey="rating" stroke="#888888" fontSize={11} />
            <YAxis stroke="#888888" fontSize={11} />
            <Tooltip contentStyle={{ backgroundColor: "#1e1b4b", borderRadius: "12px", fontSize: "12px" }} />
            <Bar dataKey="count" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  const mockPerfData = [
    { employee: "Aarav Sharma", department: "Product Engineering", okrCompletion: "92%", rating: "4.8 / 5", reviewStatus: "Calibrated", promoEligible: "Yes" },
    { employee: "Priya Patel", department: "Human Resources", okrCompletion: "88%", rating: "4.5 / 5", reviewStatus: "Calibrated", promoEligible: "Yes" },
    { employee: "Karan Verma", department: "Finance Operations", okrCompletion: "82%", rating: "4.0 / 5", reviewStatus: "Submitted", promoEligible: "No" },
  ];

  const columns = [
    { key: "employee", label: "Employee Name" },
    { key: "department", label: "Department" },
    { key: "okrCompletion", label: "OKR Completion %" },
    { key: "rating", label: "Rating" },
    { key: "reviewStatus", label: "Status" },
    { key: "promoEligible", label: "Promotion Recommended" },
  ];

  return (
    <ReportViewLayout
      title="Performance, OKRs & Appraisal Ratings Report"
      description="Goal completion metrics, company alignment, 360 peer feedback density, and appraisal calibration ratings."
      categoryBadge="Performance Report"
      kpiCards={kpis}
      chartsSection={charts}
      tableColumns={columns}
      tableData={mockPerfData}
    />
  );
}
