"use client";

import { GitBranch } from "lucide-react";
import { motion } from "motion/react";
import { ProvenanceLine } from "./ProvenanceLine";
import { IEBC_GAZETTE_CEILING } from "../../data/sources";

// A relational/flow view of the same Section 16.1 numbers the marginal-spend model uses,
// answering a different question: not "where does a shilling go furthest" but "where does
// the whole budget actually flow, tier by tier". Built as a vertical stacked flow rather than
// a literal (horizontal) Sankey — a left-to-right Sankey has no good reading order at 380px.
const CEILING = 97_560_000;
const PLANNED = 64_500_000;

const CHANNELS = [
  { label: "Groundgame Mobilizers & Polling Agents", amount: 21_500_000, color: "var(--color-accent)" },
  { label: "Market Caravans, PA Trucks & Baraza Staging", amount: 14_500_000, color: "var(--color-gold)" },
  { label: "Kikamba Vernacular Radio", amount: 10_800_000, color: "var(--color-accent)" },
  { label: "Tech Stack, Legal, DPA & Contingency", amount: 6_800_000, color: "var(--color-gold)" },
  { label: "Printed Collateral & Baraza Photobooks", amount: 6_200_000, color: "var(--color-accent)" },
  { label: "Direct 2G Bulk SMS & USSD Portal", amount: 2_850_000, color: "var(--color-gold)" },
  { label: "Digital Video & Ads (Meta, TikTok, X)", amount: 1_850_000, color: "var(--color-accent)" },
];

function fmt(n: number) {
  return `Ksh ${(n / 1_000_000).toFixed(2)}M`;
}

export function BudgetFlowDiagram() {
  const plannedPct = (PLANNED / CEILING) * 100;

  return (
    <div className="my-8 bg-card border border-line rounded-2xl shadow-sm overflow-hidden not-prose">
      <div className="p-4 sm:p-5 border-b border-line bg-paper/50 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center shrink-0">
          <GitBranch size={20} />
        </div>
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-accent bg-accent/10 px-2 py-0.5 rounded">
            Budget Flow
          </span>
          <h4 className="font-serif text-base sm:text-lg font-bold text-ink mt-0.5">
            Where the statutory ceiling actually goes
          </h4>
        </div>
      </div>

      <div className="p-4 sm:p-6 space-y-1">
        {/* Tier 1: statutory ceiling */}
        <div className="p-3 rounded-xl border-2 border-dashed border-line text-center">
          <div className="text-[10px] font-black uppercase tracking-wider text-muted">Statutory ceiling (IEBC Gazette 12251)</div>
          <div className="font-serif text-xl font-bold text-ink">{fmt(CEILING)}</div>
        </div>

        {/* connector */}
        <div className="flex justify-center py-1">
          <div className="w-0.5 h-5 bg-line" />
        </div>

        {/* Tier 2: planned spend, width-scaled to show headroom */}
        <div className="mx-auto" style={{ width: `${plannedPct}%`, minWidth: "70%" }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="p-3 rounded-xl border-2 border-accent bg-accent/5 text-center"
          >
            <div className="text-[10px] font-black uppercase tracking-wider text-accent">Planned spend ({plannedPct.toFixed(0)}% of ceiling)</div>
            <div className="font-serif text-xl font-bold text-ink">{fmt(PLANNED)}</div>
          </motion.div>
        </div>
        <div className="text-center text-[10px] text-muted font-semibold pt-1">
          {fmt(CEILING - PLANNED)} headroom held back — statutory safety margin
        </div>

        {/* connector fanning into channels */}
        <div className="flex justify-center py-1">
          <div className="w-0.5 h-5 bg-line" />
        </div>

        {/* Tier 3: channels, each bar's width proportional to its share of PLANNED */}
        <div className="space-y-1.5 pt-1">
          {CHANNELS.map((c, i) => {
            const pct = (c.amount / PLANNED) * 100;
            return (
              <div key={c.label} className="flex items-center gap-2">
                <div className="w-24 sm:w-40 shrink-0 text-right text-[10px] sm:text-[11px] font-semibold text-muted leading-tight truncate" title={c.label}>
                  {c.label}
                </div>
                <div className="flex-1 h-6 bg-paper border border-line rounded-md overflow-hidden relative">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.5, delay: i * 0.05, ease: "easeOut" }}
                    className="h-full rounded-md flex items-center justify-end pr-1.5"
                    style={{ backgroundColor: c.color, opacity: 0.85 }}
                  >
                    <span className="text-[9px] font-black text-white drop-shadow-sm whitespace-nowrap">{pct.toFixed(0)}%</span>
                  </motion.div>
                </div>
                <div className="w-16 sm:w-20 shrink-0 text-[10px] sm:text-[11px] font-mono font-bold text-ink text-right">{fmt(c.amount)}</div>
              </div>
            );
          })}
        </div>

        <ProvenanceLine
          provenance={{
            source: IEBC_GAZETTE_CEILING,
            granularity: "county",
            note: "Ceiling: Kenya Gazette Notice No. 12251, 7 August 2026. Planned spend and channel split: Section 16.1.",
          }}
        />
      </div>
    </div>
  );
}
