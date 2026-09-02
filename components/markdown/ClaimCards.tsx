import React from "react";

function cellsOfType(node: React.ReactNode, type: string): React.ReactElement[] {
  return (React.Children.toArray(node) as React.ReactElement[]).filter((c) => c?.type === type);
}

/**
 * Converts a 3-column table (assertion / evidence / application) into cards — assertion above,
 * evidence beneath — reusing the actual parsed table cells directly rather than duplicating
 * their content, so the cards can never drift from the source table.
 */
export function ClaimCards({ children }: { children: React.ReactNode }) {
  const top = React.Children.toArray(children) as React.ReactElement[];
  const thead = top.find((c) => c?.type === "thead");
  const tbody = top.find((c) => c?.type === "tbody");
  if (!thead || !tbody) {
    return <div className="overflow-x-auto border border-line rounded-2xl my-4">{children}</div>;
  }

  const headerRow = cellsOfType((thead.props as { children?: React.ReactNode }).children, "tr")[0];
  const headers = headerRow ? cellsOfType((headerRow.props as { children?: React.ReactNode }).children, "th") : [];
  const rows = cellsOfType((tbody.props as { children?: React.ReactNode }).children, "tr");

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6 not-prose">
      {rows.map((row, i) => {
        const cells = cellsOfType((row.props as { children?: React.ReactNode }).children, "td");
        return (
          <div key={i} className="claim-card bg-card border border-line rounded-2xl p-4 shadow-sm print-avoid-break">
            {cells[0] && (
              <>
                {headers[0] && (
                  <div className="t-micro uppercase tracking-widest font-black text-accent mb-1">
                    {(headers[0].props as { children?: React.ReactNode }).children}
                  </div>
                )}
                <div className="font-serif text-sm font-black text-ink mb-3 leading-snug">
                  {(cells[0].props as { children?: React.ReactNode }).children}
                </div>
              </>
            )}
            {cells[1] && (
              <div className="pt-3 border-t border-line/40">
                {headers[1] && (
                  <div className="t-micro uppercase tracking-widest font-black text-muted mb-1">
                    {(headers[1].props as { children?: React.ReactNode }).children}
                  </div>
                )}
                <div className="text-xs text-ink/80 leading-relaxed">{(cells[1].props as { children?: React.ReactNode }).children}</div>
              </div>
            )}
            {cells[2] && (
              <div className="mt-3 pt-3 border-t border-line/40">
                {headers[2] && (
                  <div className="t-micro uppercase tracking-widest font-black text-muted mb-1">
                    {(headers[2].props as { children?: React.ReactNode }).children}
                  </div>
                )}
                <div className="text-xs text-ink/80 leading-relaxed">{(cells[2].props as { children?: React.ReactNode }).children}</div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
