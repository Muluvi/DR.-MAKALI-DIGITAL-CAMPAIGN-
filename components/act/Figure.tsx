"use client";

import React, { useId, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { Table2 } from "lucide-react";

import { useReducedMotionSafe } from "../../hooks/use-reduced-motion-safe";

/**
 * The frame every act chart sits in.
 *
 * Three jobs, all of them accessibility rather than decoration:
 *
 *   1. A title and a standfirst, so the chart says what it is without a legend having to.
 *   2. A table-view twin behind a toggle. No value in this act is reachable only by hovering
 *      a mark — the table is the WCAG-clean equivalent of every figure, and it is also what a
 *      reader on a phone will actually use to read a precise number.
 *   3. One entrance, on first approach, honouring reduced motion.
 *
 * The source line stays visible rather than living in the toggle: provenance is the thing
 * this proposal is arguing with, so it never hides.
 */
export function Figure({
  kicker,
  title,
  standfirst,
  source,
  table,
  children,
  full = false,
}: {
  kicker?: string;
  title: string;
  standfirst?: string;
  source: string;
  /** The same numbers as the chart, as rows. Required — every figure has a table twin. */
  table: { head: string[]; rows: (string | number)[][] };
  children: React.ReactNode;
  /** Break out of the reading measure for a chart that needs the width. */
  full?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-8% 0px -8% 0px" });
  const reduce = useReducedMotionSafe();
  const [showTable, setShowTable] = useState(false);
  const tableId = useId();

  return (
    <motion.figure
      ref={ref}
      initial={reduce ? false : { opacity: 0, y: 16 }}
      animate={inView || reduce ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className={`act-figure ${full ? "act-figure-full" : ""} my-12 md:my-16`}
    >
      <figcaption className="mb-6">
        {kicker ? <p className="act-kicker mb-2">{kicker}</p> : null}
        <h3
          className="font-sans font-bold leading-tight"
          style={{ color: "var(--act-text)", fontSize: "clamp(1.125rem, 1rem + 0.6vw, 1.4rem)" }}
        >
          {title}
        </h3>
        {standfirst ? (
          <p
            className="mt-2 leading-relaxed"
            style={{ color: "var(--act-dim)", fontFamily: "var(--font-serif)", fontSize: "0.95rem" }}
          >
            {standfirst}
          </p>
        ) : null}
      </figcaption>

      {children}

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <p className="font-sans text-[0.6875rem] font-semibold" style={{ color: "var(--act-dim)" }}>
          {source}
        </p>
        <button
          type="button"
          onClick={() => setShowTable((v) => !v)}
          aria-expanded={showTable}
          aria-controls={tableId}
          className="inline-flex items-center gap-1.5 font-sans text-[0.6875rem] font-bold uppercase tracking-[0.1em] rounded-full px-3 py-2 min-h-[44px] transition-colors"
          style={{ color: "var(--act-dim)", border: "1px solid var(--act-hair)" }}
        >
          <Table2 size={12} aria-hidden="true" />
          {showTable ? "Hide the numbers" : "See the numbers"}
        </button>
      </div>

      <div id={tableId} hidden={!showTable} className="mt-4">
        <div className="act-tablescroll">
          <table className="act-table">
            <thead>
              <tr>
                {table.head.map((h) => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {table.rows.map((r, i) => (
                <tr key={i}>
                  {r.map((cell, j) => (
                    <td key={j} style={j > 0 ? { fontVariantNumeric: "tabular-nums" } : undefined}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.figure>
  );
}
