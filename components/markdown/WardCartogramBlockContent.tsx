"use client";

import { LazyMount } from "../LazyMount";
import { ProvenanceLine } from "./ProvenanceLine";
import { IEBC_WARD_REGISTER } from "../../data/sources";
import type { Provenance } from "../../data/types";
import WardCartogram from "../charts/WardCartogram";

const PROVENANCE: Provenance = { source: IEBC_WARD_REGISTER, granularity: "ward" };

export function WardCartogramBlockContent() {
  return (
    <div className="bg-card border border-line rounded-2xl p-4 sm:p-5 shadow-sm my-6 print-avoid-break">
      <div className="flex items-center gap-2 mb-1">
        <span className="w-1.5 h-6 bg-accent rounded-full shrink-0" />
        <h4 className="font-serif text-sm font-bold text-ink">Ward Register — Table Cartogram</h4>
      </div>
      <p className="text-[11px] text-muted mb-3 leading-relaxed pl-3.5">
        One tile per ward, clustered by constituency. No ward-boundary map exists in this repository, so this grid —
        not a geographic map — is the cartogram. All 40 wards are itemised (Phase 2 of the provenance system replaced
        the previous 13-of-40 partial register).
      </p>
      <div className="min-h-[420px]">
        <LazyMount minHeight={420}>
          <WardCartogram />
        </LazyMount>
      </div>
      <ProvenanceLine provenance={PROVENANCE} />
    </div>
  );
}
