import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const clockInSchema = z.object({
  lat: z.number().optional(),
  lng: z.number().optional(),
  locationName: z.string().optional(),
});

export const clockOutSchema = z.object({
  attendanceId: z.string().uuid(),
});

// Haversine geofence calculation formula (distance in km)
function calculateGeofenceDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export const getAttendanceRecordsServerFn = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;

    const { data: profile } = await supabase
      .from("profiles")
      .select("id, organization_id")
      .eq("user_id", userId)
      .maybeSingle();

    if (!profile?.organization_id) return [];

    const { data: records, error } = await supabase
      .from("attendance_records")
      .select("*, employees(full_name, employee_code)")
      .eq("organization_id", profile.organization_id)
      .order("date", { ascending: false });

    if (error) throw new Error(error.message);
    return records || [];
  });

export const clockInServerFn = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: unknown) => clockInSchema.parse(data))
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context;

    // Get current employee
    const { data: emp } = await supabase
      .from("employees")
      .select("id, organization_id")
      .eq("user_id", userId)
      .maybeSingle();

    if (!emp) throw new Error("Employee record not found for user.");

    // Validate Geofence (Office HQ default location: Bengaluru 12.9716, 77.5946)
    const OFFICE_LAT = 12.9716;
    const OFFICE_LNG = 77.5946;
    const MAX_ALLOWED_DISTANCE_KM = 50.0; // 50 km radius limit

    if (data.lat !== undefined && data.lng !== undefined) {
      const distance = calculateGeofenceDistance(data.lat, data.lng, OFFICE_LAT, OFFICE_LNG);
      if (distance > MAX_ALLOWED_DISTANCE_KM) {
        throw new Error(`Clock-in rejected: You are ${distance.toFixed(1)}km outside office geofence zone.`);
      }
    }

    const todayStr: string = new Date().toISOString().split("T")[0]!;

    const { data: record, error } = await supabase
      .from("attendance_records")
      .upsert({
        organization_id: emp.organization_id,
        employee_id: emp.id,
        date: todayStr,
        clock_in: new Date().toISOString(),
        status: "Present",
        lat: data.lat ?? null,
        lng: data.lng ?? null,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return record;
  });

export const clockOutServerFn = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: unknown) => clockOutSchema.parse(data))
  .handler(async ({ context, data }) => {
    const { supabase } = context;

    const { data: existing } = await supabase
      .from("attendance_records")
      .select("clock_in")
      .eq("id", data.attendanceId)
      .maybeSingle();

    if (!existing || !existing.clock_in) {
      throw new Error("Cannot clock out: clock-in record missing.");
    }

    const clockInTime = new Date(existing.clock_in).getTime();
    const clockOutTime = Date.now();
    const diffMinutes = Math.floor((clockOutTime - clockInTime) / (1000 * 60));

    // Overtime calculation: Anything over 8 hours (480 minutes) is overtime
    const STANDARD_WORK_MINUTES = 480;
    const overtimeMinutes = diffMinutes > STANDARD_WORK_MINUTES ? diffMinutes - STANDARD_WORK_MINUTES : 0;

    const { data: updated, error } = await supabase
      .from("attendance_records")
      .update({
        clock_out: new Date().toISOString(),
        total_minutes: diffMinutes,
        overtime_minutes: overtimeMinutes,
      })
      .eq("id", data.attendanceId)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return updated;
  });
