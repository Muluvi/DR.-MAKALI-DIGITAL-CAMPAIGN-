"""Stages 9–12 — reach arithmetic, measurement design, and the site-export contract."""
from __future__ import annotations

import json

import pandas as pd
import pytest

from src import config, siteexport as sx, stage09_reach as s9, stage11_measurement as s11


@pytest.fixture(scope="module")
def wards():
    path = config.DATA_PROCESSED / "wards.csv"
    if not path.exists():
        pytest.skip("wards.csv absent")
    return pd.read_csv(path)


# --- Stage 9: reach -------------------------------------------------------------------

def test_reach_segments_sum_to_the_electorate_exactly(wards):
    denoms = s9.ward_denominators(wards)
    est = s9.estimate(denoms, 0.262, 0.441)
    total = est[["digital", "sms_only", "offline"]].sum(axis=1)
    assert (total == est["voters"]).all(), "segments must partition the electorate"


def test_reach_segments_are_never_negative(wards):
    denoms = s9.ward_denominators(wards)
    est = s9.estimate(denoms, 0.262, 0.441)
    for col in ("digital", "sms_only", "offline"):
        assert (est[col] >= 0).all()


def test_impossible_rates_are_rejected(wards):
    """Phone ownership below internet use would make the SMS-only segment negative."""
    denoms = s9.ward_denominators(wards)
    with pytest.raises(ValueError):
        s9.estimate(denoms, 0.50, 0.40)


def test_ward_denominators_sum_to_the_confirmed_2026_register(wards):
    denoms = s9.ward_denominators(wards)
    assert len(denoms) == 40
    assert denoms["voters"].sum() == config.value("reach.denominator_register") == 605703


def test_reach_uses_the_current_rates_not_the_2019_ones(wards):
    """The headline must move with the confirmed 2023/24 rates."""
    denoms = s9.ward_denominators(wards)
    r = s9.rates()
    assert r["internet"].value == 0.262 and r["internet"].tier == 1
    assert r["phone"].value == 0.441 and r["phone"].tier == 1
    est = s9.estimate(denoms, r["internet"].value, r["phone"].value)
    assert 155_000 <= est["digital"].sum() <= 162_000


def test_the_sms_layer_shrinks_under_the_newer_rates(wards):
    """The substantive finding: growth came out of SMS-only, not from new phone owners."""
    denoms = s9.ward_denominators(wards)
    r = s9.rates()
    old = s9.estimate(denoms, r["internet_2019"].value, r["phone_2019"].value)
    new = s9.estimate(denoms, r["internet"].value, r["phone"].value)
    assert new["digital"].sum() > old["digital"].sum() * 1.8
    assert new["sms_only"].sum() < old["sms_only"].sum() * 0.75
    # The offline segment should be near-unchanged: phone ownership barely moved.
    assert abs(new["offline"].sum() - old["offline"].sum()) / old["offline"].sum() < 0.05


def test_every_reach_rate_carries_a_year_and_source():
    for key in ("county_internet_use", "county_phone_ownership", "county_internet_use_2019",
                "county_phone_ownership_2019", "national_rural_phone_ownership",
                "national_internet_use", "smartphone_share_of_connections"):
        a = config.assumption(f"reach.{key}")
        assert a.as_of, f"{key} has no year"
        assert a.source_id, f"{key} has no source"
        assert a.tier in (1, 2, 3)


def test_reach_report_states_the_finding_and_the_contradiction():
    s9.run()
    text = (config.REPORTS / "09_reach.md").read_text(encoding="utf-8")
    assert "MODELLED" in text.upper()
    assert "not a radio audience estimate" in text.lower()
    assert "English or Kiswahili" in text
    # The reason behind the shift is the point, not just the new numbers.
    assert "1.2 points" in text and "12.6 points" in text
    # The prose on the site now disagrees with these figures; that must be stated.
    assert "contradiction" in text.lower()
    assert "86.4%" in text


# --- Stage 11: measurement ------------------------------------------------------------

def test_mde_shrinks_as_the_list_grows():
    alpha, power = config.value("measurement.alpha"), config.value("measurement.power")
    small = s11.mde_two_proportion(0.05, 500, alpha, power)
    large = s11.mde_two_proportion(0.05, 50000, alpha, power)
    assert small > large


def test_mde_is_a_real_threshold():
    """At the MDE the test should be powered; well below it, not."""
    from statsmodels.stats.power import NormalIndPower
    from statsmodels.stats.proportion import proportion_effectsize
    alpha, power = config.value("measurement.alpha"), config.value("measurement.power")
    n = 5000
    mde = s11.mde_two_proportion(0.05, n, alpha, power) / 100
    achieved = NormalIndPower().power(
        effect_size=proportion_effectsize(0.05 + mde, 0.05), nobs1=n, alpha=alpha, ratio=1.0)
    assert achieved == pytest.approx(power, abs=0.03)


def test_holdout_is_stratified_across_every_constituency(wards):
    assigned = s11.assign_holdouts(wards)
    holdouts = assigned[assigned["arm"] == "holdout"]
    assert set(holdouts["constituency"]) == set(wards["constituency"]), (
        "every constituency must contribute a holdout, or region confounds the effect")
    assert len(assigned) == 40


def test_holdout_assignment_is_reproducible(wards):
    a = s11.assign_holdouts(wards)
    b = s11.assign_holdouts(wards)
    pd.testing.assert_frame_equal(a, b)


def test_holdout_assignment_is_gitignored():
    """Publishing which wards are controls would destroy the experiment."""
    import subprocess
    out = subprocess.run(
        ["git", "check-ignore", "analysis/data/processed/holdout_assignment.csv"],
        cwd=config.REPO_ROOT, capture_output=True, text=True, check=False).stdout
    assert out.strip(), "holdout assignment must never be committable"


# --- Stage 12: the export contract ----------------------------------------------------

def test_t3_value_cannot_be_exported_as_confirmed():
    with pytest.raises(sx.ExportError):
        sx.Value("x", 1, "v", "S4", 3, "2026", "official", "confirmed")


def test_modelled_value_cannot_be_confirmed():
    with pytest.raises(sx.ExportError):
        sx.Value("x", 1, "v", "S1", 1, "2026", "modelled", "confirmed")


def test_invalid_method_or_status_is_rejected():
    with pytest.raises(sx.ExportError):
        sx.Value("x", 1, "v", "S1", 1, "2026", "guessed", "confirmed")
    with pytest.raises(sx.ExportError):
        sx.Value("x", 1, "v", "S1", 1, "2026", "official", "probably")


def test_never_publish_ids_are_refused():
    chart = sx.Chart(id="nomination_leverage", title="t", description="d",
                     chart_type="bar", values=[])
    with pytest.raises(sx.ExportError):
        chart.write()


def test_internal_charts_are_refused():
    chart = sx.Chart(id="safe-id", title="t", description="d", chart_type="bar",
                     values=[], sensitivity="internal")
    with pytest.raises(sx.ExportError):
        chart.write()


def test_every_exported_value_carries_the_full_field_set():
    from src import stage12_synthesis
    stage12_synthesis.run()
    files = sorted(config.OUT_SITE.glob("*.json"))
    assert files, "no site JSON was exported"
    required = {"value", "unit", "source_id", "tier", "as_of", "method", "status"}
    for path in files:
        payload = json.loads(path.read_text(encoding="utf-8"))
        assert payload["values"], f"{path.name} has no values"
        for value in payload["values"]:
            missing = required - set(value)
            assert not missing, f"{path.name}: {value['label']} missing {missing}"
            assert value["method"] in sx.METHODS
            assert value["status"] in sx.STATUSES
            if value["tier"] == 3:
                assert value["status"] == "verify"


def test_no_exported_file_is_on_the_never_publish_list():
    from src import stage12_synthesis
    stage12_synthesis.run()
    for path in config.OUT_SITE.glob("*.json"):
        assert path.stem not in sx.NEVER_PUBLISH


def test_scenario_charts_carry_their_label():
    from src import stage12_synthesis
    stage12_synthesis.run()
    payload = json.loads((config.OUT_SITE / "scenario-benchmarks.json").read_text(encoding="utf-8"))
    assert payload["scenario_label"] == config.SCENARIO_LABEL
    assert any("not a win probability" in n.lower() or "not win probabilities" in n.lower()
               for n in payload["notes"])


def test_findings_and_mapping_exist_and_list_exclusions():
    from src import stage12_synthesis
    stage12_synthesis.run()
    findings = (config.REPORTS / "findings.md").read_text(encoding="utf-8")
    mapping = (config.REPORTS / "site_mapping.md").read_text(encoding="utf-8")
    assert findings.count("**") > 20
    assert "What to collect next, in order" in findings and "Every assumption" in findings
    # The plan must say how to get each item, not just name it.
    assert "How to get it" in findings
    # And it must be honest about what research cannot supply.
    assert "only the party can confirm" in findings.lower()
    for excluded in ("Nomination leverage", "Holdout assignment", "Competitor benchmark"):
        assert excluded in mapping, f"{excluded} must be listed as excluded"


def test_no_personal_data_appears_in_any_output():
    """CLAUDE.md §3 — sweep every committed and exported artefact."""
    import re
    patterns = re.compile(r"(?:\+?254|\b0)[17]\d{8}\b|[\w.\-]+@[\w.\-]+\.\w{2,}|@[A-Za-z_]{4,}")
    allowed = {"noreply@anthropic.com"}
    for folder in (config.REPORTS, config.OUT_SITE):
        for path in folder.rglob("*"):
            if not path.is_file():
                continue
            text = path.read_text(encoding="utf-8", errors="ignore")
            for hit in patterns.findall(text):
                assert hit in allowed or hit.startswith("@Mizani") or hit.startswith("@MakaliMulu"), (
                    f"possible personal data in {path.name}: {hit}")
