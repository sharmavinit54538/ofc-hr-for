import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/page-header";
import { ModuleCard } from "@/components/admin/module-card";
import { SIDEBAR_NAV_ITEMS } from "@/lib/admin-navigation";

export const Route = createFileRoute("/_authenticated/dashboard/onboarding/")({
  component: OnboardingLandingPage,
});

function OnboardingLandingPage() {
  const nav = SIDEBAR_NAV_ITEMS.find((item) => item.id === "onboarding");

  return (
    <div className="space-y-8">
      <PageHeader
        title="Employee Onboarding Administration"
        description="Provision new employee accounts, manage automated orientation workflows, collect verification documents, and track IT hardware dispatch."
        breadcrumbs={[{ label: "Onboarding" }]}
      />

      <div className="space-y-4">
        <h2 className="font-display text-lg font-bold text-foreground">
          Onboarding Modules
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
