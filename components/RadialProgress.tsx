"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";

interface RadialProgressProps {
  percentage: number;
  label: string;
  sub: string;
  color?: string;
  icon?: React.ReactNode;
}

export function RadialProgress({ 
  percentage, 
  label, 
  sub, 
  color = "var(--color-accent)", 
  icon 
}: RadialProgressProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-40px" });
  
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  
  // Clean animated offset mapping
  const strokeDashoffset = isInView 
    ? circumference - (percentage / 100) * circumference 
    : circumference;

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-card border border-line rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-accent/40 transition-all flex items-center gap-5 w-full select-none"
    >
      <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90">
          {/* Base track circular ring */}
          <circle
            cx="48"
            cy="48"
            r={radius}
            className="stroke-line/50"
            strokeWidth="5"
            fill="transparent"
          />
          {/* Highlighted custom progress curve */}
          <motion.circle
            cx="48"
            cy="48"
            r={radius}
            stroke={color}
            strokeWidth="6"
            fill="transparent"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.8, ease: "easeOut" }}
            strokeLinecap="round"
          />
        </svg>
        {/* Absolute center element wrapper */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {icon && <div className="mb-0.5" style={{ color }}>{icon}</div>}
          <span className="font-serif text-lg font-black text-ink">{percentage}%</span>
        </div>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black tracking-widest text-muted uppercase bg-paper border border-line px-2 py-0.5 rounded-md">
            Milestone
          </span>
          <span className="text-xs font-bold" style={{ color }}>Active Target</span>
        </div>
        <h4 className="font-serif text-sm font-extrabold text-ink leading-snug mt-1.5 truncate">
          {label}
        </h4>
        <p className="text-xs text-muted/80 leading-relaxed mt-1 line-clamp-2">
          {sub}
        </p>
      </div>
    </motion.div>
  );
}
