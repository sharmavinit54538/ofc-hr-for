import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/page-header";

export const Route = createFileRoute("/_authenticated/dashboard/approvals/resignations")({
  component: ResignationsApprovalsPage,
});

function ResignationsApprovalsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Resignations & Department Clearance Sign-offs"
        description="Notice period approvals, exit interview reviews, and no-dues clearance sign-offs."
        breadcrumbs={[{ label: "Approvals", href: "/dashboard/approvals" }, { label: "Resignations" }]}
        backHref="/dashboard/approvals"
      />
      <div className="glass-tile rounded-2xl p-6 text-xs text-muted-foreground">3 Resignation Clearances Currently Active.</div>
    </div>
  );
}
