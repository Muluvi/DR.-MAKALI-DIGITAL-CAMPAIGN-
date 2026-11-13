# Comparison and priorities

Scores are 1 to 5: voter or team impact, Kitui fit, effort, risk, dependency burden. Higher effort, risk and dependency are worse.

## Decisions

| ID | Feature | Dr. Mulu's site | Status | Note |
|---|---|---|---|---|
| VP-01 | Countdown to polling day, cited to law | `components/premium/Countdown.tsx` exists | Present |  |
| VP-02 | Race simulator: choose office and area, start from past results, adjust swing and turnout, reset | Small turnout simulator on `/tools`; full tool link has no route | Build now: built |  |
| VP-03 | Side-by-side scenario comparison | Not found | Build now: built |  |
| VP-04 | Load own CSV or pasted table, processed in the browser | Not confirmed | Build now: built |  |
| VP-05 | County page: units, register, stations, past results, wards by constituency | Figures exist; no single county reference view confirmed | Build now: built |  |
| VP-06 | Ward and constituency pages with comparison to neighbours | `ward-register.json` has 40 wards; Ward Dossier link has no route; data pack adds stations, centres, population, area and limits | Build now: built |  |
| VP-07 | Polling stations and registration centres per ward | Now available in the data pack: all 1,578 stations | Build now: built |  |
| VP-08 | County, ward and topic search | `/explore` searches datasets; no ward finder confirmed | Build now: built |  |
| VP-09 | Results archive 2013 to 2022 by office and county, with method and limits notes | `data/electoral-history.ts` is partial; official 2022 Kitui tallies not found | Needs content | Certified Governor totals are already in the registry; ward and station-level results are not held. |
| VP-10 | Interactive results map and county lead board | Ward geometry and map components exist | Present |  |
| VP-11 | Filterable election timeline, statutory versus announced dates | `lib/phases.ts` and timeline chapter; the data pack adds 25 Gazette dates | Build now: built |  |
| VP-12 | Tasks and reminders on milestones | Workspace exists but sign-in is off | Needs campaign decision |  |
| VP-13 | Nomination checklist by office and route, printable | Checklist in `lawful.md` section 19.4; Gazette deadlines now available | Build now: built | Open confirmations and Gazette dates only; full IEBC paperwork is unconfirmed. |
| VP-14 | Polling agent calculator with reserve input, copy link and CSV | Station and centre counts per ward now available; legal agents-per-station rule unconfirmed | Build now: built | Agents per station is a user input; the legal rule could not be confirmed. |
| VP-15 | Official campaign spending ceilings by office and area | Now available in the data pack | Build now: built |  |
| VP-16 | Election-day checklist, by stage | Fragments in chapters; procedures not yet sourced | Needs content |  |
| VP-17 | Polling agent, GOTV, canvassing, rally, fundraising and other guides | Annex playbooks and runbooks exist | Needs content |  |
| VP-18 | Glossary | `annex-terms.md` | Present |  |
| VP-19 | How Kenyan elections work explainer | Partly in chapters | Rejected |  |
| VP-20 | "Updated" date on data pages | No indicator; `CONTRIBUTING.md` specifies one from reviewed metadata | Build now: built | Shows the data pack verification date; a merge-commit timestamp needs a workflow change. |
| VP-21 | Method, completeness and limits notes beside data | Tiers and sources exist; apply to every new tool | Build now: built |  |
| VP-22 | "What it does not do" statements | Not standard on tools | Build now: built |  |
| VP-23 | Sources page and editorial policy that separates content types | Evidence annex and `/tools` sources link has no route | Build now: built | Sources view built; an editorial policy remains a campaign decision. |
| VP-24 | Copy link to a result, CSV download, print | Explorer exports data; apply to new tools | Build now: built |  |
| VP-25 | Filter controls with visible counts | Present on tools hub and explorer | Present |  |
| VP-26 | FAQ on each topic | Not standard | Needs content |  |
| VP-27 | Cookie settings banner | Not confirmed whether the site sets non-essential cookies | Needs campaign decision | No cookie banner added; whether one is needed depends on hosting analytics settings. |
| VP-28 | English and Kiswahili answer choice | Language rules exist; no toggle | Needs content |  |
| VP-29 | News ticker and election news hub | News chapter; feed is a recorded human decision | Needs campaign decision |  |
| VP-30 | Command centre and daily brief | Dashboards and workspace exist | Present |  |
| VP-31 | AI strategist and Ask IEBC assistant | Not found | Needs paid service |  |
| VP-32 | Bulk SMS, WhatsApp, voice and social sending | Plans and logs only, by decision F2 | Rejected |  |
| VP-33 | Consent, opt-out words, CAK sending-hours and approval queue | Dispatch refuses Kikamba, over 160 characters and under 48 hours; data pack adds the 08:00 to 17:00 window | Build now: built | Planning check only; nothing is sent. |
| VP-34 | Voters database, CRM, supporter register | Counts only, by decision F4 | Rejected |  |
| VP-35 | GroundForce field app with GPS, photos and offline capture | Offline reading only (`public/sw.js`) | Needs campaign decision |  |
| VP-36 | Volunteer, polling agent and station management | Aggregate tracking only | Rejected |  |
| VP-37 | Election-day war room, incidents, internal tally | Described in strategy | Needs campaign decision |  |
| VP-38 | Results form reading and arithmetic checks | Not found | Needs paid service |  |
| VP-39 | Agent coverage risk centre | Station list now available; agent coverage is campaign data | Needs content |  |
| VP-40 | Opponent profiles, sourced entries, head-to-head | Contenders data and Competitor watch exist | Present |  |
| VP-41 | Relationship graph and coverage gaps | Not found | Rejected |  |
| VP-42 | Campaign finance and M-PESA donations | Not found | Needs paid service |  |
| VP-43 | Polls and surveys by link, QR or SMS | Link and QR tool planned | Needs legal review |  |
| VP-44 | Training centre with role chapters | Team guide and runbooks | Needs content |  |
| VP-45 | Public SEO pages, structured data and sitemap scale |  | Rejected |  |
| VP-46 | Pricing, demos, partner programme, sales funnels, solution pages |  | Rejected |  |
| VP-47 | Voter registration help and public polling-station finder |  | Needs campaign decision |  |
| VP-48 | Multi-county and national coverage |  | Rejected |  |
| VP-49 | Add key dates to a calendar (.ics) | Not present | Build now: built |  |
| VP-50 | By-election pages with verification status | Not present | Needs content | Migwani status needs IEBC confirmation; press headlines and VotePulse disagree. |

## Scores for built items

| ID | Impact | Fit | Effort | Risk | Dependency |
|---|---|---|---|---|---|
| VP-11 | 5 | 5 | 2 | 1 | 1 |
| VP-21 | 4 | 5 | 1 | 1 | 1 |
| VP-33 | 4 | 5 | 1 | 1 | 1 |
| VP-05 | 5 | 5 | 3 | 1 | 1 |
| VP-06 | 5 | 5 | 3 | 1 | 1 |
| VP-07 | 5 | 5 | 3 | 1 | 1 |
| VP-08 | 4 | 5 | 2 | 1 | 1 |
| VP-15 | 4 | 5 | 2 | 1 | 1 |
| VP-22 | 3 | 4 | 1 | 1 | 1 |
| VP-49 | 3 | 4 | 1 | 1 | 1 |
| VP-02 | 5 | 5 | 4 | 2 | 1 |
| VP-03 | 4 | 5 | 4 | 1 | 1 |
| VP-13 | 4 | 5 | 2 | 2 | 2 |
| VP-14 | 5 | 5 | 3 | 2 | 2 |
| VP-20 | 3 | 4 | 2 | 1 | 1 |
| VP-23 | 3 | 4 | 2 | 1 | 1 |
| VP-24 | 3 | 4 | 2 | 1 | 1 |
| VP-04 | 3 | 4 | 3 | 2 | 1 |

## Weaknesses found in Dr. Mulu's site

| ID | Finding | Status |
|---|---|---|
| W-01 | 29 of 30 tool links on `/tools` led to pages that did not exist | Fixed: unbuilt tools now say so |
| W-02 | Tools with no page were labelled Live or Ready | Fixed |
| W-03 | `/tools` had no link from the platform navigation | Fixed |
| W-04 | Route check of `/`, `/dashboards`, `/explore` and all new tools | No defect at 360px or 1440px |
