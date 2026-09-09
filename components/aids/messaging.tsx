"use client";

import { motion } from "motion/react";
import { DURATION } from "../../lib/motion";
import { useState } from "react";
import { ArrowRight, Table } from "lucide-react";

/**
 * The message: what it says, how it sounds, and what it answers.
 *
 * Split out of the 560-line components/StrategicAids.tsx, which held thirteen unrelated
 * components in one module — the one file in this repo that broke the one-component-per-file
 * convention every other directory follows.
 */

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
