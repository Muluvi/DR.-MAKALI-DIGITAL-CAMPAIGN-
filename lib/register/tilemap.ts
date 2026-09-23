/**
 * The tile map's six layers, as data (brief §E.7). One map, learned once, re-read six times.
 *
 * Each layer gives every tile a fill (a CSS custom property, so light and dark swap cleanly), a
 * short label, and whether it is hatched (modelled) or dashed (needed). The legend and a one-line
 * description go with it. Values come from lib/data/figures.ts and the ward register.
 */
import { FIGURES } from "../data/figures.ts";
import { formatFigure } from "../data/format.ts";
import { WARD_TILES, type WardTile } from "../geo/wards.ts";
import type { TileLayerId } from "./types.ts";

export interface TileStyle {
  fill: string;
  /** Text colour on this fill. */
  ink: string;
  label: string;
  hatch?: boolean;
  dashed?: boolean;
}

export interface TileLayer {
  id: TileLayerId;
  name: string;
  description: string;
  source: string;
  tier: "T1" | "T2" | "T3" | null;
  state: "sourced" | "modelled" | "needed" | "target";
  legend: { label: string; fill: string; hatch?: boolean; dashed?: boolean }[];
  style: (t: WardTile) => TileStyle;
}

const k = (n: number) => `${(n / 1000).toFixed(1)}k`;
const INK = "var(--ink)";

// Register size: five ordinal steps. The breaks are binning, not data: they split the 40 wards
// into bands a reader can compare at a glance, and every tile prints its own value regardless.
const BREAKS = [9_000, 11_000, 13_000, 15_500];
const bin = (v: number) => 1 + BREAKS.filter((b) => v >= b).length;
const seqInk = (s: number) => (s >= 3 ? "var(--seq-ink-dark)" : "var(--seq-ink-light)");

const POOL = new Set(["mwingi-north", "mwingi-west", "mwingi-central", "kitui-south"]);
const NO_WIPER_MP: Record<string, string> = { "kitui-east": "UDA MP", "kitui-south": "Jubilee MP" };
const ZONE_FILL = { anchor: "var(--zone-a)", mwingi: "var(--zone-b)", arid: "var(--zone-c)" } as const;
const ZONE_NAME = { anchor: "Urban and central anchor", mwingi: "Northern block (Mwingi)", arid: "Arid and resource belt", none: "In no zone" };

const EFFORT: Record<string, number> = {
  anchor: FIGURES["effort.p-1.anchor"].value ?? 0,
  mwingi: FIGURES["effort.p-1.mwingi"].value ?? 0,
  arid: FIGURES["effort.p-1.arid"].value ?? 0,
};
const effortStep = (v: number) => (v >= 35 ? 5 : v >= 30 ? 4 : v >= 25 ? 3 : 2);

export const LAYERS: Record<TileLayerId, TileLayer> = {
  register: {
    id: "register",
    name: "Register size",
    description: `Registered voters per ward, 2022. ${formatFigure(FIGURES["register.2022"])} in all; the 2026 register is not yet published by ward.`,
    source: "IEBC, Registered Voters per County Assembly Ward (2022)",
    tier: "T1",
    state: "sourced",
    legend: [
      { label: "under 9,000", fill: "var(--seq-1)" },
      { label: "9,000–10,999", fill: "var(--seq-2)" },
      { label: "11,000–12,999", fill: "var(--seq-3)" },
      { label: "13,000–15,499", fill: "var(--seq-4)" },
      { label: "15,500 and over", fill: "var(--seq-5)" },
    ],
    style: (t) => {
      const s = bin(t.voters);
      return { fill: `var(--seq-${s})`, ink: seqInk(s), label: k(t.voters) };
    },
  },
  footprint: {
    id: "footprint",
    name: "Where he has held office",
    description: `Kitui Central is the constituency he has represented since 2013. The pool, ${formatFigure(FIGURES["pool"])} voters and ${formatFigure(FIGURES["pool.share"])}% of the register, is Mwingi North, West, Central and Kitui South. Structural, derived from where he has held office, not from a survey.`,
    source: "Parliament of Kenya record; IEBC ward register (2022)",
    tier: "T1",
    state: "sourced",
    legend: [
      { label: "Held office: Kitui Central", fill: "var(--accent-solid)" },
      { label: "Never held office: the pool", fill: "var(--neutral-strong)", hatch: true },
      { label: "Never held office, outside the pool", fill: "var(--neutral-fill)" },
    ],
    style: (t) =>
      t.constituency === "kitui-central"
        ? { fill: "var(--accent-solid)", ink: "var(--on-accent)", label: "Held" }
        : POOL.has(t.constituency)
          ? { fill: "var(--neutral-strong)", ink: "var(--card)", label: "Pool", hatch: true }
          : { fill: "var(--neutral-fill)", ink: INK, label: "—" },
  },
  "party-flow": {
    id: "party-flow",
    name: "Where party loyalty won't carry him",
    description: `Kitui East returned a UDA MP and Kitui South a Jubilee MP in 2022: ${formatFigure(FIGURES["east-south"])} voters, ${formatFigure(FIGURES["east-south.share"])}% of the register. Kitui Central has its own MP succession contest. The other constituencies are not assessed here.`,
    source: "Constituency records, 2022 (single-source)",
    tier: "T3",
    state: "sourced",
    legend: [
      { label: "No Wiper MP (2022)", fill: "var(--div-neg)", hatch: true },
      { label: "Home seat in its own contest", fill: "var(--accent-solid)" },
      { label: "Not assessed", fill: "var(--neutral-fill)" },
    ],
    style: (t) =>
      NO_WIPER_MP[t.constituency]
        ? { fill: "var(--div-neg)", ink: "#ffffff", label: NO_WIPER_MP[t.constituency].split(" ")[0], hatch: true }
        : t.constituency === "kitui-central"
          ? { fill: "var(--accent-solid)", ink: "var(--on-accent)", label: "Own race" }
          : { fill: "var(--neutral-fill)", ink: INK, label: "" },
  },
  zones: {
    id: "zones",
    name: "The three regions",
    description: `The three zones cover ${formatFigure(FIGURES["zones.share"])}% of residents. Kitui Rural falls in none of them, and needs adding to a zone or a stated reason it is out.`,
    source: "KNBS 2019 Census, by sub-county; this proposal's zoning",
    tier: "T1",
    state: "sourced",
    legend: [
      { label: ZONE_NAME.anchor, fill: ZONE_FILL.anchor },
      { label: ZONE_NAME.mwingi, fill: ZONE_FILL.mwingi },
      { label: ZONE_NAME.arid, fill: ZONE_FILL.arid },
      { label: "Kitui Rural: in no zone", fill: "transparent", dashed: true },
    ],
    style: (t) =>
      t.zone === "none"
        ? { fill: "transparent", ink: "var(--muted)", label: "none", dashed: true }
        : { fill: ZONE_FILL[t.zone], ink: "#ffffff", label: t.zone === "anchor" ? "A" : t.zone === "mwingi" ? "N" : "S" },
  },
  effort: {
    id: "effort",
    name: "Where the effort goes in Phase −1",
    description: "Share of Phase −1 communications effort by zone: Firefly's weighting, not a measurement. The remainder rotates across wards as testing effort, and Kitui Rural is covered only by it.",
    source: "This proposal, Section 4.2",
    tier: null,
    state: "target",
    legend: [
      { label: `${EFFORT.mwingi}% Mwingi`, fill: `var(--seq-${effortStep(EFFORT.mwingi)})`, hatch: true },
      { label: `${EFFORT.arid}% arid belt`, fill: `var(--seq-${effortStep(EFFORT.arid)})`, hatch: true },
      { label: `${EFFORT.anchor}% anchor`, fill: `var(--seq-${effortStep(EFFORT.anchor)})`, hatch: true },
      { label: "Rotating only", fill: "transparent", dashed: true },
    ],
    style: (t) => {
      if (t.zone === "none") return { fill: "transparent", ink: "var(--muted)", label: "rot.", dashed: true };
      const v = EFFORT[t.zone];
      const s = effortStep(v);
      return { fill: `var(--seq-${s})`, ink: seqInk(s), label: `${v}%`, hatch: true };
    },
  },
  "reach-targets": {
    id: "reach-targets",
    name: "Reach share, against target",
    description: "Reach share by ward, from his Meta Insights export, against the pool's own share of the register. Every tile is empty until the Week 1 export lands.",
    source: "[DATA NEEDED — Meta Insights export, Week 1]",
    tier: null,
    state: "needed",
    legend: [{ label: "Data needed: Week 1 export", fill: "transparent", dashed: true }],
    style: () => ({ fill: "transparent", ink: "var(--muted)", label: "—", dashed: true }),
  },
};

export const TILES = WARD_TILES;
