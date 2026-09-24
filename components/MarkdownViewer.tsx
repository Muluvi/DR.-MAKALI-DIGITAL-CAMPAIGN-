"use client";

import React from "react";
import Image from "next/image";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

import { InteractiveTable } from "./markdown/InteractiveTable";
import { MarkdownParagraph, MarkdownListItem } from "./markdown/MarkdownTextComponents";
import { SectionHeading } from "./markdown/SectionHeading";
import { PartVisual } from "./partviz/PartVisual";
import { partVisual } from "../lib/part-visuals";
import { ClaimBadge } from "./markdown/ClaimBadge";
import { HighlightedText } from "./markdown/HighlightedText";
import { hasHighlight } from "../lib/highlight-patterns";
import { CompetitiveQuadrantBlock } from "./markdown/CompetitiveQuadrantBlock";
import { ResourceEnvelopeBlock } from "./markdown/ResourceEnvelopeBlock";
import {
  ChannelReachBlock,
  IssueEvidenceBlock,
  PollMarginsBlock,
  RegisterComparisonBlock,
  ScenarioBenchmarkBlock,
} from "./markdown/AnalysisBlocks";
import { PlatformSizingBlock } from "./markdown/PlatformSizingBlock";
import { MizaniSlopeBlock } from "./markdown/MizaniSlopeBlock";
import { WardCartogramBlock } from "./markdown/WardCartogramBlock";
import { BenchmarkLadder } from "./charts/BenchmarkLadder";
import { TierComparisonCarousel } from "./charts/TierComparisonCarousel";
import { FeaturePhoneSpecimen } from "./charts/FeaturePhoneSpecimen";
import { OfflineWaterline } from "./charts/OfflineWaterline";
import { VoteFunnel } from "./charts/VoteFunnel";
import { KpiPhaseBlock } from "./markdown/KpiPhaseBlock";
import { AsciiDiagram } from "./markdown/AsciiDiagram";
import { Figure } from "./figures/FigureBoundary";
import { ReachSplit } from "./ReachSplit";
import {
  FlywheelSchematic,
  MessagingPlayground,
  CounterMessagingGrid,
  ToneVoiceSlider,
  SloganBuilder,
  MediaPlaybackMockup,
  RadioAircoverDial,
} from "./StrategicAids";
import { DirectionWeek } from "./charts/DirectionModel";
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
import { StrategicPillarsMatrix } from "./markdown/StrategicPillarsMatrix";
import { GeographicZoneMatrix } from "./markdown/GeographicZoneMatrix";
import { PersuasionFramingMatrix } from "./markdown/PersuasionFramingMatrix";
import { PublicServiceDeliveryTracker } from "./markdown/PublicServiceDeliveryTracker";
import { MediaRadioLandscapeCard } from "./markdown/MediaRadioLandscapeCard";
import { DataSecurityEthicsCharter } from "./markdown/DataSecurityEthicsCharter";
import { DISPUTED_FIGURES } from "../data/disputed-figures";
import { headingSlug, sectionId, type TabId } from "../lib/heading-slug";
import { crossRefFor, segmentContent } from "../lib/collapse-groups";
import { CrossRef } from "./CrossRef";
import { PrintSafeDisclosures } from "./PrintSafeDisclosures";
import { DisclosureGroup } from "./markdown/DisclosureGroup";
import { ObjectivesIndex } from "./markdown/ObjectivesIndex";
import { ProseFold } from "./markdown/ProseFold";
import { BriefFold } from "./markdown/BriefFold";

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

/**
 * The language tag on a fenced block — "figure" for ```figure, null for a bare fence.
 *
 * Matched on the tag rather than on the block's contents. An ASCII diagram that happened to
 * contain a line reading "id: something" would otherwise be swallowed and replaced by a figure,
 * which is a silent content change and exactly what hard rule 2 forbids.
 */
function fenceLanguage(children: React.ReactNode): string | null {
  for (const child of React.Children.toArray(children)) {
    if (!React.isValidElement(child)) continue;
    const className = (child.props as { className?: string }).className ?? "";
    const match = className.match(/language-([A-Za-z0-9_-]+)/);
    if (match) return match[1].toLowerCase();
  }
  return null;
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
  // The scorecards are the objectives. What they do not carry is the eight indicator sets that
  // stayed with the work they measure — indexed beneath them rather than moved here.
  "delivery-sec-5-6": <ObjectivesIndex />,
  "data-sec-2-3": <NominationPathPanel />,
  // The pipeline's poll margins land in the section that states the gap, because the gap is
  // the thing the margins qualify: one of these three polls can be tested and two cannot.
  "annex-polls-sec-c-1": <PollMarginsBlock />,
  // The governing claim opens §6, ahead of the pillars and themes that rest on it.
  "strategy-sec-4-1": <EconomistGovernorThesis />,
  "analysis-sec-3-5": (
    <>
      <ConstitutionalBranchNavigator />
      <CompetitiveQuadrantBlock />
    </>
  ),
  "data-sec-2-8": (
    <SectionPortrait id="gesture-explaining" kicker="Candidate profile — §2.8">
      One of Kenya&rsquo;s most consistent and authoritative voices on macroeconomic governance,
      fiscal discipline, and budget oversight.
    </SectionPortrait>
  ),
  "data-sec-2-1": (
    <>
      <WardCartogramBlock />
      <PathTo200kBlock />
      <ConstituencyWeightBlock />
    </>
  ),
  "data-sec-2-5": <ResourceEnvelopeBlock />,
  "data-sec-2-4": (
    <>
      <OfflineWaterline />
      <DisputedFigure entry={kituiCentralPopulationDispute} />
    </>
  ),
  "data-sec-2-2": (
    <>
      <ElectoralHistoryPanel />
      <ElectoralTimelineBlock />
    </>
  ),
  "annex-county-sec-b-2": (
    <>
      <FiscalAuditPanel />
      <FiscalAuditChartBlock />
    </>
  ),
  "annex-county-sec-b-3": <DroughtFoodSecurityPanel />,
  "annex-county-sec-b-4": <MuiBasinPanel />,
  "annex-county-sec-b-5": <CompetitorFieldPanel />,
  // The funnel shows how the threshold is built; the register block shows which register it
  // is built on, which is now a live question rather than a settled one.
  "analysis-sec-3-1": (
    <>
      <VoteFunnel />
      <RegisterComparisonBlock />
    </>
  ),
  "analysis-sec-3-2": <ScenarioBenchmarkBlock />,
  "analysis-sec-3-3": <PathTo200kCalculator />,
  "analysis-sec-3-4": <RecognitionDeficitOverlay />,
  "strategy-sec-4-3-1": <AudienceSegmentationMatrix />,
  // §7.3 splits the electorate into a connected minority and an offline majority. The showcase is
  // that argument as an object: one handset, the campaign on all seven channels, ending on the
  // USSD dialog that reaches more voters than the six apps together.
  "analysis-sec-3-8": <PhoneShowcase />,
  // The showcase makes the argument; this puts the modelled numbers under it, including the
  // one the showcase cannot show — that the largest addressable layer cannot carry Kikamba.
  "data-sec-2-6": <ChannelReachBlock />,
  "strategy-sec-4-4-1": <IssueEvidenceBlock />,
  "strategy-sec-4-4": (
    <>
      <MessagingPlayground />
      <ToneVoiceSlider />
    </>
  ),
  // O-6 (approved 24 September 2026): the "Upcoming" market-assembly scheduler is removed. Its
  // two events were invented and already past.
  "delivery-sec-5-8-1": <CounterMessagingGrid />,
  // The ownership/alignment/tier table this chart plots, now §8.5.1 in the situation analysis.
  "data-sec-2-7-1": <MediaOwnershipBlock />,

  // ---- Scope, roadmap, measurement, governance and risk (§8-§16) ----------------------
  "delivery-sec-5-7": (
    <SectionPortrait id="seated-grey-cropped" kicker="The engagement model — §5.7" flip>
      Firefly reports to a single named campaign-side counterpart.
    </SectionPortrait>
  ),
  "strategy-sec-4-1-4": <StrategicPillarsMatrix />,
  "analysis-sec-3-7": <GeographicZoneMatrix />,
  // The technology workstreams carried no anchored visualisation at all before this — the one
  // stretch of the document that was a wall of text, and the one describing the technology
  // stack, which is the part this reader is most likely to test against the artifact itself.
  "workstreams-data-sec-5-2-4-4": <BenchmarkLadder />,
  "delivery-sec-5-5-1": <ServiceLevelSelector />,
  // The four-column matrix below this heading stacks into nine attribute cards on a phone, which
  // answers "what does row six say" rather than "which tier should we buy". One card per tier,
  // swipeable, with the table left in place underneath as the accessible equivalent.
  "delivery-sec-5-5-2": <TierComparisonCarousel />,
  "workstreams-ground-sec-5-2-3-1": <TerminalShowcase />,
  "workstreams-ground-sec-5-2-3-2": <FlywheelSchematic />,
  "workstreams-ground-sec-5-2-3-3": (
    <>
      <FeaturePhoneSpecimen />
      <ReachSplit />
      {/* O-5 (approved): the "Verified Ingestion Feed" of invented voter messages is removed. It
          presented illustration as evidence, against the proposal's own ethics commitments. */}
    </>
  ),
  "strategy-sec-4-4-3": <PersuasionFramingMatrix />,
  "delivery-sec-5-7-4": <DataSecurityEthicsCharter />,
  "workstreams-media-sec-5-2-2-1": <MediaPlaybackMockup />,
  "workstreams-media-sec-5-2-2-2": (
    <>
      <MediaRadioLandscapeCard />
      <RadioAircoverDial />
    </>
  ),
  "strategy-sec-4-1-6": <SloganBuilder />,
  "workstreams-platforms-sec-5-2-1": <PublicServiceDeliveryTracker />,
  "delivery-sec-5-4": (
    <>
      <PhaseRail />
      <KpiPhaseBlock />
    </>
  ),

  // ---- The repositioning: analyse, strategise, direct ---------------------------------
  // The audit's four figures, the week and the visit loop are drawn by the register
  // (fig-3-9-audit, fig-4-5-calendar) and the visit-loop figure; their earlier inserts are retired.
  // §5.7 is the direction model. The week replaces a bullet list, a meeting table and the
  // governance chart cut from Annex D.
  "delivery-sec-5-7-1": <DirectionWeek />,
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
// Three callouts, chosen by what the quote is for (brief G-9, D-15). Every word of the quote is
// kept; only its frame changes.
//   Rule     the owner/Firefly split lines ("Owner: the campaign.", "Outside this engagement."),
//            headed by a two-part badge
//   Aside    pointers and notes ("…is in Annex F", "Research Integrity Note")
//   Finding  the one claim a section leans on: the first other quote in the section, once
const RULE_PATTERN = /^(owner:|split ownership|mostly outside this engagement|outside this engagement|campaign-owned recommendations)/i;
const ASIDE_PATTERN = /(is in annex|are in annex|research integrity note|^note\b|segments overlap|re-cut against|name changed|live version of this list|^sfx:|^"|^\[!)/i;

function ruleOwner(text: string): string | null {
  const m = /^owner:\s*([^.—]+)/i.exec(text);
  if (m) return m[1].trim();
  if (/outside this engagement|campaign-owned/i.test(text)) return "the campaign, outside this engagement";
  if (/split ownership/i.test(text)) return "split";
  return null;
}

function buildComponents(tabId: TabId): Components {
  let findingUsed = false;
  return {
            table: ({ children }) => {
              const headers = getTableHeaderTexts(children).map((h) => h.toLowerCase());
              const has = (text: string) => headers.some((h) => h.includes(text));

              // §2.6 "National platform sizing" — replaced by the sorted bar chart
              // (item 13), not kept alongside it.
              if (tabId === "data" && has("platform") && has("kenya audience")) {
                return <PlatformSizingBlock />;
              }

              // §2.8 candidate-asset table — assertion/evidence/application becomes
              // claim cards (item 21), replacing the table rather than sitting alongside it.
              if (tabId === "data" && has("asset") && has("evidence") && has("digital application")) {
                return <ClaimCards>{children}</ClaimCards>;
              }

              const table = <InteractiveTable>{children}</InteractiveTable>;

              // §6.2 Mizani survey table — table stays (item 14 says keep it with only
              // two data points), slope chart added alongside it.
              if (tabId === "objectives" && has("kasalu") && has("wambua")) {
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

              /**
               * A ```figure fence places a built figure exactly where the prose reaches it.
               *
               * This is what lets rule 1a retire an ASCII diagram IN PLACE. The alternative —
               * keying every figure to a heading id, as HEADING_INSERTS does — lifts the figure to
               * the top of its subsection and leaves a hole where the diagram was, which reads as
               * a deletion rather than a replacement. The fence body is `id: <figure-id>`; the
               * registry resolves it, and an unknown id renders a visible gap rather than nothing.
               */
              if (fenceLanguage(children) === "figure") {
                const id = source.match(/^\s*id:\s*([a-z0-9-]+)\s*$/im)?.[1];
                return id ? (
                  <Figure id={id} />
                ) : (
                  <p className="not-prose my-4 rounded-lg border border-dashed border-gold/60 bg-gold/[0.06] px-3 py-2 t-micro text-ink">
                    <strong className="font-bold text-gold">Malformed figure fence:</strong> expected a line reading
                    {" "}<code>id: some-figure-id</code>.
                  </p>
                );
              }

              // FOUR BLOCKS USED TO BE MATCHED HERE, on their own banner text — §11's two
              // scorecards, the architecture that anchors them, and §13.1's rapid-response flow.
              // The markdown was under a content-integrity guard and could not be edited to carry
              // a marker, so the substitution had to key on a banner nobody could rename, and the
              // ASCII stayed in the markdown carrying the words anyway. Rule 1a now authorises
              // retiring those blocks outright: all four are ```figure fences resolved by the
              // registry and declared in scripts/figure-retirements.json, and this matching is
              // gone with them.

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
              /**
               * Rule 1b: a paragraph the reader has already read arrives as one line.
               *
               * Matched here rather than during segmentation because almost every paragraph in
               * this document lives inside a Brief fold, and splitting the markdown segments
               * found none of them. Nothing is deleted — the paragraph is the child, in full,
               * and CrossRef forces itself open for print and with JavaScript off.
               */
              const repeat = crossRefFor(tabId, getDeepText(children));
              if (repeat) {
                return (
                  <CrossRef
                    section={repeat.canonical.section}
                    href={repeat.canonical.href}
                    words={repeat.duplicate.words}
                    verbatim={repeat.score >= 0.99}
                  >
                    <MarkdownParagraph tabId={tabId}>{children}</MarkdownParagraph>
                  </CrossRef>
                );
              }
              return <MarkdownParagraph tabId={tabId}>{children}</MarkdownParagraph>;
            },
            blockquote: ({ children }) => {
              // The central narrative line (§5.2.4.1) gets the full pull-quote treatment;
              // every other blockquote (the ethics charter, etc.) keeps the standard styling.
              if (getDeepText(children).includes("Kitui has resources")) {
                return <PullQuote>{children}</PullQuote>;
              }
              const text = normalizeWhitespace(getDeepText(children)).trim();
              if (RULE_PATTERN.test(text)) {
                const owner = ruleOwner(text);
                return (
                  <blockquote className="pf-callout pf-callout--rule">
                    {owner && (
                      <span className="pf-split" aria-hidden="true">
                        <span>Owner</span>
                        <span>{owner}</span>
                      </span>
                    )}
                    {children}
                  </blockquote>
                );
              }
              if (!findingUsed && !ASIDE_PATTERN.test(text)) {
                findingUsed = true;
                return <blockquote className="pf-callout pf-callout--finding">{children}</blockquote>;
              }
              return <blockquote className="pf-callout pf-callout--aside">{children}</blockquote>;
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
              const isGoverningReality = tabId === "analysis" && GOVERNING_REALITY_TRIGGERS.some((t) => text.includes(t));
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
                <span className="fx-zoom-frame fx-reveal-overlay fx-lift block my-4 rounded-xl border border-line/60">
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
                  {/* The hand-built visualisation where one exists, and the figure derived from
                      this heading's own content where one does not. Never both: 50 sub-sections
                      were designed, and the other 222 are covered rather than decorated. */}
                  {insert ?? <PartVisual spec={partVisual(id)} />}
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
                  {(id && HEADING_INSERTS[id]) ?? <PartVisual spec={partVisual(id)} />}
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

">
        {segments.map((segment, i) => {
          if (segment.kind === "markdown") return renderMarkdown(segment.text, `md-${i}`);
          if (segment.kind === "fold")
            return (
              <ProseFold key={`fold-${i}`} label={segment.id}>
                {renderMarkdown(segment.text, `fold-body-${i}`)}
              </ProseFold>
            );
          if (segment.kind === "brief")
            return (
              <BriefFold key={`brief-${i}`} label={segment.number} words={segment.hiddenWords}>
                {renderMarkdown(segment.hidden, `brief-body-${i}`)}
              </BriefFold>
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

        {/* Every disclosure holding CONTENT ships open and is closed by script, so the printed
            kit is complete whether or not scripts run. See PrintSafeDisclosures. */}
        <PrintSafeDisclosures />

        {/* The ask closes the document, inside the prose flow. It used to sit in the footer
            chrome below a rule, next to the print widget — which framed a vendor's closing
            request as one more piece of page tooling. §16 builds to it; it belongs there. */}
        {tabId === "nextsteps" && <DecisionPanel />}
      </div>
    </div>
  );
}
