import { scaleLinear } from "d3-scale";

import { group } from "@/lib/data/format";
import type { Chart } from "@/lib/register/types";

type FunnelChart = Extract<Chart, { type: "funnel" }>;


/**
 * Chart kit v2, the funnel (brief G-5), drawn on a d3 linear scale.
 *
 * ONE SCALE FOR BOTH REGISTERS. The toggle compares 2022 with July 2026, so both states share a
 * domain; a bar that looks equal must be equal. The toggle is two radios and CSS: each bar
 * carries its width for both states as custom properties and `:has()` picks one, so the bars
 * morph with a transform (compositor only) and it works with scripts off.
 *
 * Marks, by provenance, shape first: sourced is a solid fill fading toward the baseline; modelled
 * carries the kiondo weave; the target is an open bar with a double rule. The target is the one
 * accent mark, because it is his number. Labels are direct (no legend); each row is focusable and
 * its note opens on hover, focus or tap, and prints inline.
 */
export function Funnel({ chart, id }: { chart: FunnelChart; id: string }) {
  const a = chart.stages;
  const b = chart.toggle?.stages ?? a;
  const max = Math.max(...a.map((s) => s.value ?? 0), ...b.map((s) => s.value ?? 0));
  const x = scaleLinear().domain([0, max]).nice(6).range([0, 1]);
  const ticks = x.ticks(6);

  return (
    <div className="pf-fn" data-toggle={chart.toggle ? "true" : "false"}>
      {chart.toggle && (
        <fieldset className="pf-toggle">
          <legend className="sr-only">Register</legend>
          <input type="radio" id={`${id}-a`} name={`${id}-reg`} value="a" defaultChecked />
          <label htmlFor={`${id}-a`}>2022 register</label>
          <input type="radio" id={`${id}-b`} name={`${id}-reg`} value="b" />
          <label htmlFor={`${id}-b`}>{chart.toggle.label}</label>
          <span className="pf-toggle__thumb" aria-hidden="true" />
        </fieldset>
      )}

      <svg className="pf-defs" aria-hidden="true" width="0" height="0">
        <defs>
          <linearGradient id={`${id}-fade`} x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" style={{ stopColor: "var(--pf-bar)", stopOpacity: 0.3 }} />
            <stop offset="1" style={{ stopColor: "var(--pf-bar)", stopOpacity: 1 }} />
          </linearGradient>
        </defs>
      </svg>

      <div className="pf-fn__plot">
        <div className="pf-fn__grid" aria-hidden="true">
          {ticks.map((t) => (
            <span key={t} className="pf-fn__tick" style={{ left: `${x(t) * 100}%` }}>
              <span className="pf-fn__ticklabel">{t === 0 ? "0" : `${t / 1000}k`}</span>
            </span>
          ))}
        </div>

        <ol className="pf-fn__rows">
          {a.map((sa, i) => {
            const sb = b[i] ?? sa;
            const va = sa.value ?? 0;
            const vb = sb.value ?? 0;
            const tone = i === a.length - 1 ? "accent" : "neutral";
            return (
              <li
                key={sa.label}
                className={`pf-fn__row is-${tone}`}
                tabIndex={0}
                style={{ "--wa": x(va), "--wb": x(vb), "--i": i } as React.CSSProperties}
                aria-label={`${sa.label}: ${group(va)}${chart.toggle ? `. ${sb.label}: ${group(vb)}` : ""}. ${sa.note ?? ""}`}
              >
                <div className="pf-fn__label">
                  <span className="pf-fn__name">
                    <span className="pf-show-a">{sa.label}</span>
                    <span className="pf-show-b">{sb.label}</span>
                  </span>
                  <span className="pf-fn__value pf-num">
                    <span className="pf-show-a">{sa.display ?? group(va)}</span>
                    <span className="pf-show-b">{sb.display ?? group(vb)}</span>
                  </span>
                </div>
                <svg className="pf-fn__bar" viewBox="0 0 1000 30" preserveAspectRatio="none" aria-hidden="true">
                  <rect className="pf-fn__track" x="0" y="0" width="1000" height="30" rx="3" />
                  <g className="pf-fn__mark">
                    <rect x="0" y="0" width="1000" height="30" rx="3" fill={`url(#${id}-fade)`} />
                  </g>
                </svg>
                {(sa.note || sb.note) && (
                  <p className="pf-fn__tip">
                    <span className="pf-show-a">{sa.note}</span>
                    <span className="pf-show-b">{sb.note}</span>
                  </p>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
