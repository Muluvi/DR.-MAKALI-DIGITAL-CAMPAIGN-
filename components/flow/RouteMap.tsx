"use client";

import { ArrowDown } from "lucide-react";

import { useInView } from "../../hooks/use-in-view";
import { FLOW_ACTS, FLOW_SECTIONS, actOf, isAfterAct } from "../../lib/flow";
import { partOf, type TabId } from "../../lib/heading-slug";

/**
 * The route through the proposal, before the first chapter (streamline pass, November 2026).
 *
 * It replaces a panel of four slogans and a rail of the first six chapters, which named neither the
 * argument nor the decision. This is the argument's real shape: six parts, each the question it
 * answers, each with its chapters, and the decision as the last stop and the first button. Every
 * stop is a jump.
 *
 * Every word is read from lib/flow.ts and lib/heading-slug.ts: the parts, their questions and the
 * chapter names. Nothing is written for it, so it cannot fall out of step with the document.
 *
 * MOTION. The line draws down the route and each stop settles as it is reached, once. The server
 * HTML and reduced motion show the route complete (app/streamline.css).
 */
const PARTS = FLOW_ACTS.filter((a) => !isAfterAct(a.id));
const SHELVES = FLOW_ACTS.filter((a) => isAfterAct(a.id));

const chaptersOf = (actId: string) =>
  FLOW_SECTIONS.filter((s) => partOf(s.id as TabId) !== 0 && actOf(s.id as TabId).id === actId);

/** The chapter the last part closes on: the decision itself. */
const DECISION = chaptersOf(PARTS[PARTS.length - 1].id).at(-1)!;
/** The case, on one screen: the chapter straight after the route. */
const CASE = FLOW_SECTIONS.find((s) => s.id === "brief")!;

export function RouteMap({ onSelect }: { onSelect: (tab: TabId) => void }) {
  const [ref, inView] = useInView<HTMLElement>({ amount: 0.12, margin: "-6% 0px" }); // verify-figures-ignore: an observer threshold

  return (
    <section ref={ref} className="rm" data-in-view={inView ? "true" : "false"} aria-labelledby="rm-title">
      <header className="rm__head">
        <p className="rm__kicker">The route</p>
        <h2 id="rm-title" className="rm__title">
          {PARTS.length} questions, then one decision.
        </h2>
        <p className="rm__sub">
          Each chapter opens as one screen: what it concludes and the numbers behind it. Open any chapter for its evidence.
        </p>
        <div className="rm__actions">
          <button type="button" className="rm__cta" onClick={() => onSelect(DECISION.id as TabId)}>
            <span>Go to {DECISION.label.charAt(0).toLowerCase() + DECISION.label.slice(1)}</span>
            <ArrowDown size={15} aria-hidden="true" />
          </button>
          <button type="button" className="rm__cta rm__cta--quiet" onClick={() => onSelect(CASE.id as TabId)}>
            <span>{CASE.label}</span>
          </button>
        </div>
      </header>

      {/* On a wide screen with motion welcome, the route pins and travels sideways as the page
          scrolls (app/fx-suite.css, lib/fx/scroll.ts); everywhere else it is the vertical route. */}
      <div className="fx-hscroll" style={{ "--fx-h-n": PARTS.length } as React.CSSProperties}>
      <div className="fx-hscroll__pin">
      <ol className="rm__route fx-hscroll__track" style={{ "--rm-stops": PARTS.length } as React.CSSProperties}>
        {PARTS.map((part, i) => (
          <li key={part.id} className="rm__stop" style={{ "--rm-i": i } as React.CSSProperties}>
            <span className="rm__node" aria-hidden="true">{i + 1}</span>
            <div className="rm__body">
              <button type="button" className="rm__part" onClick={() => onSelect(part.opensOn)}>
                {part.label}
              </button>
              <p className="rm__q">{part.blurb}</p>
              <ul className="rm__chapters">
                {chaptersOf(part.id).map((c) => (
                  <li key={c.id}>
                    <button type="button" className="rm__chip" onClick={() => onSelect(c.id as TabId)}>
                      {c.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ol>
      <div className="fx-hscroll__meter" aria-hidden="true"><span /></div>
      </div>
      </div>

      <div className="rm__shelves">
        <p className="rm__kicker">After the proposal</p>
        <ul>
          {SHELVES.map((shelf) => (
            <li key={shelf.id}>
              <button type="button" className="rm__shelf" onClick={() => onSelect(shelf.opensOn)}>
                <strong>{shelf.label}</strong>
                <span>{shelf.blurb}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
