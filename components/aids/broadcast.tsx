"use client";

import { useState } from "react";
import { Play, Pause, Radio } from "lucide-react";

/**
 * Broadcast surfaces — the Kikamba radio aircover dial and the audio-spot mockup.
 *
 * Split out of the 560-line components/StrategicAids.tsx, which held thirteen unrelated
 * components in one module — the one file in this repo that broke the one-component-per-file
 * convention every other directory follows.
 */

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
