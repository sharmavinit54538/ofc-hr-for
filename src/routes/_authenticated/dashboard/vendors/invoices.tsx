import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/page-header";

export const Route = createFileRoute("/_authenticated/dashboard/vendors/invoices")({
  component: VendorInvoicesPage,
});

function VendorInvoicesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Vendor Invoices & Accounts Payable"
        description="Monthly vendor billing, invoice processing status, and accounts payable disbursement."
        breadcrumbs={[{ label: "Vendor Management", href: "/dashboard/vendors" }, { label: "Vendor Invoices" }]}
        backHref="/dashboard/vendors"
      />
      <div className="glass-tile rounded-2xl p-6 text-xs text-muted-foreground">$182,500 Total Vendor Invoices Processed YTD.</div>
    </div>
  );
}
