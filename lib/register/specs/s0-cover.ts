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
  sources: [src("register.2022"), src("register.2026"), { name: "Parliament of Kenya record", tier: "T1" }, { name: "The pool: a sum of the four constituencies, derived", tier: "T1", state: "modelled" }],
  chart: {
    type: "composite",
    parts: [
      { heading: "Where he has held office, ward by ward", chart: { type: "tilemap", layers: ["footprint"], initial: "footprint", showWardList: false } },
      {
        heading: "Four figures",
        chart: {
          type: "stats",
          items: [
            { value: fmt("register.2026"), label: "registered voters, July 2026 (reported)", state: "sourced", countTo: F("register.2026").value ?? undefined },
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

// The document's own table of contents, in the order the page runs: the evidence first, then
// the strategy it justifies, how it is delivered, how it is proven and protected, and the decision.
// Each step is a part, and each row's job is the question that part answers.
export const SPINE_STEPS = [
  { label: "Kitui today", href: "/kitui" },
  { label: "The contest", href: "/race" },
  { label: "The strategy", href: "/goal" },
  { label: "Delivery", href: "/engagement" },
  { label: "Proof", href: "/success" },
  { label: "The decision", href: "/receives" },
];

export const FIG_COVER_SPINE: FigureSpec = {
  id: "fig-cover-spine",
  section: "Cover",
  title: "The proposal runs evidence first: what Kitui is and needs, the contest, the strategy, how it is delivered, how it is proven and kept lawful, and the decision",
  question: "What is the shape of the argument?",
  takeaway: "Kitui today and The contest are the evidence; The strategy and Delivery are the plan built on it; Proof and protection shows how it is measured and kept safe; The decision closes with what Dr. Mulu is asked to decide. The reference shelf follows.",
  sources: [{ name: "This proposal's structure", tier: null, state: "target" }],
  chart: { type: "spine", steps: SPINE_STEPS },
  columns: [{ key: "step", label: "Part" }, { key: "job", label: "The question it answers" }],
  rows: [
    { cells: { step: "Kitui today", job: "Who lives here, and what do they need?" } },
    { cells: { step: "The contest", job: "Who is running, and where does Dr. Mulu stand?" } },
    { cells: { step: "The strategy", job: "What should the campaign do, and why?" } },
    { cells: { step: "How Firefly delivers", job: "Who does the work, when, and how?" } },
    { cells: { step: "Proof and protection", job: "How will we know it works, and how is it kept safe and lawful?" } },
    { cells: { step: "The decision", job: "What is Dr. Mulu being asked to decide?" } },
  ],
};

export const S0: FigureSpec[] = [FIG_COVER_MAP, FIG_COVER_SPINE];
