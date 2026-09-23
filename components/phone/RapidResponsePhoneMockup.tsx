"use client";

import React, { useState } from "react";
import { PhoneFrame, type PhoneVariant, type PhoneLightingMode } from "./PhoneFrame";
import { BODY_H, BODY_W } from "./device";

export function RapidResponsePhoneMockup() {
  const [activeTab, setActiveTab] = useState<"comparison" | "card" | "sent">("comparison");
  const [playingTrack, setPlayingTrack] = useState<"fake" | "real" | null>(null);
  const [variant, setVariant] = useState<PhoneVariant>("flagship");
  const [lightingMode, setLightingMode] = useState<PhoneLightingMode>("studio");

  const togglePlay = (track: "fake" | "real") => {
    if (playingTrack === track) {
      setPlayingTrack(null);
    } else {
      setPlayingTrack(track);
    }
  };

  return (
    <div className="not-prose my-8 rounded-2xl border border-line bg-surface p-4 sm:p-6 shadow-xs">
      <div className="max-w-xl mx-auto text-center mb-6">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-400 text-xs font-semibold mb-2">
          <span>§5.8.7 & Annex F Protocol</span>
          <span>•</span>
          <span>Level 3 Manipulated Media Protocol (30-Min Clock)</span>
        </div>
        <h3 className="t-h3 font-serif font-bold text-ink">
          Rapid Rebuttal & WhatsApp &ldquo;Rumour Buster&rdquo;
        </h3>
        <p className="t-body text-sm text-muted mt-1.5">
          Simulating how the campaign detects fabricated voice-notes circulating in ward WhatsApp groups,
          matches them against the canonical speech archive, and supplies ward captains with verified
          debunk cards.
        </p>

        {/* Handset & Environment Toggles */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
          <div className="inline-flex items-center gap-1 p-1 rounded-lg bg-card border border-line text-muted text-xs">
            <span className="text-[10px] font-mono uppercase px-1 text-muted/70">Device:</span>
            <button
              type="button"
              onClick={() => setVariant("flagship")}
              className={`px-2 py-0.5 rounded text-xs transition-colors ${
                variant === "flagship" ? "bg-accent-solid text-on-accent" : "hover:text-ink"
              }`}
            >
              Flagship
            </button>
            <button
              type="button"
              onClick={() => setVariant("affordable-android")}
              className={`px-2 py-0.5 rounded text-xs transition-colors ${
                variant === "affordable-android" ? "bg-accent-solid text-on-accent" : "hover:text-ink"
              }`}
            >
              Android Go
            </button>
          </div>

          <div className="inline-flex items-center gap-1 p-1 rounded-lg bg-card border border-line text-muted text-xs">
            <span className="text-[10px] font-mono uppercase px-1 text-muted/70">Lighting:</span>
            <button
              type="button"
              onClick={() => setLightingMode("studio")}
              className={`px-2 py-0.5 rounded text-xs transition-colors ${
                lightingMode === "studio" ? "bg-accent-solid text-on-accent" : "hover:text-ink"
              }`}
            >
              Studio
            </button>
            <button
              type="button"
              onClick={() => setLightingMode("sunlight")}
              className={`px-2 py-0.5 rounded text-xs transition-colors ${
                lightingMode === "sunlight" ? "bg-accent-solid text-on-accent" : "hover:text-ink"
              }`}
            >
              Direct Sun
            </button>
          </div>
        </div>
      </div>

      {/* Handset Stage */}
      <div className="flex justify-center">
        <div
          className="w-full overflow-hidden"
          style={{ maxWidth: BODY_W, aspectRatio: `${BODY_W} / ${BODY_H}` }}
        >
          <PhoneFrame
            label="Rapid Response WhatsApp Debunk Simulation"
            variant={variant}
            lightingMode={lightingMode}
          >
            <div className="h-full flex flex-col bg-[#0c1317] text-slate-100 font-sans pt-11 overflow-hidden">
              {/* WhatsApp Group Header */}
              <div className="px-3 py-2 bg-[#1f2c34] flex items-center justify-between border-b border-white/5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-amber-600 flex items-center justify-center font-bold text-white text-xs">
                    MN
                  </div>
                  <div>
                    <div className="text-xs font-bold leading-tight text-white truncate max-w-[170px]">
                      Mwingi North Grassroots
                    </div>
                    <div className="text-[10px] text-slate-400">842 members • 12 admins</div>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 font-mono text-[9px] font-bold border border-rose-500/30">
                  ALERT
                </span>
              </div>

              {/* Chat Feed */}
              <div className="flex-1 p-3 space-y-3 overflow-y-auto text-xs bg-[#0b141a]">
                {/* Viral Fake Audio Bubble */}
                <div className="max-w-[92%] bg-[#1f2c34] rounded-xl rounded-tl-xs p-2.5 border-l-3 border-rose-500 shadow-md">
                  <div className="flex items-center gap-1.5 text-[9.5px] font-mono text-rose-400 font-bold mb-1">
                    <span>⚠️ FORWARDED MANY TIMES</span>
                    <span>•</span>
                    <span>VIRAL HOAX</span>
                  </div>

                  {/* Audio player card */}
                  <div className="p-2 rounded-lg bg-black/40 border border-rose-500/30 mt-1.5">
                    <div className="flex items-center justify-between text-[10px] text-slate-300">
                      <span className="font-semibold text-rose-300">Manipulated Voice Clip (0:22)</span>
                      <button
                        type="button"
                        onClick={() => togglePlay("fake")}
                        className="px-2 py-0.5 rounded bg-rose-600 hover:bg-rose-500 text-white font-bold text-[9px]"
                      >
                        {playingTrack === "fake" ? "Pause" : "Play Clip"}
                      </button>
                    </div>
                    <div className="mt-2 flex items-center gap-1">
                      {[4, 12, 8, 16, 22, 18, 14, 6, 12, 20, 15, 8, 4].map((h, i) => (
                        <span
                          key={i}
                          className={`flex-1 rounded-full transition-all ${
                            playingTrack === "fake" ? "bg-rose-400 animate-pulse" : "bg-slate-600"
                          }`}
                          style={{ height: `${h}px` }}
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-[10.5px] text-slate-300 mt-2 leading-tight">
                    &ldquo;Makali Mulu caught on secret recording planning to cut Mwingi bursaries...&rdquo;
                  </p>
                  <span className="text-[8.5px] text-slate-400 block text-right mt-1">10:14 AM</span>
                </div>

                {/* Campaign Rapid Rebuttal Verification Card */}
                <div className="max-w-[92%] ml-auto bg-[#005c4b] rounded-xl rounded-tr-xs p-2.5 shadow-md border-l-3 border-emerald-400 text-white">
                  <div className="flex items-center justify-between text-[9.5px] font-mono font-bold text-emerald-200 mb-1 border-b border-white/10 pb-1">
                    <span>FACT-CHECK VERIFICATION</span>
                    <span className="bg-emerald-400/20 text-emerald-200 px-1 rounded">PROVENANCE CONFIRMED</span>
                  </div>

                  {/* Authentic Hansard Recording */}
                  <div className="p-2 rounded-lg bg-black/30 border border-emerald-400/30 mt-1">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-semibold text-emerald-300">Original Hansard Audio (14 May 2025)</span>
                      <button
                        type="button"
                        onClick={() => togglePlay("real")}
                        className="px-2 py-0.5 rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-[9px]"
                      >
                        {playingTrack === "real" ? "Pause" : "Play Real"}
                      </button>
                    </div>
                    <div className="mt-2 flex items-center gap-1">
                      {[8, 14, 20, 24, 18, 12, 16, 22, 19, 14, 10, 6, 12].map((h, i) => (
                        <span
                          key={i}
                          className={`flex-1 rounded-full transition-all ${
                            playingTrack === "real" ? "bg-emerald-300 animate-pulse" : "bg-emerald-700"
                          }`}
                          style={{ height: `${h}px` }}
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-[10px] leading-tight text-emerald-100 mt-2">
                    <strong className="text-white">The Truth:</strong> Dr. Mulu was demanding a KSh 50M
                    increase for ASAL water harvesting, not a cut. The audio was spliced from 3 separate
                    interviews.
                  </p>

                  <div className="mt-2 pt-1 border-t border-white/10 flex items-center justify-between text-[9px] text-emerald-200">
                    <span>Official Citation: Hansard Vol 48, p 112</span>
                    <span>10:28 AM ✓✓</span>
                  </div>
                </div>

                {/* Ward Forward Action Status */}
                {activeTab === "sent" ? (
                  <div className="p-2 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-center text-xs text-emerald-300 animate-in fade-in">
                    ✓ Correction card pushed to all 40 Ward WhatsApp Broadcast Lists.
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setActiveTab("sent")}
                    className="w-full py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>Forward Debunk Card to 400 Ward Captains</span>
                    <span className="font-mono text-[10px]">→</span>
                  </button>
                )}
              </div>

              {/* Bottom SLA Info */}
              <div className="p-2 bg-[#1f2c34] text-center text-[10px] font-mono text-slate-400 border-t border-white/5">
                Resolution elapsed: 14 mins (Well inside 30-min Level 3 SLA)
              </div>
            </div>
          </PhoneFrame>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-line text-xs text-muted flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-rose-500" />
          <span>Prevents Liar&apos;s Dividend through strict provenance metadata (§5.8.7)</span>
        </div>
        <span className="font-mono text-[11px] text-muted/80">War Room Hash: #DEBUNK-MN-042</span>
      </div>
    </div>
  );
}
