import { createFileRoute } from "@tanstack/react-router";
import { FileText, Download } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";

export const Route = createFileRoute("/_authenticated/dashboard/manager/documents")({
  component: ManagerDocumentsPage,
});

function ManagerDocumentsPage() {
  const teamDocs: Array<{ id: string; title: string; category: string; updated: string; size: string }> = [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Team Document Repository"
        description="Access team contracts, promotion letters, technical specs, and team policy handbooks."
        breadcrumbs={[{ label: "Manager", href: "/dashboard/manager" }, { label: "Documents" }]}
        backHref="/dashboard/manager"
      />

      <div className="glass-tile overflow-hidden rounded-2xl border border-border">
        {teamDocs.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center space-y-3">
            <FileText className="size-10 text-muted-foreground/60" />
            <h3 className="font-display text-base font-bold text-foreground">No Team Documents Found</h3>
            <p className="text-xs text-muted-foreground max-w-sm">
              Documents uploaded for team members, contracts, and policy handbooks will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border/60 bg-card/60 uppercase tracking-[0.08em] text-muted-foreground">
                <tr>
                  <th className="px-5 py-3.5 font-bold">Doc ID</th>
                  <th className="px-5 py-3.5 font-bold">Document Title</th>
                  <th className="px-5 py-3.5 font-bold">Category</th>
                  <th className="px-5 py-3.5 font-bold">Last Updated</th>
                  <th className="px-5 py-3.5 font-bold">Size</th>
                  <th className="px-5 py-3.5 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {teamDocs.map((doc) => (
                  <tr key={doc.id} className="transition-colors hover:bg-secondary/40">
                    <td className="px-5 py-4 font-mono font-bold text-primary">{doc.id}</td>
                    <td className="px-5 py-4 font-bold text-foreground">{doc.title}</td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold text-primary">
                        {doc.category}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-muted-foreground">{doc.updated}</td>
                    <td className="px-5 py-4 font-mono text-muted-foreground">{doc.size}</td>
                    <td className="px-5 py-4 text-right">
                      <button
                        className="glass-tile rounded-lg px-2.5 py-1 text-xs font-semibold hover:bg-secondary inline-flex items-center gap-1"
                      >
                        <Download className="size-3.5" /> Download
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
