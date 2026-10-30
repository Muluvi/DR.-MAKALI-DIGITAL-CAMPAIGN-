"""Stage 15 — 2019 census indicators by KNBS sub-county (open-data brief, WP3).

KNBS reports the 2019 census by its own 18 Kitui sub-counties, which are not the 8 IEBC
constituencies. Nothing here is forced onto a constituency. Wards reach the census through a
spatial overlay of the ward polygons on the sub-county polygons, recorded with every share so a
ward split between two sub-counties stays visible.

Inputs, all raw downloads in data/raw/ (gitignored, see docs/open-data/REGISTER.md):

    rKenyaCensus/data/*.rda              KNBS 2019 census tables, repackaged (MIT), read with pyreadr
    keAdminBounds/Kenya_adm2_uscb_2020   sub-county polygons with KNBS codes (US Census Bureau, MIT repo)

Outputs:

    outputs/site/census-subcounty.json   per sub-county: population, aged 18+, phone, internet,
                                         mains-electricity lighting; Kitui's age bands; the
                                         national electricity rate
    outputs/geo/ward-subcounty.json      the ward-to-sub-county crosswalk, read by
                                         scripts/build-ward-keys.mjs into data/geo/ward-keys.json

Every census figure is Tier 1 official: the package reproduces the KNBS tables, and Kitui's
published totals (1,136,187 people; 42.9% phone ownership; 13.6% internet use) are checked
against it below before anything is written.
"""
from __future__ import annotations

import json
import re

import pandas as pd

from src import config, report, siteexport as sx

RKC = config.DATA_RAW / "rKenyaCensus" / "data"
BOUNDS = config.DATA_RAW / "keAdminBounds" / "Kenya_adm2_uscb_2020.geojson"
WARD_POLYGONS = config.REPO_ROOT / "public" / "geo" / "kitui-wards.topo.json"
KEYS = config.SITE_DATA / "geo" / "ward-keys.json"
OUT_GEO = config.ANALYSIS_ROOT / "outputs" / "geo"
CROSSWALK = OUT_GEO / "ward-subcounty.json"

COUNTY = "KITUI"
# An equal-area projection, so overlay shares are shares of land, not of degrees.
EQUAL_AREA = "EPSG:6933"
# Slivers below this share of a ward are digitising noise between two boundary files.
SLIVER = 0.01

# The Kitui totals the site already cites, which the package must reproduce before it is used.
PUBLISHED = {"population": 1_136_187, "phone_pct": 42.9, "internet_pct": 13.6}


def available() -> bool:
    return RKC.exists() and BOUNDS.exists()


def table(name: str) -> pd.DataFrame:
    import pyreadr  # analysis-only dependency; imported here so other stages never need it
    return next(iter(pyreadr.read_r(str(RKC / f"{name}.rda")).values()))


def subcounty_table() -> pd.DataFrame:
    """One row per Kitui sub-county, plus a COUNTY row, keyed by the census's upper-case name."""
    pop = table("V1_T2.5")
    pop = pop[pop["County"] == "Kitui County"].assign(name=lambda d: d["SubCounty"].str.upper())
    pop.loc[pop["AdminArea"] == "County", "name"] = "COUNTY"

    ages = table("V3_T2.3")
    ages = ages[ages["County"] == COUNTY].copy()
    ages["name"] = ages["SubCounty"].replace({"ALL": "COUNTY"})
    adult = ages["Age"].str.fullmatch(r"\d+") & (pd.to_numeric(ages["Age"], errors="coerce") >= 18)
    adult |= ages["Age"].eq("100+")
    pop18 = ages[adult].groupby("name")["Total"].sum()
    by_age_total = ages[ages["Age"] == "Total"].set_index("name")["Total"]

    def ict(name: str, col: str, base: str) -> pd.DataFrame:
        t = table(name)
        t = t[t["County"] == COUNTY].copy()
        t["name"] = t["SubCounty"].where(t["AdminArea"] == "SubCounty", "COUNTY")
        return t.set_index("name")[[col, base]]

    phone = ict("V4_T2.32", "MPO_Total_Perc", "Total")
    internet = ict("V4_T2.33", "UoI_Total_Perc", "Total")
    light = ict("V4_T2.19", "MainsElectricity", "ConventionalHouseholds")

    out = pd.DataFrame({
        "population": pop.set_index("name")["Total"],
        "population_by_age": by_age_total,
        "aged_18_plus": pop18,
        "aged_3_plus": phone["Total"],
        "phone_pct": phone["MPO_Total_Perc"],
        "internet_pct": internet["UoI_Total_Perc"],
        "households": light["ConventionalHouseholds"],
        "mains_electricity_pct": light["MainsElectricity"],
    })
    out["aged_18_plus_pct"] = 100 * out["aged_18_plus"] / out["population_by_age"]
    return out


def national_electricity() -> float:
    t = table("V4_T2.19")
    return float(t.loc[t["SubCounty"] == "KENYA", "MainsElectricity"].iloc[0])


def age_bands() -> pd.DataFrame:
    """Kitui's five-year age bands as KNBS prints them, as a share of the population by age."""
    ages = table("V3_T2.3")
    ages = ages[(ages["County"] == COUNTY) & (ages["SubCounty"] == "ALL")]
    total = float(ages.loc[ages["Age"] == "Total", "Total"].iloc[0])
    bands = ages[ages["Age"].str.contains("-") | ages["Age"].eq("100+")].copy()
    bands["band"] = bands["Age"].str.replace(r"\s+", "", regex=True)
    bands["share_pct"] = 100 * bands["Total"] / total
    return bands[["band", "Total", "share_pct"]].reset_index(drop=True)


def subcounty_codes() -> dict[str, str]:
    import geopandas as gpd
    sc = gpd.read_file(BOUNDS)
    sc = sc[sc["ADM1_NAME"] == COUNTY]
    return dict(zip(sc["ADM2_NAME"], sc["NSO_CODE"]))


def crosswalk(slugs: dict[str, str]) -> pd.DataFrame:
    """Share of each ward's area in each sub-county, slivers dropped, shares renormalised."""
    import geopandas as gpd
    sc = gpd.read_file(BOUNDS)
    sc = sc[sc["ADM1_NAME"] == COUNTY][["ADM2_NAME", "NSO_CODE", "geometry"]].to_crs(EQUAL_AREA)
    wards = gpd.read_file(WARD_POLYGONS).set_crs("EPSG:4326")[["ward", "constituency", "geometry"]]
    wards = wards.to_crs(EQUAL_AREA)
    wards["geometry"] = wards.buffer(0)
    sc["geometry"] = sc.buffer(0)
    wards["ward_area"] = wards.area
    x = gpd.overlay(wards, sc, how="intersection", keep_geom_type=True)
    x["share"] = x.area / x["ward_area"]
    x = x[x["share"] >= SLIVER].copy()
    x["share"] = x["share"] / x.groupby("ward")["share"].transform("sum")
    x["slug"] = x["ward"].map(slugs)
    return (x[["slug", "ward", "constituency", "ADM2_NAME", "NSO_CODE", "share"]]
            .rename(columns={"ADM2_NAME": "subcounty", "NSO_CODE": "code"})
            .sort_values(["slug", "share"], ascending=[True, False])
            .reset_index(drop=True))


def write_crosswalk(cw: pd.DataFrame, majority: float) -> list[dict]:
    rows = []
    for slug, g in cw.groupby("slug", sort=False):
        top = g.iloc[0]
        rows.append({
            "slug": slug,
            "knbs_subcounty": top["subcounty"],
            "knbs_code": top["code"],
            "split": bool(top["share"] < majority),
            "shares": [{"subcounty": r.subcounty, "code": r.code, "share": round(float(r.share), 3)}
                       for r in g.itertuples()],
        })
    OUT_GEO.mkdir(parents=True, exist_ok=True)
    CROSSWALK.write_text(json.dumps({
        "method": (f"Area overlay of public/geo/kitui-wards.topo.json on the KNBS sub-county polygons "
                   f"({BOUNDS.name}) in {EQUAL_AREA}. Slivers under {SLIVER:.0%} dropped. A ward is "
                   f"split when no sub-county holds {majority:.0%} of its area "
                   "(assumptions.yaml census.ward_majority)."),
        "wards": rows,
    }, indent=2) + "\n", encoding="utf-8")
    return rows


def ward_relative_ict() -> pd.DataFrame | None:
    """Each ward's 2019 phone and internet rates relative to the county's, from the sub-county
    holding most of its area (data/geo/ward-keys.json). None when either input is missing.
    Used by Stage 9 to vary the county rate across wards."""
    if not RKC.exists() or not KEYS.exists():
        return None
    keys = json.loads(KEYS.read_text(encoding="utf-8"))
    if any(w.get("knbs_subcounty") is None for w in keys["wards"]):
        return None
    sc = subcounty_table()
    county = sc.loc["COUNTY"]
    rows = []
    for w in keys["wards"]:
        s = sc.loc[w["knbs_subcounty"]]
        rows.append({
            "slug": w["slug"], "name": w["name"], "subcounty": w["knbs_subcounty"],
            "split": w["knbs_split"],
            "internet_rel": s["internet_pct"] / county["internet_pct"],
            "phone_rel": s["phone_pct"] / county["phone_pct"],
            "aliases": [a["spelling"] for a in w["aliases"]],
        })
    return pd.DataFrame(rows)


def check_published(sc: pd.DataFrame) -> list[str]:
    """The package must reproduce the KNBS figures the site already cites."""
    county = sc.loc["COUNTY"]
    problems = []
    for key, want in PUBLISHED.items():
        if round(float(county[key]), 1) != round(float(want), 1):
            problems.append(f"{key}: package gives {county[key]}, published {want}")
    subs = sc.drop(index="COUNTY")
    for col in ("population", "aged_18_plus", "households"):
        diff = float(subs[col].sum() - county[col])
        if abs(diff) > 0:
            problems.append(f"{col}: sub-counties sum to {subs[col].sum():,.0f}, county {county[col]:,.0f}")
    return problems


def exports(sc: pd.DataFrame, bands: pd.DataFrame, national: float, codes: dict[str, str]) -> str:
    src = config.assumption("census.source")
    sid, tier, as_of = str(src.source_id), src.tier, str(src.as_of)
    values: list[sx.Value] = []

    def add(label, value, unit, method, dims, note=""):
        status = "placeholder" if method == "calculated" else "confirmed"
        values.append(sx.Value(label, value, unit, sid, tier, as_of, method, status, note, dims))

    for name, r in sc.iterrows():
        area = "Kitui County" if name == "COUNTY" else name.title()
        base = {"subcounty": "COUNTY" if name == "COUNTY" else name, "code": codes.get(name, "15")}
        add(f"{area}: population", int(r["population"]), "people", "official", {**base, "measure": "population"},
            "Vol. I Table 2.5.")
        add(f"{area}: aged 18+", int(r["aged_18_plus"]), "people", "calculated", {**base, "measure": "aged_18_plus"},
            "Sum of single years 18 to 100+, Vol. III Table 2.3.")
        add(f"{area}: aged 18+ share", round(float(r["aged_18_plus_pct"]), 1), "percent", "calculated",
            {**base, "measure": "aged_18_plus_pct"}, "Aged 18+ / population by age (excludes intersex), Vol. III Table 2.3.")
        add(f"{area}: own a mobile phone", float(r["phone_pct"]), "percent", "official", {**base, "measure": "phone_pct"},
            "Persons aged 3 and above, Vol. IV Table 2.32.")
        add(f"{area}: use the internet", float(r["internet_pct"]), "percent", "official", {**base, "measure": "internet_pct"},
            "Persons aged 3 and above, Vol. IV Table 2.33.")
        add(f"{area}: lit by mains electricity", float(r["mains_electricity_pct"]), "percent", "official",
            {**base, "measure": "mains_electricity_pct"}, "Conventional households by main lighting source, Vol. IV Table 2.19.")
    for b in bands.itertuples():
        add(f"Kitui County: aged {b.band}", round(float(b.share_pct), 1), "percent", "calculated",
            {"subcounty": "COUNTY", "code": "15", "measure": "age_band", "band": b.band},
            f"{int(b.Total):,} people / population by age, Vol. III Table 2.3.")
    add("Kenya: lit by mains electricity", national, "percent", "official",
        {"subcounty": "KENYA", "code": "", "measure": "mains_electricity_pct"},
        "Conventional households by main lighting source, Vol. IV Table 2.19.")

    chart = sx.Chart(
        id="census-subcounty",
        title="Kitui by KNBS sub-county, 2019 census",
        description=("Population, adults, phone ownership, internet use and electric lighting for "
                     "Kitui's 18 census sub-counties, which are not its 8 constituencies."),
        chart_type="table",
        values=values,
        notes=["KNBS 2019 Kenya Population and Housing Census, read from the rKenyaCensus package "
               "(commit 6db00e5). Sub-county figures are never summed into constituencies; wards "
               "reach them through data/geo/ward-keys.json."],
    )
    return chart.write()


def run() -> dict:
    rep = report.Report("15_census.md", "Stage 15 — 2019 census by sub-county",
                        "Kitui's census sub-counties, and which of them each ward sits in.")
    if not available():
        rep.p("The rKenyaCensus tables or the sub-county polygons are absent from data/raw/.")
        rep.gaps(["rKenyaCensus (github.com/Shelmith-Kariuki/rKenyaCensus) and keAdminBounds "
                  "(github.com/wanjohikibui/keAdminBounds), cloned into data/raw/."])
        rep.write()
        return {"state": "skipped", "summary": "no census tables", "gaps": ["census tables"]}

    sc = subcounty_table()
    problems = check_published(sc)
    if problems:
        raise ValueError("rKenyaCensus does not reproduce the published KNBS figures: " + "; ".join(problems))
    bands = age_bands()
    national = national_electricity()
    codes = subcounty_codes()
    if set(codes) != set(sc.index) - {"COUNTY"}:
        raise ValueError(f"sub-county names differ between the census and the polygons: {sorted(set(codes) ^ (set(sc.index) - {'COUNTY'}))}")

    keys = json.loads(KEYS.read_text(encoding="utf-8"))
    slugs = {w["name"]: w["slug"] for w in keys["wards"]}
    majority = float(config.value("census.ward_majority"))
    cw = crosswalk(slugs)
    rows = write_crosswalk(cw, majority)
    written = exports(sc, bands, national, codes)

    county = sc.loc["COUNTY"]
    rep.h2("Kitui's sub-counties")
    shown = sc.drop(index="COUNTY").sort_values("population", ascending=False).reset_index(names="Sub-county")
    shown["Sub-county"] = shown["Sub-county"].str.title()
    shown["population"] = shown["population"].map(lambda n: f"{n:,.0f}")
    rep.table(shown[["Sub-county", "population", "aged_18_plus_pct", "phone_pct", "internet_pct",
                     "mains_electricity_pct"]].rename(columns={
        "population": "Population", "aged_18_plus_pct": "Aged 18+ %", "phone_pct": "Own a phone %",
        "internet_pct": "Use internet %", "mains_electricity_pct": "Mains lighting %"}), floatfmt="{:,.1f}")
    rep.p(f"County: {county['population']:,.0f} people, {county['aged_18_plus']:,.0f} aged 18 and over "
          f"({county['aged_18_plus_pct']:.1f}%), {county['phone_pct']:.1f}% own a phone, "
          f"{county['internet_pct']:.1f}% use the internet, {county['mains_electricity_pct']:.1f}% of "
          f"households lit by mains electricity against {national:.1f}% nationally. Phone and internet "
          "rates are of persons aged 3 and above, not of adults or voters.")
    spread = sc.drop(index="COUNTY")
    rep.p(f"Internet use runs from {spread['internet_pct'].min():.1f}% "
          f"({spread['internet_pct'].idxmin().title()}) to {spread['internet_pct'].max():.1f}% "
          f"({spread['internet_pct'].idxmax().title()}). n = 18 sub-counties.")

    rep.h2("Age bands, Kitui County")
    rep.table(bands.assign(Total=bands["Total"].map(lambda n: f"{n:,.0f}")).rename(
        columns={"band": "Band", "Total": "People", "share_pct": "Share %"}), floatfmt="{:,.1f}")

    rep.h2("Wards and sub-counties")
    splits = [r for r in rows if r["split"]]
    rep.p(f"{len(rows) - len(splits)} of {len(rows)} wards have at least {majority:.0%} of their area in "
          f"one sub-county. {len(splits)} are split, and keep every share: a figure for them is a "
          "figure for the sub-county holding most of their area, not for the ward.")
    rep.table(pd.DataFrame([{
        "Ward": next(w["name"] for w in keys["wards"] if w["slug"] == r["slug"]),
        "Sub-county (largest share)": r["knbs_subcounty"].title(),
        "Shares": "; ".join(f"{s['subcounty'].title()} {s['share']:.0%}" for s in r["shares"]),
        "Split": "yes" if r["split"] else "",
    } for r in rows]))
    rep.p("Shares are of land area, not of people. A ward's people may sit mostly in the smaller "
          "share (a town on one side of a boundary), so a split ward's sub-county figure is weaker "
          "evidence than an unsplit one's.")

    rep.h2("Checks")
    rep.bullets([
        "The package reproduces Kitui's published census figures: 1,136,187 people, 42.9% phone "
        "ownership, 13.6% internet use.",
        "Sub-county populations, adults and households each sum exactly to the county.",
        "All 18 census sub-county names match the polygon file's.",
    ])

    rep.h2("Limits")
    rep.bullets([
        "2019 figures. Phone and internet use have moved since: Kitui's county internet rate was "
        "26.2% in 2023/24 against 13.6% in 2019. Sub-county rates for 2023/24 are not published.",
        "The two boundary files were digitised separately; slivers under 1% of a ward are dropped.",
        "No literacy table is in the 2019 census volumes the package carries (Vols. I–IV). "
        "literacy.county stays open.",
    ])
    rep.gaps(["A county literacy rate (KNBS or KDHS 2022 county report): not in the 2019 census tables."])
    path_out = rep.write()
    return {
        "state": "ok",
        "summary": f"18 sub-counties, {len(splits)} split wards → {written}, {CROSSWALK.name}, {path_out}",
        "gaps": ["literacy.county"],
    }
