import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/page-header";
import { Newspaper, Sparkles, Calendar } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard/communication/news")({
  component: CommunicationNewsPage,
});

function CommunicationNewsPage() {
  const articles = [
    { id: "1", title: "Northwind Expands Singapore APAC Office & AI R&D Campus", date: "Aug 01, 2026", category: "Corporate News", snippet: "We are thrilled to announce the grand opening of our new Singapore R&D Innovation Hub." },
    { id: "2", title: "Engineering Team Wins Global Enterprise HR AI Innovation Award", date: "Jul 28, 2026", category: "Awards & Recognition", snippet: "Recognized for autonomous employee onboarding agentic workflow implementation." },
  ];

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
    </div>
  );
}
