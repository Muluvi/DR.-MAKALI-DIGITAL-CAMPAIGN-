/**
 * The label every mockup carries (brief G-10, O-8, approved 24 September 2026): a screen, handset,
 * terminal or sandbox drawn to show how something would work is an illustration, and says so
 * where the reader looks first. It claims nothing exists.
 */
export function IllustrativeTag({ className = "" }: { className?: string }) {
  return (
    <p className={`pf-illus ${className}`}>
      <span aria-hidden="true" className="pf-illus__mark" />
      Illustrative mockup · not a live system
    </p>
  );
}
