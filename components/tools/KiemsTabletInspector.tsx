"use client";

import React, { useState } from "react";
import { IllustrativeTag } from "../premium/IllustrativeTag";
import { TiltStage } from "../premium/TiltStage";
import { CONSTITUENCIES_BY_SIZE, COUNTY_TOTAL_WARDS } from "../../data/ward-register";

type TabletView = "bvr" | "form37a" | "threshold";

export function KiemsTabletInspector() {
  const [view, setView] = useState<TabletView>("form37a");
  const [scanning, setScanning] = useState<boolean>(false);
  const [scanned, setScanned] = useState<boolean>(false);

  const handleScanFingerprint = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      setScanned(true);
    }, 1200);
  };

  return (
    <div className="not-prose my-8 rounded-2xl border border-line bg-surface p-4 sm:p-6 shadow-xs">
      {/* Header */}
      <div className="max-w-xl mx-auto text-center mb-6">
        <IllustrativeTag />
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-700 dark:text-indigo-400 text-xs font-semibold mb-2">
          <span>§3.4 & §3.4.4 Electoral Integrity Tool</span>
          <span>•</span>
          <span>IEBC KIEMS Tablet Architecture</span>
        </div>
        <h3 className="t-h3 font-serif font-bold text-ink">
          IEBC KIEMS Biometric Tablet & Form 37A Inspector
        </h3>
        <p className="t-body text-sm text-muted mt-1.5">
          Simulating the ruggedized election tablet deployed across Kitui&apos;s 1,450 polling streams.
          Inspect voter biometric authentication, statutory Form 37A digital tallies, and the countywide
          200,000 vote threshold calculation.
        </p>

        {/* View Switcher */}
        <div className="inline-flex items-center gap-1 p-1 rounded-lg bg-card border border-line text-muted text-xs mt-4">
          <button
            type="button"
            onClick={() => setView("form37a")}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              view === "form37a" ? "bg-accent-solid text-on-accent shadow-xs" : "hover:text-ink"
            }`}
          >
            Form 37A Reconciliation
          </button>
          <button
            type="button"
            onClick={() => setView("bvr")}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              view === "bvr" ? "bg-accent-solid text-on-accent shadow-xs" : "hover:text-ink"
            }`}
          >
            Biometric Voter Check
          </button>
          <button
            type="button"
            onClick={() => setView("threshold")}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              view === "threshold" ? "bg-accent-solid text-on-accent shadow-xs" : "hover:text-ink"
            }`}
          >
            200,000 Vote Target Velocity
          </button>
        </div>
      </div>

      {/* Ruggedized Tablet Enclosure */}
      <TiltStage className="max-w-3xl mx-auto" radius={24} maxX={1.6} maxY={3.2}>
        <div className="pf-slab rounded-3xl bg-[#1e232d] border-8 border-[#323946] p-3 sm:p-5 text-slate-100">
          {/* Hardware Status Header */}
          <div className="flex items-center justify-between px-2 pb-3 border-b border-white/10 text-[10.5px] font-mono text-slate-300">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span className="font-bold text-white">IEBC KIEMS KIT #KT-0142</span>
              <span className="text-slate-400 hidden sm:inline">• DUAL SIM 4G [SAF/AIR]</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-emerald-400 font-bold">GPS LOCKED (-01.372°, 38.012°)</span> {/* verify-figures-ignore: mock GPS */}
              <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-200">BATTERY: 94%</span>
            </div>
          </div>

          {/* Polling Station Metadata Bar */}
          <div className="py-2 px-3 my-2 rounded-lg bg-[#141820] border border-white/5 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
            <div>
              <span className="text-slate-400">Station: </span>
              <span className="text-amber-300 font-bold">014/02 - Kitui Muslim Primary School</span>
            </div>
            <div>
              <span className="text-slate-400">Ward: </span>
              <span className="text-white">Township Ward (Kitui Central)</span>
            </div>
            <div>
              <span className="text-slate-400">Stream: </span>
              <span className="text-emerald-400 font-bold">02 of 03 (Voters A-K)</span>
            </div>
          </div>

          {/* Screen Area */}
          <div key={view} className="pf-xfade pf-glass-screen rounded-xl bg-[#0e1218] border border-white/10 p-4 min-h-[360px] flex flex-col justify-between">
            {/* TAB 1: FORM 37A STATUTORY RECONCILIATION */}
            {view === "form37a" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <div>
                    <div className="text-xs font-bold font-mono text-amber-400">
                      FORM 37A: GUBERNATORIAL ELECTION RESULTS TALLY
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Regulation 79(1) of Elections (General) Regulations 2012
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold border border-emerald-500/40">
                    ARITHMETIC VERIFIED ✓
                  </span>
                </div>

                {/* Stream Voter Turnout Numbers */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                  <div className="p-2 rounded-lg bg-[#181d26] border border-white/5">
                    <span className="text-[10px] text-slate-400 block">Registered Voters:</span>
                    <span className="text-base font-bold text-white">650</span>
                  </div>
                  <div className="p-2 rounded-lg bg-[#181d26] border border-white/5">
                    <span className="text-[10px] text-slate-400 block">Ballots Issued:</span>
                    <span className="text-base font-bold text-amber-300">412 (63.4%)</span> {/* verify-figures-ignore: stream specimen */}
                  </div>
                  <div className="p-2 rounded-lg bg-[#181d26] border border-white/5">
                    <span className="text-[10px] text-slate-400 block">Valid Ballots:</span>
                    <span className="text-base font-bold text-emerald-400">407</span>
                  </div>
                  <div className="p-2 rounded-lg bg-[#181d26] border border-white/5">
                    <span className="text-[10px] text-slate-400 block">Rejected Ballots:</span>
                    <span className="text-base font-bold text-rose-400">5</span>
                  </div>
                </div>

                {/* Candidate Votes Breakdown Table */}
                <div className="border border-white/10 rounded-xl overflow-hidden text-xs">
                  <div className="grid grid-cols-12 bg-[#1b212c] p-2 font-mono font-bold text-slate-300 text-[11px] border-b border-white/10">
                    <div className="col-span-6">CANDIDATE NAME</div>
                    <div className="col-span-3 text-right">VOTES CAST</div>
                    <div className="col-span-3 text-right">SHARE (%)</div>
                  </div>

                  {/* Candidate 1: Dr. Makali Mulu */}
                  <div className="grid grid-cols-12 p-2.5 bg-emerald-950/30 border-b border-white/5 items-center font-mono">
                    <div className="col-span-6 font-bold text-emerald-300 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span>DR. BENSON MAKALI MULU</span>
                    </div>
                    <div className="col-span-3 text-right font-extrabold text-white text-sm">248</div>
                    <div className="col-span-3 text-right font-bold text-emerald-400">60.9%</div> {/* verify-figures-ignore: stream specimen */}
                  </div>

                  {/* Candidate 2: Current Incumbent */}
                  <div className="grid grid-cols-12 p-2.5 bg-[#141922] border-b border-white/5 items-center font-mono text-slate-300">
                    <div className="col-span-6">Incumbent Alignment Candidate</div>
                    <div className="col-span-3 text-right font-semibold">118</div>
                    <div className="col-span-3 text-right text-slate-400">29.0%</div>
                  </div>

                  {/* Candidate 3: Third Party */}
                  <div className="grid grid-cols-12 p-2.5 bg-[#141922] items-center font-mono text-slate-400">
                    <div className="col-span-6">Other Candidates Combined</div>
                    <div className="col-span-3 text-right">41</div>
                    <div className="col-span-3 text-right text-slate-500">10.1%</div>
                  </div>
                </div>

                {/* Mathematical Reconcile Check */}
                <div className="p-3 rounded-lg bg-black/50 border border-emerald-500/30 text-xs font-mono flex items-center justify-between">
                  <span className="text-slate-300">
                    Mathematical Balance: Valid (407) + Rejected (5) = Total Ballots (412)
                  </span>
                  <span className="text-emerald-400 font-bold">VARIANCE: 0 [NO STUFFING]</span>
                </div>
              </div>
            )}

            {/* TAB 2: BIOMETRIC VOTER VERIFICATION */}
            {view === "bvr" && (
              <div className="space-y-4">
                <div className="text-center py-2">
                  <div className="text-xs font-mono uppercase text-slate-400">Biometric Voter Verification (BVR)</div>
                  <h4 className="text-sm font-bold text-white mt-1">Optical Fingerprint & Facial Recognition Check</h4>
                </div>

                {/* Scanner Simulation */}
                <div className="max-w-md mx-auto p-4 rounded-2xl bg-[#141922] border-2 border-dashed border-slate-700 text-center">
                  <div className="relative w-24 h-28 mx-auto rounded-xl bg-black border-2 border-emerald-500/50 flex items-center justify-center overflow-hidden">
                    {/* Fingerprint ridges illustration */}
                    <div className="text-4xl opacity-70 select-none">👆</div>
                    {scanning && (
                      <div className="absolute inset-x-0 h-1 bg-emerald-400 shadow-[0_0_12px_#34d399] animate-bounce" />
                    )}
                  </div>

                  <div className="mt-4">
                    {!scanned ? (
                      <button
                        type="button"
                        disabled={scanning}
                        onClick={handleScanFingerprint}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs transition-colors shadow-md"
                      >
                        {scanning ? "Scanning Optical Sensor..." : "Place Voter Finger on Sensor"}
                      </button>
                    ) : (
                      <div className="space-y-2">
                        <div className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-500/50 text-left font-mono text-xs">
                          <div className="flex items-center justify-between text-emerald-400 font-bold mb-1">
                            <span>VOTER FOUND IN REGISTER</span>
                            <span>MATCH: 99.4%</span> {/* verify-figures-ignore: biometric score */}
                          </div>
                          <div>Name: KALOKI, MUENI JACINTA</div>
                          <div>ID No: 24891028 • Polling Stream: 02</div> {/* verify-figures-ignore: specimen voter id */}
                          <div className="text-emerald-300 mt-1">Status: VERIFIED & BALLOT ISSUED (1/1)</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setScanned(false)}
                          className="text-xs text-slate-400 hover:text-white underline font-mono"
                        >
                          Reset & Verify Next Voter
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: 200,000 VOTE TARGET VELOCITY */}
            {view === "threshold" && (
              <div className="space-y-4 font-mono text-xs">
                <div className="border-b border-white/10 pb-2">
                  <div className="font-bold text-amber-400">
                    COUNTYWIDE 200,000 VOTE GUBERNATORIAL THRESHOLD VELOCITY
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Target calculation across 532,758 registered Kitui voters (62% turnout baseline = ~330,310 ballots cast)
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="p-3 rounded-xl bg-[#141922] border border-white/5 space-y-2">
                  <div className="flex justify-between font-bold">
                    <span className="text-slate-300">Victory Target Threshold:</span>
                    <span className="text-emerald-400">200,000 / 200,000 Target (100.0%)</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full" style={{ width: "100%" }} />
                  </div>
                  <div className="text-[10px] text-slate-400 text-right">
                    Required Share: 60.5% of ballots cast (37.5% of total register)
                  </div>
                </div>

                {/* 8 Constituencies Contribution Matrix */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                  {CONSTITUENCIES_BY_SIZE.map((k) => ({
                    name: k.name,
                    share: k.voters.toLocaleString("en-US"),
                    pct: `${((k.voters / COUNTY_TOTAL_WARDS) * 100).toFixed(1)}%`,
                  })).map((c) => (
                    <div key={c.name} className="p-2 rounded-lg bg-[#181d26] border border-white/5">
                      <span className="text-slate-400 block text-[10px] truncate">{c.name}</span>
                      <span className="font-bold text-white text-xs">{c.share} reg</span>
                      <span className="text-emerald-400 text-[10px] block font-mono">({c.pct} of county)</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Physical Optical Biometric Reader Strip on bottom */}
            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-[8px] font-bold text-emerald-400">
                  ✓
                </span>
                <span>Encrypted IEBC SHA-256 Cloud Push Ready</span>
              </div>
              <span>Certified Agent: #AG-KT-TOWNSHIP-02</span>
            </div>
          </div>
        </div>
      </TiltStage>
    </div>
  );
}
