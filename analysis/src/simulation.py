"""Stage 3 models. Both are scenario models. Neither is a forecast.

Model A — nomination-poll leverage. If the party's poll samples in proportion to
registered voters (an UNCONFIRMED assumption), a ward's leverage on Mulu's countywide
share is simply its share of the register.

Model B — general-election paths. Per-ward turnout and support are drawn from ranges in
assumptions.yaml and summed to a county total, which is then compared against two
published benchmarks. Kenyan governor races are won by plurality, so there is no
threshold to clear and no win probability is produced.
"""
from __future__ import annotations

from dataclasses import dataclass

import numpy as np
import pandas as pd

from src import config

HOME_CONSTITUENCY = "Kitui Central"


# --- Model A: nomination leverage ------------------------------------------------------

def nomination_leverage(wards: pd.DataFrame) -> pd.DataFrame:
    """Each ward's share of the register, and what a gain there is worth countywide.

    Under proportional sampling, a gain of g points among a ward's voters moves the
    countywide share by g * (ward register / county register). That is the whole model:
    it is arithmetic, not a simulation, and its honesty rests entirely on whether the
    proportional-sampling assumption holds.
    """
    total = wards["registered_voters_2022"].sum()
    df = wards.copy()
    df["register_share"] = df["registered_voters_2022"] / total
    df["leverage_per_10pt_gain"] = df["register_share"] * 10
    df["cumulative_share"] = (
        df.sort_values("registered_voters_2022", ascending=False)["register_share"].cumsum()
    )
    df = df.sort_values("registered_voters_2022", ascending=False).reset_index(drop=True)
    df["rank"] = df.index + 1
    df["cumulative_share"] = df["register_share"].cumsum()
    return df


def constituency_leverage(wards: pd.DataFrame) -> pd.DataFrame:
    total = wards["registered_voters_2022"].sum()
    grp = (
        wards.groupby("constituency")["registered_voters_2022"].sum()
        .sort_values(ascending=False).reset_index()
    )
    grp["register_share"] = grp["registered_voters_2022"] / total
    grp["leverage_per_10pt_gain"] = grp["register_share"] * 10
    return grp


# --- Model B: general-election paths ---------------------------------------------------

@dataclass
class SimulationResult:
    totals: np.ndarray            # (draws,) county totals
    ward_votes: np.ndarray        # (draws, wards)
    ward_names: list[str]
    register_label: str
    register_total: int
    n_draws: int

    def summary(self) -> dict[str, float]:
        q = np.percentile(self.totals, [5, 25, 50, 75, 95])
        return {
            "mean": float(self.totals.mean()),
            "sd": float(self.totals.std(ddof=1)),
            "p5": float(q[0]), "p25": float(q[1]), "median": float(q[2]),
            "p75": float(q[3]), "p95": float(q[4]),
            "min": float(self.totals.min()), "max": float(self.totals.max()),
        }

    def share_exceeding(self, benchmark: float) -> float:
        """Share of draws above a benchmark. NOT a win probability — see the report."""
        return float((self.totals > benchmark).mean())


def simulate(
    wards: pd.DataFrame,
    register_col: str = "registered_voters_2022",
    register_label: str = "IEBC 2022 register (532,758)",
    n_draws: int | None = None,
    turnout_range: tuple[float, float] | None = None,
    support_range: tuple[float, float] | None = None,
    home_multiplier: float | None = None,
    rng: np.random.Generator | None = None,
) -> SimulationResult:
    """Draw turnout and support per ward, per draw, and sum to a county total."""
    rng = rng or config.rng()
    n_draws = n_draws or int(config.value("simulation.n_draws"))
    t_lo, t_hi = turnout_range or (
        config.value("turnout.ward_low"), config.value("turnout.ward_high"))
    s_lo, s_hi = support_range or (
        config.value("support.mulu_ward_low"), config.value("support.mulu_ward_high"))
    home = home_multiplier if home_multiplier is not None else config.value(
        "support.home_advantage_multiplier")

    register = wards[register_col].to_numpy(dtype=float)
    n_wards = len(register)

    # Hierarchical draw: one county-level value per draw, then ward variation around it.
    #
    # Drawing each ward independently would be wrong in a way that flatters the model.
    # Forty independent draws average out, and the county total collapses to a narrow
    # band that looks like precision but is an artefact of the arithmetic. Turnout and
    # support move together across a county: a high-turnout year is high nearly
    # everywhere. The shared factor keeps the uncertainty the ranges are meant to carry.
    t_disp = float(config.value("turnout.ward_dispersion"))
    s_disp = float(config.value("support.ward_dispersion"))

    county_turnout = rng.uniform(t_lo, t_hi, size=(n_draws, 1))
    county_support = rng.uniform(s_lo, s_hi, size=(n_draws, 1))

    turnout = county_turnout + rng.uniform(-t_disp, t_disp, size=(n_draws, n_wards))
    support = county_support + rng.uniform(-s_disp, s_disp, size=(n_draws, n_wards))
    turnout = np.clip(turnout, 0.0, 1.0)
    support = np.clip(support, 0.0, 1.0)

    multiplier = np.where(
        (wards["constituency"] == HOME_CONSTITUENCY).to_numpy(), home, 1.0
    )
    # A share cannot exceed 1. The cap binds only in the home wards at the top of the
    # support range, and leaving it out would let the model print impossible vote counts.
    support = np.clip(support * multiplier, 0.0, 1.0)

    ward_votes = register * turnout * support
    return SimulationResult(
        totals=ward_votes.sum(axis=1),
        ward_votes=ward_votes,
        ward_names=wards["ward"].tolist(),
        register_label=register_label,
        register_total=int(register.sum()),
        n_draws=n_draws,
    )


def benchmarks(register_total: int) -> dict[str, float]:
    """The two published benchmarks. There is no legal threshold to clear."""
    return {
        "2022 winning tally (198,004)": float(config.value("benchmarks.winning_tally_2022")),
        f"37.2% of this register ({register_total:,})":
            register_total * float(config.value("benchmarks.winner_share_of_register_2022")),
    }


# --- Sensitivity -----------------------------------------------------------------------

def parameter_tornado(wards: pd.DataFrame, register_col: str = "registered_voters_2022") -> pd.DataFrame:
    """One-at-a-time sensitivity: each parameter to its extremes, others at midpoint.

    Reported as the swing in the median county total, which is what a reader is actually
    asking about when they ask which assumption matters.
    """
    t_lo, t_hi = config.value("turnout.ward_low"), config.value("turnout.ward_high")
    s_lo, s_hi = config.value("support.mulu_ward_low"), config.value("support.mulu_ward_high")
    home = config.value("support.home_advantage_multiplier")
    t_mid, s_mid = (t_lo + t_hi) / 2, (s_lo + s_hi) / 2

    def median_at(turnout, support, home_mult) -> float:
        res = simulate(
            wards, register_col=register_col,
            turnout_range=(turnout, turnout), support_range=(support, support),
            home_multiplier=home_mult, rng=config.rng(),
        )
        return float(np.median(res.totals))

    base = median_at(t_mid, s_mid, home)
    rows = [
        {
            "parameter": f"Ward turnout ({t_lo:.0%}–{t_hi:.0%})",
            "low": median_at(t_lo, s_mid, home),
            "high": median_at(t_hi, s_mid, home),
            "status": "PLACEHOLDER",
        },
        {
            "parameter": f"Mulu's ward support ({s_lo:.0%}–{s_hi:.0%})",
            "low": median_at(t_mid, s_lo, home),
            "high": median_at(t_mid, s_hi, home),
            "status": "PLACEHOLDER",
        },
        {
            "parameter": f"Home advantage (1.00–{home:.2f}×)",
            "low": median_at(t_mid, s_mid, 1.0),
            "high": median_at(t_mid, s_mid, home),
            "status": "PLACEHOLDER",
        },
    ]
    df = pd.DataFrame(rows)
    df["base"] = base
    df["swing"] = (df["high"] - df["low"]).abs()
    return df.sort_values("swing", ascending=False).reset_index(drop=True)


def ward_contribution(result: SimulationResult, top: int = 12) -> pd.DataFrame:
    """Which wards contribute most to the county total, and to its variance."""
    mean_votes = result.ward_votes.mean(axis=0)
    sd_votes = result.ward_votes.std(axis=0, ddof=1)
    df = pd.DataFrame({
        "ward": result.ward_names,
        "mean_votes": mean_votes,
        "sd_votes": sd_votes,
        "share_of_total": mean_votes / mean_votes.sum(),
    })
    return df.sort_values("mean_votes", ascending=False).head(top).reset_index(drop=True)
