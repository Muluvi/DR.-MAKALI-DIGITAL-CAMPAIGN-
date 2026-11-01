"use client";

/**
 * The workstreams, as four tabs (consolidation pass, Step 4H): Platforms & content, Media,
 * Ground & offline, Data & technology.
 *
 * HOW IT WORKS WITH THE PAGE. The chapter's prose is laid out section by section (folds, panels,
 * figures), so a tab cannot be a wrapper around its text. Instead content/workstreams.md carries
 * one marker where each group begins (`<ws-mark tab="media">`), and the tab bar hides every block
 * of the chapter that lies outside the active group's range, from its marker to the next. The
 * chapter's opening, before the first marker, always shows.
 *
 * Every panel is server-rendered, so without JavaScript and in print every workstream is on the
 * page in order and the tab bar is a row of links to each group. Deep links work: a link to any
 * heading inside a group (including an old "workstreams-media-sec-15-2-1" link, which the anchor
 * map sends on to "workstreams-sec-15-2-1") opens its tab first, through lib/fold.ts revealAround,
 * and "#ws-media" opens a tab by name.
 */
import { useCallback, useEffect, useState } from "react";

import { PANEL_EVENT } from "../../lib/fold";

export const WORKSTREAM_TABS = [
  { tab: "platforms", label: "Platforms & content", range: "Workstreams 1–4" },
  { tab: "media", label: "Media", range: "Workstreams 5–6" },
  { tab: "ground", label: "Ground & offline", range: "Workstreams 7–10" },
  { tab: "data", label: "Data & technology", range: "Workstreams 11–14" },
] as const;

const HIDDEN = "data-ws-hidden";
const root = () => document.getElementById("section-workstreams") ?? document.querySelector<HTMLElement>("[data-ws-mark]")?.closest("article, section, main") ?? null;
const marks = (r: Element) => Array.from(r.querySelectorAll<HTMLElement>("[data-ws-mark]"));

/** The group a node belongs to: the last marker before it, or null if it precedes them all. */
function groupOf(node: Node, ms: HTMLElement[]): string | null {
  let tab: string | null = null;
  for (const m of ms) if (m.compareDocumentPosition(node) & Node.DOCUMENT_POSITION_FOLLOWING) tab = m.dataset.wsMark ?? null;
  return tab;
}

/** Show one group's range and hide the rest; null shows everything. */
function apply(active: string | null) {
  const r = root();
  if (!r) return;
  for (const el of Array.from(r.querySelectorAll<HTMLElement>(`[${HIDDEN}]`))) { el.hidden = false; el.removeAttribute(HIDDEN); }
  if (active === null) return;
  const ms = marks(r);
  const walk = (el: Element) => {
    for (const child of Array.from(el.children) as HTMLElement[]) {
      if (child.hasAttribute("data-ws-mark") || child.hasAttribute("data-ws-tabs")) continue;
      if (child.querySelector("[data-ws-mark], [data-ws-tabs]")) { walk(child); continue; }
      const tab = groupOf(child, ms);
      if (tab !== null && tab !== active) { child.hidden = true; child.setAttribute(HIDDEN, ""); }
    }
  };
  walk(r);
}

export function WorkstreamTabBar() {
  const [active, setActive] = useState<string | null>(null);

  const show = useCallback((tab: string) => {
    apply(tab);
    setActive(tab);
  }, []);

  useEffect(() => {
    const groupFromHash = () => {
      const h = decodeURIComponent(window.location.hash.slice(1));
      if (h.startsWith("ws-")) return h.slice(3);
      const target = h ? document.getElementById(h) : null;
      const r = root();
      return target && r ? groupOf(target, marks(r)) : null;
    };
    // After the first paint, so the server-rendered page (every group visible) is what loads.
    const first = requestAnimationFrame(() => show(groupFromHash() ?? WORKSTREAM_TABS[0].tab));
    const onReveal = (e: Event) => {
      const r = root();
      const tab = r && e.target instanceof Node ? groupOf(e.target, marks(r)) : null;
      if (tab) show(tab);
    };
    const onHash = () => {
      const tab = groupFromHash();
      if (tab) show(tab);
    };
    document.addEventListener(PANEL_EVENT, onReveal);
    window.addEventListener("hashchange", onHash);
    // Print shows every group, as the JavaScript-off page does.
    const before = () => apply(null);
    const after = () => setActive((a) => { apply(a); return a; });
    window.addEventListener("beforeprint", before);
    window.addEventListener("afterprint", after);
    // Prose that streams in after the tab is chosen (the long scroll mounts sections late) is
    // sorted into its group as it arrives.
    const r = root();
    const watch = r ? new MutationObserver(() => setActive((a) => { if (a) requestAnimationFrame(() => apply(a)); return a; })) : null;
    if (r && watch) watch.observe(r, { childList: true, subtree: true });
    return () => {
      cancelAnimationFrame(first);
      watch?.disconnect();
      document.removeEventListener(PANEL_EVENT, onReveal);
      window.removeEventListener("hashchange", onHash);
      window.removeEventListener("beforeprint", before);
      window.removeEventListener("afterprint", after);
    };
  }, [show]);

  return (
    <nav aria-label="The workstreams" data-ws-tabs="" className="not-prose sticky top-2 z-10 my-6 print:hidden">
      <ul role="tablist" className="grid grid-cols-2 gap-1.5 rounded-2xl border border-line bg-card/95 p-1.5 backdrop-blur sm:grid-cols-4">
        {WORKSTREAM_TABS.map((t) => {
          const on = active === t.tab;
          return (
            <li key={t.tab} role="presentation">
              <a
                role="tab"
                aria-selected={on}
                href={`#ws-${t.tab}`}
                onClick={(e) => {
                  if (active === null) return;
                  e.preventDefault();
                  show(t.tab);
                  history.replaceState(null, "", `#ws-${t.tab}`);
                  document.getElementById(`ws-${t.tab}`)?.scrollIntoView({ block: "start" });
                }}
                className={`flex min-h-11 flex-col justify-center rounded-xl px-3 py-1.5 text-left transition-colors ${on ? "bg-accent text-white" : "text-ink hover:bg-paper"}`}
              >
                <span className="t-small font-bold leading-tight">{t.label}</span>
                <span className={`t-micro leading-tight ${on ? "text-white/80" : "text-muted"}`}>{t.range}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/** Where a group begins: an anchor ("#ws-media") and the boundary the tab bar reads. */
export function WorkstreamMark({ tab }: { tab?: string }) {
  return <span id={`ws-${tab}`} data-ws-mark={tab} className="block scroll-mt-24" aria-hidden="true" />;
}
