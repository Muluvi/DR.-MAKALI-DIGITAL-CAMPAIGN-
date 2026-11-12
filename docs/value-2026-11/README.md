# The value-proposition pass, November 2026

Steps 1 to 3 of the order of work in the website structure note (12 November 2026, second version):
the changes due before the link is sent. Two decisions from Firefly shape it: the site stays fully
open, with no public and team split, and interactive models are added for anyone with the link.

## What changed

| Step | Change | Where |
|---|---|---|
| 1 | Dependency advisories patched: Next.js 15.5.29 (the critical advisory), sharp 0.35.5, Zod 4.6.7, PostCSS 8.5.28 inside Next by an override | `package.json`, `package-lock.json` |
| 2 | The ask is one decision, the first phase; the decision figure shows the six implementation phases | `content/brief.md`, `content/ask.md`, `lib/register/specs/s6-nextsteps.ts` |
| 2 | What you get and what you provide opens on the four layers of the offer; Firefly's deliverable names the service around the platform; what must be true before Discovery | `content/receives.md`, `lib/heading-slug.ts` |
| 2 | The platform in one view adds the Models area, and what is live, what switches on and what is still to build | `content/platform.md` |
| 2 | Fine print: an open site is not confidential; the request not to republish stays | `content/annex-terms.md`, `components/ClientPage.tsx` |
| 2 | Timeline re-anchored: the September 2026 signature has passed; new Section 14.9 lays the platform's rollout from the week the first phase is approved, against the gazetted dates | `content/timeline.md` |
| 3 | `/models` hub and five live models: winning number and polling-agent cover (moved from `/tools`, old URLs redirect), ward priority, send check, rollout planner | `app/(platform)/models/`, `components/models/`, `lib/models/` |
| 3 | `/tools` is one light hub of reference tools; the dark toolkit page and its "Not built yet" cards are retired from the route | `app/tools/page.tsx`, `components/platform/ToolsIndex.tsx`, `components/platform/PlatformShell.tsx` |

Every content change is logged in `ledger.json` (rendered in `CHANGES.md`) and applied by
`scripts/value-2026-11/content-fixes.mjs`, which `npm run check:content` runs with `--check`.
Where this pass reworded text an earlier pass wrote, `scripts/value-2026-11/superseded.mjs` lets that
pass's `--check` accept it, and only when the later rewrite is in place.

## The models

Each model's arithmetic is a pure function in `lib/models/`, called by its page and by
`lib/models/models.test.ts` (`npm run test:models`, part of `npm run verify`). Same inputs, same outcome.

| Model | Status | Stands on |
|---|---|---|
| Winning number | Live | IEBC 2022 register by constituency; benchmark and turnout from the registry |
| Polling-agent cover | Live | IEBC 2022 station list |
| Ward priority | Live | Ward register, station list, the scorecard's itemised projects by ward |
| Send check | Live | The dispatch collection's own rules (`lib/platform/collections.ts`) |
| Rollout planner | Live | The gazetted race calendar |
| Reach by channel | Planned | Channel reach and connectivity figures |
| Weekly brief mix | Planned | Message architecture and segments |
| Response tier | Planned | Escalation ladder and runbooks |
| Record finder | Planned | County projects register |

The plain-language AI layer over the models (step 4) is not built: it waits on an AI service and a
usage ceiling. The models work without it, and it will never produce a number of its own.

## Decisions taken for this pass

The structure note left four decisions open. This pass builds on:

1. **Two layers.** Models calculate; an AI layer, later, only sets options and explains outcomes.
2. **Phases in the decision, levels in the plan.** "The decision" asks for the first phase only. The
   three scope levels stay, and are set once Discovery is complete. Section 21.1 was not moved out
   of its chapter, to keep this pass to rewording.
3. **Firefly runs no channel.** The site's line is unchanged.
4. **Who pays for AI use on an open link** is not needed until step 4.

## Not done here

- Making the source repository private: a repository setting, not a code change.
- The new chapter "How the platform reaches all 40 wards", embedding models in their chapters, and
  the four planned models (step 5).
- Live sign-in, scoped edit roles, staging, backups and monitoring (step 6).
