/**
 * The flag a figure carries when the document disagrees with itself about what it is drawing.
 *
 * Hard rule 2 of this audit: where the content conflicts, the conflict is logged and shown — it is
 * not resolved by whoever happens to be drawing the figure. A chart that quietly picks one of two
 * stated figures is making an editorial decision in a place nobody will ever look for one, and the
 * reader has no way to know a choice was made at all.
 *
 * So the flag is deliberately plain and deliberately small. It says which conflict, in one line,
 * and it links to docs/visual-audit/CONFLICTS.md, where the disagreement is set out with both
 * versions and where it is reconciled. It never says which version is right.
 *
 * A server component: no state, no interaction, and it must be present in the HTML a reader with
 * JavaScript off receives, because that reader is exactly as entitled to know the figure is
 * disputed as anyone else.
 */
export function UnderReview({
  /** The conflict ids this figure is affected by, e.g. ["C-13"]. */
  ids,
  /** One line, in plain words: what is in dispute. Never which side is correct. */
  children,
  className = "",
}: {
  ids: string[];
  children: React.ReactNode;
  className?: string;
}) {
  if (ids.length === 0) return null;

  return (
    <p
      className={`not-prose flex items-start gap-2 rounded-lg border border-gold/40 bg-gold/[0.06] px-3 py-2 t-micro leading-snug text-ink ${className}`}
    >
      {/* Decorative: the sentence beside it already says "under review", so a screen reader that
          also announced this glyph would hear the status twice. */}
      <span aria-hidden="true" className="mt-[0.15em] inline-block h-2 w-2 shrink-0 rounded-full bg-gold" />
      <span>
        <strong className="font-bold text-gold">Under review ({ids.join(", ")}).</strong>{" "}
        {children}
      </span>
    </p>
  );
}
