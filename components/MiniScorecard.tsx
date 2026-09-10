"use client";

import { TrendingDown, Scale, Vote } from "lucide-react";

import { DEFICIT_LATEST } from "../data/nomination-contest";
import { CEILING } from "../data/budget-tiers";
/**
 * The three numbers the whole document turns on, permanently within reach.
 *
 * A reader 40,000 words into a 200-minute proposal should not have to scroll back to remember
 * what the deficit is, what the ceiling is, or how many votes win. These are the three figures
 * every other number in the document is argued against, so they get a rail of their own.
 *
 * It lives inside the bottom dock rather than floating above it. As its own fixed element it
 * had to guess the dock's height to sit clear of it, and the guess was wrong — the two
 * overlapped and the figures were unreadable behind the navigation buttons. Inside the dock
 * there is nothing to collide with, it condenses and expands with the dock, and it is as
 * thumb-reachable as the navigation is.
 *
 * Each is a link to the section that establishes it, so the strip is also the shortest route
 * back to the working behind any of the three.
 *
 * The whole dock already withdraws on a deliberate downward scroll and returns on an upward one,
 * under one shared model (see hooks/use-chrome-visible.ts), so this row inherits that behaviour
 * instead of running a second, competing one. Under reduced motion the dock stays put and so
 * does this.
 */

const ENTRIES = [
  {
    id: "decision-sec-0-1",
    icon: TrendingDown,
    label: "Deficit",
    value: `${DEFICIT_LATEST} pts`,
    tone: "text-danger",
    describe: `Dr. Mulu trails by ${DEFICIT_LATEST} percentage points`,
  },
  {
    id: "decision-sec-9-2-1",
    icon: Scale,
    label: "Ceiling",
    value: `KSh${(CEILING / 1_000_000).toFixed(2)}m`,
    tone: "text-ink",
    describe: `Statutory county expenditure ceiling, KSh${(CEILING / 1_000_000).toFixed(2)} million`,
  },
  {
    id: "evidence-sec-1-3-1",
    icon: Vote,
    label: "To win",
    value: "≈200,000",
    tone: "text-accent",
    describe: "Approximately 200,000 votes wins the seat",
  },
] as const;

export function MiniScorecard() {
  return (
    <div aria-label="Key figures" role="group" className="px-1 pb-1.5 mb-1.5 border-b border-line/40">
      <ul className="flex items-stretch justify-between gap-1">
        {ENTRIES.map(({ id, icon: Icon, label, value, tone, describe }) => (
          <li key={id} className="min-w-0 flex-1">
              <a
                href={`#${id}`}
                onClick={(e) => {
                  // The document's own navigator resolves legacy ids and waits for lazy content;
                  // the plain href is the fallback when it has not mounted yet.
                  const go = window.__navigateToSection;
                  if (go) {
                    e.preventDefault();
                    go(id);
                  }
                }}
                className="flex flex-col items-center justify-center gap-0 px-2 py-1 min-h-[44px] min-w-[44px] justify-center h-full rounded-lg fx-press fx-focus hover:bg-paper/70 transition-colors"
              >
                <span className="sr-only">{describe}. Jump to the section.</span>
                {/* The label row. The dock as a whole withdraws on a downward scroll, so this
                    does not need its own collapse — a second, competing hide would fight the
                    first and leave the strip half-shown at the wrong moments. */}
                <span
                  aria-hidden="true"
                  className="t-micro font-black text-muted flex items-center gap-1"
                >
                  <Icon size={9} />
                  {label}
                </span>
                <span
                  aria-hidden="true"
                  className={`t-label font-black tabular-nums leading-tight whitespace-nowrap ${tone}`}
                >
                  {value}
                </span>
              </a>
            </li>
          ))}
      </ul>
    </div>
  );
}
