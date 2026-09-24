/**
 * A figure in the register (brief §N), as data.
 *
 * One spec drives three things, so they cannot disagree: the chart the page draws, the table view
 * inside the figure's <details>, and the CSV scripts/build-csv.ts writes to public/data/<id>.csv.
 * Specs are plain TypeScript with no JSX, so Node can import them at build without React.
 *
 * Every number in a spec is read from lib/data/figures.ts, never typed. A spec that needs a number
 * the data layer does not hold adds it there first.
 */
import type { FigureState, Tier } from "../data/schema";

export type CellState = FigureState;

/** One cell of the table view. `null` renders as the named gap, never as zero or a blank. */
export type Cell = string | number | null;

export interface Column {
  key: string;
  label: string;
  /** Numbers right-align with tabular figures. */
  numeric?: boolean;
}

export interface Row {
  cells: Record<string, Cell>;
  /** The provenance of the row's value, drawn as a pattern as well as stated. */
  state?: CellState;
  /** What closes a needed row. */
  closesWith?: string;
}

export interface SourceRef {
  name: string;
  tier: Tier | null;
  /** When the figure's data is modelled or a target, say so beside the source. */
  state?: CellState;
}

export interface Bar {
  label: string;
  value: number | null;
  state: CellState;
  /** Dr. Mulu, or the finding the title names: the one coloured mark among neutral ones. */
  tone?: "accent" | "rival" | "neutral" | "neg";
  /** Printed value, when it must differ from the plain number (a sign, a unit). */
  display?: string;
  note?: string;
}

export interface Ref { value: number; label: string }

export type Chart =
  | { type: "bars"; bars: Bar[]; max?: number; ref?: Ref; unit?: string }
  | { type: "multiples"; panels: { title: string; bars: Bar[] }[]; max: number; ref?: Ref; unit?: string }
  | { type: "stack"; segments: Bar[]; total: number; totalLabel: string; ref?: Ref; unit?: string }
  | { type: "waterfall"; steps: { label: string; value: number | null; kind: "start" | "delta" | "total"; state: CellState; display?: string }[]; unit?: string }
  | { type: "slope"; left: string; right: string; lines: { label: string; a: number; b: number; tone?: "accent" | "neutral" }[]; unit: string }
  | { type: "funnel"; stages: { label: string; value: number | null; state: CellState; note?: string; display?: string }[]; toggle?: { label: string; stages: { label: string; value: number | null; state: CellState; note?: string; display?: string }[] }; ref?: Ref }
  | { type: "tilemap"; layers: TileLayerId[]; initial: TileLayerId; showWardList?: boolean }
  | { type: "timeline"; events: { date: string; end?: string; label: string; state: CellState; note?: string; whenText?: string; reported?: boolean }[]; from: string; to: string; today?: string }
  | { type: "steps"; steps: { title: string; body: string; when?: string; lane?: string; current?: boolean }[]; lanes?: string[]; horizontal?: boolean }
  | { type: "cards"; cards: { kicker?: string; title: string; body: string; meta?: string; tone?: "accent" | "outside"; links?: { label: string; href: string }[] }[]; columns?: 2 | 3 | 4 }
  | { type: "matrix"; header: string[]; rows: { head: string; cells: string[] }[]; cards?: boolean }
  | { type: "decision"; question: string; rules: { if: string; then: string }[] }
  | { type: "dumbbell"; aLabel: string; bLabel: string; items: { label: string; a: number | null; b: number | null; note?: string }[]; unit: string; max: number }
  | { type: "icons"; items: { label: string; share: number; state: CellState }[] }
  | { type: "gauges"; items: { code: string; title: string; target: string; baseline: string; share?: number | null }[] }
  | { type: "network"; owners: { id: string; name: string }[]; stations: { name: string; owner: string; posture: "placement" | "secondary" | "monitoring" }[] }
  | { type: "house"; roof: string; pillars: { title: string; body: string }[]; foundation: string[] }
  | { type: "balance"; hypothesis: string; supporting: string[]; counter: string[]; test: string[] }
  | { type: "risk"; items: { code: string; label: string; likelihood: 1 | 2 | 3; impact: 1 | 2 | 3 }[]; branches?: { title: string; question: string; rules: { if: string; then: string }[] }[] }
  | { type: "heatmap"; rowLabels: string[]; colLabels: string[]; values: (number | null)[][]; unit: string; state: CellState }
  | { type: "spine"; steps: { label: string; href: string }[]; current?: number }
  | { type: "pareto"; items: { label: string; share: number; top?: boolean; mark?: boolean }[]; cutAt: number; cutLabel: string; markLabel: string; topLabel: string }
  | { type: "paths"; groups: { title: string; tag?: string; rows: { label: string; segments: Bar[] }[] }[]; ref: Ref; max: number }
  | { type: "mock"; header: string; fields: { n: number; label: string; shown: string; issue: string }[] }
  | { type: "calendar"; days: { day: string; pillar: 1 | 2 | 3 | 4 | null; after: string; now: string }[]; pillars: string[] }
  | { type: "stats"; items: { value: string; label: string; state: CellState; countTo?: number }[] }
  | { type: "composite"; parts: { heading: string; chart: Chart }[] };

export type TileLayerId = "register" | "footprint" | "party-flow" | "zones" | "effort" | "reach-targets";

export interface FigureSpec {
  /** Stable: the DOM id, the CSV filename and the table-of-figures entry. */
  id: string;
  section: string;
  /** The finding, as a sentence. Sentence case, no colon, no question mark. */
  title: string;
  /** The question the figure answers. */
  question: string;
  /** One sentence beneath the figure. */
  takeaway: string;
  sources: SourceRef[];
  chart: Chart;
  columns: Column[];
  rows: Row[];
  /** Short lines printed under the chart: scope, method, "schematic, not to scale". */
  notes?: string[];
}
