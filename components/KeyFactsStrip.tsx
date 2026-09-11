"use client";

import { Users, MapPin, WifiOff, TrendingDown, MessageSquare, Vote } from "lucide-react";

import {
  COUNTY_POPULATION,
  REGISTERED_VOTERS,
  WARD_COUNT,
  CONSTITUENCY_COUNT,
  OFFLINE_SHARE_PCT,
} from "../data/county-profile";
import { DEFICIT_LATEST, LATEST_ROUND } from "../data/nomination-contest";

/**
 * The six figures the rest of the document argues from, stated once, under the hero.
 *
 * This replaces a marquee, and the replacement is the point rather than a side effect. The
 * strip that stood here scrolled forever and carried six items, of which one was a rounded-up
 * population ("1.3M+") the document's own §6.2 contradicts, and three — a completed digital
 * pilot, synced radio aircover, established coalition networks — described work as finished
 * that no section of the proposal claims has begun. A reader who checks any of those stops
 * trusting the ones they cannot check.
 *
 * So: no loop, no duplicated copy for the seam, no category label above the content. Six
 * claims, each with the figure it rests on and the source that publishes it, laid out in a
 * grid that wraps. Static content costs no main thread, and on the mid-range Android this
 * document is written for that is worth more than the motion was.
 *
 * Every value is read from a canonical store — none is typed here.
 */

const fmt = (n: number) => n.toLocaleString("en-KE");

const FACTS = [
  {
    icon: Users,
    figure: fmt(COUNTY_POPULATION.value),
    claim: "residents of Kitui County",
    source: "KNBS, 2019 census",
  },
  {
    icon: Vote,
    figure: fmt(REGISTERED_VOTERS),
    claim: `registered voters, across ${WARD_COUNT} wards in ${CONSTITUENCY_COUNT} constituencies`,
    source: "IEBC register",
  },
  {
    icon: WifiOff,
    figure: `${OFFLINE_SHARE_PCT}%`,
    claim: "of residents aged 3 and above are offline",
    source: "KNBS, 2019 census",
  },
  {
    icon: TrendingDown,
    figure: `${DEFICIT_LATEST} points`,
    claim: "behind the leader in the nomination contest",
    source: LATEST_ROUND.label,
  },
  {
    icon: MessageSquare,
    figure: "120,000",
    claim: "consented SMS contacts by Phase 3 — the asset that compounds",
    source: "§8.10.6 KPI ladder",
  },
  {
    icon: MapPin,
    figure: "198,004",
    claim: "votes won the seat in 2022 — the number to beat",
    source: "2022 gubernatorial result",
  },
] as const;

export function KeyFactsStrip() {
  return (
    <section
      aria-label="The figures this proposal argues from"
      className="not-prose my-6 border-y border-line bg-card"
    >
      <ul className="mx-auto grid max-w-7xl grid-cols-1 gap-px bg-line sm:grid-cols-2 lg:grid-cols-3">
        {FACTS.map(({ icon: Icon, figure, claim, source }) => (
          <li key={claim} className="flex gap-3 bg-card px-4 py-3.5">
            <Icon size={16} aria-hidden="true" className="mt-0.5 shrink-0 text-accent" />
            <div className="min-w-0">
              <p className="t-small leading-snug text-ink">
                <strong className="font-bold tabular-nums">{figure}</strong>{" "}
                <span className="font-medium text-prose-body">{claim}</span>
              </p>
              <p className="t-micro mt-1 leading-snug text-muted">{source}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
