import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/page-header";
import { Loader2, Inbox } from "lucide-react";
import { useListVendorsQuery } from "@/services/vendorApi";

export const Route = createFileRoute("/_authenticated/dashboard/vendors/list")({
  component: VendorListPage,
});

function VendorListPage() {
  const { data: vendorRes, isLoading } = useListVendorsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const vendors = vendorRes?.data ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Full Vendor Directory & Contact Registry"
        description="Comprehensive directory of approved hardware suppliers, cloud providers, and HR service vendors."
        breadcrumbs={[{ label: "Vendor Management", href: "/dashboard/vendors" }, { label: "Vendor Directory" }]}
        backHref="/dashboard/vendors"
      />

      {isLoading ? (
        <div className="glass-tile rounded-2xl p-12 text-center text-xs text-muted-foreground flex flex-col items-center justify-center gap-2">
          <Loader2 className="size-5 animate-spin text-primary" />
          Loading vendor registry...
        </div>
      ) : vendors.length === 0 ? (
        <div className="glass-tile rounded-2xl p-12 text-center text-xs text-muted-foreground flex flex-col items-center justify-center gap-2">
          <Inbox className="size-8 text-muted-foreground/50" />
          <p className="font-medium text-foreground text-sm">No Approved Vendors Registered</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-3">
          {vendors.map((v) => (
            <div key={v.id} className="glass-tile space-y-2 rounded-2xl p-5">
              <span className="font-mono text-xs font-bold text-primary">{v.vendorId}</span>
              <h3 className="font-display text-base font-bold text-foreground">{v.name}</h3>
              <p className="text-xs text-muted-foreground">{v.contactPerson} ({v.phone})</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
