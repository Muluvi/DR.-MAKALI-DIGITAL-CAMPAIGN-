/**
 * Section 2, The Data: the figure register's nine records of what the official sources show.
 */
import register from "../../../data/ward-register.json" with { type: "json" };
import type { FigureSpec } from "../types.ts";
import { bar, byValue, F, fmt, num, src, stateOf } from "./_util.ts";

const CONS = register.constituencies as { id: string; name: string }[];

/* ------------------------------------------------------------------ fig-2-1-register (pilot) */

const W22 = "IEBC ward register, 2022 (T1)";
const ECVR = "IEBC ECVR county annex, July 2026 (T1)";

const conBars = byValue(CONS.map((c) => bar(`con.${c.id}`, c.name)));

export const FIG_2_1: FigureSpec = {
  id: "fig-2-1-register",
  section: "2.1",
  title: `The register grew by ${fmt("register.2026.growth")} voters since 2022, most of them in one thirty-day drive`,
  question: "How big is the register, and how did it get there?",
  takeaway: `Kitui has ${fmt("register.2026")} registered voters as of July 2026; the 2022 split by constituency is the latest published, because the 2026 register is not yet out by ward.`,
  sources: [src("register.2022"), src("register.2026"), { name: "Continuous registration: the growth less the drive, derived", tier: F("register.2026.continuous").tier, state: "modelled" }],
  chart: {
    type: "composite",
    parts: [
      {
        heading: "From 2022 to July 2026: the running total",
        chart: {
          type: "waterfall",
          steps: [
            { label: "Registered, 2022", value: num("register.2022"), kind: "start", state: stateOf("register.2022") },
            { label: "ECVR drive, to 28 April 2026", value: num("register.2026.ecvr-drive"), kind: "delta", state: stateOf("register.2026.ecvr-drive") },
            { label: "Continuous registration outside the drive", value: num("register.2026.continuous"), kind: "delta", state: stateOf("register.2026.continuous") },
            { label: "Registered, July 2026", value: num("register.2026"), kind: "total", state: stateOf("register.2026") },
          ],
        },
      },
      {
        heading: "By constituency, 2022 register",
        chart: { type: "bars", bars: conBars, unit: "" },
      },
      {
        heading: "By constituency, July 2026 register",
        chart: { type: "bars", bars: [bar("register.2026.by-ward", "Not yet published by constituency or ward", { note: "Closes with the IEBC ECVR ward annex." })] },
      },
    ],
  },
  notes: [
    `The 2022 figure counts ward-registered voters; ${fmt("register.2022.prisons")} prison-registered voters bring it to ${fmt("register.2022.with-prisons")}. Continuous registration is derived as the difference, so it absorbs them.`,
  ],
  columns: [
    { key: "item", label: "Item" },
    { key: "voters", label: "Registered voters", numeric: true },
    { key: "source", label: "Source" },
  ],
  rows: [
    { cells: { item: "Registered, 2022 (ward-registered)", voters: num("register.2022"), source: W22 } },
    { cells: { item: "ECVR drive, to 28 April 2026", voters: num("register.2026.ecvr-drive"), source: ECVR } },
    { cells: { item: "Continuous registration outside the drive", voters: num("register.2026.continuous"), source: "Derived: July 2026 less 2022 less the drive" }, state: "modelled" },
    { cells: { item: "Registered, July 2026", voters: num("register.2026"), source: ECVR } },
    ...conBars.map((b) => ({ cells: { item: `${b.label}, 2022`, voters: b.value, source: W22 } })),
    { cells: { item: "By constituency or ward, July 2026", voters: null, source: "—" }, state: "needed" as const, closesWith: F("register.2026.by-ward").closesWith },
  ],
};

export const S2: FigureSpec[] = [FIG_2_1];
