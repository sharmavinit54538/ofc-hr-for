import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/page-header";
import { ModuleCard } from "@/components/admin/module-card";
import { SIDEBAR_NAV_ITEMS } from "@/lib/admin-navigation";

export const Route = createFileRoute("/_authenticated/dashboard/recruitment/")({
  component: RecruitmentLandingPage,
});

function RecruitmentLandingPage() {
  const recruitmentNav = SIDEBAR_NAV_ITEMS.find((item) => item.id === "recruitment");

  return (
    <div className="space-y-8">
      <PageHeader
        title="Recruitment & Talent Acquisition"
        description="End-to-end applicant tracking system, job requisitions, candidate evaluation pipelines, and offer approvals."
        breadcrumbs={[{ label: "Recruitment" }]}
      />

      <div className="space-y-4">
        <h2 className="font-display text-lg font-bold text-foreground">
          Recruitment Modules
        </h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-2">
          {recruitmentNav?.subModules.map((subModule) => (
            <ModuleCard key={subModule.id} module={subModule} />
          ))}
        </div>
      </div>
    </div>
  );
}
