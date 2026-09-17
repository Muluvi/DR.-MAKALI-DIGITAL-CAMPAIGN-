// Typed view onto the analysis pipeline's published exports.
//
// The JSON in ./analysis/ is written by the pipeline in /analysis (`python -m src.run_all`,
// then `python -m src.publish --approved`). Nothing in this directory is hand-edited: to
// change a figure, change the pack or the assumptions and re-run. The same files are also
// served from public/content/analysis/ so a reader can check them directly.
//
// This file follows the pattern data/ward-register.ts established — raw figures in JSON so a
// plain Node script can verify them without a TypeScript toolchain, a typed view here, and a
// load-time integrity assertion so a build fails loudly rather than rendering a figure that
// has lost its provenance.
//
// The contract this enforces, from the pipeline's own export rules:
//   - every value carries value, unit, source_id, tier, as_of, method and status;
//   - a Tier 3 value ALWAYS carries status "verify";
//   - a modelled value is never "confirmed";
//   - a chart with a scenario label must be rendered with it visible.
import type { Tier } from "./types";

import channelReach from "./analysis/channel-reach.json";
import countyFinance from "./analysis/county-finance-2026-27.json";
import issueEvidence from "./analysis/issue-evidence.json";
import publishedPolls from "./analysis/published-polls-2026.json";
import registerComparison from "./analysis/register-comparison.json";
import results2022 from "./analysis/results-2022-governor.json";
import scenarioBenchmarks from "./analysis/scenario-benchmarks.json";
import wardRegister from "./analysis/ward-register-2022.json";
import waterAndDrought from "./analysis/water-and-drought.json";

/** How a figure was produced. Never blur these in the UI. */
export type ExportMethod = "official" | "calculated" | "modelled";

/**
 * Confidence in the figure.
 *   confirmed   — a published figure from a named source.
 *   verify      — unconfirmed. MUST render with a visible marker.
 *   placeholder — an assumption or a modelled output. Never styled as fact.
 */
export type ExportStatus = "confirmed" | "verify" | "placeholder";

export interface ExportValue {
  label: string;
  value: number | string;
  unit: string;
  source_id: string;
  tier: Tier | null;
  as_of: string;
  method: ExportMethod;
  status: ExportStatus;
  note: string;
}

export interface ExportChart {
  id: string;
  title: string;
  description: string;
  chart_type: string;
  generated: string;
  data_as_of: string;
  /** Non-empty only for simulation output. When set, the UI must display it. */
  scenario_label: string;
  notes: string[];
  values: ExportValue[];
}

export const ANALYSIS_EXPORTS = {
  "channel-reach": channelReach as ExportChart,
  "county-finance-2026-27": countyFinance as ExportChart,
  "issue-evidence": issueEvidence as ExportChart,
  "published-polls-2026": publishedPolls as ExportChart,
  "register-comparison": registerComparison as ExportChart,
  "results-2022-governor": results2022 as ExportChart,
  "scenario-benchmarks": scenarioBenchmarks as ExportChart,
  "ward-register-2022": wardRegister as ExportChart,
  "water-and-drought": waterAndDrought as ExportChart,
} as const;

export type ExportId = keyof typeof ANALYSIS_EXPORTS;

export function analysisExport(id: ExportId): ExportChart {
  return ANALYSIS_EXPORTS[id];
}

const METHODS: ReadonlySet<string> = new Set(["official", "calculated", "modelled"]);
const STATUSES: ReadonlySet<string> = new Set(["confirmed", "verify", "placeholder"]);

/**
 * The same contract the pipeline enforces on export, re-checked at module load.
 *
 * The pipeline cannot stop someone hand-editing a JSON file in this directory afterwards,
 * and a figure that quietly loses its tier or its verify marker is exactly the failure this
 * whole provenance system exists to prevent. So the build asserts it again here.
 */
function assertExportIntegrity(): void {
  for (const [id, chart] of Object.entries(ANALYSIS_EXPORTS)) {
    if (chart.id !== id) {
      throw new Error(`Analysis export integrity failure: ${id} declares id "${chart.id}".`);
    }
    if (chart.values.length === 0) {
      throw new Error(`Analysis export integrity failure: ${id} carries no values.`);
    }
    for (const v of chart.values) {
      if (!METHODS.has(v.method)) {
        throw new Error(`Analysis export integrity failure: ${id} / "${v.label}" has method "${v.method}".`);
      }
      if (!STATUSES.has(v.status)) {
        throw new Error(`Analysis export integrity failure: ${id} / "${v.label}" has status "${v.status}".`);
      }
      if (v.tier === 3 && v.status !== "verify") {
        throw new Error(
          `Analysis export integrity failure: ${id} / "${v.label}" is Tier 3 but is not marked "verify".`
        );
      }
      if (v.method === "modelled" && v.status === "confirmed") {
        throw new Error(
          `Analysis export integrity failure: ${id} / "${v.label}" is modelled but marked "confirmed".`
        );
      }
      if (!v.source_id || !v.as_of) {
        throw new Error(
          `Analysis export integrity failure: ${id} / "${v.label}" is missing a source_id or as_of.`
        );
      }
    }
  }
}
assertExportIntegrity();

/** Numeric values only, for plotting. String-valued rows (drought phases) are skipped. */
export function numericValues(chart: ExportChart): (ExportValue & { value: number })[] {
  return chart.values.filter((v): v is ExportValue & { value: number } => typeof v.value === "number");
}

/** True when any value in the chart is unconfirmed — drives the block-level warning. */
export function hasUnverified(chart: ExportChart): boolean {
  return chart.values.some((v) => v.status === "verify");
}

/** True when any value is modelled — drives the "modelled, not measured" label. */
export function isModelled(chart: ExportChart): boolean {
  return chart.values.some((v) => v.method === "modelled");
}
