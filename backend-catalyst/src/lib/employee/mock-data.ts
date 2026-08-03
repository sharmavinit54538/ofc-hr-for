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

export const MOCK_ATTENDANCE: AttendanceRecord[] = [
  { date: "2026-08-01", day: "Friday", clockIn: "09:02", clockOut: "18:15", totalHours: "9h 13m", status: "Present" },
  { date: "2026-07-31", day: "Thursday", clockIn: "08:55", clockOut: "18:30", totalHours: "9h 35m", status: "Present" },
  { date: "2026-07-30", day: "Wednesday", clockIn: "09:10", clockOut: "18:00", totalHours: "8h 50m", status: "WFH" },
  { date: "2026-07-29", day: "Tuesday", clockIn: "09:00", clockOut: "13:00", totalHours: "4h 00m", status: "Half Day" },
  { date: "2026-07-28", day: "Monday", clockIn: "08:45", clockOut: "18:20", totalHours: "9h 35m", status: "Present" },
  { date: "2026-07-27", day: "Sunday", clockIn: "—", clockOut: "—", totalHours: "—", status: "Weekend" },
  { date: "2026-07-26", day: "Saturday", clockIn: "—", clockOut: "—", totalHours: "—", status: "Weekend" },
  { date: "2026-07-25", day: "Friday", clockIn: "09:05", clockOut: "18:10", totalHours: "9h 05m", status: "Present" },
  { date: "2026-07-24", day: "Thursday", clockIn: "—", clockOut: "—", totalHours: "—", status: "Absent" },
  { date: "2026-07-23", day: "Wednesday", clockIn: "08:50", clockOut: "18:00", totalHours: "9h 10m", status: "Present" },
];

export const ATTENDANCE_SUMMARY = {
  thisMonth: { present: 18, absent: 1, wfh: 2, halfDay: 1, totalHours: "164h 20m" },
  avgClockIn: "09:02 AM",
  avgClockOut: "06:12 PM",
  onTimeRate: "94%",
};

// ── Leave Mock Data ───────────────────────────────────────────────
export interface LeaveBalance {
  type: string;
  total: number;
  used: number;
  remaining: number;
  color: string;
}

export const MOCK_LEAVE_BALANCES: LeaveBalance[] = [
  { type: "Casual Leave", total: 12, used: 4, remaining: 8, color: "text-sky-500" },
  { type: "Sick Leave", total: 10, used: 2, remaining: 8, color: "text-rose-500" },
  { type: "Earned Leave", total: 15, used: 5, remaining: 10, color: "text-emerald-500" },
  { type: "Comp Off", total: 3, used: 1, remaining: 2, color: "text-amber-500" },
];

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

export const MOCK_LEAVE_HISTORY: LeaveRequest[] = [
  { id: "LV-001", type: "Casual Leave", from: "2026-07-14", to: "2026-07-15", days: 2, reason: "Family function", status: "Approved", appliedOn: "2026-07-10", approver: "Sanya Kapoor" },
  { id: "LV-002", type: "Sick Leave", from: "2026-06-20", to: "2026-06-21", days: 2, reason: "Fever & cold", status: "Approved", appliedOn: "2026-06-20", approver: "Sanya Kapoor" },
  { id: "LV-003", type: "Earned Leave", from: "2026-05-01", to: "2026-05-05", days: 5, reason: "Annual vacation", status: "Approved", appliedOn: "2026-04-15", approver: "Aarav Mehta" },
  { id: "LV-004", type: "Casual Leave", from: "2026-08-10", to: "2026-08-11", days: 2, reason: "Personal work", status: "Pending", appliedOn: "2026-08-01", approver: "Sanya Kapoor" },
];

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

export const MOCK_PAYSLIPS: PayslipRecord[] = [
  {
    id: "PS-2026-07",
    month: "July",
    year: "2026",
    basicPay: 45000,
    hra: 18000,
    conveyance: 3000,
    specialAllowance: 12000,
    grossEarnings: 78000,
    pf: 5400,
    professionalTax: 200,
    incomeTax: 8500,
    totalDeductions: 14100,
    netPay: 63900,
    paidOn: "2026-07-30",
    status: "Paid",
  },
  {
    id: "PS-2026-06",
    month: "June",
    year: "2026",
    basicPay: 45000,
    hra: 18000,
    conveyance: 3000,
    specialAllowance: 12000,
    grossEarnings: 78000,
    pf: 5400,
    professionalTax: 200,
    incomeTax: 8500,
    totalDeductions: 14100,
    netPay: 63900,
    paidOn: "2026-06-30",
    status: "Paid",
  },
  {
    id: "PS-2026-05",
    month: "May",
    year: "2026",
    basicPay: 45000,
    hra: 18000,
    conveyance: 3000,
    specialAllowance: 12000,
    grossEarnings: 78000,
    pf: 5400,
    professionalTax: 200,
    incomeTax: 8500,
    totalDeductions: 14100,
    netPay: 63900,
    paidOn: "2026-05-30",
    status: "Paid",
  },
];

// ── Documents Mock Data ───────────────────────────────────────────
export interface EmployeeDocument {
  id: string;
  title: string;
  category: string;
  uploadedOn: string;
  fileSize: string;
  status: "Verified" | "Pending Review" | "Uploaded";
}

export const MOCK_EMPLOYEE_DOCUMENTS: EmployeeDocument[] = [
  { id: "DOC-001", title: "Offer Letter", category: "Employment", uploadedOn: "2025-01-15", fileSize: "245 KB", status: "Verified" },
  { id: "DOC-002", title: "Employee ID Card", category: "Identity", uploadedOn: "2025-01-20", fileSize: "120 KB", status: "Verified" },
  { id: "DOC-003", title: "PAN Card Copy", category: "Tax", uploadedOn: "2025-02-05", fileSize: "180 KB", status: "Verified" },
  { id: "DOC-004", title: "Aadhaar Card", category: "Identity", uploadedOn: "2025-02-05", fileSize: "210 KB", status: "Verified" },
  { id: "DOC-005", title: "NDA Agreement", category: "Legal", uploadedOn: "2025-01-15", fileSize: "340 KB", status: "Verified" },
  { id: "DOC-006", title: "Bank Statement (Jul 2026)", category: "Financial", uploadedOn: "2026-08-01", fileSize: "95 KB", status: "Pending Review" },
];

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

export const MOCK_HELPDESK_TICKETS: HelpdeskTicket[] = [
  {
    id: "TKT-4501",
    subject: "VPN access not working from home",
    category: "IT Support",
    priority: "High",
    status: "In Progress",
    createdAt: "2026-07-29",
    updatedAt: "2026-07-30",
    assignedTo: "Priya Nair",
    description: "Unable to connect to corporate VPN since yesterday. Getting error: connection timed out.",
  },
  {
    id: "TKT-4489",
    subject: "Request for ergonomic chair",
    category: "Facilities",
    priority: "Low",
    status: "Open",
    createdAt: "2026-07-25",
    updatedAt: "2026-07-25",
    assignedTo: "Admin Desk",
    description: "Need an ergonomic chair due to back pain. Doctor's note attached.",
  },
  {
    id: "TKT-4450",
    subject: "Payslip discrepancy for June",
    category: "Payroll",
    priority: "Medium",
    status: "Resolved",
    createdAt: "2026-07-05",
    updatedAt: "2026-07-08",
    assignedTo: "Aarav Mehta",
    description: "Overtime hours for June were not reflected in the payslip.",
  },
];

// ── Announcements Mock Data ───────────────────────────────────────
export interface Announcement {
  id: string;
  title: string;
  body: string;
  date: string;
  author: string;
  priority: "normal" | "important";
}

export const MOCK_ANNOUNCEMENTS: Announcement[] = [
  { id: "ANN-01", title: "Independence Day Holiday", body: "The office will remain closed on August 15, 2026 for Independence Day celebrations.", date: "2026-08-01", author: "HR Department", priority: "important" },
  { id: "ANN-02", title: "New Health Insurance Policy", body: "We've upgraded to a premium health insurance plan. Updated benefits guide available on the intranet.", date: "2026-07-28", author: "People Operations", priority: "normal" },
  { id: "ANN-03", title: "Quarterly Town Hall — Aug 8", body: "Join the Q3 Town Hall on August 8 at 3:00 PM IST. CEO Vikram Sethi will present the business update.", date: "2026-07-25", author: "Executive Office", priority: "normal" },
];

// ── Upcoming Holidays ─────────────────────────────────────────────
export interface Holiday {
  date: string;
  name: string;
  day: string;
  type: "Public" | "Restricted" | "Company";
}

export const MOCK_HOLIDAYS: Holiday[] = [
  { date: "2026-08-15", name: "Independence Day", day: "Saturday", type: "Public" },
  { date: "2026-08-19", name: "Muharram", day: "Wednesday", type: "Public" },
  { date: "2026-09-02", name: "Ganesh Chaturthi", day: "Wednesday", type: "Public" },
  { date: "2026-10-02", name: "Gandhi Jayanti", day: "Friday", type: "Public" },
  { date: "2026-10-20", name: "Dussehra", day: "Tuesday", type: "Public" },
  { date: "2026-11-10", name: "Diwali", day: "Tuesday", type: "Public" },
];
