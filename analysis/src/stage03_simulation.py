"""Stage 3 — scenario simulation: general-election paths against two published benchmarks."""
from __future__ import annotations

import numpy as np
import pandas as pd

from src import charts, config, report, simulation as sim

# One scenario, anchored on an official result. Firefly works from existing records and its
# own analysis only, so no support range is taken from a measure of opinion.
SCENARIO = {
    "label": "Competitive general election",
    "range_keys": ("support.competitive_ward_low", "support.competitive_ward_high"),
    "gloss": "40–60% of ballots cast, anchored on the 2022 winner's ~60%",
}


def _support_range() -> tuple[float, float]:
    lo, hi = SCENARIO["range_keys"]
    return config.value(lo), config.value(hi)


def chart_distribution(res: sim.SimulationResult) -> str:
    charts.apply()
    fig, ax = charts.figure(7.4, 4.0)
    ax.hist(res.totals, bins=60, color=charts.CATEGORICAL[2], alpha=0.85,
            edgecolor=charts.SURFACE, linewidth=0.4)
    marks = sim.benchmarks(res.register_total)
    for i, (name, value) in enumerate(marks.items()):
        ax.axvline(value, color=charts.CATEGORICAL[7], lw=1.8, ls="--" if i else "-", zorder=5)
    median = np.median(res.totals)
    ax.axvline(median, color=charts.INK, lw=1.4, zorder=6)
    ax.text(median, ax.get_ylim()[1] * 0.97, f" median {median:,.0f}", fontsize=8,
            color=charts.INK, ha="left", va="top")
    marks_list = list(marks.values())
    ax.set_title(
        f"{SCENARIO['label']}: "
        f"{res.share_exceeding(marks_list[0]):.0%} above the 2022 tally · "
        f"{res.share_exceeding(marks_list[1]):.0%} above today's equivalent",
        fontsize=9.5)
    ax.set_xlabel("Mulu's simulated county total (votes)")
    ax.set_ylabel("Draws")
    ax.grid(axis="x", visible=False)
    charts.strip_spines(ax, keep=("bottom",))
    ax.xaxis.set_major_formatter(lambda x, _: f"{x/1000:.0f}k")
    return charts.save(
        fig, "03_vote_distribution.svg",
        "Scenario model, not a forecast. Solid red is the 2022 winning tally of 198,004, which "
        "the proposal measures against. Dashed red is 37.2% of the reported July 2026 "
        "register (Tier 3, verify), about 225,300 — the same share of a 13.7% larger electorate, and the "
        "like-for-like bar. The gap between the two lines is what a growing register costs. "
        "Governor races are won by plurality, so neither is a threshold: exceeding one is not "
        "a win probability.",
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

    # The reported July 2026 register (T3, verify) is the primary basis: it is the electorate that will
    # actually vote. The 2022 run is kept for comparison, because every target in the proposal
    # is still expressed against it.
    comp = sim.simulate(wards, register_col="registered_voters_2026_scaled",
                        register_label="Reported July 2026 register (605,703, T3, verify)",
                        support_range=_support_range())
    comp_2022 = sim.simulate(wards, support_range=_support_range())
    c_dist = chart_distribution(comp)
    tornado = sim.parameter_tornado(wards)
    c_tor = chart_tornado(tornado)

    # --- report -------------------------------------------------------------------------
    rep = report.Report(
        "03_simulation.md", "Stage 3 — Scenario simulation",
        "What the ward arithmetic yields under stated assumptions, against two published "
        "benchmarks.",
    )
    rep.scenario_label()
    rep.p(
        "Nothing in this report predicts an outcome. Every input is an official record or a "
        "placeholder from `config/assumptions.yaml`, and the model is a way of asking which "
        "assumptions matter."
    )

    rep.h2("General-election paths")
    rep.chart(c_dist, "Distribution of Mulu's total votes under the competitive scenario")
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
    for register_label, res in (("Reported July 2026 (605,703, T3, verify) — current", comp),
                                ("IEBC 2022 (532,758) — for comparison", comp_2022)):
        s_ = res.summary()
        marks = sim.benchmarks(res.register_total)
        rows.append({
            "Register": register_label,
            "Scenario": SCENARIO["label"],
            "Median": f"{s_['median']:,.0f}",
            "90% interval": f"{s_['p5']:,.0f} – {s_['p95']:,.0f}",
            "Above 198,004": f"{res.share_exceeding(198004):.1%}",
            "Above 37.2% of register": f"{res.share_exceeding(list(marks.values())[1]):.1%}",
        })
    rep.table(pd.DataFrame(rows))

    marks_now = list(sim.benchmarks(comp.register_total).values())
    above_2022 = comp.share_exceeding(marks_now[0])
    above_now = comp.share_exceeding(marks_now[1])
    rep.h3("What this says")
    rep.bullets([
        f"**Under a competitive scenario the benchmark is reachable but not comfortable.** "
        f"Median {np.median(comp.totals):,.0f}, with {comp.share_exceeding(198004):.1%} of draws "
        "above 198,004. The competitive range is anchored on the 2022 winner's own ~60% of "
        "ballots cast.",
        "**The register grew, so the bar rose.** On the July 2026 register of 605,703, as "
        f"reported (Tier 3, verify), the 37.2% benchmark is about {marks_now[1]:,.0f} votes, against the 198,004 the "
        "proposal measures against. The same performance now clears a higher bar.",
        "**Which benchmark you choose changes the answer more than the model does.** The "
        f"simulated total clears the 2022 tally in {above_2022:.0%} of draws, but clears 37.2% of "
        f"today's register in only {above_now:.0%}. Same model, same draws; a "
        f"{(above_2022 - above_now) * 100:.0f}-point swing from the choice of yardstick alone. "
        "Measuring a 2027 campaign against a 2022 tally on a register 13.7% larger flatters it.",
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
    top_param, last_param = tornado.iloc[0], tornado.iloc[-1]
    rep.p(
        f"**{top_param['parameter']}** moves the median most, by {top_param['swing']:,.0f} votes; "
        f"**{last_param['parameter']}** moves it least, by {last_param['swing']:,.0f}. That "
        "ordering is the useful output: it says which placeholder most needs an official record "
        "behind it."
    )
    rep.h3("Wards that carry the total")
    wc = sim.ward_contribution(comp)
    wc_display = wc.copy()
    wc_display["mean_votes"] = wc_display["mean_votes"].map("{:,.0f}".format)
    wc_display["sd_votes"] = wc_display["sd_votes"].map("{:,.0f}".format)
    wc_display["share_of_total"] = wc_display["share_of_total"].map("{:.1%}".format)
    wc_display.columns = ["Ward", "Mean votes", "SD", "Share of county total"]
    rep.table(wc_display)

    rep.h2("Method and limits")
    rep.bullets([
        f"10,000 draws, seed {config.seed()}, fully reproducible.",
        "Turnout and support are drawn once per draw at county level, then varied by ward. "
        "Independent per-ward draws would average out across 40 wards and collapse the county "
        "distribution to false precision.",
        "Ward shares are capped at 1.0. The cap binds only in the home wards at the top of the "
        "competitive range.",
        "The county register of 605,703 is Tier 3 (verify), and reported at county level only. "
        "Ward figures scale every 2022 ward by the same factor, which is known to be wrong in "
        "detail because the drive was ward-based and growth was uneven. County totals are not "
        "affected; ward totals are indicative.",
        "No rival is modelled, so nothing here is a win probability.",
        "Every parameter is a PLACEHOLDER. The tornado chart ranks the assumptions, not the world.",
    ])
    rep.gaps([
        "Ward-level 2022 results (Forms 37A/37B) — would replace the placeholder support range "
        "with measured party strength per ward.",
        "Ward-level turnout — would replace the placeholder turnout range.",
        "The IEBC 2026 ward annex — would remove the uniform scaling assumption entirely.",
        "Rival vote ranges — required before any win probability can be produced.",
    ])
    path_out = rep.write()
    return {
        "state": "ok",
        "summary": (f"competitive median {np.median(comp.totals):,.0f}, "
                    f"{comp.share_exceeding(198004):.0%} above benchmark → {path_out}"),
        "gaps": ["ward-level 2022 results", "rival ranges"],
    }
