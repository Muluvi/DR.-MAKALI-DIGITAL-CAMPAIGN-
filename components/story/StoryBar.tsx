"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { BookOpen, ChevronRight, Compass, Database, LogIn, PenLine, Sparkles, Table2, Users, X } from "lucide-react";
import { useChromeVisible } from "../../hooks/use-chrome-visible";
import { TOOL_META } from "@/lib/tools/meta";
import { FEED_HOME, RECORD_HOMES } from "@/lib/story/embeds";
import { COLLECTION_BY_ID } from "@/lib/platform/collections";
import { PARTS, SECTIONS, partOf, type TabId } from "@/lib/heading-slug";
import { recentlyUsed } from "@/lib/tools/used";
import { PUBLIC_RETRIEVED } from "@/lib/public-data";
import { ago, useLive } from "./useLive";

const CHAPTER_LABEL: Record<string, string> = Object.fromEntries(SECTIONS.map((s) => [s.id, s.label]));
const ORDER: string[] = SECTIONS.map((s) => s.id);
const chapterOf = (home: string) => home.split("-sec-")[0];

/**
 * The one header the site has: the brand, the team's live status and its sign-in (flow pass, WP7).
 * Search and every tool live in the dock at the foot of the screen, one entry point each; the live
 * status, when the team has changed something, jumps to What changed in the Welcome. The Tools panel
 * still opens from here, on the "story:open-tools" event the dock and the Welcome send.
 */
export function StoryBar({ onJump }: { onJump: (sectionId: string) => void }) {
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
        <div className="sx-brand">
          <a href="#section-welcome" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
            <b>Kitui 2027</b>
          </a>
          {live?.lastChange ? (
            <button type="button" className="sx-brand__live" data-tour="live" onClick={() => onJump(FEED_HOME)}>
              <span className="sx-live-dot" data-on="true" aria-hidden="true" />Team update {ago(live.lastChange.at)}
              <span className="sr-only">: see what changed</span>
            </button>
          ) : (
            <span data-tour="live"><span className="sx-live-dot" data-on="false" aria-hidden="true" />Strategy and the campaign’s tools</span>
          )}
        </div>
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
  // This week first (the team's weekly tools and records), then the tools this reader used most
  // recently, then everything else by stage of the story (flow pass, WP11). Read when the panel
  // opens, so "Recently used" reflects the tool just opened.
  const groups = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const items = [
      ...TOOL_META.map((t) => ({ key: t.slug, home: t.home, title: t.title, line: t.line, kind: "tool" as const })),
      ...Object.entries(RECORD_HOMES).flatMap(([home, ids]) => ids.map((id) => ({ key: id, home, title: COLLECTION_BY_ID[id]?.label ?? id, line: COLLECTION_BY_ID[id]?.purpose ?? "", kind: "record" as const }))),
    ]
      .filter((i) => !needle || `${i.title} ${i.line}`.toLowerCase().includes(needle))
      .sort((a, b) => ORDER.indexOf(chapterOf(a.home)) - ORDER.indexOf(chapterOf(b.home)));
    type Item = (typeof items)[number];
    const out: { id: string; title: string; items: Item[] }[] = [];
    const week = items.filter((i) => chapterOf(i.home) === "week");
    if (week.length) out.push({ id: "week", title: "This week", items: week });
    const tools = new Map(items.filter((i) => i.kind === "tool").map((i) => [i.key, i]));
    const recent = recentlyUsed([...tools.keys()]).slice(0, 5).map((s) => tools.get(s)!);
    if (recent.length) out.push({ id: "recent", title: "Recently used", items: recent });
    for (const p of PARTS) {
      const inStage = items.filter((i) => chapterOf(i.home) !== "week" && partOf(chapterOf(i.home) as TabId) === p.part);
      if (inStage.length) out.push({ id: `stage-${p.part}`, title: p.label, items: inStage });
    }
    return out;
  }, [q]);
  let n = 0;
  return (
    <>
      <div className="sx-sheet-back" onClick={onClose} aria-hidden="true" />
      <div className="sx-sheet" role="dialog" aria-modal="true" aria-labelledby="sx-sheet-title">
        <div className="sx-sheet__grip" aria-hidden="true" />
        <div style={{ display: "flex", alignItems: "start", justifyContent: "space-between", gap: "0.5rem" }}>
          <div>
            <h2 id="sx-sheet-title">Every tool and team record</h2>
            <p className="sx-sheet__lead">{TOOL_META.length} tools and 10 team records, by stage of the story, each inside the chapter it works on. Tap one to go straight there.{signedIn && name ? ` Signed in as ${name}.` : ""}</p>
          </div>
          <button type="button" className="sx-top-btn" onClick={onClose} aria-label="Close"><X size={16} aria-hidden="true" /></button>
        </div>
        <input ref={input} className="sx-sheet__search" type="search" placeholder="Find a tool: water, radio, wards…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Find a tool or record" />
        {groups.length === 0 && <p className="sx-muted">Nothing matches. Try a shorter word.</p>}
        {groups.map((g) => (
          <section key={g.id}>
            <h3><BookOpen size={11} aria-hidden="true" style={{ display: "inline", verticalAlign: "-0.1em" }} /> {g.title}</h3>
            <ul>
              {g.items.map((i) => (
                <li key={`${i.kind}-${i.key}`}>
                  <button type="button" style={{ "--i": n++ } as React.CSSProperties} onClick={() => onJump(i.home)}>
                    {i.kind === "tool" ? <Sparkles size={16} aria-hidden="true" /> : <Table2 size={16} aria-hidden="true" style={{ color: "#1f7a45" }} />}
                    <span>{i.title}<small>{CHAPTER_LABEL[chapterOf(i.home)] ?? ""} · {i.kind === "record" ? "Team record · " : ""}{i.line}</small></span>
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
