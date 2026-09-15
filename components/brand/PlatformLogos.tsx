import React from "react";

/**
 * The seven platform brand marks the proposal names — the six under daily management in §8.1.1,
 * plus LinkedIn, which §5.1 and §8.3 both carry in their channel lists.
 *
 * WHY THESE ARE DRAWN RATHER THAN SHIPPED AS IMAGE FILES
 * -----------------------------------------------------
 * next.config.ts states the position this repo takes on images: "The portraits are the only
 * images that ship." That is not squeamishness, it is §3.6 — the reader is on mobile data in a
 * county at 13.6% internet use, and six raster logos is six more requests and a decode cost on
 * the critical path. Every mark below is vector, inlined into the server-rendered HTML, costs
 * zero additional requests, stays sharp at any density, and carries no client JavaScript.
 *
 * GEOMETRY
 * --------
 * Each mark is drawn in its own 24x24 box, then set into a rounded brand tile at 65% scale. The
 * tile is what makes six logos read as one row rather than six pasted screenshots: WhatsApp's
 * mark is a filled bubble, Instagram's is a hairline outline and X's is a bare glyph, and at
 * 28px with no common container they sit at visibly different weights. The tile normalises them
 * without altering any mark's own geometry.
 *
 * X is the one mark that cannot hold a fixed colour. Its brand ground is near-black, which
 * disappears against --dark in the dark theme, so its tile takes currentColor and inverts.
 */

export type PlatformId =
  | "whatsapp"
  | "facebook"
  | "instagram"
  | "tiktok"
  | "youtube"
  | "x"
  | "linkedin";

export interface PlatformBrand {
  label: string;
  /** Brand ground the tile is filled with. `null` where the tile must follow the theme (X). */
  tile: string | null;
  /**
   * Colour for the untiled inline glyph that runs in body copy. `null` means follow the reading
   * colour instead of a brand one — which is what TikTok and X both need, because their brand
   * colour IS near-black: inline and untiled, #010101 is invisible on the dark theme and
   * indistinguishable from the text on the light one. Tiled they are fine, because there the
   * near-black is the ground and the glyph is knocked out of it.
   */
  inline: string | null;
}

export const PLATFORM_BRAND: Record<PlatformId, PlatformBrand> = {
  whatsapp: { label: "WhatsApp", tile: "#25D366", inline: "#25D366" },
  facebook: { label: "Facebook", tile: "#1877F2", inline: "#1877F2" },
  instagram: { label: "Instagram", tile: "#E4405F", inline: "#E4405F" },
  tiktok: { label: "TikTok", tile: "#010101", inline: null },
  youtube: { label: "YouTube", tile: "#FF0000", inline: "#FF0000" },
  x: { label: "X", tile: null, inline: null },
  linkedin: { label: "LinkedIn", tile: "#0A66C2", inline: "#0A66C2" },
};

// ---------------------------------------------------------------------------
// The marks, each in its own 24x24 box.
// ---------------------------------------------------------------------------

const WHATSAPP_PATH =
  "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347M12.05 21.785h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413";

const FACEBOOK_PATH =
  "M16.671 15.543l.532-3.47h-3.328v-2.25c0-.949.465-1.874 1.956-1.874h1.513V4.996s-1.374-.235-2.686-.235c-2.741 0-4.533 1.662-4.533 4.669v2.643H7.078v3.47h3.047v8.385a12.09 12.09 0 0 0 3.75 0v-8.385h2.796z";

const TIKTOK_PATH =
  "M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z";

const YOUTUBE_BODY_PATH =
  "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z";

const YOUTUBE_PLAY_PATH = "M9.545 15.568V8.432L15.818 12l-6.273 3.568z";

/** Body and play triangle as one path, so an even-odd fill knocks the triangle out as a hole
 *  rather than painting it. The tiled mark paints the triangle; the monochrome one voids it. */
const YOUTUBE_MONO_PATH = `${YOUTUBE_BODY_PATH} ${YOUTUBE_PLAY_PATH}`;

const LINKEDIN_PATH =
  "M5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zM7.119 20.452H3.555V9h3.564v11.452zM20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286z";

const X_PATH =
  "M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z";

/** Marks whose glyph is a single filled path. Instagram and YouTube are drawn separately. */
const SINGLE_PATH: Partial<Record<PlatformId, string>> = {
  whatsapp: WHATSAPP_PATH,
  facebook: FACEBOOK_PATH,
  tiktok: TIKTOK_PATH,
  x: X_PATH,
  linkedin: LINKEDIN_PATH,
};

/**
 * Instagram's mark is a hairline camera, not a filled silhouette. Drawing it with stroked
 * primitives keeps the aperture and the viewfinder dot at the correct optical weight; the
 * filled-path version of this logo reads as a solid block at 18px.
 */
function InstagramGlyph({ className }: { className?: string }) {
  return (
    <g className={className} fill="none" stroke="currentColor" strokeWidth="2.1">
      <rect x="2.4" y="2.4" width="19.2" height="19.2" rx="5.6" />
      <circle cx="12" cy="12" r="4.6" />
      <circle cx="17.6" cy="6.4" r="1.25" fill="currentColor" stroke="none" />
    </g>
  );
}

function YouTubeGlyph({ className }: { className?: string }) {
  return (
    <g className={className}>
      <path d={YOUTUBE_BODY_PATH} fill="currentColor" />
      {/* The play triangle is knocked back to the tile's own red rather than painted white, so
          the mark keeps its two-tone reading instead of flattening into a white arrow. */}
      <path d={YOUTUBE_PLAY_PATH} fill="#FF0000" />
    </g>
  );
}

/**
 * TikTok's mark is three copies of one note offset against each other. Reproducing that is the
 * difference between the logo and a generic music glyph, and it is the only mark in the set
 * whose identity lives in the offset rather than in the outline.
 */
function TikTokGlyph({ className }: { className?: string }) {
  return (
    <g>
      <path d={TIKTOK_PATH} fill="#25F4EE" transform="translate(-1.1 1.1)" />
      <path d={TIKTOK_PATH} fill="#FE2C55" transform="translate(1.1 -1.1)" />
      <path d={TIKTOK_PATH} className={className} fill="currentColor" />
    </g>
  );
}

/**
 * Alpha of the tile's hairline edge. Hoisted out of the JSX because verify-figures.mjs exempts
 * geometry by attribute name and its GEOMETRY_KEY set carries `opacity` and `strokeWidth` but
 * not `strokeOpacity`, so inline it reads as an unsourced campaign figure. The opt-out the
 * script documents is a per-line comment, and a line comment cannot sit between JSX attributes.
 */
const TILE_EDGE_ALPHA = "0.22"; // verify-figures-ignore — stroke alpha, not a campaign figure

interface TileProps {
  id: PlatformId;
  /** Rendered edge length in px. */
  size?: number;
  className?: string;
}

/**
 * A platform logo set into its brand tile — the form used wherever a platform is being named as
 * a thing the campaign runs, rather than as a data series.
 */
export function PlatformTile({ id, size = 28, className = "" }: TileProps) {
  const brand = PLATFORM_BRAND[id];
  const themed = brand.tile === null;

  // White on every brand ground except X in dark mode, where the tile itself has inverted.
  const glyphClass = themed ? "fill-white dark:fill-[#0F1419]" : "";
  const glyphColor = themed ? undefined : "#FFFFFF";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      role="img"
      aria-label={`${brand.label} logo`}
      className={`${themed ? "text-[#0F1419] dark:text-white" : ""} ${className}`}
    >
      <rect
        width="24"
        height="24"
        rx="5.6"
        fill={themed ? "currentColor" : brand.tile!}
      />
      {/* A hairline in the surrounding text colour, so a tile whose brand ground matches the
          page ground still reads as a tile. TikTok's #010101 is the case that needs it — on the
          dark theme it is all but the card colour, and without an edge the mark looks like a
          hole punched in the row rather than a logo. */}
      <rect
        x="0.5"
        y="0.5"
        width="23"
        height="23"
        rx="5.35"
        fill="none"
        stroke="currentColor"
        strokeOpacity={TILE_EDGE_ALPHA}
      />
      {/* 24 * 0.65 = 15.6, so an even 4.2 of tile shows on each side. */}
      <g transform="translate(4.2 4.2) scale(0.65)" color={glyphColor}>
        {id === "instagram" ? (
          <InstagramGlyph className={glyphClass} />
        ) : id === "youtube" ? (
          <YouTubeGlyph className={glyphClass} />
        ) : id === "tiktok" ? (
          <TikTokGlyph className={glyphClass} />
        ) : (
          <path d={SINGLE_PATH[id]!} className={glyphClass} fill={glyphColor ?? "currentColor"} />
        )}
      </g>
    </svg>
  );
}

/**
 * The same six marks with no tile and no brand colour, taking the surrounding text colour.
 *
 * This is the form the phone-showcase channel rail needs: those chips invert to a solid accent
 * ground when selected, and a fixed brand colour inside an inverting chip either vibrates
 * against it or vanishes into it.
 */
export function PlatformGlyph({
  id,
  size = 16,
  x,
  y,
}: {
  id: PlatformId;
  size?: number;
  /** Position, for embedding inside an existing SVG — a nested <svg> is valid and is the only
   *  way a recharts custom axis tick can carry a mark. Omitted everywhere else. */
  x?: number;
  y?: number;
}) {
  const single = SINGLE_PATH[id];
  return (
    <svg x={x} y={y} width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      {id === "instagram" ? (
        <InstagramGlyph />
      ) : id === "youtube" ? (
        <path d={YOUTUBE_MONO_PATH} fill="currentColor" fillRule="evenodd" />
      ) : (
        <path d={single!} fill="currentColor" />
      )}
    </svg>
  );
}

/**
 * Logo plus platform name, set in the site's own sans rather than in each platform's wordmark
 * face. Six licensed wordmarks in six unrelated typefaces would fight the document's typography
 * and each other; the mark is what carries recognition, and the name belongs to this page.
 */
export function PlatformLogo({
  id,
  size = 28,
  className = "",
}: {
  id: PlatformId;
  size?: number;
  className?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <PlatformTile id={id} size={size} />
      <span className="t-small font-bold text-ink whitespace-nowrap">{PLATFORM_BRAND[id].label}</span>
    </span>
  );
}

/**
 * A mark set inline in running prose, immediately before the platform's name.
 *
 * This is the form that appears most often across the document, because the document names these
 * platforms 189 times in body copy, bullets and table cells. Three decisions make that bearable
 * rather than loud:
 *
 * 1. NO TILE. A filled brand tile every time the word "WhatsApp" appears would turn 200 minutes
 *    of reading into a sticker album. Untiled, the glyph reads as a typographic ornament.
 * 2. BRAND COLOUR, EXCEPT WHERE IT CANNOT BE. TikTok and X are near-black brands; untiled that
 *    is either invisible on the dark theme or indistinguishable from the text on the light one,
 *    so those two follow the reading colour (see PlatformBrand.inline).
 * 3. THE WORD IS NEVER REPLACED. The mark is decoration on top of the name, not a substitute
 *    for it, so it is aria-hidden and the sentence reads identically to a screen reader, in
 *    print, and with images off.
 *
 * Sized in `em` so it tracks whatever type size it lands in — body copy, a table cell, or a
 * micro-label — and nudged onto the baseline rather than sitting on it, which is what stops a
 * line of prose from gaining a pixel of leading wherever a platform is mentioned.
 */
export function InlinePlatformMark({ id }: { id: PlatformId }) {
  const themed = PLATFORM_BRAND[id].inline === null;
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      className={themed ? "fm-inline-mark text-ink/80" : "fm-inline-mark"}
      style={themed ? undefined : { color: PLATFORM_BRAND[id].inline! }}
    >
      {id === "instagram" ? (
        <InstagramGlyph />
      ) : id === "youtube" ? (
        <path d={YOUTUBE_MONO_PATH} fill="currentColor" fillRule="evenodd" />
      ) : (
        <path d={SINGLE_PATH[id]!} fill="currentColor" />
      )}
    </svg>
  );
}
