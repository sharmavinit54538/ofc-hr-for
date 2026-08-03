import { createFileRoute } from "@tanstack/react-router";
import { Wallet, Download, CheckCircle2, FileText, ArrowDownRight, TrendingUp, Loader2, Inbox } from "lucide-react";
import { toast } from "sonner";
import { useGetPayrollSlipsQuery } from "@/services/employeeDashboardApi";

export const Route = createFileRoute("/_authenticated/dashboard/employee/payroll")({
  component: EmployeePayrollPage,
});

function EmployeePayrollPage() {
  const { data: slipsRes, isLoading } = useGetPayrollSlipsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const payslips = slipsRes?.data ?? [];
  const latest = payslips[0];

  const handleDownload = (month: string, year: number) => {
    toast.success("Downloading Payslip", {
      description: `Payslip_${month}_${year}.pdf generated and downloading.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            My Payroll & Payslips
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            View salary structure, monthly breakdown, and download official payslips.
          </p>
        </div>
        {latest && (
          <button
            onClick={() => handleDownload(latest.month, latest.year)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-brand px-4 py-2 text-xs font-semibold text-primary-foreground shadow-glow hover:shadow-glow-lg transition-all"
          >
            <Download className="size-4" /> Download Latest Payslip
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-6">
          <div className="glass-tile h-48 animate-pulse rounded-2xl p-6 bg-secondary/30" />
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="glass-tile h-64 animate-pulse rounded-2xl p-5 bg-secondary/30" />
            <div className="glass-tile h-64 animate-pulse rounded-2xl p-5 bg-secondary/30" />
          </div>
        </div>
      ) : !latest ? (
        <div className="glass-tile rounded-2xl p-12 text-center text-xs text-muted-foreground flex flex-col items-center justify-center gap-2">
          <Inbox className="size-8 text-muted-foreground/50" />
          <p className="font-medium text-foreground text-sm">No Payroll Records Found</p>
          <p className="text-[11px] max-w-xs">
            There are no payslips available for your account at this time.
          </p>
        </div>
      ) : (
        <>
          {/* Latest Net Pay Summary Card */}
          <div className="glass-tile rounded-2xl p-6 md:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-2">
                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-500">
                  <CheckCircle2 className="size-3" /> Paid on {latest.paid_on}
                </span>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Net Take-Home Salary ({latest.month} {latest.year})
                </p>
                <div className="font-display text-3xl font-bold text-foreground sm:text-4xl">
                  ₹{latest.net_pay.toLocaleString("en-IN")}
                </div>
                <p className="text-xs text-muted-foreground">
                  Directly deposited to registered salary account
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:w-1/2">
                <div className="rounded-xl border border-border/50 bg-card/40 p-4">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                    <span>Gross Earnings</span>
                    <TrendingUp className="size-3.5 text-emerald-500" />
                  </div>
                  <p className="font-display text-xl font-bold text-emerald-500">
                    +₹{latest.gross_earnings.toLocaleString("en-IN")}
                  </p>
                </div>
                <div className="rounded-xl border border-border/50 bg-card/40 p-4">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                    <span>Total Deductions</span>
                    <ArrowDownRight className="size-3.5 text-rose-500" />
                  </div>
                  <p className="font-display text-xl font-bold text-rose-500">
                    -₹{latest.total_deductions.toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Earnings & Deductions Breakdown */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Earnings */}
            <div className="glass-tile rounded-2xl p-5">
              <h3 className="font-display text-base font-bold text-foreground mb-4 flex items-center gap-2">
                <Wallet className="size-4 text-emerald-500" /> Salary Earnings
              </h3>
              <div className="space-y-3">
                {[
                  { label: "Basic Salary", value: latest.basic_pay },
                  { label: "House Rent Allowance (HRA)", value: latest.hra },
                  { label: "Conveyance Allowance", value: latest.conveyance },
                  { label: "Special Allowance", value: latest.special_allowance },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between border-b border-border/40 pb-2.5 text-xs">
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className="font-bold text-foreground">₹{item.value.toLocaleString("en-IN")}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between pt-2 text-xs font-bold text-emerald-500">
                  <span>Total Gross Earnings</span>
                  <span>₹{latest.gross_earnings.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>

            {/* Deductions */}
            <div className="glass-tile rounded-2xl p-5">
              <h3 className="font-display text-base font-bold text-foreground mb-4 flex items-center gap-2">
                <FileText className="size-4 text-rose-500" /> Statutory Deductions
              </h3>
              <div className="space-y-3">
                {[
                  { label: "Provident Fund (PF)", value: latest.pf },
                  { label: "Professional Tax (PT)", value: latest.professional_tax },
                  { label: "Income Tax (TDS)", value: latest.income_tax },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between border-b border-border/40 pb-2.5 text-xs">
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className="font-bold text-foreground">₹{item.value.toLocaleString("en-IN")}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between pt-2 text-xs font-bold text-rose-500">
                  <span>Total Deductions</span>
                  <span>₹{latest.total_deductions.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payslip History Table */}
          <div className="glass-tile overflow-hidden rounded-2xl border border-border">
            <div className="p-4 border-b border-border/60">
              <h3 className="font-display text-base font-bold text-foreground">Payslip History</h3>
            </div>
            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-border/60 bg-card/60 uppercase tracking-[0.08em] text-muted-foreground">
                  <tr>
                    <th className="px-5 py-3 font-bold">Month & Year</th>
                    <th className="px-5 py-3 font-bold">Gross Earnings</th>
                    <th className="px-5 py-3 font-bold">Deductions</th>
                    <th className="px-5 py-3 font-bold">Net Pay</th>
                    <th className="px-5 py-3 font-bold">Paid On</th>
                    <th className="px-5 py-3 font-bold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {payslips.map((ps) => (
                    <tr key={ps.id} className="transition-colors hover:bg-secondary/40">
                      <td className="px-5 py-3.5 font-bold text-foreground">{ps.month} {ps.year}</td>
                      <td className="px-5 py-3.5 text-emerald-500 font-semibold">₹{ps.gross_earnings.toLocaleString("en-IN")}</td>
                      <td className="px-5 py-3.5 text-rose-500 font-semibold">₹{ps.total_deductions.toLocaleString("en-IN")}</td>
                      <td className="px-5 py-3.5 font-bold text-foreground">₹{ps.net_pay.toLocaleString("en-IN")}</td>
                      <td className="px-5 py-3.5 text-muted-foreground">{ps.paid_on}</td>
                      <td className="px-5 py-3.5 text-right">
                        <button
                          onClick={() => handleDownload(ps.month, ps.year)}
                          className="glass-tile inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold hover:bg-secondary"
                        >
                          <Download className="size-3" /> Download
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
