"use client";

import React, { useRef } from "react";
import { motion, useInView } from "motion/react";
import { Target, Users, Scale, Building2 } from "lucide-react";

import { ClaimBadge } from "./markdown/ClaimBadge";

/**
 * §8.1.1 — the nomination-window KPI scorecard, quoted.
 *
 * This replaces four progress rings that read 75% / 65% / 85% / 95% against invented labels
 * ("Wiper Nomination Target", "Mwingi-West Support"). Those numbers appeared nowhere in the
 * proposal, and a ring reading 95% implies attainment on a campaign that has not been engaged.
 *
 * The distinction this component exists to hold: a BASELINE is where the campaign starts, a
 * TARGET is where §8.1.1 says it must reach. Neither is progress, and nothing here should ever
 * be read as work completed. The bar therefore shows the gap between the two — which is the
 * actual argument — rather than a percentage of anything.
 */

interface Kpi {
  code: string;
  title: string;
  definition: string;
  /** Null until the Week 1 baseline instrument runs — §8.1.1 carries no measured start point. */
  baseline: number | null;
  baselineLabel: string;
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
    baseline: null,
    baselineLabel: "Not yet measured",
    target: 55,
    targetLabel: "≥ 55.0%",
    owner: "Head of Research & Polling",
    icon: Target,
  },
  {
    code: "NW-02",
    title: "Northern sub-county name ID",
    definition: "Spontaneous plus aided recognition across Mwingi North, Central and West.",
    baseline: null,
    baselineLabel: "Not yet measured",
    target: 70,
    targetLabel: "≥ 70.0%",
    owner: "Comms Director",
    icon: Users,
  },
  {
    code: "NW-03",
    title: "Fiscal integrity salience",
    definition: "Voters ranking a clean audit record as their first or second voting criterion.",
    baseline: null,
    baselineLabel: "Not yet measured",
    target: 60,
    targetLabel: "≥ 60.0%",
    owner: "Policy & Strategy Lead",
    icon: Scale,
  },
  {
    code: "NW-04",
    title: "Branch executive endorsement",
    definition: "Signed support pledges from sub-county Wiper executive branch committees.",
    baseline: null,
    baselineLabel: "Confirm with party",
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
        <span className="claim-badge claim-badge-estimate t-micro px-2.5 py-1 font-semibold uppercase tracking-wider">
          Targets, not measured progress
        </span>
      </div>
      <p className="text-xs text-muted leading-relaxed mb-5 max-w-3xl">
        Section 8.1.1 sets four KPIs for the nomination window. The bar shows each target. No
        baseline is drawn: none has been measured, and Section 1.3.6 records that no published
        poll reports these quantities. Each is established by the Week 1 instrument. No work has
        been performed against these; the campaign has not been engaged.
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
                      <span className="font-mono t-label font-black text-accent">{kpi.code}</span>
                      {kpi.baseline === null && <ClaimBadge status="estimate" compact />}
                    </div>
                    <h4 className="text-sm font-bold text-ink leading-tight mt-0.5">{kpi.title}</h4>
                  </div>
                </div>
              </div>

              <p className="t-small text-muted leading-relaxed mb-3">{kpi.definition}</p>

              <div
                className="relative h-7 rounded-lg bg-line/40 overflow-hidden"
                role="img"
                aria-label={`${kpi.title}: baseline ${kpi.baselineLabel}; target ${kpi.targetLabel}`}
              >
                {/* Target only. With no measured baseline there is no distance to draw, and
                    drawing one from an assumed start point is what §8.1.1 got wrong. */}
                <motion.div
                  className="absolute inset-y-0 left-0 bg-accent/30 border-r-2 border-accent"
                  initial={{ scaleX: 0 }}
                  animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
                  style={{ width: `${kpi.target}%`, transformOrigin: "left" }}
                  transition={{ duration: 0.52, ease: [0.16, 1, 0.3, 1], delay: 0.14 + i * 0.06 }}
                />
              </div>

              <div className="flex items-center justify-between mt-2 t-label">
                <span className="text-muted">
                  Baseline <span className="font-mono font-bold text-ink tabular-nums">{kpi.baselineLabel}</span>
                </span>
                <span className="text-accent font-bold">
                  Target <span className="font-mono tabular-nums">{kpi.targetLabel}</span>
                </span>
              </div>
              <div className="t-label text-muted mt-1.5 pt-1.5 border-t border-line/40">
                Owner: {kpi.owner}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
