import type { ApiResponse } from "@/types/api";
import { baseApi } from "@/services/api";

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

export interface CreateVendorInput {
  name: string;
  category: string;
  contactPerson: string;
  email: string;
  phone: string;
  contractValue: string;
}

export interface VendorContract {
  id: string;
  vendorName: string;
  title: string;
  startDate: string;
  endDate: string;
  status: string;
  annualValue: string;
}

export interface VendorInvoice {
  invoiceNumber: string;
  vendorName: string;
  amount: string;
  dueDate: string;
  status: string;
}

export interface VendorPerformance {
  vendorName: string;
  category: string;
  slaComplianceScore: number;
  uptimePercentage: number;
  status: string;
}

export interface VendorSummary {
  total_vendors: number;
  active_contracts: number;
  open_invoices_count: number;
  total_ytd_spend: string;
  avg_sla_score: number;
}

export const vendorApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listVendors: builder.query<ApiResponse<VendorRecord[]>, string | void>({
      query: (q) => ({
        url: "/api/v1/vendors",
        params: q ? { q } : {},
      }),
      providesTags: ["Vendor"],
    }),

    createVendor: builder.mutation<ApiResponse<VendorRecord>, CreateVendorInput>({
      query: (body) => ({
        url: "/api/v1/vendors",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Vendor"],
    }),

    getVendorSummary: builder.query<ApiResponse<VendorSummary>, void>({
      query: () => "/api/v1/vendors/summary",
      providesTags: ["Vendor"],
    }),

    getVendorContracts: builder.query<ApiResponse<VendorContract[]>, void>({
      query: () => "/api/v1/vendors/contracts",
      providesTags: ["Vendor"],
    }),

    getVendorInvoices: builder.query<ApiResponse<VendorInvoice[]>, void>({
      query: () => "/api/v1/vendors/invoices",
      providesTags: ["Vendor"],
    }),

    getVendorPerformance: builder.query<ApiResponse<VendorPerformance[]>, void>({
      query: () => "/api/v1/vendors/performance",
      providesTags: ["Vendor"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useListVendorsQuery,
  useCreateVendorMutation,
  useGetVendorSummaryQuery,
  useGetVendorContractsQuery,
  useGetVendorInvoicesQuery,
  useGetVendorPerformanceQuery,
} = vendorApi;
