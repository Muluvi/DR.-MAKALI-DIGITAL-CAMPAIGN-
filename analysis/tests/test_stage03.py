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


def test_county_shock_keeps_the_distribution_wide(wards):
    """Independent per-ward draws would collapse the spread; the shared factor prevents it."""
    res = sim.simulate(wards, n_draws=4000)
    spread = np.percentile(res.totals, 95) - np.percentile(res.totals, 5)
    assert spread > 0.2 * np.median(res.totals), "county distribution is implausibly narrow"


def test_the_only_support_range_is_anchored_on_the_2022_result():
    """No support range may come from a measure of opinion (records and own analysis only)."""
    support = config.assumptions()["support"]
    assert "mulu_ward_low" not in support and "mulu_ward_high" not in support
    from src import stage03_simulation as s3
    assert s3._support_range() == (
        config.value("support.competitive_ward_low"), config.value("support.competitive_ward_high"))


def test_simulation_defaults_to_the_competitive_range(wards):
    from src import stage03_simulation as s3
    default = sim.simulate(wards, n_draws=500)
    explicit = sim.simulate(wards, n_draws=500, support_range=s3._support_range())
    assert np.array_equal(default.totals, explicit.totals)


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
    for name in ("03_vote_distribution.svg", "03_tornado.svg"):
        svg = (config.OUT_CHARTS / name).read_text(encoding="utf-8")
        assert "Scenario model, not a forecast" in svg, f"{name} lacks the scenario label"
