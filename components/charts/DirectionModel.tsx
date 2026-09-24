"use client";


/**
 * The week, and the recognition ladder (§5.7.1, §5.6.4).
 *
 * Two figures that carry the shape of the engagement rather than its content.
 *
 * The first is the operating week. It replaces a bullet list, a meeting table and an
 * eighty-line governance chart with one object, and it does the one thing prose kept failing to
 * do on this point: show that five of seven days belong to the team, and that Firefly's week is
 * a brief, a call and a check. Publishing days are shaded in the team's colour deliberately — a
 * diagram that coloured them Firefly's would re-state the takeover the repositioning removes.
 *
 * The second is the measurement re-anchor. Follower counts are excluded from this document by
 * §5.6.7; this is what replaces them. It is drawn empty against a target line at 70%, because
 * the baseline is a Week 1 instrument and inventing a starting point would be the same failure
 * the ladder exists to prevent.
 */

interface WeekPoint {
  day: string;
  owner: "firefly" | "team" | "both";
  label: string;
  detail: string;
}

const WEEK: WeekPoint[] = [
  { day: "Thu", owner: "firefly", label: "The brief", detail: "One page, 16:00. Pillar weights, must-post items, ward priority, language rule, one thing to stop" },
  { day: "Fri", owner: "team", label: "The calendar", detail: "Your team returns the week, mapped to the brief. Firefly comments; it does not rewrite" },
  { day: "Mon", owner: "both", label: "Thirty minutes", detail: "Approve, amend, flag. The only standing meeting in the engagement" },
  { day: "Tue", owner: "team", label: "Publishing", detail: "Your accounts, your credentials" },
  { day: "Wed", owner: "firefly", label: "One number", detail: "Mid-week reach check against the deficit wards. At most one adjustment — and none if none is needed" },
  { day: "Thu–Sun", owner: "team", label: "Publishing", detail: "Your accounts, your credentials" },
];

const OWNER_STYLE = {
  firefly: { cls: "border-accent bg-accent/10", dot: "bg-accent", who: "Firefly" },
  team: { cls: "border-line bg-ink/[0.04]", dot: "bg-ink/50", who: "Your team" },
  both: { cls: "border-gold bg-gold/10", dot: "bg-gold", who: "Both" },
} as const;

export function DirectionWeek() {
  return (
    <section
      className="not-prose my-7 rounded-2xl border border-line bg-card overflow-hidden"
      style={{ boxShadow: "var(--shadow-2)" }}
      aria-labelledby="direction-week-title"
    >
      <div className="p-4 sm:p-5 pb-3">
        <p className="eyebrow-label">The direction model · §5.7.1</p>
        <h4 id="direction-week-title" className="font-serif t-h4 font-black text-ink leading-tight mt-1">
          Firefly steers. Your team publishes.
        </h4>
        <p className="t-small text-muted leading-relaxed mt-2">
          One brief a week holds it together. Five of the seven days are your team&rsquo;s.
        </p>
      </div>

      <ol className="px-4 sm:px-5 pb-4 space-y-2">
        {WEEK.map((p) => {
          const s = OWNER_STYLE[p.owner];
          return (
            <li key={p.day + p.label} className={`rounded-xl border ${s.cls} p-3 flex gap-3 items-start`}>
              <span className="shrink-0 w-14 t-micro font-black text-ink tabular-nums pt-0.5">{p.day}</span>
              <div className="min-w-0 flex-1">
                <p className="t-small font-black text-ink leading-snug">{p.label}</p>
                <p className="t-micro text-muted leading-relaxed mt-0.5">{p.detail}</p>
              </div>
              <span className="shrink-0 inline-flex items-center gap-1.5 t-micro font-bold text-muted pt-0.5">
                <span className={`w-2 h-2 rounded-full ${s.dot}`} aria-hidden="true" />
                {s.who}
              </span>
            </li>
          );
        })}
      </ol>

      <div className="px-4 sm:px-5 py-3 border-t border-line/60 bg-paper/40">
        <p className="t-micro text-muted leading-relaxed">
          <strong className="text-ink">Firefly publishes on one channel only</strong> — the SMS,
          USSD and WhatsApp layer it operates (§5.2.3.3). Every owned account stays with the people
          who run it now. Monthly, on the last Friday: recognition indicators, the overrides log,
          and the brief re-based on what the month proved.
        </p>
      </div>
    </section>
  );
}

