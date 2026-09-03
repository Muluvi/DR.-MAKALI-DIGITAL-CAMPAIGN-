"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";

import { useFormattedCountUp } from "../hooks/use-count-up";
import { useReducedMotionSafe } from "../hooks/use-reduced-motion-safe";

interface AnimatedMetricProps {
  value: string;
  label: string;
  sub: string;
  icon?: React.ReactNode;
  accentColor?: string;
  isCustomBg?: boolean;
}

export function AnimatedMetric({ 
  value, 
  label, 
  sub, 
  icon, 
  accentColor = "var(--color-accent)",
  isCustomBg = false
}: AnimatedMetricProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-40px" });
  const reduce = useReducedMotionSafe();
  const displayValue = useFormattedCountUp(value, isInView, reduce, 2000);

  return (
    <motion.div
      ref={containerRef}
      initial={reduce ? false : { opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`relative overflow-hidden border border-line rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md hover:border-accent/30 transition-all ${
        isCustomBg ? "bg-accent/5" : "bg-card"
      }`}
    >
      <div className="absolute -bottom-10 -right-10 w-24 h-24 rounded-full blur-2xl bg-accent/5 pointer-events-none" />
      
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="t-label uppercase tracking-widest font-extrabold text-muted">
            Campaign Statistic
          </div>
          <div 
            className="font-serif text-3xl sm:text-4xl font-black leading-none"
            style={{ color: accentColor }}
          >
            {displayValue}
          </div>
        </div>
        {icon && (
          <div className="p-2.5 rounded-xl bg-paper border border-line">
            {icon}
          </div>
        )}
      </div>

      <div className="mt-4">
        <h4 className="text-xs font-bold text-ink leading-snug">{label}</h4>
        <p className="t-small text-muted/80 leading-relaxed mt-1">{sub}</p>
      </div>
    </motion.div>
  );
}
