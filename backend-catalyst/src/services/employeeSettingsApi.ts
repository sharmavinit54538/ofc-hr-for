import type { ApiResponse } from "@/types/api";
import { baseApi } from "@/services/api";

export interface EmployeeProfile {
  id: string;
  employee_id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  work_email: string;
  phone?: string | undefined;
  alternate_phone?: string | undefined;
  role: string;
  status: string;
  company_name?: string | undefined;
  profile_photo?: string | undefined;
  date_of_birth?: string | undefined;
  gender?: string | undefined;
  blood_group?: string | undefined;
  nationality?: string | undefined;
  marital_status?: string | undefined;
  address?: string | undefined;
  city?: string | undefined;
  state?: string | undefined;
  country?: string | undefined;
  postal_code?: string | undefined;
  job_title?: string | undefined;
  department?: string | undefined;
  designation?: string | undefined;
  employment_type?: string | undefined;
  work_mode?: string | undefined;
  reporting_manager?: string | undefined;
  hr_manager?: string | undefined;
  shift?: string | undefined;
  office_branch?: string | undefined;
  work_location?: string | undefined;
  joining_date?: string | undefined;
  probation_status?: string | undefined;
  confirmation_date?: string | undefined;
  emergency_contact_name?: string | undefined;
  emergency_relationship?: string | undefined;
  emergency_phone?: string | undefined;
  emergency_alt_phone?: string | undefined;
  emergency_address?: string | undefined;
}

export interface EmployeePreferences {
  email_notifications: boolean;
}

export interface ChangePasswordInput {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

export const employeeSettingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getEmployeeProfile: builder.query<ApiResponse<EmployeeProfile>, void>({
      query: () => "/api/v1/employee/profile",
      providesTags: [{ type: "Employee", id: "PROFILE" }],
    }),

    updateEmployeeProfile: builder.mutation<
      ApiResponse<EmployeeProfile>,
      Partial<EmployeeProfile>
    >({
      query: (body) => ({
        url: "/api/v1/employee/profile",
        method: "PUT",
        body,
      }),
      invalidatesTags: [{ type: "Employee", id: "PROFILE" }],
    }),

    getEmployeePreferences: builder.query<ApiResponse<EmployeePreferences>, void>({
      query: () => "/api/v1/employee/preferences",
      providesTags: [{ type: "Employee", id: "PREFERENCES" }],
    }),

    updateEmployeePreferences: builder.mutation<
      ApiResponse<EmployeePreferences>,
      EmployeePreferences
    >({
      query: (body) => ({
        url: "/api/v1/employee/preferences",
        method: "PATCH",
        body,
      }),
      invalidatesTags: [{ type: "Employee", id: "PREFERENCES" }],
    }),

    changeEmployeePassword: builder.mutation<
      ApiResponse<{ updated: boolean }>,
      ChangePasswordInput
    >({
      query: (body) => ({
        url: "/api/v1/employee/change-password",
        method: "POST",
        body,
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetEmployeeProfileQuery,
  useUpdateEmployeeProfileMutation,
  useGetEmployeePreferencesQuery,
  useUpdateEmployeePreferencesMutation,
  useChangeEmployeePasswordMutation,
} = employeeSettingsApi;
