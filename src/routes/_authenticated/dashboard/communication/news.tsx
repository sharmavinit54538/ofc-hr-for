import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/page-header";
import { Inbox } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard/communication/news")({
  component: CommunicationNewsPage,
});

function CommunicationNewsPage() {
  const articles: any[] = [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Company News & Internal Digest"
        description="Internal corporate newsletter, team spotlights, leadership blogs, and major organizational milestones."
        breadcrumbs={[
          { label: "Communication", href: "/dashboard/communication" },
          { label: "Company News" },
        ]}
        backHref="/dashboard/communication"
        backLabel="Back to Communication Center"
      />

      {articles.length === 0 ? (
        <div className="glass-tile flex flex-col items-center justify-center p-12 text-center rounded-2xl space-y-3">
          <Inbox className="size-10 text-muted-foreground/60" />
          <h3 className="font-display text-base font-bold text-foreground">No News Articles Found</h3>
          <p className="text-xs text-muted-foreground max-w-sm">
            There are currently no internal news digest articles published.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2">
          {articles.map((item) => (
            <div key={item.id} className="glass-tile space-y-3 rounded-2xl p-5 transition-all hover-lift">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold text-primary">{item.category}</span>
                <span className="text-[11px] text-muted-foreground">{item.date}</span>
              </div>
              <h3 className="font-display text-base font-bold text-foreground">{item.title}</h3>
              <p className="text-xs text-muted-foreground">{item.snippet}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
