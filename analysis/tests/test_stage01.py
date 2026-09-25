"""Stage 1 — parsing, sums and exports."""
from __future__ import annotations

import pandas as pd
import pytest

from src import checks, claims, config, pack as packmod, templates, tidy, wards


@pytest.fixture(scope="module")
def p():
    loaded = packmod.load()
    if loaded is None:
        pytest.skip("data pack absent")
    return loaded


@pytest.fixture(scope="module")
def frames(p):
    return tidy.build_all(p)


# --- parsing -------------------------------------------------------------------------------

def test_pack_tables_and_sources_parse(p):
    assert len(p.tables) >= 12
    assert len(p.sources) == 69
    assert {s.tier for s in p.sources} == {1, 2, 3}


def test_source_ids_are_unique_and_tiered(frames):
    src = frames["sources"]
    assert src["id"].is_unique
    assert src["tier"].isin([1, 2, 3]).all()
    assert src.loc[src["id"] == "S1", "tier"].iloc[0] == 1
    assert src.loc[src["id"] == "S4", "tier"].iloc[0] == 3


def test_to_number_never_turns_missing_into_zero():
    assert packmod.to_number("[DATA NEEDED]") is None
    assert packmod.to_number("2,927") == 2927
    assert packmod.to_number("~15K") == 15


def test_tag_extraction_prefers_data_needed_over_verify():
    assert packmod.tag_of("605,703 [VERIFY]") == config.TAG_VERIFY
    assert packmod.tag_of("[DATA NEEDED] and [VERIFY]") == config.TAG_DATA_NEEDED
    assert packmod.tag_of("plain text") == config.TAG_OK


# --- sums ----------------------------------------------------------------------------------

def test_forty_wards(frames):
    assert len(frames["wards"]) == 40


def test_ward_totals_reconcile_to_county(frames):
    total = frames["wards"]["registered_voters_2022"].sum()
    assert total == config.value("register.y2022") == 532758


def test_ward_totals_reconcile_to_each_constituency(frames):
    ward_sums = frames["wards"].groupby("constituency")["registered_voters_2022"].sum()
    declared = frames["constituencies"].set_index("constituency")["registered_voters_2022"]
    assert len(declared) == 8
    for name, total in ward_sums.items():
        assert total == declared[name], f"{name}: wards {total} vs declared {declared[name]}"


def test_pack_wards_match_the_sites_own_register(frames):
    """Two independent copies of the IEBC figures must agree, once names are normalised."""
    site = wards.site_register()
    assert site is not None and len(site) == 40
    result = wards.match(frames["wards"]["ward"].tolist(), site["ward"].tolist())
    assert not result.unmatched
    pack_by = dict(zip(frames["wards"]["ward"], frames["wards"]["registered_voters_2022"]))
    site_by = dict(zip(site["ward"], site["registered_voters_2022"]))
    mapping = {**result.exact, **{k: v[0] for k, v in result.similar.items()}}
    for pack_name, site_name in mapping.items():
        assert pack_by[pack_name] == site_by[site_name], pack_name


def test_known_ward_name_variants_are_handled():
    """Spacing normalises away; a letter difference must only match by similarity."""
    assert wards.normalise("Kwavonza/Yatta") == wards.normalise("Kwa Vonza/Yatta")
    assert wards.normalise("Mutito/Kaliku") != wards.normalise("Mutitu/Kaliku")
    result = wards.match(["Mutito/Kaliku"], ["Mutitu/Kaliku"])
    assert "Mutito/Kaliku" in result.similar and not result.unmatched


# --- provenance rules ----------------------------------------------------------------------

def test_every_t3_row_carries_verify(frames):
    """CLAUDE.md §2 — the rule that must never regress."""
    for name, df in frames.items():
        if df.empty or "tier" not in df or "status" not in df:
            continue
        t3 = df[df["tier"] == 3]
        bad = t3[~t3["status"].isin([config.TAG_VERIFY, config.TAG_DATA_NEEDED])]
        assert bad.empty, f"{name}: {len(bad)} T3 rows without verify"


def test_every_figure_row_has_a_tier(frames):
    for name in ("wards", "constituencies", "results_2022", "county_finance", "drought"):
        assert frames[name]["tier"].notna().all(), f"{name} has rows with no tier"


def test_conflicting_musila_totals_are_both_kept(frames):
    musila = frames["results_2022"].query("candidate == 'David Musila'")
    assert set(musila["votes"]) == {114606, 117606}
    assert (musila["status"] == config.TAG_CONFLICT).all()


# --- checks --------------------------------------------------------------------------------

def test_checks_run_and_find_the_register_conflict(frames):
    """Assert the checks that do not depend on today's site content.

    The party-name and poll-on-site checks are deliberately NOT asserted here: the site has
    since fixed both, and a test that requires the content to stay broken would fail the
    moment someone does the right thing. Those checks are proved at unit level below
    instead, where the input is fixed.
    """
    found = checks.run_all(frames, claims.build())
    subjects = found["check"].tolist()
    assert "register-2026" in subjects
    assert "t3-dependency" in subjects
    assert "constituency-to-county" in subjects
    assert not found.empty


def test_reconciliation_check_passes_on_real_data(frames):
    found = checks.reconcile_wards(frames["wards"], frames["constituencies"])
    high = [f for f in found if f["severity"] == "high"]
    assert not high, f"unexpected reconciliation failures: {high}"


def test_reconciliation_check_catches_a_broken_sum(frames):
    """The check must actually fire — prove it with SYNTHETIC corrupted data."""
    broken = frames["wards"].copy()
    broken.loc[0, "registered_voters_2022"] += 1000  # SYNTHETIC: deliberate corruption
    found = checks.reconcile_wards(broken, frames["constituencies"])
    assert any(f["severity"] == "high" for f in found)


# --- claims and templates ------------------------------------------------------------------

def test_claims_register_covers_content_and_excludes_section_refs():
    """Coverage is measured against the content folder, not a fixed file count: the site
    was restructured into fewer, longer files, and some (the glossary) carry no figures."""
    df = claims.build()
    content_files = list(config.SITE_CONTENT.glob("*.md"))
    assert len(df) > 500
    assert df["file"].nunique() >= 0.8 * len(content_files)
    unitless_small = df[(df["value"] < 100) & (df["unit"] == "")]
    assert unitless_small.empty, "section references leaked into the claims register"


def test_claims_register_has_the_required_columns():
    df = claims.build()
    assert list(df.columns) == [
        "file", "location", "claim", "value", "unit", "source_cited", "tier", "status",
    ]


def test_unfilled_templates_have_headers_and_no_example_rows():
    templates.write_all()
    for tpl in templates.TEMPLATES:
        path = config.DATA_TEMPLATES / f"{tpl.name}.csv"
        lines = [l for l in path.read_text(encoding="utf-8").strip().splitlines() if l.strip()]
        assert lines[0].split(",") == [c.name for c in tpl.columns]
        if len(lines) > 1:
            # A filled template is the team's data, not an example row. Only files the team
            # has actually supplied may have rows.
            assert tpl.name in {"register_2026_by_county"}, (
                f"{tpl.name}.csv has rows but is not a template the team has filled"
            )


def test_write_all_never_destroys_supplied_data(tmp_path, monkeypatch):
    """write_all() runs on every pipeline run. It must not truncate filled templates.

    This is a regression test for a real bug: write_all opened every file with "w", so the
    first pipeline run after the team filled a template would silently delete their work.
    """
    monkeypatch.setattr(templates.config, "DATA_TEMPLATES", tmp_path)
    monkeypatch.setattr(templates.config, "DATA_RAW", tmp_path)

    templates.write_all()
    filled = tmp_path / "posts.csv"
    header = filled.read_text(encoding="utf-8").strip()
    filled.write_text(header + "\nSYNTHETIC-1,facebook,2026-09-01T10:00:00+03:00,photo,en,,x,,,1,2,3,15000,http://x\n",
                      encoding="utf-8")
    before = filled.read_text(encoding="utf-8")

    for _ in range(3):
        templates.write_all()

    assert filled.read_text(encoding="utf-8") == before, "supplied data was overwritten"
    # An untouched template is still (re)written with headers.
    assert (tmp_path / "comments.csv").read_text(encoding="utf-8").strip().splitlines()[0] == "post_id,date,text"


def test_a_header_only_template_is_still_rewritten(tmp_path, monkeypatch):
    monkeypatch.setattr(templates.config, "DATA_TEMPLATES", tmp_path)
    monkeypatch.setattr(templates.config, "DATA_RAW", tmp_path)
    templates.write_all()
    (tmp_path / "issues.csv").write_text("garbage\n", encoding="utf-8")
    templates.write_all()
    assert (tmp_path / "issues.csv").read_text(encoding="utf-8").startswith("issue_id,")


def test_comments_template_collects_no_personal_data():
    """CLAUDE.md §3 — the comments schema is three columns by design."""
    tpl = next(t for t in templates.TEMPLATES if t.name == "comments")
    assert [c.name for c in tpl.columns] == ["post_id", "date", "text"]
    forbidden = {"name", "handle", "profile_id", "user", "author", "phone", "email"}
    assert not forbidden & {c.name for c in tpl.columns}


def test_exports_land_in_processed(frames):
    from src import stage01_ingest
    stage01_ingest.run()
    for name in list(frames) + ["claims_register", "audit_findings"]:
        path = config.DATA_PROCESSED / f"{name}.csv"
        assert path.exists() and path.stat().st_size > 0
        assert not pd.read_csv(path).empty


# --- stale-content checks must not cry wolf on correct text ---------------------------

def test_explaining_the_rename_is_not_flagged_as_stale():
    """A line describing the WDM -> WPF change is correct writing, not a stale name."""
    from src.checks import _stale_party_uses
    correct = (
        "The Office of the Registrar of Political Parties issued a certificate of change of "
        "name from **Wiper Democratic Movement (WDM)** to **Wiper Patriotic Front (WPF)** in "
        "August 2025. This document uses WPF throughout."
    )
    assert _stale_party_uses(correct) == 0


def test_a_genuinely_stale_party_name_is_still_flagged():
    from src.checks import _stale_party_uses
    stale = "Sen. Wambua commands significant standing within the Wiper Democratic Movement today."
    assert _stale_party_uses(stale) == 1


def test_quoting_a_2022_record_is_not_flagged():
    from src.checks import _stale_party_uses
    quoted = "Julius Malombe (Wiper Democratic Movement) won in 2022 with 198,004 votes."
    assert _stale_party_uses(quoted) == 0


def test_year_labelled_register_is_not_flagged_as_presented_current(tmp_path, monkeypatch):
    """"Total Registered Electorate (2022): 532,758" is correct; without the year it is not."""
    from src import checks, config as cfg

    labelled = tmp_path / "labelled.md"
    labelled.write_text(
        "**Total Registered Electorate (2022, Tier 1):** **532,758 voters** across 40 wards.",
        encoding="utf-8")
    monkeypatch.setattr(cfg, "SITE_CONTENT", tmp_path)
    monkeypatch.setattr(checks.config, "SITE_CONTENT", tmp_path)
    assert not [f for f in checks.stale_site_content() if f["check"] == "stale-register"]

    labelled.write_text(
        "**Total Registered Electorate:** **532,758 voters** — the current electorate.",
        encoding="utf-8")
    assert [f for f in checks.stale_site_content() if f["check"] == "stale-register"]


# --- the 2026 register -----------------------------------------------------------------

def test_the_july_total_is_tier_three_and_verify():
    """No IEBC document giving the July total is in hand, so it is the aggregator's figure.

    The drive figure is a different number with a different source and stays Tier 1.
    """
    july = config.assumption("register.y2026_july")
    assert (july.source_id, july.tier, july.verify) == ("S4", 3, True)
    assert july.status != "CONFIRMED"
    drive = config.assumption("register.y2026_new_registrations")
    assert (drive.tier, drive.status, drive.verify) == (1, "CONFIRMED", False)


def test_figures_derived_from_the_july_total_are_no_firmer_than_it():
    for key in ("register.y2026_growth_outside_the_drive", "reach.denominator_register"):
        a = config.assumption(key)
        assert a.tier == 3 and a.verify, f"{key} inherits the T3 July total"


def test_the_register_arithmetic_reconciles():
    """The figures were never meant to sum; this is the relationship that does hold.

    total growth = drive registrations + continuous registration outside the drive window.
    """
    base = config.value("register.y2022")
    total = config.value("register.y2026_july")
    drive = config.value("register.y2026_new_registrations")
    residue = config.value("register.y2026_growth_outside_the_drive")
    assert total - base == drive + residue
    assert residue == 11106
    assert total - base == 72945


def test_the_check_flags_the_july_total_and_keeps_the_reconciliation():
    findings = checks.register_conflict()
    high = [f for f in findings if f["severity"] == "high"]
    assert len(high) == 1, "a T3 register must be reported until IEBC's figure is in hand"
    assert "605,703" in high[0]["detail"] and "verify" in high[0]["detail"]
    text = " ".join(f["detail"] for f in findings)
    assert "was never a discrepancy" in text
    assert "61,839" in text


def test_the_correction_to_the_earlier_reading_is_recorded():
    """The pipeline previously called these two figures contradictory. That must not be
    quietly dropped — a reader of an earlier report deserves to see it withdrawn."""
    text = " ".join(f["action"] + f["detail"] for f in checks.register_conflict())
    assert "wrong" in text.lower()


def test_the_withdrawn_tier_one_claim_is_recorded():
    """From 17 September the July total was recorded as read off the IEBC annex. A reader of
    those reports deserves to see that claim withdrawn, and why, rather than quietly gone."""
    text = " ".join(f["detail"] for f in checks.register_conflict())
    assert "17 September 2026" in text
    assert "withdrawn on 25 September 2026" in text
    assert "cannot carry a July total" in text


def test_a_tier_one_row_confirms_the_total_and_keeps_its_document_url(tmp_path, monkeypatch):
    """Once IEBC's July figure is supplied, the check confirms it and names the document."""
    fake = tmp_path / "register_2026_by_county.csv"
    fake.write_text(
        "county,registered_voters_2026,new_registrations_2026,source_id,tier,as_of,document_url\n"
        "Kitui,605703,61839,S3,1,2026-07,https://example.invalid/SYNTHETIC-IEBC\n",
        encoding="utf-8",
    )
    monkeypatch.setattr(checks.config, "DATA_TEMPLATES", tmp_path)
    findings = checks.register_conflict()
    assert not [f for f in findings if f["severity"] == "high"]
    confirmed = [f for f in findings if "CONFIRMED" in f["detail"]]
    assert confirmed and "https://example.invalid/SYNTHETIC-IEBC" in confirmed[0]["action"]


def test_a_tier_one_row_that_disagrees_is_reported(tmp_path, monkeypatch):
    fake = tmp_path / "register_2026_by_county.csv"
    fake.write_text(
        "county,registered_voters_2026,new_registrations_2026,source_id,tier,as_of,document_url\n"
        "Kitui,600000,61839,S3,1,2026-07,https://example.invalid/SYNTHETIC-IEBC\n",
        encoding="utf-8",
    )
    monkeypatch.setattr(checks.config, "DATA_TEMPLATES", tmp_path)
    high = [f for f in checks.register_conflict() if f["severity"] == "high"]
    assert high and "600,000" in high[0]["detail"]


def test_official_2026_register_ignores_a_non_tier_one_row(tmp_path, monkeypatch):
    """A figure from an aggregator is the same tier as the ones it would replace."""
    fake = tmp_path / "register_2026_by_county.csv"
    fake.write_text(
        "county,registered_voters_2026,new_registrations_2026,source_id,tier,as_of,document_url\n"
        "Kitui,605703,61839,S4,3,2026-07,https://example.invalid/SYNTHETIC\n",
        encoding="utf-8",
    )
    monkeypatch.setattr(checks.config, "DATA_TEMPLATES", tmp_path)
    assert checks.official_2026_register() is None
