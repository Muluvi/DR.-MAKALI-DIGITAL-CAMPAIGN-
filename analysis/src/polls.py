"""Poll arithmetic: margins of error, gap margins, and change tests.

Two rules bind everything here (CLAUDE.md §5):
  - different pollsters are never joined into one trend line;
  - a poll with no published sample size gets illustrative panels at n = 500, 1,000 and
    2,000, never a guessed n.
"""
from __future__ import annotations

import math
from dataclasses import dataclass

from scipy import stats

Z95 = stats.norm.ppf(0.975)  # 1.959963985...
ILLUSTRATIVE_N = (500, 1000, 2000)


def share_moe(p_pct: float, n: int, z: float = Z95) -> float:
    """95% margin of error on one candidate's share, in percentage points.

    Simple random sampling assumed. No pollster here publishes a design effect, so this
    is a floor on the true uncertainty, not the whole of it.
    """
    p = p_pct / 100.0
    return 100.0 * z * math.sqrt(p * (1 - p) / n)


def gap_variance(p1_pct: float, p2_pct: float, n: int) -> float:
    """Variance of the difference between two shares in the SAME poll.

    Under a multinomial, Var(p1 - p2) = [p1 + p2 - (p1 - p2)^2] / n, which is
    Var(p1) + Var(p2) - 2Cov(p1, p2) with Cov(p1, p2) = -p1*p2/n.

    The cross term matters, and it runs the opposite way to intuition. Two candidates'
    shares are negatively correlated, because a respondent choosing one cannot also
    choose the other. Subtracting a negative covariance ADDS to the variance, so the
    margin on a gap is WIDER than treating the two shares as independent would suggest —
    for Kasalu 37.4 vs Mulu 22.1 at n = 1,000, +-4.69 points rather than +-3.95.
    Independence is the optimistic error here, not the conservative one.
    """
    p1, p2 = p1_pct / 100.0, p2_pct / 100.0
    return (p1 + p2 - (p1 - p2) ** 2) / n


def gap_moe(p1_pct: float, p2_pct: float, n: int, z: float = Z95) -> float:
    return 100.0 * z * math.sqrt(gap_variance(p1_pct, p2_pct, n))


@dataclass
class ChangeTest:
    """Result of testing a change between two polls."""

    determinable: bool
    diff_pp: float
    z: float | None = None
    p_value: float | None = None
    significant: bool | None = None
    required_n: int | None = None
    note: str = ""

    @property
    def verdict(self) -> str:
        if not self.determinable:
            return "cannot determine"
        return "significant" if self.significant else "not significant"


def two_proportion_test(p1_pct: float, n1: int | None, p2_pct: float, n2: int | None) -> ChangeTest:
    """Two-proportion z-test for a change between two independent polls."""
    diff = p2_pct - p1_pct
    if not n1 or not n2:
        return ChangeTest(
            determinable=False,
            diff_pp=diff,
            required_n=required_n_for_share_change(p1_pct, p2_pct),
            note="Sample size not published for at least one round.",
        )
    p1, p2 = p1_pct / 100.0, p2_pct / 100.0
    pooled = (p1 * n1 + p2 * n2) / (n1 + n2)
    se = math.sqrt(pooled * (1 - pooled) * (1 / n1 + 1 / n2))
    if se == 0:
        return ChangeTest(determinable=False, diff_pp=diff, note="Zero standard error.")
    z = (p2 - p1) / se
    p_value = 2 * (1 - stats.norm.cdf(abs(z)))
    return ChangeTest(True, diff, z, p_value, p_value < 0.05)


def required_n_for_share_change(p1_pct: float, p2_pct: float, z: float = Z95) -> int | None:
    """Equal per-round n at which this share change would reach 95% significance.

    Not a substitute for the real sample size. It answers a narrower question: how big
    would the rounds have to have been for a change this size to mean anything?
    """
    p1, p2 = p1_pct / 100.0, p2_pct / 100.0
    diff = abs(p2 - p1)
    if diff == 0:
        return None
    pooled = (p1 + p2) / 2
    return math.ceil(2 * pooled * (1 - pooled) * (z / diff) ** 2)


def gap_change_test(
    lead1: float, mulu1: float, n1: int | None,
    lead2: float, mulu2: float, n2: int | None,
) -> ChangeTest:
    """Test whether the leader-to-Mulu gap changed between two polls.

    Within each poll the gap uses multinomial variance; across polls the two gaps are
    independent, so variances add.
    """
    gap1, gap2 = lead1 - mulu1, lead2 - mulu2
    diff = gap2 - gap1
    if not n1 or not n2:
        return ChangeTest(
            determinable=False,
            diff_pp=diff,
            required_n=required_n_for_gap_change(lead1, mulu1, lead2, mulu2),
            note="Sample size not published for at least one round.",
        )
    var = gap_variance(lead1, mulu1, n1) + gap_variance(lead2, mulu2, n2)
    se = 100.0 * math.sqrt(var)
    z = diff / se
    p_value = 2 * (1 - stats.norm.cdf(abs(z)))
    return ChangeTest(True, diff, z, p_value, p_value < 0.05)


def required_n_for_gap_change(
    lead1: float, mulu1: float, lead2: float, mulu2: float, z: float = Z95
) -> int | None:
    diff = abs((lead2 - mulu2) - (lead1 - mulu1))
    if diff == 0:
        return None
    # Variance at n = 1, summed over the two rounds; scale to find the n that fits.
    unit_var = 100.0 ** 2 * (gap_variance(lead1, mulu1, 1) + gap_variance(lead2, mulu2, 1))
    return math.ceil(unit_var * (z / diff) ** 2)
