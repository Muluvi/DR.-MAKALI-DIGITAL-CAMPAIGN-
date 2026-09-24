"use client";

import React, { useState } from "react";
import { PhoneFrame, type PhoneVariant, type PhoneLightingMode } from "./PhoneFrame";
import { BODY_H, BODY_W } from "./device";

type ServiceChannel = "whatsapp" | "ussd" | "sms";

export function ServiceTrackerPhoneMockup() {
  const [channel, setChannel] = useState<ServiceChannel>("whatsapp");
  const [ussdStep, setUssdStep] = useState<number>(1);
  const [variant, setVariant] = useState<PhoneVariant>("flagship");
  const [lightingMode, setLightingMode] = useState<PhoneLightingMode>("studio");

  return (
    <div className="not-prose my-8 rounded-2xl border border-line bg-surface p-4 sm:p-6 shadow-xs">
      <div className="max-w-xl mx-auto text-center mb-6">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-700 dark:text-sky-400 text-xs font-semibold mb-2">
          <span>§5.2.1 & §8.2.2 Citizen Grievance Architecture</span>
          <span>•</span>
          <span>Multi-Channel Ingestion</span>
        </div>
        <h3 className="t-h3 font-serif font-bold text-ink">
          Public Service Delivery Tracker Handset
        </h3>
        <p className="t-body text-sm text-muted mt-1.5">
          Simulating how a Kitui voter logs a public infrastructure breakdown (water boreholes, clinic
          drug stockouts, road washouts) across smartphone WhatsApp, offline 2G USSD, and automated SMS.
        </p>

        {/* Channel & Device Switchers */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
          <div className="inline-flex items-center gap-1 p-1 rounded-lg bg-card border border-line text-muted text-xs">
            <span className="text-[10px] font-mono uppercase px-1 text-muted/70">Channel:</span>
            <button
              type="button"
              onClick={() => setChannel("whatsapp")}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                channel === "whatsapp" ? "bg-accent-solid text-on-accent" : "hover:text-ink"
              }`}
            >
              WhatsApp Bot
            </button>
            <button
              type="button"
              onClick={() => setChannel("ussd")}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                channel === "ussd" ? "bg-accent-solid text-on-accent" : "hover:text-ink"
              }`}
            >
              2G USSD (*384*27#)
            </button>
            <button
              type="button"
              onClick={() => setChannel("sms")}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                channel === "sms" ? "bg-accent-solid text-on-accent" : "hover:text-ink"
              }`}
            >
              SMS Tracker
            </button>
          </div>

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
            label="Service Delivery Tracker Simulation"
            variant={variant}
            lightingMode={lightingMode}
          >
            {variant === "feature-phone" ? (
              /* 2G Feature Phone Screen Content */
              <div className="space-y-2 text-left">
                <div className="font-bold text-[11px] border-b border-[#12210b]/30 pb-0.5">
                  USSD: *384*27#
                </div>
                {ussdStep === 1 && (
                  <div className="space-y-1 text-[10px]">
                    <div>KITUI SERVICE TRACKER</div>
                    <div>1. Water Point / Borehole</div>
                    <div>2. Dispensary Medicine</div>
                    <div>3. Road / Culvert</div>
                    <div>4. Track My Ticket</div>
                    <button
                      type="button"
                      onClick={() => setUssdStep(2)}
                      className="w-full py-0.5 mt-2 bg-[#12210b] text-[#b9cf9c] font-bold rounded text-center block"
                    >
                      SEND [1] (WATER)
                    </button>
                  </div>
                )}
                {ussdStep === 2 && (
                  <div className="space-y-1 text-[10px]">
                    <div>SELECT WARD:</div>
                    <div>1. Mutomo Ward</div>
                    <div>2. Kyuso Ward</div>
                    <div>3. Township Ward</div>
                    <div>4. Athi Ward</div>
                    <button
                      type="button"
                      onClick={() => setUssdStep(3)}
                      className="w-full py-0.5 mt-2 bg-[#12210b] text-[#b9cf9c] font-bold rounded text-center block"
                    >
                      SEND [1] (MUTOMO)
                    </button>
                  </div>
                )}
                {ussdStep === 3 && (
                  <div className="space-y-1 text-[10px]">
                    <div className="font-bold">REPORT RECEIVED!</div>
                    <div>Ticket #KT-2027-0482</div> {/* verify-figures-ignore: mock ticket id */}
                    <div>Issue: Mutomo Borehole</div>
                    <div>Sent to Sub-County Water Office. Free SMS update incoming.</div>
                    <button
                      type="button"
                      onClick={() => setUssdStep(1)}
                      className="w-full py-0.5 mt-2 bg-[#12210b] text-[#b9cf9c] font-bold rounded text-center block"
                    >
                      EXIT [OK]
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Full Smartphone Screen */
              <div className="h-full flex flex-col bg-[#0b141a] text-slate-100 font-sans pt-11 overflow-hidden">
                {channel === "whatsapp" && (
                  <div className="flex-1 flex flex-col">
                    {/* WhatsApp Top App Bar */}
                    <div className="px-3 py-2.5 bg-[#1f2c34] flex items-center justify-between border-b border-white/5">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-white text-xs">
                          KT
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5 text-xs font-bold leading-tight text-white">
                            <span>Kitui Citizen Tracker</span>
                            <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center text-[9px] font-black">
                              ✓
                            </span>
                          </div>
                          <div className="text-[10px] text-emerald-400">Official Service Desk</div>
                        </div>
                      </div>
                      <div className="text-[11px] text-slate-400">•••</div>
                    </div>

                    {/* Chat Feed */}
                    <div className="flex-1 p-3 space-y-3 overflow-y-auto text-xs bg-[#0b141a]">
                      {/* Bot Welcome */}
                      <div className="max-w-[85%] bg-[#1f2c34] rounded-xl rounded-tl-xs p-2.5 shadow-xs text-slate-200">
                        <p className="text-[11px] leading-relaxed">
                          Welcome to the <span className="font-bold text-emerald-400">Kitui Service Delivery Tracker</span>.
                          Please describe the infrastructure issue, ward name, and attach a photo if available.
                        </p>
                        <span className="text-[9px] text-slate-400 block text-right mt-1">11:42 AM</span>
                      </div>

                      {/* Citizen Message */}
                      <div className="max-w-[85%] ml-auto bg-[#005c4b] rounded-xl rounded-tr-xs p-2.5 shadow-xs text-white">
                        {/* Simulated Photo Thumbnail */}
                        <div className="w-full h-24 rounded-lg bg-slate-800/80 mb-1.5 flex flex-col items-center justify-center border border-white/10 text-slate-300">
                          <span className="text-xl">🚰</span>
                          <span className="text-[9.5px] font-mono mt-1 text-slate-300">borehole_pump_mutomo.jpg</span>
                        </div>
                        <p className="text-[11px] leading-relaxed">
                          Mutomo Ward, Kanziko junction solar pump broken since Tuesday. 400 cattle and 2 primary schools
                          stranded without water.
                        </p>
                        <span className="text-[9px] text-emerald-200 block text-right mt-1">11:43 AM ✓✓</span>
                      </div>

                      {/* Bot Ticket Confirmation */}
                      <div className="max-w-[85%] bg-[#1f2c34] rounded-xl rounded-tl-xs p-2.5 shadow-xs text-slate-200 border-l-2 border-emerald-500">
                        <div className="flex items-center justify-between text-[10px] font-mono text-emerald-400 font-bold mb-1">
                          <span>TICKET #KT-2027-0482</span> {/* verify-figures-ignore: mock ticket id */}
                          <span className="bg-emerald-500/20 px-1.5 py-0.2 rounded text-[8.5px]">LOGGED</span>
                        </div>
                        <p className="text-[10.5px] leading-relaxed text-slate-300">
                          Issue registered & geolocated (-1.842°, 38.214°). Escalated to Kitui South Sub-County Water Desk.
                        </p>
                        <div className="mt-2 pt-1.5 border-t border-white/10 text-[9.5px] text-slate-400 flex items-center justify-between">
                          <span>SMS status code: TRACK 0482</span>
                          <span className="text-[9px] text-slate-400">11:43 AM</span>
                        </div>
                      </div>
                    </div>

                    {/* Chat Input Bar */}
                    <div className="p-2 bg-[#1f2c34] flex items-center gap-2 border-t border-white/5">
                      <div className="flex-1 bg-[#2a3942] rounded-full px-3 py-1.5 text-xs text-slate-400">
                        Type issue or reply...
                      </div>
                      <div className="w-8 h-8 rounded-full bg-[#00a884] flex items-center justify-center text-white text-xs font-bold shadow-xs">
                        ➤
                      </div>
                    </div>
                  </div>
                )}

                {channel === "ussd" && (
                  <div className="flex-1 flex flex-col justify-center items-center p-4 bg-slate-950">
                    <div className="w-full p-4 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl text-center">
                      <div className="text-[11px] font-mono font-bold text-sky-400 uppercase tracking-wider mb-2">
                        USSD Gateway • *384*27#
                      </div>
                      <div className="p-3 bg-black/60 rounded-xl font-mono text-xs text-slate-200 text-left space-y-1">
                        <div className="text-sky-300 font-bold">KITUI COUNTY SERVICE TRACKER</div>
                        <div>1. Report Borehole / Water Point</div>
                        <div>2. Report Dispensary Drug Shortage</div>
                        <div>3. Report Feeder Road / Bridge</div>
                        <div>4. Check Existing Ticket Status</div>
                      </div>

                      <div className="mt-3 flex items-center gap-2">
                        <input
                          type="text"
                          readOnly
                          value="1"
                          className="w-12 py-1.5 text-center font-mono font-bold bg-black border border-slate-700 rounded-lg text-sky-400 text-sm"
                        />
                        <button
                          type="button"
                          className="flex-1 py-1.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-lg transition-colors"
                        >
                          Send Selection
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {channel === "sms" && (
                  <div className="flex-1 flex flex-col bg-slate-900">
                    {/* SMS App Header */}
                    <div className="px-4 py-3 bg-slate-800 flex items-center justify-between border-b border-slate-700">
                      <div>
                        <div className="text-xs font-bold text-white">KITUI-TRACK (40404)</div> {/* verify-figures-ignore: short code */}
                        <div className="text-[10px] text-slate-400">Zero-Rated SMS Notification Service</div>
                      </div>
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    </div>

                    {/* Messages */}
                    <div className="flex-1 p-3 space-y-3 overflow-y-auto text-xs">
                      <div className="max-w-[80%] ml-auto bg-sky-600 text-white p-2.5 rounded-xl rounded-tr-xs">
                        <p className="text-[11px]">TRACK 0482</p> {/* verify-figures-ignore: mock command */}
                        <span className="text-[9px] text-sky-200 block text-right mt-0.5">14:10</span>
                      </div>

                      <div className="max-w-[85%] bg-slate-800 border border-slate-700 text-slate-200 p-2.5 rounded-xl rounded-tl-xs">
                        <div className="text-[9.5px] font-mono text-emerald-400 font-bold mb-1">
                          STATUS UPDATE: TICKET #KT-2027-0482
                        </div>
                        <p className="text-[11px] leading-relaxed">
                          Mutomo Borehole: Replacement pump seals & technician dispatched from Kitui Town depot. Arrival
                          expected today 16:30 EAT. Ward Champion on site.
                        </p>
                        <span className="text-[9px] text-slate-400 block text-right mt-1">14:11</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </PhoneFrame>
        </div>
      </div>

      {/* Citizen Accountability Footer */}
      <div className="mt-6 pt-4 border-t border-line text-xs text-muted flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-sky-500" />
          <span>Integrated with 40 Ward Coordinator Terminals (§5.2.3.1)</span>
        </div>
        <span className="font-mono text-[11px] text-muted/80">Average response SLA: &lt; 4 Hours</span>
      </div>
    </div>
  );
}
