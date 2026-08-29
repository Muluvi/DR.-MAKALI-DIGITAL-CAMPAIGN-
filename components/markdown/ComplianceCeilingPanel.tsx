"use client";

import dynamic from "next/dynamic";

// See WardCartogramBlock.tsx for why this file is a thin shim: the panel's data imports, table
// markup and chart live in ComplianceCeilingPanelContent, fetched as a separate chunk.
const ComplianceCeilingPanelContent = dynamic(
  () => import("./ComplianceCeilingPanelContent").then((m) => m.ComplianceCeilingPanelContent),
  { ssr: false, loading: () => <div className="min-h-[420px] bg-card border border-line rounded-2xl my-6" /> }
);

export function ComplianceCeilingPanel() {
  return <ComplianceCeilingPanelContent />;
}
