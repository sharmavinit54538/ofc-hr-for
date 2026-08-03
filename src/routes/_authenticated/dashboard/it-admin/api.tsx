import { createFileRoute } from "@tanstack/react-router";
import { Radio, Key, Plus, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";
import { MOCK_API_KEYS } from "@/lib/it-admin/mock-data";

export const Route = createFileRoute("/_authenticated/dashboard/it-admin/api")({
  component: ItAdminApiPage,
});

function ItAdminApiPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="API Key & Webhook Management"
        description="Generate production API tokens, set rate limits, configure OAuth 2.0 client IDs, and manage webhooks."
        breadcrumbs={[{ label: "IT Admin", href: "/dashboard/it-admin" }, { label: "API Management" }]}
        backHref="/dashboard/it-admin"
        actions={
          <button
            onClick={() => toast.success("New API Token Generated", { description: "Token copied to clipboard." })}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-brand px-4 py-2 text-xs font-semibold text-primary-foreground shadow-glow"
          >
            <Plus className="size-4" /> Generate API Key
          </button>
        }
      />

      <div className="glass-tile overflow-hidden rounded-2xl border border-border">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border/60 bg-card/60 uppercase tracking-[0.08em] text-muted-foreground">
              <tr>
                <th className="px-5 py-3.5 font-bold">Key Name</th>
                <th className="px-5 py-3.5 font-bold">Token Prefix</th>
                <th className="px-5 py-3.5 font-bold">Environment</th>
                <th className="px-5 py-3.5 font-bold">Last Used</th>
                <th className="px-5 py-3.5 font-bold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {MOCK_API_KEYS.map((k) => (
                <tr key={k.id} className="transition-colors hover:bg-secondary/40">
                  <td className="px-5 py-4 font-bold text-foreground">{k.name}</td>
                  <td className="px-5 py-4 font-mono text-primary">{k.keyPrefix}</td>
                  <td className="px-5 py-4">
                    <span className="inline-flex rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                      {k.environment}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-muted-foreground">{k.lastUsed}</td>
                  <td className="px-5 py-4 text-right">
                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-500">
                      <CheckCircle2 className="size-3" /> {k.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
