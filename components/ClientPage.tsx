"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { FileText, Target, Printer, Maximize2, Minimize2, Sun, Moon, Coins, Users, Radio, ShieldCheck, Type, Eye, EyeOff, Map, MessageSquare, Megaphone, Shield, Database, Gauge, HandCoins } from "lucide-react";

import { useTheme } from "../lib/useTheme";
import { MarqueeCarousel } from "./MarqueeCarousel";
import { LazyMount } from "./LazyMount";
import { ScrollProgressBar } from "./ScrollProgressBar";
import { SectionStickyBar } from "./SectionStickyBar";
import { scrollToSectionWhenReady } from "../lib/scroll-to-section";
import { MobileTOCModal } from "./MobileTOCModal";
import { MobileBottomNav } from "./MobileBottomNav";
import { QuickNavCapsule } from "./QuickNavCapsule";
import { resolveLegacySectionId, SECTIONS, type TabId } from "../lib/heading-slug";
import type { SectionItem } from "../lib/section-index";

import { FocusModeToggle, PrintReportGenerator } from "./StrategicAids";
import { SectionNumberMapProvider } from "./markdown/SectionNumberMap";


import {
  AmbientField,
  CustomCursor,
  MagneticButton,
  NavDots,
  RippleButton,
  Reveal,
  SplitText,
  SpotlightCard,
  TiltCard,
  WordCycler,
} from "./visual";
import { useDaypart, useScrollShell } from "../hooks/use-scroll-shell";

import { Dashboard } from "./Dashboard";
import { HeroVisual } from "./HeroVisual";
import { Portrait } from "./Portrait";
import { DeficitGauge } from "./charts/DeficitGauge";
import { DataVisualizations } from "./DataVisualizations";
import { VoterProjectionsChart } from "./VoterProjectionsChart";
import { SectionSkeleton } from "./SectionSkeleton";
import { DURATION } from "../lib/motion";

/**
 * The crossfade between sections — on a tab CHANGE, never on first paint.
 *
 * This used to carry `initial={{ opacity: 0 }}` unconditionally, which meant the server sent the
 * entire document body at `opacity: 0` and it stayed invisible until React had hydrated. Largest
 * Contentful Paint therefore could not fire until hydration finished, which measured at 6.2s on a
 * mid-range Android; the page also reported a perfect CLS of 0.000, for the unhelpful reason that
 * nothing was visible to shift. A reader whose JavaScript failed got a blank page carrying 55,500
 * words of markup.
 *
 * `initial={false}` until the reader has actually changed tab means Motion writes no starting
 * style, so the body ships legible and paints as soon as the HTML arrives. Every subsequent tab
 * change still animates. Server and first client render agree, so there is no hydration mismatch
 * to repair.
 */
function SectionTransition({ children, tabKey, animateEntrance }: { children: React.ReactNode; tabKey?: string; animateEntrance: boolean }) {
  return (
    <motion.div
      key={tabKey}
      initial={animateEntrance ? { opacity: 0, y: 10 } : false}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: DURATION.quick, ease: "easeOut" }}
      className="w-full print:block"
    >
      {children}
    </motion.div>
  );
}

function SectionTabTransition({ children }: { children: React.ReactNode }) {

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: DURATION.base, ease: "easeOut" }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
}

interface ClientPageProps {
  sections: SectionItem[];
  /** Rendered prose for the section this route serves — or all nine, on /full. */
  documents: Partial<Record<TabId, React.ReactNode>>;
  /** Every section's length, for reading time in the navigator. Nine integers, not nine trees. */
  wordCounts: Record<TabId, number>;
  activeTab: TabId;
  expanded: boolean;
}

// One icon per top-level section, keyed to what the section is about rather than to its position.
const SECTION_ICONS: Record<TabId, React.ComponentType<{ size?: number; className?: string }>> = {
  decision: HandCoins,
  evidence: Map,
  strategy: MessageSquare,
  publishing: Megaphone,
  ground: Users,
  defence: Shield,
  technology: Database,
  team: Target,
  delivery: Gauge,
};

const WiperUmbrellaLogo = () => (
  <svg width="42" height="42" viewBox="0 0 120 120" fill="none" className="shrink-0 select-none drop-shadow-sm filter">
    {/* Left Canopy Segment (Royal Blue) */}
    <path d="M60 20 C30 20 16 42 12 58 C24 53 42 53 60 58 Z" fill="#00209f" />
    {/* Right Canopy Segment (Bright Red) */}
    <path d="M60 20 C90 20 104 42 108 58 C96 53 78 53 60 58 Z" fill="#e31d2b" />
    {/* Center Division Line */}
    <path d="M60 20 V58" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
    {/* Top Pinnacle Pointer (Bright Red, as on PDF page 1) */}
    <path d="M57 11 H63 L60 20 Z" fill="#e31d2b" />
    {/* J-Hook handle (Royal Blue) */}
    <path d="M60 58 V92 C60 99 51 99 51 92" stroke="#00209f" strokeWidth="6" strokeLinecap="round" fill="none" />
  </svg>
);

// Full-bleed divider marking the start of a top-level section in Expand-All view — breaks out
// of the max-w-7xl container to span the viewport edge-to-edge.
function PartDivider({ number, label }: { number: string; label: string }) {
  return (
    <div className="relative left-1/2 -translate-x-1/2 w-screen print:hidden" aria-hidden="true">
      {/* The band is the seam between two parts of the argument, so it earns a little more than a
          rule: a slow gradient drift under a diagonal hatch, and one shimmer pass as it arrives. */}
      <div className="fx-shimmer relative h-12 sm:h-14 flex items-center border-y border-line/40 overflow-hidden">
        <div className="absolute inset-0 fx-gradient-live bg-[linear-gradient(100deg,var(--color-accent)_0%,transparent_35%,transparent_65%,var(--color-gold)_100%)] opacity-[0.07]" />
        <div className="absolute inset-0 fx-pattern-diagonal" />
        <div className="max-w-7xl mx-auto px-3 sm:px-6 w-full flex items-center gap-3 relative z-10">
          <span className="font-mono text-xs sm:text-sm font-bold text-accent shrink-0 tabular-nums">{number}</span>
          <span className="h-px w-6 bg-gradient-to-r from-accent to-transparent shrink-0" />
          <span className="text-sm sm:text-base font-semibold text-ink truncate">{label}</span>
        </div>
      </div>
    </div>
  );
}

const PART_TINTS = ["from-accent/[0.025]", "from-gold/[0.025]"];

// The five places a candidate looks for first. The scorecards lead, because they are the numbers
// the brief asks to be reachable in one interaction from the landing view.
const QUICK_LINKS = [
  { id: "decision-sec-8-1", label: "The scorecards" },
  { id: "evidence-sec-1-3-1", label: "Votes needed to win" },
  { id: "evidence-sec-1-3-2", label: "The 40 wards" },
  { id: "decision-sec-9-2", label: "Budget tiers" },
  { id: "evidence-sec-3-4-1", label: "Kikamba radio" },
];

interface LazySectionProps {
  id: string;
  content: React.ReactNode;
  renderSectionExtras: (sectionId: string) => React.ReactNode;
  immediate?: boolean;
}

function LazySection({ id, content, renderSectionExtras, immediate = false }: LazySectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasBeenVisible, setHasBeenVisible] = useState(immediate);

  useEffect(() => {
    if (immediate) {
      return;
    }
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasBeenVisible(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "350px 0px", // Pre-renders when 350px close to the viewport
        threshold: 0.01,
      }
    );

    const el = containerRef.current;
    if (el) {
      observer.observe(el);
    }

    return () => {
      observer.disconnect();
    };
  }, [immediate]);

  return (
    <div ref={containerRef} id={`section-${id}`} className="cv-auto-section clean-editorial-section py-4 sm:py-8 px-0 sm:px-2 print:break-inside-avoid min-h-[150px] snap-start scroll-mt-24 transition-all duration-500 ease-out">
      {hasBeenVisible ? (
        <motion.div
          // No starting state in the server HTML. This wraps a whole section's prose, so
          // `initial={{ opacity: 0 }}` here means the document ships invisible and waits on
          // hydration — the same defect the section crossfade above had, one level down.
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DURATION.slow, ease: [0.16, 1, 0.3, 1] }}
        >
          {content}
          {renderSectionExtras(id)}
        </motion.div>
      ) : (
        <SectionSkeleton />
      )}
    </div>
  );
}

const TAB_IDS: string[] = SECTIONS.map((s) => s.id);

export function ClientPage({ sections, documents, wordCounts, activeTab, expanded }: ClientPageProps) {
  // Always starts on the overview so server and client render the same tree on first paint — the
  // URL fragment is only readable client-side, so a shared deep link switches section in a mount
  // effect below rather than in the initial state (see the useEffect reading window.location.hash).
  // The URL is the source of truth for which section is open.
  //
  // Every section is its own statically generated route, so `activeTab` arrives as a prop and
  // changing it is a navigation. That makes each section independently shareable and gives the
  // reader a working back button through a 200-minute document — and it is what stops the server
  // sending eight sections nobody is reading.
  //
  // `setActiveTab` keeps the name the seven existing call sites use, so the navigation, the
  // observers and the deep-link handlers below are unchanged.
  const router = useRouter();

  // Whether the reader has navigated yet, so the section crossfade applies no `opacity: 0`
  // starting state on first paint — see SectionTransition.
  const [navigated, setNavigated] = useState(false);

  const setActiveTab = useCallback(
    (tab: string, hash?: string) => {
      if (tab === activeTab && !hash) return;
      setNavigated(true);
      router.push(`/${tab}${hash ? `#${hash}` : ""}`, { scroll: false });
    },
    [activeTab, router],
  );

  // Prefetching a section on hover or focus means the tap that follows resolves from cache.
  // Nine routes prefetched eagerly would cost more than the split saves, so it is intent-driven.
  const prefetchTab = useCallback((tab: string) => router.prefetch(`/${tab}`), [router]);

  /**
   * Print the whole proposal, not whichever section happens to be open.
   *
   * Before the route split there was no way to express "all of it" as a destination, so Export
   * PDF printed the current tab — a reader who pressed it on the opening section got one ninth
   * of a document of record and no indication that anything was missing. /full is that
   * destination, so printing now routes there first and prints once the page has painted.
   */
  const printFullDocument = useCallback(() => {
    if (expanded) {
      window.print();
      return;
    }
    setNavigated(true);
    router.push("/full", { scroll: false });
    // The navigation is a fetch; print once the new route has actually painted, rather than
    // guessing at a delay. Two frames is enough for layout, and the flag stops a second press
    // queueing a second dialog.
    let done = false;
    const fire = () => {
      if (done) return;
      done = true;
      requestAnimationFrame(() => requestAnimationFrame(() => window.print()));
    };
    const timer = window.setTimeout(fire, 1200);
    window.addEventListener("popstate", () => window.clearTimeout(timer), { once: true });
  }, [expanded, router]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isTOCModalOpen, setIsTOCModalOpen] = useState(false);
  // Expand All is the /full route: the whole document on one page, which is also what the print
  // path needs. It is the one route that pays for all nine sections, by design.
  const isExpanded = expanded;
  const setIsExpanded = useCallback(
    (want: boolean) => {
      setNavigated(true);
      router.push(want ? "/full" : `/${activeTab}`, { scroll: false });
    },
    [activeTab, router],
  );
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [isZeroChrome, setIsZeroChrome] = useState(false);
  const [readingDensity, setReadingDensity] = useState<"compact" | "balanced" | "generous">("balanced");

  // Page-level scroll state (direction, stuck, velocity skew) and the reader's local time of day,
  // both written onto <html> as data attributes and custom properties that CSS reads. Neither
  // triggers a React render; see hooks/use-scroll-shell.ts.
  useScrollShell();
  useDaypart();

  const cycleDensity = () => {
    setReadingDensity((prev) => (prev === "compact" ? "balanced" : prev === "balanced" ? "generous" : "compact"));
  };

  const { theme, toggleTheme, mounted } = useTheme();

  const navItems = useMemo(
    () =>
      SECTIONS.map((section) => ({
        id: section.id,
        number: section.number,
        label: section.label,
        blurb: section.blurb,
        icon: SECTION_ICONS[section.id],
        // Only the served section carries prose; the rest are nav entries until visited.
        content: documents[section.id] ?? null,
        wordCount: wordCounts[section.id],
      })),
    [documents, wordCounts]
  );

  // The set of ids that actually exist today, so resolveLegacySectionId can tell a retired
  // section number (redirect it) apart from a current one that just happens to reuse an old
  // number (leave it alone) — see the note on that function for why this matters.
  const validSectionIds = useMemo(() => new Set(sections.map((s) => s.id)), [sections]);



  // Premium dynamic category intersection observer to track active section while scrolling
  useEffect(() => {
    if (!isExpanded) return;

    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -60% 0px", // Trigger active focus as section scrolls into viewport focus
      threshold: 0.05,
    };

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id.replace("section-", "");
          setActiveTab(sectionId);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);

    navItems.forEach((item) => {
      const el = document.getElementById(`section-${item.id}`);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [isExpanded, navItems, setActiveTab]);

  const handleNavClick = (itemId: string) => {
    setActiveTab(itemId);
    setIsMobileMenuOpen(false);

    if (isExpanded) {
      setTimeout(() => {
        const el = document.getElementById(`section-${itemId}`);
        if (el) {
          // Align section perfectly to the sticky header offset
          const yOffset = -96;
          const y = el.getBoundingClientRect().top + window.scrollY + yOffset;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
      }, 50);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Deep-link navigation to a specific numbered section (id format "<tab>-sec-<slug>"),
  // used by in-text cross-references and the per-section copy-link buttons. Switches tab
  // if needed, waits for the target to mount, then scrolls to it and sets :target via the hash.
  const navigateToSection = useCallback(
    (rawId: string) => {
      const id = resolveLegacySectionId(rawId, validSectionIds);
      const targetTab = id.split("-sec-")[0];
      const isValidTab = navItems.some((item) => item.id === targetTab);

      // Carry the fragment into the navigation, so the destination URL is shareable the moment
      // it lands rather than after the scroll helper catches up.
      if (isValidTab && !isExpanded && activeTab !== targetTab) {
        setActiveTab(targetTab, id);
      }
      setIsMobileMenuOpen(false);
      // Polls for up to two seconds, which covers the route fetch as well as lazy mounting.
      scrollToSectionWhenReady(id, "smooth");
    },
    [activeTab, isExpanded, navItems, validSectionIds, setActiveTab]
  );

  useEffect(() => {
    window.__navigateToSection = navigateToSection;
    return () => {
      delete window.__navigateToSection;
    };
  }, [navigateToSection]);

  // On first load with a URL fragment already present (a shared deep link), switch to the
  // right tab — the fragment only exists client-side, so this can't happen in initial state —
  // then land on the section once its content has mounted.
  useEffect(() => {
    const hash = resolveLegacySectionId(window.location.hash.replace(/^#/, ""), validSectionIds);
    if (!hash) return;
    const targetTab = hash.split("-sec-")[0];
    // `replace`, not `push`: arriving on a shared deep link should not leave the landing route
    // behind in history for the back button to return to. And deliberately not through
    // setActiveTab — this is the first paint, so the section must not animate in as though the
    // reader had navigated to it.
    if (TAB_IDS.includes(targetTab) && targetTab !== activeTab) {
      router.replace(`/${targetTab}#${hash}`, { scroll: false });
    }
    scrollToSectionWhenReady(hash, "auto");
    // Runs once, on mount only — validSectionIds is available synchronously from the sections
    // prop by the time this fires, so it doesn't need to be a dependency.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // The same resolution, for a hash that changes while the page is already open — a legacy link
  // opened from another tab, or the back button after an in-document jump. Without this the
  // effect above only ever fires on a cold load, so a shared link from an earlier generation of
  // this document worked when pasted into a fresh tab and silently did nothing when clicked by
  // someone already reading.
  useEffect(() => {
    const onHashChange = () => {
      const raw = window.location.hash.replace(/^#/, "");
      if (!raw) return;
      const id = resolveLegacySectionId(raw, validSectionIds);
      const targetTab = id.split("-sec-")[0];
      if (!TAB_IDS.includes(targetTab)) return;
      setActiveTab(targetTab, id);
      scrollToSectionWhenReady(id, "smooth");
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [validSectionIds, setActiveTab]);

  // Section extras.
  //
  // This used to be a two-column shelf of ~50 widgets appended BELOW each tab's entire prose —
  // the chart explaining §9.2.5 sat 20,000 words downstream of the text it illustrated. Anything
  // that genuinely explains a section is now a heading insert in MarkdownViewer, mounted next to
  // the prose it belongs to. What remains here is the handful of surfaces that are about the
  // document as a whole rather than about one section, plus the closing ask.
  const renderSectionExtras = (sectionId: string) => {
    // The overview is the landing view and closes on its own section cards, so it does not need
    // the reading-mode strip beneath it.
    const showFocusToggle = sectionId !== "decision";

    return (
      <div className="mt-8 pt-8 border-t border-line/20 space-y-8">
        {/* The landing closes on the offer itself: nine cards, in reading order, so the first
            screen answers "what is being proposed" without opening a menu. */}
        {sectionId === "decision" && !isExpanded && (
          <nav aria-label="Proposal sections">
            <h2 className="font-serif text-lg sm:text-xl font-semibold text-ink mb-1">What this proposal covers</h2>
            <p className="text-sm text-muted mb-5">Nine sections. Every one of them opens on what it is for.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
              {navItems.slice(1).map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    onPointerEnter={() => prefetchTab(item.id)}
                    onFocus={() => prefetchTab(item.id)}
                    className="group text-left bg-card border border-line/60 rounded-2xl p-4 hover:border-accent focus-visible:border-accent transition-colors cursor-pointer flex flex-col gap-2 min-h-[112px]"
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon size={16} className="text-accent shrink-0" />
                      <span className="font-mono text-[11px] text-muted tabular-nums">{item.number}</span>
                    </div>
                    <span className="font-serif text-[15px] font-semibold text-ink leading-snug group-hover:text-accent transition-colors text-balance">
                      {item.label}
                    </span>
                    <span className="text-xs text-muted leading-snug mt-auto">{item.blurb}</span>
                  </button>
                );
              })}
            </div>
          </nav>
        )}

        {showFocusToggle && (
          <FocusModeToggle
            isActive={isFocusMode}
            onToggle={() => setIsFocusMode(!isFocusMode)}
          />
        )}

        {/* DecisionPanel moved into the document's own close (MarkdownViewer); what remains
            here is page tooling, which is what this footer strip is for. */}
        {!isFocusMode && sectionId === "decision" && <PrintReportGenerator onPrint={printFullDocument} />}
      </div>
    );
  };

  const activeItem = useMemo(() => navItems.find((t) => t.id === activeTab) || navItems[0], [navItems, activeTab]);
  
  const wordCount = useMemo(() => {
    if (isExpanded) {
      return navItems.reduce((sum, item) => sum + item.wordCount, 0);
    }
    return activeItem.wordCount;
  }, [isExpanded, activeItem.wordCount, navItems]);

  const readingTime = useMemo(() => Math.max(1, Math.ceil(wordCount / 220)), [wordCount]);

  return (
    <SectionNumberMapProvider sections={sections}>
    <div className="min-h-screen bg-paper text-ink font-sans selection:bg-accent/20">
      {/* First tab stop: skip 55,000 words of navigation chrome. */}
      <a href="#content-area" className="skip-link">Skip to content</a>

      {/* Top Gradient Line */}
      <div className="h-1.5 bg-gradient-to-r from-accent to-gold fixed top-0 left-0 right-0 z-50 print:hidden" />

      {/* Scroll Progress Indicator — CSS scroll-driven animation, JS fallback only */}
      <ScrollProgressBar />
      
      {/* Hero Header */}
      {(activeTab === "decision" || isExpanded) && (
        <header className="cv-auto-hero fx-vignette relative pt-10 sm:pt-14 pb-8 sm:pb-12 overflow-hidden print:pt-4 print:pb-4">
          {/* The base plate stays: it is what guarantees contrast for the title. The ambient
              field — drifting colour wells, a masked grid, film grain — is layered over it and
              is switched off wholesale under reduced motion, reduced data and print. */}
          <div className="absolute inset-0 pointer-events-none opacity-50 bg-[radial-gradient(circle_at_82%_10%,var(--color-glow),transparent_32%),linear-gradient(180deg,var(--color-card),var(--color-paper))]" />
          <AmbientField intensity="full" pattern="grid" />

          <div className="fx-hero-seq max-w-7xl mx-auto px-4 sm:px-5 lg:px-6 relative z-10">
            
            {/* Wiper Patriotic Front (WPF) Brand Banner */}
            <div style={{ "--fx-i": 0 } as React.CSSProperties} className="fx-in-left fx-glass fx-lift flex items-center gap-3 mb-4 sm:mb-6 select-none rounded-2xl p-2.5 sm:p-3.5 w-fit">
              <span className="fx-loop-float inline-flex"><WiperUmbrellaLogo /></span>
              <div>
                <div className="t-small sm:text-sm tracking-[0.12em] uppercase text-accent font-black">
                  Wiper Patriotic Front (WPF)
                </div>
                <div className="t-micro sm:text-xs tracking-wider text-muted uppercase font-semibold mt-0.5">
                  Kitui 2027 Strategy Portal
                </div>
              </div>
            </div>

            <div style={{ "--fx-i": 1 } as React.CSSProperties} className="fx-in-fade confidentiality-marker mb-4 sm:mb-6 flex items-center gap-1.5 text-xs">
              <span className="fx-loop-blink w-1.5 h-1.5 rounded-full bg-gold shrink-0" aria-hidden="true" />
              <strong>Confidential</strong>
              <span className="opacity-70 truncate sm:whitespace-normal">— prepared for Wiper Patriotic Front campaign leadership.</span>
            </div>

            {/* The title and the candidate, together. The portrait is a cutout, so it stands on
                the page rather than sitting in a frame; on a phone it goes under the text at a
                size that reads as a portrait rather than a thumbnail. */}
            {/* One portrait element, repositioned by grid rather than duplicated.
                Two elements with `hidden md:block` would look right and cost double: a browser
                downloads a `priority` image even when it is display:none, so a phone would pay
                for the 260px desktop rendition it never shows. `sizes` picks the rendition. */}
            <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 md:gap-x-8 items-end">
              {/* The one place on the site that gets a per-line masked reveal. It is the first
                  thing the candidate reads and the only heading long enough for the effect to
                  register as deliberate rather than as a stutter. The accessible copy is a
                  single unsplit string inside SplitText — the spans are aria-hidden. */}
              <h1 className="col-span-2 md:col-span-1 font-serif text-2xl sm:text-4xl md:text-5xl lg:text-6xl leading-[1.12] sm:leading-[1.08] tracking-tight max-w-4xl text-ink mb-4 sm:mb-6 font-semibold text-balance">
                <SplitText by="line" as="span" className="block" delay={180}>
                  {"Kitui 2027:\nthe operating system for an Economist Governor."}
                </SplitText>
              </h1>
              <p style={{ "--fx-i": 3 } as React.CSSProperties} className="fx-in-up col-start-1 text-sm sm:text-base md:text-lg text-muted max-w-3xl leading-relaxed text-pretty">
                Campaign Strategy & Digital Architecture Proposal for Hon. Dr. Benson Makali Mulu, MP for Kitui Central and gubernatorial aspirant, Kitui County.
              </p>
              {/* The cycler's word list is the section index itself, so it can never drift out of
                  step with the document the way a hand-written list would. */}
              <p style={{ "--fx-i": 4 } as React.CSSProperties} className="fx-in-up col-start-1 mt-3 t-small font-semibold text-muted flex items-baseline gap-1.5">
                <span>Covering</span>
                <WordCycler words={navItems.map((n) => n.label)} className="text-accent font-black" />
              </p>
              <div style={{ "--fx-i": 2 } as React.CSSProperties} className="fx-in-settle col-start-2 row-start-2 md:row-start-1 md:row-span-2 self-end w-[104px] md:w-[210px] lg:w-[260px] shrink-0 -mb-1 md:-mb-2">
                {/* Ken Burns on the cutout, at a rate slow enough that it reads as presence
                    rather than as movement. It is the only looping transform above the fold. */}
                <div className="fx-kenburns">
                  <Portrait
                    id="hero-clasped-hands"
                    sizes="(min-width: 1024px) 260px, (min-width: 768px) 210px, 104px"
                    priority
                  />
                </div>
              </div>
            </div>

            {/* Quick-jump chips — the five places a candidate reads first, one tap from the top. */}
            <div style={{ "--fx-i": 4 } as React.CSSProperties} className="fx-in-up mt-5 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none lg:hidden select-none -mx-4 px-4">
              <span className="text-xs font-semibold text-muted shrink-0">Jump to</span>
              <RippleButton
                onClick={() => setIsTOCModalOpen(true)}
                className="fx-shine px-3 py-1.5 rounded-xl bg-accent-solid text-on-accent text-xs font-bold shrink-0 flex items-center gap-1.5 shadow-sm shadow-accent/20 cursor-pointer tap-chip"
              >
                <span>Full index</span>
              </RippleButton>
              {QUICK_LINKS.map((link, i) => (
                <RippleButton
                  key={link.id}
                  onClick={() => navigateToSection(link.id)}
                  style={{ "--fx-i": i } as React.CSSProperties}
                  className="fx-bg-slide px-3 py-1.5 rounded-xl bg-card border border-line text-ink text-xs font-bold shrink-0 hover:border-accent hover:text-white cursor-pointer tap-chip"
                >
                  {link.label}
                </RippleButton>
              ))}
            </div>

            <Dashboard />

            <MarqueeCarousel />

            <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6 items-start print:hidden">
              {/* The verdict is the answer the whole document exists to give, so it gets the
                  pointer-tracked light. The illustration beside it gets the tilt — two distinct
                  signatures rather than the same treatment applied twice. */}
              <Reveal variant="left" className="lg:col-span-2" amount={0.1}>
                <SpotlightCard border className="rounded-2xl">
                  <DeficitGauge />
                </SpotlightCard>
              </Reveal>
              <Reveal variant="right" delay={120} className="lg:col-span-1" amount={0.1}>
                <TiltCard max={6}>
                  <HeroVisual />
                </TiltCard>
              </Reveal>
            </div>
          </div>
        </header>
      )}

      {/* Data Strip */}
      {(activeTab === "decision" || isExpanded) && (
        <section className="cv-auto-strip max-w-7xl mx-auto px-4 sm:px-5 lg:px-6 mb-8 print:hidden space-y-6">
          <LazyMount minHeight={420}>
            <DataVisualizations />
          </LazyMount>
          <LazyMount minHeight={500}>
            <VoterProjectionsChart />
          </LazyMount>
        </section>
      )}

      {/* Main Content Layout */}
      <main className={`max-w-7xl mx-auto px-3.5 sm:px-5 lg:px-6 transition-all duration-300 ${isZeroChrome ? "pb-12 lg:pb-24" : "pb-48 lg:pb-24"}`}>
        <div className="print:hidden">
        </div>
        
        {/* Responsive Toolbar */}
        <div className={`fx-header fx-dir-header sticky top-0 z-40 fx-glass rounded-b-xl py-2 sm:py-3 ${(activeTab === "decision" || isExpanded) ? "mt-3 sm:mt-6" : "mt-0"} mb-3 sm:mb-6 flex items-center justify-between gap-2 print:hidden`}>
          {/* The hairline under the bar is a gradient rather than a rule, so the toolbar reads as
              a lit edge over the document instead of a box drawn on top of it. */}
          <span aria-hidden="true" className="fx-divider-gradient absolute inset-x-0 bottom-0" />
          <div className="flex items-center gap-1.5 sm:gap-4 flex-1 min-w-0 overflow-x-auto scrollbar-none py-0.5">
            {activeTab !== "decision" && !isExpanded && (
              <div className="flex items-center gap-1.5 mr-1 shrink-0">
                <div className="scale-75 origin-left shrink-0">
                  <WiperUmbrellaLogo />
                </div>
                <div className="hidden sm:block">
                  <div className="t-label tracking-wider font-black text-accent uppercase leading-none">Wiper Patriotic Front</div>
                  <div className="t-micro font-bold text-muted uppercase mt-0.5 leading-none">Kitui 2027 Strategy</div>
                </div>
              </div>
            )}

            {/* Desktop & Mobile Responsive Control Buttons */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <RippleButton
                onClick={() => setIsTOCModalOpen(true)}
                className="group fx-shine flex items-center gap-1.5 px-3 py-2 bg-accent/10 border border-accent/20 rounded-xl text-xs sm:text-sm font-bold text-accent hover:bg-accent hover:text-white transition-all cursor-pointer min-h-[44px] sm:min-h-[44px]"
                aria-label="Open Table of Contents"
              >
                <FileText size={15} className="fx-icon-rise" />
                <span className="hidden xs:inline">Index</span>
              </RippleButton>

              <button 
                onClick={cycleDensity}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 bg-card border border-line/60 rounded-xl text-xs sm:text-sm font-bold text-ink hover:border-accent hover:text-accent fx-press fx-focus transition-all cursor-pointer min-h-[44px] sm:min-h-[44px]"
                title={`Reading Density: ${readingDensity}`}
                aria-label="Toggle Reading Density"
              >
                <Type size={14} />
                <span className="capitalize t-small sm:text-xs hidden xs:inline">{readingDensity}</span>
              </button>

              <button 
                onClick={() => setIsFocusMode(!isFocusMode)}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-2 border rounded-xl text-xs sm:text-sm font-bold fx-press fx-focus transition-all cursor-pointer min-h-[44px] sm:min-h-[44px] ${
                  isFocusMode 
                    ? "bg-accent-solid border-accent-solid text-on-accent shadow-sm" 
                    : "bg-card border-line/60 text-ink hover:border-accent hover:text-accent"
                }`}
                title={isFocusMode ? "Exit Focus Mode" : "Enter Distraction-Free Focus Mode"}
                aria-label="Toggle Focus Mode"
              >
                {isFocusMode ? <EyeOff size={14} /> : <Eye size={14} />}
                <span className="hidden md:inline">{isFocusMode ? "Focus" : "Focus"}</span>
              </button>

              <button 
                onClick={() => setIsZeroChrome(!isZeroChrome)}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-2 border rounded-xl text-xs sm:text-sm font-bold fx-press fx-focus transition-all cursor-pointer min-h-[44px] sm:min-h-[44px] ${
                  isZeroChrome 
                    ? "bg-accent-solid border-accent-solid text-on-accent shadow-sm" 
                    : "bg-card border-line/60 text-ink hover:border-accent hover:text-accent"
                }`}
                title={isZeroChrome ? "Exit Zero Chrome" : "Enter Zero Chrome Full-Screen"}
                aria-label="Toggle Zero Chrome"
              >
                <EyeOff size={14} className={isZeroChrome ? "text-white" : "text-accent"} />
                <span className="hidden sm:inline">Zero Chrome</span>
              </button>

              <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center gap-1.5 px-3 py-2 bg-card border border-line/60 rounded-xl text-xs sm:text-sm font-bold text-ink hover:border-accent hover:text-accent fx-press fx-focus transition-all cursor-pointer min-h-[44px] sm:min-h-[44px]"
              >
                {isExpanded ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
                <span className="hidden sm:inline">{isExpanded ? "Collapse All" : "Expand All"}</span>
                <span className="sm:hidden">{isExpanded ? "Collapse" : "All"}</span>
              </button>

              <MagneticButton
                onClick={printFullDocument}
                strength={0.22}
                className="group hidden sm:flex items-center gap-2 px-3.5 py-2 bg-card border border-line/60 rounded-xl text-sm font-bold text-ink hover:border-accent hover:text-accent transition-all cursor-pointer min-h-[44px]"
              >
                <Printer size={15} className="fx-icon-rise" />
                <span>Print</span>
              </MagneticButton>

              <button 
                onClick={toggleTheme}
                className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-2 bg-card border border-line/60 rounded-xl text-xs sm:text-sm font-bold text-ink hover:border-accent hover:text-accent fx-press fx-focus transition-all cursor-pointer min-h-[44px] sm:min-h-[44px]"
                aria-label="Toggle theme"
              >
                {mounted ? (
                  theme === "light" ? <Moon size={15} className="text-gold" /> : <Sun size={15} className="text-gold" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-line/40 animate-pulse" />
                )}
                <span className="hidden sm:inline">
                  {!mounted ? "Theme" : theme === "light" ? "Dark" : "Light"}
                </span>
              </button>
            </div>
          </div>

          <div className="t-small sm:text-xs font-bold text-muted shrink-0 pl-1 sm:pl-2">
            <span className="hidden md:inline">{readingTime} min read · </span>
            <span>{wordCount.toLocaleString()} wds</span>
          </div>
        </div>

        <SectionStickyBar sectionLabel={isExpanded ? undefined : activeItem.label} />

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 relative mt-4 sm:mt-8">
          
          {/* Desktop Sidebar Navigation */}
          <aside className="toc-rail hidden lg:block w-72 flex-shrink-0 print:hidden">
            <div className="sticky top-24 space-y-4">
              <SpotlightCard className="fx-glass rounded-2xl p-4">
                <div className="text-xs font-semibold text-muted mb-3 flex items-center justify-between">
                  <span>The proposal</span>
                  <span className="font-mono text-accent tabular-nums">{navItems.length} sections</span>
                </div>
                <nav className="flex flex-col gap-0.5 relative">
                  {/* The active-link marker is one element that slides, rather than a border that
                      appears on whichever item is current. --fx-rail-y/-h are written from the
                      active index, so the travel is a transform and never a layout read. */}
                  <span
                    aria-hidden="true"
                    className="fx-rail-indicator"
                    style={{
                      "--fx-rail-y": `${Math.max(0, navItems.findIndex((n) => n.id === activeTab)) * 36 + 6}px`,
                      "--fx-rail-h": "24px",
                    } as React.CSSProperties}
                  />
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    const sectionReadMin = Math.max(1, Math.ceil(item.wordCount / 220));
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleNavClick(item.id)}
                    onPointerEnter={() => prefetchTab(item.id)}
                    onFocus={() => prefetchTab(item.id)}
                        aria-current={isActive ? "true" : undefined}
                        className={`group relative flex items-center justify-between gap-2 px-2.5 py-2 rounded-xl text-xs transition-colors text-left ${
                          isActive
                            ? "bg-accent-solid text-on-accent shadow-sm shadow-accent/20 font-semibold"
                            : "text-muted hover:bg-ink/5 hover:text-ink cursor-pointer font-medium"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Icon size={15} className={`shrink-0 ${isActive ? "text-white" : "text-muted group-hover:text-accent transition-colors"}`} />
                          <span className="truncate leading-snug">{item.label}</span>
                        </div>
                        <span className={`font-mono text-[10px] shrink-0 tabular-nums ${
                          isActive ? "text-white/70" : "text-muted/70"
                        }`}>
                          {sectionReadMin}m
                        </span>
                      </button>
                    );
                  })}
                </nav>
              </SpotlightCard>

              {/* Minimalist Key Metric Summary Card */}
              <div className="fx-glass fx-lift rounded-2xl p-3.5 text-xs space-y-2">
                <div className="flex items-center justify-between t-label uppercase tracking-wider font-extrabold text-muted">
                  <span>Target Victory</span>
                  <span className="text-accent font-black tabular-nums">200k Votes</span>
                </div>
                {/* The bar grows from its baseline on entry, and under reduced motion it renders
                    at its true proportion rather than at zero. */}
                <div className="w-full bg-line/40 h-1.5 rounded-full overflow-hidden">
                  <div className="fx-bar-h bg-gradient-to-r from-accent to-gold h-full w-[68%] origin-left" />
                </div>
                <div className="flex justify-between t-micro font-bold text-muted">
                  <span>Kitui Central Core</span>
                  <span>40 Wards Field</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Content Area */}
          <div id="content-area" className={`flex-1 min-w-0 scroll-mt-24 density-${readingDensity} ${isFocusMode ? "focus-reading-mode" : ""}`}>
            {isExpanded ? (
              <div className="space-y-16">
                {navItems.map((item, index) => (
                  <div key={item.id}>
                    <PartDivider number={item.number} label={item.label} />
                    <div className={`bg-gradient-to-b ${PART_TINTS[index % PART_TINTS.length]} to-transparent rounded-b-3xl pt-8`}>
                      {/* Every section mounts at once on /full, rather than waiting to be
                          scrolled into view. This is the route Expand All and Export PDF lead
                          to, and a print job does not scroll: lazy-mounting here is what made
                          the old PDF come out as one section of prose followed by eight
                          skeletons. /full is the expensive route by design; this is the expense. */}
                      <LazySection
                        id={item.id}
                        content={item.content}
                        renderSectionExtras={renderSectionExtras}
                        immediate
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <SectionTransition tabKey={activeTab} animateEntrance={navigated}>
                  <LazySection 
                    id={activeItem.id}
                    content={activeItem.content}
                    renderSectionExtras={renderSectionExtras}
                    immediate={true}
                  />
                </SectionTransition>
              </AnimatePresence>

            )}
          </div>
          
        </div>
      </main>
      
      {/* Footer — visible on screen and repeated in print output */}
      <footer className="relative mt-8 pt-8 pb-28 lg:pb-10 px-4 sm:px-6 max-w-7xl mx-auto">
        <span aria-hidden="true" className="fx-divider-gradient absolute inset-x-4 sm:inset-x-6 top-0" />
        <div className="confidentiality-marker mb-3">
          <strong>Confidential</strong>
          <span className="opacity-70"> — link-only proposal for Wiper Patriotic Front campaign leadership. Not for public distribution.</span>
        </div>
        <p className="text-sm text-muted">Prepared by Firefly Management · August 2026 · Proposal for discussion.</p>
        <p className="mt-2 text-sm font-bold text-ink">Confidentiality / distribution:</p>
        <p className="text-sm text-muted">This proposal is designed as a personally shared, link-only document. It is configured as noindex, nofollow and contains deliberate placeholders where primary documents or campaign decisions are still required.</p>
      </footer>

      {/* Streamlined Mobile Bottom Navigation Dock */}
      <MobileBottomNav
        activeTab={activeTab}
        onTabChange={(tabId) => handleNavClick(tabId)}
        onOpenTOC={() => setIsTOCModalOpen(true)}
        isExpanded={isExpanded}
        onToggleExpanded={() => setIsExpanded(!isExpanded)}
        theme={theme}
        onToggleTheme={toggleTheme}
        isZeroChrome={isZeroChrome}
        onToggleZeroChrome={() => setIsZeroChrome(!isZeroChrome)}
      />

      {/* Mobile Table of Contents Full Modal Sheet */}
      <MobileTOCModal
        sections={sections}
        isOpen={isTOCModalOpen}
        onClose={() => setIsTOCModalOpen(false)}
        activeTab={activeTab}
        onSelectSection={(secId, tabId) => {
          if (!isExpanded && activeTab !== tabId) {
            setActiveTab(tabId);
          }
          scrollToSectionWhenReady(secId, "smooth");
        }}
      />

      {/* Quick Navigation Floating Capsule */}
      <QuickNavCapsule
        onNavigate={(secId) => navigateToSection(secId)}
        activeTab={activeTab}
        isZeroChrome={isZeroChrome}
      />

      {/* Additive chrome. Nothing in the document depends on any of it: the dots are a second
          route to a section the sidebar and the index already reach, back-to-top duplicates the
          Home key, and the cursor mounts only on a fine pointer with motion allowed. */}
      {!isZeroChrome && isExpanded && (
        <NavDots
          sections={navItems.map((n) => ({ id: n.id, label: n.label }))}
          onSelect={(id) => handleNavClick(id)}
        />
      )}
      <CustomCursor />
    </div>
    </SectionNumberMapProvider>
  );
}
