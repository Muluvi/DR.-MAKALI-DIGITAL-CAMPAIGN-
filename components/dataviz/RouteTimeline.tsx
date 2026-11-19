"use client";

import { useMemo, useSyncExternalStore } from "react";

import { KituiIcon } from "../icons/kitui";

/**
 * The road to 2027 as a matatu route (visual upgrade, C5), with a tear-off calendar for the next
 * stop (C6). Every stop is a Gazette date from the Governor Race Calendar (data/public-2026-11).
 *
 * Which stops are behind the matatu is worked out from the reader's own device date, after
 * hydration, the way the site's countdown does it. The server cannot know the reader's date, so its
 * HTML shows the whole route with no stop marked passed and no count: true, and simply less.
 */
export type RouteStop = { date: string; event: string; appliesTo: string; source: string };

const DAY = 86_400_000;
const noop = () => () => {};
const todayUtc = () => {
  const n = new Date();
  return Date.UTC(n.getFullYear(), n.getMonth(), n.getDate());
};
const utcOf = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return Date.UTC(y, m - 1, d);
};
const dayMonth = (iso: string) => new Date(utcOf(iso)).toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });

export function RouteTimeline({ stops }: { stops: RouteStop[] }) {
  const today = useSyncExternalStore(noop, todayUtc, () => null);
  const sorted = useMemo(() => [...stops].sort((a, b) => a.date.localeCompare(b.date)), [stops]);
  const nextIndex = today === null ? -1 : sorted.findIndex((s) => utcOf(s.date) >= today);
  const next = nextIndex >= 0 ? sorted[nextIndex] : null;
  const days = next && today !== null ? Math.round((utcOf(next.date) - today) / DAY) : null;
  const year = (iso: string) => iso.slice(0, 4);

  return (
    <div className="rt">
      {next && days !== null ? (
        <div className="rt__tear" aria-live="polite">
          <div className="rt__pad" aria-hidden="true">
            <span className="rt__rings"><i /><i /><i /></span>
            <span className="rt__month">{new Date(utcOf(next.date)).toLocaleDateString("en-GB", { month: "long", timeZone: "UTC" })}</span>
            <span className="rt__daynum">{Number(next.date.slice(8, 10))}</span>
            <span className="rt__year">{year(next.date)}</span>
          </div>
          <p className="rt__count">
            <span className="rt__n pf-num">{days.toLocaleString("en-KE")}</span>
            <span className="rt__t">
              {days === 1 ? "day" : "days"} to the next stop, counted from today&rsquo;s date on this phone:
              <strong> {next.event}</strong>
              <span className="rt__who"> · {next.appliesTo}</span>
            </span>
          </p>
        </div>
      ) : null}

      <ol className="rt__route" aria-label="The Gazette dates on the road to the 2027 election">
        {sorted.flatMap((s, i) => {
          const state = nextIndex < 0 ? (today === null ? "unknown" : "passed") : i < nextIndex ? "passed" : i === nextIndex ? "next" : "ahead";
          const newYear = i === 0 || year(s.date) !== year(sorted[i - 1].date);
          const stop = (
            <li key={`${s.date}-${i}`} className="rt__stop" data-state={state} style={{ "--i": i } as React.CSSProperties}>
              <span className="rt__node" aria-hidden="true">
                {state === "next" ? <KituiIcon name="matatu" size={20} className="rt__bus" /> : null}
              </span>
              <span className="rt__date">{dayMonth(s.date)} <span className="sr-only">{year(s.date)}</span></span>
              <span className="rt__event">
                {s.event}
                <span className="rt__meta">{s.appliesTo} · {s.source}</span>
              </span>
              {state === "passed" ? <span className="sr-only"> (passed)</span> : state === "next" ? <span className="sr-only"> (next stop)</span> : null}
            </li>
          );
          return newYear ? [<li key={`y-${year(s.date)}`} className="rt__yr" aria-hidden="true">{year(s.date)}</li>, stop] : [stop];
        })}
      </ol>
    </div>
  );
}
