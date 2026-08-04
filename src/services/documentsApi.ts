import type { ApiResponse } from "@/types/api";
import { baseApi } from "@/services/api";

/* ── Types ─────────────────────────────────────────────── */

export interface DocumentRecord {
  id: string;
  docId: string;
  title: string;
  category: string;
  ownerName: string;
  fileSize: string;
  fileFormat: string;
  uploadDate: string;
  expiryDate?: string;
  eSignatureStatus: string;
  status: string;
  fileUrl?: string;
  version?: number;
}

export interface DocumentSummary {
  total_documents: number;
  offer_letters: number;
  active_contracts: number;
  policy_handbooks: number;
  certificates_issued: number;
  digital_signature_rate: string;
}

export interface ESignatureRecord {
  id: string;
  document: string;
  signer: string;
  timestamp: string;
  hash: string;
  status: string;
}

export interface DocumentTemplate {
  id: string;
  title: string;
  format: string;
  size: string;
}

/* ── RTK Query Endpoints ───────────────────────────────── */

export const documentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDocuments: builder.query<
      ApiResponse<DocumentRecord[]>,
      { category?: string; status?: string; q?: string; page?: number; page_size?: number }
    >({
      query: (params = {}) => {
        const sp = new URLSearchParams();
        if (params.category) sp.append("category", params.category);
        if (params.status) sp.append("status", params.status);
        if (params.q) sp.append("q", params.q);
        if (params.page) sp.append("page", params.page.toString());
        if (params.page_size) sp.append("page_size", params.page_size.toString());
        const qs = sp.toString();
        return `/api/v1/documents${qs ? `?${qs}` : ""}`;
      },
      providesTags: ["Document"],
    }),

    getDocumentSummary: builder.query<ApiResponse<DocumentSummary>, void>({
      query: () => "/api/v1/documents/summary",
      providesTags: ["Document"],
    }),

    getESignatures: builder.query<ApiResponse<ESignatureRecord[]>, void>({
      query: () => "/api/v1/documents/e-signatures",
      providesTags: ["Document"],
    }),

    getDocumentTemplates: builder.query<ApiResponse<DocumentTemplate[]>, void>({
      query: () => "/api/v1/documents/templates",
      providesTags: ["Document"],
    }),

    uploadDocument: builder.mutation<
      ApiResponse<DocumentRecord>,
      FormData
    >({
      query: (formData) => ({
        url: "/api/v1/documents/upload",
        method: "POST",
        body: formData,
        formData: true,
      }),
      invalidatesTags: ["Document"],
    }),

    deleteDocument: builder.mutation<ApiResponse<object>, string>({
      query: (documentId) => ({
        url: `/api/v1/documents/${documentId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Document"],
    }),

    updateDocumentStatus: builder.mutation<
      ApiResponse<DocumentRecord>,
      { documentId: string; action: string }
    >({
      query: ({ documentId, action }) => ({
        url: `/api/v1/documents/${documentId}/status?action=${encodeURIComponent(action)}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Document"],
    }),
  }),
});

export const {
  useGetDocumentsQuery,
  useGetDocumentSummaryQuery,
  useGetESignaturesQuery,
  useGetDocumentTemplatesQuery,
  useUploadDocumentMutation,
  useDeleteDocumentMutation,
  useUpdateDocumentStatusMutation,
} = documentsApi;
