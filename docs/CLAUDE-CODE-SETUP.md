# Claude Code setup — Kitui 2027 visual rebuild

## What this is

For Claude Code the effective artifact is not one long prompt. It reads your
repo, runs your build, and keeps project memory across sessions — so the brief
goes in `CLAUDE.md` once, the repeatable work becomes slash commands, and the
riskiest check gets its own subagent with an isolated context window.

## Install

Copy into the repo root:

```
CLAUDE.md
.claude/commands/audit.md
.claude/commands/convert.md
.claude/commands/map.md
.claude/commands/motion.md
.claude/commands/signature.md
.claude/commands/perf.md
.claude/commands/drift.md
.claude/agents/content-integrity.md
```

Commit them. `CLAUDE.md` loads automatically at the start of every session, so
the standing brief never has to be re-pasted. Verify with `/memory`.

Then drop in the batch-1 files from the previous session:

```
app/tokens.css
components/diagrams/ClosedLoopEngine.{tsx,module.css}
components/diagrams/FourHourCycle.{tsx,module.css}
components/diagrams/OperationalRhythm.{tsx,module.css}
components/diagrams/FieldDigitalSync.{tsx,module.css}
```

---

## The kickoff prompt

Paste this as your first message. Everything after it is slash commands.

```
Read CLAUDE.md, then orient yourself in this repo before doing anything.

Context you need: this proposal was built in Google AI Studio and has never had
a real front-end pass. Most structural diagrams are still fenced ASCII art in
monospace blocks — fixed-width character art that reflows badly on a phone,
cannot animate, cannot be themed, and is invisible to assistive technology. Four
of them have already been converted and are sitting in components/diagrams/,
along with a token layer at app/tokens.css. Those four are the standard the
remaining ~194 sections have to reach.

Start in plan mode. I want three things before you touch code:

1. Confirm the four existing diagram components and app/tokens.css integrate
   cleanly — typecheck, build, and tell me what breaks. They were written
   without access to this repo, so assume the import paths, the theme-toggle
   attribute, and the Focus Mode selector all need checking against reality.

2. Read enough of the content to tell me, in your own judgement, where the
   biggest gap is between what this document argues and how it currently looks.
   I have my own view. I want yours before I give you mine.

3. Propose the phase order. My working assumption is: audit → remaining ASCII
   conversions → Kitui ward map → Tier 1 CSS motion and View Transitions → the
   six signature moments → accessibility → performance. Tell me if you would
   sequence it differently and why.

Do not start Phase 0. Plan only.
```

---

## Run order

One phase per session. `/clear` between phases — a fresh context beats a
compacted one, and `CLAUDE.md` reloads automatically so you lose nothing that
matters.

| Session | Command | Notes |
| --- | --- | --- |
| 1 | *kickoff prompt* | Plan mode. Verify batch-1 integration. |
| 2 | `/audit` | Read-only. Produces `docs/visual-audit.md`. |
| 3 | `/convert` ×N | One diagram per turn. `/clear` every 4–5. |
| 4 | `/map` | Plan mode first. Approve the data model before it builds. |
| 5 | `/motion` | Target: zero added JS. |
| 6 | `/signature` ×6 | One per turn, separate branches. |
| 7 | `/perf` | Measured numbers only. |

Run `/drift` every few turns inside a long `/convert` stretch, and always before
merging a phase.

## Use these

- **`/plan`** (or Shift+Tab) before `/map` and before the first `/signature`.
  Both involve decisions that are expensive to unwind.
- **`/agents`** → run `content-integrity` before every merge. It has its own
  context window, so it reviews the diff cold rather than defending work it just
  wrote. That independence is the entire point — do not let the main session
  self-certify.
- **`/context`** when a session feels sluggish. `/clear` beats `/compact` here:
  compaction summarises, and summaries are exactly where "don't reword the
  prose" quietly becomes "prose was reworded".
- **`/rewind`** the moment a conversion goes wrong. Cheaper than arguing it back
  into shape.
- **`#`** to quick-add a durable decision to `CLAUDE.md` mid-session — e.g. once
  you approve the palette, `# Approved palette: <values>. Do not re-derive.`

## What to watch for

The failure mode on this project is not bad code. It is a model being helpful:
filling a placeholder because it looks unfinished, tightening a sentence because
it reads long, generating a plausible Kikamba string because the menu looks
empty without one, inventing ward data so the map renders with colour.

Every one of those is a well-intentioned improvement that damages the document.
`content-integrity` exists specifically to catch them, `/drift` exists to catch
them early, and both are worth the tokens.

## Two things not in the commands

**Fonts.** `tokens.css` names Archivo Variable and Martian Mono with system
fallbacks, so nothing is broken today, but neither is self-hosted. That lands in
`/perf` — subset, preload, no layout shift — rather than being bolted on early.

**The 60–90 second walkthrough.** A document sent without live context loses
most of its narrative power. A short recorded walkthrough at the top restores
it. That is a content decision for you, not an engineering one, which is why no
command covers it — but if you want it, it needs lazy-loading behind a poster
frame to survive the budget.
