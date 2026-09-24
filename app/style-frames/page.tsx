import type { Metadata } from "next";
import { Bricolage_Grotesque, Mona_Sans } from "next/font/google";

import { FramesShell } from "@/components/premium/FramesShell";
import { CoverHero } from "@/components/premium/CoverHero";
import { ActOpener } from "@/components/premium/ActOpener";
import { FigureV2 } from "@/components/premium/FigureV2";
import { FunnelV2 } from "@/components/premium/FunnelV2";
import { StationTable } from "@/components/premium/StationTable";
import { TypePair } from "@/components/premium/TypePair";
import { Dock, Spine } from "@/components/premium/Chrome";
import { FLOW_ACTS } from "@/lib/flow";
import { FIG_3_1 } from "@/lib/register/specs/s3-analysis";

import "./frames.css";

/**
 * Phase 0 style frames (docs/visual-premium/PHASE-0.md §6). Review only: this route is not in the
 * flow, not in the index and not linked from the document. It shows the proposed language on six
 * real pieces of the proposal, in both themes, with both display candidates, so the direction can
 * be approved or redirected before anything in the live document changes.
 */
export const metadata: Metadata = {
  title: "Style frames — Kitui 2027",
  robots: { index: false, follow: false },
};

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  axes: ["opsz", "wdth"],
  variable: "--font-bricolage",
  display: "swap",
});

const mona = Mona_Sans({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-mona",
  display: "swap",
});

const FRAMES = [
  { id: "frame-cover", label: "Cover", numeral: "" },
  { id: "frame-act", label: "Act III · The Analysis", numeral: "III" },
  { id: "frame-figure", label: "§3.1 The number it takes", numeral: "III" },
  { id: "frame-table", label: "§2.7 Who owns the airwaves", numeral: "II" },
  { id: "frame-type", label: "Typefaces", numeral: "" },
  { id: "frame-chrome", label: "Dock and spine", numeral: "" },
];

export default function StyleFramesPage() {
  const funnel = FIG_3_1.chart;
  return (
    <div className={`${bricolage.variable} ${mona.variable}`}>
      <FramesShell>
        <main className="pf-main">
          <div id="frame-cover" className="pf-frame">
            <CoverHero />
          </div>

          <div id="frame-act" className="pf-frame">
            <ActOpener act={FLOW_ACTS[2]} index={2} total={FLOW_ACTS.length} portrait="gesture-explaining" id="pf-act-3" />
          </div>

          <section id="frame-figure" className="pf-frame pf-canvas" aria-label="Chart kit v2: the lead figure of Section 3.1">
            <p className="pf-frame__tag">Frame 3 · Chart kit v2, hero treatment</p>
            <div className="pf-wide">
              {funnel.type === "funnel" && <FigureV2 spec={FIG_3_1} variant="hero" chart={<FunnelV2 chart={funnel} id="pf-f31" />} />}
            </div>
          </section>

          <section id="frame-table" className="pf-frame pf-canvas" aria-label="The table system, on the Section 2.7 station table">
            <p className="pf-frame__tag">Frame 4 · Tables (G-6), the §2.7 station table</p>
            <div className="pf-prose">
              <h2 className="pf-h2">
                <span className="pf-h2__num">2.7</span> Who owns the airwaves
              </h2>
            </div>
            <div className="pf-wide">
              <StationTable />
            </div>
          </section>

          <section id="frame-type" className="pf-frame pf-canvas" aria-label="Display typeface candidates">
            <p className="pf-frame__tag">Frame 5 · Display typeface: Bricolage Grotesque against Mona Sans</p>
            <div className="pf-wide">
              <TypePair />
            </div>
          </section>

          <section id="frame-chrome" className="pf-frame pf-canvas" aria-label="The dock and the progress spine">
            <p className="pf-frame__tag">Frame 6 · Dock and progress spine (G-7)</p>
            <div className="pf-prose">
              <p className="pf-body">
                The dock sits at the foot of this page and the spine on its right edge (desktop). The page reserves the
                dock&rsquo;s height plus the safe-area inset, so the last line of every frame clears it. Scroll down and it
                steps away; scroll up and it returns. The spine&rsquo;s seven segments are each as long as their act is on
                the page, and fill with the weave as the reader moves through them.
              </p>
            </div>
          </section>
        </main>
        <Spine />
        <Dock sections={FRAMES} />
      </FramesShell>
    </div>
  );
}
