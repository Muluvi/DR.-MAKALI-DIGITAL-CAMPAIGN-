import React from "react";

import type { ChannelId } from "../../lib/phone-showcase";
import { PlatformGlyph, PLATFORM_BRAND, type PlatformId } from "../brand/PlatformLogos";

/**
 * The channel-rail marks.
 *
 * These were hand-drawn approximations, written when lucide-react dropped its brand icons and
 * nothing in the repo held real logo geometry. components/brand/PlatformLogos.tsx now does, so
 * this file no longer draws anything: it delegates the six platform marks there and keeps only
 * USSD, which has no brand to borrow.
 *
 * The rail takes the monochrome form, not the branded tile. These chips invert to a solid accent
 * ground when selected, and a fixed brand colour inside an inverting chip either vibrates against
 * it or disappears into it. The tiled logos belong in §8.1, where a platform is being named as a
 * commitment rather than used as a tab.
 *
 * Unchanged rule: no logo appears inside the screens themselves. A mock screen that needs its
 * logo to be identifiable has not been built properly.
 */

export const BRAND_COLOR: Record<ChannelId, string> = {
  whatsapp: PLATFORM_BRAND.whatsapp.tile!,
  facebook: PLATFORM_BRAND.facebook.tile!,
  instagram: PLATFORM_BRAND.instagram.tile!,
  tiktok: PLATFORM_BRAND.tiktok.tile!,
  youtube: PLATFORM_BRAND.youtube.tile!,
  /** X's own ground is near-black and PLATFORM_BRAND leaves it to the theme; this map needs a
   *  literal, so it carries the light-theme value the brand actually specifies. */
  x: "#0F1419",
  ussd: "#4E6178",
};

/** USSD has no brand. A keypad hash is what the channel actually is. */
function UssdMark() {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M9 3 7 21M17 3l-2 18M3.5 8.5h17M2.8 15.5h17" />
    </svg>
  );
}

export function ChannelMark({ id }: { id: ChannelId }) {
  if (id === "ussd") return <UssdMark />;
  return <PlatformGlyph id={id as PlatformId} size={16} />;
}
