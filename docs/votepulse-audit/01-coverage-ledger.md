# VotePulse coverage ledger

Audit date: 8 November 2026. Every URL is listed in `01-coverage-ledger.csv`.

| Item | Count | Result |
|---|---|---|
| Sitemap URLs | 2,210 | All fetched, all HTTP 200 |
| Linked URLs outside the sitemap | 2 | Fetched |
| Pages reviewed in a browser at 360px and 1440px | 15 | Non-template examples and one of each template |
| County pages | 47 | Same template |
| Constituency pages | 290 | Same template; heading wording differs by name only |
| Ward pages | 1,450 | Same template; heading wording differs by name only |

## Excluded

robots.txt disallows `/api/`, `/socket.io/`, `/portal/`, `/field/`, `/agent/`, `/candidate/`, `/partners/`, `/pulse/`, `/code/`, `/admin/`, `/auth/` and `/internal/`. None was visited. Logged-in product screens were therefore not reviewed.

## Interactions

Tabs, disclosures, sliders and dropdowns were operated at 1440px on the 15 browser pages. No form was submitted, no chat message sent, no vote cast and no account created. Non-template pages other than those 15 were parsed from HTML, without their controls being operated.
