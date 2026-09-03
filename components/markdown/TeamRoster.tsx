"use client";

import React, { useRef } from "react";
import { motion, useInView } from "motion/react";

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
 * The Firefly appendix's operating model, grouped by when each role switches on.
 *
 * The table's third column is the one a reader is actually asking about — who is standing
 * cost from day one, and who only arrives on a phase or a trigger. In a ten-row table that
 * answer is spread down a column and has to be assembled by eye.
 *
 * Grouping reads the leading token of the activation string as printed ("Permanent",
 * "Phase −1", "Phase 1", "Phase 2"). Each card still shows its full activation text verbatim,
 * so the grouping is navigation, never a restatement — and a row whose activation does not
 * begin with a known token falls into "Other" rather than being forced into a bucket.
 */

const GROUPS: { key: string; label: string; note: string; test: (activation: string) => boolean }[] = [
  {
    key: "permanent",
    label: "Standing core",
    note: "Permanent",
    test: (a) => a.toLowerCase().startsWith("permanent"),
  },
  {
    key: "phase-minus-1",
    label: "From Phase −1",
    note: "The nomination window",
    test: (a) => a.toLowerCase().startsWith("phase −1") || a.toLowerCase().startsWith("phase -1"),
  },
  {
    key: "phase-1",
    label: "From Phase 1",
    note: "Post-nomination",
    test: (a) => a.toLowerCase().startsWith("phase 1"),
  },
  {
    key: "other",
    label: "On trigger",
    note: "Activated by event or threshold",
    test: () => true,
  },
];

export function TeamRoster({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotionSafe();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, VIEWPORT);

  const top = React.Children.toArray(children) as React.ReactElement[];
  const tbody = top.find((c) => c?.type === "tbody");
  if (!tbody) return <div className="overflow-x-auto border border-line rounded-2xl my-4">{children}</div>;

  const rows = cellsOfType((tbody.props as { children?: React.ReactNode }).children, "tr").map((row) => {
    const cells = cellsOfType((row.props as { children?: React.ReactNode }).children, "td");
    const get = (i: number) => (cells[i] ? (cells[i].props as { children?: React.ReactNode }).children : null);
    return { role: get(0), responsibility: get(1), activation: get(2), activationText: deepText(get(2)) };
  });
  if (rows.length === 0) {
    return <div className="overflow-x-auto border border-line rounded-2xl my-4">{children}</div>;
  }

  const grouped = GROUPS.map((g) => ({
    ...g,
    members: rows.filter(
      (r) => GROUPS.find((candidate) => candidate.test(r.activationText))?.key === g.key
    ),
  })).filter((g) => g.members.length > 0);

  return (
    <motion.div
      ref={ref}
      className="not-prose my-6 space-y-4 print-avoid-break"
      initial={reduce ? false : "hidden"}
      animate={inView || reduce ? "visible" : "hidden"}
      variants={cascade(STAGGER.normal)}
    >
      {grouped.map((g) => (
        <motion.div key={g.key} variants={riseIn}>
          <div className="flex items-baseline gap-2 mb-2 pb-1.5 border-b border-line/50">
            <span className="t-label font-black uppercase tracking-widest text-accent">{g.label}</span>
            <span className="t-label text-muted">{g.note}</span>
            <span className="t-label text-muted ml-auto tabular-nums">
              {g.members.length} {g.members.length === 1 ? "role" : "roles"}
            </span>
          </div>
          <motion.div className="grid grid-cols-1 sm:grid-cols-2 gap-2" variants={cascade(STAGGER.tight)}>
            {g.members.map((m, i) => (
              <motion.div key={i} variants={riseIn} className="rounded-xl border border-line/60 bg-paper p-3">
                <div className="t-body font-bold text-ink leading-snug">{m.role}</div>
                <div className="t-small text-muted leading-relaxed mt-1">{m.responsibility}</div>
                <div className="t-micro font-mono text-muted/80 mt-2 pt-2 border-t border-line/40">
                  {m.activation}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      ))}
    </motion.div>
  );
}
