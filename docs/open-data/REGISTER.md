# Open-data register

Every public repository the site or the analysis pipeline takes anything from, recorded before
use (`KITUI-OPEN-DATA-BRIEF.md`, WP0). A repository with no licence file is not used. Raw
downloads go in `analysis/data/` (gitignored). Only derived keys and aggregates are committed.

Last updated 30 October 2026 (step 4, census).

## In use

### open-admin-data/kenya-administrative-divisions

| | |
|---|---|
| URL | https://github.com/open-admin-data/kenya-administrative-divisions |
| Commit | `60f507697da89f5c0580a177f15d21f14b679aac` (HEAD on 30 October 2026, read with `git ls-remote`; files fetched from `raw.githubusercontent.com` at that SHA) |
| Licence | CC BY 4.0, quoted from `LICENSE`: "Creative Commons Attribution 4.0 International (CC BY 4.0) … Copyright (c) 2026 jakkrapongt". Build code under `build/` is MIT and is not used. |
| What was taken | `data/all-ward.json`: the `id` and `name.en` of Kitui's 40 ward records, and their parent record (`data/all-subcounty.json`). Stored only as the `open_admin_id` and `open_admin_name` columns of `data/geo/ward-keys.json`. |
| Original source and date | Not stated in the repository. The README gives "Last Updated 2026-09-08" for the compilation. The ward list matches the IEBC 2012 delimitation used by the 2022 register. |
| Coverage of Kitui | All 40 wards, under 8 parents |
| Resolution | Ward names and codes. The README's `geo` field holds one point per record; it is not used. No polygons. |
| Proposed tier | T2, reference. Used to cross-check names, never as a source for a figure. |
| Known limits | The level-2 records it calls "sub-counties" are IEBC **constituencies**, not KNBS census sub-counties: its 290 nationally match the 290 constituencies. One Kitui constituency is under its pre-2013 name ("Mwingi East" for Mwingi Central). Spellings differ from the register in four wards (see `data/geo/ward-keys.json`). |
| Attribution line | "Ward codes: open-admin-data, *Kenya Administrative Divisions*, CC BY 4.0." |

### open-contracting/standard (field names only)

| | |
|---|---|
| URL | https://github.com/open-contracting/standard |
| Commit | `eb57a46e69efead6ae62144fe1b7cefc53d07ff2` (HEAD on 30 October 2026) |
| Licence | Apache 2.0, quoted from `LICENSE`: "Copyright (c) 2014-2017 Open Contracting Partnership. Licensed under the Apache License, Version 2.0". |
| What was taken | Field names only, from `schema/release-schema.json` (OCDS 1.1.5): `title`, `tender.value.amount`, `tender.value.currency`, `items.classification`. No data, no code. |
| Original source and date | Not applicable. The repository holds a schema, not data. |
| Coverage of Kitui | None. The schema is a naming convention. |
| Resolution | Not applicable |
| Proposed tier | Not applicable. It carries no figures. |
| Known limits | OCDS `tender.status` is deprecated since 1.2 and describes procurement, not delivery. The cleaned projects table keeps the scorecard's own printed status ("Complete", "Ongoing" …) under `status` and does not map it to the OCDS codelist. |

### Shelmith-Kariuki/rKenyaCensus

| | |
|---|---|
| URL | https://github.com/Shelmith-Kariuki/rKenyaCensus |
| Commit | `6db00e5b1b71a781e6def15dd98a4828b6d960bc` (29 June 2020; HEAD on 30 October 2026) |
| Licence | MIT, quoted from `LICENSE`: "YEAR: 2020 / COPYRIGHT HOLDER: Shelmith Kariuki" with `DESCRIPTION`: "License: MIT + file LICENSE". The figures themselves are KNBS's and are cited to KNBS. |
| What was taken | `data/*.rda`, read in Python with `pyreadr` (no R install): `V1_T2.5` (population by sub-county), `V3_T2.3` (population by single year of age, sex and sub-county), `V4_T2.19` (main lighting fuel), `V4_T2.32` (mobile phone ownership), `V4_T2.33` (internet use). Table IDs from the package's own `DataCatalogue`. |
| Original source and date | KNBS, *2019 Kenya Population and Housing Census*, Volumes I, III and IV (published 2019–2020). Census night 24/25 August 2019. |
| Coverage of Kitui | County total and all 18 KNBS sub-counties |
| Resolution | KNBS sub-county (not IEBC constituency) |
| Tier | T1 `official`, source ID `S72`. Stage 15 checks the package against Kitui's published totals (1,136,187 people; 42.9% phone ownership; 13.6% internet use) before writing, and stops if any differ. |
| Known limits | Volumes I–IV as packaged carry no literacy table, so `literacy.county` stays open. Phone and internet rates are of persons aged 3 and above. 2019 figures. |
| Attribution line | "KNBS, 2019 Kenya Population and Housing Census; tables via rKenyaCensus (Kariuki, MIT)." |

### wanjohikibui/keAdminBounds (sub-county polygons)

| | |
|---|---|
| URL | https://github.com/wanjohikibui/keAdminBounds |
| Commit | `b5858bc4dcd50d73cc504e7d8c14c5803b6e7200` (HEAD on 30 October 2026) |
| Licence | MIT, quoted from `LICENSE`: "MIT License / Copyright (c) 2023 Leonard Ouma". |
| What was taken | `Kenya_adm2_uscb_2020.geojson`: the 18 Kitui sub-county polygons and their `NSO_CODE` (KNBS codes 1501–1518). Used only to overlay ward polygons; no figure is read from it. |
| Original source and date | US Census Bureau, Kenya subnational boundaries (2020), matched to the KNBS 2019 census sub-counties. |
| Coverage of Kitui | All 18 census sub-counties; names match the census tables exactly |
| Resolution | Polygons, sub-county |
| Tier | T2, reference, source ID `S73`. It carries no figures. |
| Known limits | Digitised separately from the ward polygons, so the overlay leaves slivers; those under 1% of a ward are dropped. Shares are of land area, not people. The file `ken_sublocations23.zip` (sub-locations) was not used; WP2b could use it. |
| Attribution line | "Sub-county boundaries: US Census Bureau via keAdminBounds (MIT)." |

## Already in use before this register (recorded elsewhere)

| Repository | Record |
|---|---|
| benaboki/Kenya-County-Assembly-Boundaries | `docs/visual-premium/GEOGRAPHY.md`: commit `7ee2ae5d3710e11e4e8ffdfb13ad52693605f633`, CC BY 4.0, ward polygons in `public/geo/kitui-wards.topo.json` |

## Not yet used, and why

| Repository | Brief's work package | State on 30 October 2026 |
|---|---|---|
| WorldPop (wpgp) rasters | WP2 | `hub.worldpop.org` and `data.worldpop.org` did not connect from this environment. [DATA NEEDED] until the hosts are allowed or the rasters are supplied. |
| KMHFL (masterfacilitylist, `api.kmhfl.health.go.ke`) | WP4 | Did not connect from this environment. [DATA NEEDED] on the same terms. |
| Microsoft/KenyaNigeriaBuildingFootprints | WP5 | The repository page returned 403 through the environment's proxy. Not checked further. |
| wanjohikibui/keAdminBounds, sub-locations | WP2b | In use for sub-counties (above); sub-location polygons not yet used |
| tigawanna/kenya_wards_geojson_data | WP1 cross-check | Not needed: open-admin-data and the existing polygons agreed on all 40 wards |
| lsc-hubs/kenya-catalogue | WP7 | Not started |

## Source IDs

The analysis exports cite the scorecard as `S70`, open-admin-data as `S71`, the KNBS 2019 census
tables as `S72` and the sub-county polygons as `S73`. The highest ID in
the repository before this work was `S69` (`data/analysis/issue-evidence.json`). The S-IDs are
assigned in the data pack (`analysis/data/raw/kitui-2027-public-data-pack.md`), which is not in
the repository. Whoever holds the pack must confirm `S70` to `S73` are free there before the
next pipeline run.
