"use client";

import { motion } from "motion/react";
import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';
import { Sliders, HelpCircle, CheckCircle2 } from "lucide-react";

import { useReducedMotionSafe } from "../hooks/use-reduced-motion-safe";
import { DURATION } from "../lib/motion";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-line p-2 shadow-sm rounded-lg text-sm">
        <p className="font-bold text-ink">{label}</p>
        <p className="text-muted">{`${payload[0].value}%`}</p>
      </div>
    );
  }
  return null;
};

export function DataVisualizations() {
  const [activeTier, setActiveTier] = useState<"lean" | "standard" | "premium">("standard");
  const reduce = useReducedMotionSafe();

  const tiers = {
    lean: {
      title: "LEAN SYSTEM",
      ad: "15–20% of verified ceiling",
      reach: "~60,000 realistic Phase 3 contacts",
      team: "3-person core + mandatory Kikamba producer",
      note: "Best for nomination sprint; weakest in the arid belt and deliberately limited on modelling."
    },
    standard: {
      title: "STANDARD SYSTEM · RECOMMENDED",
      ad: "30–40% of verified ceiling",
      reach: "~150,000 realistic Phase 3 contacts",
      team: "3-person core + activated surge roles",
      note: "Best balance of countywide recognition, low-connectivity reach, analytics and compliance discipline."
    },
    premium: {
      title: "PREMIUM SYSTEM",
      ad: "45–55% of verified ceiling",
      reach: "~250,000 realistic Phase 3 contacts",
      team: "3-person core + full surge bench",
      note: "Maximum share of voice, but requires careful headroom because the statutory ceiling covers more than digital."
    }
  };

  const pollData = [
    { name: 'Kasalu Jun', percent: 31.3, isRival: true },
    { name: 'Mulu Jun', percent: 20.2, isRival: false },
    { name: 'Kasalu Aug', percent: 37.4, isRival: true },
    { name: 'Mulu Aug', percent: 22.1, isRival: false },
  ];

  // Helper mapping index to tier
  const tierArray: ("lean" | "standard" | "premium")[] = ["lean", "standard", "premium"];
  const currentSliderIndex = tierArray.indexOf(activeTier);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    setActiveTier(tierArray[val]);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Poll Visualization */}
      <motion.section
        initial={reduce ? false : { opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative overflow-hidden bg-card border-x-0 sm:border border-y sm:border-line rounded-none sm:rounded-3xl p-4 sm:p-8 shadow-none sm:shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent pointer-events-none" />
        <h3 className="font-serif text-2xl mb-1 text-dark">The immediate contest</h3>
        <p className="text-xs text-muted mb-6">Published Mizani Africa trend used in the proposal.</p>
        
        <div className="h-[250px] w-full relative z-10">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={pollData}
              layout="vertical"
              margin={{ top: 0, right: 30, left: 10, bottom: 0 }}
            >
              <XAxis type="number" hide domain={[0, 45]} />
              <YAxis 
                type="category" 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'var(--muted)', fontSize: 13, fontWeight: 500 }}
                width={85}
              />
              <Tooltip cursor={{ fill: 'var(--glow)' }} content={<CustomTooltip />} />
              <Bar
                dataKey="percent"
                radius={[0, 10, 10, 0]}
                isAnimationActive={!reduce}
                animationDuration={DURATION.entrance * 1000}
                animationEasing="ease-out"
                barSize={20}
              >
                {pollData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.isRival ? 'var(--danger)' : 'var(--accent)'} />
                ))}
                <LabelList dataKey="percent" position="right" fill="var(--ink)" fontSize={13} fontWeight="bold" formatter={(val: any) => `${val}%`} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.section>

      {/* Budget Scenario */}
      <motion.section
        initial={reduce ? false : { opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        className="bg-card border-x-0 sm:border border-y sm:border-line rounded-none sm:rounded-3xl p-4 sm:p-8 shadow-none sm:shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all flex flex-col justify-between"
      >
        <div>
          <div className="flex items-center justify-between gap-2 mb-1">
            <h3 className="font-serif text-2xl text-dark">Budget scenario</h3>
            <span className="text-accent bg-accent/10 px-2 py-0.5 rounded-full t-label font-extrabold tracking-wider uppercase">
              Interactive Slider
            </span>
          </div>
          <p className="text-xs text-muted mb-5">Slide or tap to reallocate the estimated campaign resources dynamically.</p>
          
          {/* Slider input control - excellent for mobile fingers */}
          <div className="mb-6 px-1">
            <div className="flex justify-between t-small font-extrabold text-muted tracking-wider uppercase mb-2">
              <span className={activeTier === "lean" ? "text-accent scale-105 transition-transform" : ""}>Lean</span>
              <span className={activeTier === "standard" ? "text-accent scale-105 transition-transform" : ""}>Recommended</span>
              <span className={activeTier === "premium" ? "text-accent scale-105 transition-transform" : ""}>Premium</span>
            </div>
            
            <div className="relative flex items-center">
              <input 
                type="range" 
                min="0" 
                max="2" 
                step="1"
                value={currentSliderIndex}
                onChange={handleSliderChange}
                className="w-full h-2.5 bg-line rounded-lg appearance-none cursor-pointer accent-accent focus:outline-none"
                style={{
                  background: `linear-gradient(to right, var(--color-accent) 0%, var(--color-accent) ${(currentSliderIndex / 2) * 100}%, var(--color-line) ${(currentSliderIndex / 2) * 100}%, var(--color-line) 100%)`
                }}
              />
            </div>
          </div>

          {/* Fallback segment selector buttons */}
          <div className="flex gap-1.5 mb-5 overflow-x-auto pb-1">
            {(["lean", "standard", "premium"] as const).map((tier) => (
              <button
                key={tier}
                onClick={() => setActiveTier(tier)}
                className={`flex-1 py-1.5 rounded-xl text-xs font-bold capitalize transition-all border cursor-pointer ${
                  activeTier === tier 
                    ? "bg-accent text-white border-accent shadow-sm" 
                    : "bg-card text-muted border-line hover:border-accent/40"
                }`}
              >
                {tier}
              </button>
            ))}
          </div>
        </div>
        
        {/* Scenario Detailed Outputs with motion container */}
        <motion.div
          key={activeTier}
          initial={reduce ? false : { opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: reduce ? 0 : 0.3 }}
          className="bg-paper rounded-2xl p-4 sm:p-5 border border-line"
        >
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 size={15} className="text-accent shrink-0" />
            <h4 className="font-serif text-lg font-bold text-ink">{tiers[activeTier].title}</h4>
          </div>
          <div className="text-sm text-muted space-y-2.5">
            <p><strong className="text-ink font-semibold">Allocated ad budget:</strong> {tiers[activeTier].ad}</p>
            <p><strong className="text-ink font-semibold">Citizen reach scope:</strong> {tiers[activeTier].reach}</p>
            <p className="pt-2 border-t border-line/60 text-xs italic leading-relaxed text-ink/80 flex items-start gap-1.5">
              <HelpCircle size={13} className="text-accent shrink-0 mt-0.5" />
              <span>{tiers[activeTier].team}. {tiers[activeTier].note}</span>
            </p>
          </div>
        </motion.div>
      </motion.section>
    </div>
  );
}
