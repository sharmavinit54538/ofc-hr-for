import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/page-header";
import { ModuleCard } from "@/components/admin/module-card";
import { SIDEBAR_NAV_ITEMS } from "@/lib/admin-navigation";
import { useListEmployeesQuery, useListDepartmentsQuery } from "@/services/employeeApi";

export const Route = createFileRoute("/_authenticated/dashboard/workforce/")({
  component: WorkforceLandingPage,
});

function WorkforceLandingPage() {
  const workforceNav = SIDEBAR_NAV_ITEMS.find((item) => item.id === "workforce");

  const { data: employeesRes, isLoading: isLoadingEmployees } = useListEmployeesQuery({
    page: 1,
    page_size: 1,
  });
  const { data: departmentsRes, isLoading: isLoadingDepts } = useListDepartmentsQuery();

  const totalEmployees = employeesRes?.data?.total ?? employeesRes?.data?.items?.length ?? 0;
  const totalDepartments = departmentsRes?.data?.length ?? 0;

  const subModules = (workforceNav?.subModules ?? []).map((subModule) => {
    if (subModule.id === "employees") {
      return {
        ...subModule,
        stats: isLoadingEmployees ? "Syncing..." : `${totalEmployees} Active`,
      };
    }
    if (subModule.id === "departments") {
      return {
        ...subModule,
        stats: isLoadingDepts ? "Syncing..." : `${totalDepartments} Departments`,
      };
    }
    return subModule;
  });

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <PageHeader
        title="Workforce Management"
        description="Centralized command center for managing employee records, executive leadership, organizational departments, job designations, global office branches, and interactive org charts."
        breadcrumbs={[{ label: "Workforce" }]}
      />

      {/* Sub-modules Grid */}
      <div className="space-y-4">
        <h2 className="font-display text-lg font-bold text-foreground">
          Workforce Modules
        </h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {subModules.map((subModule) => (
            <ModuleCard key={subModule.id} module={subModule} />
          ))}
        </div>
      </div>
    </div>
  );
}

