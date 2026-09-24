"use client";

import { useEffect } from "react";

/**
 * The register's motion, and nothing else (brief §I). Every figure is complete in the HTML; this
 * only decides whether a reader sees it arrive.
 *
 *   Tier 1, still: scripts off, a low-end device (four cores or fewer, 2 GB or less), or Save-Data
 *              on. No class is set, so nothing moves.
 *   Tier 2, draw-in: bars below the fold grow once as they enter view. Reduced motion substitutes
 *              a short fade for the growth rather than dropping the cue (app/register.css).
 *   Cover count-up: the four cover figures count up once, and only when reduced motion is off.
 *              The number in the HTML is the final value, and it is restored exactly at the end.
 *
 * No loop, no scroll-jacking; print draws everything at once.
 */
export function RegisterMotion() {
  useEffect(() => {
    const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
    const lowEnd = (nav.hardwareConcurrency ?? 8) <= 4 || (nav.deviceMemory ?? 8) <= 2 || nav.connection?.saveData === true;
    if (lowEnd || typeof IntersectionObserver === "undefined") return;

    const root = document.documentElement;
    root.classList.add("motion-ok");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const figures = [...document.querySelectorAll<HTMLElement>(".rf")];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const el = e.target as HTMLElement;
          el.classList.replace("is-pending", "is-drawn");
          io.unobserve(el);
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    for (const f of figures) {
      // A figure already on screen stays as it is: animating what the reader is looking at would
      // redraw it under their eyes.
      if (f.getBoundingClientRect().top < window.innerHeight) continue;
      f.classList.add("is-pending");
      io.observe(f);
    }

    const frames: number[] = [];
    if (!reduce) {
      for (const el of document.querySelectorAll<HTMLElement>("#fig-cover-map [data-count-to]")) {
        const final = el.textContent ?? "";
        const target = Number(el.dataset.countTo);
        if (!Number.isFinite(target)) continue;
        el.setAttribute("aria-label", final);
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / 900);
          const eased = 1 - Math.pow(1 - t, 3);
          el.textContent = t < 1 ? Math.round(target * eased).toLocaleString("en-US") : final;
          if (t < 1) frames.push(requestAnimationFrame(tick));
        };
        frames.push(requestAnimationFrame(tick));
      }
    }

    const drawAll = () => figures.forEach((f) => f.classList.replace("is-pending", "is-drawn"));
    window.addEventListener("beforeprint", drawAll);
    return () => {
      io.disconnect();
      frames.forEach(cancelAnimationFrame);
      window.removeEventListener("beforeprint", drawAll);
    };
  }, []);
  return null;
}
