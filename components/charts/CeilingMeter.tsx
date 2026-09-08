"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { Check, ChevronRight, Scale } from "lucide-react";

import { BUDGET_TIERS, CEILING, OPERATIONAL_PLAN, OTHER_REGULATED, type BudgetTier } from "../../data/budget-tiers";
import { useMotionPreset } from "../../hooks/useMotionPreset";
import { AnimatedNumber } from "../visual/AnimatedNumber";
import { STAGGER, fadeUp, staggerContainer, VIEWPORT_TALL } from "../../lib/motion";

/**
 * The statutory ceiling as one bar, with the three tiers as bands inside it.
 *
 * §9.2.5 makes a point twice in prose that a picture should make once: AD SPEND SITS INSIDE THE
 * CEILING. It is regulated expenditure alongside transport, venues and personnel, not a budget
 * added on top of them. Drawn as three separate bars — one per tier — that point disappears,
 * and the reader is left to infer a relationship the document is at pains to state.
 *
 * So there is one bar, it is KSh97.56m, and each tier is a band within it. What is left of the
 * bar after a tier's band is the headroom that has to cover everything else the campaign spends.
 * Tier 2 is the recommendation and is the band that reads as chosen.
 *
 * The reader is a member of the Budget and Appropriations Committee. A ceiling drawn as a
 * container rather than as a comparison is the version that matches how they will think about it.
 *
 * Motion contract: bands scale from the left edge. Selecting a tier animates the band and its
 * panel; it does not re-lay-out the bar. Under reduced motion everything is at its true width
 * from the first frame and selection is instant.
 */

const ksh = (n: number) => `KSh${(n / 1_000_000).toFixed(2)}m`;

function TierPanel({ tier }: { tier: BudgetTier }) {
  return (
    <dl className="space-y-2.5">
      <div>
        <dt className="t-micro font-black uppercase tracking-wider text-muted">Purpose</dt>
        <dd className="t-small text-ink leading-snug">{tier.purpose}</dd>
      </div>
      <div>
        <dt className="t-micro font-black uppercase tracking-wider text-muted">Team model</dt>
        <dd className="t-small text-ink leading-snug">{tier.team}</dd>
      </div>
      <div>
        <dt className="t-micro font-black uppercase tracking-wider text-muted">USSD</dt>
        <dd className="t-small text-ink leading-snug">{tier.ussd}</dd>
      </div>
      <div>
        <dt className="t-micro font-black uppercase tracking-wider text-muted">Contact universe</dt>
        <dd className="t-small text-ink leading-snug tabular-nums">{tier.contactUniverse}</dd>
      </div>
      <div>
        <dt className="t-micro font-black uppercase tracking-wider text-danger">Trade-offs</dt>
        <dd className="t-small text-ink leading-snug">{tier.tradeOff}</dd>
      </div>
    </dl>
  );
}

export function CeilingMeter() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const { reduce, spring, variants } = useMotionPreset();
  const [selected, setSelected] = useState<BudgetTier["id"]>("standard");
  const shown = reduce || inView;
  const active = BUDGET_TIERS.find((t) => t.id === selected)!;

  return (
    <section
      ref={ref}
      className="not-prose my-7 rounded-2xl border border-line bg-card overflow-hidden"
      style={{ boxShadow: "var(--shadow-3)" }}
      aria-labelledby="ceiling-meter-title"
    >
      <div className="p-4 sm:p-5">
        <div className="flex items-center gap-2">
          <Scale size={15} className="text-accent shrink-0" aria-hidden="true" />
          <p className="eyebrow-label !mb-0">Statutory ceiling</p>
        </div>
        <h4 id="ceiling-meter-title" className="font-serif t-figure font-black text-ink leading-none mt-1">
          <AnimatedNumber value={CEILING / 1_000_000} decimals={2} prefix="KSh" suffix="m" />
        </h4>
        <p className="t-small text-muted leading-relaxed mt-2">
          IEBC Gazette Notice No. 12251, 7 August 2026. This covers the whole campaign — ad spend
          sits <strong className="text-ink font-bold">inside</strong> it, alongside{" "}
          {OTHER_REGULATED.join(", ").toLowerCase()}, not on top of them.
        </p>

        {/* One bar. The selected tier's band is a fraction of it, and what remains is what has
            to cover everything else. */}
        <div className="mt-4" aria-hidden="true">
          <div className="relative h-12 rounded-xl bg-line/30 overflow-hidden border border-line/60">
            <motion.div
              className="absolute inset-y-0 left-0 bg-accent-solid/25"
              style={{ width: `${active.pctTo}%`, transformOrigin: "left" }}
              initial={reduce ? false : { scaleX: 0 }}
              animate={shown ? { scaleX: 1 } : { scaleX: 0 }}
              transition={spring("gentle")}
            />
            <motion.div
              className="absolute inset-y-0 left-0 bg-accent-solid"
              style={{ width: `${active.pctFrom}%`, transformOrigin: "left" }}
              initial={reduce ? false : { scaleX: 0 }}
              animate={shown ? { scaleX: 1 } : { scaleX: 0 }}
              transition={spring("gentle")}
            />
          </div>
          {/* Labels below the bar, not inside it.
              Inside, "Standard ad spend · 30–40%" is wider than the 30% band it names at 390px,
              so it spilled across the headroom it was supposed to be distinguished from and
              "headroom" wrapped to "HEADROO / M". A key underneath survives every width. */}
          <ul className="mt-2 space-y-1">
            <li className="flex items-center gap-2">
              <span aria-hidden="true" className="w-3 h-3 rounded-sm bg-accent-solid shrink-0" />
              <span className="t-micro text-ink">
                <strong className="font-black uppercase tracking-wider">
                  {active.label} ad spend
                </strong>{" "}
                <span className="tabular-nums text-muted">
                  {active.pctFrom}–{active.pctTo}% · {ksh(active.fromKsh)}–{ksh(active.toKsh)}
                </span>
              </span>
            </li>
            <li className="flex items-center gap-2">
              <span aria-hidden="true" className="w-3 h-3 rounded-sm bg-line shrink-0" />
              <span className="t-micro text-muted">
                <strong className="font-black uppercase tracking-wider text-ink">Headroom</strong>{" "}
                <span className="tabular-nums">
                  for transport, venues, personnel and all other regulated spend
                </span>
              </span>
            </li>
          </ul>
        </div>

        {/* Tier selector. Swipeable on a phone, arrow-navigable everywhere. */}
        <div
          role="tablist"
          aria-label="Budget tiers"
          className="mt-5 flex gap-2 overflow-x-auto snap-x snap-mandatory scrollbar-none -mx-1 px-1 pb-1"
        >
          {BUDGET_TIERS.map((tier) => {
            const isActive = tier.id === selected;
            return (
              <button
                key={tier.id}
                role="tab"
                aria-selected={isActive}
                aria-controls={`tier-panel-${tier.id}`}
                id={`tier-tab-${tier.id}`}
                onClick={() => setSelected(tier.id)}
                className={`snap-center shrink-0 min-h-[44px] rounded-xl border px-3 py-2 text-left fx-press fx-focus cursor-pointer transition-colors ${
                  isActive
                    ? "bg-accent-solid border-accent-solid text-on-accent"
                    : "bg-paper border-line text-muted hover:text-ink hover:border-accent/40"
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <span className="t-micro font-black uppercase tracking-wider">{tier.name}</span>
                  {tier.recommended && (
                    <span
                      className={`inline-flex items-center gap-0.5 t-micro font-black uppercase tracking-wider rounded px-1 ${
                        isActive ? "bg-on-accent text-accent-solid" : "bg-gold/20 text-gold"
                      }`}
                    >
                      <Check size={9} aria-hidden="true" />
                      <span className="sr-only">Recommended</span>
                      <span aria-hidden="true" className="hidden xs:inline">Recommended</span>
                      <span aria-hidden="true" className="xs:hidden">Rec.</span>
                    </span>
                  )}
                </span>
                <span className="block t-label font-bold">{tier.label}</span>
                <span className="block t-micro tabular-nums opacity-80">
                  {ksh(tier.fromKsh)}–{ksh(tier.toKsh)}
                </span>
              </button>
            );
          })}
        </div>

        <motion.div
          key={selected}
          id={`tier-panel-${selected}`}
          role="tabpanel"
          aria-labelledby={`tier-tab-${selected}`}
          className="mt-4 rounded-xl border border-line/60 bg-paper/50 p-3.5"
          variants={variants(staggerContainer(STAGGER.tight))}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={fadeUp}>
            <TierPanel tier={active} />
          </motion.div>
        </motion.div>

        <p className="t-small text-muted leading-relaxed mt-4 rounded-xl border border-dashed border-line px-3 py-2.5">
          Separately, §9.2.5 sets a{" "}
          <strong className="text-ink font-bold tabular-nums">
            KSh{(OPERATIONAL_PLAN / 1_000_000).toFixed(1)}m
          </strong>{" "}
          operational plan for the whole campaign. That is the campaign&rsquo;s own spending
          intent; the ceiling above is the legal limit on all regulated expenditure. They are
          different quantities and neither is a share of the other.
        </p>
      </div>

      {/* The accessible equivalent: all three tiers, all figures, always in the DOM. */}
      <div className="px-4 sm:px-5 pb-5">
        <details>
          <summary className="t-label font-bold text-accent cursor-pointer list-none min-h-[44px] inline-flex items-center gap-1.5">
            <ChevronRight size={13} aria-hidden="true" />
            <span className="underline underline-offset-4 decoration-dotted">
              All three tiers, as a table
            </span>
          </summary>
          <div className="overflow-x-auto mt-3">
            <table className="w-full t-small border-collapse">
              <caption className="sr-only">
                Budget tiers as a share of the KSh97.56 million statutory ceiling.
              </caption>
              <thead>
                <tr>
                  <th scope="col" className="text-left px-2 py-2 t-micro font-black uppercase tracking-wider text-muted border-b border-line">Tier</th>
                  <th scope="col" className="text-right px-2 py-2 t-micro font-black uppercase tracking-wider text-muted border-b border-line">Share of ceiling</th>
                  <th scope="col" className="text-right px-2 py-2 t-micro font-black uppercase tracking-wider text-muted border-b border-line">Ad spend</th>
                  <th scope="col" className="text-right px-2 py-2 t-micro font-black uppercase tracking-wider text-muted border-b border-line">Contacts</th>
                </tr>
              </thead>
              <tbody>
                {BUDGET_TIERS.map((t) => (
                  <tr key={t.id} className="border-b border-line/40 last:border-b-0">
                    <th scope="row" className="text-left px-2 py-2 font-semibold text-ink">
                      {t.name} — {t.label}
                      {t.recommended ? " (recommended)" : ""}
                    </th>
                    <td className="text-right px-2 py-2 tabular-nums text-muted">{t.pctFrom}–{t.pctTo}%</td>
                    <td className="text-right px-2 py-2 tabular-nums text-muted">{ksh(t.fromKsh)}–{ksh(t.toKsh)}</td>
                    <td className="text-right px-2 py-2 tabular-nums text-muted">{t.contactUniverse}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      </div>
    </section>
  );
}
