import { createFileRoute } from "@tanstack/react-router";
import { ReportViewLayout } from "@/components/admin/report-view-layout";
import { UserPlus, UserCheck, Clock, Gift } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export const Route = createFileRoute("/_authenticated/dashboard/reports/recruitment")({
  component: RecruitmentReportPage,
});

function RecruitmentReportPage() {
  const kpis = (
    <>
      <div className="glass-tile rounded-2xl p-4">
        <span className="text-xs uppercase font-bold text-muted-foreground">Open Requisitions</span>
        <div className="font-display text-2xl font-bold text-foreground mt-2">24 Roles</div>
        <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">6 Priority Positions</p>
      </div>

      <div className="glass-tile rounded-2xl p-4">
        <span className="text-xs uppercase font-bold text-muted-foreground">Active Candidates</span>
        <div className="font-display text-2xl font-bold text-foreground mt-2">380 Applicants</div>
        <p className="text-[10px] text-muted-foreground mt-0.5">In Screening & Panel Stages</p>
      </div>

      <div className="glass-tile rounded-2xl p-4">
        <span className="text-xs uppercase font-bold text-muted-foreground">Offer Acceptance Rate</span>
        <div className="font-display text-2xl font-bold text-foreground mt-2">88.5%</div>
        <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">Strong Employer Brand</p>
      </div>

      <div className="glass-tile rounded-2xl p-4">
        <span className="text-xs uppercase font-bold text-muted-foreground">Avg Time-to-Hire</span>
        <div className="font-display text-2xl font-bold text-foreground mt-2">22 Days</div>
        <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">-4 Days Faster than Target</p>
      </div>
    </>
  );

  const funnelData = [
    { stage: "Applied", candidates: 380 },
    { stage: "Screened", candidates: 190 },
    { stage: "Technical Interview", candidates: 75 },
    { stage: "Culture & Executive", candidates: 32 },
    { stage: "Offer Released", candidates: 18 },
  ];

  const charts = (
    <div className="glass-tile space-y-3 rounded-2xl p-5">
      <h3 className="font-display text-base font-bold text-foreground">Talent Acquisition Candidate Conversion Funnel</h3>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={funnelData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis type="number" stroke="#888888" fontSize={11} />
            <YAxis dataKey="stage" type="category" stroke="#888888" fontSize={11} width={120} />
            <Tooltip contentStyle={{ backgroundColor: "#1e1b4b", borderRadius: "12px", fontSize: "12px" }} />
            <Bar dataKey="candidates" fill="#6366f1" radius={[0, 6, 6, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  const mockJobs = [
    { title: "Senior AI Engineer", department: "Product Engineering", applicants: 124, interviews: 12, offerStatus: "2 Offered", status: "Hiring" },
    { title: "Frontend Architect", department: "Product Engineering", applicants: 98, interviews: 8, offerStatus: "1 Offered", status: "Hiring" },
    { title: "Financial Operations Manager", department: "Finance Operations", applicants: 45, interviews: 5, offerStatus: "Pending Interview", status: "Hiring" },
  ];

  const columns = [
    { key: "title", label: "Requisition Title" },
    { key: "department", label: "Department" },
    { key: "applicants", label: "Applicants" },
    { key: "interviews", label: "Interviews Conducted" },
    { key: "offerStatus", label: "Offer Pipeline" },
    { key: "status", label: "Status" },
  ];

  return (
    <ReportViewLayout
      title="Recruitment Pipeline & Talent Acquisition Report"
      description="Applicant tracking metrics, candidate funnel conversion rates, offer acceptance velocity, and hiring source analysis."
      categoryBadge="Recruitment Report"
      kpiCards={kpis}
      chartsSection={charts}
      tableColumns={columns}
      tableData={mockJobs}
    />
  );
}
