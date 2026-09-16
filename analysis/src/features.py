"""Stage 4 feature assembly.

The rule that shapes this module: **never impute silently**. A feature whose data is
missing is dropped and named, and the weights of the survivors are renormalised with the
renormalisation stated. A feature that exists but has no variance across wards is also
dropped, because a constant cannot rank anything.
"""
from __future__ import annotations

from dataclasses import dataclass
from typing import Callable

import pandas as pd

from src import config


@dataclass
class Feature:
    key: str            # matches a key under index_weights in assumptions.yaml
    label: str
    direction: str      # "high" = a high raw value means high priority
    source: str
    build: Callable[[pd.DataFrame], pd.Series | None]
    unavailable_reason: str = ""


def _template(name: str) -> pd.DataFrame | None:
    path = config.DATA_TEMPLATES / f"{name}.csv"
    if not path.exists():
        return None
    df = pd.read_csv(path)
    return df if not df.empty else None


def _registered_voters(wards: pd.DataFrame) -> pd.Series:
    return wards["registered_voters_2022"].astype(float)


def _registration_growth(wards: pd.DataFrame) -> pd.Series | None:
    df = _template("register_2026_by_ward")
    if df is None:
        return None
    merged = wards.merge(df, on="ward", how="left")
    if merged["registered_voters_2026"].isna().any():
        return None
    return (merged["registered_voters_2026"] / merged["registered_voters_2022"] - 1).astype(float)


def _recognition_gap(wards: pd.DataFrame) -> pd.Series | None:
    df = _template("baseline_survey")
    if df is None:
        return None
    merged = wards.merge(df, on="ward", how="left")
    if merged["aided_recognition_pct"].isna().any():
        return None
    # The gap is what is missing, so a low recognition score is a high priority.
    return (100.0 - merged["aided_recognition_pct"]).astype(float)


def _connectivity(wards: pd.DataFrame) -> pd.Series | None:
    # Pack gap 20. The pack names USO coverage gains in a handful of Mwingi North wards
    # [S35], but says nothing about the other 37. Turning that into a 40-ward feature
    # would mean asserting the rest are worse, which no source states.
    return None


def _drought(wards: pd.DataFrame) -> pd.Series | None:
    # NDMA publishes Kitui at county level in this pack; sub-county detail is [DATA NEEDED].
    # A county constant has zero variance across wards, so it cannot enter a ward ranking.
    return None


def _party_strength(wards: pd.DataFrame) -> pd.Series | None:
    df = _template("results_2022_by_ward")
    if df is None:
        return None
    gov = df[df["race"] == "governor"]
    if gov.empty:
        return None
    strength = gov.groupby("ward").apply(
        lambda g: g["votes"].sum() / g["valid_votes_cast"].iloc[0], include_groups=False
    )
    merged = wards.merge(strength.rename("strength"), on="ward", how="left")
    if merged["strength"].isna().any():
        return None
    return merged["strength"].astype(float)


FEATURES: tuple[Feature, ...] = (
    Feature("registered_voters", "Registered voters", "high",
            "IEBC 2022 [S1]", _registered_voters),
    Feature("registration_growth", "Registration growth since 2022", "high",
            "IEBC 2026 ward annex", _registration_growth,
            "The 2026 register by ward is not published. The drive was ward-based, so growth "
            "is uneven and cannot be distributed pro rata without inventing it. Pack gap 6."),
    Feature("recognition_gap", "Recognition gap", "high",
            "Baseline survey", _recognition_gap,
            "No baseline survey has been run. This is the feature the campaign's own diagnosis "
            "depends on, and it carries the second-highest weight in the file."),
    Feature("connectivity", "Connectivity proxy", "high",
            "Ward-level coverage data", _connectivity,
            "No ward-level connectivity data exists. The pack records USO coverage gains in "
            "several Mwingi North wards [S35] but says nothing about the other 37, and "
            "inferring that the rest are worse would be inventing data. Pack gap 20."),
    Feature("drought_exposure", "Drought exposure", "high",
            "NDMA bulletins", _drought,
            "NDMA publishes Kitui at county level in this pack. A county-wide constant has no "
            "variance across wards and cannot rank them. Sub-county bulletins are [DATA NEEDED]."),
    Feature("party_strength_2022", "2022 party strength", "high",
            "IEBC Forms 37A/37B", _party_strength,
            "Ward-level 2022 results are not published in the pack. Pack gap 7."),
)


@dataclass
class FeatureSet:
    frame: pd.DataFrame           # ward + one column per available feature (raw)
    available: list[Feature]
    dropped: list[tuple[Feature, str]]
    weights: dict[str, float]     # renormalised over available features
    original_weights: dict[str, float]


def assemble(wards: pd.DataFrame) -> FeatureSet:
    data = {"ward": wards["ward"], "constituency": wards["constituency"]}
    available: list[Feature] = []
    dropped: list[tuple[Feature, str]] = []

    for feat in FEATURES:
        series = feat.build(wards)
        if series is None:
            dropped.append((feat, feat.unavailable_reason or "No data supplied."))
            continue
        if series.nunique() <= 1:
            dropped.append((feat, "Present but constant across all 40 wards, so it cannot rank."))
            continue
        data[feat.key] = series.to_numpy()
        available.append(feat)

    original = {f.key: float(config.value(f"index_weights.{f.key}")) for f in FEATURES}
    kept = {f.key: original[f.key] for f in available}
    total = sum(kept.values())
    weights = {k: v / total for k, v in kept.items()} if total else {}

    return FeatureSet(
        frame=pd.DataFrame(data),
        available=available,
        dropped=dropped,
        weights=weights,
        original_weights=original,
    )


def normalise(frame: pd.DataFrame, features: list[Feature]) -> pd.DataFrame:
    """Min-max each feature onto 0-1, so weights mean what they say."""
    out = frame[["ward", "constituency"]].copy()
    for feat in features:
        col = frame[feat.key].astype(float)
        span = col.max() - col.min()
        scaled = (col - col.min()) / span if span else col * 0.0
        out[feat.key] = scaled if feat.direction == "high" else 1.0 - scaled
    return out
