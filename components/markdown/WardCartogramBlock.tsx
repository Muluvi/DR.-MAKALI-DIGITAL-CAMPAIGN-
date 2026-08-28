"use client";

import dynamic from "next/dynamic";
import { LazyMount } from "../LazyMount";
import { SourceLine } from "./SourceLine";

const WardCartogram = dynamic(() => import("../charts/WardCartogram"), { ssr: false });

export function WardCartogramBlock() {
  return (
    <div className="bg-card border border-line rounded-2xl p-4 sm:p-5 shadow-sm my-6 print-avoid-break">
      <div className="flex items-center gap-2 mb-1">
        <span className="w-1.5 h-6 bg-accent rounded-full shrink-0" />
        <h4 className="font-serif text-sm font-bold text-ink">Ward Register — Grid Cartogram</h4>
      </div>
      <p className="text-[11px] text-muted mb-3 leading-relaxed pl-3.5">
        One tile per ward, clustered by constituency. No ward-boundary map exists in this repository, so this grid —
        not a geographic map — is the cartogram.
      </p>
      <div className="min-h-[420px]">
        <LazyMount minHeight={420}>
          <WardCartogram />
        </LazyMount>
      </div>
      <SourceLine sources={["IEBC"]} />
    </div>
  );
}
