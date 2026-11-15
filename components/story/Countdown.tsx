"use client";

import React, { useEffect, useState } from "react";
import { CalendarClock } from "lucide-react";
import { RACE_CALENDAR } from "@/lib/public-data";
import { useReveal } from "./useReveal";

const DAY = 86_400_000;
/** Today's date in Nairobi, as YYYY-MM-DD: the calendar's dates are Kenyan dates. */
const nairobiToday = () => new Date(Date.now() + 3 * 3_600_000).toISOString().slice(0, 10);
const daysTo = (iso: string, today: string) => Math.round((Date.parse(`${iso}T00:00:00Z`) - Date.parse(`${today}T00:00:00Z`)) / DAY);
const long = (iso: string) => new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

/**
 * The next Gazette deadline, counted down in days, with the two after it. Computed in the browser
 * from today's date in Nairobi, so a page built weeks ago still counts from today.
 */
export function Countdown() {
  const [today, setToday] = useState<string | null>(null);
  const [ref, inView] = useReveal<HTMLElement>();
  const [shown, setShown] = useState(0);
  useEffect(() => {
    const id = window.setTimeout(() => setToday(nairobiToday()), 0);
    return () => window.clearTimeout(id);
  }, []);
  const upcoming = today ? RACE_CALENDAR.filter((e) => e.date >= today).sort((a, b) => a.date.localeCompare(b.date)) : [];
  const next = upcoming[0];
  const days = next && today ? daysTo(next.date, today) : 0;
  const election = RACE_CALENDAR.find((e) => /^General Election$/i.test(e.event));
  const toElection = election && today ? daysTo(election.date, today) : null;
  useEffect(() => {
    if (!inView || !next) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { const t = window.setTimeout(() => setShown(days), 0); return () => window.clearTimeout(t); }
    let frame = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / 1100);
      setShown(Math.round(days * (1 - Math.pow(1 - p, 3))));
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, days, next]);
  if (!today || !next) return null;
  const ring = Math.max(0.04, Math.min(1, 1 - days / 120));
  return (
    <section ref={ref} className="sx-count-card" data-in={inView ? "true" : "false"} aria-label="The next deadline">
      <div className="sx-count-card__ring" aria-hidden="true">
        <svg viewBox="0 0 42 42"><circle cx="21" cy="21" r="17" className="bg" /><circle cx="21" cy="21" r="17" className="fg" style={{ "--p": ring } as React.CSSProperties} /></svg>
        <span><b>{shown}</b><small>{days === 1 ? "day" : "days"}</small></span>
      </div>
      <div className="sx-count-card__body">
        <p className="sx-record__kicker"><CalendarClock size={13} aria-hidden="true" style={{ marginRight: "0.35rem" }} /> Next deadline · {long(next.date)}</p>
        <p className="sx-count-card__event">{next.event}</p>
        <p className="sx-muted">{next.appliesTo} · {next.source}</p>
        {upcoming.length > 1 && (
          <ul className="sx-count-card__after">
            {upcoming.slice(1, 3).map((e) => <li key={e.date + e.event}><span>{daysTo(e.date, today)} days</span>{e.event}</li>)}
          </ul>
        )}
        {toElection !== null && toElection > 0 && <p className="sx-count-card__election">{toElection} days to the General Election</p>}
      </div>
    </section>
  );
}
