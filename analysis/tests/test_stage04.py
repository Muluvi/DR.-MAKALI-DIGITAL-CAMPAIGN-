"""Stage 4 — index, sensitivity and clustering.

With one real feature the pipeline barely exercises this machinery, so the multi-feature
paths are proved here with SYNTHETIC data. Synthetic frames are built in-memory, marked
as such, and never written to data/ or outputs/ (CLAUDE.md §1).
"""
from __future__ import annotations

import numpy as np
import pandas as pd
import pytest

from src import config, features as featlib, stage04_wards as s4


@pytest.fixture
def real_wards():
    path = config.DATA_PROCESSED / "wards.csv"
    if not path.exists():
        pytest.skip("wards.csv absent")
    return pd.read_csv(path)


@pytest.fixture
def synthetic_normalised():
    """SYNTHETIC: 40 wards, three features with known structure. Never exported."""
    rng = np.random.default_rng(1234)
    n = 40
    group = np.repeat([0, 1, 2, 3], 10)
    return pd.DataFrame({
        "ward": [f"SYNTHETIC-{i:02d}" for i in range(n)],
        "constituency": np.repeat([f"SYN-C{i}" for i in range(4)], 10),
        "registered_voters": np.clip(group * 0.3 + rng.normal(0, 0.03, n), 0, 1),
        "recognition_gap": np.clip((3 - group) * 0.3 + rng.normal(0, 0.03, n), 0, 1),
        "connectivity": np.clip(rng.random(n), 0, 1),
    })


# --- normalisation and scoring --------------------------------------------------------

def test_normalise_maps_onto_zero_one(real_wards):
    fs = featlib.assemble(real_wards)
    norm = featlib.normalise(fs.frame, fs.available)
    for feat in fs.available:
        assert norm[feat.key].min() == pytest.approx(0.0)
        assert norm[feat.key].max() == pytest.approx(1.0)


def test_score_is_the_weighted_sum(synthetic_normalised):
    weights = {"registered_voters": 0.5, "recognition_gap": 0.3, "connectivity": 0.2}
    got = s4.score(synthetic_normalised, weights)
    expected = (synthetic_normalised["registered_voters"] * 0.5
                + synthetic_normalised["recognition_gap"] * 0.3
                + synthetic_normalised["connectivity"] * 0.2)
    assert np.allclose(got, expected)


def test_score_stays_within_zero_one_when_weights_sum_to_one(synthetic_normalised):
    weights = {"registered_voters": 0.5, "recognition_gap": 0.3, "connectivity": 0.2}
    s = s4.score(synthetic_normalised, weights)
    assert s.min() >= 0.0 and s.max() <= 1.0


# --- the no-imputation rule -----------------------------------------------------------

def test_missing_features_are_dropped_not_imputed(real_wards):
    fs = featlib.assemble(real_wards)
    assert len(fs.available) + len(fs.dropped) == len(featlib.FEATURES)
    assert fs.frame.notna().all().all(), "no NaN may survive into the feature frame"
    for feat, reason in fs.dropped:
        assert feat.key not in fs.frame.columns
        assert reason.strip(), f"{feat.key} dropped without a stated reason"


def test_surviving_weights_are_renormalised_to_one(real_wards):
    fs = featlib.assemble(real_wards)
    assert sum(fs.weights.values()) == pytest.approx(1.0)


def test_a_constant_feature_is_dropped_because_it_cannot_rank(real_wards):
    """Drought is county-wide here; a constant must never enter a ward ranking."""
    wards = real_wards.copy()
    wards["constant"] = 1.0  # SYNTHETIC constant
    feat = featlib.Feature("drought_exposure", "Constant", "high", "synthetic",
                           lambda df: pd.Series(1.0, index=df.index))
    series = feat.build(wards)
    assert series.nunique() == 1
    fs = featlib.assemble(wards)
    assert "drought_exposure" not in fs.frame.columns


# --- sensitivity ----------------------------------------------------------------------

def test_sensitivity_is_degenerate_with_one_feature(real_wards):
    """One feature means every weight vector is [1.0]: zero rank range is degeneracy."""
    fs = featlib.assemble(real_wards)
    if len(fs.available) != 1:
        pytest.skip("more than one feature is available")
    norm = featlib.normalise(fs.frame, fs.available)
    sens = s4.rank_sensitivity(norm, fs.weights, 50, 10.0)
    assert (sens["rank_range"] == 0).all()


def test_sensitivity_moves_ranks_when_features_conflict(synthetic_normalised):
    """SYNTHETIC: two features ordered oppositely must produce unstable middle ranks."""
    weights = {"registered_voters": 0.5, "recognition_gap": 0.5}
    sens = s4.rank_sensitivity(synthetic_normalised, weights, 300, 5.0)
    assert sens["rank_range"].max() > 0, "conflicting features must move the ranking"
    assert (sens["rank_best"] <= sens["rank_median"]).all()
    assert (sens["rank_median"] <= sens["rank_worst"]).all()


def test_sensitivity_is_reproducible(synthetic_normalised):
    weights = {"registered_voters": 0.6, "recognition_gap": 0.4}
    a = s4.rank_sensitivity(synthetic_normalised, weights, 100, 10.0)
    b = s4.rank_sensitivity(synthetic_normalised, weights, 100, 10.0)
    pd.testing.assert_frame_equal(a, b)


def test_ranks_are_a_valid_permutation(synthetic_normalised):
    weights = {"registered_voters": 0.5, "recognition_gap": 0.5}
    sens = s4.rank_sensitivity(synthetic_normalised, weights, 20, 10.0)
    n = len(synthetic_normalised)
    assert sens["rank_best"].between(1, n).all()
    assert sens["rank_worst"].between(1, n).all()


# --- clustering -----------------------------------------------------------------------

def test_clustering_recovers_known_groups(synthetic_normalised):
    """SYNTHETIC: four well-separated groups must cluster cleanly."""
    assigned, sil = s4.cluster(synthetic_normalised, ["registered_voters", "recognition_gap"])
    assert len(assigned) == 40
    assert sil["k"].tolist() == [3, 4, 5]
    assert sil["silhouette"].max() > 0.5, "clear structure should score well"


def test_cluster_sizes_sum_to_forty(real_wards):
    fs = featlib.assemble(real_wards)
    norm = featlib.normalise(fs.frame, fs.available)
    _, sil = s4.cluster(norm, [f.key for f in fs.available])
    for sizes in sil["sizes"]:
        assert sum(sizes) == 40


def test_segment_names_describe_a_real_feature(real_wards):
    fs = featlib.assemble(real_wards)
    norm = featlib.normalise(fs.frame, fs.available)
    assigned, _ = s4.cluster(norm, [f.key for f in fs.available])
    names = s4.name_segments(assigned, fs.frame, [f.key for f in fs.available])
    labels = {f.label.lower() for f in featlib.FEATURES}
    for name in names.values():
        assert any(label in name.lower() for label in labels)


# --- outputs and honesty --------------------------------------------------------------

def test_stage04_writes_ward_priority_with_all_forty_wards():
    result = s4.run()
    assert result["state"] == "ok"
    df = pd.read_csv(config.DATA_PROCESSED / "ward_priority.csv")
    assert len(df) == 40
    assert df["rank"].tolist() == list(range(1, 41))
    for col in ("ward", "priority_score", "rank_range", "unstable", "segment", "segment_name"):
        assert col in df.columns


def test_report_refuses_to_call_degenerate_sensitivity_stable():
    """The trap this stage must not fall into: reporting 'all wards stable' on one feature."""
    s4.run()
    text = (config.REPORTS / "04_wards.md").read_text(encoding="utf-8")
    assert "degeneracy, not stability" in text
    assert "n = 40 limits confidence" in text
    # Every dropped feature must be named in the report, not silently absent.
    fs = featlib.assemble(pd.read_csv(config.DATA_PROCESSED / "wards.csv"))
    for feat, _ in fs.dropped:
        assert feat.label in text, f"{feat.label} dropped but not reported"
