"use client";

import { useInView } from "../../hooks/use-in-view";
import { FLOW_ACTS, FLOW_SECTIONS, actOf, isAfterAct } from "../../lib/flow";
import { partOf, type TabId } from "../../lib/heading-slug";

/**
 * The route through the story, before the first chapter (flow pass, November 2026).
 *
 * Six stages, in the order the site is built: the Welcome, then Data, Analysis, Objectives,
 * Strategies and Implementation (docs/flow-2026-11/FLOW-PLAN.md, D1). Each stage names the question
 * it answers and lists its chapters; every stop is a jump. The evidence shelf follows the story.
 *
 * Every word is read from lib/flow.ts and lib/heading-slug.ts: the stages, their questions and the
 * chapter names. The Welcome has no act opener of its own (its chapters are part 0), so its stage
 * is named for itself and takes its question from the welcome chapter's blurb. Nothing else is
 * written for it, so it cannot fall out of step with the document.
 *
 * MOTION. The line draws down the route and each stop settles as it is reached, once. The server
 * HTML and reduced motion show the route complete (app/story.css).
 */
const WELCOME_CHAPTERS = FLOW_SECTIONS.filter((s) => partOf(s.id as TabId) === 0);

const chaptersOf = (actId: string) =>
  FLOW_SECTIONS.filter((s) => partOf(s.id as TabId) !== 0 && actOf(s.id as TabId).id === actId);

interface Stage {
  id: string;
  label: string;
  blurb: string;
  opensOn: TabId;
  chapters: typeof FLOW_SECTIONS;
}

const STAGES: Stage[] = [
  {
    id: "welcome",
    label: "Welcome",
    blurb: WELCOME_CHAPTERS[0].blurb,
    opensOn: WELCOME_CHAPTERS[0].id as TabId,
    chapters: WELCOME_CHAPTERS,
  },
  ...FLOW_ACTS.filter((a) => !isAfterAct(a.id)).map((a) => ({ id: a.id, label: a.label, blurb: a.blurb, opensOn: a.opensOn, chapters: chaptersOf(a.id) })),
];
const SHELVES = FLOW_ACTS.filter((a) => isAfterAct(a.id));

/** The case, on one screen. */
const CASE = FLOW_SECTIONS.find((s) => s.id === "brief")!;

export function RouteMap({ onSelect }: { onSelect: (tab: TabId) => void }) {
  const [ref, inView] = useInView<HTMLElement>({ amount: 0.12, margin: "-6% 0px" }); // verify-figures-ignore: an observer threshold

  return (
    <section ref={ref} className="rm" data-in-view={inView ? "true" : "false"} aria-labelledby="rm-title">
      <header className="rm__head">
        <p className="rm__kicker">The route</p>
        <h2 id="rm-title" className="rm__title">
          Six stages, from the data to the work.
        </h2>
        <p className="rm__sub">
          Each chapter opens as one screen: what it concludes and the numbers behind it. Open any chapter for its evidence.
        </p>
        <div className="rm__actions">
          <button type="button" className="rm__cta rm__cta--quiet" onClick={() => onSelect(CASE.id as TabId)}>
            <span>{CASE.label}</span>
          </button>
        </div>
      </header>

      <ol className="rm__route" style={{ "--rm-stops": STAGES.length } as React.CSSProperties}>
        {STAGES.map((stage, i) => (
          <li key={stage.id} className="rm__stop" style={{ "--rm-i": i } as React.CSSProperties}>
            <span className="rm__node" aria-hidden="true">{i + 1}</span>
            <div className="rm__body">
              <button type="button" className="rm__part" onClick={() => onSelect(stage.opensOn)}>
                {stage.label}
              </button>
              <p className="rm__q">{stage.blurb}</p>
              <ul className="rm__chapters">
                {stage.chapters.map((c) => (
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

      <div className="rm__shelves">
        <p className="rm__kicker">After the story</p>
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
