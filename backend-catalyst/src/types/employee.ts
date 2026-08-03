import type { Role } from "@/lib/auth/types";

export type EmployeeStatus = "Active" | "Inactive" | "On Leave" | "Remote" | "Archived";

export interface Employee {
  id: string;
  employee_id: string;
  full_name: string;
  email: string;
  phone?: string | undefined;
  job_title?: string | undefined;
  department?: string | undefined;
  department_id?: string | undefined;
  branch?: string | undefined;
  location?: string | undefined;
  employment_type?: string | undefined;
  reporting_manager?: string | undefined;
  reporting_manager_id?: string | undefined;
  joining_date?: string | undefined;
  role: Role;
  status: EmployeeStatus;
  avatar_url?: string | undefined;
  photo_url?: string | undefined;
  mfa_enabled?: boolean | undefined;
  last_login_at?: string | undefined;
  last_login_location?: string | undefined;
  performance_rating?: string | undefined;
  organization_id?: string | undefined;
  created_at?: string | undefined;
  updated_at?: string | undefined;
  /** Only returned by the backend on account provisioning. */
  temp_password?: string | undefined;
  email_sent?: boolean | undefined;

  // Hierarchy Extension Fields
  hierarchy_level?: number | undefined;
  direct_reports_count?: number | undefined;
  team_size?: number | undefined;
  team?: string | undefined;
  work_mode?: "On-site" | "Hybrid" | "Remote" | string | undefined;
  organization_path?: string[] | undefined;
  department_head?: boolean | undefined;
}

export interface HierarchyTreeNode {
  id: string;
  employee: Employee;
  children: HierarchyTreeNode[];
  level: number;
  direct_reports_count: number;
  total_subordinates_count: number;
}

export interface EmployeeCreateInput {
  full_name: string;
  email: string;
  phone?: string | undefined;
  department?: string | undefined;
  job_title: string;
  branch?: string | undefined;
  reporting_manager?: string | undefined;
  reporting_manager_id?: string | undefined;
  employment_type?: string | undefined;
  joining_date?: string | undefined;
  role: Role;
  team?: string | undefined;
  work_mode?: string | undefined;
  hierarchy_level?: number | undefined;
}

export type EmployeeUpdateInput = Partial<EmployeeCreateInput> & {
  status?: EmployeeStatus | undefined;
};

export interface BulkReassignInput {
  employee_ids: string[];
  new_manager_id?: string | undefined;
  new_manager_name?: string | undefined;
  new_department?: string | undefined;
  new_team?: string | undefined;
}

export interface Department {
  id: string;
  name: string;
  code?: string;
  description?: string;
  head_id?: string;
  head_name?: string;
  manager_id?: string;
  manager_name?: string;
  email?: string;
  phone?: string;
  location?: string;
  parent_department_id?: string;
  color?: string;
  icon?: string;
  status?: string;
  is_deleted?: boolean;
  budget?: number;
  cost_center?: string;
  employee_count?: number;
  created_by?: string;
  updated_by?: string;
  created_at?: string;
  updated_at?: string;
}

export interface DepartmentCreateInput {
  name: string;
  code?: string | undefined;
  description?: string | undefined;
  head_id?: string | undefined;
  manager_id?: string | undefined;
  email?: string | undefined;
  phone?: string | undefined;
  location?: string | undefined;
  parent_department_id?: string | undefined;
  color?: string | undefined;
  icon?: string | undefined;
  status?: string | undefined;
  budget?: number | undefined;
  cost_center?: string | undefined;
}

export type DepartmentUpdateInput = Partial<DepartmentCreateInput>;

export interface DepartmentStatistics {
  total_departments: number;
  active_departments: number;
  inactive_departments: number;
  archived_departments: number;
  total_employees: number;
}
