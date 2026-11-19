import dynamic from "next/dynamic";
import type { ReactNode } from "react";

import { LazyMount } from "../LazyMount";

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

/** A heavy visual mounts near the viewport, in a box already the size it will be. */
function Near({ h, children }: { h: number; children: ReactNode }) {
  return <LazyMount minHeight={h}>{children}</LazyMount>;
}

export const UPGRADE_INSERTS: Record<string, ReactNode> = {
  "goal-sec-8-2-4": <BeforeAfter />,
};

export function UpgradeInsert({ id }: { id: string | null | undefined }) {
  if (!id) return null;
  const node = UPGRADE_INSERTS[id];
  return node ? <>{node}</> : null;
}

export { Near };
