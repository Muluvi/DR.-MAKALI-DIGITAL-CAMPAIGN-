"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { allChannels, coverage, sharesTotal, type ContentCode } from "@/lib/models/brief-mix";
import { BRIEF_LANGUAGES, BRIEF_PLAN, BRIEF_SIZES, BRIEF_TYPES } from "@/lib/models/data";
import { EXAMPLES } from "@/lib/models/instruct/examples";
import { parseBrief } from "@/lib/models/instruct/parse";
import { explainBrief } from "@/lib/models/instruct/explain";
import { Compare, ToolShell } from "../ToolShell";
import { InstructionBox } from "./InstructionBox";

const CHANNELS = allChannels(BRIEF_PLAN);
const EVEN: Record<ContentCode, number> = { P1: 25, P2: 25, P3: 25, P4: 25 };
const START = { shares: EVEN, languages: BRIEF_LANGUAGES, channels: CHANNELS, minShare: 10 };

function Model() {
  const [shares, setShares] = useState<Record<ContentCode, number>>(EVEN);
  const [langs, setLangs] = useState<string[]>(BRIEF_LANGUAGES);
  const [chans, setChans] = useState<string[]>(CHANNELS);
  const [minShare, setMinShare] = useState(10);
  const live = useMemo(() => ({ shares, languages: langs, channels: chans, minShare }), [shares, langs, chans, minShare]);
  const input = useDeferredValue(live);
  const result = useMemo(() => coverage(BRIEF_PLAN, input), [input]);
  const base = useMemo(() => coverage(BRIEF_PLAN, START).filter((r) => r.covered).length, []);
  const total = sharesTotal(shares);
  const covered = result.filter((r) => r.covered).length;
  const toggle = (list: string[], set: (v: string[]) => void, v: string) => set(list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);
  const instruct = (text: string) => {
    const r = parseBrief(text, { shares, languages: langs, channels: chans, minShare }, BRIEF_TYPES, BRIEF_LANGUAGES, CHANNELS);
    setShares(r.next.shares); setLangs(r.next.languages); setChans(r.next.channels); setMinShare(r.next.minShare);
    return r;
  };

  return (
    <div className="grid gap-4">
      <div className="panel grid gap-5 lg:grid-cols-3">
        <fieldset className="m-0 border-0 p-0">
          <legend className="font-bold">Share of the week, by content type</legend>
          {BRIEF_TYPES.map((t) => (
            <label key={t.code} className="field mt-2">
              <span className="range-head">{t.code} · {t.short} <output>{shares[t.code]}%</output></span>
              <input type="range" min="0" max="100" step="5" value={shares[t.code]} onChange={(e) => setShares({ ...shares, [t.code]: Number(e.target.value) })} aria-label={`${t.code} share of the week`} />
            </label>
          ))}
          <p className={`small m-0 ${total === 100 ? "muted" : "is-bad"}`}>Total {total}%. The week&rsquo;s weights should total 100.</p>
          <label className="field mt-3">
            <span className="range-head">A content type counts once it has <output>{minShare}%</output></span>
            <input type="range" min="0" max="50" step="5" value={minShare} onChange={(e) => setMinShare(Number(e.target.value))} aria-label="Minimum share for a content type to count" />
          </label>
        </fieldset>
        <fieldset className="m-0 border-0 p-0">
          <legend className="font-bold">Languages this week</legend>
          {BRIEF_LANGUAGES.map((l) => <label key={l} className="check"><input type="checkbox" checked={langs.includes(l)} onChange={() => toggle(langs, setLangs, l)} />{l}</label>)}
        </fieldset>
        <fieldset className="m-0 border-0 p-0">
          <legend className="font-bold">Channels this week</legend>
          <div className="grid grid-cols-2 gap-x-3">
            {CHANNELS.map((c) => <label key={c} className="check"><input type="checkbox" checked={chans.includes(c)} onChange={() => toggle(chans, setChans, c)} />{c}</label>)}
          </div>
        </fieldset>
      </div>
      <Compare baseLabel="Even week, every language and channel" base={base} scenario={covered} format={(v) => String(v)} unit={` of ${result.length} segments`} />
      <InstructionBox onRun={instruct} explanation={explainBrief(result)} examples={EXAMPLES["brief-mix"]} />
      <ul className="grid gap-3 p-0 sm:grid-cols-2 lg:grid-cols-3" style={{ listStyle: "none" }}>
        {result.map((r) => (
          <li key={r.row.id} className="panel" style={r.covered ? undefined : { background: "transparent", border: "1px dashed var(--line)" }}>
            <p className="m-0 small font-bold">{r.covered ? "Covered" : "Missed"}</p>
            <p className="m-0 mt-1 font-bold">{r.row.name}</p>
            <p className="m-0 small muted">{BRIEF_SIZES[r.row.id]}</p>
            <p className="m-0 mt-2 small">Content type {r.row.pillar}; {r.row.languages.join(", ")}; {r.row.channels.join(", ")}.</p>
            {!r.covered && <p className="m-0 mt-2 small">Missed because {r.reasons.join("; ")}.</p>}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function BriefMix() {
  return (
    <ToolShell
      kicker="Model"
      title="Weekly brief mix"
      question="Which voter segments does this week's brief cover? Weight the four content types, pick the languages and channels, and see the six segments covered and missed."
      source="Source: the segment plan (each segment's content type, languages and lead channels)"
    >
      <Model />
    </ToolShell>
  );
}
