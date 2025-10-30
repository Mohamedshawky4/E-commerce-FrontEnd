import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          light: "#FAFAF9",
          dark: "#0D0D0D",
        },
        surface: {
          light: "#FFFFFF",
          dark: "#1A1A1A",
        },
        text: {
          light: "#111111",
          dark: "#F5F5F5",
        },
        textMuted: {
          light: "#4B5563",
          dark: "#D1D5DB",
        },
        border: {
          light: "#E5E5E5",
          dark: "#262626",
        },
        primary: {
          light: "#D4AF37",
          dark: "#FACC15",
        },
        success: {
          light: "#16A34A",
          dark: "#22C55E",
        },
        error: {
          light: "#DC2626",
          dark: "#EF4444",
        },
      },
    },
  },
  plugins: [],
};
export default config;
