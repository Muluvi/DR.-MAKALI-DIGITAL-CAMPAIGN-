// Campaign stages from §9.1 (the implementation roadmap), one colour per
// stage, reused across the timeline, phase-scoped charts and section headers.
export interface Phase {
  id: string;
  label: string;
  window: string;
  colorVar: string; // CSS custom property name, e.g. "--phase-1"
}

export const PHASES: Phase[] = [
  { id: "neg1", label: "Nomination sprint", window: "Weeks 1–6", colorVar: "--phase-neg1" },
  { id: "0", label: "Set-up", window: "Weeks 4–10 · Instrumentation", colorVar: "--phase-0" },
  { id: "1", label: "Awareness", window: "Oct–Dec 2026 · Awareness & Community", colorVar: "--phase-1" },
  { id: "2", label: "Persuasion", window: "Jan–Mar 2027 · Engagement & Persuasion", colorVar: "--phase-2" },
  { id: "3", label: "Turnout", window: "Apr–Aug 2027 · Mobilisation & GOTV", colorVar: "--phase-3" },
];

export function phaseColor(id: string): string {
  const phase = PHASES.find((p) => p.id === id);
  return `var(${phase?.colorVar ?? "--color-accent"})`;
}
