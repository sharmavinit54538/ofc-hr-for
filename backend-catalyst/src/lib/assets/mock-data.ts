export type AssetCategory =
  | "Laptop"
  | "Desktop"
  | "Monitor"
  | "Mobile Phone"
  | "Tablet"
  | "Printer"
  | "Biometric Device"
  | "ID Card"
  | "Access Card"
  | "Headset"
  | "Keyboard"
  | "Mouse"
  | "Office Furniture"
  | "Other";

export type AssetStatus =
  | "Available"
  | "Assigned"
  | "Maintenance"
  | "Lost"
  | "Retired";

export interface AssetRecord {
  id: string;
  assetId: string;
  name: string;
  category: AssetCategory;
  assignedTo: string;
  assignedEmail?: string;
  employeeId?: string;
  department: string;
  status: AssetStatus;
  purchaseDate: string;
  warranty: string;
  serialNumber: string;
  purchaseCost: number;
  currentValue: number;
  location: string;
  vendor: string;
  notes?: string;
}

export interface AssetCategoryInfo {
  name: AssetCategory;
  totalCount: number;
  assignedCount: number;
  availableCount: number;
  depreciationYears: number;
  iconName: string;
  description: string;
}

export interface AssetRequestRecord {
  id: string;
  requestId: string;
  employeeName: string;
  employeeId: string;
  department: string;
  requestedCategory: AssetCategory;
  itemName: string;
  reason: string;
  priority: "High" | "Medium" | "Low";
  requestDate: string;
  status: "Pending Manager" | "IT Approved" | "Dispatched" | "Rejected";
}

export interface AssetMaintenanceRecord {
  id: string;
  ticketId: string;
  assetId: string;
  assetName: string;
  category: AssetCategory;
  assignedTo: string;
  issueDescription: string;
  maintenanceType: "Scheduled Servicing" | "Screen Repair" | "Battery Replacement" | "Hardware Failure" | "Warranty Replacement";
  vendor: string;
  reportedDate: string;
  estCompletion: string;
  cost: number;
  status: "In Diagnostics" | "Repairing" | "Awaiting Parts" | "Completed";
}

export interface VendorRecord {
  id: string;
  name: string;
  categoryProvided: string;
  rating: number;
  activeWarranties: number;
  contactPerson: string;
  phone: string;
  email: string;
  status: "Active" | "Under Review" | "Expired";
  contractEndDate: string;
}

export interface AuditRecord {
  id: string;
  assetId: string;
  assetName: string;
  serialNumber: string;
  barcode: string;
  location: string;
  assignedTo: string;
  lastScannedDate: string;
  scanStatus: "Verified" | "Location Mismatch" | "Unverified" | "Flagged";
  auditorName: string;
}

export const MOCK_ASSETS: AssetRecord[] = [
  {
    id: "ast-001",
    assetId: "AST-8841",
    name: 'MacBook Pro 16" M3 Max (64GB, 1TB)',
    category: "Laptop",
    assignedTo: "Aarav Sharma",
    assignedEmail: "aarav.sharma@northwind.com",
    employeeId: "NW-1042",
    department: "Product Engineering",
    status: "Assigned",
    purchaseDate: "2024-03-15",
    warranty: "Active (Exp: 2027-03-15)",
    serialNumber: "C02G4109MD6R",
    purchaseCost: 3499,
    currentValue: 2890,
    location: "Bengaluru HQ - Floor 4",
    vendor: "Apple Enterprise Direct",
  },
  {
    id: "ast-002",
    assetId: "AST-8842",
    name: 'Dell UltraSharp 27" 4K USB-C Monitor (U2723QE)',
    category: "Monitor",
    assignedTo: "Priya Patel",
    assignedEmail: "priya.patel@northwind.com",
    employeeId: "NW-1088",
    department: "Human Resources",
    status: "Assigned",
    purchaseDate: "2023-11-10",
    warranty: "Active (Exp: 2026-11-10)",
    serialNumber: "CN-09K821-74411",
    purchaseCost: 620,
    currentValue: 450,
    location: "Mumbai Campus - Tech Park",
    vendor: "Dell Business Solutions",
  },
  {
    id: "ast-003",
    assetId: "AST-8843",
    name: "ThinkPad P1 Gen 6 Workstation",
    category: "Laptop",
    assignedTo: "Unassigned",
    department: "Information Technology",
    status: "Available",
    purchaseDate: "2024-05-20",
    warranty: "Active (Exp: 2027-05-20)",
    serialNumber: "PF-3X9211",
    purchaseCost: 2850,
    currentValue: 2600,
    location: "IT Storage Hub - Locker B4",
    vendor: "Lenovo Corporate",
  },
  {
    id: "ast-004",
    assetId: "AST-8844",
    name: "iPhone 15 Pro 256GB Titanium",
    category: "Mobile Phone",
    assignedTo: "Vikram Malhotra",
    assignedEmail: "vikram.m@northwind.com",
    employeeId: "NW-1001",
    department: "Executive Office",
    status: "Assigned",
    purchaseDate: "2023-10-01",
    warranty: "Active (Exp: 2025-10-01)",
    serialNumber: "F17H9100NQK1",
    purchaseCost: 1199,
    currentValue: 850,
    location: "Bengaluru HQ - Executive Floor",
    vendor: "Apple Enterprise Direct",
  },
  {
    id: "ast-005",
    assetId: "AST-8845",
    name: 'iPad Pro 12.9" M2 Wi-Fi + 5G',
    category: "Tablet",
    assignedTo: "Ananya Deshmukh",
    assignedEmail: "ananya.d@northwind.com",
    employeeId: "NW-1102",
    department: "Product Engineering",
    status: "Maintenance",
    purchaseDate: "2023-08-14",
    warranty: "Claim Pending (Exp: 2025-08-14)",
    serialNumber: "DMPX81992L01",
    purchaseCost: 1299,
    currentValue: 890,
    location: "Apple Authorized Care",
    vendor: "Apple Enterprise Direct",
  },
  {
    id: "ast-006",
    assetId: "AST-8846",
    name: "HP Color LaserJet Pro MFP 4301fdw",
    category: "Printer",
    assignedTo: "Facilities Desk",
    department: "Operations",
    status: "Assigned",
    purchaseDate: "2022-06-18",
    warranty: "Expired (2024-06-18)",
    serialNumber: "VN-3891048",
    purchaseCost: 850,
    currentValue: 320,
    location: "Hyderabad Office - Floor 2 Print Hub",
    vendor: "HP Corporate Direct",
  },
  {
    id: "ast-007",
    assetId: "AST-8847",
    name: "Matrix COSEC ARGO Face Recognition Terminal",
    category: "Biometric Device",
    assignedTo: "Main Entrance Gate",
    department: "Security & Facilities",
    status: "Assigned",
    purchaseDate: "2024-01-10",
    warranty: "Active (Exp: 2027-01-10)",
    serialNumber: "MX-BIO-99120",
    purchaseCost: 1450,
    currentValue: 1300,
    location: "Bengaluru HQ - Main Lobby",
    vendor: "Matrix Telecom & Security",
  },
  {
    id: "ast-008",
    assetId: "AST-8848",
    name: "Encrypted Employee Smart ID Card #8820",
    category: "ID Card",
    assignedTo: "Karan Verma",
    assignedEmail: "karan.v@northwind.com",
    employeeId: "NW-1145",
    department: "Finance Operations",
    status: "Assigned",
    purchaseDate: "2024-02-01",
    warranty: "N/A",
    serialNumber: "RFID-8820-ID",
    purchaseCost: 25,
    currentValue: 25,
    location: "Bengaluru HQ",
    vendor: "HID Global Corp",
  },
  {
    id: "ast-009",
    assetId: "AST-8849",
    name: "HID iCLASS SE Keycard Access Token #9104",
    category: "Access Card",
    assignedTo: "Unassigned",
    department: "Security & Facilities",
    status: "Lost",
    purchaseDate: "2024-01-15",
    warranty: "N/A",
    serialNumber: "ACC-9104-LOST",
    purchaseCost: 15,
    currentValue: 0,
    location: "Reported Lost in Transit",
    vendor: "HID Global Corp",
  },
  {
    id: "ast-010",
    assetId: "AST-8850",
    name: "Jabra Evolve2 85 Wireless ANC Headset",
    category: "Headset",
    assignedTo: "Rohan Kapoor",
    assignedEmail: "rohan.k@northwind.com",
    employeeId: "NW-1180",
    department: "Customer Success",
    status: "Assigned",
    purchaseDate: "2023-12-05",
    warranty: "Active (Exp: 2025-12-05)",
    serialNumber: "JB-889104-ANC",
    purchaseCost: 450,
    currentValue: 310,
    location: "Gurugram Office - Bay 3",
    vendor: "Logitech & Jabra Hub",
  },
  {
    id: "ast-011",
    assetId: "AST-8851",
    name: "Logitech MX Keys S Wireless Keyboard",
    category: "Keyboard",
    assignedTo: "Sneha Nair",
    assignedEmail: "sneha.n@northwind.com",
    employeeId: "NW-1204",
    department: "Product Engineering",
    status: "Assigned",
    purchaseDate: "2024-04-10",
    warranty: "Active (Exp: 2026-04-10)",
    serialNumber: "LOGI-MX-7740",
    purchaseCost: 120,
    currentValue: 105,
    location: "Bengaluru HQ - Floor 3",
    vendor: "Logitech & Jabra Hub",
  },
  {
    id: "ast-012",
    assetId: "AST-8852",
    name: "Logitech MX Master 3S Ergonomic Mouse",
    category: "Mouse",
    assignedTo: "Sneha Nair",
    assignedEmail: "sneha.n@northwind.com",
    employeeId: "NW-1204",
    department: "Product Engineering",
    status: "Assigned",
    purchaseDate: "2024-04-10",
    warranty: "Active (Exp: 2026-04-10)",
    serialNumber: "LOGI-3S-9912",
    purchaseCost: 99,
    currentValue: 85,
    location: "Bengaluru HQ - Floor 3",
    vendor: "Logitech & Jabra Hub",
  },
  {
    id: "ast-013",
    assetId: "AST-8853",
    name: "Herman Miller Aeron Ergonomic Task Chair",
    category: "Office Furniture",
    assignedTo: "Kavita Rao",
    assignedEmail: "kavita.r@northwind.com",
    employeeId: "NW-1015",
    department: "Executive Office",
    status: "Assigned",
    purchaseDate: "2021-09-01",
    warranty: "Active (Exp: 2033-09-01)",
    serialNumber: "HM-AERON-49102",
    purchaseCost: 1450,
    currentValue: 1100,
    location: "Bengaluru HQ - Exec Suite 2",
    vendor: "Herman Miller India",
  },
  {
    id: "ast-014",
    assetId: "AST-8854",
    name: "APC Smart-UPS RT 5000VA Server Backup",
    category: "Other",
    assignedTo: "Data Center Techs",
    department: "Information Technology",
    status: "Retired",
    purchaseDate: "2018-04-12",
    warranty: "Expired",
    serialNumber: "APC-UPS-5000-RET",
    purchaseCost: 3200,
    currentValue: 150,
    location: "Decommissioned - E-waste Storage",
    vendor: "Schneider Electric",
  },
  {
    id: "ast-015",
    assetId: "AST-8855",
    name: 'Dell XPS 15 9530 (i9, 32GB, RTX 4060)',
    category: "Laptop",
    assignedTo: "Unassigned",
    department: "Product Engineering",
    status: "Available",
    purchaseDate: "2024-06-01",
    warranty: "Active (Exp: 2027-06-01)",
    serialNumber: "DL-XPS15-99201",
    purchaseCost: 2699,
    currentValue: 2550,
    location: "IT Storage Hub - Locker A1",
    vendor: "Dell Business Solutions",
  },
];

export const MOCK_CATEGORIES: AssetCategoryInfo[] = [
  { name: "Laptop", totalCount: 640, assignedCount: 520, availableCount: 112, depreciationYears: 3, iconName: "Laptop", description: "Portable high-performance laptops for engineering, design & executive staff" },
  { name: "Desktop", totalCount: 120, assignedCount: 98, availableCount: 20, depreciationYears: 4, iconName: "Monitor", description: "Fixed workstation rigs, Mac Studio units & high-performance desktops" },
  { name: "Monitor", totalCount: 480, assignedCount: 410, availableCount: 65, depreciationYears: 4, iconName: "Tv", description: "4K, UltraSharp & dual monitor desktop displays" },
  { name: "Mobile Phone", totalCount: 85, assignedCount: 78, availableCount: 5, depreciationYears: 2, iconName: "Smartphone", description: "Corporate smartphones issued to leadership & sales personnel" },
  { name: "Tablet", totalCount: 42, assignedCount: 35, availableCount: 5, depreciationYears: 3, iconName: "Tablet", description: "iPads & Android tablets for testing, field work & executive use" },
  { name: "Printer", totalCount: 24, assignedCount: 22, availableCount: 2, depreciationYears: 5, iconName: "Printer", description: "Multifunction network laser printers & office print stations" },
  { name: "Biometric Device", totalCount: 18, assignedCount: 18, availableCount: 0, depreciationYears: 5, iconName: "Fingerprint", description: "Face recognition & fingerprint biometric gate access hardware" },
  { name: "ID Card", totalCount: 1248, assignedCount: 1210, availableCount: 38, depreciationYears: 1, iconName: "CreditCard", description: "Encrypted RFID smart cards for workforce identity" },
  { name: "Access Card", totalCount: 1500, assignedCount: 1248, availableCount: 240, depreciationYears: 1, iconName: "Key", description: "Physical building & turnstile security clearance tokens" },
  { name: "Headset", totalCount: 450, assignedCount: 390, availableCount: 55, depreciationYears: 2, iconName: "Headphones", description: "Noise-cancelling headsets for call center & remote staff" },
  { name: "Keyboard", totalCount: 520, assignedCount: 440, availableCount: 75, depreciationYears: 3, iconName: "Keyboard", description: "Wireless mechanical & ergonomic keyboards" },
  { name: "Mouse", totalCount: 540, assignedCount: 455, availableCount: 80, depreciationYears: 3, iconName: "Mouse", description: "Precision mice & trackpads" },
  { name: "Office Furniture", totalCount: 820, assignedCount: 790, availableCount: 25, depreciationYears: 7, iconName: "Armchair", description: "Ergonomic chairs, motorized standing desks & conference tables" },
  { name: "Other", totalCount: 95, assignedCount: 75, availableCount: 15, depreciationYears: 4, iconName: "Box", description: "UPS units, server racks, AV equipment & miscellaneous hardware" },
];

export const MOCK_REQUESTS: AssetRequestRecord[] = [
  {
    id: "req-101",
    requestId: "REQ-9901",
    employeeName: "Aditya Sharma",
    employeeId: "NW-1250",
    department: "Product Engineering",
    requestedCategory: "Laptop",
    itemName: 'MacBook Pro 16" M3 Max 64GB',
    reason: "New Senior AI Engineer Joining - High compute requirements",
    priority: "High",
    requestDate: "2026-08-01",
    status: "IT Approved",
  },
  {
    id: "req-102",
    requestId: "REQ-9902",
    employeeName: "Meera Krishnan",
    employeeId: "NW-1192",
    department: "Marketing & Growth",
    requestedCategory: "Monitor",
    itemName: 'Dell UltraSharp 27" 4K Monitor',
    reason: "Dual-monitor setup for graphic asset rendering & video editing",
    priority: "Medium",
    requestDate: "2026-07-30",
    status: "Pending Manager",
  },
  {
    id: "req-103",
    requestId: "REQ-9903",
    employeeName: "Rahul Sundaram",
    employeeId: "NW-1140",
    department: "Information Technology",
    requestedCategory: "Headset",
    itemName: "Jabra Evolve2 85 ANC Headset",
    reason: "Replacement for damaged headphone mic during customer calls",
    priority: "Low",
    requestDate: "2026-07-28",
    status: "Dispatched",
  },
  {
    id: "req-104",
    requestId: "REQ-9904",
    employeeName: "Tanvi Saxena",
    employeeId: "NW-1290",
    department: "Finance Operations",
    requestedCategory: "Mobile Phone",
    itemName: "iPhone 15 128GB Corporate Line",
    reason: "Required for 2FA financial authorization & mobile banking approvals",
    priority: "High",
    requestDate: "2026-08-02",
    status: "Pending Manager",
  },
];

export const MOCK_MAINTENANCE: AssetMaintenanceRecord[] = [
  {
    id: "maint-201",
    ticketId: "MNT-4401",
    assetId: "AST-8845",
    assetName: 'iPad Pro 12.9" M2',
    category: "Tablet",
    assignedTo: "Ananya Deshmukh",
    issueDescription: "Screen touch responsiveness glitch following OS update",
    maintenanceType: "Warranty Replacement",
    vendor: "Apple Enterprise Direct",
    reportedDate: "2026-07-25",
    estCompletion: "2026-08-05",
    cost: 0,
    status: "Repairing",
  },
  {
    id: "maint-202",
    ticketId: "MNT-4402",
    assetId: "AST-8830",
    assetName: 'Dell XPS 15 9520',
    category: "Laptop",
    assignedTo: "Sanjay Gupta",
    issueDescription: "Battery drain fast & thermal throttling during builds",
    maintenanceType: "Battery Replacement",
    vendor: "Dell Business Solutions",
    reportedDate: "2026-07-29",
    estCompletion: "2026-08-04",
    cost: 140,
    status: "Awaiting Parts",
  },
  {
    id: "maint-203",
    ticketId: "MNT-4403",
    assetId: "AST-8812",
    assetName: "HP Color LaserJet MFP 4301",
    category: "Printer",
    assignedTo: "Facilities Desk",
    issueDescription: "Paper jam error on Tray 2 and toner roller alignment",
    maintenanceType: "Scheduled Servicing",
    vendor: "HP Corporate Direct",
    reportedDate: "2026-08-01",
    estCompletion: "2026-08-03",
    cost: 85,
    status: "In Diagnostics",
  },
];

export const MOCK_VENDORS: VendorRecord[] = [
  {
    id: "vnd-01",
    name: "Apple Enterprise Direct",
    categoryProvided: "Laptops, Tablets, iPhones & Accessories",
    rating: 4.9,
    activeWarranties: 420,
    contactPerson: "Rajesh Kumar (Enterprise Lead)",
    phone: "+91 80 4000 8800",
    email: "enterprise-in@apple.com",
    status: "Active",
    contractEndDate: "2027-12-31",
  },
  {
    id: "vnd-02",
    name: "Dell Business Solutions",
    categoryProvided: "Monitors, XPS/Latitude Laptops & Servers",
    rating: 4.7,
    activeWarranties: 380,
    contactPerson: "Sarah Jenkins",
    phone: "+91 80 2200 1122",
    email: "sarah.j@dell.com",
    status: "Active",
    contractEndDate: "2026-11-30",
  },
  {
    id: "vnd-03",
    name: "Logitech & Jabra Hub",
    categoryProvided: "Keyboards, Mice, Webcams & Enterprise Headsets",
    rating: 4.8,
    activeWarranties: 210,
    contactPerson: "Manish Verma",
    phone: "+91 124 4900 300",
    email: "manish@logitechhub.in",
    status: "Active",
    contractEndDate: "2027-06-30",
  },
  {
    id: "vnd-04",
    name: "Herman Miller India",
    categoryProvided: "Ergonomic Office Chairs & Standing Desks",
    rating: 4.9,
    activeWarranties: 540,
    contactPerson: "Deepak Mehta",
    phone: "+91 22 6100 4400",
    email: "deepak.m@hermanmiller.com",
    status: "Active",
    contractEndDate: "2030-01-01",
  },
];

export const MOCK_AUDITS: AuditRecord[] = [
  {
    id: "aud-01",
    assetId: "AST-8841",
    assetName: 'MacBook Pro 16" M3 Max',
    serialNumber: "C02G4109MD6R",
    barcode: "BAR-8841-MAC",
    location: "Bengaluru HQ - Floor 4",
    assignedTo: "Aarav Sharma",
    lastScannedDate: "2026-08-01",
    scanStatus: "Verified",
    auditorName: "IT Audit Bot / Priya N.",
  },
  {
    id: "aud-02",
    assetId: "AST-8842",
    assetName: 'Dell UltraSharp 27" 4K Monitor',
    serialNumber: "CN-09K821-74411",
    barcode: "BAR-8842-MON",
    location: "Mumbai Campus - Tech Park",
    assignedTo: "Priya Patel",
    lastScannedDate: "2026-07-28",
    scanStatus: "Verified",
    auditorName: "Rohan V. (Facilities)",
  },
  {
    id: "aud-03",
    assetId: "AST-8845",
    assetName: 'iPad Pro 12.9" M2',
    serialNumber: "DMPX81992L01",
    barcode: "BAR-8845-PAD",
    location: "Apple Authorized Care",
    assignedTo: "Ananya Deshmukh",
    lastScannedDate: "2026-07-25",
    scanStatus: "Location Mismatch",
    auditorName: "System Flag (In Repair)",
  },
  {
    id: "aud-04",
    assetId: "AST-8849",
    assetName: "HID Keycard Access Token #9104",
    serialNumber: "ACC-9104-LOST",
    barcode: "BAR-9104-ACC",
    location: "Unknown",
    assignedTo: "Unassigned",
    lastScannedDate: "2026-06-15",
    scanStatus: "Flagged",
    auditorName: "Security Audit",
  },
];
