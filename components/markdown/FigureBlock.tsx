import type { ReactNode } from "react";

import type { Provenance } from "../../data/types";
import { ProvenanceLine } from "./ProvenanceLine";
import { SourceLine } from "./SourceLine";

/**
 * The card every sourced figure in this document sits in.
 *
 * The shell — accent bar, serif title, explanatory line, provenance footer — was copied into
 * seventeen components. Copied shells drift: some carried `not-prose` and some did not, so the
 * same card picked up the prose stylesheet's margins in some sections and not others.
 *
 * The more important reason to have it as a component: `provenance` is not optional. The
 * document's whole claim about itself is that every figure travels with its source, and a
 * convention each new file has to remember is a convention that will eventually be forgotten.
 * A figure whose provenance is genuinely a set of prose-detected names passes `sources` instead;
 * one whose sources are already rendered inside its own body passes `footer={false}` and says
 * why at the call site.
 */
export function FigureBlock({
  title,
  subtitle,
  provenance,
  sources,
  footer = true,
  children,
}: {
  title: string;
  /** The line under the title. Says what the reader is looking at, and what it does not claim. */
  subtitle?: ReactNode;
  /** Structured provenance: value, unit, source, date, granularity and tier travelling together. */
  provenance?: Provenance | Provenance[];
  /** Source names detected from prose, where no structured provenance exists. */
  sources?: string[];
  /** Set false only where the body already renders its own per-row provenance. */
  footer?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="not-prose bg-card border border-line rounded-2xl p-4 sm:p-5 shadow-sm my-6 print-avoid-break">
      <div className="flex items-center gap-2 mb-1">
        <span className="w-1.5 h-6 bg-accent rounded-full shrink-0" />
        <h4 className="font-serif text-sm font-bold text-ink">{title}</h4>
      </div>
      {subtitle && <p className="t-small text-muted mb-3 leading-relaxed pl-3.5">{subtitle}</p>}

      {children}

      {footer && provenance && <ProvenanceLine provenance={provenance} />}
      {footer && !provenance && sources && <SourceLine sources={sources} />}
    </div>
  );
}
