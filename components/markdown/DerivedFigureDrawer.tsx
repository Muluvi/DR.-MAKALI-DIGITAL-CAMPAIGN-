"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Calculator } from "lucide-react";

// Arithmetic behind the two derived figures the proposal leans on hardest, built only from
// numbers already stated elsewhere in the document (cited by section) — never a new estimate.
const WORKINGS: Record<string, { title: string; inputs: string[]; result: string }> = {
  "win-threshold": {
    title: "How the ~200,000-vote threshold is derived",
    inputs: [
      "2022 winning total, Kitui Governor (Malombe, Wiper) — Section 2.3: 198,004 votes",
      "Registered voters, Kitui County, 2022 — Section 2.3: 532,758",
      "Approximate 2022 turnout — Section 2.3: ~62%",
    ],
    result: "198,004 actual winning votes, rounded up to an approximate working target of 200,000 for KPI-setting.",
  },
  deficit: {
    title: "How the 15.3-point deficit is derived",
    inputs: [
      "Mizani Africa, 7 August 2026 — Kasalu: 37.4%",
      "Mizani Africa, 7 August 2026 — Mulu: 22.1%",
    ],
    result: "37.4 − 22.1 = 15.3 points.",
  },
};

export function DerivedFigureDrawer({ id, children }: { id: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const working = WORKINGS[id];
  if (!working) return <>{children}</>;

  return (
    <span className="inline">
      {children}{" "}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="working-toggle inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md border border-accent/30 bg-accent/5 text-accent text-[9px] font-black uppercase tracking-wider align-middle cursor-pointer hover:bg-accent/10 transition-colors print:hidden"
      >
        <Calculator size={9} className="shrink-0" />
        Show the working
        {open ? <ChevronUp size={9} /> : <ChevronDown size={9} />}
      </button>
      {open && (
        <span className="block mt-2 mb-1 p-3 sm:p-4 bg-paper border border-line/60 rounded-xl not-italic font-normal print-avoid-break">
          <span className="block text-[10px] font-black uppercase tracking-wider text-ink mb-2">{working.title}</span>
          <span className="block space-y-1.5 mb-2">
            {working.inputs.map((input, i) => (
              <span key={i} className="flex items-start gap-1.5 text-xs text-ink/80">
                <span className="text-accent mt-0.5 shrink-0">›</span>
                <span>{input}</span>
              </span>
            ))}
          </span>
          <span className="block pt-2 border-t border-line/40 text-xs font-bold text-ink">{working.result}</span>
        </span>
      )}
    </span>
  );
}
