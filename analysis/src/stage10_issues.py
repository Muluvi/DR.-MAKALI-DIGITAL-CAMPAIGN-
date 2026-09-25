"""Stage 10 — issue salience and credibility.

The matrix has two axes. Only one can be built from public data: salience has hard
indicators in the pack, while credibility has no public record and could only come from a
team score, which does not exist. Firefly commissions no survey to fill it. A two-axis chart with one invented axis would be worse than no chart, so this
stage delivers the salience axis as an evidence inventory and says what the matrix needs.
"""
from __future__ import annotations

import numpy as np
import pandas as pd

from src import charts, config, report

# Evidence drawn from the pack. Every row cites a source; nothing is asserted without one.
# `rank_basis` is how strong the public evidence is, NOT measured public salience —
# those are different things and the report keeps them apart.
EVIDENCE = [
    {
        "issue_id": "water", "issue": "Water and drought",
        "indicator": "21% with at least basic drinking-water service — the lowest of any county in Kenya",
        "value": 21.0, "unit": "% of households", "source_id": "S41", "tier": 1, "as_of": "2022",
        "reach": "county-wide",
        "supporting": "7.2 km average water trekking distance, Feb 2026 — longest among semi-arid counties [S43]",
    },
    {
        "issue_id": "poverty", "issue": "Household economics and poverty",
        "indicator": "55.2% of residents in poverty, about 637,000 people",
        "value": 55.2, "unit": "% of residents", "source_id": "S40", "tier": 2, "as_of": "2021",
        "reach": "county-wide",
        "supporting": "Food takes 72.5% of household spending, among the highest nationally [S40]",
    },
    {
        "issue_id": "agriculture", "issue": "Farming and food security",
        "indicator": "NDMA drought phase Alert from Dec 2025 through Feb 2026; Normal but worsening by Aug 2026",
        "value": np.nan, "unit": "phase", "source_id": "S43", "tier": 1, "as_of": "2026-08",
        "reach": "county-wide",
        "supporting": "El Nino rains expected; Kitui listed among counties where conditions are getting worse [S46]",
    },
    {
        "issue_id": "allocation", "issue": "How county money is split between wards",
        "indicator": "CLIDP splits county resources equally across all 40 wards; the leading rival attacks it as entrenching inequality",
        "value": np.nan, "unit": "policy", "source_id": "S24", "tier": 2, "as_of": "2025-10",
        "reach": "county-wide",
        "supporting": "A live fault line where an economist's position differentiates — and where the proposal's own equal-ward guarantee conflicts with itself",
    },
    {
        "issue_id": "fiscal", "issue": "County finance and accountability",
        "indicator": "KSh 13.79bn FY2026/27 resource envelope; own-source revenue raised from 1.12bn to 1.339bn by the Assembly",
        "value": 13.79, "unit": "KSh bn", "source_id": "S47", "tier": 1, "as_of": "2026",
        "reach": "county-wide",
        "supporting": "Directly anchors the Economist Governor positioning [S47, S48]",
    },
    {
        "issue_id": "youth", "issue": "Youth, jobs and registration",
        "indicator": "IEBC flagged youth registration as lagging and planned a digital pre-registration route",
        "value": np.nan, "unit": "status", "source_id": "S69", "tier": 2, "as_of": "2026-02",
        "reach": "county-wide",
        "supporting": "Phone ownership exceeds 80% among 18-34s nationally [S36] — the one segment digital reaches well",
    },
    {
        "issue_id": "mui_coal", "issue": "Mui Basin coal",
        "indicator": "~400 million tonnes of deposits; residents petitioned against mining in 2023; revival announced Oct 2025",
        "value": 400.0, "unit": "million tonnes", "source_id": "S52", "tier": 2, "as_of": "2025-10",
        "reach": "localised — Mui ward (11,039 voters) and neighbouring Mwingi Central wards",
        "supporting": "High intensity in a small register. Which wards the concession blocks cover is [DATA NEEDED]",
    },
    {
        "issue_id": "record", "issue": "Record and delivery",
        "indicator": "NG-CDF project record and Budget & Appropriations service",
        "value": np.nan, "unit": "record", "source_id": "S20", "tier": 3, "as_of": "2026",
        "reach": "Kitui Central only",
        "supporting": "Project records are usable as proof points; beneficiary lists are NOT usable for contact [S57]",
    },
]


def build() -> pd.DataFrame:
    df = pd.DataFrame(EVIDENCE)
    # Evidence strength: T1 beats T2 beats T3; a quantified indicator beats a qualitative one;
    # county-wide beats localised. Stated openly because it is a ranking rule, not a measurement.
    tier_score = df["tier"].map({1: 1.0, 2: 0.6, 3: 0.3})
    quantified = df["value"].notna().map({True: 1.0, False: 0.5})
    reach_score = df["reach"].str.startswith("county-wide").map({True: 1.0, False: 0.4})
    df["evidence_strength"] = (tier_score * 0.4 + quantified * 0.25 + reach_score * 0.35).round(3)
    df["comment_share_pct"] = np.nan      # Stage 7 fills this
    df["credibility_score"] = np.nan      # a team score fills this, labelled as a judgement
    return df.sort_values("evidence_strength", ascending=False).reset_index(drop=True)


def chart_evidence(df: pd.DataFrame) -> str:
    charts.apply()
    data = df.iloc[::-1]
    fig, ax = charts.figure(7.8, 4.6)
    ys = np.arange(len(data))
    colours = [charts.CATEGORICAL[0] if r.startswith("county-wide") else charts.CATEGORICAL[3]
               for r in data["reach"]]
    ax.barh(ys, data["evidence_strength"], color=colours, height=0.66)
    for y, (val, tier) in enumerate(zip(data["evidence_strength"], data["tier"])):
        ax.text(val + 0.012, y, f"{val:.2f}  (T{tier})", va="center", fontsize=8, color=charts.INK)
    ax.set_yticks(ys, data["issue"])
    ax.set_xlim(0, 1.22)
    ax.set_xlabel("Strength of public evidence (0–1)")
    ax.set_title("Issues ranked by the evidence behind them — not by measured salience")
    ax.barh([], [], color=charts.CATEGORICAL[0], label="County-wide")
    ax.barh([], [], color=charts.CATEGORICAL[3], label="Localised")
    ax.legend(loc="lower right", fontsize=8)
    ax.grid(axis="y", visible=False)
    charts.strip_spines(ax, keep=("bottom",))
    return charts.save(
        fig, "10_issue_evidence.svg",
        "This ranks how strong the PUBLIC EVIDENCE is for each issue — source tier, whether the "
        "indicator is quantified, and whether it reaches the whole county. It is not a measure "
        "of what voters care about. What voters raise unprompted comes from the comment corpus "
        "(Stage 7).",
    )


def run() -> dict:
    config.ensure_dirs()
    df = build()
    df.to_csv(config.DATA_PROCESSED / "issues.csv", index=False)
    c = chart_evidence(df)

    rep = report.Report(
        "10_issues.md", "Stage 10 — Issue salience and credibility",
        "What the data says Kitui's issues are, and what is still needed to turn that into a "
        "content plan.",
    )
    rep.chart(c, "Issues ranked by the strength of public evidence")

    rep.h2("The matrix is half-built, and the missing half matters")
    rep.p(
        "The brief asks for issues plotted on two axes: local salience, and Mulu's credibility on "
        "each. The first axis has hard public indicators. The second has none: no public record "
        "measures it, and Firefly commissions no survey to create one. It can only be a team "
        "score, which has not been given."
    )
    rep.p(
        "**No two-axis chart is produced, deliberately.** Placing eight issues on a credibility "
        "axis with no credibility data would mean inventing the y-coordinate for every point, and "
        "a scatter plot makes invented numbers look measured. The salience axis is delivered "
        "below as an evidence inventory; the matrix follows a team credibility score, if one is "
        "given, labelled as a judgement."
    )
    rep.p(
        "The ranking below is also **not measured salience**. It ranks the strength of the public "
        "evidence: source tier, whether the indicator is quantified, and whether it is county-wide "
        "or localised. Water ranks first because Kitui is the worst county in Kenya on a T1 "
        "measure, not because anyone has asked Kitui voters what they care about."
    )

    rep.h2("Recommended content pillars, with the evidence")
    for i, row in df.iterrows():
        val = "" if pd.isna(row["value"]) else f" **{row['value']:g} {row['unit']}.**"
        rep.raw(
            f"**{i + 1}. {row['issue']}** — evidence strength {row['evidence_strength']:.2f}, "
            f"{row['reach']}  \n"
            f"{row['indicator']}.{val} [{row['source_id']}, T{row['tier']}, {row['as_of']}]  \n"
            f"*{row['supporting']}*"
        )

    rep.h2("What the top three mean for content")
    rep.bullets([
        "**Water is the strongest available argument.** Being the worst county in Kenya on a "
        "Tier 1 measure is a rare thing to be able to say with a citation. It is county-wide, it "
        "is current, and it needs nothing beyond the official record to justify.",
        "**Poverty anchors the existing cover line.** The profile already carries \"From Poverty "
        "to Wealth Creation\"; 55.2% in poverty and 72.5% of spending going on food give that "
        "line evidence instead of sentiment.",
        "**Allocation is the sharpest point of difference, and the campaign is not yet ready for "
        "it.** The leading rival attacks equal-ward CLIDP as entrenching inequality. The site's "
        "own §7.1.1 proposes an equal-ward guarantee, which is the same policy. Those two "
        "positions cannot both be run, and this stage cannot resolve it — it is a policy "
        "decision, flagged here because the content plan depends on it.",
    ])

    rep.h2("Issues deliberately not ranked as content pillars")
    rep.bullets([
        "**Mui Basin coal** scores lower only because it is localised, not because it is weak. "
        "In Mui ward and its neighbours it may be the decisive issue. It belongs in ward-targeted "
        "content, not the county-wide pillar set.",
        "**Record and delivery** is Kitui Central only, and its strongest proof points sit behind "
        "a data-protection line: NG-CDF project records are usable, beneficiary lists are not.",
    ])

    rep.gaps([
        "Stage 7's coded comment themes, which give a second, behavioural read on salience.",
        "A team credibility score per issue. It is an opinion and the chart would label it as "
        "one, but it would let the matrix exist. The credibility axis has no public record.",
        "Which wards the Mui concession blocks cover, before any ward-targeted coal content.",
        "Kitui's rows in the KNBS Poverty Report 2022 and Gross County Product 2024 (pack gap "
        "12), which would update the 2021 poverty figure.",
    ])
    path_out = rep.write()
    return {"state": "ok", "summary": f"{len(df)} issues ranked by evidence → {path_out}",
            "gaps": ["credibility axis"]}
