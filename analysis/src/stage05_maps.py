"""Stage 5 — choropleth maps. Skipped unless a ward boundary file is supplied."""
from __future__ import annotations

import pandas as pd

from src import config, report, wards as wardlib

BOUNDARY_DIR = config.DATA_RAW / "boundaries"
PATTERNS = ("*.geojson", "*.json", "*.shp", "*.gpkg")

LAYERS = [
    ("registered_voters_2022", "Registered voters (2022)", "Blues"),
    ("priority_score", "Ward priority score", "Blues"),
    ("segment", "Ward segment", "categorical"),
    ("connectivity", "Connectivity proxy", "Blues"),
    ("drought_exposure", "Drought exposure", "Oranges"),
]


def find_boundary_file():
    if not BOUNDARY_DIR.exists():
        return None
    for pattern in PATTERNS:
        for path in sorted(BOUNDARY_DIR.glob(pattern)):
            if path.name.lower() != "readme.md":
                return path
    return None


def ward_name_column(gdf) -> str | None:
    for candidate in ("ward", "WARD", "Ward", "name", "NAME", "ADM3_EN", "adm3_en", "WARD_NAME"):
        if candidate in gdf.columns:
            return candidate
    return None


def join_report(gdf, ward_col: str, data: pd.DataFrame) -> dict:
    """Join boundaries to ward data on normalised names, listing every failure."""
    result = wardlib.match(gdf[ward_col].astype(str).tolist(), data["ward"].tolist())
    return {
        "exact": result.exact,
        "similar": result.similar,
        "unmatched": result.unmatched,
        "matched": len(result.exact) + len(result.similar),
        "total": len(gdf),
    }


def run() -> dict:
    config.ensure_dirs()
    boundary = find_boundary_file()

    rep = report.Report(
        "05_maps.md", "Stage 5 — Maps",
        "Ward choropleths of voters, priority, segment, connectivity and drought exposure.",
    )

    if boundary is None:
        rep.h2("Skipped — no boundary file")
        rep.p(
            "No ward boundary file was found in `data/raw/boundaries/`. This stage is skipped "
            "and the gap is logged; the rest of the pipeline is unaffected."
        )
        rep.p(
            "The code is written and will run as soon as a file is dropped in. It accepts "
            "`.geojson`, `.json`, `.shp` (with sidecars) or `.gpkg`, reprojects anything that "
            "is not EPSG:4326, and joins on normalised ward names."
        )
        rep.h2("What to supply")
        rep.p(
            "A polygon layer covering all 40 Kitui County Assembly wards, with a ward-name "
            "property (`ward`, `WARD`, `name`, `NAME` or `ADM3_EN`) and a valid CRS. IEBC "
            "published boundaries for the 2022 delimitation; ward boundaries are also carried "
            "as ADM3 on the Kenya Open Data portal and on OCHA/HDX."
        )
        rep.h2("The join will need attention")
        rep.p(
            "Ward names do not agree across sources. The pack and the site differ on "
            "`Kwavonza/Yatta` against `Kwa Vonza/Yatta`, which normalises away safely. A boundary "
            "file may also spell a ward differently by a letter, as the site once did with "
            "`Mutitu/Kaliku` for IEBC's `Mutito/Kaliku`; such a ward is only ever matched by "
            "similarity. Every ward that fails to match exactly is listed rather than dropped: a "
            "ward missing from a choropleth is a lie of omission."
        )
        rep.h2("Layers that would be produced")
        rep.table(pd.DataFrame(
            [{"Layer": label, "Data status":
              "available" if key in ("registered_voters_2022", "priority_score", "segment")
              else "[DATA NEEDED] — see Stage 4"} for key, label, _ in LAYERS]
        ))
        rep.gaps([
            "A ward boundary file at `data/raw/boundaries/kitui_wards.geojson`.",
            "Ward-level connectivity data, for the connectivity choropleth (pack gap 20).",
            "Sub-county NDMA bulletins, for the drought choropleth.",
        ])
        rep.write()
        return {"state": "skipped", "summary": "no boundary file", "gaps": ["ward boundary file"]}

    try:
        import geopandas as gpd
    except ImportError:
        rep.h2("Skipped — geopandas unavailable")
        rep.p("A boundary file is present but geopandas is not installed. Stage skipped, gap logged.")
        rep.write()
        return {"state": "skipped", "summary": "geopandas missing", "gaps": ["geopandas"]}

    gdf = gpd.read_file(boundary)
    if gdf.crs is not None and gdf.crs.to_epsg() != 4326:
        gdf = gdf.to_crs(epsg=4326)

    ward_col = ward_name_column(gdf)
    priority_path = config.DATA_PROCESSED / "ward_priority.csv"
    data = pd.read_csv(priority_path) if priority_path.exists() else pd.read_csv(
        config.DATA_PROCESSED / "wards.csv")

    if ward_col is None:
        rep.h2("Skipped — no ward-name column")
        rep.p(f"`{boundary.name}` has no recognisable ward-name property. Columns: "
              f"{', '.join(map(str, gdf.columns))}.")
        rep.write()
        return {"state": "skipped", "summary": "no ward-name column", "gaps": ["ward name column"]}

    join = join_report(gdf, ward_col, data)
    made = _draw(gdf, ward_col, data, join)

    rep.h2("The join")
    rep.p(f"{join['matched']} of {join['total']} boundary features matched to ward data.")
    if join["similar"]:
        rep.p("**Matched by similarity, not exactly — confirm each:**")
        rep.table(pd.DataFrame(
            [{"Boundary file": k, "Ward data": v[0], "Similarity": f"{v[1]:.3f}"}
             for k, v in join["similar"].items()]))
    if join["unmatched"]:
        rep.p("**Failed to match — these wards are absent from the maps:**")
        rep.bullets(join["unmatched"])
    else:
        rep.p("No ward failed to match.")

    rep.h2("Maps")
    for filename, caption in made:
        rep.chart(filename, caption)
    rep.write()
    return {"state": "ok", "summary": f"{len(made)} maps, {join['matched']}/{join['total']} joined",
            "gaps": join["unmatched"]}


def _draw(gdf, ward_col: str, data: pd.DataFrame, join: dict) -> list[tuple[str, str]]:
    """Render one choropleth per available layer. Lightweight SVG, mobile-friendly."""
    from src import charts

    mapping = {**join["exact"], **{k: v[0] for k, v in join["similar"].items()}}
    gdf = gdf.copy()
    gdf["_ward"] = gdf[ward_col].astype(str).map(mapping)
    merged = gdf.merge(data, left_on="_ward", right_on="ward", how="left")

    made: list[tuple[str, str]] = []
    for key, label, cmap in LAYERS:
        if key not in merged.columns or merged[key].isna().all():
            continue
        charts.apply()
        fig, ax = charts.figure(5.6, 6.0)
        if cmap == "categorical":
            merged.plot(column=key, ax=ax, categorical=True, legend=True,
                        edgecolor=charts.SURFACE, linewidth=0.5,
                        cmap="tab10", missing_kwds={"color": "#eeeeec"})
        else:
            merged.plot(column=key, ax=ax, cmap=cmap, legend=True,
                        edgecolor=charts.SURFACE, linewidth=0.5,
                        missing_kwds={"color": "#eeeeec", "label": "no data"})
        ax.set_axis_off()
        ax.set_title(f"Kitui wards — {label}")
        filename = f"05_map_{key}.svg"
        made.append((charts.save(fig, filename,
                                 f"Modelled where derived. Wards with no data are shown grey, "
                                 f"never omitted. {join['matched']}/{join['total']} features joined."),
                     f"Kitui wards — {label}"))
    return made
