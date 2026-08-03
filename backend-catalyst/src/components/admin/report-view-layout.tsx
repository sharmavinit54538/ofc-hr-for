import { useState, ReactNode } from "react";
import {
  Download,
  Printer,
  Share2,
  Maximize2,
  Minimize2,
  RefreshCw,
  Search,
  Filter,
  Calendar,
  FileSpreadsheet,
  FileText,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Eye,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface ColumnDef {
  key: string;
  label: string;
  visible?: boolean;
}

export interface ReportViewLayoutProps {
  title: string;
  description: string;
  categoryBadge?: string;
  kpiCards?: ReactNode;
  chartsSection?: ReactNode;
  tableColumns?: ColumnDef[];
  tableData?: any[];
  renderRow?: (item: any, visibleColumns: Record<string, boolean>) => ReactNode;
  customSection?: ReactNode;
}

export function ReportViewLayout({
  title,
  description,
  categoryBadge = "Enterprise Report",
  kpiCards,
  chartsSection,
  tableColumns = [],
  tableData = [],
  renderRow,
  customSection,
}: ReportViewLayoutProps) {
  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("All Departments");
  const [selectedBranch, setSelectedBranch] = useState("All Branches");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [dateRange, setDateRange] = useState("Last 30 Days");

  // Display State
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Column Visibility
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    tableColumns.forEach((c) => {
      initial[c.key] = c.visible !== false;
    });
    return initial;
  });

  const toggleColumn = (key: string) => {
    setColumnVisibility((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success("Report Refreshed", { description: "Latest telemetry data synchronized." });
    }, 600);
  };

  const handleExport = (format: "PDF" | "Excel" | "CSV") => {
    toast.success(`Exporting ${title} (${format})`, {
      description: `Report file generated as ${format} and ready for download.`,
    });
  };

  const handlePrint = () => {
    toast.info("Preparing Print View", { description: "Sending report layout to printer." });
    window.print();
  };

  const handleShare = () => {
    toast.success("Shareable Report Link Copied", {
      description: "Encrypted URL copied to clipboard.",
    });
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
    if (!isFullScreen) {
      toast.info("Full Screen Mode", { description: "Press Esc to exit." });
    }
  };

  // Filter Data
  const filteredData = tableData.filter((item) => {
    const itemString = JSON.stringify(item).toLowerCase();
    const matchesSearch = itemString.includes(searchQuery.toLowerCase());
    const matchesDept = selectedDept === "All Departments" || item.department === selectedDept;
    const matchesBranch = selectedBranch === "All Branches" || item.branch === selectedBranch;
    const matchesStatus = selectedStatus === "All Statuses" || item.status === selectedStatus;
    return matchesSearch && matchesDept && matchesBranch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <div className={`space-y-6 ${isFullScreen ? "fixed inset-0 z-50 overflow-y-auto bg-background p-6" : ""}`}>
      {/* ── Header ───────────────────────────────────────────── */}
      <PageHeader
        title={title}
        description={description}
        breadcrumbs={[
          { label: "Reports", href: "/dashboard/reports" },
          { label: title },
        ]}
        backHref="/dashboard/reports"
        backLabel="Back to Reports Center"
        badge={
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            {categoryBadge}
          </span>
        }
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleRefresh}
              className="glass-tile grid size-9 place-items-center rounded-xl text-muted-foreground hover:bg-secondary hover:text-foreground"
              title="Refresh Telemetry"
            >
              <RefreshCw className={`size-4 ${isRefreshing ? "animate-spin text-primary" : ""}`} />
            </button>

            <button
              onClick={handleShare}
              className="glass-tile grid size-9 place-items-center rounded-xl text-muted-foreground hover:bg-secondary hover:text-foreground"
              title="Share Report Link"
            >
              <Share2 className="size-4" />
            </button>

            <button
              onClick={handlePrint}
              className="glass-tile grid size-9 place-items-center rounded-xl text-muted-foreground hover:bg-secondary hover:text-foreground"
              title="Print Report"
            >
              <Printer className="size-4" />
            </button>

            <button
              onClick={toggleFullScreen}
              className="glass-tile grid size-9 place-items-center rounded-xl text-muted-foreground hover:bg-secondary hover:text-foreground"
              title="Toggle Fullscreen"
            >
              {isFullScreen ? <Minimize2 className="size-4" /> : <Maximize2 className="size-4" />}
            </button>

            {/* Export Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-brand px-3.5 py-2 text-xs font-semibold text-primary-foreground shadow-glow hover:shadow-glow-lg transition-all">
                  <Download className="size-4" /> Export Report
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40 glass-elevated rounded-xl p-1.5">
                <DropdownMenuItem
                  onClick={() => handleExport("PDF")}
                  className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-semibold cursor-pointer"
                >
                  <FileText className="size-4 text-rose-500" /> Export PDF
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleExport("Excel")}
                  className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-semibold cursor-pointer"
                >
                  <FileSpreadsheet className="size-4 text-emerald-500" /> Export Excel
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleExport("CSV")}
                  className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-semibold cursor-pointer"
                >
                  <Download className="size-4 text-sky-500" /> Export CSV
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        }
      />

      {/* ── KPI Section ─────────────────────────────────────── */}
      {kpiCards && <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">{kpiCards}</div>}

      {/* ── Charts Section ──────────────────────────────────── */}
      {chartsSection}

      {/* ── Custom Section ──────────────────────────────────── */}
      {customSection}

      {/* ── Filter Toolbar & Data Table ──────────────────────── */}
      {tableData.length > 0 && (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="glass-tile flex flex-col gap-3 rounded-2xl p-4 md:flex-row md:items-center md:justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search table records..."
                className="w-full rounded-xl border border-input bg-card/60 py-2 pl-9 pr-4 text-xs outline-none focus:border-ring"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Date Filter */}
              <div className="relative flex items-center rounded-xl border border-input bg-card/60 px-3 py-1.5">
                <Calendar className="mr-2 size-3.5 text-muted-foreground" />
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="bg-transparent text-xs font-semibold outline-none cursor-pointer"
                >
                  <option value="Today">Today</option>
                  <option value="Last 7 Days">Last 7 Days</option>
                  <option value="Last 30 Days">Last 30 Days</option>
                  <option value="This Quarter">This Quarter</option>
                  <option value="Year to Date">Year to Date (YTD)</option>
                </select>
              </div>

              {/* Department Filter */}
              <div className="relative flex items-center rounded-xl border border-input bg-card/60 px-3 py-1.5">
                <select
                  value={selectedDept}
                  onChange={(e) => {
                    setSelectedDept(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="bg-transparent text-xs font-semibold outline-none cursor-pointer"
                >
                  <option value="All Departments">All Departments</option>
                  <option value="Product Engineering">Product Engineering</option>
                  <option value="Human Resources">Human Resources</option>
                  <option value="Information Technology">IT Operations</option>
                  <option value="Finance Operations">Finance Operations</option>
                  <option value="Executive Office">Executive Office</option>
                </select>
              </div>

              {/* Column Visibility Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="glass-tile inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold hover:bg-secondary">
                    <SlidersHorizontal className="size-3.5 text-muted-foreground" /> Columns
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 glass-elevated rounded-xl p-1.5">
                  <div className="px-2 py-1 text-[11px] font-bold text-muted-foreground uppercase">
                    Toggle Column Visibility
                  </div>
                  <DropdownMenuSeparator className="my-1" />
                  {tableColumns.map((col) => (
                    <DropdownMenuCheckboxItem
                      key={col.key}
                      checked={columnVisibility[col.key] !== false}
                      onCheckedChange={() => toggleColumn(col.key)}
                      className="text-xs font-semibold cursor-pointer"
                    >
                      {col.label}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <span className="glass-tile rounded-xl px-3 py-1.5 text-xs font-semibold text-muted-foreground">
                Total ({filteredData.length})
              </span>
            </div>
          </div>

          {/* Table */}
          <div className="glass-tile overflow-hidden rounded-2xl border border-border">
            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-border/60 bg-card/60 uppercase tracking-[0.08em] text-muted-foreground">
                  <tr>
                    {tableColumns.map(
                      (col) =>
                        columnVisibility[col.key] !== false && (
                          <th key={col.key} className="px-5 py-3.5 font-bold">
                            {col.label}
                          </th>
                        ),
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {paginatedData.length > 0 ? (
                    paginatedData.map((item, idx) =>
                      renderRow ? (
                        renderRow(item, columnVisibility)
                      ) : (
                        <tr key={idx} className="transition-colors hover:bg-secondary/40">
                          {tableColumns.map(
                            (col) =>
                              columnVisibility[col.key] !== false && (
                                <td key={col.key} className="px-5 py-4">
                                  {String(item[col.key] ?? "-")}
                                </td>
                              ),
                          )}
                        </tr>
                      ),
                    )
                  ) : (
                    <tr>
                      <td colSpan={tableColumns.length} className="px-5 py-8 text-center text-muted-foreground">
                        No matching records found for selected filter parameters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between border-t border-border/60 p-4 text-xs">
              <span className="text-muted-foreground font-medium">
                Page <strong className="text-foreground">{currentPage}</strong> of {totalPages}
              </span>
              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="glass-tile rounded-lg p-1.5 text-muted-foreground disabled:opacity-40 hover:bg-secondary"
                >
                  <ChevronLeft className="size-4" />
                </button>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="glass-tile rounded-lg p-1.5 text-muted-foreground disabled:opacity-40 hover:bg-secondary"
                >
                  <ChevronRight className="size-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
