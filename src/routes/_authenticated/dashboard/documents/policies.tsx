import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/page-header";
import { MOCK_DOCUMENTS } from "@/lib/documents/mock-data";
import { Download } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/dashboard/documents/policies")({
  component: PoliciesDocsPage,
});

function PoliciesDocsPage() {
  const docs = MOCK_DOCUMENTS.filter((d) => d.category === "Policy");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Company Policy Handbooks & Guidelines"
        description="Official published employee handbooks, remote work rules, and code of conduct manuals."
        breadcrumbs={[{ label: "Documents", href: "/dashboard/documents" }, { label: "Policies" }]}
        backHref="/dashboard/documents"
      />

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
    </div>
  );
}
