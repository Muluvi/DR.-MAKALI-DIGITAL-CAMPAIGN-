# The Campaigner Network

At least two campaigners in every one of Kitui's 247 villages, in a single line of command from Dr. Makali to the village. A parallel Special Groups chain sits beside it. The site tells the story in the scroll. A private tool at `/network` registers campaigners, shows coverage gaps, allocates duties and receives field reports.

## What is where

| Part | Files |
|---|---|
| Reference data (public, versioned) | `data/network/kitui-villages-act-2015.schedule.txt` (the Act's schedule, verbatim; the only hand-edited file), `data/network/kitui-villages.v1.json` (built by `scripts/network/build-villages.mjs`), `data/network/ward-reconciliation.json` |
| Structure, coverage, policy, service | `lib/network/` (`structure.ts`, `coverage.ts`, `policy.ts`, `service.ts`, `channels.ts`, `ussd.ts`, `conduct.ts`, `groups.ts`, `templates.ts`) |
| Tests | `lib/network/network.test.ts` (29 tests), `scripts/network/scan-personal-data.mjs`; both run in `npm run test:network` and `npm run verify` |
| Private database | `supabase/migrations/20261109000000_network.sql` (14 `net_*` tables, RLS on, no policies, so only the service role can reach a row) |
| Story figures | `components/network/story.tsx`, placed by `figure` fences in `kitui.md` (Data), `votes.md` (Analysis), `goal.md` (Objectives), `channels.md` and `voters.md` (Strategies), `engagement.md` (Implementation); additions logged in `docs/network-2026-11/ledger.json` |
| Public aggregate | `GET /api/network/coverage`: counts and states only |
| Private tool | `app/(platform)/network/*`, `components/network/tool.tsx`, `app/api/network/{export,photo,ussd}` |

## Access model

Every read, write and export goes through `lib/network/service.ts`, which checks `lib/network/policy.ts` on the server. The database refuses every key except the server's service role.

| Who | Sees and does |
|---|---|
| Anyone | The story and `/api/network/coverage`: counts and states by constituency and ward, seat states by village. No names, numbers, contact routes, ids or reports. |
| Campaign Command | Everything county-wide; issues tasks; broadcasts; owns urgent flags; decides eligibility; exports (logged); reads the audit log. |
| Constituency Coordinator / Deputy | People, reports and groups in their constituency. Coordinators appoint ward and village seats there. |
| Ward Coordinator / Deputy | People, reports and groups in their ward. Coordinators appoint village seats there. |
| Village Lead / Campaigner | Their own record, tasks and reports. |
| Group leads | Their own group chain (county lead: their group type county-wide; constituency lead: type within constituency; ward rep: type within ward). |
| Dr. Makali | The one-screen digest and county totals. No individual campaigner queue. |
| Firefly (platform owner) | Appoints the first Command members and Dr. Makali's seat. Nothing else. |

Audit log entries cover contact-list views, edits, exports, role changes, eligibility decisions and settings. An entry never holds a name, phone number or report text.

## Data flow

- **Down.** Command issues a task to a target (level, constituency, ward, village, role or group type). Every person holding a matching active seat gets one assignment. The task shows in the app, and is pushed by WhatsApp and USSD only where those channels are connected. Every push is recorded as `sent` (the provider accepted it) or `failed` (with the reason). Nothing is recorded as delivered.
- **Up.** A field report carries the reporter's ward, or their group chain. Their ward coordinator sees it. Ward summaries roll up to the constituency, Command and the digest.
- **Skip-level.** Urgent flags (safety, misconduct, an unresponsive coordinator) go straight to Command. Each gets a named Command owner and an open/closed state.
- **Broadcasts** may carry Dr. Makali's words to every campaigner. A reply routes to the sender's ward coordinator, or the next seat up their line. It never reaches him.

## How to enable the private tool

The tool is **off**. Every private route answers 404 until all of these are done:

1. **Database.** Run `supabase/migrations/20261109000000_network.sql` on the existing Supabase project (SQL editor or `supabase db push`). It creates the tables, the private `network-field-photos` bucket and `net_purge_expired()`.
2. **Phone sign-in.** In Supabase → Authentication → Providers → Phone, enable phone sign-in and connect an SMS provider. Twilio, MessageBird, Vonage and Textlocal are built in; Africa's Talking works through Supabase's Send SMS hook. Codes then go only to numbers already on the register.
3. **Access checks against the live database.** Sign in as a test ward coordinator and confirm another ward's people and reports are absent. Sign in as a test village campaigner and confirm only their own record shows. Confirm `/api/network/export` returns 403 for everyone but Command. Then delete the test records. The automated equivalents are in `lib/network/network.test.ts`.
4. **Kenyan counsel** confirms ODPC registration as a data controller, the consent wording, the handling of political association as sensitive data, and the retention date (see the launch checklist on `/network/admin`).
5. **Switch on.** Set `NETWORK_PRIVATE=on` in Vercel (Production) and redeploy.
6. **First accounts.** A Firefly admin (`FIREFLY_ADMIN_EMAILS`, with `PLATFORM_TEAM_LOGIN=on`) signs in at `/team/login`, opens `/network`, and registers the Campaign Command members and Dr. Makali's seat with consent. Command registers everyone else.

## What the owner must provision

| Item | Where | Needed for |
|---|---|---|
| The migration above | Supabase | Everything private |
| SMS provider for Supabase Auth phone codes | Supabase → Auth | Sign-in |
| `NETWORK_PRIVATE=on` | Vercel env | Switching on |
| `WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_TEMPLATE` (an approved utility template with one body parameter), optional `WHATSAPP_TEMPLATE_LANG` | Vercel env | Task and broadcast pushes on WhatsApp. Without them the tool says "WhatsApp not connected" and sends nothing. |
| `USSD_WEBHOOK_SECRET`, plus the gateway's callback set to `https://<site>/api/network/ussd?key=<secret>` | Vercel env + USSD gateway | Feature-phone acknowledgement and numeric reports |
| Optional `USSD_PUSH_URL`, `USSD_PUSH_KEY` | Vercel env | Outbound USSD push, only if the gateway offers one |
| A daily `select net_purge_expired();` after the election (pg_cron) | Supabase | Retention. Command can also run it from `/network/admin`. |

## Reconciliation with the site's ward data

All 40 Act wards match the 40 IEBC register wards one-to-one (`data/network/ward-reconciliation.json`). Neither dataset was renamed. Differences:

| Act code | Act name | Site name | Difference |
|---|---|---|---|
| 333 | Muumoni | Mumoni | Spelling (ward-keys already lists Muumoni as an alias) |
| 340 | Mwingi Central | Central | Name |
| 360 | Nzambani | Nzambani | **Code**: the boundary file's `wardcode` for Nzambani is 361 |
| 361 | Chuluni | Chuluni | **Code**: the boundary file's `wardcode` for Chuluni is 360 |
| 366 | Mutomo/Kibwea | Mutomo | Name (alias already listed) |
| 369 | Kanziku/Simisi | Kanziko | Spelling and name (alias already listed) |

**Content conflict, left for the owner.** `content/kitui.md` (How the county is run) still says "No verified figure is available yet" for the number of villages. The Act's schedule gives 247. The new figure sits directly after that paragraph. The paragraph is unchanged, because existing text is not rewritten without a decision.

Village names repeated in different wards remain separate records, keyed by code: Mutanda (15, 105), Mathyakani (62, 74), Ngiluni (88, 123) and Kitoo (206, 214). Base names also repeat (for example Ngungi, Ithumula, Kyanika, Nguuni).

## Safeguards built in

- **Never collected:** ID numbers, voter card numbers, voting intention.
- **Consent** (who, when, purpose, channel) is required before a record is stored.
- **Correction, withdrawal and deletion:**
  - Withdrawal erases the person's details and ends their seats at once.
  - Deletion removes the record. Reports stay, unlinked from the person.
  - A retention date is set by Command (default 90 days after 10 August 2027).
- **Eligibility:**
  - Serving Village, Ward and Sub-County Administrators and other county public officers are refused, and nothing is stored.
  - The declaration "I am not a serving public officer barred from partisan political activity." is required.
  - Teachers, chiefs, community health workers, others paid from public funds, and anyone unsure are held for Command to decide. Their seat does not count until Command clears them.
- **Conduct:** tasks, templates, broadcasts and reports are refused if they involve:
  - money or goods to voters;
  - collecting voter cards or IDs;
  - intimidation;
  - ethnic messaging;
  - partisan activity during worship.

  A report of someone else doing these things goes through Report misconduct.
- **Field signals** carry their own squared aqua label, separate from the evidence-tier pills. They are never presented as opinion research, vote estimates or official data.
- **Groups:** a leader's contact needs consent. An institutional endorsement needs a written reference. Faith and community leaders take part as individuals.
- **No caching on devices:** private pages and the network API are excluded from the service worker and sent `Cache-Control: private, no-store` and `Referrer-Policy: no-referrer`.

## Assumptions

- **Field structure count.** The "minimum field structure" (590) counts constituency, ward and village seats. Dr. Makali and Campaign Command are excluded, as the brief's own arithmetic does.
- **Coverage states.** A unit's seats include its own leadership seats and every seat below it.
  - **Vacant:** no seat is held.
  - **Partial:** some seats are held, but not every seat group meets its target.
  - **Minimum met:** every seat is held, and exactly at target.
  - **Above minimum:** every seat is held, with more people than the target.
- **Targets** only rise: from 2 up to 50 per village, for a village or for every village in a ward.
- **Who appoints.** Coordinators appoint; deputies read.
- **Single shell.** The private tool lives inside the existing platform shell at `/network`, rather than in a new app shell. The story stays one scroll; its figures link no private data.
- **WhatsApp is outbound only.** It carries the task and a link into the phone-first tool. Acknowledgement and reports by reply happen in the app or over USSD. No WhatsApp inbound handling was built, and the story's WhatsApp preview shows exactly that.
- **USSD gateway.** The callback follows the Africa's Talking convention (`sessionId`, `phoneNumber`, `text`, `CON`/`END`).
- **Youth.** The youth flag means 18 to 35, self-declared.
- **Objectives.** The five objectives are read from `lib/register/specs/s1-objectives.ts`. The only change there is that `OBJECTIVES` is now exported; its contents are unchanged.
- **Content guard.** `scripts/declutter/check-content.mjs` check 3 now accepts an added figure fence only if it is logged (kind `added-figure`). Every base fence must still be present and unchanged.
- **Local development.** `PLATFORM_STORE=local` with `NETWORK_PRIVATE=on`, `PLATFORM_LOCAL_SECRET` and `NETWORK_LOCAL_CODE` runs the tool on a git-ignored file store. It is refused on Vercel.
