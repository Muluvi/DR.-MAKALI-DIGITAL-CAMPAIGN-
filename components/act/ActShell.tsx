"use client";

import React, { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { Moon, Sun } from "lucide-react";

import { useTheme } from "../../lib/useTheme";

export interface ChapterMark {
  id: string;
  label: string;
}

/**
 * The chrome around an act.
 *
 * Everything the document put in permanent view — nineteen tabs, a section navigator, a reading
 * settings sheet, a print button, a focus toggle — is gone. What is left is the smallest set that
 * answers the two questions a reader of a long scroll actually asks: how far in am I, and how do
 * I get back to the part about the numbers.
 *
 * The chapter rail is desktop-only and hover-quiet. On a phone it would be a permanent overlay on
 * a 380px viewport competing with the content for the same forty pixels, so the phone gets the
 * progress hairline alone and navigates by scrolling, which is what a phone reader does anyway.
 */
export function ActShell({
  children,
  chapters,
}: {
  children: React.ReactNode;
  chapters: ChapterMark[];
}) {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 260, damping: 40, restDelta: 0.001 });
  const { theme, setThemeMode, mounted } = useTheme();
  const [active, setActive] = useState<string>(chapters[0]?.id ?? "");

  // The real client width, published as a custom property.
  //
  // Anything that breaks out of the reading measure has to be clamped against the width the page
  // actually has, not 100vw — on a desktop with a classic scrollbar those differ by ~15px, and
  // clamping against 100vw puts a horizontal scroll on the whole document. Set once and on
  // resize, from documentElement.clientWidth, which excludes the scrollbar by definition.
  useEffect(() => {
    const publish = () => {
      document.documentElement.style.setProperty(
        "--act-vw",
        `${document.documentElement.clientWidth}px`,
      );
    };
    publish();
    window.addEventListener("resize", publish);
    return () => window.removeEventListener("resize", publish);
  }, []);

  useEffect(() => {
    const sections = chapters
      .map((c) => document.getElementById(c.id))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;

    // Whichever marked section most recently crossed the upper third of the viewport is the one
    // the reader is in. Cheaper and steadier than an IntersectionObserver ratio race between
    // sections of wildly different heights.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-33% 0px -60% 0px", threshold: 0 },
    );
    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [chapters]);

  const isDark = theme === "dark";

  return (
    <div className="act relative">
      <motion.div
        aria-hidden="true"
        className="fixed top-0 left-0 right-0 h-[2px] origin-left z-50"
        style={{ scaleX: progress, background: "var(--act-blue)" }}
      />

      <nav
        aria-label="Act contents"
        className="hidden lg:flex fixed left-6 top-1/2 -translate-y-1/2 z-40 flex-col gap-3 group"
      >
        {chapters.map((c) => {
          const on = c.id === active;
          return (
            <a
              key={c.id}
              href={`#${c.id}`}
              className="flex items-center gap-3 py-1"
              aria-current={on ? "true" : undefined}
            >
              <span
                className="h-px transition-all duration-300"
                style={{
                  width: on ? "2rem" : "1rem",
                  background: on ? "var(--act-blue)" : "var(--act-hair)",
                }}
              />
              <span
                className="font-sans text-[0.6875rem] uppercase tracking-[0.12em] font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap"
                style={{ color: on ? "var(--act-text)" : "var(--act-dim)" }}
              >
                {c.label}
              </span>
            </a>
          );
        })}
      </nav>

      <button
        type="button"
        onClick={() => setThemeMode(isDark ? "light" : "dark")}
        className="fixed right-4 top-4 z-40 grid place-items-center h-11 w-11 rounded-full backdrop-blur transition-colors"
        style={{
          background: "color-mix(in oklch, var(--act-raise) 80%, transparent)",
          border: "1px solid var(--act-hair)",
          color: "var(--act-dim)",
        }}
        aria-label={isDark ? "Switch to light" : "Switch to dark"}
      >
        {mounted && !isDark ? <Moon size={16} /> : <Sun size={16} />}
      </button>

      {children}
    </div>
  );
}
