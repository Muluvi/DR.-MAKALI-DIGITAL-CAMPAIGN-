"use client";

import dynamic from "next/dynamic";

// The entire panel — provenance metadata, table markup and the chart's own dynamic import —
// lives in WardCartogramBlockContent, loaded as a separate async chunk via this thin shim, so
// none of it counts toward the route's initial JS. Every Phase 5/6 chart Block follows the same
// two-file split: "<Name>Block.tsx" is a dynamic-loader shim; "<Name>BlockContent.tsx" holds the
// actual content and data imports.
const WardCartogramBlockContent = dynamic(
  () => import("./WardCartogramBlockContent").then((m) => m.WardCartogramBlockContent),
  { ssr: false, loading: () => <div className="min-h-[420px] bg-card border border-line rounded-2xl my-6" /> }
);

export function WardCartogramBlock() {
  return <WardCartogramBlockContent />;
}
