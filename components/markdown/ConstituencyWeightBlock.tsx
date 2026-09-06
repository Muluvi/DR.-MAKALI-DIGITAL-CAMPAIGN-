"use client";

import dynamic from "next/dynamic";

import { ChartFallback } from "../ChartFallback";

/**
 * Dynamic boundary. ConstituencyWeightBlockContent pulls the charting runtime; keeping it behind next/dynamic keeps
 * that out of the first load, which matters most on the mid-range Android and the folded
 * Galaxy Fold where this document is longest and the CPU slowest.
 */
const ConstituencyWeightBlockContent = dynamic(
  () => import("./ConstituencyWeightBlockContent").then((m) => m.ConstituencyWeightBlockContent),
  { ssr: false, loading: () => <ChartFallback /> },
);

export function ConstituencyWeightBlock() {
  return <ConstituencyWeightBlockContent />;
}
