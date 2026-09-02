import React from "react";
import { Table2, ListTree, GitBranch } from "lucide-react";

import { parseAsciiDiagram, type Diagram } from "../../lib/ascii-diagram";

/**
 * Renders the proposal's 102 ASCII box-drawing diagrams as real layout.
 *
 * The parse is gated on losslessness (see lib/ascii-diagram.ts), so a block is either upgraded
 * with every figure intact or left as the original `<pre>`. Nothing here transcribes content —
 * it re-presents what the parser read.
 *
 * Server component: no interactivity, so none of this reaches the client bundle.
 */

/**
 * Monospace is for figures, not for prose that happens to open with a digit. A whole sentence
 * set in mono reads worse than the same sentence in the body face, so the test is deliberately
 * narrow: short, and mostly digits.
 */
function isFigure(text: string): boolean {
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
    <figure className="my-6 not-prose border border-line rounded-2xl bg-card overflow-hidden shadow-sm print:break-inside-avoid">
      <figcaption className="flex items-center gap-2 px-4 py-2.5 bg-paper/60 border-b border-line">
        <Icon size={13} className="text-accent shrink-0" aria-hidden="true" />
        {title ? (
          <span className="text-[11px] sm:text-xs font-bold text-ink leading-tight">{title}</span>
        ) : (
          <span className="text-[10px] font-black uppercase tracking-widest text-muted">{kind}</span>
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
      {/* The table scrolls inside its own frame; the page never scrolls sideways. */}
      <div className="overflow-x-auto">
        <table className="w-full text-[11px] sm:text-xs border-collapse min-w-[30rem]">
          {d.headers && (
            <thead>
              <tr className="bg-paper/70">
                {d.headers.map((h, i) => (
                  <th
                    key={i}
                    scope="col"
                    className="text-left px-3 py-2 font-black uppercase tracking-wider text-[9px] sm:text-[10px] text-muted border-b border-line align-bottom"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody>
            {d.rows.map((row, i) => {
              // A single full-width cell is a section header inside the body, not a data row.
              const isBanner = row.length === 1 && row[0].spans > 1;
              return (
                <tr key={i} className={isBanner ? "bg-accent/[0.05]" : "border-b border-line/40 last:border-b-0"}>
                  {row.map((cell, j) => (
                    <td
                      key={j}
                      colSpan={cell.spans > 1 ? width : 1}
                      className={
                        isBanner
                          ? "px-3 py-1.5 font-black uppercase tracking-wider text-[9px] sm:text-[10px] text-accent"
                          : `px-3 py-2 align-top leading-snug ${
                              j === 0 ? "font-semibold text-ink" : "text-muted"
                            } ${isFigure(cell.text) ? "tabular-nums font-mono" : ""}`
                      }
                    >
                      {cell.text}
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
            <dt className="text-[11px] sm:text-xs font-semibold text-ink sm:w-[15rem] sm:shrink-0 leading-snug">
              {item.label}
            </dt>
            <dd
              className={`text-[11px] sm:text-xs text-muted leading-snug ${
                isFigure(item.value) ? "font-mono tabular-nums" : ""
              }`}
            >
              {item.value}
            </dd>
          </div>
        ))}
      </dl>
      {d.notes.length > 0 && (
        <div className="px-4 py-2.5 border-t border-line/60 bg-paper/40 space-y-1">
          {d.notes.map((n, i) => (
            <p key={i} className="text-[10px] sm:text-[11px] text-muted leading-relaxed">
              {n}
            </p>
          ))}
        </div>
      )}
    </Frame>
  );
}

/**
 * Flow diagrams, branch trees and side-by-side comparisons. Here the monospace grid IS the
 * drawing — reflowing it would destroy the diagram — so the body is preserved exactly. What
 * changes is the frame: the title comes out of its box and becomes a real caption, the block
 * gets a card instead of a bare code well, and the scroll is contained.
 */
function DiagramPanel({ d }: { d: Extract<Diagram, { kind: "panel" }> }) {
  return (
    <Frame title={d.title} icon={GitBranch} kind="Diagram">
      <div className="overflow-x-auto px-3 py-3">
        <pre className="text-[10px] sm:text-[11px] font-mono leading-[1.45] text-ink m-0 p-0 whitespace-pre">
          {d.body}
        </pre>
      </div>
    </Frame>
  );
}

export function AsciiDiagram({ source, children }: { source: string; children: React.ReactNode }) {
  const parsed = parseAsciiDiagram(source);

  if (!parsed) {
    // Unparsed — a USSD menu, a script, a code sample. Keep the original treatment.
    return (
      <div className="my-6 rounded-2xl border border-line bg-paper/60 p-3 sm:p-4 overflow-hidden not-prose">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-line/40 text-[10px] font-mono font-bold text-muted uppercase tracking-wider">
          <span>Architecture &amp; process model</span>
          <span className="hidden sm:inline">Diagram / script</span>
        </div>
        <div className="overflow-x-auto max-w-full scrollbar-thin">
          <pre className="text-[11px] sm:text-xs font-mono text-ink leading-snug m-0 p-0 whitespace-pre">
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
