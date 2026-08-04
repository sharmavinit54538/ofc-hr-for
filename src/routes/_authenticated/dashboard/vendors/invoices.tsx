import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/page-header";
import { Loader2, Inbox } from "lucide-react";
import { useGetVendorInvoicesQuery } from "@/services/vendorApi";

export const Route = createFileRoute("/_authenticated/dashboard/vendors/invoices")({
  component: VendorInvoicesPage,
});

function VendorInvoicesPage() {
  const { data: invoiceRes, isLoading } = useGetVendorInvoicesQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const invoices = invoiceRes?.data ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Vendor Invoices & Accounts Payable"
        description="Monthly vendor billing, invoice processing status, and accounts payable disbursement."
        breadcrumbs={[{ label: "Vendor Management", href: "/dashboard/vendors" }, { label: "Vendor Invoices" }]}
        backHref="/dashboard/vendors"
      />

      {isLoading ? (
        <div className="glass-tile rounded-2xl p-12 text-center text-xs text-muted-foreground flex flex-col items-center justify-center gap-2">
          <Loader2 className="size-5 animate-spin text-primary" />
          Loading accounts payable invoices...
        </div>
      ) : invoices.length === 0 ? (
        <div className="glass-tile rounded-2xl p-12 text-center text-xs text-muted-foreground flex flex-col items-center justify-center gap-2">
          <Inbox className="size-8 text-muted-foreground/50" />
          <p className="font-medium text-foreground text-sm">No Pending Vendor Invoices Found</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {invoices.map((inv) => (
            <div key={inv.invoiceNumber} className="glass-tile space-y-2 rounded-2xl p-5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-primary">{inv.invoiceNumber}</span>
                <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-bold text-amber-400">{inv.status}</span>
              </div>
              <p className="text-xs font-bold text-foreground">{inv.vendorName}</p>
              <p className="text-xs text-muted-foreground">Amount: {inv.amount} (Due: {inv.dueDate})</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
