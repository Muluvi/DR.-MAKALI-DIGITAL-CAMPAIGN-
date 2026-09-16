"""Stage 0 — the config contract every later stage depends on."""
from __future__ import annotations

import pytest

from src import config


def test_assumptions_file_parses():
    assert isinstance(config.assumptions(), dict)


def test_seed_is_fixed_and_reproducible():
    a = config.rng().normal(size=5)
    b = config.rng().normal(size=5)
    assert (a == b).all(), "two generators from the same config seed must agree"


def test_every_assumption_entry_has_value_rationale_and_valid_status():
    """CLAUDE.md §8: value, rationale and a status of PLACEHOLDER or CONFIRMED."""
    problems: list[str] = []

    def walk(node, trail):
        if not isinstance(node, dict):
            return
        if "status" in node and not isinstance(node["status"], dict):
            key = ".".join(trail)
            if node["status"] not in ("PLACEHOLDER", "CONFIRMED"):
                problems.append(f"{key}: status is {node['status']!r}")
            if "value" not in node and "values" not in node:
                problems.append(f"{key}: no value")
            if not str(node.get("rationale", "")).strip():
                problems.append(f"{key}: no rationale")
            return
        for k, v in node.items():
            walk(v, trail + [k])

    walk(config.assumptions(), [])
    assert not problems, "assumptions.yaml entries are malformed:\n" + "\n".join(problems)


def test_index_weights_sum_to_one():
    weights = config.assumptions()["index_weights"]
    total = sum(v["value"] for v in weights.values())
    assert total == pytest.approx(1.0), f"index weights sum to {total}, not 1.0"


def test_t3_figures_are_marked_verify():
    """CLAUDE.md §2: every T3 figure carries status 'verify' wherever it appears."""
    offenders: list[str] = []

    def walk(node, trail):
        if not isinstance(node, dict):
            return
        if node.get("tier") == 3 and not node.get("verify"):
            offenders.append(".".join(trail))
        for k, v in node.items():
            if isinstance(v, dict):
                walk(v, trail + [k])

    walk(config.assumptions(), [])
    assert not offenders, f"T3 entries missing verify: {offenders}"


def test_no_fixed_win_threshold_is_modelled():
    """Addendum: governor races are plurality. A 50% threshold must not appear."""
    assert config.value("benchmarks.no_fixed_threshold") is True
    assert config.value("benchmarks.winning_tally_2022") == 198004
    assert config.value("benchmarks.winner_share_of_register_2022") == pytest.approx(0.372)


def test_rivals_off_means_no_win_probability():
    """A win probability requires rival ranges. Without them the flag stays false."""
    if not config.value("rivals.model_rivals"):
        assert not config.assumptions()["rivals"]["ranges"], (
            "rival ranges present but model_rivals is false — resolve before Stage 3"
        )


def test_assumption_lookup_raises_rather_than_defaulting():
    with pytest.raises(config.AssumptionError):
        config.assumption("turnout.does_not_exist")


def test_register_2022_reconciles_with_prison_voters():
    assert config.value("register.y2022") + 75 == config.value("register.y2022_with_prisons")


def test_bulk_sms_excludes_kikamba():
    """CA/NCIC [S54]: bulk political SMS is English or Kiswahili only."""
    langs = config.value("compliance.bulk_sms_languages")
    assert "Kikamba" not in langs and "Kamba" not in langs
