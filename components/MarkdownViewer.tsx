import React from "react";
import Image from "next/image";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

import { InteractiveTable } from "./markdown/InteractiveTable";
import { MarkdownParagraph, MarkdownListItem } from "./markdown/MarkdownTextComponents";
import { SectionHeading } from "./markdown/SectionHeading";
import { ClaimBadge } from "./markdown/ClaimBadge";
import { HighlightedText } from "./markdown/HighlightedText";
import { hasHighlight } from "../lib/highlight-patterns";
import { CompetitiveQuadrantBlock } from "./markdown/CompetitiveQuadrantBlock";
import { ResourceEnvelopeBlock } from "./markdown/ResourceEnvelopeBlock";
import { PlatformSizingBlock } from "./markdown/PlatformSizingBlock";
import { MizaniSlopeBlock } from "./markdown/MizaniSlopeBlock";
import { WardCartogramBlock } from "./markdown/WardCartogramBlock";
import { KpiArchitecture } from "./charts/KpiArchitecture";
import { BenchmarkLadder } from "./charts/BenchmarkLadder";
import { TierComparisonCarousel } from "./charts/TierComparisonCarousel";
import { FeaturePhoneSpecimen } from "./charts/FeaturePhoneSpecimen";
import { OfflineWaterline } from "./charts/OfflineWaterline";
import { VoteFunnel } from "./charts/VoteFunnel";
import { KpiScorecards } from "./charts/KpiScorecards";
import { GENERAL_ELECTION_KPIS, NOMINATION_KPIS } from "../data/kpis";
import { KpiPhaseBlock } from "./markdown/KpiPhaseBlock";
import { AsciiDiagram } from "./markdown/AsciiDiagram";
import { ReachSplit } from "./ReachSplit";
import {
  FlywheelSchematic,
  MessagingPlayground,
  CounterMessagingGrid,
  ToneVoiceSlider,
  SloganBuilder,
  SMSFeedbackVisualizer,
  CommunityScheduler,
  MediaPlaybackMockup,
  RadioAircoverDial,
} from "./StrategicAids";
import { PhaseRail } from "./PhaseRail";
import { PullQuote } from "./markdown/PullQuote";
import { ClaimCards } from "./markdown/ClaimCards";
import { DisputedFigure } from "./markdown/DisputedFigure";
import { ElectoralHistoryPanel } from "./markdown/ElectoralHistoryPanel";
import { FiscalAuditPanel } from "./markdown/FiscalAuditPanel";
import { DroughtFoodSecurityPanel } from "./markdown/DroughtFoodSecurityPanel";
import { MuiBasinPanel } from "./markdown/MuiBasinPanel";
import { CompetitorFieldPanel } from "./markdown/CompetitorFieldPanel";
import { NominationPathPanel } from "./markdown/NominationPathPanel";
import { EconomistGovernorThesis } from "./markdown/EconomistGovernorThesis";
import { DecisionPanel } from "./DecisionPanel";
import { CommitmentFields } from "./markdown/CommitmentFields";
import { ServiceLevelSelector } from "./markdown/ServiceLevelSelector";
import { PhoneShowcase } from "./phone/PhoneShowcase";
import { TerminalShowcase } from "./terminal/TerminalShowcase";
import { SectionPortrait } from "./markdown/SectionPortrait";
import { commitmentFieldKey, isCommitmentFieldList, type CommitmentField } from "../lib/commitment-fields";
import { MediaOwnershipBlock } from "./markdown/MediaOwnershipBlock";
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
import { DataSecurityEthicsCharter } from "./markdown/DataSecurityEthicsCharter";
import { DISPUTED_FIGURES } from "../data/disputed-figures";
import { headingSlug, sectionId, type TabId } from "../lib/heading-slug";
import { segmentContent } from "../lib/collapse-groups";
import { DisclosureGroup } from "./markdown/DisclosureGroup";
import { ObjectivesIndex } from "./markdown/ObjectivesIndex";
import { ProseFold } from "./markdown/ProseFold";

const kituiCentralPopulationDispute = DISPUTED_FIGURES.find((d) => d.id === "kitui-central-2019-population")!;

// §6.3's three operating conditions — matched by the start of each bolded lead
// sentence so the list item gets pull-quote emphasis without touching the wording.
const GOVERNING_REALITY_TRIGGERS = [
  "Roughly 86% of Kitui residents are outside the internet-using population",
  "The regulatory ground shifted on 7 August 2026",
  "Kamba-language radio",
];
import { PHASES } from "../lib/phases";

// §4.1's phase parts ("Phase −1: Nomination Sprint …", "Phase 0: …") don't start
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

/**
 * Read a list whose every item opens with a bolded field label ("**Named Owner:** …").
 *
 * The label is lifted out of the item's children and the REST is passed through untouched, so
 * cross-references, claim badges and figure highlighting inside a value keep working exactly as
 * they do in a bullet. Returns null the moment an item does not fit the shape, which leaves the
 * list rendering as an ordinary list.
 */
function parseLabelledList(children: React.ReactNode): CommitmentField[] | null {
  // Both `li` and `strong` are overridden in the components map below, so their rendered
  // elements are custom functions rather than the DOM strings — identity checks against "li"
  // or "strong" silently match nothing. Detect by shape instead: every item must open with a
  // short inline run ending in a colon, which is what a bolded field label looks like.
  const items = (React.Children.toArray(children) as React.ReactElement[]).filter((c) =>
    React.isValidElement(c)
  );
  if (items.length < 4) return null;

  const fields: CommitmentField[] = [];
  for (const li of items) {
    const parts = React.Children.toArray((li.props as { children?: React.ReactNode }).children);
    // A loose list wraps the item body in a <p>; unwrap one level before looking for the label.
    const body =
      parts.length === 1 && React.isValidElement(parts[0])
        ? React.Children.toArray((parts[0].props as { children?: React.ReactNode }).children)
        : parts;

    const first = body[0];
    if (!React.isValidElement(first)) return null;
    const raw = getDeepText(first).trim();
    if (!/:$/.test(raw) || raw.length > 40) return null;
    const label = raw.replace(/:$/, "").trim();
    if (!label) return null;
    fields.push({ key: commitmentFieldKey(label), label, value: body.slice(1) });
  }
  return fields;
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

// Visualisations anchored to a specific heading rather than a table, keyed by the same
// "<tab>-sec-<slug>" id SectionHeading assigns, so this stays correct even if the heading text is
// edited later.
//
// ONE COMPONENT, ONE HOME. Several components used to be keyed at two or three ids at once —
// defensively, because before the section index was generated nobody could be sure which heading
// actually existed. That guesswork rendered the same chart up to three times in a single
// section. Every key below now resolves to a heading that exists; a build-time check would be
// the next step if this map grows again.
const HEADING_INSERTS: Record<string, React.ReactNode> = {
  // ---- Cover, summary, situation and approach (§1-§7) ---------------------------------
  "summary-sec-2-2": <PollingTrajectorySimulator />,
  // The scorecards are the objectives. What they do not carry is the eight indicator sets that
  // stayed with the work they measure — indexed beneath them rather than moved here.
  "measurement-sec-11-1": <ObjectivesIndex />,
  "situation-sec-3-1": <NominationPathPanel />,
  // The governing claim opens §6, ahead of the pillars and themes that rest on it.
  "approach-sec-6-1": <EconomistGovernorThesis />,
  "situation-sec-3-3-2": (
    <>
      <ConstitutionalBranchNavigator />
      <CompetitiveQuadrantBlock />
    </>
  ),
  "situation-sec-3-3-1": (
    <SectionPortrait id="gesture-explaining" kicker="Candidate profile — §3.3.1">
      One of Kenya&rsquo;s most consistent and authoritative voices on macroeconomic governance,
      fiscal discipline, and budget oversight.
    </SectionPortrait>
  ),
  "situation-sec-3-3-3": (
    <>
      <WardCartogramBlock />
      <PathTo200kBlock />
      <ConstituencyWeightBlock />
    </>
  ),
  "situation-sec-3-3-4": <ResourceEnvelopeBlock />,
  "situation-sec-3-3-5": (
    <>
      <OfflineWaterline />
      <DisputedFigure entry={kituiCentralPopulationDispute} />
    </>
  ),
  "situation-sec-3-3-6": (
    <>
      <ElectoralHistoryPanel />
      <ElectoralTimelineBlock />
    </>
  ),
  "situation-sec-3-3-7": (
    <>
      <FiscalAuditPanel />
      <FiscalAuditChartBlock />
    </>
  ),
  "situation-sec-3-3-8": <DroughtFoodSecurityPanel />,
  "situation-sec-3-3-9": <MuiBasinPanel />,
  "situation-sec-3-3-10": <CompetitorFieldPanel />,
  "situation-sec-3-4-1": <VoteFunnel />,
  "situation-sec-3-4-3": <PathTo200kCalculator />,
  "situation-sec-3-4-5": <RecognitionDeficitOverlay />,
  "audiences-sec-5-1": <AudienceSegmentationMatrix />,
  // §7.3 splits the electorate into a connected minority and an offline majority. The showcase is
  // that argument as an object: one handset, the campaign on all seven channels, ending on the
  // USSD dialog that reaches more voters than the six apps together.
  "situation-sec-3-6": <PhoneShowcase />,
  "messaging-sec-7-1": (
    <>
      <MessagingPlayground />
      <ToneVoiceSlider />
    </>
  ),
  "scope-platforms-sec-8-3-4": <CommunityScheduler />,
  "risk-sec-13-1": <CounterMessagingGrid />,
  // The ownership/alignment/tier table this chart plots, now §8.5.1 in the situation analysis.
  "situation-sec-3-7-1": <MediaOwnershipBlock />,

  // ---- Scope, roadmap, measurement, governance and risk (§8-§16) ----------------------
  "governance-sec-12-1": (
    <SectionPortrait id="seated-grey-cropped" kicker="The engagement model — §12.1" flip>
      Firefly reports to a single named campaign-side counterpart.
    </SectionPortrait>
  ),
  "approach-sec-6-2": <StrategicPillarsMatrix />,
  "situation-sec-3-5": <GeographicZoneMatrix />,
  // The technology workstreams carried no anchored visualisation at all before this — the one
  // stretch of the document that was a wall of text, and the one describing the technology
  // stack, which is the part this reader is most likely to test against the artifact itself.
  "scope-data-sec-8-15-2": <BenchmarkLadder />,
  "deliverables-sec-10-1-1": <ServiceLevelSelector />,
  // The four-column matrix below this heading stacks into nine attribute cards on a phone, which
  // answers "what does row six say" rather than "which tier should we buy". One card per tier,
  // swipeable, with the table left in place underneath as the accessible equivalent.
  "deliverables-sec-10-1-2": <TierComparisonCarousel />,
  "scope-ground-sec-8-8": <TerminalShowcase />,
  "scope-ground-sec-8-9": <FlywheelSchematic />,
  "scope-ground-sec-8-10": (
    <>
      <FeaturePhoneSpecimen />
      <ReachSplit />
      <SMSFeedbackVisualizer />
    </>
  ),
  "messaging-sec-7-2": <PersuasionFramingMatrix />,
  "governance-sec-12-5": <DataSecurityEthicsCharter />,
  "scope-media-sec-8-6": <MediaPlaybackMockup />,
  "scope-media-sec-8-7": (
    <>
      <MediaRadioLandscapeCard />
      <RadioAircoverDial />
    </>
  ),
  "approach-sec-6-3": <SloganBuilder />,
  "scope-platforms-sec-8-2": <PublicServiceDeliveryTracker />,
  "roadmap-sec-9-1": (
    <>
      <PhaseRail />
      <KpiPhaseBlock />
    </>
  ),
};

// A handful of headings still carry no leading digit (unnumbered platform names, phase
// labels), so headingSlug never assigns them an id — matched on exact heading text instead,
// same mechanism as PLACEHOLDER_PATTERN and GOVERNING_REALITY_TRIGGERS above. Currently empty:
// nothing in the document needs this fallback after the 2026 restructure.
const HEADING_TEXT_INSERTS: Record<string, React.ReactNode> = {};

// Markdown parsing runs here on the server at render time, so react-markdown
// and its remark/rehype plugins never ship to the client bundle.
// Every ReactMarkdown pass shares one components map — the document body, and each
// disclosure panel split out of it — so a table, badge or cross-reference renders the
// same wherever it happens to sit.
function buildComponents(tabId: TabId): Components {
  return {
            table: ({ children }) => {
              const headers = getTableHeaderTexts(children).map((h) => h.toLowerCase());
              const has = (text: string) => headers.some((h) => h.includes(text));

              // §3.3.5 "National platform sizing" — replaced by the sorted bar chart
              // (item 13), not kept alongside it.
              if (tabId === "situation" && has("platform") && has("kenya audience")) {
                return <PlatformSizingBlock />;
              }

              // §3.3.1 candidate-asset table — assertion/evidence/application becomes
              // claim cards (item 21), replacing the table rather than sitting alongside it.
              if (tabId === "situation" && has("asset") && has("evidence") && has("digital application")) {
                return <ClaimCards>{children}</ClaimCards>;
              }

              const table = <InteractiveTable>{children}</InteractiveTable>;

              // §6.2 Mizani survey table — table stays (item 14 says keep it with only
              // two data points), slope chart added alongside it.
              if (tabId === "summary" && has("kasalu") && has("wambua")) {
                return (
                  <>
                    {table}
                    <MizaniSlopeBlock />
                  </>
                );
              }

              return table;
            },
            pre: ({ children }) => {
              const source = getDeepText(children);

              // Three of these blocks are not diagrams to be parsed, they are the two scorecards
              // and the architecture that anchors them — the widest ASCII in the document, and
              // the tables whose seven columns cannot survive a 390px screen. Each is replaced by
              // a purpose-built component reading from data/kpis.ts, so the figures come from one
              // place and the "Not yet measured" baselines can be drawn as the absence they are
              // rather than as a bar at zero.
              //
              // Matched on the block's own banner text rather than on a section id, because the
              // markdown is under a content-integrity guard and must not be edited to carry a
              // marker.
              if (source.includes("VICTORY-ANCHORED KPI MONITORING ARCHITECTURE")) {
                return <KpiArchitecture />;
              }
              if (source.includes("NOMINATION WINDOW KEY PERFORMANCE INDICATORS")) {
                return (
                  <KpiScorecards
                    stage={1}
                    kpis={NOMINATION_KPIS}
                    title="Stage 1 — nomination window scorecard"
                    note="Four indicators, measured against the Wiper primary-voter universe rather than the countywide public."
                  />
                );
              }
              if (source.includes("GENERAL ELECTION KEY PERFORMANCE INDICATORS")) {
                return (
                  <KpiScorecards
                    stage={2}
                    kpis={GENERAL_ELECTION_KPIS}
                    title="Stage 2 — general election scorecard"
                    note="Five indicators, every one anchored to the ~200,000-vote winning threshold."
                  />
                );
              }

              // 102 of these are box-drawing diagrams, not code. AsciiDiagram parses them into
              // real tables and summaries, gated on losslessness — anything it cannot read with
              // confidence keeps exactly the treatment it had.
              return <AsciiDiagram source={source}>{children}</AsciiDiagram>;
            },
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
              // The central narrative line (§8.12) gets the full pull-quote treatment;
              // every other blockquote (the ethics charter, etc.) keeps the standard styling.
              if (getDeepText(children).includes("Kitui has resources")) {
                return <PullQuote>{children}</PullQuote>;
              }
              return (
                <blockquote className="border-l-4 border-accent bg-accent/[0.03] px-5 py-4 rounded-r-2xl my-6 t-label sm:t-small font-semibold text-ink leading-relaxed shadow-sm italic relative text-pretty">
                  {children}
                </blockquote>
              );
            },
            ul: ({ children }) => {
              // §4 writes each operational commitment as six bolded fields in a fixed order —
              // a table written as prose. Where that exact shape appears, lay it out as one;
              // every other list in the document is untouched.
              const fields = parseLabelledList(children);
              if (fields && isCommitmentFieldList(fields.map((f) => f.label))) {
                return <CommitmentFields fields={fields} tabId={tabId} />;
              }
              return <ul>{children}</ul>;
            },
            li: ({ children }) => {
              // The three operating conditions (§6.3) get a pull-quote-style emphasis
              // treatment instead of a plain bullet — every other list item is unaffected.
              const text = normalizeWhitespace(getDeepText(children));
              const isGoverningReality = tabId === "summary" && GOVERNING_REALITY_TRIGGERS.some((t) => text.includes(t));
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
                  typeof child === "string" && hasHighlight(child) ? (
                    <HighlightedText text={child} tabId={tabId} />
                  ) : (
                    child
                  )
                )}
              </strong>
            ),
            img: ({ src, alt }) => {
              if (!src || typeof src !== "string") return null;
              // The frame lifts; the picture scales inside it. Scaling the frame instead would
              // push the paragraph after it, which is a layout change disguised as a hover.
              return (
                <span className="block my-4 rounded-xl border border-line/60">
                  <Image
                    src={src}
                    alt={alt || "Illustration"}
                    width={800}
                    height={450}
                    className="w-full h-auto object-cover"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    unoptimized={src.startsWith("data:") || src.startsWith("blob:")}
                  />
                  {alt && (
                    <span className="fx-overlay-body block t-small font-semibold">{alt}</span>
                  )}
                </span>
              );
            },
            h2: ({ children }) => {
              const text = getHeadingText(children);
              const slug = headingSlug(text);
              const id = slug ? sectionId(tabId, slug) : null;
              const insert = id ? HEADING_INSERTS[id] : HEADING_TEXT_INSERTS[text.trim()];
              return (
                <>
                  <SectionHeading id={id} level={2}>{children}</SectionHeading>
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
  };
}

export function MarkdownViewer({ content, tabId }: { content: string; tabId: TabId }) {
  // The heaviest parts of the proposal are matrices typed as prose. segmentContent finds them
  // by shape — three or more sibling h4 blocks over 300 words — and hands each block back as a
  // panel, so the reader gets the labels at a glance and the bodies on demand. Everything else
  // comes back as ordinary markdown and renders exactly as before.
  const markdownComponents = buildComponents(tabId);
  const segments = segmentContent(content, { isClosingSection: tabId === "nextsteps" });

  const renderMarkdown = (text: string, key?: string) => (
    <ReactMarkdown
      key={key}
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      components={markdownComponents}
    >
      {text}
    </ReactMarkdown>
  );

  return (
    <div className="relative bg-transparent overflow-hidden p-0">
      {/* Editorial Content Container */}
      {/* The lede treatment is scoped with `>` deliberately. As a descendant selector
          (`[&_p:first-of-type]`) it matched the first paragraph of EVERY nested container —
          so chart footnotes, card ledes and diagram notes all picked up a 3xl gold drop cap.
          A direct-child selector reaches the document's opening paragraph and nothing else. */}
      <div className="prose max-w-none relative z-10 px-0
 [&>p:first-of-type]:text-base [&>p:first-of-type]:sm:text-lg [&>p:first-of-type]:font-semibold [&>p:first-of-type]:text-ink [&>p:first-of-type]:leading-relaxed [&>p:first-of-type]:border-b [&>p:first-of-type]:border-line/40 [&>p:first-of-type]:pb-4 [&>p:first-of-type]:mb-6
 [&>p:first-of-type::first-letter]:text-3xl [&>p:first-of-type::first-letter]:font-semibold [&>p:first-of-type::first-letter]:text-gold [&>p:first-of-type::first-letter]:mr-2 [&>p:first-of-type::first-letter]:float-left [&>p:first-of-type::first-letter]:leading-none
">
        {segments.map((segment, i) => {
          if (segment.kind === "markdown") return renderMarkdown(segment.text, `md-${i}`);
          if (segment.kind === "fold")
            return (
              <ProseFold key={`fold-${i}`} label={segment.id}>
                {renderMarkdown(segment.text, `fold-body-${i}`)}
              </ProseFold>
            );
          return (
            <DisclosureGroup
              key={`group-${i}`}
              labels={segment.panels.map((panel) => panel.label)}
              unresolved={segment.panels.map((panel) => panel.unresolved)}
            >
              {segment.panels.map((panel) => renderMarkdown(panel.text, panel.label))}
            </DisclosureGroup>
          );
        })}

        {/* The ask closes the document, inside the prose flow. It used to sit in the footer
            chrome below a rule, next to the print widget — which framed a vendor's closing
            request as one more piece of page tooling. §16 builds to it; it belongs there. */}
        {tabId === "nextsteps" && <DecisionPanel />}
      </div>
    </div>
  );
}
