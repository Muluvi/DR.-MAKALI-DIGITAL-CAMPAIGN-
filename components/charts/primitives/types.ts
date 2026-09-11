/**
 * Shared shapes for the hand-rolled chart primitives.
 *
 * These replaced Recharts (docs/VISUAL-FEATURES.md F-30). The measured cost of Recharts as it was
 * imported here was 123 KB gzipped — 82% of the whole runtime-JS budget in docs/TRIAGE.md §5.1 —
 * for bar, line and scatter charts. The primitives below are a few hundred lines of TSX with no
 * dependency at all.
 */

/** One mark on a chart, and everything the inspect panel needs to describe it. */
export interface Mark {
  /** Stable key, and the id an onSelect handler receives. */
  id: string;
  /** The label printed against the mark. */
  label: string;
  /** The plotted magnitude. */
  value: number;
  /** The value as it should be read — "1.2m", "KSh 4.3bn", "37.4%". Falls back to `value`. */
  display?: string;
  /** Fill. Any CSS colour, including a var(). */
  color?: string;
  /** Secondary line in the inspect panel. */
  sub?: string;
  /** The sentence behind the mark. This is the prose the visual is holding — F-17. */
  note?: string;
}
