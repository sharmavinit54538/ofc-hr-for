import { createFileRoute } from "@tanstack/react-router";
import { GenericSubModuleView } from "@/components/admin/generic-module-view";

export const Route = createFileRoute("/_authenticated/dashboard/payroll/tax")({
  component: () => (
    <GenericSubModuleView
      href="/dashboard/payroll/tax"
      parentHref="/dashboard/payroll"
      parentLabel="Payroll"
      title="Statutory Tax & Regulatory Filings"
      description="TDS deductions, Provident Fund (PF) deposits, ESI contributions, and Professional Tax compliance."
      items={[
        { id: "1", title: "Monthly PF & ESI Deposit Return", subtitle: "EPFO Portal Direct Challan", status: "Filed & Settled", date: "Challan #884920", metric: "Compliant" },
        { id: "2", title: "Quarterly TDS Return (Form 24Q)", subtitle: "Income Tax Department Filing", status: "Q2 Filing Ready", date: "Due Sep 15", metric: "Audited" },
      ]}
    />
  ),
});
