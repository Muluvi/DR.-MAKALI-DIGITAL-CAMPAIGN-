import { CONSTITUENCIES } from "@/data/ward-register";
import { PROJECTS } from "@/data/projects";
import { ANALYSIS_EXPORTS, type ExportChart, type ExportValue } from "@/data/analysis-exports";
import { pageText } from "@/lib/reader-text";

/**
 * The data dashboards: the register and the county's projects at a glance, then every chart the
 * analysis pipeline publishes (data/analysis/). Server-rendered HTML bars, so they read at phone
 * width and print cleanly. Numbers are printed beside every bar, formatted one way.
 */
type Bar = { label: string; value: number; display: string };

/** The pipeline's notes in plain words: no reliability codes, no section numbers, one currency label. */
const plain = (t: string) => pageText(t).replace(/\bK[Ss]h\b/g, "KES").replace(/,\s*marked\s+and verify until [^.]*/g, "").replace(/\s*listed in this plan;?/g, "").replace(/\s{2,}/g, " ");

const n0 = (v: number) => v.toLocaleString("en-KE", { maximumFractionDigits: 0 });

function decimalsFor(values: ExportValue[]): number {
  if (values.some((v) => v.unit === "%")) return 1;
  return values.reduce((m, v) => (typeof v.value === "number" ? Math.max(m, (String(v.value).split(".")[1] ?? "").length) : m), 0);
}

function display(v: ExportValue, d: number): string {
  if (typeof v.value === "string") return v.value;
  if (v.unit === "%") return `${v.value.toFixed(1)}%`;
  const text = v.value.toLocaleString("en-KE", { minimumFractionDigits: Math.min(d, 3), maximumFractionDigits: Math.min(d, 3) });
  if (/^(k?sh|kes)$/i.test(v.unit)) return `KES ${text}`;
  return v.unit && v.unit !== "count" ? `${text} ${v.unit}` : text;
}

function BarList({ bars }: { bars: Bar[] }) {
  const max = Math.max(1, ...bars.map((b) => b.value));
  return (
    <ul className="v-bars">
      {bars.map((b, i) => (
        <li key={`${i}-${b.label}`}>
          <span className="v-bars-label">{b.label}</span>
          <span className="v-bars-value">{b.display}</span>
          <span className="v-bars-track" aria-hidden="true"><span style={{ width: `${Math.max(1, (b.value / max) * 100)}%` }} /></span>
        </li>
      ))}
    </ul>
  );
}

function ExportBlock({ chart }: { chart: ExportChart }) {
  const d = decimalsFor(chart.values);
  const numeric = chart.values.every((v) => typeof v.value === "number");
  const sameUnit = new Set(chart.values.map((v) => v.unit)).size === 1;
  const sources = [...new Set(chart.values.map((v) => v.source_id))];
  return (
    <figure className="v" id={`dash-${chart.id}`} aria-label={chart.title}>
      <figcaption>
        <p className="v-title">{plain(chart.title)}</p>
        <p className="v-note">{plain(chart.description)}</p>
        {chart.scenario_label ? <p className="v-note"><strong>{chart.scenario_label}.</strong> Every input is a stated assumption; nothing here is a win probability.</p> : null}
      </figcaption>
      {numeric && sameUnit ? (
        <BarList bars={chart.values.map((v) => ({ label: plain(v.label), value: v.value as number, display: display(v, d) }))} />
      ) : (
        <div className="table-wrap" tabIndex={0} role="region" aria-label={chart.title}>
          <table>
            <tbody>
              {chart.values.map((v, i) => (
                <tr key={`${i}-${v.label}`}><th scope="row">{plain(v.label)}</th><td className="num">{display(v, d)}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {chart.notes.length ? (
        <details className="v-more"><summary>Notes</summary>{chart.notes.map((t) => <p key={t} className="v-caption">{plain(t)}</p>)}</details>
      ) : null}
      <p className="source">Source: {sources.join("; ")} · data as at {chart.data_as_of}</p>
    </figure>
  );
}

export function Dashboards() {
  const sectors = new Map<string, number>();
  for (const p of PROJECTS) sectors.set(p.sector, (sectors.get(p.sector) ?? 0) + 1);
  return (
    <div className="prose">
      <figure className="v" aria-label="Registered voters by constituency">
        <figcaption><p className="v-title">Registered voters, by constituency</p></figcaption>
        <BarList bars={[...CONSTITUENCIES].sort((a, b) => b.voters - a.voters).map((c) => ({ label: c.name, value: c.voters, display: n0(c.voters) }))} />
        <p className="source">Source: IEBC register of voters, 2022</p>
      </figure>
      <figure className="v" aria-label="County projects by sector">
        <figcaption><p className="v-title">County projects, by sector</p><p className="v-note">The projects the county&rsquo;s three-year scorecard itemises.</p></figcaption>
        <BarList bars={[...sectors].sort((a, b) => b[1] - a[1]).map(([label, value]) => ({ label, value, display: n0(value) }))} />
        <p className="source">Source: County Government of Kitui, Delivering the Kitui Promise scorecard (Aug 2022 – Aug 2025)</p>
      </figure>
      {Object.values(ANALYSIS_EXPORTS).map((c) => <ExportBlock key={c.id} chart={c} />)}
    </div>
  );
}
