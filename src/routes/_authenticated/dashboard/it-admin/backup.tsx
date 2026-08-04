import { createFileRoute } from "@tanstack/react-router";
import { Database, Plus, CheckCircle2, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";
import { MOCK_BACKUP_SNAPSHOTS } from "@/lib/it-admin/mock-data";

export const Route = createFileRoute("/_authenticated/dashboard/it-admin/backup")({
  component: ItAdminBackupPage,
});

function ItAdminBackupPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Backup & Disaster Recovery"
        description="Automated daily database snapshots, point-in-time recovery (PITR), and disaster recovery validation."
        breadcrumbs={[{ label: "IT Admin", href: "/dashboard/it-admin" }, { label: "Backup & Recovery" }]}
        backHref="/dashboard/it-admin"
        actions={
          <button
            onClick={() => toast.success("Manual Snapshot Triggered", { description: "Creating on-demand DB backup snapshot." })}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-brand px-4 py-2 text-xs font-semibold text-primary-foreground shadow-glow"
          >
            <Plus className="size-4" /> Create Snapshot Now
          </button>
        }
      />

      <div className="glass-tile overflow-hidden rounded-2xl border border-border">
        {MOCK_BACKUP_SNAPSHOTS.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center space-y-3">
            <Database className="size-10 text-muted-foreground/60" />
            <h3 className="font-display text-base font-bold text-foreground">No Backup Snapshots Found</h3>
            <p className="text-xs text-muted-foreground max-w-sm">
              Click "Create Snapshot Now" above to trigger a manual database backup snapshot.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border/60 bg-card/60 uppercase tracking-[0.08em] text-muted-foreground">
                <tr>
                  <th className="px-5 py-3.5 font-bold">Snapshot ID</th>
                  <th className="px-5 py-3.5 font-bold">Snapshot Name</th>
                  <th className="px-5 py-3.5 font-bold">Type</th>
                  <th className="px-5 py-3.5 font-bold">Size</th>
                  <th className="px-5 py-3.5 font-bold">Created At</th>
                  <th className="px-5 py-3.5 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {MOCK_BACKUP_SNAPSHOTS.map((bk) => (
                  <tr key={bk.id} className="transition-colors hover:bg-secondary/40">
                    <td className="px-5 py-4 font-mono font-bold text-primary">{bk.id}</td>
                    <td className="px-5 py-4 font-mono font-semibold text-foreground">{bk.snapshotName}</td>
                    <td className="px-5 py-4">
                      <span className="inline-flex rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold text-primary">
                        {bk.type}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-mono text-muted-foreground">{bk.size}</td>
                    <td className="px-5 py-4 text-muted-foreground">{bk.createdAt}</td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => toast.info(`Testing point-in-time restore for ${bk.id}`)}
                        className="glass-tile rounded-lg px-2.5 py-1 text-xs font-semibold hover:bg-secondary inline-flex items-center gap-1"
                      >
                        <RotateCcw className="size-3" /> Test Restore
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
