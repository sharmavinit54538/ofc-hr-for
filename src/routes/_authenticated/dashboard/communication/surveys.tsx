import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MessageSquare, Plus, CheckCircle2, Clock } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { MOCK_SURVEYS } from "@/lib/communication/mock-data";

export const Route = createFileRoute("/_authenticated/dashboard/communication/surveys")({
  component: CommunicationSurveysPage,
});

function CommunicationSurveysPage() {
  const [surveys] = useState(MOCK_SURVEYS);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Employee Surveys & Pulse Feedback"
        description="Anonymous employee pulse surveys, workplace culture assessments, and feedback analytics."
        breadcrumbs={[
          { label: "Communication", href: "/dashboard/communication" },
          { label: "Surveys" },
        ]}
        backHref="/dashboard/communication"
        backLabel="Back to Communication Center"
      />

      <div className="grid gap-4 sm:grid-cols-2">
        {surveys.map((srv) => (
          <div key={srv.id} className="glass-tile space-y-3 rounded-2xl p-5 transition-all hover-lift">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-primary">{srv.surveyId}</span>
              <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/20">
                {srv.status}
              </span>
            </div>
            <h3 className="font-display text-base font-bold text-foreground">{srv.title}</h3>
            <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/40">
              <span>Department: <strong className="text-foreground">{srv.department}</strong></span>
              <span className="font-bold text-primary">Response Rate: {srv.responseRate}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
