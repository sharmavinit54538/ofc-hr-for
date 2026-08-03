import { createFileRoute } from "@tanstack/react-router";
import { ReportViewLayout } from "@/components/admin/report-view-layout";
import { FolderTree, Users, Crown, Shield } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard/reports/organization")({
  component: OrganizationReportPage,
});

function OrganizationReportPage() {
  const kpis = (
    <>
      <div className="glass-tile rounded-2xl p-4">
        <span className="text-xs uppercase font-bold text-muted-foreground">Management Tiers</span>
        <div className="font-display text-2xl font-bold text-foreground mt-2">6 Levels</div>
        <p className="text-[10px] text-muted-foreground mt-0.5">CEO to Associate Level</p>
      </div>

      <div className="glass-tile rounded-2xl p-4">
        <span className="text-xs uppercase font-bold text-muted-foreground">Avg Span of Control</span>
        <div className="font-display text-2xl font-bold text-foreground mt-2">1 : 7.4</div>
        <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">Optimal Direct Reports</p>
      </div>

      <div className="glass-tile rounded-2xl p-4">
        <span className="text-xs uppercase font-bold text-muted-foreground">Total Managers</span>
        <div className="font-display text-2xl font-bold text-foreground mt-2">168 Managers</div>
        <p className="text-[10px] text-muted-foreground mt-0.5">13.4% of Workforce</p>
      </div>

      <div className="glass-tile rounded-2xl p-4">
        <span className="text-xs uppercase font-bold text-muted-foreground">Executive Staff</span>
        <div className="font-display text-2xl font-bold text-foreground mt-2">12 Officers</div>
        <p className="text-[10px] text-muted-foreground mt-0.5">C-Suite & Board</p>
      </div>
    </>
  );

  const mockOrgTiers = [
    { tier: "Level 1: Executive Suite", count: 12, avgSalary: "$320,000", spanOfControl: "1 : 6.2", status: "Active" },
    { tier: "Level 2: Vice Presidents & Directors", count: 32, avgSalary: "$180,000", spanOfControl: "1 : 7.8", status: "Active" },
    { tier: "Level 3: Senior Managers & Leads", count: 124, avgSalary: "$120,000", spanOfControl: "1 : 8.1", status: "Active" },
    { tier: "Level 4: Senior Engineers & Staff", count: 480, avgSalary: "$85,000", spanOfControl: "N/A", status: "Active" },
    { tier: "Level 5: Associates & Analysts", count: 600, avgSalary: "$55,000", spanOfControl: "N/A", status: "Active" },
  ];

  const columns = [
    { key: "tier", label: "Organization Hierarchy Level" },
    { key: "count", label: "Headcount at Tier" },
    { key: "avgSalary", label: "Average Compensation" },
    { key: "spanOfControl", label: "Direct Reports Ratio" },
    { key: "status", label: "Status" },
  ];

  return (
    <ReportViewLayout
      title="Organizational Structure & Hierarchy Summary"
      description="Corporate hierarchy reporting lines, span of control analytics, managerial depth, and tier compensation breakdown."
      categoryBadge="Organization Report"
      kpiCards={kpis}
      tableColumns={columns}
      tableData={mockOrgTiers}
    />
  );
}
