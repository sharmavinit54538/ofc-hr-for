export interface VendorRecord {
  id: string;
  vendorId: string;
  name: string;
  category: "IT Hardware" | "Cloud Infrastructure" | "HR Software" | "Facility & Office" | "Legal & Consulting";
  contactPerson: string;
  email: string;
  phone: string;
  contractStatus: "Active" | "Renewal Pending" | "Expired";
  contractValue: string;
  slaRating: number;
  openInvoices: number;
  totalPaidYtd: string;
}

export const MOCK_VENDORS: VendorRecord[] = [
  {
    id: "vnd-1",
    vendorId: "VND-4401",
    name: "Apple India Private Limited",
    category: "IT Hardware",
    contactPerson: "Rajesh Kumar (Enterprise Rep)",
    email: "enterprise@apple.com",
    phone: "+91 80 4000 1000",
    contractStatus: "Active",
    contractValue: "$450,000 / Yr",
    slaRating: 4.9,
    openInvoices: 2,
    totalPaidYtd: "$320,000",
  },
  {
    id: "vnd-2",
    vendorId: "VND-4402",
    name: "Amazon Web Services (AWS APAC)",
    category: "Cloud Infrastructure",
    contactPerson: "Cloud Accounts Team",
    email: "billing@aws.amazon.com",
    phone: "+1 800 289 9669",
    contractStatus: "Active",
    contractValue: "$280,000 / Yr",
    slaRating: 5.0,
    openInvoices: 1,
    totalPaidYtd: "$165,000",
  },
  {
    id: "vnd-3",
    vendorId: "VND-4403",
    name: "Fortis Healthcare Facilities",
    category: "Facility & Office",
    contactPerson: "Dr. Sunita Rao",
    email: "corporate@fortishealth.com",
    phone: "+91 22 6000 8888",
    contractStatus: "Active",
    contractValue: "$85,000 / Yr",
    slaRating: 4.7,
    openInvoices: 0,
    totalPaidYtd: "$60,000",
  },
];
