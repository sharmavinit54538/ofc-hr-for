import { createFileRoute } from "@tanstack/react-router";
import { GenericSubModuleView } from "@/components/admin/generic-module-view";
import { useGetLaborLawsQuery } from "@/services/complianceApi";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard/compliance/laws")({
  component: LaborLawsPage,
});

function LaborLawsPage() {
  const { data: lawsRes, isLoading } = useGetLaborLawsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const items = lawsRes?.data ?? [];

  if (isLoading) {
    return (
      <div className="glass-tile rounded-2xl p-12 text-center text-xs text-muted-foreground flex flex-col items-center justify-center gap-2">
        <Loader2 className="size-5 animate-spin text-primary" />
        Loading labor laws and statutory compliance standards...
      </div>
    );
  }

  return (
    <GenericSubModuleView
      href="/dashboard/compliance/laws"
      parentHref="/dashboard/compliance"
      parentLabel="Compliance"
      title="Labor Laws & Statutory Standards"
      description="Regional employment policies, minimum wage guidelines, and statutory leave mandates."
      items={items}
    />
  );
}
