import { scaleLinear, scaleUtc, type ScaleLinear } from "d3-scale";
import { utcYear } from "d3-time";

import type { Bar, CellState, Chart as ChartSpec, FigureSpec, Ref } from "../../lib/register/types";
import { group } from "../../lib/data/format";
import { TileMap } from "./TileMap";
import { FunnelV2 } from "../premium/FunnelV2";
import { Reveal } from "../premium/Reveal";
import { CountUp } from "../premium/CountUp";
import { Roll } from "../premium/Roll";
import { WeaveDefs } from "../premium/weave";
import { Countdown } from "../premium/Countdown";

/**
 * Chart kit v2 (brief G-5): the register's marks, drawn on d3 scales.
 *
 * Server-rendered HTML and SVG: every mark is in the page at its true value, so the figure reads
 * with JavaScript off, prints complete, and never animates *to* the truth. What motion there is
 * (bars growing from zero, lines drawing, a stack splitting, a house assembling) is armed by
 * RegisterMotion only for figures still below the fold, and released as they enter.
 *
 * Rules every renderer keeps (brief §M, §Q, G-5):
 *   - one scale per chart, from zero; ticks are d3's, drawn as 1px hairlines, fewer on a phone
 *   - labels sit above their bars and wrap, so nothing is truncated at 320px; values are direct,
 *     so there is no legend where one can be avoided
 *   - colour never carries meaning alone: Dr. Mulu is accent AND named; modelled marks carry the
 *     kiondo weave AND say "modelled"; a target is an open double-ruled bar; a needed mark is a
 *     dashed empty outline that says "Data needed". All four survive greyscale
 *   - every mark is reachable by keyboard and names itself; dense marks show a tooltip on hover,
 *     focus or tap, and the table in the figure's <details> carries every value regardless
 */
export function Chart({ spec }: { spec: FigureSpec }) {
  return (
    <div className="kx" data-kind={spec.chart.type}>
      <KitDefs uid={spec.id} />
      <Part c={spec.chart} spec={spec} />
    </div>
  );
}

function Part({ c, spec }: { c: ChartSpec; spec: FigureSpec }) {
  const uid = spec.id;
  switch (c.type) {
    case "composite":
      return (
        <div className="kx-composite">
          {c.parts.map((p) => (
            <section key={p.heading} className="kx-part">
              <h5 className="kx-part__head">{p.heading}</h5>
              <Part c={p.chart} spec={spec} />
            </section>
          ))}
        </div>
      );
    case "bars": return <Bars uid={uid} bars={c.bars} max={c.max} ref_={c.ref} unit={c.unit} />;
    case "multiples": return <Multiples uid={uid} chart={c} />;
    case "stack": return <Stack uid={uid} chart={c} />;
    case "waterfall": return <Waterfall uid={uid} chart={c} />;
    case "slope": return <Slope chart={c} title={spec.title} />;
    case "funnel": return <Reveal><FunnelV2 chart={c} id={spec.id} /></Reveal>;
    case "tilemap": return <TileMap id={spec.id} layers={c.layers} initial={c.initial} showWardList={c.showWardList} />;
    case "timeline": return <Timeline uid={uid} chart={c} title={spec.title} />;
    case "steps": return <Steps chart={c} />;
    case "cards": return <Cards chart={c} />;
    case "matrix": return <Matrix chart={c} caption={spec.question} />;
    case "decision": return <Decision question={c.question} rules={c.rules} />;
    case "dumbbell": return <Dumbbell chart={c} />;
    case "icons": return <Icons chart={c} />;
    case "gauges": return <Gauges chart={c} />;
    case "network": return <Network chart={c} title={spec.title} />;
    case "house": return <House chart={c} />;
    case "balance": return <Balance chart={c} />;
    case "risk": return <Risk chart={c} />;
    case "heatmap": return <Heatmap chart={c} caption={spec.question} />;
    case "spine": return <Spine chart={c} />;
    case "stats": return <Stats chart={c} />;
    case "pareto": return <Pareto chart={c} />;
    case "paths": return <Paths uid={uid} chart={c} />;
    case "mock": return <Mock chart={c} />;
    case "calendar": return <Calendar uid={uid} chart={c} />;
  }
}

/* ------------------------------------------------------------------ shared */

type Tone = "accent" | "neutral" | "rival" | "neg";
const TONES: Tone[] = ["accent", "neutral", "rival", "neg"];

const STATE_WORD: Record<CellState, string> = { sourced: "", modelled: "Modelled", needed: "Data needed", target: "Target" };

/** Once per figure: a gradient per tone that fades toward the baseline, and the modelled weave. */
function KitDefs({ uid }: { uid: string }) {
  return (
    <svg className="pf-defs" aria-hidden="true" width="0" height="0" focusable="false">
      <defs>
        {TONES.map((t) => (
          <linearGradient key={t} id={`${uid}-g-${t}`} x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" style={{ stopColor: `var(--kx-${t})`, stopOpacity: 0.3 }} />
            <stop offset="1" style={{ stopColor: `var(--kx-${t})`, stopOpacity: 1 }} />
          </linearGradient>
        ))}
        <linearGradient id={`${uid}-g-soft`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" style={{ stopColor: "var(--kx-soft)", stopOpacity: 0 }} />
          <stop offset="0.2" style={{ stopColor: "var(--kx-soft)", stopOpacity: 0.55 }} />
          <stop offset="0.8" style={{ stopColor: "var(--kx-soft)", stopOpacity: 0.55 }} />
          <stop offset="1" style={{ stopColor: "var(--kx-soft)", stopOpacity: 0 }} />
        </linearGradient>
        <WeaveDefs id={`${uid}-weave`} color="var(--pf-weave-on-bar)" size={6} />
      </defs>
    </svg>
  );
}

function valueText(b: Pick<Bar, "value" | "display">, unit?: string) {
  if (b.value === null) return "Data needed";
  return b.display ?? `${group(b.value)}${unit ? ` ${unit}` : ""}`;
}

function stateChip(state: CellState) {
  return state !== "sourced" ? <span className={`kx-chip is-${state}`}>{STATE_WORD[state]}</span> : null;
}

const pct = (k: number) => `${Math.max(0, Math.min(1, k)) * 100}%`;

/** Compact tick text: 0, 50k, 100k; 0%, 25%; 1m, 2m. */
function tickText(t: number, hi: number, unit?: string) {
  if (unit === "%") return `${t}%`;
  if (t === 0) return "0";
  if (hi >= 2_000_000) return `${t / 1_000_000}m`;
  if (hi >= 10_000) return `${t / 1000}k`;
  return group(t);
}

function Ticks({ x, ticks }: { x: ScaleLinear<number, number>; ticks: number[] }) {
  return (
    <>
      {ticks.map((t) => (
        <span key={t} className="kx-tick" style={{ left: pct(x(t)) }} aria-hidden="true" />
      ))}
    </>
  );
}

function Axis({ x, ticks, hi, unit }: { x: ScaleLinear<number, number>; ticks: number[]; hi: number; unit?: string }) {
  return (
    <div className="kx-axis" aria-hidden="true">
      {ticks.map((t) => (
        <span key={t} className="kx-axis__t" style={{ left: pct(x(t)) }}>{tickText(t, hi, unit)}</span>
      ))}
    </div>
  );
}

function RefKey({ ref_ }: { ref_: Ref }) {
  return (
    <p className="kx-refkey">
      <span className="kx-refkey__rule" aria-hidden="true" />
      {ref_.label}
    </p>
  );
}

/**
 * One bar on the shared scale: `w` and `x` are fractions of the plot width. Sourced is a solid
 * fill fading toward the baseline; modelled adds the weave; a target is an open double-ruled bar;
 * a needed value is a dashed empty outline across the whole track, labelled.
 */
function BarMark({ uid, w, x = 0, tone = "neutral", state, i = 0 }: { uid: string; w: number; x?: number; tone?: Tone; state: CellState; i?: number }) {
  if (state === "needed") {
    return (
      <div className="kx-needed" aria-hidden="true">
        <span>Data needed</span>
      </div>
    );
  }
  return (
    <svg className="kx-bar" viewBox="0 0 1000 24" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <g className="kx-mark kx-grow" style={{ "--w": w, "--x": x, "--i": i } as React.CSSProperties}>
        {state === "target" ? (
          <>
            <rect x="1" y="1" width="998" height="22" rx="3" className="kx-target-a" vectorEffect="non-scaling-stroke" />
            <rect x="4" y="5" width="992" height="14" rx="2" className="kx-target-b" vectorEffect="non-scaling-stroke" />
          </>
        ) : (
          <>
            <rect width="1000" height="24" rx="3" fill={`url(#${uid}-g-${tone})`} />
            {state === "modelled" && <rect width="1000" height="24" rx="3" fill={`url(#${uid}-weave)`} />}
          </>
        )}
      </g>
    </svg>
  );
}

function linear(hi: number) {
  const x = scaleLinear().domain([0, hi || 1]).nice(5).range([0, 1]);
  return { x, ticks: x.ticks(5), top: x.domain()[1] };
}

/* ------------------------------------------------------------------ ordered bars */

function Bars({ uid, bars, max, ref_, unit, refLabel = true }: { uid: string; bars: Bar[]; max?: number; ref_?: Ref; unit?: string; refLabel?: boolean }) {
  const hi = max ?? Math.max(...bars.map((b) => Math.abs(b.value ?? 0)), ref_?.value ?? 0);
  const { x, ticks, top } = linear(hi);
  return (
    <div className="kx-bars">
      {ref_ && refLabel && <RefKey ref_={ref_} />}
      <ol className="kx-rows">
        {bars.map((b, i) => {
          const v = valueText(b, unit);
          return (
            <li
              key={b.label}
              className={`kx-row is-${b.tone ?? "neutral"}`}
              tabIndex={0}
              aria-label={`${b.label}: ${v}${b.state !== "sourced" ? ` (${STATE_WORD[b.state].toLowerCase()})` : ""}${b.note ? `. ${b.note}` : ""}`}
            >
              <div className="kx-label">
                <span className="kx-name">
                  {b.label}
                  {stateChip(b.state)}
                </span>
                <span className="kx-val pf-num">{b.value === null ? v : <CountUp text={v} />}</span>
              </div>
              <div className="kx-track">
                <Ticks x={x} ticks={ticks} />
                <BarMark uid={uid} w={x(Math.abs(b.value ?? 0))} tone={b.tone ?? "neutral"} state={b.state} i={i} />
                {ref_ && <span className="kx-ref" style={{ left: pct(x(ref_.value)) }} aria-hidden="true" />}
              </div>
              {b.note && <p className="kx-note">{b.note}</p>}
            </li>
          );
        })}
      </ol>
      <Axis x={x} ticks={ticks} hi={top} unit={unit} />
    </div>
  );
}

function Multiples({ uid, chart }: { uid: string; chart: Extract<ChartSpec, { type: "multiples" }> }) {
  return (
    <div className="kx-multiples">
      {chart.ref && <RefKey ref_={chart.ref} />}
      <div className="kx-panels">
        {chart.panels.map((p) => (
          <section key={p.title} className={`kx-panel ${p.bars.some((b) => b.tone === "accent") ? "is-accent" : ""}`}>
            <h6 className="kx-panel__title">{p.title}</h6>
            <Bars uid={uid} bars={p.bars} max={chart.max} ref_={chart.ref} unit={chart.unit} refLabel={false} />
          </section>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ part-to-whole */

function Stack({ uid, chart }: { uid: string; chart: Extract<ChartSpec, { type: "stack" }> }) {
  const sum = chart.segments.reduce((s, b) => s + Math.abs(b.value ?? 0), 0);
  const x = scaleLinear().domain([0, Math.max(sum, chart.total, chart.ref?.value ?? 0)]).range([0, 1]);
  let neutral = 0;
  const shades = chart.segments.map((s) => (s.tone && s.tone !== "neutral" ? s.tone : neutral++ % 2 ? "neutral-2" : "neutral"));
  return (
    <div className="kx-stack">
      <p className="kx-cap">{chart.totalLabel}</p>
      <div className="kx-stack__plot">
        <div className="kx-stack__bar kx-split">
          {chart.segments.map((s, i) => {
            const v = valueText(s, chart.unit);
            return (
              <span
                key={s.label}
                className={`kx-seg is-${shades[i]} ${s.state === "modelled" || s.state === "target" ? "is-modelled" : ""}`}
                style={{ width: pct(x(Math.abs(s.value ?? 0))) }}
                tabIndex={0}
                role="img"
                aria-label={`${s.label}: ${v}${s.state !== "sourced" ? ` (${STATE_WORD[s.state].toLowerCase()})` : ""}`}
              >
                {(s.state === "modelled" || s.state === "target") && (
                  <svg className="kx-seg__weave" aria-hidden="true" focusable="false">
                    <rect width="100%" height="100%" fill={`url(#${uid}-weave)`} />
                  </svg>
                )}
                <span className="kx-tip" aria-hidden="true">
                  <strong>{s.label}</strong> {v}
                  {s.state !== "sourced" && ` · ${STATE_WORD[s.state].toLowerCase()}`}
                </span>
              </span>
            );
          })}
        </div>
        {chart.ref && <span className="kx-ref kx-ref--tall" style={{ left: pct(x(chart.ref.value)) }} aria-hidden="true" />}
        {/* Large segments are labelled in place, beneath themselves, so the order reads without the
            legend and without colour; small ones rely on the list beneath. */}
        <div className="kx-stack__inplace" aria-hidden="true">
          {chart.segments.map((s) => (
            <span key={s.label} style={{ width: pct(x(Math.abs(s.value ?? 0))) }}>
              {x(Math.abs(s.value ?? 0)) >= 0.18 ? <strong className="pf-num">{valueText(s, chart.unit)}</strong> : null}
            </span>
          ))}
        </div>
      </div>
      {chart.ref && <RefKey ref_={chart.ref} />}
      <ul className="kx-legend">
        {chart.segments.map((s, i) => (
          <li key={s.label}>
            <span className={`kx-swatch is-${shades[i]} ${s.state === "modelled" || s.state === "target" ? "is-modelled" : ""}`} aria-hidden="true" />
            <span>
              {s.label}: <strong className="pf-num">{valueText(s, chart.unit)}</strong>
              {s.state !== "sourced" && ` (${STATE_WORD[s.state].toLowerCase()})`}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Cumulative sums, computed outside render. */
function runningTotal(values: number[]): number[] {
  const out: number[] = [];
  let run = 0;
  for (const v of values) out.push((run += v));
  return out;
}

/** Each step's start and end on the running total, computed outside render. */
function placeSteps(steps: Extract<ChartSpec, { type: "waterfall" }>["steps"]) {
  const out: (typeof steps[number] & { from: number; to: number })[] = [];
  let running = 0;
  for (const s of steps) {
    const v = s.value ?? 0;
    const from = s.kind === "delta" ? running : 0;
    running = s.kind === "delta" ? running + v : v;
    out.push({ ...s, from, to: running });
  }
  return out;
}

function Waterfall({ uid, chart }: { uid: string; chart: Extract<ChartSpec, { type: "waterfall" }> }) {
  const placed = placeSteps(chart.steps);
  const { x, ticks, top } = linear(Math.max(...placed.map((p) => Math.max(p.from, p.to))));
  return (
    <div className="kx-bars kx-waterfall">
      <ol className="kx-rows">
        {placed.map((p, i) => {
          const sign = p.kind === "delta" ? (p.value! >= 0 ? "+ " : "− ") : "";
          const v = p.value === null ? "Data needed" : p.display ?? group(Math.abs(p.value));
          const lo = Math.min(p.from, p.to);
          return (
            <li key={p.label} className={`kx-row is-${p.kind === "total" ? "accent" : "neutral"}`} tabIndex={0} aria-label={`${sign}${p.label}: ${v}${p.kind === "delta" ? `. Running total ${group(p.to)}` : ""}`}>
              <div className="kx-label">
                <span className="kx-name">
                  {sign}
                  {p.label}
                  {stateChip(p.state)}
                </span>
                <span className="kx-val pf-num">{p.value === null ? v : <CountUp text={`${p.kind === "delta" ? sign.trim() : ""}${v}`} />}</span>
              </div>
              <div className="kx-track">
                <Ticks x={x} ticks={ticks} />
                {i > 0 && <span className="kx-conn" style={{ left: pct(x(p.kind === "delta" ? p.from : p.to)) }} aria-hidden="true" />}
                <BarMark uid={uid} w={x(Math.abs(p.to - p.from))} x={x(lo)} tone={p.kind === "total" ? "accent" : "neutral"} state={p.state} i={i} />
              </div>
              {p.kind === "delta" && <p className="kx-note">Running total {group(p.to)}</p>}
            </li>
          );
        })}
      </ol>
      <Axis x={x} ticks={ticks} hi={top} unit={chart.unit} />
    </div>
  );
}

/* ------------------------------------------------------------------ change */

/** Push labels apart so none overlaps: sorted by y, each at least `gap` below the one before. */
function spread(ys: number[], gap: number, lo: number, hi: number): number[] {
  const order = ys.map((y, i) => ({ y, i })).sort((a, b) => a.y - b.y);
  const out = new Array<number>(ys.length);
  let last = -Infinity;
  for (const o of order) {
    const y = Math.max(o.y, last + gap);
    out[o.i] = y;
    last = y;
  }
  // If the stack ran off the bottom, pull it back up as a block.
  const over = Math.max(...out) - hi;
  if (over > 0) for (let k = 0; k < out.length; k++) out[k] = Math.max(lo, out[k] - over);
  return out;
}

function Slope({ chart, title }: { chart: Extract<ChartSpec, { type: "slope" }>; title: string }) {
  const W = 360, H = 240, x1 = 50, x2 = 176, T = 16, B = 30;
  const all = chart.lines.flatMap((l) => [l.a, l.b]);
  const y = scaleLinear().domain([0, Math.max(...all)]).nice(4).range([H - B, T]);
  const ticks = y.ticks(4);
  const la = spread(chart.lines.map((l) => y(l.a) + 4), 15, T, H - B + 4);
  const lb = spread(chart.lines.map((l) => y(l.b) + 4), 15, T, H - B + 4);
  // The accent line draws last, so it sits on top.
  const order = chart.lines.map((l, i) => ({ l, i })).sort((a, b) => (a.l.tone === "accent" ? 1 : 0) - (b.l.tone === "accent" ? 1 : 0));
  return (
    <svg className="rf-svg kx-slope" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={title}>
      {ticks.map((t) => (
        <line key={t} x1={x1} x2={x2} y1={y(t)} y2={y(t)} className="kx-hair" aria-hidden="true" />
      ))}
      <line x1={x1} x2={x1} y1={T - 8} y2={H - B} className="kx-axisline" />
      <line x1={x2} x2={x2} y1={T - 8} y2={H - B} className="kx-axisline" />
      <text x={x1} y={H - 8} textAnchor="middle" className="kx-svglabel">{chart.left}</text>
      <text x={x2} y={H - 8} textAnchor="middle" className="kx-svglabel">{chart.right}</text>
      {order.map(({ l, i }) => {
        const accent = l.tone === "accent";
        return (
          <g key={l.label} className={`kx-slope__line ${accent ? "is-accent" : ""}`} tabIndex={0} role="img" aria-label={`${l.label}: ${l.a}${chart.unit} (${chart.left}) to ${l.b}${chart.unit} (${chart.right})`}>
            <title>{`${l.label}: ${l.a}${chart.unit} to ${l.b}${chart.unit}`}</title>
            <line x1={x1} y1={y(l.a)} x2={x2} y2={y(l.b)} pathLength={1} className="kx-draw" />
            <circle cx={x1} cy={y(l.a)} r="4.5" />
            <circle cx={x2} cy={y(l.b)} r="4.5" />
            <text x={x1 - 9} y={la[i]} textAnchor="end" className="kx-svgval">{l.a}{chart.unit}</text>
            <text x={x2 + 10} y={lb[i]} className="kx-svgval">
              {l.b}{chart.unit} <tspan className="kx-svgname">{l.label}</tspan>
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/* ------------------------------------------------------------------ time and process */

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function fmtDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return d ? `${d} ${MONTHS[m - 1]} ${y}` : `${MONTHS[m - 1]} ${y}`;
}
const utc = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d || 1));
};

/**
 * A dated axis (d3 UTC time scale): points for single dates, bands for spans, each span in its own
 * lane so overlaps read as overlaps. A span that is reported rather than confirmed, or still
 * needed, is a soft-edged band with a dashed rule: its ends are not known, so they are not drawn
 * hard. The numbered list beneath is the timeline on a phone and the key on a wide screen.
 */
function Timeline({ uid, chart, title }: { uid: string; chart: Extract<ChartSpec, { type: "timeline" }>; title: string }) {
  const W = 760, L = 14, R = 14;
  const x = scaleUtc().domain([utc(chart.from), utc(chart.to)]).range([L, W - R]);
  // Under two years the axis is marked by month; over that, by year.
  const long = utc(chart.to).getTime() - utc(chart.from).getTime() > 2 * 365 * 24 * 3600 * 1000;
  const spans = chart.events.filter((e) => e.end);
  const points = chart.events.filter((e) => !e.end);
  const numbered = chart.events.length > 3;
  const laneH = 26;
  const top = 36;
  const axisY = top + spans.length * laneH + 14;
  const H = axisY + 58 + (points.length > 1 && !numbered ? 18 : 0);
  const months = long ? x.ticks(utcYear) : x.ticks(12);
  const num = (e: (typeof chart.events)[number]) => chart.events.indexOf(e) + 1;
  const soft = (e: (typeof chart.events)[number]) => e.reported || e.state === "needed";
  return (
    <div className="kx-timeline">
      {chart.countdown && <Countdown to={chart.countdown.date} label={chart.countdown.label} />}
      <svg className="rf-svg kx-timeline__svg" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={title}>
        {months.map((m) => (
          <g key={m.toISOString()} aria-hidden="true">
            <line x1={x(m)} x2={x(m)} y1={top - 10} y2={axisY} className="kx-hair" />
            <text x={x(m) + 4} y={axisY + 16} className="kx-svgtick">
              {long ? m.getUTCFullYear() : MONTHS[m.getUTCMonth()]}
              {!long && m.getUTCMonth() === 0 ? ` ${m.getUTCFullYear()}` : ""}
            </text>
          </g>
        ))}
        <line x1={L} x2={W - R} y1={axisY} y2={axisY} pathLength={1} className="kx-axisline kx-draw" />
        {chart.today && (
          <g aria-hidden="true">
            <line x1={x(utc(chart.today))} x2={x(utc(chart.today))} y1={top - 18} y2={axisY + 4} className="kx-today" />
            <text x={x(utc(chart.today)) + 5} y={top - 10} className="kx-svgtick">Today</text>
          </g>
        )}
        {spans.map((e, k) => {
          const a = x(utc(e.date)), b = x(utc(e.end!));
          const yy = top + k * laneH;
          const cls = soft(e) ? "is-soft" : e.state === "target" ? "is-target" : "is-sourced";
          return (
            <g key={e.label} className={`kx-span ${cls}`} tabIndex={0} role="img" aria-label={`${e.label}: ${e.whenText ?? `${fmtDate(e.date)} to ${fmtDate(e.end!)}`}${e.reported ? ", reported, not confirmed" : ""}`}>
              <title>{`${e.label}: ${e.whenText ?? `${fmtDate(e.date)} – ${fmtDate(e.end!)}`}`}</title>
              <rect x={a} y={yy} width={Math.max(4, b - a)} height={laneH - 8} rx="4" fill={soft(e) ? `url(#${uid}-g-soft)` : undefined} className="kx-span__band kx-grow" style={{ "--i": k } as React.CSSProperties} />
              <text x={Math.min(a + 6, W - 220)} y={yy + laneH / 2 + 0.5} className="kx-span__text">
                {numbered ? `${num(e)}  ` : ""}
                {e.label}
              </text>
            </g>
          );
        })}
        {points.map((e, k) => {
          const px = x(utc(e.date));
          const anchor = px > W - 180 ? "end" : px < 120 ? "start" : "middle";
          return (
            <g key={e.label} className="kx-point" tabIndex={0} role="img" aria-label={`${e.label}: ${e.whenText ?? fmtDate(e.date)}`}>
              <title>{`${e.label}: ${e.whenText ?? fmtDate(e.date)}`}</title>
              <circle cx={px} cy={axisY} r="7" />
              {/* Numbered timelines carry only the number on the axis; the list beneath names it. */}
              <text x={px} y={axisY + 38 + (numbered ? 0 : (k % 2) * 18)} textAnchor={numbered ? "middle" : anchor} className="kx-point__text">
                {numbered ? num(e) : e.label}
              </text>
            </g>
          );
        })}
      </svg>
      <ol className="kx-tl-list">
        {chart.events.map((e) => (
          <li key={e.label} className={`kx-tl-item ${soft(e) ? "is-soft" : e.state === "target" ? "is-target" : ""} ${e.end ? "is-span" : ""}`}>
            <p className="kx-tl-when">
              {e.whenText ?? (e.end ? `${fmtDate(e.date)} – ${fmtDate(e.end)}` : fmtDate(e.date))}
              {e.reported ? " · reported, not confirmed (T3)" : e.state === "needed" ? " · data needed" : e.state === "target" ? " · planned" : ""}
            </p>
            <h5>
              {numbered ? `${num(e)}. ` : ""}
              {e.label}
            </h5>
            {e.note && <p>{e.note}</p>}
          </li>
        ))}
      </ol>
      {chart.today && <p className="kx-note">Dotted line: today, {fmtDate(chart.today)}.</p>}
    </div>
  );
}

/** A stepper on a track that fills as it enters view (fig-1-4). Numbered, because it is a sequence. */
function Steps({ chart }: { chart: Extract<ChartSpec, { type: "steps" }> }) {
  const lanes = chart.lanes ?? [undefined];
  return (
    <div className="kx-stepper-wrap">
      {lanes.map((lane) => {
        const steps = chart.steps.filter((s) => !lane || s.lane === lane);
        return (
          <div key={lane ?? "all"} className="kx-lane">
            {lane && <p className="kx-lane__head">{lane}</p>}
            <ol className={`kx-stepper ${chart.horizontal ? "is-horizontal" : ""}`} style={{ "--n": steps.length } as React.CSSProperties}>
              <span className="kx-stepper__track" aria-hidden="true">
                <span className="kx-stepper__fill kx-grow-track" />
              </span>
              {steps.map((s, i) => (
                <li key={s.title} className={`kx-step ${s.current ? "is-current" : ""}`} aria-current={s.current ? "step" : undefined} style={{ "--i": i } as React.CSSProperties}>
                  <span className="kx-step__node" aria-hidden="true">{i + 1}</span>
                  <div className="kx-step__body">
                    {s.when && <p className="kx-step__when">{s.when}</p>}
                    <h5>{s.title}</h5>
                    <p>{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        );
      })}
    </div>
  );
}

function Cards({ chart }: { chart: Extract<ChartSpec, { type: "cards" }> }) {
  return (
    <div className={`kx-cards cols-${chart.columns ?? 2}`}>
      {chart.cards.map((c) => (
        <div key={c.title} className={`kx-card ${c.tone ? `is-${c.tone}` : ""}`}>
          {c.kicker && <p className="kx-card__kicker">{c.kicker}</p>}
          <h5>{c.title}</h5>
          <p>{c.body}</p>
          {c.meta && <p className="kx-card__meta">{c.meta}</p>}
          {c.links && (
            <p className="kx-card__meta">
              {c.links.map((l, i) => (
                <span key={l.href}>{i > 0 ? " · " : ""}<a href={l.href}>{l.label}</a></span>
              ))}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

const TIER_CELL = /^T[123]$/;
/** A cell that is only a tier is drawn as the tier pill (shape-coded), and still reads as text. */
function MatrixCell({ text }: { text: string }) {
  if (TIER_CELL.test(text)) return <span className={`tp tp-${text}`}>{text}</span>;
  if (text === "—") return <span className="kx-nil">—<span className="sr-only"> none</span></span>;
  return <>{text}</>;
}

function Matrix({ chart, caption }: { chart: Extract<ChartSpec, { type: "matrix" }>; caption: string }) {
  return (
    <div className="kx-matrix rm-scroll" tabIndex={0} role="region" aria-label={caption}>
      <table className={`rm-table kx-table ${chart.cards === false ? "" : "is-cards"}`}>
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr>{chart.header.map((h) => <th key={h} scope="col">{h}</th>)}</tr>
        </thead>
        <tbody>
          {chart.rows.map((r) => (
            <tr key={r.head}>
              <th scope="row">{r.head}</th>
              {r.cells.map((c, i) => (
                <td key={i} data-col={chart.header[i + 1]}>
                  <MatrixCell text={c} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** A decision tree: the question at the root, a branch per rule that draws as it enters. */
function Decision({ question, rules }: { question: string; rules: { if: string; then: string }[] }) {
  return (
    <div className="kx-tree">
      <p className="kx-tree__root">{question}</p>
      <ol className="kx-tree__branches">
        {rules.map((r, i) => (
          <li key={r.if} className="kx-tree__branch" style={{ "--i": i } as React.CSSProperties}>
            <span className="kx-tree__elbow kx-grow-elbow" aria-hidden="true" />
            <p className="kx-tree__if"><span className="kx-tree__k">If</span> {r.if}</p>
            <span className="kx-tree__arrow" aria-hidden="true" />
            <p className="kx-tree__then"><span className="kx-tree__k">then</span> {r.then}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ------------------------------------------------------------------ comparison marks */

function Dumbbell({ chart }: { chart: Extract<ChartSpec, { type: "dumbbell" }> }) {
  const x = scaleLinear().domain([0, chart.max]).range([0, 1]);
  const ticks = x.ticks(5);
  return (
    <div className="kx-bars kx-dumbbell">
      <p className="kx-dkey">
        <span><span className="kx-dot is-a" aria-hidden="true" />{chart.aLabel}</span>
        <span><span className="kx-dot is-b" aria-hidden="true" />{chart.bLabel}</span>
      </p>
      <ol className="kx-rows">
        {chart.items.map((it, i) => {
          const a = it.a === null ? "Data needed" : `${it.a}${chart.unit}`;
          const b = it.b === null ? "Data needed" : `${it.b}${chart.unit}`;
          const up = it.a !== null && it.b !== null && it.b >= it.a;
          return (
            <li key={it.label} className="kx-row" tabIndex={0} aria-label={`${it.label}: ${chart.aLabel} ${a}; ${chart.bLabel} ${b}${it.note ? `. ${it.note}` : ""}`}>
              <div className="kx-label">
                <span className="kx-name">{it.label}</span>
                <span className="kx-val kx-val--pair pf-num">
                  <span className="kx-muted">{a}</span> <span aria-hidden="true">→</span> <strong>{b}</strong>
                </span>
              </div>
              <div className="kx-track kx-track--db">
                <Ticks x={x} ticks={ticks} />
                {it.a !== null && it.b !== null && (
                  <span
                    className={`kx-db__link kx-grow ${up ? "is-up" : "is-down"}`}
                    style={{ left: pct(x(Math.min(it.a, it.b))), width: pct(x(Math.abs(it.a - it.b))), "--i": i } as React.CSSProperties}
                    aria-hidden="true"
                  />
                )}
                {it.a !== null && <span className="kx-dot is-a kx-dot--abs" style={{ left: pct(x(it.a)) }} aria-hidden="true" />}
                {it.b !== null && <span className="kx-dot is-b kx-dot--abs" style={{ left: pct(x(it.b)) }} aria-hidden="true" />}
              </div>
              {it.note && <p className="kx-note">{it.note}</p>}
            </li>
          );
        })}
      </ol>
      <Axis x={x} ticks={ticks} hi={chart.max} unit={chart.unit} />
    </div>
  );
}

/** Isotype: one square is one resident in a hundred; a fractional last square is drawn part-filled. */
function Icons({ chart }: { chart: Extract<ChartSpec, { type: "icons" }> }) {
  return (
    <div className="kx-iso">
      {chart.items.map((it) => {
        const full = Math.floor(it.share);
        const part = it.share - full;
        return (
          <div key={it.label} className="kx-iso__card">
            <p className="kx-iso__value pf-num"><Roll value={`${it.share}%`} /></p>
            <p className="kx-iso__label">{it.label}</p>
            <div className="kx-iso__grid" role="img" aria-label={`${it.share} of every 100 residents`}>
              {Array.from({ length: 100 }, (_, i) => (
                <i key={i} style={{ "--i": i } as React.CSSProperties}>
                  {(i < full || (i === full && part > 0)) && <b className={it.state === "sourced" ? "" : "is-modelled"} style={i < full ? undefined : { width: pct(part) }} />}
                </i>
              ))}
            </div>
            <p className="kx-note">One square is 1% of residents{part > 0 ? "; the last is drawn part-filled, not rounded." : "."}</p>
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ ranking and routes */

/**
 * Pareto on ONE axis (brief §N fig-3-2): each ward's bar is its share of the register, so the bars
 * and the cumulative line are both read against the same 0–100% scale. Each bar is a focusable
 * mark with its ward and share on hover, focus or tap; the line is drawn over the bars in SVG.
 */
function Pareto({ chart }: { chart: Extract<ChartSpec, { type: "pareto" }> }) {
  const n = chart.items.length;
  const y = scaleLinear().domain([0, 100]).range([0, 1]);
  const cum = runningTotal(chart.items.map((it) => it.share));
  const line = cum.map((c, i) => `${i === 0 ? "M" : "L"}${i + 1},${(100 - c).toFixed(2)}`).join(" ");
  const cutCum = cum[chart.cutAt - 1] ?? 0;
  return (
    <div className="kx-pareto">
      <div className="kx-pareto__plot">
        {[0, 25, 50, 75, 100].map((t) => (
          <span key={t} className="kx-pareto__grid" style={{ bottom: pct(y(t)) }} aria-hidden="true">
            <span>{t}%</span>
          </span>
        ))}
        <ol className="kx-pareto__bars" style={{ "--n": n } as React.CSSProperties}>
          {chart.items.map((it, i) => (
            <li key={it.label} className={`kx-pbar ${it.top ? "is-top" : ""}`} tabIndex={0} aria-label={`${it.label}: ${it.share}% of the register; running total ${cum[i].toFixed(1)}%`}>
              <span className="kx-pbar__fill kx-grow-y" style={{ height: pct(y(it.share)), "--i": i } as React.CSSProperties} />
              {it.mark && <span className="kx-pbar__mark" aria-hidden="true" />}
              <span className="kx-tip" aria-hidden="true">
                <strong>{it.label}</strong> {it.share}% · running total {cum[i].toFixed(1)}%
              </span>
            </li>
          ))}
        </ol>
        <svg className="kx-pareto__line" viewBox={`0 0 ${n} 100`} preserveAspectRatio="none" aria-hidden="true" focusable="false">
          <path d={`M0,100 L${line.slice(1)}`} pathLength={1} className="kx-draw" vectorEffect="non-scaling-stroke" />
        </svg>
        <span className="kx-pareto__cut" style={{ left: pct(chart.cutAt / n) }} aria-hidden="true" />
        <span className="kx-pareto__dot" style={{ left: pct(chart.cutAt / n), bottom: pct(y(cutCum)) }} aria-hidden="true" />
        <span className={`kx-pareto__cutlabel ${chart.cutAt / n > 0.6 ? "is-left" : ""}`} style={{ left: pct(chart.cutAt / n), bottom: pct(y(cutCum)) }}>
          {chart.cutLabel}
        </span>
      </div>
      <p className="kx-pareto__x">Wards, largest to smallest ({n})</p>
      <ul className="kx-legend">
        <li><span className="kx-swatch is-seq" aria-hidden="true" />{chart.topLabel}</li>
        <li><span className="kx-swatch is-neutral" aria-hidden="true" />The other wards</li>
        <li><span className="kx-swatch is-line" aria-hidden="true" />Running total, share of the register</li>
        <li><span className="kx-swatch is-mark" aria-hidden="true" />{chart.markLabel}</li>
      </ul>
    </div>
  );
}

/** Each route as two stacked bars, registered voters and ballots at the constant, against one line. */
function Paths({ uid, chart }: { uid: string; chart: Extract<ChartSpec, { type: "paths" }> }) {
  const { x, ticks, top } = linear(Math.max(chart.max, chart.ref.value));
  return (
    <div className="kx-paths">
      <RefKey ref_={chart.ref} />
      <div className="kx-paths__grid">
        {chart.groups.map((g) => (
          <section key={g.title} className={`kx-route ${g.tag ? "is-trap" : ""}`}>
            <h6 className="kx-route__title">
              {g.title}
              {g.tag && <span className="kx-route__tag">{g.tag}</span>}
            </h6>
            {g.rows.map((r, ri) => {
              const total = r.segments.reduce((n, s) => n + (s.value ?? 0), 0);
              const ends = runningTotal(r.segments.map((s) => s.value ?? 0));
              return (
                <div key={r.label} className="kx-route__row">
                  <div className="kx-label">
                    <span className="kx-name">{r.label}</span>
                    <span className="kx-val pf-num"><CountUp text={group(total)} /></span>
                  </div>
                  <div className="kx-track kx-track--route">
                    <Ticks x={x} ticks={ticks} />
                    {r.segments.map((s, i) => {
                      const from = ends[i] - (s.value ?? 0);
                      const tone: Tone = s.tone && s.tone !== "rival" ? s.tone : "neutral";
                      return (
                        <span
                          key={s.label}
                          className={`kx-rseg is-${tone} ${i % 2 ? "is-alt" : ""}`}
                          style={{ left: pct(x(from)), width: pct(x(s.value ?? 0)) }}
                          tabIndex={0}
                          role="img"
                          aria-label={`${g.title}, ${r.label}: ${s.label} ${group(s.value ?? 0)}${s.state !== "sourced" ? ` (${STATE_WORD[s.state].toLowerCase()})` : ""}`}
                        >
                          <BarMark uid={uid} w={1} tone={tone} state={s.state} i={ri * 3 + i} />
                          <span className="kx-tip" aria-hidden="true">
                            <strong>{s.label}</strong> {group(s.value ?? 0)}
                            {s.state !== "sourced" && ` · ${STATE_WORD[s.state].toLowerCase()}`}
                          </span>
                        </span>
                      );
                    })}
                    <span className="kx-ref" style={{ left: pct(x(chart.ref.value)) }} aria-hidden="true" />
                  </div>
                  {r.segments.length > 1 && <p className="kx-note">{r.segments.map((s) => `${s.label} ${group(s.value ?? 0)}`).join(" + ")}</p>}
                </div>
              );
            })}
          </section>
        ))}
      </div>
      <Axis x={x} ticks={ticks} hi={top} />
    </div>
  );
}

/** The screen as displayed, in a phone frame, each problem pinned where it sits (fig-3-9, fig-5-2-3). */
function Mock({ chart }: { chart: Extract<ChartSpec, { type: "mock" }> }) {
  return (
    <div className="kx-mock">
      <div className="kx-phone" aria-label="The screen, as displayed. Illustrative mockup." role="group">
        <span className="kx-phone__notch" aria-hidden="true" />
        <div className="kx-phone__screen">
          <p className="kx-phone__head">{chart.header}</p>
          <ol className="kx-phone__fields">
            {chart.fields.map((f) => (
              <li key={f.n}>
                <span className="kx-phone__k">{f.label}</span>
                <span className="kx-phone__v">{f.shown}</span>
                <span className="kx-pin" aria-hidden="true">{f.n}</span>
              </li>
            ))}
          </ol>
        </div>
        <p className="kx-phone__tag">Illustrative mockup</p>
      </div>
      <ol className="kx-mock__issues">
        {chart.fields.map((f) => (
          <li key={f.n}>
            <span className="kx-pin" aria-hidden="true">{f.n}</span>
            <span>
              <span className="sr-only">{f.n}. </span>
              {f.issue}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

/**
 * One week, a column per day, coloured by the four production pillars only and labelled P1–P4.
 * Two radios and CSS switch the week between the briefed week and the week as it runs now: each
 * cell morphs in place, and with scripts off (or on paper) both states are printed.
 */
function Calendar({ uid, chart }: { uid: string; chart: Extract<ChartSpec, { type: "calendar" }> }) {
  return (
    <div className="kx-cal">
      <fieldset className="pf-toggle kx-cal__toggle">
        <legend className="sr-only">Which week</legend>
        <input type="radio" id={`${uid}-a`} name={`${uid}-wk`} value="a" defaultChecked />
        <label htmlFor={`${uid}-a`}>The week, briefed</label>
        <input type="radio" id={`${uid}-b`} name={`${uid}-wk`} value="b" />
        <label htmlFor={`${uid}-b`}>The week now</label>
        <span className="pf-toggle__thumb" aria-hidden="true" />
      </fieldset>
      <ul className="kx-legend">
        {chart.pillars.map((p, i) => (
          <li key={p}><span className="kx-swatch" style={{ background: `var(--pillar-${i + 1})` }} aria-hidden="true" />P{i + 1} · {p}</li>
        ))}
      </ul>
      <ol className="kx-week">
        {chart.days.map((d, i) => (
          <li key={d.day} className="kx-day" style={{ "--i": i } as React.CSSProperties}>
            <div className={`kx-day__band ${d.pillar ? "" : "is-none"}`} style={d.pillar ? ({ "--band": `var(--pillar-${d.pillar})`, "--band-ink": `var(--pillar-ink-${d.pillar})` } as React.CSSProperties) : undefined}>
              <span>{d.day}</span>
              <span className="kx-day__p">{d.pillar ? `P${d.pillar}` : "no pillar"}</span>
            </div>
            <p className="kx-day__after"><span className="kx-day__k">Briefed: </span>{d.after}</p>
            <p className="kx-day__now"><span className="kx-day__k">Now: </span>{d.now}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

/** Numbers with context, never naked. The final value is in the HTML; the digits roll to it. */
function Stats({ chart }: { chart: Extract<ChartSpec, { type: "stats" }> }) {
  return (
    <ul className="kx-stats">
      {chart.items.map((it) => (
        <li key={it.label} className={`kx-stat ${it.state === "modelled" || it.state === "target" ? "is-modelled" : ""}`}>
          <p className="kx-stat__v pf-num"><Roll value={it.value} /></p>
          <p className="kx-stat__l">{it.label}</p>
          {it.state !== "sourced" && <p className="kx-chip is-modelled">{STATE_WORD[it.state]}</p>}
        </li>
      ))}
    </ul>
  );
}

/**
 * Each measure as a ring. A baseline that has not been measured is a dashed empty ring labelled
 * with when it will be set, never a zero (brief §10, fig-1-5). A measured share would fill its arc.
 */
/** Two short lines for inside a ring: "set in Week 1" → "set in" / "Week 1". */
function ringLines(text: string): string[] {
  const words = text.split(" ");
  const half = Math.ceil(words.length / 2);
  const lines = words.length < 2 ? [text] : [words.slice(0, half).join(" "), words.slice(half).join(" ")];
  // Anything longer than a ring can hold is left to the baseline line beside it.
  return lines.every((l) => l.length <= 7) ? lines : [];
}

function Gauges({ chart }: { chart: Extract<ChartSpec, { type: "gauges" }> }) {
  return (
    <ol className="kx-gauges">
      {chart.items.map((g, i) => {
        const measured = typeof g.share === "number";
        return (
          <li key={g.code} className="kx-gauge" style={{ "--i": i } as React.CSSProperties}>
            <svg className="kx-ring" viewBox="0 0 64 64" role="img" aria-label={measured ? `Baseline ${g.share}%` : `Baseline: ${g.baseline}`}>
              <circle cx="32" cy="32" r="26" className={measured ? "kx-ring__track" : "kx-ring__empty"} />
              {measured && <circle cx="32" cy="32" r="26" pathLength={100} className="kx-ring__arc" style={{ strokeDasharray: `${g.share} 100` }} />}
              {measured ? (
                <text x="32" y="36" textAnchor="middle" className="kx-ring__t">{`${g.share}%`}</text>
              ) : (
                ringLines(g.baseline).map((line, k, all) => (
                  <text key={k} x="32" y={36 + (k - (all.length - 1) / 2) * 12} textAnchor="middle" className="kx-ring__t">{line}</text>
                ))
              )}
            </svg>
            <div>
              <p className="kx-gauge__code">{g.code}</p>
              <h5>{g.title}</h5>
              <p className="kx-gauge__t"><span>Target</span> {g.target}</p>
              <p className="kx-gauge__b"><span>Baseline</span> {g.baseline}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

/** Owners and their stations, posture as line style: solid places, dashed monitors. Deterministic. */
function Network({ chart, title }: { chart: Extract<ChartSpec, { type: "network" }>; title: string }) {
  const W = 360, rowH = 34, top = 14;
  const H = top + chart.stations.length * rowH + 8;
  const ownerY = (id: string) => {
    const mine = chart.stations.map((s, i) => ({ s, i })).filter((x) => x.s.owner === id);
    const mid = mine.reduce((n, x) => n + x.i, 0) / Math.max(1, mine.length);
    return top + mid * rowH + rowH / 2;
  };
  const ox = 142, sx = 192;
  return (
    <svg className="rf-svg kx-net" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={title}>
      {chart.stations.map((s, i) => {
        const y = top + i * rowH + rowH / 2;
        const oy = ownerY(s.owner);
        const cls = s.posture === "placement" ? "is-place" : s.posture === "monitoring" ? "is-monitor" : "is-secondary";
        return (
          <path key={`l-${s.name}`} d={`M${ox},${oy} C${ox + 34},${oy} ${sx - 34},${y} ${sx},${y}`} pathLength={s.posture === "monitoring" ? undefined : 1} className={`kx-net__link ${s.posture === "monitoring" ? "kx-fade" : "kx-draw"} ${cls}`} aria-hidden="true" />
        );
      })}
      {chart.owners.map((o) => (
        <g key={o.id} aria-hidden="true">
          <rect x={4} y={ownerY(o.id) - 13} width={ox - 4} height={26} rx={7} className="kx-net__owner" />
          <text x={12} y={ownerY(o.id) + 4} className="kx-net__otext">{o.name}</text>
        </g>
      ))}
      {chart.stations.map((s, i) => {
        const y = top + i * rowH + rowH / 2;
        const owner = chart.owners.find((o) => o.id === s.owner)?.name ?? "";
        const word = s.posture === "placement" ? "place" : s.posture === "monitoring" ? "monitor" : "secondary";
        const cls = s.posture === "placement" ? "is-place" : s.posture === "monitoring" ? "is-monitor" : "is-secondary";
        return (
          <g key={s.name} className={`kx-net__station ${cls}`} tabIndex={0} role="img" aria-label={`${s.name}, owned by ${owner}: ${word}`}>
            <title>{`${s.name} · ${owner} · ${word}`}</title>
            <rect x={sx} y={y - 12} width={W - sx - 4} height={24} rx={12} />
            <text x={sx + 11} y={y + 4} className="kx-net__stext">{s.name}</text>
            <text x={W - 14} y={y + 4} textAnchor="end" className="kx-net__ptext">{word}</text>
          </g>
        );
      })}
    </svg>
  );
}

/** The message house, assembled from the ground up as it enters: foundation, pillars, roof. */
function House({ chart }: { chart: Extract<ChartSpec, { type: "house" }> }) {
  return (
    <div className="kx-house">
      <div className="kx-house__roof">
        <p className="kx-house__k">The position</p>
        <p className="kx-house__roofText">{chart.roof}</p>
      </div>
      <div className="kx-house__pillars" style={{ "--n": chart.pillars.length } as React.CSSProperties}>
        {chart.pillars.map((p, i) => (
          <div key={p.title} className="kx-house__pillar" style={{ "--i": i } as React.CSSProperties}>
            <h5>{p.title}</h5>
            <p>{p.body}</p>
          </div>
        ))}
      </div>
      <div className="kx-house__base">
        <p className="kx-house__k">The foundation: his record</p>
        <ul>
          {chart.foundation.map((f) => <li key={f}>{f}</li>)}
        </ul>
      </div>
    </div>
  );
}

/**
 * The hypothesis on a balance: what supports it in one pan, what counts against it in the other.
 * The beam is drawn level: the figure weighs nothing itself. The Week 1 test is what decides, and
 * it sits beneath the fulcrum.
 */
function Balance({ chart }: { chart: Extract<ChartSpec, { type: "balance" }> }) {
  return (
    <div className="kx-balance">
      <div className="kx-balance__hyp">
        <p className="kx-house__k">The hypothesis</p>
        <p className="kx-balance__hypText">{chart.hypothesis}</p>
      </div>
      <svg className="kx-balance__scale" viewBox="0 0 400 96" aria-hidden="true" focusable="false">
        <line x1="200" y1="14" x2="200" y2="86" className="kx-balance__post" />
        <path d="M184 90 L216 90 L200 76 Z" className="kx-balance__foot" />
        <g className="kx-balance__beam">
          <line x1="52" y1="16" x2="348" y2="16" />
          <circle cx="200" cy="16" r="5" />
          <line x1="72" y1="16" x2="52" y2="58" className="kx-balance__string" />
          <line x1="72" y1="16" x2="92" y2="58" className="kx-balance__string" />
          <line x1="328" y1="16" x2="308" y2="58" className="kx-balance__string" />
          <line x1="328" y1="16" x2="348" y2="58" className="kx-balance__string" />
          <path d="M40 58 Q72 78 104 58 Z" className="kx-balance__pan is-for" />
          <path d="M296 58 Q328 78 360 58 Z" className="kx-balance__pan is-against" />
        </g>
      </svg>
      <div className="kx-balance__pans">
        <div className="kx-card is-for">
          <h5>What supports it</h5>
          <ul>{chart.supporting.map((s) => <li key={s}>{s}</li>)}</ul>
        </div>
        <div className="kx-card is-outside">
          <h5>What counts against it</h5>
          <ul>{chart.counter.map((s) => <li key={s}>{s}</li>)}</ul>
        </div>
      </div>
      <div className="kx-card is-accent kx-balance__test">
        <h5>The Week 1 test</h5>
        <ol>{chart.test.map((s) => <li key={s}>{s}</li>)}</ol>
      </div>
    </div>
  );
}

const LEVEL = ["", "Low", "Medium", "High"];
const IMPACT_LEVEL = ["", "Moderate", "High", "Severe"];

/** Likelihood × impact, each risk pinned by its code where it sits; the labels list beneath. */
function Risk({ chart }: { chart: Extract<ChartSpec, { type: "risk" }> }) {
  return (
    <div className="kx-risk">
      <p className="kx-cap">Rows: likelihood. Columns: impact. The warm corner is high likelihood and high impact.</p>
      <table className="kx-riskgrid">
        <caption className="sr-only">Risks by likelihood (rows) and impact (columns)</caption>
        <thead>
          <tr><td aria-hidden="true" />{[1, 2, 3].map((i) => <th key={i} scope="col">{IMPACT_LEVEL[i]}</th>)}</tr>
        </thead>
        <tbody>
          {[3, 2, 1].map((l) => (
            <tr key={l}>
              <th scope="row">{LEVEL[l]}</th>
              {[1, 2, 3].map((i) => (
                <td key={i} className={`heat-${l + i}`}>
                  {chart.items.filter((r) => r.likelihood === l && r.impact === i).map((r) => (
                    <span key={r.code} className="kx-riskpin" tabIndex={0} role="img" aria-label={`${r.code}: ${r.label}. ${LEVEL[r.likelihood]} likelihood, ${IMPACT_LEVEL[r.impact].toLowerCase()} impact`}>
                      {r.code}
                      <span className="kx-tip" aria-hidden="true">{r.label}</span>
                    </span>
                  ))}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <ul className="kx-risk__list">
        {chart.items.map((r) => (
          <li key={r.code}>
            <strong className="kx-riskpin is-static" aria-hidden="true">{r.code}</strong>
            <span>
              <span className="sr-only">{r.code} </span>
              {r.label} <span className="kx-muted">· {LEVEL[r.likelihood].toLowerCase()} likelihood, {IMPACT_LEVEL[r.impact].toLowerCase()} impact</span>
            </span>
          </li>
        ))}
      </ul>
      {chart.branches?.map((b) => (
        <div key={b.title} className="kx-card kx-risk__branch">
          <h5>{b.title}</h5>
          <Decision question={b.question} rules={b.rules} />
        </div>
      ))}
    </div>
  );
}

function Heatmap({ chart, caption }: { chart: Extract<ChartSpec, { type: "heatmap" }>; caption: string }) {
  const all = chart.values.flat().filter((v): v is number => v !== null);
  const lo = Math.min(...all), hi = Math.max(...all);
  const s = scaleLinear().domain([lo, hi]).range([1, 5]).clamp(true);
  const step = (v: number) => Math.round(s(v));
  return (
    <div className="kx-heat">
      <div className="rm-scroll" tabIndex={0} role="region" aria-label={caption}>
        <table className="rm-table kx-table kx-heat__table">
          <caption className="sr-only">{caption}</caption>
          <thead><tr><th scope="col"><span className="sr-only">Row</span></th>{chart.colLabels.map((c) => <th key={c} scope="col">{c}</th>)}</tr></thead>
          <tbody>
            {chart.rowLabels.map((r, i) => (
              <tr key={r}>
                <th scope="row">{r}</th>
                {chart.values[i].map((v, j) => {
                  if (v === null) return <td key={j} className="kx-nil">Data needed</td>;
                  const k = step(v);
                  return (
                    <td key={j} className="kx-heat__cell pf-num" style={{ "--heat": `var(--seq-${k})`, "--heat-ink": k >= 3 ? "var(--seq-ink-dark)" : "var(--seq-ink-light)" } as React.CSSProperties}>
                      {v}{chart.unit}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="kx-ramp" aria-hidden="true">
        <span>{lo}{chart.unit}</span>
        <span className="kx-ramp__bar" />
        <span>{hi}{chart.unit}</span>
      </p>
    </div>
  );
}

/** The argument rail: one continuous line through five nodes, each a link to its part. */
function Spine({ chart }: { chart: Extract<ChartSpec, { type: "spine" }> }) {
  return (
    <nav aria-label="The shape of the argument" className="kx-spine">
      <ol style={{ "--n": chart.steps.length } as React.CSSProperties}>
        <span className="kx-spine__line kx-grow-track" aria-hidden="true" />
        {chart.steps.map((s, i) => (
          <li key={s.label} className={chart.current === i ? "is-current" : ""} style={{ "--i": i } as React.CSSProperties}>
            <a href={s.href}>
              <span className="kx-spine__node" aria-hidden="true" />
              <span className="kx-spine__n" aria-hidden="true">{i + 1}</span>
              <span className="kx-spine__label">{s.label}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
