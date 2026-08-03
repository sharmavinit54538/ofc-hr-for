import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/page-header";
import { ModuleCard } from "@/components/admin/module-card";
import { SIDEBAR_NAV_ITEMS } from "@/lib/admin-navigation";

export const Route = createFileRoute("/_authenticated/dashboard/leave/")({
  component: LeaveLandingPage,
});

function LeaveLandingPage() {
  const nav = SIDEBAR_NAV_ITEMS.find((item) => item.id === "leave");

  return (
    <div className="space-y-8">
      <PageHeader
        title="Leave & Time-Off Management"
        description="Employee leave application workflow, policy balance accruals, company holiday calendar, and multi-level approval chains."
        breadcrumbs={[{ label: "Leave" }]}
      />

      <div className="space-y-4">
        <h2 className="font-display text-lg font-bold text-foreground">
          Leave Modules
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
