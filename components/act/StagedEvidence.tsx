"use client";

import dynamic from "next/dynamic";
import { Database } from "lucide-react";

import { ChartFallback } from "../ChartFallback";
import { ALL_WARDS, CONSTITUENCIES } from "../../data/ward-register";
import type { PathPoint } from "../charts/PathTo200kChart";

/**
 * Evidence, staged for the act rather than framed for the document.
 *
 * The document wraps each chart in a card: a rounded border, an icon rule, a bold title, and a
 * paragraph explaining what the chart is. That framing is right in a report, where a block has to
 * announce itself between two walls of prose. On a pinned stage it is duplication — the stage
 * already carries the kicker and the claim, so the card's title says the same thing twice inside
 * one viewport, and the border draws a box around something that is meant to fill the screen.
 *
 * So the act mounts the charts themselves and supplies its own caption furniture. The document's
 * blocks are untouched and still render at their own routes.
 *
 * One substantive difference, not a cosmetic one: the document's path-to-200k block states that
 * "the threshold is reachable from that bloc on its own". Read against turnout that is wrong —
 * 200,198 registered voters in Mwingi produce roughly 124,100 ballots at the county's 62%
 * baseline, which is about 74,000 short. The act does not carry the claim forward.
 */

const WIN_THRESHOLD = 200_000;

const CONSTITUENCY_COLORS: Record<string, string> = {
  "kitui-central": "#0056a8",
  "kitui-south": "#e31d2b",
  "mwingi-central": "#0891b2",
  "mwingi-north": "#22d3ee",
  "kitui-east": "#b45309",
  "kitui-west": "#15803d",
  "mwingi-west": "#6d28d9",
  "kitui-rural": "#8295a9",
};

// Derived from the same ward register the document uses — the source of truth is data/, not a
// transcribed copy, so these bars cannot drift from the figures in the prose.
const SORTED = [...ALL_WARDS].sort((a, b) => b.voters - a.voters);
let running = 0;
const CHART_DATA: PathPoint[] = SORTED.map((w, i) => {
  running += w.voters;
  return {
    rank: i + 1,
    ward: w.name,
    constituencyName: w.constituencyName,
    voters: w.voters,
    cumulative: running,
    color: CONSTITUENCY_COLORS[w.constituencyId] ?? "#8295a9",
  };
});

const WardCartogram = dynamic(() => import("../charts/WardCartogram"), {
  ssr: false,
  loading: () => <ChartFallback />,
});

const PathTo200kChart = dynamic(() => import("../charts/PathTo200kChart"), {
  ssr: false,
  loading: () => <ChartFallback />,
});

/** The act's provenance line: the same discipline, in the act's own type. */
function StageSource({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="mt-5 flex items-center gap-2 font-sans text-[0.6875rem] font-semibold tracking-wide"
      style={{ color: "var(--act-dim)" }}
    >
      <Database size={11} aria-hidden="true" className="shrink-0 opacity-70" />
      {children}
    </p>
  );
}

export function StagedCartogram() {
  return (
    <div>
      <WardCartogram />
      <StageSource>IEBC — registered voters per county assembly ward, 2022. All 40 wards.</StageSource>
    </div>
  );
}

export function StagedPaths() {
  return (
    <div>
      <div className="flex flex-wrap gap-x-4 gap-y-1.5 mb-5">
        {CONSTITUENCIES.map((c) => (
          <span
            key={c.id}
            className="flex items-center gap-1.5 font-sans text-[0.625rem] font-bold uppercase tracking-[0.08em]"
            style={{ color: "var(--act-dim)" }}
          >
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: CONSTITUENCY_COLORS[c.id] }}
            />
            {c.name}
          </span>
        ))}
      </div>

      <div className="h-[22rem] w-full">
        <PathTo200kChart data={CHART_DATA} threshold={WIN_THRESHOLD} />
      </div>

      <StageSource>
        All 40 wards ranked by register, with the cumulative total against the ~200,000 threshold.
        IEBC, 2022.
      </StageSource>
    </div>
  );
}
