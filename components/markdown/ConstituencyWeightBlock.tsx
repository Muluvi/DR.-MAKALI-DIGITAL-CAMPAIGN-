"use client";

import dynamic from "next/dynamic";

// See WardCartogramBlock.tsx for the two-file dynamic-shim pattern this follows.
const ConstituencyWeightBlockContent = dynamic(
  () => import("./ConstituencyWeightBlockContent").then((m) => m.ConstituencyWeightBlockContent),
  { ssr: false, loading: () => <div className="min-h-[380px] bg-card border border-line rounded-2xl my-6" /> }
);

export function ConstituencyWeightBlock() {
  return <ConstituencyWeightBlockContent />;
}
