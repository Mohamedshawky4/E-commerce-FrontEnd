"use client";
import { useThemeStore } from "@/stores/themeStore";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, toggleTheme, initTheme } = useThemeStore();
  const [mounted, setMounted] = useState(false);

useEffect(() => {
  Promise.resolve().then(() => {
    initTheme();
    setMounted(true);
  });
}, [initTheme]);


  if (!mounted) return null;

  return (
    <button
      onClick={toggleTheme}
      className="group p-2 rounded-lg hover:bg-primary transition hover:cursor-pointer"
      aria-label="Toggle Theme"
    >
      {theme === "light" ? (
        <Moon className="w-5 h-5 text-primary group-hover:text-background transition-colors duration-200" />
      ) : (
        <Sun className="w-5 h-5 text-primary group-hover:text-background transition-colors duration-200" />
      )}
    </button>
  );
}
