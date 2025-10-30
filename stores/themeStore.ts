"use client";
import { create } from "zustand";

type Theme = "light" | "dark";

interface ThemeState {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  initTheme: () => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: "light", // default safe value for SSR

  toggleTheme: () =>
    set((state) => {
      const newTheme = state.theme === "light" ? "dark" : "light";
      document.documentElement.classList.toggle("dark", newTheme === "dark");
      localStorage.setItem("theme", newTheme);
      return { theme: newTheme };
    }),

  setTheme: (theme) =>
    set(() => {
      document.documentElement.classList.toggle("dark", theme === "dark");
      localStorage.setItem("theme", theme);
      return { theme };
    }),

  // Initialize from localStorage on client
  initTheme: () => {
    const stored = localStorage.getItem("theme") as Theme | null;
    const theme = stored || "light";
    document.documentElement.classList.toggle("dark", theme === "dark");
    set({ theme });
  },
}));
