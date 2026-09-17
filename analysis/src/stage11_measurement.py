"""Stage 11 — measurement design for the Direct phase.

Power calculations, a stratified holdout assignment, an interrupted-time-series template
and KPI definitions. The holdout assignment is confidential and never leaves this folder.
"""
from __future__ import annotations

import numpy as np
import pandas as pd
from scipy import stats

from src import charts, config, report


def mde_two_proportion(baseline: float, n_per_arm: int, alpha: float, power: float) -> float:
    """Minimum detectable effect, in percentage points, for a two-proportion test.

    Solved on the pooled-variance approximation: the smallest lift that this arm size can
    distinguish from the baseline at the given alpha and power.
    """
    z_alpha = stats.norm.ppf(1 - alpha / 2)
    z_beta = stats.norm.ppf(power)
    # Iterate: the variance depends on the effect, and the effect on the variance.
    effect = 0.01
    for _ in range(80):
        p2 = min(baseline + effect, 0.999)
        pooled = (baseline + p2) / 2
        se_null = np.sqrt(2 * pooled * (1 - pooled) / n_per_arm)
        se_alt = np.sqrt((baseline * (1 - baseline) + p2 * (1 - p2)) / n_per_arm)
        new = z_alpha * se_null + z_beta * se_alt
        if abs(new - effect) < 1e-9:
            break
        effect = new
    return effect * 100


def power_grid() -> pd.DataFrame:
    alpha = float(config.value("measurement.alpha"))
    power = float(config.value("measurement.power"))
    rows = []
    for baseline in config.value("measurement.baseline_rates"):
        for size in config.value("measurement.list_sizes"):
            per_arm = size // 2
            rows.append({
                "List size": f"{size:,}",
                "Per arm": f"{per_arm:,}",
                "Baseline rate": f"{baseline:.0%}",
                "MDE (pp)": round(mde_two_proportion(baseline, per_arm, alpha, power), 2),
                "MDE (relative)": f"{mde_two_proportion(baseline, per_arm, alpha, power) / (baseline * 100):.0%}",
            })
    return pd.DataFrame(rows)


def assign_holdouts(wards: pd.DataFrame) -> pd.DataFrame:
    """Randomly assign holdout wards, stratified by constituency, with a fixed seed.

    Stratifying matters: an unstratified draw could put every holdout in Mwingi and
    confound the treatment effect with region.
    """
    share = float(config.value("measurement.holdout_share"))
    rng = config.rng()
    out = wards[["ward", "constituency", "registered_voters_2022"]].copy()
    out["arm"] = "treatment"

    for constituency, group in out.groupby("constituency"):
        k = max(1, int(round(len(group) * share)))
        chosen = rng.choice(group.index.to_numpy(), size=k, replace=False)
        out.loc[chosen, "arm"] = "holdout"
    return out


def its_template() -> str:
    return '''"""Interrupted time series — segmented regression on weekly engagement.

Fill `weekly.csv` with one row per week: week_start, engagements, followers, posts.
Set LAUNCH_WEEK to the first week of the campaign.

The three coefficients answer three different questions:
  time        - the pre-launch trend (what was already happening)
  after       - the immediate level shift at launch (a step change)
  time_after  - the change in slope after launch (a change in trajectory)

A campaign that produces a step but no slope change bought a spike, not momentum.
"""
import pandas as pd
import statsmodels.formula.api as smf

LAUNCH_WEEK = "2026-11-01"   # set me

df = pd.read_csv("weekly.csv", parse_dates=["week_start"]).sort_values("week_start")
launch = pd.Timestamp(LAUNCH_WEEK)

df["time"] = range(len(df))
df["after"] = (df["week_start"] >= launch).astype(int)
df["time_after"] = (df["time"] - df.loc[df["after"] == 1, "time"].min()).clip(lower=0) * df["after"]

model = smf.ols("engagements ~ time + after + time_after", data=df).fit()
print(model.summary())

# Minimum honest sample: at least 8 pre-launch and 8 post-launch weeks. Below that the
# slope terms are not identified and the model will still print a confident-looking table.
assert (df["after"] == 0).sum() >= 8, "too few pre-launch weeks to estimate a trend"
'''


def chart_mde(grid: pd.DataFrame) -> str:
    charts.apply()
    fig, ax = charts.figure(7.2, 3.8)
    for i, baseline in enumerate(sorted(grid["Baseline rate"].unique())):
        sub = grid[grid["Baseline rate"] == baseline]
        sizes = [int(s.replace(",", "")) for s in sub["List size"]]
        ax.plot(sizes, sub["MDE (pp)"], marker="o", markersize=5, lw=2,
                color=charts.CATEGORICAL[i], label=f"Baseline {baseline}")
    ax.set_xscale("log")
    ax.set_xlabel("SMS list size (both arms combined, log scale)")
    ax.set_ylabel("Minimum detectable effect (percentage points)")
    ax.set_title("What each list size can actually detect")
    ax.legend(loc="upper right", fontsize=8)
    charts.strip_spines(ax)
    return charts.save(
        fig, "11_mde.svg",
        f"Two-proportion test, alpha {config.value('measurement.alpha')}, power "
        f"{config.value('measurement.power'):.0%}, equal arms. Baseline rates are illustrative "
        "placeholders until the Week 1 audit measures a real one.",
    )


def run() -> dict:
    config.ensure_dirs()
    path = config.DATA_PROCESSED / "wards.csv"
    if not path.exists():
        rep = report.Report("11_measurement.md", "Stage 11 — Measurement design", "No ward data.")
        rep.p("`data/processed/wards.csv` is absent. Run Stage 1 first.")
        rep.write()
        return {"state": "skipped", "summary": "no wards.csv", "gaps": ["wards"]}

    wards = pd.read_csv(path)
    grid = power_grid()
    holdouts = assign_holdouts(wards)
    holdouts.to_csv(config.DATA_PROCESSED / "holdout_assignment.csv", index=False)
    (config.ANALYSIS_ROOT / "outputs" / "its_template.py").write_text(its_template(), encoding="utf-8")
    c_mde = chart_mde(grid)

    kpis = pd.DataFrame([
        {"KPI": "Consented contacts", "Formula": "count of opt-in records with timestamped consent",
         "Source": "SMS platform", "Frequency": "weekly", "Owner": "Firefly data lead"},
        {"KPI": "SMS delivery rate", "Formula": "delivered / sent",
         "Source": "aggregator receipts", "Frequency": "per send", "Owner": "Firefly ops"},
        {"KPI": "USSD completion rate", "Formula": "sessions reaching the final screen / sessions started",
         "Source": "USSD platform", "Frequency": "weekly", "Owner": "Firefly ops"},
        {"KPI": "Engagement rate", "Formula": "(reactions + comments + shares) / followers, per post",
         "Source": "platform analytics", "Frequency": "weekly", "Owner": "Campaign social team"},
        {"KPI": "Share of voice", "Formula": "mentions of Mulu / mentions of all four candidates",
         "Source": "manual monitoring", "Frequency": "weekly", "Owner": "Firefly analyst"},
        {"KPI": "Net sentiment", "Formula": "(positive − negative) / total coded comments",
         "Source": "Stage 7 coding", "Frequency": "fortnightly", "Owner": "Firefly analyst"},
        {"KPI": "Aided recognition", "Formula": "% recognising Mulu from a prompted list, by ward",
         "Source": "baseline and tracking survey", "Frequency": "quarterly", "Owner": "Independent facilitator"},
        {"KPI": "Cost per consented contact", "Formula": "channel spend / net new consented contacts",
         "Source": "finance + SMS platform", "Frequency": "monthly", "Owner": "Campaign finance"},
        {"KPI": "Holdout gap", "Formula": "treatment ward metric − holdout ward metric",
         "Source": "this stage's assignment", "Frequency": "monthly", "Owner": "Firefly analyst"},
    ])

    rep = report.Report(
        "11_measurement.md", "Stage 11 — Measurement design",
        "What the Direct phase can actually detect, and how it will be measured.",
    )
    rep.chart(c_mde, "Minimum detectable effect by list size")

    rep.h2("Power: what each list size can detect")
    rep.p(
        f"Two-proportion tests at alpha {config.value('measurement.alpha')} and "
        f"{config.value('measurement.power'):.0%} power, split into equal arms. The baseline "
        "rates are placeholders until the Week 1 audit measures a real one — the shape of the "
        "curve is the point, not the exact numbers."
    )
    rep.table(grid)
    small = grid[(grid["List size"] == "1,000") & (grid["Baseline rate"] == "5%")]
    small_mde = float(small["MDE (pp)"].iloc[0])
    rep.bullets([
        "**Small lists cannot detect small lifts.** At a 5% baseline, a 1,000-person list "
        f"detects only a {small_mde:.1f}-point difference — a near-doubling of response. "
        "Anything subtler is invisible.",
        "**Test big, or do not test.** Meaningful A/B testing of message variants needs lists in "
        "the tens of thousands. Below that, run the better-judged message rather than pretending "
        "to measure.",
        "**Every test is constrained by the 48-hour lodging rule** [S53]. Both arms must be "
        "lodged in advance, so no test can be adapted mid-flight.",
    ])

    rep.h2("Holdout assignment")
    n_hold = int((holdouts["arm"] == "holdout").sum())
    rep.p(
        f"{n_hold} of 40 wards assigned to holdout, stratified by constituency, seed "
        f"{config.seed()}. Stratifying is not optional here: an unstratified draw could put every "
        "holdout in Mwingi and confound the campaign effect with region."
    )
    dist = holdouts.groupby(["constituency", "arm"]).size().unstack(fill_value=0).reset_index()
    dist.columns.name = None
    rep.table(dist, floatfmt="{:.0f}")
    rep.p(
        f"**The assignment itself is confidential** and is written to "
        "`data/processed/holdout_assignment.csv`, which git ignores. It is excluded from the "
        "site export by `site_export.never_publish`. If the field team or a rival learns which "
        "wards are controls, the experiment is dead — holdout wards must be left genuinely "
        "untreated, which only works if nobody is tempted to treat them."
    )
    rep.p(
        f"Holding out {n_hold} wards costs roughly "
        f"{holdouts.loc[holdouts['arm'] == 'holdout', 'registered_voters_2022'].sum():,} voters of "
        "campaign contact. That is the price of knowing whether any of it worked."
    )

    rep.h2("Interrupted time series")
    rep.p(
        "`outputs/its_template.py` holds a segmented regression on weekly engagement. Three "
        "coefficients, three questions: the pre-launch trend, the immediate level shift at "
        "launch, and the change in slope afterwards. A campaign that produces a step but no slope "
        "change bought a spike, not momentum."
    )
    rep.p(
        "The template refuses to run on fewer than eight pre-launch weeks. Below that the slope "
        "terms are not identified, and the model would still print a confident-looking table. "
        "**Baseline collection must therefore start now**, not at launch: with a decision window "
        "in late 2026, the pre-period is already short."
    )

    rep.h2("KPI definitions")
    rep.table(kpis)
    rep.p(
        "Every KPI above is computable from a named source. Two depend on inputs that do not yet "
        "exist: net sentiment needs Stage 7's coded comments, and aided recognition needs the "
        "baseline survey."
    )

    rep.gaps([
        "A measured baseline response rate, which replaces the illustrative rates in the power "
        "grid. This comes from the Week 1 audit.",
        "Consented list size by ward, without which the power grid cannot be tied to real arms.",
        "At least eight weeks of pre-launch weekly engagement, for the interrupted time series.",
        "Confirmation of whether the 8am–6pm sending window from the 2020 draft revision is in "
        "force [S55] — it constrains test scheduling.",
    ])
    path_out = rep.write()
    return {"state": "ok", "summary": f"{n_hold} holdout wards, MDE grid, ITS template → {path_out}",
            "gaps": ["measured baseline rate"]}
