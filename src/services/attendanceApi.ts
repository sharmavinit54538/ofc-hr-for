import type { ApiResponse, ListParams, PaginatedData } from "@/types/api";
import { toQueryParams } from "@/types/api";
import { baseApi } from "@/services/api";
import type {
  AttendanceLogItem,
  AttendanceStatsData,
  ManualPunchInput,
  ShiftPatternItem,
  ShiftPatternCreateInput,
  GeofenceZoneItem,
  GeofenceZoneCreateInput,
  OvertimeClaimItem,
  OvertimeClaimCreateInput,
  OvertimeClaimUpdateInput,
} from "@/types/attendance";

export const attendanceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listAttendanceLogs: builder.query<ApiResponse<PaginatedData<AttendanceLogItem>>, ListParams | void>({
      query: (params) => ({
        url: "/api/v1/attendance/logs",
        params: toQueryParams(params ?? {}),
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.items.map(({ id }) => ({ type: "Attendance" as const, id: `LOG_${id}` })),
              { type: "Attendance" as const, id: "LOGS_LIST" },
            ]
          : [{ type: "Attendance" as const, id: "LOGS_LIST" }],
    }),

    getAttendanceStats: builder.query<ApiResponse<AttendanceStatsData>, void>({
      query: () => "/api/v1/attendance/stats",
      providesTags: [{ type: "Attendance" as const, id: "STATS" }],
    }),

    createManualPunchLog: builder.mutation<ApiResponse<AttendanceLogItem>, ManualPunchInput>({
      query: (body) => ({
        url: "/api/v1/attendance/logs",
        method: "POST",
        body,
      }),
      invalidatesTags: [
        { type: "Attendance" as const, id: "LOGS_LIST" },
        { type: "Attendance" as const, id: "STATS" },
      ],
    }),

    // ── Shifts ─────────────────────────────────────────────────────────────
    listShifts: builder.query<ApiResponse<ShiftPatternItem[]>, void>({
      query: () => "/api/v1/attendance/shifts",
      providesTags: [{ type: "Attendance" as const, id: "SHIFTS_LIST" }],
    }),

    createShift: builder.mutation<ApiResponse<ShiftPatternItem>, ShiftPatternCreateInput>({
      query: (body) => ({
        url: "/api/v1/attendance/shifts",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Attendance" as const, id: "SHIFTS_LIST" }],
    }),

    deleteShift: builder.mutation<ApiResponse<{ id: string }>, string>({
      query: (id) => ({
        url: `/api/v1/attendance/shifts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Attendance" as const, id: "SHIFTS_LIST" }],
    }),

    // ── Geofences ──────────────────────────────────────────────────────────
    listGeofences: builder.query<ApiResponse<GeofenceZoneItem[]>, void>({
      query: () => "/api/v1/attendance/geofence",
      providesTags: [{ type: "Attendance" as const, id: "GEOFENCES_LIST" }],
    }),

    createGeofence: builder.mutation<ApiResponse<GeofenceZoneItem>, GeofenceZoneCreateInput>({
      query: (body) => ({
        url: "/api/v1/attendance/geofence",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Attendance" as const, id: "GEOFENCES_LIST" }],
    }),

    deleteGeofence: builder.mutation<ApiResponse<{ id: string }>, string>({
      query: (id) => ({
        url: `/api/v1/attendance/geofence/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Attendance" as const, id: "GEOFENCES_LIST" }],
    }),

    // ── Overtime Claims ────────────────────────────────────────────────────
    listOvertimes: builder.query<ApiResponse<OvertimeClaimItem[]>, { status?: string | undefined } | void>({
      query: (params) => ({
        url: "/api/v1/attendance/overtime",
        params: params?.status ? { status: params.status } : undefined,
      }),
      providesTags: [{ type: "Attendance" as const, id: "OVERTIMES_LIST" }],
    }),

    createOvertime: builder.mutation<ApiResponse<OvertimeClaimItem>, OvertimeClaimCreateInput>({
      query: (body) => ({
        url: "/api/v1/attendance/overtime",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Attendance" as const, id: "OVERTIMES_LIST" }],
    }),

    updateOvertimeStatus: builder.mutation<ApiResponse<OvertimeClaimItem>, { id: string; body: OvertimeClaimUpdateInput }>({
      query: ({ id, body }) => ({
        url: `/api/v1/attendance/overtime/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: [{ type: "Attendance" as const, id: "OVERTIMES_LIST" }],
    }),

    deleteOvertime: builder.mutation<ApiResponse<{ id: string }>, string>({
      query: (id) => ({
        url: `/api/v1/attendance/overtime/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Attendance" as const, id: "OVERTIMES_LIST" }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useListAttendanceLogsQuery,
  useGetAttendanceStatsQuery,
  useCreateManualPunchLogMutation,
  useListShiftsQuery,
  useCreateShiftMutation,
  useDeleteShiftMutation,
  useListGeofencesQuery,
  useCreateGeofenceMutation,
  useDeleteGeofenceMutation,
  useListOvertimesQuery,
  useCreateOvertimeMutation,
  useUpdateOvertimeStatusMutation,
  useDeleteOvertimeMutation,
} = attendanceApi;
