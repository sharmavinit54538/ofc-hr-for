import { createFileRoute } from "@tanstack/react-router";
import { Activity, Server, Cpu, HardDrive } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { MOCK_SYSTEM_HEALTH } from "@/lib/it-admin/mock-data";

export const Route = createFileRoute("/_authenticated/dashboard/it-admin/health")({
  component: ItAdminHealthPage,
});

function ItAdminHealthPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="System Health & Microservices Infrastructure"
        description="Real-time server CPU utilization, memory allocation, database latency gauges, and cluster health."
        breadcrumbs={[{ label: "IT Admin", href: "/dashboard/it-admin" }, { label: "System Health" }]}
        backHref="/dashboard/it-admin"
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="glass-tile rounded-2xl p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">CPU Usage</span>
            <Cpu className="size-4 text-emerald-500" />
          </div>
          <div className="font-display text-2xl font-bold text-foreground">{MOCK_SYSTEM_HEALTH.cpuUsage}</div>
          <p className="text-[10px] text-emerald-500 mt-1">Normal operational range</p>
        </div>

        <div className="glass-tile rounded-2xl p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Memory Usage</span>
            <Server className="size-4 text-sky-500" />
          </div>
          <div className="font-display text-2xl font-bold text-foreground">{MOCK_SYSTEM_HEALTH.memoryUsage}</div>
          <p className="text-[10px] text-sky-500 mt-1">16.8 GB allocated</p>
        </div>

        <div className="glass-tile rounded-2xl p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Database Latency</span>
            <Activity className="size-4 text-purple-400" />
          </div>
          <div className="font-display text-2xl font-bold text-foreground">{MOCK_SYSTEM_HEALTH.apiLatency}</div>
          <p className="text-[10px] text-purple-400 mt-1">Primary read replica healthy</p>
        </div>

        <div className="glass-tile rounded-2xl p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">DB Storage Used</span>
            <HardDrive className="size-4 text-amber-500" />
          </div>
          <div className="font-display text-2xl font-bold text-foreground">{MOCK_SYSTEM_HEALTH.dbStorageUsed}</div>
          <p className="text-[10px] text-amber-500 mt-1">28.4% capacity used</p>
        </div>
      </div>
    </div>
  );
}
