"use client";

import React, { useRef } from "react";
import { motion, useInView } from "motion/react";
import { CircleDot, Lock, CheckCircle2 } from "lucide-react";

import { cascade, riseIn, STAGGER, VIEWPORT } from "../../lib/motion";
import { useReducedMotionSafe } from "../../hooks/use-reduced-motion-safe";

function cellsOfType(node: React.ReactNode, type: string): React.ReactElement[] {
  return (React.Children.toArray(node) as React.ReactElement[]).filter((c) => c?.type === type);
}

function deepText(node: React.ReactNode): string {
  if (node === null || node === undefined) return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(deepText).join("");
  if (typeof node === "object" && "props" in (node as object)) {
    const props = (node as { props?: { children?: React.ReactNode; text?: string } }).props;
    if (props?.children !== undefined) return deepText(props.children);
    if (props?.text !== undefined) return String(props.text);
  }
  return "";
}

/**
 * The Firefly appendix's final pre-launch checklist, as a board instead of a 12-row table.
 *
 * This is the one place in the document that says what is actually blocking launch, and it was
 * the flattest thing on the page: three columns of small text where every row looks alike, so
 * the single GATED item reads exactly like the eleven OPEN ones. The appendix runs 1,837 words
 * with almost nothing to look at; this is the section that most deserved an anchor.
 *
 * Cells are reused from the parsed table rather than restated, so the board cannot drift from
 * the checklist. The counts are a tally of those same rows — nothing is asserted about progress
 * that the table does not already say.
 */

/**
 * OPEN is deliberately neutral. Eleven of the twelve controls are simply not done yet, which is
 * the expected state of a pre-launch checklist — colouring them all as alarm buries the one item
 * that is genuinely blocked behind a compliance gate, which is the only thing this board exists
 * to surface.
 */
const STATUS_STYLES: Record<string, { icon: typeof CircleDot; className: string; ring: string }> = {
  GATED: { icon: Lock, className: "text-danger", ring: "border-danger/40 bg-danger/[0.06]" },
  OPEN: { icon: CircleDot, className: "text-muted", ring: "border-line/60 bg-paper" },
  DONE: { icon: CheckCircle2, className: "text-accent", ring: "border-accent/30 bg-accent/[0.04]" },
};

function statusOf(text: string): string {
  const t = text.trim().toUpperCase();
  return t in STATUS_STYLES ? t : "OPEN";
}

export function ReadinessBoard({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotionSafe();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, VIEWPORT);

  const top = React.Children.toArray(children) as React.ReactElement[];
  const thead = top.find((c) => c?.type === "thead");
  const tbody = top.find((c) => c?.type === "tbody");
  if (!tbody) return <div className="overflow-x-auto border border-line rounded-2xl my-4">{children}</div>;

  const headerRow = thead
    ? cellsOfType((thead.props as { children?: React.ReactNode }).children, "tr")[0]
    : undefined;
  const headers = headerRow
    ? cellsOfType((headerRow.props as { children?: React.ReactNode }).children, "th").map((h) =>
        deepText((h.props as { children?: React.ReactNode }).children).trim()
      )
    : [];

  const rows = cellsOfType((tbody.props as { children?: React.ReactNode }).children, "tr").map((row) => {
    const cells = cellsOfType((row.props as { children?: React.ReactNode }).children, "td");
    const get = (i: number) => (cells[i] ? (cells[i].props as { children?: React.ReactNode }).children : null);
    return { control: get(0), status: statusOf(deepText(get(1))), owner: get(2) };
  });
  if (rows.length === 0) {
    return <div className="overflow-x-auto border border-line rounded-2xl my-4">{children}</div>;
  }

  const tally = rows.reduce<Record<string, number>>((acc, r) => {
    acc[r.status] = (acc[r.status] ?? 0) + 1;
    return acc;
  }, {});
  // Gated first: it is the item that cannot simply be worked through.
  const order = ["GATED", "OPEN", "DONE"].filter((s) => tally[s]);

  return (
    <div ref={ref} className="not-prose my-6 print-avoid-break">
      <div className="flex flex-wrap items-center gap-2 mb-3">
        {order.map((s) => {
          const style = STATUS_STYLES[s];
          const Icon = style.icon;
          return (
            <span
              key={s}
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 ${style.ring}`}
            >
              <Icon size={12} className={`${style.className} shrink-0`} aria-hidden="true" />
              <span className={`t-label font-black tabular-nums ${style.className}`}>{tally[s]}</span>
              <span className="t-micro font-black uppercase tracking-widest text-muted">{s}</span>
            </span>
          );
        })}
        <span className="t-label text-muted ml-auto tabular-nums">
          {rows.length} controls
        </span>
      </div>

      <motion.div
        className="grid grid-cols-1 lg:grid-cols-2 gap-2"
        initial={reduce ? false : "hidden"}
        animate={inView || reduce ? "visible" : "hidden"}
        variants={cascade(STAGGER.tight)}
      >
        {rows.map((r, i) => {
          const style = STATUS_STYLES[r.status];
          const Icon = style.icon;
          return (
            <motion.div
              key={i}
              variants={riseIn}
              className={`rounded-xl border p-3 flex items-start gap-2.5 ${style.ring}`}
            >
              <Icon size={14} className={`${style.className} shrink-0 mt-0.5`} aria-hidden="true" />
              <div className="min-w-0 flex-1">
                <div className="t-body font-semibold text-ink leading-snug">{r.control}</div>
                {r.owner && (
                  <div className="t-label text-muted mt-1">
                    <span className="font-black uppercase tracking-wider t-micro mr-1">
                      {headers[2] || "Owner"}
                    </span>
                    {r.owner}
                  </div>
                )}
              </div>
              <span className={`t-micro font-black uppercase tracking-widest shrink-0 ${style.className}`}>
                {r.status}
              </span>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
