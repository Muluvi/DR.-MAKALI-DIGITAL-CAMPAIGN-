# Stage 5 — Maps

Ward choropleths of voters, priority, segment, connectivity and drought exposure.

*Kitui 2027 analysis pipeline · data as of 2026-09-16 · generated 2026-09-17*


## Skipped — no boundary file

No ward boundary file was found in `data/raw/boundaries/`. This stage is skipped and the gap is logged; the rest of the pipeline is unaffected.

The code is written and will run as soon as a file is dropped in. It accepts `.geojson`, `.json`, `.shp` (with sidecars) or `.gpkg`, reprojects anything that is not EPSG:4326, and joins on normalised ward names.


## What to supply

A polygon layer covering all 40 Kitui County Assembly wards, with a ward-name property (`ward`, `WARD`, `name`, `NAME` or `ADM3_EN`) and a valid CRS. IEBC published boundaries for the 2022 delimitation; ward boundaries are also carried as ADM3 on the Kenya Open Data portal and on OCHA/HDX.


## The join will need attention

Ward names do not agree across sources. Stage 1 already found two variants between the pack and the site: `Kwavonza/Yatta` against `Kwa Vonza/Yatta`, which normalises away safely, and `Mutito/Kaliku` against `Mutitu/Kaliku`, which differs by a letter and is only ever matched by similarity. Every ward that fails to match exactly is listed rather than dropped: a ward missing from a choropleth is a lie of omission.


## Layers that would be produced

| Layer | Data status |
|---|---|
| Registered voters (2022) | available |
| Ward priority score | available |
| Ward segment | available |
| Connectivity proxy | [DATA NEEDED] — see Stage 4 |
| Drought exposure | [DATA NEEDED] — see Stage 4 |


## Data gaps

- **[DATA NEEDED]** A ward boundary file at `data/raw/boundaries/kitui_wards.geojson`.
- **[DATA NEEDED]** Ward-level connectivity data, for the connectivity choropleth (pack gap 20).
- **[DATA NEEDED]** Sub-county NDMA bulletins, for the drought choropleth.
