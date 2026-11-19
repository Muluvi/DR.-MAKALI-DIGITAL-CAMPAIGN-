import { Check, Minus } from "lucide-react";

import { BEFORE_AFTER, IDENTITY } from "../../lib/phone-showcase";
import { ExportableVisual } from "../visual/ExportableVisual";

/**
 * Before and after (visual upgrade, A5): the same handset, a post with no voter, ward, pillar or
 * ask beside one written to the plan, each coded against the four things every briefed post must
 * carry. The "before" is a labelled illustration; the "after" is the campaign's own pledge.
 */
type Side = (typeof BEFORE_AFTER)["before"] | (typeof BEFORE_AFTER)["after"];

function Post({ side, tone }: { side: Side; tone: "before" | "after" }) {
  const checks = side.checks as Record<string, string | null>;
  const hits = BEFORE_AFTER.criteria.filter((c) => checks[c.key]).length;
  return (
    <div className={`ba ba--${tone}`}>
      <p className="ba__label">{side.label}</p>
      <div className="ba__phone" role="img" aria-label={`${side.label}: ${side.text}`}>
        <div className="ba__bar" aria-hidden="true">
          <span className="ba__avatar">{IDENTITY.initials}</span>
          <span className="ba__name">{IDENTITY.displayName}</span>
        </div>
        <p className="ba__bubble">{side.text}</p>
      </div>
      <p className="ba__note">{side.note}</p>
      <ul className="ba__checks" aria-label={`${hits} of ${BEFORE_AFTER.criteria.length} carried`}>
        {BEFORE_AFTER.criteria.map((c, i) => {
          const v = checks[c.key];
          return (
            <li key={c.key} className="ba__check xv-rise" data-on={v ? "true" : "false"} style={{ "--i": i } as React.CSSProperties}>
              <span className="ba__mark" aria-hidden="true">{v ? <Check size={14} strokeWidth={2.5} /> : <Minus size={14} strokeWidth={2.5} />}</span>
              <span className="ba__k">{c.label}</span>
              <span className="ba__v">{v ?? "none"}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function BeforeAfter() {
  return (
    <ExportableVisual
      id="before-after-post"
      illustrative
      title="Same phone, same minute: one post gives the reader a reason, the other does not"
      note="Each post coded for the four things every briefed post must carry."
      source="The pledge is the campaign's own copy. The typical post is written for this comparison and is not a real post."
    >
      <div className="ba-pair">
        <Post side={BEFORE_AFTER.before} tone="before" />
        <Post side={BEFORE_AFTER.after} tone="after" />
      </div>
    </ExportableVisual>
  );
}
