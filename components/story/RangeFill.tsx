"use client";

import { useEffect } from "react";

/**
 * Keeps every range input's filled track (--fill, app/story.css) in step with its value, on
 * every page, including sliders that appear later inside a tool that has just been opened.
 */
export function RangeFill() {
  useEffect(() => {
    const set = (el: HTMLInputElement) => {
      const min = Number(el.min || 0), max = Number(el.max || 100), v = Number(el.value);
      el.style.setProperty("--fill", `${max > min ? ((v - min) / (max - min)) * 100 : 0}%`);
    };
    const all = () => document.querySelectorAll<HTMLInputElement>('input[type="range"]').forEach(set);
    const onInput = (e: Event) => { const t = e.target as HTMLInputElement; if (t?.type === "range") set(t); };
    all();
    document.addEventListener("input", onInput, true);
    let frame = 0;
    const mo = new MutationObserver(() => { if (!frame) frame = requestAnimationFrame(() => { frame = 0; all(); }); });
    mo.observe(document.body, { childList: true, subtree: true });
    return () => { document.removeEventListener("input", onInput, true); mo.disconnect(); cancelAnimationFrame(frame); };
  }, []);
  return null;
}
