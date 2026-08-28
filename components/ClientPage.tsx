"use client";

import dynamic from "next/dynamic";
import { useState, useEffect, useMemo, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { 
  FileText, 
  Target, 
  Activity, 
  FileKey, 
  Menu, 
  X, 
  Printer, 
  Maximize2, 
  Minimize2, 
  Sun, 
  Moon, 
  ChevronUp, 
  Settings,
  Coins,
  Users,
  Radio,
  ShieldCheck
} from "lucide-react";

import { useTheme } from "../lib/useTheme";
import { MarqueeCarousel } from "./MarqueeCarousel";
import { AnimatedMetric } from "./AnimatedMetric";
import { RadialProgress } from "./RadialProgress";
import { LazyMount } from "./LazyMount";

import {
  WatermarkedPillars,
  ProportionalDotMatrix,
  AudioSummaryPlayer,
  MilestoneTimeline,
  HeroStatTilt,
  ObjectiveAccordion,
  BadgeTicker,
  SpeechSnippetCard,
  InteractiveMapHover,
  KPIGauge,
  VoterDensityMap,
  DeficitSlider,
  VoterFunnel,
  InteractiveVoterFunnel,
  VoterProfile,
  IsotypeCitizens,
  SWOTMatrix,
  VoteProjectionGraph,
  DemographicBento,
  TargetingSimulator,
  ConversionTargetRing,
  FocusModeToggle,
  LiveGroundActivityTracker,
  FlywheelSchematic,
  ResourceLedger,
  OrgStructureTree,
  BudgetDistributionDial,
  CircuitWiringVisual,
  HorizontalMilestones,
  ComplianceDial,
  WardChecklist,
  ArchitecturePipeline,
  MessagingPlayground,
  RadioAircoverDial,
  CounterMessagingGrid,
  SloganCarousel,
  MediaPlaybackMockup,
  ToneOfVoiceScale,
  ToneVoiceSlider,
  SloganBuilder,
  SMSFeedbackVisualizer,
  CommunityScheduler,
  ColorSwatches,
  KPIDashboardGrid,
  ProjectBurndownChart,
  ChecklistProgressRings,
  PerformanceGauge,
  StatusBadgeMatrix,
  ResourceSpendingChart,
  ActionPriorityMatrix,
  CampaignRoadmapGantt,
  FeedbackLoopCircuit,
  PrintReportGenerator
} from "./StrategicAids";

// Dynamically import heavy components to optimize mobile performance and TTI
const Dashboard = dynamic(() => import("./Dashboard").then(mod => mod.Dashboard), { ssr: true });
const HeroVisual = dynamic(() => import("./HeroVisual").then(mod => mod.HeroVisual), { ssr: true });
const DataVisualizations = dynamic(() => import("./DataVisualizations").then(mod => mod.DataVisualizations), { ssr: false }); // Disable SSR for charts to reduce hydration cost
const VoterProjectionsChart = dynamic(() => import("./VoterProjectionsChart").then(mod => mod.VoterProjectionsChart), { ssr: false });
const StrategyRail = dynamic(() => import("./StrategyRail").then(mod => mod.StrategyRail), { ssr: true });

interface MarkdownSection {
  node: React.ReactNode;
  wordCount: number;
}

interface ClientPageProps {
  exec: MarkdownSection;
  strategy: MarkdownSection;
  operations: MarkdownSection;
  tactics: MarkdownSection;
  execution: MarkdownSection;
  appendix: MarkdownSection;
}

const WiperUmbrellaLogo = () => (
  <svg width="42" height="42" viewBox="0 0 120 120" fill="none" className="shrink-0 select-none drop-shadow-sm filter">
    {/* Red canopy segments (Left & Right) */}
    <path d="M60 20 C35 20 20 42 16 58 C25 54 36 54 44 58 C44 58 48 35 60 20 Z" fill="#e31d2b" />
    <path d="M60 20 C85 20 100 42 104 58 C95 54 84 54 76 58 C76 58 72 35 60 20 Z" fill="#e31d2b" />
    {/* Royal Blue canopy segment (Center) */}
    <path d="M60 20 C48 35 44 58 44 58 C54 54 66 54 76 58 C76 58 72 35 60 20 Z" fill="#0056a8" />
    {/* Clean division lines */}
    <path d="M60 20 L44 58" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M60 20 L76 58" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
    {/* Center top pinnacle pointer */}
    <path d="M58 14 H62 L60 20 Z" fill="#0056a8" />
    {/* Royal Blue J-Hook handle */}
    <path d="M60 58 V92 C60 98 52 98 52 92" stroke="#0056a8" strokeWidth="5.5" strokeLinecap="round" fill="none" />
  </svg>
);

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
    <div ref={containerRef} id={`section-${id}`} className="cv-auto-section print:break-inside-avoid min-h-[150px] snap-start scroll-mt-24 transition-all duration-500 ease-out">
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
        <div className="h-[200px] w-full bg-card/10 border border-line border-dashed rounded-3xl flex flex-col items-center justify-center text-[10px] font-mono font-bold text-muted/60 animate-pulse gap-2">
          <div className="w-6 h-6 rounded-full border-2 border-accent/30 border-t-accent animate-spin" />
          <span>High-DPI 4K OLED Pipeline Loading Section...</span>
        </div>
      )}
    </div>
  );
}

export function ClientPage({ exec, strategy, operations, tactics, execution, appendix }: ClientPageProps) {
  const [activeTab, setActiveTab] = useState("exec");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);

  const { theme, toggleTheme, mounted } = useTheme();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isFabOpen, setIsFabOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(progress);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = useMemo(() => [
    { id: "exec", label: "Executive Summary", icon: FileText, content: exec.node, wordCount: exec.wordCount },
    { id: "strategy", label: "Strategy & Targeting", icon: Target, content: strategy.node, wordCount: strategy.wordCount },
    { id: "operations", label: "Operations & Architecture", icon: Activity, content: operations.node, wordCount: operations.wordCount },
    { id: "tactics", label: "Tactics & Themes", icon: Activity, content: tactics.node, wordCount: tactics.wordCount },
    { id: "execution", label: "Implementation & KPIs", icon: Activity, content: execution.node, wordCount: execution.wordCount },
    { id: "appendix", label: "Appendix", icon: FileKey, content: appendix.node, wordCount: appendix.wordCount },
  ], [exec, strategy, operations, tactics, execution, appendix]);

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

  const renderSectionExtras = (sectionId: string) => {
    const showFocusToggle = sectionId !== "appendix";

    return (
      <div className="mt-8 pt-8 border-t border-line/20 space-y-8">
        {showFocusToggle && (
          <FocusModeToggle 
            isActive={isFocusMode} 
            onToggle={() => setIsFocusMode(!isFocusMode)} 
          />
        )}

        {isFocusMode ? (
          <div className="bg-paper border border-line border-dashed rounded-2xl p-6 text-center text-xs font-bold text-muted">
            Focus Mode Active: Non-prose elements and interactive visual dashboards are hidden.
          </div>
        ) : (
          <>
            {sectionId === "exec" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start relative">
                <WatermarkedPillars />
                <div className="space-y-6 z-10">
                  <BadgeTicker />
                  <ProportionalDotMatrix />
                  <ObjectiveAccordion />
                  <SpeechSnippetCard />
                </div>
                <div className="space-y-6 z-10">
                  <HeroStatTilt />
                  <AudioSummaryPlayer />
                  <MilestoneTimeline />
                  <InteractiveMapHover />
                  <KPIGauge />
                </div>
              </div>
            )}

            {sectionId === "strategy" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                <div className="space-y-6">
                  <VoterDensityMap />
                  <InteractiveVoterFunnel />
                  <VoterProfile />
                  <IsotypeCitizens />
                  <SWOTMatrix />
                </div>
                <div className="space-y-6">
                  <DeficitSlider />
                  <VoteProjectionGraph />
                  <DemographicBento />
                  <TargetingSimulator />
                  <ConversionTargetRing />
                </div>
              </div>
            )}

            {sectionId === "operations" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                <div className="space-y-6">
                  <LiveGroundActivityTracker />
                  <ResourceLedger />
                  <OrgStructureTree />
                  <BudgetDistributionDial />
                </div>
                <div className="space-y-6">
                  <FlywheelSchematic />
                  <CircuitWiringVisual />
                  <HorizontalMilestones />
                  <ComplianceDial />
                  <WardChecklist />
                  <ArchitecturePipeline />
                </div>
              </div>
            )}

            {sectionId === "tactics" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                <div className="space-y-6">
                  <MessagingPlayground />
                  <CounterMessagingGrid />
                  <MediaPlaybackMockup />
                  <SloganBuilder />
                </div>
                <div className="space-y-6">
                  <RadioAircoverDial />
                  <SloganCarousel />
                  <ToneVoiceSlider />
                  <SMSFeedbackVisualizer />
                  <CommunityScheduler />
                  <ColorSwatches />
                </div>
              </div>
            )}

            {sectionId === "execution" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                <div className="space-y-6">
                  <KPIDashboardGrid />
                  <ChecklistProgressRings />
                  <StatusBadgeMatrix />
                  <ActionPriorityMatrix />
                </div>
                <div className="space-y-6">
                  <ProjectBurndownChart />
                  <PerformanceGauge />
                  <ResourceSpendingChart />
                  <CampaignRoadmapGantt />
                  <FeedbackLoopCircuit />
                  <PrintReportGenerator />
                </div>
              </div>
            )}
          </>
        )}
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
      {/* Top Gradient Line */}
      <div className="h-1.5 bg-gradient-to-r from-accent to-gold fixed top-0 left-0 right-0 z-50 print:hidden" />
      
      {/* Scroll Progress Indicator */}
      <div 
        className="fixed top-1.5 left-0 right-0 h-1 bg-gradient-to-r from-accent to-gold z-50 origin-left transition-transform duration-75 pointer-events-none print:hidden"
        style={{ transform: `scaleX(${scrollProgress / 100})` }}
      />
      
      {/* Hero Header */}
      {(activeTab === "exec" || isExpanded) && (
        <header className="cv-auto-hero relative pt-16 pb-12 overflow-hidden print:pt-4 print:pb-4">
          <div className="absolute inset-0 pointer-events-none opacity-50 bg-[radial-gradient(circle_at_82%_10%,var(--color-glow),transparent_32%),linear-gradient(180deg,var(--color-card),var(--color-paper))]" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
            
            {/* Wiper Patriotic Front (WPF) Brand Banner */}
            <div className="flex items-center gap-3.5 mb-6 select-none bg-card/60 backdrop-blur-md border border-line rounded-2xl p-3.5 w-fit shadow-sm">
              <WiperUmbrellaLogo />
              <div>
                <div className="text-xs sm:text-sm tracking-[0.12em] uppercase text-accent font-black">
                  Wiper Patriotic Front (WPF)
                </div>
                <div className="text-[10px] sm:text-xs tracking-wider text-muted uppercase font-semibold mt-0.5">
                  Official Campaign Strategy Portal
                </div>
              </div>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-7xl leading-[1.05] tracking-tight max-w-4xl text-ink mb-6">
              Kitui 2027:<br />
              <span className="opacity-90">the operating system for an Economist Governor.</span>
            </h1>
            <p className="text-base sm:text-lg text-muted max-w-3xl leading-relaxed">
              Campaign Strategy & Digital Architecture Proposal for Hon. Dr. Benson Makali Mulu, MP for Kitui Central and gubernatorial aspirant, Kitui County.
            </p>
            
            <Dashboard />

            <MarqueeCarousel />

            <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6 items-end print:hidden">
              <div className="lg:col-span-2">
                <HeroVisual />
              </div>
              <div className="lg:col-span-1 flex flex-col gap-4">
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card/70 backdrop-blur-md border border-line p-4 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all">
                  <div className="text-[10px] uppercase tracking-widest text-muted font-extrabold mb-1">Recognition Gap</div>
                  <div className="font-serif text-2xl font-bold">15.3 pts</div>
                  <div className="h-1.5 bg-line rounded-full mt-3 overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: "76%" }} className="h-full bg-gradient-to-r from-accent to-gold" transition={{ duration: 1, delay: 0.4 }} />
                  </div>
                </motion.div>
                
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-card/70 backdrop-blur-md border border-line p-4 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all">
                  <div className="text-[10px] uppercase tracking-widest text-muted font-extrabold mb-1">Low-connectivity layer</div>
                  <div className="font-serif text-2xl font-bold">SMS + USSD</div>
                  <div className="h-1.5 bg-line rounded-full mt-3 overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: "86%" }} className="h-full bg-gradient-to-r from-accent to-gold" transition={{ duration: 1, delay: 0.5 }} />
                  </div>
                </motion.div>
                
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-card/70 backdrop-blur-md border border-line p-4 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all">
                  <div className="text-[10px] uppercase tracking-widest text-muted font-extrabold mb-1">Operating principle</div>
                  <div className="font-serif text-xl font-bold tracking-tight">Measure → learn → reallocate</div>
                  <div className="h-1.5 bg-line rounded-full mt-3 overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: "92%" }} className="h-full bg-gradient-to-r from-accent to-gold" transition={{ duration: 1, delay: 0.6 }} />
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </header>
      )}

      {/* Data Strip */}
      {(activeTab === "exec" || isExpanded) && (
        <section className="cv-auto-strip max-w-7xl mx-auto px-0 sm:px-6 mb-8 print:hidden space-y-8">
          <LazyMount minHeight={420}>
            <DataVisualizations />
          </LazyMount>
          <LazyMount minHeight={500}>
            <VoterProjectionsChart />
          </LazyMount>
        </section>
      )}

      {/* Main Content Layout */}
      <main className="max-w-7xl mx-auto px-0 sm:px-6 pb-24">
        <div className="print:hidden px-4 sm:px-0">
          {(activeTab === "exec" || isExpanded) && <StrategyRail />}
        </div>
        
        {/* Toolbar */}
        <div className={`sticky top-0 z-40 bg-paper/95 backdrop-blur-md py-3 px-4 sm:px-0 border-b border-line/25 ${(activeTab === "exec" || isExpanded) ? "mt-6" : "mt-0"} mb-6 flex items-center justify-between print:hidden`}>
          <div className="flex items-center gap-4">
            {activeTab !== "exec" && !isExpanded && (
              <div className="flex items-center gap-2.5 mr-2">
                <div className="scale-75 origin-left">
                  <WiperUmbrellaLogo />
                </div>
                <div className="hidden md:block">
                  <div className="text-[10px] tracking-wider font-black text-accent uppercase leading-none">Wiper Patriotic Front</div>
                  <div className="text-[9px] font-bold text-muted uppercase mt-0.5 leading-none">Kitui 2027 Strategy</div>
                </div>
              </div>
            )}
            <div className="flex gap-2">
              <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center gap-2 px-4 py-2 bg-card border border-line/60 rounded-xl text-sm font-bold text-ink hover:border-accent hover:text-accent transition-colors cursor-pointer"
              >
                {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                {isExpanded ? "Collapse All" : "Expand All"}
              </button>
              <button 
                onClick={() => window.print()}
                className="flex items-center gap-2 px-4 py-2 bg-card border border-line/60 rounded-xl text-sm font-bold text-ink hover:border-accent hover:text-accent transition-colors cursor-pointer"
              >
                <Printer size={16} />
                Print
              </button>
              <button 
                onClick={toggleTheme}
                className="flex items-center gap-2 px-4 py-2 bg-card border border-line/60 rounded-xl text-sm font-bold text-ink hover:border-accent hover:text-accent transition-colors cursor-pointer"
                aria-label="Toggle theme"
              >
                {mounted ? (
                  theme === "light" ? <Moon size={16} className="text-gold" /> : <Sun size={16} className="text-gold" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-line/40 animate-pulse" />
                )}
                <span>
                  {!mounted ? "Theme" : theme === "light" ? "Dark Mode" : "Light Mode"}
                </span>
              </button>
            </div>
          </div>
          <div className="text-xs font-bold text-muted hidden sm:block">
            {readingTime} min read · {wordCount.toLocaleString()} words
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 relative mt-8">
          
          {/* Mobile Tab Selector */}
          <div className="lg:hidden sticky top-20 z-30 print:hidden px-4">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="w-full flex items-center justify-between bg-card/95 backdrop-blur-md border border-line/60 shadow-sm rounded-2xl p-4 text-left font-semibold"
            >
              <div className="flex items-center gap-3">
                <activeItem.icon size={20} className="text-accent animate-pulse" />
                <span className="text-xs font-bold text-ink">
                  {isExpanded ? `Reading: ${activeItem.label}` : activeItem.label}
                </span>
              </div>
              {isMobileMenuOpen ? <X size={20} className="text-muted" /> : <Menu size={20} className="text-muted" />}
            </button>
            
            <AnimatePresence>
              {isMobileMenuOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-card border border-line rounded-2xl shadow-xl overflow-hidden z-50"
                >
                  {navItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-4 text-sm font-semibold border-b border-line last:border-b-0 transition-colors ${
                        activeTab === item.id ? "bg-accent/5 text-accent" : "text-muted hover:bg-paper"
                      }`}
                    >
                      <item.icon size={18} className={activeTab === item.id ? "text-accent" : "text-muted"} />
                      {item.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Desktop Sidebar Navigation */}
          <aside className="hidden lg:block w-72 flex-shrink-0 print:hidden">
            <div className="sticky top-24">
              <div className="text-xs uppercase tracking-widest font-extrabold text-muted mb-6 px-4">
                {isExpanded ? "Table of Contents" : "Architecture Sections"}
              </div>
              <nav className="flex flex-col gap-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all ${
                        isActive 
                          ? "bg-accent text-white shadow-md shadow-accent/20" 
                          : "text-muted hover:bg-ink/5 hover:text-ink cursor-pointer"
                      }`}
                    >
                      <Icon size={18} className={isActive ? "text-white" : "text-muted"} />
                      {item.label}
                    </button>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Content Area */}
          <div id="content-area" className="flex-1 min-w-0 scroll-mt-24">
            {isExpanded ? (
              <div className="space-y-16">
                {navItems.map((item, index) => (
                  <LazySection 
                    key={item.id}
                    id={item.id}
                    content={item.content}
                    renderSectionExtras={renderSectionExtras}
                    immediate={index === 0}
                  />
                ))}
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="print:block"
                >
                  <LazySection 
                    id={activeItem.id}
                    content={activeItem.content}
                    renderSectionExtras={renderSectionExtras}
                    immediate={true}
                  />
                </motion.div>
              </AnimatePresence>
            )}
          </div>
          
        </div>
      </main>
      
      {/* Print Note */}
      <div className="hidden print:block border-t border-line mt-8 pt-8 pb-8 px-4 text-sm text-muted max-w-7xl mx-auto">
        <p>Prepared by Firefly Management · August 2026 · Proposal for discussion.</p>
        <p className="mt-2 font-bold text-ink">Confidentiality / distribution:</p>
        <p>This proposal is designed as a personally shared, link-only document. It is configured as noindex, nofollow and contains deliberate placeholders where primary documents or campaign decisions are still required.</p>
      </div>

      {/* Mobile Floating Action Button (Thumb-Zone Optimization) */}
      <div className="fixed bottom-6 right-6 z-50 print:hidden lg:hidden">
        <div className="relative flex flex-col items-end gap-3">
          {/* Expanded FAB Menu Options */}
          <AnimatePresence>
            {isFabOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 15, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 15, scale: 0.9 }}
                className="flex flex-col items-end gap-2"
              >
                {/* Scroll to Top Option */}
                <button
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                    setIsFabOpen(false);
                  }}
                  className="flex items-center gap-2.5 px-3 py-2 bg-card border border-line shadow-lg rounded-xl text-xs font-bold text-ink hover:text-accent transition-all cursor-pointer"
                >
                  <span>Top</span>
                  <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                    <ChevronUp size={16} />
                  </div>
                </button>

                {/* Theme Selector Option */}
                <button
                  onClick={() => {
                    toggleTheme();
                    setIsFabOpen(false);
                  }}
                  className="flex items-center gap-2.5 px-3 py-2 bg-card border border-line shadow-lg rounded-xl text-xs font-bold text-ink hover:text-accent transition-all cursor-pointer"
                >
                  <span>{theme === "light" ? "Dark Mode" : "Light Mode"}</span>
                  <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                    {theme === "light" ? <Moon size={15} /> : <Sun size={15} />}
                  </div>
                </button>

                {/* Print Option */}
                <button
                  onClick={() => {
                    window.print();
                    setIsFabOpen(false);
                  }}
                  className="flex items-center gap-2.5 px-3 py-2 bg-card border border-line shadow-lg rounded-xl text-xs font-bold text-ink hover:text-accent transition-all cursor-pointer"
                >
                  <span>Print Document</span>
                  <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                    <Printer size={15} />
                  </div>
                </button>

                {/* Expand All / Collapse Option */}
                <button
                  onClick={() => {
                    setIsExpanded(!isExpanded);
                    setIsFabOpen(false);
                  }}
                  className="flex items-center gap-2.5 px-3 py-2 bg-card border border-line shadow-lg rounded-xl text-xs font-bold text-ink hover:text-accent transition-all cursor-pointer"
                >
                  <span>{isExpanded ? "Collapse View" : "Expand All"}</span>
                  <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                    {isExpanded ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
                  </div>
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Trigger Floating Action Button */}
          <button
            onClick={() => setIsFabOpen(!isFabOpen)}
            className="w-14 h-14 rounded-full bg-accent text-white flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer relative"
            aria-label="Open helper menu"
          >
            {isFabOpen ? (
              <X size={24} />
            ) : (
              <div className="relative">
                <Settings className="animate-spin-slow" size={24} />
                <span className="absolute top-0 right-0 w-2 h-2 bg-gold rounded-full border border-accent animate-ping" />
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
