import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/app/store";

export interface UserProfileData {
  id: string;
  organization_id: string;
  email: string;
  full_name: string;
  role: "HR_ADMIN" | "IT_ADMIN" | "EXECUTIVE" | "MANAGER" | "EMPLOYEE";
  is_active?: boolean;
  is_verified?: boolean;
  is_onboarding_completed?: boolean;
  sso_provider?: string;
  created_at?: string;
}

export interface AuthState {
  accessToken: string | null;
  user: UserProfileData | null;
  isInitializing: boolean;
}

const initialState: AuthState = {
  accessToken: null,
  user: null,
  isInitializing: true,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAccessToken: (state, action: PayloadAction<string | null>) => {
      state.accessToken = action.payload;
    },
    setUser: (state, action: PayloadAction<UserProfileData | null>) => {
      state.user = action.payload;
    },
    setInitializing: (state, action: PayloadAction<boolean>) => {
      state.isInitializing = action.payload;
    },
    logoutAuth: (state) => {
      state.accessToken = null;
      state.user = null;
      state.isInitializing = false;
    },
  },
});

export const { setAccessToken, setUser, setInitializing, logoutAuth } = authSlice.actions;

export const selectAccessToken = (state: RootState) => state.auth.accessToken;
export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectUserRole = (state: RootState) => state.auth.user?.role || null;
export const selectIsInitializing = (state: RootState) => state.auth.isInitializing;
export const selectIsAuthenticated = (state: RootState) => Boolean(state.auth.accessToken);

export default authSlice.reducer;
