import { useState, useMemo, memo, useCallback } from "react";
import {
  Plus,
  Search,
  Download,
  LayoutGrid,
  List,
  Inbox,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";

export const GenericSubModuleView = memo(function GenericSubModuleView({
  parentHref,
  parentLabel,
  title,
  description,
  items,
  headers,
  showActions = false,
  showToolbar = true,
  isLoading = false,
  isEmpty: explicitIsEmpty,
  onCreate,
}: {
  href?: string;
  parentHref: string;
  parentLabel: string;
  title: string;
  description: string;
  items: {
    id: string;
    title: string;
    subtitle: string;
    status: string;
    date: string;
    metric?: string | undefined;
  }[];
  headers?: {
    title?: string;
    subtitle?: string;
    status?: string;
    date?: string;
    metric?: string;
  };
  showActions?: boolean;
  showToolbar?: boolean;
  isLoading?: boolean;
  isEmpty?: boolean;
  onCreate?: () => void;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
  }, []);

  const handleExport = () => {
    toast.success("Export Started", {
      description: `Exporting ${title} report records.`,
    });
  };

  const handleCreate = () => {
    if (onCreate) {
      onCreate();
    } else {
      toast.info("Create Record", {
        description: `Creating new entry in ${title}.`,
      });
    }
  };

  // Real-time Search Filtering with memoization
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return items;
    const q = searchQuery.toLowerCase();
    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q) ||
        item.status.toLowerCase().includes(q) ||
        item.date.toLowerCase().includes(q),
    );
  }, [items, searchQuery]);

  return (
    <div className="space-y-6">
      {/* ── Page Header ────────────────────────────────────────── */}
      <PageHeader
        title={title}
        description={description}
        breadcrumbs={[{ label: parentLabel, href: parentHref }, { label: title }]}
        backHref={parentHref}
        backLabel={`Back to ${parentLabel}`}
        actions={
          showActions ? (
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleExport}
                className="glass-tile inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-secondary focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Download className="size-3.5" /> Export Data
              </button>
              <button
                onClick={handleCreate}
                className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-brand px-3.5 py-2 text-xs font-semibold text-primary-foreground shadow-glow hover:shadow-glow-lg focus-visible:ring-2 focus-visible:ring-ring transition-all"
              >
                <Plus className="size-3.5" /> Create New
              </button>
            </div>
          ) : undefined
        }
      />

      {/* ── Toolbar / Controls ─────────────────────────────────── */}
      {showToolbar && (
        <div className="glass-tile flex flex-col gap-3 rounded-2xl p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder={`Search ${title.toLowerCase()}...`}
              className="w-full rounded-xl border border-input bg-card/60 py-2 pl-9 pr-4 text-xs outline-none transition-all focus:border-ring focus:shadow-glow placeholder:text-muted-foreground/60"
            />
          </div>

          <div className="flex items-center gap-2">
            {/* View Toggle */}
            <div className="flex items-center rounded-xl border border-input bg-card/60 p-1">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                title="Grid View"
                aria-label="Switch to Grid View"
                className={`grid size-7 place-items-center rounded-lg text-xs transition-colors ${
                  viewMode === "grid"
                    ? "bg-gradient-brand text-primary-foreground shadow-glow"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <LayoutGrid className="size-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("table")}
                title="Table View"
                aria-label="Switch to Table View"
                className={`grid size-7 place-items-center rounded-lg text-xs transition-colors ${
                  viewMode === "table"
                    ? "bg-gradient-brand text-primary-foreground shadow-glow"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <List className="size-3.5" />
              </button>
            </div>

            <span className="text-xs font-medium text-muted-foreground">
              {filteredItems.length} {filteredItems.length === 1 ? "Item" : "Items"}
            </span>
          </div>
        </div>
      )}

      {/* ── Main Content Area ──────────────────────────────────── */}
      {isLoading ? (
        <div className="glass-tile flex flex-col items-center justify-center rounded-2xl p-12 text-center">
          <Loader2 className="size-8 animate-spin text-primary" />
          <p className="mt-3 text-xs font-semibold text-muted-foreground">
            Loading {title.toLowerCase()}...
          </p>
        </div>
      ) : explicitIsEmpty || items.length === 0 ? (
        <div className="glass-tile flex flex-col items-center justify-center rounded-2xl p-12 text-center">
          <div className="grid size-12 place-items-center rounded-2xl bg-secondary text-muted-foreground">
            <Inbox className="size-6" />
          </div>
          <h3 className="mt-4 font-display text-base font-bold text-foreground">
            No {title.toLowerCase()} recorded
          </h3>
          <p className="mt-1 max-w-sm text-xs text-muted-foreground">
            There are no {title.toLowerCase()} entries in the database.
          </p>
          {showActions && (
            <button
              onClick={handleCreate}
              className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-gradient-brand px-4 py-2 text-xs font-semibold text-primary-foreground shadow-glow hover:shadow-glow-lg transition-all"
            >
              <Plus className="size-4" /> Create New
            </button>
          )}
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="glass-tile flex flex-col items-center justify-center rounded-2xl p-12 text-center">
          <div className="grid size-12 place-items-center rounded-2xl bg-secondary text-muted-foreground">
            <Inbox className="size-6" />
          </div>
          <h3 className="mt-4 font-display text-base font-bold text-foreground">
            No matching records found
          </h3>
          <p className="mt-1 max-w-sm text-xs text-muted-foreground">
            No results match "{searchQuery}". Try adjusting your search query or clear the filter.
          </p>
          <button
            onClick={handleClearSearch}
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl border border-input bg-card px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-secondary"
          >
            Clear Search
          </button>
        </div>
      ) : viewMode === "grid" ? (
        /* ── Grid View ────────────────────────────────────────── */
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="glass-tile group flex flex-col justify-between rounded-2xl p-5 transition-all duration-300 hover-lift hover:border-primary/40 hover:shadow-glow"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-display text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                    {item.title}
                  </h4>
                  <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold text-primary">
                    {item.status}
                  </span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{item.subtitle}</p>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-border/40 pt-3">
                <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                  {!item.date || item.date === "—" ? "Updated Recently" : item.date}
                </div>
                {item.metric && item.metric !== "—" && (
                  <div className="rounded-xl border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-[11px] font-bold text-primary">
                    {item.metric}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* ── Table View ───────────────────────────────────────── */
        <div className="glass-tile overflow-hidden rounded-2xl border border-border">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-card/60 uppercase tracking-[0.08em] text-muted-foreground font-bold">
                <tr>
                  <th className="px-5 py-3.5">{headers?.title ?? "Record Title"}</th>
                  <th className="px-5 py-3.5">{headers?.subtitle ?? "Details"}</th>
                  <th className="px-5 py-3.5">{headers?.status ?? "Status"}</th>
                  <th className="px-5 py-3.5">{headers?.date ?? "Timestamp / Date"}</th>
                  <th className="px-5 py-3.5 text-right">{headers?.metric ?? "Metric / Score"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="transition-colors hover:bg-secondary/40">
                    <td className="px-5 py-4 font-bold text-foreground">{item.title}</td>
                    <td className="px-5 py-4 text-muted-foreground">{item.subtitle}</td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold text-primary">
                        {item.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-muted-foreground">
                      {!item.date || item.date === "—" ? "Updated Recently" : item.date}
                    </td>
                    <td className="px-5 py-4 font-bold text-primary text-right">
                      {!item.metric || item.metric === "—" ? "Active" : item.metric}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
});
