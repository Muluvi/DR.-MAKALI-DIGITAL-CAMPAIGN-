"use client";

import { useId, useMemo, useState, type ReactNode } from "react";

import { useInView } from "../../hooks/use-in-view";

/* ------------------------------------------------------------------ numbers */

/** Tabular, abbreviated, and the same everywhere — dashboards read wrong when they disagree. */
export function fmt(n: number, pct = false): string {
  if (!Number.isFinite(n)) return "—";
  if (pct) return `${Number.isInteger(n) ? n : n.toFixed(1)}%`;
  const abs = Math.abs(n);
  if (abs >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(abs >= 10_000_000_000 ? 0 : 1)}bn`;
  if (abs >= 1_000_000) return `${(n / 1_000_000).toFixed(abs >= 10_000_000 ? 0 : 2)}m`;
  if (abs >= 10_000) return `${Math.round(n / 1_000)}k`;
  return n.toLocaleString("en-KE", { maximumFractionDigits: Number.isInteger(n) ? 0 : 1 });
}

/* -------------------------------------------------------------------- frame */

/**
 * The frame every derived figure sits in.
 *
 * Deliberately almost nothing: a hairline, a caption line and the figure. 272 of these run down
 * one page, so anything the frame spends — a border, a shadow, a fill — is spent 272 times, and
 * the handbook's squint test fails the moment the frames start competing with the figures.
 *
 * `content-visibility` is set on the frame rather than on the section, because these are the
 * elements that are cheap to skip and expensive to lay out.
 */
export function VizFrame({
  caption,
  note,
  children,
  wide = false,
}: {
  caption: string;
  note?: string;
  children: ReactNode;
  wide?: boolean;
}) {
  const [ref, inView] = useInView<HTMLElement>({ amount: 0.12, margin: "120px 0px" }); // verify-figures-ignore — viewport fraction, not a campaign figure
  return (
    <figure
      ref={ref}
      data-viz
      data-in-view={inView ? "true" : "false"}
      className={`pv not-prose my-5 sm:my-6 ${wide ? "pv--wide" : ""}`}
    >
      <figcaption className="pv__cap">
        <span className="pv__cap-rule" aria-hidden="true" />
        <span className="pv__cap-text">{caption}</span>
      </figcaption>
      <div className="pv__body">{children}</div>
      {note ? <p className="pv__note">{note}</p> : null}
    </figure>
  );
}

/* ------------------------------------------------------------- bar geometry */

/** A width as a percentage of the largest value, floored so the smallest bar is still a bar. */
export function share(value: number, max: number): number {
  if (!max || !Number.isFinite(value)) return 0;
  return Math.max(2.5, Math.min(100, (Math.abs(value) / Math.abs(max)) * 100));
}

/* ----------------------------------------------------------------- disclose */

/**
 * Tap to read the rest.
 *
 * Every derived figure is built from a clause of the document, and a clause truncated to fit a
 * bar label is not evidence. The full text is always one tap away and always in the DOM, so the
 * printed page and a screen reader get it whether or not anyone opened it.
 */
export function Disclose({ summary, children }: { summary: ReactNode; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <div className="pv-disclose">
      <button
        type="button"
        className="pv-disclose__btn"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((v) => !v)}
      >
        {summary}
        <span className="pv-disclose__chev" aria-hidden="true" data-open={open} />
      </button>
      <div id={id} className="pv-disclose__body" data-open={open}>
        {children}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------- glyph */

/**
 * The 12px mark that stands for a visual kind.
 *
 * It is what the chapter map draws beside each part, so a reader scrolling into a sub-section can
 * see that three of its parts are comparisons and one is a target before reading a word.
 */
export function KindGlyph({ kind, className = "" }: { kind: string; className?: string }) {
  const paths: Record<string, ReactNode> = useMemo(
    () => ({
      stats: <><rect x="1" y="6" width="3" height="5" /><rect x="6.5" y="3" width="3" height="8" /><rect x="12" y="1" width="3" height="10" /></>,
      bars: <><rect x="1" y="2" width="13" height="2.2" /><rect x="1" y="6.9" width="9" height="2.2" /><rect x="1" y="11.8" width="5" height="2.2" /></>,
      gauge: <path d="M2 12a6 6 0 1 1 12 0" fill="none" strokeWidth="2.2" stroke="currentColor" strokeLinecap="round" />,
      donut: <><circle cx="8" cy="8" r="5.4" fill="none" strokeWidth="2.6" stroke="currentColor" opacity=".3" /><path d="M8 2.6a5.4 5.4 0 0 1 5.4 5.4" fill="none" strokeWidth="2.6" stroke="currentColor" strokeLinecap="round" /></>,
      waffle: <>{[0, 1, 2].map((r) => [0, 1, 2].map((c) => <rect key={`${r}${c}`} x={1 + c * 5} y={1 + r * 5} width="3.4" height="3.4" opacity={r * 3 + c < 5 ? 1 : 0.28} />))}</>,
      waterfall: <><rect x="1" y="9" width="3" height="5" /><rect x="5.5" y="6" width="3" height="5" /><rect x="10" y="3" width="3" height="5" /></>,
      bullet: <><rect x="1" y="6" width="13" height="4" opacity=".28" /><rect x="1" y="6" width="6" height="4" /><rect x="10" y="4" width="1.6" height="8" /></>,
      stepper: <><circle cx="3" cy="3" r="2" /><circle cx="3" cy="8" r="2" /><circle cx="3" cy="13" r="2" /><rect x="7" y="2.2" width="8" height="1.6" /><rect x="7" y="7.2" width="6" height="1.6" /><rect x="7" y="12.2" width="7" height="1.6" /></>,
      timeline: <><rect x="7.2" y="1" width="1.6" height="14" opacity=".35" /><circle cx="8" cy="3.5" r="2.4" /><circle cx="8" cy="9" r="2.4" /><circle cx="8" cy="13.6" r="1.8" opacity=".5" /></>,
      playbook: <><rect x="1" y="2" width="5.5" height="4" /><rect x="9.5" y="10" width="5.5" height="4" /><path d="M6.5 4h3.5v8h-.6" fill="none" strokeWidth="1.4" stroke="currentColor" /></>,
      matrix: <>{[0, 1, 2].map((r) => [0, 1, 2].map((c) => <rect key={`${r}${c}`} x={1 + c * 5} y={1 + r * 5} width="3.4" height="3.4" opacity={0.3 + ((r + c) % 3) * 0.35} />))}</>,
      quadrant: <><rect x="1" y="1" width="14" height="14" fill="none" strokeWidth="1.2" stroke="currentColor" opacity=".4" /><path d="M8 1v14M1 8h14" strokeWidth="1" stroke="currentColor" opacity=".3" /><circle cx="11.5" cy="4.5" r="2" /></>,
      hub: <><circle cx="8" cy="8" r="2.6" /><circle cx="8" cy="2" r="1.5" opacity=".6" /><circle cx="13.5" cy="10" r="1.5" opacity=".6" /><circle cx="2.5" cy="10" r="1.5" opacity=".6" /></>,
      checklist: <><path d="M1 4.5l2 2 3.4-3.6" fill="none" strokeWidth="1.8" stroke="currentColor" strokeLinecap="round" /><path d="M1 11.5l2 2 3.4-3.6" fill="none" strokeWidth="1.8" stroke="currentColor" strokeLinecap="round" /><rect x="8.6" y="3.6" width="6.4" height="1.6" /><rect x="8.6" y="10.6" width="6.4" height="1.6" /></>,
      chapter: <><rect x="1" y="1.5" width="6" height="13" opacity=".35" /><rect x="8.6" y="1.5" width="6.4" height="5.6" /><rect x="8.6" y="8.9" width="6.4" height="5.6" opacity=".55" /></>,
      quote: <><path d="M2 12V7.5C2 4.8 3.6 3 6 2.6v2C4.8 5 4.2 5.8 4.2 7H6V12z" /><path d="M9 12V7.5C9 4.8 10.6 3 13 2.6v2c-1.2.4-1.8 1.2-1.8 2.4H13V12z" /></>,
      contrast: <><rect x="1" y="7" width="14" height="2" opacity=".3" /><circle cx="4.5" cy="8" r="3" /><circle cx="12" cy="8" r="2" opacity=".5" /></>,
      statement: <><rect x="1" y="3" width="14" height="2.4" /><rect x="1" y="7.2" width="11" height="2.4" opacity=".55" /><rect x="1" y="11.4" width="7" height="2.4" opacity=".3" /></>,
      shape: <><circle cx="3" cy="8" r="2.2" /><circle cx="12" cy="3.5" r="1.8" opacity=".6" /><circle cx="12" cy="12.5" r="1.8" opacity=".6" /><path d="M5 7.2l5.4-2.6M5 8.8l5.4 2.6" strokeWidth="1.2" stroke="currentColor" fill="none" /></>,
    }),
    []
  );
  return (
    <svg viewBox="0 0 16 16" width="13" height="13" fill="currentColor" aria-hidden="true" className={`shrink-0 ${className}`}>
      {paths[kind] ?? paths.statement}
    </svg>
  );
}
