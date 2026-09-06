"use client";

import dynamic from "next/dynamic";

import { ChartFallback } from "../ChartFallback";

// Dynamic boundary — see ChartFallback for why the height is reserved.
const ComplianceCeilingPanelContent = dynamic(
  () => import("./ComplianceCeilingPanelContent").then((m) => m.ComplianceCeilingPanelContent),
  { ssr: false, loading: () => <ChartFallback /> },
);

export function ComplianceCeilingPanel() {
  return <ComplianceCeilingPanelContent />;
}
