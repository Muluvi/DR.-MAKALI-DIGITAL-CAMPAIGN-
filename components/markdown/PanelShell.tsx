import type { ReactNode } from "react";

/**
 * The card the document's interactive panels sit in.
 *
 * Fourteen components opened with the same forty lines: outer card, header band, a 40px
 * accent-tinted icon tile, an uppercase eyebrow, an optional monospace qualifier, and a serif
 * title. Byte-identical in every one, which is why the house style could only be changed in
 * fourteen places at once, and why some of them had drifted — a couple aligned the header to
 * `items-start` and the rest to `items-center`, for no reason any of them gave.
 *
 * The distinction from FigureBlock is real and worth keeping: a FigureBlock presents one sourced
 * figure and must carry its provenance; a PanelShell frames something the reader operates — a
 * matrix, a calculator, a tracker — whose sources sit inside it, next to the rows they belong to.
 */
export function PanelShell({
  icon,
  eyebrow,
  qualifier,
  title,
  badge,
  trailing,
  align = "center",
  children,
}: {
  /** Rendered inside the accent tile. A 20px lucide icon. */
  icon: ReactNode;
  /** The uppercase label above the title: what kind of thing this is. */
  eyebrow: string;
  /** Optional monospace note beside the eyebrow — a figure, an article number, a target. */
  qualifier?: string;
  title: string;
  /** Optional trailing element in the eyebrow row, e.g. a TierBadge. */
  badge?: ReactNode;
  /** Optional second element in the header band — a control, a legend, a headline figure. */
  trailing?: ReactNode;
  /** `start` where the header carries a tall trailing element that should top-align. */
  align?: "center" | "start";
  children: ReactNode;
}) {
  return (
    <div className="my-6 sm:my-8 bg-card border border-line rounded-2xl shadow-sm overflow-hidden not-prose">
      <div
        className={`p-4 sm:p-5 border-b border-line bg-paper/50 flex flex-col sm:flex-row justify-between gap-3 ${
          align === "start" ? "sm:items-start" : "sm:items-center"
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center font-bold shrink-0">
            {icon}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="t-label font-extrabold uppercase tracking-widest text-accent bg-accent/10 px-2 py-0.5 rounded">
                {eyebrow}
              </span>
              {qualifier && <span className="t-label font-mono font-bold text-muted">{qualifier}</span>}
              {badge}
            </div>
            <h4 className="font-serif text-base sm:text-lg font-bold text-ink mt-1">{title}</h4>
          </div>
        </div>
        {trailing}
      </div>

      {children}
    </div>
  );
}
