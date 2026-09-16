"""Stage 3 — scenario simulation. Nomination leverage, and general-election paths."""
from __future__ import annotations

import numpy as np
import pandas as pd

from src import charts, config, report, simulation as sim

SCENARIOS = {
    "current": {
        "label": "Current measured preference",
        "range_keys": ("support.mulu_ward_low", "support.mulu_ward_high"),
        "gloss": "his published nomination-poll share, 20.2–26.2%, widened to 18–32%",
    },
    "competitive": {
        "label": "Competitive general election",
        "range_keys": ("support.competitive_ward_low", "support.competitive_ward_high"),
        "gloss": "40–60% of ballots cast, anchored on the 2022 winner's ~60%",
    },
}


def _support_range(key: str) -> tuple[float, float]:
    lo, hi = SCENARIOS[key]["range_keys"]
    return config.value(lo), config.value(hi)


def chart_leverage(lev: pd.DataFrame, top: int = 15) -> str:
    charts.apply()
    head = lev.head(top).iloc[::-1]
    fig, ax = charts.figure(7.4, 5.4)
    ys = np.arange(len(head))
    ax.barh(ys, head["leverage_per_10pt_gain"], color=charts.CATEGORICAL[0], height=0.68)
    for y, (val, share) in enumerate(zip(head["leverage_per_10pt_gain"], head["register_share"])):
        ax.text(val + 0.006, y, f"{val:.2f} pts  ({share:.2%} of register)",
                va="center", fontsize=8, color=charts.INK)
    ax.set_yticks(ys)
    ax.set_yticklabels(head["ward"])
    ax.set_xlabel("Countywide share gained per 10-point gain in that ward")
    ax.set_xlim(0, head["leverage_per_10pt_gain"].max() * 1.45)
    ax.set_title(f"Nomination-poll leverage — top {top} wards")
    ax.grid(axis="y", visible=False)
    charts.strip_spines(ax, keep=("bottom",))
    return charts.save(
        fig, "03_nomination_leverage.svg",
        "Scenario model, not a forecast. Assumes the party poll samples in proportion to "
        "registered voters — an UNCONFIRMED assumption. If the real poll over-samples urban "
        "wards, this ranking shifts. Register is IEBC 2022 [S1].",
    )


def chart_distribution(results: dict[str, sim.SimulationResult]) -> str:
    charts.apply()
    import matplotlib.pyplot as plt

    fig, axes = plt.subplots(1, 2, figsize=(9.8, 4.0), sharey=True)
    for ax, (key, res) in zip(axes, results.items()):
        colour = charts.CATEGORICAL[0] if key == "current" else charts.CATEGORICAL[2]
        ax.hist(res.totals, bins=60, color=colour, alpha=0.85, edgecolor=charts.SURFACE,
                linewidth=0.4)
        marks = sim.benchmarks(res.register_total)
        for i, (name, value) in enumerate(marks.items()):
            ax.axvline(value, color=charts.CATEGORICAL[7], lw=1.8,
                       ls="--" if i else "-", zorder=5)
        median = np.median(res.totals)
        ax.axvline(median, color=charts.INK, lw=1.4, zorder=6)
        ax.text(median, ax.get_ylim()[1] * 0.97, f" median {median:,.0f}", fontsize=8,
                color=charts.INK, ha="left", va="top")
        pct = res.share_exceeding(config.value("benchmarks.winning_tally_2022"))
        ax.set_title(f"{SCENARIOS[key]['label']}\n{pct:.1%} of draws above 198,004", fontsize=9.5)
        ax.set_xlabel("Mulu's simulated county total (votes)")
        ax.grid(axis="x", visible=False)
        charts.strip_spines(ax, keep=("bottom",))
        ax.xaxis.set_major_formatter(lambda x, _: f"{x/1000:.0f}k")
    axes[0].set_ylabel("Draws")
    fig.suptitle("Distribution of Mulu's total votes — 10,000 draws per scenario",
                 fontsize=11.5, fontweight="semibold", y=1.04)
    fig.tight_layout()
    return charts.save(
        fig, "03_vote_distribution.svg",
        "Scenario model, not a forecast. The red line marks the benchmarks. On the 2022 "
        "register the two coincide almost exactly — 198,004 and 198,186 — because 37.2% is "
        "derived from that tally on that register, so only one line is visible here. They "
        "separate on the 2026 register, where 37.2% is about 225,000. Governor races are won "
        "by plurality, so neither is a threshold: exceeding one is not a win probability.",
    )


def chart_tornado(tornado: pd.DataFrame) -> str:
    charts.apply()
    fig, ax = charts.figure(7.6, 3.4)
    ys = np.arange(len(tornado))[::-1]
    base = tornado["base"].iloc[0]
    for y, row in zip(ys, tornado.itertuples()):
        ax.barh(y, row.low - base, left=base, color=charts.CATEGORICAL[1], height=0.55)
        ax.barh(y, row.high - base, left=base, color=charts.CATEGORICAL[0], height=0.55)
        ax.text(max(row.high, base) + 2200, y, f"swing {row.swing:,.0f} votes",
                va="center", fontsize=8, color=charts.INK)
    ax.axvline(base, color=charts.INK, lw=1.4)
    # Two series, so a legend is required — colour alone must never carry identity.
    ax.barh([], [], color=charts.CATEGORICAL[1], label="Parameter at its low end")
    ax.barh([], [], color=charts.CATEGORICAL[0], label="Parameter at its high end")
    ax.legend(loc="lower right", fontsize=8)
    ax.set_yticks(ys)
    ax.set_yticklabels(tornado["parameter"])
    ax.set_xlabel("Median county total (votes)")
    ax.set_title("What moves the result — one parameter at a time, others at midpoint")
    ax.grid(axis="y", visible=False)
    ax.xaxis.set_major_formatter(lambda x, _: f"{x/1000:.0f}k")
    charts.strip_spines(ax, keep=("bottom",))
    return charts.save(
        fig, "03_tornado.svg",
        "Scenario model, not a forecast. Every parameter shown is a PLACEHOLDER from "
        "config/assumptions.yaml, so this chart ranks the assumptions by how much they matter, "
        "not the world by how much it varies. Black line is the midpoint case.",
    )


def run() -> dict:
    config.ensure_dirs()
    path = config.DATA_PROCESSED / "wards.csv"
    if not path.exists():
        rep = report.Report("03_simulation.md", "Stage 3 — Scenario simulation", "No ward data.")
        rep.p("`data/processed/wards.csv` is absent. Run Stage 1 first.")
        rep.write()
        return {"state": "skipped", "summary": "no wards.csv", "gaps": ["wards"]}

    wards = pd.read_csv(path)
    scale = float(config.value("register.y2026_uniform_scale_factor"))
    wards["registered_voters_2026_scaled"] = wards["registered_voters_2022"] * scale

    # --- Model A ------------------------------------------------------------------------
    lev = sim.nomination_leverage(wards)
    const_lev = sim.constituency_leverage(wards)
    lev.to_csv(config.DATA_PROCESSED / "nomination_leverage.csv", index=False)
    c_lev = chart_leverage(lev)

    # --- Model B ------------------------------------------------------------------------
    results = {
        key: sim.simulate(wards, support_range=_support_range(key))
        for key in SCENARIOS
    }
    results_2026 = {
        key: sim.simulate(wards, register_col="registered_voters_2026_scaled",
                          register_label="T3 July 2026 register (605,703) [VERIFY]",
                          support_range=_support_range(key))
        for key in SCENARIOS
    }
    c_dist = chart_distribution(results)
    tornado = sim.parameter_tornado(wards)
    c_tor = chart_tornado(tornado)

    # --- report -------------------------------------------------------------------------
    rep = report.Report(
        "03_simulation.md", "Stage 3 — Scenario simulation",
        "Two models: where a nomination-poll gain is worth most, and what the ward "
        "arithmetic yields under stated assumptions.",
    )
    rep.scenario_label()
    rep.p(
        "Nothing in this report predicts an outcome. Every input is a placeholder from "
        "`config/assumptions.yaml`, and the models are a way of asking which assumptions matter."
    )

    rep.h2("A. Nomination-poll leverage")
    rep.chart(c_lev, "Countywide share gained per 10-point gain, by ward")
    rep.p(
        "If the party's poll samples in proportion to registered voters, a ward's leverage is "
        "exactly its share of the register. Ten points gained among Kyuso's voters moves Mulu's "
        f"countywide share by {lev.iloc[0]['leverage_per_10pt_gain']:.2f} points; ten points in "
        f"Tharaka moves it by {lev.iloc[-1]['leverage_per_10pt_gain']:.2f}."
    )
    rep.p(
        "**The proportional-sampling assumption is unconfirmed.** WPF has published no sample "
        "frame, and the pack lists the nomination-poll terms as [DATA NEEDED]. If the real "
        "instrument over-samples urban wards — the failure mode the proposal's own §3.1.3 warns "
        "about — this ranking changes. The ranking is only as good as that assumption."
    )
    top12 = lev.head(12)[["rank", "ward", "constituency", "registered_voters_2022",
                          "register_share", "leverage_per_10pt_gain", "cumulative_share"]].copy()
    top12.columns = ["Rank", "Ward", "Constituency", "Voters", "Share of register",
                     "Pts per 10-pt gain", "Cumulative share"]
    top12["Share of register"] = top12["Share of register"].map("{:.2%}".format)
    top12["Cumulative share"] = top12["Cumulative share"].map("{:.1%}".format)
    top12["Voters"] = top12["Voters"].map("{:,}".format)
    rep.table(top12, floatfmt="{:.2f}")
    rep.p(
        f"The top 12 wards hold {lev.head(12)['register_share'].sum():.1%} of the register. "
        "Concentration is the practical argument for a ward-ranked plan: the same effort is "
        f"worth {lev.iloc[0]['leverage_per_10pt_gain'] / lev.iloc[-1]['leverage_per_10pt_gain']:.1f}× "
        "more in the largest ward than the smallest."
    )
    rep.h3("By constituency")
    cl = const_lev.copy()
    cl.columns = ["Constituency", "Voters", "Share of register", "Pts per 10-pt gain"]
    cl["Share of register"] = cl["Share of register"].map("{:.1%}".format)
    cl["Voters"] = cl["Voters"].map("{:,}".format)
    rep.table(cl, floatfmt="{:.2f}")

    rep.h2("B. General-election paths")
    rep.chart(c_dist, "Distribution of Mulu's total votes under two support scenarios")
    rep.p(
        "**There is no 50% threshold.** Kenyan governor races are won by the most votes. The two "
        "reference lines are the 2022 winning tally (198,004) and 37.2% of the register — the "
        "share that tally represented. Exceeding either is not winning, and the percentages "
        "below are **not win probabilities**."
    )
    rep.p(
        "**A true win probability needs rival vote ranges.** None have been supplied, so "
        "`rivals.model_rivals` is false and no rival is modelled. Set it true in "
        "`assumptions.yaml` with per-rival ranges and this section changes to a contested model. "
        "Until then, these are benchmark comparisons only."
    )

    rows = []
    for register_label, group in (("IEBC 2022 (532,758)", results),
                                  ("T3 July 2026 (605,703) [VERIFY]", results_2026)):
        for key, res in group.items():
            s = res.summary()
            marks = sim.benchmarks(res.register_total)
            rows.append({
                "Register": register_label,
                "Scenario": SCENARIOS[key]["label"],
                "Median": f"{s['median']:,.0f}",
                "90% interval": f"{s['p5']:,.0f} – {s['p95']:,.0f}",
                "Above 198,004": f"{res.share_exceeding(198004):.1%}",
                "Above 37.2% of register": f"{res.share_exceeding(list(marks.values())[1]):.1%}",
            })
    rep.table(pd.DataFrame(rows))

    cur, comp = results["current"], results["competitive"]
    rep.h3("What this says")
    rep.bullets([
        f"**Under his current measured preference, the arithmetic does not reach the benchmark.** "
        f"Median {np.median(cur.totals):,.0f} votes, and no draw in 10,000 reaches 198,004. That "
        "is not a prediction of defeat. It is the gap between a 20–26% nomination-poll share and "
        "what winning a general election in this county took in 2022.",
        f"**Under a competitive scenario the benchmark is reachable but not comfortable.** "
        f"Median {np.median(comp.totals):,.0f}, with "
        f"{comp.share_exceeding(198004):.1%} of draws above 198,004. The competitive range is "
        "anchored on the 2022 winner's own ~60% of ballots cast.",
        "**The register choice moves the target, not the result.** On the T3 2026 register the "
        "37.2% benchmark rises to about 225,000, so the same performance clears a higher bar. "
        "The 605,703 figure is unverified and every figure derived from it carries 'verify'.",
        "**The two scenarios answer different questions.** The first asks what today's measured "
        "standing is worth. The second asks what winning looks like. The distance between them "
        "is the campaign's actual task.",
    ])

    rep.h2("What matters most")
    rep.chart(c_tor, "Sensitivity of the median county total to each parameter")
    t = tornado.copy()
    t["low"] = t["low"].map("{:,.0f}".format)
    t["high"] = t["high"].map("{:,.0f}".format)
    t["swing"] = t["swing"].map("{:,.0f}".format)
    t["base"] = t["base"].map("{:,.0f}".format)
    t.columns = ["Parameter", "At low end", "At high end", "Status", "Midpoint", "Swing"]
    rep.table(t)
    rep.p(
        "Support dominates turnout, and both dominate the home-advantage multiplier. That "
        "ordering is the useful output: it says the campaign's measurable objective is share, "
        "not mobilisation alone, and that the home-base assumption — the softest number in the "
        "file — changes the total least."
    )
    rep.h3("Wards that carry the total")
    wc = sim.ward_contribution(results["competitive"])
    wc_display = wc.copy()
    wc_display["mean_votes"] = wc_display["mean_votes"].map("{:,.0f}".format)
    wc_display["sd_votes"] = wc_display["sd_votes"].map("{:,.0f}".format)
    wc_display["share_of_total"] = wc_display["share_of_total"].map("{:.1%}".format)
    wc_display.columns = ["Ward", "Mean votes", "SD", "Share of county total"]
    rep.table(wc_display)

    rep.h2("Method and limits")
    rep.bullets([
        f"10,000 draws per scenario, seed {config.seed()}, fully reproducible.",
        "Turnout and support are drawn once per draw at county level, then varied by ward. "
        "Independent per-ward draws would average out across 40 wards and collapse the county "
        "distribution to false precision.",
        "Ward shares are capped at 1.0. The cap binds only in the home wards at the top of the "
        "competitive range.",
        "The 2026 register run scales every ward by the same factor. The registration drive was "
        "ward-based and growth was uneven, so this is known to be wrong in detail. It is used "
        "because inventing a per-ward growth pattern would be worse.",
        "No rival is modelled, so nothing here is a win probability.",
        "Every parameter is a PLACEHOLDER. The tornado chart ranks the assumptions, not the world.",
    ])
    rep.gaps([
        "Ward-level 2022 results (Forms 37A/37B) — would replace the placeholder support range "
        "with measured party strength per ward.",
        "Ward-level turnout — would replace the placeholder turnout range.",
        "The IEBC 2026 ward annex — would remove the uniform scaling assumption entirely.",
        "Rival vote ranges — required before any win probability can be produced.",
        "WPF's nomination-poll sample frame — the whole of Model A rests on it.",
    ])
    path_out = rep.write()
    return {
        "state": "ok",
        "summary": (f"leverage ranked; competitive median {np.median(comp.totals):,.0f}, "
                    f"{comp.share_exceeding(198004):.0%} above benchmark → {path_out}"),
        "gaps": ["ward-level 2022 results", "rival ranges"],
    }
