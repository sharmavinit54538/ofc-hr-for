import { useState, useEffect } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  MailCheck,
  RotateCw,
  CheckCircle2,
  Edit2,
  Check,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { AuthLayout } from "@/components/auth/auth-layout";
import { LoadingButton } from "@/components/auth/loading-button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp";
import { useVerifyEmailMutation, useResendOtpMutation } from "@/services/authApi";

const verifyEmailSearchSchema = z.object({
  email: z.string().optional(),
  devOtp: z.string().optional(),
});

export const Route = createFileRoute("/auth/verify-email")({
  validateSearch: (search) => verifyEmailSearchSchema.parse(search),
  head: () => ({
    meta: [
      { title: "Verify your email · OFC HR" },
      {
        name: "description",
        content:
          "Enter your 6-digit OTP verification code to activate your OFC HR admin account.",
      },
    ],
  }),
  component: VerifyEmailPage,
});

function VerifyEmailPage() {
  const navigate = useNavigate();
  const search = Route.useSearch() as { email?: string; devOtp?: string };
  const initialEmail = search.email || "";
  const initialDevOtp = search.devOtp || "";

  const [email, setEmail] = useState(initialEmail);
  const [isEditingEmail, setIsEditingEmail] = useState(!initialEmail);
  const [tempEmail, setTempEmail] = useState(initialEmail);
  const [otp, setOtp] = useState(initialDevOtp);
  const [activeDevOtp, setActiveDevOtp] = useState(initialDevOtp);
  const [resendTimer, setResendTimer] = useState(60);
  const [isVerified, setIsVerified] = useState(false);

  const [verifyEmail, { isLoading: isVerifying }] = useVerifyEmailMutation();
  const [resendOtp, { isLoading: isResending }] = useResendOtpMutation();

  // Countdown timer for Resend OTP
  useEffect(() => {
    if (resendTimer <= 0) return;
    const interval = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleVerify = async (codeToVerify?: string) => {
    const code = codeToVerify || otp;
    if (!email) {
      toast.error("Email address is required");
      return;
    }
    if (code.length < 6) {
      toast.error("Please enter the complete 6-digit OTP code");
      return;
    }

    try {
      await verifyEmail({ email, otp: code }).unwrap();
      setIsVerified(true);
      toast.success("Email Verified!", {
        description: "Your account is now activated. Proceeding to organization onboarding...",
      });
      setTimeout(() => {
        navigate({ to: "/auth/onboarding" as any });
      }, 1500);
    } catch (err: any) {
      const detail =
        err?.data?.detail ||
        err?.data?.message ||
        "Invalid or expired OTP. Please check the code and try again.";
      toast.error("Verification Failed", {
        description: detail,
      });
    }
  };

  const handleResendOtp = async () => {
    if (!email) {
      toast.error("Please provide a valid work email address");
      return;
    }
    try {
      const res: any = await resendOtp({ email }).unwrap();
      const newDevOtp = res?.data?.otp_debug || res?.otp_debug;
      if (newDevOtp) {
        setActiveDevOtp(newDevOtp);
        setOtp(newDevOtp);
      }
      setResendTimer(60);
      toast.success("OTP Sent!", {
        description: newDevOtp
          ? `New 6-digit OTP generated: ${newDevOtp}`
          : `A new 6-digit OTP code has been dispatched to ${email}`,
      });
    } catch (err: any) {
      const detail =
        err?.data?.detail || err?.data?.message || "Failed to resend OTP.";
      toast.error("Resend Failed", { description: detail });
    }
  };

  const handleSaveEmail = () => {
    if (!tempEmail || !tempEmail.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }
    setEmail(tempEmail);
    setIsEditingEmail(false);
    toast.info("Email updated", {
      description: `Verification target updated to ${tempEmail}`,
    });
  };

  return (
    <AuthLayout
      badge={
        <span className="glass-soft inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
          <ShieldCheck className="size-3.5 text-accent" aria-hidden="true" />
          Email Verification
        </span>
      }
      title={isVerified ? "Email verified!" : "Verify your work email"}
      subtitle={
        isVerified
          ? "Your HR Admin account is active. Redirecting you to sign in..."
          : "We have sent a 6-digit OTP code to your work email address."
      }
    >
      {isVerified ? (
        <div className="space-y-6 text-center py-4">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-500 shadow-glow">
            <CheckCircle2 className="size-9" />
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-bold text-foreground">
              Verification Complete
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-sm mx-auto">
              Your email address <span className="font-semibold text-foreground">{email}</span> has been verified successfully.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate({ to: "/auth/login" as any })}
            className="w-full rounded-xl bg-gradient-brand py-3 text-xs font-semibold text-primary-foreground shadow-glow hover:shadow-glow-lg transition-all font-medium"
          >
            Continue to Sign In
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Target Email Banner */}
          <div className="rounded-2xl border border-border/50 bg-accent/5 p-4 transition-all">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <MailCheck className="size-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                    Sent to
                  </p>
                  {isEditingEmail ? (
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="email"
                        value={tempEmail}
                        onChange={(e) => setTempEmail(e.target.value)}
                        placeholder="you@company.com"
                        className="h-8 w-full min-w-[200px] rounded-lg border border-input bg-background px-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                      <button
                        type="button"
                        onClick={handleSaveEmail}
                        className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                        title="Save Email"
                      >
                        <Check className="size-4" />
                      </button>
                    </div>
                  ) : (
                    <p className="truncate text-xs font-semibold text-foreground">
                      {email || "No email specified"}
                    </p>
                  )}
                </div>
              </div>

              {!isEditingEmail && (
                <button
                  type="button"
                  onClick={() => {
                    setTempEmail(email);
                    setIsEditingEmail(true);
                  }}
                  className="flex shrink-0 items-center gap-1 rounded-lg border border-border/60 bg-background/60 px-2.5 py-1 text-[11px] font-medium text-muted-foreground transition-all hover:bg-accent hover:text-foreground"
                >
                  <Edit2 className="size-3" />
                  Change
                </button>
              )}
            </div>
          </div>

          {/* OTP Input Section */}
          <div className="space-y-4">
            <div className="flex flex-col items-center justify-center space-y-2">
              <label className="text-xs font-medium text-muted-foreground">
                Enter 6-digit security code
              </label>

              {activeDevOtp && (
                <button
                  type="button"
                  onClick={() => setOtp(activeDevOtp)}
                  className="glass-soft inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-mono font-semibold text-primary hover:bg-primary/10 transition-colors"
                >
                  <span>Dev OTP: <strong>{activeDevOtp}</strong></span>
                  <span className="text-[10px] text-muted-foreground">(Click to fill)</span>
                </button>
              )}

              <InputOTP
                maxLength={6}
                value={otp}
                onChange={(val) => {
                  setOtp(val);
                  if (val.length === 6) {
                    handleVerify(val);
                  }
                }}
                autoFocus
                containerClassName="justify-center"
              >
                <InputOTPGroup className="gap-2">
                  <InputOTPSlot index={0} className="size-11 rounded-xl text-base font-semibold border-border/80 focus-within:ring-primary" />
                  <InputOTPSlot index={1} className="size-11 rounded-xl text-base font-semibold border-border/80 focus-within:ring-primary" />
                  <InputOTPSlot index={2} className="size-11 rounded-xl text-base font-semibold border-border/80 focus-within:ring-primary" />
                </InputOTPGroup>
                <InputOTPSeparator className="text-muted-foreground/40" />
                <InputOTPGroup className="gap-2">
                  <InputOTPSlot index={3} className="size-11 rounded-xl text-base font-semibold border-border/80 focus-within:ring-primary" />
                  <InputOTPSlot index={4} className="size-11 rounded-xl text-base font-semibold border-border/80 focus-within:ring-primary" />
                  <InputOTPSlot index={5} className="size-11 rounded-xl text-base font-semibold border-border/80 focus-within:ring-primary" />
                </InputOTPGroup>
              </InputOTP>
            </div>

            {/* Verify Button */}
            <LoadingButton
              type="button"
              loading={isVerifying}
              disabled={otp.length < 6 || isVerifying}
              onClick={() => handleVerify()}
              className="mt-4"
            >
              <span>Verify & Continue</span>
              <Sparkles className="size-4 ml-1" />
            </LoadingButton>

            {/* Resend OTP Section */}
            <div className="flex items-center justify-between rounded-xl bg-muted/40 p-3 text-xs">
              <span className="text-muted-foreground">
                Didn't receive the OTP code?
              </span>

              {resendTimer > 0 ? (
                <span className="font-semibold font-mono text-muted-foreground">
                  Resend in <span className="text-primary">{resendTimer}s</span>
                </span>
              ) : (
                <button
                  type="button"
                  disabled={isResending}
                  onClick={handleResendOtp}
                  className="flex items-center gap-1.5 font-semibold text-primary hover:text-primary/80 transition-colors disabled:opacity-50"
                >
                  <RotateCw className={`size-3.5 ${isResending ? "animate-spin" : ""}`} />
                  {isResending ? "Resending..." : "Resend OTP"}
                </button>
              )}
            </div>
          </div>

          {/* Footer Back Link */}
          <Link
            to="/auth/login"
            className="flex items-center justify-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground pt-2"
          >
            <ArrowLeft className="size-3.5" aria-hidden="true" />
            Return to sign in
          </Link>
        </div>
      )}
    </AuthLayout>
  );
}
