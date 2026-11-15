"use client";

import React, { Suspense, useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import {
  ArrowUpRight, Check, ChevronDown, Database, ExternalLink, Hand, History, Keyboard, MousePointerClick, MoveHorizontal,
  PenLine, Plus, Radio, Sparkles, Table2,
} from "lucide-react";
import { embedsAt, type PackChart } from "@/lib/story/embeds";
import type { ToolMeta } from "@/lib/tools/meta";
import type { Tool } from "@/lib/tools/catalog";
import type { Bar } from "@/components/platform/Bars";
import { WorkspaceCollection } from "@/components/platform/WorkspaceCollection";
import { ago, useLive } from "./useLive";
import { useReveal } from "./useReveal";
import { Countdown } from "./Countdown";
import { AskWindow, DeliverablesMap, LanguagePicker, Paradox, PhaseNow, ProofStack, RoleLens } from "./Visuals";
import type { StoryVisual } from "@/lib/story/embeds";

const VISUAL: Record<StoryVisual, () => React.ReactNode> = {
  proof: () => <ProofStack />, paradox: () => <Paradox />, ask: () => <AskWindow />, roles: () => <RoleLens />,
  languages: () => <LanguagePicker />, deliverables: () => <DeliverablesMap />, "phase-now": () => <PhaseNow />,
};

/* ------------------------------------------------------------------ shared pieces */

const GESTURE: Record<ToolMeta["gesture"], { word: string; Icon: typeof Hand }> = {
  drag: { word: "Drag to try", Icon: MoveHorizontal },
  tap: { word: "Tap to try", Icon: MousePointerClick },
  type: { word: "Type to try", Icon: Keyboard },
  swipe: { word: "Swipe to try", Icon: Hand },
};

/** A pointing hand, drawn so its animation can follow the gesture (drag, tap, type, swipe). */
function Pointer() {
  return (
    <svg className="sx-hand" viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">
      <path d="M9 11V5.5a1.5 1.5 0 0 1 3 0V10m0-.5V4a1.5 1.5 0 0 1 3 0v6m0-1a1.5 1.5 0 0 1 3 0v5.5A6.5 6.5 0 0 1 11.5 21h-.6a6 6 0 0 1-4.6-2.2L3.6 15.4a1.6 1.6 0 0 1 2.3-2.2L9 15.5" fill="var(--card)" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** The moving picture on each tool card: what the tool looks like in use, before it is opened. */
function Preview({ kind }: { kind: ToolMeta["preview"] }) {
  switch (kind) {
    case "sliders":
      return <div className="sx-pv sx-pv--sliders">{[0, 1, 2].map((i) => <span key={i} style={{ "--i": i } as React.CSSProperties}><i /></span>)}</div>;
    case "bars":
      return <div className="sx-pv sx-pv--bars">{[0.9, 0.6, 0.75, 0.4, 0.55].map((h, i) => <span key={i} style={{ "--h": h, "--i": i } as React.CSSProperties} />)}</div>;
    case "tiles":
      return <div className="sx-pv sx-pv--tiles">{Array.from({ length: 20 }, (_, i) => <span key={i} style={{ "--i": i, "--d": ((i * 7) % 5) / 5 } as React.CSSProperties} />)}</div>;
    case "rows":
      return <div className="sx-pv sx-pv--rows">{[0, 1, 2, 3].map((i) => <span key={i} style={{ "--i": i } as React.CSSProperties}><b /><i /></span>)}</div>;
    case "phone":
      return <div className="sx-pv sx-pv--phone"><span className="sx-pv__screen"><b /><b /><b /><i /></span></div>;
    case "cards":
      return <div className="sx-pv sx-pv--cards">{[0, 1, 2].map((i) => <span key={i} style={{ "--i": i } as React.CSSProperties} />)}</div>;
    case "ring":
      return <div className="sx-pv sx-pv--ring"><svg viewBox="0 0 42 42"><circle cx="21" cy="21" r="15.9" className="a" /><circle cx="21" cy="21" r="15.9" className="b" /><circle cx="21" cy="21" r="15.9" className="c" /></svg></div>;
    case "calendar":
      return <div className="sx-pv sx-pv--calendar">{Array.from({ length: 21 }, (_, i) => <span key={i} style={{ "--i": i } as React.CSSProperties} />)}</div>;
  }
}

/* ------------------------------------------------------------------ tools */

/** The tool itself, loaded the first time it is opened, so a chapter costs nothing until it is used. */
function ToolBody({ slug }: { slug: string }) {
  const [tool, setTool] = useState<Tool | null>(null);
  useEffect(() => {
    let live = true;
    void import("@/lib/tools/catalog").then((m) => { if (live) setTool(m.ALL_TOOLS[slug] ?? null); });
    return () => { live = false; };
  }, [slug]);
  if (!tool) return <div className="sx-loading" role="status"><span /><span /><span /><em>Opening the tool…</em></div>;
  return (
    <div className="sx-tool">
      <Suspense fallback={null}>{tool.render()}</Suspense>
      <details className="sx-limits">
        <summary>What it does, and what it does not</summary>
        <p>{tool.does}</p>
        <ul>{tool.doesNot.map((d) => <li key={d}>{d}</li>)}</ul>
        <p className="sx-limits__src">Sources: {tool.sources.map((s) => s.label).join("; ")}</p>
      </details>
    </div>
  );
}

/** Which tools this reader has opened before, on this device: the card shows a tick. */
const usedListeners = new Set<() => void>();
const subscribeUsed = (l: () => void) => { usedListeners.add(l); return () => { usedListeners.delete(l); }; };
const readUsed = (slug: string) => { try { return localStorage.getItem(`sx-used-${slug}`) === "1"; } catch { return false; } };

function TryCard({ t, index }: { t: ToolMeta; index: number }) {
  const [open, setOpen] = useState(false);
  const [ref, inView] = useReveal<HTMLElement>();
  const panel = useRef<HTMLDivElement>(null);
  const g = GESTURE[t.gesture];
  const toggle = () => {
    setOpen((o) => !o);
    if (!open) {
      try { localStorage.setItem(`sx-used-${t.slug}`, "1"); } catch { /* storage can be unavailable */ }
      usedListeners.forEach((l) => l());
      requestAnimationFrame(() => panel.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }));
    }
  };
  const used = useSyncExternalStore(subscribeUsed, () => readUsed(t.slug), () => false) && !open;
  return (
    <article ref={ref} className="sx-try" data-in={inView ? "true" : "false"} data-open={open ? "true" : "false"} data-gesture={t.gesture} style={{ "--k": index } as React.CSSProperties} id={`tool-${t.slug}`}>
      <button type="button" className="sx-try__face" aria-expanded={open} aria-controls={`tool-panel-${t.slug}`} onClick={toggle}>
        <span className="sx-try__stage" aria-hidden="true">
          <Preview kind={t.preview} />
          <Pointer />
          <span className="sx-ripple" />
        </span>
        <span className="sx-try__body">
          <span className="sx-try__kicker"><g.Icon size={13} aria-hidden="true" /> {g.word}{used && <span className="sx-tick" aria-label="opened before">✓ Used</span>}</span>
          <span className="sx-try__title">{t.title}</span>
          <span className="sx-try__line">{t.line}</span>
          <span className="sx-try__prompt"><Sparkles size={13} aria-hidden="true" /> <b>Your turn:</b> {t.prompt}</span>
          <span className="sx-try__cta">{open ? "Close the tool" : "Open it here"} <ChevronDown size={15} aria-hidden="true" className="sx-chev" /></span>
        </span>
      </button>
      <div ref={panel} id={`tool-panel-${t.slug}`} className="sx-try__panel" hidden={!open}>
        {open && <ToolBody slug={t.slug} />}
        <p className="sx-try__full"><Link href={`/tools/${t.slug}`}>Open on its own page <ExternalLink size={13} aria-hidden="true" /></Link></p>
      </div>
    </article>
  );
}

/** One card, or a rail you swipe through when a heading has several tools. */
function ToolRail({ tools }: { tools: ToolMeta[] }) {
  const rail = useRef<HTMLDivElement>(null);
  const [at, setAt] = useState(0);
  if (tools.length === 1) return <TryCard t={tools[0]} index={0} />;
  const onScroll = () => {
    const el = rail.current;
    if (el) setAt(Math.round(el.scrollLeft / Math.max(1, el.scrollWidth / tools.length)));
  };
  return (
    <div className="sx-rail-wrap">
      <p className="sx-rail-hint"><Hand size={13} aria-hidden="true" /> {tools.length} tools here · swipe for the next</p>
      <div ref={rail} className="sx-rail" onScroll={onScroll} role="list">
        {tools.map((t, i) => <div role="listitem" key={t.slug} className="sx-rail__item"><TryCard t={t} index={i} /></div>)}
      </div>
      <div className="sx-dots" aria-hidden="true">{tools.map((t, i) => <span key={t.slug} data-on={i === at ? "true" : "false"} />)}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ charts */

/** Bars that grow in when they come into view. A tap on a bar opens its note. */
export function GrowBars({ title, caption, bars, source, empty, mark }: { title: string; caption?: string; bars: Bar[]; source?: string; empty?: React.ReactNode; mark?: React.ReactNode }) {
  const [ref, inView] = useReveal<HTMLElement>();
  const [tapped, setTapped] = useState<number | null>(null);
  const [all, setAll] = useState(false);
  const LIMIT = 8;
  const shown = all ? bars : bars.slice(0, LIMIT);
  const max = Math.max(1, ...bars.map((b) => Math.max(b.value, b.mark ?? 0)));
  const fmt = (n: number) => n.toLocaleString("en-KE", { maximumFractionDigits: 1 });
  return (
    <figure ref={ref} className="sx-chart" data-in={inView ? "true" : "false"}>
      <figcaption>
        <span className="sx-chart__title">{mark}{title}</span>
        {caption && <span className="sx-chart__cap">{caption}</span>}
      </figcaption>
      {bars.length === 0 ? (
        <div className="sx-chart__empty">
          <div className="sx-skel" aria-hidden="true">{[0.8, 0.55, 0.7, 0.35].map((w, i) => <span key={i} style={{ "--w": w, "--i": i } as React.CSSProperties} />)}</div>
          <div>{empty}</div>
        </div>
      ) : (
        <>
          {bars.some((b) => b.note) && <p className="sx-chip-hint"><MousePointerClick size={12} aria-hidden="true" /> Tap a bar for its note</p>}
          <ul className="sx-bars">
            {shown.map((b, i) => (
              <li key={b.label} style={{ "--i": i, "--w": b.value / max, "--m": b.mark != null ? b.mark / max : -1 } as React.CSSProperties}>
                <button type="button" className="sx-bar" onClick={() => setTapped(tapped === i ? null : i)} aria-expanded={b.note ? tapped === i : undefined}>
                  <span className="sx-bar__label">{b.label}</span>
                  <span className="sx-bar__track"><span className="sx-bar__fill" />{b.mark != null && <span className="sx-bar__mark" />}</span>
                  <span className="sx-bar__value">{fmt(b.value)}{b.mark != null && <span className="sx-bar__target"> / {fmt(b.mark)}</span>}</span>
                </button>
                {b.note && tapped === i && <p className="sx-bar__note">{b.note}</p>}
              </li>
            ))}
          </ul>
          {bars.length > LIMIT && <button type="button" className="sx-link sx-more" onClick={() => setAll((a) => !a)}>{all ? "Show the top eight" : `Show all ${bars.length}`}</button>}
        </>
      )}
      {source && <p className="sx-chart__src">Source: {source}</p>}
    </figure>
  );
}

function PackChartView({ which }: { which: PackChart }) {
  const [bars, setBars] = useState<Bar[] | null>(null);
  useEffect(() => {
    let live = true;
    void import("./packCharts").then((m) => { if (live) setBars(which === "voters" ? m.votersByConstituency() : m.projectsBySector()); });
    return () => { live = false; };
  }, [which]);
  if (!bars) return null;
  return which === "voters"
    ? <GrowBars title="Registered voters, by constituency" bars={bars} source="IEBC 2022 register" />
    : <GrowBars title="County projects, by sector" caption="Itemised in the county's Three-Year Scorecard." bars={bars} source="County Government of Kitui scorecard" />;
}

/* ------------------------------------------------------------------ live records */

function LiveDot({ on }: { on: boolean }) {
  return <span className="sx-live-dot" data-on={on ? "true" : "false"} aria-hidden="true" />;
}

function LiveChart({ id }: { id: string }) {
  const { live, ready } = useLive();
  const chart = live?.charts[id];
  if (!ready) return <div className="sx-loading" role="status"><span /><span /><span /><em>Reading the team&rsquo;s numbers…</em></div>;
  if (!chart) return null;
  return (
    <GrowBars
      title={chart.title}
      caption={chart.caption}
      bars={chart.bars}
      mark={<LiveDot on={chart.bars.length > 0} />}
      empty={<><p>{chart.empty}</p><p className="sx-muted">This chart draws itself the moment the team saves a record.</p></>}
    />
  );
}

function LiveRecord({ id }: { id: string }) {
  const { live, ready } = useLive();
  const [open, setOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const [ref, inView] = useReveal<HTMLElement>();
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    let t = 0;
    const on = (e: Event) => { if ((e as CustomEvent).detail === id) { setSaved(true); window.clearTimeout(t); t = window.setTimeout(() => setSaved(false), 4000); } };
    window.addEventListener("live:changed", on);
    return () => { window.removeEventListener("live:changed", on); window.clearTimeout(t); };
  }, [id]);
  const c = live?.collections[id];
  if (!ready) return <div className="sx-loading" role="status"><span /><span /><span /><em>Reading the team&rsquo;s records…</em></div>;
  if (!c || !live) return null;
  const titleKey = c.titleKey ?? c.columns.find((k) => k.key !== "_id")?.key;
  const recent = c.rows.slice(0, 3);
  const canEdit = live.signedIn;
  return (
    <section ref={ref} className="sx-record" data-in={inView ? "true" : "false"} aria-label={`${c.label}: the team's live record`}>
      <header className="sx-record__head">
        <span className="sx-record__icon" aria-hidden="true"><Table2 size={18} /></span>
        <span>
          <span className="sx-record__kicker"><LiveDot on={c.count > 0} /> Live record · {c.group}</span>
          <span className="sx-record__title">{c.label}</span>
        </span>
        <span className="sx-count" aria-label={`${c.count} entries`}>{c.count}</span>
      </header>
      <p className="sx-record__purpose">{c.purpose}</p>
      {saved && <p className="sx-saved" role="status"><Check size={14} aria-hidden="true" /> Saved. The chart and the count have updated.</p>}
      <p className="sx-record__when">
        {c.lastAt ? <>Updated {ago(c.lastAt)}{c.lastBy ? ` by ${c.lastBy}` : ""}</> : live.editable ? "Waiting for the first entry" : "The database is not connected yet"}
      </p>
      {recent.length > 0 && titleKey && (
        <ul className="sx-record__recent">
          {recent.map((r, i) => <li key={String(r._id)} style={{ "--i": i } as React.CSSProperties}><span className="sx-record__bullet" aria-hidden="true" />{String(r[titleKey] ?? "")}</li>)}
        </ul>
      )}
      <div className="sx-record__actions">
        {canEdit && live.editable && (
          <button type="button" className="sx-btn sx-btn--solid sx-pulse" onClick={() => { setAdding(true); setOpen(true); }}>
            <Plus size={15} aria-hidden="true" /> Add
          </button>
        )}
        <button type="button" className="sx-btn" aria-expanded={open} onClick={() => { setAdding(false); setOpen((o) => !o); }}>
          {open ? "Hide the records" : c.count > 0 ? `See all ${c.count}` : "Open the record"} <ChevronDown size={15} aria-hidden="true" className="sx-chev" data-open={open ? "true" : "false"} />
        </button>
        {!canEdit && live.loginEnabled && <Link className="sx-link" href="/team/login"><PenLine size={13} aria-hidden="true" /> Team members: sign in to add</Link>}
      </div>
      {open && (
        <div className="sx-record__table">
          <Suspense fallback={null}>
            <WorkspaceCollection
              key={adding ? "adding" : "list"}
              collectionId={c.id} label={c.label} columns={c.columns} rows={c.rows} data={c.data}
              options={live.options} canEdit={canEdit} editable={live.editable} ns={`${c.id}.`} startAdding={adding}
            />
          </Suspense>
        </div>
      )}
    </section>
  );
}

/* ------------------------------------------------------------------ change history */

const VERB: Record<string, string> = { create: "added", update: "changed", revert: "reverted", "pack-edit": "edited", "pack-revert": "reverted" };

function ChangeFeed() {
  const { live, ready } = useLive();
  const [ref, inView] = useReveal<HTMLElement>();
  const changes = live?.changes.slice(0, 8) ?? [];
  // Nothing to show is shown as nothing: a first reader never meets an empty history (flow pass, WP4).
  if (ready && changes.length === 0) return null;
  return (
    <section ref={ref} className="sx-feed" data-in={inView ? "true" : "false"} aria-label="The latest changes">
      <header className="sx-record__head">
        <span className="sx-record__icon" aria-hidden="true"><History size={18} /></span>
        <span>
          <span className="sx-record__kicker"><LiveDot on={changes.length > 0} /> Live · every edit is recorded</span>
          <span className="sx-record__title">What changed, who changed it, and when</span>
        </span>
      </header>
      {!ready ? (
        <div className="sx-loading" role="status"><span /><span /><span /><em>Reading the history…</em></div>
      ) : (
        <ol className="sx-feed__list">
          {changes.map((e, i) => (
            <li key={e.id} style={{ "--i": i } as React.CSSProperties}>
              <span className="sx-avatar" aria-hidden="true">{e.actor.slice(0, 1).toUpperCase()}</span>
              <span>
                <b>{e.actor}</b> {VERB[e.action] ?? e.action} <span className="sx-feed__title">{e.title}</span>
                <span className="sx-feed__meta">{e.where} · {ago(e.at)}</span>
              </span>
            </li>
          ))}
        </ol>
      )}
      <div className="sx-record__actions">
        <Link className="sx-btn" href="/history"><History size={15} aria-hidden="true" /> Every change</Link>
        <Link className="sx-btn" href="/explore"><Database size={15} aria-hidden="true" /> Explore every dataset</Link>
        {live?.signedIn && <Link className="sx-btn sx-btn--solid" href="/team/data"><PenLine size={15} aria-hidden="true" /> Edit the data</Link>}
        <Link className="sx-btn" href="/strategies"><Radio size={15} aria-hidden="true" /> The strategy library</Link>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ the mount */

/** Everything that can be used under one heading. Renders nothing where the heading has none. */
export function StoryEmbeds({ id }: { id: string | null }) {
  const e = embedsAt(id);
  if (!e) return null;
  return (
    <div className="sx-embeds not-prose print:hidden" data-embeds-for={id ?? undefined}>
      {e.visuals.map((v) => <React.Fragment key={v}>{VISUAL[v]()}</React.Fragment>)}
      {e.countdown && <Countdown />}
      {e.tools.length > 0 && <ToolRail tools={e.tools} />}
      {e.pack.map((p) => <PackChartView key={p} which={p} />)}
      {e.charts.map((c) => <LiveChart key={c} id={c} />)}
      {e.records.map((r) => <LiveRecord key={r} id={r} />)}
      {e.feed && <ChangeFeed />}
      {(e.tools.length > 0 || e.records.length > 0) && (
        <p className="sx-foot"><ArrowUpRight size={12} aria-hidden="true" /> {e.records.length > 0 ? "Records save for the whole team and appear here at once." : "Nothing you enter in a tool is sent anywhere."}</p>
      )}
    </div>
  );
}
