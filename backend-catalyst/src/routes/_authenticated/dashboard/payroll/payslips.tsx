import { createFileRoute } from "@tanstack/react-router";
import { GenericSubModuleView } from "@/components/admin/generic-module-view";

export const Route = createFileRoute("/_authenticated/dashboard/payroll/payslips")({
  component: () => (
    <GenericSubModuleView
      href="/dashboard/payroll/payslips"
      parentHref="/dashboard/payroll"
      parentLabel="Payroll"
      title="Payslips & Tax Computation Sheets"
      description="Self-service employee payslip portal, password-protected PDF exports, and annual YTD tax projections."
      items={[
        { id: "1", title: "July 2026 Digital Payslips", subtitle: "1,236 PDF Documents Generated & Emailed", status: "Delivered", date: "Jul 30, 2026", metric: "100% Sent" },
      ]}
    />
  ),
});
