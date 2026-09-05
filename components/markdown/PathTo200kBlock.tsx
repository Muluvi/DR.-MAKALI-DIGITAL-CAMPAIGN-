"use client";

import dynamic from "next/dynamic";

import { ChartFallback } from "../ChartFallback";

/**
 * Dynamic boundary. PathTo200kBlockContent pulls the charting runtime; keeping it behind next/dynamic keeps
 * that out of the first load, which matters most on the mid-range Android and the folded
 * Galaxy Fold where this document is longest and the CPU slowest.
 */
const PathTo200kBlockContent = dynamic(
  () => import("./PathTo200kBlockContent").then((m) => m.PathTo200kBlockContent),
  { ssr: false, loading: () => <ChartFallback /> },
);

export function PathTo200kBlock() {
  return <PathTo200kBlockContent />;
}
