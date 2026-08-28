// Campaign stages from Section 20 (Phased Implementation Plan and KPIs), one colour per
// stage, reused across the timeline, phase-scoped charts and section headers.
export interface Phase {
  id: string;
  label: string;
  window: string;
  colorVar: string; // CSS custom property name, e.g. "--phase-1"
}

export const PHASES: Phase[] = [
  { id: "neg1", label: "Phase −1", window: "Aug–Sep 2026 · Nomination Sprint", colorVar: "--phase-neg1" },
  { id: "0", label: "Phase 0", window: "Sep–Oct 2026 · Audit & Infrastructure", colorVar: "--phase-0" },
  { id: "1", label: "Phase 1", window: "Oct–Dec 2026 · Awareness & Community", colorVar: "--phase-1" },
  { id: "2", label: "Phase 2", window: "Jan–Mar 2027 · Engagement & Persuasion", colorVar: "--phase-2" },
  { id: "3", label: "Phase 3", window: "Apr–Aug 2027 · Mobilisation & GOTV", colorVar: "--phase-3" },
];

export function phaseColor(id: string): string {
  const phase = PHASES.find((p) => p.id === id);
  return `var(${phase?.colorVar ?? "--color-accent"})`;
}
