import React from "react";
import { Table2, ListTree, GitBranch } from "lucide-react";

import { parseAsciiDiagram, type Diagram } from "../../lib/ascii-diagram";
import { DiagramViewer } from "./DiagramViewer";

/**
 * Renders the proposal's 102 ASCII box-drawing diagrams as real layout.
 *
 * The parse is gated on losslessness (see lib/ascii-diagram.ts), so a block is either upgraded
 * with every figure intact or left as the original `<pre>`. Nothing here transcribes content —
 * it re-presents what the parser read.
 *
 * Server component. The parse, the tables and the key/value cards stay on the server; only the
 * panel path — the drawings that cannot be reflowed, and so have to be scaled or opened full
 * screen — hands off to a client component for that reading surface.
 */

/**
 * Monospace is for figures, not for prose that happens to open with a digit. A whole sentence
 * set in mono reads worse than the same sentence in the body face, so the test is deliberately
 * narrow: short, and mostly digits.
 */
/**
 * These diagrams are box-drawing art, so their text never went through the markdown parser —
 * which left 204 runs of `**bold**` across 29 blocks rendering as literal asterisks once the
 * blocks became real tables. The markers are formatting, not content: emphasis is applied and
 * the delimiters drop out, exactly as they would anywhere else in the document.
 */
function withEmphasis(text: string): React.ReactNode {
  if (!text.includes("**")) return text;
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) =>
    /^\*\*[^*]+\*\*$/.test(part) ? (
      <strong key={i} className="font-bold text-ink">
        {part.slice(2, -2)}
      </strong>
    ) : (
      // A run that opens on one line of the diagram and closes on the next leaves an unpaired
      // marker in each cell. The emphasis cannot span table rows, but the stray asterisks must
      // not survive into the page either.
      part.replace(/\*\*/g, "")
    )
  );
}

function isFigure(raw: string): boolean {
  // Measure the visible text, not the emphasis markers — "**1**" is a figure, "1" with four
  // asterisks bolted on is not, and the ratio test cannot tell them apart otherwise.
  const text = raw.replace(/\*\*/g, "");
  if (!text || text.length > 26) return false;
  const digits = (text.match(/\d/g) ?? []).length;
  return digits > 0 && digits / text.length > 0.3;
}

function Frame({
  title,
  icon: Icon,
  kind,
  children,
}: {
  title?: string;
  icon: typeof Table2;
  kind: string;
  children: React.ReactNode;
}) {
  return (
    <figure className="bleed-narrow my-6 not-prose border border-line rounded-2xl bg-card overflow-hidden shadow-sm print:break-inside-avoid">
      <figcaption className="flex items-center gap-2 px-4 py-2.5 bg-paper/60 border-b border-line">
        <Icon size={13} className="text-accent shrink-0" aria-hidden="true" />
        {title ? (
          <span className="t-small sm:text-xs font-bold text-ink leading-tight">{title}</span>
        ) : (
          <span className="t-label font-black uppercase tracking-widest text-muted">{kind}</span>
        )}
      </figcaption>
      {children}
    </figure>
  );
}

function DiagramTable({ d }: { d: Extract<Diagram, { kind: "table" }> }) {
  const width = Math.max(...d.rows.map((r) => r.reduce((n, c) => n + c.spans, 0)), d.headers?.length ?? 0);

  return (
    <Frame title={d.title} icon={Table2} kind="Matrix">
      {/*
        ONE TABLE, TWO SHAPES.

        This used to mount a card stack for phones and a table for everything else, both at once
        and both in the DOM — thirty of these blocks paying twice for markup only one of which is
        ever visible. It also could not be fixed by branching in JavaScript without making this a
        client component, which would put the parser's output into the bundle.

        So the table stacks itself instead. Below `md` each row becomes a block and each cell
        carries its column header in a `data-label`, printed by CSS. One DOM, no JavaScript, a
        real <table> for a screen reader at every width, and nothing rendered that is not shown.

        Where a column has no header the label is simply absent. It used to fall back to
        "Item 2" / "Item 3", which put invented column names on screen — visible in the one block
        in 3-strategy.md whose columns the parser cannot name.
      */}
      <div className="w-full md:overflow-x-auto">
        <table className="diagram-table w-full t-small border-collapse">
          {d.headers && (
            <thead>
              <tr className="bg-paper/70">
                {d.headers.map((h, i) => (
                  <th
                    key={i}
                    scope="col"
                    className="text-left px-3 py-2 font-black uppercase tracking-wider t-micro text-muted border-b border-line align-bottom"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody>
            {d.rows.map((row, i) => {
              const isBanner = row.length === 1 && row[0].spans > 1;
              return (
                <tr
                  key={i}
                  className={isBanner ? "bg-accent/[0.05]" : "border-b border-line/40 last:border-b-0"}
                  data-banner={isBanner ? "true" : undefined}
                >
                  {row.map((cell, j) => (
                    <td
                      key={j}
                      colSpan={cell.spans > 1 ? width : 1}
                      data-label={!isBanner && d.headers?.[j] ? d.headers[j] : undefined}
                      className={
                        isBanner
                          ? "px-3 py-1.5 font-black uppercase tracking-wider t-micro text-accent"
                          : `px-3 py-2 align-top leading-snug ${
                              j === 0 ? "font-semibold text-ink" : "text-muted"
                            } ${isFigure(cell.text) ? "tabular-nums font-mono font-semibold" : ""}`
                      }
                    >
                      {withEmphasis(cell.text)}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Frame>
  );
}

function DiagramKeyValue({ d }: { d: Extract<Diagram, { kind: "keyvalue" }> }) {
  return (
    <Frame title={d.title} icon={ListTree} kind="Summary">
      <dl className="divide-y divide-line/40">
        {d.items.map((item, i) => (
          <div key={i} className="flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-4 px-4 py-2.5">
            <dt className="t-small font-semibold text-ink sm:w-[15rem] sm:shrink-0 leading-snug">
              {withEmphasis(item.label)}
            </dt>
            <dd
              className={`t-small text-muted leading-snug ${
                isFigure(item.value) ? "font-mono tabular-nums font-semibold" : ""
              }`}
            >
              {withEmphasis(item.value)}
            </dd>
          </div>
        ))}
      </dl>
      {d.notes.length > 0 && (
        <div className="px-4 py-2.5 border-t border-line/60 bg-paper/40 space-y-1">
          {d.notes.map((n, i) => (
            <p key={i} className="t-label sm:t-small text-muted leading-relaxed">
              {n}
            </p>
          ))}
        </div>
      )}
    </Frame>
  );
}

/**
 * Six blocks in the proposal are a box with a title in it and nothing else — a banner drawn in
 * ASCII, directly under the heading that already says the same thing. Framed as a diagram they
 * render as a captioned card sitting on an empty well, which reads as a figure that failed to
 * load. The words are still content, so they are kept; what goes is the hollow box around them.
 */
function DiagramBanner({ title }: { title: string }) {
  return (
    // The label wraps — these titles run to 50 characters, which is more than one phone line —
    // so the rule sits under the whole block rather than beside it, where a wrap would leave it
    // stranded as a stray dash against the first line.
    <div className="not-prose my-5 pb-1.5 border-b border-line print:break-inside-avoid">
      <span className="t-label font-black uppercase tracking-wider sm:tracking-widest text-muted break-words">
        {withEmphasis(title)}
      </span>
    </div>
  );
}

/**
 * Flow diagrams, branch trees and side-by-side comparisons. Here the monospace grid IS the
 * drawing — reflowing it would destroy the diagram — so the body is preserved exactly. What
 * changes is the frame: the title comes out of its box and becomes a real caption, the block
 * gets a card instead of a bare code well, and the scroll is contained.
 */
function DiagramPanel({ d }: { d: Extract<Diagram, { kind: "panel" }> }) {
  // A title-only banner: the frame would wrap an empty well, so it becomes a rule instead.
  if (d.title && !d.body.trim()) return <DiagramBanner title={d.title} />;

  return (
    <Frame title={d.title} icon={GitBranch} kind="Diagram">
      <DiagramViewer title={d.title} body={d.body} />
    </Frame>
  );
}

export function AsciiDiagram({ source, children }: { source: string; children: React.ReactNode }) {
  const parsed = parseAsciiDiagram(source);

  if (!parsed) {
    // Unparsed — a USSD menu, a script, a code sample. Keep the original treatment.
    return (
      <div className="bleed-narrow my-6 rounded-2xl border border-line bg-paper/60 p-3 sm:p-4 overflow-hidden not-prose">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-line/40 t-label font-mono font-bold text-muted uppercase tracking-wider">
          <span>Architecture &amp; process model</span>
          <span className="hidden sm:inline">Diagram / script</span>
        </div>
        <div className="scroll-x max-w-full">
          <pre className="ascii-pre font-mono text-ink leading-snug m-0 p-0 whitespace-pre">
            {children}
          </pre>
        </div>
      </div>
    );
  }

  if (parsed.kind === "table") return <DiagramTable d={parsed} />;
  if (parsed.kind === "keyvalue") return <DiagramKeyValue d={parsed} />;
  return <DiagramPanel d={parsed} />;
}
