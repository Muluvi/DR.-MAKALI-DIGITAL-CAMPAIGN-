"""Stage 16 — buildings and settlement clusters. Counts land in wards; clusters find dense groups."""
from __future__ import annotations

import numpy as np
import pandas as pd
import pytest

from src import stage16_settlement as s16

needs_buildings = pytest.mark.skipif(not s16.raw_file().exists(), reason="Overture buildings not in data/raw/")


def test_points_inside_a_ward_polygon_land_in_it_and_outside_points_in_none():
    # SYNTHETIC: two made-up points, one at Kitui town, one in the Indian Ocean. Never exported.
    wards = s16.load_wards()
    pts = s16.assign(pd.DataFrame({"lon": [38.0106, 40.5], "lat": [-1.3670, -3.0], "dataset": ["x", "x"]}), wards)
    assert pts["slug"].iloc[0] == "township"
    assert pd.isna(pts["slug"].iloc[1])


def test_clusters_find_a_dense_group_and_ignore_scatter():
    # SYNTHETIC: 300 points within ~40 m of one place, 300 spread over ~50 km. Never exported.
    import geopandas as gpd
    rng = np.random.default_rng(0)
    dense = np.column_stack([38.0 + rng.normal(0, 0.0003, 300), -1.37 + rng.normal(0, 0.0003, 300)])
    sparse = np.column_stack([38.0 + rng.uniform(-0.25, 0.25, 300), -1.37 + rng.uniform(-0.25, 0.25, 300)])
    xy = np.vstack([dense, sparse])
    pts = gpd.GeoDataFrame({"slug": ["township"] * 600}, geometry=gpd.points_from_xy(xy[:, 0], xy[:, 1]), crs="EPSG:4326")
    cl = s16.clusters(pts, eps_m=75, min_samples=25, min_buildings=200)
    assert len(cl) == 1
    assert 290 <= cl["buildings"].iloc[0] <= 310
    assert abs(cl["lon"].iloc[0] - 38.0) < 0.001 and abs(cl["lat"].iloc[0] + 1.37) < 0.001


@needs_buildings
def test_every_ward_has_buildings_and_the_counts_reconcile():
    b = pd.read_parquet(s16.raw_file())
    pts = s16.assign(b, s16.load_wards())
    inside = pts[pts["slug"].notna()]
    counts = inside.groupby("slug").size()
    assert len(counts) == 40 and (counts > 0).all()
    assert counts.sum() == len(inside)
