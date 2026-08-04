export interface AttendanceLogItem {
  id: string;
  user_id: string;
  employee_name: string;
  employee_email?: string;
  department?: string;
  date: string;
  clock_in?: string;
  clock_out?: string;
  total_hours: number;
  status: string;
  work_mode?: string;
  ip_address?: string;
}

export interface AttendanceStatsData {
  total_present_today: number;
  on_site_count: number;
  remote_wfh_count: number;
  late_arrivals: number;
  absent_count: number;
  avg_hours_today: number;
}

export interface ManualPunchInput {
  user_id: string;
  date: string;
  clock_in?: string | undefined;
  clock_out?: string | undefined;
  status?: string | undefined;
  work_mode?: string | undefined;
}

export interface ShiftPatternItem {
  id: string;
  name: string;
  code: string;
  start_time: string;
  end_time: string;
  working_days: string;
  grace_minutes: number;
  assigned_count: number;
  is_active: boolean;
  description?: string;
}

export interface ShiftPatternCreateInput {
  name: string;
  code: string;
  start_time: string;
  end_time: string;
  working_days: string;
  grace_minutes?: number | undefined;
  description?: string | undefined;
}

export interface GeofenceZoneItem {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  radius_meters: number;
  address?: string;
  is_active: boolean;
}

export interface GeofenceZoneCreateInput {
  name: string;
  latitude: number;
  longitude: number;
  radius_meters?: number | undefined;
  address?: string | undefined;
}

export interface OvertimeClaimItem {
  id: string;
  user_id: string;
  employee_name: string;
  employee_email?: string;
  department?: string;
  title: string;
  date: string;
  hours: number;
  rate_multiplier: number;
  reason?: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  approver_name?: string;
}

export interface OvertimeClaimCreateInput {
  user_id: string;
  title: string;
  date: string;
  hours: number;
  rate_multiplier?: number | undefined;
  reason?: string | undefined;
}

export interface OvertimeClaimUpdateInput {
  status: "APPROVED" | "REJECTED";
  approver_name?: string | undefined;
}
