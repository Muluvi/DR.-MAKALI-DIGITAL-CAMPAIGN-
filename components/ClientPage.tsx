"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { AnimatePresence, motion } from "motion/react";
import { FileText, Target, Activity, FileKey, Menu, X, Printer, Maximize2, Minimize2, Sun, Moon, ChevronUp, Settings, Coins, Users, Radio, ShieldCheck, Type, Eye, EyeOff, Sparkles, BookOpen } from "lucide-react";

import { useTheme } from "../lib/useTheme";
import { MarqueeCarousel } from "./MarqueeCarousel";
import { AnimatedMetric } from "./AnimatedMetric";
import { RadialProgress } from "./RadialProgress";
import { LazyMount } from "./LazyMount";
import { ScrollProgressBar } from "./ScrollProgressBar";
import { SectionStickyBar } from "./SectionStickyBar";
import { scrollToSectionWhenReady } from "../lib/scroll-to-section";
import { MobileTOCModal } from "./MobileTOCModal";
import { MobileBottomNav } from "./MobileBottomNav";
import { QuickNavCapsule } from "./QuickNavCapsule";
import { resolveLegacySectionId, type TabId } from "../lib/heading-slug";
import type { SectionItem } from "../lib/section-index";

import { FocusModeToggle, PrintReportGenerator } from "./StrategicAids";


import { Dashboard } from "./Dashboard";
import { HeroVisual } from "./HeroVisual";
import { NominationVerdict } from "./NominationVerdict";
import { DataVisualizations } from "./DataVisualizations";
import { VoterProjectionsChart } from "./VoterProjectionsChart";
import { SectionSkeleton } from "./SectionSkeleton";

function SectionTransition({ children, tabKey }: { children: React.ReactNode; tabKey?: string }) {
  return (
    <motion.div
      key={tabKey}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
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
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
}

interface MarkdownSection {
  node: React.ReactNode;
  wordCount: number;
}

interface ClientPageProps {
  sections: SectionItem[];
  exec: MarkdownSection;
  programme: MarkdownSection;
  registers: MarkdownSection;
}

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

// Full-bleed divider marking the start of one of the document's six major parts — breaks out
// of the max-w-7xl container to span the viewport edge-to-edge.
function PartDivider({ index, label }: { index: number; label: string }) {
  return (
    <div className="relative left-1/2 -translate-x-1/2 w-screen print:hidden" aria-hidden="true">
      <div className="h-12 sm:h-14 flex items-center bg-gradient-to-r from-accent/[0.05] via-gold/[0.06] to-accent/[0.05] border-y border-line/40">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 w-full flex items-center gap-3">
          <span className="font-mono text-[9px] sm:text-[10px] font-black text-accent/70 shrink-0">
            PART {index + 1}/3
          </span>
          <span className="h-px flex-1 bg-line/60" />
          <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-muted truncate">{label}</span>
        </div>
      </div>
    </div>
  );
}

const PART_TINTS = ["from-accent/[0.025]", "from-gold/[0.025]", "from-accent/[0.025]", "from-gold/[0.025]", "from-accent/[0.025]", "from-gold/[0.025]"];

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
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
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

const TAB_IDS = ["exec", "programme", "registers"];

export function ClientPage({ sections, exec, programme, registers }: ClientPageProps) {
  // Always starts on "exec" so server and client render the same tree on first paint — the URL
  // fragment is only readable client-side, so a shared deep link switches tab in a mount effect
  // below rather than in the initial state (see the useEffect reading window.location.hash).
  const [activeTab, setActiveTab] = useState("exec");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isTOCModalOpen, setIsTOCModalOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [readingDensity, setReadingDensity] = useState<"compact" | "balanced" | "generous">("balanced");

  const cycleDensity = () => {
    setReadingDensity((prev) => (prev === "compact" ? "balanced" : prev === "balanced" ? "generous" : "compact"));
  };

  const { theme, toggleTheme, mounted } = useTheme();

  const navItems = useMemo(() => [
    { id: "exec", label: "The Analysis", icon: FileText, content: exec.node, wordCount: exec.wordCount },
    { id: "programme", label: "The Programme", icon: Target, content: programme.node, wordCount: programme.wordCount },
    { id: "registers", label: "Registers", icon: FileKey, content: registers.node, wordCount: registers.wordCount },
  ], [exec, programme, registers]);

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
  }, [isExpanded, navItems]);

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
      const id = resolveLegacySectionId(rawId);
      const targetTab = id.split("-sec-")[0];
      const isValidTab = navItems.some((item) => item.id === targetTab);

      if (isValidTab && !isExpanded && activeTab !== targetTab) {
        setActiveTab(targetTab);
      }
      setIsMobileMenuOpen(false);
      scrollToSectionWhenReady(id, "smooth");
    },
    [activeTab, isExpanded, navItems]
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
    const hash = resolveLegacySectionId(window.location.hash.replace(/^#/, ""));
    if (!hash) return;
    const targetTab = hash.split("-sec-")[0];
    if (TAB_IDS.includes(targetTab)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing from the URL, which only exists client-side
      setActiveTab(targetTab);
    }
    scrollToSectionWhenReady(hash, "auto");
    // Runs once, on mount only.
  }, []);

  // Section extras.
  //
  // This used to be a two-column shelf of ~50 widgets appended BELOW each tab's entire prose —
  // the chart explaining §8B.5 sat 20,000 words downstream of the text it illustrated. Anything
  // that genuinely explains a section is now a heading insert in MarkdownViewer, mounted next to
  // the prose it belongs to. What remains here is the handful of surfaces that are about the
  // document as a whole rather than about one section, plus the closing ask.
  const renderSectionExtras = (sectionId: string) => {
    const showFocusToggle = sectionId !== "registers";

    return (
      <div className="mt-8 pt-8 border-t border-line/20 space-y-8">
        {showFocusToggle && (
          <FocusModeToggle
            isActive={isFocusMode}
            onToggle={() => setIsFocusMode(!isFocusMode)}
          />
        )}

        {/* DecisionPanel moved into the document's own close (MarkdownViewer); what remains
            here is page tooling, which is what this footer strip is for. */}
        {!isFocusMode && sectionId === "programme" && <PrintReportGenerator />}
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
    <div className="min-h-screen bg-paper text-ink font-sans selection:bg-accent/20">
      {/* First tab stop: skip 55,000 words of navigation chrome. */}
      <a href="#content-area" className="skip-link">Skip to content</a>

      {/* Top Gradient Line */}
      <div className="h-1.5 bg-gradient-to-r from-accent to-gold fixed top-0 left-0 right-0 z-50 print:hidden" />

      {/* Scroll Progress Indicator — CSS scroll-driven animation, JS fallback only */}
      <ScrollProgressBar />
      
      {/* Hero Header */}
      {(activeTab === "exec" || isExpanded) && (
        <header className="cv-auto-hero relative pt-10 sm:pt-14 pb-8 sm:pb-12 overflow-hidden print:pt-4 print:pb-4">
          <div className="absolute inset-0 pointer-events-none opacity-50 bg-[radial-gradient(circle_at_82%_10%,var(--color-glow),transparent_32%),linear-gradient(180deg,var(--color-card),var(--color-paper))]" />
          <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 relative z-10">
            
            {/* Wiper Patriotic Front (WPF) Brand Banner */}
            <div className="flex items-center gap-3 mb-4 sm:mb-6 select-none bg-card/80 backdrop-blur-md border border-line rounded-2xl p-2.5 sm:p-3.5 w-fit shadow-sm">
              <WiperUmbrellaLogo />
              <div>
                <div className="text-[11px] sm:text-sm tracking-[0.12em] uppercase text-accent font-black">
                  Wiper Patriotic Front (WPF)
                </div>
                <div className="text-[9px] sm:text-xs tracking-wider text-muted uppercase font-semibold mt-0.5">
                  Kitui 2027 Strategy Portal
                </div>
              </div>
            </div>

            <div className="confidentiality-marker mb-4 sm:mb-6 flex items-center gap-1.5 text-xs">
              <strong>Confidential</strong>
              <span className="opacity-70 truncate sm:whitespace-normal">— prepared for Wiper Patriotic Front campaign leadership.</span>
            </div>

            <h1 className="font-serif text-2xl sm:text-4xl md:text-5xl lg:text-6xl leading-[1.12] sm:leading-[1.08] tracking-tight max-w-4xl text-ink mb-4 sm:mb-6 font-semibold">
              Kitui 2027:<br />
              <span className="opacity-90">the operating system for an Economist Governor.</span>
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-muted max-w-3xl leading-relaxed">
              Campaign Strategy & Digital Architecture Proposal for Hon. Dr. Benson Makali Mulu, MP for Kitui Central and gubernatorial aspirant, Kitui County.
            </p>

            {/* Mobile Quick-Jump Chips (Thumb-accessible shortcuts) */}
            <div className="mt-5 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none lg:hidden select-none">
              <span className="text-[10px] uppercase font-extrabold tracking-widest text-muted shrink-0">
                Jump To:
              </span>
              <button
                onClick={() => setIsTOCModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-accent text-white text-xs font-bold shrink-0 flex items-center gap-1.5 shadow-sm shadow-accent/20 cursor-pointer"
              >
                <span>Full Index (20 Secs)</span>
              </button>
              <button
                onClick={() => navigateToSection("exec-sec-4-3")}
                className="px-3 py-1.5 rounded-xl bg-card border border-line text-ink text-xs font-bold shrink-0 hover:border-accent cursor-pointer"
              >
                200k Target Math
              </button>
              <button
                onClick={() => navigateToSection("programme-sec-6")}
                className="px-3 py-1.5 rounded-xl bg-card border border-line text-ink text-xs font-bold shrink-0 hover:border-accent cursor-pointer"
              >
                40 Wards Register
              </button>
              <button
                onClick={() => navigateToSection("programme-sec-9b")}
                className="px-3 py-1.5 rounded-xl bg-card border border-line text-ink text-xs font-bold shrink-0 hover:border-accent cursor-pointer"
              >
                Kikamba Radio
              </button>
              <button
                onClick={() => navigateToSection("programme-sec-8b")}
                className="px-3 py-1.5 rounded-xl bg-card border border-line text-ink text-xs font-bold shrink-0 hover:border-accent cursor-pointer"
              >
                ECFA Compliance
              </button>
            </div>
            
            <Dashboard />

            <MarqueeCarousel />

            <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6 items-start print:hidden">
              <div className="lg:col-span-2">
                <NominationVerdict />
              </div>
              <div className="lg:col-span-1">
                <HeroVisual />
              </div>
            </div>
          </div>
        </header>
      )}

      {/* Data Strip */}
      {(activeTab === "exec" || isExpanded) && (
        <section className="cv-auto-strip max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 mb-8 print:hidden space-y-6">
          <LazyMount minHeight={420}>
            <DataVisualizations />
          </LazyMount>
          <LazyMount minHeight={500}>
            <VoterProjectionsChart />
          </LazyMount>
        </section>
      )}

      {/* Main Content Layout */}
      <main className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 pb-36 lg:pb-24">
        <div className="print:hidden">
        </div>
        
        {/* Responsive Toolbar */}
        <div className={`sticky top-0 z-40 bg-paper/95 backdrop-blur-md py-2 sm:py-3 border-b border-line/25 ${(activeTab === "exec" || isExpanded) ? "mt-3 sm:mt-6" : "mt-0"} mb-3 sm:mb-6 flex items-center justify-between print:hidden`}>
          <div className="flex items-center gap-1.5 sm:gap-4 flex-1">
            {activeTab !== "exec" && !isExpanded && (
              <div className="flex items-center gap-2 mr-1 shrink-0">
                <div className="scale-75 origin-left">
                  <WiperUmbrellaLogo />
                </div>
                <div className="hidden sm:block">
                  <div className="text-[10px] tracking-wider font-black text-accent uppercase leading-none">Wiper Patriotic Front</div>
                  <div className="text-[9px] font-bold text-muted uppercase mt-0.5 leading-none">Kitui 2027 Strategy</div>
                </div>
              </div>
            )}

            {/* Desktop & Mobile Responsive Control Buttons */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button 
                onClick={() => setIsTOCModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 bg-accent/10 border border-accent/20 rounded-xl text-xs sm:text-sm font-bold text-accent hover:bg-accent hover:text-white active:scale-95 transition-all cursor-pointer min-h-[40px] sm:min-h-[42px]"
                aria-label="Open Table of Contents"
              >
                <FileText size={15} />
                <span className="hidden xs:inline">Index</span>
              </button>

              <button 
                onClick={cycleDensity}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 bg-card border border-line/60 rounded-xl text-xs sm:text-sm font-bold text-ink hover:border-accent hover:text-accent active:scale-95 transition-all cursor-pointer min-h-[40px] sm:min-h-[42px]"
                title={`Reading Density: ${readingDensity}`}
                aria-label="Toggle Reading Density"
              >
                <Type size={14} />
                <span className="capitalize text-[11px] sm:text-xs hidden xs:inline">{readingDensity}</span>
              </button>

              <button 
                onClick={() => setIsFocusMode(!isFocusMode)}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-2 border rounded-xl text-xs sm:text-sm font-bold active:scale-95 transition-all cursor-pointer min-h-[40px] sm:min-h-[42px] ${
                  isFocusMode 
                    ? "bg-accent border-accent text-white shadow-sm" 
                    : "bg-card border-line/60 text-ink hover:border-accent hover:text-accent"
                }`}
                title={isFocusMode ? "Exit Focus Mode" : "Enter Distraction-Free Focus Mode"}
                aria-label="Toggle Focus Mode"
              >
                {isFocusMode ? <EyeOff size={14} /> : <Eye size={14} />}
                <span className="hidden md:inline">{isFocusMode ? "Focus" : "Focus"}</span>
              </button>

              <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center gap-1.5 px-3 py-2 bg-card border border-line/60 rounded-xl text-xs sm:text-sm font-bold text-ink hover:border-accent hover:text-accent active:scale-95 transition-all cursor-pointer min-h-[40px] sm:min-h-[42px]"
              >
                {isExpanded ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
                <span className="hidden sm:inline">{isExpanded ? "Collapse All" : "Expand All"}</span>
                <span className="sm:hidden">{isExpanded ? "Collapse" : "All"}</span>
              </button>

              <button 
                onClick={() => window.print()}
                className="hidden sm:flex items-center gap-2 px-3.5 py-2 bg-card border border-line/60 rounded-xl text-sm font-bold text-ink hover:border-accent hover:text-accent active:scale-95 transition-all cursor-pointer min-h-[42px]"
              >
                <Printer size={15} />
                <span>Print</span>
              </button>

              <button 
                onClick={toggleTheme}
                className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-2 bg-card border border-line/60 rounded-xl text-xs sm:text-sm font-bold text-ink hover:border-accent hover:text-accent active:scale-95 transition-all cursor-pointer min-h-[40px] sm:min-h-[42px]"
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

          <div className="text-[11px] sm:text-xs font-bold text-muted shrink-0 pl-1 sm:pl-2">
            <span className="hidden md:inline">{readingTime} min read · </span>
            <span>{wordCount.toLocaleString()} wds</span>
          </div>
        </div>

        <SectionStickyBar />

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 relative mt-4 sm:mt-8">
          
          {/* Desktop Sidebar Navigation */}
          <aside className="toc-rail hidden lg:block w-72 flex-shrink-0 print:hidden">
            <div className="sticky top-24 space-y-4">
              <div className="bg-card/70 backdrop-blur-md border border-line/60 rounded-2xl p-4 shadow-sm">
                <div className="text-[10px] uppercase tracking-widest font-black text-muted mb-3 flex items-center justify-between">
                  <span>{isExpanded ? "All Chapters" : "Sections"}</span>
                  <span className="font-mono text-accent">{navItems.length} parts</span>
                </div>
                <nav className="flex flex-col gap-1.5">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    const sectionReadMin = Math.max(1, Math.ceil(item.wordCount / 220));
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleNavClick(item.id)}
                        className={`group relative flex items-center justify-between p-2.5 rounded-xl text-xs font-bold transition-all text-left ${
                          isActive 
                            ? "bg-accent text-white shadow-md shadow-accent/20" 
                            : "text-muted hover:bg-ink/5 hover:text-ink cursor-pointer"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <Icon size={15} className={isActive ? "text-white" : "text-muted group-hover:text-accent transition-colors"} />
                          <span className="truncate">{item.label}</span>
                        </div>
                        <span className={`text-[9px] font-mono shrink-0 px-1.5 py-0.5 rounded ${
                          isActive ? "bg-white/20 text-white" : "bg-line/30 text-muted"
                        }`}>
                          {sectionReadMin}m
                        </span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Minimalist Key Metric Summary Card */}
              <div className="bg-card/50 backdrop-blur-sm border border-line/40 rounded-2xl p-3.5 text-xs space-y-2">
                <div className="flex items-center justify-between text-[10px] uppercase tracking-wider font-extrabold text-muted">
                  <span>Target Victory</span>
                  <span className="text-accent font-black">200k Votes</span>
                </div>
                <div className="w-full bg-line/40 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-accent to-gold h-full w-[68%]" />
                </div>
                <div className="flex justify-between text-[9px] font-bold text-muted">
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
                    <PartDivider index={index} label={item.label} />
                    <div className={`bg-gradient-to-b ${PART_TINTS[index % PART_TINTS.length]} to-transparent rounded-b-3xl pt-8`}>
                      <LazySection
                        id={item.id}
                        content={item.content}
                        renderSectionExtras={renderSectionExtras}
                        immediate={index === 0}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <SectionTransition tabKey={activeTab}>
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
      <footer className="border-t border-line mt-8 pt-8 pb-28 lg:pb-10 px-4 sm:px-6 max-w-7xl mx-auto">
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
      />
    </div>
  );
}
