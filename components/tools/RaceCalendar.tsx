"use client";

import { useMemo, useState } from "react";
import { PUBLIC_SOURCES, RACE_CALENDAR, type CalendarEntry } from "@/lib/public-data";
import { nairobiToday } from "@/lib/models/rollout-defaults";
import { ToolShell } from "./ToolShell";
import { ToolActions } from "./ToolActions";

type When = "All" | "Upcoming" | "Passed";
const fmtDate = (d: string) => new Date(`${d}T00:00:00+03:00`).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric", timeZone: "Africa/Nairobi" });

function downloadIcs(entries: CalendarEntry[]) {
  const esc = (s: string) => s.replace(/([,;\\])/g, "\\$1");
  const next = (d: string) => new Date(Date.parse(`${d}T00:00:00Z`) + 86400000).toISOString().slice(0, 10).replace(/-/g, "");
  const body = entries.map((e, i) => ["BEGIN:VEVENT", `UID:kitui-race-${e.date}-${i}@kitui2027`, `DTSTAMP:${e.date.replace(/-/g, "")}T000000Z`, `DTSTART;VALUE=DATE:${e.date.replace(/-/g, "")}`, `DTEND;VALUE=DATE:${next(e.date)}`, `SUMMARY:${esc(e.event)}`, `DESCRIPTION:${esc(`Applies to: ${e.appliesTo}. Source: ${e.source}`)}`, "END:VEVENT"].join("\r\n"));
  const ics = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Kitui 2027//Governor race calendar//EN", ...body, "END:VCALENDAR", ""].join("\r\n");
  const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = "kitui-governor-race-calendar-2027.ics";
  a.click();
  URL.revokeObjectURL(url);
}

function Calendar() {
  const today = useMemo(() => nairobiToday(), []);
  const [when, setWhen] = useState<When>("Upcoming");
  const [who, setWho] = useState("All");
  const groups = useMemo(() => ["All", ...new Set(RACE_CALENDAR.map((e) => e.appliesTo))], []);
  const passed = (e: CalendarEntry) => e.date < today;
  const match = (e: CalendarEntry, w: When) => (who === "All" || e.appliesTo === who) && (w === "All" || (w === "Passed") === passed(e));
  const rows = RACE_CALENDAR.filter((e) => match(e, when));
  const next = RACE_CALENDAR.find((e) => !passed(e));
  const days = next ? Math.round((Date.parse(next.date) - Date.parse(today)) / 86400000) : 0;
  return (
    <div className="grid gap-4">
      {next && <div className="result" style={{ marginTop: 0 }}><p><strong>Next: {next.event}</strong>, {fmtDate(next.date)}, in {days} day{days === 1 ? "" : "s"}.</p></div>}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by date">
          {(["Upcoming", "Passed", "All"] as When[]).map((w) => <button key={w} type="button" aria-pressed={when === w} onClick={() => setWhen(w)} className="btn btn-sm">{w} ({RACE_CALENDAR.filter((e) => match(e, w)).length})</button>)}
        </div>
        <label className="field">Applies to<select className="input" value={who} onChange={(e) => setWho(e.target.value)}>{groups.map((g) => <option key={g}>{g}</option>)}</select></label>
        <div className="flex gap-2">
          <button type="button" className="btn btn-sm no-print" onClick={() => downloadIcs(rows)}>Add to calendar (.ics)</button>
          <ToolActions filename="kitui-governor-race-calendar-2027.csv" rows={() => [["date", "event", "applies_to", "source"], ...rows.map((e) => [e.date, e.event, e.appliesTo, e.source])]} />
        </div>
      </div>
      <ol className="grid gap-2 p-0" style={{ listStyle: "none" }}>
        {rows.map((e) => (
          <li key={e.date + e.event} className="panel" style={passed(e) ? { opacity: 0.75 } : undefined}>
            <p className="m-0 small"><time dateTime={e.date} className="font-bold">{fmtDate(e.date)}</time> · {e.appliesTo}</p>
            <p className="m-0 mt-1">{e.event}</p>
            <p className="source" style={{ marginTop: 4 }}>{e.source}</p>
          </li>
        ))}
      </ol>
      {rows.length === 0 && <p className="muted m-0">No dates match these filters.</p>}
      <p className="small muted m-0">On the 9 December 2026 fundraising date, the notice also states that section 26(2) of the Elections Act does not prohibit fundraising by or on behalf of a person contesting an election, or for a political party. Take legal advice on any specific event. IEBC can amend dates by a new notice.</p>
    </div>
  );
}

export default function RaceCalendar() {
  return (
    <ToolShell kicker="Tool" title="Governor race calendar" question="Every dated step a governor candidate must track, from the Kenya Gazette." source={`Source: ${PUBLIC_SOURCES.calendar.label}`}>
      <Calendar />
    </ToolShell>
  );
}
