import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ShieldCheck, CheckCircle2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { AuthLayout } from "@/components/auth/auth-layout";
import { LoadingButton } from "@/components/auth/loading-button";
import { PasswordField } from "@/components/auth/password-field";
import { ValidationMessage } from "@/components/auth/validation-message";
import { useResetPasswordMutation } from "@/services/authApi";

export const Route = createFileRoute("/auth/reset-password")({
  head: () => ({
    meta: [
      { title: "Choose a new password · OFC HR" },
      {
        name: "description",
        content:
          "Set a new password for your OFC HR workspace with enterprise-grade complexity requirements.",
      },
    ],
  }),
  component: ResetPasswordPage,
});

const schema = z
  .object({
    password: z
      .string()
      .min(8, "Use at least 8 characters")
      .regex(/[A-Z]/, "Include an uppercase letter")
      .regex(/\d/, "Include a number"),
    confirm: z.string(),
  })
  .refine((data) => data.password === data.confirm, {
    path: ["confirm"],
    message: "Passwords do not match",
  });

function ResetPasswordPage() {
  const navigate = useNavigate();
  const search = Route.useSearch() as { token?: string };
  const token = search.token || "";

  const [resetPasswordMutation, { isLoading }] = useResetPasswordMutation();
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { password: "", confirm: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    if (!token) {
      toast.error("Reset token is missing from URL.");
      return;
    }

    try {
      await resetPasswordMutation({
        token,
        password: values.password,
      }).unwrap();

      setSuccess(true);
      toast.success("Password Updated", {
        description: "Your password has been changed. You can now sign in.",
      });
    } catch (err: any) {
      const detail = err?.data?.detail || err?.data?.message || "Failed to reset password.";
      toast.error("Reset Failed", {
        description: detail,
      });
    }
  });

  return (
    <AuthLayout
      badge={
        <span className="glass-soft inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em]">
          <ShieldCheck className="size-3.5 text-accent" aria-hidden="true" />
          Secure token verification
        </span>
      }
      title="Choose a new password"
      subtitle="Your new password will apply across all your OFC HR workspace logins."
    >
      {success ? (
        <div className="space-y-5">
          <ValidationMessage
            tone="success"
            message="Password updated successfully! All active sessions have been invalidated for your protection."
          />
          <button
            type="button"
            onClick={() => navigate({ to: "/auth/login" as any })}
            className="w-full rounded-xl bg-gradient-brand py-3 text-xs font-semibold text-primary-foreground shadow-glow hover:shadow-glow-lg transition-all"
          >
            Sign In Now
          </button>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-5" noValidate>
          {!token && (
            <ValidationMessage
              message="No reset token found in URL. Please use the password reset link from your recovery email."
            />
          )}

          <PasswordField
            showStrength
            label="New password"
            autoComplete="new-password"
            placeholder="Create a strong password"
            error={errors.password?.message}
            {...register("password")}
            value={watch("password")}
          />
          <PasswordField
            label="Confirm new password"
            autoComplete="new-password"
            placeholder="Repeat new password"
            error={errors.confirm?.message}
            {...register("confirm")}
            value={watch("confirm")}
          />

          <ul className="glass-soft space-y-1.5 rounded-2xl p-4 text-xs text-muted-foreground">
            <li>Minimum 8 characters with uppercase and a number</li>
            <li>All existing active sessions will be signed out</li>
          </ul>

          <LoadingButton type="submit" loading={isLoading} disabled={!token}>
            Update password
          </LoadingButton>

          <Link
            to="/auth/login"
            className="block text-center text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
          >
            Return to sign in
          </Link>
        </form>
      )}
    </AuthLayout>
  );
}
