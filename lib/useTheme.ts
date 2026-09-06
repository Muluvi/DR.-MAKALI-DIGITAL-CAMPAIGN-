"use client";

import { useEffect, useState } from "react";

export function useTheme() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Access localStorage on initial client load - default to true-black OLED dark
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    const initialTheme = savedTheme || "dark";

    // Apply root classes instantly to avoid flash of unstyled theme
    const root = window.document.documentElement;
    if (initialTheme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    setTimeout(() => {
      setTheme(initialTheme);
      setMounted(true);
    }, 0);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);

    const root = window.document.documentElement;

    // The colour-transition rule is scoped to .theme-switching rather than left on `*`, so it
    // is switched on for the length of the crossfade and removed again. Steady-state scrolling
    // then carries no transition work at all.
    root.classList.add("theme-switching");
    window.setTimeout(() => root.classList.remove("theme-switching"), 200);

    if (nextTheme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", nextTheme);
  };

  return { theme, toggleTheme, mounted };
}
