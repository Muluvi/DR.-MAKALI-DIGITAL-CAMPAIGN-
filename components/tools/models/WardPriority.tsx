"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { CRITERIA, KEYS, cleanWeights, leadingCriterion, rankWards, type CriterionKey, type Weights } from "@/lib/models/ward-priority";
import { GRID, WARD_TILES } from "@/lib/geo/wards";
import { PRIORITY_WARDS } from "@/lib/models/data";
import { EXAMPLES } from "@/lib/models/instruct/examples";
import { parsePriority } from "@/lib/models/instruct/parse";
import { explainPriority } from "@/lib/models/instruct/explain";
import { ToolShell, fmt } from "../ToolShell";
import { InstructionBox } from "./InstructionBox";

const EVEN: Weights = { voters: 25, pool: 25, stations: 25, projects: 25 };
const LABEL = Object.fromEntries(CRITERIA.map((c) => [c.key, c.label])) as Record<CriterionKey, string>;
const SHOWN = 10;
const tint = (score: number) => `color-mix(in oklch, var(--accent-solid) ${Math.round(8 + 0.84 * score)}%, var(--card))`;

function Model() {
  const [weights, setWeights] = useState<Weights>(EVEN);
  const [selected, setSelected] = useState<string | null>(null);
  const w = useDeferredValue(weights);
  const baseline = useMemo(() => new Map(rankWards(PRIORITY_WARDS, EVEN).map((r) => [r.ward.slug, r.rank])), []);
  const ranked = useMemo(() => rankWards(PRIORITY_WARDS, w), [w]);
  const bySlug = useMemo(() => new Map(ranked.map((r) => [r.ward.slug, r])), [ranked]);
  const total = KEYS.reduce((a, k) => a + weights[k], 0);
  const top = ranked.slice(0, SHOWN);
  const topPool = top.filter((r) => r.ward.pool === 1).length;
  const baseTopPool = rankWards(PRIORITY_WARDS, EVEN).slice(0, SHOWN).filter((r) => r.ward.pool === 1).length;
  const pick = selected ? bySlug.get(selected) : null;
  const instruct = (text: string) => {
    const r = parsePriority(text, weights);
    setWeights(r.next);
    return r;
  };

  return (
    <div className="grid gap-4">
      <div className="panel grid gap-3 sm:grid-cols-2">
        {CRITERIA.map((c) => (
          <label key={c.key} className="field">
            <span className="range-head">{c.label} <output>{total > 0 ? Math.round((100 * weights[c.key]) / total) : 0}% of the score</output></span>
            <input type="range" min="0" max="100" step="5" value={weights[c.key]} onChange={(e) => setWeights({ ...weights, [c.key]: Number(e.target.value) })} aria-label={`${c.label} weight`} />
            <span className="hint">{c.hint}</span>
          </label>
        ))}
        <div className="flex flex-wrap gap-2 sm:col-span-2">
          {KEYS.map((k) => <button key={k} type="button" className="btn btn-sm" onClick={() => setWeights({ ...cleanWeights({}), [k]: 100 })}>{LABEL[k]} only</button>)}
        </div>
      </div>

      <div className="result" role="status">
        {total === 0 ? (
          <p>Every weight is zero, so every ward scores 0. Set at least one weight.</p>
        ) : (
          <>
            <p><strong>{top[0].ward.name}</strong> ({top[0].ward.constituency}) ranks first on these weights.</p>
            <p>{topPool} of the top {SHOWN} are in the four constituencies where he has not held office, against {baseTopPool} on even weights.</p>
          </>
        )}
      </div>

      <InstructionBox onRun={instruct} explanation={explainPriority(ranked)} examples={EXAMPLES["ward-priority"]} />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
        <figure className="panel m-0">
          <figcaption className="small"><strong>The 40 wards, darker for a higher score.</strong> One tile per ward, grouped by constituency roughly as the county sits; not to scale. The number is the ward&rsquo;s rank.</figcaption>
          <div className="mt-3 grid gap-1" style={{ gridTemplateColumns: `repeat(${GRID.cols}, minmax(0, 1fr))`, gridTemplateRows: `repeat(${GRID.rows}, minmax(0, 1fr))` }}>
            {WARD_TILES.map((t) => {
              const slug = t.id.replace(/^ward\./, "");
              const r = bySlug.get(slug);
              const score = r?.score ?? 0;
              const on = selected === slug;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setSelected(on ? null : slug)}
                  aria-pressed={on}
                  aria-label={`${t.name}, ${t.constituencyName}: rank ${r?.rank ?? "–"}, score ${fmt(score, 1)}`}
                  className="flex aspect-square min-h-8 items-center justify-center rounded-md border text-[0.72rem] font-bold"
                  style={{ gridColumn: t.col + 1, gridRow: t.row + 1, background: tint(score), color: score > 55 ? "var(--on-accent)" : "var(--ink)", borderColor: on ? "var(--ink)" : "var(--line)", outline: on ? "2px solid var(--accent)" : undefined }}
                >
                  {r?.rank}
                </button>
              );
            })}
          </div>
          <p className="mt-3 small" aria-live="polite" style={{ minHeight: "2.6em" }}>
            {pick ? <><strong>{pick.ward.name}</strong>, {pick.ward.constituency}: rank {pick.rank} (rank {baseline.get(pick.ward.slug)} on even weights), score {fmt(pick.score, 1)}. {fmt(pick.ward.voters)} voters, {fmt(pick.ward.stations)} stations, {pick.ward.projects} county projects{pick.ward.pool ? ", where he has not held office" : ""}.</> : <span className="muted">Tap a tile to see its ward.</span>}
          </p>
        </figure>

        <div className="table-wrap m-0" tabIndex={0} role="region" aria-label="Ward ranking" style={{ maxHeight: "34rem" }}>
          <table>
            <thead><tr><th className="num">Rank</th><th>Ward</th><th className="num">Even weights</th><th className="num">Score</th><th>Weighs most</th><th className="num">Voters</th></tr></thead>
            <tbody>
              {ranked.map((r) => {
                const lead = leadingCriterion(r);
                const b = baseline.get(r.ward.slug) ?? 0;
                return (
                  <tr key={r.ward.code} style={selected === r.ward.slug ? { background: "var(--sunk)" } : undefined}>
                    <td className="num"><strong>{r.rank}</strong></td>
                    <td><button type="button" className="min-h-8 text-left underline-offset-2 hover:underline" onClick={() => setSelected(r.ward.slug)}>{r.ward.name}</button><span className="block small muted">{r.ward.constituency}</span></td>
                    <td className="num">{b}{b !== r.rank ? <span className={b > r.rank ? "is-good" : "is-bad"}> {b > r.rank ? "▲" : "▼"}{Math.abs(b - r.rank)}</span> : null}</td>
                    <td className="num">{fmt(r.score, 1)}</td>
                    <td>{lead ? LABEL[lead] : "–"}</td>
                    <td className="num">{fmt(r.ward.voters)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function WardPriority() {
  return (
    <ToolShell
      kicker="Model"
      title="Ward priority"
      question="Which wards come first, on the weights you choose? Each criterion is scaled across the 40 wards, then weighted. It starts on even weights; the table shows each ward's move against them."
      source="Source: IEBC ward register and polling-station list, 2022; County Government of Kitui scorecard projects"
    >
      <Model />
    </ToolShell>
  );
}
