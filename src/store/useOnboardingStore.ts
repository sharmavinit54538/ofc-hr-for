import { create } from "zustand";
import { axiosInstance } from "@/lib/axios";
import { useAuthStore } from "@/store/useAuthStore";
import type { RegistrationDraft } from "@/lib/auth/registration";

export interface OnboardingState {
  currentStep: number;
  completed: boolean;
  totalSteps: number;
  draft: RegistrationDraft;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;

  // Actions
  fetchStatus: () => Promise<boolean>;
  fetchData: () => Promise<void>;
  saveStep: (stepIndex: number, values: Partial<RegistrationDraft>) => Promise<boolean>;
  completeOnboarding: () => Promise<boolean>;
  setStep: (step: number) => void;
  clearError: () => void;
  reset: () => void;
}

const initialDraft: RegistrationDraft = {
  companyName: "",
  logo: "",
  industry: "",
  companySize: "",
  website: "",
  country: "",
  timezone: "",
  address: "",
  city: "",
  state: "",
  zipCode: "",
  gstNumber: "",
  fullName: "",
  phone: "",
  avatar: "",
  terms: false as any,
  dataProcessing: false as any,
};

export const useOnboardingStore = create<OnboardingState>((set, get) => ({
  currentStep: 0,
  completed: false,
  totalSteps: 4,
  draft: initialDraft,
  isLoading: true,
  isSaving: false,
  error: null,

  clearError: () => set({ error: null }),

  reset: () =>
    set({
      currentStep: 0,
      completed: false,
      draft: initialDraft,
      isLoading: false,
      isSaving: false,
      error: null,
    }),

  setStep: (step: number) => set({ currentStep: step }),

  fetchStatus: async () => {
    try {
      const res = await axiosInstance.get("/api/v1/hr-admin/onboarding/status");
      const data = res.data?.data || res.data;
      if (data) {
        const isComp = Boolean(data.completed);
        const step = typeof data.current_step === "number" ? data.current_step : 0;
        set({
          completed: isComp,
          currentStep: isComp ? 4 : Math.min(step, 4),
          totalSteps: data.total_steps || 4,
        });
        return isComp;
      }
      return false;
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || "Failed to fetch onboarding status";
      set({ error: msg });
      return false;
    }
  },

  fetchData: async () => {
    set({ isLoading: true, error: null });
    try {
      await get().fetchStatus();
      const res = await axiosInstance.get("/api/v1/hr-admin/onboarding");
      const d = res.data?.data || res.data;
      if (d) {
        set({
          completed: Boolean(d.completed),
          currentStep: Boolean(d.completed) ? 4 : (typeof d.current_step === "number" ? Math.min(d.current_step, 4) : 0),
          draft: {
            companyName: d.companyName || "",
            logo: d.logo || "",
            industry: d.industry || "",
            companySize: d.companySize || "",
            website: d.website || "",
            country: d.country || "India",
            timezone: d.timezone || "Asia/Kolkata",
            address: d.address || "",
            city: d.city || "",
            state: d.state || "",
            zipCode: d.zipCode || "",
            gstNumber: d.gstNumber || "",
            fullName: d.fullName || "",
            phone: d.phone || "",
            avatar: d.avatar || "",
            terms: Boolean(d.termsAccepted) as any,
            dataProcessing: Boolean(d.dpaAccepted) as any,
          },
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || err.response?.data?.detail || err.message || "Failed to load onboarding data";
      set({ isLoading: false, error: msg });
    }
  },

  saveStep: async (stepIndex: number, values: Partial<RegistrationDraft>) => {
    set({ isSaving: true, error: null });
    try {
      const currentDraft = get().draft;
      const updatedDraft = { ...currentDraft, ...values };
      set({ draft: updatedDraft });

      const res = await axiosInstance.post(`/api/v1/hr-admin/onboarding/step/${stepIndex}`, values);
      const resData = res.data?.data || res.data;

      const nextStep = typeof resData?.current_step === "number" ? Math.min(resData.current_step, 4) : stepIndex + 1;
      set({
        isSaving: false,
        currentStep: nextStep,
      });
      return true;
    } catch (err: any) {
      const msg = err.response?.data?.message || err.response?.data?.detail || err.message || "Failed to save step";
      set({ isSaving: false, error: msg });
      return false;
    }
  },

  completeOnboarding: async () => {
    set({ isSaving: true, error: null });
    try {
      // 1. Save step 3 agreements
      await axiosInstance.post("/api/v1/hr-admin/onboarding/step/3", {
        terms: true,
        dataProcessing: true,
      });

      // 2. Complete onboarding
      const res = await axiosInstance.post("/api/v1/hr-admin/onboarding/complete");
      const resData = res.data?.data || res.data;

      set({
        completed: true,
        currentStep: 4,
        isSaving: false,
      });

      // Update user in auth store
      const currentUser = useAuthStore.getState().user;
      if (currentUser) {
        useAuthStore.getState().setUser({
          ...currentUser,
          is_onboarding_completed: true,
        });
      }

      return true;
    } catch (err: any) {
      const msg = err.response?.data?.message || err.response?.data?.detail || err.message || "Failed to complete onboarding";
      set({ isSaving: false, error: msg });
      return false;
    }
  },
}));
