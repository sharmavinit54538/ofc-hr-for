import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/page-header";
import { Loader2, Inbox } from "lucide-react";
import { useGetVendorPerformanceQuery } from "@/services/vendorApi";

export const Route = createFileRoute("/_authenticated/dashboard/vendors/performance")({
  component: VendorPerformancePage,
});

function VendorPerformancePage() {
  const { data: perfRes, isLoading } = useGetVendorPerformanceQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const performances = perfRes?.data ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Vendor SLA Performance & Quality Ratings"
        description="Delivery speed, hardware SLA compliance rates, and supplier quality scorecards."
        breadcrumbs={[{ label: "Vendor Management", href: "/dashboard/vendors" }, { label: "Vendor Performance" }]}
        backHref="/dashboard/vendors"
      />

      {isLoading ? (
        <div className="glass-tile rounded-2xl p-12 text-center text-xs text-muted-foreground flex flex-col items-center justify-center gap-2">
          <Loader2 className="size-5 animate-spin text-primary" />
          Loading vendor SLA performance telemetry...
        </div>
      ) : performances.length === 0 ? (
        <div className="glass-tile rounded-2xl p-12 text-center text-xs text-muted-foreground flex flex-col items-center justify-center gap-2">
          <Inbox className="size-8 text-muted-foreground/50" />
          <p className="font-medium text-foreground text-sm">No Vendor SLA Scorecards Logged</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {performances.map((p) => (
            <div key={p.vendorName} className="glass-tile space-y-2 rounded-2xl p-5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-foreground">{p.vendorName}</span>
                <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-bold text-emerald-400">{p.status}</span>
              </div>
              <p className="text-xs text-muted-foreground">SLA Score: {p.slaComplianceScore}% | Uptime: {p.uptimePercentage}%</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
