"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Toaster } from "./Toaster";
import { LazyMount } from "./LazyMount";
import { Printer, Search } from "lucide-react";

import { useTheme } from "../lib/useTheme";
import { readingMinutes, useReadingProgress } from "../hooks/useReadingProgress";
import { Figure } from "./figures/FigureBoundary";
import { RegisterMotion } from "./register/RegisterMotion";
import { HeadingOutline } from "./HeadingOutline";
import { PanelFold } from "./markdown/PanelFold";
import { MicroFX } from "./premium/MicroFX";
import { scrollToSectionWhenReady } from "../lib/scroll-to-section";
import { MobileTOCModal } from "./MobileTOCModal";
import { isLiveSectionId, partOf, resolveLegacySectionId, SECTIONS, type TabId } from "../lib/heading-slug";
import { FLOW_ORDER, FLOW_SECTIONS, FLOW_ACTS, actOf, opensAct } from "../lib/flow";
import { sectionHeight } from "../lib/section-heights";
import type { SectionItem } from "../lib/section-index";

import { SectionNumberMapProvider } from "./markdown/SectionNumberMap";
import { PlainTextPass } from "./PlainTextPass";
import { StreamedSection } from "./flow/StreamedSection";
import { ChapterMarker } from "./flow/ChapterMarker";

import { useDaypart, useScrollShell } from "../hooks/use-scroll-shell";

import { ACT_PORTRAITS } from "../lib/premium/acts";
import { CoverHero } from "./premium/CoverHero";
import { ActOpener } from "./premium/ActOpener";
import { Dock, Spine } from "./premium/Chrome";
import { Story } from "./premium/Story";
import { VisualOverview } from "./VisualOverview";
import { jumpTo } from "../lib/premium/transition";


/**
 * The proposal as one continuous scroll.
 *
 * WHAT CHANGED, AND WHY.
 *
 * This was a tabbed reader. Nineteen routes, a nineteen-item sidebar, a five-icon mobile dock, a
 * floating quick-nav capsule, a sticky section bar, a seven-button toolbar and a full-screen
 * index — five simultaneous ways to reach a section, on a document whose reader is one person
 * holding a phone. The first thing that reader had to do was make a navigation decision about a
 * document they had not read yet, and the ask, the evidence and the price were each behind a
 * different tap.
 *
 * It is now one page, top to bottom, in the order the argument is built (lib/flow.ts). All 55,500
 * words of it, in one direction, with nothing to open. The index still exists — a long document should be searchable — but it is
 * an accelerator for the second read, not the door to the first.
 *
 * WHAT MAKES THE SCROLL AFFORDABLE. Every section is wrapped in `content-visibility: auto` with a
 * reserved intrinsic size, so the browser skips layout and paint for everything off screen; and
 * every derived figure inside them mounts only within ~700px of the viewport. The document ships
 * complete — a reader with JavaScript off, a printer and a screen reader all get all of it — but
 * the browser only ever renders the screenful in front of the reader.
 */

interface ClientPageProps {
  sections: SectionItem[];
  /** Rendered prose, keyed by section — every section on the flow, one on a deep-link route. */
  documents: Partial<Record<TabId, React.ReactNode>>;
  wordCounts: Record<TabId, number>;
  /** What each section shows on load, measured from the segmentation the renderer uses. */
  visibleWordCounts: Record<TabId, number>;
  activeTab: TabId;
  /** True on "/" and "/full": the whole document in one scroll. */
  expanded: boolean;
  /** True on "/": sections past the opening pair arrive as the reader reaches them. */
  streamed?: boolean;
}

const WiperUmbrellaLogo = () => (
  <svg width="38" height="38" viewBox="0 0 120 120" fill="none" className="shrink-0 select-none">
    <path d="M60 20 C30 20 16 42 12 58 C24 53 42 53 60 58 Z" fill="#00209f" />
    <path d="M60 20 C90 20 104 42 108 58 C96 53 78 53 60 58 Z" fill="#e31d2b" />
    <path d="M60 20 V58" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
    <path d="M57 11 H63 L60 20 Z" fill="#e31d2b" />
    <path d="M60 58 V92 C60 99 51 99 51 92" stroke="#00209f" strokeWidth="6" strokeLinecap="round" fill="none" />
  </svg>
);

const TAB_IDS: string[] = SECTIONS.map((s) => s.id);

const LANDING_TAB: TabId = FLOW_ORDER[0];

export function ClientPage({ sections, documents, wordCounts, visibleWordCounts, activeTab, expanded, streamed = false }: ClientPageProps) {
  const router = useRouter();
  const [isTOCModalOpen, setIsTOCModalOpen] = useState(false);
  const { theme, toggleTheme, mounted } = useTheme();
  const { visited } = useReadingProgress(activeTab);

  useScrollShell();
  useDaypart();

  // The Brief/Full reading mode was removed in October 2026; this clears the preference it stored.
  // It can be deleted after 2026-12-31.
  useEffect(() => { try { window.localStorage.removeItem("kitui2027:reading-mode"); } catch { /* storage blocked */ } }, []);

  // Offline reading for the team (public/sw.js): what a phone has read reopens on a weak signal.
  // Production only, so a development server is never answered from a stale cache.
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js").catch(() => { /* unsupported or refused: the page works without it */ });
  }, []);

  /**
   * Which section the reader is in.
   *
   * On the flow this is observed, not navigated: there is no route change and no history entry
   * per section, because scrolling through a document is not eighteen acts of navigation. It
   * drives the capsule, the edge rail and nothing else, so it is allowed to be approximate.
   */
  const [currentTab, setCurrentTab] = useState<TabId>(expanded ? LANDING_TAB : activeTab);

  const navItems = useMemo(
    () =>
      FLOW_SECTIONS.map((section) => ({
        id: section.id as TabId,
        number: section.number,
        label: section.label,
        blurb: section.blurb,
        content: documents[section.id as TabId] ?? null,
        wordCount: wordCounts[section.id as TabId],
        visibleWordCount: visibleWordCounts[section.id as TabId],
      })),
    [documents, wordCounts, visibleWordCounts]
  );

  // On the flow, every section has a slot: the ones the server rendered carry their prose, and
  // the rest carry a StreamedSection that fetches it. On a single-section route there is one.
  const served = useMemo(
    () => (expanded ? navItems : navItems.filter((n) => n.content !== null)),
    [navItems, expanded]
  );

  /**
   * The section a deep link is aimed at, which must mount whether or not it is near the viewport.
   *
   * A link to §E.12 lands 48,000 words down the flow. Without this the observer would not have
   * fired for it, the scroll helper would find nothing, and the reader would be left at the top of
   * a document they arrived in the middle of.
   */
  const [forced, setForced] = useState<Set<string>>(() => new Set());
  const forceFor = useCallback((rawId: string) => {
    const tab = rawId.replace(/^section-/, "").split("-sec-")[0];
    if (TAB_IDS.includes(tab)) setForced((prev) => (prev.has(tab) ? prev : new Set(prev).add(tab)));
  }, []);

  const validSectionIds = useMemo(() => new Set(sections.map((s) => s.id)), [sections]);

  /* ------------------------------------------------------------- navigation */

  /**
   * Going to a section is scrolling to it.
   *
   * On the flow, every destination is already on the page, so this is a scroll and never a route
   * change. On a deep-link route where the target is not present, it falls back to navigating —
   * which is also how a link into an annex from a single-section page still works.
   */
  const goToSection = useCallback(
    (tabId: string, during?: () => void) => {
      forceFor(tabId);
      const el = typeof document !== "undefined" ? document.getElementById(`section-${tabId}`) : null;
      if (el) {
        const y = el.getBoundingClientRect().top + window.scrollY - 72;
        // A shared-element cut where the browser supports it; a smooth scroll where it does not.
        jumpTo(el, y, during);
        return;
      }
      during?.();
      router.push(`/#section-${tabId}`, { scroll: false });
    },
    [router, forceFor]
  );

  const navigateToSection = useCallback(
    (rawId: string) => {
      const go = (id: string) => {
        const targetTab = id.split("-sec-")[0];
        forceFor(id);
        const onPage = typeof document !== "undefined" && document.getElementById(`section-${targetTab}`);
        if (!onPage && TAB_IDS.includes(targetTab)) {
          router.push(`/#${id}`, { scroll: false });
        }
        scrollToSectionWhenReady(id, "smooth");
      };
      // A live id goes at once; only an old shared id waits for the redirect map to load.
      if (isLiveSectionId(rawId, validSectionIds)) go(rawId);
      else void resolveLegacySectionId(rawId, validSectionIds).then(go);
    },
    [router, validSectionIds, forceFor]
  );

  useEffect(() => {
    window.__navigateToSection = navigateToSection;
    return () => {
      delete window.__navigateToSection;
    };
  }, [navigateToSection]);

  /* ----------------------------------------------------------- deep linking */

  // A shared link, on arrival. The fragment is only readable client-side, so this cannot happen
  // in initial state; `auto` rather than `smooth`, because a reader who followed a link to §2.8
  // should land on it, not watch the page travel there.
  useEffect(() => {
    const raw = window.location.hash.replace(/^#/, "");
    if (!raw) return;
    // After the first paint, deliberately. The server never saw the fragment, so forcing a
    // section to mount during hydration would make the client's first render disagree with the
    // HTML it is hydrating.
    const frame = requestAnimationFrame(async () => {
      const id = raw.startsWith("section-") ? raw : await resolveLegacySectionId(raw, validSectionIds);
      // A legacy link to a single-section route can name text that now lives on another route
      // (the October 2026 restructure moved headings between files). The whole document holds
      // every section, so the link is handed to it, exactly as navigateToSection does.
      const targetTab = id.startsWith("section-") ? id.slice("section-".length) : id.split("-sec-")[0];
      if (!document.getElementById(`section-${targetTab}`) && TAB_IDS.includes(targetTab)) {
        router.push(`/#${id}`, { scroll: false });
      }
      forceFor(id);
      scrollToSectionWhenReady(id, "auto");
    });
    return () => cancelAnimationFrame(frame);
    // Mount only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // A fragment that changes while the page is open — the back button, or a legacy link clicked
  // from another tab.
  useEffect(() => {
    const onHashChange = async () => {
      const raw = window.location.hash.replace(/^#/, "");
      if (!raw) return;
      const id = raw.startsWith("section-") ? raw : await resolveLegacySectionId(raw, validSectionIds);
      forceFor(id);
      scrollToSectionWhenReady(id, "smooth");
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [validSectionIds, forceFor]);

  /* ------------------------------------------------------- current section */

  // A probe, not an observer (D-08). The observer set the label only when a section ENTERED a
  // band a quarter of the way down the screen, so above the first section (the hero) nothing was
  // ever in the band and the label kept whatever it last held: after a jump from the index, the
  // cover read "§5B Publishing & earned media" indefinitely. Now every scroll frame asks which
  // section holds a line 30% down the viewport, and above the first, the answer is the first.
  useEffect(() => {
    if (!expanded) return;
    let frame = 0;
    const read = () => {
      frame = 0;
      const probe = window.innerHeight * 0.3;
      let current: TabId = navItems[0].id;
      for (const item of navItems) {
        const el = document.getElementById(`section-${item.id}`);
        if (el && el.getBoundingClientRect().top <= probe) current = item.id;
      }
      setCurrentTab((prev) => (prev === current ? prev : current));
    };
    const on = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };
    read();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on, { passive: true });
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [expanded, navItems]);

  /* ------------------------------------------------------------- shortcuts */

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const typing =
        !!target &&
        (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.tagName === "SELECT" || target.isContentEditable);
      const isCommandK = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k";
      const isSlash = e.key === "/" && !e.metaKey && !e.ctrlKey && !e.altKey;
      if (isCommandK || (isSlash && !typing)) {
        e.preventDefault();
        setIsTOCModalOpen(true);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  /* ----------------------------------------------------------------- print */

  const printDocument = useCallback(() => {
    if (expanded) {
      window.print();
      return;
    }
    router.push("/", { scroll: false });
    let done = false;
    const fire = () => {
      if (done) return;
      done = true;
      requestAnimationFrame(() => requestAnimationFrame(() => window.print()));
    };
    window.setTimeout(fire, 1400);
  }, [expanded, router]);

  const labelOf = useCallback(
    (id: string) => {
      const item = navItems.find((t) => t.id === id);
      return item ? item.label : null;
    },
    [navItems]
  );

  const activeItem = useMemo(
    () => navItems.find((t) => t.id === (expanded ? currentTab : activeTab)) ?? navItems[0],
    [navItems, currentTab, activeTab, expanded]
  );

  return (
    <SectionNumberMapProvider sections={sections}>
      <div id="pf-root" className="pf-page min-h-screen bg-paper text-ink font-sans selection:bg-accent/20">
        <PlainTextPass rootId="pf-root" />
        <a href="#content-area" className="skip-link">Skip to the document</a>

        {/* The flow streams its later sections, so the complete server-rendered document lives at
            /full. That is what print leads to, and it is what a reader without JavaScript gets. */}
        {streamed && (
          <noscript>
            <p style={{ padding: "1rem", textAlign: "center" }}>
              <Link href="/full">Open the complete proposal on one page</Link>
            </p>
          </noscript>
        )}

        <RegisterMotion />
        <HeadingOutline />
        <MicroFX />
        <div className="pf-grain print:hidden" aria-hidden="true" />

        {/* ----------------------------------------------------------- hero */}
        {/* The cover (brief G-2, §10 Cover): the county behind, the portrait large in
            front, the title in the display face, and the county drawn ward by ward (SVG; the WebGL
            scene was removed in the visual-first pass). The four figures follow as big numbers. The
            static county is in the HTML for print, reduced motion and scripts off. */}
        {expanded && (
          <CoverHero
            byline={
              <p className="pf-byline">
                <WiperUmbrellaLogo />
                <span>
                  <strong>Hon. Dr. Benson Makali Mulu</strong>
                  <span>Kitui 2027 — strategy and direction</span>
                </span>
              </p>
            }
          />
        )}

        {/* ------------------------------------------------ evidence preface */}
        {expanded && (
          <section aria-label="The figures behind the decision" className="cv-auto-strip pf-shell pf-preface">
            {/* One reading time, measured from what the page shows on load (app/[[...slug]]/page.tsx),
                so it cannot drift from what the page does. */}
            <div className="pf-reading">
              <p className="pf-reading__time">~{readingMinutes(Object.values(visibleWordCounts).reduce((a, b) => a + b, 0))} min read</p>
              <p className="pf-reading__hint">Scroll. The whole proposal is on this page, in order — {navItems.length} sections. Every section&rsquo;s full text is one tap away.</p>
            </div>
            <VisualOverview sections={FLOW_SECTIONS.map((section) => ({ id: section.id as TabId, label: section.label, number: section.number }))} wordCounts={wordCounts} visibleWordCounts={visibleWordCounts} />
            {/* The cover figures (brief §F.1), with their tables and CSVs: the tile map shaded for
                the pool and the spine of the argument. The hero above tells the same map's story. */}
            <Figure id="fig-cover-map" />
            <Figure id="fig-cover-spine" />
          </section>
        )}

        {/* ------------------------------------------------------ the document */}
        <main className="pf-shell pf-main">
          {/* There is no toolbar.

              There used to be seven buttons in a bar that followed the reader down the page, and
              on a 390px screen it sat over the figures it was scrolling past. Density, focus
              mode, reading view and Expand All were all ways of undoing the tab layout, and the
              tab layout is gone. Search and brightness moved into the flow capsule at the foot of
              the screen, which is one element instead of a band; print is at the end of the
              document, where a reader who wants a PDF has just arrived. */}

          <div id="content-area" className="flow-body">
            {served.map((item) => {
              const act = expanded ? opensAct(item.id) : null;
              return (
                <React.Fragment key={item.id}>
                  {/* The act opener sits before its section, not inside it: a section is
                      `content-visibility: auto`, which contains paint, and a full-bleed opener
                      inside one was clipped to the reading column. */}
                  {act && (
                    <ActOpener
                      act={act}
                      index={FLOW_ACTS.indexOf(act)}
                      total={FLOW_ACTS.length}
                      portrait={ACT_PORTRAITS[FLOW_ACTS.indexOf(act)]}
                      id={`act-${act.id}`}
                    />
                  )}
                <section
                  id={`section-${item.id}`}
                  className="flow-section print:break-inside-auto"
                  aria-labelledby={`chap-${item.id}`}
                  // The real measured height of this section, so `content-visibility: auto` can
                  // skip laying it out without misreporting the document's length. One flat
                  // placeholder for all thirty made a 480,000px document claim to be 42,000px,
                  // and every deep link past the third section landed in the wrong place.
                  style={{ containIntrinsicSize: `auto ${sectionHeight(item.id, item.wordCount)}px` }}
                >
                  <div id={`chap-${item.id}`}>
                    <ChapterMarker
                      partLabel={partOf(item.id) === 0 ? null : actOf(item.id).label}
                      actId={partOf(item.id) === 0 ? null : actOf(item.id).id}
                      label={item.label}
                      blurb={item.blurb}
                      asTitle={!expanded}
                    />
                  </div>
                  {/* Chapter 2's argument, told once over a pinned county before the chapter's detail. */}
                  {item.id === "votes" && (
                    <PanelFold label="The analysis in four steps: the winning number, where the votes are, the routes, and where he has held office">
                      {/* On the streamed flow the story (≈ 2,300 nodes, four figures) mounts as the
                          reader approaches §2, not in the first hydration, where it was most of the
                          blocking time on a throttled phone. /full and the section routes still
                          render it on the server, for print and for readers without JavaScript. */}
                      {streamed ? (
                        <LazyMount minHeight="100svh" rootMargin="150% 0px">
                          <Story />
                        </LazyMount>
                      ) : (
                        <Story />
                      )}
                    </PanelFold>
                  )}
                  {/* On the /cover route there is no hero, so the cover figures open the section. */}
                  {!expanded && item.id === "cover" && (
                    <>
                      <Figure id="fig-cover-map" />
                      <Figure id="fig-cover-spine" />
                    </>
                  )}
                  {item.content ?? (
                    <StreamedSection tabId={item.id} words={item.wordCount} force={forced.has(item.id)} />
                  )}
                </section>
                </React.Fragment>
              );
            })}
          </div>

        </main>

        <footer className="pf-shell pf-footer relative mt-10 pt-8">
          <span aria-hidden="true" className="fx-divider-gradient absolute inset-x-4 sm:inset-x-6 top-0" />
          <div className="confidentiality-marker mb-3">
            <strong>Confidential</strong>
            <span className="opacity-85"> — link-only, prepared for Hon. Dr. Benson Makali Mulu personally. Not for circulation.</span>
          </div>
          <div className="mb-5 flex flex-wrap gap-2 print:hidden">
            <button
              onClick={printDocument}
              className="inline-flex items-center gap-2 rounded-full border border-line/60 bg-card/70 px-4 py-2 t-micro font-bold text-ink hover:border-accent hover:text-accent transition-colors cursor-pointer min-h-[40px]"
            >
              <Printer size={14} />
              <span>Print, or save as PDF</span>
            </button>
            <button
              onClick={() => setIsTOCModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-full border border-line/60 bg-card/70 px-4 py-2 t-micro font-bold text-muted hover:border-accent hover:text-accent transition-colors cursor-pointer min-h-[40px]"
            >
              <Search size={14} />
              <span>Search the document</span>
            </button>
          </div>
          <dl className="t-micro text-muted grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 max-w-md">
            <dt className="font-semibold text-ink">Prepared by</dt>
            <dd>Firefly Management</dd>
            <dt className="font-semibold text-ink">Date</dt>
            <dd>September 2026</dd>
            <dt className="font-semibold text-ink">Status</dt>
            <dd>Proposal for discussion</dd>
          </dl>
        </footer>

        {expanded && <Spine onSelect={goToSection} />}

        <Dock
          label={activeItem.label}
          number={partOf(activeItem.id) === 0 ? "" : actOf(activeItem.id).label}
          tab={activeItem.id}
          onOpenIndex={() => setIsTOCModalOpen(true)}
          onToggleTheme={toggleTheme}
          theme={theme}
          themeReady={mounted}
        />

        <MobileTOCModal
          sections={sections}
          wordCounts={visibleWordCounts}
          visited={visited}
          onSelectTab={goToSection}
          isOpen={isTOCModalOpen}
          onClose={() => setIsTOCModalOpen(false)}
          activeTab={activeItem.id}
          onSelectSection={(secId) => {
            setIsTOCModalOpen(false);
            navigateToSection(secId);
          }}
        />
        <Toaster current={activeItem.id} labelOf={labelOf} goTo={goToSection} resumable={streamed} />
      </div>
    </SectionNumberMapProvider>
  );
}
