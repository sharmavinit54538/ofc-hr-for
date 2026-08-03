import { useState, useMemo, useRef } from "react";
import {
  Search,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  RefreshCw,
  Users,
  ChevronDown,
  ChevronRight,
  Layers,
  MoveHorizontal,
  MoveVertical,
  GripVertical,
  ShieldCheck,
  User,
} from "lucide-react";
import { toast } from "sonner";
import type { Employee, HierarchyTreeNode } from "@/types/employee";
import { buildHierarchyTree } from "@/utils/hierarchy";

export function OrgChartView({
  employees,
  onSelectEmployee,
  onManagerReassign,
}: {
  employees: Employee[];
  onSelectEmployee?: (emp: Employee) => void;
  onManagerReassign?: (employeeId: string, newManagerId: string) => void;
}) {
  const [layoutMode, setLayoutMode] = useState<"vertical" | "horizontal">("vertical");
  const [searchQuery, setSearchQuery] = useState("");
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [collapsedNodes, setCollapsedNodes] = useState<Record<string, boolean>>({});
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);
  const [dragOverNodeId, setDragOverNodeId] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Build hierarchy tree
  const hierarchyTree = useMemo(() => buildHierarchyTree(employees), [employees]);

  // Search match highlighted IDs
  const highlightedNodeIds = useMemo(() => {
    if (!searchQuery.trim()) return new Set<string>();
    const query = searchQuery.trim().toLowerCase();
    const set = new Set<string>();

    employees.forEach((emp) => {
      if (
        emp.full_name?.toLowerCase().includes(query) ||
        emp.job_title?.toLowerCase().includes(query) ||
        emp.department?.toLowerCase().includes(query) ||
        emp.employee_id?.toLowerCase().includes(query)
      ) {
        set.add(emp.id);
      }
    });

    return set;
  }, [searchQuery, employees]);

  const toggleCollapse = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCollapsedNodes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleExpandAll = () => setCollapsedNodes({});
  const handleCollapseAll = () => {
    const next: Record<string, boolean> = {};
    const traverse = (node: HierarchyTreeNode) => {
      next[node.id] = true;
      node.children.forEach(traverse);
    };
    hierarchyTree.forEach(traverse);
    setCollapsedNodes(next);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      void containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      void document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Drag & Drop handlers
  const handleDragStart = (e: React.DragEvent, nodeId: string) => {
    e.stopPropagation();
    setDraggedNodeId(nodeId);
    e.dataTransfer.setData("text/plain", nodeId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (draggedNodeId && draggedNodeId !== targetId) {
      setDragOverNodeId(targetId);
      e.dataTransfer.dropEffect = "move";
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOverNodeId(null);
  };

  const handleDrop = (e: React.DragEvent, targetManagerId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverNodeId(null);

    const sourceId = e.dataTransfer.getData("text/plain") || draggedNodeId;
    if (sourceId && sourceId !== targetManagerId) {
      const draggedEmp = employees.find((emp) => emp.id === sourceId);
      const managerEmp = employees.find((emp) => emp.id === targetManagerId);

      if (draggedEmp && managerEmp) {
        onManagerReassign?.(sourceId, targetManagerId);
        toast.success(`Reassigned Manager`, {
          description: `Moved ${draggedEmp.full_name} under manager ${managerEmp.full_name}.`,
        });
      }
    }
    setDraggedNodeId(null);
  };

  // Recursive Node renderer
  const renderTreeNode = (node: HierarchyTreeNode) => {
    const isCollapsed = Boolean(collapsedNodes[node.id]);
    const isHighlighted = highlightedNodeIds.has(node.id);
    const isDragged = draggedNodeId === node.id;
    const isDragTarget = dragOverNodeId === node.id;
    const hasChildren = node.children.length > 0;

    return (
      <div
        key={node.id}
        className={`flex ${
          layoutMode === "vertical" ? "flex-col items-center" : "flex-row items-center"
        } relative transition-all`}
      >
        {/* Node Card Component */}
        <div
          draggable
          onDragStart={(e) => handleDragStart(e, node.id)}
          onDragOver={(e) => handleDragOver(e, node.id)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, node.id)}
          onClick={() => onSelectEmployee?.(node.employee)}
          className={`glass-tile group relative flex flex-col items-center rounded-2xl p-4 text-center transition-all duration-300 hover-lift border cursor-pointer select-none ${
            layoutMode === "vertical" ? "w-64" : "w-60"
          } ${
            isHighlighted
              ? "border-primary ring-2 ring-primary/40 shadow-glow-lg bg-primary/10"
              : isDragTarget
              ? "border-emerald-500 ring-2 ring-emerald-500/50 bg-emerald-500/10 scale-105"
              : isDragged
              ? "opacity-50 border-dashed border-muted-foreground"
              : "border-border/60 hover:border-primary/40"
          }`}
        >
          {/* Drag Handle Indicator */}
          <div className="absolute left-2 top-3 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground">
            <GripVertical className="size-3.5" />
          </div>

          {/* Level Badge */}
          <span className="absolute right-3 top-3 rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-[9px] font-bold text-primary">
            L{node.level}
          </span>

          {/* Avatar / Initial */}
          <div className="flex size-11 items-center justify-center rounded-full bg-gradient-brand font-display font-bold text-primary-foreground shadow-glow transition-transform group-hover:scale-105">
            {node.employee.full_name?.charAt(0) ?? "U"}
          </div>

          {/* Employee Details */}
          <h4 className="mt-2 font-display text-xs font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
            {node.employee.full_name}
          </h4>
          <p className="text-[11px] font-semibold text-primary line-clamp-1">
            {node.employee.job_title || "Employee"}
          </p>
          <p className="mt-0.5 text-[10px] text-muted-foreground line-clamp-1">
            {node.employee.department || "General"}
          </p>

          {/* Direct & Total Subordinates Badges */}
          <div className="mt-3 flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 rounded-full bg-secondary/80 px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
              <Users className="size-3 text-primary" /> {node.direct_reports_count} Directs
            </span>
            {node.total_subordinates_count > node.direct_reports_count && (
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                {node.total_subordinates_count} Total
              </span>
            )}
          </div>

          {/* Expand / Collapse Action Button */}
          {hasChildren && (
            <button
              type="button"
              onClick={(e) => toggleCollapse(node.id, e)}
              className="mt-2 flex size-6 items-center justify-center rounded-full border border-border/80 bg-card/90 text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all shadow-sm"
              title={isCollapsed ? "Expand team" : "Collapse team"}
            >
              {isCollapsed ? (
                <ChevronRight className="size-3.5" />
              ) : (
                <ChevronDown className="size-3.5" />
              )}
            </button>
          )}
        </div>

        {/* Connecting Lines & Children Rendering */}
        {hasChildren && !isCollapsed && (
          <div
            className={`flex ${
              layoutMode === "vertical"
                ? "flex-col items-center mt-3"
                : "flex-row items-center ml-4"
            }`}
          >
            {/* Connecting Vertical Stem */}
            <div
              className={`${
                layoutMode === "vertical" ? "h-6 w-px" : "w-6 h-px"
              } bg-primary/40`}
            />

            {/* Children Container */}
            <div
              className={`flex ${
                layoutMode === "vertical"
                  ? "flex-row justify-center gap-6 border-t border-primary/30 pt-4"
                  : "flex-col justify-center gap-4 border-l border-primary/30 pl-4"
              }`}
            >
              {node.children.map(renderTreeNode)}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      ref={containerRef}
      className={`relative flex flex-col space-y-4 rounded-3xl ${
        isFullscreen ? "bg-background p-6 overflow-auto" : ""
      }`}
    >
      {/* ── Org Chart Control Toolbar ──────────────────────────── */}
      <div className="glass-tile flex flex-col gap-3 rounded-2xl p-4 sm:flex-row sm:items-center sm:justify-between z-10 backdrop-blur-xl">
        {/* Search Filter Input */}
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search hierarchy tree by name, role..."
            className="w-full rounded-xl border border-input bg-card/60 py-2 pl-9 pr-4 text-xs outline-none transition-all focus:border-ring focus:shadow-glow"
          />
        </div>

        {/* Layout & Canvas Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Layout Mode Toggle */}
          <div className="flex items-center rounded-xl border border-input bg-card/60 p-1">
            <button
              type="button"
              onClick={() => setLayoutMode("vertical")}
              className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                layoutMode === "vertical"
                  ? "bg-primary text-primary-foreground shadow-glow"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <MoveVertical className="size-3.5" /> Vertical
            </button>
            <button
              type="button"
              onClick={() => setLayoutMode("horizontal")}
              className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                layoutMode === "horizontal"
                  ? "bg-primary text-primary-foreground shadow-glow"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <MoveHorizontal className="size-3.5" /> Horizontal
            </button>
          </div>

          {/* Expand/Collapse Controls */}
          <button
            type="button"
            onClick={handleExpandAll}
            className="glass-tile rounded-xl px-3 py-2 text-xs font-semibold text-foreground hover:bg-secondary transition-colors"
          >
            Expand All
          </button>
          <button
            type="button"
            onClick={handleCollapseAll}
            className="glass-tile rounded-xl px-3 py-2 text-xs font-semibold text-foreground hover:bg-secondary transition-colors"
          >
            Collapse All
          </button>

          {/* Zoom Controls */}
          <div className="flex items-center rounded-xl border border-input bg-card/60 px-2 py-1 gap-1">
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.max(0.4, z - 0.1))}
              className="p-1 text-muted-foreground hover:text-foreground transition-colors"
              title="Zoom out"
            >
              <ZoomOut className="size-3.5" />
            </button>
            <span className="text-[11px] font-mono font-bold text-foreground w-10 text-center">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.min(1.8, z + 0.1))}
              className="p-1 text-muted-foreground hover:text-foreground transition-colors"
              title="Zoom in"
            >
              <ZoomIn className="size-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setZoomLevel(1)}
              className="p-1 text-muted-foreground hover:text-foreground transition-colors"
              title="Reset Zoom"
            >
              <RefreshCw className="size-3" />
            </button>
          </div>

          {/* Fullscreen Toggle */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className="glass-tile rounded-xl p-2 text-muted-foreground hover:text-foreground transition-colors"
            title="Toggle fullscreen mode"
          >
            {isFullscreen ? <Minimize2 className="size-4" /> : <Maximize2 className="size-4" />}
          </button>
        </div>
      </div>

      {/* ── Interactive Org Chart Canvas Viewport ──────────────── */}
      <div className="glass-panel relative overflow-auto rounded-3xl p-8 min-h-[550px] flex items-center justify-center">
        {hierarchyTree.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center space-y-3 p-12">
            <Users className="size-10 text-muted-foreground/60" />
            <h3 className="font-display text-base font-bold text-foreground">
              No Organization Hierarchy Data
            </h3>
            <p className="text-xs text-muted-foreground max-w-sm">
              Add workforce employees to build interactive reporting structures automatically.
            </p>
          </div>
        ) : (
          <div
            style={{ transform: `scale(${zoomLevel})`, transformOrigin: "top center" }}
            className="transition-transform duration-200 min-w-full flex justify-center py-6"
          >
            <div
              className={`flex ${
                layoutMode === "vertical" ? "flex-row gap-8" : "flex-col gap-8"
              } justify-center`}
            >
              {hierarchyTree.map(renderTreeNode)}
            </div>
          </div>
        )}
      </div>

      {/* Drag & Drop Hint Footer */}
      <div className="flex items-center justify-between text-[11px] text-muted-foreground px-2">
        <span className="flex items-center gap-1.5">
          <GripVertical className="size-3 text-primary" /> Drag any employee card onto another manager card to reassign reporting manager instantly.
        </span>
        <span className="font-semibold text-primary">
          Total Hierarchy Nodes: {employees.length}
        </span>
      </div>
    </div>
  );
}
