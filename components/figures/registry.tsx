import { PanelFold } from "../markdown/PanelFold";
import { RegisterFigure } from "../register/Figure";
import { STORY_FIGURES } from "../../lib/premium/story";
import { REGISTER } from "../../lib/register/specs";

/**
 * One figure per id, resolved by name from the markdown.
 *
 * WHY A REGISTRY AND NOT A HEADING MAP. HEADING_INSERTS in MarkdownViewer keys a component to a
 * heading id, which puts every figure at the top of its subsection whether or not that is where
 * the argument needs it. A ```figure fence puts the figure exactly where the prose reaches it —
 * which is what lets an ASCII diagram be replaced IN PLACE rather than lifted to the heading and
 * leaving a hole behind.
 *
 * Every figure is a FigureSpec in the register (lib/register/specs), which draws the chart, the
 * table view and the CSV from one record. The legacy figures that used to be drawn here from
 * lib/figures/* are register specs now (lib/register/specs/s7-reference.ts, consolidation
 * follow-up). No bespoke component figure remains.
 *
 * An id that is in neither renders a visible, honest placeholder rather than nothing. Silence
 * would mean a fence typo removes a figure and no one finds out until a reader does.
 */

type FigureEntry = { render: () => React.ReactNode; note: string };

export const FIGURES: Record<string, FigureEntry> = {};

/**
 * Where §3.1–§3.4 would have drawn a figure the §3 story now carries: one line that names the
 * figure and links up to the step that holds it, with its sources, table and CSV.
 */
function StoryPointer({ spec }: { spec: { id: string; title: string; section: string } }) {
  return (
    <p className="pf-storyptr not-prose">
      <a href={`#${spec.id}`}>
        <span className="pf-storyptr__k">Figure</span>
        <span className="pf-storyptr__t">{spec.title}</span>
        <span className="pf-storyptr__h">In the four-step story at the start of this part, with its sources, table and CSV</span>
      </a>
    </p>
  );
}

/**
 * Legacy figures collapsed into the register figure that already drew the same facts (consolidation
 * pass, Step 3). The fence stays where it was, so every check keyed on it holds, and renders a
 * pointer to the surviving figure. Each is also recorded in scripts/figure-retirements.json.
 */
const COLLAPSED: Record<string, { into: string; route: string; hint: string }> = {
  "nomination-scorecard": { into: "fig-5-6-kpis", route: "success", hint: "Drawn once, above, with every indicator, its baseline, target, method and owner" },
  "ge-scorecard": { into: "fig-5-6-kpis", route: "success", hint: "Drawn once, above, with every indicator, its baseline, target, method and owner" },
  "fig-5-1-workstreams": { into: "fig-5-2-workstream-panels", route: "workstreams", hint: "Drawn once, in The workstreams, with every workstream, its group and its owner" },
};

function CollapsedPointer({ spec, route, hint }: { spec: { id: string; title: string }; route: string; hint: string }) {
  return (
    <p className="pf-storyptr not-prose">
      <a href={`/${route}#${spec.id}`}>
        <span className="pf-storyptr__k">Figure</span>
        <span className="pf-storyptr__t">{spec.title}</span>
        <span className="pf-storyptr__h">{hint}</span>
      </a>
    </p>
  );
}

/**
 * The fence's renderer.
 *
 * An unknown id is drawn as a visible gap rather than silently dropped: a typo in a fence would
 * otherwise remove a figure from the document and nobody would find out until a reader did.
 */
export function Figure({ id }: { id: string }) {
  // The brief's figure register (lib/register/specs) is looked up first: one spec draws the chart,
  // the table view and the CSV.
  const collapsed = COLLAPSED[id];
  const survivor = collapsed ? REGISTER[collapsed.into] : undefined;
  if (collapsed && survivor) return <CollapsedPointer spec={survivor} route={collapsed.route} hint={collapsed.hint} />;
  const spec = REGISTER[id];
  if (spec && STORY_FIGURES.has(id)) return <StoryPointer spec={spec} />;
  if (spec) return <RegisterFigure spec={spec} />;
  const entry = FIGURES[id];
  if (!entry) {
    return (
      <p className="not-prose my-4 rounded-lg border border-dashed border-gold/60 bg-gold/[0.06] px-3 py-2 t-micro text-ink">
        <strong className="font-bold text-gold">Figure not found:</strong>{" "}
        <code>{id}</code> is not in the figure register (lib/register/specs) or the figure registry (components/figures/registry.tsx).
      </p>
    );
  }
  // A bespoke panel goes behind the panel control like every other mounted panel.
  return <PanelFold>{entry.render()}</PanelFold>;
}
