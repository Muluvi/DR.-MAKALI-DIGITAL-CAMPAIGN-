# Declutter progress

Measured with `node scripts/measure-text-load.mjs http://localhost:3100 <label> --single` on a production build at 390 × 844. "Baseline (Brief)" is the Stage 1 remeasure of `4bfc078` in Brief mode, the site's default before this work.

| Tab | Baseline (Brief) screens | Stage 2 | Stage 9 | Stage 10 | Baseline words | Stage 10 words |
|---|---:|---:|---:|---:|---:|---:|
| cover | 5.2 | 4.4 | 4.4 | 4.4 | 616 | 519 |
| decision | 31.9 | 24.1 | 34.7 | 32.6 | 6,187 | 3,489 |
| evidence | 99 | 85.9 | 93.2 | 90.2 | 15,486 | 10,859 |
| strategy | 54.1 | 44.8 | 52.5 | 50.8 | 9,390 | 6,712 |
| delivery | 22.1 | 17.6 | 28 | 26.8 | 3,761 | 2,445 |
| workstreams-platforms | 15.4 | 11.3 | 17.8 | 17 | 1,943 | 2,002 |
| workstreams-media | 10.7 | 9.6 | 7.7 | 7.6 | 958 | 805 |
| workstreams-ground | 17.4 | 13.4 | 18.4 | 17.4 | 2,318 | 2,215 |
| workstreams-data | 12.6 | 10.5 | 8 | 7.8 | 1,614 | 761 |
| staffing | 9.4 | 8.7 | 10.6 | 9.6 | 1,918 | 979 |
| measurement | 27.8 | 25.5 | 35.5 | 35.3 | 6,797 | 4,898 |
| risks | 10.7 | 7.6 | 10.6 | 9.9 | 1,942 | 1,056 |
| annex-evidence | 5.4 | 5.4 | 6.2 | 6 | 1,017 | 753 |
| annex-county | 15.1 | 12.9 | 13.4 | 13.4 | 2,113 | 1,479 |
| annex-messages | 4.9 | 4.9 | 4.8 | 4.7 | 1,636 | 755 |
| annex-cadence | 2.7 | 2.7 | 5.1 | 5 | 503 | 397 |
| annex-runbooks | 13.3 | 10 | 13.8 | 13.2 | 2,462 | 1,684 |
| annex-terms | 1.8 | 1 | 1.8 | 1.8 | 153 | 153 |
| annex-spec | 11.4 | 10.2 | 9.8 | 8 | 1,472 | 1,001 |
| **Total** | **371** | **310** | **376** | **362** | **62,286** | **42,962** |

## What each stage did to the count

- **Stage 2 (one version, mechanisms):** 371 → 310 screens. Removing Brief/Full and folding long prose behind "Read the full text" took 61 screens off with no content change.
- **Stages 4 to 9 (per-tab plan):** 310 → 376 screens, while visible words fell. Each section's lead, its visual and its kept commitments now show on load, and the prose they replace is folded. The visuals are taller than the prose they summarise, because cards, steppers, checklists and timelines lay text out in rows and boxes. Decision (+10.6), delivery (+9.2), measurement (+10) and annex-cadence (+2.4) rose the most.
- **Stage 10 (figure slimming, derived visuals):** 376 → 362 screens and 47,553 → 42,962 words. Figure questions, notes and item bodies moved behind "Details and notes"; the last seven derived visuals were retired.

## Where the 362 screens are (Stage 10, 390 px)

| Kind | Screens | Visible words |
|---|---:|---:|
| Figures (89; median height 948 px) | 118.8 | 15,636 |
| Mounted components (panels) | 87.4 | 12,494 |
| `visual` fences (115) | 63.7 | 8,027 |
| Headings, spacing, leads' frames, page chrome | 67.9 | — |
| Prose paragraphs | 19.9 | 3,296 |
| Callouts and lists | 4.3 | 661 |
