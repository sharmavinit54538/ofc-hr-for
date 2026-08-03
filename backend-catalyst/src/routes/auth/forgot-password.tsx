import { createFileRoute, Link } from "@tanstack/react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { AuthInput } from "@/components/auth/auth-input";
import { AuthLayout } from "@/components/auth/auth-layout";
import { LoadingButton } from "@/components/auth/loading-button";
import { ValidationMessage } from "@/components/auth/validation-message";
import { useForgotPasswordMutation } from "@/services/authApi";

export const Route = createFileRoute("/auth/forgot-password")({
  head: () => ({
    meta: [
      { title: "Reset access · OFC HR" },
      {
        name: "description",
        content:
          "Request a secure password reset link for your OFC HR enterprise workforce account.",
      },
    ],
  }),
  component: ForgotPasswordPage,
});

const schema = z.object({
  email: z.string().trim().min(1, "Work email is required").email("Enter a valid work email"),
});

function ForgotPasswordPage() {
  const [forgotPasswordMutation, { isLoading }] = useForgotPasswordMutation();
  const [sentSuccess, setSentSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await forgotPasswordMutation({ email: values.email }).unwrap();
      setSentSuccess(true);
      toast.success("Password Reset Requested", {
        description: "A recovery email has been sent to your inbox.",
      });
    } catch (err: any) {
      const detail = err?.data?.detail || err?.data?.message || "Failed to request password reset.";
      toast.error("Request Failed", {
        description: detail,
      });
    }
  });

  return (
    <AuthLayout
      title={sentSuccess ? "Check your inbox" : "Reset your password"}
      subtitle={
        sentSuccess
          ? "We've dispatched a password recovery link to your work email."
          : "We'll send a single-use recovery link to your verified work address."
      }
    >
      {sentSuccess ? (
        <div className="space-y-6">
          <ValidationMessage
            tone="success"
            message="Instructions sent! Please check your email inbox and click the reset link to choose a new password."
          />

          <p className="text-xs text-muted-foreground leading-relaxed">
            If you don't see the email within a few minutes, check your spam or promotions folder.
          </p>

          <Link
            to="/auth/login"
            className="flex items-center justify-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:underline pt-2"
          >
            <ArrowLeft className="size-3.5" aria-hidden="true" />
            Back to sign in
          </Link>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-5" noValidate>
          <AuthInput
            label="Work email"
            placeholder="you@company.com"
            autoComplete="email"
            icon={<Mail className="size-4" />}
            error={errors.email?.message}
            {...register("email")}
          />

          <LoadingButton type="submit" loading={isLoading}>
            Send recovery link
          </LoadingButton>

          <Link
            to="/auth/login"
            className="flex items-center justify-center gap-1.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" aria-hidden="true" />
            Back to sign in
          </Link>
        </form>
      )}
    </AuthLayout>
  );
}
