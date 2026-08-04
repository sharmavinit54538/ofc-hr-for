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
