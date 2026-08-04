import type { ApiResponse, ListParams, PaginatedData } from "@/types/api";
import { toQueryParams } from "@/types/api";
import { baseApi } from "@/services/api";
import type {
  AssetCategoryItem,
  AssetCategoryCreateInput,
  AssetCategoryUpdateInput,
  AssetVendorItem,
  AssetVendorCreateInput,
  AssetVendorUpdateInput,
  AssetItem,
  AssetCreateInput,
  AssetUpdateInput,
  AssetAssignInput,
  AssetReturnInput,
  AssetAssignmentItem,
  AssetMaintenanceItem,
  AssetMaintenanceCreateInput,
  AssetMaintenanceUpdateInput,
  AssetRequestItem,
  AssetRequestCreateInput,
  AssetRequestUpdateInput,
  AssetDashboardData,
} from "@/types/asset";

export const assetsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ── Dashboard ──────────────────────────────────────────────────
    getAssetDashboard: builder.query<ApiResponse<AssetDashboardData>, void>({
      query: () => "/api/v1/assets/dashboard",
      providesTags: [{ type: "Asset" as const, id: "DASHBOARD" }],
    }),

    // ── Categories ─────────────────────────────────────────────────
    listAssetCategories: builder.query<ApiResponse<AssetCategoryItem[]>, void>({
      query: () => "/api/v1/assets/categories",
      providesTags: [{ type: "AssetCategory" as const, id: "LIST" }],
    }),

    createAssetCategory: builder.mutation<ApiResponse<AssetCategoryItem>, AssetCategoryCreateInput>({
      query: (body) => ({
        url: "/api/v1/assets/categories",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "AssetCategory" as const, id: "LIST" }],
    }),

    updateAssetCategory: builder.mutation<ApiResponse<AssetCategoryItem>, { id: string; body: AssetCategoryUpdateInput }>({
      query: ({ id, body }) => ({
        url: `/api/v1/assets/categories/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: [{ type: "AssetCategory" as const, id: "LIST" }],
    }),

    deleteAssetCategory: builder.mutation<ApiResponse<{ id: string }>, string>({
      query: (id) => ({
        url: `/api/v1/assets/categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "AssetCategory" as const, id: "LIST" }],
    }),

    // ── Vendors ────────────────────────────────────────────────────
    listAssetVendors: builder.query<ApiResponse<AssetVendorItem[]>, void>({
      query: () => "/api/v1/assets/vendors",
      providesTags: [{ type: "Vendor" as const, id: "LIST" }],
    }),

    createAssetVendor: builder.mutation<ApiResponse<AssetVendorItem>, AssetVendorCreateInput>({
      query: (body) => ({
        url: "/api/v1/assets/vendors",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Vendor" as const, id: "LIST" }],
    }),

    updateAssetVendor: builder.mutation<ApiResponse<AssetVendorItem>, { id: string; body: AssetVendorUpdateInput }>({
      query: ({ id, body }) => ({
        url: `/api/v1/assets/vendors/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: [{ type: "Vendor" as const, id: "LIST" }],
    }),

    deleteAssetVendor: builder.mutation<ApiResponse<{ id: string }>, string>({
      query: (id) => ({
        url: `/api/v1/assets/vendors/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Vendor" as const, id: "LIST" }],
    }),

    // ── Asset Inventory ─────────────────────────────────────────────
    listAssets: builder.query<ApiResponse<PaginatedData<AssetItem>>, ListParams | void>({
      query: (params) => ({
        url: "/api/v1/assets/inventory",
        params: toQueryParams(params ?? {}),
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.items.map(({ id }) => ({ type: "Asset" as const, id: `ASSET_${id}` })),
              { type: "Asset" as const, id: "ASSETS_LIST" },
            ]
          : [{ type: "Asset" as const, id: "ASSETS_LIST" }],
    }),

    getAsset: builder.query<ApiResponse<AssetItem>, string>({
      query: (id) => `/api/v1/assets/inventory/${id}`,
      providesTags: (_res, _err, id) => [{ type: "Asset" as const, id: `ASSET_${id}` }],
    }),

    createAsset: builder.mutation<ApiResponse<AssetItem>, AssetCreateInput>({
      query: (body) => ({
        url: "/api/v1/assets/inventory",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Asset" as const, id: "ASSETS_LIST" }, { type: "Asset" as const, id: "DASHBOARD" }],
    }),

    updateAsset: builder.mutation<ApiResponse<AssetItem>, { id: string; body: AssetUpdateInput }>({
      query: ({ id, body }) => ({
        url: `/api/v1/assets/inventory/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_res, _err, { id }) => [
        { type: "Asset" as const, id: `ASSET_${id}` },
        { type: "Asset" as const, id: "ASSETS_LIST" },
        { type: "Asset" as const, id: "DASHBOARD" },
      ],
    }),

    deleteAsset: builder.mutation<ApiResponse<{ id: string }>, string>({
      query: (id) => ({
        url: `/api/v1/assets/inventory/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Asset" as const, id: "ASSETS_LIST" }, { type: "Asset" as const, id: "DASHBOARD" }],
    }),

    // ── Assignments ────────────────────────────────────────────────
    listAssignments: builder.query<ApiResponse<PaginatedData<AssetAssignmentItem>>, ListParams | void>({
      query: (params) => ({
        url: "/api/v1/assets/assignments",
        params: toQueryParams(params ?? {}),
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.items.map(({ id }) => ({ type: "Asset" as const, id: `ASSIGN_${id}` })),
              { type: "Asset" as const, id: "ASSIGNMENTS_LIST" },
            ]
          : [{ type: "Asset" as const, id: "ASSIGNMENTS_LIST" }],
    }),

    assignAsset: builder.mutation<ApiResponse<AssetAssignmentItem>, AssetAssignInput>({
      query: (body) => ({
        url: "/api/v1/assets/assign",
        method: "POST",
        body,
      }),
      invalidatesTags: [
        { type: "Asset" as const, id: "ASSETS_LIST" },
        { type: "Asset" as const, id: "ASSIGNMENTS_LIST" },
        { type: "Asset" as const, id: "DASHBOARD" },
      ],
    }),

    returnAsset: builder.mutation<ApiResponse<AssetAssignmentItem>, AssetReturnInput>({
      query: (body) => ({
        url: "/api/v1/assets/return",
        method: "POST",
        body,
      }),
      invalidatesTags: [
        { type: "Asset" as const, id: "ASSETS_LIST" },
        { type: "Asset" as const, id: "ASSIGNMENTS_LIST" },
        { type: "Asset" as const, id: "DASHBOARD" },
      ],
    }),

    // ── Maintenance ────────────────────────────────────────────────
    listMaintenances: builder.query<ApiResponse<PaginatedData<AssetMaintenanceItem>>, ListParams | void>({
      query: (params) => ({
        url: "/api/v1/assets/maintenance",
        params: toQueryParams(params ?? {}),
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.items.map(({ id }) => ({ type: "AssetMaintenance" as const, id: `MAINT_${id}` })),
              { type: "AssetMaintenance" as const, id: "MAINTENANCES_LIST" },
            ]
          : [{ type: "AssetMaintenance" as const, id: "MAINTENANCES_LIST" }],
    }),

    scheduleMaintenance: builder.mutation<ApiResponse<AssetMaintenanceItem>, AssetMaintenanceCreateInput>({
      query: (body) => ({
        url: "/api/v1/assets/maintenance",
        method: "POST",
        body,
      }),
      invalidatesTags: [
        { type: "AssetMaintenance" as const, id: "MAINTENANCES_LIST" },
        { type: "Asset" as const, id: "ASSETS_LIST" },
        { type: "Asset" as const, id: "DASHBOARD" },
      ],
    }),

    updateMaintenance: builder.mutation<ApiResponse<AssetMaintenanceItem>, { id: string; body: AssetMaintenanceUpdateInput }>({
      query: ({ id, body }) => ({
        url: `/api/v1/assets/maintenance/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_res, _err, { id }) => [
        { type: "AssetMaintenance" as const, id: `MAINT_${id}` },
        { type: "AssetMaintenance" as const, id: "MAINTENANCES_LIST" },
        { type: "Asset" as const, id: "ASSETS_LIST" },
        { type: "Asset" as const, id: "DASHBOARD" },
      ],
    }),

    deleteMaintenance: builder.mutation<ApiResponse<{ id: string }>, string>({
      query: (id) => ({
        url: `/api/v1/assets/maintenance/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [
        { type: "AssetMaintenance" as const, id: "MAINTENANCES_LIST" },
        { type: "Asset" as const, id: "DASHBOARD" },
      ],
    }),

    // ── Asset Requests ──────────────────────────────────────────────
    listRequests: builder.query<ApiResponse<PaginatedData<AssetRequestItem>>, ListParams | void>({
      query: (params) => ({
        url: "/api/v1/assets/requests",
        params: toQueryParams(params ?? {}),
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.items.map(({ id }) => ({ type: "AssetRequest" as const, id: `REQ_${id}` })),
              { type: "AssetRequest" as const, id: "REQUESTS_LIST" },
            ]
          : [{ type: "AssetRequest" as const, id: "REQUESTS_LIST" }],
    }),

    createRequest: builder.mutation<ApiResponse<AssetRequestItem>, AssetRequestCreateInput>({
      query: (body) => ({
        url: "/api/v1/assets/requests",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "AssetRequest" as const, id: "REQUESTS_LIST" }, { type: "Asset" as const, id: "DASHBOARD" }],
    }),

    updateRequest: builder.mutation<ApiResponse<AssetRequestItem>, { id: string; body: AssetRequestUpdateInput }>({
      query: ({ id, body }) => ({
        url: `/api/v1/assets/requests/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_res, _err, { id }) => [
        { type: "AssetRequest" as const, id: `REQ_${id}` },
        { type: "AssetRequest" as const, id: "REQUESTS_LIST" },
        { type: "Asset" as const, id: "DASHBOARD" },
      ],
    }),

    // ── Export ─────────────────────────────────────────────────────
    exportAssetsReport: builder.mutation<Blob, { format: "csv" | "excel" | "pdf" }>({
      query: ({ format }) => ({
        url: "/api/v1/assets/export",
        params: { format },
        responseHandler: (response) => response.blob(),
        cache: "no-cache",
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAssetDashboardQuery,
  useListAssetCategoriesQuery,
  useCreateAssetCategoryMutation,
  useUpdateAssetCategoryMutation,
  useDeleteAssetCategoryMutation,
  useListAssetVendorsQuery,
  useCreateAssetVendorMutation,
  useUpdateAssetVendorMutation,
  useDeleteAssetVendorMutation,
  useListAssetsQuery,
  useGetAssetQuery,
  useCreateAssetMutation,
  useUpdateAssetMutation,
  useDeleteAssetMutation,
  useListAssignmentsQuery,
  useAssignAssetMutation,
  useReturnAssetMutation,
  useListMaintenancesQuery,
  useScheduleMaintenanceMutation,
  useUpdateMaintenanceMutation,
  useDeleteMaintenanceMutation,
  useListRequestsQuery,
  useCreateRequestMutation,
  useUpdateRequestMutation,
  useExportAssetsReportMutation,
} = assetsApi;
