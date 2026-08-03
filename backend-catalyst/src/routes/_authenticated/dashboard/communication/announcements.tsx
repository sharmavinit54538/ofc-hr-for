import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Megaphone, Plus, Search, Eye, Calendar, UserCheck } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";
import { MOCK_ANNOUNCEMENTS } from "@/lib/communication/mock-data";

export const Route = createFileRoute("/_authenticated/dashboard/communication/announcements")({
  component: CommunicationAnnouncementsPage,
});

function CommunicationAnnouncementsPage() {
  const [announcements] = useState(MOCK_ANNOUNCEMENTS);
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = announcements.filter(
    (a) =>
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.author.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Company Announcements & Official Notices"
        description="Official executive notices, policy updates, CEO townhall recordings, and health & safety bulletins."
        breadcrumbs={[
          { label: "Communication", href: "/dashboard/communication" },
          { label: "Announcements" },
        ]}
        backHref="/dashboard/communication"
        backLabel="Back to Communication Center"
      />

      <div className="glass-tile flex items-center justify-between rounded-2xl p-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search announcement title, category, author..."
            className="w-full rounded-xl border border-input bg-card/60 py-2 pl-9 pr-4 text-xs outline-none focus:border-ring"
          />
        </div>
        <span className="text-xs font-semibold text-muted-foreground">
          {filtered.length} Active Notices
        </span>
      </div>

      <div className="grid gap-4">
        {filtered.map((anc) => (
          <div key={anc.id} className="glass-tile space-y-3 rounded-2xl p-5 transition-all hover-lift">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                {anc.category}
              </span>
              <span className="text-xs font-mono text-muted-foreground">{anc.publishedDate}</span>
            </div>

            <h3 className="font-display text-lg font-bold text-foreground">{anc.title}</h3>
            <p className="text-xs leading-relaxed text-muted-foreground">{anc.content}</p>

            <div className="flex items-center justify-between pt-3 border-t border-border/40 text-xs">
              <span className="text-muted-foreground">Author: <strong className="text-foreground">{anc.author}</strong></span>
              <span className="font-semibold text-emerald-400">Read Receipts: {anc.readCount} / {anc.totalRecipients} ({Math.round((anc.readCount / anc.totalRecipients) * 100)}%)</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
