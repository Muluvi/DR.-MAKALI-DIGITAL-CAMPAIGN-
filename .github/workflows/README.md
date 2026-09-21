# CI

One workflow, `verify.yml`, on every pull request and every push to `main`.

It runs the four things that have to be true before a change reaches Vercel:

| Step | What it protects |
|---|---|
| `npm run lint` | The repo's own rules, including the React hooks rules that caught four real bugs in the visual pass |
| `npx tsc --noEmit` | Types, which `npm run verify` does not check |
| `npm run verify` | Eleven guards and 38 arithmetic assertions — see below |
| `npm run build` | That the site compiles at all |

**Make `verify` a required status check on `main`.** The workflow is only advice until it is.
Settings → Branches → add a rule for `main` → Require status checks to pass → select `verify`.

## What the eleven guards are for

Most of them exist because something got through once:

- **content-integrity** — every body line in `public/content/` is unchanged since the baseline,
  apart from declared retirements and quoted rewrites. This is the guard that makes "no text was
  removed" a fact rather than a claim.
- **figure-retention** — every figure present at the baseline still exists, and every figure that
  left the markdown still reaches the printed page. Two rules, two different questions.
- **figure-fences** — every ```figure fence resolves to a registered figure. Written after a
  malformed fence shipped an error banner where a retired ASCII block used to be, and neither
  other guard could see it.
- **duplicates** — the collapsed repetitions are re-derived from the content on every run, so a
  cross-reference can never point at a paragraph that has moved.
- **figures** — every numeric literal in the UI traces to the content or to a data module.
- **ward-register**, **analysis-exports**, **mounts**, **deep-links**, **visual-coverage**,
  **figures.test.ts** — arithmetic, provenance, and the links between them.

If one fails, read what it says before changing it. They are specific.
