import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/page-header";
import { Download, Loader2, Inbox } from "lucide-react";
import { toast } from "sonner";
import { useGetDocumentsQuery } from "@/services/documentsApi";

export const Route = createFileRoute("/_authenticated/dashboard/documents/policies")({
  component: PoliciesDocsPage,
});

function PoliciesDocsPage() {
  const { data: res, isLoading } = useGetDocumentsQuery({ category: "Policy" });
  const docs = res?.data ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Company Policy Handbooks & Guidelines"
        description="Official published employee handbooks, remote work rules, and code of conduct manuals."
        breadcrumbs={[{ label: "Documents", href: "/dashboard/documents" }, { label: "Policies" }]}
        backHref="/dashboard/documents"
      />

      {isLoading ? (
        <div className="flex items-center justify-center py-16"><Loader2 className="size-6 animate-spin text-primary" /></div>
      ) : docs.length === 0 ? (
        <div className="glass-tile rounded-2xl flex flex-col items-center justify-center py-16 gap-3">
          <Inbox className="size-12 text-muted-foreground/40" />
          <p className="text-sm font-semibold text-muted-foreground">No policy documents found</p>
          <p className="text-xs text-muted-foreground/60">Policy handbooks will appear here when uploaded.</p>
        </div>
      ) : (
        <div className="glass-tile overflow-hidden rounded-2xl border border-border">
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border/60 bg-card/60 uppercase tracking-[0.08em] text-muted-foreground">
                <tr>
                  <th className="px-5 py-3.5 font-bold">Doc ID</th>
                  <th className="px-5 py-3.5 font-bold">Title</th>
                  <th className="px-5 py-3.5 font-bold">Size</th>
                  <th className="px-5 py-3.5 font-bold text-right">Download</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {docs.map((doc) => (
                  <tr key={doc.id} className="transition-colors hover:bg-secondary/40">
                    <td className="px-5 py-4 font-mono font-bold text-primary">{doc.docId}</td>
                    <td className="px-5 py-4 font-bold text-foreground">{doc.title}</td>
                    <td className="px-5 py-4 text-muted-foreground">{doc.fileSize}</td>
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
