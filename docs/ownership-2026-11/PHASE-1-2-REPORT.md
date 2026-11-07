# Platform ownership: inspection report, task-to-function map, stack proposal, revision plan

Status: **waiting for stack approval.** I have not installed or created any backend package, account or service.

Baseline: `a377ded` on `main` (it was also the tip of `claude/new-session-rk7miz` at the start), tagged `pre-ownership-baseline` in the local repository.

---

## Phase 0: baseline snapshot (done)

| Step | Result |
|---|---|
| Tag `pre-ownership-baseline` | Created on `a377ded`. **The tag push to GitHub was refused**: the session's git proxy dropped the connection, and it accepts pushes to the session branch only. See flag F1. |
| `npm install` | Clean. It rewrote `package-lock.json` (a newer npm). I reverted that, so the lockfile is unchanged. |
| `npm run verify` on the untouched repo | **Passes** (exit 0). Full log: 27 guards, figure tests, declutter, content ledgers. |
| `scripts/preservation-manifest.json` | 259 protected files with SHA-256 hashes, plus 71 count sets (see below) |
| `scripts/check-preservation.js` → `npm run check:preservation` | Passes against the baseline. It fails if a protected file goes missing, or if any record, strategy or solution count falls below the baseline. It lists edited files without failing on them. It loads the TypeScript data modules through `scripts/preservation/loader.mjs`, so it counts real exported records, not lines. |
| `npm run verify` after Phase 0 | Still passes. |

Committed as one commit and pushed to `claude/new-session-rk7miz`.

**Protected trees:** `data/`, `lib/data/`, `content/`, `analysis/{config,reports,src}`, `components/{phone,tools,charts,terminal,markdown,register,premium,partviz}`, `app/tools/`, and also `lib/phases.ts`, `lib/flow.ts`, `lib/heading-slug.ts`, `lib/content-files.ts` and `lib/phone-showcase.ts`.

**Baseline counts (key ones):**

| Dataset | Records |
|---|---|
| Figure registry (`lib/data/figures.ts` → `FIGURES`) | 630 figures (236 sourced, 77+ modelled, 40+ targets, generated ward/constituency figures) |
| Ward register (`data/ward-register.json`) | 8 constituencies, 40 wards |
| County scorecard projects (`data/analysis/projects-register.json`, CSV) | 401 |
| Projects by ward | 88 |
| Census by sub-county | 136 values |
| Ward register 2022 export | 40 |
| Analysis exports (`ANALYSIS_EXPORTS`) | 8 |
| Workstreams (strategies) | 14 |
| Message pillars / content types | 3 / 4 |
| Voter segments | 6 |
| KPIs: nomination / general election / recognition | 4 / 5 / 5 |
| Risks | 6 |
| Escalation severity tiers | 4 |
| Contenders | 8 |
| Radio stations | 8 |
| USSD menu items / SMS specimens | 6 / 3 |
| Phases | 5 |
| Content chapters | 27 files: 92 figure fences, 119 visual fences, 107 lead fences, 5 text-version fences |

---

## Phase 1: inspection report

### 1. File map

**Story (prose).** There is one Markdown file per section, in `content/`. They are rendered at build into `public/content/` by `scripts/build-content.ts`, which resolves `{{figure.id}}` tokens from the registry. `lib/flow.ts` sets the scrolling order: Kitui today → The contest → The strategy → *How Firefly delivers* → Proof and protection → The decision → Reference shelf.

| Group | Files | Contains |
|---|---|---|
| Opening | `cover.md`, `brief.md`, `ask.md` | The cover, the case on one screen, the ask |
| Data | `kitui.md`, `votes.md`, `needs.md`, `news.md` | County profile, electoral arithmetic, needs evidence, media landscape |
| Analysis | `race.md`, `record.md`, `diagnosis.md` | Competitive field, his record, the diagnosis |
| Objectives | `goal.md`, `position.md` | Objectives, positioning |
| Strategies | `message.md`, `voters.md`, `channels.md`, `workstreams.md` | Message architecture, segments, channel mix, the 14 workstreams |
| Implementation | `engagement.md`, `timeline.md`, `success.md`, `lawful.md`, `response.md`, `receives.md` | Operating model, phases, KPIs, data protection, rapid response, scope levels and deliverables |
| Reference | `annex-evidence.md`, `annex-playbooks.md`, `annex-technology.md`, `annex-runbooks.md`, `annex-terms.md` | Source table, playbooks, technology, runbooks, terms |

**Data pack.**
- `lib/data/figures.ts` is the single registry of every printed number. Its schema is in `lib/data/schema.ts`.
- `data/*.ts` holds the structured strategy data: KPIs, risks, escalation, segments, pillars, USSD specimen, competitors, media ownership, fiscal audit, drought, tier matrix, sources, and so on.
- `data/ward-register.json` holds the IEBC 2022 register by ward.
- `data/analysis/*.json` holds the published outputs of the Python pipeline (`analysis/`).
- `data/scorecard/*.csv` holds the county scorecard projects.
- `lib/phases.ts` is the campaign calendar.

**Existing tools.**
- `/tools`: `ToolsHub`, `DataExplorer` (registry figures only: search, topic, tier and state filters, CSV, `#data-<id>` links), `ProjectsRegister`, `RadioTunerConsole`, and `/tools/service-delivery` and `/tools/visual-kinds`.
- Phone mockups in `components/phone/`: WhatsApp, USSD, Facebook, Instagram, TikTok, X and YouTube screens, plus the opt-in, rapid-response and service-tracker mockups.
- Terminal showcase in `components/terminal/`.
- Charts in `components/charts/`: ward cartogram, path to 200k, vote funnel, the `DirectionModel` weekly rhythm, and others.
- About 70 markdown-embedded panels in `components/markdown/`.

### 2. Firefly task inventory

There are about 280 mentions in all. The source attributions "per Firefly's audit" are provenance, not tasks, and stay as written. The task-bearing passages are these:

| # | Location | Task as written |
|---|---|---|
| T1 | `content/engagement.md:10-29` | Analyse in Week 1: audit his channels against the race |
| T2 | `content/engagement.md:26` | Define what to post, for whom, in which language, on which channel |
| T3 | `content/engagement.md:29,131-147`; `components/charts/DirectionModel.tsx:29`; `content/receives.md:105` | Issue the weekly brief (Thursday) |
| T4 | `engagement.md:141`; `receives.md:106`; `DirectionModel.tsx:30` | Approve the content calendar; comment on it without rewriting it |
| T5 | `DirectionModel.tsx:33` | Mid-week "one number" reach check, with at most one adjustment |
| T6 | `engagement.md:102`; `content/diagnosis.md:63-81` | Direct the existing publishing team: brief, approve, measure |
| T7 | `receives.md:107-108`; `workstreams.md:687-693`; `news.md:160`; `goal.md:77` | Operate the SMS, USSD and WhatsApp Business API layer end to end, including the fortnightly SMS touch |
| T8 | `receives.md:110`; `workstreams.md:253` | Design and read the creative test cycle (Workstream 3) |
| T9 | `receives.md:111` | Monthly presence-audit refresh (90-day rolling read by ward, language and format) |
| T10 | `receives.md:112`; `engagement.md:162` | Monthly performance report |
| T11 | `receives.md:113` | Monthly sentiment report to leadership |
| T12 | `receives.md:114` | Monthly competitive brief |
| T13 | `receives.md:115`; `annex-runbooks.md:70` | Quarterly red-team drill (Firefly's crisis lead) |
| T14 | `data/escalation.ts:52-67` | Draft rapid responses (severity tiers); Firefly is notified on approvals |
| T15 | `workstreams.md:68-71,149` | Build **and operate** the service-delivery tracker (Workstream 1) |
| T16 | `workstreams.md:315` | Set the accessibility standard (Workstream 4) |
| T17 | `workstreams.md:404-419` | Write the paid-media targeting plan and read its performance (Workstreams 5 and 6) |
| T18 | `workstreams.md:545`; `timeline.md:70` | Supply the field reporting template; deliver data-handling training to ward champions |
| T19 | `workstreams.md:588,633` | Write the brief each field role carries; supply the door-to-door instrument and its data governance |
| T20 | `workstreams.md:836` | Define the volunteer leaderboard metrics |
| T21 | `workstreams.md:914`; `lawful.md:33` | Run the supporter CRM and data layer as processor (Workstream 11) |
| T22 | `workstreams.md:952` | Ward-level predictive scoring (Workstream 12) |
| T23 | `workstreams.md:978-989`; `success.md:2-9,65,93` | Analytics and attribution, "the engine room", and dispatch logs as the measurement source (Workstream 14) |
| T24 | `timeline.md:29` | Specify the account-security baseline |
| T25 | `engagement.md:175` | Plan and read the ad account (Analyst and Advertiser access) |
| T26 | `engagement.md:188-197`; `data/risks.ts:23,28` | Stand-ups, strategy sync, monthly reviews; own risks R1 and R6 (Firefly Director) |
| T27 | `data/kpis.ts:71,84,97` | KPI owners: "Firefly analyst", "Firefly offline-layer operator" |
| T28 | `engagement.md:210-353`; `receives.md:29-58`; `data/tier-matrix.ts:27-29` | The Firefly core (Strategy Director, analyst, operator), surge roles, assessing and upskilling the team, and the hand-over of brief writing |
| T29 | `message.md:263-269` | The sample message assignment "Firefly would hand the team" |
| T30 | `lib/phases.ts:12,43` | Nomination sprint "Firefly's work aimed at the Wiper decision" |
| T31 | `CONTRIBUTING.md`; `docs/consolidation-2026-11/HOW-TO-UPDATE.md` | Edit the data pack in GitHub and run `npm run verify` |
| T32 | `.github/workflows/public-refresh.yml`; `CONTRIBUTING.md` | Review public-source candidate snapshots and promote the confirmed ones |
| T33 | `ask.md`, `brief.md:2-8`, `receives.md:2-5,121-141`, `components/DecisionPanel.tsx:85-98`, `lib/flow.ts:29`, `lib/reader-text.ts:49`, `lib/heading-slug.ts:64,83` | Framing: "Firefly steers", the "intelligence and strategy layer", "How Firefly delivers", "What Firefly commits to" |
| T34 | `lawful.md:31-33,274,399` | Firefly as data controller or joint controller for SMS, USSD and WhatsApp, and processor for the CRM |

### 3. Data model and what `verify` checks

- **Figure** (`lib/data/schema.ts`): `id`, `value` (number or null), `unit` (voters, votes, people, households, count, percent, ksh, km2, per-km2, persons), `tier` (T1, T2, T3 or null), `state` (sourced, modelled, needed, target), `source`, `note`, `decimals`, `alt` (a disputed second value), `closesWith`, `asOf`. The ward and constituency figures are generated from `ward-register.json`. Derived figures are computed from the others.
- **Analysis exports**: `{id, title, description, chart_type, generated, data_as_of, scenario_label, notes[], values[]}`, with a field contract in `data/analysis/manifest.json`.
- **Structured lists**: typed arrays, for example a KPI is `{code, title, definition, baseline, target, targetValue, unit, method, owner}`, and a risk is `{code, label, likelihood, impact, owner, why, mitigation}`.
- **`npm run verify`** runs these checks:
  - Generated outputs are current: source table, content, open items, CSVs, registry export, section visuals, anchors.
  - **Figure rules** (`check-figures.ts`): a sourced figure needs a source and tier, a modelled figure says how, a needed figure has a null value, a target has no tier.
  - Copy rules (`check-copy.ts`).
  - **No registry value retyped as a literal** (`scan-literals`).
  - Contradictions.
  - **Ward register sums to the county total** (`verify-ward-register`), plus ward keys.
  - Analysis-export contracts.
  - Figure mounts and fences.
  - Duplicates.
  - Anchors and deep links.
  - Visual coverage.
  - Unit tests.
  - **Content ledgers** (`check:content`): every body line, word count and token is compared against git baseline commits `a767371`, `8f10cb9` and `2f29920`, and every cut or move has to be logged in a ledger.
  - A token-level guard (`restructure-2026-11/check-preservation.mjs`) requires names such as "Firefly" to stay in the file where each unit lives.

  These checks need the whole repository and its git history. They cannot run inside a serverless request.

### 4. Current stack

| Area | Detail |
|---|---|
| App | Next.js 15 (App Router), React 19, Tailwind 4, Recharts and d3, `output: 'standalone'` |
| Rendering | Every section is a statically generated route. The figures are compiled into the bundle at build time, so there is no runtime data layer. |
| API and auth | No API routes and no database. An optional `SITE_PASSCODE` middleware gate is off by default. |
| Hosting | Vercel builds `main` and runs `prebuild`, which regenerates the content and runs part of the checks. |
| CI | `.github/workflows/verify.yml` runs lint, `tsc`, verify and build on every PR and every push to `main`. `public-refresh.yml` collects source snapshots each day into a review PR. |
| Python pipeline | `analysis/` (pytest). It is excluded from the deploy. |

### 5. Ambiguities and risks (need your decision; see the flags)

- **F1. Pushing to `main`.** This session's git proxy accepts pushes only to `claude/new-session-rk7miz`; the tag push was refused. Phase 6 will reach `main` by a PR from this branch that I merge (or you merge). The `pre-ownership-baseline` tag is local. You can create it on `a377ded` in GitHub (Releases → new tag) or authorise me to create a `pre-ownership-baseline` branch ref instead. Rollback to `a377ded` works either way.
- **F2. The offline layer (T7).** The WhatsApp Business API line and the USSD shortcode are campaign channels, not the website. Under decision 2 they move to the campaign. I propose that the site gives the team a dispatch planner and log, with language-rule validation and consent counts against the targets. It would not send SMS itself: sending would need a gateway integration, which is a third-party service. Do you agree, or does Firefly keep holding the line and shortcode as infrastructure?
- **F3. Data-protection roles (T34, `lawful.md`).** These are legal positions. My proposal: the campaign is controller for everything, and Firefly is processor only for the data the team enters on the platform, which it hosts. This needs your counsel's sign-off before I edit `lawful.md`.
- **F4. Open to view versus personal data (T21 and the CRM).** Decision 3 makes everything on the site public. Supporter records, phone numbers and door-to-door data therefore **must never be entered on the site**. I propose that the platform holds aggregate counts only, and the CRM stays outside it. A related point: the team's weekly briefs, calendar and incident log would also be public. Confirm that is intended, or name the workspace items that may stay team-only. Viewing them would still never need a login, so team-only items would simply not be published.
- **F5. Scope levels, the Firefly core and the ask (T28, T33).** `receives.md`, `tier-matrix.ts`, `ask.md` and `DecisionPanel` are built on Firefly staffing levels and on Firefly's request for "one week and one export". These pages must stay (nothing is removed) but must be reworded. I will keep every level, row and number, and reword only who does the work. Do you want the ask itself reworded to "approve the platform; your team runs the campaign through it", or kept as is?
- **F6. Live versus rebuilt data.** The proposal's data lives in the repository and is compiled at build. Any edit that changes a printed figure goes through a rebuild, about 3–5 minutes, under the recommended stack. Team operational updates go live on the next page load. See the stack proposal.
- **F7. Existing section numbers in prose.** The prose contains "Section 13.4" references and `number` fields in `heading-slug.ts`. These existed before this work. I will not add new ones, and I will use links in the lines I rewrite. I will not renumber unrelated text.
- **F8. Content guards.** Every role rewrite has to be logged in a new ledger (`docs/ownership-2026-11/ledger.json`), and the ledger has to be wired into `check:content` the same way the earlier passes were. The name "Firefly" stays in every unit, which the token guard requires and the new text naturally does.
- **F9. `SITE_PASSCODE`.** It stays off, and I will not touch it. If someone sets it, it would gate viewing, which contradicts decision 3. I will document that.

---

## Phase 2

### A. Task-to-function map

The site functions named here are the ones I would build in Phase 3.

| # | Firefly task (as written) | New owner | Site function that enables it |
|---|---|---|---|
| T1 | Audit his channels against the race | Mulu's team | **Channel audit** form (reach by ward, language and format, the dimensions `success.md` names) feeding the **analysis dashboards** |
| T2 | Define what to post, for whom, language, channel | Mulu's team | **Strategy library** (pillars, segments, channels, workstreams, each linked to its data) + **Brief builder** |
| T3 | Issue the weekly brief | Mulu's team | **Brief builder**: pillar weights, must-post items, ward priority, language rule, one thing to stop. Published to the workspace and exportable to PDF and WhatsApp text. |
| T4 | Approve the content calendar | Mulu's team (comms lead) | **Content calendar** board: items mapped to the brief, with draft → approved → published status and an approver |
| T5 | Mid-week one-number reach check | Mulu's team | **KPI tracker**: weekly actual against target, with the deficit-ward reach tile |
| T6 | Direct the publishing team | Mulu's team | **Team workspace**: brief → calendar → assignments (owner, channel, due date, status) |
| T7 | Operate the SMS, USSD and WhatsApp layer | Campaign (F2) | **Dispatch planner and log**: rail, language (Kikamba blocked on bulk SMS), segment, date, consented-list size against `target.sms.*`. It does not send. |
| T8 | Design and read creative tests | Mulu's team | **Test log**: hypothesis, variants, result, decision |
| T9 | Monthly presence-audit refresh | Mulu's team | Channel audit + dashboards over a rolling 90 days |
| T10 | Monthly performance report | Mulu's team | **Report view**: dashboards + KPI tracker for a month, exportable to PDF and CSV |
| T11 | Monthly sentiment report | Mulu's team | **Field and sentiment log** by ward + report view |
| T12 | Monthly competitive brief | Mulu's team | **Competitor watch** log against the 8 contenders + report view |
| T13 | Quarterly red-team drill | Mulu's team | **Drill log** in the rapid-response desk |
| T14 | Draft rapid responses | Mulu's team | **Rapid-response desk**: incident, severity tier (from `SEVERITY_TIERS`), drafted by, approved by, turnaround clock |
| T15 | Build and operate the service-delivery tracker | Build: **Firefly (platform)**. Operate: Mulu's team | **Project status editor** on the existing projects register (status and notes per project; the 401 records are untouched) |
| T16 | Set the accessibility standard | Mulu's team | Accessibility checklist carried in every brief (from Workstream 4) |
| T17 | Paid-media targeting plan and read | Mulu's team | **Implementation view**: per strategy and workstream, the owner, channel, status and notes |
| T18 | Field reporting template; data-handling training | Mulu's team | **Field report form** (ward, issue, channel) + training checklist in the implementation view |
| T19 | Briefs for field roles; door-to-door instrument | Mulu's team | Brief builder (by role) + implementation view (aggregates only, F4) |
| T20 | Leaderboard metric definitions | Mulu's team | **Data editor** on KPI definitions (`data/kpis.ts`) |
| T21 | Supporter CRM and data layer | Campaign, outside the site (F4) | Aggregate consented-list counts in the KPI tracker. No personal data on the platform. |
| T22 | Ward-level predictive scoring | Analysis: Mulu's team. Pipeline code: **Firefly (platform)** | Ward dashboards from the analysis exports. Firefly keeps the pipeline and its checks running. |
| T23 | Analytics and attribution; dispatch logs as the source | Mulu's team | Dashboards + KPI tracker + dispatch log |
| T24 | Specify the account-security baseline | Mulu's team | Checklist in the implementation view (Annex F.8 content unchanged) |
| T25 | Plan and read the ad account | Mulu's team | Implementation view + KPI tracker |
| T26 | Meeting rhythm; risk owners | Mulu's team | **Cadence view** (the meetings, owned by team leads) + **data editor** on the risk register |
| T27 | KPI owners named as Firefly roles | Mulu's team | Data editor on KPI owners (intentional edit to `data/kpis.ts`) |
| T28 | Firefly core, surge, upskilling, brief hand-over | Retired as campaign work. Firefly's role becomes platform operation. | Team quick guide + "How the platform works" part |
| T29 | Sample messages "Firefly would hand the team" | Mulu's team | Brief builder (the sample stays, reworded as the team's own) |
| T30 | Nomination sprint as Firefly's work | Mulu's team | Implementation view, by phase |
| T31 | Edit the data pack in GitHub, run verify | Mulu's team edits; Firefly keeps verify running | **Data editor** with **built-in validation**, **change history and revert** |
| T32 | Review public-source candidates | Mulu's team | **Source leads** queue in the data editor: candidate → verify against source → edit the figure |
| — | Hosting, deployment, bug fixes, `verify` and `check:preservation`, new features, team accounts, backups | **Firefly (platform ownership)** | **Team management** (add and remove accounts), CI gates |

### B. Stack proposal

The site is static and its data pack lives in the repository, guarded by about 30 checks that need the full repository and its git history. That rules out a database-only design that does not lose the guards. It also rules out a git-only design that meets "without a deploy".

**Option 1: Git-backed editor only.**
- How it works: the team logs in and edits through forms. A server route validates the edit and commits it through a GitHub App, and Vercel rebuilds.
- Verify enforcement: fast rules (the figure schema, ward sums, the language rule) run in the route, so the team gets a plain-language error at once. The full `verify` and `check:preservation` then run in GitHub Actions on an `edits/*` branch. The edit auto-merges to `main` only on green, and until then it shows as "pending checks". **Nothing failing verify reaches main.**
- History and revert: the git log, one commit per edit, with the author recorded in a trailer. Revert is a revert commit through the same gate, which restores the value exactly.
- Source of truth: unchanged.
- What it fails: every change, including a status update, takes 3–5 minutes to go live. That fails "Content editor: changes appear without a deploy" and "Implementation view: next page load".

**Option 2: Hosted database and auth for everything (for example Supabase).**
- How it works: the data pack migrates into Postgres tables, and the site reads them at runtime.
- Verify enforcement: about 30 checks would have to be rewritten as database and server validation. The content-ledger and baseline checks have no database equivalent.
- History and revert: an audit table.
- Source of truth: this moves the data out of the guarded pipeline and rewrites how 630 figures reach the prose. That is the highest risk to the protected content, and it is a large rewrite.

**Option 3 (recommended): hybrid, with one login.**

*Layer A, the data pack* (figures, register, datasets, strategy lists, prose): stays in the repository and is edited through Option 1's flow. Server-side fast validation reuses the repository's own rules: I will extract the rule functions from `check-figures.ts` and `verify-ward-register.mjs` into a shared module, so the editor and `verify` run the same code. The full gate runs in CI before merge. History and revert work through git and are shown in the site's change-history page.

*Layer B, the operational layer* (implementation status, briefs, calendar, assignments, the dispatch, test, field, competitor and incident logs, KPI actuals, project status notes): lives in **Supabase Postgres** and goes live on the next page load with no deploy.
- Every write goes through a server route that checks the session and an active `team_members` row, validated with typed schemas.
- Row-level security is a second lock.
- An `audit_log` table holds who, what, when and before/after JSON for every write. Revert writes back the "before" value and is itself logged.
- Public pages read Layer B with a read-only key, so viewing never needs a login.

*Auth*: Supabase Auth (email magic link, or email and password, for phones).
- Edit routes are protected in the server route itself, not just hidden.
- Firefly manages `team_members` from a Firefly-only admin page.
- Removing a member sets `active=false`, and every write checks that flag, so access ends on the next request.

Why I recommend it: it is the only option that meets all the acceptance criteria while keeping the data pack and every existing guard as the source of truth. Only the new operational data, which has no guard today, lives in the database.

**Services that could incur cost, and when** (no figures on the site):

| Service | Free usage | When it starts to cost |
|---|---|---|
| Vercel | — | Vercel's terms restrict the Hobby plan to non-commercial use, so a campaign may need Pro, which is billed per seat. A rebuild runs on every data-pack edit, so build minutes grow with edit volume. Server routes add function invocations. |
| Supabase | Free tier | Above 500 MB of database, 1 GB of storage or 50k monthly active users. Free projects pause after a week with no activity, which is a reason to take Pro for a live campaign. |
| Email for magic links | Supabase's built-in sender, a few emails an hour (fine for testing) | At more than a handful of logins an hour, a transactional email provider (for example Resend or Postmark), billed by volume above its free allowance |
| GitHub Actions and GitHub App | Free (the repository is public) | — |

**What Firefly must set up after approval:**
1. A Supabase project. I give the SQL schema and RLS policies as a migration file.
2. Vercel environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (server only)
   - `GITHUB_APP_ID`
   - `GITHUB_APP_PRIVATE_KEY`
   - `GITHUB_APP_INSTALLATION_ID`
   - `FIREFLY_ADMIN_EMAILS`
3. A GitHub App installed on this repository with contents and pull-request write access.
4. Branch protection on `main` requiring `verify`, plus auto-merge enabled.
5. Optionally, SMTP credentials in Supabase.

No secret goes in the repository.

Packages I would add after approval: `@supabase/supabase-js`, `@supabase/ssr`, `@octokit/app` (or `@octokit/rest`), `zod`.

### C. Revision plan (file by file)

**Added (new files only):**
- Platform routes:
  - `app/explore/` (data explorer over every dataset: the registry, ward register, the 8 analysis exports, projects, and the structured lists, with URL state and CSV)
  - `app/dashboards/`
  - `app/strategies/` (the library, linked back to figures and sections)
  - `app/implementation/`
  - `app/how-it-works/` (or a story part, below)
- Team routes:
  - `app/team/` (login, workspace: brief, calendar, assignments, logs, KPI tracker, cadence)
  - `app/team/data/` (data editor, source leads)
  - `app/team/history/`
  - `app/team/admin/` (Firefly only)
  - `app/api/team/*` (server-protected write routes)
- `lib/platform/` (Supabase clients, auth guard, GitHub commit client, shared validators)
- `components/platform/`
- `supabase/migrations/*.sql`
- `.github/workflows/team-edit.yml` (verify + preservation on `edits/*`, then auto-merge)
- `docs/ownership-2026-11/` (ledger, handoff, team quick guide)
- `content/platform.md`: the "How the platform works" part, visual first, placed in the Implementation part right after `engagement.md`, so the order of the story is unchanged.

**Changed (intentional edits, each logged in the ledger):**
- `content/engagement.md`, `receives.md`, `brief.md`, `ask.md`, `workstreams.md`, `success.md`, `timeline.md`, `message.md`, `diagnosis.md`, `goal.md`, `news.md`, `annex-runbooks.md`, `annex-playbooks.md`, `lawful.md` (only after F3): the role sentences listed in T1–T34. They are reworded, not cut, and every figure token is kept.
- `data/kpis.ts` (owner fields), `data/risks.ts` (owner fields), `data/escalation.ts` (`draftedBy` and `approvedBy`), `data/tier-matrix.ts` (team rows): who does the work changes. Record counts do not change.
- `components/charts/DirectionModel.tsx`, `components/DecisionPanel.tsx`, `components/MarkdownViewer.tsx` (Part IV strings): role wording.
- `lib/flow.ts`, `lib/reader-text.ts`, `lib/heading-slug.ts`: the part label "How Firefly delivers" becomes "How the campaign runs", and the blurbs change. Ids, order and anchors are unchanged.
- `lib/phases.ts`: the focus text of the nomination sprint.
- `lib/content-files.ts`: one new entry for `platform.md`.
- `package.json` (scripts and dependencies), `CONTRIBUTING.md`, `docs/consolidation-2026-11/HOW-TO-UPDATE.md`: point to the in-site editor.
- `.github/workflows/verify.yml`: add `check:preservation`.
- Vercel build command: `npm run verify && npm run check:preservation && npm run build`.
- `components/tools/ToolsHub.tsx`: links to the new functions.

**Unchanged byte for byte:**
- Every file in `data/analysis/`, `data/ward-register.json`, `data/geo/`, `data/scorecard/`, `lib/data/figures.ts`, `lib/data/schema.ts`, and `data/{sources,segments,message-architecture,competitors,media-ownership,benchmarks,electoral-*,fiscal-audit,drought-food-security,mui-basin,nomination-path,disputed-figures,external-figures,ussd-specimen,terminal-showcase,projects,ward-register}.ts`
- `analysis/`, every component in `components/phone/`, `components/terminal/`, `components/register/`, `components/premium/`, `components/partviz/`, every chart except `DirectionModel`, and the `content/` files not listed above (`cover`, `kitui`, `votes`, `needs`, `race`, `record`, `position`, `voters`, `channels`, `response`, `annex-evidence`, `annex-technology`, `annex-terms`)
- The "per Firefly's audit" source attributions

Team edits made later will change data files, but only through the gated flow.

---

## Decisions I need from you

1. **Stack:** approve Option 3 (Supabase + GitHub App, hybrid), or choose Option 1 or Option 2.
2. **F2** offline layer, **F3** data-protection roles, **F4** what may be public in the workspace, **F5** whether the ask is reworded.
3. **F1:** reach `main` by a PR that I merge after the gates pass. Is that acceptable?
