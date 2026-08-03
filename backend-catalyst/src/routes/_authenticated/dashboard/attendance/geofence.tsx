import { createFileRoute } from "@tanstack/react-router";
import { GenericSubModuleView } from "@/components/admin/generic-module-view";

export const Route = createFileRoute("/_authenticated/dashboard/attendance/geofence")({
  component: () => (
    <GenericSubModuleView
      href="/dashboard/attendance/geofence"
      parentHref="/dashboard/attendance"
      parentLabel="Attendance"
      title="Geofence & Biometric Terminals"
      description="GPS radius rules, mobile check-in verification, and biometric terminal device status."
      items={[
        { id: "1", title: "Bengaluru HQ GPS Boundary", subtitle: "Radius: 200m · Lat 12.9716, Long 77.5946", status: "Active Geofence", date: "Sync: 1s", metric: "Enforced" },
        { id: "2", title: "Biometric Terminal #04 (Lobby)", subtitle: "ZkTeco FaceScan 4K Pro", status: "Online", date: "IP: 10.0.4.12", metric: "0 Latency" },
      ]}
    />
  ),
});
