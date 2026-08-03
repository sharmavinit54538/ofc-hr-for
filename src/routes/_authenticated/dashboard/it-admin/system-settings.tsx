import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Sliders, CheckCircle2, Save, Server, Mail, Shield, Globe, HardDrive } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";
import { useAuthStore } from "@/hooks/useAuthStore";

export const Route = createFileRoute("/_authenticated/dashboard/it-admin/system-settings")({
  component: ItAdminSystemSettingsPage,
});

function ItAdminSystemSettingsPage() {
  const user = useAuthStore((s) => s.user);

  const [backendUrl, setBackendUrl] = useState("http://localhost:8000");
  const [smtpHost, setSmtpHost] = useState("smtp.gmail.com");
  const [smtpPort, setSmtpPort] = useState("587");
  const [maxUploadMb, setMaxUploadMb] = useState("25");
  const [corsOrigins, setCorsOrigins] = useState("http://localhost:8080, http://localhost:3000");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Global IT System Settings Saved", {
        description: `Updated API URL (${backendUrl}), SMTP Host (${smtpHost}:${smtpPort}), and CORS rules.`,
      });
    }, 600);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Global System & Infrastructure Settings"
        description="Configure domain parameters, backend REST API endpoints, SMTP email gateways, and security CORS policies."
        breadcrumbs={[{ label: "IT Admin", href: "/dashboard/it-admin" }, { label: "System Settings" }]}
        backHref="/dashboard/it-admin"
      />

      <form onSubmit={handleSaveSettings} className="space-y-6 max-w-4xl">
        {/* Backend & API Endpoint Configuration */}
        <div className="glass-tile rounded-2xl p-5 md:p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-border/40 pb-3">
            <Server className="size-4 text-primary" />
            <h3 className="font-display text-sm font-bold text-foreground">FastAPI REST Server Settings</h3>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 text-xs">
            <div className="space-y-1.5">
              <label className="font-bold text-foreground">Backend API Endpoint URL</label>
              <input
                type="text"
                value={backendUrl}
                onChange={(e) => setBackendUrl(e.target.value)}
                className="w-full rounded-xl border border-border/60 bg-card/60 px-3.5 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                required
              />
              <p className="text-[10px] text-muted-foreground">FastAPI Uvicorn service URL</p>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-foreground">Max Document Attachment Size (MB)</label>
              <input
                type="number"
                value={maxUploadMb}
                onChange={(e) => setMaxUploadMb(e.target.value)}
                className="w-full rounded-xl border border-border/60 bg-card/60 px-3.5 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                required
              />
              <p className="text-[10px] text-muted-foreground">Maximum file size for onboarding attachments</p>
            </div>
          </div>
        </div>

        {/* SMTP Email Gateway Configuration */}
        <div className="glass-tile rounded-2xl p-5 md:p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-border/40 pb-3">
            <div className="flex items-center gap-2">
              <Mail className="size-4 text-amber-500" />
              <h3 className="font-display text-sm font-bold text-foreground">SMTP & Email Gateway Settings</h3>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-500">
              <CheckCircle2 className="size-3" /> Active Connection
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 text-xs">
            <div className="space-y-1.5">
              <label className="font-bold text-foreground">SMTP Gateway Host</label>
              <input
                type="text"
                value={smtpHost}
                onChange={(e) => setSmtpHost(e.target.value)}
                className="w-full rounded-xl border border-border/60 bg-card/60 px-3.5 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-foreground">Port & Encryption</label>
              <input
                type="text"
                value={smtpPort}
                onChange={(e) => setSmtpPort(e.target.value)}
                className="w-full rounded-xl border border-border/60 bg-card/60 px-3.5 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                required
              />
              <p className="text-[10px] text-muted-foreground">Default 587 with TLS / 465 SSL</p>
            </div>
          </div>
        </div>

        {/* Security & CORS Origins */}
        <div className="glass-tile rounded-2xl p-5 md:p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-border/40 pb-3">
            <Shield className="size-4 text-purple-400" />
            <h3 className="font-display text-sm font-bold text-foreground">CORS Security & Allowed Domains</h3>
          </div>

          <div className="space-y-1.5 text-xs">
            <label className="font-bold text-foreground">CORS Allowed Origins (Comma-separated)</label>
            <input
              type="text"
              value={corsOrigins}
              onChange={(e) => setCorsOrigins(e.target.value)}
              className="w-full rounded-xl border border-border/60 bg-card/60 px-3.5 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-mono"
              required
            />
            <p className="text-[10px] text-muted-foreground">Authorized web origin domains for cross-origin API requests</p>
          </div>
        </div>

        {/* Save Controls */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-brand px-6 py-2.5 text-xs font-semibold text-primary-foreground shadow-glow hover:shadow-glow-lg transition-all disabled:opacity-50"
          >
            <Save className="size-4" /> {isSubmitting ? "Saving System Settings..." : "Save System Settings"}
          </button>
        </div>
      </form>
    </div>
  );
}
