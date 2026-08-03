import { createFileRoute } from "@tanstack/react-router";
import {
  CreditCard,
  ShieldCheck,
  Zap,
  Check,
  Download,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";

export const Route = createFileRoute("/_authenticated/dashboard/settings/billing")({
  component: BillingSettingsPage,
});

function BillingSettingsPage() {
  const handleDownloadInvoice = (invId: string) => {
    toast.success("Invoice Downloading", {
      description: `Downloading invoice PDF #${invId}...`,
    });
  };

  return (
    <div className="space-y-6">
      {/* ── Page Header ────────────────────────────────────────── */}
      <PageHeader
        title="Billing & Enterprise Plan"
        description="Subscription tier, seat usage, payment methods, and invoice history."
        breadcrumbs={[{ label: "Settings", href: "/dashboard/settings" }, { label: "Billing & Plan" }]}
        backHref="/dashboard/settings"
        backLabel="Back to Settings"
      />

      {/* ── Current Active Plan Card ────────────────────────────── */}
      <div className="glass-tile rounded-2xl p-6 relative overflow-hidden border border-primary/30">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-brand text-primary-foreground shadow-glow">
              <Zap className="size-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display text-xl font-bold text-foreground">
                  Enterprise AI Tier
                </h3>
                <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-500">
                  Active Subscription
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Billed Annually · Renews on November 15, 2026
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="font-display text-2xl font-bold text-foreground">$1,250</span>
            <span className="text-xs text-muted-foreground"> / month</span>
          </div>
        </div>

        {/* Seat Usage Bar */}
        <div className="mt-6 border-t border-border/50 pt-4 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-muted-foreground flex items-center gap-1.5">
              <Users className="size-3.5 text-primary" /> Active Seat Usage:
            </span>
            <span className="text-foreground font-bold">1,248 / 2,000 Seats Used (62%)</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
            <div className="h-full w-[62%] rounded-full bg-gradient-brand shadow-glow" />
          </div>
        </div>
      </div>

      {/* ── Recent Invoices ────────────────────────────────────── */}
      <div className="glass-tile overflow-hidden rounded-2xl border border-border">
        <div className="px-5 py-4 border-b border-border/60">
          <h3 className="font-display text-sm font-bold text-foreground">
            Invoice History & Downloads
          </h3>
        </div>

        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border/60 bg-card/60 uppercase tracking-[0.08em] text-muted-foreground">
              <tr>
                <th className="px-5 py-3.5 font-bold">Invoice ID</th>
                <th className="px-5 py-3.5 font-bold">Billing Period</th>
                <th className="px-5 py-3.5 font-bold">Amount Paid</th>
                <th className="px-5 py-3.5 font-bold">Status</th>
                <th className="px-5 py-3.5 font-bold text-right">Download</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {[
                { id: "INV-2026-004", period: "Oct 2026", amount: "$15,000.00", status: "Paid" },
                { id: "INV-2025-003", period: "Nov 2025", amount: "$15,000.00", status: "Paid" },
                { id: "INV-2024-002", period: "Nov 2024", amount: "$12,000.00", status: "Paid" },
              ].map((inv) => (
                <tr key={inv.id} className="transition-colors hover:bg-secondary/40">
                  <td className="px-5 py-4 font-mono font-bold text-foreground">{inv.id}</td>
                  <td className="px-5 py-4 text-muted-foreground">{inv.period}</td>
                  <td className="px-5 py-4 font-bold text-foreground">{inv.amount}</td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-500">
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => handleDownloadInvoice(inv.id)}
                      className="glass-tile inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-primary hover:bg-secondary"
                    >
                      <Download className="size-3.5" /> PDF
                    </button>
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
