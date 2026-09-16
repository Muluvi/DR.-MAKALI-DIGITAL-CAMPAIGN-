"""Stage 2 — poll margins, gap margins and change tests."""
from __future__ import annotations

import math

import pytest

from src import polls


def test_share_moe_matches_the_textbook_value():
    # p = 0.5, n = 1000 -> 1.96 * sqrt(.25/1000) = 3.099 pp
    assert polls.share_moe(50.0, 1000) == pytest.approx(3.0996, abs=1e-3)


def test_share_moe_shrinks_with_root_n():
    """Quadrupling n halves the margin."""
    assert polls.share_moe(22.1, 500) / polls.share_moe(22.1, 2000) == pytest.approx(2.0, abs=1e-9)


def test_gap_variance_uses_the_multinomial_cross_term():
    """Var(p1-p2) = [p1 + p2 - (p1-p2)^2]/n, not the independent-samples formula."""
    p1, p2, n = 37.4, 22.1, 1000
    expected = (0.374 + 0.221 - (0.374 - 0.221) ** 2) / n
    assert polls.gap_variance(p1, p2, n) == pytest.approx(expected)


def test_gap_margin_is_wider_than_treating_shares_as_independent():
    """Var(p1-p2) = Var1 + Var2 - 2Cov, and Cov is negative, so the margin GROWS.

    This is the easy thing to get backwards: "negatively correlated" sounds like it
    should cancel out. It does for a sum; for a difference it compounds.
    """
    p1, p2, n = 37.4, 22.1, 1000
    multinomial = polls.gap_moe(p1, p2, n)
    independent = 100 * polls.Z95 * math.sqrt(
        (0.374 * (1 - 0.374) / n) + (0.221 * (1 - 0.221) / n)
    )
    assert multinomial > independent
    assert multinomial == pytest.approx(4.69, abs=0.01)
    assert independent == pytest.approx(3.95, abs=0.01)


def test_politrack_gap_is_significant():
    """9.0 points at n = 2,927 clears its own margin."""
    moe = polls.gap_moe(35.2, 26.2, 2927)
    assert moe == pytest.approx(2.82, abs=0.02)
    assert (35.2 - 26.2) > moe


def test_missing_sample_size_returns_cannot_determine():
    """The rule that matters: no n, no verdict."""
    result = polls.two_proportion_test(20.2, None, 22.1, None)
    assert not result.determinable
    assert result.verdict == "cannot determine"
    assert result.p_value is None
    assert result.significant is None


def test_gap_change_with_missing_n_cannot_determine():
    result = polls.gap_change_test(31.3, 20.2, None, 37.4, 22.1, None)
    assert result.verdict == "cannot determine"
    assert result.diff_pp == pytest.approx(4.2, abs=1e-9)


def test_change_test_works_when_sample_sizes_are_known():
    """With large equal samples a 1.9-point move is detectable; with small ones it is not."""
    big = polls.two_proportion_test(20.2, 5000, 22.1, 5000)
    assert big.determinable and big.significant
    small = polls.two_proportion_test(20.2, 400, 22.1, 400)
    assert small.determinable and not small.significant


def test_required_n_is_the_threshold_it_claims_to_be():
    """At the returned n the change should be significant; well below it, not."""
    n = polls.required_n_for_share_change(20.2, 22.1)
    assert polls.two_proportion_test(20.2, n, 22.1, n).significant
    assert not polls.two_proportion_test(20.2, int(n * 0.5), 22.1, int(n * 0.5)).significant


def test_no_change_has_no_required_n():
    assert polls.required_n_for_share_change(22.1, 22.1) is None


def test_stage02_runs_and_writes_its_report_and_charts():
    from src import config, stage02_polls
    result = stage02_polls.run()
    assert result["state"] == "ok"
    assert (config.REPORTS / "02_polls.md").exists()
    for name in ("02_poll_shares.svg", "02_gap_to_leader.svg", "02_moe_sensitivity.svg"):
        path = config.OUT_CHARTS / name
        assert path.exists() and path.stat().st_size > 2000


def test_report_states_cannot_determine_and_skips_the_bayesian_average():
    from src import config, stage02_polls
    stage02_polls.run()
    text = (config.REPORTS / "02_polls.md").read_text(encoding="utf-8")
    assert "cannot determine" in text
    assert "Bayesian poll average" in text and "**Skipped.**" in text
    # The June/August comparability caveats are mandatory.
    assert "excluded Ngilu" in text
    assert "0.6% undecided" in text and "6.0%" in text
