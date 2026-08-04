export interface VendorRecord {
  id: string;
  vendorId: string;
  name: string;
  category: string;
  contactPerson: string;
  email: string;
  phone: string;
  contractStatus: string;
  contractValue: string;
  slaRating: number;
  openInvoices: number;
  totalPaidYtd: string;
}

export const MOCK_VENDORS: VendorRecord[] = [];
