/**
 * The data the planning tools read, assembled once on the server from the site's own records.
 *
 * Every number here is read from a file the rest of the site already uses and the content guards
 * already check: the IEBC public pack (data/kitui-public.generated.json), the ward tiles and
 * register (lib/geo/wards.ts), the polling-station list, the county projects export, the 2019
 * census export and the figure registry (lib/data/figures.ts). Nothing is typed in here, so a team
 * edit to a figure reaches every tool on the next build.
 */
import { FIGURES, slugOf } from "../data/figures";
import { formatFigure } from "../data/format";
import { WARD_TILES, type ZoneId } from "../geo/wards";
import { PUBLIC_WARDS, PUBLIC_CONSTITUENCIES } from "../public-data";
import stations from "../../data/kitui-stations.generated.json";
import projectsByWard from "../../data/analysis/projects-by-ward.json";
import census from "../../data/analysis/census-subcounty.json";
import issueEvidence from "../../data/analysis/issue-evidence.json";

export type FigureView = { id: string; value: number | null; display: string; tier: string | null; state: string; source: string | null; asOf: string | null; note: string | null; unit: string };

/** One registry figure, as a tool shows it: value, printed form and provenance. */
export function fig(id: string): FigureView {
  const f = FIGURES[id];
  if (!f) throw new Error(`tools: no figure ${id}`);
  return { id, value: f.value, display: formatFigure(f), tier: f.tier, state: f.state, source: f.source, asOf: f.asOf ?? null, note: f.note ?? null, unit: f.unit };
}
export const figs = (ids: string[]) => Object.fromEntries(ids.map((id) => [id, fig(id)])) as Record<string, FigureView>;

/** The four constituencies where he has never held office (the registry's "pool"). */
export const POOL = new Set(["mwingi-north", "mwingi-west", "mwingi-central", "kitui-south"]);

export type ToolWard = {
  id: string; code: string; name: string; constituency: string; constituencyName: string; zone: ZoneId; pool: boolean;
  row: number; col: number; voters: number; stations: number; centres: number; population: number; areaSqKm: number;
  projects: number; projectsKsh: number;
};

const pbw = (projectsByWard as { values: { value: number; dims: { ward: string; measure: string } }[] }).values;
const projectCount = (slug: string, measure: "projects" | "ksh") => pbw.find((v) => v.dims.ward === slug && v.dims.measure === measure)?.value ?? 0;

export const TOOL_WARDS: ToolWard[] = WARD_TILES.map((t) => {
  const slug = t.id.replace(/^ward\./, "");
  const p = PUBLIC_WARDS.find((w) => slugOf(w.name) === slug);
  if (!p) throw new Error(`tools: ward ${slug} is not in the IEBC public pack`);
  return {
    id: slug, code: p.code, name: t.name, constituency: t.constituency, constituencyName: t.constituencyName, zone: t.zone, pool: POOL.has(t.constituency),
    row: t.row, col: t.col, voters: p.voters, stations: p.stations, centres: p.centres, population: p.population, areaSqKm: p.areaSqKm,
    projects: projectCount(slug, "projects"), projectsKsh: Math.round(projectCount(slug, "ksh")),
  };
});

export type ToolConstituency = { id: string; name: string; zone: ZoneId; pool: boolean; held: boolean; voters: number; wards: number; stations: number; centres: number; projects: number | null; projectsKsh: number | null; perVoter: number | null };

const has = (id: string) => !!FIGURES[id] && FIGURES[id].value !== null;
export const TOOL_CONSTITUENCIES: ToolConstituency[] = PUBLIC_CONSTITUENCIES.map((c) => {
  const id = slugOf(c.name);
  const zone = TOOL_WARDS.find((w) => w.constituency === id)?.zone ?? "none";
  return {
    id, name: c.name, zone, pool: POOL.has(id), held: id === "kitui-central", voters: c.voters, wards: c.wards, stations: c.stations, centres: c.centres,
    projects: has(`scorecard.${id}.projects`) ? FIGURES[`scorecard.${id}.projects`].value : null,
    projectsKsh: has(`scorecard.${id}.ksh`) ? FIGURES[`scorecard.${id}.ksh`].value : null,
    perVoter: has(`scorecard.${id}.per-voter`) ? FIGURES[`scorecard.${id}.per-voter`].value : null,
  };
});

export type ToolStation = { code: string; ward: string; wardName: string; constituencyName: string; centre: string; station: string; voters: number };
const STATIONS_RAW = stations as Record<string, { code: string; centre: string; station: string; voters: number }[]>;
export const TOOL_STATIONS: ToolStation[] = TOOL_WARDS.flatMap((w) => (STATIONS_RAW[w.code] ?? []).map((s) => ({ code: s.code, ward: w.id, wardName: w.name, constituencyName: w.constituencyName, centre: s.centre, station: s.station, voters: s.voters })));

export type CensusRow = { subcounty: string; population: number; adults: number; adultsPct: number; phonePct: number; internetPct: number; electricityPct: number | null };
type CensusValue = { value: number; tier: number; dims: { subcounty: string; measure: string; band?: string } };
const CV = (census as { values: CensusValue[] }).values;
const cv = (sc: string, m: string) => CV.find((v) => v.dims.subcounty === sc && v.dims.measure === m)?.value;
export const CENSUS_SUBCOUNTIES: CensusRow[] = [...new Set(CV.map((v) => v.dims.subcounty))]
  .filter((sc) => sc !== "COUNTY" && sc !== "KENYA" && cv(sc, "population") !== undefined && cv(sc, "phone_pct") !== undefined)
  .map((sc) => ({
    subcounty: sc.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()),
    population: cv(sc, "population") as number,
    adults: cv(sc, "aged_18_plus") as number,
    adultsPct: cv(sc, "aged_18_plus_pct") as number,
    phonePct: cv(sc, "phone_pct") as number,
    internetPct: cv(sc, "internet_pct") as number,
    electricityPct: cv(sc, "mains_electricity_pct") ?? null,
  }));
export const CENSUS_COUNTY = { phonePct: cv("COUNTY", "phone_pct") ?? null, internetPct: cv("COUNTY", "internet_pct") ?? null, adults: cv("COUNTY", "aged_18_plus") ?? null };
export const CENSUS_AGE_BANDS = CV.filter((v) => v.dims.measure === "age_band" && v.dims.subcounty === "COUNTY").map((v) => ({ band: v.dims.band as string, people: v.value }));

export type IssueRow = { issue: string; score: number; tier: number; note: string };
export const ISSUES: IssueRow[] = (issueEvidence as { values: { label: string; value: number; tier: number; note: string }[] }).values.map((v) => ({ issue: v.label, score: v.value, tier: v.tier, note: v.note }));
export const ISSUE_NOTES: string[] = (issueEvidence as { notes: string[] }).notes;

export const ZONE_LABEL: Record<ZoneId, string> = { anchor: "Anchor (Kitui Central, Kitui West)", mwingi: "Mwingi (North, West, Central)", arid: "Arid belt (Kitui South, Kitui East)", none: "Kitui Rural (in no zone)" };
