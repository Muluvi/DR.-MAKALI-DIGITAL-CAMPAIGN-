"use client";

import dynamic from "next/dynamic";

import { ChartFallback } from "../ChartFallback";
import { LazyMount } from "../LazyMount";
import type { QuadrantPoint } from "../charts/CompetitiveQuadrantChart";
import { FigureBlock } from "./FigureBlock";

// Dynamic boundary: the charting runtime stays out of the first load. LazyMount below
// still gates when it mounts; this gates when it downloads.
const CompetitiveQuadrantChart = dynamic(() => import("../charts/CompetitiveQuadrantChart"), {
  ssr: false,
  loading: () => <ChartFallback />,
});

// Preference: Mizani Africa, 7 August 2026 (Section 1.1 / 2.2 table). Credibility: a
// qualitative reading of how the proposal itself characterises each candidate in Section 4.2 —
// not a survey figure. Only Mulu carries an explicit fiscal-credibility claim in the text
// ("deepest fiscal and M&E credentials in the field"); Kasalu's fiscal competence is named as
// an "exploitable gap" there, and Wambua's entry makes no claim either way.
const DATA: QuadrantPoint[] = [
  {
    name: "Dr. Irene Kasalu",
    preference: 37.4,
    credibility: 1.5,
    credibilityLabel: "Low–Medium (qualitative read)",
    note: "Leading on measured preference. Section 1.2.2 names fiscal competence as her exploitable gap, not her strength.",
    color: "#e31d2b",
  },
  {
    name: "Dr. Makali Mulu",
    preference: 22.1,
    credibility: 3,
    credibilityLabel: "High (qualitative read)",
    note: "Deepest fiscal and M&E credentials in the field per Section 1.2.2 — the proposal's central strategic bet.",
    color: "#0056a8",
  },
  {
    name: "Sen. Enoch Wambua",
    preference: 14.3,
    credibility: 2,
    credibilityLabel: "Medium (unstated — no claim either way)",
    note: "Section 1.2.2 cites steady party base as his strength; the text makes no fiscal-credibility claim about him.",
    color: "#8295a9",
  },
];

export function CompetitiveQuadrantBlock() {
  return (
    <FigureBlock
      title="Competitive Field: Preference vs. Fiscal Credibility"
      subtitle={
        <>
          Horizontal axis is measured survey data. Vertical axis is a qualitative editorial reading of Section 1.2.2&apos;s own
          candidate assessments, not a measured input — plotted only where the text itself makes a claim.
        </>
      }
      sources={["Mizani Africa"]}
    >
      <div className="h-72 w-full t-micro">
        <LazyMount minHeight={288} className="h-full">
          <CompetitiveQuadrantChart data={DATA} />
        </LazyMount>
      </div>
    </FigureBlock>
  );
}
