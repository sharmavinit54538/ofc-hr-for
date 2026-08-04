import type { ApiResponse } from "@/types/api";
import { baseApi } from "@/services/api";

export interface RecognitionPost {
  id: string;
  senderName: string;
  senderRole: string;
  recipientName: string;
  recipientRole: string;
  badge: string;
  message: string;
  kudosCount: number;
  date: string;
}

export interface CreateRecognitionInput {
  recipientName: string;
  badge: string;
  message: string;
}

export interface RewardVoucher {
  id: string;
  title: string;
  cost: string;
  description?: string;
}

export interface BadgeItem {
  name: string;
  icon: string;
  desc: string;
}

export interface EventItem {
  id: string;
  title: string;
  date: string;
  category: string;
}

export interface EngagementSummary {
  kudos_count: number;
  points_given: number;
  badges_awarded: number;
  enps_score: number;
  team_events_count: number;
  active_participation_pct: number;
}

export const engagementApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getEngagementSummary: builder.query<ApiResponse<EngagementSummary>, void>({
      query: () => "/api/v1/engagement/summary",
      providesTags: [{ type: "Engagement" as const, id: "SUMMARY" }],
    }),

    getRecognitions: builder.query<ApiResponse<RecognitionPost[]>, void>({
      query: () => "/api/v1/engagement/recognitions",
      providesTags: [{ type: "Engagement" as const, id: "RECOGNITIONS" }],
    }),

    createRecognition: builder.mutation<ApiResponse<RecognitionPost>, CreateRecognitionInput>({
      query: (body) => ({
        url: "/api/v1/engagement/recognitions",
        method: "POST",
        body,
      }),
      invalidatesTags: [
        { type: "Engagement" as const, id: "RECOGNITIONS" },
        { type: "Engagement" as const, id: "SUMMARY" },
      ],
    }),

    getRewards: builder.query<ApiResponse<RewardVoucher[]>, void>({
      query: () => "/api/v1/engagement/rewards",
      providesTags: [{ type: "Engagement" as const, id: "REWARDS" }],
    }),

    getBadges: builder.query<ApiResponse<BadgeItem[]>, void>({
      query: () => "/api/v1/engagement/badges",
      providesTags: [{ type: "Engagement" as const, id: "BADGES" }],
    }),

    getEvents: builder.query<ApiResponse<EventItem[]>, void>({
      query: () => "/api/v1/engagement/events",
      providesTags: [{ type: "Engagement" as const, id: "EVENTS" }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetEngagementSummaryQuery,
  useGetRecognitionsQuery,
  useCreateRecognitionMutation,
  useGetRewardsQuery,
  useGetBadgesQuery,
  useGetEventsQuery,
} = engagementApi;
