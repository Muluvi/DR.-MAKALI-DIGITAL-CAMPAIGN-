import { FIGURES } from "../../lib/data/figures";
import { formatFigure } from "../../lib/data/format";
import { FLOW_ACTS } from "../../lib/flow";

/**
 * The two display candidates side by side (brief §7.3): Bricolage Grotesque, first choice, with
 * optical size and width axes; Mona Sans, the alternative, with a wider width axis and no optical
 * size. Reading prose stays Newsreader in both; labels use the display family at a small size.
 * Every string is the document's own: the act, a section title, the register, a §3.1 sentence.
 */
const ACT = FLOW_ACTS[2];
const REGISTER = formatFigure(FIGURES["register.2026"]);

export function TypePair() {
  return (
    <div className="pf-type">
      {(
        [
          ["bricolage", "Bricolage Grotesque", "Variable: weight 200–800, width 75–100, optical size 12–96"],
          ["mona", "Mona Sans", "Variable: weight 200–900, width 75–125; no optical size"],
        ] as const
      ).map(([face, name, axes]) => (
        <section key={face} className="pf-type__col" data-face={face} aria-label={name}>
          <p className="pf-type__name">
            {name}
            <span>{axes}</span>
          </p>
          <p className="pf-type__numeral" aria-hidden="true">III</p>
          <p className="pf-type__act">{ACT.label}</p>
          <p className="pf-type__sec">3.1 The number it takes</p>
          <p className="pf-type__big pf-num">{REGISTER}</p>
          <p className="pf-type__label">registered voters, July 2026</p>
          <p className="pf-type__body">
            To eliminate subjective projections, the campaign&rsquo;s target metrics are anchored directly to official IEBC outcomes.
          </p>
          <p className="pf-type__ui">
            <span>Brief</span>
            <span>Full</span>
            <span className="pf-mono">KPI NW-01</span>
          </p>
        </section>
      ))}
    </div>
  );
}
