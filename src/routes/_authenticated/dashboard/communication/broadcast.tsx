import { createFileRoute } from "@tanstack/react-router";
import { Radio, Inbox } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";

export const Route = createFileRoute("/_authenticated/dashboard/communication/broadcast")({
  component: CommunicationBroadcastPage,
});

function CommunicationBroadcastPage() {
  const broadcasts: any[] = [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Multi-Channel Broadcast Campaigns"
        description="Dispatch critical workforce broadcasts via SMS, Email, and Push Notifications."
        breadcrumbs={[
          { label: "Communication", href: "/dashboard/communication" },
          { label: "Broadcast" },
        ]}
        backHref="/dashboard/communication"
        backLabel="Back to Communication Center"
      />

      {broadcasts.length === 0 ? (
        <div className="glass-tile flex flex-col items-center justify-center p-12 text-center rounded-2xl space-y-3">
          <Inbox className="size-10 text-muted-foreground/60" />
          <h3 className="font-display text-base font-bold text-foreground">No Broadcast Campaigns Found</h3>
          <p className="text-xs text-muted-foreground max-w-sm">
            There are no broadcast campaigns dispatched yet.
          </p>
        </div>
      ) : (
        <div className="glass-tile overflow-hidden rounded-2xl border border-border">
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border/60 bg-card/60 uppercase tracking-[0.08em] text-muted-foreground">
                <tr>
                  <th className="px-5 py-3.5 font-bold">Broadcast ID</th>
                  <th className="px-5 py-3.5 font-bold">Subject</th>
                  <th className="px-5 py-3.5 font-bold">Channel</th>
                  <th className="px-5 py-3.5 font-bold">Sender</th>
                  <th className="px-5 py-3.5 font-bold">Dispatch Time</th>
                  <th className="px-5 py-3.5 font-bold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {broadcasts.map((item) => (
                  <tr key={item.id} className="transition-colors hover:bg-secondary/40">
                    <td className="px-5 py-4 font-mono font-bold text-primary">{item.broadcastId}</td>
                    <td className="px-5 py-4 font-bold text-foreground">{item.subject}</td>
                    <td className="px-5 py-4 font-semibold text-foreground">{item.channel}</td>
                    <td className="px-5 py-4 text-muted-foreground">{item.sender}</td>
                    <td className="px-5 py-4 font-mono text-muted-foreground">{item.dispatchTime}</td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400">
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
