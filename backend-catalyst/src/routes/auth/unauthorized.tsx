import { createFileRoute, Link } from "@tanstack/react-router";
import { LifeBuoy, ShieldAlert } from "lucide-react";
import { AuthLayout } from "@/components/auth/auth-layout";
import { LoadingButton } from "@/components/auth/loading-button";

export const Route = createFileRoute("/auth/unauthorized")({
  head: () => ({
    meta: [
      { title: "Access restricted · OFC HR" },
      {
        name: "description",
        content:
          "Your OFC HR role does not include permission for this workspace area. Request elevated access from your administrator.",
      },
      { property: "og:title", content: "Access restricted · OFC HR" },
      {
        property: "og:description",
        content: "This OFC HR area requires elevated workspace permissions.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: UnauthorizedPage,
});

function UnauthorizedPage() {
  return (
    <AuthLayout
      badge={
        <span className="glass-soft inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em]">
          <ShieldAlert className="size-3.5 text-destructive" aria-hidden="true" />
          Error 403
        </span>
      }
      title="You don't have access to this area"
      subtitle="Your current role doesn't include permission for this workspace module. An administrator can grant elevated access."
    >
      <div className="space-y-5">
        <dl className="glass-soft space-y-3 rounded-2xl p-4 text-sm">
          <div className="flex items-center justify-between gap-3">
            <dt className="text-muted-foreground">Role</dt>
            <dd className="truncate font-semibold">People Operations Lead</dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="text-muted-foreground">Required scope</dt>
            <dd className="truncate font-semibold">workforce.admin</dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="text-muted-foreground">Tenant</dt>
            <dd className="truncate font-semibold">OFC HR Demo Workspace</dd>
          </div>
        </dl>

        <LoadingButton type="button">
          <LifeBuoy className="size-4" aria-hidden="true" />
          Request access
        </LoadingButton>

        <Link to="/auth/login" className="block">
          <LoadingButton type="button" variant="ghost">
            Switch account
          </LoadingButton>
        </Link>
      </div>
    </AuthLayout>
  );
}
