"use client";

import dynamic from "next/dynamic";

// See WardCartogramBlock.tsx for why this file is a thin shim: the panel's data imports, table
// markup and chart live in MediaOwnershipBlockContent, fetched as a separate chunk.
const MediaOwnershipBlockContent = dynamic(
  () => import("./MediaOwnershipBlockContent").then((m) => m.MediaOwnershipBlockContent),
  { ssr: false, loading: () => <div className="min-h-[420px] bg-card border border-line rounded-2xl my-6" /> }
);

export function MediaOwnershipBlock() {
  return <MediaOwnershipBlockContent />;
}
