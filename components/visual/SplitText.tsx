"use client";

import { useEffect, useMemo, useState } from "react";
import { useInView } from "../../hooks/use-in-view";
import { useReducedMotion } from "../../hooks/use-media-query";

type Unit = "line" | "word" | "char";

interface SplitTextProps {
  children: string;
  /** What gets its own animated span. Lines need `\n` in the source string. */
  by?: Unit;
  /** Milliseconds between units. */
  stagger?: number;
  delay?: number;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span" | "div";
}

/**
 * Line, word and character reveal.
 *
 * The accessibility half is the part that matters and the part most implementations get wrong: a
 * headline split into forty `<span>`s is read by a screen reader as forty fragments, and by a
 * translation engine as forty untranslatable tokens. So the real string is kept in one visually
 * hidden node that carries the semantics, and the split spans are `aria-hidden` decoration
 * layered over it.
 *
 * `by="line"` masks each line with `overflow: hidden`, so the line rises out of nothing rather
 * than fading in place — the difference between a reveal and a fade.
 */
export function SplitText({
  children,
  by = "word",
  stagger,
  delay = 0,
  className = "",
  as: Tag = "span",
}: SplitTextProps) {
  const [ref, inView] = useInView<HTMLElement>({ amount: 0.35 });

  const units = useMemo(() => {
    if (by === "line") return children.split("\n");
    if (by === "char") return Array.from(children);
    // Keep the trailing space attached to each word so the joined line still has its spacing
    // without needing a margin on every span.
    return children.split(/(\s+)/).filter((s) => s.length > 0);
  }, [children, by]);

  const gap = stagger ?? (by === "char" ? 22 : by === "word" ? 42 : 90);

  return (
    <Tag ref={ref as React.Ref<never>} className={className}>
 {/* The accessible copy. One node, the real string, never split. */}
      <span className="sr-only">{children}</span>

      <span aria-hidden="true" style={{ "--fx-split-stagger": `${gap}ms`, "--fx-delay": `${delay}ms` } as React.CSSProperties}>
        {units.map((unit, i) =>
          by === "line" ? (
            <span key={i} className={`fx-split-line ${inView ? "" : "fx-preveal"}`}>
              <span style={{ "--fx-i": i } as React.CSSProperties}>{unit}</span>
            </span>
          ) : (
            <span key={i} className={`${by === "char" ? "fx-split-char" : "fx-split-word"} ${inView ? "" : "fx-preveal"}`}>
              <span style={{ "--fx-i": i } as React.CSSProperties}>{unit === " " ? " " : unit}</span>
            </span>
          )
        )}
      </span>
    </Tag>
  );
}

interface TypewriterProps {
  text: string;
  /** Milliseconds for the whole string. */
  duration?: number;
  delay?: number;
  className?: string;
}

/**
 * Typewriter, done as a CSS `steps()` width animation rather than by appending characters in
 * state — one animation on one element instead of N re-renders, and the full string is in the DOM
 * from the first frame, so it is selectable, searchable and readable by assistive tech throughout.
 */
export function Typewriter({ text, duration = 2200, delay = 0, className = "" }: TypewriterProps) {
  const [ref, inView] = useInView<HTMLSpanElement>({ amount: 0.6 });
  return (
    <span ref={ref} className={className}>
 <span className="sr-only">{text}</span>
      <span
        aria-hidden="true"
        className={inView ? "fx-typewriter" : "invisible"}
        style={
          {
            "--fx-type-dur": `${duration}ms`,
            "--fx-type-steps": text.length,
            "--fx-delay": `${delay}ms`,
          } as React.CSSProperties
        }
      >
        {text}
      </span>
    </span>
  );
}

interface ScrambleProps {
  text: string;
  className?: string;
  /** Milliseconds per character before it settles. */
  speed?: number;
}

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&/\\";

/**
 * Text scramble / decode.
 *
 * Confined to short labels — a decode effect on a sentence is unreadable, and on a figure it is
 * dishonest, because for most of its run it is displaying numbers that are not the number.
 * Nothing in this document scrambles a value; only headings and status words.
 */
export function Scramble({ text, className = "", speed = 34 }: ScrambleProps) {
  const [ref, inView] = useInView<HTMLSpanElement>({ amount: 0.6 });
  const reduce = useReducedMotion();
  // Seeded with the real string, so the reduced-motion path and the pre-viewport state are both
  // already correct and the effect never has to set state to reach them.
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    if (!inView || reduce) return;

    let settled = 0;
    const id = window.setInterval(() => {
      settled += 1;
      if (settled > text.length) {
        setDisplay(text);
        window.clearInterval(id);
        return;
      }
      setDisplay(
        text
          .split("")
          .map((ch, i) => (i < settled || ch === " " ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]))
          .join("")
      );
    }, speed);

    return () => window.clearInterval(id);
  }, [inView, text, speed, reduce]);

  return (
    <span ref={ref} className={className}>
 <span className="sr-only">{text}</span>
      <span aria-hidden="true" className="tabular-nums">{display}</span>
    </span>
  );
}

interface CyclerProps {
  words: string[];
  /** Milliseconds each word holds before the next arrives. */
  interval?: number;
  className?: string;
}

/**
 * Cycling word swap, one pass. The clip is a fixed 1.16em, so the line the cycler sits in never
 * reflows as words of different lengths pass through it.
 *
 * It used to loop for as long as it was on screen, which meant a re-render every 2.6 seconds,
 * for the whole time a reader spent at the top of the page, on a mid-range Android, saying
 * nothing after the first pass — the reader has seen all nine section names by then and the
 * tenth showing of "The decision" is not information. One pass through the list, then it rests
 * on the last item.
 */
export function WordCycler({ words, interval = 2600, className = "" }: CyclerProps) {
  const [index, setIndex] = useState(0);
  const [ref, inView] = useInView<HTMLSpanElement>({ once: false, amount: 0.5 });
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!inView || reduce || words.length < 2) return;
    const id = window.setInterval(
      () => setIndex((i) => (i + 1 >= words.length ? (window.clearInterval(id), i) : i + 1)),
      interval,
    );
    return () => window.clearInterval(id);
  }, [inView, interval, words.length, reduce]);

  return (
    <span ref={ref} className={`fx-cycler ${className}`}>
      {words.map((word, i) => (
        <span
          key={word}
          data-state={i === index ? "in" : i === (index - 1 + words.length) % words.length ? "out" : "next"}
          aria-hidden={i === index ? undefined : "true"}
        >
          {word}
        </span>
      ))}
    </span>
  );
}
