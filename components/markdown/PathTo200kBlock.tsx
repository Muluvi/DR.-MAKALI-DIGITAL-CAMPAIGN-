"use client";

import dynamic from "next/dynamic";

// See WardCartogramBlock.tsx for the two-file dynamic-shim pattern this follows.
const PathTo200kBlockContent = dynamic(
  () => import("./PathTo200kBlockContent").then((m) => m.PathTo200kBlockContent),
  { ssr: false, loading: () => <div className="min-h-[420px] bg-card border border-line rounded-2xl my-6" /> }
);

export function PathTo200kBlock() {
  return <PathTo200kBlockContent />;
}
