"use client";

import React, { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { DURATION, EASE_ENTRANCE, disclosure } from "../lib/motion";
import { X, CheckCircle2, ChevronRight, Layers, Compass, Sparkles, Shield } from "lucide-react";
import { CONSTITUENCIES } from "../data/ward-register";
import { useFinePointer, useMediaQuery, useReducedMotion, useSaveData } from "../hooks/use-media-query";
import { UnderReview } from "./figures/UnderReview";

interface StageDetail {
  id: string;
  name: string;
  title: string;
  cx: number;
  cy: number;
  isoX: number;
  isoY: number;
  isoZ: number;
  zoomBox: string;
  objective: string;
  channels: string[];
  checklist: string[];
  color: string;
  statBadge: string;
}

interface VolumetricConstituency {
  id: string;
  name: string;
  voters: number;
  wards: number;
  x: number;
  y: number;
  h: number;
  color: string;
}

const CONSTITUENCY_LAYOUT: Record<string, { x: number; y: number; h: number; color: string }> = {
  "kitui-central": { x: 230, y: 88, h: 46, color: "#0056a8" },
  "mwingi-north": { x: 130, y: 55, h: 41, color: "#22d3ee" },
  "kitui-rural": { x: 290, y: 110, h: 40, color: "#8295a9" },
  "mwingi-central": { x: 200, y: 48, h: 39, color: "#0891b2" },
  "kitui-south": { x: 370, y: 135, h: 38, color: "#e31d2b" },
  "kitui-east": { x: 350, y: 85, h: 37, color: "#b45309" },
  "kitui-west": { x: 170, y: 95, h: 36, color: "#15803d" },
  "mwingi-west": { x: 90, y: 75, h: 33, color: "#6d28d9" },
};

const VOLUMETRIC_CONSTITUENCIES: VolumetricConstituency[] = CONSTITUENCIES.map((c) => {
  const layout = CONSTITUENCY_LAYOUT[c.id] || { x: 200, y: 100, h: 35, color: "#0056a8" };
  return {
    id: c.id,
    name: c.name,
    voters: c.voters,
    wards: c.wards.length,
    ...layout,
  };
});

export function HeroVisual() {
  const [selectedStage, setSelectedStage] = useState<StageDetail | null>(null);
  const [selectedConstituency, setSelectedConstituency] = useState<VolumetricConstituency | null>(null);
  const [showPillars, setShowPillars] = useState(true);
  /**
   * 2D is the default, and 3D is something a desktop reader asks for.
   *
   * This opened in "3d": an isometric terrain of eight extruded constituency pillars, rendered
   * above the fold, tilting under the pointer. It is the heaviest thing on the first screen, and
   * the reader this document is written for meets that screen on a phone, quite possibly on
   * mobile data. The pipeline view carries the same four stages and the same figures.
   *
   * So the terrain is now opt-in, and only where it can be operated and afforded: a fine pointer
   * (the tilt is a pointer gesture and does nothing on a touchscreen), a viewport wide enough to
   * read it, no Data Saver, and no reduced-motion request. Where any of those fails the toggle is
   * not rendered at all, rather than offered and then disappointing.
   */
  const [wants3D, setWants3D] = useState(false);
  const [tilt, setTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const finePointer = useFinePointer();
  const saveData = useSaveData();
  const reduceMotion = useReducedMotion();
  const wideViewport = useMediaQuery("(min-width: 1024px)");
  const canOffer3D = finePointer && wideViewport && !saveData && !reduceMotion;

  // Derived, not stored and corrected. The reader's request and the device's capability are two
  // separate facts, and the view is a function of both — so a reader who reaches 3D and then
  // narrows the window, enables Data Saver or picks up a touchscreen falls back to the view that
  // works, on the same render, without an effect reaching in to fix state after the fact.
  const viewMode: "3d" | "flow" = wants3D && canOffer3D ? "3d" : "flow";
  const setViewMode = (mode: "3d" | "flow") => setWants3D(mode === "3d");

  const stages: StageDetail[] = [
    {
      id: "nomination",
      name: "NOMINATION",
      title: "Consolidating the Base (Phase -1)",
      cx: 90,
      cy: 178,
      isoX: 130,
      isoY: 155,
      isoZ: 38,
      zoomBox: "0 80 300 180",
      objective: "Build consensus, secure the Wiper nomination, and rally Kitui Central supporters intensely.",
      channels: ["Athiani FM", "Township Barazas", "Grassroots Delegates"],
      checklist: [
        "Mobilize 77,764 registered home-base voters",
        "Publish unscripted competency evidence files",
        "Set up radio monitoring in the campaign war room"
      ],
      color: "var(--color-gold)",
      statBadge: "77,764 registered voters — home base"
    },
    {
      id: "field",
      name: "FIELD",
      title: "Grassroots Deployment (Phase 1)",
      cx: 350,
      cy: 126,
      isoX: 300,
      isoY: 120,
      isoZ: 52,
      zoomBox: "200 40 300 180",
      objective: "Direct human outreach focusing on agricultural cooperatives, market traders, and village networks.",
      channels: ["Cooperative town halls", "Market roundtables", "Barazas"],
      checklist: [
        "Engage 587,151 women in key table-banking groups",
        "Establish sand dams & boreholes feasibility database",
        "Deploy mobile-money agent offline materials"
      ],
      color: "var(--color-accent)",
      statBadge: "40 wards — full deployment"
    },
    {
      id: "digital",
      name: "DIGITAL",
      title: "Digital Airwaves (Phase 2)",
      cx: 610,
      cy: 132,
      isoX: 470,
      isoY: 95,
      isoZ: 44,
      zoomBox: "460 40 300 180",
      objective: "Deploy segmented multimedia content to digital natives, diaspora investors, and WhatsApp groups.",
      channels: ["TikTok explainer videos", "Kikamba voice notes", "Facebook live"],
      checklist: [
        "Leverage 63.7% national smartphone adoption",
        "Incorporate unscripted weekly town-hall answers",
        "Enforce Fact-Check protocols on digital channels"
      ],
      color: "var(--color-accent)",
      statBadge: "200,198 registered voters — the Mwingi bloc"
    },
    {
      id: "gotv",
      name: "GOTV",
      title: "Get-Out-The-Vote (Phase 3)",
      cx: 820,
      cy: 78,
      isoX: 620,
      isoY: 60,
      isoZ: 60,
      zoomBox: "600 0 300 180",
      objective: "Drive maximum election-day turnout and launch the Public Service-Delivery Tracker.",
      channels: ["SMS Broadcasts", "USSD verification shortcodes", "Ward champions"],
      checklist: [
        "Verify registered voters via simple USSD code",
        "Collect and address local service-delivery issues",
        "Provide sign language interpretation on all flagship videos"
      ],
      color: "var(--color-gold)",
      statBadge: "198,004 votes cast — what won in 2022"
    }
  ];

  // Mouse & Touch 3D tilt calculations with RAF throttling and reduced-motion support
  const rafRef = useRef<number | null>(null);
  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    // Tilt belongs to the 3D terrain and to nothing else. It used to run in both views and on
    // touch, where a drag across the panel rocked a flat diagram for no reason and cost a frame
    // on every pointer event.
    if (viewMode !== "3d" || !canOffer3D) return;
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      // Cap tilt angles between -5deg and 5deg for tasteful subtlety
      setTilt({
        x: -y * 8,
        y: x * 8
      });
    });
  }, [viewMode, canOffer3D]);

  const handlePointerLeave = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setTilt({ x: 0, y: 0 });
  }, []);

  const currentViewBox = selectedStage ? selectedStage.zoomBox : "0 0 900 260";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: DURATION.slow }}
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative bg-gradient-to-br from-card via-card/95 to-paper/80 border border-line rounded-3xl overflow-hidden shadow-xl"
      style={{
        perspective: 1200,
        transformStyle: "preserve-3d"
      }}
    >
      {/* Top Header Controls Bar */}
      <div className="p-3.5 sm:p-4.5 flex flex-col xs:flex-row xs:items-center justify-between gap-2.5 border-b border-line bg-card/70 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-3.5 bg-accent rounded-full shrink-0" />
            <span className="t-micro font-extrabold text-accent">
              Where the votes are
            </span>
          </div>
          <h2 className="font-serif t-small sm:t-body font-bold text-ink mt-0.5">
            {selectedStage ? selectedStage.title : "The four stages, and what each has to deliver"}
          </h2>
        </div>

        {/* Action buttons & View Mode Switcher */}
        <div className="flex items-center gap-1.5 self-start xs:self-center">
          <div className="inline-flex p-0.5 bg-paper border border-line/60 rounded-xl">
            {canOffer3D && (
            <button
              onClick={() => setViewMode("3d")}
              className={`px-2.5 py-1 min-h-[44px] min-w-[44px] justify-center t-micro font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
 viewMode === "3d"
                  ? "bg-accent-solid text-on-accent shadow-xs"
                  : "text-muted hover:text-ink"
              }`}
              aria-label="3D Isometric Terrain View"
            >
              <Layers size={11} />
              <span>3D Terrain</span>
            </button>
            )}
            <button
              onClick={() => setViewMode("flow")}
              className={`px-2.5 py-1 min-h-[44px] min-w-[44px] justify-center t-micro font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
 viewMode === "flow"
                  ? "bg-accent-solid text-on-accent shadow-xs"
                  : "text-muted hover:text-ink"
              }`}
              aria-label="Pipeline Flow View"
            >
              <Compass size={11} />
              <span>Pipeline</span>
            </button>
          </div>

          {viewMode === "3d" && (
            <button
              onClick={() => setShowPillars(!showPillars)}
              className={`px-2.5 py-1 min-h-[44px] min-w-[44px] justify-center t-micro font-bold rounded-xl border transition-all cursor-pointer flex items-center gap-1 ${
 showPillars
                  ? "bg-accent/10 border-accent/40 text-accent"
                  : "bg-paper border-line text-muted hover:text-ink"
              }`}
              title="Toggle 3D Volumetric Constituency Pillars"
            >
              <Sparkles size={11} />
              <span className="hidden sm:inline">3D Pillars</span>
            </button>
          )}

          {(selectedStage || selectedConstituency) && (
            <button
              onClick={() => {
                setSelectedStage(null);
                setSelectedConstituency(null);
              }}
              className="flex items-center gap-1 px-2.5 py-1 bg-paper hover:bg-line border border-line rounded-xl t-label font-bold text-ink transition-colors cursor-pointer"
            >
              <X size={12} />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Hard rule 2: the figure shows that it is disputed rather than quietly picking a side.

          This panel labels its DIGITAL stage "200,198 registered voters — the Mwingi bloc", while
          §3.6 argues the Mwingi bloc is reached offline and §3.6.3 rebalances effort away from
          digital (45 -> 18) and towards Kikamba radio (20 -> 37) for exactly that reason. The
          label is content, so it stays as written and is flagged here for Firefly. */}
      <div className="px-3.5 pt-3 sm:px-4.5">
        <UnderReview ids={["C-15"]}>
          This figure labels its digital stage with the Mwingi bloc&rsquo;s 200,198 registered
          voters, while §3.6 argues that bloc is reached offline. The stage labels have not been
          changed.
        </UnderReview>
      </div>

      {/* Main Canvas Area */}
      <div className="relative h-[240px] sm:h-[280px] w-full overflow-hidden bg-paper/20">
        {/* Ambient 3D Grid Underlay */}
        <div
          className="absolute inset-0 pointer-events-none transition-transform duration-300 ease-out"
          style={{
            transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
            transformStyle: "preserve-3d"
          }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--color-accent)_0%,transparent_60%)] opacity-5" />
          {/* Depth Glow Orbs */}
          <div className="absolute top-4 left-8 w-32 h-32 bg-accent/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-4 right-8 w-32 h-32 bg-gold/10 rounded-full blur-2xl pointer-events-none" />
        </div>

        {/* 3D Isometric View */}
        {viewMode === "3d" ? (
          <div
            className="absolute inset-0 flex items-center justify-center transition-transform duration-300 ease-out select-none"
            style={{
              transform: `rotateX(${20 + tilt.x}deg) rotateY(${tilt.y}deg) rotateZ(-6deg)`,
              transformStyle: "preserve-3d"
            }}
          >
            {/* The orbital ring, which used to rotate on a 35s loop. It is a ring around a map
                of eight constituencies; the rotation carried no information and ran for as long
                as the panel existed, on or off screen. */}
            <div
              className="absolute w-[min(320px,92vw)] sm:w-[560px] h-[160px] sm:h-[240px] rounded-full border border-accent/25 pointer-events-none"
              style={{ transform: "translateZ(-10px) rotateX(70deg)" }}
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-accent shadow-sm shadow-accent" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-gold shadow-sm shadow-gold" />
            </div>

            {/* Base Isometric Plinth (Shadow and Base Slab) */}
            <div
              className="absolute w-[min(300px,88vw)] sm:w-[480px] h-[150px] sm:h-[190px] rounded-3xl bg-card border border-line/80 shadow-2xl transition-all"
              style={{
                transform: "translateZ(0px)",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
              }}
            >
              {/* Isometric Topographic Elevation Lines & Volumetric 3D Pillars */}
              <svg className="w-full h-full stroke-line" viewBox="0 0 480 190" fill="none">
                <path d="M40 95 Q 120 40, 240 60 T 440 95" strokeWidth="1.5" strokeDasharray="4 4" className="opacity-30" />
                <path d="M60 115 Q 150 70, 260 85 T 420 115" strokeWidth="1.5" strokeDasharray="4 4" className="opacity-30" />
                <path d="M80 135 Q 180 100, 280 110 T 400 135" strokeWidth="1.5" strokeDasharray="4 4" className="opacity-30" />

                {/* 3D Volumetric Constituency Pillars (Prisms) */}
                {showPillars &&
                  VOLUMETRIC_CONSTITUENCIES.map((c) => {
                    const isHovered = selectedConstituency?.id === c.id;
                    const w = 11;
                    const h = isHovered ? c.h + 8 : c.h;
                    return (
                      <g
                        key={`pillar-${c.id}`}
                        className="cursor-pointer group transition-all"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedConstituency(isHovered ? null : c);
                        }}
                      >
                        {/* Ground Shadow footprint */}
                        <ellipse cx={c.x} cy={c.y + 6} rx={w + 2} ry={w / 2 + 1} className="fill-ink/10" />

                        {/* Left Face */}
                        <polygon
                          points={`${c.x - w},${c.y - h + w / 2} ${c.x},${c.y - h + w} ${c.x},${c.y + w} ${c.x - w},${c.y + w / 2}`}
                          fill={c.color}
                          fillOpacity={isHovered ? 0.95 : 0.65} // verify-figures-ignore
                          stroke={c.color}
                          strokeWidth="0.8"
                        />

                        {/* Right Face */}
                        <polygon
                          points={`${c.x},${c.y - h + w} ${c.x + w},${c.y - h + w / 2} ${c.x + w},${c.y + w / 2} ${c.x},${c.y + w}`}
                          fill={c.color}
                          fillOpacity={isHovered ? 0.8 : 0.5}
                          stroke={c.color}
                          strokeWidth="0.8"
                        />

                        {/* Top Face (Glowing Cap) */}
                        <polygon
                          points={`${c.x},${c.y - h} ${c.x + w},${c.y - h + w / 2} ${c.x},${c.y - h + w} ${c.x - w},${c.y - h + w / 2}`}
                          fill={isHovered ? "#ffffff" : c.color}
                          fillOpacity={isHovered ? 0.98 : 0.85} // verify-figures-ignore
                          stroke="#ffffff"
                          strokeWidth={isHovered ? "1.5" : "0.8"}
                        />

                        {/* Peak Light Beacon */}
                        <circle
                          cx={c.x}
                          cy={c.y - h + w / 2}
                          r={isHovered ? 4.5 : 2.5}
                          fill="#ffffff"
                          className={isHovered ? "animate-ping" : ""}
                        />
                      </g>
                    );
                  })}

                {/* Sub-County Connective Network */}
                {!showPillars && (
                  <>
                    <circle cx="90" cy="90" r="16" className="fill-paper stroke-line" />
                    <circle cx="160" cy="65" r="18" className="fill-paper stroke-line" />
                    <circle cx="230" cy="50" r="20" className="fill-paper stroke-line" />
                    <circle cx="310" cy="65" r="17" className="fill-paper stroke-line" />
                    <circle cx="380" cy="90" r="16" className="fill-paper stroke-line" />
                    <circle cx="330" cy="125" r="18" className="fill-paper stroke-line" />
                    <circle cx="240" cy="135" r="22" className="fill-paper stroke-accent/40" />
                    <circle cx="150" cy="120" r="18" className="fill-paper stroke-line" />
                  </>
                )}
              </svg>

              {/* Dynamic Radar Pulse Ring */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border border-accent/20 opacity-20 pointer-events-none" />
            </div>

            {/* Elevated 3D Tactical Nodes */}
            <div
              className="absolute w-[min(300px,88vw)] sm:w-[480px] h-[150px] sm:h-[190px] pointer-events-none"
              style={{
                transform: "translateZ(30px)",
                transformStyle: "preserve-3d"
              }}
            >
              {stages.map((stage, idx) => {
                const isSelected = selectedStage?.id === stage.id;
                // Distribute nodes across isometric diagonal
                const leftPercent = 15 + idx * 24;
                const topPercent = 65 - idx * 16;

                return (
                  <div
                    key={`iso-${stage.id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedStage(isSelected ? null : stage);
                    }}
                    className="absolute cursor-pointer group pointer-events-auto"
                    style={{
                      left: `${leftPercent}%`,
                      top: `${topPercent}%`,
                      transform: `translate(-50%, -50%) translateZ(${isSelected ? 30 : 15}px)`,
                      transformStyle: "preserve-3d"
                    }}
                  >
                    {/* Vertical Stalk to base */}
                    <div
                      className="absolute left-1/2 top-1/2 w-0.5 bg-gradient-to-t from-line to-accent origin-bottom"
                      style={{
                        height: isSelected ? "40px" : "24px",
                        transform: "translate(-50%, 0) rotateX(90deg)"
                      }}
                    />

                    {/* 3D Node Head */}
                    <div
                      className={`relative px-3 py-1.5 rounded-xl border backdrop-blur-md shadow-lg transition-all duration-300 flex items-center gap-1.5 ${
 isSelected
                          ? "bg-accent-solid text-on-accent border-accent-solid ring-4 ring-accent/30 scale-110"
                          : "bg-card/90 text-ink border-line hover:border-accent hover:scale-105"
                      }`}
                    >
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ background: stage.color }}
                      />
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black leading-none">
                          {stage.name}
                        </span>
                        <span
                          className={`text-[9px] font-mono leading-none mt-0.5 ${
 isSelected ? "text-white/80" : "text-muted"
                          }`}
                        >
                          {stage.statBadge}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selected Constituency 3D Live Telemetry HUD */}
            {selectedConstituency && (
              <div
                className="absolute -bottom-3 left-4 sm:left-8 px-3.5 py-1.5 rounded-2xl bg-card/95 border border-accent/50 shadow-2xl backdrop-blur-xl flex items-center gap-2 select-none pointer-events-auto animate-fade-in"
                style={{
                  transform: "translateZ(50px)"
                }}
              >
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: selectedConstituency.color }} />
                <div className="flex items-center gap-1.5 text-[11px] font-black text-ink">
                  <span>{selectedConstituency.name}</span>
                  <span className="text-muted font-normal">•</span>
                  <span className="font-mono text-accent">{selectedConstituency.voters.toLocaleString()} voters</span>
                  <span className="text-muted font-normal">•</span>
                  <span className="text-muted font-medium">{selectedConstituency.wards} wards</span>
                </div>
              </div>
            )}

            {/* Floating Topmost Telemetry Shield Badge */}
            <div
              className="absolute -top-3 right-4 sm:right-8 px-3 py-1 rounded-full bg-card/90 border border-gold/40 shadow-xl backdrop-blur-md flex items-center gap-1.5 select-none pointer-events-none"
              style={{
                transform: "translateZ(45px)"
              }}
            >
              <Shield size={12} className="text-gold shrink-0" />
              <span className="text-[10px] font-black text-ink">
                532,758 Voters | 30,430 km²
              </span>
            </div>
          </div>
        ) : (
          /* SVG Pipeline Flow View */
          <svg
            viewBox={currentViewBox}
            className="absolute inset-0 w-full h-full transition-all duration-700 ease-in-out"
            role="img"
            aria-label="Interactive campaign operating roadmap"
          >
            <defs>
              <linearGradient id="routeGradHero" x1="0" x2="1">
                <stop offset="0" stopColor="var(--color-accent)" />
                <stop offset="1" stopColor="var(--color-gold)" />
              </linearGradient>
            </defs>

            {/* Grid Underlay */}
            <g opacity=".3">
              <path
                className="stroke-line"
                strokeWidth="1"
                d="M0 55H900M0 105H900M0 155H900M0 205H900M90 0V260M210 0V260M330 0V260M450 0V260M570 0V260M690 0V260M810 0V260"
              />
            </g>

            {/* Animated Flow Conduits */}
            <motion.path
              initial={{ strokeDashoffset: 1000 }}
              animate={{ strokeDashoffset: [1000, 0] }}
              transition={{ duration: DURATION.deliberate, ease: EASE_ENTRANCE }}
              strokeDasharray="8 10"
              className="fill-none stroke-[url(#routeGradHero)] stroke-3 stroke-linecap-round"
              d="M90 178 C180 80 250 215 350 126 S520 54 610 132 S750 202 820 78"
            />
            <motion.path
              initial={{ strokeDashoffset: -1000 }}
              animate={{ strokeDashoffset: [-1000, 0] }}
              transition={{ duration: DURATION.deliberate, delay: 0.15, ease: EASE_ENTRANCE }}
              strokeDasharray="8 10"
              className="fill-none stroke-[url(#routeGradHero)] stroke-3 stroke-linecap-round opacity-40"
              d="M90 178 C250 178 270 72 420 78 S650 190 820 78"
            />

            {/* Stages markers */}
            {stages.map((stage) => {
              const isSelected = selectedStage?.id === stage.id;
              return (
                <g
                  key={stage.id}
                  className="cursor-pointer group"
                  onClick={() => setSelectedStage(stage)}
                >
                  <circle
                    cx={stage.cx}
                    cy={stage.cy}
                    r={isSelected ? 18 : 12}
                    className="fill-accent/10 stroke-accent/30 stroke-1 group-hover:scale-125 transition-transform origin-center"
                    style={{ transformOrigin: `${stage.cx}px ${stage.cy}px` }}
                  />

                  <motion.circle
                    cx={stage.cx}
                    cy={stage.cy}
                    r={isSelected ? 8 : 6}
                    fill="var(--color-card)"
                    stroke={stage.color}
                    strokeWidth={isSelected ? 4 : 2.5}
                  />

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
        )}

        {/* Non-intrusive Hint */}
        {!selectedStage && (
          <div className="absolute bottom-2.5 left-0 right-0 text-center pointer-events-none">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-card/90 border border-line text-muted text-[11px] font-bold shadow-xs">
              <Sparkles size={11} className="text-accent" />
              Interactive: Tap any node or toggle 3D perspective
            </span>
          </div>
        )}
      </div>

      {/* Selected Stage Detail Panel */}
      <AnimatePresence mode="wait">
        {selectedStage && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={disclosure}
            className="border-t border-line bg-card/95"
          >
            <div className="p-4 sm:p-5 space-y-3.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-line/60 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 t-label font-bold px-2.5 py-0.5 rounded-full bg-accent/10 text-accent">
                    Operational Stage #{selectedStage.id.toUpperCase()}
                  </span>
                  <span className="t-label font-mono font-bold text-ink">
                    {selectedStage.statBadge}
                  </span>
                </div>
                <span className="t-label font-serif italic text-muted">
                  Sourced Campaign Execution Protocol
                </span>
              </div>

              <div>
                <h5 className="font-semibold t-label text-muted">
                  Strategic Focus
                </h5>
                <p className="t-label sm:t-small text-ink mt-0.5 leading-relaxed font-medium">
                  {selectedStage.objective}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                <div>
                  <h5 className="font-semibold t-label text-muted mb-1.5">
                    Core Channels
                  </h5>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedStage.channels.map((channel, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 t-label px-2.5 py-1 rounded-lg border border-line bg-paper text-ink font-semibold"
                      >
                        <ChevronRight size={10} className="text-accent" />
                        {channel}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h5 className="font-semibold t-label text-muted mb-1.5">
                    Verified Execution Tasks
                  </h5>
                  <ul className="space-y-1">
                    {selectedStage.checklist.map((item, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-1.5 t-label text-ink font-medium leading-tight"
                      >
                        <CheckCircle2 size={12} className="text-accent shrink-0 mt-0.5" />
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
