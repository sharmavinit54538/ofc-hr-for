import { createFileRoute } from "@tanstack/react-router";
import { GenericSubModuleView } from "@/components/admin/generic-module-view";

export const Route = createFileRoute("/_authenticated/dashboard/onboarding/new-hires")({
  component: () => (
    <GenericSubModuleView
      href="/dashboard/onboarding/new-hires"
      parentHref="/dashboard/onboarding"
      parentLabel="Onboarding"
      title="Incoming New Hires"
      description="Tracker for joining dates, orientation progress, and buddy assignments."
      items={[
        { id: "1", title: "Arjun Gupta", subtitle: "Senior Lead Engineer · Product Engineering", status: "Start Date: Aug 15", date: "Progress: 85%", metric: "Laptop Dispatched" },
        { id: "2", title: "Meera Iyer", subtitle: "Engineering Manager · Product Engineering", status: "Start Date: Aug 20", date: "Progress: 60%", metric: "Docs Verified" },
      ]}
    />
  ),
});
