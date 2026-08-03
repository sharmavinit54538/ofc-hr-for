import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/page-header";
import { ModuleCard } from "@/components/admin/module-card";
import { SIDEBAR_NAV_ITEMS } from "@/lib/admin-navigation";

export const Route = createFileRoute("/_authenticated/dashboard/settings/")({
  component: SettingsLandingPage,
});

function SettingsLandingPage() {
  const nav = SIDEBAR_NAV_ITEMS.find((item) => item.id === "settings");

  return (
    <div className="space-y-8">
      <PageHeader
        title="Tenant Settings & Administration"
        description="Configure organization profile, manage RBAC roles & permissions, enforce security policies, and manage enterprise subscription billing."
        breadcrumbs={[{ label: "Settings" }]}
      />

      <div className="space-y-4">
        <h2 className="font-display text-lg font-bold text-foreground">
          Settings Modules
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
