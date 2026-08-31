"use client";

import { motion } from "motion/react";

export function StrategyRail() {
  const steps = [
    { num: "01", label: "Diagnose", title: "Baseline", desc: "Polls · wards · channels · compliance" },
    { num: "02", label: "Position", title: "Nomination", desc: "Recognition · preference · narrative" },
    { num: "03", label: "Persuade", title: "Message lab", desc: "Creative · research · earned media" },
    { num: "04", label: "Mobilise", title: "GOTV", desc: "SMS · USSD · volunteers · field" },
    { num: "05", label: "Govern", title: "Measure", desc: "Compliance · attribution · tracker" },
  ];

  return (
    <div className="my-12">
      {/* Visual Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-line to-transparent relative mb-8 sm:mb-12">
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-paper px-3 text-[10px] sm:text-xs tracking-widest uppercase text-muted font-semibold whitespace-nowrap">
          Operating architecture
        </span>
      </div>

      {/* Strategy Rail */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3 lg:gap-4 relative group/rail">
        {steps.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5, ease: "easeOut" }}
            className="relative bg-card border border-line rounded-xl p-3.5 sm:p-4 min-h-[100px] overflow-hidden group shadow-sm transition-all"
          >
            {/* Animated Bottom Border */}
            <div className="absolute left-0 bottom-0 h-0.5 w-full bg-gradient-to-r from-accent to-gold scale-x-0 origin-left transition-transform duration-500 ease-out group-hover:scale-x-100" />
            
            <div className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-accent mb-1 flex items-center justify-between">
              <span>{step.num} &middot; {step.label}</span>
              {i < steps.length - 1 && (
                <span className="text-gold opacity-0 lg:group-hover/rail:opacity-100 transition-opacity absolute right-[-10px] top-1/2 -translate-y-1/2 z-10 text-lg hidden lg:block font-semibold">›</span>
              )}
            </div>
            
            <h4 className="font-serif text-base sm:text-lg text-ink font-semibold leading-tight mb-1">{step.title}</h4>
            <p className="text-[11px] sm:text-xs text-muted leading-snug">{step.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
