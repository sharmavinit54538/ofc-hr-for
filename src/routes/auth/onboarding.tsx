import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, RefreshCw, ShieldCheck } from "lucide-react";
import { useCallback, useEffect } from "react";
import { toast } from "sonner";
import { AuthLayout } from "@/components/auth/auth-layout";
import { AddressStep } from "@/components/auth/register/address-step";
import { AdminStep } from "@/components/auth/register/admin-step";
import { OrganizationStep } from "@/components/auth/register/organization-step";
import { ReviewStep } from "@/components/auth/register/review-step";
import { SuccessStep } from "@/components/auth/register/success-step";
import { Stepper } from "@/components/common/stepper";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { REGISTRATION_STEPS } from "@/lib/auth/registration";
import { useOnboardingStore } from "@/store/useOnboardingStore";
import { useAuthStore } from "@/store/useAuthStore";

export const Route = createFileRoute("/auth/onboarding")({
  head: () => ({
    meta: [
      { title: "Onboard your organization · OFC HR" },
      {
        name: "description",
        content:
          "Complete your OFC HR workspace setup: company profile, registered address, and enterprise security defaults.",
      },
      { property: "og:title", content: "Onboard your organization · OFC HR" },
      {
        property: "og:description",
        content:
          "Provision an OFC HR enterprise tenant in four guided steps with security policies applied by default.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: OnboardingPage,
});

const STEP_COPY = [
  {
    title: "Register your organization",
    subtitle: "Tell us about the company that will own this OFC HR tenant.",
  },
  {
    title: "Registered address",
    subtitle: "Used on payroll documents, invoices and compliance exports.",
  },
  {
    title: "First HR administrator",
    subtitle: "This account receives full HR administration rights for the tenant.",
  },
  {
    title: "Review and confirm",
    subtitle: "Check the details before we provision your enterprise workspace.",
  },
  {
    title: "Workspace provisioned",
    subtitle: "Your tenant is ready. Continue to the dashboard.",
  },
];

function OnboardingPage() {
  const navigate = useNavigate();
  const {
    currentStep,
    completed,
    draft,
    isLoading,
    isSaving,
    error,
    fetchData,
    saveStep,
    completeOnboarding,
    setStep,
    clearError,
  } = useOnboardingStore();

  const fetchMe = useAuthStore((s) => s.fetchMe);

  // Synchronize with backend on mount
  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  // Handle step completion redirect
  useEffect(() => {
    if (completed) {
      setStep(4);
    }
  }, [completed, setStep]);

  const handleNextStep = async (stepIndex: number, values: Record<string, any>) => {
    const success = await saveStep(stepIndex, values);
    if (success) {
      toast.success("Progress saved");
      setStep(stepIndex + 1);
    } else {
      toast.error("Failed to save step progress. Please check inputs.");
    }
  };

  const handleSubmit = async () => {
    const success = await completeOnboarding();
    if (success) {
      await fetchMe();
      toast.success("Enterprise workspace created!", {
        description: `${draft.companyName || "Your organization"} is provisioned and ready.`,
      });
      void navigate({ to: "/dashboard" });
    } else {
      toast.error("Completion failed. Please try again.");
    }
  };

  const goToDashboard = useCallback(() => {
    void navigate({ to: "/dashboard" });
  }, [navigate]);

  const copy = STEP_COPY[currentStep] ?? STEP_COPY[0]!;
  const completionPct = Math.round((currentStep / 4) * 100);

  return (
    <AuthLayout
      title={copy.title}
      subtitle={copy.subtitle}
      badge={
        <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-primary">
          <ShieldCheck className="size-3.5" aria-hidden="true" />
          Enterprise onboarding ({completionPct}%)
        </span>
      }
    >
      <div className="space-y-7">
        <Stepper steps={[...REGISTRATION_STEPS]} current={currentStep} />

        {/* Loading Skeleton */}
        {isLoading ? (
          <div className="space-y-4 rounded-xl border p-6">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-2/3" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : error ? (
          /* Error Retry Card */
          <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center space-y-4">
            <div className="flex justify-center">
              <AlertCircle className="size-10 text-destructive" />
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-destructive">Failed to load onboarding</h3>
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
            <div className="flex justify-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  clearError();
                  void fetchData();
                }}
              >
                <RefreshCw className="mr-2 size-4" />
                Retry
              </Button>
            </div>
          </div>
        ) : (
          /* Animated Step Wizard */
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {currentStep === 0 && (
                <OrganizationStep
                  draft={draft}
                  onNext={(values) => void handleNextStep(0, values)}
                />
              )}
              {currentStep === 1 && (
                <AddressStep
                  draft={draft}
                  onBack={() => setStep(0)}
                  onNext={(values) => void handleNextStep(1, values)}
                />
              )}
              {currentStep === 2 && (
                <AdminStep
                  draft={draft}
                  onBack={() => setStep(1)}
                  onNext={(values) => void handleNextStep(2, values)}
                />
              )}
              {currentStep === 3 && (
                <ReviewStep
                  draft={draft}
                  submitting={isSaving}
                  onBack={() => setStep(2)}
                  onSubmit={handleSubmit}
                />
              )}
              {currentStep === 4 && <SuccessStep draft={draft} onRedirect={goToDashboard} />}
            </motion.div>
          </AnimatePresence>
        )}

        {currentStep < 4 && !isLoading && (
          <p className="text-center text-sm text-muted-foreground">
            Already have a workspace?{" "}
            <Link to="/auth/login" className="font-semibold text-primary hover:underline">
              Sign in
            </Link>
          </p>
        )}
      </div>
    </AuthLayout>
  );
}
