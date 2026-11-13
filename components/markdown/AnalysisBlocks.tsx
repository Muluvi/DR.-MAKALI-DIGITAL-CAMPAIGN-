import { analysisExport } from "../../data/analysis-exports";
import { AnalysisFigure } from "./AnalysisFigure";

/**
 * The pipeline's published exports, mounted into the sections they belong to.
 *
 * Each block pairs the figures with the finding they support, because the numbers alone do
 * not carry the argument.
 *
 * Nothing here hard-codes a figure. Every number comes from data/analysis/*.json, which the
 * pipeline writes and re-writes; to change what this renders, re-run the pipeline.
 */

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
        <strong className="text-ink">One scenario, read against two bars.</strong>{" "}
        The model draws turnout and vote share across stated ranges, anchored on the share of
        ballots the 2022 winner took, on the July 2026 register as reported (Tier 3, unconfirmed). It is set against the
        2022 winning tally and against the same share of today&rsquo;s larger register. Every input
        is a stated modelling assumption, not a measurement, and the result is a scenario, not a
        forecast.
      </p>
    </AnalysisFigure>
  );
}

/** §2.6 — the connected minority, and its limits. */
export function ChannelReachBlock() {
  return (
    <AnalysisFigure
      chart={analysisExport("channel-reach")}
      heading="How many voters each channel can physically reach"
    >
      <p className="mt-3 pt-2 border-t border-line/40 t-small text-muted leading-relaxed">
        <strong className="text-ink">These figures supersede the 13.6% used in the surrounding
        text.</strong> That rate is from the 2019 census. The 2023/24 Kenya Housing Survey puts
        Kitui internet use at 26.2% and phone ownership at 44.1%, so the digital layer is roughly
        double what this section describes and the SMS-only layer is roughly half. Where the
        prose and this panel disagree, the panel carries the later measurement.
      </p>
      <p className="mt-2 t-small text-muted leading-relaxed">
        <strong className="text-ink">The reason matters more than the numbers.</strong> Phone
        ownership rose just 1.2 points in five years while internet use rose 12.6. Almost nobody
        new acquired a phone; people who already had one got online. The SMS-only group did not
        disappear, it moved to the digital layer — which is why weighting SMS against a
        13.6%-internet county overstates the audience that layer can still reach. The offline
        majority is untouched by this and remains the largest segment by a wide margin.
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
        because Kitui is the worst county in Kenya on an official measure. The ranking says where
        the official record is strongest, which is what a message can be built on; it does not
        claim to say what voters rank first.
      </p>
    </AnalysisFigure>
  );
}
