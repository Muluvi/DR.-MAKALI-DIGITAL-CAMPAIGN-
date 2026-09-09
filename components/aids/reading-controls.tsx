"use client";

import { FileText, BookOpen } from "lucide-react";

/**
 * Controls over how the document itself is read: focus mode, and the print/PDF path.
 *
 * Split out of the 560-line components/StrategicAids.tsx, which held thirteen unrelated
 * components in one module — the one file in this repo that broke the one-component-per-file
 * convention every other directory follows.
 */

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
