import type { ApiResponse } from "@/types/api";
import { baseApi } from "@/services/api";

export interface CalendarEvent {
  id: string;
  title: string;
  type: string;
  date: string;
  color: string;
  description?: string;
  location?: string;
}

export interface CreateCalendarEventInput {
  title: string;
  type: string;
  date: string;
  color?: string;
  description?: string;
  location?: string;
}

export interface HolidayItem {
  id: string;
  title: string;
  subtitle: string;
  status: string;
  date: string;
  metric: string;
}

export const calendarApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCalendarEvents: builder.query<ApiResponse<CalendarEvent[]>, string | void>({
      query: (type) => ({
        url: "/api/v1/calendar/events",
        params: type ? { event_type: type } : {},
      }),
      providesTags: ["Calendar"],
    }),

    createCalendarEvent: builder.mutation<ApiResponse<CalendarEvent>, CreateCalendarEventInput>({
      query: (body) => ({
        url: "/api/v1/calendar/events",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Calendar"],
    }),

    getHolidays: builder.query<ApiResponse<HolidayItem[]>, void>({
      query: () => "/api/v1/calendar/holidays",
      providesTags: ["Calendar"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetCalendarEventsQuery,
  useCreateCalendarEventMutation,
  useGetHolidaysQuery,
} = calendarApi;
