import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { AuthLayout } from "@/components/auth/auth-layout";
import { AddressStep } from "@/components/auth/register/address-step";
import { AdminStep } from "@/components/auth/register/admin-step";
import { OrganizationStep } from "@/components/auth/register/organization-step";
import { ReviewStep } from "@/components/auth/register/review-step";
import { SuccessStep } from "@/components/auth/register/success-step";
import { Stepper } from "@/components/common/stepper";
import { REGISTRATION_STEPS, type RegistrationDraft } from "@/lib/auth/registration";
import {
  useGetOnboardingDataQuery,
  useGetOnboardingStatusQuery,
  useSaveOnboardingStepMutation,
  useCompleteOnboardingMutation,
  useLazyGetMeQuery,
} from "@/services/authApi";

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
  const { data: statusRes } = useGetOnboardingStatusQuery();
  const { data: onboardingDataRes } = useGetOnboardingDataQuery();
  const [saveStepMutation] = useSaveOnboardingStepMutation();
  const [completeOnboardingMutation] = useCompleteOnboardingMutation();
  const [triggerGetMe] = useLazyGetMeQuery();

  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<RegistrationDraft>({});
  const [submitting, setSubmitting] = useState(false);

  // Restore step and saved data from backend database on page refresh / load
  useEffect(() => {
    if (statusRes?.data?.current_step !== undefined) {
      setStep(statusRes.data.current_step);
    }
  }, [statusRes]);

  useEffect(() => {
    if (onboardingDataRes?.data) {
      const d = onboardingDataRes.data;
      setDraft({
        companyName: d.companyName || "",
        logo: d.logo || "",
        industry: d.industry || "",
        companySize: d.companySize || "",
        website: d.website || "",
        country: d.country || "",
        timezone: d.timezone || "",
        address: d.address || "",
        city: d.city || "",
        state: d.state || "",
        zipCode: d.zipCode || "",
        gstNumber: d.gstNumber || "",
        fullName: d.fullName || "",
        phone: d.phone || "",
        avatar: d.avatar || "",
        ...(d.termsAccepted ? { terms: true } : {}),
        ...(d.dpaAccepted ? { dataProcessing: true } : {}),
      });
    }
  }, [onboardingDataRes]);

  const mergeAndSaveStep = async (stepIndex: number, values: Partial<RegistrationDraft>) => {
    const updated = { ...draft, ...values };
    setDraft(updated);
    try {
      await saveStepMutation({ step: stepIndex, data: values }).unwrap();
    } catch (err: any) {
      console.warn("Failed to persist step progress to backend:", err);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);

    try {
      // 1. Save Step 3 agreements
      await saveStepMutation({
        step: 3,
        data: { terms: true, dataProcessing: true },
      }).unwrap();

      // 2. Complete onboarding in database
      await completeOnboardingMutation().unwrap();

      // 3. Refresh current user profile so Redux gets is_onboarding_completed: true
      await triggerGetMe().unwrap();

      setStep(4);
      toast.success("Enterprise workspace created", {
        description: `${draft.companyName || "Your organization"} is provisioned and ready.`,
      });
    } catch (e: any) {
      const detail = e?.data?.detail || e?.message || "Onboarding completion failed";
      toast.error(detail);
    } finally {
      setSubmitting(false);
    }
  };

  const goToDashboard = useCallback(() => {
    void navigate({ to: "/dashboard" });
  }, [navigate]);

  const copy = STEP_COPY[step] ?? STEP_COPY[0]!;

  return (
    <AuthLayout
      title={copy.title}
      subtitle={copy.subtitle}
      badge={
        <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-primary">
          <ShieldCheck className="size-3.5" aria-hidden="true" />
          Enterprise onboarding
        </span>
      }
    >
      <div className="space-y-7">
        <Stepper steps={[...REGISTRATION_STEPS]} current={step} />

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {step === 0 && (
              <OrganizationStep
                draft={draft}
                onNext={(values) => {
                  void mergeAndSaveStep(0, values);
                  setStep(1);
                }}
              />
            )}
            {step === 1 && (
              <AddressStep
                draft={draft}
                onBack={() => setStep(0)}
                onNext={(values) => {
                  void mergeAndSaveStep(1, values);
                  setStep(2);
                }}
              />
            )}
            {step === 2 && (
              <AdminStep
                draft={draft}
                onBack={() => setStep(1)}
                onNext={(values) => {
                  void mergeAndSaveStep(2, values);
                  setStep(3);
                }}
              />
            )}
            {step === 3 && (
              <ReviewStep
                draft={draft}
                submitting={submitting}
                onBack={() => setStep(2)}
                onSubmit={handleSubmit}
              />
            )}
            {step === 4 && <SuccessStep draft={draft} onRedirect={goToDashboard} />}
          </motion.div>
        </AnimatePresence>

        {step < 4 && (
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
