# us-zcta-topojson

Simplified US ZIP Code Tabulation Area (ZCTA) boundaries, one TopoJSON file per state, sized for fast loading in web maps.

- `zip/zip_<st>.topo.json`: lowercase state abbreviation (`zip_tx.topo.json`), 50 states, DC and PR. One object, `zips`; each geometry has the property `ZCTA5CE20` (5-digit ZCTA code). Coordinates are lon/lat (WGS84), quantized.
- A ZCTA that overlaps more than one state (at least 2% of its land area) appears in each of those states' files. 17 ZCTAs with no county in the Census relationship file are not included.
- About 9 MB for all files, 2.7 MB gzipped. Largest state (TX): 614 KB, 174 KB gzipped.

## Use (jsDelivr)

    https://cdn.jsdelivr.net/gh/shearwater-data/us-zcta-topojson@v1.0.0/zip/zip_tx.topo.json

Pin a version tag in the URL so the CDN can cache it long term. Decode with `topojson.feature(topo, topo.objects.zips)` from topojson-client.

## Source and method

- Boundaries: US Census Bureau, 2020 cartographic boundary file `cb_2020_us_zcta520_500k` (public domain).
- State assignment: Census 2020 ZCTA-to-county relationship file `tab20_zcta520_county20_natl.txt`.
- Simplification: mapshaper, Visvalingam 12% with `keep-shapes`, applied once nationally so neighbouring ZCTAs keep shared edges; then split per state and written with quantization 20000.
- Scripts in `tools/` (`prep.cjs` builds the ZCTA-to-state list, `build.cjs <pct> <quantization> <outDir>` builds the files). They expect the Census shapefile and relationship file locally.

These are simplified for display, not for measurement or analysis.
