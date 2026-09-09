"use client";

import { motion } from "motion/react";
import { DURATION, SPRING } from "../lib/motion";
import { useState, useEffect, useRef } from "react";
import { Play, Pause, Volume2, Calendar, ArrowRight, Radio, FileText, BookOpen, RefreshCw, Table } from "lucide-react";

// ==========================================
// 1. STRATEGY & TARGETING VISUAL AIDS
// ==========================================

// 10. Focus-Mode Reading View (Simulated context state controller)
export function FocusModeToggle({ 
  onToggle, 
  isActive 
}: { 
  onToggle: () => void; 
  isActive: boolean;
}) {
  return (
    <div className="bg-card border border-line rounded-2xl p-4 shadow-sm flex items-center justify-between my-4 select-none">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-accent/10 text-accent">
          <BookOpen size={16} />
        </div>
        <div>
          <p className="text-xs font-extrabold text-ink leading-tight">Campaign Focus Mode</p>
          <p className="t-label text-muted">Collapse visual aids to focus solely on campaign strategy text.</p>
        </div>
      </div>
      <button
        onClick={onToggle}
        className={`px-3 py-1.5 rounded-lg text-xs font-extrabold uppercase tracking-wider transition-all border cursor-pointer ${
          isActive 
            ? "bg-accent-solid border-accent-solid text-on-accent" 
            : "bg-paper border-line text-muted hover:text-accent"
        }`}
      >
        {isActive ? "Disable Focus" : "Enable Focus"}
      </button>
    </div>
  );
}

// ==========================================
// 2. OPERATIONS & ARCHITECTURE VISUAL AIDS
// ==========================================

// 2. Operational Flywheel Schematic (Animated SVG flow diagram)
export function FlywheelSchematic() {
  return (
    <div className="bg-card border border-line rounded-2xl p-4 sm:p-5 shadow-sm my-6">
      <h4 className="font-serif text-sm font-bold text-ink mb-4">Integrated Feedback Flow Circuit</h4>
      <div className="w-full h-32 flex items-center justify-center bg-paper border border-line rounded-xl relative overflow-hidden">
        <svg className="w-full h-full max-w-xs overflow-visible" viewBox="0 0 300 120">
          {/* Box 1 */}
          <rect x="10" y="40" width="70" height="40" rx="6" className="fill-card stroke-accent stroke-[1.5]" />
          <text x="45" y="64" textAnchor="middle" className="fill-ink font-serif t-micro font-black">OFFLINE SMS</text>
          
          {/* Flow Arrow 1 */}
          <path d="M 80 60 L 110 60" stroke="var(--color-accent)" strokeWidth="2" strokeDasharray="3 3" />
          
          {/* Box 2 */}
          <rect x="115" y="40" width="70" height="40" rx="6" className="fill-card stroke-gold stroke-[1.5]" />
          <text x="150" y="64" textAnchor="middle" className="fill-ink font-serif t-micro font-black">CLOUD SYNC</text>
          
          {/* Flow Arrow 2 */}
          <path d="M 185 60 L 215 60" stroke="var(--color-gold)" strokeWidth="2" strokeDasharray="3 3" />
          
          {/* Box 3 */}
          <rect x="220" y="40" width="70" height="40" rx="6" className="fill-card stroke-accent stroke-[1.5]" />
          <text x="255" y="64" textAnchor="middle" className="fill-ink font-serif t-micro font-black">SECRETARIAT</text>
        </svg>
        <span className="absolute bottom-2 right-3 t-micro font-extrabold text-muted uppercase tracking-wider flex items-center gap-1">
          <RefreshCw size={10} aria-hidden="true" /> Proposed synchronisation loop
        </span>
      </div>
    </div>
  );
}

// ==========================================
// 3. TACTICS & THEMES VISUAL AIDS
// ==========================================

// 1. Interactive Messaging Playground (Language Tabs)
export function MessagingPlayground() {
  const [lang, setLang] = useState<"en" | "kik" | "sw">("en");
  const messages = {
    en: { slogan: "Sustainable Growth & Dev", copy: "Building a transparent, data-driven local treasury to empower Kitui Central businesses." },
    kik: { slogan: "Mbeu Nsya na Maendeeo", copy: "Kuseuvya mitalo ya mbeo nzao ila yithataa muingi wa Kitui na biashara kwoo." },
    sw: { slogan: "Maendeleo Mapya Kitui", copy: "Kukuza mifumo ya wazi ya hazina ili kuwezesha biashara ndogo ndogo Kitui." }
  };

  return (
    <div className="bg-card border border-line rounded-2xl p-4 sm:p-5 shadow-sm my-6">
      <h4 className="font-serif text-sm font-bold text-ink mb-3">Multilingual Campaign Slogan Selector</h4>
      <div className="flex gap-1.5 mb-4">
        {Object.keys(messages).map((l) => (
          <button
            key={l}
            onClick={() => setLang(l as "en" | "kik" | "sw")}
            className={`flex-1 t-label font-black uppercase py-1.5 rounded-lg border transition-all cursor-pointer ${
              lang === l ? "bg-accent-solid border-accent-solid text-on-accent" : "bg-paper border-line text-muted"
            }`}
          >
            {l === "en" ? "English" : l === "kik" ? "Kikamba" : "Swahili"}
          </button>
        ))}
      </div>

      <div className="p-4 bg-paper border border-line rounded-xl">
        <span className="t-micro font-black text-accent uppercase tracking-widest leading-none">Aligned Brand Slogan</span>
        <h5 className="font-serif text-sm font-black text-ink mt-0.5">{messages[lang].slogan}</h5>
        <p className="text-xs text-muted/90 mt-1.5 leading-relaxed">{messages[lang].copy}</p>
      </div>
    </div>
  );
}

// 2. Kikamba Radio Aircover Dial (Animated SVG wavelength)
export function RadioAircoverDial() {
  return (
    <div className="bg-card border border-line rounded-2xl p-4 sm:p-5 shadow-sm my-6 flex items-center gap-5">
      <div className="relative w-16 h-16 shrink-0 flex items-center justify-center bg-accent/5 border border-accent/20 rounded-full text-accent">
        <Radio size={24} aria-hidden="true" />
      </div>
      <div>
        <h4 className="text-xs font-bold text-ink leading-tight">Interactive FM Broadcasters Sync</h4>
        <p className="t-label text-muted mt-1 leading-snug">
          Syndicated audio broadcast network schedules cover 85% of Kitui&apos;s offline districts.
        </p>
      </div>
    </div>
  );
}

// 3. Dynamic Counter-Messaging Table (Side-by-side)
export function CounterMessagingGrid() {
  return (
    <div className="bg-card border border-line rounded-2xl p-4 sm:p-5 shadow-sm my-6 space-y-4">
      <h4 className="font-serif text-sm font-bold text-ink">Opposition Counter-Narrative Matrix</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 bg-red-500/[0.03] border border-red-500/20 rounded-xl">
          <span className="t-micro uppercase tracking-widest font-black text-red-600">Opposition Claim</span>
          <p className="t-small text-muted mt-1.5 leading-relaxed">
            &ldquo;Wiper&apos;s offline model fails to match digitized investment and high-tech corporate frameworks.&rdquo;
          </p>
        </div>
        <div className="p-4 bg-accent/[0.03] border border-accent/20 rounded-xl">
          <span className="t-micro uppercase tracking-widest font-black text-accent">Wiper Talking Point</span>
          <p className="t-small text-muted mt-1.5 leading-relaxed">
            &ldquo;We integrate offline SMS syncing with modern cloud systems, respecting Kitui&apos;s 86% offline population.&rdquo;
          </p>
        </div>
      </div>
    </div>
  );
}

// 5. Media Asset Playback (Campaign Audio Spot)
export function MediaPlaybackMockup() {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="bg-card border border-line rounded-2xl p-4 sm:p-5 shadow-sm max-w-sm my-6 select-none">
      <div className="bg-paper border border-line rounded-xl aspect-video relative overflow-hidden flex items-center justify-center">
        {/* Soft background visual glow pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-gold/10" />
        <button
          onClick={() => setPlaying(!playing)}
          className="p-4 rounded-full bg-accent-solid text-on-accent hover:bg-accent/90 transition-all shadow-md relative z-10 cursor-pointer"
        >
          {playing ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
        </button>
        <span className="absolute bottom-2 left-3 t-micro font-black uppercase text-accent bg-card px-2 py-0.5 rounded border border-line">
          Vernacular Radio Broadcast Player
        </span>
      </div>
      <div className="mt-3 flex justify-between items-center text-xs font-bold text-ink">
        <span>Kikamba Radio Commercial Spot</span>
        <span className="text-accent t-label font-black uppercase tracking-wider">0:45 Sec Broadcast</span>
      </div>
    </div>
  );
}

// 6. Interactive Tone-of-Voice Slider
export function ToneVoiceSlider() {
  const [sliderVal, setSliderVal] = useState<number>(60); // 0 = Technical, 100 = Grassroots

  const getToneDetails = (val: number) => {
    if (val < 35) {
      return {
        type: "Authoritative & Technical",
        accent: "text-accent",
        sloganEnglish: "Statutory fiscal prudence secures Kitui's long-term sovereign growth index.",
        sloganKikamba: "Uthyuilo wa mbesa sya nthi syavinya nikuatitye uiilu wa utonga wiulu wa Kitui.",
        focus: "SME licensing transparency, own-source revenue compliance, institutional audit accountability."
      };
    } else if (val < 70) {
      return {
        type: "Balanced Competence",
        accent: "text-gold",
        sloganEnglish: "A realistic economic blueprint designed to build SME wealth and secure local cooperatives.",
        sloganKikamba: "Mbeu Nsya na kazi bora yaseitwe niguo kuongelea utonga wa masoko na makooperativi ala masumbikikae.",
        focus: "Combining digital cloud databases with offline SMS networks to support municipal market growth."
      };
    } else {
      return {
        type: "Empathetic & Grassroots",
        accent: "text-emerald-500",
        sloganEnglish: "Livelihoods first: supporting local farmers and ensuring access to co-op development resources.",
        sloganKikamba: "Uimi mbeu, mbesa mufuko: kuseovya kiko kya uimi niguo kuetee mwananchi mbesa na kazi bora.",
        focus: "Direct market assemblies, radio baraza syncs, physical brochures, localized cooperative alignments."
      };
    }
  };

  const tone = getToneDetails(sliderVal);

  return (
    <div className="bg-card border border-line rounded-2xl p-4 sm:p-5 shadow-sm my-6 overflow-hidden">
      <div className="flex items-center gap-2 mb-3">
        <span className="w-1.5 h-6 bg-accent rounded-full" />
        <h4 className="font-serif text-sm font-bold text-ink">Interactive Communication Tone Guideline</h4>
      </div>
      <p className="text-xs text-muted mb-4">
        Slide to dynamically adjust the campaign voice balance between technical policy and grassroots reach.
      </p>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center text-muted t-label uppercase font-black mb-2">
            <span>Authoritative Technical</span>
            <span>Empathetic Grassroots</span>
          </div>
          <div className="relative w-full flex items-center">
            <input 
              type="range"
              min="0"
              max="100"
              value={sliderVal}
              onChange={(e) => setSliderVal(parseInt(e.target.value))}
              className="w-full accent-accent h-2 bg-line/60 rounded-full cursor-pointer appearance-none"
            />
          </div>
          <div className="flex justify-between t-micro font-bold text-muted/80 mt-1.5">
            <span>0% Technical</span>
            <span className="font-black text-accent">{sliderVal}% Grassroots Weight</span>
            <span>100% Grassroots</span>
          </div>
        </div>

        <motion.div 
          key={tone.type}
          initial={{ opacity: 0, y: 3 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DURATION.quick }}
          className="p-4 bg-paper border border-line rounded-xl space-y-3"
        >
          <div>
            <span className="t-micro uppercase tracking-widest font-black text-muted">Active Slogan Archetype</span>
            <h5 className={`font-serif text-xs font-black ${tone.accent} mt-0.5`}>{tone.type}</h5>
          </div>

          <div className="space-y-2">
            <div>
              <span className="t-micro uppercase tracking-wider font-extrabold text-muted">English Guideline</span>
              <p className="text-xs text-ink font-medium leading-relaxed italic">&ldquo;{tone.sloganEnglish}&rdquo;</p>
            </div>
            <div>
              <span className="t-micro uppercase tracking-wider font-extrabold text-muted">Kikamba Slogan Variant</span>
              <p className="text-xs text-ink/90 font-medium leading-relaxed italic">&ldquo;{tone.sloganKikamba}&rdquo;</p>
            </div>
            <div className="pt-2 border-t border-line/40">
              <span className="t-micro uppercase tracking-wider font-extrabold text-muted block mb-0.5">Campaign Focus Elements</span>
              <p className="t-label text-muted leading-relaxed font-bold">{tone.focus}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// 7. Interactive Slogan Builder
export function SloganBuilder() {
  const pillars = ["Mbeu Nsya", "Kazi Bora", "Governor Economist", "Transparency", "Equity"];
  const [selectedPillars, setSelectedPillars] = useState<string[]>(["Mbeu Nsya", "Kazi Bora"]);

  const handleToggle = (pill: string) => {
    if (selectedPillars.includes(pill)) {
      setSelectedPillars(selectedPillars.filter((p) => p !== pill));
    } else {
      setSelectedPillars([...selectedPillars, pill]);
    }
  };

  return (
    <div className="bg-card border border-line rounded-2xl p-4 sm:p-5 shadow-sm my-6">
      <h4 className="font-serif text-sm font-bold text-ink mb-3">Modular Slogan Sandbox</h4>
      <div className="flex flex-wrap gap-2 mb-4">
        {pillars.map((pill) => {
          const isSelected = selectedPillars.includes(pill);
          return (
            <button
              key={pill}
              onClick={() => handleToggle(pill)}
              className={`t-label font-extrabold uppercase py-1 px-2.5 rounded-full border transition-all cursor-pointer ${
                isSelected ? "bg-gold border-gold text-white" : "bg-paper border-line text-muted hover:border-gold/30"
              }`}
            >
              {pill}
            </button>
          );
        })}
      </div>

      <div className="p-4 bg-paper border border-line rounded-xl flex items-center justify-between">
        <div>
          <span className="t-micro uppercase tracking-wider font-extrabold text-muted">Generated Tagline</span>
          <p className="font-serif text-sm font-black text-ink mt-0.5 leading-none">
            {selectedPillars.length > 0 ? selectedPillars.join(" · ") : "Select Campaign Pillars"}
          </p>
        </div>
        <ArrowRight size={16} className="text-gold" />
      </div>
    </div>
  );
}

// 8. Grassroots Feedback Visualizer (SMS feed logs)
export function SMSFeedbackVisualizer() {
  const logs = [
    { sender: "+254 712 *** 324", text: "When is the next market Baraza in Kitui South? We need details on the local co-op loans.", time: "10:14 AM" },
    { sender: "+254 723 *** 892", text: "Loved the radio spot on Kikamba yesterday, the economic blueprint sounds realistic.", time: "11:02 AM" }
  ];

  return (
    <div className="bg-card border border-line rounded-2xl p-4 sm:p-5 shadow-sm my-6 space-y-3">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-serif text-sm font-bold text-ink">Grassroots USSD Message Feed</h4>
        <span className="t-micro font-black text-gold bg-gold/10 border border-gold/20 px-2 py-0.5 rounded uppercase">Verified Ingestion Feed</span>
      </div>
      
      <div className="space-y-3">
        {logs.map((log, idx) => (
          <div key={idx} className="p-3 bg-paper border border-line rounded-xl">
            <div className="flex justify-between t-label font-extrabold text-muted mb-1.5 uppercase">
              <span>{log.sender}</span>
              <span>{log.time}</span>
            </div>
            <p className="text-xs text-ink/90 leading-snug font-medium italic">&ldquo;{log.text}&rdquo;</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// 9. Interactive Community Forum Scheduler
export function CommunityScheduler() {
  const events = [
    { title: "Kitui West Cooperative Assembly", date: "Sept 12, 2026", time: "10:00 AM", location: "Kabati Market Square" },
    { title: "Mwingi Central Town Hall Gathering", date: "Sept 18, 2026", time: "2:00 PM", location: "Mwingi Town Council" }
  ];

  return (
    <div className="bg-card border border-line rounded-2xl p-4 sm:p-5 shadow-sm my-6 space-y-3">
      <h4 className="font-serif text-sm font-bold text-ink mb-1">Upcoming Market Assembly Schedules</h4>
      <div className="space-y-3">
        {events.map((ev, i) => (
          <div key={i} className="flex gap-3 bg-paper border border-line p-3 rounded-xl hover:border-accent/30 transition-all">
            <div className="p-2.5 bg-card border border-line rounded-lg text-accent self-start shrink-0">
              <Calendar size={16} />
            </div>
            <div>
              <h5 className="font-serif text-xs font-black text-ink leading-tight">{ev.title}</h5>
              <div className="flex flex-wrap gap-x-3 gap-y-1 t-label font-extrabold text-muted mt-1 uppercase">
                <span>{ev.date}</span>
                <span>{ev.time}</span>
                <span className="text-accent">{ev.location}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// 4. EXPORT & READING CONTROLS
// ==========================================

// 10. Interactive Report Generator (Print Toggle)
export function PrintReportGenerator({ onPrint }: { onPrint?: () => void } = {}) {
  // Falls back to the browser dialog only if no handler is supplied. The handler ClientPage
  // passes routes to /full first, so the PDF is the whole proposal rather than whichever
  // section the reader happened to have open.
  const triggerPrint = () => {
    if (onPrint) onPrint();
    else window.print();
  };

  return (
    <div className="bg-card border border-line rounded-2xl p-4 shadow-sm flex items-center justify-between my-6 select-none">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-lg bg-accent/10 text-accent">
          <FileText size={16} />
        </div>
        <div>
          <p className="text-xs font-extrabold text-ink leading-tight">Print PDF Briefing Kit</p>
          <p className="t-label text-muted">Format the strategy portal for clean legal printing briefs.</p>
        </div>
      </div>
      <button
        onClick={triggerPrint}
        className="px-4 py-1.5 bg-accent-solid text-on-accent rounded-lg text-xs font-extrabold uppercase tracking-wider hover:bg-accent/90 transition-all cursor-pointer"
      >
        Export PDF
      </button>
    </div>
  );
}
