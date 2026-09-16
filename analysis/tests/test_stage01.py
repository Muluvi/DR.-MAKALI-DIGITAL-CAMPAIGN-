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


def test_june_poll_has_no_ngilu_share(frames):
    """Mizani's June round excluded Ngilu. Null, never zero."""
    polls = frames["polls"]
    june = polls[(polls.pollster.str.contains("Mizani")) & (polls.release_date.str.contains("Jun"))]
    ngilu = june[june.candidate == "Ngilu"]
    assert len(ngilu) == 1
    assert pd.isna(ngilu["share_pct"].iloc[0])
    assert not ngilu["polled"].iloc[0]


def test_politrack_sample_size_is_parsed_and_mizani_is_not(frames):
    polls = frames["polls"]
    politrack = polls[polls.pollster.str.contains("Politrack")]
    assert (politrack["sample_size"] == 2927).all()
    mizani = polls[polls.pollster.str.contains("Mizani")]
    assert mizani["sample_size"].isna().all()


def test_poll_shares_match_the_published_figures(frames):
    polls = frames["polls"]

    def share(pollster, month, cand):
        row = polls[(polls.pollster.str.contains(pollster))
                    & (polls.release_date.str.contains(month))
                    & (polls.candidate == cand)]
        return row["share_pct"].iloc[0]

    assert share("Politrack", "Mar", "Mulu") == 26.2
    assert share("Politrack", "Mar", "Kasalu") == 35.2
    assert share("Mizani", "Jun", "Mulu") == 20.2
    assert share("Mizani", "Aug", "Kasalu") == 37.4
    assert share("Mizani", "Aug", "Ngilu") == 17.0


# --- checks --------------------------------------------------------------------------------

def test_checks_find_the_stale_party_name(frames):
    found = checks.run_all(frames, claims.build())
    subjects = found["check"].tolist()
    assert "stale-party-name" in subjects
    assert "register-2026" in subjects
    assert "missing-poll" in subjects


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
    df = claims.build()
    assert len(df) > 500
    assert df["file"].nunique() >= 25
    unitless_small = df[(df["value"] < 100) & (df["unit"] == "")]
    assert unitless_small.empty, "section references leaked into the claims register"


def test_claims_register_has_the_required_columns():
    df = claims.build()
    assert list(df.columns) == [
        "file", "location", "claim", "value", "unit", "source_cited", "tier", "status",
    ]


def test_templates_are_written_with_headers_and_no_rows():
    templates.write_all()
    for tpl in templates.TEMPLATES:
        path = config.DATA_TEMPLATES / f"{tpl.name}.csv"
        lines = path.read_text(encoding="utf-8").strip().splitlines()
        assert len(lines) == 1, f"{tpl.name}.csv must have headers only, no example rows"
        assert lines[0].split(",") == [c.name for c in tpl.columns]


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
