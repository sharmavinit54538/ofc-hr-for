export interface HelpdeskTicket {
  id: string;
  ticketId: string;
  subject: string;
  category: "Payroll & Tax" | "IT & Hardware" | "Benefits & Insurance" | "Leave & Attendance" | "General Policy";
  requesterName: string;
  requesterEmail: string;
  assignedAgent: string;
  priority: "High" | "Medium" | "Low" | "Urgent";
  status: "Open" | "In Progress" | "Pending User" | "Resolved" | "Escalated";
  createdDate: string;
  slaDueDate: string;
  slaStatus: "On Track" | "Breached" | "Met";
  description: string;
}

export interface KnowledgeArticle {
  id: string;
  articleId: string;
  title: string;
  category: string;
  views: number;
  helpfulVotes: number;
  lastUpdated: string;
  author: string;
}

export const MOCK_TICKETS: HelpdeskTicket[] = [
  {
    id: "tkt-001",
    ticketId: "HD-8801",
    subject: "Form 16 Tax Deduction Computation Discrepancy",
    category: "Payroll & Tax",
    requesterName: "Aarav Sharma",
    requesterEmail: "aarav.s@northwind.com",
    assignedAgent: "Karan Verma (Finance Ops)",
    priority: "High",
    status: "In Progress",
    createdDate: "2026-08-01 10:15 AM",
    slaDueDate: "2026-08-03 10:15 AM",
    slaStatus: "On Track",
    description: "TDS deduction for HRA exemption in July payslip seems incorrect.",
  },
  {
    id: "tkt-002",
    ticketId: "HD-8802",
    subject: "MacBook Pro M3 USB-C Port Hardware Glitch",
    category: "IT & Hardware",
    requesterName: "Priya Patel",
    requesterEmail: "priya.p@northwind.com",
    assignedAgent: "Priya N. (IT Admin)",
    priority: "Medium",
    status: "Open",
    createdDate: "2026-08-02 08:30 AM",
    slaDueDate: "2026-08-04 08:30 AM",
    slaStatus: "On Track",
    description: "External monitor flicker when connected to left Thunderbolt port.",
  },
  {
    id: "tkt-003",
    ticketId: "HD-8803",
    subject: "Dependant Health Insurance Inclusion Request",
    category: "Benefits & Insurance",
    requesterName: "Vikram Malhotra",
    requesterEmail: "vikram.m@northwind.com",
    assignedAgent: "Benefits Desk",
    priority: "Low",
    status: "Resolved",
    createdDate: "2026-07-28 02:00 PM",
    slaDueDate: "2026-07-30 02:00 PM",
    slaStatus: "Met",
    description: "Adding newborn dependant to MediAssist corporate policy.",
  },
  {
    id: "tkt-004",
    ticketId: "HD-8804",
    subject: "Biometric Punch-In Missing Log Regularization",
    category: "Leave & Attendance",
    requesterName: "Rohan Kapoor",
    requesterEmail: "rohan.k@northwind.com",
    assignedAgent: "HR Operations",
    priority: "Urgent",
    status: "Escalated",
    createdDate: "2026-07-25 09:00 AM",
    slaDueDate: "2026-07-26 09:00 AM",
    slaStatus: "Breached",
    description: "System recorded punch-out missing due to gate terminal power failure.",
  },
];

export const MOCK_KNOWLEDGE_BASE: KnowledgeArticle[] = [
  {
    id: "kb-101",
    articleId: "KB-1001",
    title: "How to Submit Form 12BB Investment Proofs for Tax Exemption",
    category: "Payroll & Tax",
    views: 1420,
    helpfulVotes: 380,
    lastUpdated: "2026-07-15",
    author: "Finance Team",
  },
  {
    id: "kb-102",
    articleId: "KB-1002",
    title: "Corporate Health Insurance Policy & Claim Process Guide",
    category: "Benefits & Insurance",
    views: 980,
    helpfulVotes: 240,
    lastUpdated: "2026-06-20",
    author: "HR Benefits Desk",
  },
  {
    id: "kb-103",
    articleId: "KB-1003",
    title: "MacBook & Laptop Hardware Repair / Replacement Procedure",
    category: "IT & Hardware",
    views: 850,
    helpfulVotes: 190,
    lastUpdated: "2026-07-01",
    author: "IT Helpdesk",
  },
];
