import { CONTENDERS, MALOMBE_TERM_LIMIT_QUESTION } from "../../data/competitors";

/**
 * The wider competitor field (Section 4.10) — highest legal-risk section in the document.
 * Server component, deliberately plain: no adverse claim appears here that is not already
 * established, sourced, elsewhere in this document (electoral history, Section 4.2), and every
 * contender without additional sourced material says so explicitly rather than being padded
 * with unsourced biography. Malombe's term-limit status is stated as an open question with
 * both readings, never as a conclusion.
 */
export function CompetitorFieldPanel() {
  return (
    <div className="bg-card border border-line rounded-2xl p-4 sm:p-5 shadow-sm my-6 print-avoid-break">
      <div className="flex items-center gap-2 mb-1">
        <span className="w-1.5 h-6 bg-accent rounded-full shrink-0" />
        <h4 className="font-serif text-sm font-bold text-ink">The Wider Field</h4>
      </div>
      <p className="t-small text-muted mb-4 leading-relaxed pl-3.5">
        Every entry attributes what it states to a specific, already-cited part of this document. Nothing here asserts
        wrongdoing; nothing here is sourced to a single partisan outlet.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        {CONTENDERS.map((c, i) => (
          <div key={i} className="rounded-xl border border-line/60 bg-paper p-3">
            <div className="t-micro uppercase tracking-wider font-bold text-muted mb-0.5">{c.stage}</div>
            <div className="font-serif text-sm font-black text-ink">{c.name}</div>
            <div className="t-small text-ink/70 font-semibold mt-0.5">{c.position}</div>
            <p className="t-label text-muted italic mt-1.5 leading-relaxed">{c.note}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-line/60 bg-paper p-3">
        <div className="t-micro uppercase tracking-wider font-black text-ink mb-1.5">
          Open question: Governor Malombe&apos;s 2027 term-limit eligibility
        </div>
        <p className="text-xs text-ink/85 leading-relaxed">{MALOMBE_TERM_LIMIT_QUESTION}</p>
      </div>
    </div>
  );
}
