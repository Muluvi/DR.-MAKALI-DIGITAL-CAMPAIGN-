import { FLOW_ACTS } from "../../lib/flow";

/**
 * The one "where am I" signal: six dots for the six parts, the current one filled and the ones
 * already read half-filled. It replaces the section number, the "3 of 36" position, the act
 * numeral and the act counter, which said the same thing four ways and never agreed.
 *
 * The reference shelf sits after the argument, so it shows no dots.
 */
const PARTS = FLOW_ACTS.filter((a) => a.id !== "reference");

export function PartDots({ actId, className = "" }: { actId: string | null | undefined; className?: string }) {
  const current = PARTS.findIndex((a) => a.id === actId);
  if (current < 0) return null;
  return (
    <span className={`part-dots ${className}`} role="img" aria-label={`Part ${current + 1} of ${PARTS.length}: ${PARTS[current].label}`}>
      {PARTS.map((a, i) => (
        <span key={a.id} className="part-dots__dot" data-state={i === current ? "here" : i < current ? "passed" : "ahead"} title={a.label} />
      ))}
    </span>
  );
}
