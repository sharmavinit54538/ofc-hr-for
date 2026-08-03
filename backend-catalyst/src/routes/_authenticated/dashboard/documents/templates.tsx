import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/page-header";
import { FileCode, Download } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/dashboard/documents/templates")({
  component: TemplatesPage,
});

function TemplatesPage() {
  const templates = [
    { id: "t1", title: "Standard Salary Verification & NOC Letter", format: "DOCX", size: "680 KB" },
    { id: "t2", title: "Standard Executive Offer Letter Template", format: "DOCX", size: "1.2 MB" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Standardized Letter & Document Templates"
        description="Configured DOCX and HTML templates for instant HR letter generation."
        breadcrumbs={[{ label: "Documents", href: "/dashboard/documents" }, { label: "Templates" }]}
        backHref="/dashboard/documents"
      />

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
    </div>
  );
}
