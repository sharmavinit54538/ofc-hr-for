import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/page-header";
import { Download, Loader2, Inbox } from "lucide-react";
import { toast } from "sonner";
import { useGetDocumentsQuery } from "@/services/documentsApi";

export const Route = createFileRoute("/_authenticated/dashboard/documents/certificates")({
  component: CertificatesPage,
});

function CertificatesPage() {
  const { data: res, isLoading } = useGetDocumentsQuery({ category: "Certificate" });
  const docs = res?.data ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Certificates & Service Badges"
        description="Experience certificates, relieving letters, and verified skill badges."
        breadcrumbs={[{ label: "Documents", href: "/dashboard/documents" }, { label: "Certificates" }]}
        backHref="/dashboard/documents"
      />

      {isLoading ? (
        <div className="flex items-center justify-center py-16"><Loader2 className="size-6 animate-spin text-primary" /></div>
      ) : docs.length === 0 ? (
        <div className="glass-tile rounded-2xl flex flex-col items-center justify-center py-16 gap-3">
          <Inbox className="size-12 text-muted-foreground/40" />
          <p className="text-sm font-semibold text-muted-foreground">No certificates found</p>
          <p className="text-xs text-muted-foreground/60">Certificates will appear here when issued.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {docs.map((doc) => (
            <div key={doc.id} className="glass-tile space-y-2 rounded-2xl p-5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-primary">{doc.docId}</span>
                <span className="text-xs text-muted-foreground">{doc.uploadDate}</span>
              </div>
              <h3 className="font-display text-base font-bold text-foreground">{doc.title}</h3>
              <p className="text-xs text-muted-foreground">Issued to: <strong className="text-foreground">{doc.ownerName}</strong></p>
              <button onClick={() => toast.success(`Downloading ${doc.title}`)} className="glass-tile w-full rounded-xl py-2 text-xs font-semibold hover:bg-secondary inline-flex items-center justify-center gap-1.5 mt-2">
                <Download className="size-3.5" /> Download Certificate
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
