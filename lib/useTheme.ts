"use client";

import { useEffect, useState } from "react";

/**
 * Two themes: dark (the default, a deep indigo-black ground) and light (warm paper).
 *
 * The third, "sepia", was retired in the 2026 premium pass: the palette is measured for two
 * grounds, and a reader who had chosen sepia is carried to light, its nearest neighbour.
 */
export type ThemeMode = "light" | "dark";

/**
 * The reader's theme: a stored choice if there is one, else the device's colour scheme (the brief
 * for the visual-first pass: follow prefers-color-scheme, keep a manual toggle that persists). The
 * pre-paint script in app/layout.tsx applies the same rule before first paint, so this only reads
 * what it set.
 */
function readStored(): ThemeMode {
  try {
    const saved = localStorage.getItem("theme");
    if (saved === "light" || saved === "sepia") return "light";
    if (saved === "dark") return "dark";
  } catch {
    // Blocked storage is not a reason to fail: the device's scheme decides.
  }
  try {
    return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  } catch {
    return "dark";
  }
}

/** Where the last press landed: the origin of the theme's circular reveal. */
let lastPress: { x: number; y: number } | null = null;
if (typeof window !== "undefined") {
  window.addEventListener("pointerdown", (e) => (lastPress = { x: e.clientX, y: e.clientY }), { passive: true, capture: true });
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
    // The effects panel (components/fx/FxPanel.tsx) switches the theme too; follow it.
    const onTheme = (e: Event) => {
      const mode = (e as CustomEvent<ThemeMode>).detail;
      if (mode === "light" || mode === "dark") setTheme(mode);
    };
    window.addEventListener("kitui:theme", onTheme);
    return () => window.removeEventListener("kitui:theme", onTheme);
  }, []);

  const setThemeMode = (mode: ThemeMode) => {
    setTheme(mode);
    const root = window.document.documentElement;
    // The theme spreads as a circle from the control that was pressed (the last pointer press,
    // or the dock at the foot of the screen), where the View Transitions API exists and motion
    // is welcome; elsewhere it is the short crossfade it always was.
    const doc = document as Document & { startViewTransition?: (cb: () => void) => { ready: Promise<void> } };
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (doc.startViewTransition && !reduce) {
      const x = lastPress?.x ?? window.innerWidth / 2;
      const y = lastPress?.y ?? window.innerHeight - 40;
      root.style.setProperty("--fx-vt-x", `${x}px`);
      root.style.setProperty("--fx-vt-y", `${y}px`);
      root.style.setProperty("--fx-vt-r", `${Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))}px`);
      root.setAttribute("data-fx-vt", "");
      doc.startViewTransition(() => apply(mode)).ready.finally(() => window.setTimeout(() => root.removeAttribute("data-fx-vt"), 700));
    } else {
      root.classList.add("theme-switching");
      window.setTimeout(() => root.classList.remove("theme-switching"), 200);
      apply(mode);
    }
    window.dispatchEvent(new CustomEvent("kitui:theme", { detail: mode }));
    try {
      localStorage.setItem("theme", mode);
    } catch {
      // As above.
    }
  };

  const toggleTheme = () => setThemeMode(theme === "dark" ? "light" : "dark");

  return { theme, setThemeMode, toggleTheme, mounted };
}
