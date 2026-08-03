import type { ApiResponse, ImportResult, ListParams, PaginatedData } from "@/types/api";
import { toQueryParams } from "@/types/api";
import { baseApi } from "@/services/api";
import type {
  Department,
  DepartmentCreateInput,
  DepartmentUpdateInput,
  DepartmentStatistics,
  Employee,
  EmployeeCreateInput,
  EmployeeUpdateInput,
} from "@/types/employee";

export const employeeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listEmployees: builder.query<ApiResponse<PaginatedData<Employee>>, ListParams | void>({
      query: (params) => ({
        url: "/api/v1/employees",
        params: toQueryParams(params ?? {}),
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.items.map(({ id }) => ({ type: "Employee" as const, id })),
              { type: "Employee" as const, id: "LIST" },
            ]
          : [{ type: "Employee" as const, id: "LIST" }],
    }),

    getEmployee: builder.query<ApiResponse<Employee>, string>({
      query: (id) => `/api/v1/employees/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Employee", id }],
    }),

    createEmployee: builder.mutation<ApiResponse<Employee>, EmployeeCreateInput>({
      query: (body) => ({ url: "/api/v1/employees", method: "POST", body }),
      invalidatesTags: [
        { type: "Employee", id: "LIST" },
        { type: "Department", id: "LIST" },
      ],
    }),

    updateEmployee: builder.mutation<
      ApiResponse<Employee>,
      { id: string; body: EmployeeUpdateInput }
    >({
      query: ({ id, body }) => ({ url: `/api/v1/employees/${id}`, method: "PATCH", body }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Employee", id },
        { type: "Employee", id: "LIST" },
      ],
    }),

    deleteEmployee: builder.mutation<ApiResponse<{ id: string }>, string>({
      query: (id) => ({ url: `/api/v1/employees/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Employee", id: "LIST" }],
    }),

    archiveEmployee: builder.mutation<ApiResponse<Employee>, string>({
      query: (id) => ({ url: `/api/v1/employees/${id}/archive`, method: "POST" }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Employee", id },
        { type: "Employee", id: "LIST" },
      ],
    }),

    restoreEmployee: builder.mutation<ApiResponse<Employee>, string>({
      query: (id) => ({ url: `/api/v1/employees/${id}/restore`, method: "POST" }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Employee", id },
        { type: "Employee", id: "LIST" },
      ],
    }),

    setEmployeeStatus: builder.mutation<
      ApiResponse<Employee>,
      { id: string; status: Employee["status"] }
    >({
      query: ({ id, status }) => ({
        url: `/api/v1/employees/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Employee", id },
        { type: "Employee", id: "LIST" },
      ],
    }),

    exportEmployees: builder.mutation<Blob, ListParams & { format: "csv" | "excel" | "pdf" }>({
      query: ({ format, ...params }) => ({
        url: `/api/v1/employees/export`,
        params: { ...toQueryParams(params), format },
        responseHandler: (response) => response.blob(),
        cache: "no-cache",
      }),
    }),

    importEmployees: builder.mutation<ApiResponse<ImportResult>, FormData>({
      query: (body) => ({ url: "/api/v1/employees/import", method: "POST", body }),
      invalidatesTags: [{ type: "Employee", id: "LIST" }],
    }),

    // ── Department Endpoints ──────────────────────────────────
    listDepartments: builder.query<ApiResponse<Department[]>, void>({
      query: () => "/api/v1/departments",
      providesTags: [{ type: "Department", id: "LIST" }],
    }),

    getDepartment: builder.query<ApiResponse<Department>, string>({
      query: (id) => `/api/v1/departments/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Department", id }],
    }),

    getDepartmentStatistics: builder.query<ApiResponse<DepartmentStatistics>, void>({
      query: () => "/api/v1/departments/statistics",
      providesTags: [{ type: "Department", id: "STATS" }],
    }),

    createDepartment: builder.mutation<ApiResponse<Department>, DepartmentCreateInput>({
      query: (body) => ({ url: "/api/v1/departments", method: "POST", body }),
      invalidatesTags: [
        { type: "Department", id: "LIST" },
        { type: "Department", id: "STATS" },
      ],
    }),

    updateDepartment: builder.mutation<
      ApiResponse<Department>,
      { id: string; body: DepartmentUpdateInput }
    >({
      query: ({ id, body }) => ({ url: `/api/v1/departments/${id}`, method: "PUT", body }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Department", id },
        { type: "Department", id: "LIST" },
        { type: "Department", id: "STATS" },
      ],
    }),

    deleteDepartment: builder.mutation<ApiResponse<Department>, string>({
      query: (id) => ({ url: `/api/v1/departments/${id}`, method: "DELETE" }),
      invalidatesTags: [
        { type: "Department", id: "LIST" },
        { type: "Department", id: "STATS" },
      ],
    }),

    restoreDepartment: builder.mutation<ApiResponse<Department>, string>({
      query: (id) => ({ url: `/api/v1/departments/${id}/restore`, method: "POST" }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Department", id },
        { type: "Department", id: "LIST" },
        { type: "Department", id: "STATS" },
      ],
    }),

    // Hierarchy & Org Chart Endpoints
    getEmployeeHierarchy: builder.query<ApiResponse<Employee[]>, string | void>({
      query: (id) => (id ? `/api/v1/employees/hierarchy?id=${id}` : "/api/v1/employees/hierarchy"),
      providesTags: [{ type: "Employee", id: "LIST" }],
    }),

    getOrgChart: builder.query<ApiResponse<Employee[]>, ListParams | void>({
      query: (params) => ({
        url: "/api/v1/employees/org-chart",
        params: toQueryParams(params ?? {}),
      }),
      providesTags: [{ type: "Employee", id: "LIST" }],
    }),

    getManagers: builder.query<ApiResponse<Employee[]>, void>({
      query: () => "/api/v1/employees/managers",
      providesTags: [{ type: "Employee", id: "LIST" }],
    }),

    getReportingChain: builder.query<ApiResponse<Employee[]>, string>({
      query: (id) => `/api/v1/employees/reporting-chain/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Employee", id }],
    }),

    changeManager: builder.mutation<
      ApiResponse<Employee>,
      {
        employee_id: string;
        new_manager_id?: string | undefined;
        new_manager_name?: string | undefined;
      }
    >({
      query: (body) => ({
        url: "/api/v1/employees/change-manager",
        method: "PATCH",
        body,
      }),
      invalidatesTags: [{ type: "Employee", id: "LIST" }],
    }),

    bulkReassign: builder.mutation<
      ApiResponse<{ count: number }>,
      {
        employee_ids: string[];
        new_manager_id?: string | undefined;
        new_department?: string | undefined;
        new_team?: string | undefined;
      }
    >({
      query: (body) => ({
        url: "/api/v1/employees/reassign",
        method: "PATCH",
        body,
      }),
      invalidatesTags: [{ type: "Employee", id: "LIST" }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useListEmployeesQuery,
  useGetEmployeeQuery,
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,
  useArchiveEmployeeMutation,
  useRestoreEmployeeMutation,
  useSetEmployeeStatusMutation,
  useExportEmployeesMutation,
  useImportEmployeesMutation,
  useListDepartmentsQuery,
  useGetDepartmentQuery,
  useGetDepartmentStatisticsQuery,
  useCreateDepartmentMutation,
  useUpdateDepartmentMutation,
  useDeleteDepartmentMutation,
  useRestoreDepartmentMutation,
  useGetEmployeeHierarchyQuery,
  useGetOrgChartQuery,
  useGetManagersQuery,
  useGetReportingChainQuery,
  useChangeManagerMutation,
  useBulkReassignMutation,
} = employeeApi;
