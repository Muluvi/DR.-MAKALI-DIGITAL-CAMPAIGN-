"use client";

import React from "react";

import { Bars } from "../Bars";
import { Figure } from "../Figure";
import { SERIES, STATUS } from "../chart-tokens";
import { useChartMode } from "../useChartMode";

/**
 * The four routes, against the line they have to clear.
 *
 * One measure — registered voters in the combination — so one colour for every bar, with a
 * single exception: the home belt is the one that cannot reach the threshold, and that is a
 * state rather than an identity, so it wears the critical status colour and carries a direct
 * label saying why. Emphasis, not a second series.
 *
 * The threshold rule is what makes this a figure rather than four numbers: three bars cross
 * it, one stops short, and the reader sees the argument before reading a word of it.
 */
export function PathRace() {
  const mode = useChartMode();
  const c = SERIES[mode];
  const s = STATUS[mode];

  const data = [
    {
      label: "Path B — central, south and west",
      sub: "Kitui Central + Kitui South + Kitui West · 15 wards",
      value: 212183,
      color: c[0],
      detail:
        "Clears the threshold by 14,179 on the register. Home base plus the largest southern constituency and the peri-urban west.",
    },
    {
      label: "Path C — the twelve megawards",
      sub: "Top 12 wards across 6 constituencies",
      value: 201267,
      color: c[0],
      detail:
        "37.78% of the county register in 30% of the wards. The campaign need not contest all forty at equal intensity.",
    },
    {
      label: "Path A — the Mwingi triad",
      sub: "Mwingi Central + North + West · 15 wards",
      value: 200198,
      color: c[0],
      tip: "Necessary, not sufficient — 62% turnout yields ~124,100 ballots",
      detail:
        "The largest single reservoir in the county, and 2,194 above the 2022 winning total on the register. Turnout is the catch.",
    },
    {
      label: "Path D — the home belt",
      sub: "Kitui Central + Kitui West + Kitui Rural · 13 wards",
      value: 191811,
      color: s.critical,
      tip: "Cannot reach the threshold — 8,189 short before a vote is cast",
      detail:
        "At 62% turnout this produces 118,923 ballots. Eighty per cent of all of them still finishes more than 100,000 votes behind.",
    },
  ];

  return (
    <Figure
      kicker="Four routes to two hundred thousand"
      title="Three combinations clear it. The instinctive one cannot."
      standfirst="Registered voters in each combination, against the ~200,000 threshold. Registration is not turnout — even the paths that clear on the register still have to convert."
      source="IEBC certified register, 2022 · constituency and ward totals · Tier 1, official"
      table={{
        head: ["Path", "Registered voters", "% of county", "Wards", "Against 200,000"],
        rows: [
          ["B — central, south and west", "212,183", "39.83%", 15, "+12,183"],
          ["C — the twelve megawards", "201,267", "37.78%", 12, "+1,267"],
          ["A — the Mwingi triad", "200,198", "37.58%", 15, "+198"],
          ["D — the home belt", "191,811", "36.00%", 13, "−8,189"],
        ],
      }}
    >
      <Bars data={data} max={230000} threshold={200000} thresholdLabel="~200,000 to win" />
    </Figure>
  );
}
