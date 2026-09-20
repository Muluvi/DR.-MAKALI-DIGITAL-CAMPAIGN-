"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Printer, Search } from "lucide-react";

import { useTheme } from "../lib/useTheme";
import { readingMinutes, useReadingProgress } from "../hooks/useReadingProgress";
import { KeyFactsStrip } from "./KeyFactsStrip";
import { ReadingModeToggle } from "./ReadingModeToggle";
import { ReadingModeProvider } from "../lib/reading-mode";
import { LazyMount } from "./LazyMount";
import { ScrollProgressBar } from "./ScrollProgressBar";
import { scrollToSectionWhenReady } from "../lib/scroll-to-section";
import { MobileTOCModal } from "./MobileTOCModal";
import { resolveLegacySectionId, SECTIONS, type TabId } from "../lib/heading-slug";
import { FLOW_ORDER, FLOW_SECTIONS, FLOW_ACTS, flowIndex, opensAct } from "../lib/flow";
import { sectionHeight } from "../lib/section-heights";
import type { SectionItem } from "../lib/section-index";

import { SectionNumberMapProvider } from "./markdown/SectionNumberMap";
import { ActMarker } from "./flow/ActMarker";
import { StreamedSection } from "./flow/StreamedSection";
import { ChapterMarker } from "./flow/ChapterMarker";
import { FlowChrome } from "./flow/FlowChrome";
import { FlowRail } from "./flow/FlowRail";

import { AmbientField, Reveal } from "./visual";
import { useDaypart, useScrollShell } from "../hooks/use-scroll-shell";

import { Dashboard } from "./Dashboard";
import { HeroVisual } from "./HeroVisual";
import { Portrait } from "./Portrait";
import { DeficitGauge } from "./charts/DeficitGauge";
import { ChartFallback } from "./ChartFallback";

// Dynamic boundary: the projection chart is the last figure on a 55,000-word page and it is the
// only thing on the flow that needs the charting runtime. Downloading it with the hero would put
// it in front of every reader, including the one who stops at the executive summary.
const VoterProjectionsChart = dynamic(() => import("./VoterProjectionsChart").then((m) => m.VoterProjectionsChart), {
  ssr: false,
  loading: () => <ChartFallback height={460} />,
});

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
  /** The same counts for Brief mode, measured from the segmentation the renderer uses. */
  briefWordCounts: Record<TabId, number>;
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

export function ClientPage({ sections, documents, wordCounts, briefWordCounts, activeTab, expanded, streamed = false }: ClientPageProps) {
  const router = useRouter();
  const [isTOCModalOpen, setIsTOCModalOpen] = useState(false);
  const { theme, toggleTheme, mounted } = useTheme();
  const { visited } = useReadingProgress(activeTab);

  useScrollShell();
  useDaypart();

  /**
   * Which section the reader is in.
   *
   * On the flow this is observed, not navigated: there is no route change and no history entry
   * per section, because scrolling through a document is not nineteen acts of navigation. It
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
      })),
    [documents, wordCounts]
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
   * A link to §13.4.3 lands 48,000 words down the flow. Without this the observer would not have
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
    (tabId: string) => {
      forceFor(tabId);
      const el = typeof document !== "undefined" ? document.getElementById(`section-${tabId}`) : null;
      if (el) {
        const y = el.getBoundingClientRect().top + window.scrollY - 72;
        window.scrollTo({ top: y, behavior: "smooth" });
        return;
      }
      router.push(`/#section-${tabId}`, { scroll: false });
    },
    [router, forceFor]
  );

  const navigateToSection = useCallback(
    (rawId: string) => {
      const id = resolveLegacySectionId(rawId, validSectionIds);
      const targetTab = id.split("-sec-")[0];
      forceFor(id);
      const onPage = typeof document !== "undefined" && document.getElementById(`section-${targetTab}`);
      if (!onPage && TAB_IDS.includes(targetTab)) {
        router.push(`/#${id}`, { scroll: false });
      }
      scrollToSectionWhenReady(id, "smooth");
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
  // in initial state; `auto` rather than `smooth`, because a reader who followed a link to §3.3.1
  // should land on it, not watch the page travel there.
  useEffect(() => {
    const raw = window.location.hash.replace(/^#/, "");
    if (!raw) return;
    // After the first paint, deliberately. The server never saw the fragment, so forcing a
    // section to mount during hydration would make the client's first render disagree with the
    // HTML it is hydrating.
    const frame = requestAnimationFrame(() => {
      const id = raw.startsWith("section-") ? raw : resolveLegacySectionId(raw, validSectionIds);
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
    const onHashChange = () => {
      const raw = window.location.hash.replace(/^#/, "");
      if (!raw) return;
      const id = raw.startsWith("section-") ? raw : resolveLegacySectionId(raw, validSectionIds);
      forceFor(id);
      scrollToSectionWhenReady(id, "smooth");
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [validSectionIds, forceFor]);

  /* ------------------------------------------------------- current section */

  useEffect(() => {
    if (!expanded) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = entry.target.id.replace("section-", "") as TabId;
            setCurrentTab(id);
          }
        }
      },
      { rootMargin: "-25% 0px -65% 0px", threshold: 0 }
    );
    for (const item of navItems) {
      const el = document.getElementById(`section-${item.id}`);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
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

  const activeItem = useMemo(
    () => navItems.find((t) => t.id === (expanded ? currentTab : activeTab)) ?? navItems[0],
    [navItems, currentTab, activeTab, expanded]
  );
  const activeIndex = flowIndex(activeItem.id);

  return (
    <SectionNumberMapProvider sections={sections}>
      <ReadingModeProvider>
      <div className="min-h-screen bg-paper text-ink font-sans selection:bg-accent/20">
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

        <div className="h-1 bg-gradient-to-r from-accent to-gold fixed top-0 left-0 right-0 z-50 print:hidden" />
        <ScrollProgressBar />

        {/* ----------------------------------------------------------- hero */}
        {expanded && (
          <header className="cv-auto-hero relative pt-12 sm:pt-16 pb-6 sm:pb-10 overflow-hidden print:pt-4 print:pb-4">
            <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(circle_at_82%_8%,var(--color-glow),transparent_34%),linear-gradient(180deg,var(--color-card),var(--color-paper))]" />
            <AmbientField intensity="full" pattern="grid" />

            <div className="fx-hero-seq mx-auto w-full max-w-3xl px-4 sm:px-6 relative z-10">
              <div style={{ "--fx-i": 0 } as React.CSSProperties} className="fx-in-left flex items-center gap-2.5 mb-5 select-none">
                <WiperUmbrellaLogo />
                <div>
                  <div className="t-small text-accent font-black leading-tight">Hon. Dr. Benson Makali Mulu</div>
                  <div className="t-micro text-muted font-semibold mt-0.5">Kitui 2027 — strategy and direction</div>
                </div>
              </div>

              <div style={{ "--fx-i": 1 } as React.CSSProperties} className="fx-in-fade confidentiality-marker mb-5 flex items-baseline flex-wrap gap-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" aria-hidden="true" />
                <strong>Confidential</strong>
                <span className="opacity-70">— personal, link-only.</span>
              </div>

              <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 items-end">
                {/* The headline is text, and it is text once.

                    It used to be a line-split reveal, which meant two copies in the DOM: the real
                    string in a visually hidden node for assistive technology, and a stack of
                    aria-hidden spans to animate. aria-hidden hides a node from a screen reader and
                    from nothing else, so the page read "Kitui 2027: the intelligence behind what
                    you already publish." twice — to copy-paste, to reader mode, to find-in-page,
                    and to anyone who opened it with JavaScript off.

                    The split bought a staggered rise on the one element a reader is guaranteed to
                    be looking at before anything else has loaded. That is the definition of an
                    animation that delays reading, and kinetic headlines are on the deny list for
                    exactly this reason. The line break stays, because it is how the sentence
                    should break. */}
                <h1 className="col-span-2 sm:col-span-1 font-sans text-[1.7rem] sm:text-4xl lg:text-5xl leading-[1.14] sm:leading-[1.08] tracking-tight text-ink mb-4 font-bold text-balance">
                  <span className="block">Kitui 2027:</span>
                  <span className="block">the intelligence behind what you already publish.</span>
                </h1>
                <p style={{ "--fx-i": 3 } as React.CSSProperties} className="fx-in-up col-start-1 t-body text-muted leading-relaxed text-pretty">
                  Campaign strategy and digital architecture for Hon. Dr. Benson Makali Mulu, MP for Kitui Central and gubernatorial aspirant, Kitui County.
                </p>
                <div style={{ "--fx-i": 2 } as React.CSSProperties} className="fx-in-settle col-start-2 row-start-2 sm:row-start-1 sm:row-span-2 self-end w-[104px] sm:w-[150px] lg:w-[210px] shrink-0 -mb-1">
                  <Portrait id="hero-clasped-hands" sizes="(min-width: 1024px) 210px, (min-width: 640px) 150px, 104px" priority />
                </div>
              </div>

              {/* One instruction, and one choice.

                  The instruction is the only one the reader needs: keep going. The choice is the
                  honest form of the old line, which said "30 sections, 289 minutes" and left it
                  there. 289 minutes is a true number and a closed door — it is the first thing a
                  reader learns about a document they were sent on WhatsApp. Both reading times
                  are measured from the rendered segmentation rather than typed, so neither can
                  drift from what the page actually does. */}
              <div style={{ "--fx-i": 4 } as React.CSSProperties} className="fx-in-up mt-7 space-y-3">
                <p className="flex items-center gap-2.5 t-micro font-semibold text-muted">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-line/70">
                    <span className="fx-scroll-cue" aria-hidden="true" />
                  </span>
                  <span>Scroll. The whole proposal is on this page, in order — {navItems.length} sections.</span>
                </p>
                <ReadingModeToggle
                  briefMinutes={readingMinutes(Object.values(briefWordCounts).reduce((a, b) => a + b, 0))}
                  fullMinutes={readingMinutes(Object.values(wordCounts).reduce((a, b) => a + b, 0))}
                />
              </div>
            </div>
          </header>
        )}

        {/* ------------------------------------------------ evidence preface */}
        {expanded && (
          <section aria-label="The figures behind the decision" className="cv-auto-strip mx-auto w-full max-w-5xl px-4 sm:px-6 mt-2 mb-4 space-y-5">
            <Dashboard />
            <KeyFactsStrip />
          </section>
        )}

        {/* ------------------------------------------------------ the document */}
        <main className="mx-auto w-full max-w-3xl px-4 sm:px-6 pb-28 lg:pb-24">
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
              const position = flowIndex(item.id);
              return (
                <section
                  key={item.id}
                  id={`section-${item.id}`}
                  className="flow-section print:break-inside-auto"
                  aria-labelledby={`chap-${item.id}`}
                  // The real measured height of this section, so `content-visibility: auto` can
                  // skip laying it out without misreporting the document's length. One flat
                  // placeholder for all thirty made a 480,000px document claim to be 42,000px,
                  // and every deep link past the third section landed in the wrong place.
                  style={{ containIntrinsicSize: `auto ${sectionHeight(item.id, item.wordCount)}px` }}
                >
                  {act && <ActMarker act={act} index={FLOW_ACTS.indexOf(act)} total={FLOW_ACTS.length} />}
                  <div id={`chap-${item.id}`}>
                    <ChapterMarker
                      number={item.number}
                      label={item.label}
                      blurb={item.blurb}
                      position={position}
                      total={FLOW_ORDER.length}
                      minutes={readingMinutes(item.wordCount)}
                    />
                  </div>
                  {item.content ?? (
                    <StreamedSection tabId={item.id} words={item.wordCount} force={forced.has(item.id)} />
                  )}
                </section>
              );
            })}
          </div>

          {/* The figures that answer the document rather than precede it. */}
          {expanded && (
            <div className="mt-12 space-y-6 print:hidden">
              <Reveal variant="up" amount={0.1}>
                <div className="rounded-2xl border border-line/60">
                  <DeficitGauge />
                </div>
              </Reveal>
              <Reveal variant="up" delay={100} amount={0.1}>
                <HeroVisual />
              </Reveal>
              <LazyMount minHeight={460}>
                <VoterProjectionsChart />
              </LazyMount>
            </div>
          )}
        </main>

        <footer className="relative mt-10 pt-8 pb-32 lg:pb-16 px-4 sm:px-6 mx-auto w-full max-w-3xl">
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

        <FlowRail
          items={navItems.map((n) => ({ id: n.id, number: n.number, label: n.label }))}
          activeIndex={activeIndex}
          onSelect={goToSection}
        />

        <FlowChrome
          label={activeItem.label}
          number={activeItem.number}
          position={activeIndex}
          total={FLOW_ORDER.length}
          onOpenIndex={() => setIsTOCModalOpen(true)}
          onToggleTheme={toggleTheme}
          theme={theme}
          themeReady={mounted}
        />

        <MobileTOCModal
          sections={sections}
          wordCounts={wordCounts}
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
      </div>
      </ReadingModeProvider>
    </SectionNumberMapProvider>
  );
}
