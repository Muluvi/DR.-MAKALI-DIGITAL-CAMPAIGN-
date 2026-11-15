"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { BookOpen, ChevronRight, Compass, Database, LogIn, PenLine, Search, Sparkles, Table2, Users, Wrench, X } from "lucide-react";
import { useChromeVisible } from "../../hooks/use-chrome-visible";
import { TOOL_META } from "@/lib/tools/meta";
import { RECORD_HOMES } from "@/lib/story/embeds";
import { COLLECTION_BY_ID } from "@/lib/platform/collections";
import { SECTIONS } from "@/lib/heading-slug";
import { PUBLIC_RETRIEVED } from "@/lib/public-data";
import { ago, useLive } from "./useLive";

const CHAPTER_LABEL: Record<string, string> = Object.fromEntries(SECTIONS.map((s) => [s.id, s.label]));
const ORDER: string[] = SECTIONS.map((s) => s.id);
const chapterOf = (home: string) => home.split("-sec-")[0];

/**
 * The one header the site has: the brand, the chapter index, search, every tool and record, and
 * the team's sign-in and live status. It replaces the platform's separate header for a reader on
 * the story; the platform pages keep theirs as full-page views.
 */
export function StoryBar({ onOpenIndex, onJump }: { onOpenIndex: () => void; onJump: (sectionId: string) => void }) {
  const visible = useChromeVisible();
  const { live } = useLive();
  const [sheet, setSheet] = useState(false);
  useEffect(() => {
    const open = () => setSheet(true);
    window.addEventListener("story:open-tools", open);
    return () => window.removeEventListener("story:open-tools", open);
  }, []);
  return (
    <>
      <header className="sx-bar-top print:hidden" data-hidden={visible || sheet ? "false" : "true"}>
        <a href="#section-welcome" className="sx-brand" data-tour="live" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
          <b>Kitui 2027</b>
          <span><span className="sx-live-dot" data-on={live?.lastChange ? "true" : "false"} aria-hidden="true" />{live?.lastChange ? `Team update ${ago(live.lastChange.at)}` : "Strategy and the campaign’s tools"}</span>
        </a>
        <button type="button" className="sx-top-btn" data-tour="search" onClick={onOpenIndex} aria-label="Chapters and search">
          <Search size={16} aria-hidden="true" /><span className="sx-top-label">Search <SearchHint /></span>
        </button>
        <button type="button" className="sx-top-btn sx-top-btn--accent" data-tour="tools" data-nudge="true" onClick={() => setSheet(true)} aria-haspopup="dialog" aria-expanded={sheet}>
          <Wrench size={16} aria-hidden="true" /><span>Tools</span>
        </button>
        {live?.signedIn ? (
          <>
            {live.role === "firefly" && <Link className="sx-top-btn sx-top-btn--wide-only" href="/team/admin" aria-label="Team members"><Users size={16} aria-hidden="true" /><span className="sx-top-label">Team</span></Link>}
            <Link className="sx-top-btn" href="/team/data" aria-label="Edit the data"><PenLine size={16} aria-hidden="true" /><span className="sx-top-label">Edit data</span></Link>
          </>
        ) : live?.loginEnabled ? (
          <Link className="sx-top-btn" href="/team/login" aria-label="Team sign-in"><LogIn size={16} aria-hidden="true" /><span className="sx-top-label">Sign in</span></Link>
        ) : null}
      </header>
      {sheet && <ToolsSheet onClose={() => setSheet(false)} onJump={(id) => { setSheet(false); onJump(id); }} signedIn={!!live?.signedIn} name={live?.name ?? null} />}
    </>
  );
}

function ToolsSheet({ onClose, onJump, signedIn, name }: { onClose: () => void; onJump: (id: string) => void; signedIn: boolean; name: string | null }) {
  const [q, setQ] = useState("");
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (window.matchMedia("(pointer: fine)").matches) input.current?.focus({ preventScroll: true });
    const key = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", key);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", key); document.body.style.overflow = prev; };
  }, [onClose]);
  const groups = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const items = [
      ...TOOL_META.map((t) => ({ key: t.slug, home: t.home, title: t.title, line: t.line, kind: "tool" as const })),
      ...Object.entries(RECORD_HOMES).flatMap(([home, ids]) => ids.map((id) => ({ key: id, home, title: COLLECTION_BY_ID[id]?.label ?? id, line: COLLECTION_BY_ID[id]?.purpose ?? "", kind: "record" as const }))),
    ].filter((i) => !needle || `${i.title} ${i.line}`.toLowerCase().includes(needle));
    const by = new Map<string, typeof items>();
    for (const i of items) { const c = chapterOf(i.home); by.set(c, [...(by.get(c) ?? []), i]); }
    return [...by].sort((a, b) => ORDER.indexOf(a[0]) - ORDER.indexOf(b[0]));
  }, [q]);
  let n = 0;
  return (
    <>
      <div className="sx-sheet-back" onClick={onClose} aria-hidden="true" />
      <div className="sx-sheet" role="dialog" aria-modal="true" aria-labelledby="sx-sheet-title">
        <div className="sx-sheet__grip" aria-hidden="true" />
        <div style={{ display: "flex", alignItems: "start", justifyContent: "space-between", gap: "0.5rem" }}>
          <div>
            <h2 id="sx-sheet-title">Every tool and live record</h2>
            <p className="sx-sheet__lead">{TOOL_META.length} tools and 10 team records, each inside the chapter it works on. Tap one to go straight there.{signedIn && name ? ` Signed in as ${name}.` : ""}</p>
          </div>
          <button type="button" className="sx-top-btn" onClick={onClose} aria-label="Close"><X size={16} aria-hidden="true" /></button>
        </div>
        <input ref={input} className="sx-sheet__search" type="search" placeholder="Find a tool: water, radio, wards…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Find a tool or record" />
        {groups.length === 0 && <p className="sx-muted">Nothing matches. Try a shorter word.</p>}
        {groups.map(([chapter, items]) => (
          <section key={chapter}>
            <h3><BookOpen size={11} aria-hidden="true" style={{ display: "inline", verticalAlign: "-0.1em" }} /> {CHAPTER_LABEL[chapter] ?? chapter}</h3>
            <ul>
              {items.map((i) => (
                <li key={`${i.kind}-${i.key}`}>
                  <button type="button" style={{ "--i": n++ } as React.CSSProperties} onClick={() => onJump(i.home)}>
                    {i.kind === "tool" ? <Sparkles size={16} aria-hidden="true" /> : <Table2 size={16} aria-hidden="true" style={{ color: "#1f7a45" }} />}
                    <span>{i.title}<small>{i.kind === "record" ? "Live record · " : ""}{i.line}</small></span>
                    <ChevronRight size={16} aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ul>
          </section>
        ))}
        <p className="sx-live-foot" style={{ marginTop: "1rem" }}>
          <Link className="sx-link" href="/explore"><Database size={13} aria-hidden="true" /> Every dataset, searchable</Link>
          <Link className="sx-link" href="/tools">All tools on one page</Link>
          <button type="button" className="sx-link" onClick={() => { onClose(); window.setTimeout(() => window.dispatchEvent(new Event("story:tour")), 300); }}><Compass size={13} aria-hidden="true" /> Show me around</button>
        </p>
      </div>
    </>
  );
}

const HINTS = ["chapters, figures", "try \u201cwater\u201d", "try \u201cMui\u201d", "try \u201cradio\u201d", "chapters, figures"];
/** On a wide screen, the search button suggests what to search for, a few times, then settles. */
function SearchHint() {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setI((n) => { if (n >= HINTS.length - 1) { window.clearInterval(id); return n; } return n + 1; }), 2600);
    return () => window.clearInterval(id);
  }, []);
  return <span className="sx-search-hint"><span key={i} className="sx-hint-cycle">{HINTS[i]}</span></span>;
}

/** The footer's live line: when the official data was last verified, and the team's last update. */
export function LiveFooterLine() {
  const { live } = useLive();
  const verified = new Date(`${PUBLIC_RETRIEVED}T00:00:00+03:00`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  return (
    <p className="sx-live-foot">
      <span>Official election data verified {verified}</span>
      {live?.lastChange && <span><span className="sx-live-dot" data-on="true" aria-hidden="true" />Last team update {ago(live.lastChange.at)} by {live.lastChange.actor}</span>}
    </p>
  );
}
