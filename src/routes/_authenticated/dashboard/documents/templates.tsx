import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/page-header";
import { Download, Loader2, Inbox } from "lucide-react";
import { toast } from "sonner";
import { useGetDocumentTemplatesQuery } from "@/services/documentsApi";

export const Route = createFileRoute("/_authenticated/dashboard/documents/templates")({
  component: TemplatesPage,
});

function TemplatesPage() {
  const { data: res, isLoading } = useGetDocumentTemplatesQuery();
  const templates = res?.data ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Standardized Letter & Document Templates"
        description="Configured DOCX and HTML templates for instant HR letter generation."
        breadcrumbs={[{ label: "Documents", href: "/dashboard/documents" }, { label: "Templates" }]}
        backHref="/dashboard/documents"
      />

      {isLoading ? (
        <div className="flex items-center justify-center py-16"><Loader2 className="size-6 animate-spin text-primary" /></div>
      ) : templates.length === 0 ? (
        <div className="glass-tile rounded-2xl flex flex-col items-center justify-center py-16 gap-3">
          <Inbox className="size-12 text-muted-foreground/40" />
          <p className="text-sm font-semibold text-muted-foreground">No templates found</p>
          <p className="text-xs text-muted-foreground/60">Document templates will appear here when configured.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {templates.map((t) => (
            <div key={t.id} className="glass-tile space-y-2 rounded-2xl p-5">
              <h3 className="font-display text-base font-bold text-foreground">{t.title}</h3>
              <p className="text-xs text-muted-foreground">Format: {t.format} | Size: {t.size}</p>
              <button onClick={() => toast.success(`Downloading Template: ${t.title}`)} className="glass-tile w-full rounded-xl py-2 text-xs font-semibold hover:bg-secondary inline-flex items-center justify-center gap-1.5 mt-2">
                <Download className="size-3.5" /> Download Template
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
