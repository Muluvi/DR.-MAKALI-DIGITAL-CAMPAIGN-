import { FLOW_ACTS, actOf, isAfterAct } from "../../lib/flow";
import { partOf, type TabId } from "../../lib/heading-slug";

/**
 * The one "where am I" signal: six dots for the six parts, the current one filled and the ones
 * already read half-filled. It replaces the section number, the "3 of 36" position, the act
 * numeral and the act counter, which said the same thing four ways and never agreed.
 *
 * The evidence shelf and the working platform sit after the argument, so they show no dots.
 */
const PARTS = FLOW_ACTS.filter((a) => !isAfterAct(a.id));

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

/**
 * The six stages of the story as one bar: the Welcome, then Data, Analysis, Objectives, Strategies
 * and Implementation (flow pass, WP7). It sits in the dock on every width, so a phone has the
 * stage progress the side rail gives a wide screen. The current stage is filled and longer, the ones
 * read are half-filled; on the evidence shelf, after the story, every stage reads as passed.
 */
const STAGES = [{ id: "welcome", label: "Welcome" }, ...PARTS.map((a) => ({ id: a.id, label: a.label }))];

export function StageBar({ tab, className = "" }: { tab: TabId; className?: string }) {
  const act = actOf(tab);
  const after = partOf(tab) !== 0 && isAfterAct(act.id);
  const current = partOf(tab) === 0 ? 0 : after ? STAGES.length : STAGES.findIndex((s) => s.id === act.id);
  const label = after ? `After the story: ${act.label}` : `Stage ${current + 1} of ${STAGES.length}: ${STAGES[current]?.label ?? ""}`;
  return (
    <span className={`part-dots stage-bar ${className}`} role="img" aria-label={label}>
      {STAGES.map((s, i) => (
        <span key={s.id} className="part-dots__dot" data-state={i === current ? "here" : i < current ? "passed" : "ahead"} title={s.label} />
      ))}
    </span>
  );
}
