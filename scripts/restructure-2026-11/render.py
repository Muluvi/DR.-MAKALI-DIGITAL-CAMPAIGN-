# Executed by write_docs.py with its state in scope: units, plan, tlabel, loc_label, new_id,
# bad_refs, name_counts, literals, markers, near, cref, errors, route_of.
import re as _re
from collections import Counter as _C, defaultdict as _dd
from pathlib import Path as _P

_by = {u["c"]: u for u in units}
L = cref


def cell(s):
    return str(s).replace("|", "\\|").replace("\n", " ")


def heading_path(u):
    parts = [p for p in (u["h2"], u["h3"], u["h4"]) if p]
    return " › ".join(parts) if parts else "(preamble)"


def orig(u):
    num = u["section"] or "preamble"
    return f"`{u['file']}:{u['line']}` §{num}"


def cs(*refs):
    return ", ".join(L(r, s) for r, s in refs)


N = len(units)
TODAY = "29 October 2026"

# ======================================================================================
# Duplication list
# ======================================================================================
DUPS = [
    ("D-1", "Dr. Mulu's public record (known example: 2.10.1 and 3.1.1)",
     [("evidence", "Hon. Dr. Benson Makali Mulu, PhD (Economics), CBS, has represented Kitui Central in the National Assembly since 2013 (Tier 1). He is a member of the Budget and Appropriations Committee (Tier 1), the committee that scrutinises the national estimates.\n```"),
      ("evidence", "Hon. Dr. Benson Makali Mulu, PhD (Economics), CBS, has represented Kitui Central in the National Assembly since 2013 (Tier 1). He is a member of the Budget and Appropriations Committee (Tier 1), the committee that scrutinises the national estimates. Whether"),
      ("evidence", "| Asset | Sourced Empirical Evidence |"),
      ("evidence", "**The NG-CDF record, and its limits.**"),
      ("strategy", "Parliamentary and professional records document"),
      ("strategy", "Dr. Mulu's technocratic and delivery credentials are backed by verified"),
      ("strategy", "Dr. Mulu's technocratic and delivery credentials are not abstract"),
      ("strategy", "*   **The National Budget Seat:**"),
      ("evidence", "title: \"Hon. Dr. Benson Makali Mulu\""),
      ("decision", "head: { label: \"Target\", text: \"40 ward-specific achievement briefs")],
     "Confirmed. 6.1 holds the record once: the 2.10.1 table is rewritten to carry every fact from 3.1 and 3.1.1 (PhD, Budget and Appropriations Committee, ESK, M&E Champion, UN roles, KSh 47m to {{record.bursary.recipients}} students, best-evaluated in the Eastern region FY2014/15 and first of 71, CBS, NG-CDF portal and FY2026/27 allocation), with each document still to be cited named against its line. The 5.3 candidate card and the 8.2 objective keep one clause and a cross-reference."),
    ("D-2", "Rapid response (known example: 6.2.1, Annex E.5, the pre-drafted lines in 4.5.6)",
     [("risks", "In a high-stakes gubernatorial campaign"),
      ("annex-runbooks", "label: \"Level 1\""),
      ("annex-runbooks", "To execute rapid containment without awaiting ad-hoc legal drafting"),
      ("workstreams-media", "| Likely attack | Response structure |"),
      ("annex-runbooks", "id: holding-positions"),
      ("annex-runbooks", "id: response-matrix"),
      ("annex-runbooks", "id: response-sla"),
      ("risks", "title: \"Rapid rebuttal — Level 3, 30-minute clock\"")],
     "Confirmed, and wider than listed: the four-tier decision tree (E.1), the response times (E.2), the holding positions (E.3) and the Level 3 clock (6.3.1) restate the same tiers. 20.2 carries the protocol once, in prose, and points to the runbooks; F.1/F.2/F.5 keep the tiers and times; the eight 4.5.6 lines merge into F.3 with the four holding positions (all twelve kept); 20.4 keeps the 30-minute manipulated-media clock and F.5's Level 3 row points to it."),
    ("D-3", "The pillar sets in 3.2 (known example: strategic, campaign, central-claim, content pillars, six themes)",
     [("strategy", "kind: crosswalk"),
      ("strategy", "preset: pillar"),
      ("strategy", "preset: message\nitems:\n  - title: \"Message Pillar 1"),
      ("strategy", "kind: matrix\ncolumns: [\"Production pillar\""),
      ("strategy", "preset: bucket"),
      ("strategy", "preset: theme"),
      ("annex-messages", "> **Re-cut against the production pillars in Section 3.7.**")],
     "Confirmed: five groupings (4 campaign pillars, 3 message pillars, 4 production pillars P1–P4, 4 content buckets A–D, 6 themes) under four different names, and three cross-references that point at the wrong one. 10.1 replaces them with one layered architecture: **one claim** (the Economist Governor) → **three pillars** (the message pillars; the crosswalk already maps campaign pillars 1+4 → MP1, 3 → MP2, 1+2 → MP3, so the four campaign pillars fold in without loss) → **six themes** (names here; evidence moves to Chapter 3) → **content types** (P1–P4, each absorbing its matching bucket's formats, tone and Kikamba working name). Every fact from all five is kept."),
    ("D-4", "\"Firefly publishes nothing on Dr. Mulu's accounts and holds no credentials\"",
     [("cover", "Firefly holds no publishing credentials"),
      ("decision", "**Firefly publishes nothing on Dr. Mulu's accounts and holds no credentials to them.** The one thing"),
      ("decision", "```lead\n**Firefly publishes nothing on Dr. Mulu's accounts and holds no credentials to them.** The only channel"),
      ("decision", "The digital operation separates operational software"),
      ("decision", "label: \"Publishing to Dr. Mulu's owned accounts\""),
      ("staffing", "title: \"**Strategy Director** (Firefly principal)\""),
      ("measurement", "| Channel | Operated by | Controller position to be confirmed |")],
     "Stated seven times (plus the 4.1.1 weekly rhythm). 13.2 states it once with the one exception (the offline layer); 13.3, 17 and 19.1 keep their functional uses (the boundary, the role's decision rights, the controller table) without restating the principle."),
    ("D-5", "\"One week and one export\"",
     [("decision", "**Firefly Management asks for one week and one export.** Firefly supplies"),
      ("decision", "Firefly would like one week and one export."),
      ("decision", "> **Firefly Management asks for one week and one export.**")],
     "Three statements under one section. 23 keeps the lead; the other two merge into it."),
    ("D-6", "The pool: {{pool.share}}% of the register where he has never held office",
     [("decision", "But the timeline is not the one the planning cycle assumes."),
      ("decision", "1.  **Q4 2026 Nomination Window (reported):**"),
      ("evidence", "**Five of the twelve largest wards lie where he has never held office.** The pool is"),
      ("evidence", "This represents **{{pool.share}}% of the entire Kitui County voter register**."),
      ("strategy", "Because **{{pool.share}}% of the county register sits where he has never held office** (Section 2.7), the campaign cannot"),
      ("strategy", "Because Section 2.7: {{pool.share}}% of the register lives where he has never held office"),
      ("measurement", "Section 2.7 establishes that **{{pool}} registered voters")],
     "The derivation lives once, in 6.2. Every other use becomes one clause with a cross-reference to 6.2."),
    ("D-7", "The digital ceiling (~{{reach.smartphone}} voters reachable online)",
     [("evidence", "If the campaign reached 100% of every internet-connected voter in Kitui County, it would reach about **{{reach.smartphone}} voters** (modelled), and even"),
      ("evidence", "> [!CRITICAL]"),
      ("strategy", "Because Section 2.9.3: digital alone reaches about"),
      ("workstreams-ground", "Put plainly: **a purely digital campaign in Kitui addresses roughly one in"),
      ("measurement", "Section 2.7 establishes that **{{pool}} registered voters")],
     "4.3 states the ceiling and its working once (the lead and the callout merge). 8.2, 12.2, 15.3 and 18.5 cite it."),
    ("D-8", "The winning benchmark ({{benchmark}})",
     [("evidence", "Governor Julius Malombe's certified 2022 winning total was {{result.2022.gov.malombe}} votes; this document rounds it"),
      ("evidence", "**Total Registered Electorate (July 2026, Tier 3, unconfirmed):**"),
      ("decision", "*   **Active Period (Clock):**")],
     "The benchmark and its July 2026 equivalent are derived once, in 2.5. The 2.1 stats card keeps the number and points to 2.5."),
    ("D-9", "Mwingi: \"necessary and not sufficient\"",
     [("evidence", "Mwingi North, Mwingi West and Mwingi Central together command {{bloc.mwingi}} registered voters (Tier 1), roughly"),
      ("evidence", "A key strategic finding emerges from this integrated database"),
      ("evidence", "#### Path A: The Northern Mwingi Triad")],
     "Lead and paragraph merge in 2.4; Path A in 2.5 keeps the arithmetic and drops its restated conclusion."),
    ("D-10", "The KSh 13.79bn envelope",
     [("evidence", "According to the approved Kitui County Fiscal Strategy Paper for FY2026/27, the total projected resource envelope is **KSh 13.79 billion**; the total"),
      ("evidence", "The county budget represents a significant administrative responsibility."),
      ("evidence", "The three parts sum to KSh 13.80 billion"),
      ("strategy", "According to the approved Kitui County Fiscal Strategy Paper for FY2026/27, the county executive commands"),
      ("strategy", "title: \"Fiscal accountability and devolution\""),
      ("strategy", "title: \"Fiscal Discipline and Verified Delivery\""),
      ("annex-spec", "title: \"Facebook\"")],
     "1.5 states the envelope, its parts and its tier once (Tier 3, CFSP); every other use cites the figure by token and points to 1.5. The tier is inconsistent today (Tier 1 in 3.1.2 and in the fiscal theme): see defect X-1."),
    ("D-11", "The audit findings and pending bills",
     [("strategy", "source: \"Office of the Auditor-General, Kitui County FY2023/24 audit report (Tier 1)\""),
      ("strategy", "Furthermore, Controller of Budget reports reveal"),
      ("annex-county", "According to the Office of the Auditor-General's FY2023/24 audit report, four critical financial queries must be addressed by the county administration (Tier 1):"),
      ("annex-county", "Additionally, Controller of Budget reports indicate"),
      ("strategy", "attack: \"*\\\"Dr. Mulu is a cold, distant"),
      ("strategy", "Kitui County Government audited accounts under both predecessor regimes")],
     "3.7 holds the four audit findings (as the bars visual, which replaces B.2's list), the KSh 1.3bn pending-bills figure (FY2020/21) and the 18% absorption rate once. 9.2 and 9.3 argue from them by cross-reference. Message Pillar 1's 'KSh 2.4bn' (a different measure) keeps its own year and scope note."),
    ("D-12", "Radio ownership and listenership",
     [("evidence", "**The highest-reach commercial radio stations broadcasting in Kikamba are owned"),
      ("evidence", "Vernacular radio is the primary medium of political consciousness"),
      ("evidence", "To ensure uninterrupted, high-credibility communication with the electorate"),
      ("evidence", "> **Research Integrity Note on Listenership Data:**"),
      ("evidence", "title: \"The three structural facts that drive the rest of this section\""),
      ("workstreams-media", "Kamba-language radio is the dominant information channel for the"),
      ("workstreams-media", "| Station | Kitui frequency |"),
      ("evidence", "title: \"Kikamba Vernacular Radio (The Decisive Broadcast Medium)\""),
      ("risks", "title: \"Broadcast Vernacular Radio Triage")],
     "The station table (which 2.9.2 says governs) moves into 4.2 with the three structural facts and the listenership note: one ownership map. 4.4, 11.2, 15.2 and 20.2 name stations by cross-reference. The station lists still disagree (Sang'u FM, Citizen Radio, Mwatu FM): conflict C7 stays marked."),
    ("D-13", "Bulk political SMS cannot be sent in Kikamba",
     [("workstreams-ground", "**Owner: Firefly, end to end.** **Bulk political SMS cannot be sent in Kikamba**"),
      ("workstreams-ground", "> ### Bulk political SMS cannot be sent in Kikamba"),
      ("strategy", "kind: donut\ntitle: \"Content mix for locally facing platforms\""),
      ("decision", "| Deliverable | Cadence | Produced by |")],
     "The rule and its consequences live once, in Workstream 9 (15.3); 12.4 states the channel consequence in one line. Conflict C2 (the language-map figure still lists Kikamba on bulk SMS) stays marked."),
    ("D-14", "The recognition-deficit hypothesis",
     [("evidence", "kind: hypothesis"),
      ("delivery", "**The strategic hypothesis being tested:**"),
      ("measurement", "The campaign tests the **\"Recognition-Deficit Hypothesis\"** on records that already exist: his own channel analytics, the IEBC's ward-level results, and what arrives unprompted on the line Firefly operates. Nothing is commissioned to test it.\n```"),
      ("measurement", "Before committing the campaign's broadcast and caravan effort"),
      ("strategy", "Phase −1 deliberately over-indexes on Mwingi")],
     "Stated once, in 7.1; 7.2 carries what would overturn it; 18.5 carries how it is tested; 14.1 and 12.1 cite it."),
    ("D-15", "Page or personal profile",
     [("decision", "title: \"4a. The Facebook asset is a Page"),
      ("delivery", "**The PhD is the one to fix first.** **Is the Facebook presence"),
      ("delivery", "A visible friends list suggests the latter."),
      ("measurement", "label: \"Confirm Page or profile\"")],
     "7.4 keeps the assumption and its risk; 14.3 keeps the consequences and the one-hour test; 18.5 keeps the method step."),
    ("D-16", "Hardware security keys",
     [("annex-runbooks", "**Hardware keys for the candidate and admins are non-negotiable and take very little.**\n```"),
      ("annex-runbooks", "label: \"**Hardware security keys (FIDO2)**"),
      ("annex-spec", "1.  **Mandatory Hardware Security Keys / 2FA:**")],
     "F.8 governs. G.4's 'YubiKey or Google Authenticator' contradicts it (an authenticator app is not a hardware key): corrected in E.1."),
    ("D-17", "The compliance sign-off gate",
     [("measurement", "**Before any voter-file-based targeting, list-building beyond first-party\n"),
      ("workstreams-data", "label: \"What the model scores, and why\""),
      ("measurement", "note: \"**Mandatory Action:**")],
     "19.2 holds the gate; 15.4 and 19.5 cite it."),
    ("D-18", "Dr. Kasalu's countywide result above the governor's tally",
     [("decision", "**Where the contest stands.**"),
      ("evidence", "title: \"Dr. Irene Kasalu\""),
      ("evidence", "Dr. Kasalu's strength, on the record, is a countywide seat"),
      ("annex-county", "*   **Dr. Irene Kasalu (Woman Representative):**")],
     "5.3 card states the result; 5.5 reads it; 7.2 uses it as the case against the hypothesis."),
    ("D-19", "The open seat (Article 180(7))",
     [("evidence", "Governor Malombe served as Governor from 2013 to 2017"),
      ("annex-county", "**Julius Malombe (Incumbent Governor):**")],
     "5.1 holds it; 5.5 keeps the audit-record citation."),
    ("D-20", "The rivals: cards in 2.6 and records in B.5",
     [("evidence", "preset: candidate\nitems:\n  - title: \"Charity Ngilu\""),
      ("annex-county", "*   **Dr. Irene Kasalu (Woman Representative):**")],
     "5.3 says who is in the field; 5.5 says which document each attribute rests on and the legal ground. Each line keeps its facts; the repetition between them is cut."),
    ("D-21", "Mobile-money agents ({{ict.agents}})",
     [("evidence", "label: \"mobile-money agents\""),
      ("evidence", "title: \"Mobile-Money (M-Pesa) Agent Network Strategy\""),
      ("workstreams-ground", "Kenya's registered mobile-money agents grew from")],
     "4.1 states the count; 4.4 the campaign's (out-of-scope) ambassador idea; 15.3 Firefly's distribution-only use. Two different uses, so both stay, with the figure stated once."),
    ("D-22", "Market days and sound-truck caravans",
     [("evidence", "title: \"Open-Air Market Day Barazas & Caravan Circuits\""),
      ("evidence", "title: \"Market Rotation Map\""),
      ("workstreams-ground", "title: \"Weekly Market Days & Caravan Circuits\"")],
     "4.4 keeps the rotation map; 15.3 keeps the field execution; the caravan description is stated once."),
    ("D-23", "Water evidence",
     [("evidence", "label: \"in poverty, 2021\""),
      ("strategy", "title: \"Water Security and Climate Resilience\""),
      ("strategy", "title: \"Message Pillar 3: Devolution Equity"),
      ("strategy", "title: \"Water scarcity\"")],
     "3.1 holds the water evidence (surface water, basic service, 30-minute access, broken water points, trekking distance, schools); 10.1 and 10.3 cite it. The new verified figures (safe drinking water 38.5%; piped 5.1%) join 3.1 with their definition stated."),
    ("D-24", "Poultry in over 90% of households",
     [("evidence", "label: \"of households keep poultry\""),
      ("strategy", "title: \"Economic Transformation\""),
      ("strategy", "title: \"Women and household income\"")],
     "Stated once in 3.2 (Food, farming and drought); others cite it."),
    ("D-25", "KSh 47m in bursaries to {{record.bursary.recipients}} students",
     [("strategy", "*   **Direct Local Investment (Educational Bursaries):**"),
      ("strategy", "title: \"Education\""),
      ("measurement", "title: \"NG-CDF and bursary beneficiary lists are off-limits")],
     "6.1 holds it (D-1); the 'KSh 47m' literal becomes a token (defect X-6)."),
    ("D-26", "Best-evaluated constituency in the Eastern region, FY2014/15",
     [("strategy", "*   **Certified Administrative Excellence:**"),
      ("strategy", "\"Water scarcity\""),
      ("workstreams-media", "| **\"He is a national MP, not a county manager\"** |")],
     "6.1 holds it with the evaluation report still to be cited; ten other mentions cite 6.1."),
    ("D-27", "Scope levels and the Level 2 recommendation",
     [("decision", "#### Level 1 — LEAN"),
      ("decision", "**Recommendation: Level 2 (Standard).**")],
     "'The one place this campaign cannot afford to be blind' appears in both; 21.1 keeps it once."),
    ("D-28", "Delegate primary",
     [("decision", "title: \"1. The Wiper ticket is decided"),
      ("risks", "If Wiper party leadership departs from the reported countywide selection and reverts to a delegate-based nomination primary, the campaign will immediately trigger its **Delegate Whip Contingency Plan**:"),
      ("evidence", "If it turns out to be wrong")],
     "5.4 holds the contingency; 7.4 keeps the assumption; 5.2 the trigger."),
    ("D-29", "The nomination window is a Tier 3 report",
     [("evidence", "The Wiper decision is expected in the final quarter of 2026"),
      ("evidence", "The Wiper flagbearer decision is expected to be settled"),
      ("evidence", "Section 1.2 opened with the claim this entire Phase"),
      ("evidence", "The strategic assumption that the Wiper Patriotic Front will select")],
     "Four statements in 2.5; 5.2 keeps one, with the verification test."),
    ("D-30", "Defamation and legal caution",
     [("risks", "The campaign enforces a disciplined **Rapid Response & Opposition Handling System**"),
      ("risks", "title: \"Rule 1: Focus on Public Audit Records"),
      ("annex-county", "The general election field is treated with strict legal caution.")],
     "20.3 holds the three rules; 5.5 the per-rival legal ground; 20.2 cites 20.3 (fixing its [CHECK REF])."),
    ("D-31", "Competitor monitoring tools",
     [("annex-runbooks", "label: \"Social monitoring dashboards\""),
      ("annex-runbooks", "| Tool | Function |"),
      ("risks", "Systematic, lawful, public-source tracking")],
     "20.5 the boundary; F.4 the tools (F.11's table merges into it)."),
    ("D-32", "Manipulated media and AI",
     [("risks", "**Context.** AI-generated video"),
      ("workstreams-platforms", "**Disclosure commitment.**"),
      ("annex-runbooks", "label: \"1. Fabricated audio of Dr. Mulu")],
     "20.4 the protocol; 15.1 the AI-use rule; 19.3 clause 2; F.6 the drill. Functional, not repeated prose: kept, cross-referenced."),
    ("D-33", "Consent and purchased lists",
     [("workstreams-ground", "**Consent-first architecture.**"),
      ("measurement", "**The commercial reality this creates.**"),
      ("annex-spec", "**Explicitly excluded:** purchased third-party contact lists")],
     "19.2 states the rule and its basis; 15.3 and E.2 cite it."),
    ("D-34", "Deleting data within 90 days",
     [("delivery", "- Data deletion executed within **90 days**"),
      ("measurement", "> ### DIGITAL ETHICS & DATA CHARTER")],
     "The charter clause (19.3, keep-marked) governs; 14.8 cites it."),
    ("D-35", "\"Firefly adds three people\" and the single counterpart",
     [("staffing", "Two teams, one interface. The brief is the interface.\n"),
      ("staffing", "=**Firefly adds three people. It removes none.**"),
      ("staffing", "**A single campaign-side counterpart is required.**"),
      ("staffing", "1.  **Decisions in one place.**")],
     "Chapter 17 says each once."),
    ("D-36", "Drought and IPC phase",
     [("evidence", "title: \"Natural Hazards and NDMA Early-Warning Context\""),
      ("annex-county", "The county's climate profile features multi-directional hazards")],
     "Both move to 3.2 and merge."),
    ("D-37", "Diaspora registration, 12 to 26 countries",
     [("delivery", "Diaspora webinars every three weeks"),
      ("delivery", "the expansion of diaspora registration from 12 to 26 countries"),
      ("annex-messages", "| **Diaspora Kitui Voters** |")],
     "Unsourced in all three (defect X-6). Needs a source and a token; stated once, in 11.2."),
    ("D-38", "The service-delivery tracker described three ways",
     [("workstreams-platforms", "A simple public tool through which any Kitui resident"),
      ("workstreams-platforms", "The campaign builds and maintains the **Kitui County Service-Delivery Performance Tracker**"),
      ("annex-spec", "##### 1. SMS / USSD Telecommunications Gateway")],
     "Conflict C5 (three scopes) stays marked; the descriptions sit together in 15.1.1 so the author can settle it in one place."),
    ("D-39", "Kitui Central's own MP contest",
     [("decision", "head: { label: \"Target\", text: \"Reach and engagement in Kitui Central"),
      ("evidence", "**Kitui Central will be fighting its own contest.** Stephen Kilonzo")],
     "6.3 holds it; 8.2 cites it."),
    ("D-40", "The twelve largest wards",
     [("evidence", "title: \"Critical Concentration Insights\""),
      ("evidence", "#### Path C: The \"Top 12 Megawards\" Coalition"),
      ("evidence", "1.  **Mwingi North:** Kyuso (#1 countywide")],
     "2.3 states them; 2.5 (Path C) and 6.2 (the five in the pool) use them."),
    ("D-41", "\"Kitui has resources. What it has lacked is leadership…\"",
     [("strategy", "attack: \"*\\\"Dr. Mulu is a cold, distant"),
      ("strategy", "Underlying narrative throughout:"),
      ("strategy", "**The incumbent's slogan already claims resources.**")],
     "9.1 holds the line; 10.2 keeps the nomination-window rule on using only its verification half."),
    ("D-42", "\"The mission is for Kitui to prosper. From Poverty to Wealth Creation.\"",
     [("strategy", "**\"The mission is for Kitui to prosper. From Poverty to Wealth Creation.\"** That is Dr. Mulu's own cover line"),
      ("strategy", "**\"The mission is for Kitui to prosper. From Poverty to Wealth Creation.\"** That is Dr. Mulu's own\ncover line"),
      ("strategy", "*\"The mission is for Kitui to prosper. From Poverty to Wealth Creation.\"* That line is already on")],
     "Quoted once, in 10.1."),
    ("D-43", "Turnout: certified valid votes against modelled ballots (C8)",
     [("evidence", "label: \"registered voters, 2022\""),
      ("evidence", "**Total Registered Electorate (July 2026, Tier 3, unconfirmed):**"),
      ("strategy", "kind: nested\nnote: \"**Two of these sizes are deliberately not stated.**\"")],
     "2.1 states the base of each figure (governor valid votes ÷ register = 61.7%; presidential ≈62% including rejected ballots). C8 stays marked."),
    ("D-44", "Leads that repeat the paragraph beneath them word for word",
     [], "A systematic pattern, not one passage: {auto_leads} leads (listed in the map as 'Merged with', note 'Lead repeats…'). Each chapter keeps the lead as its answer-first line and cuts the repetition from the paragraph, or the reverse where the paragraph carries more."),
]

auto_leads = [c for c, p in plan.items() if isinstance(p["t"], tuple) and _by[c]["kind"] == "lead"]

# ======================================================================================
# Defects that need a C-number
# ======================================================================================
STALE = [
    (("strategy", "Four pillars, extended from the original three."), "Section 3.5 (message pillars), 4.5.2 (content buckets), 3.7 (production pillars)", "Message pillars are 3.2.2; buckets and production pillars are 3.2.3; 3.7 is the week calendar."),
    (("strategy", "These are the **production pillars**"), "Section 3.5", "Message pillars are 3.2.2."),
    (("strategy", "> **Section 3.7 is the live version of this list.**"), "Section 3.7", "Production pillars are 3.2.3."),
    (("strategy", "**Each segment carries the production pillar that commissions for it** (Section 3.7), so the\nsegmentation"), "Section 3.7", "Production pillars are 3.2.3."),
    (("annex-messages", "> **Re-cut against the production pillars in Section 3.7.**"), "Section 3.7", "Production pillars are 3.2.3."),
    (("decision", "label: \"The scope\""), "Section 4.1.2 (cadence); Section 6 (conditions)", "The rhythm is 4.1.1 (4.1.2 is the RACI table); the conditions are 1.7 (Section 6 is risks)."),
    (("evidence", "Section 1.2 opened with the claim this entire Phase"), "Section 1.2", "1.2 does not state the claim; it is assumption 1 in 1.8."),
    (("decision", "label: \"sign-language interpretation on flagship content depends"), "Section 1.7", "1.7's nine dependencies do not include the sign-language provider (1.8 assumption 4 does)."),
    (("workstreams-media", "> **Owner: your team, to a Firefly brief.** Read every"), "Section 4.1.3 'marks it open'", "4.1.3 says the recommendation was approved in September 2026."),
    (("strategy", "title: \"Verification and follow-through\""), "Section 4.5.14 'quarterly evidence cadence'", "4.5.14 has no quarterly evidence cadence."),
    (("decision", "Firefly supplies that layer in the three steps"), "Section 4.2.1 'specifies exactly what Week 1 measures'", "The measurement set is 5.2.1–5.2.4; 4.2.1 is the four-week plan. Same pattern in 1.1 (C17), 1.3.4, 1.8, A.1.4."),
]

OTHER = [
    ("X-1", "Tier of the KSh 13.79bn envelope and the KSh 1.339bn own-source revenue is inconsistent", [("strategy", "According to the approved Kitui County Fiscal Strategy Paper for FY2026/27, the county executive commands"), ("strategy", "title: \"Fiscal Discipline and Verified Delivery\"")], "Tier 1 in 3.1.2 and in the fiscal theme; Tier 3 in 2.8.2 and in `lib/data/figures.ts` (`budget.total`, `budget.osr.revised`). Corrected to Tier 3."),
    ("X-2", "A population-density token is used as a percentage", [("annex-messages", "> **These segments overlap, and the percentages are shares of the register")], "'The shares therefore sum to about {{sub.kitui-west.density}}%': a density value printed as a sum of shares. Either the sum is sourced and tokenised, or the clause is cut."),
    ("X-3", "Assumption 2 is fused into assumption 1", [("decision", "title: \"1. The Wiper ticket is decided")], "Card 1's body runs on into '2. <window-chip> That is the window…'. The list also runs 1, (2), 3, 4, 4a, 4b, 4c, 4d, 5, 6, 7. Split and renumber 1–11."),
    ("X-4", "The first four weeks run to Week 8; Phase 0 'Weeks 4–10' lists Weeks 1–8 tasks; ward champions recruited in 15 wards (Weeks 6–8) or 40 (Weeks 7–8)", [("delivery", "label: \"the presence audit (immediate)\""), ("delivery", "title: \"Activities\"\nitems:\n  - when: \"Weeks 1–2\"")], "Known since the October restructure (OPEN-ITEMS §3); still undecided. 14.1 is titled 'The first four weeks' in your table of contents; I propose keeping the title and moving Weeks 6–8 into 14.2, but that changes the plan's content, so it is your call."),
    ("X-5", "The data-governance owner is named three ways", [("workstreams-data", "A **single named data-governance owner** is accountable"), ("staffing", "title: \"**Analyst**\""), ("staffing", "| **Data Analyst / Modeller** |")], "Digital Director at lean tier / Data Analyst from standard (15.4); the Analyst, for the audit scope (4.6.2); the Data Analyst/Modeller (4.6.3)."),
    ("X-7", "Role names that the team chapter never defines", [("annex-runbooks", "label: \"Level 1\""), ("decision", "head: { label: \"Target\", text: \"At least {{pool.share}}%")], "'Digital Director' (E.5, E.8, E.10, 4.5.14, 4.5.6 Tier A), 'Director of Communications', 'Policy and Communications Research Lead', 'Campaign Field Operations Lead', 'Database and Ground Mobilization Coordinator', 'Campaign Communications Director', 'Firefly Director' (D.1), 'Paid Media & Analytics Manager' (4.5.14). 4.6 defines only Strategy Director, Analyst and Offline-layer Operator plus five surge roles. The 2026-09 change log raised this (§7 Q4) and it was never settled."),
    ("X-8", "Level 1 has a two-person Firefly team; 4.6 says the three-person core is named at every level", [("decision", "* **Firefly team:** Strategy Director + Analyst"), ("staffing", "*   **The 3-person Firefly core** named at every engagement level")], ""),
    ("X-9", "'Six core software components', five listed", [("annex-spec", "This section specifies the six core software components")], "Known (OPEN-ITEMS §3)."),
    ("X-10", "HTML entities in the source", [("workstreams-media", "**Standing press kit**"), ("workstreams-platforms", "| Site load time on simulated 3G |")], "`M&amp;E` and `&lt; 3 seconds`."),
    ("X-11", "Missing space between sentences", [("evidence", "Governor Malombe served as Governor from 2013 to 2017")], "'…throughout.The Auditor-General's…'."),
    ("X-12", "Orphan line and a lead placed mid-section", [("strategy", "Effort and content allocation across zones, by phase."), ("strategy", "**Until the six are assigned, the Phase −1 weighting governs only the three zones")], ""),
    ("X-13", "Dangling list introduction", [("strategy", "* **Kikamba** — deep local resonance")], "'Working examples, all requiring native-speaker verification before publication:' is followed by the Kiswahili bullet; the examples are the proverb cards further down."),
    ("X-14", "A heading over one sentence", [("evidence", "#### Platform Sizing & Realistic In-County Reach")], ""),
    ("X-15", "Timeline item with no 'when'", [("delivery", "label: \"Service-delivery tracker built and tested (Section 4.5.1)\"")], "Last item of the Phase 0 timeline."),
    ("X-16", "Annex E.6 scenarios run 1–5, 7", [("annex-runbooks", "title: \"Standing scenario library\"")], "Known (OPEN-ITEMS §3)."),
    ("X-17", "Annex E jumps from E.10 to E.12", [("annex-runbooks", "## E.12 Competitive intelligence outputs")], "E.11 was folded into E.12 earlier; the number was kept. Renumbered F.1–F.11."),
    ("X-18", "The cover counts the old structure", [("cover", "the order of the six sections and six annexes")], "There are six Parts and seven annexes today; the new structure has six Parts and eight annexes."),
    ("X-19", "Dates that have aged", [("cover", "**Date:** September 2026"), ("measurement", "**Ninety days: 18 June to 16 September 2026.** Two reasons"), ("decision", "THE WINDOW, NOT THE DEADLINE")], f"Today is {TODAY}. The cover says September 2026; the audit window ended 16 September; the box says the window 'opens in late October', which is now. These are the author's dates (OPEN-ITEMS §5); I will not change them without your instruction."),
]

# ======================================================================================
# Verified-data comparison (from the brief's table)
# ======================================================================================
VERIFIED = [
    ("Population, 2019", "1,136,187 (549,003 m; 587,151 f; 33 intersex)", "`census.population` 1,136,187; `census.male` 549,003; `census.female` 587,151 (T1). Intersex 33 is a literal in 2.8.1.", "Matches. The wrong 1,136,761 appears nowhere. Add `census.intersex` (33) as a token."),
    ("Households, 2019", "262,942 (4.3 people)", "`census.households` 262,942 (T1); 4.3 is a literal", "Matches. Add `census.household-size` (4.3)."),
    ("Area and density", "≈30,430 km²; 37/km²", "`census.area` 30,430 (T1); 37 is a literal; 'national average of 82' is an untokenised, unsourced literal", "Matches. Add `census.density` (37); source or cut the national 82."),
    ("Median age", "17 years (T2)", "Not on the site", "New token `census.median-age` (T2, KNBS 2019 via Stats Kenya). Age bands: [VERIFY] against KNBS Census Vol. III."),
    ("Urban share", "[VERIFY]; draft 14.9% unsourced; secondary ≈86% rural", "`census.rural.share` 95.2% and `census.urban.share` 4.8% (T1, CENSUS), with `census.rural` 1,082,168 and `census.urban` 54,019; used in 2.8.1, 3.4.2 segment sizes and C.1", "**Conflict.** The site's 95.2/4.8 is marked T1 but your table says no source settles the urban share and secondary sources put rural near 86%. Needs a decision: re-source 95.2/4.8 to KNBS Vol. II, or mark both [VERIFY] (which also unsizes the rural and urban segments in 11.2)."),
    ("Administrative units", "8 constituencies, 40 wards, 18 sub-counties; 247 = villages", "8, 40 and 18 are literals throughout; '247' appears nowhere", "Matches. 1.4 states villages only once the CIDP 2023–2027 confirms 247."),
    ("Poverty", "Keep 55.2% (KNBS 2021); 58.3% (2022) [VERIFY]; 48.0% history only", "`poverty.2021` 55.2% (T1); NDMA's 60.4% and 63.1% (T2) shown as other bases; 48.0% appears nowhere", "Matches. 58.3% added as a [VERIFY] note under 1.3, not used."),
    ("Electricity", "17.2% of households (2019), from 4.8% (2009)", "Not on the site", "New tokens (T2, KNBS 2019 via Stats Kenya) in 1.3. National comparison [VERIFY]."),
    ("Safe drinking water", "38.5% of households (2019); piped 5.1%", "Not on the site; the site has 21% with at least a basic service (KDHS 2022, T1, literal), ~400,000 on surface water (T1) and the 30-minute measures (T1)", "New tokens (T2) in 3.1 with the measure named; the 21% KDHS figure is a different measure and stays, labelled. The draft's 53.2% appears nowhere."),
    ("Literacy", "[VERIFY]; draft 56.3%/87.4% unsourced", "The draft figures appear nowhere. `edu.literacy.men/women` (99.3%/94.8%, ages 15–49, T1, GDS) exist in figures.ts and are not in prose; G.5 has an `area_literacy_rate` variable", "No change to prose. Nothing published until sourced."),
    ("2022 presidential, Kitui", "Odinga 235,400 (70.82%); Ruto 89,419 (26.90%); Wajackoyah 2,838; Mwaure 1,446; rejected 3,306; registered 532,758; turnout ≈62% (T2)", "Not on the site", "New tokens (T2, Equal Politics aggregation of IEBC results; T1 is Form 34B/34C) in 2.2."),
    ("Turnout base", "Say which base each number uses", "`turnout.2022` 61.7% = 328,760 governor valid votes ÷ 532,758 (note in figures.ts); prose says 'certified turnout'", "Corrected: 2.1 states both bases."),
    ("2022 governor", "Malombe 198,004 (60.23%); Musila 117,606 (35.77%); of 328,760", "Same (T1, Form 37C)", "Matches."),
    ("2017 governor, 2022 senate, woman rep, Kitui Central MP", "Keep the site's figures and tiers; 2013 a named gap", "As stated", "No change."),
    ("County budget FY2026/27", "Keep CFSP KSh 13.79bn (T3); ADP 14.27bn unconfirmed; label the document; budget unapproved after 30 June 2026", "`budget.total` 13.79bn (T3, CFSP); 14.27bn appears nowhere; prose calls the Paper 'approved' and in two places Tier 1", "Corrected: label CFSP, tier T3 everywhere, add the unapproved-budget note (The Star, 6 July 2026) as a new T2 citation."),
    ("CIDP 2023–2027", "Priority sectors and count [VERIFY]", "'CIDP III' cited once, for an untiered 61% water figure", "1.5 names the CIDP; no sector count published until confirmed."),
]

# ======================================================================================
# Write inventory.md
# ======================================================================================
o = []
w = o.append
w("# Restructure, November 2026 — Step 0: inventory, duplication and defects")
w("")
w(f"Prepared {TODAY}, before any rewriting. Nothing in `content/`, `lib/` or `public/` has been changed.")
w("")
w("## How this was built")
w("")
w("Every unit was numbered by a parser, not by hand, so the count is exact and repeatable. The parser reads the 19 files in `content/` in reading order (`FLOW_ORDER`) and makes one unit of each:")
w("")
w("- heading (`##` to `#####`); lead, visual, figure and textversion fence; table; list; callout (blockquote); paragraph.")
w("- Blank lines, `---` rules and `<!-- keep -->` markers are not units. A keep marker is recorded on the unit it protects (column *Keep*), because it means that unit's wording is fixed.")
w("")
w("The *Description* column is the unit's first ten words (for fences, the component and its first label), so it can be checked against the file at the line given. *Anchor* is the unit's own heading id where it has one, otherwise the id of the numbered heading it sits under: that is the id an old link to it uses today. Only numbered `##` and `###` headings carry ids.")
w("")
kc = _C(u["kind"] for u in units)
fc = _C(u["route"] for u in units)
w(f"**Totals:** {N} units; {sum(1 for u in units if u.get('hid'))} live heading ids; {sum(1 for u in units if u['keep'])} keep-marked units.")
w("")
w("| Unit kind | Count |  | File | Units |")
w("|---|---:|---|---|---:|")
ks, fs = list(kc.most_common()), list(fc.items())
for i in range(max(len(ks), len(fs))):
    a = ks[i] if i < len(ks) else ("", "")
    b = fs[i] if i < len(fs) else ("", "")
    w(f"| {a[0]} | {a[1]} |  | {('content/' + b[0] + '.md') if b[0] else ''} | {b[1]} |")
w("")
w("## 1. Content inventory")
w("")
w("| C | File:line | Current heading | Anchor | Unit | Keep | Description |")
w("|---|---|---|---|---|---|---|")
for u in units:
    anchor = f"**{u['hid']}**" if u.get("hid") else (u["anchor"] or "—")
    kind = u["kind"] + (f" `{u.get('vkind')}`" if u.get("vkind") else "") + (f" `{u.get('fig')}`" if u.get("fig") else "")
    w(f"| {u['c']} | {u['file'].replace('content/', '')}:{u['line']} | {cell(heading_path(u))} | {anchor} | {kind} | {'keep' if u['keep'] else ''} | {cell(u['desc'])} |")
w("")
w("## 2. Duplication list")
w("")
w("Units that say the same thing in more than one place. The three known examples are D-1, D-2 and D-3; all three are confirmed. The proposed resolution is the draft treatment in the reorganisation map; nothing is merged until you approve.")
w("")
for did, title, refs, res in DUPS:
    res = res.replace("{auto_leads}", str(len(auto_leads)))
    w(f"### {did} {title}")
    w("")
    if refs:
        w("**Units:** " + ", ".join(f"{L(r, s)} ({_by[L(r, s)]['route']}:{_by[L(r, s)]['line']})" for r, s in refs if L(r, s) in _by))
        w("")
    else:
        w("**Units:** " + ", ".join(auto_leads))
        w("")
    w(f"**Resolution proposed:** {res}")
    w("")
w("### Automatic sweep")
w("")
w(f"A text-similarity pass over every paragraph, lead, list and callout longer than 80 characters found {len(near)} pairs that open with the same 60 characters or match above 80%. All of them are covered by an entry above:")
w("")
w(", ".join(f"{a}≈{b}" for a, b, _ in near))
w("")
w("## 3. Defect list")
w("")
w("### 3.1 Leftover markers")
w("")
w("| Marker | Count | Units |")
w("|---|---:|---|")
for k in sorted(markers):
    v = markers[k]
    items = ", ".join(c + " (" + f.replace("content/", "") + ":" + str(l) + ")" for c, f, l in v)
    w(f"| {cell(k)} | {len(v)} | {items} |")
w("")
w("The eight `[CONFLICT Cn]` markers are author decisions recorded in `docs/restructure-2026-10/OPEN-ITEMS.md` §1 (language mix C1; Kikamba on bulk SMS C2; workstream counts C3; who manages the owned platforms C4; the tracker's scope C5; the Ward Equalization Fund C6; the station lists C7; valid votes against modelled ballots C8). The restructure moves each marker with its text and does not settle them unless you tell me to. The `[CHECK REF]` markers are fixed in the map (each new target is in the unit's note). The shortcode, `[VERIFY whether in force]` and counsel placeholders are contracting items and stay.")
w("")
w("### 3.2 Cross-references")
w("")
w(f"**Pointing at no heading at all ({len(bad_refs)}):**")
w("")
w("| C | Where | Cites | Context |")
w("|---|---|---|---|")
for c, f, l, g, ctx in bad_refs:
    w(f"| {c} | {f.replace('content/', '')}:{l} | {g} | {cell(ctx)} |")
w("")
w("**Pointing at a heading that exists but holds something else** (a link that resolves and lands on the wrong text; the eleven `[CHECK REF]`s above are the same failure, already flagged):")
w("")
w("| C | Cites | What is actually there |")
w("|---|---|---|")
for ref, cites, why in STALE:
    c = L(*ref)
    w(f"| {c} | {cell(cites)} | {cell(why)} |")
w("")
w("Every cross-reference is renumbered in the restructure in any case. The old numbers are gone, so each reference is rewritten to its new chapter.section, which fixes all of these as a by-product.")
w("")
w("### 3.3 Numbering")
w("")
w("- **Annex E jumps from E.10 to E.12** (X-17). Renumbered F.1–F.11.")
w("- **E.6 scenarios run 1, 2, 3, 4, 5, 7** (X-16). Renumbered 1–6.")
w("- **1.8 assumptions run 1, (2 fused into 1), 3, 4, 4a, 4b, 4c, 4d, 5, 6, 7** (X-3).")
w("- **Staffing is numbered 4.6 after the workstreams, and all four workstream routes carry the same number, 4.5** (`lib/heading-slug.ts` SECTIONS). Part 4 runs 4.1–4.4 in `delivery.md`, then 4.5 across four files, then 4.6. In the new structure the team is Chapter 17 and the workstreams Chapter 15 with 15.1–15.4.")
w("- **The cover counts six sections and six annexes** (X-18); `FLOW_ACTS` has seven movements; the site has six Parts and seven annexes.")
w("- **G.4 promises six components and lists five** (X-9).")
w("- **One Phase 0 timeline item has no week** (X-15).")
w("")
w("### 3.4 How the candidate is named")
w("")
w("House style: full name and honours on the cover only (*Hon. Dr. Benson Makali Mulu, PhD, CBS*); *Dr. Makali Mulu* at first mention in each chapter; *Dr. Mulu* thereafter.")
w("")
w("| Form | Uses | Where |")
w("|---|---:|---|")
for label, total, where in name_counts:
    w(f"| {label} | {total} | {cell(where)} |")
w("")
w("Off-style today: the full name with honours appears outside the cover (2.6.1 card, 2.10.1 lead and paragraph); 'Dr. Benson Makali Mulu' (2.7.1); the cover and 2.10.1 say 'PhD (Economics), CBS' where the house form is 'PhD, CBS'. 'Dr. Mulu' is often the first mention in a section that will become a chapter opening. In the rewrite every chapter's first mention becomes 'Dr. Makali Mulu'. Proper uses that stay as they are: the handle `@MakaliMulu`, search keywords ('Makali Mulu', 'Dr. Makali Mulu' in Google Alerts and listening feeds), and the radio-script voiceover.")
w("")
w("### 3.5 Against the verified data (checked 29 October 2026)")
w("")
w("| Data point | Verified | On the site today | Finding |")
w("|---|---|---|---|")
for row in VERIFIED:
    w("| " + " | ".join(cell(x) for x in row) + " |")
w("")
w("### 3.6 Numbers written into prose")
w("")
w(f"`scripts/check-figures.ts` fails on bare literals of three or more digits, so none exists. Shorter data figures pass the guard and sit in prose untokenised: percentages, KSh amounts in millions and billions, densities and distances. {len(literals)} units carry at least one. Each becomes a token in `lib/data/figures.ts` (with source, tier and date) or, where no source exists, is marked [VERIFY] with the record that would settle it. Literals that are rules rather than data (2% opt-out, 1.5% CTR, 30% testing, 50/30/20 mix) are listed too, because some are targets that already have tokens and some are design choices that should say so.")
w("")
w("| C | File:line | Literals |")
w("|---|---|---|")
for c, f, l, found in literals:
    w(f"| {c} | {f.replace('content/', '')}:{l} | {cell('; '.join(found))} |")
w("")
w("### 3.7 Other defects")
w("")
for xid, title, refs, detail in OTHER:
    w(f"- **{xid} {title}.** {', '.join(L(r, s) for r, s in refs)}. {detail}")
w("- **X-6 Unsourced or untiered figures in prose.** Besides 3.6: KSh 47m bursaries (no token); 'national average of 82' persons/km²; 21% basic drinking-water service; 7.2 km trekking distance; 72.5% food share of spending; 'diaspora registration from 12 to 26 countries' (no source anywhere); 84 solar boreholes (inventory to be supplied); the 61% CIDP water figure; KSh 85/kg and KSh 40 farm-gate prices; 17.4% completed secondary (already labelled 'not yet tiered').")
w("- **X-20 Headings and labels in internal jargon** (house style): 'Critical Concentration Insights', 'Analytical Hierarchy', 'The \"Big 4\" Electorate Engine', 'Sourced Empirical Evidence', 'Strategic Digital Application', 'Total Decisive Deficit Pool', 'The Defining Digital and Telecommunications Constraints (CA/KNBS Sourced)', 'Sourced Revenue Envelope', 'Platform Sizing & Realistic In-County Reach', 'Natural Hazards and NDMA Early-Warning Context', 'Linguistic Rules of Engagement', 'Key Architecture Principles', 'Mandatory Compliance Safeguards', 'Dual Operational Function', and the coined system names ('Closed-Loop Ground-Digital Integration Engine', 'Tri-Partite Metadata Mandate', 'Four-Step Conflict Resolution Protocol', 'Delegate Whip Contingency Plan', 'Evidence-First Pitch Engine', 'Trilingual Content Architecture', 'Translation & Quality-Control Gateway', '4-Step Governance Gateway', '7-Day Production Cadence', 'Three-Tier Escalation Hierarchy', 'Rapid Response & Opposition Handling System', 'Lean Core Delivery Model', 'The Out-of-County Kamba Diaspora Matrix'). Some of these names are also figure titles in `lib/figures`/`lib/register`, which the rewrite has to change in step.")
w("- **X-21 Unearned adjectives and banned phrasing** (house style), counted in `content/`: 'empirical' 12, 'decisive' 10, 'outstanding' 4, 'unprecedented' 2 (both with an 80% beside them, so they may stay), 'robust' 2, 'leverage/leveraging' 3, and one each of 'surgical', 'pristine', 'irrefutable', 'infallible', 'immense', 'crippled', 'in strict adherence'. Also 'mathematically impossible', 'absolute, non-negotiable arithmetic necessity', '100% transparent' bursary formula (no source).")
w("- **X-22 The generated copy.** `public/content/*.md` differs from `content/` in 16 files. That is by design: `scripts/build-content.ts` writes `public/content` from `content` with every token resolved and every visual compiled to JSON, so 'must match' means 'regenerated by `npm run content`', not 'identical'. `build-content --check` could not run here because `node_modules` is not installed; `build-anchors --check` passes (176 live headings, 1,546 redirects, 0 orphans). I will run `npm ci` before Step 2.")
w("- **X-23 Opinion polling.** None found. The house rule holds today.")
w("")
w("## 4. What the restructure touches outside `content/`")
w("")
w("So you can see the size of Step 2 before approving it:")
w("")
w("- `lib/heading-slug.ts` (SECTIONS, PARTS, TabId), `lib/flow.ts` (FLOW_ORDER, FLOW_ACTS), `lib/content-files.ts`: rebuilt to the new table of contents.")
w("- `lib/anchors/`: a new `restructure-2026-11.json` moves file (old id → new id for all 176 live ids, plus every existing redirect key re-pointed), and `scripts/build-anchors.ts` reads it first, as it does the October file. The draft id table is in the reorganisation map.")
w("- Components that mount on a heading (`HEADING_INSERTS`, `scripts/verify-mounts.mjs`), `lib/collapse-groups.ts`, `lib/section-heights.ts`, `lib/part-visuals.ts`, and the cover spine figure (`lib/register/specs/s0-cover.ts`) all name sections by id or number and move with them.")
w("- The guards in `npm run verify` that pin the current text (`check:content` against base `8f10cb9`, the evidence ledger, `find-duplicates`, `visual-coverage`): their baselines move to the restructure commit, logged, as the October restructure did.")
_P(OUTDIR / "inventory.md").write_text("\n".join(o) + "\n")

# ======================================================================================
# Write reorganisation-map.md (draft)
# ======================================================================================
o = []
w = o.append
w("# Reorganisation map — DRAFT for approval")
w("")
w(f"Step 0 draft, {TODAY}. Every C-number in `inventory.md` appears once below with its proposed new home and treatment. The final map, written after the rewrite, replaces this file and records what was actually done.")
w("")
w("Treatments: **Retained** (wording kept; includes all keep-marked text) · **Reworded** (house style; every fact kept) · **Moved** (component or table carried as is to a new place) · **Merged with Cx** (Cx is the surviving passage; every fact from this unit goes into it) · **Corrected** (conflicts with verified data or the record; a source-conflict note is added) · **Replaced by visual** (an existing visual already carries the meaning in full).")
w("")
w("## 1. Proposed routes")
w("")
w("One file and route per chapter, so a chapter is a unit of argument and a link target. Chapter 15 stays as the four routes it is today, because its 64 KB would be the heaviest page on the site (the reason it was split in September). Annex routes that keep their meaning keep their names, so old links that already resolve keep resolving: `annex-evidence` (A), `annex-county` (B, now the register only), `annex-runbooks` (F, the former E), `annex-terms` (G, the former F). Annexes whose letter now means something else get new names, so an old `#annex-messages-…` link cannot land on the playbooks.")
w("")
w("| Part | Chapter | Route | File |")
w("|---|---|---|---|")
parts = {"1": "I", "5": "II", "8": "III", "13": "IV", "18": "V", "21": "VI"}
cur = ""
w("| — | Cover | cover | cover.md |")
w("| — | In brief | brief | brief.md (new) |")
for ch in [str(i) for i in range(1, 24)]:
    if ch in parts:
        cur = parts[ch]
    if ch == "15":
        for k, r in [("15.1", "workstreams-platforms"), ("15.2", "workstreams-media"), ("15.3", "workstreams-ground"), ("15.4", "workstreams-data")]:
            w(f"| {cur} | {k} {NEW_TOC[k]} | {r} | {r}.md |")
        continue
    r = route_of(ch)
    w(f"| {cur} | {ch} {NEW_TOC[ch]} | {r} | {r}.md |")
for a in "ABCDEFGH":
    r = route_of(a)
    w(f"| Annexes | {NEW_TOC[a]} | {r} | {r}.md{' (new)' if r in ('annex-playbooks', 'annex-volunteers', 'annex-technology', 'annex-glossary') else ''} |")
w("")
w("## 2. Every unit")
w("")
w("| C | Original location | New location (chapter.section) | Treatment | Note |")
w("|---|---|---|---|---|")
for u in units:
    p = plan[u["c"]]
    w(f"| {u['c']} | {orig(u)} | {cell(loc_label(p['loc']))} | {cell(tlabel(p['t']))} | {cell(p['note'])} |")
w("")
w("## 3. The new table of contents, filled")
w("")
w("What lands in each new section. Sections with no existing content are written only from the verified data, or carry the 'no verified figure' line naming the record that would settle it.")
w("")
land = _dd(list)
for u in units:
    land[plan[u["c"]]["loc"]].append(u["c"])


def order_key(k):
    if k in ("Cover",):
        return (0,)
    if k == "In brief":
        return (1,)
    head = k.split(".")[0]
    if head.isdigit():
        return (2, int(head)) + tuple(int(x) for x in k.split(".")[1:])
    return (3, ord(head)) + tuple(int(x) for x in k.split(".")[1:] if x.isdigit())


keys = set(land) | {k for k in NEW_TOC if k not in ("I", "II", "III", "IV", "V", "VI", "Annexes")}
NEW_ONLY = {
    "In brief": "New: ≤150 words built only from claims made elsewhere (county, arithmetic, position, plan, ask).",
    "1.3": "Gains electricity 17.2% (2019, from 4.8% in 2009, T2) and safe drinking water 38.5% / piped 5.1% (2019, T2), measure named.",
    "1.4": "Constituencies, wards and sub-counties from existing literals; villages (247) only once the CIDP 2023–2027 confirms the count.",
    "2.2": "Gains the 2022 presidential result in Kitui (T2).",
    "3.3": "Health evidence moves in from the six themes (insurance, stunting, facility births, access, outbreaks).",
    "3.4": "Existing evidence: roads graded (scorecard), feeder roads, the March 2026 floods. Otherwise: 'No verified figure is available yet; the record that would settle it is the county's roads inventory in the CIDP 2023–2027 and KeRRA/KURA data.'",
    "3.5": "Youth and education evidence from the themes (no education, secondary attendance, school meals); no verified youth unemployment figure: the record that would settle it is the KNBS Quarterly Labour Force Report county table.",
    "3.6": "Existing evidence: food takes 72.5% of household spending (to be tokenised), maize and goat prices against five-year averages, clean cooking fuel. The cost-of-living concern otherwise carries the 'no verified figure' line naming KNBS county CPI.",
    "7.2": "The 'against' and 'test' halves of the 2.12 hypothesis, and a cross-reference to 18.5 and 12.7.",
    "10.4": "Annex C, framed as a demonstration of what Firefly would hand the team.",
    "A.2": "New: the full source table (data point, figure, source, year, tier, link) generated from `lib/data/figures.ts`.",
    "H": "New: CIDP, ADP, CFSP, equitable share, own-source revenue, NG-CDF, ECVR, IEBC Forms 34–39, USSD, GOTV; one plain-English line each.",
    "15.1": "Workstreams 1–4 as 15.1.1–15.1.4.", "15.2": "Workstreams 5–6 as 15.2.1–15.2.2.",
    "15.3": "Workstreams 7–10 as 15.3.1–15.3.4.", "15.4": "Workstreams 11–14 as 15.4.1–15.4.4.",
}
w("| New section | Units | |")
w("|---|---|---|")
for k in sorted(keys, key=order_key):
    title = NEW_TOC.get(k, "")
    cl = land.get(k, [])
    span = f"{len(cl)}: " + (", ".join(cl) if len(cl) <= 12 else f"{cl[0]}…{cl[-1]} ({', '.join(cl[:6])}, …)") if cl else "—"
    w(f"| {k} {cell(title) if k not in ('Cover', 'In brief') else ''} | {cell(span)} | {cell(NEW_ONLY.get(k, ''))} |")
w("")
w("## 4. Draft anchor redirects")
w("")
w("Every heading id live today, and where it would land. The 1,546 existing redirect keys are re-pointed through these, so each resolves in one lookup, as now. Merged headings land on the heading that holds their text.")
w("")
w("| Old id | Heading | New id |")
w("|---|---|---|")
for u in units:
    if u.get("hid"):
        w(f"| {u['hid']} | {cell(_re.sub(r'^#+ ', '', u['raw']).strip())} | {new_id(u)} |")
w("")
w("## 5. Audit")
w("")
n_in_map = sum(1 for u in units if u["c"] in plan and plan[u["c"]]["loc"] not in ("", "?"))
blank = [c for c, p in plan.items() if not p["loc"] or p["loc"] == "?" or not tlabel(p["t"])]
tc = _C(tlabel(p["t"]).split(" C")[0] for p in plan.values())
w("| Treatment | Units |")
w("|---|---:|")
for k, v in tc.most_common():
    w(f"| {k} | {v} |")
w("")
w(f"Blank cells: {len(blank)}.")
w("")
w(f"**Inventory items: {N}. Items in map: {n_in_map}. Discrepancy: {N - n_in_map}**")
_P(OUTDIR / "reorganisation-map.md").write_text("\n".join(o) + "\n")
