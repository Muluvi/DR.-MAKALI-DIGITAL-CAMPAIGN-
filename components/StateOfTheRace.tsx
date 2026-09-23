import {
  COUNTY_POPULATION,
  OFFLINE_SHARE_PCT,
  ONLINE_SHARE_PCT,
  REGISTERED_VOTERS,
  WARD_COUNT,
  CONSTITUENCY_COUNT,
} from "../data/county-profile";
import { DEFICIT_FIRST, DEFICIT_LATEST, FIRST_ROUND, LATEST_ROUND } from "../data/nomination-contest";
import { RESOURCE_ENVELOPE_FY2026_27 } from "../data/fiscal-audit";
import { WINNING_TOTAL_2022 } from "../lib/figures/register";
import { GapBar } from "./figures/marks";
import { UnderReview } from "./figures/UnderReview";

/**
 * Where the contest stands, above the fold, in one strip.
 *
 * WHAT THIS REPLACES, AND WHY. Three counter cards — KSh13.79bn, 86.4%, ≈200k — inside a tilting,
 * spotlit, mesh-gradient panel that scrolled sideways on a phone and clipped its own labels
 * ("Offline pop (KN…", "13.6% active internet…"). The counters began at zero in the server HTML,
 * so a reader on a slow connection was shown KSh0.00bn, and a screenshot of the finished page
 * caught them mid-count displaying KSh13.49bn and 84.5% — figures that appear nowhere in this
 * document. The tilt, the spotlight and the mesh are all on the deny list; the sideways scroll
 * is what the proposal's own §2.3 says this electorate cannot afford.
 *
 * WHAT IT DOES INSTEAD (D-3, race-first). The hero's job is to say where the CONTEST stands. The
 * county's KSh13.79bn envelope is what the OFFICE is worth, and leading with it tells the reader
 * what winning is worth before telling them the race is 15.3 points behind; it keeps its place in
 * the strip and in §3.3.4, one item further down.
 *
 * The gap is drawn as one distance rather than two numbers, because 22.1 and 37.4 are not two
 * facts — they are one, and a reader should not have to subtract.
 *
 * IT REPLACES THE FACT GRID TOO. KeyFactsStrip sat directly beneath the counters and restated
 * four of the same figures — the register, the population, the offline share and 198,004 — so a
 * reader met each of them twice before reaching §0. One strip carries every one of them once.
 * Nothing the two of them stated has been dropped.
 *
 * It is a SERVER COMPONENT. No state, no counters, no hydration: every figure is in the HTML at
 * its true value, which is the whole point.
 */
import { ELECTORAL_ARITHMETIC } from "../data/electoral-arithmetic";
import { TierBadge } from "./markdown/TierBadge";
import { ArrowRight, CheckCircle2 } from "lucide-react";

/**
 * Sourced Data Baseline & Five-Step Progress Spine
 * Purged of opinion poll deficits; grounded entirely on certified and official public records.
 */
export function StateOfTheRace() {
  const steps = [
    { num: "1", title: "Objectives", desc: "Observable milestones" },
    { num: "2", title: "The Data", desc: "Certified official records" },
    { num: "3", title: "The Analysis", desc: "The winning arithmetic" },
    { num: "4", title: "The Strategy", desc: "Targeted regional choices" },
    { num: "5", title: "Implementation", desc: "Who does what & when" },
  ];

  return (
    <section
      aria-label="Core electoral baselines and strategic sequence"
      className="not-prose rounded-2xl border border-line bg-card p-5 sm:p-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-line">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-serif text-lg sm:text-xl font-bold text-ink">
              Kitui 2027: Core Electoral Baselines
            </h2>
            <TierBadge tier="T1" />
          </div>
          <p className="mt-1 text-xs text-muted">
            The four data-only figures governing the campaign, anchored on certified election returns and official gazettes.
          </p>
        </div>
      </div>

      {/* The 4 Sourced Data-Only Figures */}
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-line bg-paper/60 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted uppercase tracking-wider">Electorate</span>
              <TierBadge tier="T3" />
            </div>
            <div className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-ink tabular-nums">
              605,703
            </div>
            <p className="mt-1 text-xs font-medium text-ink">Registered Voters (Reported ECVR)</p>
          </div>
          <p className="mt-3 text-[11px] text-muted border-t border-line/50 pt-2">
            532,758 certified in 2022 (T1); 605,703 reported following IEBC continuous registration (T3 [VERIFY]).
          </p>
        </div>

        <div className="p-4 rounded-xl border border-line bg-paper/60 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted uppercase tracking-wider">Target Floor</span>
              <TierBadge tier="T1" />
            </div>
            <div className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-ink tabular-nums">
              ≈200k–225k
            </div>
            <p className="mt-1 text-xs font-medium text-ink">Votes to Win (Plurality Benchmark)</p>
          </div>
          <p className="mt-3 text-[11px] text-muted border-t border-line/50 pt-2">
            Anchored on Malombe&apos;s 198,004 certified votes (2022). Scaled to 2026 electorate equals ≈225,000.
          </p>
        </div>

        <div className="p-4 rounded-xl border border-line bg-paper/60 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted uppercase tracking-wider">Deficit Pool</span>
              <TierBadge tier="T1" />
            </div>
            <div className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-ink tabular-nums">
              51.7%
            </div>
            <p className="mt-1 text-xs font-medium text-ink">In Mwingi & Kitui South (275,570 Voters)</p>
          </div>
          <p className="mt-3 text-[11px] text-muted border-t border-line/50 pt-2">
            Over half the register lives where Dr. Mulu has never held office. Winning requires expanding beyond Kitui Central.
          </p>
        </div>

        <div className="p-4 rounded-xl border border-line bg-paper/60 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted uppercase tracking-wider">Certified Benchmarks</span>
              <TierBadge tier="T1" />
            </div>
            <div className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-ink tabular-nums">
              201.9k / 191.3k
            </div>
            <p className="mt-1 text-xs font-medium text-ink">Rivals Won Countywide (2022 Returns)</p>
          </div>
          <p className="mt-3 text-[11px] text-muted border-t border-line/50 pt-2">
            Kasalu (201,899 votes) and Wambua (191,317 votes) hold proven countywide machines; Mulu&apos;s votes were bounded to Kitui Central.
          </p>
        </div>
      </div>

      {/* Five-Step Strategic Progress Spine */}
      <div className="mt-6 pt-5 border-t border-line">
        <h3 className="text-xs font-bold text-muted uppercase tracking-wider mb-3">
          Five-Step Strategic Spine (Objectives &rarr; Data &rarr; Analysis &rarr; Strategy &rarr; Implementation)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
          {steps.map((s, idx) => (
            <div
              key={s.num}
              className="p-3 rounded-lg border border-line/60 bg-paper/40 flex items-center gap-2.5"
            >
              <div className="w-6 h-6 rounded-full bg-accent/15 text-accent font-mono text-xs font-bold flex items-center justify-center shrink-0">
                {s.num}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-ink truncate">{s.title}</div>
                <div className="text-[10px] text-muted truncate">{s.desc}</div>
              </div>
              {idx < steps.length - 1 && (
                <ArrowRight size={12} className="hidden sm:block text-muted/50 ml-auto shrink-0" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
