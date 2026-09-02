"use client";

import { motion, useInView } from "motion/react";
import { useEffect, useState, useRef } from "react";

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
  const [displayValue, setDisplayValue] = useState(value);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-40px" });

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
    const duration = 2.0; // Perfect duration for visual impact

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      
      // Fluid ease-out cubic curve
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentNum = targetNum * easeProgress;

      setDisplayValue(`${prefix}${currentNum.toFixed(decimals)}${suffix}`);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value, isInView]);

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 15 }}
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
