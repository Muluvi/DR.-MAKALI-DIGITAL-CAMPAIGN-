# Ward boundaries: source, licence and processing

Used by `<CountyScene>` and `<CountyStatic>` (`lib/premium/county.ts`). Recorded for brief G-2.

## Source

| | |
|---|---|
| Dataset | *Kenya County Assembly Boundaries*, Omare, B.D.A. and Omare, G.J.M. (2017) |
| Where | github.com/benaboki/Kenya-County-Assembly-Boundaries, file `kenya_county_assemblies.geojson` |
| Version used | commit `7ee2ae5d3710e11e4e8ffdfb13ad52693605f633` (17 May 2020), retrieved 24 September 2026 |
| Licence | Creative Commons Attribution 4.0 International (CC BY 4.0), `LICENSE.md` in the repository |
| Derived from | IEBC, *Proposed Constituency and County Assembly Wards* (First Review, 9 January 2012); KNBS/SID *Exploring Kenya's Inequality* (2013); OpenStreetMap |
| Method (per the authors) | Digitised in QGIS by georeferencing, 1:50,000, EPSG:4326 |
| Attribution line for figures | "Ward boundaries: Omare & Omare (2017), digitised from IEBC ward delimitation, CC BY 4.0. Schematic height and colour; not a survey map." |

The Humanitarian Data Exchange's *Administrative Wards in Kenya* (also described as CC BY) could
not be reached from the build environment: `data.humdata.org` is blocked by its egress policy.
If Firefly prefers that source, supply the file and it drops in behind the same module.

## Caveats a reader should know

1. **Delimitation date.** The boundaries follow the IEBC's 2012 ward proposals, digitised by third
   parties. The 2022 register is by the same 40 wards, and all 40 names match the register after
   one spelling alias (below), but ward lines may differ in detail from the gazetted final
   delimitation. The scene says "schematic" for this reason as well as for the extrusion.
2. **One stray feature removed.** The source file carries a polygon named `Township (Kiambu)`,
   county code 15 (Kitui), whose coordinates (36.79–36.89 E, 1.17–1.22 S) are in Kiambu. It is a
   mislabelled record; it is dropped. Kitui's own `Township` (37.98–38.02 E) is kept.
3. **Largest part only in the morph.** A ward drawn as several polygons morphs from its largest
   part; the static SVG draws every part.

## Name matching (checked against `data/ward-register.json`)

| Source spelling | Register spelling |
|---|---|
| Kwavonza/Yatta | Kwa Vonza/Yatta |

All other 39 wards match by name and constituency. The register used to spell one Kitui East ward
"Mutitu/Kaliku", and the map carried a second alias to match it. IEBC's 2022 register by polling
station spells it "Mutito/Kaliku", as the boundary source does, so the register now uses that
spelling and the alias is gone. `lib/premium/county.ts` throws at build if any
ward fails to join or the count differs from the register's 40.

## Processing

```
extract Kitui features, drop the Kiambu record, apply the alias          (40 features, 109 KB GeoJSON)
mapshaper -clean -simplify 22% keep-shapes weighted -rename-layers wards \
          -o format=topojson quantization=1e4                            (public/geo/kitui-wards.topo.json, 11 KB)
```

No value is read from the geometry. Heights are each ward's 2022 registered voters from the ward
register, the same numbers the tile map prints.
