import { createFileRoute } from "@tanstack/react-router";
import { ReportViewLayout } from "@/components/admin/report-view-layout";
import { UserCheck, FileCheck, CalendarCheck, Laptop } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard/reports/onboarding")({
  component: OnboardingReportPage,
});

function OnboardingReportPage() {
  const kpis = (
    <>
      <div className="glass-tile rounded-2xl p-4">
        <span className="text-xs uppercase font-bold text-muted-foreground">New Hires Joining This Month</span>
        <div className="font-display text-2xl font-bold text-foreground mt-2">12 Staff</div>
        <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">100% On Track</p>
      </div>

      <div className="glass-tile rounded-2xl p-4">
        <span className="text-xs uppercase font-bold text-muted-foreground">Document Verification</span>
        <div className="font-display text-2xl font-bold text-foreground mt-2">98.2%</div>
        <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">Compliant</p>
      </div>

      <div className="glass-tile rounded-2xl p-4">
        <span className="text-xs uppercase font-bold text-muted-foreground">Task Checklist Completion</span>
        <div className="font-display text-2xl font-bold text-foreground mt-2">91.5%</div>
        <p className="text-[10px] text-muted-foreground mt-0.5">45 Active Checklists</p>
      </div>

      <div className="glass-tile rounded-2xl p-4">
        <span className="text-xs uppercase font-bold text-muted-foreground">Hardware Assets Provisioned</span>
        <div className="font-display text-2xl font-bold text-foreground mt-2">12 Laptops</div>
        <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">Pre-Dispatched</p>
      </div>
    </>
  );

  const mockNewHires = [
    { name: "Siddharth Rao", department: "Product Engineering", startDate: "2026-08-01", docVerification: "Verified", checklistPct: "100%", assetAssigned: 'MacBook Pro 16" M3' },
    { name: "Meera Krishnan", department: "Marketing & Growth", startDate: "2026-08-05", docVerification: "Pending Govt ID", checklistPct: "75%", assetAssigned: "Dell XPS 15" },
    { name: "Rahul Sundaram", department: "Information Technology", startDate: "2026-08-10", docVerification: "Verified", checklistPct: "50%", assetAssigned: "ThinkPad P1" },
  ];

  const columns = [
    { key: "name", label: "New Joiner Name" },
    { key: "department", label: "Department" },
    { key: "startDate", label: "Start Date" },
    { key: "docVerification", label: "ID & Doc Verification" },
    { key: "checklistPct", label: "Checklist %" },
    { key: "assetAssigned", label: "Provisioned Hardware" },
  ];

  return (
    <ReportViewLayout
      title="New Hire Onboarding & Provisioning Report"
      description="Incoming employee tracking, document verification compliance, IT hardware dispatch, and department orientation playbooks."
      categoryBadge="Onboarding Report"
      kpiCards={kpis}
      tableColumns={columns}
      tableData={mockNewHires}
    />
  );
}
