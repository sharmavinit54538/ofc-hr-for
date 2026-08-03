import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/page-header";
import { Award, Download } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/dashboard/documents/certificates")({
  component: CertificatesPage,
});

function CertificatesPage() {
  const items = [
    { id: "1", name: "Aarav Sharma", type: "Experience Certificate", date: "2026-07-15", code: "CERT-9901" },
    { id: "2", name: "Priya Patel", type: "SOC2 Compliance Badge", date: "2026-06-20", code: "CERT-9902" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Certificates & Service Badges"
        description="Experience certificates, relieving letters, and verified skill badges."
        breadcrumbs={[{ label: "Documents", href: "/dashboard/documents" }, { label: "Certificates" }]}
        backHref="/dashboard/documents"
      />

      <div className="grid gap-4 sm:grid-cols-2">
        {items.map((c) => (
          <div key={c.id} className="glass-tile space-y-2 rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-primary">{c.code}</span>
              <span className="text-xs text-muted-foreground">{c.date}</span>
            </div>
            <h3 className="font-display text-base font-bold text-foreground">{c.type}</h3>
            <p className="text-xs text-muted-foreground">Issued to: <strong className="text-foreground">{c.name}</strong></p>
            <button onClick={() => toast.success(`Downloading ${c.type}`)} className="glass-tile w-full rounded-xl py-2 text-xs font-semibold hover:bg-secondary inline-flex items-center justify-center gap-1.5 mt-2">
              <Download className="size-3.5" /> Download Certificate
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
