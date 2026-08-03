import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/page-header";
import { ModuleCard } from "@/components/admin/module-card";
import { SIDEBAR_NAV_ITEMS } from "@/lib/admin-navigation";

export const Route = createFileRoute("/_authenticated/dashboard/performance/")({
  component: PerformanceLandingPage,
});

function PerformanceLandingPage() {
  const nav = SIDEBAR_NAV_ITEMS.find((item) => item.id === "performance");

  return (
    <div className="space-y-8">
      <PageHeader
        title="Performance Management & OKRs"
        description="Goal tracking (OKRs), annual appraisal cycles, 360-degree feedback, and employee competency skill matrices."
        breadcrumbs={[{ label: "Performance" }]}
      />

      <div className="space-y-4">
        <h2 className="font-display text-lg font-bold text-foreground">
          Performance Modules
        </h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-2">
          {nav?.subModules.map((subModule) => (
            <ModuleCard key={subModule.id} module={subModule} />
          ))}
        </div>
      </div>
    </div>
  );
}
