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
export function StateOfTheRace() {
  const pollDate = new Date(LATEST_ROUND.date);
  const asOf = pollDate.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  return (
    <section
      aria-label="Where the contest stands"
      className="not-prose rounded-2xl border border-line bg-card p-4 sm:p-5"
    >
      <h2 className="font-serif t-small sm:t-body font-bold text-ink">
        Where the contest stands, and what winning takes
      </h2>

      <div className="mt-4 grid gap-5 sm:grid-cols-2">
        {/* The finding the whole proposal is written against. */}
        <div>
          <GapBar
            leading={{ label: "Irene Kasalu", value: LATEST_ROUND.shares.kasalu }}
            trailing={{ label: "Dr. Mulu", value: LATEST_ROUND.shares.mulu }}
            scaleMax={45}
          />
          <p className="t-micro mt-2 leading-snug text-muted">
            Nomination preference, {LATEST_ROUND.label}. The gap widened from{" "}
            <strong className="font-semibold text-ink">{DEFICIT_FIRST} points</strong> in{" "}
            {FIRST_ROUND.short} to <strong className="font-semibold text-ink">{DEFICIT_LATEST}</strong> at {asOf}.
          </p>
        </div>

        {/* The three constraints and the number to beat, as figures rather than counters. */}
        <dl className="grid grid-cols-2 gap-x-4 gap-y-3.5">
          <Stat
            value={WINNING_TOTAL_2022.toLocaleString("en-KE")}
            label="votes won the seat in 2022"
            note="The number to beat — IEBC certified"
          />
          <Stat
            value={`${OFFLINE_SHARE_PCT}%`}
            label="of residents are offline"
            note={`${ONLINE_SHARE_PCT}% use the internet — KNBS 2019`}
            conflicts={["C-13"]}
          />
          <Stat
            value={REGISTERED_VOTERS.toLocaleString("en-KE")}
            label="registered voters"
            note={`${WARD_COUNT} wards across ${CONSTITUENCY_COUNT} constituencies`}
          />
          <Stat
            value={COUNTY_POPULATION.value.toLocaleString("en-KE")}
            label="residents of Kitui County"
            note="KNBS, 2019 census"
          />
          <Stat
            value={`KSh${(RESOURCE_ENVELOPE_FY2026_27.value / 1e9).toFixed(2)}bn`}
            label="the county's FY2026/27 envelope"
            note="What the office controls — approved Fiscal Strategy Paper. §3.3.4 breaks it down."
          />
          <Stat
            value="120,000"
            label="consented SMS contacts by Phase 3"
            note="The asset that compounds — §8.10.6 KPI ladder"
          />
        </dl>
      </div>

      {/* The offline share is the single most repeated figure in the document and the one the
          document itself says is superseded. A hero that printed it unqualified would be
          repeating the contradiction at the loudest point on the page. */}
      <div className="mt-4">
        <UnderReview ids={["C-13"]}>
          The site states Kitui&rsquo;s connectivity two ways: 13.6% internet use from the 2019
          census, used in twelve chapters and here, and 26.2% from the 2023/24 Kenya Housing
          Survey, which §3.6.1 says supersedes it. Both are shown where they appear; neither has
          been changed.
        </UnderReview>
      </div>
    </section>
  );
}

function Stat({
  value,
  label,
  note,
  conflicts,
}: {
  value: string;
  label: string;
  note: string;
  conflicts?: string[];
}) {
  return (
    <div className="min-w-0">
      <dt className="sr-only">{label}</dt>
      <dd className="m-0">
        <span className="block font-serif text-xl font-bold leading-none tabular-nums text-ink sm:text-2xl">
          {value}
          {conflicts && (
            <span className="ml-1 align-super t-micro font-bold text-gold" title={`Under review — ${conflicts.join(", ")}`}>
              *
            </span>
          )}
        </span>
        {/* No truncation. A figure worth printing is worth reading to the end — the cards this
            replaced cut "Own-source revenue: KSh1.339bn" off mid-figure on a phone. */}
        <span className="mt-1 block t-micro font-semibold leading-snug text-ink">{label}</span>
        <span className="mt-0.5 block t-micro leading-snug text-muted">{note}</span>
      </dd>
    </div>
  );
}
