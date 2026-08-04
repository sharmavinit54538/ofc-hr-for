import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/page-header";
import { toast } from "sonner";
import { Settings, FileText, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard/recruitment/templates")({
  component: RecruitmentTemplatesPage,
});

const DEFAULT_TEMPLATES = [
  { id: "t-1", name: "Screening Interview Invitation", category: "Email", updated: "2026-08-01" },
  { id: "t-2", name: "Technical Scorecard Evaluation", category: "Scorecard", updated: "2026-07-28" },
  { id: "t-3", name: "Formal Offer Letter Template", category: "Offer", updated: "2026-08-02" },
  { id: "t-4", name: "Rejection & Talent Pool Opt-in", category: "Email", updated: "2026-07-25" },
];

function RecruitmentTemplatesPage() {
  const [templates] = useState(DEFAULT_TEMPLATES);

  const handleUseTemplate = (name: string) => {
    toast.success(`Template "${name}" loaded for editing.`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Recruitment Templates & Configuration"
        description="Manage email outreach templates, interview scorecard criteria, and offer letter blueprints."
        breadcrumbs={[
          { label: "Recruitment", href: "/dashboard/recruitment" },
          { label: "Templates" },
        ]}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
        {templates.map((tpl) => (
          <div
            key={tpl.id}
            className="glass-tile flex flex-col justify-between rounded-2xl p-5 border border-border"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="grid size-9 place-items-center rounded-xl bg-primary/10 text-primary">
                  <FileText className="size-5" />
                </div>
                <span className="rounded-full bg-secondary border border-border px-2.5 py-0.5 text-[10px] font-bold text-muted-foreground">
                  {tpl.category}
                </span>
              </div>

              <h3 className="mt-3 font-display text-base font-bold text-foreground">
                {tpl.name}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Last updated: {tpl.updated}
              </p>
            </div>

            <div className="mt-4 border-t border-border/60 pt-3 flex justify-end">
              <button
                onClick={() => handleUseTemplate(tpl.name)}
                className="rounded-xl border border-input px-3.5 py-1.5 text-xs font-semibold text-foreground hover:bg-secondary"
              >
                Configure Template
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
