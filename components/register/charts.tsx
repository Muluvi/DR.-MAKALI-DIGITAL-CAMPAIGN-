import type { Bar, CellState, Chart as ChartSpec, FigureSpec, Ref } from "../../lib/register/types";
import { group } from "../../lib/data/format";
import { TileMap } from "./TileMap";

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
    case "funnel": return <Funnel chart={c} id={spec.id} />;
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

function Bars({ bars, max, ref_, unit }: { bars: Bar[]; max?: number; ref_?: Ref; unit?: string }) {
  const ceiling = max ?? Math.max(...bars.map((b) => b.value ?? 0), ref_?.value ?? 0);
  const pct = (v: number) => `${Math.max(0, Math.min(100, (v / ceiling) * 100))}%`;
  return (
    <div>
      {ref_ && <p className="rb-ref-label">Vertical line: {ref_.label}</p>}
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
    <div className="rc-grid cols-2">
      {chart.panels.map((p) => (
        <div key={p.title} className="rc-card">
          <h5>{p.title}</h5>
          <div className="mt-2">
            <Bars bars={p.bars} max={chart.max} ref_={chart.ref} unit={chart.unit} />
          </div>
        </div>
      ))}
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

function FunnelStages({ stages, ref_ }: { stages: Extract<ChartSpec, { type: "funnel" }>["stages"]; ref_?: Ref }) {
  const top = Math.max(...stages.map((s) => s.value ?? 0));
  return (
    <ol className="rb-list">
      {stages.map((s, i) => (
        <li key={s.label} className="rb-row">
          <div className="rb-label">
            <span>{i > 0 ? "→ " : ""}{s.label}{s.state !== "sourced" && <span className="rb-note"> · {STATE_WORD[s.state]}</span>}</span>
            <span className="v">{s.value === null ? "Data needed" : s.display ?? group(s.value)}</span>
          </div>
          <div className="rb-track" aria-hidden="true">
            <span className={barClass({ state: s.state, tone: i === stages.length - 1 ? "accent" : "neutral" })} style={{ width: `${((s.value ?? 0) / top) * 100}%` }} />
            {ref_ && <span className="rb-ref" style={{ left: `${(ref_.value / top) * 100}%` }} />}
          </div>
          {s.note && <p className="rb-note">{s.note}</p>}
        </li>
      ))}
    </ol>
  );
}

function Funnel({ chart, id }: { chart: Extract<ChartSpec, { type: "funnel" }>; id: string }) {
  if (!chart.toggle) return <FunnelStages stages={chart.stages} ref_={chart.ref} />;
  // A two-state toggle that needs no script: a pair of radios, and CSS shows the checked one.
  return (
    <div className="tm">
      <fieldset className="tm-layers">
        <legend>Register</legend>
        <label><input type="radio" name={`${id}-toggle`} value="register" defaultChecked /><span>2022 register</span></label>
        <label><input type="radio" name={`${id}-toggle`} value="zones" /><span>{chart.toggle.label}</span></label>
      </fieldset>
      <div className="tm-panel is-default" data-l="register"><FunnelStages stages={chart.stages} ref_={chart.ref} /></div>
      <div className="tm-panel" data-l="zones"><FunnelStages stages={chart.toggle.stages} ref_={chart.ref} /></div>
    </div>
  );
}

/* ------------------------------------------------------------------ time and process */

function Timeline({ chart }: { chart: Extract<ChartSpec, { type: "timeline" }> }) {
  const t0 = Date.parse(chart.from), t1 = Date.parse(chart.to);
  const at = (d: string) => `${((Date.parse(d) - t0) / (t1 - t0)) * 100}%`;
  return (
    <div>
      {/* Horizontal on a wide screen: one date axis, milestones labelled. */}
      <div className="relative hidden h-24 sm:block" aria-hidden="true">
        <div className="absolute left-0 right-0 top-10 h-[2px] bg-[var(--line)]" />
        {chart.today && <span className="absolute top-6 h-10 border-l-2 border-dotted border-[var(--muted)]" style={{ left: at(chart.today) }} />}
        {chart.events.map((e, i) =>
          e.end ? (
            <span key={e.label} className={`absolute top-8 h-4 rounded ${e.state === "sourced" ? "bg-[var(--accent-solid)]" : "border-2 border-dashed border-[var(--muted)] bg-transparent"}`} style={{ left: at(e.date), width: `calc(${at(e.end)} - ${at(e.date)})` }} />
          ) : (
            <span key={e.label} className="absolute top-8 h-4 w-4 -translate-x-1/2 rounded-full border-2 border-[var(--card)] bg-[var(--accent-solid)]" style={{ left: at(e.date), top: i % 2 ? "2.25rem" : "2rem" }} />
          ),
        )}
      </div>
      {/* The list is the timeline on a phone, and the labels for it on a wide screen. */}
      <ol className="rs-steps sm:grid-cols-2">
        {chart.events.map((e) => (
          <li key={e.label} className={`rs-step ${e.state !== "sourced" ? "!border-dashed" : ""}`}>
            <p className="when">{e.end ? `${fmtDate(e.date)} – ${fmtDate(e.end)}` : fmtDate(e.date)}{e.state !== "sourced" ? ` · ${e.state === "needed" ? "data needed" : "reported, not confirmed"}` : ""}</p>
            <h5>{e.label}</h5>
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
  const W = 320, rowH = 30, top = 16;
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
        return (
          <g key={s.name}>
            <line x1={118} y1={ownerY(s.owner)} x2={190} y2={y} stroke="var(--neutral-strong)" strokeWidth="1.5" strokeDasharray={placement ? undefined : "4 3"} />
            <rect x={190} y={y - 11} width={126} height={22} rx={11} fill={placement ? "var(--seq-4)" : "var(--card)"} stroke={placement ? "var(--seq-4)" : "var(--neutral-strong)"} strokeDasharray={placement ? undefined : "4 3"} />
            <text x={200} y={y + 4} fontSize="10" fontWeight="700" style={{ fill: placement ? "var(--seq-ink-dark)" : "var(--ink)" }}>{s.name}</text>
            <text x={308} y={y + 4} fontSize="8.5" textAnchor="end" style={{ fill: placement ? "var(--seq-ink-dark)" : "var(--muted)" }}>{placement ? "place" : "monitor"}</text>
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
function Risk({ chart }: { chart: Extract<ChartSpec, { type: "risk" }> }) {
  return (
    <div className="grid gap-4">
      <div className="rm-scroll">
        <table className="rm-table">
          <caption className="sr-only">Risks by likelihood (rows) and impact (columns)</caption>
          <thead>
            <tr><th scope="col">Likelihood ↓ / Impact →</th>{[1, 2, 3].map((i) => <th key={i} scope="col">{LEVEL[i]} impact</th>)}</tr>
          </thead>
          <tbody>
            {[3, 2, 1].map((l) => (
              <tr key={l}>
                <th scope="row">{LEVEL[l]} likelihood</th>
                {[1, 2, 3].map((i) => (
                  <td key={i} className={l + i >= 5 ? "bg-[color-mix(in_oklab,var(--div-neg)_10%,transparent)]" : ""}>
                    <ul className="grid gap-1">
                      {chart.items.filter((r) => r.likelihood === l && r.impact === i).map((r) => (
                        <li key={r.code}><strong>{r.code}</strong> {r.label}</li>
                      ))}
                    </ul>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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
        <thead><tr><th scope="col" /> {chart.colLabels.map((c) => <th key={c} scope="col">{c}</th>)}</tr></thead>
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
