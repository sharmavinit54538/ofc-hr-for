import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { AuthLayout } from "@/components/auth/auth-layout";

export const Route = createFileRoute("/auth/verify-email")({
  head: () => ({
    meta: [
      { title: "Verify your email · OFC HR" },
      {
        name: "description",
        content:
          "Confirm your work email address to activate your OFC HR workspace.",
      },
    ],
  }),
  component: VerifyEmailPage,
});

function VerifyEmailPage() {
  return (
    <AuthLayout
      title="Email verification"
      subtitle="Email verification requires backend endpoint implementation."
    >
      <div className="space-y-5">
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-amber-500">
          <div className="flex items-start gap-3">
            <AlertCircle className="size-5 shrink-0 mt-0.5" />
            <div className="space-y-1 text-sm">
              <p className="font-semibold">Backend Endpoint Required</p>
              <p className="text-xs text-amber-500/90 leading-relaxed">
                The endpoints <code className="font-mono bg-amber-500/20 px-1 py-0.5 rounded">POST /api/v1/auth/verify-email</code> and <code className="font-mono bg-amber-500/20 px-1 py-0.5 rounded">POST /api/v1/auth/resend-verification</code> are currently missing on the backend server.
                In accordance with production rules, zero mock or simulated responses are generated. This feature will be functional as soon as the API endpoints are implemented in the FastAPI backend.
              </p>
            </div>
          </div>
        </div>

        <Link
          to="/auth/login"
          className="flex items-center justify-center gap-1.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground pt-2"
        >
          <ArrowLeft className="size-3.5" aria-hidden="true" />
          Return to sign in
        </Link>
      </div>
    </AuthLayout>
  );
}
