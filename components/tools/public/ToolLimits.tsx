import type { ReactNode } from "react";

type Source = { label: string; href?: string };

/** The method, completeness and limits note that sits beside every planning tool's numbers. */
export function ToolLimits({ does, doesNot, sources }: { does: ReactNode; doesNot: string[]; sources: Source[] }) {
  return (
    <section className="plat-card mt-8 p-4 text-[0.9rem] leading-relaxed sm:p-5" aria-label="Method and limits">
      <h2 className="font-serif text-xl text-ink">Method and limits</h2>
      <p className="mt-2 text-muted">{does}</p>
      <h3 className="mt-4 font-semibold text-ink">What this does not do</h3>
      <ul className="mt-1 list-disc space-y-1 pl-5 text-muted">{doesNot.map((d) => <li key={d}>{d}</li>)}</ul>
      <h3 className="mt-4 font-semibold text-ink">Sources</h3>
      <ul className="mt-1 list-disc space-y-1 pl-5 text-muted">
        {sources.map((s) => <li key={s.label}>{s.href ? <a className="underline" href={s.href} rel="noreferrer" target="_blank">{s.label}</a> : s.label}</li>)}
      </ul>
    </section>
  );
}
