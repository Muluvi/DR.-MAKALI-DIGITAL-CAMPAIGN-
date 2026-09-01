"use client";

import React, { useRef } from "react";
import { motion, useInView } from "motion/react";
import { Target, Users, Scale, Building2 } from "lucide-react";

import { ClaimBadge } from "./markdown/ClaimBadge";

/**
 * Section 20.2 — the nomination-window KPI scorecard, quoted.
 *
 * This replaces four progress rings that read 75% / 65% / 85% / 95% against invented labels
 * ("Wiper Nomination Target", "Mwingi-West Support"). Those numbers appeared nowhere in the
 * proposal, and a ring reading 95% implies attainment on a campaign that has not been engaged.
 *
 * The distinction this component exists to hold: a BASELINE is where the campaign starts, a
 * TARGET is where §20.2 says it must reach. Neither is progress, and nothing here should ever
 * be read as work completed. The bar therefore shows the gap between the two — which is the
 * actual argument — rather than a percentage of anything.
 */

interface Kpi {
  code: string;
  title: string;
  definition: string;
  baseline: number;
  baselineLabel: string;
  /** True where §20.2 marks the baseline "(Est. Baseline)" rather than measured. */
  baselineIsEstimate: boolean;
  target: number;
  targetLabel: string;
  owner: string;
  icon: typeof Target;
}

const KPIS: Kpi[] = [
  {
    code: "NW-01",
    title: "Wiper ballot preference share",
    definition: "Sampled likely Wiper primary voters naming Dr. Mulu as first choice.",
    baseline: 38.5,
    baselineLabel: "38.5%",
    baselineIsEstimate: true,
    target: 55,
    targetLabel: "≥ 55.0%",
    owner: "Head of Research & Polling",
    icon: Target,
  },
  {
    code: "NW-02",
    title: "Northern sub-county name ID",
    definition: "Spontaneous plus aided recognition across Mwingi North, Central and West.",
    baseline: 42,
    baselineLabel: "42.0%",
    baselineIsEstimate: true,
    target: 70,
    targetLabel: "≥ 70.0%",
    owner: "Comms Director",
    icon: Users,
  },
  {
    code: "NW-03",
    title: "Fiscal integrity salience",
    definition: "Voters ranking a clean audit record as their first or second voting criterion.",
    baseline: 31,
    baselineLabel: "31.0%",
    baselineIsEstimate: false,
    target: 60,
    targetLabel: "≥ 60.0%",
    owner: "Policy & Strategy Lead",
    icon: Scale,
  },
  {
    code: "NW-04",
    title: "Branch executive endorsement",
    definition: "Signed support pledges from sub-county Wiper executive branch committees.",
    baseline: 37.5,
    baselineLabel: "3 of 8 branches",
    baselineIsEstimate: false,
    target: 100,
    targetLabel: "8 of 8 branches",
    owner: "Political Affairs Director",
    icon: Building2,
  },
];

export function NominationScorecard() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.35, margin: "-10% 0px" });

  return (
    <div ref={ref} className="my-8">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-6 bg-gold rounded-full" aria-hidden="true" />
          <h3 className="font-serif text-lg sm:text-xl font-semibold text-ink">
            Nomination-window targets
          </h3>
        </div>
        <span className="claim-badge claim-badge-estimate text-[9px] px-2.5 py-1 font-semibold uppercase tracking-wider">
          Targets, not measured progress
        </span>
      </div>
      <p className="text-xs text-muted leading-relaxed mb-5 max-w-3xl">
        Section 20.2 sets four KPIs for the nomination window. The bar shows the distance from the
        stated baseline to the target objective — the gap the engagement exists to close. No work
        has been performed against these; the campaign has not been engaged.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {KPIS.map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.code} className="p-4 bg-card border border-line rounded-2xl">
              <div className="flex items-start justify-between gap-2 mb-2.5">
                <div className="flex items-start gap-2.5 min-w-0">
                  <span className="w-8 h-8 rounded-lg bg-accent/10 text-accent flex items-center justify-center shrink-0">
                    <Icon size={16} aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-[10px] font-black text-accent">{kpi.code}</span>
                      {kpi.baselineIsEstimate && <ClaimBadge status="estimate" compact />}
                    </div>
                    <h4 className="text-sm font-bold text-ink leading-tight mt-0.5">{kpi.title}</h4>
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-muted leading-relaxed mb-3">{kpi.definition}</p>

              <div
                className="relative h-7 rounded-lg bg-line/40 overflow-hidden"
                role="img"
                aria-label={`${kpi.title}: baseline ${kpi.baselineLabel}, target ${kpi.targetLabel}`}
              >
                {/* Baseline block — where the campaign starts. */}
                <motion.div
                  className="absolute inset-y-0 left-0 bg-muted/25"
                  initial={{ scaleX: 0 }}
                  animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
                  style={{ width: `${kpi.baseline}%`, transformOrigin: "left" }}
                  transition={{ duration: 0.52, ease: [0.16, 1, 0.3, 1], delay: i * 0.06 }}
                />
                {/* The gap to close — the actual argument. */}
                <motion.div
                  className="absolute inset-y-0 bg-accent/30 border-r-2 border-accent"
                  initial={{ scaleX: 0 }}
                  animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
                  style={{
                    left: `${kpi.baseline}%`,
                    width: `${kpi.target - kpi.baseline}%`,
                    transformOrigin: "left",
                  }}
                  transition={{ duration: 0.52, ease: [0.16, 1, 0.3, 1], delay: 0.14 + i * 0.06 }}
                />
              </div>

              <div className="flex items-center justify-between mt-2 text-[10px]">
                <span className="text-muted">
                  Baseline <span className="font-mono font-bold text-ink tabular-nums">{kpi.baselineLabel}</span>
                </span>
                <span className="text-accent font-bold">
                  Target <span className="font-mono tabular-nums">{kpi.targetLabel}</span>
                </span>
              </div>
              <div className="text-[10px] text-muted mt-1.5 pt-1.5 border-t border-line/40">
                Owner: {kpi.owner}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
