import { analysisExport } from "../../data/analysis-exports";
import { AnalysisFigure } from "./AnalysisFigure";

/**
 * The pipeline's published exports, mounted into the sections they belong to.
 *
 * Each block pairs the figures with the finding they support, because the numbers alone do
 * not carry the argument — the reason the polling block matters is not that three polls
 * exist, it is that two of them cannot be compared.
 *
 * Nothing here hard-codes a figure. Every number comes from data/analysis/*.json, which the
 * pipeline writes and re-writes; to change what this renders, re-run the pipeline.
 */

/** §3.1.5 — the polling gap, as sourced. */
export function PollMarginsBlock() {
  return (
    <AnalysisFigure
      chart={analysisExport("published-polls-2026")}
      heading="Three polls, two pollsters, one published sample size"
    >
      <p className="mt-3 pt-2 border-t border-line/40 t-small text-muted leading-relaxed">
        <strong className="text-ink">What the margins allow.</strong> Politrack published its
        sample, so its gap can be tested: at that size the nine-point March gap sits well outside
        its own margin of error and is real. Neither Mizani round published a sample size, so the
        June-to-August movement in Dr. Mulu&rsquo;s share cannot be tested at all — the honest
        answer is <em>cannot determine</em>, not a trend. June also excluded Ngilu while August
        included her, so part of any apparent movement is a changed field rather than changed
        opinion.
      </p>
    </AnalysisFigure>
  );
}

/** §3.4.1 — which register the arithmetic rests on. */
export function RegisterComparisonBlock() {
  return (
    <AnalysisFigure
      chart={analysisExport("register-comparison")}
      heading="Which register figure the arithmetic rests on"
    >
      <p className="mt-3 pt-2 border-t border-line/40 t-small text-muted leading-relaxed">
        <strong className="text-ink">The two 2026 figures do not agree with each other.</strong>{" "}
        Adding the reported new registrations to the 2022 register gives one total; the reported
        July 2026 county total gives another. Both come from single aggregator sites, neither from
        IEBC, and the gap between them is larger than several wards. The commission&rsquo;s own
        county annex is the document that settles it, and until it is in hand every 2027 projection
        should state which register it used.
      </p>
    </AnalysisFigure>
  );
}

/** §3.4.2 — the scenario model, against the 2022 benchmark. */
export function ScenarioBenchmarkBlock() {
  return (
    <AnalysisFigure
      chart={analysisExport("scenario-benchmarks")}
      heading="What the ward arithmetic yields, under stated assumptions"
      plot={false}
    >
      <p className="mt-3 pt-2 border-t border-line/40 t-small text-muted leading-relaxed">
        <strong className="text-ink">Two scenarios, because one cannot answer the question.</strong>{" "}
        The first applies his current measured preference — a nomination-poll share — to the ward
        register, and falls well short of the 2022 benchmark. The second applies the share the 2022
        winner actually took, and reaches it in a minority of runs. The distance between those two
        answers is the work: it is the difference between where measured support sits today and
        what winning this county has required.
      </p>
    </AnalysisFigure>
  );
}

/** §3.6.1 — the connected minority, and its limits. */
export function ChannelReachBlock() {
  return (
    <AnalysisFigure
      chart={analysisExport("channel-reach")}
      heading="How many voters each channel can physically reach"
    >
      <p className="mt-3 pt-2 border-t border-line/40 t-small text-muted leading-relaxed">
        <strong className="text-ink">The SMS layer is larger than the digital one, and it cannot
        carry Kikamba.</strong> More voters own a phone without using the internet than use the
        internet at all, and more again own no phone whatsoever. The CA and NCIC guidelines limit
        bulk political SMS to English or Kiswahili, with messages lodged with the operator two days
        ahead and subject to refusal — so the channel that reaches the largest addressable group is
        also the one that cannot speak its first language, and cannot respond quickly.
      </p>
    </AnalysisFigure>
  );
}

/** §7.1.1 — the evidence behind each pillar. */
export function IssueEvidenceBlock() {
  return (
    <AnalysisFigure
      chart={analysisExport("issue-evidence")}
      heading="The evidence behind each pillar"
    >
      <p className="mt-3 pt-2 border-t border-line/40 t-small text-muted leading-relaxed">
        <strong className="text-ink">This ranks the evidence, not the electorate.</strong> It scores
        how strong the public record is for each issue — the tier of the source, whether the
        indicator is a number or a description, and whether it covers the whole county. Water leads
        because Kitui is the worst county in Kenya on an official measure, not because anyone has
        yet asked Kitui voters what they care about. Measured salience needs the baseline survey,
        and the second axis of a proper issue matrix — the candidate&rsquo;s credibility on each
        issue — has no public substitute at all.
      </p>
    </AnalysisFigure>
  );
}
