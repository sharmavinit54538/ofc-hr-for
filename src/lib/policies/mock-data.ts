export interface PolicyRecord {
  id: string;
  policyId: string;
  title: string;
  category: "HR" | "Payroll" | "Attendance" | "Leave" | "Security";
  version: string;
  effectiveDate: string;
  lastReviewed: string;
  author: string;
  acknowledgementPct: number;
  status: "Published" | "Under Review" | "Draft";
  summary: string;
}

export const MOCK_POLICIES: PolicyRecord[] = [
  {
    id: "pol-01",
    policyId: "POL-1001",
    title: "Global Hybrid Work & Remote Office Policy 2026",
    category: "HR",
    version: "v3.2",
    effectiveDate: "2026-01-01",
    lastReviewed: "2026-07-01",
    author: "Human Resources Ops",
    acknowledgementPct: 98.4,
    status: "Published",
    summary: "Guidelines for 3-day hybrid office attendance, hot-desking reservations, and home-office equipment allowances.",
  },
  {
    id: "pol-02",
    policyId: "POL-1002",
    title: "Statutory Payroll, Tax Deduction & Expense Policy",
    category: "Payroll",
    version: "v2.4",
    effectiveDate: "2026-04-01",
    lastReviewed: "2026-06-15",
    author: "Finance Operations",
    acknowledgementPct: 99.1,
    status: "Published",
    summary: "Monthly salary disbursement cycles, Form 12BB tax proof submission deadlines, and business travel reimbursements.",
  },
  {
    id: "pol-03",
    policyId: "POL-1003",
    title: "SOC 2 Type II Information Security & Data Protection Policy",
    category: "Security",
    version: "v4.0",
    effectiveDate: "2026-03-15",
    lastReviewed: "2026-07-20",
    author: "InfoSec & Compliance",
    acknowledgementPct: 100.0,
    status: "Published",
    summary: "Mandatory 2FA enforcement, password manager compliance, clean desk rules, and AI data privacy standards.",
  },
  {
    id: "pol-04",
    policyId: "POL-1004",
    title: "Comprehensive Annual & Parental Leave Policy",
    category: "Leave",
    version: "v2.1",
    effectiveDate: "2026-01-01",
    lastReviewed: "2026-05-10",
    author: "HR Benefits Desk",
    acknowledgementPct: 97.8,
    status: "Published",
    summary: "Accrual rules for earned, casual, sick, maternity (26 wks), and paternity (4 wks) leaves.",
  },
];
