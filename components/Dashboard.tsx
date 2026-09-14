"use client";

import { CountUpText, Reveal, SpotlightCard, TiltCard } from "./visual";
import { Coins, WifiOff, Vote } from "lucide-react";

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



interface Metric {
  num: string;
  label: string;
  sub: string;
  /** Adverse figure — rendered in the danger colour. */
  warn?: boolean;
  /** Favourable figure — rendered in the accent colour. */
  good?: boolean;
  icon: React.ReactNode;
}

export function Dashboard() {
  const metrics: Metric[] = [
    // The poll card that stood here has gone, and its figures have not: DeficitGauge renders
    // 22.1% against 37.4%, the 15.3-point gap and the June-to-August widening on this same page,
    // with both published rounds as a table and a source line. Three cards away from a fuller
    // treatment of the same number is repetition, and repetition of a figure reads as a template
    // filled in twice rather than as emphasis.
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

        {/* One list, not two.
            This rendered the whole metric set twice — a `hidden sm:grid` table and a
            `block sm:hidden` carousel — so every phone downloaded and parsed both, and assistive
            technology met each figure twice. The proposal's own §2.3 names mobile data as a
            structural constraint on this electorate; shipping a desktop grid to a phone that will
            never display it is the site contradicting its own argument.

            It is now one tree that changes shape: a snapping horizontal rail on a phone, a grid
            from `sm` up. The mobile copy also truncated its label and source line, which cut
            "Own-source revenue: KSh1.339bn" off mid-figure — the wrapping below restores them. */}
        <div className="fx-stagger flex gap-3 overflow-x-auto scrollbar-none snap-x snap-mandatory -mx-4 px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-4 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-4">
          {metrics.map((m, i) => (
            <Reveal
              key={i}
              variant="pop"
              delay={i * 90}
              amount={0.3}
              className="w-[230px] shrink-0 snap-center sm:w-auto sm:shrink"
            >
              <TiltCard max={6} className="h-full">
                <SpotlightCard
                  border
                  className={`group relative h-full overflow-hidden fx-mesh border rounded-xl p-3.5 shadow-sm transition-all hover:border-accent/40 sm:p-5 ${
                    m.warn ? "border-danger/30" : m.good ? "border-accent/40" : "border-line"
                  }`}
                >
                  <div className="absolute -bottom-10 -right-10 w-24 h-24 rounded-full blur-2xl bg-accent/10 pointer-events-none" />

                  {/* The figure sits proudest in the card's own 3D space, so the tilt reads as
                      depth rather than as the whole panel rocking. */}
                  <div className="flex justify-between items-start mb-2 fx-z-1">
                    <div className={`font-sans font-bold text-3xl leading-none tabular-nums ${m.warn ? "text-danger" : m.good ? "text-accent" : "text-ink"}`}>
                      <CountUpText text={m.num} />
                    </div>
                    <div className="p-1.5 rounded-lg bg-paper border border-line fx-icon-rise">
                      {m.icon}
                    </div>
                  </div>

                  {/* No `truncate`. A figure worth printing is worth reading to the end. */}
                  <div className="t-small font-bold text-ink mt-2 leading-tight">{m.label}</div>
                  <div className="t-micro text-muted mt-1 leading-snug">{m.sub}</div>
                </SpotlightCard>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>

    </div>
  );
}
