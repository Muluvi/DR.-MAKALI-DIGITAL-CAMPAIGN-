"use client";

import React, { useState } from "react";
import { PhoneFrame, type PhoneVariant, type PhoneLightingMode } from "./PhoneFrame";
import { BODY_H, BODY_W } from "./device";

export function OptInConsentPhoneMockup() {
  const [optedOut, setOptedOut] = useState(false);
  const [variant, setVariant] = useState<PhoneVariant>("flagship");
  const [lightingMode, setLightingMode] = useState<PhoneLightingMode>("studio");

  return (
    <div className="not-prose my-8 rounded-2xl border border-line bg-surface p-4 sm:p-6 shadow-xs">
      <div className="max-w-xl mx-auto text-center mb-6">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-semibold mb-2">
          <span>§12.5.4 & Digital Ethics Charter</span>
          <span>•</span>
          <span>Kenya Data Protection Act 2019 Compliance</span>
        </div>
        <h3 className="t-h3 font-serif font-bold text-ink">
          One-Touch Consent & Instant Opt-Out Handset
        </h3>
        <p className="t-body text-sm text-muted mt-1.5">
          Simulating the campaign&apos;s strict consent architecture. Unlike standard campaigns that purchase
          unconsented voter rolls and spam citizens, Dr. Mulu&apos;s system enforces single-touch opt-out
          with instant, irreversible list deletion.
        </p>

        {/* Handset & Environment Toggles */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
          <div className="inline-flex items-center gap-1 p-1 rounded-lg bg-card border border-line text-muted text-xs">
            <span className="text-[10px] font-mono uppercase px-1 text-muted/70">Handset:</span>
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
            <button
              type="button"
              onClick={() => setVariant("feature-phone")}
              className={`px-2 py-0.5 rounded text-xs transition-colors ${
                variant === "feature-phone" ? "bg-accent-solid text-on-accent" : "hover:text-ink"
              }`}
            >
              2G Kabambe
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
            label="Opt-in and Opt-out SMS Architecture"
            variant={variant}
            lightingMode={lightingMode}
          >
            {variant === "feature-phone" ? (
              /* 2G Feature Phone SMS View */
              <div className="space-y-2 text-left">
                <div className="font-bold text-[11px] border-b border-[#12210b]/30 pb-0.5">
                  SMS: MAKALI-2027
                </div>
                <div className="text-[9.5px] leading-tight">
                  Habari John. Dr. Makali policy update: Kyuso pipeline survey completed. Reply STOP to unsubscribe.
                </div>
                {optedOut ? (
                  <div className="p-1.5 bg-[#12210b]/10 border border-[#12210b]/30 rounded text-[9px] mt-2">
                    ✓ CONFIRMED: Number deleted from database. Audit Ref #DPA-8219.
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setOptedOut(true)}
                    className="w-full py-1 mt-2 bg-[#12210b] text-[#b9cf9c] font-bold text-[10px] rounded text-center block"
                  >
                    SEND &quot;STOP&quot; KEY [OK]
                  </button>
                )}
              </div>
            ) : (
              /* Smartphone Native SMS UI */
              <div className="h-full flex flex-col bg-slate-950 text-slate-100 font-sans pt-11 overflow-hidden">
                {/* SMS App Header */}
                <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-emerald-600/20 text-emerald-400 font-mono font-bold text-xs flex items-center justify-center border border-emerald-500/30">
                      M
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1">
                        <span>MAKALI-2027</span>
                        <span className="text-[10px] text-emerald-400">✓</span>
                      </div>
                      <div className="text-[9.5px] text-slate-400">Verified Political Sender ID</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">SMS</span>
                </div>

                {/* SMS Thread */}
                <div className="flex-1 p-3 space-y-3 overflow-y-auto text-xs">
                  {/* Campaign Broadcast Message */}
                  <div className="max-w-[88%] bg-slate-900 border border-slate-800 rounded-2xl rounded-tl-xs p-3 text-slate-200 shadow-xs">
                    <div className="text-[9.5px] font-mono text-emerald-400 font-bold mb-1">
                      KYUSO WARD POLICY UPDATE
                    </div>
                    <p className="text-[11px] leading-relaxed text-slate-300">
                      Habari John. Dr. Makali Mulu campaign updates: Solar pump installation at Kyuso Market
                      has commenced. Full policy briefing at makalimulu.ke/water.
                    </p>
                    <p className="text-[10px] text-slate-400 mt-2 italic border-t border-slate-800/80 pt-1.5">
                      To stop receiving updates at any time, tap reply &ldquo;STOP&rdquo;. Kenya Data Protection Act #ODPC-2026-991.
                    </p>
                    <span className="text-[8.5px] text-slate-500 block text-right mt-1">11:15 AM</span>
                  </div>

                  {/* Citizen STOP Message */}
                  {optedOut && (
                    <>
                      <div className="max-w-[70%] ml-auto bg-emerald-600 text-white rounded-2xl rounded-tr-xs p-2.5 text-xs shadow-xs animate-in fade-in slide-in-from-bottom-2">
                        <p className="font-mono font-bold text-[11px]">STOP</p>
                        <span className="text-[8.5px] text-emerald-200 block text-right mt-0.5">11:16 AM</span>
                      </div>

                      {/* Automated Deletion Confirmation */}
                      <div className="max-w-[88%] bg-slate-900 border border-emerald-500/40 rounded-2xl rounded-tl-xs p-3 text-slate-200 shadow-md animate-in fade-in slide-in-from-bottom-2">
                        <div className="flex items-center gap-1.5 text-[9.5px] font-mono text-emerald-400 font-bold mb-1">
                          <span>✓ NUMBER PURGED FROM CAMPAIGN LIST</span>
                        </div>
                        <p className="text-[11px] leading-relaxed text-slate-300">
                          Confirmed: Your number has been permanently deleted from all Kitui Forward databases.
                          No further messages will be sent.
                        </p>
                        <div className="mt-2 pt-1.5 border-t border-slate-800 text-[9px] font-mono text-slate-400 flex items-center justify-between">
                          <span>Audit Ref: #DPA-DEL-8219</span> {/* verify-figures-ignore: mock audit receipt */}
                          <span>11:16 AM</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Bottom Action / Input */}
                <div className="p-3 bg-slate-900 border-t border-slate-800">
                  {!optedOut ? (
                    <button
                      type="button"
                      onClick={() => setOptedOut(true)}
                      className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 font-mono text-xs font-bold border border-emerald-500/30 shadow-xs transition-colors flex items-center justify-center gap-2"
                    >
                      <span>Simulate Tapping &ldquo;Reply STOP&rdquo;</span>
                      <span>→</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setOptedOut(false)}
                      className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
                    >
                      Reset Demonstration
                    </button>
                  )}
                </div>
              </div>
            )}
          </PhoneFrame>
        </div>
      </div>

      {/* Statutory Footer */}
      <div className="mt-6 pt-4 border-t border-line text-xs text-muted flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>Zero voter list purchasing • 90-day post-election deletion guarantee</span>
        </div>
        <span className="font-mono text-[11px] text-muted/80">ODPC Certificate #2026/0491</span>
      </div>
    </div>
  );
}
