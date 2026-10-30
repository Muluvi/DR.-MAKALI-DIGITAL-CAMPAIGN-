"""Stage 9 — ward rates from census sub-counties. County totals must not move; only their
spread across wards. Built on the real 2022 ward register (data/ward-register.json)."""
from __future__ import annotations

import json

import pandas as pd
import pytest

from src import config, stage09_reach as s9, stage15_census as s15

needs_census = pytest.mark.skipif(not s15.RKC.exists(), reason="rKenyaCensus not in data/raw/")


def register_wards() -> pd.DataFrame:
    reg = json.loads((config.SITE_DATA / "ward-register.json").read_text(encoding="utf-8"))
    return pd.DataFrame([{"ward": w["name"], "constituency": c["name"], "registered_voters_2022": w["voters"]}
                         for c in reg["constituencies"] for w in c["wards"]])


@needs_census
def test_ward_rates_keep_the_county_totals():
    denoms = s9.ward_denominators(register_wards())
    f = s9.ward_factors(denoms)
    assert f is not None and len(f) == 40
    r = s9.rates()
    uniform = s9.estimate(denoms, r["internet"].value, r["phone"].value)
    varied = s9.estimate(denoms, r["internet"].value * f["internet_rel"].to_numpy(),
                         r["phone"].value * f["phone_rel"].to_numpy())
    for seg in ("digital", "sms_only", "offline"):
        # Per-ward rounding only: at most one voter per ward.
        assert abs(varied[seg].sum() - uniform[seg].sum()) <= 40, seg
    assert varied["voters"].sum() == uniform["voters"].sum()


@needs_census
def test_ward_rates_vary_and_stay_coherent():
    denoms = s9.ward_denominators(register_wards())
    f = s9.ward_factors(denoms)
    r = s9.rates()
    net = r["internet"].value * f["internet_rel"]
    phone = r["phone"].value * f["phone_rel"]
    assert net.max() > net.min()
    assert (phone >= net).all() and (phone <= 1).all()
    township = f.index[denoms["ward"] == "Township"][0]
    tharaka = f.index[denoms["ward"] == "Tharaka"][0]
    assert net[township] > net[tharaka]


@needs_census
def test_an_unknown_ward_falls_back_to_uniform_rather_than_guessing():
    wards = register_wards()
    wards.loc[0, "ward"] = "Nowhere"
    assert s9.ward_factors(s9.ward_denominators(wards)) is None


@needs_census
def test_alias_spellings_resolve():
    wards = register_wards()
    wards.loc[wards["ward"] == "Kwa Vonza/Yatta", "ward"] = "Kwavonza/Yatta"
    assert s9.ward_factors(s9.ward_denominators(wards)) is not None
