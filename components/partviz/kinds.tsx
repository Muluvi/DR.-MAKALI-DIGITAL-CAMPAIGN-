"use client";

import { useMemo, useState } from "react";

import { AnimatedNumber } from "../visual/AnimatedNumber";
import { Disclose, VizFrame, fmt, share } from "./primitives";
import { KIND_CAPTION } from "../../lib/part-visuals";

/*
 * Fourteen figures, one per relationship the document expresses.
 *
 * It was nineteen. Five of them — StatementPanel, ChapterMap, HubDiagram, QuoteMark and ShapeMap —
 * drew no relationship at all: they re-typeset the heading, listed the subsections below it,
 * redrew its own bullets as a wheel, quoted a truncated fragment of the prose beneath it, or drew
 * an abstract diagram from an empty node array. They existed to satisfy "a figure under every
 * heading", and they have gone with it. A heading with nothing to measure now carries nothing.
 *
 * Every one of them is SVG and CSS. Nothing here imports a charting runtime, because these
 * render down one continuous page and a chart library mounted 272 times is the whole performance
 * budget spent on decoration. The interaction in each is the one the handbook asks for — a tap
 * that reveals the value, a row that opens onto its own sentence — and never an animation that
 * runs on its own.
 */

type D = Record<string, unknown>;
const arr = <T,>(v: unknown): T[] => (Array.isArray(v) ? (v as T[]) : []);
const str = (v: unknown, fallback = ""): string => (typeof v === "string" ? v : fallback);
/** The first clause of a sentence. The rest of it is in the prose under the figure. */
const clip = (s: string, n = 76): string => {
  const cut = s.split(/\s+[—–]\s+|[.;:]\s/)[0] ?? s;
  return cut.length <= n ? cut : cut.slice(0, n - 1).replace(/\s+\S*$/, "") + "…";
};
const num = (v: unknown, fallback = 0): number => (typeof v === "number" && Number.isFinite(v) ? v : fallback);

/* ------------------------------------------------------------------- stats */

interface Fig { label: string; value: number; display: string; pct?: boolean }

export function StatRail({ data }: { data: D }) {
  const figures = arr<Fig>(data.figures).slice(0, 4);
  if (!figures.length) return null;
  return (
    <VizFrame caption={KIND_CAPTION.stats}>
      <div className="pv-rail" style={{ "--pv-n": Math.min(figures.length, 2) } as React.CSSProperties}>
        {figures.map((f, i) => (
          <div key={i} className="pv-rail__cell">
            <span className="pv-rail__value">
              <AnimatedNumber value={f.value} decimals={Number.isInteger(f.value) ? 0 : 1} suffix={f.pct ? "%" : ""} />
            </span>
            <span className="pv-rail__label">{f.label}</span>
          </div>
        ))}
      </div>
    </VizFrame>
  );
}

/* -------------------------------------------------------------------- bars */


/* -------------------------------------------------------------------- bars */

export function BarRank({ data }: { data: D }) {
  const items = arr<Fig>(data.items).filter((i) => Number.isFinite(i.value));
  const [focus, setFocus] = useState<number | null>(null);
  const sorted = useMemo(() => [...items].sort((a, b) => b.value - a.value).slice(0, 6), [items]);
  if (sorted.length < 2) return null;
  const max = sorted[0].value;
  return (
    <VizFrame caption={KIND_CAPTION.bars} note="Sorted by size. Tap a bar to hold it.">
      <ul className="pv-bars">
        {sorted.map((it, i) => (
          <li key={i}>
            <button
              type="button"
              className="pv-bars__row"
              data-focus={focus === i}
              data-dim={focus !== null && focus !== i}
              onClick={() => setFocus((f) => (f === i ? null : i))}
            >
              <span className="pv-bars__label">{it.label}</span>
              <span className="pv-bars__track">
                <span className="pv-bars__fill" style={{ "--pv-w": `${share(it.value, max)}%`, "--pv-d": `${i * 45}ms` } as React.CSSProperties} />
              </span>
              <span className="pv-bars__value">{it.display || fmt(it.value)}</span>
            </button>
          </li>
        ))}
      </ul>
    </VizFrame>
  );
}

/* ------------------------------------------------------------------- gauge */

/**
 * One figure.
 *
 * A PERCENTAGE GETS AN ARC, because a percentage has a ceiling and the arc shows how much of it
 * is used. A COUNT DOES NOT. There is no honest arc for "3 hours" or "400 captains" — any arc
 * drawn under them encodes a maximum the document never states, which is the handbook's rule
 * about not drawing estimates as measurements, one level down. A count gets the big-number
 * treatment instead: the value, what it measures, and nothing pretending to be a scale.
 */


/* ------------------------------------------------------------------- gauge */

/**
 * One figure.
 *
 * A PERCENTAGE GETS AN ARC, because a percentage has a ceiling and the arc shows how much of it
 * is used. A COUNT DOES NOT. There is no honest arc for "3 hours" or "400 captains" — any arc
 * drawn under them encodes a maximum the document never states, which is the handbook's rule
 * about not drawing estimates as measurements, one level down. A count gets the big-number
 * treatment instead: the value, what it measures, and nothing pretending to be a scale.
 */
export function GaugeArc({ data }: { data: D }) {
  const value = num(data.value);
  const pct = data.pct === true;
  const label = str(data.label, "Figure");

  if (!pct) {
    return (
      <VizFrame caption="One figure">
        <div className="pv-one">
          <span className="pv-one__value">
            <AnimatedNumber value={value} decimals={Number.isInteger(value) ? 0 : 1} />
          </span>
          <span className="pv-one__label">{label}</span>
          <span className="pv-one__rule" aria-hidden="true" />
        </div>
      </VizFrame>
    );
  }

  const R = 46;
  const C = Math.PI * R;
  const frac = Math.min(1, Math.max(0, value / 100));
  return (
    <VizFrame caption="Share of the whole">
      <div className="pv-gauge">
        <svg viewBox="0 0 108 60" className="pv-gauge__arc" aria-hidden="true">
          <path d="M8 54a46 46 0 0 1 92 0" className="pv-gauge__bg" />
          <path
            d="M8 54a46 46 0 0 1 92 0"
            className="pv-gauge__fg"
            style={{ strokeDasharray: C, strokeDashoffset: C * (1 - frac) } as React.CSSProperties}
          />
        </svg>
        <div className="pv-gauge__read">
          <span className="pv-gauge__value">
            <AnimatedNumber value={value} decimals={Number.isInteger(value) ? 0 : 1} suffix="%" />
          </span>
          <span className="pv-gauge__label">{label}</span>
        </div>
      </div>
    </VizFrame>
  );
}

/* ------------------------------------------------------------------- donut */


/* ------------------------------------------------------------------- donut */

export function DonutSplit({ data }: { data: D }) {
  const value = Math.min(100, Math.max(0, num(data.value)));
  const label = str(data.label, "Share");
  const rest = str(data.rest);
  const R = 34;
  const C = 2 * Math.PI * R;
  return (
    <VizFrame caption={KIND_CAPTION.donut} note={rest || undefined}>
      <div className="pv-donut">
        <svg viewBox="0 0 88 88" className="pv-donut__svg" aria-hidden="true">
          <circle cx="44" cy="44" r={R} className="pv-donut__bg" />
          <circle
            cx="44"
            cy="44"
            r={R}
            className="pv-donut__fg"
            style={{ strokeDasharray: C, strokeDashoffset: C * (1 - value / 100) } as React.CSSProperties}
          />
        </svg>
        <div className="pv-donut__read">
          <span className="pv-donut__value"><AnimatedNumber value={value} decimals={Number.isInteger(value) ? 0 : 1} suffix="%" /></span>
          <span className="pv-donut__label">{label}</span>
          <span className="pv-donut__rest">{fmt(100 - value, true)} the rest</span>
        </div>
      </div>
    </VizFrame>
  );
}

/* ------------------------------------------------------------------ waffle */


/* ------------------------------------------------------------------ waffle */

export function Waffle({ data }: { data: D }) {
  const parts = arr<{ label: string; value: number }>(data.parts).slice(0, 4);
  if (!parts.length) return null;
  const cells: number[] = [];
  parts.forEach((p, i) => {
    for (let n = 0; n < Math.round(p.value); n++) if (cells.length < 100) cells.push(i);
  });
  while (cells.length < 100) cells.push(-1);
  return (
    <VizFrame caption={KIND_CAPTION.waffle} note="One square is one percent.">
      <div className="pv-waffle">
        <div className="pv-waffle__grid" aria-hidden="true">
          {cells.map((c, i) => (
            <span key={i} className="pv-waffle__cell" data-series={c} style={{ "--pv-d": `${i * 4}ms` } as React.CSSProperties} />
          ))}
        </div>
        <ul className="pv-waffle__key">
          {parts.map((p, i) => (
            <li key={i}>
              <span className="pv-waffle__swatch" data-series={i} aria-hidden="true" />
              <span className="pv-waffle__name">{p.label}</span>
              <span className="pv-waffle__pct">{fmt(p.value, true)}</span>
            </li>
          ))}
        </ul>
      </div>
    </VizFrame>
  );
}

/* --------------------------------------------------------------- waterfall */


/* --------------------------------------------------------------- waterfall */

export function Waterfall({ data }: { data: D }) {
  const steps = arr<Fig>(data.steps).slice(0, 5);
  if (steps.length < 2) return null;
  const max = Math.max(...steps.map((s) => Math.abs(s.value)));
  return (
    <VizFrame caption={KIND_CAPTION.waterfall} note="Each step carries into the next.">
      <ol className="pv-wf">
        {steps.map((s, i) => (
          <li key={i} className="pv-wf__step">
            <span className="pv-wf__n" aria-hidden="true">{i + 1}</span>
            <span className="pv-wf__body">
              <span className="pv-wf__label">{s.label}</span>
              <span className="pv-wf__track">
                <span className="pv-wf__fill" data-last={i === steps.length - 1} style={{ "--pv-w": `${share(s.value, max)}%`, "--pv-d": `${i * 70}ms` } as React.CSSProperties} />
              </span>
            </span>
            <span className="pv-wf__value">{s.display || fmt(s.value)}</span>
          </li>
        ))}
      </ol>
    </VizFrame>
  );
}

/* ------------------------------------------------------------ bullet chart */


/* ------------------------------------------------------------ bullet chart */

export function BulletTarget({ data }: { data: D }) {
  const baseline = num(data.baseline);
  const target = data.target === null ? null : num(data.target);
  const unit = str(data.unit);
  const ceiling = target ? Math.max(target * 1.15, baseline * 1.15, 1) : Math.max(baseline * 1.6, 1);
  return (
    <VizFrame caption={KIND_CAPTION.bullet} note="The bar is where this stands. The rule is where it has to reach.">
      <div className="pv-bullet">
        <div className="pv-bullet__track">
          <span className="pv-bullet__band" />
          <span className="pv-bullet__fill" style={{ "--pv-w": `${Math.max(1.5, (baseline / ceiling) * 100)}%` } as React.CSSProperties} />
          {target !== null && (
            <span className="pv-bullet__target" style={{ left: `${Math.min(98, (target / ceiling) * 100)}%` }} aria-hidden="true" />
          )}
        </div>
        <div className="pv-bullet__reads">
          <span className="pv-bullet__read" data-role="now">
            <b>{fmt(baseline, unit === "%")}</b> now
          </span>
          {target !== null && (
            <span className="pv-bullet__read" data-role="target">
              <b>{fmt(target, unit === "%")}</b> required
            </span>
          )}
        </div>
        <dl className="pv-bullet__meta">
          {str(data.deadline) && (<><dt>By</dt><dd>{str(data.deadline)}</dd></>)}
          {str(data.owner) && (<><dt>Owned by</dt><dd>{str(data.owner)}</dd></>)}
        </dl>
        {str(data.trigger) && (
          <Disclose summary={<span>If it slips</span>}>
            <p className="pv-prose">{str(data.trigger)}</p>
          </Disclose>
        )}
      </div>
    </VizFrame>
  );
}

/* ----------------------------------------------------------------- stepper */


/* ----------------------------------------------------------------- stepper */

export function Stepper({ data }: { data: D }) {
  const steps = arr<{ n: number; label: string; body: string }>(data.steps).slice(0, 8);
  if (!steps.length) return null;
  return (
    <VizFrame caption={KIND_CAPTION.stepper}>
      {/* Labels only. The step bodies are the list immediately below this figure — printing
          them twice is not a visualisation, it is the same paragraph at two type sizes. What the
          figure adds is the SHAPE: how many steps there are, and that they are ordered. */}
      <ol className="pv-steps">
        {steps.map((s, i) => (
          <li key={i} className="pv-steps__item" style={{ "--pv-d": `${i * 60}ms` } as React.CSSProperties}>
            <span className="pv-steps__n" aria-hidden="true">{s.n ?? i + 1}</span>
            <span className="pv-steps__text">
              <b className="pv-steps__label">{s.label}</b>
            </span>
          </li>
        ))}
      </ol>
    </VizFrame>
  );
}

/* ---------------------------------------------------------------- timeline */


/* ---------------------------------------------------------------- timeline */

export function TimelineRail({ data }: { data: D }) {
  const events = arr<{ label: string; body: string }>(data.events).slice(0, 8);
  if (!events.length) return null;
  return (
    <VizFrame caption={KIND_CAPTION.timeline}>
      <ol className="pv-tl">
        {events.map((e, i) => (
          <li key={i} className="pv-tl__item" style={{ "--pv-d": `${i * 70}ms` } as React.CSSProperties}>
            <span className="pv-tl__dot" aria-hidden="true" />
            <span className="pv-tl__text">
              <b className="pv-tl__label">{e.label}</b>
              {e.body && e.body !== e.label ? <span className="pv-tl__body">{clip(e.body)}</span> : null}
            </span>
          </li>
        ))}
      </ol>
    </VizFrame>
  );
}

/* ---------------------------------------------------------------- playbook */


/* ---------------------------------------------------------------- playbook */

export function Playbook({ data }: { data: D }) {
  const pairs = arr<{ when: string; then: string }>(data.pairs).slice(0, 8);
  const heads = arr<string>(data.heads);
  if (!pairs.length) return null;
  return (
    <VizFrame
      caption={KIND_CAPTION.playbook}
      note={heads.length === 2 ? `${heads[0]} → ${heads[1]}` : "Left is the trigger. Right is what happens."}
    >
      <ul className="pv-play">
        {pairs.map((p, i) => (
          <li key={i} className="pv-play__pair" style={{ "--pv-d": `${i * 60}ms` } as React.CSSProperties}>
            <span className="pv-play__when">{p.when}</span>
            <span className="pv-play__arrow" aria-hidden="true" />
            <span className="pv-play__then">{p.then}</span>
          </li>
        ))}
      </ul>
    </VizFrame>
  );
}

/* ------------------------------------------------------------------ matrix */


/* ------------------------------------------------------------------ matrix */

export function MatrixGrid({ data }: { data: D }) {
  const header = arr<string>(data.header);
  const rows = arr<string[]>(data.rows);
  const [open, setOpen] = useState<number | null>(0);
  if (!rows.length || header.length < 2) return null;
  return (
    <VizFrame caption={KIND_CAPTION.matrix} note="Tap a row to read it in full." wide>
      <ul className="pv-mx">
        {rows.map((r, i) => (
          <li key={i} className="pv-mx__row" data-open={open === i}>
            <button type="button" className="pv-mx__head" onClick={() => setOpen((o) => (o === i ? null : i))} aria-expanded={open === i}>
              <span className="pv-mx__key">{r[0]}</span>
              <span className="pv-mx__peek">{r[1]}</span>
              <span className="pv-mx__chev" aria-hidden="true" />
            </button>
            <dl className="pv-mx__detail">
              {r.slice(1).map((cell, c) => (
                <div key={c} className="pv-mx__field">
                  <dt>{header[c + 1] ?? ""}</dt>
                  <dd>{cell}</dd>
                </div>
              ))}
            </dl>
          </li>
        ))}
      </ul>
    </VizFrame>
  );
}

/* ---------------------------------------------------------------- quadrant */

const SCALE: Record<string, number> = { low: 0.2, moderate: 0.5, medium: 0.5, high: 0.8, severe: 0.92, critical: 0.95 };
const level = (s: string) => {
  const k = Object.keys(SCALE).find((key) => s.toLowerCase().includes(key));
  return k ? SCALE[k] : 0.5;
};

/**
 * Nudge markers that landed on the same square apart.
 *
 * A risk register scores on three words — low, medium, high — so a six-risk register routinely
 * puts two or three risks on one point. Plotted faithfully, the ones underneath are invisible:
 * the §13.0 register drew R2 over R1 and R5 over R3, so a reader counted four risks in a figure
 * captioned "six". Co-located markers are spread around a ring, in a fixed order, so the
 * arrangement is identical on every render and no marker is ever hidden.
 *
 * The radius is 0.11 of the field — wide enough to clear a marker at the plot's mobile height,
 * and still less than the 0.12 gap between "high" and "severe", so a risk can never be nudged
 * into a quadrant it does not belong to.
 */


/**
 * Nudge markers that landed on the same square apart.
 *
 * A risk register scores on three words — low, medium, high — so a six-risk register routinely
 * puts two or three risks on one point. Plotted faithfully, the ones underneath are invisible:
 * the §13.0 register drew R2 over R1 and R5 over R3, so a reader counted four risks in a figure
 * captioned "six". Co-located markers are spread around a ring, in a fixed order, so the
 * arrangement is identical on every render and no marker is ever hidden.
 *
 * The radius is 0.11 of the field — wide enough to clear a marker at the plot's mobile height,
 * and still less than the 0.12 gap between "high" and "severe", so a risk can never be nudged
 * into a quadrant it does not belong to.
 */
function spread(points: { x: number; y: number }[]): { x: number; y: number }[] {
  const groups = new Map<string, number[]>();
  points.forEach((p, i) => {
    const key = `${p.x.toFixed(3)}|${p.y.toFixed(3)}`;
    groups.set(key, [...(groups.get(key) ?? []), i]);
  });
  const out = points.map((p) => ({ ...p }));
  for (const idx of groups.values()) {
    if (idx.length < 2) continue;
    const r = 0.11;
    idx.forEach((pointIndex, k) => {
      const angle = (2 * Math.PI * k) / idx.length - Math.PI / 2;
      out[pointIndex] = {
        x: points[pointIndex].x + Math.cos(angle) * r,
        y: points[pointIndex].y + Math.sin(angle) * r,
      };
    });
  }
  // The field the markers are positioned in is already inset from the plot's border by half a
  // marker (see .pv-quad__field), so 0 and 1 are both legal here and a clamp only has to keep a
  // spread point from running past the ends.
  return out.map((p) => ({ x: Math.min(1, Math.max(0, p.x)), y: Math.min(1, Math.max(0, p.y)) }));
}


export function Quadrant({ data }: { data: D }) {
  const items = arr<{ id: string; label: string; likelihood: string; impact: string; owner: string }>(data.items);
  const [sel, setSel] = useState<number | null>(null);
  const positions = useMemo(
    () => spread(items.map((it) => ({ x: level(it.likelihood), y: level(it.impact) }))),
    [items]
  );
  if (!items.length) return null;
  return (
    <VizFrame caption={KIND_CAPTION.quadrant} note="Top right is where the plan changes. Tap a marker to read it.">
      <div className="pv-quad">
        <div className="pv-quad__plot">
          <span className="pv-quad__axis pv-quad__axis--x" aria-hidden="true" />
          <span className="pv-quad__axis pv-quad__axis--y" aria-hidden="true" />
          <span className="pv-quad__tag" data-pos="tr">act now</span>
          <span className="pv-quad__tag" data-pos="bl">monitor</span>
          {/* Markers are positioned inside a field inset from the border by half a marker, so a
              risk scored at the top of both scales sits against the corner rather than over it. */}
          <div className="pv-quad__field">
            {items.map((it, i) => (
              <button
                key={i}
                type="button"
                className="pv-quad__pt"
                data-sel={sel === i}
                style={{ left: `${positions[i].x * 100}%`, bottom: `${positions[i].y * 100}%`, "--pv-d": `${i * 60}ms` } as React.CSSProperties}
                onClick={() => setSel((s) => (s === i ? null : i))}
                aria-label={`${it.id}: ${it.label}`}
              >
                {it.id}
              </button>
            ))}
          </div>
          <span className="pv-quad__xlab">likelihood →</span>
          <span className="pv-quad__ylab">impact →</span>
        </div>
        {/* The frame's note already says to tap. What this line carries is the risk itself, so it
            holds the count until one is chosen rather than repeating the instruction. */}
        <p className="pv-quad__read">
          {sel === null ? (
            `${items.length} risks, scored on likelihood and impact.`
          ) : (
            <><b>{items[sel].id}</b> — {items[sel].label} <i>{items[sel].owner}</i></>
          )}
        </p>
      </div>
    </VizFrame>
  );
}

/* --------------------------------------------------------------------- hub */


/* --------------------------------------------------------------- checklist */

export function ChecklistGrid({ data }: { data: D }) {
  const items = arr<{ label: string; body: string }>(data.items).slice(0, 8);
  if (!items.length) return null;
  return (
    <VizFrame caption={KIND_CAPTION.checklist}>
      <ul className="pv-check">
        {items.map((it, i) => (
          <li key={i} className="pv-check__item" style={{ "--pv-d": `${i * 55}ms` } as React.CSSProperties}>
            <svg viewBox="0 0 16 16" className="pv-check__tick" aria-hidden="true"><path d="M2 8.4l4 4L14 4" /></svg>
            <span className="pv-check__text">
              <b>{it.label}</b>
            </span>
          </li>
        ))}
      </ul>
    </VizFrame>
  );
}

/* ----------------------------------------------------------------- chapter */


/* ---------------------------------------------------------------- contrast */

export function ContrastBar({ data }: { data: D }) {
  const left = str(data.left, "the assumption");
  const right = str(data.right, "the finding");
  return (
    <VizFrame caption={KIND_CAPTION.contrast} note={str(data.lead) || undefined}>
      <div className="pv-contrast">
        <span className="pv-contrast__pole" data-side="l">{left}</span>
        <span className="pv-contrast__line" aria-hidden="true">
          <span className="pv-contrast__marker" />
        </span>
        <span className="pv-contrast__pole" data-side="r">{right}</span>
      </div>
    </VizFrame>
  );
}

/* --------------------------------------------------------------- statement */


