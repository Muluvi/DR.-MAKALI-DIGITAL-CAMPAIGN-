/**
 * Section 3, The Analysis: the number, where the votes are, the four routes, the footprint, the
 * field, party flow, the regions, the digital ceiling, the audit, the gaps and the diagnosis.
 */
import openItems from "../generated/open-items.json" with { type: "json" };
import { WARD_TILES } from "../../geo/wards.ts";
import type { Bar, FigureSpec } from "../types.ts";
import { tileColumns, tileRows } from "./s0-cover.ts";
import { bar, F, fmt, num, src } from "./_util.ts";

const BENCH = { value: num("benchmark"), label: `${fmt("benchmark")}, the working benchmark (Section 3.1)` };
const TURNOUT = `${fmt("turnout.constant")}%`;

/* ------------------------------------------------------------------ fig-3-1-funnel */

const funnel = (reg: "2022" | "2026") => [
  { label: `Registered voters, ${reg === "2022" ? "2022" : "July 2026"}`, value: num(`register.${reg}`), state: F(`register.${reg}`).state },
  { label: `Ballots cast at the ${TURNOUT} turnout rate`, value: num(`ballots.${reg}`), state: "modelled" as const, note: `${fmt(`register.${reg}`)} × ${TURNOUT} = ${fmt(`ballots.${reg}`)}. The rate is the certified 2022 turnout, carried forward.` },
  { label: "Votes to win: the benchmark", value: num("benchmark"), state: "target" as const, note: `${fmt("benchmark")} is ${fmt(reg === "2022" ? "benchmark.share-of-ballots" : "benchmark.share-of-ballots.2026")}% of those ballots. A constant here, not re-derived from the register.` },
];

export const FIG_3_1: FigureSpec = {
  id: "fig-3-1-funnel",
  section: "3.1",
  title: `To win, he needs about ${fmt("benchmark.share-of-ballots")}% of the ballots cast, on the 2022 register`,
  question: "What is the winning number?",
  takeaway: `${fmt("benchmark")} votes is the 2022 winner's total rounded; the same share of the larger July 2026 register is ≈${fmt("benchmark.2026-equivalent.rounded")}.`,
  sources: [src("register.2022"), src("register.2026"), src("turnout.2022", `Turnout of ${TURNOUT}: IEBC Form 37C, Kitui governor 2022, carried forward to 2027`), { name: "Benchmark: the 2022 governor's winning total, rounded", tier: null, state: "target" }],
  chart: { type: "funnel", stages: funnel("2022"), toggle: { label: "July 2026 register", stages: funnel("2026") } },
  notes: [`The turnout rate and the benchmark are held fixed: the toggle changes only the register. The rate is measured for 2022; applying it to 2027 is an assumption.`],
  columns: [{ key: "step", label: "Step" }, { key: "y2022", label: "2022 register", numeric: true }, { key: "y2026", label: "July 2026 register", numeric: true }],
  rows: [
    { cells: { step: "Registered voters", y2022: num("register.2022"), y2026: num("register.2026") } },
    { cells: { step: `Ballots at ${TURNOUT}`, y2022: num("ballots.2022"), y2026: num("ballots.2026") }, state: "modelled" },
    { cells: { step: "Benchmark", y2022: num("benchmark"), y2026: num("benchmark") }, state: "target" },
    { cells: { step: "Benchmark as % of ballots", y2022: Number(fmt("benchmark.share-of-ballots")), y2026: Number(fmt("benchmark.share-of-ballots.2026")) }, state: "modelled" },
  ],
};

/* ------------------------------------------------------------------ fig-3-2-register-map */

const BIG4 = new Set(["kitui-central", "kitui-south", "mwingi-central", "mwingi-north"]);
const RANKED = [...WARD_TILES].sort((a, b) => b.voters - a.voters);
const TOTAL = num("register.2022");

export const FIG_3_2: FigureSpec = {
  id: "fig-3-2-register-map",
  section: "3.2",
  title: `The twelve largest wards hold ${fmt("pareto.top12.share")}% of the register, and half the wards hold ${fmt("pareto.top20.share")}%`,
  question: "Where are the votes?",
  takeaway: `Registration is concentrated: the ten smallest wards together hold only ${fmt("pareto.bottom10.share")}% of voters, across some of the county's widest ground.`,
  sources: [src("register.2022"), { name: "Shares and running totals, derived", tier: "T1", state: "modelled" }],
  chart: {
    type: "composite",
    parts: [
      { heading: "Registered voters per ward", chart: { type: "tilemap", layers: ["register"], initial: "register" } },
      {
        heading: "The forty wards ranked, as shares of the register",
        chart: {
          type: "pareto",
          items: RANKED.map((w, i) => ({ label: w.name, share: (w.voters / TOTAL) * 100, top: i < 12, mark: BIG4.has(w.constituency) })),
          cutAt: 12,
          cutLabel: `12 largest: ${fmt("pareto.top12.share")}%`,
          topLabel: "The twelve largest wards",
          markLabel: `A ward in the Big 4 constituencies (${fmt("big4.share")}% of the register)`,
        },
      },
    ],
  },
  notes: ["Bars and the running total are both shares of the register, read on the one 0–100% axis."],
  columns: [
    { key: "rank", label: "Rank", numeric: true },
    { key: "ward", label: "Ward" },
    { key: "constituency", label: "Constituency" },
    { key: "voters", label: "Registered voters, 2022", numeric: true },
    { key: "share", label: "Share, %", numeric: true },
    { key: "cum", label: "Running total, %", numeric: true },
  ],
  rows: (() => {
    let run = 0;
    return RANKED.map((w, i) => {
      run += w.voters;
      return { cells: { rank: i + 1, ward: w.name, constituency: w.constituencyName, voters: w.voters, share: Math.round((w.voters / TOTAL) * 1000) / 10, cum: Math.round((run / TOTAL) * 1000) / 10 } };
    });
  })(),
};

/* ------------------------------------------------------------------ fig-3-3-paths */

const cons = (...ids: [string, string][]): Bar[] => ids.map(([id, name]) => bar(`con.${id}`, name));
const PATHS = [
  { key: "a", title: "Path A: the Mwingi bloc", reg: cons(["mwingi-central", "Mwingi Central"], ["mwingi-north", "Mwingi North"], ["mwingi-west", "Mwingi West"]) },
  { key: "b", title: "Path B: Central, South and West", reg: cons(["kitui-central", "Kitui Central"], ["kitui-south", "Kitui South"], ["kitui-west", "Kitui West"]) },
  { key: "c", title: "Path C: the twelve largest wards", reg: [bar("pareto.top12", "12 wards")] },
  { key: "d", title: "Path D: the home belt", tag: "the trap", reg: cons(["kitui-central", "Kitui Central"], ["kitui-west", "Kitui West"], ["kitui-rural", "Kitui Rural"]) },
];

export const FIG_3_3: FigureSpec = {
  id: "fig-3-3-paths",
  section: "3.3",
  title: `No route clears ${fmt("benchmark")} on its own ballots, and the home belt falls furthest short`,
  question: "Which route to the number is real, and which is a trap?",
  takeaway: `Even every ballot in the home belt leaves him ${fmt("path.d.margin", "abs")} short: a route is where the margin is built, and Mwingi is part of any route that works.`,
  sources: [src("register.2022"), { name: `Ballots at the ${TURNOUT} turnout constant, derived`, tier: "T1", state: "modelled" }],
  chart: {
    type: "paths",
    ref: BENCH,
    max: Math.max(...PATHS.map((p) => num(`path.${p.key}.registered`)), num("benchmark")),
    groups: PATHS.map((p) => ({
      title: p.title,
      tag: p.tag,
      rows: [
        { label: "Registered voters", segments: p.reg },
        { label: `Ballots at ${TURNOUT}, if every one were his`, segments: [bar(`path.${p.key}.ballots`, "Ballots", { tone: p.tag ? "neg" : "neutral" })] },
      ],
    })),
  },
  notes: ["Path D is the trap: a home-constituency strategy cannot reach the number, whatever its margin."],
  columns: [
    { key: "path", label: "Route" },
    { key: "registered", label: "Registered, 2022", numeric: true },
    { key: "ballots", label: `Ballots at ${TURNOUT}`, numeric: true },
    { key: "margin", label: `Against ${fmt("benchmark")}`, numeric: true },
  ],
  rows: PATHS.map((p) => ({ cells: { path: `${p.title}${p.tag ? " (the trap)" : ""}`, registered: num(`path.${p.key}.registered`), ballots: num(`path.${p.key}.ballots`), margin: num(`path.${p.key}.margin`) }, state: "modelled" as const })),
};

/* ------------------------------------------------------------------ fig-3-4-footprint */

export const FIG_3_4: FigureSpec = {
  id: "fig-3-4-footprint",
  section: "3.4",
  title: `${fmt("pool.share")}% of the register lives in the four constituencies where he has never held office`,
  question: "Where has he held office, and what does that leave untouched?",
  takeaway: `The ${fmt("pool")}-voter pool is structural, derived from where he has held office, not from a survey; ${fmt("pareto.top12.in-pool")} of the twelve largest wards are in it.`,
  sources: [src("register.2022"), { name: "Parliament of Kenya record", tier: "T1" }, { name: "The pool: Mwingi North, West, Central and Kitui South, summed", tier: "T1", state: "modelled" }],
  chart: {
    type: "composite",
    parts: [
      { heading: "Where he has held office", chart: { type: "tilemap", layers: ["footprint"], initial: "footprint" } },
      {
        heading: "The pool",
        chart: {
          type: "stats",
          items: [
            { value: fmt("pool"), label: "registered voters in the pool: structural, derived from where he has held office, not from a survey", state: "modelled" },
            { value: `${fmt("pool.share")}%`, label: "of the county register", state: "modelled" },
            { value: `${fmt("pareto.top12.in-pool")} of 12`, label: `largest wards lie in the pool, holding ${fmt("pareto.top12.in-pool.voters")} voters`, state: "modelled" },
            { value: fmt("pool.wards"), label: "wards: fifteen in Mwingi, six in Kitui South", state: "modelled" },
          ],
        },
      },
    ],
  },
  columns: tileColumns(["footprint"]),
  rows: tileRows(["footprint"]),
};

/* ------------------------------------------------------------------ fig-3-5-field */

const FIELD: Bar[] = [
  bar("result.2022.womanrep.kasalu", "Irene Kasalu · Woman Representative 2022 · countywide"),
  bar("result.2022.gov.malombe", "Julius Malombe · Governor 2022 · countywide"),
  bar("result.2022.senate.wambua", "Enoch Wambua · Senator 2022 · countywide"),
  bar("result.2017.gov.ngilu", "Charity Ngilu · Governor 2017 · countywide"),
  bar("result.2022.gov.musila", "David Musila · Governor 2022 · countywide", { note: `Certified; The Star's early total was ${fmt("result.2022.gov.musila.media")}.` }),
  bar("result.2022.mp.mulu", "Dr. Mulu · Kitui Central MP 2022 · one constituency", { tone: "accent", note: `Won from an electorate of ${fmt("con.kitui-central")}: a constituency total, not a countywide one.` }),
];

export const FIG_3_5: FigureSpec = {
  id: "fig-3-5-field",
  section: "3.5",
  title: "Four of the field have already won a countywide race, and he has not yet stood for one",
  question: "What has each contender already proven at the ballot?",
  takeaway: `Kasalu's ${fmt("result.2022.womanrep.kasalu")} beat the winning governor's total; his own proof at the ballot is constituency-bounded.`,
  sources: [src("result.2022.womanrep.kasalu"), src("result.2017.gov.ngilu"), src("result.2022.mp.mulu")],
  chart: { type: "bars", bars: FIELD, ref: { value: num("result.2022.gov.malombe"), label: `${fmt("result.2022.gov.malombe")}, the 2022 governor's winning total` } },
  notes: ["Largest vote each has won in one race. Each bar names its scope: a countywide total and a constituency total are not the same test."],
  columns: [{ key: "who", label: "Candidate, race and scope" }, { key: "votes", label: "Votes", numeric: true }],
  rows: FIELD.map((b) => ({ cells: { who: b.label, votes: b.value }, state: b.state, closesWith: b.state === "needed" ? F("result.2022.mp.mulu").closesWith : undefined })),
};

/* ------------------------------------------------------------------ fig-3-6-party-flow */

export const FIG_3_6: FigureSpec = {
  id: "fig-3-6-party-flow",
  section: "3.6",
  title: `Two constituencies with ${fmt("east-south.share")}% of the register returned non-Wiper MPs, and his own seat has its own race`,
  question: "Where will party loyalty not carry him?",
  takeaway: "Kitui East and Kitui South are a direct-contact problem, not a party-mobilisation one, and Kitui Central cannot be left on autopilot.",
  sources: [{ name: "Constituency records, 2022 (single-source)", tier: "T3" }, src("register.2022"), { name: "Kitui Central succession reports", tier: "T3" }],
  chart: {
    type: "composite",
    parts: [
      { heading: "Party flow by constituency", chart: { type: "tilemap", layers: ["party-flow"], initial: "party-flow" } },
      {
        heading: "What it covers",
        chart: {
          type: "stats",
          items: [
            { value: fmt("east-south"), label: "registered voters in Kitui East (UDA MP) and Kitui South (Jubilee MP)", state: "modelled" },
            { value: `${fmt("east-south.share")}%`, label: "of the county register", state: "modelled" },
            { value: fmt("con.kitui-central"), label: "voters in Kitui Central, where the MP succession is its own contest (T3)", state: "sourced" },
          ],
        },
      },
    ],
  },
  columns: tileColumns(["party-flow"]),
  rows: tileRows(["party-flow"]),
};

/* ------------------------------------------------------------------ fig-3-7-zones */

const ZONES = [
  { label: "Urban and central anchor", pop: "zone.anchor.share", reg: "zone.anchor.register.share" },
  { label: "Northern block (Mwingi)", pop: "zone.mwingi.share", reg: "zone.mwingi.register.share" },
  { label: "Arid and resource belt", pop: "zone.arid.share", reg: "zone.arid.register.share" },
  { label: "Kitui Rural: in no zone", pop: "zones.excluded.share", reg: "con.kitui-rural.share" },
];
const one = (id: string) => Math.round(num(id) * 10) / 10;

export const FIG_3_7: FigureSpec = {
  id: "fig-3-7-zones",
  section: "3.7",
  title: `The three zones hold ${fmt("zones.share")}% of residents, and Kitui Rural falls in none of them`,
  question: "How do the three zones differ, and who is left out?",
  takeaway: `About ${fmt("zones.excluded")} residents and ${fmt("con.kitui-rural.share")}% of the register sit outside the zoning; Kitui Rural needs a zone or a stated reason it is out.`,
  sources: [src("census.population"), src("register.2022"), { name: "This proposal's zoning; shares derived", tier: "T1", state: "modelled" }],
  chart: {
    type: "composite",
    parts: [
      { heading: "The zones, ward by ward", chart: { type: "tilemap", layers: ["zones"], initial: "zones" } },
      {
        heading: "Share of residents against share of the register",
        chart: { type: "dumbbell", aLabel: "Share of residents (2019 Census)", bLabel: "Share of the register (2022)", unit: "%", max: 50, items: ZONES.map((z) => ({ label: z.label, a: one(z.pop), b: one(z.reg) })) },
      },
    ],
  },
  notes: ["Zones are built from administrative sub-counties; the register is by constituency. The two units do not match one-to-one (Section 3.7.3), so the register share is the nearest constituency match."],
  columns: [{ key: "zone", label: "Zone" }, { key: "pop", label: "Share of residents, %", numeric: true }, { key: "reg", label: "Share of the register, %", numeric: true }],
  rows: ZONES.map((z) => ({ cells: { zone: z.label, pop: one(z.pop), reg: one(z.reg) }, state: "modelled" as const })),
};

/* ------------------------------------------------------------------ fig-3-8-ceiling */

export const FIG_3_8: FigureSpec = {
  id: "fig-3-8-ceiling",
  section: "3.8",
  title: `Digital reaches at most ${fmt("reach.smartphone")} voters, ${fmt("reach.smartphone.short")} short of the benchmark before a single one is persuaded`,
  question: "What can digital physically reach?",
  takeaway: `${fmt("reach.offline")} registered voters are not reachable online: SMS, USSD, radio and the ground carry the rest.`,
  sources: [src("reach.smartphone"), src("ict.internet")],
  chart: {
    type: "stack",
    total: num("register.2026"),
    totalLabel: `The July 2026 register, ${fmt("register.2026")} voters, by how each can be reached (modelled)`,
    ref: BENCH,
    segments: [
      bar("reach.smartphone", "Reachable online: smartphone or data", { tone: "accent" }),
      bar("reach.sms-only", "Phone, no data: SMS and USSD only"),
      bar("reach.nophone", "No phone: radio and the ground"),
    ],
  },
  notes: ["All three segments are modelled from published rates applied to the register, and hatched for that reason. Reach is not votes."],
  columns: [{ key: "segment", label: "Segment" }, { key: "voters", label: "Registered voters", numeric: true }],
  rows: [
    { cells: { segment: "Reachable online", voters: num("reach.smartphone") }, state: "modelled" },
    { cells: { segment: "SMS and USSD only", voters: num("reach.sms-only") }, state: "modelled" },
    { cells: { segment: "No phone", voters: num("reach.nophone") }, state: "modelled" },
    { cells: { segment: "Short of the benchmark, online alone", voters: num("reach.smartphone.short") }, state: "modelled" },
  ],
};

/* ------------------------------------------------------------------ fig-3-9-audit */

const EXPORT = "Meta Insights export, Week 1";
const PROFILE = [
  { n: 1, label: "MP since", shown: "Aug 2012", issue: "The Parliament record shows 2013 (T1)." },
  { n: 2, label: "Work", shown: "Programmer Officer — CDTF", issue: "Typo: M&E Officer, CDTF, 1997–2004 (T1)." },
  { n: 3, label: "Work", shown: "Forms of government — Economist", issue: "Autofill error: Economist, Ministry of Planning & Finance, 1991–1997 (T1)." },
  { n: 4, label: "Current city", shown: "Nairobi", issue: "A standing 'absentee' attack line for a county aspirant." },
  { n: 5, label: "Education", shown: "Kenyatta University", issue: "The PhD in Economics, the credential the positioning rests on, is missing." },
  { n: 6, label: "Bio", shown: "Incoming Governor Kitui County 2027", issue: "Presumes a nomination that has not happened." },
];
const AUDIT_FIGURES = [
  { title: "Reach against the vote map", body: "His reach by constituency beside each constituency's share of the register, and the gap between them." },
  { title: "Ninety days, coded", body: "Every post in the window, by content pillar and reach." },
  { title: "Which language travels", body: "Engagement on reach for English, Kiswahili and Kikamba posts." },
  { title: "Him against the field", body: "Posts per week, median shares and ads live, for all four candidates, from public data." },
];

export const FIG_3_9: FigureSpec = {
  id: "fig-3-9-audit",
  section: "3.9",
  title: "His profile carries six errors a researcher would find in an afternoon, and the Week 1 audit reads the rest",
  question: "What does his current presence actually show?",
  takeaway: "The six fixes are Section 4.7; the four audit figures are drawn from the Week 1 export, never from an estimate.",
  sources: [{ name: "His public profile, as displayed; Parliament of Kenya record", tier: "T1" }, { name: `The four audit figures: ${EXPORT}`, tier: null, state: "target" }],
  chart: {
    type: "composite",
    parts: [
      { heading: "The profile as displayed, numbered", chart: { type: "mock", header: "Hon Makali Mulu · Facebook, intro", fields: PROFILE } },
      { heading: "What the Week 1 audit draws", chart: { type: "cards", columns: 2, cards: AUDIT_FIGURES.map((f, i) => ({ kicker: `Figure ${i + 1} · Week 1`, title: f.title, body: f.body })) } },
    ],
  },
  columns: [{ key: "item", label: "Item" }, { key: "shown", label: "As displayed, or the figure" }, { key: "issue", label: "The issue" }],
  rows: [
    ...PROFILE.map((p) => ({ cells: { item: `${p.n}. ${p.label}`, shown: p.shown, issue: p.issue } })),
    ...AUDIT_FIGURES.map((f) => ({ cells: { item: f.title, shown: "Drawn in Week 1", issue: f.body }, state: "target" as const })),
  ],
};

/* ------------------------------------------------------------------ fig-3-10-gaps */

const DATA_GAPS = (openItems as { kind: string; gap: string; closes: string; holder: string; status: string; where: string[] }[]).filter((i) => i.kind === "data");

export const FIG_3_10: FigureSpec = {
  id: "fig-3-10-gaps",
  section: "3.10",
  title: `${DATA_GAPS.length} things no published source can tell the analysis, and none is estimated`,
  question: "What can't the data tell us yet, and what closes each gap?",
  takeaway: "The analysis works from where he has held office and from certified totals, not from ward-level preference or ward returns no one has published.",
  sources: [{ name: "Generated from the named data gaps in Section 3.10 (scripts/build-open-items.ts)", tier: null }],
  chart: {
    type: "matrix",
    header: ["Gap", "Closing document", "Holder", "Where"],
    rows: DATA_GAPS.map((g) => ({ head: g.gap, cells: [g.closes, g.holder, g.where.join("; ")] })),
  },
  columns: [{ key: "gap", label: "Gap" }, { key: "doc", label: "Closing document" }, { key: "holder", label: "Holder" }, { key: "status", label: "Status" }, { key: "where", label: "Where" }],
  rows: DATA_GAPS.map((g) => ({ cells: { gap: g.gap, doc: g.closes, holder: g.holder, status: g.status, where: g.where.join("; ") } })),
};

/* ------------------------------------------------------------------ fig-3-11-evidence */

export const FIG_3_11: FigureSpec = {
  id: "fig-3-11-evidence",
  section: "3.11",
  title: "The diagnosis is a recognition gap outside Kitui Central, and one rival's result is the strongest evidence against it",
  question: "How strong is the diagnosis, and what would overturn it?",
  takeaway: "Week 1 tests it against his own channel data before anything is committed: if his reach already lands in Mwingi, the problem is message, not reach.",
  sources: [src("pool.share"), src("result.2022.womanrep.kasalu"), { name: "The Week 1 test: his own Insights export", tier: null, state: "target" }],
  chart: {
    type: "composite",
    parts: [
      {
        heading: "The balance",
        chart: {
          type: "balance",
          hypothesis: "His gap is a geography-of-recognition problem outside Kitui Central, not a deficit of leadership credibility.",
          supporting: [
            `${fmt("pool.share")}% of the register lives where he has never held office (Section 3.4).`,
            `${fmt("pareto.top12.in-pool")} of the twelve largest wards are in that pool (Section 3.4).`,
            "Kitui East and Kitui South will not carry party flow (Section 3.6).",
          ],
          counter: [
            `Irene Kasalu won ${fmt("result.2022.womanrep.kasalu")} votes countywide in 2022, more than the ${fmt("result.2022.gov.malombe")} that won the governorship: countywide vote-getting capacity, not passive recognition.`,
            `Enoch Wambua came within ${fmt("gap.wambua-to-benchmark-2022")} of the winning governor's total (Section 3.5).`,
          ],
          test: ["Week 1: his reach by constituency, from his own Insights export, against the register (Section 5.3)."],
        },
      },
      {
        heading: "The Week 1 test",
        chart: {
          type: "decision",
          question: "Where does his reach land now?",
          rules: [
            { if: "reach concentrates in Kitui Central", then: "the recognition diagnosis holds: Phase −1 runs as written (Section 4.2)" },
            { if: "reach already lands in Mwingi and Kitui South, but engagement there is low", then: "the problem is message, not reach: content changes, targeting holds (Section 4.8)" },
            { if: "the export cannot be read by constituency", then: "the test waits on the method in Section 5.3.5; nothing is committed against the hypothesis" },
          ],
        },
      },
    ],
  },
  columns: [{ key: "side", label: "Side" }, { key: "point", label: "Point" }],
  rows: [
    { cells: { side: "Hypothesis", point: "A geography-of-recognition gap outside Kitui Central" } },
    { cells: { side: "Supports", point: `${fmt("pool.share")}% of the register where he has never held office` } },
    { cells: { side: "Supports", point: `${fmt("pareto.top12.in-pool")} of the twelve largest wards in the pool` } },
    { cells: { side: "Supports", point: "Two constituencies will not carry party flow" } },
    { cells: { side: "Counts against", point: `Kasalu, ${fmt("result.2022.womanrep.kasalu")} votes countywide, above the winning governor` } },
    { cells: { side: "Counts against", point: `Wambua, within ${fmt("gap.wambua-to-benchmark-2022")} of the winning governor` } },
    { cells: { side: "Test", point: "Week 1 reach by constituency" }, state: "target" },
  ],
};

export const S3: FigureSpec[] = [FIG_3_1, FIG_3_2, FIG_3_3, FIG_3_4, FIG_3_5, FIG_3_6, FIG_3_7, FIG_3_8, FIG_3_9, FIG_3_10, FIG_3_11];
