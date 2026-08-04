import { createFileRoute } from "@tanstack/react-router";
import { ReportViewLayout } from "@/components/admin/report-view-layout";
import { useGetPayrollReportQuery } from "@/services/reportsApi";

export const Route = createFileRoute("/_authenticated/dashboard/reports/payroll")({
  component: PayrollReportPage,
});

function PayrollReportPage() {
  const { data: payrollRes } = useGetPayrollReportQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const payroll = payrollRes?.data;
  const gross = payroll?.total_gross_payroll ?? 0;
  const tax = payroll?.total_tax_deductions ?? 0;
  const pf = payroll?.total_pf_contributions ?? 0;
  const net = payroll?.total_net_payroll ?? 0;

  const kpis = (
    <>
      <div className="glass-tile rounded-2xl p-4">
        <span className="text-xs uppercase font-bold text-muted-foreground">Gross Monthly Payroll</span>
        <div className="font-display text-2xl font-bold text-foreground mt-2">${gross.toLocaleString()}</div>
        <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">Disbursement Calculation</p>
      </div>

      <div className="glass-tile rounded-2xl p-4">
        <span className="text-xs uppercase font-bold text-muted-foreground">Total TDS Tax Withheld</span>
        <div className="font-display text-2xl font-bold text-foreground mt-2">${tax.toLocaleString()}</div>
        <p className="text-[10px] text-muted-foreground mt-0.5">Statutory Filing Compliant</p>
      </div>

      <div className="glass-tile rounded-2xl p-4">
        <span className="text-xs uppercase font-bold text-muted-foreground">Provident Fund (PF)</span>
        <div className="font-display text-2xl font-bold text-foreground mt-2">${pf.toLocaleString()}</div>
        <p className="text-[10px] text-muted-foreground mt-0.5">Employer + Employee</p>
      </div>

      <div className="glass-tile rounded-2xl p-4">
        <span className="text-xs uppercase font-bold text-muted-foreground">Net Disbursement</span>
        <div className="font-display text-2xl font-bold text-foreground mt-2">${net.toLocaleString()}</div>
        <p className="text-[10px] text-muted-foreground mt-0.5">Net Payout</p>
      </div>
    </>
  );

  const tableData = [
    {
      metric: "Gross Monthly Compensation Base",
      amount: `$${gross.toLocaleString()}`,
    },
    {
      metric: "Estimated Tax (TDS) Withheld",
      amount: `$${tax.toLocaleString()}`,
    },
    {
      metric: "Statutory Provident Fund (PF) Accumulation",
      amount: `$${pf.toLocaleString()}`,
    },
    {
      metric: "Total Net Salary Payout",
      amount: `$${net.toLocaleString()}`,
    },
  ];

  const columns = [
    { key: "metric", label: "Financial Audit Metric" },
    { key: "amount", label: "Calculated Amount" },
  ];

  return (
    <ReportViewLayout
      title="Payroll & Financial Disbursement Report"
      description="Monthly salary processing, statutory tax deductions (TDS, PF, ESI), bonuses, and net disbursement analytics."
      categoryBadge="Payroll Report"
      kpiCards={kpis}
      tableColumns={columns}
      tableData={tableData}
    />
  );
}
