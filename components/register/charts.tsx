import type { Bar, CellState, Chart as ChartSpec, FigureSpec, Ref } from "../../lib/register/types";
import { group } from "../../lib/data/format";
import { TileMap } from "./TileMap";
import { FunnelV2 } from "../premium/FunnelV2";
import { Reveal } from "../premium/Reveal";

/**
 * The register's marks. Server-rendered HTML and SVG; nothing here needs JavaScript to be read.
 *
 * Rules every primitive keeps (brief §M, §Q):
 *   - bars start at zero, and every mark carries its value as text beside it
 *   - colour is never the only carrier: Dr. Mulu is accent AND named; a modelled mark is hatched
 *     AND labelled "modelled"; a needed mark is a dashed empty outline AND says what closes it
 *   - one axis, always; a reference line is drawn identically wherever it recurs
 *   - labels sit above bars rather than beside them, so a 320px screen loses nothing
 */
export function Chart({ spec }: { spec: FigureSpec }) {
  return <Part c={spec.chart} spec={spec} />;
}

function Part({ c, spec }: { c: ChartSpec; spec: FigureSpec }) {
  switch (c.type) {
    case "composite":
      return (
        <div className="grid gap-5">
          {c.parts.map((p) => (
            <section key={p.heading}>
              <h5 className="rc-kicker">{p.heading}</h5>
              <Part c={p.chart} spec={spec} />
            </section>
          ))}
        </div>
      );
    case "bars": return <Bars bars={c.bars} max={c.max} ref_={c.ref} unit={c.unit} />;
    case "multiples": return <Multiples chart={c} />;
    case "stack": return <Stack chart={c} />;
    case "waterfall": return <Waterfall chart={c} />;
    case "slope": return <Slope chart={c} title={spec.title} />;
    case "funnel": return <Reveal><FunnelV2 chart={c} id={spec.id} /></Reveal>;
    case "tilemap": return <TileMap id={spec.id} layers={c.layers} initial={c.initial} showWardList={c.showWardList} />;
    case "timeline": return <Timeline chart={c} />;
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
    case "pareto": return <Pareto chart={c} title={spec.title} />;
    case "paths": return <Paths chart={c} />;
    case "mock": return <Mock chart={c} />;
    case "calendar": return <Calendar chart={c} />;
  }
}

const STATE_WORD: Record<CellState, string> = { sourced: "", modelled: "modelled", needed: "data needed", target: "target" };

function barClass(b: Pick<Bar, "tone" | "state">) {
  return ["rb-bar", "rx-draw", b.tone ? `is-${b.tone}` : "", b.state === "modelled" || b.state === "target" ? "is-modelled" : "", b.state === "needed" ? "is-needed" : ""].join(" ");
}

function valueText(b: Bar, unit?: string) {
  if (b.value === null) return "Data needed";
  return b.display ?? `${group(b.value)}${unit ? ` ${unit}` : ""}`;
}

/* ------------------------------------------------------------------ ordered bars */

function Bars({ bars, max, ref_, unit, refLabel = true }: { bars: Bar[]; max?: number; ref_?: Ref; unit?: string; refLabel?: boolean }) {
  const ceiling = max ?? Math.max(...bars.map((b) => b.value ?? 0), ref_?.value ?? 0);
  const pct = (v: number) => `${Math.max(0, Math.min(100, (v / ceiling) * 100))}%`;
  return (
    <div>
      {ref_ && refLabel && <p className="rb-ref-label">Vertical line: {ref_.label}</p>}
      <ol className="rb-list">
        {bars.map((b) => (
          <li key={b.label} className="rb-row">
            <div className="rb-label">
              <span>
                {b.label}
                {b.state !== "sourced" && <span className="rb-note"> · {STATE_WORD[b.state]}</span>}
              </span>
              <span className="v">{valueText(b, unit)}</span>
            </div>
            <div className="rb-track" aria-hidden="true">
              <span className={barClass(b)} style={{ width: b.value === null ? "100%" : pct(Math.abs(b.value)) }} />
              {ref_ && <span className="rb-ref" style={{ left: pct(ref_.value) }} />}
            </div>
            {b.note && <p className="rb-note">{b.note}</p>}
          </li>
        ))}
      </ol>
    </div>
  );
}

function Multiples({ chart }: { chart: Extract<ChartSpec, { type: "multiples" }> }) {
  return (
    <div>
    {chart.ref && <p className="rb-ref-label">Vertical line in every panel: {chart.ref.label}</p>}
    <div className="rc-grid cols-2">
      {chart.panels.map((p) => (
        <div key={p.title} className="rc-card">
          <h5>{p.title}</h5>
          <div className="mt-2">
            <Bars bars={p.bars} max={chart.max} ref_={chart.ref} unit={chart.unit} refLabel={false} />
          </div>
        </div>
      ))}
    </div>
    </div>
  );
}

/* ------------------------------------------------------------------ part-to-whole */

function Stack({ chart }: { chart: Extract<ChartSpec, { type: "stack" }> }) {
  const sum = chart.segments.reduce((s, b) => s + Math.abs(b.value ?? 0), 0);
  const scale = Math.max(sum, chart.total, chart.ref?.value ?? 0);
  const w = (v: number) => `${(Math.abs(v) / scale) * 100}%`;
  return (
    <div>
      <p className="rb-ref-label">{chart.totalLabel}</p>
      <div className="relative" aria-hidden="true">
        <div className="flex h-9 w-full gap-[2px] overflow-hidden rounded-md">
          {chart.segments.map((s) => (
            <span key={s.label} className={`${barClass(s)} !static !rounded-none`} style={{ width: w(s.value ?? 0) }} />
          ))}
        </div>
        {chart.ref && <span className="rb-ref" style={{ left: w(chart.ref.value), top: "-0.375rem", bottom: "-0.375rem" }} />}
      </div>
      {/* Large segments are labelled in place (brief §Q, stacked bars), so the order reads without
          the legend and without colour; small ones rely on the legend beneath. */}
      <div className="flex w-full gap-[2px] text-[0.6875rem] leading-tight text-[var(--ink)]" aria-hidden="true">
        {chart.segments.map((sg) => (
          <span key={sg.label} className="min-w-0 overflow-hidden pt-1" style={{ width: w(sg.value ?? 0) }}>
            {Math.abs(sg.value ?? 0) / scale >= 0.18 ? <strong className="tabular-nums">{valueText(sg, chart.unit)}</strong> : null}
          </span>
        ))}
      </div>
      {chart.ref && <p className="rb-note mt-1">Line: {chart.ref.label}</p>}
      <ul className="tm-legend">
        {chart.segments.map((s) => (
          <li key={s.label}>
            <span className={`tm-swatch ${barClass(s)} !static`} aria-hidden="true" />
            <span>
              {s.label}: <strong className="tabular-nums">{valueText(s, chart.unit)}</strong>
              {s.state !== "sourced" && ` (${STATE_WORD[s.state]})`}
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

function Waterfall({ chart }: { chart: Extract<ChartSpec, { type: "waterfall" }> }) {
  const placed = placeSteps(chart.steps);
  const top = Math.max(...placed.map((p) => Math.max(p.from, p.to)));
  const pct = (v: number) => `${(v / top) * 100}%`;
  return (
    <ol className="rb-list">
      {placed.map((p) => (
        <li key={p.label} className="rb-row">
          <div className="rb-label">
            <span>
              {p.kind === "delta" ? (p.value! >= 0 ? "+ " : "− ") : ""}
              {p.label}
              {p.state !== "sourced" && <span className="rb-note"> · {STATE_WORD[p.state]}</span>}
            </span>
            <span className="v">{p.value === null ? "Data needed" : p.display ?? group(Math.abs(p.value))}</span>
          </div>
          <div className="rb-track" aria-hidden="true">
            <span
              className={barClass({ state: p.state, tone: p.kind === "total" ? "accent" : "neutral" })}
              style={{ left: pct(Math.min(p.from, p.to)), width: pct(Math.abs(p.to - p.from)), borderRadius: 4 }}
            />
          </div>
          {p.kind === "delta" && <p className="rb-note">Running total {group(p.to)}</p>}
        </li>
      ))}
    </ol>
  );
}

function Slope({ chart, title }: { chart: Extract<ChartSpec, { type: "slope" }>; title: string }) {
  const W = 320, H = 180, x1 = 92, x2 = 228, pad = 20;
  const all = chart.lines.flatMap((l) => [l.a, l.b]);
  const hi = Math.max(...all) * 1.1;
  const y = (v: number) => H - pad - (v / hi) * (H - pad * 2);
  return (
    <svg className="rf-svg" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={title}>
      <line x1={x1} x2={x1} y1={pad / 2} y2={H - pad} stroke="var(--line)" />
      <line x1={x2} x2={x2} y1={pad / 2} y2={H - pad} stroke="var(--line)" />
      <text x={x1} y={H - 4} textAnchor="middle" className="muted" fontSize="10">{chart.left}</text>
      <text x={x2} y={H - 4} textAnchor="middle" className="muted" fontSize="10">{chart.right}</text>
      {chart.lines.map((l) => {
        const stroke = l.tone === "accent" ? "var(--accent-solid)" : "var(--neutral-strong)";
        return (
          <g key={l.label}>
            <line x1={x1} y1={y(l.a)} x2={x2} y2={y(l.b)} stroke={stroke} strokeWidth="2" />
            <circle cx={x1} cy={y(l.a)} r="4" fill={stroke} stroke="var(--card)" strokeWidth="2" />
            <circle cx={x2} cy={y(l.b)} r="4" fill={stroke} stroke="var(--card)" strokeWidth="2" />
            <text x={x1 - 8} y={y(l.a) + 3} textAnchor="end" fontSize="10" fontWeight="700">{l.a}{chart.unit}</text>
            <text x={x2 + 8} y={y(l.b) + 3} fontSize="10" fontWeight="700">{l.b}{chart.unit} {l.label}</text>
          </g>
        );
      })}
    </svg>
  );
}

/* ------------------------------------------------------------------ explanatory arithmetic */

/* ------------------------------------------------------------------ time and process */

function Timeline({ chart }: { chart: Extract<ChartSpec, { type: "timeline" }> }) {
  const t0 = Date.parse(chart.from), t1 = Date.parse(chart.to);
  const at = (d: string) => `${((Date.parse(d) - t0) / (t1 - t0)) * 100}%`;
  return (
    <div>
      {/* Horizontal on a wide screen: one date axis, milestones labelled. */}
      <div className="relative hidden h-24 sm:block" aria-hidden="true">
        {chart.events.map((e, i) => {
          // More than three events and the names collide on the axis: number them, and the list
          // beneath carries the same numbers.
          const numbered = chart.events.length > 3;
          const x = (Date.parse(e.date) - t0) / (t1 - t0);
          const align = x < 0.15 ? "" : x > 0.85 ? "-translate-x-full" : "-translate-x-1/2";
          return (
            <span key={`${e.label}-l`} className={`absolute whitespace-nowrap text-[0.6875rem] font-semibold text-[var(--ink)] ${align}`} style={{ left: at(e.date), top: e.end || i % 2 ? "3.75rem" : "0.25rem" }}>
              {numbered ? i + 1 : e.label}
            </span>
          );
        })}
        <div className="absolute left-0 right-0 top-10 h-[2px] bg-[var(--line)]" />
        {chart.today && <span className="absolute top-6 h-10 border-l-2 border-dotted border-[var(--muted)]" style={{ left: at(chart.today) }} />}
        {chart.events.map((e, i) =>
          e.end ? (
            <span key={e.label} className={`absolute top-8 h-4 rounded ${e.reported || e.state === "needed" ? "border-2 border-dashed border-[var(--muted)] bg-transparent" : e.state === "target" ? "bg-[var(--neutral-strong)]" : "bg-[var(--accent-solid)]"}`} style={{ left: at(e.date), width: `calc(${at(e.end)} - ${at(e.date)})` }} />
          ) : (
            <span key={e.label} className="absolute top-8 h-4 w-4 -translate-x-1/2 rounded-full border-2 border-[var(--card)] bg-[var(--accent-solid)]" style={{ left: at(e.date), top: i % 2 ? "2.25rem" : "2rem" }} />
          ),
        )}
      </div>
      {/* The list is the timeline on a phone, and the labels for it on a wide screen. */}
      <ol className="rs-steps sm:grid-cols-2">
        {chart.events.map((e) => (
          <li key={e.label} className={`rs-step ${e.reported || e.state === "needed" ? "!border-dashed" : ""}`}>
            <p className="when">{e.whenText ?? (e.end ? `${fmtDate(e.date)} – ${fmtDate(e.end)}` : fmtDate(e.date))}{e.reported ? " · reported, not confirmed (T3)" : e.state === "needed" ? " · data needed" : e.state === "target" ? " · planned" : ""}</p>
            <h5>{chart.events.length > 3 ? `${chart.events.indexOf(e) + 1}. ` : ""}{e.label}</h5>
            {e.note && <p>{e.note}</p>}
          </li>
        ))}
      </ol>
      {chart.today && <p className="rb-note mt-2">Dotted line: today, {fmtDate(chart.today)}.</p>}
    </div>
  );
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function fmtDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return d ? `${d} ${MONTHS[m - 1]} ${y}` : `${MONTHS[m - 1]} ${y}`;
}

function Steps({ chart }: { chart: Extract<ChartSpec, { type: "steps" }> }) {
  const lanes = chart.lanes ?? [undefined];
  return (
    <div>
      {lanes.map((lane) => (
        <div key={lane ?? "all"}>
          {lane && <p className="rs-lane">{lane}</p>}
          <ol className={`rs-steps ${chart.horizontal ? "is-horizontal" : ""}`}>
            {chart.steps.filter((s) => !lane || s.lane === lane).map((s) => (
              <li key={s.title} className={`rs-step ${s.current ? "is-current" : ""}`} aria-current={s.current ? "step" : undefined}>
                {s.when && <p className="when">{s.when}</p>}
                <h5>{s.title}</h5>
                <p>{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      ))}
    </div>
  );
}

function Cards({ chart }: { chart: Extract<ChartSpec, { type: "cards" }> }) {
  return (
    <div className={`rc-grid cols-${chart.columns ?? 2}`}>
      {chart.cards.map((c) => (
        <div key={c.title} className={`rc-card ${c.tone ? `is-${c.tone}` : ""}`}>
          {c.kicker && <p className="rc-kicker">{c.kicker}</p>}
          <h5>{c.title}</h5>
          <p>{c.body}</p>
          {c.meta && <p className="meta">{c.meta}</p>}
          {c.links && (
            <p className="meta">
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

function Matrix({ chart, caption }: { chart: Extract<ChartSpec, { type: "matrix" }>; caption: string }) {
  return (
    <div className="rm-scroll">
      <table className={`rm-table ${chart.cards === false ? "" : "is-cards"}`}>
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr>{chart.header.map((h) => <th key={h} scope="col">{h}</th>)}</tr>
        </thead>
        <tbody>
          {chart.rows.map((r) => (
            <tr key={r.head}>
              <th scope="row">{r.head}</th>
              {r.cells.map((c, i) => <td key={i} data-col={chart.header[i + 1]}>{c}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Decision({ question, rules }: { question: string; rules: { if: string; then: string }[] }) {
  return (
    <div>
      <p className="rc-kicker">{question}</p>
      <ol className="rs-steps">
        {rules.map((r) => (
          <li key={r.if} className="rs-step grid gap-1 sm:grid-cols-[1fr_auto_1fr] sm:items-start">
            <p className="!mt-0"><span className="when">If </span>{r.if}</p>
            <span aria-hidden="true" className="hidden font-bold text-[var(--accent)] sm:block">→</span>
            <p className="!mt-0"><span className="when">then </span>{r.then}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ------------------------------------------------------------------ comparison marks */

function Dumbbell({ chart }: { chart: Extract<ChartSpec, { type: "dumbbell" }> }) {
  const pct = (v: number) => `${(v / chart.max) * 100}%`;
  return (
    <div>
      <p className="rb-ref-label">
        <span className="inline-block h-2.5 w-2.5 rounded-full border-2 border-[var(--neutral-strong)] align-middle" /> {chart.aLabel}
        {"   "}
        <span className="ml-3 inline-block h-2.5 w-2.5 rounded-full bg-[var(--accent-solid)] align-middle" /> {chart.bLabel}
      </p>
      <ol className="rb-list">
        {chart.items.map((it) => (
          <li key={it.label} className="rb-row">
            <div className="rb-label">
              <span>{it.label}</span>
              <span className="v">{it.a === null ? "—" : `${it.a}${chart.unit}`} / {it.b === null ? "—" : `${it.b}${chart.unit}`}</span>
            </div>
            <div className="rb-track" aria-hidden="true">
              {it.a !== null && it.b !== null && (
                <span className="absolute top-1/2 h-[2px] -translate-y-1/2 bg-[var(--line)]" style={{ left: pct(Math.min(it.a, it.b)), width: pct(Math.abs(it.a - it.b)) }} />
              )}
              {it.a !== null && <span className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[var(--neutral-strong)] bg-[var(--card)]" style={{ left: pct(it.a) }} />}
              {it.b !== null && <span className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--accent-solid)]" style={{ left: pct(it.b) }} />}
            </div>
            {it.note && <p className="rb-note">{it.note}</p>}
          </li>
        ))}
      </ol>
    </div>
  );
}

function Icons({ chart }: { chart: Extract<ChartSpec, { type: "icons" }> }) {
  return (
    <div className="rc-grid cols-3">
      {chart.items.map((it) => {
        const full = Math.floor(it.share);
        const part = it.share - full;
        return (
          <div key={it.label} className="rc-card">
            <p className="rb-label"><span>{it.label}</span><span className="v">{it.share}%</span></p>
            <div className="mt-2 grid grid-cols-10 gap-[2px]" role="img" aria-label={`${it.share} of 100 residents`}>
              {Array.from({ length: 100 }, (_, i) => (
                <span key={i} className="relative block aspect-square overflow-hidden rounded-[2px] bg-[var(--neutral-fill)]">
                  {(i < full || (i === full && part > 0)) && (
                    <span className={`absolute inset-y-0 left-0 ${it.state === "sourced" ? "bg-[var(--seq-4)]" : "bg-[var(--seq-2)]"}`} style={{ width: i < full ? "100%" : `${part * 100}%` }} />
                  )}
                </span>
              ))}
            </div>
            <p className="meta">One square is 1% of residents{part > 0 ? "; the last square is drawn part-filled, not rounded." : "."}</p>
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ ranking and routes */

/**
 * Pareto on ONE axis (brief §N fig-3-2, §Q): each ward's bar is its share of the register, so the
 * bars and the cumulative line are both read against the same 0–100% scale. No second axis.
 */
function Pareto({ chart, title }: { chart: Extract<ChartSpec, { type: "pareto" }>; title: string }) {
  const W = 340, H = 196, L = 30, R = 6, T = 10, B = 30;
  const pw = W - L - R, ph = H - T - B;
  const n = chart.items.length;
  const bw = pw / n;
  const y = (v: number) => T + ph - (v / 100) * ph;
  const cum = runningTotal(chart.items.map((it) => it.share));
  const cutX = L + chart.cutAt * bw;
  const cutY = y(cum[chart.cutAt - 1]);
  const line = cum.map((c, i) => `${i === 0 ? "M" : "L"}${(L + (i + 1) * bw).toFixed(1)},${y(c).toFixed(1)}`).join(" ");
  return (
    <div>
      <svg className="rf-svg" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={title}>
        {[0, 25, 50, 75, 100].map((t) => (
          <g key={t}>
            <line x1={L} x2={W - R} y1={y(t)} y2={y(t)} stroke="var(--line)" strokeWidth={t === 0 ? 1 : 0.5} />
            <text x={L - 4} y={y(t) + 3} textAnchor="end" fontSize="8" className="muted">{t}%</text>
          </g>
        ))}
        {chart.items.map((it, i) => (
          <g key={it.label}>
            <rect x={L + i * bw + 0.5} y={y(it.share)} width={bw - 1} height={Math.max(0.5, T + ph - y(it.share))} rx={1} fill={it.top ? "var(--seq-4)" : "var(--neutral-strong)"} />
            {it.mark && <rect x={L + i * bw + bw / 2 - 1.75} y={T + ph + 4} width={3.5} height={3.5} fill="var(--ink)" />}
          </g>
        ))}
        <path d={line} fill="none" stroke="var(--accent-solid)" strokeWidth="2" />
        <line x1={cutX} x2={cutX} y1={T} y2={T + ph} stroke="var(--ref-line)" strokeDasharray="3 2" />
        <circle cx={cutX} cy={cutY} r="3.5" fill="var(--accent-solid)" stroke="var(--card)" strokeWidth="1.5" />
        <text x={cutX + 5} y={cutY - 5} fontSize="9" fontWeight="700">{chart.cutLabel}</text>
        <text x={L} y={H - 6} fontSize="8" className="muted">Wards, largest to smallest (40)</text>
      </svg>
      <ul className="tm-legend">
        <li><span className="tm-swatch" style={{ background: "var(--seq-4)" }} aria-hidden="true" />{chart.topLabel}</li>
        <li><span className="tm-swatch" style={{ background: "var(--neutral-strong)" }} aria-hidden="true" />The other wards</li>
        <li><span className="inline-block h-[2px] w-4 bg-[var(--accent-solid)] align-middle" aria-hidden="true" /> Running total, share of the register</li>
        <li><span className="inline-block h-2 w-2 bg-[var(--ink)]" aria-hidden="true" /> {chart.markLabel}</li>
      </ul>
    </div>
  );
}

/** Each route as two stacked bars, registered voters and ballots at the constant, against one line. */
function Paths({ chart }: { chart: Extract<ChartSpec, { type: "paths" }> }) {
  const w = (v: number) => `${(Math.abs(v) / chart.max) * 100}%`;
  return (
    <div>
      <p className="rb-ref-label">Vertical line on all eight bars: {chart.ref.label}</p>
      <div className="grid gap-4">
        {chart.groups.map((g) => (
          <section key={g.title} className={`rc-card ${g.tag ? "is-outside" : ""}`}>
            <h5>{g.title}{g.tag && <span className="ml-2 rounded border border-[var(--div-neg)] px-1.5 py-0.5 text-[0.6875rem] font-bold uppercase tracking-wide text-[var(--ink)]">{g.tag}</span>}</h5>
            {g.rows.map((r) => {
              const total = r.segments.reduce((n, s) => n + (s.value ?? 0), 0);
              return (
                <div key={r.label} className="mt-2">
                  <div className="rb-label"><span>{r.label}</span><span className="v">{group(total)}</span></div>
                  <div className="relative" aria-hidden="true">
                    <div className="flex h-3.5 gap-[2px]">
                      {r.segments.map((s, i) => (
                        <span key={s.label} className={`${barClass(s)} !static ${i === r.segments.length - 1 ? "!rounded-r" : "!rounded-none"}`} style={{ width: w(s.value ?? 0), opacity: 1 - i * 0.18 }} />
                      ))}
                    </div>
                    <span className="rb-ref" style={{ left: w(chart.ref.value), top: "-0.25rem", bottom: "-0.25rem" }} />
                  </div>
                  {r.segments.length > 1 && <p className="rb-note">{r.segments.map((s) => `${s.label} ${group(s.value ?? 0)}`).join(" + ")}</p>}
                </div>
              );
            })}
          </section>
        ))}
      </div>
    </div>
  );
}

/** The profile as displayed, with each problem numbered where it sits. */
function Mock({ chart }: { chart: Extract<ChartSpec, { type: "mock" }> }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="rounded-xl border border-[var(--line)] p-3" aria-label="The profile, as displayed">
        <p className="rc-kicker">{chart.header}</p>
        <ol className="grid gap-1.5 text-[0.8125rem]">
          {chart.fields.map((f) => (
            <li key={f.n} className="flex items-start gap-2">
              <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-[var(--div-neg)] text-[0.6875rem] font-bold text-[var(--ink)]" aria-hidden="true">{f.n}</span>
              <span><span className="block text-[var(--muted)]">{f.label}</span><span className="block font-semibold text-[var(--ink)]">{f.shown}</span></span>
            </li>
          ))}
        </ol>
      </div>
      <ol className="grid gap-1.5 text-[0.8125rem] text-[var(--ink)]">
        {chart.fields.map((f) => (
          <li key={f.n} className="flex gap-2"><span className="font-bold">{f.n}.</span><span>{f.issue}</span></li>
        ))}
      </ol>
    </div>
  );
}

/** One week, a column per day, coloured by the four production pillars only and labelled P1–P4. */
function Calendar({ chart }: { chart: Extract<ChartSpec, { type: "calendar" }> }) {
  return (
    <div>
      <ul className="tm-legend">
        {chart.pillars.map((p, i) => (
          <li key={p}><span className="tm-swatch" style={{ background: `var(--pillar-${i + 1})` }} aria-hidden="true" />P{i + 1} · {p}</li>
        ))}
      </ul>
      <ol className="rk-week mt-2">
        {chart.days.map((d) => (
          <li key={d.day} className="rk-day">
            <div className={`rk-band ${d.pillar ? "" : "is-none"}`} style={d.pillar ? { background: `var(--pillar-${d.pillar})`, color: `var(--pillar-ink-${d.pillar})` } : undefined}>
              <span>{d.day}</span><span>{d.pillar ? `P${d.pillar}` : "no pillar"}</span>
            </div>
            <p>{d.after}</p>
            <p className="now">Now: {d.now}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

/** Numbers with context, never naked (brief §F). The final value is in the HTML; a count-up, where
 *  motion is allowed, animates from it rather than to it. */
function Stats({ chart }: { chart: Extract<ChartSpec, { type: "stats" }> }) {
  return (
    <ul className="rc-grid cols-4 rc-stats">
      {chart.items.map((it) => (
        <li key={it.label} className={`rc-card ${it.state === "modelled" || it.state === "target" ? "is-modelled" : ""}`}>
          <p className="rc-stat tabular-nums" data-count-to={it.countTo}>{it.value}</p>
          <p>{it.label}</p>
          {it.state !== "sourced" && <p className="meta">{STATE_WORD[it.state]}</p>}
        </li>
      ))}
    </ul>
  );
}

function Gauges({ chart }: { chart: Extract<ChartSpec, { type: "gauges" }> }) {
  return (
    <ol className="rb-list">
      {chart.items.map((g) => (
        <li key={g.code} className="rc-card">
          <p className="rc-kicker">{g.code}</p>
          <h5>{g.title}</h5>
          <div className="rb-track mt-2" aria-hidden="true">
            <span className="rb-bar is-needed" style={{ width: "100%" }} />
          </div>
          <p className="meta">Baseline: {g.baseline} · Target: {g.target}</p>
        </li>
      ))}
    </ol>
  );
}

function Network({ chart, title }: { chart: Extract<ChartSpec, { type: "network" }>; title: string }) {
  const W = 344, rowH = 30, top = 16;
  const H = top + chart.stations.length * rowH + 8;
  const ownerY = (id: string) => {
    const mine = chart.stations.map((s, i) => ({ s, i })).filter((x) => x.s.owner === id);
    const mid = mine.reduce((n, x) => n + x.i, 0) / Math.max(1, mine.length);
    return top + mid * rowH + rowH / 2;
  };
  return (
    <svg className="rf-svg" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={title}>
      {chart.stations.map((s, i) => {
        const y = top + i * rowH + rowH / 2;
        const placement = s.posture === "placement";
        const monitor = s.posture === "monitoring";
        return (
          <g key={s.name}>
            <line x1={118} y1={ownerY(s.owner)} x2={176} y2={y} stroke="var(--neutral-strong)" strokeWidth="1.5" strokeDasharray={monitor ? "4 3" : undefined} />
            <rect x={176} y={y - 11} width={164} height={22} rx={11} fill={placement ? "var(--seq-4)" : "var(--card)"} stroke={placement ? "var(--seq-4)" : "var(--neutral-strong)"} strokeDasharray={monitor ? "4 3" : undefined} />
            <text x={186} y={y + 4} fontSize="10" fontWeight="700" style={{ fill: placement ? "var(--seq-ink-dark)" : "var(--ink)" }}>{s.name}</text>
            <text x={332} y={y + 4} fontSize="8.5" textAnchor="end" style={{ fill: placement ? "var(--seq-ink-dark)" : "var(--muted)" }}>{placement ? "place" : monitor ? "monitor" : "secondary"}</text>
          </g>
        );
      })}
      {chart.owners.map((o) => (
        <g key={o.id}>
          <rect x={4} y={ownerY(o.id) - 12} width={114} height={24} rx={6} fill="var(--card)" stroke="var(--line)" />
          <text x={12} y={ownerY(o.id) + 4} fontSize="9.5" fontWeight="600">{o.name}</text>
        </g>
      ))}
    </svg>
  );
}

function House({ chart }: { chart: Extract<ChartSpec, { type: "house" }> }) {
  return (
    <div className="grid gap-2">
      <div className="rounded-t-[1.25rem] border-2 border-[var(--accent)] px-4 py-3 text-center">
        <p className="rc-kicker">The position</p>
        <p className="font-bold text-[var(--ink)]">{chart.roof}</p>
      </div>
      <div className="grid gap-2 sm:grid-cols-3">
        {chart.pillars.map((p) => (
          <div key={p.title} className="rc-card">
            <h5>{p.title}</h5>
            <p>{p.body}</p>
          </div>
        ))}
      </div>
      <div className="rounded-b-lg border border-[var(--line)] bg-[color-mix(in_oklab,var(--paper)_60%,var(--card))] px-4 py-3">
        <p className="rc-kicker">The foundation: his record</p>
        <ul className="grid gap-1 text-[0.8125rem] sm:grid-cols-2">
          {chart.foundation.map((f) => <li key={f}>{f}</li>)}
        </ul>
      </div>
    </div>
  );
}

function Balance({ chart }: { chart: Extract<ChartSpec, { type: "balance" }> }) {
  return (
    <div className="grid gap-3">
      <div className="rounded-xl border-2 border-[var(--accent)] px-4 py-3">
        <p className="rc-kicker">The hypothesis</p>
        <p className="text-[0.9375rem] font-semibold text-[var(--ink)]">{chart.hypothesis}</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rc-card"><h5>What supports it</h5><ul className="mt-1 list-disc pl-4 text-[0.8125rem]">{chart.supporting.map((s) => <li key={s}>{s}</li>)}</ul></div>
        <div className="rc-card is-outside"><h5>What counts against it</h5><ul className="mt-1 list-disc pl-4 text-[0.8125rem]">{chart.counter.map((s) => <li key={s}>{s}</li>)}</ul></div>
      </div>
      <div className="rc-card"><h5>The Week 1 test</h5><ol className="mt-1 list-decimal pl-4 text-[0.8125rem]">{chart.test.map((s) => <li key={s}>{s}</li>)}</ol></div>
    </div>
  );
}

const LEVEL = ["", "Low", "Medium", "High"];
const IMPACT_LEVEL = ["", "Moderate", "High", "Severe"];

/** Likelihood × impact, with only the codes in the grid so it stays legible at 360px; the labels
 *  sit in a list beneath, and the table view carries the rest. */
function Risk({ chart }: { chart: Extract<ChartSpec, { type: "risk" }> }) {
  return (
    <div className="grid gap-4">
      <p className="rb-ref-label">Rows: likelihood. Columns: impact. Shaded cells are the high-likelihood, high-impact corner.</p>
      <table className="rk-risk">
        <caption className="sr-only">Risks by likelihood (rows) and impact (columns)</caption>
        <thead>
          <tr><td aria-hidden="true" />{[1, 2, 3].map((i) => <th key={i} scope="col">{IMPACT_LEVEL[i]}</th>)}</tr>
        </thead>
        <tbody>
          {[3, 2, 1].map((l) => (
            <tr key={l}>
              <th scope="row">{LEVEL[l]}</th>
              {[1, 2, 3].map((i) => (
                <td key={i} className={l + i >= 5 ? "is-hot" : ""}>
                  {chart.items.filter((r) => r.likelihood === l && r.impact === i).map((r) => (
                    <span key={r.code} className="rk-code">{r.code}</span>
                  ))}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <ul className="grid gap-1 text-[0.8125rem] text-[var(--ink)]">
        {chart.items.map((r) => (
          <li key={r.code}><strong>{r.code}</strong> {r.label} <span className="text-[var(--muted)]">· {LEVEL[r.likelihood].toLowerCase()} likelihood, {IMPACT_LEVEL[r.impact].toLowerCase()} impact</span></li>
        ))}
      </ul>
      {chart.branches?.map((b) => (
        <div key={b.title} className="rc-card">
          <h5>{b.title}</h5>
          <div className="mt-2"><Decision question={b.question} rules={b.rules} /></div>
        </div>
      ))}
    </div>
  );
}

function Heatmap({ chart, caption }: { chart: Extract<ChartSpec, { type: "heatmap" }>; caption: string }) {
  const all = chart.values.flat().filter((v): v is number => v !== null);
  const lo = Math.min(...all), hi = Math.max(...all);
  const step = (v: number) => 1 + Math.round(((v - lo) / Math.max(1, hi - lo)) * 4);
  return (
    <div className="rm-scroll">
      <table className="rm-table">
        <caption className="sr-only">{caption}</caption>
        <thead><tr><th scope="col"><span className="sr-only">Row</span></th> {chart.colLabels.map((c) => <th key={c} scope="col">{c}</th>)}</tr></thead>
        <tbody>
          {chart.rowLabels.map((r, i) => (
            <tr key={r}>
              <th scope="row">{r}</th>
              {chart.values[i].map((v, j) => {
                if (v === null) return <td key={j} className="text-center text-[var(--muted)]">—</td>;
                const s = step(v);
                return (
                  <td key={j} className="text-center font-bold tabular-nums" style={{ background: `var(--seq-${s})`, color: s >= 3 ? "var(--seq-ink-dark)" : "var(--seq-ink-light)" }}>
                    {v}{chart.unit}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Spine({ chart }: { chart: Extract<ChartSpec, { type: "spine" }> }) {
  return (
    <nav aria-label="The shape of the argument">
      <ol className="rs-steps is-horizontal">
        {chart.steps.map((s, i) => (
          <li key={s.label} className={`rs-step ${chart.current === i ? "is-current" : ""}`}>
            <p className="when">Step {i + 1}</p>
            <h5><a href={s.href} className="underline decoration-[var(--line)] underline-offset-2">{s.label}</a></h5>
          </li>
        ))}
      </ol>
    </nav>
  );
}
