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
| `NEXT_PUBLIC_SUPABASE_URL` | Saving records | From the Supabase project, Settings, API |
| `SUPABASE_SERVICE_ROLE_KEY` | Saving records | Server only: never put it in a variable starting `NEXT_PUBLIC_` |
| `GITHUB_REPOSITORY_SLUG` | Edits from `/edit-data` | `owner/repo` of this repository |
| `GITHUB_APP_ID`, `GITHUB_APP_PRIVATE_KEY`, `GITHUB_APP_INSTALLATION_ID` | Edits from `/edit-data` | A GitHub App with Contents read/write on this repository only (preferred) |
| `GITHUB_EDIT_TOKEN` | Edits from `/edit-data` | Instead of the App: a fine-grained token, Contents read/write, this repository only |
| `PLATFORM_EDITING` | A vandalism clean-up | `paused` stops all saving for everyone; remove it to reopen |
| `ANTHROPIC_API_KEY` | The optional AI step | Unset, the instruction boxes work by rule at no cost. Set, wording they cannot place is reworded by Claude Haiku 5.5 |
| `AI_MONTHLY_REQUEST_LIMIT` | The optional AI step | Requests per server per month; default 1500 |
| `SITE_PASSCODE` | An optional gate | Off unless set; not sign-in, just a passcode in the first link |

## Steps

1. **Supabase.** Create a project (a region near Kenya, such as Europe or South Africa). In the SQL
   editor, run `supabase/migrations/20261108000000_platform.sql`, then
   `supabase/migrations/20261112000000_open_editing.sql`. Turn on daily backups (Database,
   Backups) and point-in-time recovery if the plan allows. Copy the URL and the service-role key
   into Vercel.
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
- **Monitoring.** Add an uptime check (Vercel's own, or any external checker) on `/status`, with
  alerts to Firefly's on-call phone.
- **Restore test.** Once a month, restore the latest Supabase backup into a scratch project and open
  a few records.

## Local development

```bash
npm ci
PLATFORM_STORE=local npm run dev      # saving works, to .platform-local/ (ignored by git)
npm run verify && npm run build       # the checks CI runs
```
