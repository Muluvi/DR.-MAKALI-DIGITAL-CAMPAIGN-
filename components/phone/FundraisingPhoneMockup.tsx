"use client";

import React, { useState } from "react";
import { PhoneFrame, type PhoneVariant, type PhoneLightingMode } from "./PhoneFrame";
import { BODY_H, BODY_W } from "./device";

interface Tier {
  amount: number;
  label: string;
  impact: string;
  wardAllocation: string;
}

const DONATION_TIERS: Tier[] = [
  {
    amount: 250,
    label: "KSh 250",
    impact: "Provides 50 Kikamba manifesto summary leaflets for market-day distribution.",
    wardAllocation: "Materials & Printing • Kyuso Ward",
  },
  {
    amount: 500,
    label: "KSh 500",
    impact: "Sponsors 1 high-visibility reflective campaign vest for a Boda Boda Stage Champion.",
    wardAllocation: "Field Safety & Gear • Central Ward",
  },
  {
    amount: 1000,
    label: "KSh 1,000",
    impact: "Funds 1 full day of mobile PA loudspeaker battery & fuel for open-air market caravan.",
    wardAllocation: "Acoustic Aircover • Mutomo Ward",
  },
  {
    amount: 5000,
    label: "KSh 5,000",
    impact: "Deploys complete accreditation & logistical airtime pack for 10 polling stream agents.",
    wardAllocation: "Election Day Integrity • Tseikuru Ward",
  },
];

export function FundraisingPhoneMockup() {
  const [selectedAmount, setSelectedAmount] = useState<number>(500);
  const [phoneState, setPhoneState] = useState<"tier" | "stk" | "success">("tier");
  const [pin, setPin] = useState("••••");
  const [txId] = useState("QKJ72948X"); /* verify-figures-ignore: mock M-Pesa transaction id */
  const [variant, setVariant] = useState<PhoneVariant>("flagship");
  const [lightingMode, setLightingMode] = useState<PhoneLightingMode>("studio");

  const activeTier = DONATION_TIERS.find((t) => t.amount === selectedAmount) || DONATION_TIERS[1];

  const handleSimulateStk = () => {
    setPhoneState("stk");
  };

  const handleAuthorize = () => {
    setPhoneState("success");
  };

  const handleReset = () => {
    setPhoneState("tier");
    setPin("••••");
  };

  return (
    <div className="not-prose my-8 rounded-2xl border border-line bg-surface p-4 sm:p-6 shadow-xs">
      <div className="max-w-xl mx-auto text-center mb-6">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-semibold mb-2">
          <span>§8.1.2 & §8.13 Interactive Field Tool</span>
          <span>•</span>
          <span>Safaricom Daraja API Flow</span>
        </div>
        <h3 className="t-h3 font-serif font-bold text-ink">
          Grassroots M-Pesa Micro-Fundraising Flow
        </h3>
        <p className="t-body text-sm text-muted mt-1.5">
          Simulating the campaign&apos;s zero-fee M-Pesa STK Push gateway. Every shilling contributed by
          the grassroots is instantly attributed on a transparent, public ward development ledger.
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
            label="M-Pesa Grassroots Fundraising Simulator"
            variant={variant}
            lightingMode={lightingMode}
          >
            {variant === "feature-phone" ? (
              /* 2G Feature Phone Screen Content */
              <div className="space-y-2 text-left">
                <div className="font-bold text-[11px] border-b border-[#12210b]/30 pb-0.5">
                  M-PESA: PAYBILL 522522
                </div>
                <div className="text-[10px]">A/C: MAKALI-KITUI</div>
                <div className="text-[10px]">ENTER AMOUNT: KSH {selectedAmount}</div>
                <div className="text-[9.5px] italic text-[#12210b]/80">
                  Allocation: {activeTier.wardAllocation}
                </div>
                {phoneState === "success" ? (
                  <div className="p-1.5 bg-[#12210b]/10 border border-[#12210b]/30 rounded text-[9.5px] mt-2">
                    ✓ SMS: QKJ72948X Confirmed. Ksh{selectedAmount}.00 sent to KITUI FORWARD.
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleAuthorize}
                    className="w-full py-1 mt-2 bg-[#12210b] text-[#b9cf9c] font-bold text-[10px] rounded text-center block"
                  >
                    PRESS OK TO DONATE
                  </button>
                )}
              </div>
            ) : (
              /* Smartphone App Content */
              <div className="h-full flex flex-col bg-slate-950 text-slate-100 font-sans p-4 pt-12 overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-white text-xs shadow-xs">
                      M
                    </div>
                    <div>
                      <div className="text-xs font-bold leading-tight">KITUI FORWARD</div>
                      <div className="text-[10px] text-slate-400">Dr. Makali Mulu Campaign</div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-[9px] font-semibold border border-emerald-500/30">
                    M-PESA VERIFIED
                  </span>
                </div>

                {phoneState === "tier" && (
                  <div className="flex-1 flex flex-col justify-between py-3">
                    <div>
                      <div className="text-center my-3">
                        <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                          Select Contribution
                        </div>
                        <div className="text-3xl font-extrabold text-white mt-1">
                          KSh {selectedAmount.toLocaleString()}
                        </div>
                        <div className="text-[10px] text-emerald-400 font-mono mt-0.5">
                          Paybill: 522522 • Account: MAKALI-KITUI
                        </div>
                      </div>

                      {/* Tier Pills */}
                      <div className="grid grid-cols-2 gap-2 mt-3">
                        {DONATION_TIERS.map((tier) => {
                          const active = tier.amount === selectedAmount;
                          return (
                            <button
                              key={tier.amount}
                              type="button"
                              onClick={() => setSelectedAmount(tier.amount)}
                              className={`p-2.5 rounded-xl border text-left transition-all ${
                                active
                                  ? "border-emerald-500 bg-emerald-950/40 text-white shadow-xs"
                                  : "border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700"
                              }`}
                            >
                              <div className="text-xs font-bold">{tier.label}</div>
                              <div className="text-[9.5px] text-slate-400 mt-1 line-clamp-2 leading-tight">
                                {tier.impact}
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      {/* Ward Allocation Note */}
                      <div className="mt-4 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px]">
                        <div className="text-[9.5px] font-mono text-slate-400 uppercase tracking-wider">
                          100% Auditable Allocation:
                        </div>
                        <div className="font-medium text-emerald-300 mt-0.5">
                          {activeTier.wardAllocation}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleSimulateStk}
                      className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-2 mt-4"
                    >
                      <span>Trigger M-Pesa STK Push</span>
                      <span className="font-mono text-[10px] opacity-80">→</span>
                    </button>
                  </div>
                )}

                {/* STK Push Simulation Dialog */}
                {phoneState === "stk" && (
                  <div className="flex-1 flex flex-col justify-center items-center py-4">
                    <div className="w-full p-4 rounded-2xl bg-slate-900 border-2 border-emerald-500/50 shadow-2xl text-center animate-in fade-in zoom-in-95 duration-200">
                      <div className="w-10 h-10 mx-auto rounded-full bg-emerald-600/20 text-emerald-400 flex items-center justify-center font-bold text-sm mb-2 border border-emerald-500/30">
                        SIM
                      </div>
                      <div className="text-xs font-mono font-bold text-slate-200">
                        Safaricom STK Push
                      </div>
                      <div className="text-xs text-slate-300 mt-2 leading-relaxed">
                        Pay <span className="font-bold text-white">KSh {selectedAmount}</span> to{" "}
                        <span className="font-bold text-white">KITUI FORWARD</span> A/C MAKALI?
                      </div>

                      <div className="mt-3 py-1.5 px-3 rounded-lg bg-black/50 border border-slate-700 font-mono text-center tracking-widest text-sm text-emerald-400">
                        {pin}
                      </div>

                      <div className="grid grid-cols-2 gap-2 mt-4">
                        <button
                          type="button"
                          onClick={handleReset}
                          className="py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={handleAuthorize}
                          className="py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
                        >
                          Send PIN
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Success Receipt State */}
                {phoneState === "success" && (
                  <div className="flex-1 flex flex-col justify-between py-4">
                    <div className="text-center">
                      <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xl font-bold border border-emerald-500/40 mt-2">
                        ✓
                      </div>
                      <div className="text-sm font-bold text-white mt-2">Payment Confirmed!</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Receipt Ref: <span className="font-mono text-emerald-400">{txId}</span>
                      </div>

                      {/* Simulated M-Pesa SMS Bubble */}
                      <div className="mt-4 p-3 rounded-xl bg-slate-900 border border-slate-800 text-left font-mono text-[10px] leading-relaxed text-slate-300">
                        <div className="text-[9px] text-emerald-400 font-bold uppercase mb-1">
                          Incoming SMS • MPESA
                        </div>
                        {txId} Confirmed. Ksh{selectedAmount.toFixed(2)} sent to KITUI FORWARD
                        CAMPAIGN on 12/03/2027 at 2:14 PM. Balance: Ksh4,210.00. 100% public ledger
                        allocation: {activeTier.wardAllocation}.
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleReset}
                      className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium mt-4"
                    >
                      Make Another Contribution
                    </button>
                  </div>
                )}
              </div>
            )}
          </PhoneFrame>
        </div>
      </div>

      {/* Ward Ledger Transparency Footer */}
      <div className="mt-6 pt-4 border-t border-line text-xs text-muted flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>Statutory compliance: Elections Campaign Financing Act & Safaricom B2C API</span>
        </div>
        <span className="font-mono text-[11px] text-muted/80">Ledger hash: #MPESA-KT-2027-LIVE</span>
      </div>
    </div>
  );
}
