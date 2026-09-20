import type { FigurePoint, FigureSeries } from "../../lib/figures/types";
import { IMPRECISE_KINDS } from "../../lib/figures/types";

/**
 * The marks. Server-rendered SVG and CSS, nothing else.
 *
 * FOUR RULES HOLD ACROSS ALL OF THEM, and they are the reason these are hand-built rather than
 * handed to a charting runtime:
 *
 *   1. THE FINAL VALUE IS IN THE HTML. Every bar is drawn at its true width on the server. The
 *      growth animation is a CSS transform layered on top, inside a reduced-motion guard, and it
 *      can only ever be absent — never wrong. A reader with JavaScript off sees the real chart.
 *
 *   2. NOTHING IS CARRIED BY COLOUR ALONE. Every mark is labelled in text. Colour distinguishes;
 *      it never informs, because roughly one man in twelve cannot use it and because this
 *      document will be printed.
 *
 *   3. A MODELLED VALUE IS NEVER A POINT. Where a point carries a range it is drawn as a band
 *      with a tick, not as a bar with a precise end. Drawing an assumption to the pixel is the
 *      single most common way a chart lies.
 *
 *   4. THEY WORK AT 320px. Labels sit above their bars rather than beside them, so nothing
 *      depends on a label column that a narrow screen cannot afford.
 */

const fmt = (n: number, unit: string) =>
  unit === "%" ? `${n.toFixed(1)}%` : `${n.toLocaleString("en-KE")}${unit ? ` ${unit}` : ""}`;

/** Bars grow from a zero baseline once, on first view, and only where motion is welcome. */
const GROW = "fx-figure-bar";

/* ------------------------------------------------------------------ BarList */

/**
 * Ordered horizontal bars with direct labels — the workhorse for "many comparable magnitudes".
 *
 * Optional cumulative line (a Pareto reading) and bracket annotations, both of which §3.4.2 needs:
 * the twelve megawards are a statement about a cumulative share, and saying so on the chart is
 * what stops the reader having to add twelve numbers themselves.
 */
export function BarList({
  series,
  max,
  cumulative = false,
  brackets = [],
  limit,
}: {
  series: FigureSeries;
  /** Force a common scale — use when two BarLists must be compared. */
  max?: number;
  cumulative?: boolean;
  /** Annotations over the first N items: "top 12 = 37.78% of the register". */
  brackets?: { through: number; label: string }[];
  /** Draw only the first N, with a line saying what was left out. */
  limit?: number;
}) {
  const all = series.points;
  const shown = limit ? all.slice(0, limit) : all;
  const ceiling = max ?? Math.max(...all.map((p) => p.value));
  const total = all.reduce((s, p) => s + p.value, 0);

  // Precomputed rather than accumulated inside the map. A running total mutated during render is
  // a variable whose value depends on how many times React chose to call the callback, which is
  // not a guarantee React makes.
  const cumulativeShares = all.reduce<number[]>((acc, p, i) => {
    acc.push((acc[i - 1] ?? 0) + p.value);
    return acc;
  }, []);

  return (
    <div className="space-y-2">
      {brackets.map((b) => (
        <p key={b.label} className="t-micro font-semibold text-accent">{b.label}</p>
      ))}

      <ol className="space-y-1.5">
        {shown.map((p, i) => {
          const pct = ceiling > 0 ? (p.value / ceiling) * 100 : 0;
          const imprecise = IMPRECISE_KINDS.has(p.kind);
          return (
            <li key={p.label}>
              <div className="flex items-baseline justify-between gap-3">
                <span className="t-micro font-medium text-ink truncate">{p.label}</span>
                <span className="t-micro shrink-0 tabular-nums font-semibold text-ink">
                  {fmt(p.value, p.unit)}
                  {cumulative && (
                    <span className="ml-1.5 font-normal text-muted">
                      {((cumulativeShares[i] / total) * 100).toFixed(1)}% cum.
                    </span>
                  )}
                </span>
              </div>
              <div className="mt-0.5 h-2.5 w-full overflow-hidden rounded-sm bg-line/50">
                <div
                  className={`h-full rounded-sm ${GROW} ${imprecise ? "fx-figure-hatch" : ""}`}
                  style={{
                    width: `${pct}%`,
                    // Delay by index so the set reads as a sequence rather than a flash. Unit
                    // charts and ranked lists are the only places the audit allows a stagger.
                    "--fx-i": Math.min(i, 12),
                    background: imprecise ? "var(--color-muted)" : "var(--color-accent-solid)",
                  } as React.CSSProperties}
                />
              </div>
              {p.note && <p className="t-micro mt-0.5 leading-snug text-muted">{p.note}</p>}
            </li>
          );
        })}
      </ol>

      {limit && all.length > limit && (
        <p className="t-micro text-muted">
          {all.length - limit} further {all.length - limit === 1 ? "row" : "rows"} in the data below,
          {" "}totalling {fmt(all.slice(limit).reduce((s, p) => s + p.value, 0), all[0].unit)}.
        </p>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ GapBar */

/**
 * Two values on one scale, with the gap named.
 *
 * This is the hero's job: 22.1% against 37.4% is not two numbers, it is one distance, and the
 * distance is the finding. Drawing them as two separate figures makes the reader subtract.
 */
export function GapBar({
  leading,
  trailing,
  unit = "%",
  scaleMax = 100,
}: {
  leading: { label: string; value: number };
  trailing: { label: string; value: number };
  unit?: string;
  scaleMax?: number;
}) {
  const gap = leading.value - trailing.value;
  const pct = (v: number) => (v / scaleMax) * 100;

  return (
    <div className="space-y-3">
      {[trailing, leading].map((side, i) => {
        const isLeader = side === leading;
        return (
          <div key={side.label}>
            <div className="flex items-baseline justify-between gap-3">
              <span className={`t-small font-semibold ${isLeader ? "text-muted" : "text-ink"}`}>
                {side.label}
              </span>
              <span className="t-small shrink-0 tabular-nums font-bold text-ink">
                {fmt(side.value, unit)}
              </span>
            </div>
            <div className="mt-1 h-3 w-full overflow-hidden rounded-sm bg-line/50">
              <div
                className={`h-full rounded-sm ${GROW}`}
                style={{
                  width: `${pct(side.value)}%`,
                  "--fx-i": i,
                  background: isLeader ? "var(--color-rival-solid, var(--color-muted))" : "var(--color-accent-solid)",
                } as React.CSSProperties}
              />
            </div>
          </div>
        );
      })}

      <p className="t-small font-bold text-gold">
        {Math.abs(gap).toFixed(1)} {unit === "%" ? "points" : unit} behind
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ BuildUp */

/**
 * A waterfall with a threshold line: how the number is built, and whether it clears the bar.
 *
 * §3B's whole argument is that each step is smaller than the last — a register is not a turnout
 * and a turnout is not a winning tally — so the steps share one scale and the threshold is drawn
 * across all of them. A reader who sees the third bar fall under the line has the argument.
 */
export function BuildUp({
  series,
  threshold,
}: {
  series: FigureSeries;
  threshold?: { value: number; label: string };
}) {
  const ceiling = Math.max(...series.points.map((p) => p.value), threshold?.value ?? 0);

  return (
    <div className="space-y-2.5">
      {series.points.map((p, i) => {
        const pct = (p.value / ceiling) * 100;
        const clears = threshold ? p.value >= threshold.value : true;
        return (
          <div key={p.label}>
            <div className="flex items-baseline justify-between gap-3">
              <span className="t-micro font-medium text-ink">{p.label}</span>
              <span className="t-micro shrink-0 tabular-nums font-bold text-ink">
                {fmt(p.value, p.unit)}
              </span>
            </div>
            <div className="relative mt-0.5 h-4 w-full overflow-hidden rounded-sm bg-line/50">
              <div
                className={`h-full rounded-sm ${GROW} ${IMPRECISE_KINDS.has(p.kind) ? "fx-figure-hatch" : ""}`}
                style={{
                  width: `${pct}%`,
                  "--fx-i": Math.min(i, 12),
                  background: clears ? "var(--color-accent-solid)" : "var(--color-muted)",
                } as React.CSSProperties}
              />
              {threshold && (
                // The line is drawn INSIDE the track, at its true proportion, so it cannot drift
                // from the bars it judges when the container resizes.
                <span
                  aria-hidden="true"
                  className="absolute inset-y-0 w-0.5 bg-gold"
                  style={{ left: `${(threshold.value / ceiling) * 100}%` }}
                />
              )}
            </div>
            {p.note && <p className="t-micro mt-0.5 leading-snug text-muted">{p.note}</p>}
          </div>
        );
      })}

      {threshold && (
        <p className="t-micro font-semibold text-gold">
          ▎ {threshold.label}: {threshold.value.toLocaleString("en-KE")}
        </p>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ ShareBar */

/**
 * Part-to-whole as one 100% bar, with every segment labelled in text beneath it.
 *
 * The labels are a list, not a legend. A legend asks the reader to match a colour to a word, and
 * on a phone that is a scroll in each direction; it also fails outright in print and for a
 * colour-blind reader. Rule 2, applied.
 */
export function ShareBar({ series }: { series: FigureSeries }) {
  const total = series.points.reduce((s, p) => s + p.value, 0);
  const shades = [
    "var(--color-accent-solid)",
    "color-mix(in oklch, var(--color-accent-solid) 55%, var(--color-paper))",
    "var(--color-muted)",
    "color-mix(in oklch, var(--color-muted) 45%, var(--color-paper))",
  ];

  return (
    <div className="space-y-2.5">
      <div className="flex h-5 w-full overflow-hidden rounded-sm bg-line/50" role="presentation">
        {series.points.map((p, i) => (
          <div
            key={p.label}
            className={GROW}
            style={{
              width: `${(p.value / total) * 100}%`,
              "--fx-i": i,
              background: shades[i % shades.length],
            } as React.CSSProperties}
          />
        ))}
      </div>

      <ul className="space-y-1">
        {series.points.map((p, i) => (
          <li key={p.label} className="flex items-baseline gap-2">
            <span
              aria-hidden="true"
              className="mt-[0.3em] inline-block h-2 w-2 shrink-0 rounded-[2px]"
              style={{ background: shades[i % shades.length] }}
            />
            <span className="t-micro leading-snug text-ink">
              <strong className="font-bold tabular-nums">{((p.value / total) * 100).toFixed(1)}%</strong>
              {" — "}
              {p.label}
              <span className="text-muted"> ({fmt(p.value, p.unit)})</span>
              {p.note && <span className="block text-muted">{p.note}</span>}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ------------------------------------------------------------------ SlopeChart */

/**
 * Two time points per series, joined.
 *
 * Deliberately limited to two, and deliberately NOT a trend line across houses. §3.1.5 is
 * explicit that the three published rounds come from two pollsters and are "deliberately not
 * drawn as one trend line", because different houses use different samples and screens, and
 * joining them would manufacture a trajectory nobody measured. This component draws one house at
 * a time; the cross-house comparison is a DotRange, where the rounds sit apart.
 */
export function SlopeChart({
  rows,
  fromLabel,
  toLabel,
  unit = "%",
}: {
  rows: { label: string; from: number | null; to: number | null; note?: string }[];
  fromLabel: string;
  toLabel: string;
  unit?: string;
}) {
  const values = rows.flatMap((r) => [r.from, r.to]).filter((v): v is number => v !== null);
  const max = Math.max(...values) * 1.1;
  const min = Math.min(...values, 0);
  const y = (v: number) => 100 - ((v - min) / (max - min)) * 100;

  return (
    <div>
      <div className="flex justify-between t-micro font-semibold text-muted">
        <span>{fromLabel}</span>
        <span>{toLabel}</span>
      </div>

      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="my-1 h-40 w-full" role="presentation">
        {rows.map((r, i) => {
          // A missing point is a gap, never a zero. Ngilu was not polled in June, and plotting
          // her at the origin would draw a 17-point surge that nobody measured.
          if (r.from === null || r.to === null) return null;
          return (
            <line
              key={r.label}
              x1="4" y1={y(r.from)} x2="96" y2={y(r.to)}
              stroke={i === 0 ? "var(--color-accent)" : "var(--color-muted)"}
              strokeWidth={i === 0 ? 1.6 : 1}
              vectorEffect="non-scaling-stroke"
              className="fx-figure-line"
              style={{ "--fx-i": i } as React.CSSProperties}
            />
          );
        })}
      </svg>

      <ul className="space-y-1">
        {rows.map((r) => (
          <li key={r.label} className="flex items-baseline justify-between gap-3 t-micro">
            <span className="font-medium text-ink">{r.label}</span>
            <span className="shrink-0 tabular-nums text-muted">
              {r.from === null ? <em>not polled</em> : fmt(r.from, unit)}
              {" → "}
              <strong className="font-bold text-ink">{r.to === null ? "—" : fmt(r.to, unit)}</strong>
              {r.from !== null && r.to !== null && (
                <span className={r.to >= r.from ? " text-accent" : " text-gold"}>
                  {" "}({r.to >= r.from ? "+" : ""}{(r.to - r.from).toFixed(1)})
                </span>
              )}
            </span>
          </li>
        ))}
      </ul>

      {rows.some((r) => r.note) && (
        <ul className="mt-1.5 space-y-0.5">
          {rows.filter((r) => r.note).map((r) => (
            <li key={r.label} className="t-micro leading-snug text-muted">{r.label}: {r.note}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ DotRange */

/**
 * Dots with whiskers: a value and the uncertainty around it.
 *
 * For published poll shares with a margin, and for modelled intervals. A point with no published
 * sample gets a hatched marker and says so — §3.1.5 records that both Mizani rounds published no
 * sample size, and drawing them with the same confident dot as Politrack's n = 2,927 would be
 * asserting a precision nobody published.
 */
export function DotRange({
  series,
  scaleMax = 100,
  benchmarks = [],
}: {
  series: FigureSeries;
  scaleMax?: number;
  benchmarks?: { value: number; label: string }[];
}) {
  const pos = (v: number) => (v / scaleMax) * 100;

  return (
    <div className="space-y-3">
      {series.points.map((p) => {
        const noRange = !p.range;
        return (
          <div key={p.label}>
            <div className="flex items-baseline justify-between gap-3">
              <span className="t-micro font-medium text-ink">{p.label}</span>
              <span className="t-micro shrink-0 tabular-nums font-bold text-ink">
                {fmt(p.value, p.unit)}
                {p.range && (
                  <span className="ml-1 font-normal text-muted">
                    ({fmt(p.range.low, p.unit)}–{fmt(p.range.high, p.unit)})
                  </span>
                )}
              </span>
            </div>

            <div className="relative mt-1 h-4 w-full rounded-sm bg-line/40">
              {p.range && (
                <span
                  aria-hidden="true"
                  className="absolute inset-y-1 rounded-sm bg-accent/30"
                  style={{ left: `${pos(p.range.low)}%`, width: `${pos(p.range.high - p.range.low)}%` }}
                />
              )}
              <span
                aria-hidden="true"
                className={`absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-card ${
                  noRange ? "bg-muted" : "bg-accent-solid"
                }`}
                style={{ left: `${pos(p.value)}%` }}
              />
              {benchmarks.map((b) => (
                <span
                  key={b.label}
                  aria-hidden="true"
                  className="absolute inset-y-0 w-0.5 bg-gold"
                  style={{ left: `${pos(b.value)}%` }}
                />
              ))}
            </div>

            <p className="t-micro mt-0.5 leading-snug text-muted">
              {noRange ? "No margin published — drawn without a range rather than with an assumed one. " : ""}
              {p.note}
            </p>
          </div>
        );
      })}

      {benchmarks.length > 0 && (
        <p className="t-micro font-semibold text-gold">
          {benchmarks.map((b) => `▎ ${b.label}: ${b.value.toLocaleString("en-KE")}`).join("   ")}
        </p>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ BigStat */

/** One number, its label, and what it should be read against. */
export function BigStat({
  point,
  comparison,
}: {
  point: Pick<FigurePoint, "label" | "value" | "unit" | "note">;
  comparison?: string;
}) {
  return (
    <div className="min-w-0">
      <div className="font-serif text-2xl font-bold leading-none tabular-nums text-ink sm:text-3xl">
        {typeof point.value === "number" ? point.value.toLocaleString("en-KE") : point.value}
        {point.unit === "%" ? "%" : ""}
      </div>
      <div className="t-micro mt-1 font-semibold leading-snug text-ink">{point.label}</div>
      {(comparison ?? point.note) && (
        <div className="t-micro mt-0.5 leading-snug text-muted">{comparison ?? point.note}</div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ CompareColumns */

/** Can / cannot, in / out of scope, do / never. Two lists, side by side, labelled in words. */
export function CompareColumns({
  left,
  right,
}: {
  left: { heading: string; items: string[] };
  right: { heading: string; items: string[] };
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {[left, right].map((col, i) => (
        <div
          key={col.heading}
          className={`rounded-xl border p-3 ${
            i === 0 ? "border-accent/40 bg-accent/[0.04]" : "border-line bg-paper/40"
          }`}
        >
          <h5 className={`t-micro font-bold uppercase tracking-wide ${i === 0 ? "text-accent" : "text-muted"}`}>
            {col.heading}
          </h5>
          <ul className="mt-2 space-y-1.5">
            {col.items.map((item) => (
              <li key={item} className="t-micro flex gap-1.5 leading-snug text-ink">
                <span aria-hidden="true" className={i === 0 ? "text-accent" : "text-muted"}>
                  {i === 0 ? "✓" : "✕"}
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ RegisterGroups */

/**
 * The whole register, grouped the way the county is actually organised.
 *
 * This replaces a box-drawing grid that drew all forty wards in two columns of ASCII panels. It
 * carries exactly the same numbers — every ward, every constituency total, the county total —
 * and adds the two things characters could not: each ward drawn to scale against the largest in
 * the county, so concentration is visible rather than arithmetic, and each constituency's share
 * stated rather than left to be summed.
 *
 * Grouped, not ranked. §3.4.2 ranks the same forty wards and that figure is the right place for
 * a ranking; this one answers "what is in Mwingi North", which is the question the ASCII grid was
 * laid out to answer and the one a reader planning a ground operation actually asks.
 */
export function RegisterGroups({
  groups,
  countyTotal,
  scaleMax,
}: {
  groups: { name: string; voters: number; wards: { name: string; voters: number }[] }[];
  countyTotal: number;
  /** Shared across every group, so a ward in Mwingi is comparable to a ward in Kitui South. */
  scaleMax: number;
}) {
  return (
    <div className="space-y-4">
      {groups.map((group, gi) => (
        <div key={group.name}>
          <div className="flex items-baseline justify-between gap-3 border-b border-line/60 pb-1">
            <h5 className="t-micro font-bold uppercase tracking-wide text-ink">{group.name}</h5>
            <span className="t-micro shrink-0 tabular-nums text-muted">
              <strong className="font-bold text-ink">{group.voters.toLocaleString("en-KE")}</strong>
              {" · "}
              {((group.voters / countyTotal) * 100).toFixed(1)}% · {group.wards.length} wards
            </span>
          </div>

          <ul className="mt-1.5 space-y-1">
            {group.wards.map((ward, wi) => (
              <li key={ward.name} className="grid grid-cols-[1fr_auto] items-baseline gap-x-3">
                <span className="t-micro truncate text-ink">{ward.name}</span>
                <span className="t-micro shrink-0 tabular-nums font-semibold text-ink">
                  {ward.voters.toLocaleString("en-KE")}
                </span>
                <span className="col-span-2 mt-0.5 h-1.5 w-full overflow-hidden rounded-sm bg-line/40">
                  <span
                    className={`block h-full rounded-sm ${GROW}`}
                    style={{
                      width: `${(ward.voters / scaleMax) * 100}%`,
                      "--fx-i": Math.min(gi * 2 + wi, 12),
                      background: "var(--color-accent-solid)",
                    } as React.CSSProperties}
                  />
                </span>
              </li>
            ))}
          </ul>
        </div>
      ))}

      <p className="t-micro border-t border-line/60 pt-2 font-semibold text-ink">
        County total: {countyTotal.toLocaleString("en-KE")} registered voters across{" "}
        {groups.reduce((n, g) => n + g.wards.length, 0)} wards and {groups.length} constituencies.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ RangeBars */

/**
 * An estimate drawn as a band with both ends labelled, never as a bar with a precise end.
 *
 * §3.1.1.1 states every platform as a range — "~65,000–80,000 active users" — and a bar has one
 * end, so drawing these as bars would require picking a number the document does not state.
 * Collapsing to a midpoint is the usual answer and it is the wrong one: it manufactures a
 * precision nobody measured, on exactly the figures an opposition researcher would check first.
 *
 * The band is the mark. Its left edge is the low estimate, its right edge the high one, and both
 * are printed. There is no tick in the middle, because there is no middle value to report.
 */
export function RangeBars({ series, scaleMax }: { series: FigureSeries; scaleMax?: number }) {
  const ceiling = scaleMax ?? Math.max(...series.points.map((p) => p.range?.high ?? p.value));

  return (
    <div className="space-y-2.5">
      {series.points.map((p, i) => {
        const low = p.range?.low ?? p.value;
        const high = p.range?.high ?? p.value;
        return (
          <div key={p.label}>
            <div className="flex items-baseline justify-between gap-3">
              <span className="t-micro font-medium text-ink">{p.label}</span>
              <span className="t-micro shrink-0 tabular-nums font-semibold text-ink">
                {low.toLocaleString("en-KE")}
                {high !== low && <>–{high.toLocaleString("en-KE")}</>}
                <span className="ml-1 font-normal text-muted">{p.unit}</span>
              </span>
            </div>

            <div className="relative mt-0.5 h-3 w-full rounded-sm bg-line/40">
              <span
                aria-hidden="true"
                className={`absolute inset-y-0 rounded-sm ${GROW} fx-figure-hatch`}
                style={{
                  left: `${(low / ceiling) * 100}%`,
                  width: `${((high - low) / ceiling) * 100}%`,
                  minWidth: "3px",
                  "--fx-i": Math.min(i, 12),
                  background: "var(--color-accent-solid)",
                  transformOrigin: "left center",
                } as React.CSSProperties}
              />
            </div>

            {p.note && <p className="t-micro mt-0.5 leading-snug text-muted">{p.note}</p>}
          </div>
        );
      })}
    </div>
  );
}
