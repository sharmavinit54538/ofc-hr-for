import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/page-header";
import { Download, Loader2, Inbox } from "lucide-react";
import { toast } from "sonner";
import { useGetDocumentsQuery } from "@/services/documentsApi";

export const Route = createFileRoute("/_authenticated/dashboard/documents/offer-letters")({
  component: OfferLettersPage,
});

function OfferLettersPage() {
  const { data: res, isLoading } = useGetDocumentsQuery({ category: "Offer Letter" });
  const docs = res?.data ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Candidate Offer Letters & Compensation Attachments"
        description="Generated candidate offer letters, compensation breakdowns, and e-signature verification status."
        breadcrumbs={[{ label: "Documents", href: "/dashboard/documents" }, { label: "Offer Letters" }]}
        backHref="/dashboard/documents"
      />

      {isLoading ? (
        <div className="flex items-center justify-center py-16"><Loader2 className="size-6 animate-spin text-primary" /></div>
      ) : docs.length === 0 ? (
        <div className="glass-tile rounded-2xl flex flex-col items-center justify-center py-16 gap-3">
          <Inbox className="size-12 text-muted-foreground/40" />
          <p className="text-sm font-semibold text-muted-foreground">No offer letters found</p>
          <p className="text-xs text-muted-foreground/60">Offer letters will appear here when generated.</p>
        </div>
      ) : (
        <div className="glass-tile overflow-hidden rounded-2xl border border-border">
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border/60 bg-card/60 uppercase tracking-[0.08em] text-muted-foreground">
                <tr>
                  <th className="px-5 py-3.5 font-bold">Doc ID</th>
                  <th className="px-5 py-3.5 font-bold">Title</th>
                  <th className="px-5 py-3.5 font-bold">Candidate Name</th>
                  <th className="px-5 py-3.5 font-bold">eSign Status</th>
                  <th className="px-5 py-3.5 font-bold text-right">Download</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {docs.map((doc) => (
                  <tr key={doc.id} className="transition-colors hover:bg-secondary/40">
                    <td className="px-5 py-4 font-mono font-bold text-primary">{doc.docId}</td>
                    <td className="px-5 py-4 font-bold text-foreground">{doc.title}</td>
                    <td className="px-5 py-4 text-muted-foreground">{doc.ownerName}</td>
                    <td className="px-5 py-4 font-semibold text-emerald-400">{doc.eSignatureStatus}</td>
                    <td className="px-5 py-4 text-right">
                      <button onClick={() => toast.success(`Downloading ${doc.title}`)} className="glass-tile rounded-lg px-2.5 py-1 text-xs font-semibold hover:bg-secondary">
                        <Download className="size-3.5" />
                      </button>
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
