"use client";

import { motion, useInView } from "motion/react";
import { useEffect, useState, useRef } from "react";
import { useMarqueeActive } from "../hooks/use-marquee-active";
import { useIsMobile } from "../hooks/use-mobile";
import { NominationScorecard } from "./NominationScorecard";
import { TrendingUp, Coins, WifiOff, Vote } from "lucide-react";

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


  return (
    <div className="space-y-8 my-8">
      {/* Scroll-Triggered Animated Metrics Section */}
      <div>
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-6 bg-accent rounded-full" />
            <h3 className="font-serif text-lg sm:text-xl font-semibold text-ink">Core Campaign Baseline Metrics</h3>
          </div>
        </div>

        {/* Desktop / Tablet Table View */}
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

        {/* Mobile Automatic Horizontal Scroll Carousel */}
        <div className="block sm:hidden -mx-4">
          <div className="flex gap-3 overflow-x-auto scrollbar-none px-4 pb-2 snap-x snap-mandatory">
            {metrics.map((m, i) => (
              <div
                key={i}
                className={`relative overflow-hidden bg-card border rounded-xl p-3.5 shadow-sm w-[230px] shrink-0 snap-center ${
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
                <div className="t-small text-muted/70 mt-1 truncate">{m.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section 20.2 nomination KPIs — targets against baselines, not progress. */}
      <div className="bg-paper/40 border border-line/60 rounded-2xl p-4 sm:p-6">
        <NominationScorecard />
      </div>
    </div>
  );
}
