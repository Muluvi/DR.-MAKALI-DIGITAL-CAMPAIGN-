"""Stage 12 — synthesis, site-ready JSON, and the proposed site mapping."""
from __future__ import annotations

import numpy as np
import pandas as pd

from src import config, report, simulation as sim
from src.siteexport import Chart, Value

CONFIRMED, VERIFY, PLACEHOLDER = "confirmed", "verify", "placeholder"
OFFICIAL, CALCULATED, MODELLED = "official", "calculated", "modelled"


def _read(name: str) -> pd.DataFrame | None:
    path = config.DATA_PROCESSED / f"{name}.csv"
    return pd.read_csv(path) if path.exists() else None


def build_charts() -> list[Chart]:
    charts: list[Chart] = []
    wards = _read("wards")
    polls = _read("polls")
    results = _read("results_2022")
    finance = _read("county_finance")
    drought = _read("drought")
    reach = _read("ward_reach")
    issues = _read("issues")

    # 1. Ward register -------------------------------------------------------------------
    if wards is not None:
        charts.append(Chart(
            id="ward-register-2022",
            title="Kitui's 40 wards by registered voters",
            description="The IEBC 2022 register, ward by ward. Wards sum to each constituency "
                        "total and to the county figure of 532,758.",
            chart_type="bar",
            values=[Value(r.ward, int(r.registered_voters_2022), "voters", "S1", 1, "2022",
                          OFFICIAL, CONFIRMED, note=r.constituency)
                    for r in wards.itertuples()],
            notes=["Verified against the site's own data/ward-register.json: all 40 match.",
                   "Excludes 75 prison voters, who sit in no ward."],
        ))

    # 2. Register comparison -------------------------------------------------------------
    charts.append(Chart(
        id="register-comparison",
        title="The register the arithmetic rests on",
        description="Kitui's electorate has grown by 72,945 voters since 2022, confirmed "
                    "against the IEBC's own annex.",
        chart_type="comparison",
        values=[
            Value("IEBC 2022 register", 532758, "voters", "S2", 1, "2022", OFFICIAL, CONFIRMED),
            Value("IEBC register, July 2026", 605703, "voters", "S3", 1, "2026-07", OFFICIAL,
                  CONFIRMED, note="Confirmed against the IEBC ECVR county annex."),
            Value("Growth since 2022", 72945, "voters", "S3", 1, "2026-07", CALCULATED, CONFIRMED,
                  note="605,703 minus 532,758 — a 13.7% larger electorate."),
            Value("Added in the 30-day ECVR drive", 61839, "voters", "S3", 1, "2026-04-28",
                  OFFICIAL, CONFIRMED,
                  note="The drive that ended 28 April 2026."),
            Value("Added by continuous registration outside the drive", 11106, "voters", "S3", 1,
                  "2026-07", CALCULATED, CONFIRMED,
                  note="Continuous registration opened 29 September 2025 and ran on after the "
                       "drive closed; the July total post-dates it by three months."),
        ],
        notes=[
            "The 2022 register is no longer the current electorate. Any figure describing "
            "today's electorate should use 605,703.",
            "The drive figure and the July total measure different windows and were never "
            "meant to sum. An earlier version of this analysis reported them as contradictory; "
            "that reading was wrong and is corrected here.",
            "A larger register raises the bar: 37.2% of 605,703 is about 225,000 votes, against "
            "198,004 in 2022.",
        ],
    ))

    # 3. Polls ---------------------------------------------------------------------------
    if polls is not None:
        from src import polls as pollmath
        vals: list[Value] = []
        for r in polls[polls["polled"]].itertuples():
            n = None if pd.isna(r.sample_size) else int(r.sample_size)
            moe = pollmath.share_moe(r.share_pct, n) if n else None
            vals.append(Value(
                f"{r.pollster} · {r.release_date} · {r.candidate}", float(r.share_pct), "%",
                str(r.source_id), int(r.tier), str(r.as_of), OFFICIAL, VERIFY,
                note=(f"n = {n:,}, 95% MoE ±{moe:.2f} pts" if n
                      else "Sample size not published — margin of error unknown"),
            ))
        charts.append(Chart(
            id="published-polls-2026",
            title="Published governor polls, 2026",
            description="Three published rounds from two pollsters. Politrack and Mizani use "
                        "different methods and are never joined into one trend line.",
            chart_type="grouped-error-bar",
            values=vals,
            notes=[
                "Mizani's June round excluded Ngilu; the August round included her at 17.0%. "
                "The two are not like-for-like.",
                "Politrack reports 0.6% undecided, Mizani 6.0% — a tenfold difference that "
                "points to different instruments.",
                "Neither Mizani round published a sample size, so the June-to-August change "
                "cannot be tested for significance.",
                "Every poll reaches this pipeline through a T3 outlet or a social post, so all "
                "carry status verify.",
            ],
        ))

    # 4. 2022 results --------------------------------------------------------------------
    if results is not None:
        gov = results[results["race"].str.contains("Governor", case=False, na=False)]
        vals = []
        for r in gov.itertuples():
            status = VERIFY if r.status in ("conflict", "verify") else CONFIRMED
            vals.append(Value(
                f"{r.candidate} ({r.outcome})", int(r.votes), "votes", str(r.source_id),
                int(r.tier), "2022-08", OFFICIAL, status,
                note=("Disputed: two published totals, both kept"
                      if r.status == "conflict" else ""),
            ))
        charts.append(Chart(
            id="results-2022-governor",
            title="The 2022 governor result",
            description="The benchmark every 2027 projection is measured against.",
            chart_type="bar",
            values=vals,
            notes=["Musila's runner-up total is disputed: The Star reports 114,606, the Nation "
                   "and Standard 117,606. Both are shown; neither is preferred.",
                   "Kenyan governor races are won by plurality. 198,004 is a benchmark, not a "
                   "threshold."],
        ))

    # 5. Reach -----------------------------------------------------------------------------
    if reach is not None:
        total = int(reach["voters"].sum())
        charts.append(Chart(
            id="channel-reach",
            title="How many voters each channel can reach",
            description="The electorate split into three mutually exclusive reach segments, "
                        "modelled from the 2023/24 CA/KNBS rates.",
            chart_type="stacked-bar",
            values=[
                Value("Reachable by smartphone or data", int(reach["digital"].sum()), "voters",
                      "CA-ICT-KHS-2024", 1, "2023-24", MODELLED, PLACEHOLDER,
                      note="26.2% internet use, CA/KNBS 2023/24 — up from 13.6% in 2019"),
                Value("Reachable by SMS only (phone, no data)", int(reach["sms_only"].sum()),
                      "voters", "CA-ICT-KHS-2024", 1, "2023-24", MODELLED, PLACEHOLDER,
                      note="44.1% phone ownership minus 26.2% internet use"),
                Value("No phone — radio or in person only", int(reach["offline"].sum()), "voters",
                      "CA-ICT-KHS-2024", 1, "2023-24", MODELLED, PLACEHOLDER,
                      note="Not a radio audience estimate: no Kitui listenership data exists"),
                Value("Total electorate, July 2026", total, "voters", "S3", 1, "2026-07",
                      OFFICIAL, CONFIRMED),
            ],
            notes=[
                "MODELLED. Published rates multiplied by ward electorates — not a measurement.",
                "Phone ownership rose just 1.2 points between 2019 and 2023/24 while internet "
                "use rose 12.6. The digital layer grew almost entirely at the expense of the "
                "SMS-only layer, not by adding new phone owners.",
                "The offline majority is unchanged by this update and remains the largest "
                "single segment.",
                "Rates are applied uniformly to all 40 wards because no ward-level connectivity "
                "data exists. Township and Tharaka get the same rate, which is certainly wrong.",
                "The rates were measured on persons aged 3+ and are applied here to registered "
                "voters, who are all adults. This probably understates the digital and SMS layers.",
                "Bulk political SMS is English or Kiswahili only under CA/NCIC guidelines, and "
                "must be lodged with the operator 48 hours ahead.",
            ],
        ))

    # 6. Drought -------------------------------------------------------------------------
    if drought is not None:
        vals = []
        for r in drought.itertuples():
            is_phase = r.indicator == "NDMA drought phase"
            vals.append(Value(
                f"{r.indicator} · {r.period}", r.phase if is_phase else float(r.value),
                str(r.unit), str(r.source_id), int(r.tier), str(r.as_of), OFFICIAL,
                VERIFY if int(r.tier) == 3 else CONFIRMED, note=str(r.value_text)[:180],
            ))
        charts.append(Chart(
            id="water-and-drought",
            title="Water and drought in Kitui",
            description="Kitui has the lowest share of any county in Kenya with at least basic "
                        "drinking-water service.",
            chart_type="timeline",
            values=vals,
            notes=["21% basic drinking-water service is the lowest of any county (KDHS 2022).",
                   "NDMA moved Kitui from Alert to Normal by August 2026, while listing it among "
                   "counties where conditions are getting worse."],
        ))

    # 7. County finance ------------------------------------------------------------------
    if finance is not None:
        vals = []
        for r in finance.itertuples():
            if pd.isna(r.value_ksh):
                continue
            vals.append(Value(
                str(r.item), float(r.value_ksh), "KSh bn" if r.value_ksh < 100 else "KSh",
                str(r.source_id), int(r.tier), str(r.as_of), OFFICIAL,
                VERIFY if int(r.tier) == 3 else CONFIRMED, note=str(r.value_text)[:180],
            ))
        if vals:
            charts.append(Chart(
                id="county-finance-2026-27",
                title="Kitui County finances, FY2026/27",
                description="The resource envelope behind the Economist Governor argument.",
                chart_type="bar",
                values=vals,
                notes=["From the County Fiscal Strategy Paper FY2026/27 [S47], approved by the "
                       "County Assembly, which raised own-source revenue to KSh 1.339bn [S48]."],
            ))

    # 8. Issue evidence ------------------------------------------------------------------
    if issues is not None:
        charts.append(Chart(
            id="issue-evidence",
            title="Issues ranked by the evidence behind them",
            description="How strong the public evidence is for each issue — not a measure of "
                        "what voters say they care about.",
            chart_type="bar",
            values=[Value(
                str(r.issue), float(r.evidence_strength), "score 0-1", str(r.source_id),
                int(r.tier), str(r.as_of), CALCULATED,
                VERIFY if int(r.tier) == 3 else PLACEHOLDER, note=str(r.indicator)[:200],
            ) for r in issues.itertuples()],
            notes=["Ranks evidence strength: source tier, whether the indicator is quantified, "
                   "and whether it is county-wide or localised.",
                   "This is NOT measured salience. Measuring what voters care about needs the "
                   "baseline survey, which has not been run."],
        ))

    # 9. Simulation benchmarks -----------------------------------------------------------
    if wards is not None:
        from src.stage03_simulation import SCENARIOS, _support_range
        vals = []
        for key in SCENARIOS:
            res = sim.simulate(wards, support_range=_support_range(key))
            s = res.summary()
            label = SCENARIOS[key]["label"]
            vals += [
                Value(f"{label} — median", int(s["median"]), "votes", "S1", 1, "2026-09",
                      MODELLED, PLACEHOLDER, note=SCENARIOS[key]["gloss"]),
                Value(f"{label} — 5th percentile", int(s["p5"]), "votes", "S1", 1, "2026-09",
                      MODELLED, PLACEHOLDER),
                Value(f"{label} — 95th percentile", int(s["p95"]), "votes", "S1", 1, "2026-09",
                      MODELLED, PLACEHOLDER),
                Value(f"{label} — draws above 198,004", round(res.share_exceeding(198004) * 100, 1),
                      "%", "S11", 2, "2026-09", MODELLED, PLACEHOLDER,
                      note="NOT a win probability — no rival is modelled"),
            ]
        vals.append(Value("2022 winning tally (benchmark)", 198004, "votes", "S11", 2, "2022-08",
                          OFFICIAL, CONFIRMED))
        charts.append(Chart(
            id="scenario-benchmarks",
            title="Scenario model: votes against the 2022 benchmark",
            description="Two support scenarios, 10,000 draws each, compared against the 2022 "
                        "winning tally.",
            chart_type="distribution",
            values=vals,
            scenario_label=config.SCENARIO_LABEL,
            notes=[config.SCENARIO_LABEL,
                   "Governor races are won by plurality. There is no threshold and these are "
                   "not win probabilities.",
                   "A win probability would require rival vote ranges, which have not been "
                   "supplied.",
                   "Every input is a placeholder assumption from config/assumptions.yaml."],
        ))
    return charts


def write_findings(charts: list[Chart]) -> str:
    wards = _read("wards")
    reach = _read("ward_reach")
    findings = _read("audit_findings")

    rep = report.Report(
        "findings.md", "Findings",
        "The ten things this analysis establishes, what every one of them rests on, and what "
        "is still missing.",
    )
    rep.h2("The ten findings")

    items = [
        ("The party's name on the site is wrong.",
         "ORPP certified the change from Wiper Democratic Movement to Wiper Patriotic Front in "
         "August 2025 [S6, T1]. The site still uses the old name across multiple content files. "
         "This is a one-line fix and the cheapest credibility repair available.", "Stage 1"),
        ("The 'widening deficit' cannot be substantiated.",
         "The site reads 11.1 → 15.3 points as a trend. Neither Mizani round published a sample "
         "size, so the change returns cannot determine. June also excluded Ngilu while August "
         "included her at 17.0%, so part of the movement is a changed field, not changed opinion. "
         "The deficit is real in each round; its direction is not measurable.", "Stage 2"),
        ("A second pollster exists and is missing from the site.",
         "Politrack Africa, 12 March 2026, n = 2,927: Mulu 26.2%, Kasalu 35.2% [S9]. It is the "
         "only poll with a published sample size, and at that n the 9.0-point gap carries a "
         "margin of ±2.82 points — the one poll finding that is statistically solid.", "Stage 2"),
        ("The register on the site is four years out of date, and its replacement is unverified.",
         "532,758 is the 2022 figure [S2, T1] and is presented as current. The 2026 figures are "
         "both T3 and do not reconcile: 605,703 reported for July 2026 [S4] against 594,597 "
         "implied by the reported new registrations [S5], a gap of 11,106.", "Stage 1"),
        ("The ward arithmetic is sound.",
         "All 40 wards sum to each constituency total and to 532,758, and the site's own "
         "ward-register.json matches ward for ward. Two independent copies agree, so the "
         "foundation of every ward-level claim holds.", "Stage 1"),
        ("A purely digital campaign reaches about one voter in seven.",
         f"Modelled at {int(reach['digital'].sum()):,} voters on KNBS 2019 county rates, against "
         f"{int(reach['sms_only'].sum()):,} reachable by SMS only and "
         f"{int(reach['offline'].sum()):,} with no phone at all. The rates are seven years old "
         "and are the single highest-value thing to refresh.", "Stage 9"),
        ("The SMS layer cannot carry Kikamba.",
         "CA/NCIC guidelines limit bulk political SMS to English or Kiswahili, with 48-hour "
         "advance lodging and an operator veto [S53, S54]. The SMS-only segment is the most "
         "rural and most likely to prefer Kikamba, so the language the campaign most needs is "
         "unavailable on the channel that reaches them.", "Stage 9"),
        ("NG-CDF beneficiary lists cannot become a campaign list.",
         "ODPC's 2025 public-sector guidance bars reusing public-programme personal data for "
         "political mobilisation without explicit consent [S57, T1]. Project records remain "
         "usable as proof points. Consented opt-in is the only lawful route, which makes list "
         "building an objective rather than an assumption.", "Constraint"),
        ("Water is the strongest evidenced argument available.",
         "Kitui has the lowest share of any county in Kenya with at least basic drinking-water "
         "service, at 21% [S41, T1], and the longest water trekking distance among semi-arid "
         "counties at 7.2 km in February 2026 [S43, T1]. Both are Tier 1, current and "
         "county-wide.", "Stage 10"),
        ("The campaign's own allocation policy contradicts its best line of attack.",
         "The leading rival attacks equal-ward CLIDP as entrenching inequality [S24]. The site's "
         "§7.1.1 proposes an equal-ward guarantee — the same policy. Both cannot be run. This is "
         "a policy decision the analysis cannot make, and the content plan waits on it.",
         "Stage 10"),
    ]
    for i, (headline, evidence, stage) in enumerate(items, 1):
        rep.raw(f"**{i}. {headline}**  \n{evidence}  \n*Source: {stage}.*")

    rep.h2("What the models do and do not say")
    rep.bullets([
        "**Scenario model, not a forecast.** Stage 3 draws turnout and support from placeholder "
        "ranges. It shows what the ward arithmetic yields under stated assumptions.",
        "**No win probability is produced anywhere.** That needs rival vote ranges, which have "
        "not been supplied. Governor races are won by plurality, so there is no threshold to "
        "clear — 198,004 is a benchmark.",
        "**The ward priority index has one of six features.** It currently reproduces the "
        "register ranking, which is faithful but not useful. Five features are dropped and named; "
        "nothing is imputed.",
        "**Stage 9's figures are modelled, not measured** — published rates times ward registers, "
        "with the rate and its year printed beside every number.",
    ])

    rep.h2("Every assumption")
    placeholders = config.placeholders()
    rep.p(f"{len(placeholders)} entries in `config/assumptions.yaml` are marked PLACEHOLDER — "
          "nobody has confirmed them. Each carries a rationale in the file.")
    rows = []
    for key in placeholders:
        try:
            a = config.assumption(key)
        except config.AssumptionError:
            continue
        rows.append({"Assumption": key, "Value": str(a.value)[:48],
                     "Why it is a placeholder": a.rationale[:150]})
    rep.table(pd.DataFrame(rows))

    rep.h2("Every data gap")
    gaps = [
        ("IEBC ECVR county/ward annex", "Settles the 605,703 conflict; unlocks registration growth", "Stages 1, 3, 4"),
        ("Mizani sample sizes and method", "Makes the June-to-August comparison testable", "Stage 2"),
        ("2022 Forms 37A/37B by ward", "Ward-level party strength and turnout", "Stages 3, 4"),
        ("Baseline survey (ward aggregates)", "Recognition gap and the whole credibility axis", "Stages 4, 10"),
        ("posts.csv", "The entire Existing Presence Audit", "Stage 6"),
        ("comments.csv", "Themes, sentiment and behavioural salience", "Stage 7"),
        ("competitors.csv", "Any rival benchmark at all", "Stage 8"),
        ("KNBS Housing Survey 2023/24, Kitui ICT row", "Replaces seven-year-old reach rates", "Stage 9"),
        ("Ward boundary file", "All maps", "Stage 5"),
        ("Ward-level 2G/3G/4G coverage", "Connectivity feature and real ward reach variation", "Stages 4, 9"),
        ("Kikamba radio audience by sub-county", "Converts the offline segment into a radio audience", "Stage 9"),
        ("WPF nomination-poll terms", "The premise the whole nomination strategy rests on", "Stage 3"),
        ("Rival vote ranges", "Required before any win probability", "Stage 3"),
        ("A Kikamba-speaking reviewer", "Staffing, not data — blocks Kikamba sentiment coding", "Stage 7"),
    ]
    rep.table(pd.DataFrame(gaps, columns=["Missing", "What it unlocks", "Stages blocked"]))

    if findings is not None:
        high = findings[findings["severity"] == "high"]
        rep.h2("Audit findings still open")
        rep.p(f"{len(high)} high-severity findings from Stage 1. Full list in "
              "`data/processed/audit_findings.csv`.")
    return rep.write()


def write_mapping(charts: list[Chart]) -> str:
    rep = report.Report(
        "site_mapping.md", "Proposed site mapping",
        "Which exported JSON file belongs in which site section. Nothing is copied into the "
        "site until this is approved.",
    )
    rep.h2("Proposed mappings")
    proposed = {
        "ward-register-2022": ("§3.4.2 — the 40-ward ranking table",
                               "Replaces a hand-maintained table with a provenanced file."),
        "register-comparison": ("§3.4.1 — the number of votes it takes",
                                "Adds the 2026 figures the site currently lacks, with verify markers."),
        "published-polls-2026": ("§3.1.5 — the polling gap, as sourced",
                                 "Adds Politrack, which the site is missing, and margins of error."),
        "results-2022-governor": ("§3.3.6 — electoral history",
                                  "Carries the Musila conflict as two values, not one."),
        "channel-reach": ("§8.10.1 / §9A.1 — offline reach",
                          "Replaces asserted reach figures with a modelled, labelled split."),
        "water-and-drought": ("§3.3.8 — drought and food security",
                              "Adds the 21% water figure, the strongest Tier 1 line available."),
        "county-finance-2026-27": ("§3.3.4 — the resource envelope",
                                   "Updates to the FY2026/27 CFSP figures."),
        "issue-evidence": ("§7 — messaging pillars",
                           "Evidence behind each pillar. Labelled as evidence strength, not salience."),
        "scenario-benchmarks": ("§3.4.1 — the path to the threshold",
                                "Scenario model only. Must render with its scenario label visible."),
    }
    rows = []
    for chart in charts:
        section, why = proposed.get(chart.id, ("(unmapped)", "Not proposed for the site."))
        rows.append({"JSON file": f"`{chart.id}.json`", "Proposed site section": section,
                     "Why": why, "Values": len(chart.values)})
    rep.table(pd.DataFrame(rows), floatfmt="{:.0f}")

    rep.h2("Deliberately excluded")
    rep.p("These exist in the pipeline and are **not** exported to the site:")
    rep.table(pd.DataFrame([
        {"Excluded": "Nomination leverage ranking (`nomination_leverage.csv`)",
         "Reason": "Tells rivals exactly which wards to defend. On the never-publish list."},
        {"Excluded": "Holdout assignment (`holdout_assignment.csv`)",
         "Reason": "Publishing which wards are controls destroys the experiment."},
        {"Excluded": "Competitor benchmark (Stage 8)",
         "Reason": "Rival analysis on a public URL shows what the campaign is watching."},
        {"Excluded": "Reported vulnerabilities (pack §6.4)",
         "Reason": "Never appears in any output. It is opposition-research material about our "
                   "own candidate."},
        {"Excluded": "Ward-level priority scores",
         "Reason": "Targeting intelligence. The register ranking is already public; the "
                   "prioritisation is not."},
    ]))

    rep.h2("Rules for whoever wires these in")
    rep.bullets([
        "Every value carries `source_id`, `tier`, `as_of`, `method` and `status`. All five must "
        "render, not just the number.",
        "**Any value with `status: verify` must show a visible unconfirmed marker.** This is the "
        "site's own Tier 3 rule and the pipeline enforces it on export.",
        "**Any chart with a `scenario_label` must display it.** A simulation shown without its "
        "label is a forecast, which is exactly what this pipeline refuses to produce.",
        "`method: modelled` figures must never be styled with the authority of `official` ones.",
        "The pipeline does not edit site files. These JSON files are copied into the site's "
        "content folder only after this mapping is approved.",
    ])
    return rep.write()


def run() -> dict:
    config.ensure_dirs()
    charts = build_charts()
    written = [c.write() for c in charts]
    findings_path = write_findings(charts)
    mapping_path = write_mapping(charts)
    return {
        "state": "ok",
        "summary": f"{len(written)} JSON files, findings.md, site_mapping.md",
        "gaps": [],
    }
