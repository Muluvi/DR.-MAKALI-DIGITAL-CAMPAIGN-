"use client";

import { useState } from "react";
import { Play, Pause } from "lucide-react";

export function AudioBriefingButton() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <button
      onClick={() => setIsPlaying(!isPlaying)}
      className="flex items-center gap-2 px-3 py-1.5 bg-accent hover:bg-accent/90 text-white rounded-lg text-xs font-bold shadow-sm self-start sm:self-auto cursor-pointer"
    >
      {isPlaying ? <Pause size={12} /> : <Play size={12} />}
      {isPlaying ? "Pause Briefing" : "Listen Now"}
    </button>
  );
}
