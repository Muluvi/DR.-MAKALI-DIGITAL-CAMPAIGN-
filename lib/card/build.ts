/**
 * Every share card's content, built from the URL's parameters (visual upgrade, E2 and E3).
 *
 * A card is DATA here and LAYOUT in lib/card/render.tsx. Every number is a registry figure
 * resolved through lib/card/spec.ts, or a sum the site's own tools compute from its datasets, and
 * each carries its provenance into the card's source line. A parameter that names nothing real
 * returns null, and the route answers 404 rather than drawing an empty card.
 *
 * `path` is the site view the card was made from: the QR code and the printed link go there.
 */
import waterAndDrought from "../../data/analysis/water-and-drought.json";
import { NOMINATION_KPIS } from "../../data/kpis";
import { RADIO_STATIONS } from "../../data/media-ownership";
import { figure } from "../data/read";
import { liveSnapshot } from "../live/snapshot";
import { group } from "../data/format";
import { PUBLIC_WARDS, RACE_CALENDAR } from "../public-data";
import { TOOL_CONSTITUENCIES, TOOL_STATIONS, TOOL_WARDS } from "../tools/dataset";
import { FACTS, NOMINATION_ITEMS } from "../tools/lists";
import { RADIO_SHARE, startingSpots } from "../tools/radio-share";
import { asOfText, provenanceOf, resolveFigure, sourceLine, type CardType, type ResolvedFigure } from "./spec";
import type { PictogramName } from "../../components/icons/kitui";

/* ------------------------------------------------------------------------------- model */

export type Tile = { value: string; label: string; note?: string };
export type BarRow = { label: string; sub?: string; value: number; display: string; mark?: "pool" | "lit" | "below" };

export type Block =
  | { kind: "hero"; value: string; label: string; note?: string }
  | { kind: "tiles"; items: Tile[] }
  | { kind: "bars"; rows: BarRow[]; ref?: { value: number; label: string }; zeroNote?: string }
  | { kind: "map"; fills: Record<string, string>; legend: { color: string; label: string }[]; side?: Tile[] }
  | { kind: "icons"; items: { value: number; display: string; label: string; glyph: PictogramName }[]; key: string }
  | { kind: "scale"; items: { value: number; display: string; label: string }[]; glyph: PictogramName; title: string }
  | { kind: "receipt"; lines: { label: string; amount: string; note: string }[]; total: { label: string; amount: string; note: string }; foot: string }
  | { kind: "forecast"; days: { when: string; phase: string }[]; latest: string; also: string[] }
  | { kind: "list"; items: { title: string; meta?: string; state?: "done" | "todo" | "next" }[]; more?: number }
  | { kind: "grid"; columns: string[]; rows: string[][] }
  | { kind: "phone"; channels: string[]; text: string }
  | { kind: "quote"; text: string; value?: string }
  | { kind: "qr"; url: string; caption: string }
  | { kind: "countdown"; days: number | null; date: string; event: string; who: string };

export interface CardModel {
  type: CardType;
  kicker: string;
  title: string;
  blocks: Block[];
  figures: ResolvedFigure[];
  /** Overrides the source line built from `figures`. */
  source?: string;
  /** The site view this card shows, for the QR code and the printed link. */
  path: string;
  /** "3/8" in a carousel set: the only place a number orders anything. */
  page?: string;
  illustrative?: boolean;
}

export type Params = Record<string, string | undefined>;

/* ------------------------------------------------------------------------------- helpers */

const POOL_IDS = new Set(TOOL_WARDS.filter((w) => w.pool).map((w) => `ward.${w.id}`));
const wardBy = (slug?: string) => TOOL_WARDS.find((w) => w.id === slug || w.code === slug);
const n0 = (n: number) => group(Math.round(n));
const fifth = (values: number[]) => {
  const sorted = [...values].sort((a, b) => a - b);
  return (v: number) => Math.min(4, Math.floor((sorted.filter((s) => s < v).length / values.length) * 5));
};
const QUINTS = ["#dde8fd", "#acc5f2", "#7297e2", "#3a63cd", "#18349b"];
const SCORECARD = "County Government of Kitui, three-year scorecard: itemised projects placed on one ward";
const REGISTER_FIG = () => resolveFigure({ id: "register.2022", label: "registered voters, 2022" });
const per1kOf = (w: (typeof TOOL_WARDS)[number]) => (w.voters ? (w.projectsKsh / w.voters) * 1000 : 0);

/* ------------------------------------------------------------------------------- measures */

type Measure = "voters" | "per1k" | "stations" | "density" | "projects" | "population";
const MEASURES: Record<Measure, { label: string; value: (w: (typeof TOOL_WARDS)[number]) => number; display: (v: number) => string; path: string; source?: string }> = {
  voters: { label: "registered voters, 2022", value: (w) => figure(`ward.${w.id}`).value ?? w.voters, display: n0, path: "/votes#ward-league" },
  per1k: { label: "county project value per 1,000 voters", value: per1kOf, display: (v) => `KSh ${(v / 1e6).toFixed(2)}m`, path: "/spend#equity-lollipop", source: `Source: ${SCORECARD}; IEBC 2022 register (Tier 1). Calculated by the site.` },
  stations: { label: "polling stations, 2022", value: (w) => w.stations, display: n0, path: "/tools/polling-stations", source: "Source: IEBC 2022 polling-station list (Tier 1)." },
  projects: { label: "county projects placed on the ward", value: (w) => w.projects, display: n0, path: "/tools/map-studio", source: `Source: ${SCORECARD}.` },
  population: { label: "people, Gazette 2026", value: (w) => w.population, display: n0, path: "/tools/map-studio", source: "Source: ward population, Gazette Notice 12251, 7 August 2026 (Tier 1)." },
  density: { label: "people per km²", value: (w) => (w.areaSqKm ? w.population / w.areaSqKm : 0), display: n0, path: "/tools/map-studio", source: "Source: ward population and area, Gazette Notice 12251, 7 August 2026 (Tier 1). Calculated by the site." },
};
const measureOf = (m?: string): Measure => (m && m in MEASURES ? (m as Measure) : "voters");

/* ------------------------------------------------------------------------------- the eighteen */

function bigNumber(p: Params): CardModel | null {
  if (p.view === "winning") {
    const t = Math.min(85, Math.max(40, Number(p.turnout) || (figure("turnout.2022").value ?? 0)));
    const register = REGISTER_FIG();
    const bench = resolveFigure({ id: "benchmark", label: "the benchmark" });
    const turnout = resolveFigure({ id: "turnout.2022", label: "2022 turnout" });
    const ballots = (register.value ?? 0) * (t / 100);
    const share = ballots ? ((bench.value ?? 0) / ballots) * 100 : 0;
    return {
      type: "big-number", kicker: "What it takes", path: `/winning#winning-dial`,
      title: `At ${t.toFixed(1)}% turnout, ${bench.display} votes is ${share <= 100 ? `${share.toFixed(1)}% of every ballot` : "more than every ballot"}`,
      blocks: [
        { kind: "hero", value: share <= 100 ? `${share.toFixed(1)}%` : "Not reachable", label: "the share needed in every constituency", note: "Arithmetic, not a forecast: the even share that reaches the benchmark." },
        { kind: "tiles", items: [
          { value: `${t.toFixed(1)}%`, label: "turnout set", note: `2022 turnout: ${turnout.display}` },
          { value: n0(ballots), label: "ballots cast", note: "calculated" },
          { value: bench.display, label: "the benchmark", note: "the plan's target" },
        ] },
      ],
      figures: [register, turnout, bench],
    };
  }
  const id = p.id ?? "register.2022";
  const fact = FACTS.find(([, fid]) => fid === id);
  let f: ResolvedFigure;
  try { f = resolveFigure({ id, label: fact?.[0] ?? id }); } catch { return null; }
  return { type: "big-number", kicker: "Kitui in one number", title: f.label, path: `/tools/fact-cards`, blocks: [{ kind: "hero", value: f.display, label: f.label, note: f.provenance }], figures: [f] };
}

const STAT_SETS: Record<string, { title: string; path: string; ids: [string, string][] }> = {
  county: { title: "Kitui at a glance", path: "/kitui", ids: [["census.population", "people, 2019 census"], ["census.households", "households"], ["register.2022", "registered voters, 2022"], ["register.polling-stations", "polling stations"], ["poverty.2021", "in poverty, 2021"], ["ict.offline", "of residents offline"]] },
  case: { title: "The case on one screen", path: "/brief", ids: [["pool", "registered voters where he has never held office"], ["pool.share", "of the county's register"], ["benchmark", "votes to win (benchmark)"], ["turnout.2022", "turnout, 2022"]] },
  news: { title: "How Kitui gets its news", path: "/news", ids: [["ict.internet", "use the internet"], ["ict.offline", "are offline"], ["ict.phone", "own a mobile phone"], ["radio.musyi", "of Lower Eastern listeners on Musyi FM"]] },
  money: { title: "The county's money", path: "/tools/county-money", ids: [["budget.total", "budget envelope, FY2026/27"], ["budget.equitable", "equitable share"], ["budget.osr", "own-source revenue"], ["budget.pending-bills.2021", "pending bills, FY2020/21"]] },
  welcome: { title: "What's inside the platform", path: "/welcome", ids: [["register.2022", "registered voters in the data"], ["register.polling-stations", "polling stations, searchable"], ["scorecard.itemised", "county projects, itemised"], ["census.population", "people in the census data"]] },
};
function statGrid(p: Params): CardModel | null {
  const set = STAT_SETS[p.set ?? "county"];
  if (!set) return null;
  const figs = set.ids.map(([id, label]) => resolveFigure({ id, label, mod: id.startsWith("budget.") ? "bn" : "", prefix: id.startsWith("budget.") ? "KSh " : "", suffix: id.startsWith("budget.") ? "bn" : undefined }));
  return { type: "stat-grid", kicker: "Kitui 2027", title: set.title, path: set.path, blocks: [{ kind: "tiles", items: figs.map((f) => ({ value: f.display, label: f.label, note: f.provenance })) }], figures: figs };
}

function ward(p: Params): CardModel | null {
  const w = wardBy(p.ward);
  if (!w) return null;
  const voters = resolveFigure({ id: `ward.${w.id}`, label: "registered voters, 2022" });
  const cons = TOOL_WARDS.filter((x) => x.constituency === w.constituency);
  const conVoters = cons.reduce((n, x) => n + x.voters, 0);
  const avg = TOOL_WARDS.reduce((n, x) => n + x.voters, 0) / TOOL_WARDS.length;
  const max = Math.max(...TOOL_WARDS.map((x) => x.voters));
  const rank = [...TOOL_WARDS].sort((a, b) => b.voters - a.voters).findIndex((x) => x.id === w.id) + 1;
  return {
    type: "ward", kicker: `${w.constituencyName} · ward profile`, title: w.name, path: `/tools/ward-dossier/${w.code}`,
    blocks: [
      { kind: "map", fills: Object.fromEntries(TOOL_WARDS.map((x) => [`ward.${x.id}`, x.id === w.id ? C_EARTH : x.constituency === w.constituency ? "#acc5f2" : "#dcd7cd"])), legend: [{ color: C_EARTH, label: `${w.name}, in ${w.constituencyName} (light blue)` }], side: [
        { value: voters.display, label: "registered voters", note: `${rank} of 40 by size · ${((w.voters / conVoters) * 100).toFixed(1)}% of ${w.constituencyName} · Tier 1` },
        { value: n0(w.stations), label: "polling stations", note: `${n0(w.centres)} centres` },
        { value: n0(w.population), label: "people", note: `${n0(w.areaSqKm)} km² · Gazette 2026` },
        { value: n0(w.projects), label: "county projects placed here", note: "itemised scorecard" },
      ] },
      { kind: "bars", rows: [
        { label: w.name, value: w.voters, display: n0(w.voters), mark: "lit" },
        { label: "Average ward", value: avg, display: n0(avg) },
        { label: "Largest ward", value: max, display: n0(max) },
      ], zeroNote: "Bars start at zero." },
    ],
    figures: [voters, REGISTER_FIG()],
    source: `Source: IEBC 2022 register and polling-station list (Tier 1); population and area, Gazette Notice 12251 (Tier 1); ${SCORECARD}. Shares calculated by the site.`,
  };
}
const C_EARTH = "#b0451a";

function ranked(p: Params): CardModel | null {
  const m = measureOf(p.measure);
  const def = MEASURES[m];
  const rows = [...TOOL_WARDS].map((w) => ({ w, v: def.value(w) })).sort((a, b) => b.v - a.v);
  const per = Math.max(1, Math.min(40, Number(p.per) || 8));
  const page = Math.max(1, Number(p.page) || 1);
  const pages = Math.ceil(rows.length / per);
  const slice = rows.slice((page - 1) * per, page * per);
  const avg = m === "per1k" ? (TOOL_WARDS.reduce((n, w) => n + w.projectsKsh, 0) / TOOL_WARDS.reduce((n, w) => n + w.voters, 0)) * 1000 : undefined;
  return {
    type: "ranked", kicker: "The ward league table", path: def.path, page: pages > 1 ? `${page}/${pages}` : undefined,
    title: m === "voters" ? "The 40 wards, by registered voters" : `The 40 wards, by ${def.label}`,
    blocks: [{ kind: "bars", rows: slice.map(({ w, v }) => ({ label: `${rows.findIndex((r) => r.w.id === w.id) + 1}  ${w.name}`, sub: w.constituencyName, value: v, display: def.display(v), mark: m === "per1k" && avg !== undefined && v < avg ? "below" : w.pool ? "pool" : undefined })), ref: avg !== undefined ? { value: avg, label: `county average ${def.display(avg)}` } : undefined, zeroNote: m === "voters" ? "Orange: wards where he has never held office. Bars start at zero." : "Orange: below the county average. Bars start at zero." }],
    figures: [REGISTER_FIG()],
    source: def.source,
  };
}

function map(p: Params): CardModel | null {
  const layer = p.layer ?? "voters";
  if (layer === "zones" || layer === "pool") {
    const zoneColor: Record<string, string> = { anchor: "#1e49ce", mwingi: "#b0451a", arid: "#09672e", none: "#dcd7cd" };
    const fills = Object.fromEntries(TOOL_WARDS.map((w) => [`ward.${w.id}`, layer === "pool" ? (w.pool ? C_EARTH : "#dcd7cd") : zoneColor[w.zone]]));
    const pool = resolveFigure({ id: "pool", label: "registered voters in the pool" });
    const share = resolveFigure({ id: "pool.share", label: "of the register" });
    return {
      type: "map", kicker: "Kitui Map Studio", path: "/tools/map-studio", title: layer === "pool" ? "Where he has never held office" : "Three regions, and a ward in none",
      blocks: [{ kind: "map", fills, legend: layer === "pool" ? [{ color: C_EARTH, label: "never held office" }] : [{ color: "#1e49ce", label: "anchor" }, { color: "#b0451a", label: "Mwingi" }, { color: "#09672e", label: "arid belt" }, { color: "#dcd7cd", label: "in no zone" }], side: layer === "pool" ? [{ value: pool.display, label: "registered voters" }, { value: share.display, label: "of the county" }] : undefined }],
      figures: [REGISTER_FIG(), pool, share],
    };
  }
  const m: Measure = (["per1k", "stations", "density", "projects", "population"] as const).find((x) => x === layer) ?? "voters";
  const def = MEASURES[m];
  const vals = TOOL_WARDS.map((w) => def.value(w));
  const q = fifth(vals);
  const top = [...TOOL_WARDS].sort((a, b) => def.value(b) - def.value(a)).slice(0, 4);
  return {
    type: "map", kicker: "Kitui Map Studio", path: "/tools/map-studio", title: `The 40 wards by ${def.label}`,
    blocks: [{ kind: "map", fills: Object.fromEntries(TOOL_WARDS.map((w) => [`ward.${w.id}`, QUINTS[q(def.value(w))]])), legend: [{ color: QUINTS[0], label: "fewest" }, { color: QUINTS[2], label: "middle fifth" }, { color: QUINTS[4], label: "most" }], side: top.map((w) => ({ value: def.display(def.value(w)), label: w.name })) }],
    figures: [REGISTER_FIG()],
    source: def.source,
  };
}

function compare(p: Params): CardModel | null {
  const ws = (p.wards ?? "").split(",").map((s) => wardBy(s.trim())).filter((w): w is NonNullable<typeof w> => !!w).slice(0, 4);
  if (ws.length < 2) return null;
  const rowsFor = (label: string, f: (w: (typeof ws)[number]) => number, d: (v: number) => string) => ws.map((w) => ({ label: w.name, sub: label, value: f(w), display: d(f(w)) }));
  return {
    type: "compare", kicker: "Ward comparison", path: `/tools/ward-compare?wards=${ws.map((w) => w.id).join(",")}`, title: ws.map((w) => w.name).join(" · "),
    blocks: [
      { kind: "bars", rows: rowsFor("registered voters", (w) => w.voters, n0) },
      { kind: "bars", rows: rowsFor("project value per 1,000 voters", per1kOf, (v) => `KSh ${(v / 1e6).toFixed(2)}m`), zeroNote: "Each set of bars starts at zero." },
    ],
    figures: [REGISTER_FIG()],
    source: `Source: IEBC 2022 register and polling-station list (Tier 1); ${SCORECARD}. Ratios calculated by the site.`,
  };
}

const PICTO_SETS: Record<string, { title: string; path: string; items: [string, string, PictogramName][] }> = {
  water: { title: "Water: how many have it", path: "/needs#needs-sec-3-1", items: [["water.basic.kdhs", "with at least a basic water service", "jerrycan"], ["water.30min", "reach water in under 30 minutes", "jerrycan"], ["water.points.down.share", "of water points not working", "jerrycan"]] },
  people: { title: "How households live", path: "/needs#needs-sec-1-3", items: [["poverty.2021", "in poverty", "person"], ["electricity.2019", "of households with electricity", "house"], ["ict.offline", "of residents offline", "person"]] },
  offline: { title: "The offline majority", path: "/news", items: [["ict.internet", "use the internet", "person"], ["ict.offline", "are offline", "person"], ["ict.phone", "own a mobile phone", "person"]] },
};
function pictogram(p: Params): CardModel | null {
  if (p.set === "prices") {
    const g = resolveFigure({ id: "price.goat", label: "July 2025", prefix: "KSh " });
    const ga = resolveFigure({ id: "price.goat.average", label: "five-year average", prefix: "KSh " });
    const m = resolveFigure({ id: "price.maize", label: "July 2025", prefix: "KSh " });
    const ma = resolveFigure({ id: "price.maize.average", label: "five-year average", prefix: "KSh " });
    return {
      type: "pictogram", kicker: "Prices, drawn to scale", path: "/needs#goat-maize-prices", title: "A medium goat sells for more than its five-year average",
      blocks: [
        { kind: "scale", glyph: "goat", title: "A medium goat", items: [{ value: ga.value ?? 0, display: ga.display, label: ga.label }, { value: g.value ?? 0, display: g.display, label: g.label }] },
        { kind: "tiles", items: [{ value: m.display, label: "a kilo of maize, July 2025", note: `five-year average ${ma.display}` }] },
      ],
      figures: [g, ga, m, ma],
    };
  }
  const set = PICTO_SETS[p.set ?? "water"];
  if (!set) return null;
  const figs = set.items.map(([id, label]) => resolveFigure({ id, label }));
  return {
    type: "pictogram", kicker: "One mark in a hundred", path: set.path, title: set.title,
    blocks: [{ kind: "icons", key: "Each mark is one in a hundred.", items: figs.map((f, i) => ({ value: f.value ?? 0, display: f.display, label: f.label, glyph: set.items[i][2] })) }],
    figures: figs,
  };
}

function forecast(): CardModel {
  const rows = (waterAndDrought as { values: { value: string; as_of: string; unit: string; tier: number }[] }).values.filter((v) => v.unit === "phase");
  const water = resolveFigure({ id: "water.points.down.share", label: "of water points not working" });
  const goat = resolveFigure({ id: "price.goat", label: "a medium goat", prefix: "KSh " });
  return {
    type: "forecast", kicker: "Drought Watch", path: "/tools/drought-watch", title: `Kitui's drought phase: ${rows[rows.length - 1].value}`,
    blocks: [{ kind: "forecast", days: rows.map((r) => ({ when: r.as_of, phase: r.value })), latest: rows[rows.length - 1].value, also: [`${water.display} ${water.label}`, `${goat.display}, ${goat.label}`] }],
    figures: [water, goat],
    source: `Source: NDMA Kitui drought early-warning bulletins, ${rows[0].as_of} to ${rows[rows.length - 1].as_of} (Tier 1 and 2); ${sourceLine([water, goat]).replace(/^Source: /, "")}`,
  };
}

function receipt(): CardModel {
  const pop = figure("census.population").value ?? 1;
  const shs = (n: number) => `${n < 0 ? "−" : ""}KSh ${group(Math.abs(n))}`;
  const per = (id: string) => (figure(id).value ?? 0) / pop;
  const ids: [string, string][] = [["budget.equitable", "Equitable share"], ["budget.osr", "Own-source revenue"], ["budget.grants", "Grants"], ["budget.rounding", "Rounding in the total"]];
  const figs = [...ids.map(([id, label]) => resolveFigure({ id, label })), resolveFigure({ id: "budget.total", label: "envelope" }), resolveFigure({ id: "census.population", label: "residents" })];
  return {
    type: "receipt", kicker: "County Money Explainer", path: "/tools/county-money", title: `KSh ${group(per("budget.total"))} of county budget for every resident`,
    blocks: [{ kind: "receipt", lines: ids.map(([id, label]) => ({ label, amount: shs(per(id)), note: provenanceOf(figure(id)) })), total: { label: "TOTAL PER RESIDENT", amount: shs(per("budget.total")), note: provenanceOf(figure("budget.total")) }, foot: `Each line: the figure ÷ ${group(pop)} residents (2019 census). Calculated.` }],
    figures: figs,
  };
}

function report(p: Params): CardModel | null {
  const c = TOOL_CONSTITUENCIES.find((x) => x.id === p.con) ?? TOOL_CONSTITUENCIES[0];
  if (!c) return null;
  const v = resolveFigure({ id: `con.${c.id}`, label: "registered voters" });
  const tiles: Tile[] = [
    { value: v.display, label: "registered voters, 2022", note: "Tier 1" },
    { value: n0(c.wards), label: "wards" },
    { value: n0(c.stations), label: "polling stations" },
    { value: c.projects === null ? "Not itemised" : n0(c.projects), label: "county projects itemised" },
    { value: c.perVoter === null ? "Not itemised" : `KSh ${n0(c.perVoter)}`, label: "county project value per voter" },
    { value: c.pool ? "Never" : c.held ? "Yes, as MP" : "No", label: "has he held office here?" },
  ];
  return { type: "report", kicker: "Constituency report", path: "/tools/constituency-scorecard", title: c.name, blocks: [{ kind: "tiles", items: tiles }], figures: [v], source: `Source: IEBC 2022 register and polling-station list (Tier 1); ${SCORECARD}. No grades: the card reports, it does not score.` };
}

function countdown(): CardModel {
  const now = new Date();
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const utc = (d: string) => { const [y, m, dd] = d.split("-").map(Number); return Date.UTC(y, m - 1, dd); };
  const next = [...RACE_CALENDAR].sort((a, b) => a.date.localeCompare(b.date)).find((e) => utc(e.date) >= today);
  const after = next ? RACE_CALENDAR.filter((e) => e.date > next.date).sort((a, b) => a.date.localeCompare(b.date)).slice(0, 4) : [];
  return {
    type: "countdown", kicker: "Governor Race Calendar", path: "/timeline#route-to-2027", title: "The next stop on the road to 2027",
    blocks: next
      ? [{ kind: "countdown", days: Math.round((utc(next.date) - today) / 86_400_000), date: next.date, event: next.event, who: next.appliesTo }, { kind: "list", items: after.map((e) => ({ title: e.event, meta: e.date })) }]
      : [{ kind: "quote", text: "Every Gazette date on the calendar has passed." }],
    figures: [],
    source: `Source: Gazette Notices 13497 to 13503, 20 August 2026 (Tier 1). Days counted from the date the image was made.`,
  };
}

const CHANNEL_NAMES: Record<string, string> = { sms: "SMS", ussd: "USSD", whatsapp: "WhatsApp", radio: "Radio" };
function phone(p: Params): CardModel | null {
  const text = (p.text ?? "").replace(/\r/g, "").replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim().slice(0, 320);
  if (!text) return null;
  const channels = (p.channels ?? "sms").split(",").filter((c) => c in CHANNEL_NAMES).slice(0, 4);
  return { type: "phone", kicker: "Message Studio", path: "/tools/message-studio", illustrative: true, title: channels.length > 1 ? "One message, four screens" : `The message on ${CHANNEL_NAMES[channels[0] ?? "sms"]}`, blocks: [{ kind: "phone", channels: channels.length ? channels.map((c) => CHANNEL_NAMES[c]) : ["SMS"], text }], figures: [], source: "Illustrative: a draft from the Message Studio, not a message that was sent." };
}

function fact(p: Params): CardModel | null {
  const id = p.id ?? "register.2022";
  const known = FACTS.find(([, fid]) => fid === id);
  let f: ResolvedFigure;
  try { f = resolveFigure({ id, label: known?.[0] ?? p.label ?? id }); } catch { return null; }
  if (id === "pool") f = { ...f, label: "registered voters live where Dr. Mulu has never held office" };
  const derived = !f.source || f.source.startsWith("Derived in");
  const fromRegister = /^(pool|pareto|con\.|ward\.|path\.|register|bloc|east-south|zone)/.test(id);
  const figs = derived && fromRegister ? [f, REGISTER_FIG()] : [f];
  const sourceText = derived ? (fromRegister ? "Calculated by the site from the IEBC 2022 register" : "Calculated by the site") : (f.source ?? "");
  return { type: "fact", kicker: "Fact card", path: "/tools/fact-cards", title: "Did you know?", blocks: [{ kind: "quote", value: f.display, text: f.label }, { kind: "tiles", items: [{ value: f.provenance, label: sourceText, note: asOfText(f.asOf) }] }], figures: figs };
}

function progress(p: Params): CardModel {
  const done = new Set((p.done ?? "").split(",").filter(Boolean));
  if (p.set === "kpis") {
    const items = NOMINATION_KPIS.map((k) => ({ title: `${k.code} ${k.title}`, meta: `Target ${k.target} · ${k.baseline.kind === "measured" ? `reading ${k.baseline.display}` : "no reading yet"}`, state: (k.baseline.kind === "measured" ? "done" : "todo") as "done" | "todo" }));
    return { type: "progress", kicker: "KPI Ladder", path: "/tools/kpis", title: "The nomination-stage indicators", blocks: [{ kind: "list", items }], figures: [], source: "Source: the plan's nomination scorecard. Targets are the plan's, not results." };
  }
  const items = NOMINATION_ITEMS.map((i, k) => ({ title: i.label, meta: i.detail, state: (done.has(String(k)) ? "done" : "todo") as "done" | "todo" }));
  return { type: "progress", kicker: "Governor Nomination Path", path: "/tools/nomination-path", title: `${items.filter((i) => i.state === "done").length} of ${items.length} steps ticked`, blocks: [{ kind: "list", items }], figures: [], source: "Source: Gazette Notices 13497 to 13503 (Tier 1) and the campaign's nomination-path record. Ticks are the sender's own." };
}

async function week(p: Params): Promise<CardModel> {
  if (p.set === "calendar") {
    // The team's own calendar records, as saved in the workspace: nothing is drafted for them.
    const recs = Object.values((await liveSnapshot().catch(() => null))?.collections.calendar?.data ?? {}) as Record<string, unknown>[];
    const str = (v: unknown) => (typeof v === "string" ? v : "");
    const rows = recs.map((r) => [str(r.date), str(r.channel), str(r.item), str(r.pillar)]).filter((r) => r[0]).sort((a, b) => a[0].localeCompare(b[0])).slice(-10);
    return {
      type: "week", kicker: "Weekly Content Calendar", path: "/tools/calendar", title: "The week's posts, as planned",
      blocks: rows.length ? [{ kind: "grid", columns: ["Date", "Channel", "Post", "Pillar"], rows }] : [{ kind: "quote", text: "No posts are saved in the content calendar yet. They appear on this card as the team plans them." }],
      figures: [], source: "Source: the team's content calendar, saved in the workspace.",
    };
  }
  const spots = (p.spots ?? "").split(",").map(Number);
  const rows = RADIO_STATIONS.map((s, i) => {
    const k = Number.isFinite(spots[i]) && p.spots ? spots[i] : startingSpots(s.posture);
    const share = RADIO_SHARE[s.name] ? resolveFigure({ id: RADIO_SHARE[s.name], label: "" }).display : "not measured";
    return [s.name, s.frequency?.match(/^[\d.]+/)?.[0] ?? "not published", share, String(k)];
  });
  const shares = Object.values(RADIO_SHARE).map((id) => resolveFigure({ id, label: "listener share" }));
  return { type: "week", kicker: "Radio Planner", path: "/tools/radio", title: "The week's radio spots, station by station", blocks: [{ kind: "grid", columns: ["Station", "Frequency", "Listeners", "Spots"], rows }], figures: shares, source: `Source: ${sourceLine(shares).replace(/^Source: /, "")} Spots: ${p.spots ? "the sender's plan" : "the Radio Planner's starting plan"}.` };
}

function roster(p: Params): CardModel {
  if (p.set === "agents") {
    const per = Math.max(1, Math.min(4, Number(p.per) || 2));
    const rows = [...PUBLIC_WARDS].sort((a, b) => b.stations - a.stations).slice(0, 12).map((w) => [w.name, w.constituency, n0(w.stations), n0(w.stations * per)]);
    const total = PUBLIC_WARDS.reduce((n, w) => n + w.stations, 0);
    return { type: "roster", kicker: "Polling Agent Planner", path: "/tools/polling-agents", title: `${n0(total * per)} agents at ${per} a station`, blocks: [{ kind: "grid", columns: ["Ward", "Constituency", "Stations", "Agents"], rows }], figures: [resolveFigure({ id: "register.polling-stations", label: "polling stations" })], source: "Source: IEBC 2022 polling-station list (Tier 1). Agents = stations × the sender's agents per station. The twelve wards with most stations shown." };
  }
  const con = p.con;
  const m = new Map<string, { centre: string; ward: string; con: string; voters: number }>();
  for (const s of TOOL_STATIONS) {
    if (con && s.constituencyName !== con) continue;
    const k = `${s.ward}|${s.centre}`;
    const cur = m.get(k) ?? { centre: s.centre, ward: s.wardName, con: s.constituencyName, voters: 0 };
    cur.voters += s.voters;
    m.set(k, cur);
  }
  const top = [...m.values()].sort((a, b) => b.voters - a.voters).slice(0, 12);
  return { type: "roster", kicker: "Voter Density Finder", path: "/tools/voter-density", title: `The busiest polling centres${con ? ` in ${con}` : " in Kitui"}`, blocks: [{ kind: "grid", columns: ["Centre", "Ward", "Voters"], rows: top.map((c) => [c.centre, c.ward, n0(c.voters)]) }], figures: [REGISTER_FIG()], source: "Source: IEBC 2022 register of voters per polling station (Tier 1). Centre totals summed by the site." };
}

function qr(p: Params): CardModel | null {
  const w = wardBy(p.ward);
  if (!w) return null;
  const channel = (p.channel ?? "poster").replace(/[^a-z0-9-]/gi, "").slice(0, 24) || "poster";
  return { type: "qr", kicker: "Ward Link and QR Builder", path: `/tools/ward-dossier/${w.code}?src=${channel}`, title: `${w.name}: scan to see your ward`, blocks: [{ kind: "qr", url: "", caption: `${w.name}, ${w.constituencyName}` }], figures: [resolveFigure({ id: `ward.${w.id}`, label: "registered voters" })] };
}

function carousel(p: Params): CardModel | null {
  const cons = [...TOOL_CONSTITUENCIES].sort((a, b) => b.voters - a.voters);
  const i = Math.max(1, Math.min(cons.length, Number(p.i) || 1));
  const card = report({ con: cons[i - 1].id });
  return card ? { ...card, type: "carousel", page: `${i}/${cons.length}`, kicker: "The eight constituencies" } : null;
}

export async function buildCard(type: CardType, p: Params): Promise<CardModel | null> {
  switch (type) {
    case "big-number": return bigNumber(p);
    case "stat-grid": return statGrid(p);
    case "ward": return ward(p);
    case "ranked": return ranked(p);
    case "map": return map(p);
    case "compare": return compare(p);
    case "pictogram": return pictogram(p);
    case "forecast": return forecast();
    case "receipt": return receipt();
    case "report": return report(p);
    case "countdown": return countdown();
    case "phone": return phone(p);
    case "fact": return fact(p);
    case "progress": return progress(p);
    case "week": return week(p);
    case "roster": return roster(p);
    case "qr": return qr(p);
    case "carousel": return carousel(p);
    default: return null;
  }
}

export const CARD_TYPES: CardType[] = ["big-number", "stat-grid", "ward", "ranked", "map", "compare", "pictogram", "forecast", "receipt", "report", "countdown", "phone", "fact", "progress", "week", "roster", "qr", "carousel"];
export { POOL_IDS };
