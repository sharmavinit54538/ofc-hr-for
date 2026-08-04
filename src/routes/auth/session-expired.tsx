import { createFileRoute, Link } from "@tanstack/react-router";
import { Clock, RotateCcw } from "lucide-react";
import { AuthLayout } from "@/components/auth/auth-layout";
import { LoadingButton } from "@/components/auth/loading-button";

export const Route = createFileRoute("/auth/session-expired")({
  head: () => ({
    meta: [
      { title: "Session expired · OFC HR" },
      {
        name: "description",
        content:
          "Your OFC HR session ended for security reasons. Sign in again to resume workforce operations.",
      },
      { property: "og:title", content: "Session expired · OFC HR" },
      {
        property: "og:description",
        content: "Your OFC HR session timed out. Re-authenticate to continue.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SessionExpiredPage,
});

function SessionExpiredPage() {
  return (
    <AuthLayout
      badge={
        <span className="glass-soft inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em]">
          <Clock className="size-3.5 text-accent" aria-hidden="true" />
          Session timeout
        </span>
      }
      title="Your session has expired"
      subtitle="For security, OFC HR ends idle sessions after 30 minutes. Your unsaved drafts were preserved."
    >
      <div className="space-y-5">
        <dl className="glass-soft space-y-3 rounded-2xl p-4 text-sm">
          <div className="flex items-center justify-between gap-3">
            <dt className="text-muted-foreground">Signed in as</dt>
            <dd className="truncate font-semibold">user@company.com</dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="text-muted-foreground">Last activity</dt>
            <dd className="font-semibold">32 minutes ago</dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="text-muted-foreground">Policy</dt>
            <dd className="font-semibold">Idle timeout · 30 min</dd>
          </div>
        </dl>

        <Link to="/auth/login" className="block">
          <LoadingButton type="button">
            <RotateCcw className="size-4" aria-hidden="true" />
            Sign in again
          </LoadingButton>
        </Link>

        <Link
          to="/auth/forgot-password"
          className="block text-center text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
        >
          I need help accessing my account
        </Link>
      </div>
    </AuthLayout>
  );
}
