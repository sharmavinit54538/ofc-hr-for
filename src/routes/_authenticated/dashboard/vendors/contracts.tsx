import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/page-header";

export const Route = createFileRoute("/_authenticated/dashboard/vendors/contracts")({
  component: VendorContractsPage,
});

function VendorContractsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Procurement & Master Service Contracts"
        description="Active vendor MSAs, NDAs, and contract expiration renewal alerts."
        breadcrumbs={[{ label: "Vendor Management", href: "/dashboard/vendors" }, { label: "Vendor Contracts" }]}
        backHref="/dashboard/vendors"
      />
      <div className="glass-tile rounded-2xl p-6 text-xs text-muted-foreground">14 Master Service Agreements Active with 100% Compliance.</div>
    </div>
  );
}
