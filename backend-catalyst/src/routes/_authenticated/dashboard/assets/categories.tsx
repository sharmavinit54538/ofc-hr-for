import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  FolderTree,
  Plus,
  Laptop,
  Monitor,
  Tv,
  Smartphone,
  Tablet,
  Printer,
  Fingerprint,
  CreditCard,
  Key,
  Headphones,
  Keyboard,
  Mouse,
  Armchair,
  Box,
  CheckCircle2,
  Clock,
  SlidersHorizontal,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";
import { MOCK_CATEGORIES, AssetCategoryInfo } from "@/lib/assets/mock-data";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/_authenticated/dashboard/assets/categories")({
  component: CategoriesPage,
});

const ICON_MAP: Record<string, any> = {
  Laptop: Laptop,
  Desktop: Monitor,
  Monitor: Tv,
  "Mobile Phone": Smartphone,
  Tablet: Tablet,
  Printer: Printer,
  "Biometric Device": Fingerprint,
  "ID Card": CreditCard,
  "Access Card": Key,
  Headset: Headphones,
  Keyboard: Keyboard,
  Mouse: Mouse,
  "Office Furniture": Armchair,
  Other: Box,
};

function CategoriesPage() {
  const [categories, setCategories] = useState<AssetCategoryInfo[]>(MOCK_CATEGORIES);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    depreciationYears: 3,
    description: "",
  });

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Please enter a category name.");
      return;
    }

    const newCat: AssetCategoryInfo = {
      name: formData.name as any,
      totalCount: 0,
      assignedCount: 0,
      availableCount: 0,
      depreciationYears: Number(formData.depreciationYears) || 3,
      iconName: "Box",
      description: formData.description || "Custom category classification",
    };

    setCategories([...categories, newCat]);
    setIsModalOpen(false);
    toast.success("Category Created", {
      description: `${newCat.name} classification added to asset taxonomy.`,
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Asset Categories & Taxonomies"
        description="Standardized hardware classification rules, depreciation schedules, and inventory volume breakdown across all 14 enterprise device types."
        breadcrumbs={[
          { label: "Asset Management", href: "/dashboard/assets" },
          { label: "Categories" },
        ]}
        backHref="/dashboard/assets"
        backLabel="Back to Asset Management"
        actions={
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-brand px-4 py-2 text-xs font-semibold text-primary-foreground shadow-glow hover:shadow-glow-lg transition-all"
          >
            <Plus className="size-4" /> Add Category Policy
          </button>
        }
      />

      {/* Grid of all 14 Categories */}
      <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {categories.map((cat) => {
          const IconComponent = ICON_MAP[cat.name] || Box;
          const utilization = cat.totalCount > 0 ? Math.round((cat.assignedCount / cat.totalCount) * 100) : 0;

          return (
            <div key={cat.name} className="glass-tile space-y-4 rounded-2xl p-5 flex flex-col justify-between transition-all hover-lift">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-brand text-primary-foreground shadow-glow">
                    <IconComponent className="size-5" />
                  </div>
                  <span className="rounded-full bg-secondary px-2.5 py-0.5 text-[10px] font-bold text-muted-foreground border border-border/60">
                    {cat.depreciationYears} Yr Lifespan
                  </span>
                </div>

                <div>
                  <h3 className="font-display text-base font-bold text-foreground">{cat.name}</h3>
                  <p className="text-[11px] text-muted-foreground line-clamp-2 mt-0.5">{cat.description}</p>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-border/40 text-xs">
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-muted-foreground">Total Assets:</span>
                  <span className="text-foreground font-bold">{cat.totalCount}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Assigned / Available:</span>
                  <span className="text-foreground">
                    <strong className="text-emerald-400">{cat.assignedCount}</strong> / {cat.availableCount}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground font-mono">
                    <span>Utilization</span>
                    <span>{utilization}%</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full bg-gradient-brand transition-all duration-300"
                      style={{ width: `${utilization}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="glass-elevated max-w-md rounded-2xl border border-glass-border p-6 shadow-float">
          <DialogHeader>
            <DialogTitle className="font-display text-xl font-bold">Configure Category Policy</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Define a new asset taxonomy class and financial depreciation lifecycle.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddCategory} className="mt-4 space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-muted-foreground mb-1">Category Name</label>
              <input
                type="text"
                required
                placeholder="e.g. VR Headset / Server Rack"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-xl border border-input bg-card/70 px-3 py-2 outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-muted-foreground mb-1">Depreciation Lifespan (Years)</label>
              <input
                type="number"
                min={1}
                max={10}
                value={formData.depreciationYears}
                onChange={(e) => setFormData({ ...formData, depreciationYears: Number(e.target.value) })}
                className="w-full rounded-xl border border-input bg-card/70 px-3 py-2 outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-muted-foreground mb-1">Category Scope / Description</label>
              <textarea
                rows={2}
                placeholder="Brief description of device class..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full rounded-xl border border-input bg-card/70 px-3 py-2 outline-none resize-none"
              />
            </div>

            <DialogFooter className="mt-5 flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="glass-tile rounded-xl px-4 py-2 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-gradient-brand px-5 py-2 text-xs font-semibold text-primary-foreground shadow-glow"
              >
                Save Category Policy
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
