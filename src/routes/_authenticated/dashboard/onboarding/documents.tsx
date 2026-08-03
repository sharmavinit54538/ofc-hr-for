import { createFileRoute } from "@tanstack/react-router";
import { GenericSubModuleView } from "@/components/admin/generic-module-view";

export const Route = createFileRoute("/_authenticated/dashboard/onboarding/documents")({
  component: () => (
    <GenericSubModuleView
      href="/dashboard/onboarding/documents"
      parentHref="/dashboard/onboarding"
      parentLabel="Onboarding"
      title="Document Verification Vault"
      description="Collection and verification of government IDs, tax filings, and educational transcripts."
      items={[
        { id: "1", title: "Passport & Identity Proof", subtitle: "Arjun Gupta", status: "Verified", date: "Aug 1, 2026", metric: "100% Match" },
        { id: "2", title: "Tax Form W-4 / Form 16", subtitle: "Meera Iyer", status: "Pending Review", date: "Submitted Today", metric: "Awaiting HR Signoff" },
      ]}
    />
  ),
});
