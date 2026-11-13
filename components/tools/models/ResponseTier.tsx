"use client";

import { useMemo, useState } from "react";
import { classify, KINDS, SPREADS, type Incident, type KindKey, type SpreadKey } from "@/lib/models/response-tier";
import { HOLDING_LINES, TIERS } from "@/lib/models/data";
import { EXAMPLES } from "@/lib/models/instruct/examples";
import { parseIncident } from "@/lib/models/instruct/parse";
import { explainTier } from "@/lib/models/instruct/explain";
import { ToolShell, fmt } from "../ToolShell";
import { pageText } from "@/lib/reader-text";
import { InstructionBox } from "./InstructionBox";

const START: Incident = { kind: "rumour", spread: "wards", views: 200, wardGroups: 1, fringe: false };

function Model() {
  const [i, setI] = useState<Incident>(START);
  const [line, setLine] = useState(-1);
  const r = useMemo(() => classify(TIERS, i), [i]);
  const pick = line >= 0 ? HOLDING_LINES[line] : null;
  const set = <K extends keyof Incident>(k: K, v: Incident[K]) => setI({ ...i, [k]: v });
  const instruct = (text: string) => {
    const p = parseIncident(text, i, HOLDING_LINES);
    const { line: l, ...incident } = p.next;
    setI(incident);
    if (l >= 0) setLine(l);
    return p;
  };
  return (
    <div className="grid gap-4">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <div className="panel grid content-start gap-3">
          <label className="field">What happened<select className="input" value={i.kind} onChange={(e) => set("kind", e.target.value as KindKey)}>{KINDS.map((k) => <option key={k.key} value={k.key}>{k.label}</option>)}</select></label>
          <label className="field">Where it is<select className="input" value={i.spread} onChange={(e) => set("spread", e.target.value as SpreadKey)}>{SPREADS.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}</select></label>
          <div className="grid grid-cols-2 gap-3">
            <label className="field">Views so far<input className="input" type="number" min="0" inputMode="numeric" value={i.views} onChange={(e) => set("views", Math.max(0, Number(e.target.value) || 0))} /></label>
            <label className="field">Ward WhatsApp groups carrying it<input className="input" type="number" min="0" inputMode="numeric" value={i.wardGroups} onChange={(e) => set("wardGroups", Math.max(0, Number(e.target.value) || 0))} /></label>
          </div>
          <label className="check"><input type="checkbox" checked={i.fringe} onChange={(e) => set("fringe", e.target.checked)} />From a fringe blog or anonymous account</label>
          <label className="field">Line of attack, if it matches one
            <select className="input" value={line} onChange={(e) => setLine(Number(e.target.value))}>
              <option value={-1}>None of the prepared lines</option>
              {HOLDING_LINES.map((l, n) => <option key={l.question} value={n}>{l.question.replace(/^\d+\.\s*/, "")}</option>)}
            </select>
          </label>
          <p className="hint m-0">Describe the incident, not the people in it.</p>
        </div>
        <div className="result" style={{ marginTop: 0 }} aria-live="polite">
          <p className="kicker">Severity</p>
          <p className="h3" style={{ marginTop: 6 }}>{r.tier.name}</p>
          <p className="muted small">{r.rule}{i.views ? ` (${fmt(i.views)} views)` : ""}</p>
          {r.flagged && <p>{r.flagged}</p>}
          <dl className="v-fields sm:grid-cols-2" style={{ display: "grid" }}>
            <div><dt>What the campaign does</dt><dd>{r.tier.protocol}</dd></div>
            <div><dt>How fast</dt><dd>{r.tier.turnaround}</dd></div>
            <div><dt>Drafted by</dt><dd>{r.tier.draftedBy}</dd></div>
            <div><dt>Approved by</dt><dd>{r.tier.approvedBy}</dd></div>
          </dl>
          {pick && (
            <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--line)" }}>
              <p className="font-bold">The holding line to start from</p>
              <p className="small muted">Attack: {pageText(pick.attack)}</p>
              <p>{pageText(pick.holding)}</p>
              <p className="small muted" lang="kam"><em>{pick.kikamba}</em></p>
              <p className="source">Source: {pageText(pick.source)}</p>
            </div>
          )}
          <p className="small muted" style={{ marginTop: 10 }}>No tier answers by bulk SMS: political SMS is lodged with the operator 48 hours ahead, so it cannot carry a rapid response.</p>
        </div>
      </div>
      <InstructionBox onRun={instruct} explanation={explainTier(r)} examples={EXAMPLES["response-tier"]} />
    </div>
  );
}

export default function ResponseTier() {
  return (
    <ToolShell kicker="Model" title="Response tier" question="How serious is this incident, and who approves the answer? Describe what happened and how far it has spread." source="Source: the four-tier escalation ladder and the pre-drafted holding positions in the runbooks">
      <Model />
    </ToolShell>
  );
}
