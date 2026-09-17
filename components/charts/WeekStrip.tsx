"use client";

/**
 * The before-and-after week (§6A.2), and the engine loop that drives it (§6A.1).
 *
 * This is the most persuasive object in the proposal, and the reason is that it shows a change
 * costing the team nothing. Two strips of the same seven days: the same events, the same
 * photographs, the same people. What differs is which pillar each day serves, which language it
 * carries, and whether a Thursday ward visit leaves behind a commitment and a date.
 *
 * Deliberately schematic rather than a mock of his actual feed. The days are the observed
 * pattern, not a reproduction of specific posts, and §6A.2 marks it CONFIRM-before-showing for
 * exactly that reason: the version put in front of Dr. Mulu must be his real week, pulled from
 * the Week 1 export.
 */

const PILLARS = {
  P1: { label: "P1 · Where the money went", cls: "bg-accent text-paper border-accent" },
  P2: { label: "P2 · From poverty to wealth", cls: "bg-gold-solid text-white border-gold-solid" },
  P3: { label: "P3 · The economist explains", cls: "bg-ink text-paper border-ink" },
  P4: { label: "P4 · He came, and said he would", cls: "bg-accent/25 text-ink border-accent" },
  NONE: { label: "Unpillared", cls: "bg-ink/[0.06] text-muted border-line" },
} as const;

type PillarKey = keyof typeof PILLARS;

interface DayCell {
  day: string;
  pillar: PillarKey;
  lang: string;
  note: string;
  deficitWard?: boolean;
}

const BEFORE: DayCell[] = [
  { day: "Mon", pillar: "NONE", lang: "EN", note: "Church service, photos" },
  { day: "Tue", pillar: "NONE", lang: "EN", note: "Delegation, group photo" },
  { day: "Wed", pillar: "NONE", lang: "EN", note: "Committee, photo" },
  { day: "Thu", pillar: "NONE", lang: "EN", note: "Road inspection, photos" },
  { day: "Fri", pillar: "NONE", lang: "—", note: "Funeral, photos" },
  { day: "Sat", pillar: "NONE", lang: "EN", note: "Harambee, photos" },
  { day: "Sun", pillar: "NONE", lang: "—", note: "Church, photos" },
];

const AFTER: DayCell[] = [
  { day: "Mon", pillar: "P2", lang: "KAM", note: "One family's poultry income, one figure" },
  { day: "Tue", pillar: "P3", lang: "SWA", note: "What the ask costs the county, 45s vertical" },
  { day: "Wed", pillar: "P1", lang: "KAM", note: "What was released to Kitui, and whether it arrived" },
  { day: "Thu", pillar: "P4", lang: "KAM", note: "Ward named + one commitment + one date", deficitWard: true },
  { day: "Fri", pillar: "NONE", lang: "—", note: "Unchanged. Not every post is a campaign asset" },
  { day: "Sat", pillar: "P2", lang: "KAM", note: "One household, one income stream, one number", deficitWard: true },
  { day: "Sun", pillar: "P1", lang: "KAM", note: "A 12-week-old commitment, revisited" },
];

function Strip({ rows, heading }: { rows: DayCell[]; heading: string }) {
  return (
    <div>
      <p className="eyebrow-label mb-2">{heading}</p>
      <ul className="grid grid-cols-7 gap-1 sm:gap-1.5">
        {rows.map((d) => {
          const p = PILLARS[d.pillar];
          return (
            <li key={d.day} className="min-w-0">
              <div
                className={`rounded-lg border px-1 py-2 sm:px-1.5 sm:py-2.5 h-[5.5rem] sm:h-24 flex flex-col justify-between ${p.cls} ${
                  d.deficitWard ? "ring-2 ring-offset-1 ring-gold ring-offset-card" : ""
                }`}
              >
                {/* The three lines rank by weight, not by transparency. Fading t-micro text
                    onto a saturated pillar fill cost it the 4.5:1 floor — the language line
                    measured 2.36:1 — and black/bold/regular already separates them. */}
                <span className="t-micro font-black leading-none">{d.day}</span>
                <span className="t-micro font-bold leading-none">
                  {d.pillar === "NONE" ? "—" : d.pillar}
                </span>
                <span className="t-micro leading-none">{d.lang}</span>
              </div>
            </li>
          );
        })}
      </ul>
      <ul className="sr-only">
        {rows.map((d) => (
          <li key={d.day}>
            {d.day}: {PILLARS[d.pillar].label}, {d.lang}. {d.note}
            {d.deficitWard ? " Originates in a recognition-deficit ward." : ""}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function WeekStrip() {
  return (
    <section
      className="not-prose my-7 rounded-2xl border border-line bg-card overflow-hidden"
      style={{ boxShadow: "var(--shadow-2)" }}
      aria-labelledby="week-strip-title"
    >
      <div className="p-4 sm:p-5 pb-3">
        <p className="eyebrow-label">The content engine · §6A.2</p>
        <h4 id="week-strip-title" className="font-serif t-h4 font-black text-ink leading-tight mt-1">
          Same week. Same events. Different structure.
        </h4>
        <p className="t-small text-muted leading-relaxed mt-2">
          Seven days of the current output, and the same seven days under the production pillars.
          Nothing in the second row costs the team a new shoot.
        </p>
      </div>

      <div className="px-4 sm:px-5 pb-4 space-y-4">
        <Strip rows={BEFORE} heading="Now — a daily record, in English, unpillared" />
        <Strip rows={AFTER} heading="After — the same events, commissioned" />

        <div className="flex flex-wrap gap-x-4 gap-y-1.5 pt-1" aria-hidden="true">
          {(["P1", "P2", "P3", "P4"] as PillarKey[]).map((k) => (
            <span key={k} className="inline-flex items-center gap-1.5 t-micro text-muted">
              <span className={`w-2.5 h-2.5 rounded-sm border ${PILLARS[k].cls}`} />
              {PILLARS[k].label}
            </span>
          ))}
          <span className="inline-flex items-center gap-1.5 t-micro text-muted">
            <span className="w-2.5 h-2.5 rounded-sm ring-2 ring-gold" />
            Originates in a deficit ward
          </span>
        </div>
      </div>

      <div className="px-4 sm:px-5 py-3 border-t border-line/60 bg-paper/40">
        <p className="t-micro text-muted leading-relaxed">
          <strong className="text-ink">What changed:</strong> two fields on a Thursday post, and a
          language rule. <strong className="text-ink">What did not:</strong> who takes the
          photograph, who writes the caption, and who presses publish. The pattern shown is the
          observed one and is marked for confirmation against the Week 1 export before it is put in
          front of Dr. Mulu.
        </p>
      </div>
    </section>
  );
}

/**
 * The engine loop — why pillar four exists.
 *
 * A visit that leaves a dated commitment behind becomes a verification post twelve weeks later,
 * and that post is the one no rival can run. Drawn as a closed loop because the compounding is
 * the argument: the campaign accumulates evidence rather than repeating a claim.
 */
export function EngineLoop() {
  const stations = [
    { n: "1", t: "Visit", d: "Ward named, photo taken — the post the team already makes", tag: "P4" },
    { n: "2", t: "Commitment logged", d: "One commitment, one date, into the tracker", tag: "§8.2" },
    { n: "3", t: "~12 weeks", d: "The interval that makes the next post evidence rather than a claim", tag: "" },
    { n: "4", t: "Verification", d: "Delivered, delayed, or not done — published either way", tag: "P1" },
  ];

  return (
    <section
      className="not-prose my-7 rounded-2xl border border-line bg-card overflow-hidden"
      style={{ boxShadow: "var(--shadow-2)" }}
      aria-labelledby="engine-loop-title"
    >
      <div className="p-4 sm:p-5 pb-3">
        <p className="eyebrow-label">The content engine · §6A.1</p>
        <h4 id="engine-loop-title" className="font-serif t-h4 font-black text-ink leading-tight mt-1">
          Pillar four feeds pillar one
        </h4>
        <p className="t-small text-muted leading-relaxed mt-2">
          The loop is the engine. Everything else on the page is a bucket.
        </p>
      </div>

      <ol className="px-4 sm:px-5 pb-4 grid gap-2 sm:grid-cols-2">
        {stations.map((s, i) => (
          <li
            key={s.n}
            className="relative rounded-xl border border-line bg-paper/50 p-3 flex gap-3 items-start"
          >
            <span
              className="shrink-0 w-6 h-6 rounded-full bg-accent text-paper t-micro font-black grid place-items-center"
              aria-hidden="true"
            >
              {s.n}
            </span>
            <div className="min-w-0">
              <p className="t-small font-black text-ink leading-snug">
                {s.t}
                {s.tag ? <span className="ml-1.5 t-micro font-bold text-accent">{s.tag}</span> : null}
              </p>
              <p className="t-micro text-muted leading-relaxed mt-0.5">{s.d}</p>
            </div>
            {i === stations.length - 1 ? (
              <span className="absolute -bottom-px right-3 t-micro font-black text-accent" aria-hidden="true">
                ↻ back to 1
              </span>
            ) : null}
          </li>
        ))}
      </ol>

      <div className="px-4 sm:px-5 py-3 border-t border-line/60 bg-paper/40">
        <p className="t-micro text-muted leading-relaxed">
          A commitment with no date is not logged. A date that passes with no verification post is
          a gap the monthly review reads as a miss, not as a scheduling accident.
        </p>
      </div>
    </section>
  );
}
