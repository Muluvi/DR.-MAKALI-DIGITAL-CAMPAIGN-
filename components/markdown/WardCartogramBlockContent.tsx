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
        <h4 className="font-serif text-sm font-bold text-ink">Ward Register — Table Cartogram & Dynamic Stream</h4>
      </div>
      <p className="t-small text-muted mb-3 leading-relaxed pl-3.5">
        One tile per ward, clustered by constituency. No ward-boundary map exists in this repository, so this grid —
        not a geographic map — is the cartogram. All 40 wards are itemised (Phase 2 of the provenance system replaced
        the previous 13-of-40 partial register).
      </p>

      {/*
        The register stream, mounted here and nowhere else.

        It used to appear three times inside one section — twice at §1.2.3, where this block and
        the path-to-200k block sit under the same heading, and again at §1.3.2, where
        InteractiveTable detected the 40-row register table and prepended another. Each mount
        renders the forty wards twice (a real list plus an aria-hidden clone the seamless loop
        needs), so a reader was being served 240 ward cards to read 40 facts.

        One mount now. The path-to-200k block keeps its own accessible table of all 40 wards,
        which is the right thing in that context, and §1.3.2's markdown table already IS the
        register. The presentational clone below remains: a marquee that loops without a visible
        seam needs two copies of the strip, and that copy is inert and hidden from assistive
        technology. It is the only duplication left.
      */}

      <div className="min-h-[420px]">
        <LazyMount minHeight={420}>
          <WardCartogram />
        </LazyMount>
      </div>
      <ProvenanceLine provenance={PROVENANCE} />
    </div>
  );
}
