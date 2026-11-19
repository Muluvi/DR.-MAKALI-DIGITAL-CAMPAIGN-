import type { ReactNode } from "react";

import { sourceLine, type CardRef, type ResolvedFigure } from "../../lib/card/spec";
import { IllustrativeTag } from "../premium/IllustrativeTag";
import { SaveImage } from "./SaveImage";

/**
 * The frame every new visual sits in (visual upgrade, E1).
 *
 * It keeps the parts a share card needs apart from the drawing: the finding as a title, the
 * figures it draws (resolved through lib/card/spec.ts, so tier and source travel with them), the
 * source line, and the card it exports as. The drawing is `children` and knows nothing about any
 * of that, which is what lets the image route build a card from the same data in its own layout.
 *
 * `illustrative` marks a mock screen or scene: the tag goes where the reader looks first.
 */
export function ExportableVisual({
  id,
  title,
  note,
  figures = [],
  source,
  card,
  illustrative = false,
  className = "",
  children,
}: {
  id?: string;
  title: ReactNode;
  note?: ReactNode;
  /** The figures the drawing carries. Their sources and tiers write the source line. */
  figures?: ResolvedFigure[];
  /** Overrides or extends the generated source line. */
  source?: string;
  /** What Save as image produces. Omitted for visuals that are not exported. */
  card?: CardRef;
  illustrative?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const line = source ?? sourceLine(figures);
  return (
    <figure className={`xv not-prose ${className}`} id={id} data-export={card?.type}>
      {illustrative ? <IllustrativeTag /> : null}
      <figcaption className="xv__cap">
        <h4 className="xv__title">{title}</h4>
        {note ? <p className="xv__note">{note}</p> : null}
      </figcaption>
      <div className="xv__body">{children}</div>
      {line || card ? (
        <div className="xv__foot">
          {line ? <p className="xv__source">{line}</p> : null}
          {card ? <SaveImage card={card} title={typeof title === "string" ? title : undefined} /> : null}
        </div>
      ) : null}
    </figure>
  );
}
