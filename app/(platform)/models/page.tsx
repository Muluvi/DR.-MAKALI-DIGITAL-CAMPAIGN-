import Link from "next/link";
import { PageHead } from "@/components/platform/PageHead";
import { MODELS } from "@/lib/models/catalogue";

export const metadata = { title: "Models | Kitui 2027", robots: { index: false, follow: false } };

const LIMITS = [
  "Each model is arithmetic on stated assumptions. It predicts nothing and promises nothing.",
  "Ward and constituency level only. No individual voter is scored or profiled, and no sensitive characteristic is an input.",
  "What you enter stays in your browser and in the link you share. Nothing is stored.",
  "Every model prints what it does not do beside its numbers.",
];

export default function ModelsHub() {
  const live = MODELS.filter((m) => m.status === "Live");
  const planned = MODELS.filter((m) => m.status === "Planned");
  return (
    <>
      <PageHead kicker="Models" title="Set the options, see the outcome" lead="Open to anyone with the link, signed in or not. Each model runs on the data the site already holds, so every outcome traces to a sourced figure and an assumption you can see." />

      <section aria-labelledby="live-models">
        <h2 id="live-models" className="sr-only">Models you can use now</h2>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {live.map((m) => (
            <li key={m.slug}>
              <Link href={`/models/${m.slug}`} className="plat-card group flex h-full flex-col p-5 transition-colors hover:border-accent">
                <span className="plat-chip plat-status-live self-start">Live</span>
                <h3 className="mt-3 font-serif text-xl text-ink group-hover:text-accent">{m.name}</h3>
                <p className="mt-1 text-[0.92rem] text-ink">{m.question}</p>
                <dl className="mt-4 space-y-2 text-[0.82rem]">
                  <div><dt className="font-semibold text-muted">You set</dt><dd className="text-ink">{m.inputs}</dd></div>
                  <div><dt className="font-semibold text-muted">You see</dt><dd className="text-ink">{m.outcome}</dd></div>
                  <div><dt className="font-semibold text-muted">It stands on</dt><dd className="text-muted">{m.data}</dd></div>
                </dl>
                <span className="mt-auto pt-4 text-[0.85rem] font-semibold text-ink underline">Open the model</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="plat-card mt-8 p-4 text-[0.9rem] leading-relaxed sm:p-5" aria-labelledby="model-limits">
        <h2 id="model-limits" className="font-serif text-xl text-ink">What every model carries</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-muted">{LIMITS.map((l) => <li key={l}>{l}</li>)}</ul>
      </section>

      <section className="mt-8 text-[0.9rem] leading-relaxed" aria-labelledby="planned-models">
        <h2 id="planned-models" className="font-serif text-xl text-ink">Still to build</h2>
        <p className="mt-2 max-w-2xl text-muted">Four more are planned on data the site already holds. They are listed so the set is complete; none has a page yet.</p>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {planned.map((m) => <li key={m.slug} className="rounded-xl border border-dashed border-line p-3"><span className="font-semibold text-ink">{m.name}.</span> <span className="text-muted">{m.question}</span></li>)}
        </ul>
        <p className="mt-6 max-w-2xl text-muted">A plain-language layer that sets a model&apos;s options from a sentence and explains the outcome is planned on top of these. It is not switched on: it needs a paid AI service and a usage ceiling first. When it is, it will read the model&apos;s result and cite the registry; it will never produce a number of its own, and every model will keep working without it.</p>
      </section>
    </>
  );
}
