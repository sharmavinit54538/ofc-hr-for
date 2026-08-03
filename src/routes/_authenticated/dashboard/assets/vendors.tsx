import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Store,
  Plus,
  Star,
  Phone,
  Mail,
  ShieldCheck,
  Calendar,
  Building2,
  Search,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";
import { MOCK_VENDORS, VendorRecord } from "@/lib/assets/mock-data";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/_authenticated/dashboard/assets/vendors")({
  component: VendorsPage,
});

function VendorsPage() {
  const [vendors, setVendors] = useState<VendorRecord[]>(MOCK_VENDORS);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    categoryProvided: "Hardware Laptops & Display Monitors",
    contactPerson: "",
    phone: "+91 80 4000 0000",
    email: "",
    contractEndDate: "2028-12-31",
  });

  const filtered = vendors.filter(
    (v) =>
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.categoryProvided.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleAddVendor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.contactPerson.trim()) {
      toast.error("Please enter vendor name and contact person.");
      return;
    }

    const newV: VendorRecord = {
      id: `vnd_${Date.now()}`,
      name: formData.name.trim(),
      categoryProvided: formData.categoryProvided,
      rating: 4.8,
      activeWarranties: 50,
      contactPerson: formData.contactPerson,
      phone: formData.phone,
      email: formData.email,
      status: "Active",
      contractEndDate: formData.contractEndDate,
    };

    setVendors([newV, ...vendors]);
    setIsModalOpen(false);
    toast.success("Vendor Partner Registered", {
      description: `${newV.name} added to approved procurement directory.`,
    });

    setFormData({
      name: "",
      categoryProvided: "Hardware Laptops & Display Monitors",
      contactPerson: "",
      phone: "+91 80 4000 0000",
      email: "",
      contractEndDate: "2028-12-31",
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Vendors & Hardware Procurement Partners"
        description="Directory of approved hardware OEMs, authorized resellers, warranty SLA contracts, and supply chain contacts."
        breadcrumbs={[
          { label: "Asset Management", href: "/dashboard/assets" },
          { label: "Vendors & Suppliers" },
        ]}
        backHref="/dashboard/assets"
        backLabel="Back to Asset Management"
        actions={
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-brand px-4 py-2 text-xs font-semibold text-primary-foreground shadow-glow hover:shadow-glow-lg transition-all"
          >
            <Plus className="size-4" /> Add Vendor Partner
          </button>
        }
      />

      {/* Toolbar */}
      <div className="glass-tile flex items-center justify-between rounded-2xl p-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search vendor name, equipment category, contact..."
            className="w-full rounded-xl border border-input bg-card/60 py-2 pl-9 pr-4 text-xs outline-none focus:border-ring"
          />
        </div>
        <span className="text-xs font-semibold text-muted-foreground">
          {filtered.length} Active Partners
        </span>
      </div>

      {/* Vendor Cards Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-2">
        {filtered.map((vendor) => (
          <div key={vendor.id} className="glass-tile space-y-4 rounded-2xl p-5 transition-all hover-lift">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-2xl bg-gradient-brand text-primary-foreground font-display font-bold shadow-glow">
                  {vendor.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-display text-base font-bold text-foreground">{vendor.name}</h3>
                  <p className="text-xs text-muted-foreground">{vendor.categoryProvided}</p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-bold text-amber-400">
                <Star className="size-3 fill-amber-400 text-amber-400" /> {vendor.rating} SLA
              </span>
            </div>

            <div className="grid gap-2 rounded-xl border border-border/50 bg-card/40 p-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Building2 className="size-3.5 text-primary" /> Key Contact:
                </span>
                <span className="font-bold text-foreground">{vendor.contactPerson}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Phone className="size-3.5 text-primary" /> Phone:
                </span>
                <span className="font-semibold text-foreground">{vendor.phone}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Mail className="size-3.5 text-primary" /> Email:
                </span>
                <span className="font-semibold text-primary">{vendor.email}</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1 border-t border-border/40">
              <span className="text-muted-foreground">
                Warranties Active: <strong className="text-foreground">{vendor.activeWarranties} items</strong>
              </span>
              <span className="font-mono text-[11px] text-muted-foreground">
                Contract End: {vendor.contractEndDate}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="glass-elevated max-w-md rounded-2xl border border-glass-border p-6 shadow-float">
          <DialogHeader>
            <DialogTitle className="font-display text-xl font-bold">Register Vendor Partner</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Add authorized equipment OEM or corporate reseller to procurement index.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddVendor} className="mt-4 space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-muted-foreground mb-1">Company / Vendor Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Lenovo Corporate India"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-xl border border-input bg-card/70 px-3 py-2 outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-muted-foreground mb-1">Equipment Category Provided</label>
              <input
                type="text"
                required
                value={formData.categoryProvided}
                onChange={(e) => setFormData({ ...formData, categoryProvided: e.target.value })}
                className="w-full rounded-xl border border-input bg-card/70 px-3 py-2 outline-none"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="block font-semibold text-muted-foreground mb-1">Account Manager</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Chandra"
                  value={formData.contactPerson}
                  onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                  className="w-full rounded-xl border border-input bg-card/70 px-3 py-2 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-muted-foreground mb-1">Phone</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full rounded-xl border border-input bg-card/70 px-3 py-2 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-muted-foreground mb-1">Corporate Email</label>
              <input
                type="email"
                required
                placeholder="enterprise@vendor.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full rounded-xl border border-input bg-card/70 px-3 py-2 outline-none"
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
                Register Partner
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
