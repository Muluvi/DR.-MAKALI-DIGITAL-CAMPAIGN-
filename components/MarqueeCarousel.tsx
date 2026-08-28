"use client";

import { motion } from "motion/react";
import { 
  Target, 
  MapPin, 
  MessageSquare, 
  Sparkles, 
  Megaphone, 
  Users 
} from "lucide-react";

interface MarqueeItem {
  text: string;
  category: string;
  icon: React.ReactNode;
}

export function MarqueeCarousel({ speed = 30 }: { speed?: number }) {
  const items: MarqueeItem[] = [
    { text: "1.3M+ Population Outreach", category: "Milestone", icon: <Users size={14} className="text-accent" /> },
    { text: "Own-Source Revenue Growth Strategy", category: "Economic Policy", icon: <Target size={14} className="text-gold" /> },
    { text: "Kitui Central Digital Pilot Complete", category: "Operations", icon: <Sparkles size={14} className="text-accent" /> },
    { text: "Interactive FM Radio Aircover Synced", category: "Communications", icon: <Megaphone size={14} className="text-gold" /> },
    { text: "Township Business Coalition Networks", category: "Alliances", icon: <MapPin size={14} className="text-accent" /> },
    { text: "SMS + USSD Offline Grassroots Feedback", category: "Technology", icon: <MessageSquare size={14} className="text-gold" /> }
  ];

  return (
    <div className="relative w-full overflow-hidden select-none py-4 bg-card border-y border-line my-6">
      {/* Soft gradient edge fade masks */}
      <div className="absolute top-0 bottom-0 left-0 w-16 bg-gradient-to-r from-paper to-transparent z-10 pointer-events-none" />
      <div className="absolute top-0 bottom-0 right-0 w-16 bg-gradient-to-l from-paper to-transparent z-10 pointer-events-none" />

      <motion.div
        className="flex gap-4 w-max pr-4"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          ease: "linear",
          duration: speed,
          repeat: Infinity,
        }}
      >
        {/* Render duplicate items to ensure a seamless looping illusion */}
        <div className="flex gap-4 shrink-0">
          {items.map((item, idx) => (
            <div
              key={`slide-1-${idx}`}
              className="flex items-center gap-2.5 bg-paper border border-line rounded-full px-4 py-2.5 shadow-sm hover:border-accent/40 transition-colors cursor-pointer"
            >
              <div className="p-1 rounded-full bg-card border border-line">
                {item.icon}
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] uppercase tracking-wider font-extrabold text-muted leading-none">
                  {item.category}
                </span>
                <span className="text-xs font-bold text-ink leading-tight mt-0.5 whitespace-nowrap">
                  {item.text}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-4 shrink-0">
          {items.map((item, idx) => (
            <div
              key={`slide-2-${idx}`}
              className="flex items-center gap-2.5 bg-paper border border-line rounded-full px-4 py-2.5 shadow-sm hover:border-accent/40 transition-colors cursor-pointer"
            >
              <div className="p-1 rounded-full bg-card border border-line">
                {item.icon}
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] uppercase tracking-wider font-extrabold text-muted leading-none">
                  {item.category}
                </span>
                <span className="text-xs font-bold text-ink leading-tight mt-0.5 whitespace-nowrap">
                  {item.text}
                </span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
