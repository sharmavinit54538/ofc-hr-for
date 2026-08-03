import { createFileRoute } from "@tanstack/react-router";
import { GenericSubModuleView } from "@/components/admin/generic-module-view";

export const Route = createFileRoute("/_authenticated/dashboard/recruitment/offers")({
  component: () => (
    <GenericSubModuleView
      href="/dashboard/recruitment/offers"
      parentHref="/dashboard/recruitment"
      parentLabel="Recruitment"
      title="Offer Approvals & Letters"
      description="Compensation approval workflow, e-signature dispatch, and offer status."
      items={[
        { id: "1", title: "Kavita Rao - HR Business Partner", subtitle: "Package: $115,000 / year + ESOPs", status: "Pending Candidate Signature", date: "Expires in 3 days", metric: "DocuSign Sent" },
        { id: "2", title: "Arjun Gupta - Senior Frontend Lead", subtitle: "Package: $165,000 / year", status: "Accepted", date: "Signed Aug 1", metric: "Onboarding Triggered" },
      ]}
    />
  ),
});
