import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/page-header";
import {
  useListAssetVendorsQuery,
  useCreateAssetVendorMutation,
  useUpdateAssetVendorMutation,
  useDeleteAssetVendorMutation,
} from "@/services/assetsApi";
import { toast } from "sonner";
import {
  Plus,
  Inbox,
  AlertTriangle,
  RefreshCw,
  Building2,
  Mail,
  Phone,
  User,
  Trash2,
  MapPin,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard/assets/vendors")({
  component: AssetVendorsPage,
});

function AssetVendorsPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [address, setAddress] = useState("");

  const { data, isLoading, isError, refetch } = useListAssetVendorsQuery();
  const [createVendor, { isLoading: isCreating }] = useCreateAssetVendorMutation();
  const [deleteVendor] = useDeleteAssetVendorMutation();

  const vendors = data?.data ?? [];

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      toast.error("Please enter a vendor company name.");
      return;
    }

    try {
      await createVendor({
        name,
        email,
        phone,
        contact_person: contactPerson,
        address,
      }).unwrap();

      toast.success("Vendor profile registered successfully.");
      setIsCreateOpen(false);
      setName("");
      setEmail("");
      setPhone("");
      setContactPerson("");
    } catch {
      toast.error("Failed to register vendor.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this vendor?")) return;
    try {
      await deleteVendor(id).unwrap();
      toast.success("Vendor deleted.");
    } catch {
      toast.error("Failed to delete vendor.");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Hardware & Software Vendors"
        description="Directory of approved hardware distributors, software publishers, repair centers, and OEM suppliers."
        breadcrumbs={[
          { label: "Assets", href: "/dashboard/assets" },
          { label: "Vendors & Suppliers" },
        ]}
        actions={
          <button
            onClick={() => setIsCreateOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-brand px-4 py-2 text-xs font-semibold text-primary-foreground shadow-glow hover:shadow-glow-lg transition-all"
          >
            <Plus className="size-4" /> Add Vendor
          </button>
        }
      />

      {/* ── Content Area ── */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-tile h-36 animate-pulse rounded-2xl p-5" />
          ))}
        </div>
      ) : isError ? (
        <div className="glass-tile flex flex-col items-center justify-center rounded-2xl p-12 text-center">
          <AlertTriangle className="size-8 text-destructive" />
          <h3 className="mt-3 font-display text-base font-bold text-foreground">
            Failed to load vendors
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            An error occurred while fetching vendor profiles from PostgreSQL.
          </p>
          <button
            onClick={() => refetch()}
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
          >
            <RefreshCw className="size-4" /> Retry
          </button>
        </div>
      ) : vendors.length === 0 ? (
        <div className="glass-tile flex flex-col items-center justify-center rounded-2xl p-12 text-center">
          <div className="grid size-12 place-items-center rounded-2xl bg-secondary text-muted-foreground">
            <Inbox className="size-6" />
          </div>
          <h3 className="mt-4 font-display text-base font-bold text-foreground">
            No vendors registered
          </h3>
          <p className="mt-1 max-w-sm text-xs text-muted-foreground">
            No vendor profiles exist in PostgreSQL. Add your first hardware supplier.
          </p>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-gradient-brand px-4 py-2 text-xs font-semibold text-primary-foreground"
          >
            <Plus className="size-4" /> Add Vendor
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {vendors.map((ven) => (
            <div
              key={ven.id}
              className="glass-tile group flex flex-col justify-between rounded-2xl p-5 border border-border transition-all duration-300 hover-lift hover:border-primary/40"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <div className="grid size-9 place-items-center rounded-xl bg-primary/10 text-primary">
                    <Building2 className="size-5" />
                  </div>
                  <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-500">
                    Approved Supplier
                  </span>
                </div>

                <h3 className="mt-3 font-display text-base font-bold text-foreground group-hover:text-primary transition-colors">
                  {ven.name}
                </h3>

                {ven.contact_person && (
                  <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                    <User className="size-3.5 text-muted-foreground/70" /> Contact: {ven.contact_person}
                  </p>
                )}

                <div className="mt-3 space-y-1 text-xs text-muted-foreground">
                  {ven.email && (
                    <p className="flex items-center gap-1.5">
                      <Mail className="size-3.5 text-muted-foreground/70" /> {ven.email}
                    </p>
                  )}
                  {ven.phone && (
                    <p className="flex items-center gap-1.5">
                      <Phone className="size-3.5 text-muted-foreground/70" /> {ven.phone}
                    </p>
                  )}
                  {ven.address && (
                    <p className="flex items-center gap-1.5">
                      <MapPin className="size-3.5 text-muted-foreground/70" /> {ven.address}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-4 border-t border-border/60 pt-3 flex justify-end">
                <button
                  onClick={() => handleDelete(ven.id)}
                  className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"
                  title="Delete Vendor"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Add Vendor Modal ── */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="glass-tile w-full max-w-md rounded-2xl p-6 border border-border">
            <h3 className="text-base font-bold font-display text-foreground mb-4">
              Add Vendor Profile
            </h3>
            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Vendor Company Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Apple Enterprise Solutions"
                  className="w-full rounded-xl border border-input bg-card p-2 text-xs text-foreground outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="sales@vendor.com"
                    className="w-full rounded-xl border border-input bg-card p-2 text-xs text-foreground outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (800) 555-0199"
                    className="w-full rounded-xl border border-input bg-card p-2 text-xs text-foreground outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Primary Contact Person
                </label>
                <input
                  type="text"
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  placeholder="e.g. Sarah Jenkins (Account Executive)"
                  className="w-full rounded-xl border border-input bg-card p-2 text-xs text-foreground outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Office / Warehouse Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="100 Infinite Loop, Cupertino, CA"
                  className="w-full rounded-xl border border-input bg-card p-2 text-xs text-foreground outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="rounded-xl border border-input px-4 py-2 text-xs font-semibold text-foreground hover:bg-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="rounded-xl bg-gradient-brand px-4 py-2 text-xs font-semibold text-primary-foreground shadow-glow"
                >
                  {isCreating ? "Saving..." : "Add Vendor"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
