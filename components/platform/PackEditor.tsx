"use client";

/**
 * The data editor's forms. Each one builds an edit, checks it with the data pack's own rules
 * (lib/data/rules.ts, the code `npm run verify` runs) before sending, and sends it to the server,
 * which checks it again, commits it to its own branch, and lets the full checks decide whether it
 * goes live. Built for a phone: pick, change, save.
 */
import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { savePackEdit } from "@/app/(platform)/actions";
import { figureProblems, wardRegisterProblems } from "@/lib/data/rules";
import type { Figure, FigureState, Tier, Unit } from "@/lib/data/schema";
import type { Target } from "@/lib/platform/pack";

type FigureRow = { id: string; value: number | null; state: FigureState; tier: Tier | null; source: string | null; asOf: string | null; note: string | null; closesWith: string | null; unit: Unit; decimals: number | null; alt: Figure["alt"] | null };
export interface PackEditorData {
  mode: "github" | "local" | "off";
  figures: FigureRow[];
  register: { name: string; voters: number; wards: { name: string; voters: number }[] }[];
  lists: { id: string; label: string; key: string; fields: { key: string; type: "string" | "number" }[]; choices: Record<string, (string | number)[]>; records: Record<string, unknown>[] }[];
  analysis: { file: string; title: string; rows: Record<string, unknown>[] }[];
}

const TABS = ["Figures", "Register", "Strategy lists", "Analysis"] as const;
const STATES: FigureState[] = ["sourced", "modelled", "needed", "target"];
const TIER_WORD: Record<string, string> = { T1: "Official", T2: "Reported", T3: "Unconfirmed" };
const UNITS: Unit[] = ["voters", "votes", "people", "households", "count", "percent", "ksh", "km2", "per-km2", "persons"];

function useSubmit() {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [result, setResult] = useState<{ ok: boolean; text: string } | null>(null);
  const submit = (t: Target, problems: string[] = []) => {
    if (problems.length) { setResult({ ok: false, text: problems.join(" ") }); return; }
    start(async () => {
      const r = await savePackEdit(t);
      setResult(r.ok ? { ok: true, text: r.message } : { ok: false, text: Object.values(r.errors).join(" ") });
      router.refresh();
    });
  };
  const Result = () => (result ? <p role={result.ok ? "status" : "alert"} className={`rounded-xl border p-3 text-[0.9rem] ${result.ok ? "border-line bg-paper" : "border-danger/40 bg-danger/5 text-danger"}`}>{result.text}</p> : null);
  return { submit, pending, Result, reset: () => setResult(null) };
}

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className="pf-label">{label}</span>
      {children}
      {hint && <span className="pf-hint block">{hint}</span>}
    </label>
  );
}

/* ------------------------------------------------------------------ figures */

function toFigure(r: FigureRow): Figure {
  const f: Record<string, unknown> = { id: r.id, value: r.value, unit: r.unit, tier: r.tier, state: r.state, source: r.source };
  for (const k of ["note", "asOf", "closesWith"] as const) if (r[k]) f[k] = r[k];
  if (r.decimals !== null) f.decimals = r.decimals;
  if (r.alt) f.alt = r.alt;
  return f as unknown as Figure;
}

function FigureEditor({ figures }: { figures: FigureRow[] }) {
  const [q, setQ] = useState("");
  const [pick, setPick] = useState<FigureRow | null>(null);
  const [draft, setDraft] = useState<FigureRow | null>(null);
  const [adding, setAdding] = useState(false);
  const { submit, pending, Result, reset } = useSubmit();
  const matches = useMemo(() => {
    const t = q.toLowerCase().split(/\s+/).filter(Boolean);
    if (!t.length) return [];
    return figures.filter((f) => t.every((x) => `${f.id} ${f.source ?? ""} ${f.note ?? ""}`.toLowerCase().includes(x))).slice(0, 12);
  }, [q, figures]);
  const choose = (f: FigureRow) => { setPick(f); setDraft({ ...f }); setAdding(false); reset(); };
  const startAdd = () => { setPick(null); setAdding(true); reset(); setDraft({ id: "", value: null, state: "sourced", tier: "T1", source: "", asOf: "", note: "", closesWith: "", unit: "count", decimals: null, alt: null }); };
  const set = (k: keyof FigureRow, v: unknown) => setDraft((d) => (d ? { ...d, [k]: v } : d));
  const problems = draft ? figureProblems(draft.id || "new", toFigure({ ...draft, value: draft.value === null || String(draft.value) === "" ? null : Number(String(draft.value).replace(/[,\s]/g, "")) })).map((p) => p.plain) : [];

  const save = () => {
    if (!draft) return;
    const value = draft.value === null || String(draft.value) === "" ? null : Number(String(draft.value).replace(/[,\s]/g, ""));
    if (adding) return submit({ kind: "figure-add", figure: toFigure({ ...draft, value, id: draft.id.trim() }) }, problems);
    const patch: Record<string, unknown> = {};
    for (const k of ["value", "state", "tier", "source", "asOf", "note", "closesWith"] as const) {
      const now = k === "value" ? value : draft[k] || null;
      const was = pick![k] ?? null;
      if (String(now ?? "") !== String(was ?? "")) patch[k] = now ?? "";
    }
    if (!Object.keys(patch).length) return submit({ kind: "figure", id: draft.id, patch: {} }, ["Nothing has changed yet."]);
    submit({ kind: "figure", id: draft.id, patch: patch as Partial<Figure> }, problems);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <label className="relative min-w-0 flex-1 basis-60">
          <span className="sr-only">Find a figure</span>
          <Search aria-hidden size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input type="search" className="pf-input pl-9" placeholder="Find a figure by id, source or note" value={q} onChange={(e) => setQ(e.target.value)} />
        </label>
        <button type="button" className="pf-btn" onClick={startAdd}>Add a new figure</button>
      </div>
      {matches.length > 0 && (
        <ul className="pf-card divide-y divide-line overflow-hidden">
          {matches.map((f) => (
            <li key={f.id}>
              <button type="button" className="block w-full px-4 py-2.5 text-left hover:bg-paper" onClick={() => { choose(f); setQ(""); }}>
                <span className="block font-mono text-[0.8rem] text-ink">{f.id}</span>
                <span className="block truncate text-[0.78rem] text-muted">{f.value === null ? "Needed" : f.value.toLocaleString("en-KE")} {f.unit} · {f.source}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
      {draft && (
        <div className="pf-card space-y-4 p-4 sm:p-5">
          <p className="font-serif text-lg">{adding ? "New figure" : <span className="font-mono text-[0.95rem]">{draft.id}</span>}</p>
          {adding && (
            <>
              <Field label="Id" hint="Lowercase words joined by dots, such as reach.mwingi-north.2027. It is how the story cites the figure.">
                <input className="pf-input font-mono" value={draft.id} onChange={(e) => set("id", e.target.value)} />
              </Field>
              <Field label="Unit">
                <select className="pf-input" value={draft.unit} onChange={(e) => set("unit", e.target.value)}>{UNITS.map((u) => <option key={u}>{u}</option>)}</select>
              </Field>
            </>
          )}
          <Field label="What kind of figure">
            <select className="pf-input" value={draft.state} onChange={(e) => set("state", e.target.value)}>
              {STATES.map((s) => <option key={s} value={s}>{s === "sourced" ? "Sourced: read from a document" : s === "modelled" ? "Modelled: calculated" : s === "needed" ? "Needed: not in hand yet" : "Target: a commitment"}</option>)}
            </select>
          </Field>
          <Field label={`Value${draft.unit ? ` (${draft.unit})` : ""}`} hint="Digits only. Leave empty for a needed figure.">
            <input className="pf-input tabular-nums" inputMode="decimal" value={draft.value === null ? "" : String(draft.value)} onChange={(e) => set("value", e.target.value === "" ? null : e.target.value)} />
          </Field>
          <Field label="Reliability">
            <select className="pf-input" value={draft.tier ?? ""} onChange={(e) => set("tier", e.target.value || null)}>
              <option value="">None (a target or needed figure)</option>
              {Object.entries(TIER_WORD).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </Field>
          <Field label="Source document"><input className="pf-input" value={draft.source ?? ""} onChange={(e) => set("source", e.target.value)} /></Field>
          <Field label="As of" hint="The date of the measurement, such as 2026-09."><input className="pf-input" value={draft.asOf ?? ""} onChange={(e) => set("asOf", e.target.value)} /></Field>
          <Field label="Note" hint="How a modelled figure was calculated, or what a target commits to."><textarea className="pf-input min-h-20" value={draft.note ?? ""} onChange={(e) => set("note", e.target.value)} /></Field>
          {draft.state === "needed" && <Field label="The document that would supply it"><input className="pf-input" value={draft.closesWith ?? ""} onChange={(e) => set("closesWith", e.target.value)} /></Field>}
          {problems.length > 0 && <ul className="space-y-1 text-[0.85rem] text-danger" role="alert">{problems.map((p) => <li key={p}>{p}</li>)}</ul>}
          <Result />
          <button type="button" className="pf-btn pf-btn-solid" disabled={pending || problems.length > 0} onClick={save}>{pending ? "Submitting…" : "Submit edit"}</button>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ register */

function RegisterEditor({ register }: { register: PackEditorData["register"] }) {
  const [c, setC] = useState(register[0]?.name ?? "");
  const con = register.find((x) => x.name === c)!;
  const [ward, setWard] = useState("");
  const [voters, setVoters] = useState("");
  const [totals, setTotals] = useState(true);
  const { submit, pending, Result, reset } = useSubmit();
  const w = con?.wards.find((x) => x.name === ward);
  const n = Number(voters.replace(/[,\s]/g, ""));
  const problems: string[] = [];
  if (w && voters !== "" && (!Number.isInteger(n) || n < 0)) problems.push("Registered voters must be a whole number.");
  if (w && voters !== "" && !totals && !problems.length) {
    const reg = { prisonVoters: 0, countyTotalWards: 0, countyTotalWithPrisons: 0, constituencies: [{ name: con.name, voters: con.voters, wards: con.wards.map((x) => (x.name === w.name ? { ...x, voters: n } : x)) }] };
    problems.push(...wardRegisterProblems(reg).filter((p) => p.plain.startsWith("The wards of")).map((p) => p.plain));
  }
  return (
    <div className="pf-card space-y-4 p-4 sm:p-5">
      <Field label="Constituency">
        <select className="pf-input" value={c} onChange={(e) => { setC(e.target.value); setWard(""); setVoters(""); reset(); }}>{register.map((x) => <option key={x.name}>{x.name}</option>)}</select>
      </Field>
      <Field label="Ward">
        <select className="pf-input" value={ward} onChange={(e) => { setWard(e.target.value); setVoters(String(con.wards.find((x) => x.name === e.target.value)?.voters ?? "")); reset(); }}>
          <option value="">Choose…</option>
          {con?.wards.map((x) => <option key={x.name} value={x.name}>{x.name} · {x.voters.toLocaleString("en-KE")}</option>)}
        </select>
      </Field>
      {w && (
        <>
          <Field label="Registered voters"><input className="pf-input tabular-nums" inputMode="numeric" value={voters} onChange={(e) => setVoters(e.target.value)} /></Field>
          <label className="flex items-start gap-3 text-[0.9rem]">
            <input type="checkbox" className="mt-1 h-5 w-5" checked={totals} onChange={(e) => setTotals(e.target.checked)} />
            <span>Update the {con.name} total and the county totals to match. Leave this on unless the published totals themselves say otherwise.</span>
          </label>
        </>
      )}
      {problems.length > 0 && <p className="text-[0.85rem] text-danger" role="alert">{problems.join(" ")}</p>}
      <Result />
      <button type="button" className="pf-btn pf-btn-solid" disabled={!w || pending || problems.length > 0 || voters === ""} onClick={() => submit({ kind: "ward", constituency: con.name, ward: w!.name, voters: n, updateTotals: totals })}>{pending ? "Submitting…" : "Submit edit"}</button>
    </div>
  );
}

/* ------------------------------------------------------------------ lists */

function ListEditor({ lists }: { lists: PackEditorData["lists"] }) {
  const [id, setId] = useState(lists[0]?.id ?? "");
  const l = lists.find((x) => x.id === id)!;
  const [key, setKey] = useState("");
  const [draft, setDraft] = useState<Record<string, unknown>>({});
  const { submit, pending, Result, reset } = useSubmit();
  const isNew = key === "__new";
  const rec = l.records.find((r) => String(r[l.key]) === key);
  const pickRec = (k: string) => { setKey(k); reset(); setDraft(k === "__new" ? { [l.key]: "" } : { ...(l.records.find((r) => String(r[l.key]) === k) ?? {}) }); };
  const save = () => {
    if (isNew) return submit({ kind: "list-add", list: l.id, record: Object.fromEntries(Object.entries(draft).filter(([, v]) => v !== "" && v !== null)) });
    const patch = Object.fromEntries(l.fields.filter((f) => String(draft[f.key] ?? "") !== String(rec?.[f.key] ?? "")).map((f) => [f.key, f.type === "number" ? (draft[f.key] === "" || draft[f.key] === null ? null : Number(draft[f.key])) : draft[f.key]]));
    if (!Object.keys(patch).length) return submit({ kind: "list", list: l.id, key, patch }, ["Nothing has changed yet."]);
    submit({ kind: "list", list: l.id, key, patch });
  };
  return (
    <div className="pf-card space-y-4 p-4 sm:p-5">
      <Field label="List">
        <select className="pf-input" value={id} onChange={(e) => { setId(e.target.value); setKey(""); reset(); }}>{lists.map((x) => <option key={x.id} value={x.id}>{x.label}</option>)}</select>
      </Field>
      <Field label="Record">
        <select className="pf-input" value={key} onChange={(e) => pickRec(e.target.value)}>
          <option value="">Choose…</option>
          {l.records.map((r) => <option key={String(r[l.key])} value={String(r[l.key])}>{String(r[l.key])}</option>)}
          <option value="__new">Add a new record</option>
        </select>
      </Field>
      {(rec || isNew) && (
        <>
          {isNew && <Field label={l.key}><input className="pf-input" value={String(draft[l.key] ?? "")} onChange={(e) => setDraft((d) => ({ ...d, [l.key]: e.target.value }))} /></Field>}
          {l.fields.map((f) => (
            <Field key={f.key} label={f.key}>
              {l.choices[f.key] ? (
                <select className="pf-input" value={String(draft[f.key] ?? "")} onChange={(e) => setDraft((d) => ({ ...d, [f.key]: f.type === "number" ? Number(e.target.value) : e.target.value }))}>
                  <option value="">Choose…</option>
                  {l.choices[f.key].map((o) => <option key={String(o)} value={String(o)}>{String(o)}</option>)}
                </select>
              ) : f.type === "number" ? (
                <input className="pf-input tabular-nums" inputMode="decimal" value={draft[f.key] === null || draft[f.key] === undefined ? "" : String(draft[f.key])} onChange={(e) => setDraft((d) => ({ ...d, [f.key]: e.target.value === "" ? null : e.target.value }))} />
              ) : String(draft[f.key] ?? "").length > 70 ? (
                <textarea className="pf-input min-h-24" value={String(draft[f.key] ?? "")} onChange={(e) => setDraft((d) => ({ ...d, [f.key]: e.target.value }))} />
              ) : (
                <input className="pf-input" value={String(draft[f.key] ?? "")} onChange={(e) => setDraft((d) => ({ ...d, [f.key]: e.target.value }))} />
              )}
            </Field>
          ))}
          <Result />
          <button type="button" className="pf-btn pf-btn-solid" disabled={pending} onClick={save}>{pending ? "Submitting…" : "Submit edit"}</button>
        </>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ analysis */

function AnalysisEditor({ analysis }: { analysis: PackEditorData["analysis"] }) {
  const [file, setFile] = useState(analysis[0]?.file ?? "");
  const a = analysis.find((x) => x.file === file)!;
  const [idx, setIdx] = useState<number | null>(null);
  const [draft, setDraft] = useState<Record<string, unknown>>({});
  const { submit, pending, Result, reset } = useSubmit();
  const row = idx === null ? null : a.rows[idx];
  const fields = ["value", "note", "as_of", "status", "method", "tier", "source_id"];
  const save = () => {
    const patch = Object.fromEntries(fields.filter((k) => String(draft[k] ?? "") !== String(row?.[k] ?? "")).map((k) => [k, draft[k]]));
    if (!Object.keys(patch).length) return submit({ kind: "analysis", file, index: idx!, patch }, ["Nothing has changed yet."]);
    submit({ kind: "analysis", file, index: idx!, patch });
  };
  return (
    <div className="pf-card space-y-4 p-4 sm:p-5">
      <p className="text-[0.85rem] text-muted">These are the analysis model&apos;s published outputs. Firefly re-runs the model; tell Firefly when you change one, so the next run keeps it.</p>
      <Field label="Analysis">
        <select className="pf-input" value={file} onChange={(e) => { setFile(e.target.value); setIdx(null); reset(); }}>{analysis.map((x) => <option key={x.file} value={x.file}>{x.title}</option>)}</select>
      </Field>
      <Field label="Row">
        <select className="pf-input" value={idx ?? ""} onChange={(e) => { const i = e.target.value === "" ? null : Number(e.target.value); setIdx(i); setDraft(i === null ? {} : { ...a.rows[i] }); reset(); }}>
          <option value="">Choose…</option>
          {a.rows.map((r) => <option key={String(r.index)} value={String(r.index)}>{String(r.label)}</option>)}
        </select>
      </Field>
      {row && (
        <>
          {fields.map((k) => (
            <Field key={k} label={k.replace("_", " ")}>
              {k === "status" || k === "method" || k === "tier" ? (
                <select className="pf-input" value={String(draft[k] ?? "")} onChange={(e) => setDraft((d) => ({ ...d, [k]: e.target.value }))}>
                  {(k === "status" ? ["confirmed", "verify", "placeholder"] : k === "method" ? ["official", "calculated", "modelled"] : ["1", "2", "3"]).map((o) => (
                    <option key={o} value={o}>{k === "tier" ? ["Official", "Reported", "Unconfirmed"][Number(o) - 1] : o}</option>
                  ))}
                </select>
              ) : (
                <input className="pf-input" inputMode={k === "value" ? "decimal" : undefined} value={draft[k] === null || draft[k] === undefined ? "" : String(draft[k])} onChange={(e) => setDraft((d) => ({ ...d, [k]: e.target.value }))} />
              )}
            </Field>
          ))}
          <Result />
          <button type="button" className="pf-btn pf-btn-solid" disabled={pending} onClick={save}>{pending ? "Submitting…" : "Submit edit"}</button>
        </>
      )}
    </div>
  );
}

export function PackEditor({ data }: { data: PackEditorData }) {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Figures");
  return (
    <div>
      {data.mode === "off" && <p className="mb-4 rounded-xl border border-line bg-card p-3 text-[0.85rem] text-muted">Data editing is not switched on yet: Firefly has not connected the site to GitHub. Edits will be refused until it is.</p>}
      <div className="mb-4 flex gap-1 overflow-x-auto" role="tablist">
        {TABS.map((t) => (
          <button key={t} type="button" role="tab" aria-selected={tab === t} onClick={() => setTab(t)} className={`flex-none rounded-full px-3.5 py-2 text-[0.85rem] ${tab === t ? "bg-accent-solid text-on-accent" : "border border-line bg-card text-ink"}`}>{t}</button>
        ))}
      </div>
      {tab === "Figures" && <FigureEditor figures={data.figures} />}
      {tab === "Register" && <RegisterEditor register={data.register} />}
      {tab === "Strategy lists" && <ListEditor lists={data.lists} />}
      {tab === "Analysis" && <AnalysisEditor analysis={data.analysis} />}
      <p className="mt-6 text-[0.82rem] text-muted">After you submit, the site&apos;s full data checks run. If they pass, the change is live in a few minutes; if not, it is refused and nothing on the site changes. Follow it, or revert it, in <Link href="/history" className="text-accent">Changes</Link>.</p>
    </div>
  );
}
