import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/page-header";
import { BadgeCheck, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard/documents/digital-signatures")({
  component: DigitalSignaturesPage,
});

function DigitalSignaturesPage() {
  const eSigns = [
    { id: "es-1", document: "Senior AI Engineer Offer Letter", signer: "Aarav Sharma", timestamp: "2026-07-28 10:14:00", hash: "sha256:88a10b42f...", status: "Verified E-Signed" },
    { id: "es-2", document: "Master Employment Agreement", signer: "Priya Patel", timestamp: "2026-07-20 04:30:00", hash: "sha256:99c41d11e...", status: "Verified E-Signed" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Digital Signatures & Cryptographic Audit Trail"
        description="Tamper-evident e-signature tracking with SHA-256 hashes and timestamp verification."
        breadcrumbs={[{ label: "Documents", href: "/dashboard/documents" }, { label: "Digital Signatures" }]}
        backHref="/dashboard/documents"
      />

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
              {eSigns.map((es) => (
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
    </div>
  );
}
