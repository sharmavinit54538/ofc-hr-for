import { createFileRoute } from "@tanstack/react-router";
import { GenericSubModuleView } from "@/components/admin/generic-module-view";

export const Route = createFileRoute("/_authenticated/dashboard/compliance/laws")({
  component: () => (
    <GenericSubModuleView
      href="/dashboard/compliance/laws"
      parentHref="/dashboard/compliance"
      parentLabel="Compliance"
      title="Labor Laws & Statutory Standards"
      description="Regional employment policies, minimum wage guidelines, and statutory leave mandates."
      items={[
        { id: "1", title: "India Shops & Establishments Act Compliance", subtitle: "Working hours, overtime calculation, and holidays", status: "100% Compliant", date: "Verified 2026", metric: "Enforced" },
      ]}
    />
  ),
});
