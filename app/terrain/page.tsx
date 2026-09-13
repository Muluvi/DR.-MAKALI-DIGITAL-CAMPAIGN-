import fs from "fs/promises";
import path from "path";

import type { Metadata } from "next";

import "../acts.css";

import { ActGate } from "@/components/act/ActGate";
import { ActProse } from "@/components/act/ActProse";
import { ActShell, type ChapterMark } from "@/components/act/ActShell";
import { BleedPortrait } from "@/components/act/BleedPortrait";
import { Chapter } from "@/components/act/Chapter";
import { EvidenceFooter, type Citation } from "@/components/act/EvidenceFooter";
import { EvidenceMount } from "@/components/act/EvidenceMount";
import { PinnedStage } from "@/components/act/PinnedStage";
import { Scene } from "@/components/act/Scene";
import { StatBand } from "@/components/act/StatBand";

import { AudienceSegmentationMatrix } from "@/components/markdown/AudienceSegmentationMatrix";
import { CompetitorFieldPanel } from "@/components/markdown/CompetitorFieldPanel";
import { FiscalAuditChartBlock } from "@/components/markdown/FiscalAuditChartBlock";
import { GeographicZoneMatrix } from "@/components/markdown/GeographicZoneMatrix";
import { RecognitionDeficitOverlay } from "@/components/markdown/RecognitionDeficitOverlay";
import { StagedCartogram, StagedPaths } from "@/components/act/StagedEvidence";
import { RegisterTickerBand } from "@/components/act/RegisterTickerBand";
import { OfflineWaterline } from "@/components/charts/OfflineWaterline";

import { CeilingBar } from "@/components/act/figures/CeilingBar";
import { ChannelReach } from "@/components/act/figures/ChannelReach";
import { CredentialGrid } from "@/components/act/figures/CredentialGrid";
import { ForkDiagram } from "@/components/act/figures/ForkDiagram";
import { PathRace } from "@/components/act/figures/PathRace";
import { PollGap } from "@/components/act/figures/PollGap";
import { ThresholdFunnel } from "@/components/act/figures/ThresholdFunnel";

/**
 * ACT ONE — THE TERRAIN.
 *
 * The first act of the rebuild, and the vertical slice the rest is judged against. It carries
 * the material the document split across its situation analysis and its audience segmentation:
 * how the ticket gets decided, who the candidate is, who he is running against, the arithmetic
 * of the seat, the recognition problem, the three regions, the digital ceiling, the six
 * electorates, and what the campaign does not know.
 *
 * What changed, and why it is a separate route rather than an edit to the existing ones:
 *
 *   - No section numbers. The document numbered every heading (3.1, 3.4.5) and built its
 *     navigation from those numbers, which is what made it read as a filed report no matter how
 *     it was styled. Headings here are titles.
 *   - No prose cross-references. "As set out in Section 8.10" is gone everywhere; where the
 *     original leaned on a pointer, the act either states the thing or drops it.
 *   - No self-referential framing. Nothing in this act describes the document containing it.
 *   - The provenance layer survives, moved. Inline "(Tier 1)" markers are out of the sentences
 *     and into one evidence footer per scene.
 *   - The ASCII tables are gone. Forty wards were listed twice in ASCII boxes and again in a
 *     markdown table; the cartogram and the paths chart already hold that data and can be
 *     interrogated, which the boxes could not.
 *
 * The seventeen sections not yet rebuilt still render through the document pipeline at their own
 * routes, untouched, so the two surfaces can be compared side by side while the remaining acts
 * are built.
 */

export const metadata: Metadata = {
  title: "The Terrain — Kitui 2027",
  description:
    "Act one: the ground the campaign enters. The nomination mechanism, the candidate, the field, the arithmetic of 200,000 votes, and the ceiling on digital reach.",
  robots: { index: false, follow: false },
};

const SCENES = [
  "01-contest",
  "02-candidate",
  "03-field",
  "04-arithmetic",
  "05-paths",
  "06-recognition",
  "07-regions",
  "08-ceiling",
  "09-segments",
  "10-standard",
] as const;

type SceneId = (typeof SCENES)[number];

async function readScenes(): Promise<Record<SceneId, string>> {
  const dir = path.join(process.cwd(), "public", "content", "acts", "terrain");
  const entries = await Promise.all(
    SCENES.map(async (id) => {
      const raw = await fs.readFile(path.join(dir, `${id}.md`), "utf-8");
      return [id, raw] as const;
    }),
  );
  return Object.fromEntries(entries) as Record<SceneId, string>;
}

const CHAPTERS: ChapterMark[] = [
  { id: "contest", label: "The contest" },
  { id: "candidate", label: "The candidate" },
  { id: "field", label: "The field" },
  { id: "arithmetic", label: "The number" },
  { id: "paths", label: "Four routes" },
  { id: "recognition", label: "The deficit" },
  { id: "regions", label: "Three regions" },
  { id: "ceiling", label: "The ceiling" },
  { id: "segments", label: "Six electorates" },
  { id: "standard", label: "What we know" },
];

const CITE: Record<string, Citation[]> = {
  contest: [
    { source: "Mizani Africa", detail: "Countywide preference survey, 7 August 2026 — Kasalu 37.4%, Mulu 22.1%, ±2.53%", tier: 2 },
    { source: "IEBC", detail: "2022 certified register — Kitui Central, 77,764 registered voters", tier: 1 },
    { source: "Campaign field report", detail: "Nomination by countywide opinion poll — single-sourced, not confirmed by Wiper officials", tier: 3 },
  ],
  candidate: [
    { source: "Parliamentary and institutional records", detail: "Budget and Appropriations Committee; Evaluation Society of Kenya; Ministry of Finance M&E Champion; UN advisory roles; CBS", tier: 1 },
    { source: "NG-CDF Kitui Central", detail: "KSh 47m in bursaries to 12,573 constituents; best-evaluated constituency, Eastern region, FY2014/15", tier: 1 },
  ],
  field: [
    { source: "IEBC", detail: "2022 certified results — Malombe 198,004; Musila 114,606; Mueke 10,639; Kasalu (Woman Rep) 201,899", tier: 1 },
    { source: "Court of Appeal", detail: "Malombe v Ngilu [2018] KECA 460 — 2017 result confirmed, Ngilu 169,990", tier: 1 },
    { source: "Mizani Africa", detail: "June and August 2026 waves — Wambua 16.3% to 14.3%", tier: 2 },
    { source: "Regional media", detail: "Prospective candidacies and campaign structures for Malonza, Mulila and Kauta", tier: 2 },
  ],
  arithmetic: [
    { source: "IEBC", detail: "2022 certified register — 532,758 ward voters across 40 wards and 8 constituencies; 1,578 polling stations; 75 prison voters", tier: 1 },
    { source: "IEBC", detail: "2022 gubernatorial result — 198,004 winning total; countywide turnout baseline ~62%", tier: 1 },
  ],
  paths: [
    { source: "IEBC", detail: "Constituency and ward totals, 2022 certified register — all four path calculations derive from these figures alone", tier: 1 },
  ],
  recognition: [
    { source: "IEBC", detail: "Ward-level register, 2022 — deficit pool of 275,570 voters is Mwingi (200,198) plus Kitui South (75,372)", tier: 1 },
    { source: "Mizani Africa", detail: "Recognition weakness outside Kitui Central inferred from countywide preference waves; no ward-level cross-tabulation exists", tier: 2 },
  ],
  regions: [
    { source: "KNBS", detail: "2019 Census — sub-county population, households and density; 1,136,187 county population; 30,430 km²", tier: 1 },
  ],
  ceiling: [
    { source: "KNBS", detail: "2019 Census — 143,340 internet users of 1,053,991 aged 3+ (13.6%); 452,948 mobile device owners (42.9%)", tier: 1 },
    { source: "Communications Authority", detail: "Q3 FY2025/26 — national penetration; 602,470 registered mobile-money agents, March 2026", tier: 1 },
    { source: "GeoPoll / KARF", detail: "Kikamba radio listenership at 78–80% in rural Kitui", tier: 2 },
    { source: "Published ownership reporting", detail: "Station ownership and political association — reported, not certified; re-verified before any placement", tier: 2 },
  ],
  segments: [
    { source: "KNBS", detail: "2019 Census — 95.2% rural / 4.8% urban; age distribution behind the ~44% youth share", tier: 1 },
    { source: "Derived from IEBC register", detail: "Rural (~507,000) and urban (~26,000) voter counts apply census shares to the register — estimates, not measured splits", tier: 2 },
  ],
  standard: [
    { source: "Auditor-General", detail: "FY2023/24 — KSh 670m unconfirmed balances; KSh 1.09bn uncollected rates; KSh 621.5m IFMIS variance; KSh 356.2m transfer variance", tier: 1 },
    { source: "Controller of Budget", detail: "County Budget Implementation Review — ~KSh 1.3bn pending bills; FY2025/26 Q1 development absorption 18%", tier: 1 },
    { source: "Kitui County Fiscal Strategy Paper", detail: "Approved FY2026/27 envelope — KSh 13.79bn total; KSh 11.64bn equitable share; KSh 1.339bn own-source target", tier: 1 },
    { source: "NDMA", detail: "January 2026 bulletin — Alert phase; IPC Phase 2 (Stressed), September 2025", tier: 1 },
    { source: "Independent media", detail: "Alleged Q1 development absorption of 5%, against the Controller of Budget's 18%", tier: 2 },
  ],
};

export default async function TerrainAct() {
  const scenes = await readScenes();

  return (
    <ActShell chapters={CHAPTERS}>
      <ActGate
        eyebrow="Act one of five · Kitui County"
        title="The terrain"
        standfirst="Before a single message is written, the ground decides what is possible. Kitui is 532,758 registered voters spread across 30,430 square kilometres, four fifths of them beyond the reach of anything with a screen — and the seat is won at roughly two hundred thousand votes."
        figure={200000}
        figureLabel="votes to win Kitui"
        figureSuffix=""
      />

      <Chapter id="contest">
        <Scene>
          <ActProse markdown={scenes["01-contest"]} />
        </Scene>

        <EvidenceMount minHeight={420}>
          <PollGap />
        </EvidenceMount>

        <EvidenceMount minHeight={520}>
          <ForkDiagram
            question="How the ticket gets decided"
            stem="Wiper has not confirmed the mechanism. The campaign runs against both."
            branches={[
              {
                tag: "Reported — single source",
                title: "A countywide opinion poll",
                reading:
                  "The assumption the whole nomination-phase strategy is built on: the ticket is settled on measured preference rather than a delegate vote.",
                consequences: [
                  "Recognition becomes the binding constraint, not organisation",
                  "The pollster's terms of reference are the document to obtain",
                  "Weighting to the IEBC sub-county distribution is worth fighting for",
                ],
                tone: "open",
              },
              {
                tag: "Contingency",
                title: "A delegate primary",
                reading:
                  "If the party reverts to delegates, the phasing changes and a whip operation replaces broad outreach.",
                consequences: [
                  "Map and profile the estimated 1,200–1,500 delegates",
                  "Reassign 400 ward captains to peer-to-peer lobbying",
                  "Stand up an encrypted SMS and USSD channel to delegates",
                ],
                tone: "contested",
              },
            ]}
            footnote="Moving this from assumption to operating fact needs a signed Wiper NEC resolution, or the commissioned pollster's terms of reference — the second is the one the campaign can actually obtain."
          />
        </EvidenceMount>

        <EvidenceFooter citations={CITE.contest} />
      </Chapter>

      <Chapter id="candidate">
        <BleedPortrait
          file="04-gesture-explaining"
          width={1055}
          height={1600}
          alt="Hon. Dr. Benson Makali Mulu mid-gesture, explaining a point."
          kicker="The candidate"
          quote="One of Kenya's most consistent and authoritative voices on macroeconomic governance, fiscal discipline and budget oversight."
          attribution="Hon. Dr. Benson Makali Mulu, PhD (Economics), CBS"
        />
        <Scene>
          <ActProse markdown={scenes["02-candidate"]} />
        </Scene>
        <EvidenceMount minHeight={560}>
          <CredentialGrid />
        </EvidenceMount>
        <EvidenceFooter citations={CITE.candidate} />
      </Chapter>

      <Chapter id="field">
        <Scene>
          <ActProse markdown={scenes["03-field"]} />
        </Scene>
        <EvidenceMount minHeight={520} className="pb-14 md:pb-20">
          <CompetitorFieldPanel />
        </EvidenceMount>

        <EvidenceMount minHeight={520}>
          <ForkDiagram
            question="The incumbent's eligibility"
            stem="Governor Malombe served 2013–2017, lost in 2017, and won again in 2022. Whether he may contest in 2027 turns on Article 180(7)."
            branches={[
              {
                tag: "Branch A — interrupted terms count",
                title: "He is barred, and the seat opens",
                reading:
                  "A two-term lifetime limit regardless of interruption. Having served 2013–2017 and 2022–2027, he cannot run again.",
                consequences: [
                  "An open-seat contest, with no incumbency advantage to overcome",
                  "Intense factional realignment inside Wiper",
                  "Conditions that favour a technocratic successor candidacy",
                ],
                tone: "open",
              },
              {
                tag: "Branch B — only contiguous service counts",
                title: "He is eligible, and defends",
                reading:
                  "The limit applies to consecutive terms, or an interrupted term resets the clock. He remains eligible for 2027.",
                consequences: [
                  "A direct anti-incumbency campaign is required",
                  "Against county development resources and public funding distribution",
                  "Against established grassroots patronage",
                ],
                tone: "contested",
              },
            ]}
            footnote="The campaign takes no position on which reading is correct, and plans against both. The difference changes the message, not merely the target."
          />
        </EvidenceMount>

        <EvidenceFooter citations={CITE.field} />
      </Chapter>

      <Chapter id="arithmetic">
        <Scene>
          <ActProse markdown={scenes["04-arithmetic"]} />
        </Scene>

        <EvidenceMount minHeight={460}>
          <ThresholdFunnel />
        </EvidenceMount>

        <StatBand
          stats={[
            { value: 532758, label: "Registered voters", note: "Across 40 wards and 8 constituencies, 2022 certified register." },
            { value: 330310, label: "Ballots expected", note: "At the county's 62% turnout baseline." },
            { value: 60.5, suffix: "%", decimals: 1, label: "Share needed to win", note: "Of every valid ballot cast — three votes in five." },
            { value: 200198, label: "Voters in Mwingi", note: "More registered voters than the entire 2022 winning total." },
          ]}
        />

        <PinnedStage
          kicker="The register, ward by ward"
          beats={[
            {
              lead: "Forty wards, and the register is nothing like evenly spread.",
              body: "A flat distribution would put 13,319 voters in each. The real thing clusters hard — Kyuso at 19,921 and Township at 19,538 against Tharaka at 7,429.",
            },
            {
              lead: "Twelve wards hold 201,267 voters — a register the size of the winning threshold.",
              body: "Thirty per cent of the wards, 37.78% of the electorate. The campaign does not have to contest all forty at equal intensity.",
            },
            {
              lead: "The three Mwingi sub-counties hold 200,198 between them.",
              body: "More registered voters than Malombe's winning total. At 62% turnout that is roughly 124,100 ballots — necessary, and about 74,000 votes short of sufficient.",
            },
          ]}
        >
          <EvidenceMount minHeight={520}>
            <StagedCartogram />
          </EvidenceMount>
        </PinnedStage>

        <EvidenceFooter citations={CITE.arithmetic} />
      </Chapter>

      <RegisterTickerBand />

      <Chapter id="paths">
        <Scene>
          <ActProse markdown={scenes["05-paths"]} />
        </Scene>

        <EvidenceMount minHeight={520}>
          <PathRace />
        </EvidenceMount>

        <PinnedStage
          kicker="Four routes to two hundred thousand"
          beats={[
            {
              lead: "Three combinations clear the threshold on the register.",
              body: "The Mwingi triad at 200,198, the central-south-west axis at 212,183, and the twelve megawards at 201,267.",
            },
            {
              lead: "The home belt cannot get there — 191,811, and 8,189 short before a vote is cast.",
              body: "At 62% turnout it produces 118,923 ballots. Eighty per cent of all of them still finishes more than 100,000 votes behind.",
            },
            {
              lead: "Expansion into Mwingi and Kitui South is arithmetic, not ambition.",
              body: "Four constituencies — Kitui Central, Kitui South, Mwingi Central, Mwingi North — hold 296,196 voters, 55.60% of the county, across 22 wards.",
            },
          ]}
        >
          <EvidenceMount minHeight={520}>
            <StagedPaths />
          </EvidenceMount>
        </PinnedStage>

        <EvidenceFooter citations={CITE.paths} />
      </Chapter>

      <Chapter id="recognition">
        <Scene>
          <ActProse markdown={scenes["06-recognition"]} />
        </Scene>

        <EvidenceMount minHeight={560} className="pb-14 md:pb-20">
          <RecognitionDeficitOverlay />
        </EvidenceMount>

        <EvidenceFooter citations={CITE.recognition} />
      </Chapter>

      <Chapter id="regions">
        <Scene>
          <ActProse markdown={scenes["07-regions"]} />
        </Scene>
        <EvidenceMount minHeight={480} className="pb-14 md:pb-20">
          <GeographicZoneMatrix />
        </EvidenceMount>
        <EvidenceFooter citations={CITE.regions} />
      </Chapter>

      <Chapter id="ceiling">
        <Scene>
          <ActProse markdown={scenes["08-ceiling"]} />
        </Scene>
        <EvidenceMount minHeight={420}>
          <CeilingBar />
        </EvidenceMount>

        <PinnedStage
          kicker="The digital ceiling"
          beats={[
            {
              lead: "13.6% of Kitui uses the internet. The other 86.4% do not.",
              body: "143,340 active users out of a base of 1,053,991 aged three and above. This is the constraint every channel decision answers to.",
            },
            {
              lead: "Every connected voter in the county is about 72,000 people.",
              body: "Against a threshold of 198,004. A campaign that converted 100% of them — which no campaign has ever done — would reach roughly 36% of what winning takes.",
            },
            {
              lead: "So 82% of communications effort goes offline.",
              body: "Radio at 37%, SMS and USSD at 20%, caravans at 18%, church at 7%. From a digital consultancy, that recommendation is the point.",
            },
          ]}
        >
          <EvidenceMount minHeight={480}>
            <OfflineWaterline />
          </EvidenceMount>
        </PinnedStage>
        <EvidenceMount minHeight={620}>
          <ChannelReach />
        </EvidenceMount>

        <EvidenceFooter citations={CITE.ceiling} />
      </Chapter>

      <Chapter id="segments">
        <Scene>
          <ActProse markdown={scenes["09-segments"]} />
        </Scene>
        <EvidenceMount minHeight={560} className="pb-14 md:pb-20">
          <AudienceSegmentationMatrix />
        </EvidenceMount>
        <EvidenceFooter citations={CITE.segments} />
      </Chapter>

      <Chapter id="standard">
        <Scene>
          <ActProse markdown={scenes["10-standard"]} />
        </Scene>
        <EvidenceMount minHeight={480} className="pb-14 md:pb-20">
          <FiscalAuditChartBlock />
        </EvidenceMount>
        <EvidenceFooter citations={CITE.standard} />
      </Chapter>

      <footer
        className="mt-24 py-20 text-center px-[var(--act-gutter)]"
        style={{ background: "var(--act-void)", borderTop: "1px solid var(--act-hair)" }}
      >
        <p className="act-kicker">End of act one</p>
        <p
          className="act-gradient-text mt-5 mx-auto max-w-xl font-serif leading-relaxed"
          style={{ fontSize: "clamp(1.0625rem, 1rem + 0.4vw, 1.25rem)" }}
        >
          The terrain sets the constraint. What follows is the argument built on it, the work
          proposed against it, and the terms it runs under.
        </p>
        <p className="mt-8 font-sans text-[0.6875rem] uppercase tracking-[0.16em] font-bold" style={{ color: "var(--act-dim)" }}>
          Firefly Management · Confidential
        </p>
      </footer>
    </ActShell>
  );
}
