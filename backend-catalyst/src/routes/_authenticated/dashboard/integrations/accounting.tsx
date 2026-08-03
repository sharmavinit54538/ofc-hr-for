import { createFileRoute } from "@tanstack/react-router";
import { GenericSubModuleView } from "@/components/admin/generic-module-view";

export const Route = createFileRoute("/_authenticated/dashboard/integrations/accounting")({
  component: () => (
    <GenericSubModuleView
      href="/dashboard/integrations/accounting"
      parentHref="/dashboard/integrations"
      parentLabel="Integrations"
      title="Accounting & ERP Systems"
      description="Oracle NetSuite, SAP SuccessFactors, QuickBooks, and Xero automated ledger sync."
      items={[
        { id: "1", title: "Oracle NetSuite ERP", subtitle: "Automated monthly payroll journal entry sync", status: "Connected", date: "Last sync: Jul 30", metric: "Journal Sync" },
      ]}
    />
  ),
});
