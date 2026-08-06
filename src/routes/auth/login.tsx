import { useEffect } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { AuthInput } from "@/components/auth/auth-input";
import { AuthLayout } from "@/components/auth/auth-layout";
import { Divider } from "@/components/auth/divider";
import { LoadingButton } from "@/components/auth/loading-button";
import { PasswordField } from "@/components/auth/password-field";
import { SocialLoginButtons } from "@/components/auth/social-login-buttons";
import { useLoginMutation, useLazyGetMeQuery } from "@/services/authApi";
import { GuestGuard } from "@/components/auth/guards";
import { getLandingRoute, normalizeRole } from "@/lib/auth/roles";
import type { Role } from "@/lib/auth/types";

export const Route = createFileRoute("/auth/login")({
  head: () => ({
    meta: [
      { title: "Sign in · OFC HR Workforce Platform" },
      {
        name: "description",
        content:
          "Sign in to OFC HR, the AI workforce platform that consolidates every office and people function into one enterprise workspace.",
      },
      { property: "og:title", content: "Sign in · OFC HR Workforce Platform" },
      {
        property: "og:description",
        content:
          "Access the OFC HR AI workforce control plane for people operations, planning and compliance.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LoginPage,
});

const schema = z.object({
  email: z.string().trim().min(1, "Work email is required").email("Enter a valid work email"),
  password: z.string().min(1, "Password is required"),
});

function LoginPage() {
  const navigate = useNavigate();
  const [loginMutation, { isLoading }] = useLoginMutation();
  const [triggerGetMe] = useLazyGetMeQuery();

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get("error") === "sso_failed") {
      toast.error("Google SSO Failed", {
        description: "Could not complete sign in with Google SSO. Please try again or use password authentication.",
      });
    }
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      const response = await loginMutation({
        email: values.email,
        password: values.password,
      }).unwrap();

      let rawRole = (response.data as any)?.role || (response as any)?.role || "HR_ADMIN";

      try {
        const meRes = await triggerGetMe().unwrap();
        if (meRes.data?.role) {
          rawRole = meRes.data.role;
        }
      } catch {
        // Fallback to response role
      }

      const role = normalizeRole(rawRole);

      toast.success("Signed in successfully", {
        description: `Welcome back to OFC HR`,
      });

      const targetLanding = getLandingRoute(role);
      navigate({ to: targetLanding as any });
    } catch (err: any) {
      const detail = err?.data?.detail || err?.data?.message || "Invalid email or password.";
      toast.error("Authentication Failed", {
        description: detail,
      });
    }
  });

  return (
    <GuestGuard>
      <AuthLayout
        title="Sign in to your workspace"
        subtitle="Use your corporate identity to access the OFC HR control plane."
      >
        <form onSubmit={onSubmit} className="space-y-5" noValidate>
          <AuthInput
            label="Work email"
            placeholder="you@company.com"
            autoComplete="email"
            icon={<Mail className="size-4" />}
            error={errors.email?.message}
            {...register("email")}
          />
          <PasswordField
            autoComplete="current-password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register("password")}
          />

          <div className="flex items-center justify-between text-xs">
            <Link
              to="/auth/forgot-password"
              className="font-medium text-primary hover:text-primary/90 hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <LoadingButton loading={isLoading} type="submit">
            <span>Sign in</span>
            <ArrowRight className="size-4" />
          </LoadingButton>
        </form>

        <Divider label="or continue with" />

        <SocialLoginButtons />

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Don&apos;t have an enterprise account?{" "}
          <Link
            to="/auth/register"
            className="font-semibold text-primary hover:text-primary/90 hover:underline"
          >
            Request onboarding
          </Link>
        </p>
      </AuthLayout>
    </GuestGuard>
  );
}
