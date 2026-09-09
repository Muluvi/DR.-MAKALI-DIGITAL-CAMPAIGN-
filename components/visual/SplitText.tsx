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

interface CyclerProps {
  words: string[];
  /** Milliseconds each word holds before the next arrives. */
  interval?: number;
  className?: string;
}

/**
 * Cycling word swap. The clip is a fixed 1.16em, so the line the cycler sits in never reflows as
 * words of different lengths pass through it.
 */
export function WordCycler({ words, interval = 2600, className = "" }: CyclerProps) {
  const [index, setIndex] = useState(0);
  const [ref, inView] = useInView<HTMLSpanElement>({ once: false, amount: 0.5 });
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!inView || reduce || words.length < 2) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % words.length), interval);
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
