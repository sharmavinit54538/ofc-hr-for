import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { AuthLayout } from "@/components/auth/auth-layout";
import { useRefreshMutation, useLazyGetMeQuery } from "@/services/authApi";
import { getLandingRoute } from "@/lib/auth/roles";
import { toast } from "sonner";

export const Route = createFileRoute("/auth/loading")({
  head: () => ({
    meta: [
      { title: "Preparing your workspace · OFC HR" },
      {
        name: "description",
        content:
          "OFC HR is establishing a secure session and loading your AI workforce workspace.",
      },
      { property: "og:title", content: "Preparing your workspace · OFC HR" },
      {
        property: "og:description",
        content: "Establishing a secure OFC HR session and loading your workspace.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthLoadingPage,
});

const steps = [
  "Validating enterprise identity",
  "Resolving workspace tenant",
  "Loading AI workforce agents",
];

function AuthLoadingPage() {
  const navigate = useNavigate();
  const [triggerRefresh] = useRefreshMutation();
  const [triggerGetMe] = useLazyGetMeQuery();

  useEffect(() => {
    async function completeSSO() {
      try {
        await triggerRefresh().unwrap();
        const meRes = await triggerGetMe().unwrap();
        const role = meRes.data?.role || "EMPLOYEE";
        toast.success("Single Sign-On Successful");
        navigate({ to: getLandingRoute(role) } as any);
      } catch {
        toast.error("Single Sign-On Failed", {
          description: "Could not establish secure session. Please log in manually.",
        });
        navigate({ to: "/auth/login" } as any);
      }
    }
    completeSSO();
  }, [navigate, triggerGetMe, triggerRefresh]);

  return (
    <AuthLayout
      title="Preparing your workspace"
      subtitle="Establishing a secure session with OFC HR."
    >
      <div>
        <div className="h-1.5 overflow-hidden rounded-full bg-border">
          <motion.div
            className="h-full w-1/3 rounded-full bg-gradient-brand"
            animate={{ x: ["-100%", "300%"] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <ul className="mt-6 space-y-2.5 text-left">
          {steps.map((step, index) => (
            <motion.li
              key={step}
              initial={{ opacity: 0.35 }}
              animate={{ opacity: [0.35, 1, 0.35] }}
              transition={{
                duration: 2.1,
                repeat: Infinity,
                delay: index * 0.5,
              }}
              className="flex items-center gap-2.5 text-sm text-muted-foreground"
            >
              <span className="size-1.5 shrink-0 rounded-full bg-gradient-brand" />
              {step}
            </motion.li>
          ))}
        </ul>
      </div>
    </AuthLayout>
  );
}
