"use client";

import { useMemo, useState } from "react";
import { Coins, TrendingDown, ArrowRight, Info } from "lucide-react";
import { ClaimBadge } from "./ClaimBadge";
import { ProvenanceLine } from "./ProvenanceLine";
import { IEBC_GAZETTE_CEILING } from "../../data/sources";

// Every figure here is the campaign's own Section 16.1 channel allocation table
// (reach and budget, Tier 2/3 as sourced there) -- this component adds no new
// external figures, only the derived ratio (budget ÷ reach) and a modelled
// reallocation, both clearly labelled as campaign estimates, not observations.
interface Channel {
  id: string;
  label: string;
  reach: number;
  budget: number;
}

const CHANNELS: Channel[] = [
  { id: "sms", label: "Direct 2G Bulk SMS & USSD", reach: 320_000, budget: 2_850_000 },
  { id: "digital", label: "Digital Video & Ads (Meta, TikTok, X)", reach: 72_455, budget: 1_850_000 },
  { id: "radio", label: "Kikamba Vernacular Radio", reach: 420_000, budget: 10_800_000 },
  { id: "print", label: "Printed Collateral & Baraza Photobooks", reach: 220_000, budget: 6_200_000 },
  { id: "ground", label: "Groundgame Mobilizers & Polling Agents", reach: 450_000, budget: 21_500_000 },
  { id: "caravan", label: "Market Caravans, PA Trucks & Baraza Staging", reach: 280_000, budget: 14_500_000 },
];

const ranked = [...CHANNELS].sort((a, b) => a.budget / a.reach - b.budget / b.reach);
const cheapest = ranked[0];
const mostExpensive = ranked[ranked.length - 1];

const INCREMENTS = [2_000_000, 5_000_000, 10_000_000];

export function MarginalSpendModel() {
  const [increment, setIncrement] = useState<number>(5_000_000);

  const projections = useMemo(
    () =>
      ranked.map((c) => ({
        ...c,
        costPerReach: c.budget / c.reach,
        additionalReach: Math.round(increment / (c.budget / c.reach)),
      })),
    [increment]
  );

  const spreadEvenly = Math.round(
    CHANNELS.reduce((sum, c) => sum + (increment / CHANNELS.length) / (c.budget / c.reach), 0)
  );
  const bestSingle = projections[0].additionalReach;
  const upliftMultiple = (bestSingle / spreadEvenly).toFixed(1);

  return (
    <div className="my-8 bg-card border border-line rounded-2xl shadow-sm overflow-hidden not-prose">
      <div className="p-4 sm:p-5 border-b border-line bg-paper/50 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center shrink-0">
          <Coins size={20} />
        </div>
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-accent bg-accent/10 px-2 py-0.5 rounded">
              Marginal Spend Model
            </span>
            <ClaimBadge status="estimate" compact />
          </div>
          <h4 className="font-serif text-base sm:text-lg font-bold text-ink mt-0.5">
            Where does the next shilling reach the most voters?
          </h4>
        </div>
      </div>

      <div className="p-4 sm:p-6 space-y-5">
        <p className="text-xs text-muted leading-relaxed">
          Ranking the six paid channels in Section 16.1 by <strong className="text-ink">cost per voter reached</strong> (budget ÷ reach) reveals a five-and-a-half-fold spread the flat allocation table doesn&apos;t show on its own.
        </p>

        <div className="overflow-x-auto -mx-1 px-1">
          <table className="w-full text-xs border-collapse min-w-[420px]">
            <thead>
              <tr className="text-left text-[10px] uppercase tracking-wider text-muted border-b border-line">
                <th className="py-2 pr-2 font-black">Channel</th>
                <th className="py-2 pr-2 font-black text-right">Reach</th>
                <th className="py-2 pr-2 font-black text-right">Budget</th>
                <th className="py-2 font-black text-right">Ksh / voter reached</th>
              </tr>
            </thead>
            <tbody>
              {projections.map((c, i) => (
                <tr key={c.id} className={`border-b border-line/40 ${i === 0 ? "bg-emerald-500/5" : ""}`}>
                  <td className="py-2 pr-2 font-semibold text-ink">
                    {c.label}
                    {i === 0 && <span className="ml-1.5 text-[9px] font-black text-emerald-600 dark:text-emerald-400 uppercase">Cheapest</span>}
                    {i === ranked.length - 1 && <span className="ml-1.5 text-[9px] font-black text-rose-600 dark:text-rose-400 uppercase">Most expensive</span>}
                  </td>
                  <td className="py-2 pr-2 text-right font-mono text-muted">{c.reach.toLocaleString()}</td>
                  <td className="py-2 pr-2 text-right font-mono text-muted">Ksh {(c.budget / 1_000_000).toFixed(2)}M</td>
                  <td className="py-2 text-right font-mono font-bold text-ink">Ksh {c.costPerReach.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-3.5 rounded-xl bg-paper border border-line flex items-start gap-2.5">
          <TrendingDown size={15} className="text-accent shrink-0 mt-0.5" />
          <p className="text-[11px] text-muted leading-relaxed">
            <strong className="text-ink">{cheapest.label}</strong> reaches a voter for <strong className="text-ink">Ksh {(cheapest.budget / cheapest.reach).toFixed(1)}</strong> — about 1/{Math.round((mostExpensive.budget / mostExpensive.reach) / (cheapest.budget / cheapest.reach))}th the cost of <strong className="text-ink">{mostExpensive.label}</strong> (Ksh {(mostExpensive.budget / mostExpensive.reach).toFixed(1)}/voter). Reach is not the same as a vote — the ground channels buy persuasion and turnout that SMS alone can&apos;t, which is why this model informs the marginal shilling, not the whole budget.
          </p>
        </div>

        <div className="p-4 bg-paper rounded-2xl border border-line space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <label className="text-xs font-bold text-ink flex items-center gap-1.5">
              <ArrowRight size={14} className="text-accent" />
              <span>If an extra Ksh {(increment / 1_000_000).toFixed(0)}M opened up mid-campaign:</span>
            </label>
            <div className="flex gap-1.5">
              {INCREMENTS.map((v) => (
                <button
                  key={v}
                  onClick={() => setIncrement(v)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors cursor-pointer ${
                    increment === v ? "bg-accent text-white border-accent" : "bg-card border-line text-muted hover:text-ink"
                  }`}
                >
                  Ksh {(v / 1_000_000).toFixed(0)}M
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="p-3 bg-card border border-line rounded-xl">
              <div className="text-[10px] font-black uppercase tracking-wider text-muted">Spread evenly across all 6</div>
              <div className="font-serif text-xl font-bold text-ink mt-1">+{spreadEvenly.toLocaleString()} voters</div>
            </div>
            <div className="p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
              <div className="text-[10px] font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400">All into {cheapest.label}</div>
              <div className="font-serif text-xl font-bold text-ink mt-1">+{bestSingle.toLocaleString()} voters</div>
            </div>
          </div>
          <div className="text-[11px] text-muted font-semibold flex items-center gap-1.5">
            <Info size={12} className="shrink-0" />
            <span>Concentrating the marginal shilling in the cheapest channel reaches <strong className="text-ink">{upliftMultiple}×</strong> more voters than spreading it evenly — the case for a reallocation trigger, not a fixed split.</span>
          </div>
        </div>
        <ProvenanceLine
          provenance={{
            source: IEBC_GAZETTE_CEILING,
            granularity: "county",
            note: "Reach and budget figures from Section 16.1 (Section 9 cross-reference); cost-per-reach and the reallocation projection are this model's own derivation, not a sourced observation.",
          }}
        />
      </div>
    </div>
  );
}
