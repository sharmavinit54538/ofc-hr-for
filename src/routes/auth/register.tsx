import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Mail, User } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { AuthInput } from "@/components/auth/auth-input";
import { AuthLayout } from "@/components/auth/auth-layout";
import { Divider } from "@/components/auth/divider";
import { LoadingButton } from "@/components/auth/loading-button";
import { PasswordField } from "@/components/auth/password-field";
import { SocialLoginButtons } from "@/components/auth/social-login-buttons";
import { GuestGuard } from "@/components/auth/guards";
import { useRegisterMutation } from "@/services/authApi";

export const Route = createFileRoute("/auth/register")({
  head: () => ({
    meta: [
      { title: "Create your OFC HR account" },
      {
        name: "description",
        content:
          "Sign up for OFC HR with your work email. Verify your address, then onboard your organization.",
      },
      { property: "og:title", content: "Create your OFC HR account" },
      {
        property: "og:description",
        content:
          "Sign up for OFC HR with your work email. Verify your address, then onboard your organization.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RegisterPage,
});

const schema = z
  .object({
    fullName: z.string().min(2, "Enter your full name"),
    organizationName: z.string().min(2, "Enter your organization name"),
    email: z.string().trim().min(1, "Work email is required").email("Enter a valid work email"),
    password: z
      .string()
      .min(8, "Use at least 8 characters")
      .regex(/[A-Z]/, "Include an uppercase letter")
      .regex(/[a-z]/, "Include a lowercase letter")
      .regex(/\d/, "Include a number")
      .regex(/[^A-Za-z0-9]/, "Include a symbol"),
    confirmPassword: z.string().min(1, "Confirm the password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

function RegisterPage() {
  const navigate = useNavigate();
  const [registerMutation, { isLoading }] = useRegisterMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: "",
      organizationName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      const res: any = await registerMutation({
        email: values.email,
        password: values.password,
        full_name: values.fullName,
        organization_name: values.organizationName,
      }).unwrap();

      const devOtp = res?.data?.otp_debug || res?.otp_debug;

      toast.success("Account created successfully", {
        description: devOtp
          ? `Verification OTP generated. Dev Code: ${devOtp}`
          : "Please enter the verification OTP sent to your work email.",
      });

      navigate({
        to: "/auth/verify-email" as any,
        search: { email: values.email, devOtp: devOtp || "" } as any,
      });
    } catch (err: any) {
      const detail = err?.data?.detail || err?.data?.message || "Registration failed. Please check your details.";
      toast.error("Registration Failed", {
        description: detail,
      });
    }
  });

  return (
    <GuestGuard>
      <AuthLayout
        title="Create your OFC HR account"
        subtitle="Start with your details. We'll verify your email before onboarding your organization."
      >
        <form onSubmit={onSubmit} className="space-y-3" noValidate>
          <AuthInput
            label="Full name"
            placeholder="John Doe"
            autoComplete="name"
            icon={<User className="size-4" />}
            error={errors.fullName?.message}
            {...register("fullName")}
          />
          <AuthInput
            label="Organization Name"
            placeholder="Acme Corp"
            autoComplete="organization"
            icon={<User className="size-4" />}
            error={errors.organizationName?.message}
            {...register("organizationName")}
          />
          <AuthInput
            label="Work email"
            placeholder="you@company.com"
            autoComplete="email"
            icon={<Mail className="size-4" />}
            error={errors.email?.message}
            {...register("email")}
          />
          <PasswordField
            label="Password"
            autoComplete="new-password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register("password")}
          />
          <PasswordField
            label="Confirm password"
            autoComplete="new-password"
            placeholder="••••••••"
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />

          <LoadingButton loading={isLoading} type="submit" className="mt-2">
            <span>Create account</span>
            <ArrowRight className="size-4" />
          </LoadingButton>
        </form>

        <Divider label="or sign up with" />

        <SocialLoginButtons />

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Already have an account?{" "}
          <Link
            to="/auth/login"
            className="font-semibold text-primary hover:text-primary/90 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </AuthLayout>
    </GuestGuard>
  );
}
