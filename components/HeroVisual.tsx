"use client";

import { motion, AnimatePresence } from "motion/react";
import { EASE_ENTRANCE } from "../lib/motion";
import { useState } from "react";
import { X, Search, CheckCircle2, ChevronRight, HelpCircle } from "lucide-react";

interface StageDetail {
  id: string;
  name: string;
  title: string;
  cx: number;
  cy: number;
  zoomBox: string;
  objective: string;
  channels: string[];
  checklist: string[];
  color: string;
}

export function HeroVisual() {
  const [selectedStage, setSelectedStage] = useState<StageDetail | null>(null);

  const stages: StageDetail[] = [
    {
      id: "nomination",
      name: "NOMINATION",
      title: "Consolidating the Base (Phase -1)",
      cx: 90,
      cy: 178,
      zoomBox: "0 80 300 180",
      objective: "Build consensus, secure the Wiper nomination, and rally Kitui Central supporters intensely.",
      channels: ["Athiani FM", "Township Barazas", "Grassroots Delegates"],
      checklist: [
        "Mobilize 77,764 registered home-base voters",
        "Publish unscripted competency evidence files",
        "Set up radio monitoring in the campaign war room"
      ],
      color: "var(--color-gold)"
    },
    {
      id: "field",
      name: "FIELD",
      title: "Grassroots Deployment (Phase 1)",
      cx: 350,
      cy: 126,
      zoomBox: "200 40 300 180",
      objective: "Direct human outreach focusing on agricultural cooperatives, market traders, and village networks.",
      channels: ["Cooperative town halls", "Market roundtables", "Barazas"],
      checklist: [
        "Engage 587,151 women in key table-banking groups",
        "Establish sand dams & boreholes feasibility database",
        "Deploy mobile-money agent offline materials"
      ],
      color: "var(--color-accent)"
    },
    {
      id: "digital",
      name: "DIGITAL",
      title: "Digital Airwaves (Phase 2)",
      cx: 610,
      cy: 132,
      zoomBox: "460 40 300 180",
      objective: "Deploy segmented multimedia content to digital natives, diaspora investors, and WhatsApp groups.",
      channels: ["TikTok explainer videos", "Kikamba voice notes", "Facebook live"],
      checklist: [
        "Leverage 63.7% national smartphone adoption",
        "Incorporate unscripted weekly town-hall answers",
        "Enforce Fact-Check protocols on digital channels"
      ],
      color: "var(--color-accent)"
    },
    {
      id: "gotv",
      name: "GOTV",
      title: "Get-Out-The-Vote (Phase 3)",
      cx: 820,
      cy: 78,
      zoomBox: "600 0 300 180",
      objective: "Drive maximum election-day turnout and launch the Public Service-Delivery Tracker.",
      channels: ["SMS Broadcasts", "USSD verification shortcodes", "Ward champions"],
      checklist: [
        "Verify registered voters via simple USSD code",
        "Collect and address local service-delivery issues",
        "Provide sign language interpretation on all flagship videos"
      ],
      color: "var(--color-gold)"
    }
  ];

  const currentViewBox = selectedStage ? selectedStage.zoomBox : "0 0 900 260";

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="relative bg-gradient-to-br from-card/95 to-paper/70 border border-line rounded-3xl overflow-hidden shadow-xl"
    >
      {/* Top Bar Info */}
      <div className="p-4 sm:p-5 flex items-center justify-between border-b border-line bg-card/60 backdrop-blur-md">
        <div>
          <div className="text-[10px] uppercase tracking-[0.15em] font-extrabold text-accent">
            Countywide Campaign Architecture
          </div>
          <h4 className="font-serif text-lg font-bold text-ink mt-0.5">
            {selectedStage ? selectedStage.title : "Four-Stage Digital & Field Operating System"}
          </h4>
        </div>
        {selectedStage ? (
          <button
            onClick={() => setSelectedStage(null)}
            className="flex items-center gap-1.5 px-3 py-1 bg-paper hover:bg-line border border-line rounded-full text-xs font-bold text-ink transition-colors cursor-pointer"
          >
            <X size={13} />
            <span>Reset Map</span>
          </button>
        ) : (
          <div className="flex items-center gap-1 text-[11px] text-muted font-bold hidden sm:flex">
            <Search size={12} className="text-accent" />
            <span>Tap nodes to inspect</span>
          </div>
        )}
      </div>

      {/* SVG Canvas with dynamic transition */}
      <div className="relative h-[200px] sm:h-[240px] w-full bg-paper/30">
        <svg 
          viewBox={currentViewBox}
          className="absolute inset-0 w-full h-full transition-all duration-700 ease-in-out"
          role="img" 
          aria-label="Interactive campaign operating roadmap map"
        >
          <defs>
            <linearGradient id="routeGrad" x1="0" x2="1">
              <stop offset="0" stopColor="var(--color-accent)"/>
              <stop offset="1" stopColor="var(--color-gold)"/>
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Table background Lines */}
          <g opacity=".4" className="transition-opacity duration-500">
            <path className="stroke-line" strokeWidth="1" d="M0 55H900M0 105H900M0 155H900M0 205H900M90 0V260M210 0V260M330 0V260M450 0V260M570 0V260M690 0V260M810 0V260"/>
          </g>

          {/* Animated Connecting Flow Lines */}
          <motion.path 
            initial={{ strokeDashoffset: 1000 }}
            animate={{ strokeDashoffset: [1000, 0] }}
            transition={{ duration: 1.2, ease: EASE_ENTRANCE }}
            strokeDasharray="8 10"
            className="fill-none stroke-[url(#routeGrad)] stroke-3 stroke-linecap-round"
            d="M90 178 C180 80 250 215 350 126 S520 54 610 132 S750 202 820 78" 
          />
          <motion.path 
            initial={{ strokeDashoffset: -1000 }}
            animate={{ strokeDashoffset: [-1000, 0] }}
            transition={{ duration: 1.2, delay: 0.15, ease: EASE_ENTRANCE }}
            strokeDasharray="8 10"
            className="fill-none stroke-[url(#routeGrad)] stroke-3 stroke-linecap-round opacity-40"
            d="M90 178 C250 178 270 72 420 78 S650 190 820 78" 
          />
          
          {/* Node Interaction Markers */}
          {stages.map((stage) => {
            const isSelected = selectedStage?.id === stage.id;
            return (
              <g 
                key={stage.id} 
                className="cursor-pointer group"
                onClick={() => setSelectedStage(stage)}
              >
                {/* Visual pulsing rings for interactive feedback */}
                <circle 
                  cx={stage.cx} 
                  cy={stage.cy} 
                  r={isSelected ? 18 : 12} 
                  className="fill-accent/10 stroke-accent/30 stroke-1 group-hover:scale-125 transition-transform origin-center"
                  style={{ transformOrigin: `${stage.cx}px ${stage.cy}px` }}
                />
                
                {/* Main Node Point */}
                <motion.circle 
                  cx={stage.cx} 
                  cy={stage.cy} 
                  r={isSelected ? 8 : 6} 
                  className="transition-all"
                  fill="var(--color-card)"
                  stroke={stage.color}
                  strokeWidth={isSelected ? 4 : 2.5}
                />

                {/* Node Label (Centered horizontally above node) */}
                <text 
                  x={stage.cx} 
                  y={stage.cy - 22} 
                  textAnchor="middle" 
                  fontFamily="Inter, Arial, sans-serif" 
                  fontSize="11" 
                  fontWeight={isSelected ? "900" : "750"}
                  fill={isSelected ? "var(--color-accent)" : "var(--color-ink)"}
                  letterSpacing="0.08em"
                  className="transition-all duration-300"
                >
                  {stage.name}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Small floating hint on non-selected state */}
        {!selectedStage && (
          <div className="absolute bottom-3 left-4 right-4 text-center pointer-events-none sm:hidden">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/90 text-white text-[10px] font-bold tracking-wider shadow-md">
              <HelpCircle size={10} />
              Tap on any node to view stage details
            </span>
          </div>
        )}
      </div>

      {/* Detail panel with entrance animation */}
      <AnimatePresence mode="wait">
        {selectedStage && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="border-t border-line bg-card/90"
          >
            <div className="p-5 sm:p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-line pb-3">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-accent/10 text-accent self-start">
                  Selected Focus Area
                </span>
                <span className="text-xs font-serif italic text-muted">
                  Optimized for Dr. Mulu&apos;s Campaign Framework
                </span>
              </div>

              <div>
                <h5 className="font-semibold text-sm text-muted uppercase tracking-wider">Operational Objective</h5>
                <p className="text-sm text-ink mt-1 leading-relaxed font-medium">
                  {selectedStage.objective}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                <div>
                  <h5 className="font-semibold text-xs text-muted uppercase tracking-wider mb-2">Strategic Channels</h5>
                  <div className="flex flex-wrap gap-2">
                    {selectedStage.channels.map((channel, idx) => (
                      <span 
                        key={idx} 
                        className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg border border-line bg-paper text-ink font-semibold"
                      >
                        <ChevronRight size={10} className="text-accent" />
                        {channel}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h5 className="font-semibold text-xs text-muted uppercase tracking-wider mb-2">Task Verification Protocol</h5>
                  <ul className="space-y-1.5">
                    {selectedStage.checklist.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-ink font-medium leading-tight">
                        <CheckCircle2 size={13} className="text-accent shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
