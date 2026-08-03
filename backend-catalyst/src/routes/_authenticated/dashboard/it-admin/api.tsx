import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Key, Plus, CheckCircle2, Copy, Trash2, ShieldCheck, Code, Loader2, Sparkles, X } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useListEmployeesQuery } from "@/services/employeeApi";

export const Route = createFileRoute("/_authenticated/dashboard/it-admin/api")({
  component: ItAdminApiPage,
});

interface ApiToken {
  id: string;
  name: string;
  keyPrefix: string;
  scope: string;
  environment: string;
  createdAt: string;
  status: "Active" | "Revoked";
}

function ItAdminApiPage() {
  const user = useAuthStore((s) => s.user);
  const { data: employeesRes } = useListEmployeesQuery({ page: 1, page_size: 10 });
  const isApiAlive = !!employeesRes;

  const [tokens, setTokens] = useState<ApiToken[]>([
    {
      id: "key-01",
      name: "FastAPI OAuth2 Bearer Authentication Engine",
      keyPrefix: "bearer_eyJhbGciOiJIUzI1Ni...",
      scope: "Full System Access",
      environment: "Production",
      createdAt: "Today",
      status: "Active",
    },
    {
      id: "key-02",
      name: "REST Microservice Communication Channel",
      keyPrefix: "cat_live_98a7f6c4...",
      scope: "Read Only",
      environment: "Production",
      createdAt: "Yesterday",
      status: "Active",
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyScope, setNewKeyScope] = useState("Full System Access");
  const [generatedSecret, setGeneratedSecret] = useState<string | null>(null);

  const handleGenerateKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;

    const randomSuffix = Math.random().toString(36).substring(2, 12);
    const fullToken = `cat_live_${randomSuffix}_${Date.now().toString(36)}`;
    const prefix = `${fullToken.substring(0, 16)}...`;

    const newToken: ApiToken = {
      id: `key-${Date.now()}`,
      name: newKeyName.trim(),
      keyPrefix: prefix,
      scope: newKeyScope,
      environment: "Production",
      createdAt: "Just now",
      status: "Active",
    };

    setTokens((prev) => [newToken, ...prev]);
    setGeneratedSecret(fullToken);
    toast.success("API Key Generated Successfully");
  };

  const handleRevokeToken = (id: string, name: string) => {
    setTokens((prev) => prev.map((t) => (t.id === id ? { ...t, status: "Revoked" } : t)));
    toast.error(`API Token Revoked`, {
      description: `Revoked authorization token for "${name}".`,
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Token Copied to Clipboard");
  };

  const liveEndpoints = [
    { method: "POST", path: "/api/v1/auth/token", desc: "OAuth2 Password bearer token exchange" },
    { method: "GET", path: "/api/v1/employees", desc: "Retrieve workforce directory & headcount" },
    { method: "GET", path: "/api/v1/departments", desc: "List active organizational departments" },
    { method: "GET", path: "/api/v1/company/holidays", desc: "Fetch official corporate calendar" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="API Key & Microservice Token Management"
        description="Generate production REST API tokens, manage OAuth 2.0 bearer keys, set access scopes, and audit live endpoints."
        breadcrumbs={[{ label: "IT Admin", href: "/dashboard/it-admin" }, { label: "API Management" }]}
        backHref="/dashboard/it-admin"
        actions={
          <button
            onClick={() => {
              setGeneratedSecret(null);
              setNewKeyName("");
              setIsModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-brand px-4 py-2 text-xs font-semibold text-primary-foreground shadow-glow hover:shadow-glow-lg transition-all"
          >
            <Plus className="size-4" /> Generate New API Key
          </button>
        }
      />

      {/* Backend API Connection Banner */}
      <div className="glass-tile rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
            <ShieldCheck className="size-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-foreground">FastAPI REST Gateway Connection</h4>
            <p className="text-[11px] text-muted-foreground">Endpoint http://localhost:8000/api/v1 active with HS256 JWT auth</p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[11px] font-bold text-emerald-500">
          <CheckCircle2 className="size-3" /> {isApiAlive ? "100% Online" : "Connecting..."}
        </span>
      </div>

      {/* Active API Keys Table */}
      <div className="glass-tile overflow-hidden rounded-2xl border border-border">
        <div className="p-4 border-b border-border/60 bg-card/40 flex items-center justify-between">
          <h3 className="font-display text-sm font-bold text-foreground flex items-center gap-2">
            <Key className="size-4 text-primary" /> Active Production Authorization Keys
          </h3>
          <span className="text-xs font-mono text-muted-foreground">{tokens.length} Key(s) Registered</span>
        </div>

        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border/60 bg-card/60 uppercase tracking-[0.08em] text-muted-foreground">
              <tr>
                <th className="px-5 py-3.5 font-bold">Key Name</th>
                <th className="px-5 py-3.5 font-bold">Token Prefix</th>
                <th className="px-5 py-3.5 font-bold">Scope</th>
                <th className="px-5 py-3.5 font-bold">Created</th>
                <th className="px-5 py-3.5 font-bold text-right">Status & Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {tokens.map((k) => (
                <tr key={k.id} className="transition-colors hover:bg-secondary/40">
                  <td className="px-5 py-4 font-bold text-foreground">{k.name}</td>
                  <td className="px-5 py-4 font-mono text-primary flex items-center gap-1.5">
                    {k.keyPrefix}
                    <button
                      onClick={() => copyToClipboard(k.keyPrefix)}
                      className="text-muted-foreground hover:text-foreground transition-colors p-1"
                      title="Copy Prefix"
                    >
                      <Copy className="size-3" />
                    </button>
                  </td>
                  <td className="px-5 py-4">
                    <span className="inline-flex rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold text-primary">
                      {k.scope}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-muted-foreground">{k.createdAt}</td>
                  <td className="px-5 py-4 text-right space-x-2">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        k.status === "Active"
                          ? "border border-emerald-500/20 bg-emerald-500/10 text-emerald-500"
                          : "border border-rose-500/20 bg-rose-500/10 text-rose-500"
                      }`}
                    >
                      <CheckCircle2 className="size-3" /> {k.status}
                    </span>
                    {k.status === "Active" && (
                      <button
                        onClick={() => handleRevokeToken(k.id, k.name)}
                        className="glass-tile rounded-lg px-2 py-1 text-xs text-rose-400 hover:bg-rose-500/10 transition-colors inline-flex items-center gap-1"
                        title="Revoke Token"
                      >
                        <Trash2 className="size-3" /> Revoke
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Live REST Endpoints Catalog */}
      <div className="glass-tile rounded-2xl p-5 space-y-4">
        <h3 className="font-display text-sm font-bold text-foreground flex items-center gap-2">
          <Code className="size-4 text-purple-400" /> Monitored FastAPI REST Endpoints
        </h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {liveEndpoints.map((ep) => (
            <div key={ep.path} className="rounded-xl border border-border/50 bg-card/40 p-3.5 text-xs space-y-1">
              <div className="flex items-center gap-2">
                <span className="inline-flex rounded-md bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-400">
                  {ep.method}
                </span>
                <span className="font-mono font-bold text-foreground truncate">{ep.path}</span>
              </div>
              <p className="text-[11px] text-muted-foreground">{ep.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Generate API Key Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="glass-tile w-full max-w-md rounded-2xl p-6 space-y-5 border border-border">
            <div className="flex items-center justify-between border-b border-border/40 pb-3">
              <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2">
                <Key className="size-4 text-primary" /> Generate New API Secret Token
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="size-5" />
              </button>
            </div>

            {generatedSecret ? (
              <div className="space-y-4 text-xs">
                <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4 space-y-2 text-emerald-400">
                  <p className="font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="size-4" /> Secret Token Generated!
                  </p>
                  <p className="text-[11px] text-muted-foreground">Copy this key now. It will not be shown again.</p>
                  <div className="flex items-center justify-between rounded-lg bg-black/40 p-2.5 font-mono text-xs text-foreground">
                    <span className="truncate pr-2">{generatedSecret}</span>
                    <button
                      onClick={() => copyToClipboard(generatedSecret)}
                      className="shrink-0 rounded-md bg-primary px-2.5 py-1 text-[10px] font-bold text-primary-foreground"
                    >
                      Copy
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-full rounded-xl bg-secondary py-2.5 text-xs font-semibold text-foreground hover:bg-secondary/80"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleGenerateKey} className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-bold text-foreground">API Key Description Name</label>
                  <input
                    type="text"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    placeholder="e.g. Analytics Exporter Gateway"
                    className="w-full rounded-xl border border-border/60 bg-card/60 px-3.5 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-foreground">Permission Scope</label>
                  <select
                    value={newKeyScope}
                    onChange={(e) => setNewKeyScope(e.target.value)}
                    className="w-full rounded-xl border border-border/60 bg-card/60 px-3.5 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="Full System Access">Full System Access</option>
                    <option value="Read Only">Read Only</option>
                    <option value="Webhook Write Only">Webhook Write Only</option>
                  </select>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="rounded-xl px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-gradient-brand px-5 py-2 text-xs font-semibold text-primary-foreground shadow-glow"
                  >
                    Generate Secret
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
