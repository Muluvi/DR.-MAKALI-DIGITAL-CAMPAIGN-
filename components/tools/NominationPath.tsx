"use client";

import { useState } from "react";
import { NOMINATION_CONFIRMATION_REQUIREMENTS, NOMINATION_METHOD_CLAIM } from "@/data/nomination-path";
import { PUBLIC_SOURCES, RACE_CALENDAR } from "@/lib/public-data";
import { ToolShell } from "./ToolShell";

const WANTED = /Governor|financing account|authorised persons for campaign|expenditure report|Public officers/i;
const ITEMS = [
  ...NOMINATION_CONFIRMATION_REQUIREMENTS.map((r, i) => ({ id: `party-${i}`, label: r, detail: "Needed to confirm the nomination method" })),
  ...RACE_CALENDAR.filter((e) => WANTED.test(e.event) && e.date >= "2027-01-01").map((e) => ({ id: e.date + e.event, label: e.event, detail: `${e.date} · ${e.source}` })),
];

/** A working checklist for a meeting. Ticks live only in this page; refreshing clears them. */
function Checklist() {
  const [done, setDone] = useState<Record<string, boolean>>({});
  const count = ITEMS.filter((i) => done[i.id]).length;
  return (
    <div className="grid gap-3">
      <p className="m-0 small muted">{NOMINATION_METHOD_CLAIM.value}. {NOMINATION_METHOD_CLAIM.provenance.note}</p>
      <div className="bar" aria-hidden="true"><span style={{ width: `${(100 * count) / ITEMS.length}%` }} /></div>
      <p className="m-0" role="status"><strong>{count} of {ITEMS.length}</strong> ticked</p>
      <ul className="grid gap-2 p-0" style={{ listStyle: "none" }}>
        {ITEMS.map((i) => (
          <li key={i.id} className="panel">
            <label className="flex cursor-pointer gap-3">
              <input type="checkbox" className="mt-1 flex-none" checked={!!done[i.id]} onChange={() => setDone({ ...done, [i.id]: !done[i.id] })} />
              <span><span className="block">{i.label}</span><span className="block small muted">{i.detail}</span></span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function NominationPath() {
  return (
    <ToolShell kicker="Tool" title="Governor nomination path" question="What must be confirmed and filed on the road to the nomination, with the dates. Tick through it in a meeting." source={`Source: ${PUBLIC_SOURCES.calendar.label}; campaign nomination-path record`}>
      <Checklist />
    </ToolShell>
  );
}
