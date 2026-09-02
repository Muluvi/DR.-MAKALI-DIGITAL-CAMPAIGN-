import React from "react";

import { Portrait, type PortraitId } from "../Portrait";

/**
 * A portrait set beside a section's opening line.
 *
 * Deliberately not a card: these are cutouts, and a cutout inside a bordered box reads as a
 * sticker rather than a photograph. The accent rule and the kicker carry the structure instead,
 * matching the section-opening treatment used elsewhere in the document.
 *
 * On a phone the portrait sits above the text at a size that still reads as a person. Shrinking
 * it into a corner thumbnail to keep a two-column layout on a 390px screen would be worse than
 * not showing it.
 */
export function SectionPortrait({
  id,
  kicker,
  children,
  flip = false,
}: {
  id: PortraitId;
  kicker: string;
  /** One line of the section's own copy. Never new campaign messaging. */
  children: React.ReactNode;
  /** Portrait on the left instead of the right, so consecutive uses do not mirror each other. */
  flip?: boolean;
}) {
  return (
    <div className="not-prose my-7 print-avoid-break">
      <div
        className={`flex flex-col sm:flex-row items-center gap-4 sm:gap-6 ${
          flip ? "sm:flex-row-reverse" : ""
        }`}
      >
        <div className="w-[140px] sm:w-[168px] lg:w-[196px] shrink-0">
          <Portrait id={id} sizes="(min-width: 1024px) 196px, (min-width: 640px) 168px, 140px" />
        </div>
        <div className={`min-w-0 ${flip ? "sm:pr-2" : "sm:pl-2"}`}>
          <p className="t-micro font-black uppercase tracking-widest text-accent mb-2">{kicker}</p>
          <p className="font-serif t-lead sm:text-lg font-semibold text-ink leading-snug text-balance">
            {children}
          </p>
        </div>
      </div>
    </div>
  );
}
