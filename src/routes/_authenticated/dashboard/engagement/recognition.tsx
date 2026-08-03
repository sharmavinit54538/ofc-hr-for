import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/page-header";
import { MOCK_RECOGNITIONS } from "@/lib/engagement/mock-data";
import { HeartHandshake } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard/engagement/recognition")({
  component: RecognitionWallPage,
});

function RecognitionWallPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Public Recognition Wall & Peer Shoutouts"
        description="Employee kudos feed, peer appreciation posts, and executive shoutouts."
        breadcrumbs={[{ label: "Employee Engagement", href: "/dashboard/engagement" }, { label: "Recognition Wall" }]}
        backHref="/dashboard/engagement"
      />
      <div className="grid gap-4">
        {MOCK_RECOGNITIONS.map((r) => (
          <div key={r.id} className="glass-tile space-y-2 rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-foreground">{r.senderName} ➔ {r.recipientName}</span>
              <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-bold text-amber-400">🏆 {r.badge}</span>
            </div>
            <p className="text-xs text-muted-foreground">{r.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
