import { createFileRoute } from "@tanstack/react-router";
import { Rocket } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";

export const Route = createFileRoute("/_authenticated/dashboard/manager/onboarding")({
  component: ManagerOnboardingPage,
});

function ManagerOnboardingPage() {
  const onboardingItems: any[] = [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Team Onboarding & Buddy Program"
        description="Track onboarding progress, assign onboard buddies, and verify 30-60-90 day milestone completions for new team hires."
        breadcrumbs={[{ label: "Manager", href: "/dashboard/manager" }, { label: "Onboarding" }]}
        backHref="/dashboard/manager"
      />

      {onboardingItems.length === 0 ? (
        <div className="glass-tile flex flex-col items-center justify-center p-12 text-center rounded-2xl space-y-3">
          <Rocket className="size-10 text-muted-foreground/60" />
          <h3 className="font-display text-base font-bold text-foreground">No New Hire Onboarding Active</h3>
          <p className="text-xs text-muted-foreground max-w-sm">
            When new employees join your direct team, their 30-60-90 day onboarding progress will be tracked here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {onboardingItems.map((item) => (
            <div key={item.id} className="glass-tile rounded-2xl p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/40 pb-3">
                <div>
                  <span className="font-mono text-xs font-bold text-primary">{item.id}</span>
                  <h3 className="font-display text-base font-bold text-foreground mt-0.5">{item.newHire}</h3>
                  <p className="text-xs text-muted-foreground">{item.role} · Joined {item.startDate}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">Buddy: <strong className="text-foreground">{item.buddy}</strong></span>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-muted-foreground">Onboarding Progress</span>
                  <span className="text-primary font-bold">{item.progress}% Completed</span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-secondary">
                  <div className="h-full bg-gradient-brand" style={{ width: `${item.progress}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
