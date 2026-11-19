import { CloudRain, CloudSun, Flame, Sun, Thermometer } from "lucide-react";

import waterAndDrought from "../../data/analysis/water-and-drought.json";
import { IPC_FOOD_SECURITY_PHASE } from "../../data/drought-food-security";
import { figure } from "../../lib/data/read";
import { asOfText, resolveFigure } from "../../lib/card/spec";
import { PICTOGRAM_PATHS, KituiIcon } from "../icons/kitui";
import { ExportableVisual } from "../visual/ExportableVisual";

/* ------------------------------------------------------------------------------- prices */

/**
 * The price of a goat and a kilo of maize against their five-year averages (visual upgrade, C10),
 * drawn to scale by AREA: each pictogram's side grows with the square root of its price, so a goat
 * that costs 40% more covers 40% more ground. Two points, not a trend: the registry holds the July
 * 2025 price and the five-year average, and nothing in between.
 */
function Pair({ now, avg, glyph, unit, label }: { now: string; avg: string; glyph: "goat" | "maize"; unit: string; label: string }) {
  const n = resolveFigure({ id: now, label: "July 2025", prefix: "KSh " });
  const a = resolveFigure({ id: avg, label: "five-year average", prefix: "KSh " });
  const big = Math.max(n.value ?? 0, a.value ?? 0);
  const side = (v: number) => Math.sqrt(v / big);
  const MAX = 104;
  const rise = n.value && a.value ? Math.round(((n.value - a.value) / a.value) * 100) : null;
  const cell = (f: typeof n, i: number) => (
    <figure className="pp__item" style={{ "--i": i } as React.CSSProperties}>
      <span className="pp__stage" style={{ width: MAX, height: MAX }}>
        {glyph === "goat" ? (
          <svg viewBox="0 0 24 24" width={MAX * side(f.value ?? 0)} height={MAX * side(f.value ?? 0)} className="pp__glyph xv-mark" aria-hidden="true" style={{ "--i": i * 20 } as React.CSSProperties}>
            <path d={PICTOGRAM_PATHS.goat} />
          </svg>
        ) : (
          <span className="pp__glyph xv-mark" style={{ width: MAX * side(f.value ?? 0), height: MAX * side(f.value ?? 0), "--i": i * 20 } as React.CSSProperties}>
            <KituiIcon name="maize" size={48} width="100%" height="100%" strokeWidth={1.25} />
          </span>
        )}
      </span>
      <figcaption>
        <span className="pp__v">{f.display}</span>
        <span className="pp__l">{f.label}</span>
      </figcaption>
    </figure>
  );
  return (
    <div className="pp">
      <p className="pp__title">
        {label}
        {rise !== null ? <span className="pp__rise"> {rise >= 0 ? "+" : "−"}{Math.abs(rise)}% on the average</span> : null}
        <span className="pp__unit"> · {unit}</span>
      </p>
      <div className="pp__row">
        {cell(a, 0)}
        {cell(n, 1)}
      </div>
    </div>
  );
}

export function LivelihoodPrices() {
  const figs = ["price.goat", "price.goat.average", "price.maize", "price.maize.average"].map((id) => resolveFigure({ id, label: id }));
  return (
    <ExportableVisual
      id="goat-maize-prices"
      title="A goat now sells for more than its five-year average; maize costs a little more too"
      note="Each shape is drawn to scale by area: a price 40% higher covers 40% more ground."
      figures={figs}
      card={{ type: "pictogram", params: { set: "prices" } }}
    >
      <div className="pp-pair">
        <Pair now="price.goat" avg="price.goat.average" glyph="goat" unit="a medium goat" label="Goat" />
        <Pair now="price.maize" avg="price.maize.average" glyph="maize" unit="per kilo" label="Maize" />
      </div>
    </ExportableVisual>
  );
}

/* ------------------------------------------------------------------------------- drought */

type PhaseRow = { label: string; value: string; as_of: string; tier: number; note?: string };

/** NDMA's drought early-warning phases, in order of severity, each with the sky it is drawn as. */
const NDMA_PHASES = [
  { name: "Normal", Icon: CloudSun, sky: "Seasonal conditions" },
  { name: "Alert", Icon: Sun, sky: "Dry, watch closely" },
  { name: "Alarm", Icon: Thermometer, sky: "Drought building" },
  { name: "Emergency", Icon: Flame, sky: "Severe drought" },
  { name: "Recovery", Icon: CloudRain, sky: "Recovering" },
] as const;
const SEVERITY = ["Normal", "Alert", "Alarm", "Emergency"];

/**
 * Drought Watch as a television forecast (visual upgrade, C2 and C11): one card per NDMA monthly
 * bulletin, the phase as the weather, and a gauge that marks where the latest reading sits on the
 * phase scale. County-wide only, because the bulletins are; the gauge is ordinal (four named
 * steps), not a quantity, so it is drawn as steps rather than a fill.
 */
export function DroughtForecast() {
  const rows = (waterAndDrought as { values: (PhaseRow & { unit: string })[] }).values.filter((v) => v.unit === "phase");
  const latest = rows[rows.length - 1];
  const step = SEVERITY.indexOf(latest.value);
  const water = resolveFigure({ id: "water.points.down.share", label: "of water points not working" });
  const tiers = [...new Set(rows.map((r) => `Tier ${r.tier}`))].join(" and ");
  return (
    <ExportableVisual
      id="drought-forecast"
      title={`Kitui's drought forecast: ${latest.value.toLowerCase()} in the latest bulletin, after months on alert`}
      note="One card per NDMA bulletin, county-wide. The phase is the weather."
      source={`Source: NDMA Kitui County drought early-warning bulletins, ${rows[0].as_of} to ${latest.as_of} (${tiers}); ${IPC_FOOD_SECURITY_PHASE.label}: ${IPC_FOOD_SECURITY_PHASE.value}; water points: ${water.source ?? "NDMA"}, ${water.provenance}.`}
      card={{ type: "forecast" }}
    >
      <div className="fc">
        <ol className="fc__days">
          {rows.map((r, i) => {
            const p = NDMA_PHASES.find((x) => x.name === r.value) ?? NDMA_PHASES[0];
            return (
              <li key={r.as_of} className="fc__day xv-rise" data-phase={r.value.toLowerCase()} style={{ "--i": i } as React.CSSProperties}>
                <span className="fc__when">{r.as_of}</span>
                <p.Icon className="fc__icon" size={32} strokeWidth={1.5} aria-hidden="true" />
                <span className="fc__phase">{r.value}</span>
                <span className="fc__sky">{p.sky}</span>
              </li>
            );
          })}
        </ol>
        <div className="fc__gauge" role="img" aria-label={`Drought phase gauge: ${latest.value}, step ${step + 1} of ${SEVERITY.length}`}>
          <span className="fc__gauge-k">Latest phase</span>
          <ol className="fc__steps" aria-hidden="true">
            {SEVERITY.map((s, i) => (
              <li key={s} data-on={i === step ? "true" : "false"} data-past={i < step ? "true" : "false"}>
                <span className="fc__tick" />
                {s}
              </li>
            ))}
          </ol>
        </div>
        <p className="fc__also">
          <span className="fc__also-k">Also on the ground</span>
          <span><strong>{water.display}</strong> {water.label}{asOfText(figure("water.points.down.share").asOf) ? ` (${asOfText(figure("water.points.down.share").asOf)})` : ""}</span>
          <span><strong>{IPC_FOOD_SECURITY_PHASE.value}</strong> on the IPC food-security scale</span>
        </p>
      </div>
    </ExportableVisual>
  );
}
