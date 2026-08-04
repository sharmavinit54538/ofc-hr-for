import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/page-header";
import { Loader2, Inbox } from "lucide-react";
import { useGetVendorContractsQuery } from "@/services/vendorApi";

export const Route = createFileRoute("/_authenticated/dashboard/vendors/contracts")({
  component: VendorContractsPage,
});

function VendorContractsPage() {
  const { data: contractRes, isLoading } = useGetVendorContractsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const contracts = contractRes?.data ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Procurement & Master Service Contracts"
        description="Active vendor MSAs, NDAs, and contract expiration renewal alerts."
        breadcrumbs={[{ label: "Vendor Management", href: "/dashboard/vendors" }, { label: "Vendor Contracts" }]}
        backHref="/dashboard/vendors"
      />

      {isLoading ? (
        <div className="glass-tile rounded-2xl p-12 text-center text-xs text-muted-foreground flex flex-col items-center justify-center gap-2">
          <Loader2 className="size-5 animate-spin text-primary" />
          Loading master service contracts...
        </div>
      ) : contracts.length === 0 ? (
        <div className="glass-tile rounded-2xl p-12 text-center text-xs text-muted-foreground flex flex-col items-center justify-center gap-2">
          <Inbox className="size-8 text-muted-foreground/50" />
          <p className="font-medium text-foreground text-sm">No Active Master Service Agreements Found</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {contracts.map((c) => (
            <div key={c.id} className="glass-tile space-y-2 rounded-2xl p-5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-foreground">{c.vendorName}</span>
                <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-bold text-emerald-400">{c.status}</span>
              </div>
              <p className="text-xs text-muted-foreground">{c.title} ({c.annualValue})</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
