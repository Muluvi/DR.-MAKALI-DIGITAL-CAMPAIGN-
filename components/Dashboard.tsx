"use client";

import { CountUpText, Reveal } from "./visual";
import { TrendingUp, Coins, WifiOff, Vote } from "lucide-react";

/*
 * The counter and the tilt card that used to live here have moved to components/visual/.
 *
 * Both had defects the shared versions do not. The counter computed its progress as
 * `(timestamp - timestamp % 1 + timestamp - startTime)`, roughly double the real elapsed time,
 * so it finished in about half its stated duration; it also had no reduced-motion path and
 * exposed the mid-count figure to assistive technology rather than the final one. The tilt card
 * called setState on every mousemove, which is a full React render per frame of a gesture — on
 * the mid-range Android this document is written to be read on, that is the whole frame budget.
 * The replacement writes two custom properties and never renders.
 */

// Custom animated SVG Radial Progress indicator component



export function Dashboard() {
  const metrics = [
    { 
      num: "22.1%", 
      label: "Mulu — Aug 2026 poll", 
      sub: "Kasalu 37.4%, a deficit of 15.3 points", 
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
        <Reveal variant="left" className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-6 rounded-full bg-gradient-to-b from-accent to-gold" />
            <h2 className="font-sans text-lg sm:text-xl font-bold text-ink">Where the campaign stands today</h2>
            <span aria-hidden="true" className="fx-divider-soft flex-1 min-w-4 ml-2" />
          </div>
        </Reveal>

        {/* Desktop / Tablet Table View */}
        <div className="hidden sm:grid grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((m, i) => (
            <Reveal key={i} delay={i * 90} amount={0.3}>
              {/* Was TiltCard > SpotlightCard: a 3D tilt toward the pointer, and a glow
                  tracking it. Both need a fine pointer the likely reader does not have, both
                  still shipped their hooks to every phone, and neither carried a word of the
                  proposal. docs/TRIAGE.md §5.3. The card is a card. */}
              <div
                className={`group relative h-full overflow-hidden border rounded-xl p-4 sm:p-5 shadow-sm transition-colors hover:border-accent/40 ${
 m.warn ? "border-danger/30" : m.good ? "border-accent/40" : "border-line"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className={`font-sans font-bold text-2xl sm:text-3xl leading-none tabular-nums ${m.warn ? "text-danger" : m.good ? "text-accent" : "text-ink"}`}>
                      <CountUpText text={m.num} />
                    </div>
                    <div className="p-1.5 rounded-lg bg-paper border border-line ">
                      {m.icon}
                    </div>
                  </div>

                  <div className="t-small font-bold text-ink mt-2 leading-tight">{m.label}</div>
                  <div className="t-micro text-muted mt-1">{m.sub}</div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Mobile Automatic Horizontal Scroll Carousel */}
        <div className="block sm:hidden -mx-4">
          <div className="fx-stagger flex gap-3 overflow-x-auto scrollbar-none px-4 pb-2 snap-x snap-mandatory">
            {metrics.map((m, i) => (
              <div
                key={i}
                style={{ "--fx-i": i } as React.CSSProperties}
                className={`fx-in-right relative overflow-hidden border rounded-xl p-3.5 shadow-sm w-[230px] shrink-0 snap-center ${
 m.warn ? 'border-danger/30' : m.good ? 'border-accent/30' : 'border-line'
                }`}
              >
                <div className="absolute -bottom-10 -right-10 w-24 h-24 rounded-full blur-2xl bg-accent/10 pointer-events-none" />
                
                <div className="flex justify-between items-start mb-2">
                  <div className={`font-sans font-bold text-2xl leading-none tabular-nums ${m.warn ? 'text-danger' : m.good ? 'text-accent' : 'text-ink'}`}>
                    <CountUpText text={m.num} />
                  </div>
                  <div className="p-1.5 rounded-lg bg-paper border border-line">
                    {m.icon}
                  </div>
                </div>
                
                <div className="t-small font-bold text-ink mt-2 leading-tight truncate">{m.label}</div>
                <div className="t-micro text-muted mt-1 truncate">{m.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
