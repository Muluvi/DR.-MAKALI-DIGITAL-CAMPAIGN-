"use client";

import React from "react";

import { Bars } from "../Bars";
import { Figure } from "../Figure";
import { SERIES, ENTITY } from "../chart-tokens";
import { useChartMode } from "../useChartMode";

/**
 * Where the nomination actually stands.
 *
 * The document states this inside a sentence — "Kasalu at 37.4%, Mulu at 22.1%" — which is
 * where a 15.3-point deficit goes to be skimmed past. It is the most consequential number in
 * the act and it gets a figure.
 *
 * Three bars, coloured by identity and never by rank: Mulu keeps slot 1 whether he leads or
 * trails. The gap is annotated rather than plotted, because a deficit is a relationship
 * between two bars and not a fourth bar.
 */
export function PollGap() {
  const mode = useChartMode();
  const c = SERIES[mode];

  const data = [
    {
      label: "Dr. Irene Kasalu",
      sub: "Woman Representative, Kitui County",
      value: 37.4,
      color: c[ENTITY.kasalu],
      detail:
        "Front-runner on measured preference. Won the 2022 Woman Representative race with 201,899 votes — above the gubernatorial winning total.",
    },
    {
      label: "Hon. Dr. Benson Makali Mulu",
      sub: "Member of Parliament, Kitui Central",
      value: 22.1,
      color: c[ENTITY.mulu],
      tip: "15.3 points behind the front-runner",
      detail:
        "Strongest fiscal and evaluation credentials in the field; weakest countywide visibility.",
    },
    {
      label: "Sen. Enoch Wambua",
      sub: "Senator, Kitui County",
      value: 14.3,
      color: c[ENTITY.wambua],
      tip: "Down from 16.3% in June 2026",
      detail:
        "Senior party standing and a loyal delegate base, on a contracting countywide trend.",
    },
  ];

  return (
    <Figure
      kicker="The nomination, as measured"
      title="A flat 15.3-point deficit"
      standfirst="Two survey rounds are not a trend. They are the starting position, and the campaign is behind in it."
      source="Mizani Africa countywide preference survey, 7 August 2026 · ±2.53% at 95% confidence · Tier 2, reported"
      table={{
        head: ["Candidate", "August 2026", "June 2026", "Change"],
        rows: [
          ["Dr. Irene Kasalu", "37.4%", "—", "—"],
          ["Hon. Dr. Benson Makali Mulu", "22.1%", "—", "—"],
          ["Sen. Enoch Wambua", "14.3%", "16.3%", "−2.0 pts"],
        ],
      }}
    >
      <Bars data={data} max={45} formatValue={(n) => `${n.toFixed(1)}%`} />
    </Figure>
  );
}
