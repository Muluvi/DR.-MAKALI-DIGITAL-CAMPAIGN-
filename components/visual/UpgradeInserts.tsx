import dynamic from "next/dynamic";
import type { ReactNode } from "react";

import { LazyMount } from "../LazyMount";
import { WardLeague } from "../dataviz/WardLeague";
import { WardSkyline } from "../dataviz/WardSkyline";
import { DroughtForecast, LivelihoodPrices } from "../dataviz/Livelihoods";
import { CountyReceipt } from "../dataviz/Receipt";
import { WinningDialBlock } from "../dataviz/WinningDialBlock";
import { EquityHeatTable, EquityLollipop } from "../dataviz/Equity";
import { RouteTimelineBlock } from "../dataviz/RouteTimelineBlock";
import { ChatExplainer } from "../dataviz/ChatExplainer";
import { PoolReveal } from "../dataviz/PoolReveal";
import { Billboard, ChapterTicker, KpiWatches, PrintPieces, TvNews } from "../devices/Scenes";
import { RadioSetBlock } from "../devices/RadioSetBlock";
import { FieldDayBlock } from "../devices/FieldDayBlock";
import { BriefMemoBlock, CommandMapBlock, KanbanBlock } from "../workspace/LiveBoardsBlock";

/**
 * Where the visual upgrade's new visuals sit (November 2026): each under the heading whose text it
 * serves, after anything already mounted there, so no existing figure moves or disappears.
 *
 * Kept apart from MarkdownViewer's HEADING_INSERTS on purpose. A HEADING_INSERTS entry replaces the
 * heading's part visual; these only add. scripts/verify-mounts.mjs reads the keys of this map too,
 * so a key that stops naming a heading fails the build rather than silently drawing nothing.
 *
 * Everything here loads as its own chunk (`next/dynamic`), and the heavy ones also wait for the
 * reader to come near (`LazyMount`, with the space reserved so nothing shifts).
 */
const BeforeAfter = dynamic(() => import("../phone/BeforeAfter").then((m) => m.BeforeAfter));
const MapStoryBlock = dynamic(() => import("../dataviz/MapStoryBlock").then((m) => m.MapStoryBlock));

/** A heavy visual mounts near the viewport, in a box already the size it will be. */
function Near({ h, children }: { h: number; children: ReactNode }) {
  return <LazyMount minHeight={h}>{children}</LazyMount>;
}

export const UPGRADE_INSERTS: Record<string, ReactNode> = {
  // Kitui and its people
  "kitui-sec-1-2": <Near h={1180}><MapStoryBlock /></Near>,
  "needs-sec-1-3": <ChapterTicker chapter="needs" />,
  "needs-sec-1-5": <CountyReceipt />,
  "needs-sec-3-2": <DroughtForecast />,
  "needs-sec-3-6": <LivelihoodPrices />,
  "news-sec-4-2": <RadioSetBlock />,
  "news-sec-4-4": (
    <>
      <ChatExplainer />
      <Billboard />
    </>
  ),
  // The votes
  "votes-sec-2-1": (
    <>
      <ChapterTicker chapter="votes" />
      <WardSkyline />
    </>
  ),
  "votes-sec-2-3": <WardLeague />,
  "winning-sec-2-5": <WinningDialBlock />,
  "spend-sec-3-7": (
    <>
      <EquityLollipop />
      <EquityHeatTable />
    </>
  ),
  "known-sec-6-2": <PoolReveal />,
  // The plan
  "goal-sec-8-2-4": <BeforeAfter />,
  "timeline-sec-14-0": <RouteTimelineBlock />,
  // How the campaign runs
  "week-sec-13-4": <BriefMemoBlock />,
  "workstreams-sec-15-1": <KanbanBlock />,
  "workstreams-sec-15-2-2": (
    <>
      <TvNews />
      <PrintPieces />
    </>
  ),
  "workstreams-sec-15-3-1": (
    <>
      <CommandMapBlock />
      <FieldDayBlock />
    </>
  ),
  "success-sec-18-2": <KpiWatches />,
};

export function UpgradeInsert({ id }: { id: string | null | undefined }) {
  if (!id) return null;
  const node = UPGRADE_INSERTS[id];
  return node ? <>{node}</> : null;
}

export { Near };
