"use client";

import { motion, useInView } from "motion/react";
import { useEffect, useState, useRef } from "react";
import { useMarqueeActive } from "../hooks/use-marquee-active";
import { useIsMobile } from "../hooks/use-mobile";
import {
  TrendingUp, 
  Coins, 
  WifiOff, 
  Vote, 
  Target, 
  Users, 
  Radio, 
  ShieldCheck 
} from "lucide-react";

// Robust parser-counter that counts up any formatted numeric values cleanly when scrolled into view
function AnimatedCounter({ value, duration = 1.8 }: { value: string; duration?: number }) {
  const [displayValue, setDisplayValue] = useState(value);
  const containerRef = useRef<HTMLSpanElement>(null);
  
  // Triggers the animation only when the number becomes visible on the screen
  const isInView = useInView(containerRef, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView) return;

    const match = value.match(/^([^0-9.]*)([0-9.]+)([^0-9.]*)$/);
    if (!match) {
      return;
    }

    const prefix = match[1];
    const targetNum = parseFloat(match[2]);
    const suffix = match[3];
    const decimals = match[2].includes(".") ? match[2].split(".")[1].length : 0;

    let startTime: number | null = null;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - timestamp % 1 + timestamp - startTime) / (duration * 1000), 1);
      
      // Custom ease-out cubic curve
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentNum = targetNum * easeProgress;

      setDisplayValue(`${prefix}${currentNum.toFixed(decimals)}${suffix}`);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration, isInView]);

  return <span ref={containerRef}>{displayValue}</span>;
}

// 3D Tilt Card wrapper reacting to user cursors on desktop, fallback to static on touch
function TiltCard({ 
  children, 
  className 
}: { 
  children: React.ReactNode; 
  className: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile) return;
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Mouse coordinate relative to the center of the card
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;

    // Safe maximum tilt of 8 degrees to prevent layout clipping
    const rX = -(mouseY / (height / 2)) * 8;
    const rY = (mouseX / (width / 2)) * 8;

    setRotateX(rX);
    setRotateY(rY);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ rotateX: isMobile ? 0 : rotateX, rotateY: isMobile ? 0 : rotateY }}
      style={{
        transformStyle: "preserve-3d",
        perspective: 1000
      }}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
      className={className}
    >
      <div style={{ transform: "translateZ(25px)" }} className="h-full">
        {children}
      </div>
    </motion.div>
  );
}

// Custom animated SVG Radial Progress indicator component
interface RadialProgressProps {
  percentage: number;
  label: string;
  sub: string;
  color: string;
  icon: React.ReactNode;
  isMarquee?: boolean;
}

function RadialProgress({ percentage, label, sub, color, icon, isMarquee = false }: RadialProgressProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-50px" });
  
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  // Animate the strokeDashoffset from the fully empty circle down to the desired percentage
  const strokeDashoffset = isInView 
    ? circumference - (percentage / 100) * circumference 
    : circumference;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`bg-card border border-line rounded-2xl p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all flex items-center gap-5 ${
        isMarquee ? 'w-[280px] shrink-0' : 'w-full'
      }`}
    >
      {/* SVG Radial Circular Dial */}
      <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90">
          {/* Background circle track */}
          <circle
            cx="40"
            cy="40"
            r={radius}
            className="stroke-line"
            strokeWidth="5"
            fill="transparent"
          />
          {/* Active colorful progress trace */}
          <motion.circle
            cx="40"
            cy="40"
            r={radius}
            stroke={color}
            strokeWidth="5.5"
            fill="transparent"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.6, ease: "easeOut" }}
            strokeLinecap="round"
          />
        </svg>
        {/* Centered micro icon overlay */}
        <div className="absolute inset-0 flex items-center justify-center" style={{ color }}>
          {icon}
        </div>
      </div>

      {/* Narrative detail */}
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-1.5 mb-1">
          <span className="font-serif text-2xl font-bold text-ink">{percentage}%</span>
          <span className="claim-badge claim-badge-estimate text-[8px] px-1.5 py-0.5 font-bold uppercase tracking-wider">
            Internal Target
          </span>
        </div>
        <h4 className="text-xs font-bold text-ink leading-tight truncate">{label}</h4>
        <p className="text-[11px] text-muted leading-relaxed mt-0.5 truncate">{sub}</p>
      </div>
    </motion.div>
  );
}

// Premium endless looping marquee wrapper using Framer Motion
function InfiniteScrollingMarquee({ children, speed = 25 }: { children: React.ReactNode; speed?: number }) {
  const { containerRef, isActive } = useMarqueeActive<HTMLDivElement>();

  return (
    <div ref={containerRef} className="relative w-full overflow-hidden select-none py-2 pointer-events-auto">
      {/* Soft overlay gradient masks for a smooth fade entry and exit */}
      <div className="absolute top-0 bottom-0 left-0 w-12 bg-gradient-to-r from-paper to-transparent z-10 pointer-events-none" />
      <div className="absolute top-0 bottom-0 right-0 w-12 bg-gradient-to-l from-paper to-transparent z-10 pointer-events-none" />

      <motion.div
        className="flex gap-4 w-max pr-4"
        animate={isActive ? { x: ["0%", "-50%"] } : {}}
        transition={{
          ease: "linear",
          duration: speed,
          repeat: Infinity,
        }}
      >
        {/* Primary interactive / screen-reader copy */}
        <div className="flex gap-4 shrink-0">{children}</div>
        {/* Duplicate copy for infinite loop — aria-hidden and removed from tab order */}
        <div className="flex gap-4 shrink-0" aria-hidden="true" tabIndex={-1}>{children}</div>
      </motion.div>
    </div>
  );
}

export function Dashboard() {
  const metrics = [
    { 
      num: "22.1%", 
      label: "Mulu — Aug 2026 poll", 
      sub: "Kasalu: 37.4% · deficit: 15.3 pts", 
      warn: true,
      icon: <TrendingUp size={16} className="text-danger" />
    },
    { 
      num: "KSh13.79bn", 
      label: "FY2026/27 Kitui resource", 
      sub: "Own-source revenue: KSh1.339bn", 
      good: true,
      icon: <Coins size={16} className="text-accent" />
    },
    { 
      num: "86.4%", 
      label: "Offline pop (KNBS 2019)", 
      sub: "13.6% active internet use in census", 
      icon: <WifiOff size={16} className="text-muted" />
    },
    { 
      num: "≈200k", 
      label: "2022 winning-vote", 
      sub: "198,004 votes won the 2022 seat", 
      icon: <Vote size={16} className="text-gold" />
    }
  ];

  const milestones = [
    {
      percentage: 75,
      label: "Wiper Nomination Target",
      sub: "Direct delegate engagement rounds",
      color: "var(--color-accent)",
      icon: <Target size={18} />
    },
    {
      percentage: 65,
      label: "Mwingi-West Support",
      sub: "Township business coalition networks",
      color: "var(--color-gold)",
      icon: <Users size={18} />
    },
    {
      percentage: 85,
      label: "Kikamba Aircover reach",
      sub: "Interactive FM radio sync scheduled",
      color: "#06b6d4", // Cyan
      icon: <Radio size={18} />
    },
    {
      percentage: 95,
      label: "Compliance & Audit Readiness",
      sub: "Legal statutory spending margins",
      color: "#10b981", // Emerald
      icon: <ShieldCheck size={18} />
    }
  ];

  return (
    <div className="space-y-8 my-8">
      {/* Scroll-Triggered Animated Metrics Section */}
      <div>
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-6 bg-accent rounded-full" />
            <h3 className="font-serif text-lg sm:text-xl font-semibold text-ink">Core Campaign Baseline Metrics</h3>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1.5 text-[10px] font-semibold tracking-wider text-muted uppercase bg-paper border border-line px-2.5 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 bg-accent rounded-full animate-ping" /> 3D Tilt Active
          </span>
        </div>

        {/* Desktop / Tablet Grid View */}
        <div className="hidden sm:grid grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((m, i) => (
            <TiltCard
              key={i}
              className={`relative overflow-hidden bg-card border rounded-xl p-4 sm:p-5 shadow-sm transition-all hover:border-accent/40 ${
                m.warn ? 'border-danger/30' : m.good ? 'border-accent/40' : 'border-line'
              }`}
            >
              <div className="absolute -bottom-10 -right-10 w-24 h-24 rounded-full blur-2xl bg-accent/10 pointer-events-none" />
              
              <div className="flex justify-between items-start mb-2">
                <div className={`font-serif text-2xl sm:text-3xl font-semibold leading-none ${m.warn ? 'text-danger' : m.good ? 'text-accent' : 'text-ink'}`}>
                  <AnimatedCounter value={m.num} />
                </div>
                <div className="p-1.5 rounded-lg bg-paper border border-line">
                  {m.icon}
                </div>
              </div>
              
              <div className="text-sm font-semibold text-muted mt-2 leading-tight">{m.label}</div>
              <div className="text-xs text-muted/70 mt-1.5">{m.sub}</div>
            </TiltCard>
          ))}
        </div>

        {/* Mobile Automatic Infinite Marquee Carousel */}
        <div className="block sm:hidden -mx-2">
          <InfiniteScrollingMarquee speed={22}>
            {metrics.map((m, i) => (
              <div
                key={i}
                className={`relative overflow-hidden bg-card border rounded-xl p-4 shadow-sm w-[260px] shrink-0 ${
                  m.warn ? 'border-danger/30' : m.good ? 'border-accent/30' : 'border-line'
                }`}
              >
                <div className="absolute -bottom-10 -right-10 w-24 h-24 rounded-full blur-2xl bg-accent/10 pointer-events-none" />
                
                <div className="flex justify-between items-start mb-2">
                  <div className={`font-serif text-2xl font-semibold leading-none ${m.warn ? 'text-danger' : m.good ? 'text-accent' : 'text-ink'}`}>
                    <AnimatedCounter value={m.num} />
                  </div>
                  <div className="p-1.5 rounded-lg bg-paper border border-line">
                    {m.icon}
                  </div>
                </div>
                
                <div className="text-xs font-semibold text-muted mt-2 leading-tight truncate">{m.label}</div>
                <div className="text-[11px] text-muted/70 mt-1 truncate">{m.sub}</div>
              </div>
            ))}
          </InfiniteScrollingMarquee>
        </div>
      </div>

      {/* SVG Radial Progress Milestone Section — Segregated Internal Targets Treatment */}
      <div className="bg-paper/40 border border-line/60 rounded-2xl p-4 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-6 bg-gold rounded-full" />
            <h3 className="font-serif text-lg sm:text-xl font-semibold text-ink">Internal Strategic Targets & Mobilization Aspirations</h3>
          </div>
          <span className="claim-badge claim-badge-estimate text-[9px] px-2.5 py-1 font-semibold uppercase tracking-wider">
            Internal Target Milestones · Not Measured Actuals
          </span>
        </div>
        <p className="text-xs text-muted leading-relaxed mb-5 max-w-3xl">
          The percentages below represent internal campaign aspiration benchmarks and target threshold objectives established for the 2026–2027 mobilization roadmap.
        </p>

        {/* Desktop / Tablet Grid View */}
        <div className="hidden sm:grid grid-cols-2 lg:grid-cols-4 gap-4">
          {milestones.map((milestone, idx) => (
            <RadialProgress
              key={idx}
              percentage={milestone.percentage}
              label={milestone.label}
              sub={milestone.sub}
              color={milestone.color}
              icon={milestone.icon}
            />
          ))}
        </div>

        {/* Mobile Automatic Infinite Marquee Carousel */}
        <div className="block sm:hidden -mx-4">
          <InfiniteScrollingMarquee speed={26}>
            {milestones.map((milestone, idx) => (
              <RadialProgress
                key={idx}
                percentage={milestone.percentage}
                label={milestone.label}
                sub={milestone.sub}
                color={milestone.color}
                icon={milestone.icon}
                isMarquee={true}
              />
            ))}
          </InfiniteScrollingMarquee>
        </div>
      </div>
    </div>
  );
}
