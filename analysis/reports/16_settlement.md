# Stage 16 — Buildings and settlement clusters by ward

Where Kitui's buildings are, ward by ward, and where they cluster.

*Kitui 2027 analysis pipeline · data as of 2026-09-16 · generated 2026-10-31*


## Kitui's buildings

660,218 buildings have their centre inside a Kitui ward. The other 1,262,755 in the rectangle fetched lie in neighbouring counties, or in slivers the simplified ward boundaries leave out. Sources: Google Open Buildings 416,251 (63.0%); Microsoft ML Buildings 221,075 (33.5%); OpenStreetMap 22,892 (3.5%). Edit and imagery dates run 2014 to 2026.

| Ward | Constituency | Buildings | km² | Per km² | From OSM % |
|---|---|---|---|---|---|
| Township | Kitui Central | 10,128 | 21.3 | 476.2 | 7.7 |
| Kyangwithya East | Kitui Central | 18,462 | 80.3 | 229.9 | 0.3 |
| Nzambani | Kitui East | 19,220 | 91.4 | 210.2 | 0.1 |
| Matinyani | Kitui West | 10,415 | 53.5 | 194.6 | 0.0 |
| Mutonguni | Kitui West | 28,847 | 148.6 | 194.2 | 0.0 |
| Central | Mwingi Central | 12,546 | 65.0 | 193.1 | 0.7 |
| Mbitini | Kitui Rural | 24,413 | 147.2 | 165.9 | 0.6 |
| Migwani | Mwingi West | 9,496 | 75.9 | 125.1 | 0.0 |
| Mulango | Kitui Central | 20,191 | 168.8 | 119.6 | 0.0 |
| Kyangwithya West | Kitui Central | 18,342 | 175.9 | 104.3 | 0.0 |
| Nguutani | Mwingi West | 21,860 | 220.4 | 99.2 | 0.0 |
| Kisasi | Kitui Rural | 18,508 | 201.6 | 91.8 | 0.0 |
| Kwa Mutonga/Kithumula | Kitui West | 18,190 | 204.8 | 88.8 | 0.0 |
| Kivou | Mwingi Central | 15,647 | 233.3 | 67.1 | 0.8 |
| Chuluni | Kitui East | 10,776 | 172.6 | 62.4 | 0.0 |
| Miambani | Kitui Central | 13,946 | 225.2 | 61.9 | 0.2 |
| Kyome/Thaana | Mwingi West | 19,476 | 325.4 | 59.9 | 3.5 |
| Mui | Mwingi Central | 28,361 | 484.7 | 58.5 | 0.1 |
| Kauwi | Kitui West | 9,912 | 237.5 | 41.7 | 1.8 |
| Kiomo/Kyethani | Mwingi West | 15,266 | 371.6 | 41.1 | 16.7 |
| Mutomo | Kitui South | 12,759 | 319.2 | 40.0 | 1.6 |
| Ikanga/Kyatune | Kitui South | 18,328 | 480.6 | 38.1 | 1.6 |
| Kanyangi | Kitui Rural | 15,075 | 412.4 | 36.6 | 16.2 |
| Kwa Vonza/Yatta | Kitui Rural | 25,861 | 751.1 | 34.4 | 4.1 |
| Ikutha | Kitui South | 14,356 | 428.1 | 33.5 | 0.9 |
| Kyuso | Mwingi North | 26,873 | 811.6 | 33.1 | 2.6 |
| Waita | Mwingi Central | 11,245 | 352.2 | 31.9 | 2.3 |
| Mutito/Kaliku | Kitui East | 18,544 | 605.8 | 30.6 | 2.7 |
| Mumoni | Mwingi North | 19,878 | 684.8 | 29.0 | 16.5 |
| Zombe/Mwitika | Kitui East | 15,302 | 546.6 | 28.0 | 3.2 |
| Tharaka | Mwingi North | 8,486 | 351.6 | 24.1 | 21.5 |
| Kanziko | Kitui South | 8,666 | 439.3 | 19.7 | 1.0 |
| Tseikuru | Mwingi North | 21,147 | 1,344.6 | 15.7 | 8.8 |
| Nuu | Mwingi Central | 16,173 | 1,411.2 | 11.5 | 0.7 |
| Voo/Kyamatu | Kitui East | 10,875 | 1,083.3 | 10.0 | 3.9 |
| Nguni | Mwingi Central | 16,747 | 1,893.3 | 8.8 | 1.7 |
| Ngomeni | Mwingi North | 9,410 | 1,503.5 | 6.3 | 0.2 |
| Endau/Malalani | Kitui East | 9,344 | 2,278.2 | 4.1 | 5.2 |
| Athi | Kitui South | 24,800 | 7,388.2 | 3.4 | 14.5 |
| Mutha | Kitui South | 12,347 | 3,686.8 | 3.3 | 1.4 |

n = 40 wards. Density follows the ward polygons, which are simplified boundaries.


## Clusters

DBSCAN on building centres: neighbours within 75 m, at least 25 to seed a cluster, and only clusters of 200 or more buildings kept (all placeholders in assumptions.yaml). 21 clusters.

| # | Buildings | Ward | Lon | Lat |
|---|---|---|---|---|
| 1 | 4,281 | Central | 38.05967 | -0.93651 |
| 2 | 1,330 | Township | 38.00862 | -1.36700 |
| 3 | 1,080 | Mutomo | 38.20773 | -1.84812 |
| 4 | 877 | Township | 38.01697 | -1.37132 |
| 5 | 603 | Township | 38.00810 | -1.35807 |
| 6 | 578 | Kauwi | 37.91548 | -1.23355 |
| 7 | 494 | Township | 37.99558 | -1.37556 |
| 8 | 446 | Kwa Vonza/Yatta | 37.82911 | -1.38350 |
| 9 | 390 | Mbitini | 38.11748 | -1.59323 |
| 10 | 329 | Nguni | 38.31047 | -0.80387 |
| 11 | 327 | Kyuso | 38.21194 | -0.55648 |
| 12 | 309 | Mui | 38.10288 | -1.05142 |
| 13 | 294 | Zombe/Mwitika | 38.24501 | -1.44325 |
| 14 | 289 | Mutito/Kaliku | 38.18966 | -1.22565 |
| 15 | 275 | Mutonguni | 37.97892 | -1.18687 |
| 16 | 219 | Migwani | 38.01902 | -1.09678 |
| 17 | 217 | Kisasi | 37.92230 | -1.67753 |
| 18 | 212 | Ikutha | 38.17932 | -2.06523 |
| 19 | 210 | Tseikuru | 38.21797 | -0.30775 |
| 20 | 209 | Nguni | 38.73953 | -0.77649 |
| 21 | 205 | Mbitini | 38.09207 | -1.50816 |


## Limits

- A building count, not households or people: one homestead can hold several buildings.
- Machine detection misses buildings (Microsoft reports 69% recall for Kenya) and finds a few that are not there (about 1.3–1.9% false positives).
- Sources differ in date, and OpenStreetMap coverage is uneven: wards mapped by volunteers show more of their buildings than wards left to detection.
- Overture replaces the brief's Microsoft Kenya release (download host unreachable); approved by Firefly on 30 October 2026.
