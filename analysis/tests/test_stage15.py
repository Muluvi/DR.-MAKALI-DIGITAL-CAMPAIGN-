"""Stage 15 — 2019 census by sub-county. The package must reproduce KNBS, and nothing may be
forced onto a constituency."""
from __future__ import annotations

import json

import pytest

from src import stage15_census as s15

needs_census = pytest.mark.skipif(not s15.available(), reason="rKenyaCensus or keAdminBounds not in data/raw/")


@needs_census
def test_the_package_reproduces_the_published_kitui_figures():
    assert s15.check_published(s15.subcounty_table()) == []


@needs_census
def test_eighteen_subcounties_sum_to_the_county():
    sc = s15.subcounty_table()
    subs = sc.drop(index="COUNTY")
    assert len(subs) == 18
    for col in ("population", "aged_18_plus", "households", "aged_3_plus"):
        assert subs[col].sum() == sc.loc["COUNTY", col], col


@needs_census
def test_adults_are_counted_from_single_years_not_bands():
    sc = s15.subcounty_table()
    county = sc.loc["COUNTY"]
    assert county["aged_18_plus"] == 591_033
    assert 0 < county["aged_18_plus"] < county["population_by_age"]


@needs_census
def test_age_bands_cover_the_whole_population_by_age():
    bands = s15.age_bands()
    total = s15.subcounty_table().loc["COUNTY", "population_by_age"]
    not_stated = 10  # V3 Table 2.3 prints 10 Kitui residents with age not stated
    assert bands["Total"].sum() + not_stated == total
    assert bands["band"].iloc[0] == "0-4" and bands["band"].iloc[-1] == "100+"


@needs_census
def test_census_names_match_the_polygons():
    assert set(s15.subcounty_codes()) == set(s15.subcounty_table().index) - {"COUNTY"}


def test_every_ward_key_names_a_subcounty_with_shares_summing_to_one():
    keys = json.loads(s15.KEYS.read_text(encoding="utf-8"))
    for w in keys["wards"]:
        shares = w["knbs_shares"]
        assert shares[0]["subcounty"] == w["knbs_subcounty"]
        assert sum(s["share"] for s in shares) == pytest.approx(1.0, abs=0.005)
        assert w["knbs_split"] == (shares[0]["share"] < s15.config.value("census.ward_majority"))
        assert w["knbs_code"].startswith("15") and len(w["knbs_code"]) == 4

