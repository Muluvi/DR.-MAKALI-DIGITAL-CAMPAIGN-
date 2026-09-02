import type React from "react";

/**
 * The shape of Section 5's Operational Commitments.
 *
 * Pure, no React rendering, no "use client" — MarkdownViewer parses on the server, so the
 * detection helpers have to be callable there. Only the presentation half (CommitmentFields)
 * is a client component.
 */

/** The six field labels §5 uses, keyed by the role each plays in the layout. */
export const COMMITMENT_FIELDS = {
  baseline: "baseline figure",
  target: "target figure",
  deadline: "deadline",
  owner: "named owner",
  traceability: "traceability",
  escalation: "escalation trigger",
} as const;

export type CommitmentFieldKey = keyof typeof COMMITMENT_FIELDS;

export interface CommitmentField {
  key: CommitmentFieldKey | null;
  /** The label as printed, e.g. "Named Owner". */
  label: string;
  /** The list item's own children with the leading `**Label:**` removed. */
  value: React.ReactNode;
}

/** Map a label as printed ("Named Owner:") to the field it is, or null if it is not one of them. */
export function commitmentFieldKey(label: string): CommitmentFieldKey | null {
  const norm = label.toLowerCase().replace(/:$/, "").trim();
  const hit = (Object.entries(COMMITMENT_FIELDS) as [CommitmentFieldKey, string][]).find(
    ([, v]) => v === norm
  );
  return hit ? hit[0] : null;
}

/**
 * True when a labelled list is one commitment's field block rather than an ordinary bullet list.
 *
 * Four of the six known labels is the bar. It is deliberately strict: a list that merely happens
 * to start its items with bold text keeps the bullet rendering it has always had.
 */
export function isCommitmentFieldList(labels: string[]): boolean {
  const known = new Set<string>(Object.values(COMMITMENT_FIELDS));
  return labels.filter((l) => known.has(l.toLowerCase().replace(/:$/, "").trim())).length >= 4;
}
