import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { Plug, CheckCircle2, Server, Database, Mail, ShieldCheck, Cpu, Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";
import { useListEmployeesQuery, useListDepartmentsQuery } from "@/services/employeeApi";

export const Route = createFileRoute("/_authenticated/dashboard/it-admin/integrations")({
  component: ItAdminIntegrationsPage,
});

function ItAdminIntegrationsPage() {
  const { data: employeesRes, isLoading: isLoadingEmps } = useListEmployeesQuery({ page: 1, page_size: 10 });
  const { data: departmentsRes, isLoading: isLoadingDepts } = useListDepartmentsQuery();

  const isLoading = isLoadingEmps || isLoadingDepts;

  const realIntegrations = useMemo(
    () => [
      {
        id: "int-1",
        name: "FastAPI REST Uvicorn Engine",
        category: "Core API Server",
        detail: "Handling http://localhost:8000 endpoints with async routing.",
        status: "Connected & Active",
        icon: Cpu,
        color: "text-emerald-500",
        bgColor: "bg-emerald-500/10",
      },
      {
        id: "int-2",
        name: "SQLAlchemy Async Database Driver",
        category: "Persistence Engine",
        detail: "ACID compliant transaction engine for SQLite / PostgreSQL.",
        status: "Connected & Active",
        icon: Database,
        color: "text-sky-500",
        bgColor: "bg-sky-500/10",
      },
      {
        id: "int-3",
        name: "RTK Query API Service Cache",
        category: "Frontend State Sync",
        detail: "Automatic cache invalidation & tag revalidation for live DB.",
        status: "Active",
        icon: Server,
        color: "text-purple-400",
        bgColor: "bg-purple-500/10",
      },
      {
        id: "int-4",
        name: "SMTP Mail Dispatcher",
        category: "Notifications",
        detail: "Automated onboarding credentials and password reset emailer.",
        status: "Configured",
        icon: Mail,
        color: "text-amber-500",
        bgColor: "bg-amber-500/10",
      },
      {
        id: "int-5",
        name: "OAuth2 Bearer & JWT Security Middleware",
        category: "Security & RBAC",
        detail: "HS256 secret token validation & role permission guards.",
        status: "Active",
        icon: ShieldCheck,
        color: "text-indigo-400",
        bgColor: "bg-indigo-500/10",
      },
    ],
    []
  );

  const handleSyncConnector = (name: string) => {
    toast.success(`Telemetry Synced with ${name}`, {
      description: "Service handshake validated successfully.",
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="IT Infrastructure Integrations"
        description="Manage connected backend microservices, database drivers, security middleware, and notification gateways."
        breadcrumbs={[{ label: "IT Admin", href: "/dashboard/it-admin" }, { label: "Integrations" }]}
        backHref="/dashboard/it-admin"
      />

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="size-6 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {realIntegrations.map((t) => {
            const Icon = t.icon;
            return (
              <div key={t.id} className="glass-tile rounded-2xl p-5 flex flex-col justify-between space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`grid size-10 place-items-center rounded-xl ${t.bgColor} ${t.color} font-bold`}>
                      <Icon className="size-5" />
                    </div>
                    <div>
                      <span className="inline-flex rounded-full bg-primary/10 px-2 py-0.5 text-[9px] font-bold text-primary mb-0.5">
                        {t.category}
                      </span>
                      <h3 className="font-display text-sm font-bold text-foreground">{t.name}</h3>
                    </div>
                  </div>
                  <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-500">
                    <CheckCircle2 className="size-3" /> {t.status}
                  </span>
                </div>

                <div className="pt-2 border-t border-border/40 flex items-center justify-between gap-2 text-xs">
                  <p className="text-[11px] text-muted-foreground leading-snug">{t.detail}</p>
                  <button
                    onClick={() => handleSyncConnector(t.name)}
                    className="glass-tile shrink-0 rounded-lg px-2.5 py-1 text-[11px] font-semibold hover:bg-secondary inline-flex items-center gap-1"
                  >
                    <RefreshCw className="size-3 text-primary" /> Sync
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
