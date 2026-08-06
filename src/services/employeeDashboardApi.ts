import type { ApiResponse } from "@/types/api";
import { baseApi } from "@/services/api";

export interface TodayAttendance {
  avg_clock_in: string;
  clocked_in: boolean;
  clock_in_time?: string;
  clock_out_time?: string;
  this_month_hours: string;
}

export interface MonthSummary {
  total_hours: string;
  total_days: number;
}

export interface LeaveTypeBalance {
  type: string;
  total: number;
  used: number;
  remaining: number;
  color: string;
}

export interface LeaveBalance {
  casual_leave: number;
  sick_leave: number;
  earned_leave: number;
  total_remaining: number;
  balances?: LeaveTypeBalance[];
}

export interface LeaveRequestItem {
  id: string;
  type: string;
  from_date: string;
  to_date: string;
  days: number;
  reason: string;
  status: "Approved" | "Pending" | "Rejected";
  applied_on: string;
  approver: string;
}

export interface ApplyLeavePayload {
  type: string;
  from_date: string;
  to_date: string;
  reason: string;
}

export interface LatestPayroll {
  month: string;
  year: number;
  net_pay: number;
  status: string;
}

export interface PayslipRecordItem {
  id: string;
  month: string;
  year: number;
  basic_pay: number;
  hra: number;
  conveyance: number;
  special_allowance: number;
  gross_earnings: number;
  pf: number;
  professional_tax: number;
  income_tax: number;
  total_deductions: number;
  net_pay: number;
  paid_on: string;
  status: string;
}

export interface HelpdeskTicketItem {
  id: string;
  ticket_number: string;
  subject: string;
  category: string;
  priority: string;
  status: string;
  created_at: string;
  assigned_to: string;
  description: string;
}

export interface CreateTicketPayload {
  subject: string;
  category: string;
  priority: string;
  description: string;
}

export interface EmployeeDocumentItem {
  id: string;
  title: string;
  category: string;
  uploaded_on: string;
  file_size: string;
  file_url?: string;
  status: string;
}

export interface UploadDocumentPayload {
  title: string;
  category: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  tone: "info" | "success" | "warning" | "critical";
}

export interface AttendanceSummary {
  present: number;
  absent: number;
  wfh: number;
  half_day: number;
  on_time_rate?: string;
  total_hours?: string;
}

export interface AttendanceHistoryItem {
  id: string;
  date: string;
  day: string;
  clock_in: string;
  clock_out: string;
  total_hours: string;
  status: string;
}

export interface AnnouncementItem {
  id: string;
  title: string;
  body: string;
  priority: string;
  date: string;
}

export interface HolidayItem {
  id: string;
  name: string;
  date: string;
  day: string;
  type: string;
}

export const employeeDashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTodayAttendance: builder.query<ApiResponse<TodayAttendance>, void>({
      query: () => "/api/v1/attendance/face/me",
      providesTags: [{ type: "Attendance" as const, id: "TODAY" }],
    }),

    clockIn: builder.mutation<ApiResponse<TodayAttendance>, void>({
      query: () => ({
        url: "/api/v1/employee/attendance/clock-in",
        method: "POST",
      }),
      invalidatesTags: [
        { type: "Attendance" as const, id: "TODAY" },
        { type: "Attendance" as const, id: "SUMMARY" },
        { type: "Attendance" as const, id: "HISTORY" },
      ],
    }),

    clockOut: builder.mutation<ApiResponse<TodayAttendance>, void>({
      query: () => ({
        url: "/api/v1/employee/attendance/clock-out",
        method: "POST",
      }),
      invalidatesTags: [
        { type: "Attendance" as const, id: "TODAY" },
        { type: "Attendance" as const, id: "SUMMARY" },
        { type: "Attendance" as const, id: "HISTORY" },
      ],
    }),

    getAttendanceHistory: builder.query<ApiResponse<AttendanceHistoryItem[]>, void>({
      query: () => "/api/v1/employee/attendance/history",
      providesTags: [{ type: "Attendance" as const, id: "HISTORY" }],
    }),

    getMonthSummary: builder.query<ApiResponse<MonthSummary>, void>({
      query: () => "/api/v1/employee/attendance/month-summary",
      providesTags: [{ type: "Attendance" as const, id: "MONTH_SUMMARY" }],
    }),

    getLeaveBalance: builder.query<ApiResponse<LeaveBalance>, void>({
      query: () => "/api/v1/employee/leaves/balance",
      providesTags: [{ type: "Leave" as const, id: "BALANCE" }],
    }),

    getLeaveRequests: builder.query<ApiResponse<LeaveRequestItem[]>, void>({
      query: () => "/api/v1/employee/leaves/requests",
      providesTags: [{ type: "Leave" as const, id: "REQUESTS" }],
    }),

    applyLeave: builder.mutation<ApiResponse<LeaveRequestItem>, ApplyLeavePayload>({
      query: (body) => ({
        url: "/api/v1/employee/leaves/apply",
        method: "POST",
        body,
      }),
      invalidatesTags: [
        { type: "Leave" as const, id: "BALANCE" },
        { type: "Leave" as const, id: "REQUESTS" },
      ],
    }),

    getLatestPayroll: builder.query<ApiResponse<LatestPayroll>, void>({
      query: () => "/api/v1/employee/payroll/latest",
      providesTags: [{ type: "Payroll" as const, id: "LATEST" }],
    }),

    getPayrollSlips: builder.query<ApiResponse<PayslipRecordItem[]>, void>({
      query: () => "/api/v1/employee/payroll/slips",
      providesTags: [{ type: "Payroll" as const, id: "SLIPS" }],
    }),

    getEmployeeTickets: builder.query<ApiResponse<HelpdeskTicketItem[]>, void>({
      query: () => "/api/v1/employee/tickets",
      providesTags: [{ type: "Helpdesk" as const, id: "LIST" }],
    }),

    createTicket: builder.mutation<ApiResponse<HelpdeskTicketItem>, CreateTicketPayload>({
      query: (body) => ({
        url: "/api/v1/employee/tickets",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Helpdesk" as const, id: "LIST" }],
    }),

    getEmployeeDocuments: builder.query<ApiResponse<EmployeeDocumentItem[]>, void>({
      query: () => "/api/v1/employee/documents",
      providesTags: [{ type: "Document" as const, id: "LIST" }],
    }),

    uploadDocument: builder.mutation<ApiResponse<EmployeeDocumentItem>, UploadDocumentPayload>({
      query: (body) => ({
        url: "/api/v1/employee/documents/upload",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Document" as const, id: "LIST" }],
    }),

    getAttendanceSummary: builder.query<ApiResponse<AttendanceSummary>, void>({
      query: () => "/api/v1/employee/attendance/summary",
      providesTags: [{ type: "Attendance" as const, id: "SUMMARY" }],
    }),

    getCompanyAnnouncements: builder.query<ApiResponse<AnnouncementItem[]>, void>({
      query: () => "/api/v1/company/announcements",
      providesTags: [{ type: "Announcement" as const, id: "LIST" }],
    }),

    getCompanyHolidays: builder.query<ApiResponse<HolidayItem[]>, void>({
      query: () => "/api/v1/company/holidays",
      providesTags: [{ type: "Calendar" as const, id: "LIST" }],
    }),

    getNotifications: builder.query<ApiResponse<NotificationItem[]>, void>({
      query: () => "/api/v1/global-notifications/notifications",
      transformResponse: (response: any) => {
        const items = response?.data?.items || response?.data || response || [];
        return {
          success: true,
          message: response?.message || "Notifications retrieved",
          data: items,
        };
      },
      providesTags: [{ type: "Notification" as const, id: "LIST" }],
    }),

    markNotificationsRead: builder.mutation<ApiResponse<boolean>, void>({
      query: () => ({
        url: "/api/v1/global-notifications/notifications/read-all",
        method: "POST",
      }),
      invalidatesTags: [{ type: "Notification" as const, id: "LIST" }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetTodayAttendanceQuery,
  useClockInMutation,
  useClockOutMutation,
  useGetAttendanceHistoryQuery,
  useGetMonthSummaryQuery,
  useGetLeaveBalanceQuery,
  useGetLeaveRequestsQuery,
  useApplyLeaveMutation,
  useGetLatestPayrollQuery,
  useGetPayrollSlipsQuery,
  useGetEmployeeTicketsQuery,
  useCreateTicketMutation,
  useGetEmployeeDocumentsQuery,
  useUploadDocumentMutation,
  useGetAttendanceSummaryQuery,
  useGetCompanyAnnouncementsQuery,
  useGetCompanyHolidaysQuery,
  useGetNotificationsQuery,
  useMarkNotificationsReadMutation,
} = employeeDashboardApi;
