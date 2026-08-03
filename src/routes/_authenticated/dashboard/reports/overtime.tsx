import { createFileRoute } from "@tanstack/react-router";
import { ReportViewLayout } from "@/components/admin/report-view-layout";
import { Clock4, Receipt, DollarSign, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard/reports/overtime")({
  component: OvertimeReportPage,
});

function OvertimeReportPage() {
  const kpis = (
    <>
      <div className="glass-tile rounded-2xl p-4">
        <span className="text-xs uppercase font-bold text-muted-foreground">Total Overtime Hours</span>
        <div className="font-display text-2xl font-bold text-foreground mt-2">1,240 Hours</div>
        <p className="text-[10px] text-muted-foreground mt-0.5">Aug 2026 Run</p>
      </div>

      <div className="glass-tile rounded-2xl p-4">
        <span className="text-xs uppercase font-bold text-muted-foreground">Approved Overtime Payout</span>
        <div className="font-display text-2xl font-bold text-foreground mt-2">$34,800</div>
        <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">Approved by Managers</p>
      </div>

      <div className="glass-tile rounded-2xl p-4">
        <span className="text-xs uppercase font-bold text-muted-foreground">Pending Approval Requests</span>
        <div className="font-display text-2xl font-bold text-foreground mt-2">8 Claims</div>
        <p className="text-[10px] text-amber-400 font-semibold mt-0.5">Action Needed</p>
      </div>

      <div className="glass-tile rounded-2xl p-4">
        <span className="text-xs uppercase font-bold text-muted-foreground">Avg Rate Multiplier</span>
        <div className="font-display text-2xl font-bold text-foreground mt-2">1.5x Base Pay</div>
        <p className="text-[10px] text-muted-foreground mt-0.5">Statutory Standard</p>
      </div>
    </>
  );

  const mockOTData = [
    { employee: "Vikram Sharma", department: "Product Engineering", hours: "18.5 hrs", rate: "1.5x", otPayout: "$720", status: "Approved" },
    { employee: "Sanjay Gupta", department: "Information Technology", hours: "24.0 hrs", rate: "2.0x (Night)", otPayout: "$1,150", status: "Approved" },
    { employee: "Karan Verma", department: "Finance Operations", hours: "12.0 hrs", rate: "1.5x", otPayout: "$480", status: "Pending Manager" },
  ];

  const columns = [
    { key: "employee", label: "Employee Name" },
    { key: "department", label: "Department" },
    { key: "hours", label: "Overtime Hours" },
    { key: "rate", label: "Rate Multiplier" },
    { key: "otPayout", label: "Est. Payout Amount" },
    { key: "status", label: "Manager Status" },
  ];

  return (
    <ReportViewLayout
      title="Overtime Hours & Compensation Payout Report"
      description="Extra shift hours logged, manager approval chains, night shift differential multipliers, and monthly overtime budget impact."
      categoryBadge="Overtime Report"
      kpiCards={kpis}
      tableColumns={columns}
      tableData={mockOTData}
    />
  );
}
