"use client";

import { Target, MapPin, MessageSquare, Sparkles, Megaphone, Users } from "lucide-react";
import { useMarqueeActive } from "../hooks/use-marquee-active";

interface MarqueeItem {
  text: string;
  category: string;
  icon: React.ReactNode;
}

export function MarqueeCarousel({ speed = 30 }: { speed?: number }) {
  const { containerRef, isActive } = useMarqueeActive<HTMLDivElement>();
  const items: MarqueeItem[] = [
    { text: "1.3M+ Population Outreach", category: "Milestone", icon: <Users size={14} className="text-accent" /> },
    { text: "Own-Source Revenue Growth Strategy", category: "Economic Policy", icon: <Target size={14} className="text-gold" /> },
    { text: "Kitui Central Digital Pilot Complete", category: "Operations", icon: <Sparkles size={14} className="text-accent" /> },
    { text: "Interactive FM Radio Aircover Synced", category: "Communications", icon: <Megaphone size={14} className="text-gold" /> },
    { text: "Township Business Coalition Networks", category: "Alliances", icon: <MapPin size={14} className="text-accent" /> },
    { text: "SMS + USSD Offline Grassroots Feedback", category: "Technology", icon: <MessageSquare size={14} className="text-gold" /> }
  ];

  return (
    <div
      ref={containerRef}
      className="fx-pause-on-hover fx-mask-fade-x relative w-full overflow-hidden select-none py-4 bg-card border-y border-line my-6"
    >
      {/* The strip itself is masked to transparent at both ends (fx-mask-fade-x), so items
          dissolve rather than being clipped by an overlay in the page's background colour —
          which is what the two gradient panels here used to fake, and why they broke whenever
          the strip sat on anything but paper. */}

      {/* The loop is a CSS animation rather than a `motion` one, for two reasons that both
          matter here. A continuously-running JS animation keeps the main thread busy for as long
          as the strip is on screen; and `animation-play-state` is what lets `.fx-pause-on-hover`
          stop the strip when a reader puts the pointer on it — which a `motion` animate array
          cannot be halted by from CSS. Off-screen, `isActive` drops the class entirely, so the
          strip costs nothing at all while the reader is 40,000 words further down. */}
      <div
        className={`flex gap-4 w-max pr-4 ${isActive ? "fx-loop-marquee" : ""}`}
        style={{ "--fx-loop-dur": `${speed}s` } as React.CSSProperties}
      >
        {/* Primary items accessible to screen readers */}
        <div className="flex gap-4 shrink-0">
          {items.map((item, idx) => (
            <div
              key={`slide-1-${idx}`}
              className="fx-lift flex items-center gap-2.5 bg-paper border border-line rounded-full px-4 py-2.5 shadow-sm hover:border-accent/40"
            >
              <div className="p-1 rounded-full bg-card border border-line">
                {item.icon}
              </div>
              <div className="flex flex-col">
                <span className="t-micro uppercase tracking-wider font-extrabold text-muted leading-none">
                  {item.category}
                </span>
                <span className="text-xs font-bold text-ink leading-tight mt-0.5 whitespace-nowrap">
                  {item.text}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Duplicate items for seamless visual animation loop (aria-hidden and non-focusable) */}
        <div className="flex gap-4 shrink-0" aria-hidden="true">
          {items.map((item, idx) => (
            <div
              key={`slide-2-${idx}`}
              tabIndex={-1}
              className="flex items-center gap-2.5 bg-paper border border-line rounded-full px-4 py-2.5 shadow-sm hover:border-accent/40 transition-colors pointer-events-none"
            >
              <div className="p-1 rounded-full bg-card border border-line">
                {item.icon}
              </div>
              <div className="flex flex-col">
                <span className="t-micro uppercase tracking-wider font-extrabold text-muted leading-none">
                  {item.category}
                </span>
                <span className="text-xs font-bold text-ink leading-tight mt-0.5 whitespace-nowrap">
                  {item.text}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
