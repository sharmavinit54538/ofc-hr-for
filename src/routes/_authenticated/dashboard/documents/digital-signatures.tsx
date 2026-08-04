import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/page-header";
import { CheckCircle2, Loader2, Inbox } from "lucide-react";
import { useGetESignaturesQuery } from "@/services/documentsApi";

export const Route = createFileRoute("/_authenticated/dashboard/documents/digital-signatures")({
  component: DigitalSignaturesPage,
});

function DigitalSignaturesPage() {
  const { data: res, isLoading } = useGetESignaturesQuery();
  const records = res?.data ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Digital Signatures & Cryptographic Audit Trail"
        description="Tamper-evident e-signature tracking with SHA-256 hashes and timestamp verification."
        breadcrumbs={[{ label: "Documents", href: "/dashboard/documents" }, { label: "Digital Signatures" }]}
        backHref="/dashboard/documents"
      />

      {isLoading ? (
        <div className="flex items-center justify-center py-16"><Loader2 className="size-6 animate-spin text-primary" /></div>
      ) : records.length === 0 ? (
        <div className="glass-tile rounded-2xl flex flex-col items-center justify-center py-16 gap-3">
          <Inbox className="size-12 text-muted-foreground/40" />
          <p className="text-sm font-semibold text-muted-foreground">No e-signature records found</p>
          <p className="text-xs text-muted-foreground/60">E-signature audit trail records will appear here.</p>
        </div>
      ) : (
        <div className="glass-tile overflow-hidden rounded-2xl border border-border">
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border/60 bg-card/60 uppercase tracking-[0.08em] text-muted-foreground">
                <tr>
                  <th className="px-5 py-3.5 font-bold">Document</th>
                  <th className="px-5 py-3.5 font-bold">Signer</th>
                  <th className="px-5 py-3.5 font-bold">Timestamp</th>
                  <th className="px-5 py-3.5 font-bold">Cryptographic Hash</th>
                  <th className="px-5 py-3.5 font-bold">Audit Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {records.map((es) => (
                  <tr key={es.id} className="transition-colors hover:bg-secondary/40">
                    <td className="px-5 py-4 font-bold text-foreground">{es.document}</td>
                    <td className="px-5 py-4 font-semibold text-foreground">{es.signer}</td>
                    <td className="px-5 py-4 font-mono text-muted-foreground">{es.timestamp}</td>
                    <td className="px-5 py-4 font-mono text-xs text-muted-foreground">{es.hash}</td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400">
                        <CheckCircle2 className="size-3" /> {es.status}
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
