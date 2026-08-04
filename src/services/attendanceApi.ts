import type { ApiResponse, ListParams, PaginatedData } from "@/types/api";
import { toQueryParams } from "@/types/api";
import { baseApi } from "@/services/api";
import type {
  AttendanceLogItem,
  AttendanceStatsData,
  ManualPunchInput,
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
  }),
  overrideExisting: false,
});

export const {
  useListAttendanceLogsQuery,
  useGetAttendanceStatsQuery,
  useCreateManualPunchLogMutation,
} = attendanceApi;
