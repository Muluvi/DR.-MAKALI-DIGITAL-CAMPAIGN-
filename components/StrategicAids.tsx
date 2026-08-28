"use client";

import { motion, AnimatePresence, useInView } from "motion/react";
import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { useMarqueeActive } from "../hooks/use-marquee-active";
import { useIsMobile } from "../hooks/use-mobile";
import { LazyMount } from "./LazyMount";
import {
  Play, 
  Pause, 
  Volume2, 
  ChevronDown, 
  ChevronUp, 
  Calendar, 
  User, 
  Check, 
  AlertTriangle, 
  Sparkles, 
  Target, 
  Zap, 
  ArrowRight, 
  Maximize2, 
  Minimize2, 
  Sliders, 
  Radio, 
  ShieldCheck, 
  Users, 
  Coins, 
  FileText, 
  TrendingUp, 
  MessageSquare, 
  CheckCircle, 
  CheckSquare, 
  MapPin, 
  Globe, 
  BookOpen, 
  Activity, 
  Database, 
  RefreshCw, 
  HelpCircle, 
  Layers, 
  TrendingDown, 
  Grid, 
  Filter 
} from "lucide-react";

// Recharts is only pulled into the bundle once one of these charts scrolls into view.
const ConstituencyBarChart = dynamic(() => import("./charts/ConstituencyBarChart"), { ssr: false });
const ResourceLedgerBarChart = dynamic(() => import("./charts/ResourceLedgerBarChart"), { ssr: false });

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
          <p className="text-[11px] text-muted leading-tight mt-0.5">Household Broadband vs Offline/Feature-Phone Ratio (100-Unit Grid)</p>
        </div>
        <div className="flex gap-3 text-[10px] font-black uppercase tracking-wider">
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-gold rounded-full shrink-0" /> 87% Offline/Feature-Phone</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-accent rounded-full shrink-0" /> 13% Broadband</span>
        </div>
      </div>
      
      <div className="grid grid-cols-10 gap-1.5 max-w-sm mx-auto my-2">
        {Array.from({ length: 100 }).map((_, i) => {
          const isOffline = i < 87;
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
              title={isOffline ? `${i + 1}: Offline or Feature-Phone Bound Household (87%)` : `${i + 1}: Active Broadband Internet Access Household (13%)`}
            />
          );
        })}
      </div>
      <p className="text-[10px] text-muted/80 leading-normal mt-3 italic border-t border-line/40 pt-2 font-medium">
        Data sourced from KNBS Census and KIPPRA Frontier Connectivity analysis, underscoring why USSD & SMS outreach are critical.
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
          <span className="text-[10px] uppercase tracking-widest font-bold text-muted">Speech Player Mockup</span>
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
              animate={{ height: randomHeight }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className={`w-1.5 rounded-full ${isPlaying ? "bg-accent" : "bg-line"}`}
              style={{ maxHeight: "36px" }}
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
            <span className="text-accent">Live Broadcast Synthesis</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// 4. Interactive High-Contrast Key Milestone Timeline
export function MilestoneTimeline() {
  const milestones = [
    { date: "Sept 2026", title: "Wiper Nomination Delegate Audit", desc: "Verifying endorsement networks across Kitui’s 40 constituencies." },
    { date: "Dec 2026", title: "Integrated Aircover Launch", desc: "Kikamba FM broadcasts sync with countywide SMS channels." },
    { date: "April 2027", title: "Grassroots Baraza Networks Complete", desc: "Setting up town hall feedback networks in every major market." },
    { date: "Aug 2027", title: "Election Polling Victory Target", desc: "Closing the 15.3% polling deficit to secure immediate majority lead." }
  ];

  return (
    <div className="bg-card border border-line rounded-2xl p-6 shadow-sm my-6">
      <div className="flex items-center gap-2 mb-6">
        <span className="w-1.5 h-6 bg-accent rounded-full" />
        <h4 className="font-serif text-base font-extrabold text-ink">Campaign Operational Timeline</h4>
      </div>

      <div className="relative border-l-2 border-line/60 ml-3.5 pl-6 space-y-8">
        {milestones.map((m, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -15 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Pulsing indicator dot */}
            <div className="absolute -left-[35px] top-1 w-5 h-5 rounded-full border-4 border-card bg-accent flex items-center justify-center shadow-sm">
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
            </div>
            
            <div className="flex flex-col">
              <span className="text-[10px] font-extrabold text-accent uppercase tracking-widest">{m.date}</span>
              <h5 className="font-serif text-sm font-bold text-ink mt-1">{m.title}</h5>
              <p className="text-xs text-muted mt-1 leading-relaxed">{m.desc}</p>
            </div>
          </motion.div>
        ))}
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
          <span className="font-serif text-5xl font-black text-gold tracking-tight">-15.3%</span>
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

// 7. Endless Scrolling Policy Badge Ticker
export function BadgeTicker() {
  const { containerRef, isActive } = useMarqueeActive<HTMLDivElement>();
  const slogans = [
    "ECONOMIC PROGRESS", "WIPER DEMOCRATIC MOVEMENT", "DELEGATE ALIGNMENT",
    "DIGITIZED REVENUE", "GRASSROOTS VOICE", "KIKAMBA BROADCAST COALITION",
    "GOVERNANCE AUDITING", "ECONOMIC BLUEPRINT", "KITUI VICTORY 2027"
  ];
  return (
    <div ref={containerRef} className="relative w-full overflow-hidden select-none py-2 border-y border-line/50 my-4 bg-paper/60 backdrop-blur-sm">
      <motion.div
        className="flex gap-4 w-max shrink-0"
        animate={isActive ? { x: ["0%", "-50%"] } : {}}
        transition={{ ease: "linear", duration: 18, repeat: Infinity }}
      >
        <div className="flex gap-4 shrink-0">
          {slogans.map((s, i) => (
            <span key={i} className="text-[10px] font-black tracking-widest text-accent uppercase flex items-center gap-1.5 whitespace-nowrap">
              <Sparkles size={10} className="text-gold" /> {s}
            </span>
          ))}
        </div>
        <div className="flex gap-4 shrink-0">
          {slogans.map((s, i) => (
            <span key={`dup-${i}`} className="text-[10px] font-black tracking-widest text-accent uppercase flex items-center gap-1.5 whitespace-nowrap">
              <Sparkles size={10} className="text-gold" /> {s}
            </span>
          ))}
        </div>
      </motion.div>
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

// 9. Interactive Map Hover Layers Component
export function InteractiveMapHover() {
  const [activeLayer, setActiveLayer] = useState<string>("central");
  const layerStats: Record<string, { name: string; target: string; desc: string }> = {
    central: { name: "Kitui Central & West", target: "62k Voter Capital", desc: "Dense commercial hubs with high target voter concentration." },
    mwingi: { name: "Mwingi North & West", target: "48k Turnout Focus", desc: "Strong corporate consensus networks and community cooperatives." },
    south: { name: "Kitui South & East", target: "54k Outreach Target", desc: "Expansive terrain requiring extensive FM radio aircover sync." }
  };

  return (
    <div className="bg-card border border-line rounded-2xl p-5 shadow-sm my-6">
      <h4 className="font-serif text-sm font-bold text-ink mb-2">Kitui Sector Targets</h4>
      
      <div className="flex gap-2 my-3">
        {Object.keys(layerStats).map((lay) => (
          <button
            key={lay}
            onClick={() => setActiveLayer(lay)}
            className={`flex-1 text-[10px] font-extrabold uppercase tracking-wider py-1.5 px-2 rounded-lg border transition-all ${
              activeLayer === lay ? "bg-accent border-accent text-white" : "bg-paper border-line text-muted"
            }`}
          >
            {layerStats[lay].name.split(" ")[0]}
          </button>
        ))}
      </div>

      <div className="bg-paper border border-line rounded-xl p-4 flex flex-col justify-center min-h-[100px] transition-colors relative overflow-hidden">
        <div className="absolute right-4 bottom-4 opacity-10">
          <MapPin size={42} className="text-accent" />
        </div>
        <div className="relative z-10">
          <span className="text-[9px] uppercase tracking-widest font-black text-accent">{layerStats[activeLayer].target}</span>
          <h5 className="font-serif text-sm font-extrabold text-ink mt-0.5">{layerStats[activeLayer].name}</h5>
          <p className="text-xs text-muted/90 mt-1 leading-relaxed">{layerStats[activeLayer].desc}</p>
        </div>
      </div>
    </div>
  );
}

// 10. Animated KPI Gauge (Circular SVG arc)
export function KPIGauge() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true });
  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = isInView ? circumference - (82 / 100) * circumference : circumference;

  return (
    <div ref={containerRef} className="bg-card border border-line rounded-2xl p-5 shadow-sm flex items-center gap-5 my-6">
      <div className="relative w-20 h-20 shrink-0">
        <svg className="w-full h-full transform -rotate-90">
          <circle cx="40" cy="40" r="40" className="stroke-line/40" strokeWidth="6" fill="transparent" />
          <motion.circle
            cx="40"
            cy="40"
            r="40"
            stroke="var(--color-accent)"
            strokeWidth="6"
            fill="transparent"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.8, ease: "easeOut" }}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center font-serif text-lg font-black text-ink">
          82%
        </div>
      </div>
      <div>
        <h4 className="text-xs font-bold text-ink leading-tight">Overall Campaign Preparedness</h4>
        <p className="text-[11px] text-muted leading-relaxed mt-1">
          Weighted tracker measuring target voter database, aircover schedules, and compliance metrics.
        </p>
      </div>
    </div>
  );
}

// ==========================================
// 2. STRATEGY & TARGETING VISUAL AIDS
// ==========================================

// 1. Interactive Voter Density & Constituency Database Map
export function VoterDensityMap() {
  const [selectedID, setSelectedID] = useState<string>("kitui-central");
  
  const data: Record<string, { name: string; voters: number; share: string; wardsCount: number; wards: string[]; target: string; desc: string }> = {
    "kitui-central": { 
      name: "Kitui Central Constituency", 
      voters: 77764, 
      share: "14.6%", 
      wardsCount: 5,
      wards: ["Miambani", "Township", "Kyangwithya West", "Mulango", "Kyangwithya East"],
      target: "75% Target Consensus Goal", 
      desc: "The principal's home constituency. High density urban/peri-urban hub containing Township (19,538 voters), requiring flawless turnout execution." 
    },
    "kitui-south": { 
      name: "Kitui South Constituency", 
      voters: 75372, 
      share: "14.1%", 
      wardsCount: 6,
      wards: ["Ikanga/Kyatune", "Mutomo", "Mutha", "Ikutha", "Kanziko", "Athi"],
      target: "68% Voter Turnout Focus", 
      desc: "Expansive terrain with 6 wards. High registered voters base, requiring syndicated FM radio aircover sync and local coordinator barazas." 
    },
    "mwingi-central": { 
      name: "Mwingi Central Constituency", 
      voters: 74231, 
      share: "13.9%", 
      wardsCount: 6,
      wards: ["Central", "Kivou", "Nguni", "Nuu", "Mui", "Waita"],
      target: "70% Co-operative Base Alignment", 
      desc: "Critical Mwingi urban-rural link. Broad merchant network base, making cooperative loan support policies highly persuasive here." 
    },
    "mwingi-north": { 
      name: "Mwingi North Constituency", 
      voters: 68829, 
      share: "12.9%", 
      wardsCount: 5,
      wards: ["Ngomeni", "Kyuso", "Mumoni", "Tseikuru", "Tharaka"],
      target: "65% Turnout Optimization Goal", 
      desc: "Home to the county's largest single ward, Kyuso (19,921 voters), and smallest, Tharaka (7,429). Demands highly localized trade-route advocacy." 
    },
    "kitui-east": { 
      name: "Kitui East Constituency", 
      voters: 65377, 
      share: "12.3%", 
      wardsCount: 6,
      wards: ["Zombe/Mwitika", "Nzambani", "Chuluni", "Voo/Kyamatu", "Endau/Malalani", "Mutito/Kaliku"],
      target: "60% Grassroots Mobilization Reach", 
      desc: "Vast semi-arid wards with low digital access. Focus heavily on Kikamba FM broadcasting and direct physical booklets." 
    },
    "kitui-west": { 
      name: "Kitui West Constituency", 
      voters: 59047, 
      share: "11.1%", 
      wardsCount: 4,
      wards: ["Mutonguni", "Kauwi", "Matinyani", "Kwa Mutonga/Kithumula"],
      target: "58% Direct Business Voter Support", 
      desc: "Dense business and trade-market assemblies. Ideal territory for highlighting administrative transparency and tax reforms." 
    },
    "mwingi-west": { 
      name: "Mwingi West Constituency", 
      voters: 57138, 
      share: "10.7%", 
      wardsCount: 4,
      wards: ["Kyome/Thaana", "Nguutani", "Migwani", "Kiomo/Kyethani"],
      target: "72% Strategic Consensus Anchor", 
      desc: "High political alignment base. Strong institutional party network that provides a reliable baseline anchor." 
    },
    "kitui-rural": { 
      name: "Kitui Rural Constituency", 
      voters: 55000, 
      share: "10.3%", 
      wardsCount: 4,
      wards: ["Kisasi", "Mbitini", "Kwavonza/Yatta", "Kanyangi"],
      target: "64% Farmer Cooperative Alignments", 
      desc: "Cooperative dairy and crop farming strongholds. Highlight agricultural input access and county market trading networks." 
    }
  };

  const selected = data[selectedID];

  const chartData = Object.keys(data).map((key) => ({
    id: key,
    name: data[key].name.replace(" Constituency", ""),
    voters: data[key].voters,
    share: data[key].share,
  }));

  return (
    <div className="bg-card border border-line rounded-2xl p-5 shadow-sm my-6 overflow-hidden">
      <div className="flex items-center gap-2 mb-3">
        <span className="w-1.5 h-6 bg-accent rounded-full" />
        <h4 className="font-serif text-sm font-bold text-ink">Constituency Targeting Map & Register</h4>
      </div>
      <p className="text-xs text-muted mb-4 leading-relaxed">
        Kitui County register totals <strong className="text-ink">532,758 voters</strong>. Click any bar or button below to inspect constituency stats.
      </p>

      {/* Interactive Recharts Constituency Chart */}
      <div className="h-44 w-full text-[9px] mb-6">
        <LazyMount minHeight={176}>
          <ConstituencyBarChart chartData={chartData} selectedID={selectedID} onSelect={setSelectedID} />
        </LazyMount>
      </div>

      {/* Grid of All 8 Constituencies */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 mb-4">
        {Object.keys(data).map((id) => (
          <button
            key={id}
            onClick={() => setSelectedID(id)}
            className={`p-2 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between h-14 ${
              selectedID === id 
                ? "bg-accent/5 border-accent text-accent shadow-sm" 
                : "bg-paper border-line text-muted hover:text-ink hover:border-line/80"
            }`}
          >
            <span className="text-[9px] font-black uppercase tracking-wider block truncate">{data[id].name.replace(" Constituency", "")}</span>
            <div className="flex justify-between items-baseline mt-1">
              <span className="text-xs font-mono font-black text-ink">{data[id].voters.toLocaleString()}</span>
              <span className="text-[8px] font-bold text-muted">{data[id].share}</span>
            </div>
          </button>
        ))}
      </div>

      <motion.div 
        key={selectedID}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="p-4 bg-paper border border-line rounded-xl space-y-3 relative overflow-hidden"
      >
        <div className="absolute right-4 top-4 opacity-10">
          <MapPin size={40} className="text-accent" />
        </div>

        <div>
          <span className="text-[9px] uppercase tracking-widest font-black text-accent">{selected.target}</span>
          <h5 className="font-serif text-xs font-black text-ink mt-0.5">{selected.name}</h5>
          <p className="text-[11px] text-muted leading-relaxed mt-1">{selected.desc}</p>
        </div>

        <div className="pt-3 border-t border-line/40">
          <span className="text-[8px] uppercase tracking-wider font-extrabold text-muted block mb-1.5">Wards in this sector ({selected.wardsCount}):</span>
          <div className="flex flex-wrap gap-1">
            {selected.wards.map((w, idx) => (
              <span key={idx} className="text-[9px] font-black uppercase tracking-wide px-2 py-0.5 bg-card border border-line/60 rounded-md text-ink">
                {w}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// 2. Dynamic Deficit Slider
export function DeficitSlider() {
  const [percent, setPercent] = useState(15.3);
  const targetVoters = Math.round((percent / 100) * 480000);

  return (
    <div className="bg-card border border-line rounded-2xl p-5 shadow-sm my-6">
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-serif text-sm font-bold text-ink">Margin Target Simulator</h4>
        <Sliders size={15} className="text-muted" />
      </div>
      <p className="text-xs text-muted leading-relaxed">
        Adjust targeted percentage growth to calculate voter volumes needed to close the gap.
      </p>

      <div className="my-6">
        <div className="flex justify-between items-center text-xs font-bold text-ink mb-1">
          <span>Target Margin Growth</span>
          <span className="text-accent text-sm font-extrabold">{percent}%</span>
        </div>
        <input
          type="range"
          min="1"
          max="30"
          step="0.1"
          value={percent}
          onChange={(e) => setPercent(parseFloat(e.target.value))}
          className="w-full accent-accent bg-line h-2 rounded-lg cursor-pointer"
        />
        <div className="flex justify-between text-[9px] text-muted uppercase font-black mt-1.5">
          <span>Min Margin Target</span>
          <span>Max Margin Target</span>
        </div>
      </div>

      <div className="bg-accent/5 border border-accent/20 rounded-xl p-4 flex items-center justify-between">
        <div>
          <span className="text-[9px] uppercase tracking-wider font-extrabold text-muted">Estimated Target Voter Capital</span>
          <h5 className="font-serif text-lg font-black text-accent mt-0.5">{targetVoters.toLocaleString()} Voters</h5>
        </div>
        <div className="p-2 bg-card rounded-lg border border-line text-accent">
          <Zap size={16} />
        </div>
      </div>
    </div>
  );
}

// 3. Responsive Voter Funnel Visualizer
export function VoterFunnel() {
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const steps = [
    { label: "Wiper Loyalists Base", val: "185,000", percentage: 100, color: "bg-accent", desc: "The secure base of Wiper voters that ensures our structural head-start across Kitui wards.", icon: Users },
    { label: "Target Swing Conversions", val: "73,000", percentage: 75, color: "bg-accent/80", desc: "Key undecided populations targeted for persuasion via trade networks and local market assemblies.", icon: Users },
    { label: "Offline Grassroots Outreach", val: "54,000", percentage: 55, color: "bg-gold", desc: "Isolated rural residents reached using syndicated Kikamba FM broadcasting and direct physical materials.", icon: Radio },
    { label: "Nomination Delegate Lock", val: "22,000", percentage: 32, color: "bg-gold/80", desc: "First-round delegates pledged to secure consensus nomination endorsements.", icon: ShieldCheck }
  ];

  return (
    <div className="bg-card border border-line rounded-2xl p-5 shadow-sm my-6 overflow-hidden">
      <div className="flex items-center gap-2 mb-3">
        <span className="w-1.5 h-6 bg-accent rounded-full" />
        <h4 className="font-serif text-sm font-bold text-ink">Cascading Voter Conversion Funnel</h4>
      </div>
      <p className="text-xs text-muted mb-4 leading-relaxed">
        Hover or click a funnel segment below to inspect strategic demographic milestones.
      </p>

      <div className="space-y-4 relative">
        {steps.map((st, i) => {
          const Icon = st.icon;
          return (
            <div 
              key={i} 
              className="group cursor-pointer relative"
              onMouseEnter={() => setActiveStep(i)}
              onMouseLeave={() => setActiveStep(null)}
              onClick={() => setActiveStep(i)}
            >
              <div className="flex items-center gap-3">
                <div className="w-24 text-[10px] font-black text-muted leading-tight truncate uppercase tracking-wider">{st.label}</div>
                <div className="flex-1 bg-line/30 h-10 rounded-xl overflow-hidden relative border border-line/40 group-hover:border-accent/40 transition-colors">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${st.percentage}%` }}
                    transition={{ duration: 1.2, ease: "easeOut", delay: i * 0.15 }}
                    className={`${st.color} h-full rounded-r-lg flex items-center justify-between px-3`}
                  >
                    <Icon size={12} className="text-white opacity-80" />
                    <span className="text-[10px] font-mono font-black text-white">{st.val}</span>
                  </motion.div>
                </div>
              </div>

              <AnimatePresence>
                {activeStep === i && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="ml-28 mt-2 p-2.5 bg-paper border border-line rounded-lg text-[11px] text-muted leading-relaxed relative z-20"
                  >
                    <span className="font-bold text-accent uppercase tracking-wide block mb-0.5 text-[10px]">{st.label} Target</span>
                    {st.desc}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Interactive Voter Funnel with an animated SVG path representation
export function InteractiveVoterFunnel() {
  const [activeStep, setActiveStep] = useState<number>(0);
  
  const steps = [
    { label: "Wiper Loyalists Base", val: "185,000", percentage: "100%", color: "#0056a8", desc: "The secure foundation of Wiper voters across Kitui constituencies, guaranteeing structural priority.", cy: 30 },
    { label: "Target Swing Conversions", val: "73,000", percentage: "75%", color: "#0056a8", desc: "Undecided and swing segments targeted for mobilization via direct cooperative networks.", cy: 100 },
    { label: "Offline Outreach Focus", val: "54,000", percentage: "55%", color: "#e31d2b", desc: "Rural networks reached through regional Kikamba radio syndication and physical media brochures.", cy: 170 },
    { label: "Nomination Delegate Lock", val: "22,000", percentage: "32%", color: "#e31d2b", desc: "Committed local delegates pledged to solidify the WPF nomination consensus.", cy: 240 }
  ];

  return (
    <div className="bg-card border border-line rounded-2xl p-5 shadow-sm my-6 overflow-hidden">
      <div className="flex items-center gap-2 mb-3">
        <span className="w-1.5 h-6 bg-accent rounded-full" />
        <h4 className="font-serif text-sm font-bold text-ink">Cascading Voter Conversion Funnel</h4>
      </div>
      <p className="text-xs text-muted mb-4 leading-relaxed">
        An interactive roadmap displaying our voter conversion journey. The animated SVG path models active recruitment flow.
      </p>

      <div className="flex gap-4 items-stretch">
        {/* Animated SVG Path Canvas */}
        <div className="w-16 relative flex items-center justify-center shrink-0 bg-paper/50 rounded-xl border border-line/40 py-2">
          <svg className="w-full h-[270px] overflow-visible" viewBox="0 0 60 270">
            {/* Background connecting path */}
            <path 
              d="M 30 10 Q 55 65 30 120 T 30 240" 
              fill="none" 
              stroke="rgba(120, 120, 120, 0.15)" 
              strokeWidth="4" 
              strokeLinecap="round" 
            />
            {/* Animated foreground conversion flow path */}
            <motion.path 
              d="M 30 10 Q 55 65 30 120 T 30 240" 
              fill="none" 
              stroke="var(--color-accent)" 
              strokeWidth="4" 
              strokeLinecap="round" 
              strokeDasharray="12 6"
              animate={{ strokeDashoffset: [-50, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
            />
            {/* Moving pulse dot */}
            <motion.circle 
              r="6" 
              fill="var(--color-gold)" 
              animate={{ 
                cx: [30, 42, 30, 18, 30],
                cy: [10, 65, 120, 180, 240]
              }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="shadow-sm"
            />
            {/* Steps Nodes */}
            {steps.map((st, i) => (
              <g key={i} className="cursor-pointer" onClick={() => setActiveStep(i)}>
                <circle 
                  cx="30" 
                  cy={st.cy} 
                  r={activeStep === i ? "11" : "8"} 
                  fill={activeStep === i ? "var(--color-accent)" : "var(--color-card)"} 
                  stroke={activeStep === i ? "var(--color-gold)" : "var(--color-accent)"} 
                  strokeWidth="2.5" 
                  className="transition-all duration-300"
                />
                <text 
                  x="30" 
                  y={st.cy + 3.5} 
                  textAnchor="middle" 
                  fontSize="8" 
                  fontWeight="bold" 
                  fill={activeStep === i ? "#ffffff" : "var(--color-accent)"}
                  className="pointer-events-none select-none"
                >
                  {i + 1}
                </text>
              </g>
            ))}
          </svg>
        </div>

        {/* Informative Roadmap Cards */}
        <div className="flex-1 space-y-2.5">
          {steps.map((st, i) => (
            <button
              key={i}
              onClick={() => setActiveStep(i)}
              className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                activeStep === i 
                  ? "bg-accent/5 border-accent shadow-sm" 
                  : "bg-paper/50 border-line text-muted hover:border-line/80 hover:text-ink"
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-[9px] uppercase tracking-wider font-black text-muted">Phase 0{i + 1}</span>
                <span className="text-[10px] font-mono font-black text-accent">{st.val} Target</span>
              </div>
              <h5 className="font-serif text-xs font-black text-ink mt-0.5">{st.label}</h5>
              <AnimatePresence>
                {activeStep === i && (
                  <motion.p 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-[11px] text-muted leading-relaxed mt-1.5 pt-1.5 border-t border-line/40"
                  >
                    {st.desc}
                  </motion.p>
                )}
              </AnimatePresence>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

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
              <span className="w-1.5 h-1.5 bg-accent rounded-full mt-1.5 shrink-0 animate-pulse" />
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
    w: { title: "The 15.3% Polling Deficit", text: "Current campaign trail trailing margins require rapid acquisition of swing voter segments." },
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

// 7. Bento-Grid Demographic Cards
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
    <div ref={containerRef} className="bg-card border border-line rounded-2xl p-4 shadow-sm flex items-center gap-4 my-6">
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
        <h4 className="text-xs font-bold text-ink leading-tight">Wiper Nomination delegate alignment lock</h4>
        <p className="text-[10px] text-muted leading-tight mt-0.5">Primary validation target required on first ballot round.</p>
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

// 1. Live Ground Activity Tracker
export function LiveGroundActivityTracker() {
  const statuses = [
    { label: "Wiper Nomination Delegate Audit", status: "Active", color: "bg-accent" },
    { label: "Kitui South Radio Syndication Setup", status: "Synced", color: "bg-emerald-500" },
    { label: "Offline SMS Feedback Sync Flow", status: "Live", color: "bg-gold" },
    { label: "Countywide Compliance Audit Setup", status: "Active", color: "bg-accent" }
  ];

  return (
    <div className="bg-card border border-line rounded-2xl p-5 shadow-sm my-6">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-serif text-sm font-bold text-ink">Secretariat Ground Operations Board</h4>
        <span className="flex items-center gap-1.5 text-[10px] uppercase font-black tracking-widest text-muted bg-paper px-2 py-0.5 border border-line rounded">
          <span className="w-1.5 h-1.5 bg-accent rounded-full animate-ping" /> Synchronized
        </span>
      </div>

      <div className="space-y-3">
        {statuses.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between p-3 bg-paper border border-line rounded-xl hover:border-accent/30 transition-colors">
            <span className="text-xs font-bold text-ink truncate mr-3">{item.label}</span>
            <span className={`text-[9px] uppercase font-black px-2.5 py-0.5 rounded-full text-white ${item.color} flex items-center gap-1.5`}>
              <span className="w-1 h-1 bg-white rounded-full animate-pulse" /> {item.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

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
        <span className="absolute bottom-2 right-3 text-[9px] font-extrabold text-accent uppercase tracking-wider flex items-center gap-1">
          <RefreshCw size={10} className="animate-spin" /> Live Data Synchronization Loop
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
          <LazyMount minHeight={224}>
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

// 5. Campaign Budget Distribution Dial (Donut Chart)
export function BudgetDistributionDial() {
  const [hoveredSector, setHoveredSector] = useState<number | null>(null);
  
  const sectors = [
    { label: "Media & Broadcast", percentage: 45, val: "KSh 6.16B", color: "var(--color-accent)", rawColor: "accent", desc: "Kikamba FM syndication, brochures, and media advertising campaigns." },
    { label: "Ground Operations", percentage: 35, val: "KSh 4.79B", color: "var(--color-gold)", rawColor: "gold", desc: "Ward coordinator mobilizations, town hall assemblies, and USSD database server support." },
    { label: "Admin & Auditing", percentage: 20, val: "KSh 2.74B", color: "rgba(120,120,120,0.4)", rawColor: "line", desc: "Statutory county treasury compliance checks and legal documentation frameworks." }
  ];

  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  
  // Calculate offsets for segments
  let accumulatedOffset = 0;

  return (
    <div className="bg-card border border-line rounded-2xl p-5 shadow-sm my-6 overflow-hidden">
      <div className="flex items-center gap-2 mb-3">
        <span className="w-1.5 h-6 bg-accent rounded-full" />
        <h4 className="font-serif text-sm font-bold text-ink">Resource Budget Allocation Dial</h4>
      </div>
      <p className="text-xs text-muted mb-4">
        Interact with the sectors below to inspect targeted funding allocations.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-around gap-6">
        <div className="relative w-28 h-28 shrink-0">
          <svg className="w-full h-full transform -rotate-90 overflow-visible" viewBox="0 0 80 80">
            {/* Background circle */}
            <circle cx="40" cy="40" r={radius} className="stroke-line/20" strokeWidth="9" fill="transparent" />
            
            {sectors.map((sec, idx) => {
              const strokeDasharray = circumference;
              const strokeDashoffset = circumference - (sec.percentage / 100) * circumference;
              const currentOffset = accumulatedOffset;
              accumulatedOffset += (sec.percentage / 100) * circumference;

              return (
                <motion.circle
                  key={idx}
                  cx="40"
                  cy="40"
                  r={radius}
                  stroke={sec.color}
                  strokeWidth={hoveredSector === idx ? "11" : "9"}
                  fill="transparent"
                  strokeDasharray={strokeDasharray}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ 
                    strokeDashoffset,
                    strokeDasharray: `${circumference} ${circumference}`
                  }}
                  style={{
                    transformOrigin: "40px 40px",
                    rotate: `${(currentOffset / circumference) * 360}deg`
                  }}
                  transition={{ duration: 1.5, ease: "easeOut", delay: idx * 0.1 }}
                  strokeLinecap="round"
                  className="cursor-pointer transition-all"
                  onMouseEnter={() => setHoveredSector(idx)}
                  onMouseLeave={() => setHoveredSector(null)}
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
            <span className="text-[7px] font-black text-muted uppercase tracking-wider">FY2026/27</span>
            <span className="font-serif text-xs font-black text-ink">KSh 13.7B</span>
          </div>
        </div>

        <div className="flex-1 space-y-2 text-xs w-full">
          {sectors.map((sec, idx) => (
            <div 
              key={idx} 
              onMouseEnter={() => setHoveredSector(idx)}
              onMouseLeave={() => setHoveredSector(null)}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                hoveredSector === idx 
                  ? "bg-paper border-accent/20 shadow-sm scale-[1.02]" 
                  : "bg-transparent border-transparent"
              }`}
            >
              <div className="flex items-center justify-between font-bold text-ink">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded shrink-0`} style={{ backgroundColor: sec.color }} />
                  <span>{sec.label}</span>
                </div>
                <span>{sec.percentage}%</span>
              </div>
              <AnimatePresence>
                {hoveredSector === idx && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-1.5 pl-4 text-[10px] text-muted leading-relaxed"
                  >
                    <span className="font-mono font-black text-accent block mb-0.5">{sec.val} Allocation</span>
                    {sec.desc}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
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
          <path d="M 50 48 Q 150 20 250 48" fill="none" stroke="var(--color-accent)" strokeWidth="1.5" strokeDasharray="4 4" className="animate-pulse" />
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
        <Radio size={24} className="animate-pulse" />
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

// 3. Dynamic Counter-Messaging Grid (Side-by-side)
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
        animate={isActive ? { x: ["0%", "-50%"] } : {}}
        transition={{ ease: "linear", duration: 15, repeat: Infinity }}
      >
        <div className="flex gap-6 shrink-0">
          {slogans.map((s, idx) => (
            <span key={idx} className="text-[11px] font-black text-gold uppercase flex items-center gap-2 whitespace-nowrap">
              <Zap size={11} /> {s}
            </span>
          ))}
        </div>
        <div className="flex gap-6 shrink-0">
          {slogans.map((s, idx) => (
            <span key={`dup-${idx}`} className="text-[11px] font-black text-gold uppercase flex items-center gap-2 whitespace-nowrap">
              <Zap size={11} /> {s}
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

// 5. Media Asset Playback Mockup (Campaign Player)
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
        <span className="absolute bottom-2 left-3 text-[9px] font-black uppercase text-muted bg-card px-2 py-0.5 rounded border border-line">
          Broadcast Mockup Player
        </span>
      </div>
      <div className="mt-3 flex justify-between items-center text-xs font-bold text-ink">
        <span>Kikamba Radio Commercial Brief</span>
        <span className="text-accent text-[10px] font-black uppercase tracking-wider">0:45 Sec Spots</span>
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

// 8. Grassroots Feedback Visualizer (SMS Mockup chat logs)
export function SMSFeedbackVisualizer() {
  const logs = [
    { sender: "+254 712 *** 324", text: "When is the next market Baraza in Kitui South? We need details on the local co-op loans.", time: "10:14 AM" },
    { sender: "+254 723 *** 892", text: "Loved the radio spot on Kikamba yesterday, the economic blueprint sounds realistic.", time: "11:02 AM" }
  ];

  return (
    <div className="bg-card border border-line rounded-2xl p-5 shadow-sm my-6 space-y-3">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-serif text-sm font-bold text-ink">Grassroots USSD Message Feed</h4>
        <span className="text-[9px] font-black text-gold bg-gold/10 border border-gold/20 px-2 py-0.5 rounded uppercase">Live Feed Mockup</span>
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

// 10. Brand Asset Color Swatches
export function ColorSwatches() {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopied(hex);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="bg-card border border-line rounded-2xl p-5 shadow-sm my-6">
      <h4 className="font-serif text-sm font-bold text-ink mb-3">Official Brand Color Toolkit</h4>
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => copyToClipboard("#0056a8")}
          className="flex items-center gap-3 p-2.5 bg-paper rounded-xl border border-line hover:border-accent/40 text-left transition-all cursor-pointer"
        >
          <span className="w-8 h-8 rounded-lg bg-[#0056a8] shrink-0 border border-black/10" />
          <div>
            <span className="text-[9px] font-black text-muted uppercase">Royal Blue</span>
            <span className="block font-serif text-xs font-bold text-ink mt-0.5">
              {copied === "#0056a8" ? "COPIED" : "#0056A8"}
            </span>
          </div>
        </button>
        <button
          onClick={() => copyToClipboard("#e31d2b")}
          className="flex items-center gap-3 p-2.5 bg-paper rounded-xl border border-line hover:border-gold/40 text-left transition-all cursor-pointer"
        >
          <span className="w-8 h-8 rounded-lg bg-[#e31d2b] shrink-0 border border-black/10" />
          <div>
            <span className="text-[9px] font-black text-muted uppercase">Earth Red</span>
            <span className="block font-serif text-xs font-bold text-ink mt-0.5">
              {copied === "#e31d2b" ? "COPIED" : "#E31D2B"}
            </span>
          </div>
        </button>
      </div>
    </div>
  );
}

// ==========================================
// 5. IMPLEMENTATION & KPIS VISUAL AIDS
// ==========================================

// 1. Interactive KPI Dashboard Grid
export function KPIDashboardGrid() {
  const [activeSegment, setActiveSegment] = useState<string>("all");
  const metrics = [
    { label: "Target Voters Segment Reach", value: "320,000", cat: "outreach", icon: <Users size={16} /> },
    { label: "Wiper Nomination delegates Lock", value: "75%", cat: "compliance", icon: <ShieldCheck size={16} /> },
    { label: "Offline SMS Log databases Complete", value: "54,200", cat: "tech", icon: <Database size={16} /> }
  ];

  const filteredMetrics = activeSegment === "all" ? metrics : metrics.filter((m) => m.cat === activeSegment);

  return (
    <div className="bg-card border border-line rounded-2xl p-5 shadow-sm my-6 space-y-4">
      <div className="flex flex-wrap justify-between items-center gap-2">
        <h4 className="font-serif text-sm font-bold text-ink">Active KPI Performance Benchmarks</h4>
        <div className="flex gap-1">
          {["all", "outreach", "compliance"].map((seg) => (
            <button
              key={seg}
              onClick={() => setActiveSegment(seg)}
              className={`text-[8px] font-black uppercase tracking-wider px-2 py-1 rounded border transition-all cursor-pointer ${
                activeSegment === seg ? "bg-accent border-accent text-white" : "bg-paper border-line text-muted"
              }`}
            >
              {seg}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {filteredMetrics.map((met, idx) => (
          <div key={idx} className="bg-paper border border-line rounded-xl p-4 shadow-sm hover:border-accent/30 transition-colors">
            <div className="flex justify-between items-start">
              <span className="font-serif text-xl font-black text-ink">{met.value}</span>
              <div className="text-accent">{met.icon}</div>
            </div>
            <h5 className="text-[10px] font-bold text-muted uppercase mt-2 leading-snug">{met.label}</h5>
          </div>
        ))}
      </div>
    </div>
  );
}

// 2. Dynamic Project Burndown Line Chart Mockup
export function ProjectBurndownChart() {
  return (
    <div className="bg-card border border-line rounded-2xl p-5 shadow-sm my-6">
      <h4 className="font-serif text-sm font-bold text-ink mb-4">Milestone Burn-Rate Tracker</h4>
      <div className="w-full h-32 border-b border-l border-line relative flex items-end justify-between px-4 pb-2">
        <svg className="absolute inset-0 w-full h-full p-2 overflow-visible">
          {/* Target line */}
          <path d="M 10 20 L 300 110" fill="none" stroke="var(--color-accent)" strokeWidth="2" strokeDasharray="3 3" />
          {/* Real progress line */}
          <path d="M 10 20 L 90 40 L 180 70 L 300 110" fill="none" stroke="var(--color-gold)" strokeWidth="2.5" />
        </svg>
        {["Phase 1", "Phase 2", "Phase 3", "Final Election"].map((val, i) => (
          <span key={i} className="text-[9px] font-bold text-muted relative z-10">{val}</span>
        ))}
      </div>
      <div className="flex gap-4 justify-center text-[10px] font-bold mt-3">
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-0.5 border-t-2 border-dashed border-accent" /> Ideal Projection</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-0.5 border-t-2 border-gold" /> Actual Complete</span>
      </div>
    </div>
  );
}

// 3. SVG Circle Checklist Progress Rings
export function ChecklistProgressRings() {
  const checklist = [
    { title: "SME Consensus Alignment Networks", percent: 85, color: "stroke-accent" },
    { title: "Kikamba Aircover Radio Spot Sync", percent: 90, color: "stroke-gold" },
    { title: "Statutory spending audit reports", percent: 95, color: "stroke-emerald-500" }
  ];

  return (
    <div className="bg-card border border-line rounded-2xl p-5 shadow-sm my-6 space-y-4">
      <h4 className="font-serif text-sm font-bold text-ink">Action Progress Indicators</h4>
      <div className="space-y-3">
        {checklist.map((item, idx) => {
          const circumference = 2 * Math.PI * 14;
          const strokeDashoffset = circumference - (item.percent / 100) * circumference;
          return (
            <div key={idx} className="flex items-center justify-between p-2.5 bg-paper rounded-xl border border-line">
              <span className="text-xs font-bold text-ink max-w-[200px] truncate leading-tight pr-2">{item.title}</span>
              <div className="relative w-8 h-8 shrink-0">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="16" cy="16" r="14" className="stroke-line" strokeWidth="2.5" fill="transparent" />
                  <motion.circle
                    cx="16"
                    cy="16"
                    r="14"
                    className={item.color}
                    strokeWidth="3"
                    fill="transparent"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset }}
                    transition={{ duration: 1.5 }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-[8px] font-black text-ink">
                  {item.percent}%
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// 4. Interactive Performance Gauge
export function PerformanceGauge() {
  return (
    <div className="bg-card border border-line rounded-2xl p-5 shadow-sm my-6 flex items-center gap-4">
      <div className="relative w-16 h-16 shrink-0 bg-accent/5 border border-accent/20 rounded-full flex items-center justify-center text-accent">
        <Activity size={24} className="animate-pulse" />
      </div>
      <div>
        <h4 className="text-xs font-bold text-ink leading-tight">Voter Target Performance Index</h4>
        <p className="text-[10px] text-muted mt-1 leading-snug">
          Weighted voter database reaches and SMS feedback syncing scores are currently optimized at 92%.
        </p>
      </div>
    </div>
  );
}

// 5. Status Badge Matrix
export function StatusBadgeMatrix() {
  const [filter, setFilter] = useState<"all" | "done" | "live">("all");
  const objectives = [
    { title: "USSD Sync Platform Complete", status: "Done", color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
    { title: "Kikamba Interactive Airplays", status: "Live", color: "bg-gold/10 text-gold border-gold/20" },
    { title: "Delegate Nomination Consensus", status: "Done", color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" }
  ];

  const filtered = filter === "all" ? objectives : objectives.filter((o) => o.status.toLowerCase() === filter);

  return (
    <div className="bg-card border border-line rounded-2xl p-5 shadow-sm my-6 space-y-4">
      <div className="flex flex-wrap justify-between items-center gap-2">
        <h4 className="font-serif text-sm font-bold text-ink">Statutory Compliance Checklist</h4>
        <div className="flex gap-1">
          {["all", "done", "live"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as "all" | "done" | "live")}
              className={`text-[8px] font-black uppercase tracking-wider px-2 py-1 rounded border transition-all cursor-pointer ${
                filter === f ? "bg-accent border-accent text-white" : "bg-paper border-line text-muted"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {filtered.map((item, i) => (
          <div key={i} className="flex justify-between items-center p-2.5 bg-paper rounded-xl border border-line">
            <span className="text-xs font-bold text-ink truncate mr-3 leading-tight">{item.title}</span>
            <span className={`text-[8px] font-black px-2 py-0.5 rounded border ${item.color} uppercase`}>
              {item.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// 6. Responsive Resource Spending Chart (Bar Chart)
export function ResourceSpendingChart() {
  const bars = [
    { label: "Media Ops", val: 85, color: "bg-accent" },
    { label: "Ground Ops", val: 65, color: "bg-gold" },
    { label: "Admin Ops", val: 45, color: "bg-accent/40" }
  ];

  return (
    <div className="bg-card border border-line rounded-2xl p-5 shadow-sm my-6">
      <h4 className="font-serif text-sm font-bold text-ink mb-4">Resource Expenditure Analysis</h4>
      <div className="space-y-3">
        {bars.map((bar, i) => (
          <div key={i} className="space-y-1">
            <div className="flex justify-between items-center text-[10px] font-bold text-muted uppercase">
              <span>{bar.label}</span>
              <span>{bar.val}% Allocated</span>
            </div>
            <div className="w-full bg-line/40 h-2.5 rounded-full overflow-hidden border border-line/50">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${bar.val}%` }}
                transition={{ duration: 1.5 }}
                className={`h-full ${bar.color}`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 7. Action Item Priority Matrix (2D Scatter Grid)
export function ActionPriorityMatrix() {
  const [selectedPoint, setSelectedPoint] = useState<string>("a");
  const points: Record<string, { x: string; y: string; title: string; desc: string }> = {
    a: { x: "High", y: "High", title: "Kikamba Interactive Airplays Sync", desc: "Critical immediate priority targeting 86% of offline voters." },
    b: { x: "Medium", y: "High", title: "Wiper Nomination Delegate Audit", desc: "Core prerequisite path required on first ballot schedules." },
    c: { x: "High", y: "Medium", title: "USSD Offline SMS database Setup", desc: "Technical baseline monitoring platform required for reporting." }
  };

  return (
    <div className="bg-card border border-line rounded-2xl p-5 shadow-sm my-6">
      <h4 className="font-serif text-sm font-bold text-ink mb-4">Outreach Priority Scatter Matrix</h4>
      <div className="grid grid-cols-3 gap-2 mb-4">
        {Object.keys(points).map((key) => (
          <button
            key={key}
            onClick={() => setSelectedPoint(key)}
            className={`px-3 py-2 border rounded-xl text-xs font-bold uppercase transition-all cursor-pointer ${
              selectedPoint === key ? "bg-accent border-accent text-white" : "bg-paper border-line text-muted"
            }`}
          >
            {points[key].title.split(" ")[0]} Project
          </button>
        ))}
      </div>

      <div className="p-4 bg-paper border border-line rounded-xl">
        <div className="flex justify-between items-center text-[9px] uppercase tracking-widest font-black text-accent">
          <span>Priority Level: {points[selectedPoint].x}</span>
          <span>Effort Level: {points[selectedPoint].y}</span>
        </div>
        <h5 className="font-serif text-xs font-black text-ink mt-1.5">{points[selectedPoint].title}</h5>
        <p className="text-[11px] text-muted leading-relaxed mt-1">{points[selectedPoint].desc}</p>
      </div>
    </div>
  );
}

// 8. Interactive Campaign Roadmap (Gantt Rows)
export function CampaignRoadmapGantt() {
  const phases = [
    { title: "Nomination Prep Phase", start: "0%", end: "45%", color: "bg-accent" },
    { title: "FM Airplays & Barazas Sync", start: "30%", end: "75%", color: "bg-gold" },
    { title: "Statutory Compliance Audit", start: "60%", end: "100%", color: "bg-accent/40 text-ink" }
  ];

  return (
    <div className="bg-card border border-line rounded-2xl p-5 shadow-sm my-6 space-y-4">
      <h4 className="font-serif text-sm font-bold text-ink">Gantt Milestone Overview</h4>
      <div className="space-y-3">
        {phases.map((ph, idx) => (
          <div key={idx} className="space-y-1">
            <span className="text-[10px] font-bold text-muted uppercase">{ph.title}</span>
            <div className="w-full bg-line/30 h-6 border border-line/50 rounded-lg relative overflow-hidden">
              <div 
                className={`absolute top-0 bottom-0 ${ph.color} rounded flex items-center justify-center`}
                style={{ left: ph.start, right: `calc(100% - ${ph.end})` }}
              >
                <span className="text-[9px] font-black text-white px-2 uppercase truncate">Active Interval</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

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
