"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionTemplate, useScroll, useSpring, useTransform } from "motion/react";
import { ArrowUp, Moon, Sun } from "lucide-react";

import { useTheme } from "../../lib/useTheme";
import { useReducedMotionSafe } from "../../hooks/use-reduced-motion-safe";

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
  const [showTop, setShowTop] = useState(false);
  const reduce = useReducedMotionSafe();

  // Scroll-linked ambience. The ground carries a faint wash that migrates from the party blue
  // at the top of the act to the earth red by its end, and drifts across the viewport as it
  // goes — so the closing evidence scenes do not sit on an identical black to the opening
  // terrain ones. Hooks run unconditionally; reduced motion is handled by not painting the
  // layer, never by skipping the hook.
  const tintX = useTransform(scrollYProgress, [0, 1], ["18%", "78%"]);
  const tintColor = useTransform(
    scrollYProgress,
    [0, 0.55, 1],
    [
      "color-mix(in oklch, var(--act-blue) 13%, transparent)",
      "color-mix(in oklch, var(--act-blue) 8%, transparent)",
      "color-mix(in oklch, var(--act-ember) 11%, transparent)",
    ],
  );
  const tint = useMotionTemplate`radial-gradient(48rem 40rem at ${tintX} 42%, ${tintColor}, transparent 72%)`;

  useEffect(() => {
    const unsub = scrollYProgress.on("change", (v) => setShowTop(v > 0.08));
    return () => unsub();
  }, [scrollYProgress]);

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
    <div className="act act-grain relative">
      {/* The scroll-linked environmental wash, beneath everything the reader looks at. */}
      {reduce ? null : (
        <motion.div
          aria-hidden="true"
          className="fixed inset-0 pointer-events-none z-0"
          style={{ backgroundImage: tint }}
        />
      )}

      <motion.div
        aria-hidden="true"
        className="fixed top-0 left-0 right-0 h-[2px] origin-left z-50"
        style={{ scaleX: progress, background: "var(--act-blue)" }}
      />

      {/* Phone navigation: dots rather than a labelled rail, because forty pixels of a 380px
          viewport cannot carry ten words and the content at the same time. Each dot is a
          44px touch target with a 6px visible mark inside it. */}
      <nav
        aria-label="Act contents"
        className="lg:hidden fixed right-1 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center"
      >
        {chapters.map((c) => {
          const on = c.id === active;
          return (
            <a
              key={c.id}
              href={`#${c.id}`}
              aria-label={c.label}
              aria-current={on ? "true" : undefined}
              className="grid place-items-center w-11 h-7"
            >
              <span
                className="rounded-full transition-all duration-300"
                style={{
                  width: on ? 7 : 5,
                  height: on ? 7 : 5,
                  background: on ? "var(--act-blue)" : "var(--act-hair)",
                }}
              />
            </a>
          );
        })}
      </nav>

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

      <AnimatePresence>
        {showTop ? (
          <motion.a
            href="#top"
            initial={reduce ? false : { opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.25 }}
            className="fixed right-4 bottom-5 z-40 grid place-items-center h-11 w-11 rounded-full backdrop-blur"
            style={{
              background: "color-mix(in oklch, var(--act-raise) 85%, transparent)",
              border: "1px solid var(--act-hair)",
              color: "var(--act-dim)",
            }}
            aria-label="Back to the top of the act"
          >
            <ArrowUp size={16} />
          </motion.a>
        ) : null}
      </AnimatePresence>

      <div id="top" />
      {children}
    </div>
  );
}
