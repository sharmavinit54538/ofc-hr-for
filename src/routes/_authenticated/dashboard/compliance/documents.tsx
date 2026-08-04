import { createFileRoute } from "@tanstack/react-router";
import { GenericSubModuleView } from "@/components/admin/generic-module-view";
import { useGetComplianceDocumentsQuery } from "@/services/complianceApi";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard/compliance/documents")({
  component: ComplianceDocumentsPage,
});

function ComplianceDocumentsPage() {
  const { data: docsRes, isLoading } = useGetComplianceDocumentsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const items = docsRes?.data ?? [];

  if (isLoading) {
    return (
      <div className="glass-tile rounded-2xl p-12 text-center text-xs text-muted-foreground flex flex-col items-center justify-center gap-2">
        <Loader2 className="size-5 animate-spin text-primary" />
        Loading encrypted compliance documents...
      </div>
    );
  }

  return (
    <GenericSubModuleView
      href="/dashboard/compliance/documents"
      parentHref="/dashboard/compliance"
      parentLabel="Compliance"
      title="Encrypted Document Vault"
      description="256-bit AES encrypted repository for NDAs, IP agreements, and executive contracts."
      items={items}
    />
  );
}
