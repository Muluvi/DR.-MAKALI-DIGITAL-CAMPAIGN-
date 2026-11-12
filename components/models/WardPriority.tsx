"use client";

import { useEffect, useMemo, useState } from "react";
import { CRITERIA, KEYS, cleanWeights, leadingCriterion, rankWards, type CriterionKey, type PriorityWard, type Weights } from "@/lib/models/ward-priority";
import { GRID, WARD_TILES } from "@/lib/geo/wards";
import { ToolActions } from "@/components/tools/public/ToolActions";
import { InstructionBox } from "./InstructionBox";
import { parsePriority } from "@/lib/models/instruct/parse";
import { explainPriority } from "@/lib/models/instruct/explain";

const n = (v: number) => v.toLocaleString("en-KE");
const EVEN: Weights = { voters: 25, pool: 25, stations: 25, projects: 25 };
const LABEL = Object.fromEntries(CRITERIA.map((c) => [c.key, c.label])) as Record<CriterionKey, string>;
const SHOWN = 10;

/** "25-25-25-25" in the link, in criterion order. */
function decode(raw: string | undefined): Weights {
  const parts = (raw ?? "").split("-").map(Number);
  if (parts.length !== KEYS.length || parts.some((p) => !Number.isFinite(p))) return EVEN;
  return cleanWeights(Object.fromEntries(KEYS.map((k, i) => [k, parts[i]])));
}

const tint = (score: number) => `color-mix(in oklch, var(--accent-solid) ${Math.round(8 + 0.84 * score)}%, var(--card))`;

export function WardPriority({ wards, initial, embedded = false }: { wards: PriorityWard[]; initial?: string; embedded?: boolean }) {
  const [weights, setWeights] = useState<Weights>(() => decode(initial));
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    if (embedded) return;
    window.history.replaceState(null, "", `?w=${KEYS.map((k) => weights[k]).join("-")}`);
  }, [weights, embedded]);

  const ranked = useMemo(() => rankWards(wards, weights), [wards, weights]);
  const bySlug = useMemo(() => new Map(ranked.map((r) => [r.ward.slug, r])), [ranked]);
  const total = KEYS.reduce((a, k) => a + weights[k], 0);
  const top = ranked.slice(0, SHOWN);
  const topPool = top.filter((r) => r.ward.pool === 1).length;
  const pick = selected ? bySlug.get(selected) : null;

  const instruct = (text: string) => {
    const r = parsePriority(text, weights);
    setWeights(r.next);
    return r;
  };
  return (
    <div>
      <InstructionBox onRun={instruct} explanation={explainPriority(ranked)} examples={["focus on register size and where he has not held office", "only polling stations", "voters 60, projects 40", "even weights"]} />
      <div className="plat-card grid gap-4 p-4 sm:grid-cols-2 sm:p-5">
        {CRITERIA.map((c) => (
          <label key={c.key} className="block text-[0.85rem] text-muted">
            <span className="font-semibold text-ink">{c.label}</span>
            <output className="float-right font-mono text-ink">{total > 0 ? Math.round((100 * weights[c.key]) / total) : 0}% of the score</output>
            <input className="mt-2 block w-full" type="range" min="0" max="100" step="5" value={weights[c.key]} onChange={(e) => setWeights({ ...weights, [c.key]: Number(e.target.value) })} aria-label={`${c.label} weight`} />
            <span className="plat-hint block">{c.hint}</span>
          </label>
        ))}
        <div className="flex flex-wrap gap-2 sm:col-span-2">
          <button type="button" className="plat-btn plat-btn-sm" onClick={() => setWeights(EVEN)}>Even weights</button>
          {KEYS.map((k) => <button key={k} type="button" className="plat-btn plat-btn-sm" onClick={() => setWeights({ ...cleanWeights({}), [k]: 100 })}>{LABEL[k]} only</button>)}
        </div>
      </div>

      {total === 0 ? (
        <p className="mt-4 text-ink" role="status">Every weight is zero, so every ward scores 0. Set at least one weight.</p>
      ) : (
        <p className="mt-4 text-ink" role="status">
          On these weights, <strong>{top[0].ward.name}</strong> ({top[0].ward.constituency}) ranks first. {topPool} of the top {SHOWN} are in the four constituencies where he has not held office.
        </p>
      )}

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <figure className="plat-card p-4">
          <figcaption className="text-[0.85rem] font-semibold text-ink">The 40 wards, darker for a higher score</figcaption>
          <p className="plat-hint">One tile per ward, grouped by constituency roughly as the county sits. Not to scale.</p>
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
                  aria-label={`${t.name}, ${t.constituencyName}: rank ${r?.rank ?? "–"}, score ${score.toFixed(0)}`}
                  title={`${t.name}: rank ${r?.rank ?? "–"}`}
                  className={`flex aspect-square min-h-8 items-center justify-center rounded-md border text-[0.7rem] font-semibold ${on ? "border-ink ring-2 ring-accent" : "border-line"}`}
                  style={{ gridColumn: t.col + 1, gridRow: t.row + 1, background: tint(score), color: score > 55 ? "var(--on-accent)" : "var(--ink)" }}
                >
                  {r?.rank}
                </button>
              );
            })}
          </div>
          <p className="mt-3 min-h-[2.5rem] text-[0.85rem] text-ink" aria-live="polite">
            {pick ? <>
              <strong>{pick.ward.name}</strong>, {pick.ward.constituency}: rank {pick.rank}, score {pick.score.toFixed(1)}. {n(pick.ward.voters)} voters, {n(pick.ward.stations)} stations, {pick.ward.projects} county projects{pick.ward.pool ? ", where he has not held office" : ""}.
            </> : <span className="text-muted">Select a tile to see its ward. The number on each tile is its rank.</span>}
          </p>
        </figure>

        <div className="plat-card p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-serif text-xl text-ink">The ranking</h2>
            <ToolActions link={!embedded} filename="kitui-ward-priority.csv" rows={() => [["rank", "ward", "constituency", "score", ...KEYS.map((k) => `weight_${k}`), "voters_2022", "stations_2022", "county_projects", "not_held_office"], ...ranked.map((r) => [r.rank, r.ward.name, r.ward.constituency, r.score.toFixed(1), ...KEYS.map((k) => weights[k]), r.ward.voters, r.ward.stations, r.ward.projects, r.ward.pool ? "yes" : "no"])]} />
          </div>
          <div className="mt-3 max-h-[34rem] overflow-auto">
            <table className="w-full min-w-[30rem] text-left text-[0.85rem]">
              <thead className="sticky top-0 bg-card text-muted"><tr><th className="py-2 pr-2 text-right">#</th><th className="py-2 pr-3">Ward</th><th className="py-2 pr-3 text-right">Score</th><th className="py-2 pr-3">Weighs most</th><th className="py-2 text-right">Voters</th></tr></thead>
              <tbody>
                {ranked.map((r) => {
                  const lead = leadingCriterion(r);
                  return (
                    <tr key={r.ward.code} className={`border-t border-line ${selected === r.ward.slug ? "bg-paper" : ""}`}>
                      <td className="py-1.5 pr-2 text-right font-mono text-muted">{r.rank}</td>
                      <td className="py-1.5 pr-3 text-ink"><button type="button" className="text-left hover:underline" onClick={() => setSelected(r.ward.slug)}>{r.ward.name}</button><span className="block text-[0.75rem] text-muted">{r.ward.constituency}</span></td>
                      <td className="py-1.5 pr-3 text-right font-mono text-ink">{r.score.toFixed(1)}</td>
                      <td className="py-1.5 pr-3 text-muted">{lead ? LABEL[lead] : "–"}</td>
                      <td className="py-1.5 text-right font-mono text-ink">{n(r.ward.voters)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
