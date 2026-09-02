import React from "react";

import type { ChannelId } from "../../lib/phone-showcase";

/**
 * Platform marks, drawn here as paths.
 *
 * lucide-react dropped its brand icons and no logo files are bundled — these are hand-drawn
 * glyphs at the same weight as the rest of the icon set. They appear only in the channel
 * selector: a screen that needs its logo to be identifiable has not been built properly, so
 * none of them appear inside the screens themselves.
 */

const S = { width: 16, height: 16, viewBox: "0 0 24 24", "aria-hidden": true as const };

export const BRAND_COLOR: Record<ChannelId, string> = {
  whatsapp: "#25D366",
  facebook: "#1877F2",
  instagram: "#DD2A7B",
  tiktok: "#FE2C55",
  youtube: "#FF0000",
  x: "#0F1419",
  ussd: "#4E6178",
};

function WhatsAppMark() {
  return (
    <svg {...S} fill="currentColor">
      <path d="M12.04 2A9.9 9.9 0 0 0 2.1 11.9c0 1.75.46 3.46 1.34 4.97L2 22l5.28-1.38a9.9 9.9 0 0 0 4.76 1.21h.01a9.9 9.9 0 0 0 9.9-9.9A9.9 9.9 0 0 0 12.04 2Zm0 18.02a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.13.82.84-3.05-.2-.31a8.2 8.2 0 1 1 6.97 3.87Zm4.5-6.14c-.24-.12-1.46-.72-1.68-.8-.23-.09-.39-.13-.55.12-.17.24-.64.8-.78.96-.15.17-.29.19-.53.07-.25-.13-1.04-.39-1.98-1.23-.73-.65-1.23-1.46-1.37-1.7-.15-.25-.02-.38.1-.5.11-.11.25-.29.37-.44.12-.14.16-.24.24-.41.08-.16.04-.3-.02-.43-.06-.12-.55-1.34-.76-1.83-.2-.48-.4-.41-.55-.42h-.47c-.16 0-.42.06-.64.3-.22.25-.85.83-.85 2.02s.87 2.34.99 2.5c.12.17 1.71 2.62 4.15 3.67.58.25 1.03.4 1.39.51.58.19 1.11.16 1.53.1.47-.07 1.46-.6 1.66-1.18.21-.58.21-1.07.15-1.18-.06-.1-.22-.17-.46-.29Z" />
    </svg>
  );
}

function FacebookMark() {
  return (
    <svg {...S} fill="currentColor">
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.9h2.54V9.85c0-2.52 1.5-3.91 3.77-3.91 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.89h2.78l-.45 2.9h-2.33V22c4.78-.76 8.44-4.92 8.44-9.94Z" />
    </svg>
  );
}

function InstagramMark() {
  return (
    <svg {...S} fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="5.2" />
      <circle cx="12" cy="12" r="4.1" />
      <circle cx="17.2" cy="6.8" r="1.15" fill="currentColor" stroke="none" />
    </svg>
  );
}

function TikTokMark() {
  return (
    <svg {...S} fill="currentColor">
      <path d="M16.5 2h-2.9v13.2a2.6 2.6 0 1 1-2.1-2.55V9.7a5.7 5.7 0 1 0 5.05 5.66V8.9a6.5 6.5 0 0 0 3.75 1.2V7.16A3.66 3.66 0 0 1 16.5 2Z" />
    </svg>
  );
}

function YouTubeMark() {
  return (
    <svg {...S} fill="currentColor">
      <path d="M21.6 7.2a2.5 2.5 0 0 0-1.76-1.77C18.25 5 12 5 12 5s-6.25 0-7.84.43A2.5 2.5 0 0 0 2.4 7.2 26.1 26.1 0 0 0 2 12a26.1 26.1 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.76 1.77C5.75 19 12 19 12 19s6.25 0 7.84-.43a2.5 2.5 0 0 0 1.76-1.77A26.1 26.1 0 0 0 22 12a26.1 26.1 0 0 0-.4-4.8ZM10 15.1V8.9L15.2 12 10 15.1Z" />
    </svg>
  );
}

function XMark() {
  return (
    <svg {...S} fill="currentColor">
      <path d="M17.53 3h3.02l-6.6 7.54L21.75 21h-6.07l-4.76-6.22L5.47 21H2.45l7.06-8.07L2.5 3h6.22l4.3 5.69L17.53 3Zm-1.06 16.2h1.67L7.6 4.72H5.81L16.47 19.2Z" />
    </svg>
  );
}

/** USSD has no brand. A keypad hash is what the channel actually is. */
function UssdMark() {
  return (
    <svg {...S} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M9 3 7 21M17 3l-2 18M3.5 8.5h17M2.8 15.5h17" />
    </svg>
  );
}

const MARKS: Record<ChannelId, () => React.JSX.Element> = {
  whatsapp: WhatsAppMark,
  facebook: FacebookMark,
  instagram: InstagramMark,
  tiktok: TikTokMark,
  youtube: YouTubeMark,
  x: XMark,
  ussd: UssdMark,
};

export function ChannelMark({ id }: { id: ChannelId }) {
  const Mark = MARKS[id];
  return <Mark />;
}
