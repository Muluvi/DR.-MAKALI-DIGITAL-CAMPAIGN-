"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import type { CalendarEntry } from "@/lib/public-data";
import { ToolActions } from "./ToolActions";

type When = "All" | "Upcoming" | "Passed";
const fmtDate = (d: string) => new Date(`${d}T00:00:00+03:00`).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric", timeZone: "Africa/Nairobi" });

const noSubscribe = () => () => {};
const nairobiToday = () => new Date().toLocaleDateString("en-CA", { timeZone: "Africa/Nairobi" });

export function RaceCalendar({ entries }: { entries: CalendarEntry[] }) {
  // Read today in the browser, so a cached page never shows a deadline in the wrong state.
  const today = useSyncExternalStore(noSubscribe, nairobiToday, () => null);
  const [when, setWhen] = useState<When>("All");
  const [who, setWho] = useState("All");
  const groups = useMemo(() => ["All", ...new Set(entries.map((e) => e.appliesTo))], [entries]);
  const isPassed = (e: CalendarEntry) => today !== null && e.date < today;
  const rows = entries.filter((e) => (who === "All" || e.appliesTo === who) && (when === "All" || (when === "Passed") === isPassed(e)));
  const count = (w: When) => entries.filter((e) => (who === "All" || e.appliesTo === who) && (w === "All" || (w === "Passed") === isPassed(e))).length;
  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by date">
          {(["All", "Upcoming", "Passed"] as When[]).map((w) => (
            <button key={w} type="button" aria-pressed={when === w} onClick={() => setWhen(w)} className={`plat-btn plat-btn-sm ${when === w ? "plat-btn-solid" : ""}`}>{w} ({count(w)})</button>
          ))}
        </div>
        <label className="text-[0.85rem] text-muted">Applies to{" "}
          <select className="plat-input mt-1 block" value={who} onChange={(e) => setWho(e.target.value)}>{groups.map((g) => <option key={g}>{g}</option>)}</select>
        </label>
        <ToolActions filename="kitui-governor-race-calendar-2027.csv" link={false} rows={() => [["date", "event", "applies_to", "source"], ...rows.map((e) => [e.date, e.event, e.appliesTo, e.source])]} />
      </div>
      <ol className="mt-5 space-y-2">
        {rows.map((e) => (
          <li key={e.date + e.event} className={`plat-card p-3 sm:p-4 ${isPassed(e) ? "opacity-70" : ""}`}>
            <div className="flex flex-wrap items-center gap-2">
              <time dateTime={e.date} className="font-mono text-[0.85rem] text-ink">{fmtDate(e.date)}</time>
              {today && <span className="plat-chip">{isPassed(e) ? "Passed" : "Upcoming"}</span>}
              <span className="plat-chip">{e.appliesTo}</span>
            </div>
            <p className="mt-2 text-ink">{e.event}</p>
            <p className="mt-1 text-[0.78rem] text-muted">{e.source}</p>
          </li>
        ))}
      </ol>
      {rows.length === 0 && <p className="plat-hint mt-5">No dates match these filters.</p>}
    </div>
  );
}
