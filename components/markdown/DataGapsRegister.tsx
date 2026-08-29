import { DATA_GAPS, type AcquisitionRoute } from "../../data/data-gaps";

const ROUTE_STYLE: Record<AcquisitionRoute, string> = {
  "Official request": "bg-accent/10 text-accent border-accent/30",
  Purchase: "bg-gold/10 text-gold border-gold/30",
  "Primary research": "bg-line/40 text-ink border-line",
};

/**
 * Data Gaps Register (Appendix C) — a deliverable, not an apology. Scopes the research the
 * campaign would be buying next. Server component, no chart, no client cost.
 */
export function DataGapsRegister() {
  return (
    <div className="bg-card border border-line rounded-2xl p-4 sm:p-5 shadow-sm my-6 print-avoid-break">
      <div className="flex items-center gap-2 mb-1">
        <span className="w-1.5 h-6 bg-accent rounded-full shrink-0" />
        <h4 className="font-serif text-sm font-bold text-ink">Data Gaps Register</h4>
      </div>
      <p className="text-[11px] text-muted mb-4 leading-relaxed pl-3.5">
        {DATA_GAPS.length} tracked gaps. Every figure in this document that could not be completed is named here
        rather than filled in — this table is the acquisition plan, not a disclaimer.
      </p>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-[11px]">
          <thead>
            <tr className="text-[9px] uppercase tracking-wider font-bold text-muted">
              <th className="py-1 pr-3">Dataset</th>
              <th className="py-1 pr-3">Why it matters</th>
              <th className="py-1">Acquisition route</th>
            </tr>
          </thead>
          <tbody>
            {DATA_GAPS.map((g, i) => (
              <tr key={i} className="border-t border-line/40 align-top">
                <td className="py-2 pr-3 font-bold text-ink whitespace-nowrap">{g.dataset}</td>
                <td className="py-2 pr-3 text-ink/75 leading-relaxed">{g.whyItMatters}</td>
                <td className="py-2">
                  <span className={`inline-block px-2 py-0.5 rounded-full border text-[9px] font-black uppercase tracking-wider whitespace-nowrap ${ROUTE_STYLE[g.acquisitionRoute]}`}>
                    {g.acquisitionRoute}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
