import { create } from "zustand";

export type Theme = "light" | "dark";

const STORAGE_KEY = "ofc-hr-theme";

type ThemeState = {
  theme: Theme;
  hydrated: boolean;
  setTheme: (theme: Theme) => void;
  toggle: () => void;
  hydrate: () => void;
};

function apply(theme: Theme) {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("dark", theme === "dark");
  document.documentElement.style.colorScheme = theme;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: "dark",
  hydrated: false,
  setTheme: (theme) => {
    apply(theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      /* ignore */
    }
    set({ theme });
  },
  toggle: () => get().setTheme(get().theme === "dark" ? "light" : "dark"),
  hydrate: () => {
    if (get().hydrated) return;
    let stored: Theme | null = null;
    try {
      stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
    } catch {
      /* ignore */
    }
    const prefersDark =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    const theme: Theme = stored ?? (prefersDark ? "dark" : "light");
    apply(theme);
    set({ theme, hydrated: true });
  },
}));
