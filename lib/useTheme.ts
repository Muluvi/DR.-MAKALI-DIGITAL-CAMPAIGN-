"use client";

import { useEffect, useState } from "react";

export type ThemeMode = "light" | "dark" | "sepia";

export function useTheme() {
  const [theme, setTheme] = useState<ThemeMode>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Access localStorage on initial client load - default to true-black OLED dark
    const savedTheme = localStorage.getItem("theme") as ThemeMode | null;
    const initialTheme: ThemeMode = savedTheme || "dark";

    // Apply root classes instantly to avoid flash of unstyled theme
    const root = window.document.documentElement;
    root.classList.remove("dark", "sepia");
    if (initialTheme === "dark") {
      root.classList.add("dark");
    } else if (initialTheme === "sepia") {
      root.classList.add("sepia");
    }

    setTimeout(() => {
      setTheme(initialTheme);
      setMounted(true);
    }, 0);
  }, []);

  const setThemeMode = (mode: ThemeMode) => {
    setTheme(mode);
    const root = window.document.documentElement;
    root.classList.add("theme-switching");
    window.setTimeout(() => root.classList.remove("theme-switching"), 200);

    root.classList.remove("dark", "sepia");
    if (mode === "dark") {
      root.classList.add("dark");
    } else if (mode === "sepia") {
      root.classList.add("sepia");
    }
    localStorage.setItem("theme", mode);
  };

  const toggleTheme = () => {
    const cycle: Record<ThemeMode, ThemeMode> = {
      dark: "light",
      light: "sepia",
      sepia: "dark"
    };
    const nextTheme = cycle[theme] || "dark";
    setThemeMode(nextTheme);
  };

  return { theme, setThemeMode, toggleTheme, mounted };
}
