"use client";

import { useEffect, useState } from "react";

import type { Mode } from "./chart-tokens";

/**
 * Which palette the charts should use.
 *
 * Dark is the act's default and the value the server renders, so the first paint is never
 * a light chart flashing dark. The theme toggle writes `class="dark"` on <html>, so this
 * observes that attribute rather than the media query — a reader who has chosen light
 * gets light charts regardless of their OS preference.
 */
export function useChartMode(): Mode {
  const [mode, setMode] = useState<Mode>("dark");

  useEffect(() => {
    const read = () => setMode(document.documentElement.classList.contains("dark") ? "dark" : "light");
    read();
    const obs = new MutationObserver(read);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  return mode;
}
