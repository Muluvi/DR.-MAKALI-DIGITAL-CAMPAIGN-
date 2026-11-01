"use client";

/**
 * The data explorer: every figure in the registry (lib/data/figures.ts), searchable and filterable,
 * with a CSV of the whole registry and a link to each figure. The daily lookup tool for the
 * campaign team (consolidation pass, Step 4N).
 *
 * It reads the registry directly, so it can never disagree with the prose: every {{token}} on the
 * site resolves from the same records. Without JavaScript, and in print, the generated source table
 * beneath it (scripts/build-source-table.ts) carries the same figures.
 *
 * Deep links: "#data-<figure id>" opens the explorer filtered to that figure.
 */
import { useEffect, useMemo, useState } from "react";
import { Download, Link2, Search } from "lucide-react";

import { FIGURES } from "../../lib/data/figures";
import { formatFigure } from "../../lib/data/format";
import type { Figure } from "../../lib/data/schema";
import { tierWord } from "../../data/types";

const STATE_WORD: Record<Figure["state"], string> = {
  sourced: "Sourced",
  modelled: "Modelled",
  target: "Target",
  needed: "Needed",
};

/** Topic: the figure id's first part, in words. */
const TOPIC_WORD: Record<string, string> = {
  ward: "Wards", con: "Constituencies", register: "Register", result: "Election results", census: "Census",
  budget: "County budget", audit: "Audit", target: "Targets", reach: "Reach", segment: "Segments",
  ict: "Connectivity", zone: "Zones", path: "Routes to the benchmark", benchmark: "Benchmark", channel: "Channels",
  effort: "Effort", livestock: "Livestock", water: "Water", food: "Food security", health: "Health",
  record: "His record", scorecard: "County scorecard", policy: "Policy proposals", ngcdf: "NG-CDF",
};
const topicOf = (id: string) => id.split(".")[0];
const topicWord = (t: string) => TOPIC_WORD[t] ?? t.charAt(0).toUpperCase() + t.slice(1).replace(/-/g, " ");

function printed(f: Figure): string {
  if (f.value === null) return "Not in hand";
  const v = formatFigure(f);
  if (f.unit === "percent") return `${v}%`;
  if (f.unit === "ksh") return `KSh ${v}`;
  return v;
}

const UNIT_WORD: Record<string, string> = { voters: "voters", votes: "votes", people: "people", households: "households", count: "count", percent: "%", ksh: "KSh", km2: "km²", "per-km2": "per km²", persons: "persons" };

const csvCell = (v: string | number | null | undefined) => {
  const s = v === null || v === undefined ? "" : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

export function DataExplorer() {
  const all = useMemo(() => Object.values(FIGURES).sort((a, b) => a.id.localeCompare(b.id)), []);
  const topics = useMemo(() => [...new Set(all.map((f) => topicOf(f.id)))].sort((a, b) => topicWord(a).localeCompare(topicWord(b))), [all]);
  const [q, setQ] = useState("");
  const [topic, setTopic] = useState("");
  const [tier, setTier] = useState("");
  const [state, setState] = useState("");
  const [limit, setLimit] = useState(50);
  /** Set by a "#data-<id>" link: that one figure, exactly, until the reader searches again. */
  const [exact, setExact] = useState<string | null>(null);

  // "#data-register.2022" opens the explorer on that figure.
  useEffect(() => {
    const read = () => {
      const h = decodeURIComponent(window.location.hash.slice(1));
      if (h.startsWith("data-") && FIGURES[h.slice(5)]) {
        setQ(h.slice(5));
        setExact(h.slice(5));
        setTopic("");
        setTier("");
        setState("");
        document.getElementById("data-explorer")?.scrollIntoView({ block: "start" });
      }
    };
    read();
    window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
  }, []);

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return all.filter((f) => {
      if (exact) return f.id === exact;
      if (topic && topicOf(f.id) !== topic) return false;
      if (tier && (tier === "none" ? f.tier !== null : f.tier !== tier)) return false;
      if (state && f.state !== state) return false;
      if (!needle) return true;
      return [f.id, f.source ?? "", f.note ?? "", printed(f)].some((t) => t.toLowerCase().includes(needle));
    });
  }, [all, q, topic, tier, state, exact]);

  function download() {
    const head = ["id", "value", "unit", "printed", "reliability", "state", "source", "as_of", "note"];
    const lines = all.map((f) => [f.id, f.value, f.unit, printed(f), f.tier ? tierWord(f.tier) : "", STATE_WORD[f.state], f.source, f.asOf, f.note].map(csvCell).join(","));
    const blob = new Blob([[head.join(","), ...lines].join("\n") + "\n"], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "kitui-2027-registry.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  const shown = rows.slice(0, limit);
  const select = "min-h-11 rounded-lg border border-line bg-card px-3 t-small text-ink";
  return (
    <section id="data-explorer" aria-label="Data explorer" className="not-prose my-6 rounded-2xl border border-line bg-card print:hidden">
      <div className="space-y-3 border-b border-line p-4 sm:p-5">
        <div className="flex items-baseline justify-between gap-3">
          <h4 className="font-serif t-body font-bold text-ink">Data explorer</h4>
          <button type="button" onClick={download} className="inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-line px-3 t-small font-semibold text-accent hover:bg-paper">
            <Download size={14} aria-hidden="true" /> Download all ({all.length}) as CSV
          </button>
        </div>
        <p className="t-small text-muted">Every figure the proposal prints, read from the same registry as the prose. Search by name, source or value; filter by topic, reliability and state.</p>
        <label className="relative block">
          <span className="sr-only">Search figures</span>
          <Search size={15} aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input type="search" value={q} onChange={(e) => { setQ(e.target.value); setExact(null); setLimit(50); }} placeholder="Search: ward, register, budget, IEBC…" className="min-h-11 w-full rounded-lg border border-line bg-paper py-2 pl-9 pr-3 t-small text-ink" />
        </label>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          <label className="grid gap-1 t-micro text-muted">Topic
            <select value={topic} onChange={(e) => { setTopic(e.target.value); setExact(null); setLimit(50); }} className={select}>
              <option value="">All topics</option>
              {topics.map((t) => <option key={t} value={t}>{topicWord(t)}</option>)}
            </select>
          </label>
          <label className="grid gap-1 t-micro text-muted">Reliability
            <select value={tier} onChange={(e) => { setTier(e.target.value); setExact(null); setLimit(50); }} className={select}>
              <option value="">Any</option>
              <option value="T1">{tierWord("T1")}</option>
              <option value="T2">{tierWord("T2")}</option>
              <option value="T3">{tierWord("T3")}</option>
              <option value="none">Not applicable (targets)</option>
            </select>
          </label>
          <label className="grid gap-1 t-micro text-muted">State
            <select value={state} onChange={(e) => { setState(e.target.value); setExact(null); setLimit(50); }} className={select}>
              <option value="">Any</option>
              {(Object.keys(STATE_WORD) as Figure["state"][]).map((s) => <option key={s} value={s}>{STATE_WORD[s]}</option>)}
            </select>
          </label>
        </div>
        <p className="t-micro text-muted" aria-live="polite">{rows.length === all.length ? `All ${all.length} figures` : `${rows.length} figures match, from ${all.length}`}</p>
      </div>

      <ul className="divide-y divide-line">
        {shown.map((f) => (
          <li key={f.id} id={`data-${f.id}`} className="grid gap-1 px-4 py-3 sm:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)_minmax(0,1.6fr)] sm:gap-4 sm:px-5">
            <div className="min-w-0">
              <a href={`#data-${f.id}`} className="inline-flex items-center gap-1 font-mono t-micro text-accent break-all" title="Link to this figure">
                <Link2 size={12} aria-hidden="true" /> {f.id}
              </a>
              <p className="t-micro text-muted">{topicWord(topicOf(f.id))}</p>
            </div>
            <div>
              <p className="font-mono t-small font-bold tabular-nums text-ink">{printed(f)}</p>
              <p className="t-micro text-muted">{UNIT_WORD[f.unit] ?? f.unit}</p>
            </div>
            <div className="min-w-0 t-micro text-ink">
              <p>{f.source ?? f.closesWith ?? "—"}</p>
              <p className="mt-0.5 text-muted">
                {f.tier ? tierWord(f.tier) : "No reliability grade (a target)"} · {STATE_WORD[f.state]}{f.asOf ? ` · as of ${f.asOf}` : ""}
              </p>
              {f.note && <p className="mt-0.5 text-muted">{f.note}</p>}
            </div>
          </li>
        ))}
      </ul>
      {rows.length > limit && (
        <div className="border-t border-line p-4 text-center">
          <button type="button" onClick={() => setLimit((n) => n + 100)} className="min-h-11 rounded-lg border border-line px-4 t-small font-semibold text-accent hover:bg-paper">
            Show more ({rows.length - limit} left)
          </button>
        </div>
      )}
    </section>
  );
}
