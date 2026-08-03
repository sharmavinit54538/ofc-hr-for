import { createFileRoute } from "@tanstack/react-router";
import { ReportViewLayout } from "@/components/admin/report-view-layout";
import { Building2, Users, DollarSign, Award } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard/reports/departments")({
  component: DepartmentsReportPage,
});

function DepartmentsReportPage() {
  const kpis = (
    <>
      <div className="glass-tile rounded-2xl p-4">
        <span className="text-xs uppercase font-bold text-muted-foreground">Active Business Units</span>
        <div className="font-display text-2xl font-bold text-foreground mt-2">18 Units</div>
        <p className="text-[10px] text-muted-foreground mt-0.5">Corporate Structure</p>
      </div>

      <div className="glass-tile rounded-2xl p-4">
        <span className="text-xs uppercase font-bold text-muted-foreground">Largest Unit</span>
        <div className="font-display text-2xl font-bold text-foreground mt-2">Engineering</div>
        <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">640 Headcount (51.2%)</p>
      </div>

      <div className="glass-tile rounded-2xl p-4">
        <span className="text-xs uppercase font-bold text-muted-foreground">Total Budget Allocated</span>
        <div className="font-display text-2xl font-bold text-foreground mt-2">$592,000 / Mo</div>
        <p className="text-[10px] text-muted-foreground mt-0.5">Operating Cost</p>
      </div>

      <div className="glass-tile rounded-2xl p-4">
        <span className="text-xs uppercase font-bold text-muted-foreground">Dept Leadership</span>
        <div className="font-display text-2xl font-bold text-foreground mt-2">18 VPs & Directors</div>
        <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">Full Leadership Staffing</p>
      </div>
    </>
  );

  const mockDeptData = [
    { department: "Product Engineering", lead: "Anurag Kashyap (VP Eng)", headcount: 640, budget: "$280,000", costCenter: "CC-101", status: "Active" },
    { department: "Information Technology", lead: "Priya N. (IT Director)", headcount: 210, budget: "$95,000", costCenter: "CC-102", status: "Active" },
    { department: "Finance Operations", lead: "Karan Verma (CFO)", headcount: 140, budget: "$68,000", costCenter: "CC-103", status: "Active" },
    { department: "Human Resources", lead: "Meera K. (CHRO)", headcount: 95, budget: "$42,000", costCenter: "CC-104", status: "Active" },
  ];

  const columns = [
    { key: "costCenter", label: "Cost Center" },
    { key: "department", label: "Department Name" },
    { key: "lead", label: "Department Lead" },
    { key: "headcount", label: "Staff Count" },
    { key: "budget", label: "Monthly Operating Budget" },
  ];

  return (
    <ReportViewLayout
      title="Departmental Structure & Cost Center Report"
      description="Breakdown of organizational business units, departmental headcount allocation, leadership hierarchy, and cost centers."
      categoryBadge="Department Report"
      kpiCards={kpis}
      tableColumns={columns}
      tableData={mockDeptData}
    />
  );
}
