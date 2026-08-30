import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Volume2 } from "lucide-react";

import { InteractiveTable } from "./markdown/InteractiveTable";
import { MarkdownParagraph, MarkdownListItem } from "./markdown/MarkdownTextComponents";
import { AudioBriefingButton } from "./markdown/AudioBriefingButton";
import { SectionHeading } from "./markdown/SectionHeading";
import { ClaimBadge } from "./markdown/ClaimBadge";
import { HighlightedText } from "./markdown/HighlightedText";
import { CompetitiveQuadrantBlock } from "./markdown/CompetitiveQuadrantBlock";
import { ResourceEnvelopeBlock } from "./markdown/ResourceEnvelopeBlock";
import { PlatformSizingBlock } from "./markdown/PlatformSizingBlock";
import { MizaniSlopeBlock } from "./markdown/MizaniSlopeBlock";
import { WardCartogramBlock } from "./markdown/WardCartogramBlock";
import { KpiPhaseBlock } from "./markdown/KpiPhaseBlock";
import { PullQuote } from "./markdown/PullQuote";
import { ClaimCards } from "./markdown/ClaimCards";
import { DisputedFigure } from "./markdown/DisputedFigure";
import { ElectoralHistoryPanel } from "./markdown/ElectoralHistoryPanel";
import { FiscalAuditPanel } from "./markdown/FiscalAuditPanel";
import { DroughtFoodSecurityPanel } from "./markdown/DroughtFoodSecurityPanel";
import { MuiBasinPanel } from "./markdown/MuiBasinPanel";
import { CompetitorFieldPanel } from "./markdown/CompetitorFieldPanel";
import { NominationPathPanel } from "./markdown/NominationPathPanel";
import { ComplianceCeilingPanel } from "./markdown/ComplianceCeilingPanel";
import { MediaOwnershipBlock } from "./markdown/MediaOwnershipBlock";
import { DataGapsRegister } from "./markdown/DataGapsRegister";
import { PathTo200kBlock } from "./markdown/PathTo200kBlock";
import { ConstituencyWeightBlock } from "./markdown/ConstituencyWeightBlock";
import { ElectoralTimelineBlock } from "./markdown/ElectoralTimelineBlock";
import { FiscalAuditChartBlock } from "./markdown/FiscalAuditChartBlock";
import { ConstitutionalBranchNavigator } from "./markdown/ConstitutionalBranchNavigator";
import { PathTo200kCalculator } from "./markdown/PathTo200kCalculator";
import { RecognitionDeficitOverlay } from "./markdown/RecognitionDeficitOverlay";
import { AudienceSegmentationMatrix } from "./markdown/AudienceSegmentationMatrix";
import { PollingTrajectorySimulator } from "./markdown/PollingTrajectorySimulator";
import { StrategicPillarsMatrix } from "./markdown/StrategicPillarsMatrix";
import { GeographicZoneMatrix } from "./markdown/GeographicZoneMatrix";
import { PersuasionFramingMatrix } from "./markdown/PersuasionFramingMatrix";
import { PublicServiceDeliveryTracker } from "./markdown/PublicServiceDeliveryTracker";
import { MediaRadioLandscapeCard } from "./markdown/MediaRadioLandscapeCard";
import { BudgetScenarioModeler } from "./markdown/BudgetScenarioModeler";
import { CampaignOrgChart } from "./markdown/CampaignOrgChart";
import { CrisisWarRoomMatrix } from "./markdown/CrisisWarRoomMatrix";
import { DataSecurityEthicsCharter } from "./markdown/DataSecurityEthicsCharter";
import { DISPUTED_FIGURES } from "../data/disputed-figures";
import { headingSlug, sectionId, TAB_LABELS, type TabId } from "../lib/heading-slug";

const kituiCentralPopulationDispute = DISPUTED_FIGURES.find((d) => d.id === "kitui-central-2019-population")!;

// Section 1.3's "three governing realities" — matched by the start of each bolded lead
// sentence so the list item gets pull-quote emphasis without touching the wording.
const GOVERNING_REALITY_TRIGGERS = [
  "Roughly 86% of Kitui residents are outside the internet-using population",
  "The regulatory ground shifted on 7 August 2026",
  "Kamba-language radio",
];
import { PHASES } from "../lib/phases";

// Section 20's phase subsections ("Phase −1: Nomination Sprint …", "Phase 0: …") don't start
// with a digit, so they never pick up a heading id from headingSlug — but they should still get
// the matching phase colour on their left border instead of the generic gold accent.
const PHASE_HEADING_PATTERN = /^Phase\s+(−1|-1|0|1|2|3)\s*:/i;
function phaseAccentFor(headingText: string): string | undefined {
  const match = PHASE_HEADING_PATTERN.exec(headingText.trim());
  if (!match) return undefined;
  const id = match[1] === "−1" || match[1] === "-1" ? "neg1" : match[1];
  const phase = PHASES.find((p) => p.id === id);
  return phase ? `var(${phase.colorVar})` : undefined;
}

// Markdown hard-wraps around 80 columns, leaving a literal "\n" inside a text node wherever a
// phrase happens to wrap — collapse all whitespace runs before substring-matching against a
// trigger phrase, or matches silently fail whenever the wrap lands mid-phrase.
function normalizeWhitespace(text: string): string {
  return text.replace(/\s+/g, " ");
}

function getHeadingText(children: React.ReactNode): string {
  if (typeof children === "string") return children;
  if (Array.isArray(children)) return children.map(getHeadingText).join("");
  return "";
}

function flattenText(children: React.ReactNode): string {
  if (typeof children === "string") return children;
  if (Array.isArray(children)) return children.map(flattenText).join("");
  return "";
}

// Deep text extraction that also understands HighlightedText (props.text, not props.children) —
// needed to read table headers, since a bolded header cell (e.g. "**Mulu**") is now rendered
// through the strong -> HighlightedText path.
function getDeepText(node: React.ReactNode): string {
  if (node === null || node === undefined) return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(getDeepText).join("");
  if (typeof node === "object" && "props" in (node as object)) {
    const props = (node as { props?: { children?: React.ReactNode; text?: string } }).props;
    if (props?.children !== undefined) return getDeepText(props.children);
    if (props?.text !== undefined) return String(props.text);
  }
  return "";
}

function getTableHeaderTexts(children: React.ReactNode): string[] {
  const top = React.Children.toArray(children) as React.ReactElement[];
  const thead = top.find((c) => c?.type === "thead");
  if (!thead) return [];
  const theadChildren = React.Children.toArray((thead.props as { children?: React.ReactNode }).children) as React.ReactElement[];
  const headerRow = theadChildren.find((c) => c?.type === "tr");
  if (!headerRow) return [];
  const cells = React.Children.toArray((headerRow.props as { children?: React.ReactNode }).children) as React.ReactElement[];
  return cells.filter((c) => c?.type === "th").map((c) => getDeepText((c.props as { children?: React.ReactNode }).children).trim());
}

// The source markdown already marks every open item consistently — either an inline
// `[Insert …]` / `[Confirm …]` code span, or a `<span class="placeholder">OPEN/GATED</span>`
// in the appendix checklist. Both are unambiguous, so they get the "Awaiting campaign
// decision" badge mechanically rather than by guessing at status elsewhere.
const PLACEHOLDER_PATTERN = /^\[(insert|confirm)/i;

// Visualisations anchored to a specific heading rather than a table (Phase C, items 11/12/15/16).
// Keyed by the same "<tab>-sec-<slug>" id SectionHeading assigns, so this stays correct even if
// the heading text is edited later.
const HEADING_INSERTS: Record<string, React.ReactNode> = {
  "exec-sec-1-1": <PollingTrajectorySimulator />,
  "exec-sec-1a": <NominationPathPanel />,
  "exec-sec-2-2": <ConstitutionalBranchNavigator />,
  "exec-sec-2-3": (
    <>
      <WardCartogramBlock />
      <PathTo200kBlock />
      <ConstituencyWeightBlock />
    </>
  ),
  "exec-sec-2-4": <ResourceEnvelopeBlock />,
  "exec-sec-2-5": <DisputedFigure entry={kituiCentralPopulationDispute} />,
  "exec-sec-2-6": (
    <>
      <ElectoralHistoryPanel />
      <ElectoralTimelineBlock />
    </>
  ),
  "exec-sec-2-7": (
    <>
      <FiscalAuditPanel />
      <FiscalAuditChartBlock />
    </>
  ),
  "exec-sec-2-8": <DroughtFoodSecurityPanel />,
  "exec-sec-2-9": <MuiBasinPanel />,
  "exec-sec-2-10": <CompetitorFieldPanel />,
  "exec-sec-6-3": <PathTo200kCalculator />,
  "exec-sec-6-5": <RecognitionDeficitOverlay />,
  "exec-sec-7-0": <AudienceSegmentationMatrix />,
  "exec-sec-7": <AudienceSegmentationMatrix />,
  "strategy-sec-5": <StrategicPillarsMatrix />,
  "strategy-sec-6": <AudienceSegmentationMatrix />,
  "strategy-sec-7": <GeographicZoneMatrix />,
  "strategy-sec-10": <PersuasionFramingMatrix />,
  "strategy-sec-17a": <MediaRadioLandscapeCard />,
  "strategy-sec-17a-1": <MediaRadioLandscapeCard />,
  "strategy-sec-17a-7": <MediaOwnershipBlock />,
  "strategy-sec-19b": <PublicServiceDeliveryTracker />,
  "operations-sec-8a": <CampaignOrgChart />,
  "operations-sec-8b-5": <BudgetScenarioModeler />,
  "operations-sec-8b-6": <BudgetScenarioModeler />,
  "operations-sec-8b-7": <ComplianceCeilingPanel />,
  "operations-sec-13": <CrisisWarRoomMatrix />,
  "operations-sec-13-1": <CrisisWarRoomMatrix />,
  "operations-sec-13-4": <CrisisWarRoomMatrix />,
  "operations-sec-16": <DataSecurityEthicsCharter />,
  "operations-sec-16-1": <DataSecurityEthicsCharter />,
  "operations-sec-16-4": <DataSecurityEthicsCharter />,
  "execution-sec-20": <KpiPhaseBlock />,
};

// A handful of headings (the "Appendix A/B/C" style) carry no leading digit, so headingSlug
// never assigns them an id — matched on exact heading text instead, same mechanism as
// PLACEHOLDER_PATTERN and GOVERNING_REALITY_TRIGGERS above.
const HEADING_TEXT_INSERTS: Record<string, React.ReactNode> = {
  "Appendix C: Data Gaps Register": <DataGapsRegister />,
};

// Markdown parsing runs here on the server at render time, so react-markdown
// and its remark/rehype plugins never ship to the client bundle.
export function MarkdownViewer({ content, tabId }: { content: string; tabId: TabId }) {
  return (
    <div className="relative bg-card rounded-none sm:rounded-3xl border-0 shadow-none sm:shadow-sm overflow-hidden p-0 sm:p-8 pt-4 pb-6 sm:py-8">
      {/* Dynamic Faded Watermark Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0 opacity-10">
        <div className="absolute top-[20%] right-[-10%] text-[8rem] font-black text-accent/5 rotate-[-12deg] font-serif uppercase">
          Wiper Movement
        </div>
        <div className="absolute bottom-[20%] left-[-15%] text-[8rem] font-black text-gold/5 rotate-[8deg] font-serif uppercase">
          Democratic
        </div>
      </div>

      {/* Integrated Media Briefing Placard at the top of long strategic pages */}
      <div className="mx-4 sm:mx-0 mb-6 bg-gradient-to-r from-accent/[0.03] to-gold/[0.03] border border-line/25 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 z-10 relative print:hidden">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-accent/10 border border-accent/20 text-accent">
            <Volume2 size={18} />
          </div>
          <div>
            <h4 className="font-serif text-xs font-black text-ink">Campaign Audio Strategy Briefing</h4>
            <p className="text-[10px] text-muted uppercase tracking-wider font-bold">Listen to synthesized narrative breakdown (2:15 min)</p>
          </div>
        </div>
        <AudioBriefingButton />
      </div>

      <div className="prose max-w-none relative z-10 px-4 sm:px-0
        [&_p:first-of-type]:text-base [&_p:first-of-type]:sm:text-lg [&_p:first-of-type]:font-extrabold [&_p:first-of-type]:text-ink [&_p:first-of-type]:leading-relaxed [&_p:first-of-type]:border-b [&_p:first-of-type]:border-line/40 [&_p:first-of-type]:pb-4 [&_p:first-of-type]:mb-6
        [&_p:first-of-type::first-letter]:text-4xl [&_p:first-of-type::first-letter]:font-black [&_p:first-of-type::first-letter]:text-gold [&_p:first-of-type::first-letter]:mr-2 [&_p:first-of-type::first-letter]:float-left [&_p:first-of-type::first-letter]:leading-none
      ">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          components={{
            table: ({ children }) => {
              const headers = getTableHeaderTexts(children).map((h) => h.toLowerCase());
              const has = (text: string) => headers.some((h) => h.includes(text));

              // Section 2.5 "National platform sizing" — replaced by the sorted bar chart
              // (item 13), not kept alongside it.
              if (tabId === "exec" && has("platform") && has("kenya audience")) {
                return <PlatformSizingBlock />;
              }

              // Section 2.1 candidate-asset table — assertion/evidence/application becomes
              // claim cards (item 21), replacing the table rather than sitting alongside it.
              if (tabId === "exec" && has("asset") && has("evidence") && has("digital application")) {
                return <ClaimCards>{children}</ClaimCards>;
              }

              const table = <InteractiveTable>{children}</InteractiveTable>;

              // Section 1.1 Mizani survey table — table stays (item 14 says keep it with only
              // two data points), slope chart added alongside it.
              if (tabId === "exec" && has("kasalu") && has("wambua")) {
                return (
                  <>
                    {table}
                    <MizaniSlopeBlock />
                  </>
                );
              }

              // Section 2.2 competitive field table — quadrant plot added after it.
              if (tabId === "exec" && has("contender") && has("exploitable gap")) {
                return (
                  <>
                    {table}
                    <CompetitiveQuadrantBlock />
                  </>
                );
              }

              return table;
            },
            pre: ({ children }) => (
              <div className="my-6 rounded-2xl border border-line bg-paper/60 p-3 sm:p-4 overflow-hidden not-prose">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-line/40 text-[10px] font-mono font-bold text-muted uppercase tracking-wider">
                  <span>Architecture & Process Model</span>
                  <span className="hidden sm:inline">Diagram / Script</span>
                </div>
                <div className="overflow-x-auto max-w-full scrollbar-thin">
                  <pre className="text-[11px] sm:text-xs font-mono text-ink leading-snug m-0 p-0 whitespace-pre">
                    {children}
                  </pre>
                </div>
              </div>
            ),
            code: ({ children }) => {
              const text = flattenText(children);
              if (PLACEHOLDER_PATTERN.test(text.trim())) {
                return (
                  <span className="inline-flex items-center gap-1.5 flex-wrap align-middle my-0.5">
                    <ClaimBadge status="awaiting" compact />
                    <code className="placeholder">{text}</code>
                  </span>
                );
              }
              return <code>{text}</code>;
            },
            span: ({ className, children }) => {
              if (className === "placeholder") {
                return (
                  <span className="inline-flex items-center gap-1.5 flex-wrap align-middle">
                    <ClaimBadge status="awaiting" compact />
                    <span className="placeholder">{children}</span>
                  </span>
                );
              }
              return <span className={className}>{children}</span>;
            },
            p: ({ children, className }) => {
              // The appendix's "section-kicker" lines are eyebrow labels, not body prose —
              // render them as such instead of falling into the lead-paragraph drop-cap styling.
              if (className === "section-kicker") {
                return <p className="eyebrow-label not-prose">{children}</p>;
              }
              return <MarkdownParagraph tabId={tabId}>{children}</MarkdownParagraph>;
            },
            blockquote: ({ children }) => {
              // The central narrative line (Section 4) gets the full pull-quote treatment;
              // every other blockquote (the ethics charter, etc.) keeps the standard styling.
              if (getDeepText(children).includes("Kitui has resources")) {
                return <PullQuote>{children}</PullQuote>;
              }
              return (
                <blockquote className="border-l-4 border-accent bg-accent/[0.03] px-5 py-4 rounded-r-2xl my-6 text-xs sm:text-sm font-semibold text-ink leading-relaxed shadow-sm italic relative text-pretty">
                  {children}
                </blockquote>
              );
            },
            li: ({ children }) => {
              // The three governing realities (Section 1.3) get a pull-quote-style emphasis
              // treatment instead of a plain bullet — every other list item is unaffected.
              const text = normalizeWhitespace(getDeepText(children));
              const isGoverningReality = tabId === "exec" && GOVERNING_REALITY_TRIGGERS.some((t) => text.includes(t));
              if (isGoverningReality) {
                return <MarkdownListItem tabId={tabId} emphasis>{children}</MarkdownListItem>;
              }
              return <MarkdownListItem tabId={tabId}>{children}</MarkdownListItem>;
            },
            // Bold runs carry some of the document's most load-bearing figures (the derived
            // win threshold, the deficit) — route their text through the same highlighter so
            // cross-refs, claim badges and "show the working" triggers work inside bold too.
            strong: ({ children }) => (
              <strong>
                {React.Children.map(children, (child) =>
                  typeof child === "string" ? <HighlightedText text={child} tabId={tabId} /> : child
                )}
              </strong>
            ),
            h2: ({ children }) => {
              const text = getHeadingText(children);
              const slug = headingSlug(text);
              const id = slug ? sectionId(tabId, slug) : null;
              const insert = id ? HEADING_INSERTS[id] : HEADING_TEXT_INSERTS[text.trim()];
              return (
                <>
                  <SectionHeading id={id} level={2} eyebrow={TAB_LABELS[tabId]}>{children}</SectionHeading>
                  {insert}
                </>
              );
            },
            h3: ({ children }) => {
              const text = getHeadingText(children);
              const slug = headingSlug(text);
              const id = slug ? sectionId(tabId, slug) : null;
              return (
                <>
                  <SectionHeading id={id} level={3} accentColor={phaseAccentFor(text)}>{children}</SectionHeading>
                  {id && HEADING_INSERTS[id]}
                </>
              );
            }
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
}
