import React from "react";
import Image from "next/image";

/**
 * The candidate portraits.
 *
 * All four are transparent-background cutouts, which is why they sit directly on the page rather
 * than in a framed box — a cutout in a card reads as a sticker. They carry no caption of their
 * own: the surrounding section already says who this is, and a caption under every portrait
 * would be four restatements of the same name.
 *
 * Only the WebP renditions ship. The master PNGs in the asset bundle are 7.6 MB combined and are
 * re-editing sources, not deliverables.
 *
 * `sizes` is set per placement rather than left to default. Without it next/image assumes full
 * viewport width and serves the 1600px rendition to a phone showing the image at 150px, which is
 * the single most common way an "optimised" image pipeline still ships four times the bytes it
 * needs.
 */

export type PortraitId =
  | "hero-clasped-hands"
  | "seated-grey-cropped"
  | "three-piece-formal"
  | "gesture-explaining";

/** Intrinsic dimensions of the 1600px renditions, so next/image never has to guess. */
const PORTRAITS: Record<PortraitId, { file: string; w: number; h: number; alt: string }> = {
  "hero-clasped-hands": {
    file: "01-hero-clasped-hands",
    w: 971,
    h: 1600,
    alt: "Hon. Dr. Benson Makali Mulu, standing, hands clasped, facing the camera.",
  },
  "seated-grey-cropped": {
    file: "02-seated-grey-cropped",
    w: 1243,
    h: 1600,
    alt: "Hon. Dr. Benson Makali Mulu in a grey suit, seated and turned towards the camera.",
  },
  "three-piece-formal": {
    file: "03-three-piece-formal",
    w: 963,
    h: 1600,
    alt: "Hon. Dr. Benson Makali Mulu in a three-piece suit with a Kenyan flag lapel pin.",
  },
  "gesture-explaining": {
    file: "04-gesture-explaining",
    w: 1055,
    h: 1600,
    alt: "Hon. Dr. Benson Makali Mulu mid-gesture, explaining a point.",
  },
};

/**
 * The cutouts were trimmed to the subject, so every one of them ends in a straight horizontal
 * cut across the jacket. On a white page that edge is invisible; on this site's dark ground it
 * reads as a photograph someone chopped. A short mask at the base dissolves it instead.
 */
const BOTTOM_FADE =
  "linear-gradient(to bottom, #000 0%, #000 82%, rgba(0,0,0,0.55) 93%, transparent 100%)";

export function Portrait({
  id,
  sizes,
  className = "",
  priority = false,
  fade = true,
}: {
  id: PortraitId;
  /** Required. See the note above on why this is never left to the default. */
  sizes: string;
  className?: string;
  /** True only for the hero. Everything else loads lazily. */
  priority?: boolean;
  /** Set false where the portrait sits on a light ground and the cut is already invisible. */
  fade?: boolean;
}) {
  const p = PORTRAITS[id];
  return (
    <Image
      src={`/portraits/${p.file}-1600.webp`}
      alt={p.alt}
      width={p.w}
      height={p.h}
      sizes={sizes}
      priority={priority}
      loading={priority ? undefined : "lazy"}
      className={`h-auto w-full object-contain select-none pointer-events-none ${className}`}
      style={fade ? { maskImage: BOTTOM_FADE, WebkitMaskImage: BOTTOM_FADE } : undefined}
      draggable={false}
    />
  );
}
