"use client";

import { tierWord } from "../../lib/tier-word";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowLeft, Search, ShieldCheck } from "lucide-react";
import { PROJECTS, PROJECTS_EXPORT, WARDS, WARD_NAME, type ProjectLevel, type ProjectRow } from "@/data/projects";

/**
 * The service-delivery tracker's opening register (§15.1.1): every project the county's
 * scorecard itemises, filterable by constituency, ward, sector and status (visual brief V1.3).
 *
 * It shows what the scorecard prints — title, cost, place, status, the printed beneficiary
 * count — and nothing about any person. A project lands on a ward only where Stage 14 could
 * place it without guessing; the rest say why they did not.
 */

const ALL = "All";
const NO_SINGLE_WARD = "no-single-ward";
const PAGE = 40;

const LEVEL_LABEL: Record<ProjectLevel, string> = {
  ward: "",
  multi_ward: "Several wards",
  conflict: "Ward outside its constituency",
  constituency: "No single ward",
  county: "County-wide or HQ",
};

const ksh = (n: number) => `KSh ${new Intl.NumberFormat("en-KE", { maximumFractionDigits: 0 }).format(n)}`;
const kshShort = (n: number) =>
  n >= 1e9 ? `KSh ${(n / 1e9).toFixed(2)}bn` : `KSh ${(n / 1e6).toFixed(1)}m`;
const count = (n: number) => new Intl.NumberFormat("en-KE").format(n);
const sorted = (xs: Iterable<string>) => [...new Set(xs)].sort((a, b) => a.localeCompare(b));

function placeOf(p: ProjectRow): string {
  if (p.level === "ward") return WARD_NAME[p.wards[0]];
  if (p.wards.length > 0) return `${LEVEL_LABEL[p.level]}: ${p.wards.map((w) => WARD_NAME[w]).join(", ")}`;
  return LEVEL_LABEL[p.level];
}

function Select({ label, value, onChange, options }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="flex min-w-0 flex-col gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-white/10 bg-[#0b1526] px-3 py-2.5 text-sm font-normal normal-case tracking-normal text-slate-100 outline-none focus-visible:border-cyan-300/60"
      >
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </label>
  );
}

function Row({ p }: { p: ProjectRow }) {
  const unconfirmed = p.provenance.status === "verify";
  return (
    <li className="rounded-2xl border border-white/10 bg-white/[0.035] p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-2">
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-semibold leading-snug text-white">{p.title}</h3>
          <p className="mt-1.5 text-sm text-slate-400">
            {p.sector} · {p.constituency === "All/HQ" ? "All/HQ" : p.constituency} · <span className={p.level === "ward" ? "text-slate-200" : "text-amber-200"}>{placeOf(p)}</span>
          </p>
        </div>
        <div className="text-right">
          <p className="font-mono text-base tabular-nums text-white">{ksh(p.amount)}</p>
          <p className="mt-1 text-xs text-slate-400">County says: <span className="text-slate-200">{p.status}</span></p>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2 text-[0.7rem] text-slate-400">
        <span className="rounded-full border border-white/20 px-2 py-0.5 font-semibold text-slate-200">{tierWord(p.provenance.tier)}</span>
        <span>{p.provenance.method} · as of {p.provenance.as_of} · {p.provenance.source_id}, p. {p.page}</span>
        {unconfirmed && (
          <span className="rounded-full border border-dashed border-amber-300/60 px-2 py-0.5 font-semibold text-amber-200">
            Unconfirmed ward match
          </span>
        )}
      </div>
      <details className="mt-3 text-sm text-slate-400">
        <summary className="cursor-pointer text-xs font-semibold text-slate-300 hover:text-cyan-200">As printed</summary>
        <p className="mt-2 break-words font-mono text-xs leading-5 text-slate-400">{p.asPrinted}</p>
        <p className="mt-2 text-xs text-slate-500">Ward match: {p.match}</p>
      </details>
    </li>
  );
}

export function ProjectsRegister() {
  const [constituency, setConstituency] = useState(ALL);
  const [ward, setWard] = useState(ALL);
  const [sector, setSector] = useState(ALL);
  const [status, setStatus] = useState(ALL);
  const [query, setQuery] = useState("");
  const [shown, setShown] = useState(PAGE);

  const constituencies = useMemo(() => sorted(PROJECTS.map((p) => p.constituency)), []);
  const sectors = useMemo(() => sorted(PROJECTS.map((p) => p.sector)), []);
  const statuses = useMemo(() => sorted(PROJECTS.map((p) => p.status)), []);
  const wardOptions = useMemo(
    () => WARDS.filter((w) => constituency === ALL || w.constituency === constituency).sort((a, b) => a.name.localeCompare(b.name)),
    [constituency]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PROJECTS.filter((p) =>
      (constituency === ALL || p.constituency === constituency) &&
      (ward === ALL || (ward === NO_SINGLE_WARD ? p.level !== "ward" : p.wards.includes(ward))) &&
      (sector === ALL || p.sector === sector) &&
      (status === ALL || p.status === status) &&
      (q === "" || `${p.title} ${p.asPrinted}`.toLowerCase().includes(q))
    );
  }, [constituency, ward, sector, status, query]);

  const total = filtered.reduce((n, p) => n + p.amount, 0);
  const onOneWard = filtered.filter((p) => p.level === "ward").length;
  const unconfirmed = filtered.filter((p) => p.provenance.status === "verify").length;
  const reset = (fn: (v: string) => void) => (v: string) => { fn(v); setShown(PAGE); };

  return (
    <main className="min-h-screen bg-[#060d1a] text-slate-100">
      <div className="mx-auto max-w-5xl px-4 pb-20 pt-6 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between gap-4 border-b border-white/10 pb-5">
          <Link href="/tools" className="inline-flex items-center gap-2 font-serif text-lg text-white">
            <ArrowLeft size={16} aria-hidden="true" /> Kitui 2027 <span className="font-sans text-xs text-slate-400">/ toolkit</span>
          </Link>
        </header>

        <section className="py-12 sm:py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300">Ground &amp; field</p>
          <h1 className="mt-4 max-w-3xl font-serif text-4xl leading-[1.02] tracking-tight text-white sm:text-6xl">Service-delivery tracker</h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300">
            Every project the county&rsquo;s scorecard itemises, with its printed cost, place and status. A record of what the county claims, not evidence that the claims are true.
          </p>
        </section>

        <section aria-label="Filters" className="grid gap-4 rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4 sm:grid-cols-2 sm:p-5 lg:grid-cols-4">
          <Select
            label="Constituency"
            value={constituency}
            onChange={(v) => { reset(setConstituency)(v); setWard(ALL); }}
            options={[{ value: ALL, label: "All constituencies" }, ...constituencies.map((c) => ({ value: c, label: c }))]}
          />
          <Select
            label="Ward"
            value={ward}
            onChange={reset(setWard)}
            options={[
              { value: ALL, label: "All wards" },
              ...wardOptions.map((w) => ({ value: w.slug, label: w.name })),
              { value: NO_SINGLE_WARD, label: "Not placed on one ward" },
            ]}
          />
          <Select label="Sector" value={sector} onChange={reset(setSector)} options={[{ value: ALL, label: "All sectors" }, ...sectors.map((s) => ({ value: s, label: s }))]} />
          <Select label="Status, as printed" value={status} onChange={reset(setStatus)} options={[{ value: ALL, label: "All statuses" }, ...statuses.map((s) => ({ value: s, label: s }))]} />
          <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#0b1526] px-3 py-2.5 text-sm text-slate-300 sm:col-span-2 lg:col-span-4">
            <Search size={16} aria-hidden="true" />
            <span className="sr-only">Search projects</span>
            <input value={query} onChange={(event) => reset(setQuery)(event.target.value)} placeholder="Search titles and villages" className="w-full bg-transparent outline-none placeholder:text-slate-500" />
          </label>
        </section>

        <section aria-live="polite" className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            ["Projects", count(filtered.length)],
            ["Printed cost", kshShort(total)],
            ["On one ward", count(onOneWard)],
            ["Unconfirmed match", count(unconfirmed)],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl bg-black/20 p-4">
              <p className="text-[0.68rem] uppercase tracking-[0.18em] text-slate-400">{label}</p>
              <p className="mt-2 font-mono text-xl tabular-nums text-white sm:text-2xl">{value}</p>
            </div>
          ))}
        </section>

        <ul className="mt-6 space-y-3">
          {filtered.slice(0, shown).map((p) => <Row key={p.id} p={p} />)}
        </ul>
        {filtered.length === 0 && (
          <div className="mt-6 rounded-2xl border border-dashed border-white/15 p-10 text-center text-slate-400">No projects match these filters.</div>
        )}
        {filtered.length > shown && (
          <button
            type="button"
            onClick={() => setShown((n) => n + PAGE)}
            className="mx-auto mt-6 block rounded-full border border-white/15 px-5 py-2.5 text-sm font-semibold text-slate-200 hover:border-cyan-300/50 hover:text-cyan-200"
          >
            Show more ({count(filtered.length - shown)} left)
          </button>
        )}

        <footer className="mt-12 space-y-2 border-t border-white/10 pt-6 text-xs leading-5 text-slate-400">
          <p className="flex items-start gap-2">
            <ShieldCheck size={14} className="mt-0.5 shrink-0 text-cyan-300" aria-hidden="true" />
            <span>
              Source: County Government of Kitui, <em>Delivering the Kitui Promise: Three-Year Scorecard</em> (Aug 2022 – Aug 2025), the itemised tables. Tier 1 as a record of the county&rsquo;s claims. Costs as printed; totals are Firefly arithmetic on them.
            </span>
          </p>
          <p>
            Ward placement: analysis Stage 14. A project is placed on a ward only when its printed place names one ward in its own constituency. &ldquo;Unconfirmed ward match&rdquo; marks a match through a spelling Firefly has yet to confirm. Ward codes: open-admin-data, CC BY 4.0. Data as of {PROJECTS_EXPORT.data_as_of}; <a href="/content/analysis/projects-register.json" className="underline decoration-white/30 hover:text-cyan-200">download the JSON</a>.
          </p>
        </footer>
      </div>
    </main>
  );
}
