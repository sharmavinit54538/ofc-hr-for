export interface LeaveRequestItem {
  id: string;
  user_id: string;
  employee_name: string;
  employee_email?: string;
  department?: string;
  leave_type: string;
  from_date: string;
  to_date: string;
  days: number;
  reason: string;
  status: "Pending" | "Approved" | "Rejected";
  applied_on: string;
  approver?: string;
}

export interface LeaveRequestCreateInput {
  user_id: string;
  leave_type: string;
  from_date: string;
  to_date: string;
  days: number;
  reason: string;
}

export interface LeaveRequestUpdateInput {
  status: "Approved" | "Rejected";
  approver?: string | undefined;
}

export interface LeaveStatsData {
  pending_count: number;
  approved_today: number;
  rejected_count: number;
  total_pto_days: number;
}

export interface LeaveApprovalRuleItem {
  id: string;
  rule_name: string;
  approval_levels: number;
  auto_approve_days: number;
  escalation_hours: number;
  applies_to: string;
  is_active: boolean;
  description?: string;
}

export interface LeaveApprovalRuleCreateInput {
  rule_name: string;
  approval_levels?: number | undefined;
  auto_approve_days?: number | undefined;
  escalation_hours?: number | undefined;
  applies_to?: string | undefined;
  description?: string | undefined;
}
