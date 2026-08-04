import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/page-header";
import {
  useListGeofencesQuery,
  useCreateGeofenceMutation,
  useDeleteGeofenceMutation,
} from "@/services/attendanceApi";
import { toast } from "sonner";
import {
  MapPin,
  Plus,
  Trash2,
  Navigation,
  Globe,
  AlertTriangle,
  RefreshCw,
  Inbox,
  ShieldCheck,
  Radio,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard/attendance/geofence")({
  component: AttendanceGeofencePage,
});

function AttendanceGeofencePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [latitude, setLatitude] = useState(12.9716);
  const [longitude, setLongitude] = useState(77.5946);
  const [radiusMeters, setRadiusMeters] = useState(200);
  const [address, setAddress] = useState("");

  // API Hooks
  const { data: zonesRes, isLoading, isError, refetch } = useListGeofencesQuery();
  const [createGeofence, { isLoading: isCreating }] = useCreateGeofenceMutation();
  const [deleteGeofence] = useDeleteGeofenceMutation();

  const zones = zonesRes?.data ?? [];

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      toast.error("Please enter a Geofence Zone Name.");
      return;
    }

    try {
      await createGeofence({
        name,
        latitude,
        longitude,
        radius_meters: radiusMeters,
        address: address || undefined,
      }).unwrap();

      toast.success("Geofence zone created successfully.");
      setIsModalOpen(false);
      setName("");
      setAddress("");
    } catch {
      toast.error("Failed to create geofence zone.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this geofence boundary?")) return;
    try {
      await deleteGeofence(id).unwrap();
      toast.success("Geofence zone deleted.");
    } catch {
      toast.error("Failed to delete geofence zone.");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Geofence & Biometric Terminals"
        description="GPS radius boundary enforcement, mobile punch location verification, and terminal gateway rules stored in PostgreSQL."
        breadcrumbs={[
          { label: "Attendance", href: "/dashboard/attendance" },
          { label: "Geofencing" },
        ]}
        actions={
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-brand px-4 py-2 text-xs font-semibold text-primary-foreground shadow-glow hover:shadow-glow-lg transition-all"
          >
            <Plus className="size-4" /> Add Geofence Zone
          </button>
        }
      />

      {/* ── Content Area ── */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-tile h-44 animate-pulse rounded-2xl p-5" />
          ))}
        </div>
      ) : isError ? (
        <div className="glass-tile flex flex-col items-center justify-center rounded-2xl p-12 text-center">
          <AlertTriangle className="size-8 text-destructive" />
          <h3 className="mt-3 font-display text-base font-bold text-foreground">
            Failed to load geofence boundaries
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            An error occurred while fetching GPS geofences from PostgreSQL.
          </p>
          <button
            onClick={() => refetch()}
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
          >
            <RefreshCw className="size-4" /> Retry
          </button>
        </div>
      ) : zones.length === 0 ? (
        <div className="glass-tile flex flex-col items-center justify-center rounded-2xl p-12 text-center">
          <div className="grid size-12 place-items-center rounded-2xl bg-secondary text-muted-foreground">
            <Inbox className="size-6" />
          </div>
          <h3 className="mt-4 font-display text-base font-bold text-foreground">
            No geofence zones configured
          </h3>
          <p className="mt-1 max-w-sm text-xs text-muted-foreground">
            No active GPS boundaries found in PostgreSQL. Click below to register one.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-gradient-brand px-4 py-2 text-xs font-semibold text-primary-foreground"
          >
            <Plus className="size-4" /> Add Geofence Zone
          </button>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {zones.map((zone) => (
            <div
              key={zone.id}
              className="glass-tile group flex flex-col justify-between rounded-2xl p-5 border border-border transition-all duration-300 hover-lift hover:border-primary/40"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-500 border border-emerald-500/20">
                    <ShieldCheck className="size-3" /> Active Boundary
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
                    <Radio className="size-3" /> {zone.radius_meters}m Radius
                  </span>
                </div>

                <h3 className="mt-3 font-display text-base font-bold text-foreground group-hover:text-primary transition-colors">
                  {zone.name}
                </h3>
                {zone.address && (
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <MapPin className="size-3.5 text-amber-500 shrink-0" /> {zone.address}
                  </p>
                )}

                <div className="mt-4 rounded-xl bg-secondary/50 p-2.5 border border-border/50 text-xs text-muted-foreground space-y-1 font-mono">
                  <div className="flex items-center justify-between">
                    <span>Latitude:</span>
                    <span className="font-bold text-foreground">{zone.latitude}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Longitude:</span>
                    <span className="font-bold text-foreground">{zone.longitude}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 border-t border-border/60 pt-3 flex items-center justify-between text-xs">
                <span className="font-semibold text-emerald-500 flex items-center gap-1 text-[11px]">
                  <Globe className="size-3.5" /> GPS Enforcement Live
                </span>

                <button
                  onClick={() => handleDelete(zone.id)}
                  className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"
                  title="Delete Geofence Zone"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Create Geofence Modal ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="glass-tile w-full max-w-md rounded-2xl p-6 border border-border space-y-4">
            <h3 className="font-display text-base font-bold text-foreground">
              Add GPS Geofence Zone
            </h3>
            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-muted-foreground font-semibold mb-1">Zone / Office Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Bengaluru HQ Primary Campus"
                  className="w-full rounded-xl border border-input bg-card p-2 text-xs text-foreground outline-none"
                />
              </div>

              <div>
                <label className="block text-muted-foreground font-semibold mb-1">Address / Landmark</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. MG Road Tech Park, Bengaluru"
                  className="w-full rounded-xl border border-input bg-card p-2 text-xs text-foreground outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-muted-foreground font-semibold mb-1">Latitude</label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={latitude}
                    onChange={(e) => setLatitude(Number(e.target.value))}
                    className="w-full rounded-xl border border-input bg-card p-2 text-xs text-foreground outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-muted-foreground font-semibold mb-1">Longitude</label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={longitude}
                    onChange={(e) => setLongitude(Number(e.target.value))}
                    className="w-full rounded-xl border border-input bg-card p-2 text-xs text-foreground outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-muted-foreground font-semibold mb-1">Allowed Radius (Meters)</label>
                <input
                  type="number"
                  required
                  value={radiusMeters}
                  onChange={(e) => setRadiusMeters(Number(e.target.value))}
                  className="w-full rounded-xl border border-input bg-card p-2 text-xs text-foreground outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-input px-4 py-2 text-xs font-semibold text-foreground hover:bg-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="rounded-xl bg-gradient-brand px-4 py-2 text-xs font-semibold text-primary-foreground shadow-glow"
                >
                  {isCreating ? "Saving..." : "Add Zone"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
