"use client";

import { motion, AnimatePresence, useInView } from "motion/react";
import { SPRING } from "../lib/motion";
import { useState, useEffect, useRef } from "react";
import { useMarqueeActive } from "../hooks/use-marquee-active";
import { useIsMobile } from "../hooks/use-mobile";
import { LazyMount } from "./LazyMount";
import { Play, Pause, Volume2, ChevronDown, ChevronUp, Calendar, User, Check, AlertTriangle, Sparkles, Target, Zap, ArrowRight, Maximize2, Minimize2, Sliders, Radio, ShieldCheck, Users, Coins, FileText, TrendingUp, MessageSquare, CheckCircle2, CheckSquare, MapPin, Globe, BookOpen, Activity, Database, RefreshCw, HelpCircle, Layers, TrendingDown, Table, Filter } from "lucide-react";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import ConstituencyBarChart from "./charts/ConstituencyBarChart";
import ResourceLedgerBarChart from "./charts/ResourceLedgerBarChart";

// ==========================================
// 1. EXECUTIVE SUMMARY VISUAL AIDS
// ==========================================

// 1. Watermarked Policy Pillars Background Component
export function WatermarkedPillars() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
      <div className="absolute top-[10%] left-[-5%] text-[9rem] font-black text-accent/[0.015] tracking-widest font-serif leading-none rotate-[-6deg]">
        UTAWALA
      </div>
      <div className="absolute bottom-[15%] right-[-5%] text-[10rem] font-black text-gold/[0.015] tracking-widest font-serif leading-none rotate-[4deg]">
        KAZI BORA
      </div>
      <div className="absolute top-[45%] left-[45%] text-[7rem] font-black text-accent/[0.01] tracking-widest font-serif leading-none rotate-[-12deg]">
        ECONOMIST
      </div>
    </div>
  );
}

// 2. Proportional Unit Dot Matrix Component
export function ProportionalDotMatrix() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  return (
    <div className="bg-card border border-line rounded-2xl p-5 shadow-sm my-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="font-serif text-sm font-bold text-ink">Kitui Connectivity Matrix (KIPPRA/KNBS)</h4>
          <p className="text-[11px] text-muted leading-tight mt-0.5">Household Broadband vs Offline/Feature-Phone Ratio (100-Unit Table)</p>
        </div>
        <div className="flex gap-3 text-[10px] font-black uppercase tracking-wider">
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-gold rounded-full shrink-0" /> 86.4% Offline/Feature-Phone</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-accent rounded-full shrink-0" /> 13.6% Broadband</span>
        </div>
      </div>
      
      <div className="grid grid-cols-10 gap-1.5 max-w-sm mx-auto my-2">
        {Array.from({ length: 100 }).map((_, i) => {
          const isOffline = i < 86;
          return (
            <motion.div
              key={i}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
              animate={{
                scale: hoveredIdx === i ? 1.3 : 1,
                rotate: hoveredIdx === i ? 12 : 0
              }}
              className={`aspect-square rounded-md transition-all duration-150 cursor-crosshair ${
                isOffline 
                  ? "bg-gold/20 hover:bg-gold border border-gold/40 shadow-[0_0_4px_rgba(227,29,43,0.15)]" 
                  : "bg-accent/20 hover:bg-accent border border-accent/40 shadow-[0_0_4px_rgba(0,86,168,0.15)]"
              }`}
              title={isOffline ? `${i + 1}: Offline or 2G/GSM Bound Household (86.4% KNBS Census)` : `${i + 1}: Active Broadband Internet Access Household (13.6% KNBS Census)`}
            />
          );
        })}
      </div>
      <p className="text-[10px] text-muted/80 leading-normal mt-3 italic border-t border-line/40 pt-2 font-medium">
        Data sourced from 2019 KNBS Census, Vol. IV (13.6% active internet use, 86.4% offline media environment), underscoring why USSD & 2G SMS outreach are critical.
      </p>
    </div>
  );
}

// 3. Interactive Audio Summary Player with dynamic wave animation
export function AudioSummaryPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [language, setLanguage] = useState<"en" | "kik">("en");
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setProgress((p) => {
          if (p >= 100) {
            setIsPlaying(false);
            return 0;
          }
          return p + 0.8;
        });
      }, 100);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying]);

  return (
    <div className="bg-gradient-to-br from-card to-paper border border-line rounded-2xl p-5 shadow-sm max-w-md my-4">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-accent/10 border border-accent/20 text-accent">
          <Volume2 size={18} />
        </div>
        <div>
          <h4 className="font-serif text-sm font-extrabold text-ink leading-tight">Governor&apos;s Strategy Brief</h4>
          <span className="text-[10px] uppercase tracking-widest font-bold text-accent">Bilingual Campaign Audio Player</span>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <button
          onClick={() => setLanguage("en")}
          className={`flex-1 text-[11px] font-bold py-1.5 rounded-lg border transition-all ${
            language === "en" ? "bg-accent text-white border-accent" : "bg-card text-muted border-line"
          }`}
        >
          English Audio
        </button>
        <button
          onClick={() => setLanguage("kik")}
          className={`flex-1 text-[11px] font-bold py-1.5 rounded-lg border transition-all ${
            language === "kik" ? "bg-gold text-white border-gold" : "bg-card text-muted border-line"
          }`}
        >
          Kikamba Summary
        </button>
      </div>

      {/* Dynamic Animated Waveform Visualization */}
      <div className="h-10 flex items-end gap-1 my-5 justify-center overflow-hidden">
        {Array.from({ length: 24 }).map((_, i) => {
          // Dynamic height generation based on state
          const randomBase = Math.sin(i * 0.3) * 14 + 16;
          const offset = (i % 3 === 0) ? 6 : (i % 2 === 0) ? 10 : 2;
          const randomHeight = isPlaying 
            ? randomBase + offset 
            : 4;
          return (
            <motion.div
              key={i}
              animate={{ scaleY: randomHeight / 36 }}
              transition={SPRING}
              className={`w-1.5 rounded-full origin-bottom ${isPlaying ? "bg-accent" : "bg-line"}`}
              style={{ height: 36 }}
            />
          );
        })}
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="p-3 rounded-full bg-accent text-white hover:bg-accent/90 transition-all shadow-md shrink-0 flex items-center justify-center cursor-pointer"
        >
          {isPlaying ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
        </button>
        <div className="flex-1">
          <div className="relative w-full h-1.5 bg-line rounded-full overflow-hidden">
            <div 
              className="absolute top-0 bottom-0 left-0 bg-accent transition-all duration-100" 
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[9px] font-bold text-muted mt-1.5 uppercase">
            <span>{language === "en" ? "0:12" : "0:19"} / 2:30</span>
            <span className="text-accent font-semibold">Vernacular Radio Audio Feed</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// 5. Hero Statistic Callout with 3D Tilt Effect
export function HeroStatTilt() {
  const cardRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile) return;
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const mouseX = e.clientX - rect.left - rect.width / 2;
    const mouseY = e.clientY - rect.top - rect.height / 2;
    setRotateX(-(mouseY / (rect.height / 2)) * 6);
    setRotateY((mouseX / (rect.width / 2)) * 6);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { setRotateX(0); setRotateY(0); }}
      animate={{ rotateX: isMobile ? 0 : rotateX, rotateY: isMobile ? 0 : rotateY }}
      style={{ transformStyle: "preserve-3d", perspective: 1000 }}
      className="bg-card border-2 border-gold/30 hover:border-gold/60 rounded-2xl p-6 shadow-md transition-all max-w-sm my-6 select-none cursor-grab"
    >
      <div style={{ transform: "translateZ(20px)" }} className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-black tracking-widest text-gold uppercase bg-gold/5 border border-gold/20 px-2.5 py-0.5 rounded-full">
            The Poll Deficit Gap
          </span>
          <AlertTriangle size={16} className="text-gold" />
        </div>
        <div>
          <span className="font-serif text-5xl font-black text-gold tracking-tight">&minus;15.3</span>
          <span className="font-serif text-xl font-black text-gold/70 ml-1">pts</span>
          <h4 className="text-xs font-bold text-ink leading-snug mt-2">Kitui Governor Seat Gap</h4>
          <p className="text-[11px] text-muted leading-relaxed mt-1">
            Current campaign deficit behind front-runner Kasalu as of the August 2026 baseline.
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// 6. Key Objective Accordion Component
export function ObjectiveAccordion() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const objectives = [
    { title: "Direct Delegate Consensus Campaigns", content: "Mobilizing local Ward coordinators across Kitui’s forty wards to secure direct Wiper delegate nominations on first ballot." },
    { title: "Kikamba Interactive Aircover Reach", content: "Syndicating live FM broadcasts, phone-in networks, and town halls with strategic airplay schedules to bypass low internet density." },
    { title: "Treasury Digitization Operations", content: "Structuring local financial audits to optimize Kitui’s own-source revenue goal target (KSh 1.339bn)." }
  ];

  return (
    <div className="bg-card border border-line rounded-2xl p-5 shadow-sm space-y-3 my-6">
      <h4 className="font-serif text-sm font-bold text-ink mb-2">Campaign Strategic Priorities</h4>
      {objectives.map((o, idx) => {
        const isOpen = openIdx === idx;
        return (
          <div key={idx} className="border border-line rounded-xl overflow-hidden">
            <button
              onClick={() => setOpenIdx(isOpen ? null : idx)}
              className="w-full flex items-center justify-between p-3.5 bg-paper text-left text-xs font-bold text-ink hover:text-accent transition-colors"
            >
              <span className="font-serif text-ink font-extrabold">{o.title}</span>
              {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: "auto" }}
                  exit={{ height: 0 }}
                  className="overflow-hidden bg-card"
                >
                  <p className="p-4 text-xs text-muted leading-relaxed border-t border-line">
                    {o.content}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}


// 8. Dynamic Speech Snippet Card
export function SpeechSnippetCard() {
  return (
    <div className="relative bg-card border border-line rounded-2xl p-6 shadow-sm overflow-hidden my-6">
      {/* Decorative J-Umbrella watermark */}
      <div className="absolute right-[-20px] bottom-[-20px] opacity-[0.03] text-accent select-none pointer-events-none">
        <svg width="150" height="150" viewBox="0 0 120 120" fill="currentColor">
          <path d="M60 20 C35 20 20 42 16 58 C25 54 36 54 44 58 C44 58 48 35 60 20 Z" />
          <path d="M60 20 C85 20 100 42 104 58 C95 54 84 54 76 58 C76 58 72 35 60 20 Z" />
          <path d="M60 20 C48 35 44 58 44 58 C54 54 66 54 76 58 Z" />
          <path d="M60 58 V92 C60 98 52 98 52 92" stroke="currentColor" strokeWidth="6" strokeLinecap="round" fill="none" />
        </svg>
      </div>

      <div className="border-l-4 border-gold pl-4 relative z-10">
        <p className="font-serif text-sm italic font-medium text-ink leading-relaxed">
          &ldquo;We must bridge the communication gap between our centers of policymaking and the offline majority of Kitui. Real developmental governance is structured around data, not political slogans.&rdquo;
        </p>
        <div className="mt-3">
          <h5 className="text-xs font-black text-accent uppercase tracking-wider">Brian Muluvi</h5>
          <span className="text-[10px] font-bold text-muted uppercase">Strategic Campaign Director</span>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 2. STRATEGY & TARGETING VISUAL AIDS
// ==========================================

// Interactive Voter Profile Bento Cards
export function VoterProfile() {
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const profiles = [
    {
      title: "Youth Segment",
      icon: Zap,
      metric: "38% Demographic Ratio",
      growth: "+12.4% Target Swing Growth",
      desc: "Young, mobile-first residents concentrated in Kitui commercial hubs.",
      tactics: ["SMS updates & offline USSD portal logs", "Co-operative loan support program narrative", "Empathetic economic stability messaging"]
    },
    {
      title: "Rural Citizen",
      icon: Globe,
      metric: "48% Demographic Ratio",
      growth: "+18.2% Wiper Loyalist Support",
      desc: "Farming majority located in Kitui's rural wards with low digital access.",
      tactics: ["Kikamba FM syndicated radio broadcasts", "Barazas and direct market assemblies", "Kikamba agricultural support brochures"]
    },
    {
      title: "Market Trader",
      icon: Sliders,
      metric: "14% Demographic Ratio",
      growth: "+9.5% SME Consensus Support",
      desc: "Small business and cooperative owners in towns and trade markets.",
      tactics: ["Economic policy briefs", "Direct delegate nominations involvement", "Statutory compliance guidelines transparency"]
    }
  ];

  return (
    <div className="bg-card border border-line rounded-2xl p-5 shadow-sm my-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="w-1.5 h-6 bg-gold rounded-full" />
        <h4 className="font-serif text-sm font-bold text-ink">Bento-Style Target Voter Profiles</h4>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4">
        {profiles.map((prof, idx) => {
          const Icon = prof.icon;
          return (
            <button
              key={idx}
              onClick={() => setSelectedIdx(idx)}
              className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 text-center transition-all cursor-pointer ${
                selectedIdx === idx 
                  ? "bg-accent/5 border-accent text-accent shadow-sm" 
                  : "bg-paper border-line text-muted hover:text-ink hover:border-line"
              }`}
            >
              <Icon size={14} className={selectedIdx === idx ? "text-accent" : "text-muted"} />
              <span className="text-[10px] font-black uppercase tracking-wider">{prof.title.split(" ")[0]}</span>
            </button>
          );
        })}
      </div>

      <motion.div 
        key={selectedIdx}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, ease: "easeOut" }}
        className="bg-paper border border-line rounded-xl p-4 relative overflow-hidden min-h-[140px] flex flex-col justify-between"
      >
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-[9px] uppercase tracking-widest font-black text-accent">{profiles[selectedIdx].metric}</span>
            <span className="text-[9px] uppercase tracking-widest font-black text-gold">{profiles[selectedIdx].growth}</span>
          </div>
          <h5 className="font-serif text-xs font-extrabold text-ink">{profiles[selectedIdx].title} Profile</h5>
          <p className="text-[11px] text-muted/90 mt-1 leading-snug">{profiles[selectedIdx].desc}</p>
        </div>
        
        <div className="mt-3 pt-3 border-t border-line/40 space-y-1">
          <span className="text-[9px] uppercase tracking-wider font-black text-muted block mb-1">Outreach Channels:</span>
          {profiles[selectedIdx].tactics.map((t, idx) => (
            <div key={idx} className="flex items-start gap-1.5 text-[10px] text-ink/80 leading-normal">
              <span className="w-1.5 h-1.5 bg-accent rounded-full mt-1.5 shrink-0" aria-hidden="true" />
              <span>{t}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

// 4. Isotype Citizen Icons
export function IsotypeCitizens() {
  const categories = [
    { name: "Youth Segment", icon: <User size={12} />, val: 4, label: "40% Target Focus", color: "bg-accent text-white" },
    { name: "SME Owners", icon: <User size={12} />, val: 3, label: "30% Target Focus", color: "bg-gold text-white" },
    { name: "Rural Offline Pop", icon: <User size={12} />, val: 3, label: "30% Target Focus", color: "bg-accent/40 text-ink" }
  ];

  return (
    <div className="bg-card border border-line rounded-2xl p-5 shadow-sm my-6">
      <h4 className="font-serif text-sm font-bold text-ink mb-4">Demographic Representation Matrix</h4>
      <div className="space-y-4">
        {categories.map((cat, idx) => (
          <div key={idx} className="flex items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-black text-accent uppercase tracking-widest leading-none">{cat.label}</span>
              <h5 className="text-xs font-bold text-ink mt-0.5">{cat.name}</h5>
            </div>
            <div className="flex gap-1.5 shrink-0">
              {Array.from({ length: 5 }).map((_, i) => (
                <div 
                  key={i} 
                  className={`p-1.5 rounded-md ${
                    i < cat.val ? cat.color : "bg-paper text-muted border border-line"
                  }`}
                >
                  {cat.icon}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 5. Interactive Core SWOT Matrix
export function SWOTMatrix() {
  const [swot, setSwot] = useState<"s" | "w" | "o" | "t">("s");
  const info = {
    s: { title: "Wiper Brand Capital Strength", text: "Legacy Wiper loyalty remains deep across Kitui Central, forming a reliable core baseline voting bloc." },
    w: { title: "The 15.3-point polling deficit", text: "Current campaign trail trailing margins require rapid acquisition of swing voter segments." },
    o: { title: "Offline Aircover Broadcasts", text: "86% offline population is heavily receptive to Kikamba radio syndication and baraza network engagements." },
    t: { title: "Opposition Coalition Resource Ops", text: "Counter-messaging loops are deployed to mitigate oppositional corporate spending advantages." }
  };

  return (
    <div className="bg-card border border-line rounded-2xl p-5 shadow-sm my-6">
      <h4 className="font-serif text-sm font-bold text-ink mb-3">Core Strategic SWOT Elements</h4>
      <div className="grid grid-cols-4 gap-2 mb-4">
        {Object.keys(info).map((key) => (
          <button
            key={key}
            onClick={() => setSwot(key as "s" | "w" | "o" | "t")}
            className={`text-sm font-black py-2.5 rounded-xl border uppercase tracking-wider transition-all cursor-pointer ${
              swot === key 
                ? "bg-accent border-accent text-white shadow-sm" 
                : "bg-paper border-line text-muted hover:text-accent"
            }`}
          >
            {key}
          </button>
        ))}
      </div>
      <div className="p-4 bg-paper border border-line rounded-xl min-h-[90px] relative overflow-hidden">
        <span className="text-[9px] uppercase tracking-widest font-black text-accent">Active Quadrant Overview</span>
        <h5 className="font-serif text-xs font-bold text-ink mt-0.5">{info[swot].title}</h5>
        <p className="text-[11px] text-muted/90 mt-1 leading-snug">{info[swot].text}</p>
      </div>
    </div>
  );
}

// 6. Live-Updating Vote Projection Graph
export function VoteProjectionGraph() {
  const points = [
    { month: "Aug 26", value: 37, goal: 37 },
    { month: "Nov 26", value: 41, goal: 43 },
    { month: "Mar 27", value: 46, goal: 48 },
    { month: "Jun 27", value: 51, goal: 52 },
    { month: "Aug 27", value: 55, goal: 55 }
  ];

  return (
    <div className="bg-card border border-line rounded-2xl p-5 shadow-sm my-6">
      <h4 className="font-serif text-sm font-bold text-ink mb-4">Vote Projection Vector (Polling Targets)</h4>
      
      {/* Visual SVG line trace chart mockup */}
      <div className="w-full h-32 border-b border-l border-line relative flex items-end justify-between px-4 pb-2">
        <svg className="absolute inset-0 w-full h-full p-2 overflow-visible">
          {/* Goal target dotted trace line */}
          <motion.path
            d="M 20 90 L 90 70 L 160 50 L 230 30 L 300 10"
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth="2.5"
            strokeDasharray="4 4"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5 }}
          />
          {/* Active projected trace line */}
          <motion.path
            d="M 20 90 L 90 80 L 160 60 L 230 40 L 300 10"
            fill="none"
            stroke="var(--color-gold)"
            strokeWidth="2.5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
          />
        </svg>
        {points.map((p, idx) => (
          <div key={idx} className="flex flex-col items-center relative z-10">
            <span className="text-[8px] font-black text-accent">{p.goal}%</span>
            <span className="text-[9px] font-bold text-muted mt-6">{p.month}</span>
          </div>
        ))}
      </div>
      <div className="flex gap-4 justify-center text-[10px] font-bold mt-3">
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-0.5 border-t-2 border-dashed border-accent" /> Campaign Goal Vector</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-0.5 border-t-2 border-gold" /> Targeted Trajectory</span>
      </div>
    </div>
  );
}

// 7. Bento-Table Demographic Cards
export function DemographicBento() {
  const cards = [
    { title: "Kitui Central SME Networks", percentage: "45%", sub: "Voter Density Concentration", color: "border-accent/40 bg-accent/5" },
    { title: "Mwingi West Trade Cooperatives", percentage: "35%", sub: "Strategic Business Alliances", color: "border-gold/40 bg-gold/5" },
    { title: "Kikamba Offline Majority", percentage: "86%", sub: "Primary Broadcast Targets", color: "border-line bg-card" }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
      {cards.map((card, idx) => (
        <div key={idx} className={`border rounded-2xl p-5 shadow-sm hover:shadow-md transition-all ${card.color}`}>
          <span className="text-[10px] font-black text-muted uppercase tracking-wider">{card.sub}</span>
          <h4 className="font-serif text-2xl font-black text-ink mt-2">{card.percentage}</h4>
          <p className="text-xs font-bold text-ink/90 mt-1 leading-snug">{card.title}</p>
        </div>
      ))}
    </div>
  );
}

// 8. Targeting Rule Simulator (Turnout impact widget)
export function TargetingSimulator() {
  const [turnout, setTurnout] = useState(70);
  const estimatedVotes = Math.round(480000 * (turnout / 100));

  return (
    <div className="bg-card border border-line rounded-2xl p-5 shadow-sm my-6">
      <h4 className="font-serif text-sm font-bold text-ink mb-1">Outreach Margin Calculator</h4>
      <p className="text-xs text-muted">Estimate campaign turnout scenarios across Kitui’s voting populations.</p>

      <div className="my-5">
        <div className="flex justify-between items-center text-xs font-bold text-ink mb-1">
          <span>Outreach Turnout Scenario</span>
          <span className="text-gold font-extrabold">{turnout}% Turnout</span>
        </div>
        <input
          type="range"
          min="50"
          max="95"
          value={turnout}
          onChange={(e) => setTurnout(parseInt(e.target.value))}
          className="w-full accent-gold bg-line h-2 rounded-lg cursor-pointer"
        />
      </div>

      <div className="bg-gold/5 border border-gold/20 rounded-xl p-4 flex items-center justify-between">
        <div>
          <span className="text-[9px] uppercase tracking-wider font-extrabold text-muted">Estimated Active Vote Base</span>
          <h5 className="font-serif text-lg font-black text-gold mt-0.5">{estimatedVotes.toLocaleString()} Votes</h5>
        </div>
        <div className="p-2 bg-card rounded-lg border border-line text-gold">
          <TrendingUp size={16} />
        </div>
      </div>
    </div>
  );
}

// 9. Animated Conversion Target Ring (SVG radial ring)
export function ConversionTargetRing() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true });
  const circumference = 2 * Math.PI * 30;
  const strokeDashoffset = isInView ? circumference - (75 / 100) * circumference : circumference;

  return (
    <div ref={containerRef} className="bg-paper/50 border border-line/80 border-dashed rounded-2xl p-4 shadow-sm flex items-center gap-4 my-6">
      <div className="relative w-16 h-16 shrink-0">
        <svg className="w-full h-full transform -rotate-90">
          <circle cx="32" cy="32" r="30" className="stroke-line/40" strokeWidth="4.5" fill="transparent" />
          <motion.circle
            cx="32"
            cy="32"
            r="30"
            stroke="var(--color-accent)"
            strokeWidth="5"
            fill="transparent"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.8, ease: "easeOut" }}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center font-serif text-sm font-black text-ink">
          75%
        </div>
      </div>
      <div>
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className="claim-badge claim-badge-estimate text-[8px] px-1.5 py-0.5 font-bold uppercase tracking-wider">
            Internal Target
          </span>
        </div>
        <h4 className="text-xs font-bold text-ink leading-tight">Wiper Nomination delegate alignment lock</h4>
        <p className="text-[10px] text-muted leading-tight mt-0.5">Primary strategic alignment goal targeted for first ballot consensus.</p>
      </div>
    </div>
  );
}

// 10. Focus-Mode Reading View (Simulated context state controller)
export function FocusModeToggle({ 
  onToggle, 
  isActive 
}: { 
  onToggle: () => void; 
  isActive: boolean;
}) {
  return (
    <div className="bg-card border border-line rounded-2xl p-4 shadow-sm flex items-center justify-between my-4 select-none">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-accent/10 text-accent">
          <BookOpen size={16} />
        </div>
        <div>
          <h4 className="text-xs font-extrabold text-ink leading-tight">Campaign Focus Mode</h4>
          <p className="text-[10px] text-muted">Collapse visual aids to focus solely on campaign strategy text.</p>
        </div>
      </div>
      <button
        onClick={onToggle}
        className={`px-3 py-1.5 rounded-lg text-xs font-extrabold uppercase tracking-wider transition-all border cursor-pointer ${
          isActive 
            ? "bg-accent border-accent text-white" 
            : "bg-paper border-line text-muted hover:text-accent"
        }`}
      >
        {isActive ? "Disable Focus" : "Enable Focus"}
      </button>
    </div>
  );
}

// ==========================================
// 3. OPERATIONS & ARCHITECTURE VISUAL AIDS
// ==========================================

// 2. Operational Flywheel Schematic (Animated SVG flow diagram)
export function FlywheelSchematic() {
  return (
    <div className="bg-card border border-line rounded-2xl p-5 shadow-sm my-6">
      <h4 className="font-serif text-sm font-bold text-ink mb-4">Integrated Feedback Flow Circuit</h4>
      <div className="w-full h-32 flex items-center justify-center bg-paper border border-line rounded-xl relative overflow-hidden">
        <svg className="w-full h-full max-w-xs overflow-visible" viewBox="0 0 300 120">
          {/* Box 1 */}
          <rect x="10" y="40" width="70" height="40" rx="6" className="fill-card stroke-accent stroke-[1.5]" />
          <text x="45" y="64" textAnchor="middle" className="fill-ink font-serif text-[8px] font-black">OFFLINE SMS</text>
          
          {/* Flow Arrow 1 */}
          <path d="M 80 60 L 110 60" stroke="var(--color-accent)" strokeWidth="2" strokeDasharray="3 3" />
          
          {/* Box 2 */}
          <rect x="115" y="40" width="70" height="40" rx="6" className="fill-card stroke-gold stroke-[1.5]" />
          <text x="150" y="64" textAnchor="middle" className="fill-ink font-serif text-[8px] font-black">CLOUD SYNC</text>
          
          {/* Flow Arrow 2 */}
          <path d="M 185 60 L 215 60" stroke="var(--color-gold)" strokeWidth="2" strokeDasharray="3 3" />
          
          {/* Box 3 */}
          <rect x="220" y="40" width="70" height="40" rx="6" className="fill-card stroke-accent stroke-[1.5]" />
          <text x="255" y="64" textAnchor="middle" className="fill-ink font-serif text-[8px] font-black">SECRETARIAT</text>
        </svg>
        <span className="absolute bottom-2 right-3 text-[9px] font-extrabold text-muted uppercase tracking-wider flex items-center gap-1">
          <RefreshCw size={10} aria-hidden="true" /> Proposed synchronisation loop
        </span>
      </div>
    </div>
  );
}

// 3. Resource Allocation Ledger Component
export function ResourceLedger() {
  const [sortField, setSortField] = useState<"budget" | "label">("budget");
  const items = [
    { label: "Offline Grassroots Aircover Broadcasts", budget: 4800000, percentage: "35%", color: "text-accent" },
    { label: "Wiper Nomination Delegate Operations", budget: 3400000, percentage: "25%", color: "text-ink" },
    { label: "Countywide Compliance Auditing Ledger", budget: 2700000, percentage: "20%", color: "text-gold font-bold" },
    { label: "Kitui Central SME Voter Outreach Networks", budget: 2890000, percentage: "20%", color: "text-ink" }
  ];

  const sortedItems = [...items].sort((a, b) => {
    if (sortField === "budget") return b.budget - a.budget;
    return a.label.localeCompare(b.label);
  });

  const chartData = items.map(item => ({
    name: item.label.replace("Kitui Central ", "").replace("Offline ", "").replace("Countywide ", ""),
    budget: item.budget,
    formatted: `KSh ${(item.budget / 1000000).toFixed(2)}M`
  }));

  const colors = ["var(--color-accent)", "var(--color-gold)", "#10b981", "#8b5cf6"];

  return (
    <div className="bg-card border border-line rounded-2xl p-5 shadow-sm my-6 overflow-hidden">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between mb-6 gap-3">
        <div>
          <h4 className="font-serif text-sm font-bold text-ink">Resource Deployment Ledger</h4>
          <p className="text-xs text-muted">Interactive allocation ledger sorted by importance</p>
        </div>
        <div className="flex gap-2 self-start sm:self-auto">
          <button
            onClick={() => setSortField("budget")}
            className={`text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded border transition-all ${
              sortField === "budget" ? "bg-accent border-accent text-white" : "bg-paper border-line text-muted"
            }`}
          >
            By Budget
          </button>
          <button
            onClick={() => setSortField("label")}
            className={`text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded border transition-all ${
              sortField === "label" ? "bg-accent border-accent text-white" : "bg-paper border-line text-muted"
            }`}
          >
            By Name
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
        {/* Table Column */}
        <div>
          {/* Desktop Matrix: Standard Table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-line text-[9px] uppercase font-black text-muted">
                  <th className="pb-2">Strategic Expenditure Channel</th>
                  <th className="pb-2 text-right">Target Allocation</th>
                  <th className="pb-2 text-right">Ratio</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/60">
                {sortedItems.map((item, idx) => (
                  <tr key={idx} className="text-xs">
                    <td className="py-2.5 font-medium text-ink leading-tight pr-3 truncate max-w-[180px]">{item.label}</td>
                    <td className="py-2.5 text-right font-serif font-bold text-ink">KSh {(item.budget / 1000000).toFixed(2)}M</td>
                    <td className="py-2.5 text-right font-serif font-black text-accent">{item.percentage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Stack: No-Scroll Strategic Card List */}
          <div className="block sm:hidden divide-y divide-line/40">
            {sortedItems.map((item, idx) => (
              <div key={idx} className="py-2.5 flex flex-col gap-1 text-xs">
                <div className="font-bold text-ink leading-tight">{item.label}</div>
                <div className="flex justify-between items-center text-[10px] mt-0.5">
                  <span className="text-muted font-medium">Target: <strong className="text-ink">KSh {(item.budget / 1000000).toFixed(2)}M</strong></span>
                  <span className="font-black text-accent">{item.percentage}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recharts Breakdown Column */}
        <div className="h-48 sm:h-56 w-full text-[9px]">
          <LazyMount minHeight={224} className="h-full">
            <ResourceLedgerBarChart chartData={chartData} colors={colors} />
          </LazyMount>
        </div>
      </div>
    </div>
  );
}

// 4. Interactive Organizational Structure Tree
export function OrgStructureTree() {
  const [activeNode, setActiveNode] = useState<string>("dir");
  const nodes: Record<string, { role: string; name: string; desc: string }> = {
    dir: { role: "Campaign Director", name: "Strategic Campaign Directorate", desc: "Coordinates high-level narrative alignment and polling growth." },
    ops: { role: "Ground Operations Lead", name: "Ward Coordinator Secretariat", desc: "Coordinates Baraza schedules and voter registration campaigns across forty wards." },
    tech: { role: "Systems Architect", name: "Digital SMS Support Group", desc: "Monitors offline voter databases and cloud syncing servers." }
  };

  return (
    <div className="bg-card border border-line rounded-2xl p-5 shadow-sm my-6">
      <h4 className="font-serif text-sm font-bold text-ink mb-4">Secretariat Command Hierarchy</h4>
      <div className="flex flex-col items-center gap-2">
        <button
          onClick={() => setActiveNode("dir")}
          className={`px-4 py-2 border rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeNode === "dir" ? "bg-accent border-accent text-white shadow-sm" : "bg-paper border-line text-ink"
          }`}
        >
          Directorate Command
        </button>
        <div className="w-0.5 h-4 bg-line" />
        <div className="flex gap-4">
          <button
            onClick={() => setActiveNode("ops")}
            className={`px-4 py-2 border rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeNode === "ops" ? "bg-accent border-accent text-white shadow-sm" : "bg-paper border-line text-ink"
            }`}
          >
            Ground Secretariat
          </button>
          <button
            onClick={() => setActiveNode("tech")}
            className={`px-4 py-2 border rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeNode === "tech" ? "bg-accent border-accent text-white shadow-sm" : "bg-paper border-line text-ink"
            }`}
          >
            Systems Alignment
          </button>
        </div>
      </div>

      <div className="mt-5 p-4 bg-paper border border-line rounded-xl">
        <span className="text-[10px] font-black text-accent uppercase tracking-widest">{nodes[activeNode].role}</span>
        <h5 className="font-serif text-xs font-bold text-ink mt-0.5">{nodes[activeNode].name}</h5>
        <p className="text-[11px] text-muted/90 mt-1 leading-snug">{nodes[activeNode].desc}</p>
      </div>
    </div>
  );
}

// 6. SVG Data Circuit Wiring Visual
export function CircuitWiringVisual() {
  return (
    <div className="bg-card border border-line rounded-2xl p-5 shadow-sm my-6">
      <h4 className="font-serif text-sm font-bold text-ink mb-2">Campaign Data Architecture Wiring</h4>
      <div className="w-full h-24 bg-paper border border-line rounded-xl relative flex items-center justify-around px-4">
        <div className="flex flex-col items-center gap-1 relative z-10">
          <div className="p-2 bg-card border border-line rounded-lg text-accent">
            <MessageSquare size={16} />
          </div>
          <span className="text-[9px] font-bold text-muted uppercase leading-none">USSD Feedback</span>
        </div>
        
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <path d="M 50 48 Q 150 20 250 48" fill="none" stroke="var(--color-accent)" strokeWidth="1.5" strokeDasharray="4 4" />
        </svg>

        <div className="flex flex-col items-center gap-1 relative z-10">
          <div className="p-2 bg-card border border-line rounded-lg text-gold">
            <Database size={16} />
          </div>
          <span className="text-[9px] font-bold text-muted uppercase leading-none">Central Server</span>
        </div>
      </div>
    </div>
  );
}

// 7. Interactive Milestones Timeline (Horizontal scrolling timeline)
export function HorizontalMilestones() {
  const steps = [
    { title: "Ward Outreach", date: "Sept 2026", status: "Completed" },
    { title: "Media Launch", date: "Dec 2026", status: "In Progress" },
    { title: "Baraza Sync", date: "April 2027", status: "Pending" }
  ];

  return (
    <div className="bg-card border border-line rounded-2xl p-5 shadow-sm my-6 overflow-hidden">
      <h4 className="font-serif text-sm font-bold text-ink mb-4">Milestone Roadmap Indicators</h4>
      <div className="flex gap-4 items-center justify-between overflow-x-auto pb-2">
        {steps.map((st, i) => (
          <div key={i} className="flex-1 min-w-[100px] border border-line rounded-xl p-3 bg-paper hover:border-accent/40 transition-colors">
            <span className="text-[9px] font-black text-accent uppercase tracking-widest">{st.date}</span>
            <h5 className="font-serif text-xs font-bold text-ink mt-0.5">{st.title}</h5>
            <span className={`inline-block text-[8px] font-bold px-1.5 py-0.5 rounded-full mt-1.5 ${
              st.status === "Completed" ? "bg-emerald-500/20 text-emerald-600" :
              st.status === "In Progress" ? "bg-gold/20 text-gold" : "bg-line text-muted"
            }`}>
              {st.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// 8. Compliance Level Dial (Circular SVG speedometer gauge)
export function ComplianceDial() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true });
  const strokeDashoffset = isInView ? 126 - (95 / 100) * 126 : 126;

  return (
    <div ref={containerRef} className="bg-card border border-line rounded-2xl p-5 shadow-sm my-6 flex items-center gap-5">
      <div className="relative w-16 h-16 shrink-0">
        <svg className="w-full h-full transform -rotate-180" viewBox="0 0 64 64">
          <path d="M 12 40 A 20 20 0 0 1 52 40" fill="none" className="stroke-line/50" strokeWidth="5" />
          <motion.path
            d="M 12 40 A 20 20 0 0 1 52 40"
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth="5"
            strokeDasharray="126"
            initial={{ strokeDashoffset: 126 }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.8 }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center font-serif text-sm font-black text-ink">
          95%
        </div>
      </div>
      <div>
        <h4 className="text-xs font-bold text-ink leading-tight">Statutory Spending Compliance</h4>
        <p className="text-[10px] text-muted mt-1 leading-relaxed">Legal campaign funding structure meets or exceeds IEBC standards.</p>
      </div>
    </div>
  );
}

// 9. Interactive Ward Checklist
export function WardChecklist() {
  const [checked, setChecked] = useState<Record<number, boolean>>({ 0: true, 1: true });
  const wards = [
    "Kitui Central Town Council",
    "Mwingi Central Township Co-ops",
    "Kitui South Rural Outreach Groups",
    "Kitui West Local Committee Networks"
  ];

  const handleToggle = (idx: number) => {
    setChecked((p) => ({ ...p, [idx]: !p[idx] }));
  };

  return (
    <div className="bg-card border border-line rounded-2xl p-5 shadow-sm my-6">
      <h4 className="font-serif text-sm font-bold text-ink mb-3">Constituency Operational Validation</h4>
      <div className="space-y-2">
        {wards.map((ward, idx) => (
          <button
            key={idx}
            onClick={() => handleToggle(idx)}
            className="w-full flex items-center gap-3 p-2.5 bg-paper rounded-xl text-left border border-line/60 hover:border-accent/30 transition-all cursor-pointer"
          >
            <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
              checked[idx] ? "bg-accent border-accent text-white" : "border-line bg-card"
            }`}>
              {checked[idx] && <Check size={11} />}
            </div>
            <span className="text-xs font-bold text-ink leading-none">{ward}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// 10. Bespoke Step-by-Step Architecture Pipeline (Vertical Stepper)
export function ArchitecturePipeline() {
  const steps = [
    { step: "01", title: "Offline SMS Interface", desc: "USSD messaging logs collected on the ground from registered offline voters." },
    { step: "02", title: "Automated Data Import", desc: "Campaign server automatically cleans, filters, and groups incoming voter profiles." },
    { step: "03", title: "Directorate Deployment", desc: "Campaign directors review target segments and deploy localized radio broadcasts." }
  ];

  return (
    <div className="bg-card border border-line rounded-2xl p-5 shadow-sm my-6 space-y-4">
      <h4 className="font-serif text-sm font-bold text-ink">Bespoke Step-by-Step Sync Pipeline</h4>
      <div className="space-y-4">
        {steps.map((st, i) => (
          <div key={i} className="flex gap-4 items-start">
            <span className="font-serif text-lg font-black text-accent bg-accent/5 border border-accent/20 px-2.5 py-1 rounded-xl leading-none">
              {st.step}
            </span>
            <div>
              <h5 className="font-serif text-xs font-black text-ink">{st.title}</h5>
              <p className="text-[11px] text-muted leading-snug mt-1">{st.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// 4. TACTICS & THEMES VISUAL AIDS
// ==========================================

// 1. Interactive Messaging Playground (Language Tabs)
export function MessagingPlayground() {
  const [lang, setLang] = useState<"en" | "kik" | "sw">("en");
  const messages = {
    en: { slogan: "Sustainable Growth & Dev", copy: "Building a transparent, data-driven local treasury to empower Kitui Central businesses." },
    kik: { slogan: "Mbeu Nsya na Maendeeo", copy: "Kuseuvya mitalo ya mbeo nzao ila yithataa muingi wa Kitui na biashara kwoo." },
    sw: { slogan: "Maendeleo Mapya Kitui", copy: "Kukuza mifumo ya wazi ya hazina ili kuwezesha biashara ndogo ndogo Kitui." }
  };

  return (
    <div className="bg-card border border-line rounded-2xl p-5 shadow-sm my-6">
      <h4 className="font-serif text-sm font-bold text-ink mb-3">Multilingual Campaign Slogan Selector</h4>
      <div className="flex gap-1.5 mb-4">
        {Object.keys(messages).map((l) => (
          <button
            key={l}
            onClick={() => setLang(l as "en" | "kik" | "sw")}
            className={`flex-1 text-[10px] font-black uppercase py-1.5 rounded-lg border transition-all cursor-pointer ${
              lang === l ? "bg-accent border-accent text-white" : "bg-paper border-line text-muted"
            }`}
          >
            {l === "en" ? "English" : l === "kik" ? "Kikamba" : "Swahili"}
          </button>
        ))}
      </div>

      <div className="p-4 bg-paper border border-line rounded-xl">
        <span className="text-[9px] font-black text-accent uppercase tracking-widest leading-none">Aligned Brand Slogan</span>
        <h5 className="font-serif text-sm font-black text-ink mt-0.5">{messages[lang].slogan}</h5>
        <p className="text-xs text-muted/90 mt-1.5 leading-relaxed">{messages[lang].copy}</p>
      </div>
    </div>
  );
}

// 2. Kikamba Radio Aircover Dial (Animated SVG wavelength)
export function RadioAircoverDial() {
  return (
    <div className="bg-card border border-line rounded-2xl p-5 shadow-sm my-6 flex items-center gap-5">
      <div className="relative w-16 h-16 shrink-0 flex items-center justify-center bg-accent/5 border border-accent/20 rounded-full text-accent">
        <Radio size={24} aria-hidden="true" />
      </div>
      <div>
        <h4 className="text-xs font-bold text-ink leading-tight">Interactive FM Broadcasters Sync</h4>
        <p className="text-[10px] text-muted mt-1 leading-snug">
          Syndicated audio broadcast network schedules cover 85% of Kitui&apos;s offline districts.
        </p>
      </div>
    </div>
  );
}

// 3. Dynamic Counter-Messaging Table (Side-by-side)
export function CounterMessagingGrid() {
  return (
    <div className="bg-card border border-line rounded-2xl p-5 shadow-sm my-6 space-y-4">
      <h4 className="font-serif text-sm font-bold text-ink">Opposition Counter-Narrative Matrix</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 bg-red-500/[0.03] border border-red-500/20 rounded-xl">
          <span className="text-[9px] uppercase tracking-widest font-black text-red-600">Opposition Claim</span>
          <p className="text-[11px] text-muted mt-1.5 leading-relaxed">
            &ldquo;Wiper&apos;s offline model fails to match digitized investment and high-tech corporate frameworks.&rdquo;
          </p>
        </div>
        <div className="p-4 bg-accent/[0.03] border border-accent/20 rounded-xl">
          <span className="text-[9px] uppercase tracking-widest font-black text-accent">Wiper Talking Point</span>
          <p className="text-[11px] text-muted mt-1.5 leading-relaxed">
            &ldquo;We integrate offline SMS syncing with modern cloud systems, respecting Kitui&apos;s 86% offline population.&rdquo;
          </p>
        </div>
      </div>
    </div>
  );
}

// 4. Endless Slogan Carousel
export function SloganCarousel() {
  const { containerRef, isActive } = useMarqueeActive<HTMLDivElement>();
  const slogans = ["MBEU NSYA", "KAZI BORA", "GOVERNOR ECONOMIST", "WIPER DEMOCRATIC MOVEMENT", "UTAWALA BORA"];
  return (
    <div ref={containerRef} className="relative w-full overflow-hidden select-none py-3 border-y border-line/60 bg-card my-4">
      <motion.div
        className="flex gap-4 w-max shrink-0"
        animate={{}}
        
      >
        <div className="flex gap-6 shrink-0">
          {slogans.map((s, idx) => (
            <span key={idx} className="text-[11px] font-black text-gold uppercase flex items-center gap-2 whitespace-nowrap">
              <Zap size={11} /> {s}
            </span>
          ))}
        </div>
        <div className="flex gap-6 shrink-0" aria-hidden="true" tabIndex={-1}>
          {slogans.map((s, idx) => (
            <span key={`dup-${idx}`} tabIndex={-1} className="text-[11px] font-black text-gold uppercase flex items-center gap-2 whitespace-nowrap pointer-events-none">
              <Zap size={11} /> {s}
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

// 5. Media Asset Playback (Campaign Audio Spot)
export function MediaPlaybackMockup() {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="bg-card border border-line rounded-2xl p-5 shadow-sm max-w-sm my-6 select-none">
      <div className="bg-paper border border-line rounded-xl aspect-video relative overflow-hidden flex items-center justify-center">
        {/* Soft background visual glow pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-gold/10" />
        <button
          onClick={() => setPlaying(!playing)}
          className="p-4 rounded-full bg-accent text-white hover:bg-accent/90 transition-all shadow-md relative z-10 cursor-pointer"
        >
          {playing ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
        </button>
        <span className="absolute bottom-2 left-3 text-[9px] font-black uppercase text-accent bg-card px-2 py-0.5 rounded border border-line">
          Vernacular Radio Broadcast Player
        </span>
      </div>
      <div className="mt-3 flex justify-between items-center text-xs font-bold text-ink">
        <span>Kikamba Radio Commercial Spot</span>
        <span className="text-accent text-[10px] font-black uppercase tracking-wider">0:45 Sec Broadcast</span>
      </div>
    </div>
  );
}

// 6. Interactive Tone-of-Voice Slider
export function ToneVoiceSlider() {
  const [sliderVal, setSliderVal] = useState<number>(60); // 0 = Technical, 100 = Grassroots

  const getToneDetails = (val: number) => {
    if (val < 35) {
      return {
        type: "Authoritative & Technical",
        accent: "text-accent",
        sloganEnglish: "Statutory fiscal prudence secures Kitui's long-term sovereign growth index.",
        sloganKikamba: "Uthyuilo wa mbesa sya nthi syavinya nikuatitye uiilu wa utonga wiulu wa Kitui.",
        focus: "SME licensing transparency, own-source revenue compliance, institutional audit accountability."
      };
    } else if (val < 70) {
      return {
        type: "Balanced Competence",
        accent: "text-gold",
        sloganEnglish: "A realistic economic blueprint designed to build SME wealth and secure local cooperatives.",
        sloganKikamba: "Mbeu Nsya na kazi bora yaseitwe niguo kuongelea utonga wa masoko na makooperativi ala masumbikikae.",
        focus: "Combining digital cloud databases with offline SMS networks to support municipal market growth."
      };
    } else {
      return {
        type: "Empathetic & Grassroots",
        accent: "text-emerald-500",
        sloganEnglish: "Livelihoods first: supporting local farmers and ensuring access to co-op development resources.",
        sloganKikamba: "Uimi mbeu, mbesa mufuko: kuseovya kiko kya uimi niguo kuetee mwananchi mbesa na kazi bora.",
        focus: "Direct market assemblies, radio baraza syncs, physical brochures, localized cooperative alignments."
      };
    }
  };

  const tone = getToneDetails(sliderVal);

  return (
    <div className="bg-card border border-line rounded-2xl p-5 shadow-sm my-6 overflow-hidden">
      <div className="flex items-center gap-2 mb-3">
        <span className="w-1.5 h-6 bg-accent rounded-full" />
        <h4 className="font-serif text-sm font-bold text-ink">Interactive Communication Tone Guideline</h4>
      </div>
      <p className="text-xs text-muted mb-4">
        Slide to dynamically adjust the campaign voice balance between technical policy and grassroots reach.
      </p>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center text-muted text-[10px] uppercase font-black mb-2">
            <span>Authoritative Technical</span>
            <span>Empathetic Grassroots</span>
          </div>
          <div className="relative w-full flex items-center">
            <input 
              type="range"
              min="0"
              max="100"
              value={sliderVal}
              onChange={(e) => setSliderVal(parseInt(e.target.value))}
              className="w-full accent-accent h-2 bg-line/60 rounded-full cursor-pointer appearance-none"
            />
          </div>
          <div className="flex justify-between text-[9px] font-bold text-muted/80 mt-1.5">
            <span>0% Technical</span>
            <span className="font-black text-accent">{sliderVal}% Grassroots Weight</span>
            <span>100% Grassroots</span>
          </div>
        </div>

        <motion.div 
          key={tone.type}
          initial={{ opacity: 0, y: 3 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="p-4 bg-paper border border-line rounded-xl space-y-3"
        >
          <div>
            <span className="text-[9px] uppercase tracking-widest font-black text-muted">Active Slogan Archetype</span>
            <h5 className={`font-serif text-xs font-black ${tone.accent} mt-0.5`}>{tone.type}</h5>
          </div>

          <div className="space-y-2">
            <div>
              <span className="text-[8px] uppercase tracking-wider font-extrabold text-muted">English Guideline</span>
              <p className="text-xs text-ink font-medium leading-relaxed italic">&ldquo;{tone.sloganEnglish}&rdquo;</p>
            </div>
            <div>
              <span className="text-[8px] uppercase tracking-wider font-extrabold text-muted">Kikamba Slogan Variant</span>
              <p className="text-xs text-ink/90 font-medium leading-relaxed italic">&ldquo;{tone.sloganKikamba}&rdquo;</p>
            </div>
            <div className="pt-2 border-t border-line/40">
              <span className="text-[8px] uppercase tracking-wider font-extrabold text-muted block mb-0.5">Campaign Focus Elements</span>
              <p className="text-[10px] text-muted leading-relaxed font-bold">{tone.focus}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// Keep ToneOfVoiceScale alias to prevent breaking any imports
export function ToneOfVoiceScale() {
  return <ToneVoiceSlider />;
}

// 7. Interactive Slogan Builder
export function SloganBuilder() {
  const pillars = ["Mbeu Nsya", "Kazi Bora", "Governor Economist", "Transparency", "Equity"];
  const [selectedPillars, setSelectedPillars] = useState<string[]>(["Mbeu Nsya", "Kazi Bora"]);

  const handleToggle = (pill: string) => {
    if (selectedPillars.includes(pill)) {
      setSelectedPillars(selectedPillars.filter((p) => p !== pill));
    } else {
      setSelectedPillars([...selectedPillars, pill]);
    }
  };

  return (
    <div className="bg-card border border-line rounded-2xl p-5 shadow-sm my-6">
      <h4 className="font-serif text-sm font-bold text-ink mb-3">Modular Slogan Sandbox</h4>
      <div className="flex flex-wrap gap-2 mb-4">
        {pillars.map((pill) => {
          const isSelected = selectedPillars.includes(pill);
          return (
            <button
              key={pill}
              onClick={() => handleToggle(pill)}
              className={`text-[10px] font-extrabold uppercase py-1 px-2.5 rounded-full border transition-all cursor-pointer ${
                isSelected ? "bg-gold border-gold text-white" : "bg-paper border-line text-muted hover:border-gold/30"
              }`}
            >
              {pill}
            </button>
          );
        })}
      </div>

      <div className="p-4 bg-paper border border-line rounded-xl flex items-center justify-between">
        <div>
          <span className="text-[9px] uppercase tracking-wider font-extrabold text-muted">Generated Tagline</span>
          <p className="font-serif text-sm font-black text-ink mt-0.5 leading-none">
            {selectedPillars.length > 0 ? selectedPillars.join(" · ") : "Select Campaign Pillars"}
          </p>
        </div>
        <ArrowRight size={16} className="text-gold" />
      </div>
    </div>
  );
}

// 8. Grassroots Feedback Visualizer (SMS feed logs)
export function SMSFeedbackVisualizer() {
  const logs = [
    { sender: "+254 712 *** 324", text: "When is the next market Baraza in Kitui South? We need details on the local co-op loans.", time: "10:14 AM" },
    { sender: "+254 723 *** 892", text: "Loved the radio spot on Kikamba yesterday, the economic blueprint sounds realistic.", time: "11:02 AM" }
  ];

  return (
    <div className="bg-card border border-line rounded-2xl p-5 shadow-sm my-6 space-y-3">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-serif text-sm font-bold text-ink">Grassroots USSD Message Feed</h4>
        <span className="text-[9px] font-black text-gold bg-gold/10 border border-gold/20 px-2 py-0.5 rounded uppercase">Verified Ingestion Feed</span>
      </div>
      
      <div className="space-y-3">
        {logs.map((log, idx) => (
          <div key={idx} className="p-3 bg-paper border border-line rounded-xl">
            <div className="flex justify-between text-[10px] font-extrabold text-muted mb-1.5 uppercase">
              <span>{log.sender}</span>
              <span>{log.time}</span>
            </div>
            <p className="text-xs text-ink/90 leading-snug font-medium italic">&ldquo;{log.text}&rdquo;</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// 9. Interactive Community Forum Scheduler
export function CommunityScheduler() {
  const events = [
    { title: "Kitui West Cooperative Assembly", date: "Sept 12, 2026", time: "10:00 AM", location: "Kabati Market Square" },
    { title: "Mwingi Central Town Hall Gathering", date: "Sept 18, 2026", time: "2:00 PM", location: "Mwingi Town Council" }
  ];

  return (
    <div className="bg-card border border-line rounded-2xl p-5 shadow-sm my-6 space-y-3">
      <h4 className="font-serif text-sm font-bold text-ink mb-1">Upcoming Market Assembly Schedules</h4>
      <div className="space-y-3">
        {events.map((ev, i) => (
          <div key={i} className="flex gap-3 bg-paper border border-line p-3 rounded-xl hover:border-accent/30 transition-all">
            <div className="p-2.5 bg-card border border-line rounded-lg text-accent self-start shrink-0">
              <Calendar size={16} />
            </div>
            <div>
              <h5 className="font-serif text-xs font-black text-ink leading-tight">{ev.title}</h5>
              <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] font-extrabold text-muted mt-1 uppercase">
                <span>{ev.date}</span>
                <span>{ev.time}</span>
                <span className="text-accent">{ev.location}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// A helper Brand Umbrella logo matching the split colors of the brand identity kit
export function BrandUmbrella({ size = 48, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" className={`shrink-0 select-none drop-shadow-sm filter ${className}`}>
      {/* Left Canopy Segment (Royal Blue #00209f) */}
      <path d="M60 20 C30 20 16 42 12 58 C24 53 42 53 60 58 Z" fill="#00209f" />
      {/* Right Canopy Segment (Bright Red #e31d2b) */}
      <path d="M60 20 C90 20 104 42 108 58 C96 53 78 53 60 58 Z" fill="#e31d2b" />
      {/* Center Division Line */}
      <path d="M60 20 V58" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
      {/* Top Pinnacle Pointer (Bright Red) */}
      <path d="M57 11 H63 L60 20 Z" fill="#e31d2b" />
      {/* J-Hook handle (Royal Blue) */}
      <path d="M60 58 V92 C60 99 51 99 51 92" stroke="#00209f" strokeWidth="6" strokeLinecap="round" fill="none" />
    </svg>
  );
}

// 10. Brand Asset Color Swatches & Asset Mockup Playground
export function ColorSwatches() {
  const [activeTab, setActiveTab] = useState<"colors" | "social" | "letter" | "mobile" | "pen">("colors");
  const [copied, setCopied] = useState<string | null>(null);

  // Social Card State
  const [socialTitle, setSocialTitle] = useState("A NEW PATH.");
  const [socialSubtitle, setSocialSubtitle] = useState("A UNITED NATION. A BETTER FUTURE.");
  const [socialHashtag, setSocialHashtag] = useState("#WIPERPATRIOTICFRONT");
  const [socialColor, setSocialColor] = useState<"blue" | "red">("blue");

  // Letterhead State
  const [letterDate, setLetterDate] = useState("25 May 2027");
  const [letterSubject, setLetterSubject] = useState("Digital Infrastructure Consensus Agenda");
  const [letterRecipient, setLetterRecipient] = useState("Wiper Democratic Movement delegates & Campaign staff");
  const [letterBody, setLetterBody] = useState(
    "We are building a robust and resilient grassroots digital platform for Kitui County. Moving into 2027, our focus remains on civic clarity, evidence-based economic governance, and ensuring that every single citizen is brought into the digital communication umbrella."
  );

  // Mobile Screen State
  const [mobileSlogan, setMobileSlogan] = useState("Together. For Kenya.");
  const [mobileBg, setMobileBg] = useState<"blue" | "red" | "dark">("blue");

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 1500);
  };

  const socialPresets = [
    { title: "A NEW PATH.", subtitle: "A UNITED NATION. A BETTER FUTURE." },
    { title: "ECONOMIC REFORM.", subtitle: "EVIDENCE-BASED LEADERSHIP FOR KITUI." },
    { title: "CIVIC CLARITY.", subtitle: "MEASURE. LEARN. REALLOCATE." }
  ];

  return (
    <div className="bg-card border border-line rounded-2xl p-5 shadow-sm my-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-line/40 pb-4">
        <div>
          <h4 className="font-serif text-sm font-bold text-ink flex items-center gap-2">
            <BrandUmbrella size={24} />
            WPF Official Brand Identity Kit
          </h4>
          <p className="text-[11px] text-muted leading-tight mt-0.5">
            Interactive brand identity guidelines and asset deployment preview suite for campaign operations.
          </p>
        </div>
        
        {/* Playground Tab Selectors */}
        <div className="flex flex-wrap gap-1 bg-paper p-1 rounded-xl border border-line/60">
          {(["colors", "social", "letter", "mobile", "pen"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === tab
                  ? "bg-accent text-white shadow-sm"
                  : "text-muted hover:text-ink"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* TAB 1: OFFICIAL BRAND COLOR SWATCHES */}
        {activeTab === "colors" && (
          <motion.div
            key="colors"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => copyToClipboard("#00209f", "blue")}
                className="flex items-center gap-4 p-3 bg-paper rounded-xl border border-line hover:border-accent/40 text-left transition-all cursor-pointer group"
              >
                <span className="w-12 h-12 rounded-lg bg-[#00209f] shrink-0 border border-black/10 shadow-inner group-hover:scale-105 transition-transform" />
                <div>
                  <span className="text-[9px] font-black text-muted uppercase tracking-wider block">Official Party Blue (Royal)</span>
                  <span className="font-serif text-sm font-black text-ink block mt-0.5">
                    {copied === "blue" ? "COPIED" : "#00209F"}
                  </span>
                  <span className="text-[9px] text-muted leading-none">Primary branding element</span>
                </div>
              </button>

              <button
                onClick={() => copyToClipboard("#e31d2b", "red")}
                className="flex items-center gap-4 p-3 bg-paper rounded-xl border border-line hover:border-gold/40 text-left transition-all cursor-pointer group"
              >
                <span className="w-12 h-12 rounded-lg bg-[#e31d2b] shrink-0 border border-black/10 shadow-inner group-hover:scale-105 transition-transform" />
                <div>
                  <span className="text-[9px] font-black text-muted uppercase tracking-wider block">Official Party Red (Earth)</span>
                  <span className="font-serif text-sm font-black text-ink block mt-0.5">
                    {copied === "red" ? "COPIED" : "#E31D2B"}
                  </span>
                  <span className="text-[9px] text-muted leading-none">Pinnacles and secondary accents</span>
                </div>
              </button>
            </div>
            
            <div className="bg-paper rounded-xl border border-line p-3 text-[11px] leading-relaxed text-muted">
              <strong>Usage Guidelines:</strong> Maintain the correct 2-segment split proportions. The umbrella logo must strictly place the Royal Blue on the left half and Earth Red on the right half. Avoid gradients or arbitrary text overlays.
            </div>
          </motion.div>
        )}

        {/* TAB 2: INTERACTIVE SOCIAL CARD DESIGNER */}
        {activeTab === "social" && (
          <motion.div
            key="social"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
          >
            {/* Control Panel */}
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-muted tracking-wide">Select Preset Slogans</label>
                <div className="grid grid-cols-1 gap-2">
                  {socialPresets.map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSocialTitle(preset.title);
                        setSocialSubtitle(preset.subtitle);
                      }}
                      className="text-left text-xs p-2.5 bg-paper rounded-lg border border-line/70 hover:border-accent text-ink transition-all font-semibold"
                    >
                      {preset.title}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-muted tracking-wide">Custom Headline</label>
                <input
                  type="text"
                  value={socialTitle}
                  onChange={(e) => setSocialTitle(e.target.value)}
                  className="w-full text-xs p-2.5 bg-paper border border-line rounded-lg text-ink focus:outline-none focus:border-accent font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-muted tracking-wide">Custom Sub-slogan</label>
                <input
                  type="text"
                  value={socialSubtitle}
                  onChange={(e) => setSocialSubtitle(e.target.value)}
                  className="w-full text-xs p-2.5 bg-paper border border-line rounded-lg text-ink focus:outline-none focus:border-accent font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-muted tracking-wide">Card Theme</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSocialColor("blue")}
                    className={`flex-1 text-[10px] font-bold py-1.5 rounded border transition-colors ${
                      socialColor === "blue" ? "bg-accent border-accent text-white" : "bg-paper border-line text-muted"
                    }`}
                  >
                    Royal Blue
                  </button>
                  <button
                    onClick={() => setSocialColor("red")}
                    className={`flex-1 text-[10px] font-bold py-1.5 rounded border transition-colors ${
                      socialColor === "red" ? "bg-gold border-gold text-white" : "bg-paper border-line text-muted"
                    }`}
                  >
                    Earth Red
                  </button>
                </div>
              </div>
            </div>

            {/* Live Media Preview Card */}
            <div className="flex flex-col items-center justify-center p-3 bg-paper border border-line rounded-xl">
              <div
                id="brand-social-card"
                className={`w-full aspect-square max-w-[280px] rounded-xl flex flex-col justify-between p-6 text-white relative shadow-md overflow-hidden transition-all duration-300 ${
                  socialColor === "blue" ? "bg-[#00209f]" : "bg-[#e31d2b]"
                }`}
              >
                {/* Visual Geometry Table */}
                <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:16px_16px]" />
                
                {/* Brand Logo Header */}
                <div className="flex justify-between items-start relative z-10">
                  <div className="bg-white p-2 rounded-lg shadow-sm">
                    <BrandUmbrella size={24} />
                  </div>
                  <span className="text-[8px] font-black uppercase tracking-widest bg-white/20 px-2 py-0.5 rounded-full">
                    Official Card
                  </span>
                </div>

                {/* Main Content Area */}
                <div className="space-y-2 relative z-10">
                  <h3 className="font-serif text-lg font-black tracking-tight leading-tight uppercase">
                    {socialTitle}
                  </h3>
                  <p className="text-[9px] font-bold tracking-wide opacity-90 uppercase leading-snug">
                    {socialSubtitle}
                  </p>
                </div>

                {/* Footer with Hashtag */}
                <div className="flex justify-between items-end border-t border-white/20 pt-2.5 relative z-10">
                  <span className="text-[7px] font-black uppercase tracking-wider opacity-75">
                    Wiper Democratic Movement
                  </span>
                  <span className="text-[8px] font-mono font-bold text-yellow-300">
                    {socialHashtag}
                  </span>
                </div>
              </div>
              <button
                onClick={() => copyToClipboard(`Slogan: ${socialTitle} - ${socialSubtitle} ${socialHashtag}`, "slogan")}
                className="mt-3 text-[10px] font-black uppercase bg-accent text-white px-4 py-1.5 rounded-lg hover:bg-accent/90 cursor-pointer"
              >
                {copied === "slogan" ? "COPIED PREVIEW" : "COPY SLOGAN CONTENT"}
              </button>
            </div>
          </motion.div>
        )}

        {/* TAB 3: OFFICIAL LETTERHEAD DESIGNER */}
        {activeTab === "letter" && (
          <motion.div
            key="letter"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
          >
            {/* Control Panel */}
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-muted tracking-wide">Document Date</label>
                <input
                  type="text"
                  value={letterDate}
                  onChange={(e) => setLetterDate(e.target.value)}
                  className="w-full text-xs p-2.5 bg-paper border border-line rounded-lg text-ink font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-muted tracking-wide">Addressed To</label>
                <input
                  type="text"
                  value={letterRecipient}
                  onChange={(e) => setLetterRecipient(e.target.value)}
                  className="w-full text-xs p-2.5 bg-paper border border-line rounded-lg text-ink font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-muted tracking-wide">Memo Subject</label>
                <input
                  type="text"
                  value={letterSubject}
                  onChange={(e) => setLetterSubject(e.target.value)}
                  className="w-full text-xs p-2.5 bg-paper border border-line rounded-lg text-ink font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-muted tracking-wide">Memo Content</label>
                <textarea
                  value={letterBody}
                  onChange={(e) => setLetterBody(e.target.value)}
                  rows={4}
                  className="w-full text-xs p-2.5 bg-paper border border-line rounded-lg text-ink leading-relaxed font-medium focus:outline-none focus:border-accent"
                />
              </div>
            </div>

            {/* Letterhead Preview Sheet */}
            <div className="flex flex-col items-center justify-center p-3 bg-paper border border-line rounded-xl">
              <div className="w-full max-w-[280px] bg-white border border-line shadow-md p-5 rounded-lg text-slate-800 text-left space-y-4 relative overflow-hidden">
                {/* Official Letter Header */}
                <div className="flex items-center gap-2 border-b border-line pb-3">
                  <BrandUmbrella size={24} />
                  <div>
                    <h5 className="text-[9px] font-black uppercase tracking-widest text-[#00209f] leading-none">
                      Wiper Patriotic Front
                    </h5>
                    <p className="text-[7px] text-muted uppercase mt-0.5 font-bold leading-none">
                      Hon. Dr. Benson Makali Mulu Campaign
                    </p>
                  </div>
                </div>

                {/* Letter Metadata */}
                <div className="space-y-1 text-[7px] font-bold text-slate-500 uppercase">
                  <div>Date: {letterDate}</div>
                  <div>To: {letterRecipient}</div>
                  <div className="text-slate-800 font-black border-l-2 border-accent pl-1.5 mt-1.5">
                    Ref: {letterSubject}
                  </div>
                </div>

                {/* Letter Body Text */}
                <p className="text-[8px] text-slate-600 leading-relaxed font-medium">
                  {letterBody}
                </p>

                {/* Signature Line */}
                <div className="pt-3 border-t border-line/50 flex justify-between items-end">
                  <div>
                    <div className="text-[7px] font-black text-slate-800 uppercase">
                      Dr. Benson Makali Mulu
                    </div>
                    <div className="text-[6px] text-muted uppercase">
                      Gubernatorial Candidate, Kitui County
                    </div>
                  </div>
                  <span className="text-[5px] font-mono font-bold bg-amber-50 border border-amber-200 px-1 text-amber-800 rounded">
                    CONFIDENTIAL
                  </span>
                </div>
              </div>
              <button
                onClick={() => window.print()}
                className="mt-3 text-[10px] font-black uppercase bg-accent text-white px-4 py-1.5 rounded-lg hover:bg-accent/90 cursor-pointer"
              >
                PRINT COMPLETED LETTER
              </button>
            </div>
          </motion.div>
        )}

        {/* TAB 4: MOBILE SPLASH SCREEN MOCKUP */}
        {activeTab === "mobile" && (
          <motion.div
            key="mobile"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
          >
            {/* Control Panel */}
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-muted tracking-wide">Splash Slogan</label>
                <input
                  type="text"
                  value={mobileSlogan}
                  onChange={(e) => setMobileSlogan(e.target.value)}
                  className="w-full text-xs p-2.5 bg-paper border border-line rounded-lg text-ink font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-muted tracking-wide">Background Canvas Style</label>
                <div className="flex gap-2">
                  {(["blue", "red", "dark"] as const).map((style) => (
                    <button
                      key={style}
                      onClick={() => setMobileBg(style)}
                      className={`flex-1 text-[9px] font-black uppercase py-1.5 rounded border transition-colors ${
                        mobileBg === style ? "bg-accent border-accent text-white" : "bg-paper border-line text-muted"
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Mobile Device Container */}
            <div className="flex flex-col items-center justify-center p-3 bg-paper border border-line rounded-xl">
              <div className="w-[180px] h-[320px] rounded-[24px] border-[6px] border-slate-800 relative shadow-lg overflow-hidden flex flex-col justify-between p-4 text-white">
                {/* Background State */}
                <div
                  className={`absolute inset-0 transition-colors duration-300 ${
                    mobileBg === "blue"
                      ? "bg-[#00209f]"
                      : mobileBg === "red"
                      ? "bg-[#e31d2b]"
                      : "bg-[#060d17]"
                  }`}
                />

                {/* Notched Camera & Status Bar Simulated */}
                <div className="w-full flex justify-between items-center text-[7px] font-bold opacity-80 z-10 px-1">
                  <span>9:41 AM</span>
                  <div className="w-10 h-3 bg-slate-800 rounded-full absolute left-1/2 -translate-x-1/2 top-0" />
                  <div className="flex gap-1">
                    <span>5G</span>
                    <span className="w-3.5 h-2 bg-white/40 rounded-sm" />
                  </div>
                </div>

                {/* Central Brand Identity */}
                <div className="flex flex-col items-center text-center space-y-3 mt-10 z-10">
                  <div className="bg-white p-3 rounded-2xl shadow-md scale-95">
                    <BrandUmbrella size={40} />
                  </div>
                  <div>
                    <h5 className="text-[10px] font-black uppercase tracking-widest text-white leading-none">
                      WIPER
                    </h5>
                    <p className="text-[7px] uppercase tracking-wider text-white/70 mt-1">
                      PATRIOTIC FRONT
                    </p>
                  </div>
                </div>

                {/* Splash Call to Actions */}
                <div className="text-center space-y-4 z-10 pb-2">
                  <div>
                    <h4 className="font-serif text-xs font-black tracking-tight text-white leading-tight">
                      {mobileSlogan}
                    </h4>
                    <p className="text-[6px] text-white/50 tracking-widest uppercase mt-0.5">
                      wiper.co.ke
                    </p>
                  </div>
                  <div className="w-full py-1.5 bg-white text-[#00209f] rounded-lg text-[8px] font-black uppercase tracking-wider shadow-inner">
                    ENTER PORTAL
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 5: STATIONERY BRAND PEN VISUALIZER */}
        {activeTab === "pen" && (
          <motion.div
            key="pen"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col md:flex-row items-center gap-6"
          >
            <div className="flex-1 space-y-3">
              <h5 className="font-serif text-xs font-black text-ink">Official Campaign Pen Stationery</h5>
              <p className="text-[11px] text-muted leading-relaxed">
                A highly customizable promotional campaign pen mockup utilizing white glossy body layers with the primary split-logo printed along the barrel and rich Royal Blue rubber grip pads.
              </p>
              <div className="bg-paper p-3 rounded-xl border border-line text-[10px] leading-relaxed text-muted">
                <strong>Branding specifications:</strong> Printed logo must be positioned 15mm from the top clip boundary. The J-Hook curves along the horizontal axis to align with normal grip holds.
              </div>
            </div>

            {/* Simulated 3D Pen Mockup */}
            <div className="flex-1 flex flex-col items-center justify-center p-4 bg-paper border border-line rounded-xl min-h-[160px]">
              <motion.div
                whileHover={{ rotate: 3, scale: 1.05 }}
                className="w-full max-w-[260px] h-12 relative flex items-center"
              >
                {/* Simulated pen cap assembly (gloss white) */}
                <div className="w-16 h-4 bg-white border border-slate-300 rounded-l-md shadow-sm relative flex items-center justify-end px-2">
                  {/* Metal pen clip (chrome/silver gradient) */}
                  <div className="absolute top-[-3px] left-3 w-10 h-1.5 bg-gradient-to-b from-slate-200 to-slate-400 rounded-full shadow-inner border border-slate-400" />
                </div>

                {/* Pen main body barrel (white gloss print) */}
                <div className="flex-1 h-4 bg-white border-y border-r border-slate-300 shadow-sm flex items-center justify-start px-3 relative">
                  <div className="flex items-center gap-1.5 scale-75 origin-left">
                    <BrandUmbrella size={14} />
                    <span className="text-[6px] font-black uppercase text-[#00209f] tracking-wider whitespace-nowrap leading-none">
                      WIPER PATRIOTIC FRONT
                    </span>
                  </div>
                </div>

                {/* Brand blue rubber grip */}
                <div className="w-12 h-4 bg-[#00209f] border-y border-blue-900 shadow-inner" />

                {/* Chrome metal band */}
                <div className="w-1 h-4 bg-gradient-to-r from-slate-200 to-slate-400 border border-slate-400" />

                {/* Pen pointer tip */}
                <div className="w-5 h-4 bg-slate-200 border-y border-slate-300 relative overflow-hidden" style={{ clipPath: "polygon(0 0, 100% 50%, 0 100%)" }}>
                  {/* Ink tip */}
                  <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-slate-900" />
                </div>
              </motion.div>
              <span className="text-[8px] font-mono text-muted uppercase mt-4 tracking-widest">
                Campaign Stationery Preview
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ==========================================
// 5. IMPLEMENTATION & KPIS VISUAL AIDS
// ==========================================

// 9. Interactive Feedback Loop Diagram
export function FeedbackLoopCircuit() {
  return (
    <div className="bg-card border border-line rounded-2xl p-5 shadow-sm my-6">
      <h4 className="font-serif text-sm font-bold text-ink mb-2">Ward Feedback Circuits</h4>
      <div className="w-full h-24 bg-paper border border-line rounded-xl relative flex items-center justify-around px-2">
        <div className="p-2 bg-card border border-line rounded-lg text-xs font-black text-accent">Field Agent Reports</div>
        <ArrowRight size={14} className="text-muted" />
        <div className="p-2 bg-card border border-line rounded-lg text-xs font-black text-gold">Systems Database</div>
        <ArrowRight size={14} className="text-muted" />
        <div className="p-2 bg-card border border-line rounded-lg text-xs font-black text-accent">Strategic Action</div>
      </div>
    </div>
  );
}

// 10. Interactive Report Generator (Print Toggle)
export function PrintReportGenerator() {
  const triggerPrint = () => {
    window.print();
  };

  return (
    <div className="bg-card border border-line rounded-2xl p-4 shadow-sm flex items-center justify-between my-6 select-none">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-lg bg-accent/10 text-accent">
          <FileText size={16} />
        </div>
        <div>
          <h4 className="text-xs font-extrabold text-ink leading-tight">Print PDF Briefing Kit</h4>
          <p className="text-[10px] text-muted">Format the strategy portal for clean legal printing briefs.</p>
        </div>
      </div>
      <button
        onClick={triggerPrint}
        className="px-4 py-1.5 bg-accent text-white rounded-lg text-xs font-extrabold uppercase tracking-wider hover:bg-accent/90 transition-all cursor-pointer"
      >
        Export PDF
      </button>
    </div>
  );
}

// 11. Custom Campaign Performance Chart Component
export { ChartComponent } from "./ChartComponent";

export function CampaignTargetsChart() {
  const [mounted, setMounted] = useState(false);

  const [activeTab, setActiveTab] = useState<"phases" | "segments">("phases");
  const [activePhase, setActivePhase] = useState<"share" | "phase1" | "phase2" | "phase3">("phase1");

  useEffect(() => {
    const timerId = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timerId);
  }, []);

  if (!mounted) {
    return (
      <div className="bg-card border border-line rounded-2xl p-5 shadow-sm my-6 h-[340px] flex items-center justify-center text-xs text-muted font-bold animate-pulse">
        Loading Campaign Targets Chart...
      </div>
    );
  }

  // Zone Weighting Model Data
  const phaseData = [
    { name: "Central/West", share: 19.7, phase1: 20, phase2: 25, phase3: 25, color: "#00209f" },
    { name: "Mwingi Block", share: 22.5, phase1: 35, phase2: 25, phase3: 25, color: "#e31d2b" },
    { name: "Arid & Resource", share: 36.6, phase1: 30, phase2: 30, phase3: 35, color: "#e5a93c" },
    { name: "Rotating/Testing", share: 21.2, phase1: 15, phase2: 20, phase3: 15, color: "#475569" },
  ];

  // Demographic segment goals
  const segmentData = [
    { name: "Agrarian", reach: 86, color: "#00209f", detail: "86% of total county pop" },
    { name: "Women Coops", reach: 90, color: "#e31d2b", detail: "90% of households (poultry income)" },
    { name: "Offline Majority", reach: 86, color: "#e5a93c", detail: "86% outside persistent digital use" },
    { name: "Youth (18-35)", reach: 45, color: "#22c55e", detail: "12,573 targeted scholarship/TVET outreach" },
    { name: "MSMEs", reach: 62, color: "#475569", detail: "Trade associations & town hall hubs" },
  ];

  return (
    <div className="bg-card border border-line rounded-2xl p-5 shadow-sm my-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-line/40 pb-4">
        <div>
          <h4 className="font-serif text-sm font-bold text-ink flex items-center gap-2">
            <Target size={16} className="text-accent" />
            Campaign Performance & Target Milestones
          </h4>
          <p className="text-[11px] text-muted leading-tight mt-0.5">
            Quantitative models extracted from sections 6 &amp; 7 of the strategic manifesto.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex gap-1 bg-paper p-1 rounded-xl border border-line/60 self-start">
          <button
            onClick={() => setActiveTab("phases")}
            className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === "phases" ? "bg-accent text-white shadow-sm" : "text-muted hover:text-ink"
            }`}
          >
            Regional Weights
          </button>
          <button
            onClick={() => setActiveTab("segments")}
            className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === "segments" ? "bg-accent text-white shadow-sm" : "text-muted hover:text-ink"
            }`}
          >
            Demographic Targets
          </button>
        </div>
      </div>

      {activeTab === "phases" ? (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2 items-center justify-between">
            <span className="text-[10px] font-black text-muted uppercase">Select Campaign Milestone Phase</span>
            <div className="flex gap-1 bg-paper p-0.5 rounded-lg border border-line/50">
              {([
                { id: "share", label: "Base Share" },
                { id: "phase1", label: "Phase -1 (Nomination)" },
                { id: "phase2", label: "Phase 1-2 (Campaign)" },
                { id: "phase3", label: "Phase 3 (GOTV)" },
              ] as const).map((phase) => (
                <button
                  key={phase.id}
                  onClick={() => setActivePhase(phase.id)}
                  className={`text-[9px] font-bold px-2 py-1 rounded transition-all cursor-pointer ${
                    activePhase === phase.id ? "bg-card border border-line shadow-sm text-accent" : "text-muted hover:text-ink"
                  }`}
                >
                  {phase.label}
                </button>
              ))}
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={phaseData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-line)" opacity={0.2} vertical={false} />
                <XAxis dataKey="name" tick={{ fill: "var(--color-muted)", fontSize: 9, fontWeight: 700 }} tickLine={false} axisLine={{ stroke: "var(--color-line)" }} />
                <YAxis tick={{ fill: "var(--color-muted)", fontSize: 9 }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      const activeVal = activePhase === "share" ? d.share : activePhase === "phase1" ? d.phase1 : activePhase === "phase2" ? d.phase2 : d.phase3;
                      return (
                        <div className="bg-card border border-line p-2.5 shadow-md rounded-xl text-[10px] font-bold text-ink">
                          <p className="border-b border-line pb-1 mb-1 font-serif text-xs font-black">{d.name}</p>
                          <p className="text-accent">Target Share: <span className="font-extrabold">{activeVal}%</span></p>
                          <p className="text-muted text-[8px] mt-0.5 leading-tight">Recommended budget share of communication assets</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey={activePhase === "share" ? "share" : activePhase === "phase1" ? "phase1" : activePhase === "phase2" ? "phase2" : "phase3"} radius={[6, 6, 0, 0]}>
                  {phaseData.map((entry, idx) => (
                    <Cell key={idx} fill={idx % 2 === 0 ? "var(--color-accent)" : "var(--color-gold)"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[10px] text-muted leading-relaxed text-center italic">
            Phase -1 intentionally indexes on Mwingi and the arid belt relative to population share to correct the nomination deficit.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={segmentData} layout="vertical" margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-line)" opacity={0.2} horizontal={false} />
                <XAxis type="number" domain={[0, 100]} tick={{ fill: "var(--color-muted)", fontSize: 9 }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
                <YAxis dataKey="name" type="category" tick={{ fill: "var(--color-muted)", fontSize: 9, fontWeight: 700 }} tickLine={false} axisLine={{ stroke: "var(--color-line)" }} width={90} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="bg-card border border-line p-2.5 shadow-md rounded-xl text-[10px] font-bold text-ink max-w-[200px]">
                          <p className="border-b border-line pb-1 mb-1 font-serif text-xs font-black">{d.name}</p>
                          <p className="text-accent">Baseline/Target Share: <span className="font-extrabold">{d.reach}%</span></p>
                          <p className="text-muted text-[8px] mt-1 leading-normal font-medium">{d.detail}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="reach" radius={[0, 4, 4, 0]}>
                  {segmentData.map((entry, idx) => (
                    <Cell key={idx} fill={idx % 2 === 0 ? "var(--color-accent)" : "var(--color-gold)"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[10px] text-muted leading-relaxed text-center italic">
            Quantifiable targets representing high-salience priority cohorts mapped directly from survey baseline data.
          </p>
        </div>
      )}
    </div>
  );
}
