"use client";

import { useEffect, useRef, useState } from "react";
import { ClipboardList } from "lucide-react";

import { useLive } from "../story/useLive";
import { Laptop, Tablet } from "../devices/Frames";

/**
 * The team's own records, drawn three ways (visual upgrade, B11, B12, B13). Every mark comes from
 * a record the team has saved in the workspace, read through the story's live layer (useLive), and
 * nothing is shown that has not been saved: an empty workspace draws empty boards that say so.
 */

type Data = Record<string, unknown>;
const str = (v: unknown) => (typeof v === "string" ? v : "");

/* ------------------------------------------------------------------------------- command map */

export type MapWard = { id: string; name: string; path: string };

/**
 * B11: a dark county map of the field reports. A ward's shade is how many field records name it;
 * when a new record arrives for a ward while the page is open, that ward ripples once. Nothing
 * pulses on its own and nothing claims to be live.
 */
export function CommandMap({ wards }: { wards: MapWard[] }) {
  const { live, ready } = useLive();
  const field = live?.collections.field;
  const counts = new Map<string, number>();
  for (const d of Object.values(field?.data ?? {}) as Data[]) {
    const w = str(d.ward);
    if (w) counts.set(w, (counts.get(w) ?? 0) + 1);
  }
  const max = Math.max(1, ...counts.values());
  const prev = useRef<Map<string, number> | null>(null);
  const [rippling, setRippling] = useState<string[]>([]);

  useEffect(() => {
    if (!ready) return;
    const before = prev.current;
    prev.current = new Map(counts);
    if (!before) return;
    const grew = [...counts.entries()].filter(([w, n]) => n > (before.get(w) ?? 0)).map(([w]) => w);
    if (!grew.length) return;
    const t1 = window.setTimeout(() => setRippling(grew), 0);
    const t2 = window.setTimeout(() => setRippling([]), 1600);
    return () => { window.clearTimeout(t1); window.clearTimeout(t2); };
    // counts is derived from live on every render; the snapshot itself is the trigger.
  }, [live, ready]); // eslint-disable-line react-hooks/exhaustive-deps

  const total = [...counts.values()].reduce((a, b) => a + b, 0);
  return (
    <Tablet label="Command map of field reports by ward">
      <div className="cm">
        <p className="cm__head">
          <span>FIELD REPORTS BY WARD</span>
          <span>{ready ? `${total} saved` : "loading…"}</span>
        </p>
        <svg viewBox="0 0 600 1000" className="cm__map" role="img" aria-label={total ? `Field reports by ward: ${[...counts.entries()].map(([w, n]) => `${w} ${n}`).join(", ")}` : "No field reports saved yet"}>
          {wards.map((w) => {
            const n = counts.get(w.name) ?? 0;
            return (
              <path key={w.id} d={w.path} className="cm__ward" data-has={n ? "true" : "false"} data-ripple={rippling.includes(w.name) ? "true" : "false"} style={{ "--k": n / max } as React.CSSProperties} />
            );
          })}
        </svg>
        <p className="cm__foot">
          {ready && !total ? "No field reports saved yet. A ward lights up when the team saves its first report." : "Brighter: more reports. A ward ripples once when a new one is saved."}
        </p>
      </div>
    </Tablet>
  );
}

/* ------------------------------------------------------------------------------- kanban */

const STATUS = ["Planned", "In progress", "Live", "Paused", "Done"] as const;

/** B13: this week's implementation records, in the columns of their own status field. */
export function Kanban() {
  const { live, ready } = useLive();
  const recs = Object.values(live?.collections.implementation?.data ?? {}) as Data[];
  return (
    <Laptop label="Implementation board">
      <div className="kb">
        <p className="kb__head">IMPLEMENTATION · {ready ? `${recs.length} records` : "loading…"}</p>
        <div className="kb__cols">
          {STATUS.map((s) => {
            const items = recs.filter((r) => str(r.status) === s);
            return (
              <section key={s} className="kb__col" aria-label={`${s}: ${items.length}`}>
                <h5 className="kb__title">{s} <span>{items.length}</span></h5>
                <ul className="kb__list">
                  {items.slice(0, 6).map((r, i) => (
                    <li key={i} className="kb__card">
                      <span className="kb__what">{str(r.action)}</span>
                      <span className="kb__meta">{[str(r.owner), str(r.channel)].filter(Boolean).join(" · ")}</span>
                    </li>
                  ))}
                  {items.length > 6 ? <li className="kb__more">+{items.length - 6} more</li> : null}
                </ul>
              </section>
            );
          })}
        </div>
        {ready && !recs.length ? <p className="kb__empty">No implementation records yet. They appear here as the team adds them in the workspace.</p> : null}
      </div>
    </Laptop>
  );
}

/* ------------------------------------------------------------------------------- memo */

/** B12: the latest weekly brief, as a printed memo on a clipboard. */
export function BriefMemo() {
  const { live, ready } = useLive();
  const briefs = (Object.values(live?.collections.briefs?.data ?? {}) as Data[]).sort((a, b) => str(b.week).localeCompare(str(a.week)));
  const b = briefs[0];
  const weights = b ? [b.pillar1, b.pillar2, b.pillar3].map((v) => (typeof v === "number" ? `${v}%` : "—")) : [];
  return (
    <div className="mm" role="group" aria-label="The weekly brief as a memo">
      <span className="mm__clip" aria-hidden="true" />
      <div className="mm__paper">
        <p className="mm__k"><ClipboardList size={16} aria-hidden="true" /> MEMO · THE WEEKLY BRIEF</p>
        {b ? (
          <dl className="mm__rows">
            <div><dt>Week starting</dt><dd>{str(b.week)}</dd></div>
            <div><dt>Status</dt><dd>{str(b.status)}</dd></div>
            <div><dt>Pillar weights</dt><dd>{weights.join(" · ")}</dd></div>
            <div><dt>Must post</dt><dd>{str(b.mustPost)}</dd></div>
            <div><dt>Priority wards</dt><dd>{Array.isArray(b.wardPriority) ? (b.wardPriority as string[]).join(", ") : str(b.wardPriority)}</dd></div>
            <div><dt>Language rule</dt><dd>{str(b.languageRule)}</dd></div>
            <div><dt>Stop</dt><dd>{str(b.stopOne)}</dd></div>
          </dl>
        ) : (
          <p className="mm__empty">{ready ? "No brief has been issued yet. The latest one appears here, as a memo, once the team saves it in the workspace." : "Loading the latest brief…"}</p>
        )}
      </div>
    </div>
  );
}
