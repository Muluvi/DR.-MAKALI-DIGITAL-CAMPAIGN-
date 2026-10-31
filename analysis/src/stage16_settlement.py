"""Stage 16 — where people build: building counts and clusters by ward (open-data brief, WP5).

The brief names Microsoft's Kenya building footprints. Their download host is unreachable from
the build environment, so on 30 October 2026 Firefly approved Overture Maps' buildings theme
instead: a conflation of OpenStreetMap, Microsoft and Google building detections, ODbL. Where
OpenStreetMap already maps a building Overture keeps that one and drops the detection, so all
sources are counted together; filtering to Microsoft alone would undercount the towns. The
source mix is reported per ward.

    python -m src.stage16_settlement --fetch    # read Kitui's row groups from Overture's S3
    python -m src.run_all --stage 16            # count, cluster, export

The fetch reads only the parquet row groups whose bounding boxes overlap Kitui (a few hundred MB
of 270 GB) and keeps one point per building, the centre of its bounding box, with its source
dataset. Raw rows stay in data/raw/ (gitignored); only ward counts and cluster centroids leave.

Every output is Tier 2 and `calculated`: a count of detected buildings, not of households or
people. Detection misses buildings (Microsoft reports 69% recall in Kenya) and imagery dates
differ by source, so the counts under-count recent growth.
"""
from __future__ import annotations

import argparse
import json
import os
import sys
from concurrent.futures import ThreadPoolExecutor

import numpy as np
import pandas as pd

from src import config, report, siteexport as sx

WARD_POLYGONS = config.REPO_ROOT / "public" / "geo" / "kitui-wards.topo.json"
KEYS = config.SITE_DATA / "geo" / "ward-keys.json"
BUCKET = "overturemaps-us-west-2"
EQUAL_AREA = "EPSG:6933"
# UTM 37S: metres, for clustering distances across Kitui.
METRIC = "EPSG:32737"


def release() -> str:
    return str(config.value("settlement.overture_release"))


def raw_file():
    return config.DATA_RAW / "overture" / release() / "kitui-buildings.parquet"


def kitui_bbox() -> tuple[float, float, float, float]:
    """The ward polygons' extent, padded slightly: (xmin, xmax, ymin, ymax)."""
    import geopandas as gpd
    xmin, ymin, xmax, ymax = gpd.read_file(WARD_POLYGONS).set_crs("EPSG:4326").total_bounds
    pad = 0.01
    return xmin - pad, xmax + pad, ymin - pad, ymax + pad


def s3():
    """Anonymous S3, through the environment's HTTPS proxy when one is set."""
    import pyarrow.fs as pafs
    from urllib.parse import urlparse
    proxy = os.environ.get("HTTPS_PROXY") or os.environ.get("https_proxy")
    opts = {}
    if proxy:
        u = urlparse(proxy)
        opts["proxy_options"] = {"scheme": u.scheme, "host": u.hostname, "port": u.port}
    return pafs.S3FileSystem(anonymous=True, region="us-west-2", **opts)


def fetch() -> str:
    import pyarrow as pa
    import pyarrow.compute as pc
    import pyarrow.fs as pafs
    import pyarrow.parquet as pq

    fs = s3()
    base = f"{BUCKET}/release/{release()}/theme=buildings/type=building/"
    files = [f.path for f in fs.get_file_info(pafs.FileSelector(base)) if f.path.endswith(".parquet")]
    x0, x1, y0, y1 = kitui_bbox()

    def overlapping(path):
        pf = pq.ParquetFile(path, filesystem=fs)
        md = pf.metadata
        names = [md.row_group(0).column(i).path_in_schema for i in range(md.row_group(0).num_columns)]
        ix = {n: names.index(n) for n in ("bbox.xmin", "bbox.xmax", "bbox.ymin", "bbox.ymax")}
        groups = []
        for g in range(md.num_row_groups):
            st = {n: md.row_group(g).column(i).statistics for n, i in ix.items()}
            if st["bbox.xmin"].min <= x1 and st["bbox.xmax"].max >= x0 and st["bbox.ymin"].min <= y1 and st["bbox.ymax"].max >= y0:
                groups.append(g)
        return path, groups

    with ThreadPoolExecutor(16) as ex:
        plan = [(p, g) for p, g in ex.map(overlapping, files) if g]

    tables = []
    for path, groups in plan:
        t = pq.ParquetFile(path, filesystem=fs).read_row_groups(groups, columns=["id", "sources", "bbox"])
        lon = pc.divide(pc.add(t["bbox"].combine_chunks().field("xmin"), t["bbox"].combine_chunks().field("xmax")), 2)
        lat = pc.divide(pc.add(t["bbox"].combine_chunks().field("ymin"), t["bbox"].combine_chunks().field("ymax")), 2)
        keep = pc.and_(pc.and_(pc.greater_equal(lon, x0), pc.less_equal(lon, x1)),
                       pc.and_(pc.greater_equal(lat, y0), pc.less_equal(lat, y1)))
        first = pc.list_element(t["sources"], 0)
        tables.append(pa.table({
            "id": t["id"], "lon": lon, "lat": lat,
            "dataset": pc.struct_field(first, "dataset"),
            "update_time": pc.struct_field(first, "update_time"),
        }).filter(keep))
    out = pa.concat_tables(tables)
    raw_file().parent.mkdir(parents=True, exist_ok=True)
    pq.write_table(out, raw_file())
    meta = {"release": release(), "files": len(plan), "row_groups": sum(len(g) for _, g in plan),
            "buildings_in_bbox": out.num_rows, "bbox": [x0, x1, y0, y1]}
    (raw_file().parent / "fetch.json").write_text(json.dumps(meta, indent=2) + "\n", encoding="utf-8")
    return f"{out.num_rows:,} buildings in Kitui's bounding box from {meta['row_groups']} row groups in {len(plan)} files"


def load_wards():
    import geopandas as gpd
    keys = json.loads(KEYS.read_text(encoding="utf-8"))
    slug = {w["name"]: w["slug"] for w in keys["wards"]}
    w = gpd.read_file(WARD_POLYGONS).set_crs("EPSG:4326")[["ward", "constituency", "geometry"]]
    w["slug"] = w["ward"].map(slug)
    w["geometry"] = w.buffer(0)
    w["area_km2"] = w.to_crs(EQUAL_AREA).area / 1e6
    return w


def assign(buildings: pd.DataFrame, wards):
    """Each building to the ward polygon containing its centre point."""
    import geopandas as gpd
    pts = gpd.GeoDataFrame(buildings, geometry=gpd.points_from_xy(buildings["lon"], buildings["lat"]), crs="EPSG:4326")
    j = gpd.sjoin(pts, wards[["slug", "geometry"]], how="left", predicate="within")
    j = j[~j.index.duplicated(keep="first")]
    return j.drop(columns=["index_right"])


def clusters(pts, eps_m: float, min_samples: int, min_buildings: int) -> pd.DataFrame:
    """DBSCAN on building centres in metres: dense groups of buildings, the likely trading centres."""
    import geopandas as gpd
    from sklearn.cluster import DBSCAN
    xy = pts.to_crs(METRIC)
    coords = np.column_stack([xy.geometry.x, xy.geometry.y])
    labels = DBSCAN(eps=eps_m, min_samples=min_samples, algorithm="ball_tree").fit_predict(coords)
    df = pd.DataFrame({"label": labels, "x": coords[:, 0], "y": coords[:, 1], "slug": pts["slug"].to_numpy()})
    df = df[df["label"] >= 0]
    g = df.groupby("label").agg(buildings=("x", "size"), x=("x", "mean"), y=("y", "mean"),
                                slug=("slug", lambda s: s.mode().iloc[0] if s.notna().any() else None))
    g = g[g["buildings"] >= min_buildings].sort_values("buildings", ascending=False).reset_index(drop=True)
    centres = gpd.GeoSeries(gpd.points_from_xy(g["x"], g["y"]), crs=METRIC).to_crs("EPSG:4326")
    g["lon"], g["lat"] = centres.x.round(5), centres.y.round(5)
    return g[["buildings", "lon", "lat", "slug"]]


def exports(per_ward: pd.DataFrame, cl: pd.DataFrame, dates: str) -> str:
    src = config.assumption("settlement.source")
    sid, tier = str(src.source_id), src.tier
    as_of = release()
    values: list[sx.Value] = []

    def add(label, value, unit, dims, note=""):
        values.append(sx.Value(label, value, unit, sid, tier, as_of, "calculated", "placeholder", note, dims))

    for w in per_ward.itertuples():
        base = {"ward": w.slug, "constituency": w.constituency_id}
        add(f"{w.ward}: buildings", int(w.buildings), "count", {**base, "measure": "buildings"},
            "Overture buildings whose centre falls in the ward polygon.")
        add(f"{w.ward}: buildings per km²", round(float(w.per_km2), 1), "per km²", {**base, "measure": "per_km2"},
            "Buildings / ward area (equal-area projection).")
        add(f"{w.ward}: share from OpenStreetMap", round(float(w.osm_pct), 1), "percent",
            {**base, "measure": "osm_pct"}, "The rest are machine-detected (Microsoft, Google).")
    for i, c in enumerate(cl.itertuples(), start=1):
        add(f"Cluster {i}", int(c.buildings), "count",
            {"measure": "cluster", "rank": i, "lon": float(c.lon), "lat": float(c.lat), "ward": c.slug},
            "Buildings in a dense cluster (assumptions.yaml settlement.cluster_*): centroid only.")
    chart = sx.Chart(
        id="ward-settlement",
        title="Buildings by ward, and where they cluster",
        description=("Detected buildings per ward and per km², and the dense clusters that mark "
                     "trading centres. A count of buildings, not of households or people."),
        chart_type="table",
        values=values,
        notes=[f"Overture Maps buildings, release {release()} (ODbL): OpenStreetMap, Microsoft and "
               f"Google detections, conflated. Source imagery and edit dates run {dates}; detection "
               "misses buildings and under-counts recent growth."],
    )
    return chart.write()


def run() -> dict:
    rep = report.Report("16_settlement.md", "Stage 16 — Buildings and settlement clusters by ward",
                        "Where Kitui's buildings are, ward by ward, and where they cluster.")
    if not raw_file().exists():
        rep.p(f"`{raw_file().relative_to(config.ANALYSIS_ROOT)}` is absent. Run "
              "`python -m src.stage16_settlement --fetch` first.")
        rep.gaps(["Overture Maps buildings for Kitui (fetch from s3://overturemaps-us-west-2)."])
        rep.write()
        return {"state": "skipped", "summary": "no buildings file", "gaps": ["buildings"]}

    import geopandas as gpd  # noqa: F401  (analysis-only dependency)
    b = pd.read_parquet(raw_file())
    wards = load_wards()
    pts = assign(b, wards)
    inside = pts[pts["slug"].notna()]
    outside = len(pts) - len(inside)

    keys = json.loads(KEYS.read_text(encoding="utf-8"))
    cid = {w["slug"]: w["constituency_id"] for w in keys["wards"]}
    counts = inside.groupby("slug").size().rename("buildings")
    osm = inside.assign(is_osm=inside["dataset"].eq("OpenStreetMap")).groupby("slug")["is_osm"].mean() * 100
    per_ward = wards.set_index("slug").join(counts).join(osm.rename("osm_pct")).reset_index()
    per_ward["buildings"] = per_ward["buildings"].fillna(0).astype(int)
    per_ward["osm_pct"] = per_ward["osm_pct"].fillna(0.0)
    per_ward["per_km2"] = per_ward["buildings"] / per_ward["area_km2"]
    per_ward["constituency_id"] = per_ward["slug"].map(cid)

    eps = float(config.value("settlement.cluster_eps_m"))
    min_samples = int(config.value("settlement.cluster_min_samples"))
    min_buildings = int(config.value("settlement.cluster_min_buildings"))
    cl = clusters(inside, eps, min_samples, min_buildings)

    years = pd.to_datetime(inside["update_time"], errors="coerce", utc=True).dt.year.dropna()
    dates = f"{int(years.min())} to {int(years.max())}" if len(years) else "not stated"
    written = exports(per_ward, cl, dates)

    mix = inside["dataset"].value_counts()
    total = len(inside)
    rep.h2("Kitui's buildings")
    rep.p(f"{total:,} buildings have their centre inside a Kitui ward. The other {outside:,} in the "
          "rectangle fetched lie in neighbouring counties, or in slivers the simplified ward boundaries "
          "leave out. Sources: " + "; ".join(f"{d} {n:,} ({100 * n / total:.1f}%)" for d, n in mix.items())
          + f". Edit and imagery dates run {dates}.")
    shown = per_ward.sort_values("per_km2", ascending=False)
    shown = pd.DataFrame({
        "Ward": shown["ward"], "Constituency": shown["constituency"],
        "Buildings": shown["buildings"].map(lambda n: f"{n:,}"),
        "km²": shown["area_km2"], "Per km²": shown["per_km2"], "From OSM %": shown["osm_pct"],
    })
    rep.table(shown, floatfmt="{:,.1f}")
    rep.p("n = 40 wards. Density follows the ward polygons, which are simplified boundaries.")

    rep.h2("Clusters")
    rep.p(f"DBSCAN on building centres: neighbours within {eps:.0f} m, at least {min_samples} to seed a "
          f"cluster, and only clusters of {min_buildings} or more buildings kept (all placeholders in "
          f"assumptions.yaml). {len(cl)} clusters.")
    names = {w["slug"]: w["name"] for w in keys["wards"]}
    rep.table(pd.DataFrame({
        "#": range(1, len(cl) + 1), "Buildings": cl["buildings"].map(lambda n: f"{n:,}"),
        "Ward": cl["slug"].map(names), "Lon": cl["lon"], "Lat": cl["lat"],
    }).head(30), floatfmt="{:.5f}")

    rep.h2("Limits")
    rep.bullets([
        "A building count, not households or people: one homestead can hold several buildings.",
        "Machine detection misses buildings (Microsoft reports 69% recall for Kenya) and finds a "
        "few that are not there (about 1.3–1.9% false positives).",
        "Sources differ in date, and OpenStreetMap coverage is uneven: wards mapped by volunteers "
        "show more of their buildings than wards left to detection.",
        "Overture replaces the brief's Microsoft Kenya release (download host unreachable); "
        "approved by Firefly on 30 October 2026.",
    ])
    path_out = rep.write()
    return {"state": "ok",
            "summary": f"{total:,} buildings in 40 wards, {len(cl)} clusters → {written}, {path_out}",
            "gaps": []}


if __name__ == "__main__":
    parser = argparse.ArgumentParser(prog="src.stage16_settlement")
    parser.add_argument("--fetch", action="store_true", help="read Kitui's buildings from Overture's S3")
    args = parser.parse_args()
    if args.fetch:
        print(fetch())
    sys.exit(0)
