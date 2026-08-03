import { createFileRoute } from "@tanstack/react-router";
import { ReportViewLayout } from "@/components/admin/report-view-layout";
import { GraduationCap, Award, BookOpen, Clock } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard/reports/learning")({
  component: LearningReportPage,
});

function LearningReportPage() {
  const kpis = (
    <>
      <div className="glass-tile rounded-2xl p-4">
        <span className="text-xs uppercase font-bold text-muted-foreground">Active Courses</span>
        <div className="font-display text-2xl font-bold text-foreground mt-2">42 Courses</div>
        <p className="text-[10px] text-muted-foreground mt-0.5">LMS Portal Catalog</p>
      </div>

      <div className="glass-tile rounded-2xl p-4">
        <span className="text-xs uppercase font-bold text-muted-foreground">Compliance Course Completion</span>
        <div className="font-display text-2xl font-bold text-foreground mt-2">99.4%</div>
        <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">Mandatory Security Training</p>
      </div>

      <div className="glass-tile rounded-2xl p-4">
        <span className="text-xs uppercase font-bold text-muted-foreground">Certificates Issued</span>
        <div className="font-display text-2xl font-bold text-foreground mt-2">480 Badges</div>
        <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">Verified Credentials</p>
      </div>

      <div className="glass-tile rounded-2xl p-4">
        <span className="text-xs uppercase font-bold text-muted-foreground">Total Learning Hours</span>
        <div className="font-display text-2xl font-bold text-foreground mt-2">3,420 Hours</div>
        <p className="text-[10px] text-muted-foreground mt-0.5">2.7 hrs / emp / month</p>
      </div>
    </>
  );

  const mockCourses = [
    { title: "SOC2 Security & Data Privacy 2026", category: "Compliance", enrolled: 1248, completed: 1240, avgScore: "98%", status: "Mandatory" },
    { title: "LLM Engineering & Agentic Coding", category: "Technical", enrolled: 420, completed: 380, avgScore: "94%", status: "Active" },
    { title: "Enterprise Executive Leadership", category: "Management", enrolled: 85, completed: 80, avgScore: "92%", status: "Active" },
  ];

  const columns = [
    { key: "title", label: "Course Module Title" },
    { key: "category", label: "Category" },
    { key: "enrolled", label: "Enrolled Workforce" },
    { key: "completed", label: "Completions" },
    { key: "avgScore", label: "Avg Score" },
    { key: "status", label: "Status" },
  ];

  return (
    <ReportViewLayout
      title="Learning & Professional Development Report"
      description="Corporate learning management analytics, mandatory compliance training completion rates, certification issuance, and upskilling hours."
      categoryBadge="Learning Report"
      kpiCards={kpis}
      tableColumns={columns}
      tableData={mockCourses}
    />
  );
}
