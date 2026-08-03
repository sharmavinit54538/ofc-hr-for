import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/app/store";

export type Theme = "light" | "dark";

export interface UiState {
  theme: Theme;
  sidebarCollapsed: boolean;
  lastApiError: string | null;
}

const initialState: UiState = {
  theme: "dark",
  sidebarCollapsed: false,
  lastApiError: null,
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.theme = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.sidebarCollapsed = action.payload;
    },
    setLastApiError: (state, action: PayloadAction<string | null>) => {
      state.lastApiError = action.payload;
    },
  },
});

export const { setTheme, toggleSidebar, setSidebarCollapsed, setLastApiError } = uiSlice.actions;

export const selectTheme = (state: RootState) => state.ui.theme;
export const selectSidebarCollapsed = (state: RootState) => state.ui.sidebarCollapsed;
export const selectLastApiError = (state: RootState) => state.ui.lastApiError;

export default uiSlice.reducer;
