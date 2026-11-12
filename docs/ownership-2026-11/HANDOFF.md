# Platform ownership: handoff report

> **Superseded in part (November 2026).** The site no longer has a team sign-in, a data editor,
> workspace editing or team accounts: it is read-only, and Firefly makes changes at the team's
> request. See `docs/signin-2026-11/` and `CONTRIBUTING.md`. The rest of this document stands.

Firefly made the site, owns it and runs it. Dr. Mulu's team runs the campaign through it.

The baseline is `a377ded`, tagged `pre-ownership-baseline`. The decisions were approved as recommended:

- **Stack**: Option 3, the hybrid.
- **F1**: reach `main` by a merged pull request.
- **F2**: the offline layer moves to the campaign; the site plans and logs sends but does not send.
- **F3**: the campaign is the data controller; Firefly is processor only for what the platform holds.
- **F4**: everything is public, so no personal data goes on the platform.
- **F5**: the ask is reworded.

---

> **Current setting (owner's decision, November 2026): sign-in is switched off.** The site is open
> to view only. There is no sign-in button, the team pages (`/team/*`) return "not found", and the
> server refuses every edit. To switch team editing on later, finish the setup in section 3, set
> `PLATFORM_TEAM_LOGIN=on` in Vercel and redeploy.

## 1. Inspection report

The full report is in [`PHASE-1-2-REPORT.md`](PHASE-1-2-REPORT.md). In brief:

- **The site**: Next.js 15, statically generated. Every number lives in one registry, `lib/data/figures.ts`, and reaches the prose through `{{id}}` tokens at build time. There was no database and no login.
- **The data pack**:
  - the registry: 630 figures
  - `data/ward-register.json`: 8 constituencies, 40 wards
  - eight published analysis exports, plus the projects register (401 projects) and the census table
  - the structured strategy lists in `data/*.ts`
  - 27 chapters of prose
- **`npm run verify`**: about 30 guards. They cover:
  - the figure rules
  - no registry value retyped as a literal
  - the ward arithmetic
  - export contracts, fences and mounts
  - anchors
  - word conservation of the prose against git baselines
  - token and name preservation
  - leads
  - copy rules
- **Firefly duties found**: 34 kinds, over about 280 mentions. Source credits ("per Firefly's audit") are provenance and were kept.

## 2. Task-to-function map

| Firefly task (as written) | New owner | Site function |
|---|---|---|
| T1 Audit his channels against the race | Team | Workspace › Channel audit · Dashboards |
| T2 Define what to post, for whom, language, channel | Team | Strategies (`/strategies`) · Workspace › Weekly brief |
| T3 Issue the weekly brief | Team (strategy core) | Workspace › Weekly brief (pillar weights must add up to 100) |
| T4 Approve the content calendar | Team (strategy core) | Workspace › Content calendar (Draft → Approved → Published; Kikamba needs the native-speaker review) |
| T5 Mid-week one-number check | Team | Workspace › KPI tracker · Dashboards |
| T6 Direct the publishing team | Team | Weekly brief → Content calendar (assignee, status) |
| T7 Operate SMS, USSD and WhatsApp | Team (campaign's channels) | Workspace › Dispatch: refuses Kikamba bulk SMS, SMS over 160 characters, and SMS lodged less than 48 hours ahead |
| T8 Design and read creative tests | Team | Workspace › Creative tests |
| T9 Monthly presence-audit refresh | Team | Channel audit + Dashboards + Explore (CSV, PDF) |
| T10 Monthly performance report | Team | Dashboards + KPI tracker; print to PDF |
| T11 Monthly sentiment report | Team | Workspace › Field and sentiment · Dashboards |
| T12 Monthly competitive brief | Team | Workspace › Competitor watch |
| T13 Quarterly red-team drill | Team + external panel | Workspace › Rapid response (drill flag, after-action note) |
| T14 Draft rapid responses | Team (strategy director) | Workspace › Rapid response (severity tier, drafted by, approved by) |
| T15 Build and operate the service-delivery tracker | Build: **Firefly (platform)**. Operate: Team | Workspace › Service-delivery tracker, alongside the existing projects register |
| T16 Set the accessibility standard | Team | Weekly brief (accessibility box) |
| T17 Paid targeting plan and read | Team | Implementation (`/progress`) · KPI tracker |
| T18 Field reporting template; data-handling training | Team | Field and sentiment · Implementation |
| T19 Briefs for field roles; door-to-door instrument | Team | Weekly brief · Implementation (aggregate only) |
| T20 Leaderboard metric definitions | Team | Edit data › Strategy lists › Indicators |
| T21 Supporter CRM and data layer | Campaign, on its own systems | Counts only, in the KPI tracker (no personal data on the platform) |
| T22 Ward-level predictive scoring | Analysis: Team. Pipeline code: **Firefly (platform)** | Dashboards · Explore (ward datasets) |
| T23 Analytics and attribution | Team | Dashboards · KPI tracker · Dispatch log |
| T24 Account-security baseline | Team | Implementation |
| T25 Plan and read the ad account | Team | Implementation · KPI tracker |
| T26 Meetings; risk owners | Team | Workspace › Meetings and decisions · Edit data › Risk register |
| T27 KPI owners named as Firefly roles | Team | Changed to campaign roles in `data/kpis.ts`; editable in Edit data |
| T28 The Firefly core, surge roles, upskilling | Campaign strategy core | The story's "The team" chapter, reworded · the team guide |
| T29 Sample messages Firefly would hand the team | Team | Weekly brief (the sample stays, as the team's own) |
| T30 Nomination sprint as Firefly's work | Team | Implementation (phase field) |
| T31 Edit the data pack in GitHub and run verify | Team edits; **Firefly** keeps verify running | Edit data (`/team/data`) with built-in validation; Changes (`/history`) with revert |
| T32 Review public-source candidates | Team | Edit data (the candidates file remains Firefly's workflow output) |
| T33 and T34 Framing and data-protection roles | Rewritten | "How the platform works" chapter; `lawful.md` controller table |
| Hosting, deployment, fixes, verify, features, accounts | **Firefly (platform ownership)** | Team accounts (`/team/admin`), CI gates |

## 3. Stack decision and setup notes for Firefly

**As approved: Option 3, the hybrid.**

- **The data pack** stays in the repository, the source of truth.
  - It is edited on the site and checked on save with `lib/data/rules.ts`, the same code `verify` runs.
  - Each edit is committed to a `team-edit/*` branch.
  - `.github/workflows/team-edit.yml` regenerates the derived files and runs `verify`, `check:preservation`, `tsc` and the build. Only if all pass does it push the edit to `main`.
- **Working records** live in **Supabase Postgres**, live on the next page load. Every write goes through a server action that checks an active membership. Supabase row-level security refuses writes from non-members a second time. Deletes are refused by a database trigger, and the audit log is append-only.
- **Login** is **Supabase Auth**: email magic link, or password.

**Until the steps below are done, the live site runs in "not connected" mode.**

- Every public page, the story and the whole data pack work.
- The workspace says nothing has been entered yet.
- Sign-in says it is not switched on.

### One-time setup

1. **Supabase**:
   1. Create a project.
   2. In the SQL editor, run `supabase/migrations/20261108000000_platform.sql`.
   3. In Authentication › Providers › Email, enable email. Turn **off** "Allow new users to sign up": the site invites team members itself.
   4. In Authentication › URL configuration, set the Site URL to the live URL, and add `https://<live-url>/team/auth/callback` to the redirect URLs.
2. **GitHub**:
   1. Create a GitHub App with Repository permissions › Contents: Read and write, and install it on this repository only. A fine-grained personal access token with Contents read/write on this repository only also works.
   2. Under Settings › Actions › General, set Workflow permissions to **Read and write**. `team-edit.yml` pushes the checked edit to `main` with the workflow token.
   3. If `main` gets branch protection, allow GitHub Actions to bypass it. Otherwise the gate cannot publish.
3. **Vercel** (Project › Settings › Environment Variables, Production). The names are also listed in `.env.example`; never commit the values.

   | Variable | Value |
   |---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | From Supabase › Project settings › API |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Same page |
   | `SUPABASE_SERVICE_ROLE_KEY` | Same page. **Secret**, server only |
   | `FIREFLY_ADMIN_EMAILS` | Firefly's own email(s), comma separated |
   | `GITHUB_REPOSITORY_SLUG` | `Muluvi/DR.-MAKALI-DIGITAL-CAMPAIGN-` |
   | `GITHUB_APP_ID`, `GITHUB_APP_PRIVATE_KEY`, `GITHUB_APP_INSTALLATION_ID` | From the GitHub App |
   | `GITHUB_EDIT_TOKEN` | The token instead of the App, if you chose a token |

   Redeploy after saving.
4. **Optional: email.** Supabase's built-in sender allows only a few emails an hour. For a team of more than a handful, add custom SMTP in Supabase › Authentication › SMTP.

### Adding and removing team members

1. Sign in at `/team/login` with an email listed in `FIREFLY_ADMIN_EMAILS`. The first time, use **Email me a sign-in link**.
2. Open **Team** (`/team/admin`) and enter the member's name and email. They receive an invitation and can edit once they open it.
3. **Remove** stops them editing on their next request. Their past changes stay in the history. **Restore** re-admits them.

### Services that could cost money

No figures appear on the site.

| Service | When it starts to cost |
|---|---|
| Vercel | The Hobby plan is non-commercial, so a campaign may need Pro (per seat). Every data-pack edit triggers one production build. Edit branches are not built: `vercel.json` skips `team-edit/*`. |
| Supabase | Beyond the free tier's database, storage and monthly-active-user limits. Free projects pause after a week idle, so a live campaign wants a paid plan. |
| Email | Beyond Supabase's built-in rate, a transactional email provider billed by volume |
| GitHub Actions | None: the repository is public |

## 4. Revised role text

**Firefly's role**, as the site now states it:

> **Your team steers and publishes. Firefly runs the platform. One brief a week holds it together.** Firefly publishes nothing on Dr. Makali Mulu's accounts and runs none of his channels.
>
> **The boundary.** The digital operation separates the platform, its hosting, upkeep and data checks, which Firefly provides, from analysis, strategy, messaging, voter mobilisation, ground staffing, broadcast advertising and logistics, which the campaign owns and runs. **Firefly publishes nothing on Dr. Mulu's accounts and holds no credentials to them.** It operates no channel at all: the offline layer, a WhatsApp Business API line and a USSD shortcode, is the campaign's to run. It needs no access to the owned accounts: the team enters their analytics on the platform, so the work can be measured.
>
> **The Firefly proposition.** Firefly provides the campaign's **data and analytics platform**, not a replacement for the team already publishing, and not an outside strategist. The team does the work on it: an audit of what the existing channels are doing, a strategy derived from it, a weekly brief that turns the strategy into instructions, a measurement cycle that says whether it worked, and the offline SMS, USSD and WhatsApp layer, reaching the voters no owned account can.
>
> Firefly runs the platform itself: hosting, deployment, upkeep, the data checks and new features. *(The team, §17.2)*
>
> Firefly commits to a platform, its upkeep and its data checks; the team to a method, a cadence and a standard. Neither commits to an electoral outcome. *(§22)*
>
> **Anyone with the link sees everything. Dr. Mulu's team signs in to change it. Firefly keeps it running.** The campaign owns its content and its data. Firefly made the platform, owns it and runs it. *(How the platform works)*

**What moved to Dr. Mulu's team.** Each duty points to the function that supports it (section 2 above).

- **Analyse.** The team audits his channels against the race in the channel audit, and reads the dashboards.
- **Decide.** The team defines what to post, for whom, in which language, on which channel, and why. The strategy library links each choice to its evidence.
- **Direct the publishing team.** The strategy core writes the Thursday brief in the workspace, and approves the Friday calendar in the content calendar. It comments on the calendar; it does not rewrite it.
- **Execute.** The team runs twelve of the fourteen workstreams, including the seven once proposed as Firefly's:
  - the service-delivery tracker
  - creative testing
  - the accessibility standard
  - the offline layer
  - the data layer
  - modelling
  - analysis

  The other two, volunteer organising and the technology stack Dr. Mulu already holds, stay outside the operation.
- **Run the channels.** The team publishes everything, the SMS, USSD and WhatsApp broadcasts included, and logs every send in the dispatch log.
- **Measure.** The team enters every indicator in the KPI tracker. The deliverables schedule now names "Your team" for the brief, the SMS touch, USSD availability, creative tests, the presence-audit refresh, and the performance, sentiment and competitive reports. Red-team drills are run by the team and an external panel.
- **Protect.** The strategy director drafts responses at the high and critical tiers, on the rapid-response desk.
- **Update the data.** The team edits figures, the register, the lists and the analysis values in the data editor. Every edit is checked and logged, and can be reverted.
- **People.** The three strategy roles (Strategy Director, Analyst, Offline-layer Operator) are campaign roles at every scope level. "The campaign names three roles. Firefly adds the platform."
- **Law.** The campaign is the controller for the owned accounts, the offline layer and the supporter CRM. No supporter record goes on the platform; for the counts it holds, Firefly is processor under a written agreement.

## 5. Verification results

All run on the final commit, before the merge:

| Check | Result |
|---|---|
| `npm run lint` | Pass |
| `npx tsc --noEmit` | Pass |
| `npm run verify` | Pass. All guards, including `check:content` with the new ownership ledger (161 logged passages; word balance 0.84% and 0.03%, unchanged from the baseline) |
| `npm run check:preservation` | Pass. 259 protected files present, no count below the baseline |
| `npm run build` (production) | Pass, no warnings from this work |
| Secrets scan of every commit | Nothing found. No env file is tracked |
| Acceptance suite on the production build, phone 390 px and desktop 1280 px, logged out and in | **25/25 pass** (list below) |
| Data editor round trip | Edit a figure → full `verify` passes with the edit → the value appears in three chapters → revert → value and every generated file restored byte for byte |
| Existing tools | `/tools`, `/tools/service-delivery` and `/tools/visual-kinds` respond 200. The phone mockup (WhatsApp and the other screens), terminal showcase and analysis figures render |

The 25 checks:

1. Seven public pages render logged out, with no edit control and no horizontal overflow at 390 px (seven checks).
2. `/team/data` redirects to sign-in when logged out.
3. The explorer finds all 630 figures.
4. A shared link reproduces a filtered, sorted view.
5. The CSV matches the view row for row.
6. The library lists all 14 workstreams.
7. A non-member's sign-in is refused.
8. Firefly adds an account.
9. The member signs in.
10. An invalid brief is refused in plain language.
11. A brief is saved on a phone in 5 seconds, including a correction.
12. The brief is public on the next load.
13. Kikamba bulk SMS is refused.
14. The implementation view shows the team's entry.
15. The history logs who, what and when.
16. A revert restores the exact previous value.
17. A replayed edit request without a session is refused by the server.
18. A removed account loses edit access on its next request.
19. No client errors.

### Preservation audit

**Record counts, before and after**: every count is unchanged.

| Dataset | Before | After |
|---|---:|---:|
| Figures in the registry | 630 | 630 |
| Wards / constituencies | 40 / 8 | 40 / 8 |
| County projects | 401 | 401 |
| Analysis exports | 8 | 8 |
| Workstreams (strategies) | 14 | 14 |
| Pillars / content types / segments | 3 / 4 / 6 | 3 / 4 / 6 |
| Indicators (nomination / general election / recognition) | 4 / 5 / 5 | 4 / 5 / 5 |
| Risks / severity tiers / contenders / radio stations | 6 / 4 / 8 / 8 | 6 / 4 / 8 / 8 |
| Phases / scope-level rows / USSD menu / SMS specimens | 5 / 8 / 6 / 3 | 5 / 8 / 6 / 3 |
| Figure fences / text-version fences | 92 / 5 | 92 / 5 |
| Content chapters | 27 | 28 (How the platform works added) |
| Table rows: `engagement.md` / `receives.md` | 30 / 20 | 31 / 21 (one "the platform" row added to each) |

**Byte for byte unchanged.**

- Every file in `data/analysis/`.
- `data/ward-register.json` and `data/geo/`.
- `data/scorecard/`.
- `data/sources.ts`, `data/segments.ts`'s records, and every other data module's records.
- `lib/data/schema.ts`.
- `analysis/`.
- `components/phone/`, `components/terminal/`, `components/register/` and `components/partviz/`.
- Every chart except `DirectionModel`.
- These chapters: `cover`, `kitui`, `votes`, `needs`, `race`, `record`, `position`, `channels`, `response`, `annex-evidence`, `annex-technology` and `annex-terms`.

**Intentional edits to protected files.** The preservation check lists 32. Each is below with its reason.

| File | Edit | Why |
|---|---|---|
| 16 content chapters: `ask`, `brief`, `diagnosis`, `engagement`, `goal`, `lawful`, `message`, `news`, `receives`, `success`, `timeline`, `voters`, `workstreams`, `annex-playbooks`, `annex-runbooks` | Role sentences reworded in place, 161 passages, every figure token, name and acronym kept. Each is logged in `docs/ownership-2026-11/ledger.json` and listed in `docs/ownership-2026-11/CHANGES.md` | Phase 4: the new roles |
| `lib/data/figures.ts` | Applies `data/team/figures.json` as each figure is defined (no value changed) | So the team can edit figures without GitHub |
| `data/kpis.ts`, `risks.ts`, `segments.ts`, `escalation.ts`, `competitors.ts`, `media-ownership.ts`, `message-architecture.ts`, `benchmarks.ts` | Each list is wrapped in `withTeamEdits(...)` (records untouched). Owner fields in kpis, risks and escalation now name campaign roles | Team editing; the new roles |
| `data/tier-matrix.ts` | "3-person Firefly core" → "3-person strategy core (campaign)" | The new roles |
| `lib/phases.ts` | The focus of the nomination sprint is the team's work | The new roles |
| `lib/flow.ts`, `lib/heading-slug.ts`, `lib/content-files.ts` | The part label "How Firefly delivers" → "How the campaign runs"; the new chapter is registered. No id, order or anchor moved | The new roles; the new chapter |
| `components/charts/DirectionModel.tsx` | Direction-model wording | The new roles |
| `components/markdown/AnalysisFigure.tsx` | Rows keyed by position as well as label | A duplicate key would have dropped one of the two runner-up rows |
| `components/premium/Chrome.tsx` | One dock icon linking to the platform | A way in from the story |

Outside the protected list, the same role wording changed in:

- `lib/register/specs/s0-cover.ts`, `s1-objectives.ts` and `s5-implementation.ts`
- `lib/figures/governance.ts`, `research.ts` and `annex.ts`
- `components/DecisionPanel.tsx`, `components/MarkdownViewer.tsx` and `components/MobileTOCModal.tsx`
- `lib/reader-text.ts`

## 6. Change summary

| Area | Files | What and why |
|---|---|---|
| Preservation | `scripts/preservation-manifest.json`, `scripts/check-preservation.js`, `scripts/preservation/*` | The Phase 0 baseline and its check, run in CI and in the Vercel prebuild |
| Shared rules | `lib/data/rules.ts`; `scripts/check-figures.ts` and `scripts/verify-ward-register.mjs` now call it | One set of rules for `verify` and for the editor |
| Team overlays | `data/team/figures.json`, `data/team/lists.json`, `lib/data/team-overlay.ts` | Where team data-pack edits land; nothing is removed by them |
| Platform core | `lib/platform/*` | Configuration, collections and validation, stores (Supabase and a development-only local file), auth, the catalogue of every dataset, the strategy library, the data-pack edit engine, and the GitHub commit client |
| Platform pages | `app/(platform)/*`, `components/platform/*`, `app/platform.css` | Explore, Dashboards, Strategies, Implementation (`/progress`), Workspace, Changes, Team sign-in, Edit data, Team accounts, and the server actions |
| Session refresh | `middleware.ts` | Refreshes Supabase sessions on platform pages. The passcode gate is unchanged and still off |
| Database | `supabase/migrations/20261108000000_platform.sql` | Tables, row-level security, no deletes, an append-only audit log |
| CI and deploy | `.github/workflows/team-edit.yml` (new), `verify.yml` (+ preservation), `vercel.json` (skip building `team-edit/*`), `package.json` (scripts, dependencies `@supabase/supabase-js`, `@supabase/ssr`, `zod`) | The gate for team edits |
| Content | 16 chapters, `content/platform.md` (new), the ledger and CHANGES, `scripts/ownership-2026-11/roles.mjs` + `apply.mjs` | The new roles, applied as exact, logged pairs |
| Docs | `CONTRIBUTING.md`, `docs/consolidation-2026-11/HOW-TO-UPDATE.md`, `.env.example`, this file, `TEAM-GUIDE.md` | The team edits on the site; Firefly runs the platform |

## 7. Team quick guide

See [`TEAM-GUIDE.md`](TEAM-GUIDE.md): signing in, the workspace, editing data, and reverting a mistake.

## 8. Assumptions and flags

1. **The live team functions need Firefly's setup** (section 3). Until then, production shows every public page and the data pack in full, and editing reports that it is not switched on. I could not create the Supabase project, the GitHub App or the Vercel secrets: they are Firefly's accounts. So **the team login and the editing paths were tested against the local development store, not against live Supabase.** The Supabase code paths compile and follow the same interface, but they have not run against a real project.
2. **Pushing and the tag.** This session could push only to its own branch, so shipping used pull requests merged into `main`. The rollback tag `pre-ownership-baseline` points at `a377ded`. A one-off workflow (PR #65) created it on GitHub, and the workflow was then removed. To roll back, reset to that tag.
3. **Data-pack edits are not instant.** Working records go live at once. An edit to a printed figure goes live after the gate and a rebuild, a few minutes later. "Charts update with no code change" holds; "with no deploy" does not, for the data pack.
4. **Editing analysis exports.** These files are outputs of the Python model. A model re-run (Firefly's) would overwrite team edits to them unless the change is carried into the model's inputs. The editor tells the team to tell Firefly.
5. **Open view versus the confidentiality terms.** Decision 3 makes everything visible to anyone with the link, and that includes the team's briefs and logs. The fine print (`annex-terms`) still says the proposal should not be circulated beyond the campaign. I left that text as it was; review it.
6. **Legal positions changed in `lawful.md`, as approved (F3).** The campaign's counsel should confirm them in the §19.2 scope memorandum.
7. **Older prose keeps its section numbers.** "Section 13.4" and similar references in the prose predate this work and were not renumbered. I added none; the new chapter and the platform pages carry no document numbering.
8. **Pre-existing issues I did not touch.**
   - The old toolkit page (`/tools`) links to tools that were never built, such as `/tools/winning-number`, which returns 404.
   - Dev builds show hydration and service-worker warnings on story pages.
   - The site's meta description ("Analysis, strategy and direction…, prepared by Firefly Management") is part of the branding, so it was left as it was.
9. **The headline was trimmed to one word under the 45-word lead limit.** It reads "Firefly Management offers a platform and asks for one week, one export."
10. **The ledger's kind label.** `CHANGES.md` labels each entry "Replaced (a figure or source superseded)". That is the existing tool's wording for any replacement. The note column gives the real reason.

11. **Speed and stale pages (fixed 8 November 2026).**
    - The sign-in session refresh had been added to `middleware.ts`, which runs before every page, and tripled its size (34.8 → 95.9 kB) for a feature that is switched off. `middleware.ts` is restored to the baseline exactly.
    - If team sign-in is switched on later, Supabase sessions refresh through the team's own actions. For sessions that must outlast an hour without an action, add a refresh scoped to the `/team` routes only, not to every page.
    - The site's service worker used to answer page loads from the copy saved on the phone. After a deploy, that copy can point at stylesheets and scripts the new deployment no longer serves, so it loads without its colours and waits on missing scripts. Pages are now fetched from the network first, falling back to the saved copy only when offline or slow. Its cache version is bumped to `v2`, which clears old saved pages.

## Self-check

- [x] Every Firefly task from Phase 1 is reassigned to the team and has a working site function; platform ownership stays with Firefly (section 2).
- [x] Everything is viewable without login. Every edit path is a server action that checks membership, tested by replaying a request without a session, and the database checks it again.
- [x] The team updates data without GitHub, and invalid data cannot be saved: it is refused on save, and the full checks gate `main`.
- [x] Every protected file is accounted for; no count dropped.
- [x] No invented data, polls, cost figures, finance material, remote framing, credentials section or document numbering was added. Platform pages show only what exists, and empty states say "nothing entered yet".
- [x] The single scrolling story and its order are intact. One chapter was added inside the delivery part.
- [x] No secrets in the repository.
- [x] `verify`, `check:preservation` and the build pass. The live check is in "Production check" below.

## Production check

PR #63 was merged as `d0cba49`. Vercel production deployment `dpl_8rVJpMG7cYz7ZxygVU7m1jqD2Uxu` is READY.

The live URL was checked through Vercel's fetch, because this session's network cannot reach the host directly:

| Live check | Result |
|---|---|
| `/explore?ds=figures` | 200; the figure registry renders |
| `/platform` (the new chapter) | 200; "Anyone with the link sees everything" and "What Firefly runs behind the scenes" render |
| `/engagement` | 200; the new role text ("Your team steers and publishes"); the old "Firefly steers" wording is gone |
| `/dashboards` | 200; data-pack charts render; team charts show "nothing entered yet" |
| `/strategies` | 200; the workstreams are listed |
| `/workspace` | 200; preview checked before the merge |
| `/team/login` | 200; "Team sign-in is not switched on yet" (Supabase not yet configured) |
| `/team/data`, logged out | Sent to sign-in |
| `/implementation` (a retired route, for old links) | Still lands on The goal |
| Vercel runtime errors since the deploy | None |

**A deploy problem found and fixed before the merge.** The first preview builds failed because `.vercelignore` keeps `/analysis/` out of the Vercel upload, and the new prebuild preservation check reported those files missing. The check now skips paths that `.vercelignore` excludes when it runs on Vercel; CI still checks them. A simulated Vercel build and the real preview both passed before the merge. **No rollback was needed.**

What remains for the team functions to work live: Firefly's setup in section 3.
