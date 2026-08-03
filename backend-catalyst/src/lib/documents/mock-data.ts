export interface DocumentRecord {
  id: string;
  docId: string;
  title: string;
  category: "Employee Document" | "Offer Letter" | "Employment Contract" | "Policy" | "Certificate" | "Template";
  ownerName: string;
  fileSize: string;
  fileFormat: "PDF" | "DOCX" | "PNG" | "ZIP";
  uploadDate: string;
  expiryDate?: string;
  eSignatureStatus: "E-Signed" | "Pending Sign" | "Not Required";
  status: "Verified" | "Pending Review" | "Archived";
}

export const MOCK_DOCUMENTS: DocumentRecord[] = [
  {
    id: "doc-1",
    docId: "DOC-9901",
    title: "Senior AI Engineer Offer Letter - Aarav Sharma",
    category: "Offer Letter",
    ownerName: "Aarav Sharma",
    fileSize: "1.4 MB",
    fileFormat: "PDF",
    uploadDate: "2026-07-28",
    eSignatureStatus: "E-Signed",
    status: "Verified",
  },
  {
    id: "doc-2",
    docId: "DOC-9902",
    title: "Master Employment Agreement & NDA - Priya Patel",
    category: "Employment Contract",
    ownerName: "Priya Patel",
    fileSize: "2.8 MB",
    fileFormat: "PDF",
    uploadDate: "2026-07-20",
    eSignatureStatus: "E-Signed",
    status: "Verified",
  },
  {
    id: "doc-3",
    docId: "DOC-9903",
    title: "Government Passport & Tax Verification Copy",
    category: "Employee Document",
    ownerName: "Karan Verma",
    fileSize: "4.2 MB",
    fileFormat: "PDF",
    uploadDate: "2026-08-01",
    eSignatureStatus: "Not Required",
    status: "Verified",
  },
  {
    id: "doc-4",
    docId: "DOC-9904",
    title: "OFC HR Employee Handbook 2026 Edition",
    category: "Policy",
    ownerName: "HR Operations",
    fileSize: "5.6 MB",
    fileFormat: "PDF",
    uploadDate: "2026-07-01",
    eSignatureStatus: "Not Required",
    status: "Verified",
  },
  {
    id: "doc-5",
    docId: "DOC-9905",
    title: "Standard Salary Verification & NOC Letter Template",
    category: "Template",
    ownerName: "Admin Operations",
    fileSize: "680 KB",
    fileFormat: "DOCX",
    uploadDate: "2026-06-15",
    eSignatureStatus: "Not Required",
    status: "Verified",
  },
];
