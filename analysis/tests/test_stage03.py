"""Stage 3 — simulation reproducibility, benchmarks and the no-forecast rules."""
from __future__ import annotations

import numpy as np
import pandas as pd
import pytest

from src import config, simulation as sim


@pytest.fixture(scope="module")
def wards():
    path = config.DATA_PROCESSED / "wards.csv"
    if not path.exists():
        pytest.skip("wards.csv absent")
    return pd.read_csv(path)


def test_simulation_is_reproducible(wards):
    a = sim.simulate(wards, n_draws=500)
    b = sim.simulate(wards, n_draws=500)
    assert np.array_equal(a.totals, b.totals), "same seed must give identical draws"


def test_draw_count_comes_from_config(wards):
    assert sim.simulate(wards).n_draws == config.value("simulation.n_draws") == 10000


def test_no_draw_exceeds_the_register(wards):
    """A candidate cannot receive more votes than there are registered voters."""
    res = sim.simulate(wards, n_draws=2000, support_range=(0.9, 1.0), turnout_range=(0.95, 1.0))
    assert res.totals.max() <= res.register_total


def test_ward_shares_are_capped_at_one(wards):
    """The home multiplier must not push a share above 100%."""
    res = sim.simulate(wards, n_draws=500, support_range=(0.9, 0.99), home_multiplier=1.35)
    per_ward_share = res.ward_votes / wards["registered_voters_2022"].to_numpy()
    assert per_ward_share.max() <= 1.0 + 1e-9


def test_benchmarks_are_the_two_published_ones_and_no_threshold(wards):
    res = sim.simulate(wards, n_draws=100)
    marks = sim.benchmarks(res.register_total)
    assert len(marks) == 2
    assert 198004 in marks.values()
    # 37.2% of the 2022 register reproduces the 2022 tally to within rounding.
    assert abs(list(marks.values())[1] - 198004) < 500
    assert config.value("benchmarks.no_fixed_threshold") is True


def test_leverage_is_register_share_and_sums_to_one(wards):
    lev = sim.nomination_leverage(wards)
    assert len(lev) == 40
    assert lev["register_share"].sum() == pytest.approx(1.0)
    assert lev["cumulative_share"].iloc[-1] == pytest.approx(1.0)
    assert lev.iloc[0]["ward"] == "Kyuso"  # largest register
    assert lev["leverage_per_10pt_gain"].iloc[0] == pytest.approx(
        lev["register_share"].iloc[0] * 10)


def test_leverage_ranking_is_monotonic_in_register(wards):
    lev = sim.nomination_leverage(wards)
    assert lev["registered_voters_2022"].is_monotonic_decreasing


def test_constituency_leverage_sums_to_one(wards):
    cl = sim.constituency_leverage(wards)
    assert len(cl) == 8
    assert cl["register_share"].sum() == pytest.approx(1.0)


def test_county_shock_keeps_the_distribution_wide(wards):
    """Independent per-ward draws would collapse the spread; the shared factor prevents it."""
    res = sim.simulate(wards, n_draws=4000)
    spread = np.percentile(res.totals, 95) - np.percentile(res.totals, 5)
    assert spread > 0.2 * np.median(res.totals), "county distribution is implausibly narrow"


def test_current_and_competitive_scenarios_differ(wards):
    from src import stage03_simulation as s3
    cur = sim.simulate(wards, support_range=s3._support_range("current"))
    comp = sim.simulate(wards, support_range=s3._support_range("competitive"))
    assert np.median(comp.totals) > np.median(cur.totals) * 1.5


def test_tornado_ranks_support_above_home_advantage(wards):
    t = sim.parameter_tornado(wards)
    assert t.iloc[0]["swing"] > t.iloc[-1]["swing"]
    assert "support" in t.iloc[0]["parameter"].lower()


def test_rivals_are_not_modelled_so_no_win_probability_is_claimed():
    assert config.value("rivals.model_rivals") is False
    from src import stage03_simulation
    stage03_simulation.run()
    text = (config.REPORTS / "03_simulation.md").read_text(encoding="utf-8")
    assert "not win probabilities" in text or "not a win probability" in text
    assert "no 50% threshold" in text.lower() or "There is no 50% threshold" in text


def test_every_stage3_output_carries_the_scenario_label():
    """CLAUDE.md §4 — never present a simulation as a forecast."""
    from src import stage03_simulation
    stage03_simulation.run()
    text = (config.REPORTS / "03_simulation.md").read_text(encoding="utf-8")
    assert config.SCENARIO_LABEL in text
    for name in ("03_nomination_leverage.svg", "03_vote_distribution.svg", "03_tornado.svg"):
        svg = (config.OUT_CHARTS / name).read_text(encoding="utf-8")
        assert "Scenario model, not a forecast" in svg, f"{name} lacks the scenario label"


def test_nomination_assumption_is_flagged_unconfirmed():
    a = config.assumption("nomination.poll_samples_proportional_to_register")
    assert a.is_placeholder
    assert "UNCONFIRMED" in a.rationale
