/**
 * The cover: where the electorate sits and where he has held office, the four cover figures, and
 * the spine of the argument.
 */
import { WARD_TILES } from "../../geo/wards.ts";
import { LAYERS } from "../tilemap.ts";
import type { FigureSpec, Row, TileLayerId } from "../types.ts";
import { F, fmt, src } from "./_util.ts";

/** One row per ward for a tile map's table view: the layer's label is the ward's value. */
export function tileRows(layers: TileLayerId[]): Row[] {
  return WARD_TILES.map((t) => ({
    cells: {
      ward: t.name,
      constituency: t.constituencyName,
      voters: t.voters,
      ...Object.fromEntries(layers.map((l) => [l, LAYERS[l].style(t).label || "—"])),
    },
    state: layers.length === 1 && LAYERS[layers[0]].state !== "sourced" ? LAYERS[layers[0]].state : undefined,
  }));
}

export function tileColumns(layers: TileLayerId[]) {
  return [
    { key: "ward", label: "Ward" },
    { key: "constituency", label: "Constituency" },
    { key: "voters", label: "Registered voters, 2022", numeric: true },
    ...layers.map((l) => ({ key: l, label: LAYERS[l].name })),
  ];
}

const FOOTPRINT_LABEL: Record<string, string> = { Held: "Held office", Pool: "The pool: never held office", "—": "Never held office, outside the pool" };

export const FIG_COVER_MAP: FigureSpec = {
  id: "fig-cover-map",
  section: "Cover",
  title: `Half the register, ${fmt("pool.share")}%, lives where he has never held office`,
  question: "Where does the electorate sit, and where has he held office?",
  takeaway: `The ${fmt("pool")}-voter pool in Mwingi and Kitui South is the ground the nomination is won or lost on; Kitui Central, which he has represented since 2013, is ${fmt("con.kitui-central.share")}% of the register.`,
  sources: [src("register.2022"), { name: "Parliament of Kenya record", tier: "T1" }, { name: "The pool: a sum of the four constituencies, derived", tier: "T1", state: "modelled" }],
  chart: {
    type: "composite",
    parts: [
      { heading: "Where he has held office, ward by ward", chart: { type: "tilemap", layers: ["footprint"], initial: "footprint", showWardList: false } },
      {
        heading: "Four figures",
        chart: {
          type: "stats",
          items: [
            { value: fmt("register.2026"), label: "registered voters, July 2026", state: "sourced", countTo: F("register.2026").value ?? undefined },
            { value: `≈${fmt("benchmark")}–${fmt("benchmark.2026-equivalent.rounded")}`, label: "votes to win: the 2022 winner's share, carried to the 2026 register", state: "modelled" },
            { value: `${fmt("pool.share")}%`, label: "of the register in Mwingi and Kitui South, where he has never held office", state: "modelled" },
            { value: "Both", label: "Wiper rivals for the ticket have already won a countywide election", state: "sourced" },
          ],
        },
      },
    ],
  },
  columns: tileColumns(["footprint"]),
  rows: tileRows(["footprint"]).map((r) => ({ ...r, cells: { ...r.cells, footprint: FOOTPRINT_LABEL[String(r.cells.footprint)] ?? r.cells.footprint } })),
};

export const SPINE_STEPS = [
  { label: "1 Objectives", href: "/objectives" },
  { label: "2 Data", href: "/data" },
  { label: "3 Analysis", href: "/analysis" },
  { label: "4 Strategy", href: "/strategy" },
  { label: "5 Implementation", href: "/implementation" },
];

export const FIG_COVER_SPINE: FigureSpec = {
  id: "fig-cover-spine",
  section: "Cover",
  title: "The argument runs in five steps, from what the campaign must achieve to who does the work",
  question: "What is the shape of the argument?",
  takeaway: "Each section answers the one before it; Section 6 is the decision the five lead to, not a sixth step.",
  sources: [{ name: "This proposal's structure", tier: null, state: "target" }],
  chart: { type: "spine", steps: SPINE_STEPS },
  columns: [{ key: "step", label: "Step" }, { key: "job", label: "What the section does" }],
  rows: [
    { cells: { step: "1 Objectives", job: "What the campaign must achieve, and by when" } },
    { cells: { step: "2 Data", job: "What the official record shows, graded by source" } },
    { cells: { step: "3 Analysis", job: "What the data implies for the race" } },
    { cells: { step: "4 Strategy", job: "What to do about it, each strategy tied to a finding" } },
    { cells: { step: "5 Implementation", job: "Who does the work, how it is measured and governed" } },
    { cells: { step: "6 Next steps", job: "The decision, and what the campaign provides" } },
  ],
};

export const S0: FigureSpec[] = [FIG_COVER_MAP, FIG_COVER_SPINE];
