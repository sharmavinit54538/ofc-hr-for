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

export const MOCK_TICKETS: HelpdeskTicket[] = [];

export const MOCK_KNOWLEDGE_BASE: KnowledgeArticle[] = [];
