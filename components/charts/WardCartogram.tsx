"use client";

import { useState } from "react";
import { CONSTITUENCIES, type Ward } from "../../data/ward-register";

const MAX_VOTERS = Math.max(...CONSTITUENCIES.flatMap((c) => c.wards.map((w) => w.voters)));

function tileBackground(voters: number): string {
  const intensity = 0.18 + 0.72 * (voters / MAX_VOTERS);
  return `color-mix(in srgb, var(--color-accent) ${Math.round(intensity * 100)}%, var(--color-card))`;
}

interface Selected {
  constituency: string;
  ward: Ward;
}

export default function WardCartogram() {
  const [selected, setSelected] = useState<Selected | null>(null);

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        {CONSTITUENCIES.map((c) => (
          <div key={c.id} className="bg-paper border border-line/60 rounded-xl p-2.5">
            <div className="t-micro font-black text-muted mb-1.5 truncate" title={c.name}>
              {c.name}
            </div>
            {/* The forty tiles fill in ward order rather than all at once, which is the
                cartogram equivalent of a map's regions filling one by one. The delay carries
                the reading order, so a reader watching it sees the constituency assemble.
                Under reduced motion `.fx-region` is `animation: none` — every tile is present
                and at its true colour from the first frame, because a half-drawn register is
                a register showing the wrong number of wards. */}
            <div className="flex flex-wrap gap-1">
              {c.wards.map((w, wIdx) => {
                const isSelected = selected?.constituency === c.id && selected.ward.name === w.name;
                return (
                  <button
                    key={w.name}
                    type="button"
                    onClick={() => setSelected({ constituency: c.id, ward: w })}
                    aria-label={`${w.name}, ${c.name}: ${w.voters.toLocaleString()} registered voters`}
                    style={{ background: tileBackground(w.voters), "--fx-r": wIdx } as React.CSSProperties}
                    className={`fx-region w-6 h-6 sm:w-7 sm:h-7 rounded-[5px] border border-line/40 transition-all cursor-pointer ${
 isSelected ? "ring-2 ring-accent ring-offset-1 ring-offset-paper" : "hover:scale-110 hover:z-10 hover:shadow-md"
                    }`}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4 mb-4 t-micro font-bold text-muted flex-wrap">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm border border-line/40" style={{ background: tileBackground(MAX_VOTERS) }} />
          Higher registered voters
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm border border-line/40" style={{ background: tileBackground(1) }} />
          Lower
        </span>
        <span>All 40 wards itemised — IEBC, 2022 register</span>
      </div>

      <div className="bg-paper border border-line rounded-xl p-3.5 min-h-[64px]">
        {selected ? (
          <div>
            <div className="t-micro font-black text-accent">
              {CONSTITUENCIES.find((c) => c.id === selected.constituency)?.name}
            </div>
            <div className="font-serif text-sm font-black text-ink mt-0.5">{selected.ward.name}</div>
            <div className="t-label font-bold text-ink/80 mt-1">{selected.ward.voters.toLocaleString()} registered voters (2022)</div>
          </div>
        ) : (
          <div className="t-label text-muted italic">Tap a ward tile to see its detail.</div>
        )}
      </div>
    </div>
  );
}
