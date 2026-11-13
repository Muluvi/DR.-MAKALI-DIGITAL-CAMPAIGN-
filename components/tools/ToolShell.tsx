"use client";

import { useState, type ReactNode } from "react";

/**
 * The frame every tool, model and interactive chart sits in: what it answers, a "Reset to actual
 * figures" control, and its source line. Inputs live only in the tool's own state; Reset remounts
 * the tool, so every input returns to the real data, exactly as a page refresh does.
 */
export function ToolShell({ kicker = "Try it", title, question, source, children, resettable = true }: {
  kicker?: string;
  title: string;
  question: string;
  source?: ReactNode;
  children: ReactNode;
  resettable?: boolean;
}) {
  const [run, setRun] = useState(0);
  return (
    <section className="tool" aria-label={title}>
      <div className="tool-head">
        <div>
          <p className="kicker">{kicker}</p>
          <h3 className="h3">{title}</h3>
          <p className="tool-q">{question}</p>
        </div>
        {resettable && (
          <button type="button" className="btn btn-sm btn-reset" onClick={() => setRun((n) => n + 1)}>
            Reset to actual figures
          </button>
        )}
      </div>
      <div key={run}>{children}</div>
      {source ? <p className="source">{source}</p> : null}
    </section>
  );
}

/** Actual against scenario, side by side, with the difference in words. */
export function Compare({ baseLabel = "Actual", scenarioLabel = "Your scenario", base, scenario, format, unit = "" }: {
  baseLabel?: string;
  scenarioLabel?: string;
  base: number;
  scenario: number;
  format: (v: number) => string;
  unit?: string;
}) {
  const d = scenario - base;
  return (
    <dl className="compare" aria-live="polite">
      <div>
        <dt>{baseLabel}</dt>
        <dd>{format(base)}{unit}</dd>
      </div>
      <div className="is-scenario">
        <dt>{scenarioLabel}</dt>
        <dd>{format(scenario)}{unit}</dd>
        <span className="delta">{d === 0 ? "No change" : `${d > 0 ? "+" : "−"}${format(Math.abs(d))}${unit} against ${baseLabel.toLowerCase()}`}</span>
      </div>
    </dl>
  );
}

export const fmt = (v: number, d = 0) => v.toLocaleString("en-KE", { minimumFractionDigits: d, maximumFractionDigits: d });
