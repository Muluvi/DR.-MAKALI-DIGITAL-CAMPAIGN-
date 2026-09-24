"use client";

import { useEffect, useState } from "react";

/**
 * Two themes: dark (the default, a deep indigo-black ground) and light (warm paper).
 *
 * The third, "sepia", was retired in the 2026 premium pass: the palette is measured for two
 * grounds, and a reader who had chosen sepia is carried to light, its nearest neighbour.
 */
export type ThemeMode = "light" | "dark";

function readStored(): ThemeMode {
  try {
    const saved = localStorage.getItem("theme");
    if (saved === "light" || saved === "sepia") return "light";
  } catch {
    // Blocked storage is not a reason to fail: the default stands.
  }
  return "dark";
}

function apply(mode: ThemeMode) {
  const root = window.document.documentElement;
  root.classList.remove("dark", "sepia");
  if (mode === "dark") root.classList.add("dark");
}

export function useTheme() {
  const [theme, setTheme] = useState<ThemeMode>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const initialTheme = readStored();
    apply(initialTheme);
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
    apply(mode);
    try {
      localStorage.setItem("theme", mode);
    } catch {
      // As above.
    }
  };

  const toggleTheme = () => setThemeMode(theme === "dark" ? "light" : "dark");

  return { theme, setThemeMode, toggleTheme, mounted };
}
