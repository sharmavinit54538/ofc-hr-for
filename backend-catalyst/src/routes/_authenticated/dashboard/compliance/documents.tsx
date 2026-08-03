import { createFileRoute } from "@tanstack/react-router";
import { GenericSubModuleView } from "@/components/admin/generic-module-view";

export const Route = createFileRoute("/_authenticated/dashboard/compliance/documents")({
  component: () => (
    <GenericSubModuleView
      href="/dashboard/compliance/documents"
      parentHref="/dashboard/compliance"
      parentLabel="Compliance"
      title="Encrypted Document Vault"
      description="256-bit AES encrypted repository for NDAs, IP agreements, and executive contracts."
      items={[
        { id: "1", title: "Enterprise Master Service Agreement (MSA)", subtitle: "EquinoxSphere Corp · Encrypted Vault", status: "Active Contract", date: "Renews 2027", metric: "256-bit AES" },
      ]}
    />
  ),
});
