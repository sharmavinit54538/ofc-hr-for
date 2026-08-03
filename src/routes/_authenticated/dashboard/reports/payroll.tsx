import { createFileRoute } from "@tanstack/react-router";
import { ReportViewLayout } from "@/components/admin/report-view-layout";
import { DollarSign, CreditCard, FileCheck, ShieldCheck } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export const Route = createFileRoute("/_authenticated/dashboard/reports/payroll")({
  component: PayrollReportPage,
});

function PayrollReportPage() {
  const kpis = (
    <>
      <div className="glass-tile rounded-2xl p-4">
        <span className="text-xs uppercase font-bold text-muted-foreground">Gross Monthly Payroll</span>
        <div className="font-display text-2xl font-bold text-foreground mt-2">$482,500</div>
        <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">Disbursement Ready</p>
      </div>

      <div className="glass-tile rounded-2xl p-4">
        <span className="text-xs uppercase font-bold text-muted-foreground">Total TDS Tax Withheld</span>
        <div className="font-display text-2xl font-bold text-foreground mt-2">$64,200</div>
        <p className="text-[10px] text-muted-foreground mt-0.5">Statutory Filing Compliant</p>
      </div>

      <div className="glass-tile rounded-2xl p-4">
        <span className="text-xs uppercase font-bold text-muted-foreground">Provident Fund (PF)</span>
        <div className="font-display text-2xl font-bold text-foreground mt-2">$28,500</div>
        <p className="text-[10px] text-muted-foreground mt-0.5">Employer + Employee</p>
      </div>

      <div className="glass-tile rounded-2xl p-4">
        <span className="text-xs uppercase font-bold text-muted-foreground">ESI Contribution</span>
        <div className="font-display text-2xl font-bold text-foreground mt-2">$8,400</div>
        <p className="text-[10px] text-muted-foreground mt-0.5">Health Benefit Fund</p>
      </div>
    </>
  );

  const mockPayrollData = [
    { employee: "Aarav Sharma", id: "NW-1042", department: "Product Engineering", grossSalary: "$12,500", tax: "$1,850", pf: "$600", netPayout: "$10,050" },
    { employee: "Priya Patel", id: "NW-1088", department: "Human Resources", grossSalary: "$8,500", tax: "$1,100", pf: "$450", netPayout: "$6,950" },
    { employee: "Karan Verma", id: "NW-1145", department: "Finance Operations", grossSalary: "$9,200", tax: "$1,250", pf: "$480", netPayout: "$7,470" },
    { employee: "Rohan Kapoor", id: "NW-1180", department: "Customer Success", grossSalary: "$7,800", tax: "$950", pf: "$400", netPayout: "$6,450" },
  ];

  const columns = [
    { key: "id", label: "Emp ID" },
    { key: "employee", label: "Employee Name" },
    { key: "department", label: "Department" },
    { key: "grossSalary", label: "Gross Base" },
    { key: "tax", label: "TDS Tax" },
    { key: "pf", label: "PF Deduction" },
    { key: "netPayout", label: "Net Payout" },
  ];

  return (
    <ReportViewLayout
      title="Payroll & Financial Disbursement Report"
      description="Monthly salary processing, statutory tax deductions (TDS, PF, ESI), bonuses, and net disbursement analytics."
      categoryBadge="Payroll Report"
      kpiCards={kpis}
      tableColumns={columns}
      tableData={mockPayrollData}
    />
  );
}
