import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Megaphone, Search, Loader2, Inbox } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { useGetCompanyAnnouncementsQuery } from "@/services/employeeDashboardApi";

export const Route = createFileRoute("/_authenticated/dashboard/communication/announcements")({
  component: CommunicationAnnouncementsPage,
});

function CommunicationAnnouncementsPage() {
  const { data: announcementsRes, isLoading } = useGetCompanyAnnouncementsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const announcements = announcementsRes?.data ?? [];
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = announcements.filter(
    (a) =>
      (a.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.body || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.priority || "").toLowerCase().includes(searchQuery.toLowerCase()),
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
            placeholder="Search announcement title, priority, content..."
            className="w-full rounded-xl border border-input bg-card/60 py-2 pl-9 pr-4 text-xs outline-none focus:border-ring"
          />
        </div>
        <span className="text-xs font-semibold text-muted-foreground">
          {filtered.length} Active Notices
        </span>
      </div>

      {isLoading ? (
        <div className="glass-tile rounded-2xl p-12 text-center text-xs text-muted-foreground flex flex-col items-center justify-center gap-2">
          <Loader2 className="size-5 animate-spin text-primary" />
          Loading company announcements...
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-tile rounded-2xl p-12 text-center text-xs text-muted-foreground flex flex-col items-center justify-center gap-2">
          <Inbox className="size-8 text-muted-foreground/50" />
          <p className="font-medium text-foreground text-sm">No Company Announcements Found</p>
          <p className="text-[11px] max-w-xs">
            There are currently no active announcements published.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filtered.map((anc) => (
            <div key={anc.id} className="glass-tile space-y-3 rounded-2xl p-5 transition-all hover-lift">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                  {anc.priority || "Notice"}
                </span>
                <span className="text-xs font-mono text-muted-foreground">{anc.date}</span>
              </div>

              <h3 className="font-display text-lg font-bold text-foreground">{anc.title}</h3>
              <p className="text-xs leading-relaxed text-muted-foreground">{anc.body}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
