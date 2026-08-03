import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/page-header";
import { Award } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard/engagement/badges")({
  component: BadgesPage,
});

function BadgesPage() {
  const badges = [
    { name: "Innovation Star", icon: "🚀", desc: "Awarded for groundbreaking tech or workflow contributions" },
    { name: "Customer Champion", icon: "⭐", desc: "Awarded for exceptional client satisfaction" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gamified Achievement Badges"
        description="Earn digital badges for leadership, innovation, teamwork, and tenure milestones."
        breadcrumbs={[{ label: "Employee Engagement", href: "/dashboard/engagement" }, { label: "Badges" }]}
        backHref="/dashboard/engagement"
      />
      <div className="grid gap-4 sm:grid-cols-2">
        {badges.map((b) => (
          <div key={b.name} className="glass-tile flex items-center gap-4 rounded-2xl p-5">
            <span className="text-3xl">{b.icon}</span>
            <div>
              <h3 className="font-display text-base font-bold text-foreground">{b.name}</h3>
              <p className="text-xs text-muted-foreground">{b.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
