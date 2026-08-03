import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  BarChart3,
  Calendar,
  Download,
  FileSpreadsheet,
  Plus,
  SlidersHorizontal,
  Star,
  Pin,
  Clock,
  ArrowRight,
  Sparkles,
  Search,
  CheckCircle2,
  FileText,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";
import { REPORTS_CATALOGUE, ReportMeta } from "@/lib/reports/mock-data";

export const Route = createFileRoute("/_authenticated/dashboard/reports/")({
  component: ReportsLandingPage,
});

function ReportsLandingPage() {
  const [reports, setReports] = useState<ReportMeta[]>(REPORTS_CATALOGUE);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCat, setSelectedCat] = useState<string>("All Categories");

  const toggleFavorite = (id: string) => {
    setReports(
      reports.map((r) => (r.id === id ? { ...r, isFavorite: !r.isFavorite } : r)),
    );
    toast.success("Favorite Preference Updated");
  };

  const togglePin = (id: string) => {
    setReports(
      reports.map((r) => (r.id === id ? { ...r, isPinned: !r.isPinned } : r)),
    );
    toast.success("Report Pin Status Updated");
  };

  const filtered = reports.filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCat === "All Categories" || r.category === selectedCat;
    return matchesSearch && matchesCat;
  });

  const pinnedReports = reports.filter((r) => r.isPinned);
  const favoriteReports = reports.filter((r) => r.isFavorite);

  const kpiCards = [
    { title: "Total Reports", value: "23", sub: "Enterprise Suite", icon: BarChart3, color: "text-indigo-500", bg: "bg-indigo-500/10" },
    { title: "Scheduled Reports", value: "14", sub: "Automated Engines", icon: Calendar, color: "text-sky-500", bg: "bg-sky-500/10" },
    { title: "Generated Today", value: "182", sub: "Live Telemetry", icon: Clock, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { title: "Pending Reports", value: "3", sub: "Processing Queue", icon: Sparkles, color: "text-amber-500", bg: "bg-amber-500/10" },
    { title: "Exported Reports", value: "420", sub: "PDF / Excel / CSV", icon: Download, color: "text-purple-500", bg: "bg-purple-500/10" },
    { title: "Favorite Reports", value: `${favoriteReports.length}`, sub: "Quick Bookmarks", icon: Star, color: "text-rose-500", bg: "bg-rose-500/10" },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <PageHeader
        title="Enterprise Reports & Intelligence Center"
        description="Central reporting suite for workforce analytics, payroll audit, AI telemetry, headcount growth & statutory compliance."
        breadcrumbs={[{ label: "Reports Center" }]}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Link
              to="/dashboard/reports/builder"
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-brand px-3.5 py-2 text-xs font-semibold text-primary-foreground shadow-glow hover:shadow-glow-lg transition-all"
            >
              <SlidersHorizontal className="size-4" /> Create Custom Report
            </Link>
            <Link
              to="/dashboard/reports/scheduled"
              className="glass-tile inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-secondary"
            >
              <Calendar className="size-4 text-sky-500" /> Schedule Report
            </Link>
            <Link
              to="/dashboard/reports/export"
              className="glass-tile inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-secondary"
            >
              <Download className="size-4 text-emerald-500" /> Export Center
            </Link>
          </div>
        }
      />

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        {kpiCards.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.title} className="glass-tile rounded-2xl p-4 transition-all hover-lift">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  {kpi.title}
                </span>
                <div className={`flex size-8 items-center justify-center rounded-xl ${kpi.bg} ${kpi.color}`}>
                  <Icon className="size-4" />
                </div>
              </div>
              <div className="mt-2">
                <div className="font-display text-2xl font-bold text-foreground">
                  {kpi.value}
                </div>
                <p className="mt-0.5 text-[10px] font-medium text-muted-foreground truncate">
                  {kpi.sub}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pinned Reports Row */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
            <Pin className="size-4 text-primary fill-primary" /> Pinned Priority Reports
          </h2>
          <span className="text-xs text-muted-foreground">{pinnedReports.length} Reports Bookmarked</span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pinnedReports.map((report) => (
            <Link
              key={report.id}
              to={report.href}
              className="glass-tile group flex flex-col justify-between rounded-2xl p-5 transition-all hover:border-primary/40 hover:shadow-glow"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-end">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      toggleFavorite(report.id);
                    }}
                    className="text-amber-400 hover:scale-110 transition-transform"
                  >
                    <Star className={`size-4 ${report.isFavorite ? "fill-amber-400" : ""}`} />
                  </button>
                </div>

                <h3 className="font-display text-base font-bold text-foreground group-hover:text-primary transition-colors">
                  {report.title}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-2">{report.description}</p>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-border/40 pt-3 text-[11px] font-semibold text-primary">
                <span>View Live Telemetry</span>
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Catalogue Filter & Grid */}
      <div className="space-y-4">
        <div className="glass-tile flex flex-col gap-3 rounded-2xl p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search across all 23 enterprise reports..."
              className="w-full rounded-xl border border-input bg-card/60 py-2 pl-9 pr-4 text-xs outline-none focus:border-ring"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {["All Categories", "Executive", "Workforce", "Operations", "Financial", "AI & Audit"].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                  selectedCat === cat
                    ? "bg-gradient-brand text-primary-foreground shadow-glow"
                    : "glass-tile text-muted-foreground hover:bg-secondary"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filtered.map((r) => (
            <Link
              key={r.id}
              to={r.href}
              className="glass-tile group flex flex-col justify-between rounded-xl p-4 transition-all hover:border-primary/40 hover:shadow-glow"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-muted-foreground">{r.exportFormat}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      toggleFavorite(r.id);
                    }}
                    className="text-amber-400"
                  >
                    <Star className={`size-3.5 ${r.isFavorite ? "fill-amber-400" : ""}`} />
                  </button>
                </div>
                <h4 className="font-display text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                  {r.title}
                </h4>
                <p className="text-[11px] text-muted-foreground line-clamp-2">{r.description}</p>
              </div>

              <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground pt-2 border-t border-border/30">
                <span>{r.lastGenerated}</span>
                <span className="font-bold text-primary flex items-center gap-0.5">
                  View <ArrowRight className="size-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
