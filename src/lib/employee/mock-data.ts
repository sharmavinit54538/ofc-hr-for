/**
 * Mock data for the Employee Self-Service Dashboard.
 * All data is realistic and static — no backend is contacted.
 */

// ── Attendance Mock Data ──────────────────────────────────────────
export interface AttendanceRecord {
  date: string;
  day: string;
  clockIn: string;
  clockOut: string;
  totalHours: string;
  status: "Present" | "Absent" | "Half Day" | "Weekend" | "Holiday" | "WFH";
}

export const MOCK_ATTENDANCE: AttendanceRecord[] = [];

export const ATTENDANCE_SUMMARY = {
  thisMonth: { present: 0, absent: 0, wfh: 0, halfDay: 0, totalHours: "0h" },
  avgClockIn: "—",
  avgClockOut: "—",
  onTimeRate: "0%",
};

// ── Leave Mock Data ───────────────────────────────────────────────
export interface LeaveBalance {
  type: string;
  total: number;
  used: number;
  remaining: number;
  color: string;
}

export const MOCK_LEAVE_BALANCES: LeaveBalance[] = [];

export interface LeaveRequest {
  id: string;
  type: string;
  from: string;
  to: string;
  days: number;
  reason: string;
  status: "Approved" | "Pending" | "Rejected";
  appliedOn: string;
  approver: string;
}

export const MOCK_LEAVE_HISTORY: LeaveRequest[] = [];

// ── Payroll Mock Data ─────────────────────────────────────────────
export interface PayslipRecord {
  id: string;
  month: string;
  year: string;
  basicPay: number;
  hra: number;
  conveyance: number;
  specialAllowance: number;
  grossEarnings: number;
  pf: number;
  professionalTax: number;
  incomeTax: number;
  totalDeductions: number;
  netPay: number;
  paidOn: string;
  status: "Paid" | "Pending" | "Processing";
}

export const MOCK_PAYSLIPS: PayslipRecord[] = [];

// ── Documents Mock Data ───────────────────────────────────────────
export interface EmployeeDocument {
  id: string;
  title: string;
  category: string;
  uploadedOn: string;
  fileSize: string;
  status: "Verified" | "Pending Review" | "Uploaded";
}

export const MOCK_EMPLOYEE_DOCUMENTS: EmployeeDocument[] = [];

// ── Helpdesk Mock Data ────────────────────────────────────────────
export interface HelpdeskTicket {
  id: string;
  subject: string;
  category: string;
  priority: "Low" | "Medium" | "High" | "Critical";
  status: "Open" | "In Progress" | "Resolved" | "Closed";
  createdAt: string;
  updatedAt: string;
  assignedTo: string;
  description: string;
}

export const MOCK_HELPDESK_TICKETS: HelpdeskTicket[] = [];

// ── Announcements Mock Data ───────────────────────────────────────
export interface Announcement {
  id: string;
  title: string;
  body: string;
  date: string;
  author: string;
  priority: "normal" | "important";
}

export const MOCK_ANNOUNCEMENTS: Announcement[] = [];

// ── Upcoming Holidays ─────────────────────────────────────────────
export interface Holiday {
  date: string;
  name: string;
  day: string;
  type: "Public" | "Restricted" | "Company";
}

export const MOCK_HOLIDAYS: Holiday[] = [];
