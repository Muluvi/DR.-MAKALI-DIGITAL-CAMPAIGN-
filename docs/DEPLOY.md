# Putting the site live

Everything below is done once, by Firefly, in Vercel, Supabase, GitHub and (optionally) Anthropic.
The code needs nothing more: every switch is a setting, and the site tells visitors what is on and
what is off (`/status`).

## What works with no settings at all

The story, the data explorer, dashboards, the reference tools, all nine models and their
instruction boxes, help, status and privacy. Saving is off, and the pages say so.

## The settings

Set these in Vercel: Project, Settings, Environment Variables (Production, and Preview if wanted).
`.env.example` lists the same names.

| Setting | Needed for | Notes |
|---|---|---|
| `NEXT_PUBLIC_SITE_ORIGIN` | Links and the sitemap | The site's public address, e.g. `https://dr-makali-digital-campaign.vercel.app` |
| `BLOB_READ_WRITE_TOKEN` | Saving records (simplest) | Set by Vercel itself when a Blob store is connected to the project (step 1) |
| `NEXT_PUBLIC_SUPABASE_URL` | Saving records (alternative) | From a Supabase project, Settings, API; used instead of Blob when set |
| `SUPABASE_SERVICE_ROLE_KEY` | Saving records (alternative) | Server only: never put it in a variable starting `NEXT_PUBLIC_` |
| `GITHUB_REPOSITORY_SLUG` | Edits from `/edit-data` | `owner/repo` of this repository |
| `GITHUB_APP_ID`, `GITHUB_APP_PRIVATE_KEY`, `GITHUB_APP_INSTALLATION_ID` | Edits from `/edit-data` | A GitHub App with Contents read/write on this repository only (preferred) |
| `GITHUB_EDIT_TOKEN` | Edits from `/edit-data` | Instead of the App: a fine-grained token, Contents read/write, this repository only |
| `PLATFORM_EDITING` | A vandalism clean-up | `paused` stops all saving for everyone; remove it to reopen |
| `ANTHROPIC_API_KEY` | The optional AI step | Unset, the instruction boxes work by rule at no cost. Set, wording they cannot place is reworded by Claude Haiku 5.5 |
| `AI_MONTHLY_REQUEST_LIMIT` | The optional AI step | Requests per server per month; default 1500 |
| `SITE_PASSCODE` | An optional gate | Off unless set; not sign-in, just a passcode in the first link |

## Steps

1. **Storage (about a minute).** In Vercel, open the project, then **Storage**, **Create**,
   **Blob**. Name it `dr-makali-campaign-records`, choose **Private**, pick the **Cape Town
   (cpt1)** region, and connect it to this project for Production and Preview. The site's server
   code runs in Cape Town too (`vercel.json`), the closest Vercel region to Kenya, so server and
   data sit together. Vercel adds `BLOB_READ_WRITE_TOKEN` itself; nothing to
   copy. Records and the change history are kept as private files only the site's server can read
   (`lib/platform/store/blob.ts`); nothing is ever deleted.
   *Alternative:* a Supabase project instead. Run `supabase/migrations/20261108000000_platform.sql`
   then `supabase/migrations/20261112000000_open_editing.sql` in its SQL editor, turn on daily
   backups, and put its URL and service-role key in Vercel. When both are set, Supabase is used.
2. **GitHub.** Make this repository private (Settings, General, Danger zone: Change visibility). The
   site itself stays open to anyone with its link; only the source becomes private. Then create the
   GitHub App or the fine-grained token and put its values in Vercel. The `team-edit` workflow
   already checks every edit from the site before it reaches `main`.
3. **Anthropic (optional).** Create an API key in the Anthropic Console, set a monthly spend limit
   there, and put the key in Vercel. Have the campaign's data-protection reviewer note the AI step
   first (Lawful and ethical, Section 19.2).
4. **Redeploy** from Vercel so the settings take effect, then open `/status`: the database should
   read *Working*, and saving *Open to anyone with the link*.
5. **Try it.** Add a test record in the workspace, see it in the change history, put it back.

## Running it

- **Watch the change history** (`/history`) every day. Anyone with the link can edit; an unwanted
  change is put back from there. During a flood, set `PLATFORM_EDITING=paused` and redeploy, put the
  changes back, then remove the setting.
- **Record incidents** in `lib/platform/incidents.ts`; `/status` lists them.
- **Monitoring** is built in: `.github/workflows/uptime.yml` loads the live site every 30
  minutes; a failed run emails the repository's owner. Turn on GitHub's mobile notifications for
  failed workflows to get it on a phone.
- **Backups.** With Blob storage, nothing is deleted and every change is kept in the change
  history, which is the record of every version. Once a month, export the store (Vercel, Storage,
  the store, Browse) as a dated copy. With Supabase, restore the latest backup into a scratch
  project once a month and open a few records.

## Local development

```bash
npm ci
PLATFORM_STORE=local npm run dev      # saving works, to .platform-local/ (ignored by git)
npm run verify && npm run build       # the checks CI runs
```
