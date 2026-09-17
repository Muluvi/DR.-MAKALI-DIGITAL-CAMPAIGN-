import { Database, FlaskConical, TriangleAlert } from "lucide-react";

import type { ExportChart, ExportStatus, ExportValue } from "../../data/analysis-exports";
import { hasUnverified, isModelled, numericValues } from "../../data/analysis-exports";
import type { Tier } from "../../data/types";
import { TierBadge } from "./TierBadge";

/**
 * Shared rendering for every figure published by the analysis pipeline.
 *
 * The pipeline's whole point is that a number travels with its provenance. That guarantee is
 * only worth something if the UI honours it, so this component makes it structural rather
 * than a matter of remembering: a value cannot be rendered here without its tier, its source,
 * the date it refers to, how it was produced and how much confidence it carries.
 *
 * Three rules it enforces visually, mirroring the ones data/analysis-exports.ts asserts:
 *   - anything "verify" gets a visible unconfirmed marker, never a silent footnote;
 *   - anything "modelled" is labelled as modelled and never styled like a measurement;
 *   - a chart carrying a scenario label displays it, because a simulation shown without one
 *     reads as a forecast.
 */

const STATUS_META: Record<ExportStatus, { label: string; className: string }> = {
  confirmed: { label: "Confirmed", className: "analysis-chip analysis-chip-confirmed" },
  verify: { label: "Unverified", className: "analysis-chip analysis-chip-verify" },
  // "Provisional" describes the STATUS. Whether it got there by modelling or by a stated
  // ranking rule is the METHOD, which the meta line states separately — a chip reading
  // "modelled estimate" beside a method of "calculated" contradicts itself.
  placeholder: { label: "Provisional", className: "analysis-chip analysis-chip-placeholder" },
};

const METHOD_LABEL: Record<string, string> = {
  official: "Official figure",
  calculated: "Calculated from published figures",
  modelled: "Modelled — not a measurement",
};

export function StatusChip({ status }: { status: ExportStatus }) {
  const meta = STATUS_META[status];
  return <span className={meta.className}>{meta.label}</span>;
}

function decimalsIn(n: number): number {
  const text = String(n);
  const dot = text.indexOf(".");
  return dot === -1 ? 0 : Math.min(text.length - dot - 1, 3);
}

/**
 * How many decimal places this chart's numbers should all carry.
 *
 * Taken from the most precise value present, so a column cannot mix "1" with "0.875" and
 * make a score look like a count. Percentages are always one place.
 */
export function decimalsFor(values: ExportValue[]): number {
  const numeric = values.filter((v) => typeof v.value === "number") as (ExportValue & { value: number })[];
  if (numeric.some((v) => v.unit === "%")) return 1;
  return numeric.reduce((max, v) => Math.max(max, decimalsIn(v.value)), 0);
}

function formatValue(v: ExportValue, decimals: number): string {
  if (typeof v.value === "string") return v.value;
  if (v.unit === "%") return `${v.value.toFixed(1)}%`;
  return v.value.toLocaleString("en-GB", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function unitSuffix(v: ExportValue): string {
  if (v.unit === "%" || typeof v.value === "string") return "";
  return v.unit;
}

/** A single value with its full provenance. The unit of honesty in this system. */
export function FigureRow({
  value,
  maxValue,
  decimals = 0,
}: {
  value: ExportValue;
  maxValue?: number;
  decimals?: number;
}) {
  const numeric = typeof value.value === "number";
  const width = numeric && maxValue ? Math.max((value.value as number) / maxValue, 0) * 100 : 0;
  const modelled = value.method === "modelled";
  const showStatusChip = !(value.status === "verify" && value.tier === 3);
  const sourceLabel =
    modelled && value.tier
      ? `derived from ${value.source_id} (Tier ${value.tier})`
      : value.source_id;
  return (
    <li className="py-2.5 border-b border-line/30 last:border-b-0">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <span className="t-small font-semibold text-ink">{value.label}</span>
        <span className="t-small font-bold text-ink tabular-nums">
          {formatValue(value, decimals)}
          {unitSuffix(value) ? <span className="font-normal text-muted"> {unitSuffix(value)}</span> : null}
        </span>
      </div>
      {numeric && maxValue ? (
        <div className="mt-1.5 h-1.5 w-full rounded-full bg-line/40 overflow-hidden" aria-hidden="true">
          <div
            className={value.method === "modelled" ? "h-full rounded-full bg-muted/60" : "h-full rounded-full bg-accent"}
            style={{ width: `${width}%` }}
          />
        </div>
      ) : null}
      <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1">
        {/*
          A modelled figure gets no tier badge. The tier belongs to the SOURCE the model drew
          on, not to the model's output, and a simulated vote count wearing a Tier 1 badge
          borrows an authority it has not earned — the exact thing this provenance system
          exists to prevent. The source and its tier still appear, in words, in the meta line.
        */}
        {value.tier && !modelled ? <TierBadge tier={value.tier as Tier} compact /> : null}
        {/*
          A Tier 3 badge already reads "T3 Unconfirmed", so an "Unverified" chip beside it says
          the same thing twice. Show the chip where it adds something the badge does not.
        */}
        {showStatusChip ? <StatusChip status={value.status} /> : null}
        <span className="t-label text-muted font-medium">
          {METHOD_LABEL[value.method]} · {sourceLabel} · as at {value.as_of}
        </span>
      </div>
      {value.note ? (
        <p className="mt-1 t-label text-muted/90 leading-normal italic">{value.note}</p>
      ) : null}
    </li>
  );
}

/**
 * A published export rendered in full.
 *
 * `plot` draws proportional bars, which only makes sense when the values share a unit and a
 * scale — pass false for mixed-unit charts, where a bar would invite a comparison the data
 * does not support.
 */
export function AnalysisFigure({
  chart,
  heading,
  plot = true,
  children,
}: {
  chart: ExportChart;
  heading?: string;
  plot?: boolean;
  children?: React.ReactNode;
}) {
  const numeric = numericValues(chart);
  const maxValue = plot && numeric.length > 0 ? Math.max(...numeric.map((v) => v.value)) : undefined;
  const decimals = decimalsFor(chart.values);
  const unverified = hasUnverified(chart);
  const modelled = isModelled(chart);

  return (
    <div className="not-prose bg-card border border-line rounded-2xl p-4 sm:p-5 shadow-sm my-6 print-avoid-break">
      <div className="flex items-center gap-2 mb-1">
        <span className="w-1.5 h-6 bg-accent rounded-full shrink-0" />
        <h4 className="font-serif text-sm font-bold text-ink">{heading ?? chart.title}</h4>
      </div>
      <p className="t-small text-muted mb-3 leading-relaxed pl-3.5">{chart.description}</p>

      {chart.scenario_label ? (
        <p className="analysis-banner analysis-banner-scenario">
          <FlaskConical size={12} className="shrink-0 mt-0.5" aria-hidden="true" />
          <span>
            <strong>{chart.scenario_label}</strong> Every input is a stated assumption, and no rival is
            modelled, so nothing here is a win probability.
          </span>
        </p>
      ) : null}

      {unverified ? (
        <p className="analysis-banner analysis-banner-verify">
          <TriangleAlert size={12} className="shrink-0 mt-0.5" aria-hidden="true" />
          <span>
            This block contains unconfirmed figures. Every one is marked below and should be
            checked against its Tier 1 original before it is relied on.
          </span>
        </p>
      ) : null}

      <ul className="list-none pl-0 my-0">
        {chart.values.map((value) => (
          <FigureRow key={value.label} value={value} maxValue={maxValue} decimals={decimals} />
        ))}
      </ul>

      {children}

      {chart.notes.length > 0 ? (
        <ul className="mt-3 pt-2 border-t border-line/40 list-none pl-0 space-y-1">
          {chart.notes.map((note) => (
            <li key={note} className="t-label text-muted/90 leading-normal">
              {note}
            </li>
          ))}
        </ul>
      ) : null}

      <div className="flex flex-wrap items-center gap-1.5 px-0 pt-2 t-label font-semibold text-muted">
        <Database size={10} className="shrink-0 opacity-60" aria-hidden="true" />
        <span>
          Firefly analysis pipeline · data as at {chart.data_as_of}
          {modelled ? " · contains modelled figures" : ""}
        </span>
      </div>
    </div>
  );
}
