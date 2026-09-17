"""The publish screen — the last gate before anything reaches a public URL."""
from __future__ import annotations

import json

import pytest

from src import config, publish, siteexport as sx


def _write(tmp_path, payload):
    path = tmp_path / "candidate.json"
    path.write_text(json.dumps(payload), encoding="utf-8")
    return path


def _good_payload():
    return {
        "id": "safe-chart",
        "values": [{
            "label": "Registered voters", "value": 532758, "unit": "voters",
            "source_id": "S1", "tier": 1, "as_of": "2022",
            "method": "official", "status": "confirmed",
        }],
        "notes": [],
    }


def test_a_clean_file_passes(tmp_path):
    assert publish.screen(_write(tmp_path, _good_payload())) == []


def test_never_publish_id_is_blocked(tmp_path):
    payload = _good_payload() | {"id": "nomination_leverage"}
    problems = publish.screen(_write(tmp_path, payload))
    assert any("never-publish" in p for p in problems)


@pytest.mark.parametrize("term", [
    "holdout wards are Kyuso and Mutha",
    "candidate vulnerabilities to prepare for",
    "nomination leverage ranking",
    "leverage per 10pt gain",
])
def test_internal_terms_are_blocked_wherever_they_appear(tmp_path, term):
    payload = _good_payload()
    payload["notes"] = [term]
    problems = publish.screen(_write(tmp_path, payload))
    assert any("internal-only term" in p for p in problems), f"{term!r} was not caught"


def test_t3_without_verify_is_blocked(tmp_path):
    payload = _good_payload()
    payload["values"][0].update(tier=3, status="confirmed")
    problems = publish.screen(_write(tmp_path, payload))
    assert any("T3 without verify" in p for p in problems)


def test_missing_provenance_field_is_blocked(tmp_path):
    payload = _good_payload()
    del payload["values"][0]["source_id"]
    problems = publish.screen(_write(tmp_path, payload))
    assert any("missing" in p for p in problems)


def test_bad_method_or_status_is_blocked(tmp_path):
    payload = _good_payload()
    payload["values"][0]["method"] = "estimated"
    assert any("bad method" in p for p in publish.screen(_write(tmp_path, payload)))


def test_empty_file_is_blocked(tmp_path):
    payload = _good_payload() | {"values": []}
    assert any("no values" in p for p in publish.screen(_write(tmp_path, payload)))


def test_publish_refuses_without_the_approval_flag():
    """Publishing is opt-in. A pipeline run can never push to the site by accident."""
    assert publish.main([]) == 2


def test_every_currently_exported_file_passes_the_screen():
    from src import stage12_synthesis
    stage12_synthesis.run()
    for path in sorted(config.OUT_SITE.glob("*.json")):
        assert publish.screen(path) == [], f"{path.name} would be blocked"


def test_published_site_files_match_the_export():
    """What is on the site must be what the pipeline produced, field for field."""
    dest = publish.DESTINATION
    if not dest.exists():
        pytest.skip("nothing published yet")
    for path in dest.glob("*.json"):
        if path.name == "manifest.json":
            continue
        source = config.OUT_SITE / path.name
        assert source.exists(), f"{path.name} is on the site but not in outputs/site"
        published = json.loads(path.read_text(encoding="utf-8"))
        for value in published["values"]:
            assert set(publish.REQUIRED_FIELDS) <= set(value)
            if value["tier"] == 3:
                assert value["status"] == "verify"


def test_manifest_records_the_exclusions():
    manifest_path = publish.DESTINATION / "manifest.json"
    if not manifest_path.exists():
        pytest.skip("nothing published yet")
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    assert set(manifest["excluded"]) == sx.NEVER_PUBLISH
    assert manifest["files"]
    assert any("verify" in rule for rule in manifest["rules"])
