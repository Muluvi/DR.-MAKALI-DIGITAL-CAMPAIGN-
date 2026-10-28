# Restructure change log

Decisions taken while carrying out `preview.md`, in the order they were taken. Where the brief said "make the most conservative choice, log it, and continue", the entry says what the choice was and why.

## Stage 1: inventory and mapping data

1. **Branch.** The brief names `restructure/toc-2026-10`. This session is provisioned to push only to `claude/new-session-giw0mo`, so all stage commits go there and the PR is opened from it. The branch name has no effect on the content or the merge.
2. **Inventory count.** 333 headings, 205 numbered and 128 run-ins, as the brief expects. A heading counts as numbered only at levels 2 and 3, the two levels the site indexes; a level-4 run-in that opens "1." (the ward lists in B.1, the component list in old 5.2.4.3) is a list ordinal, not a section number.
3. **Preview title errors.** Preview section 6 carries three titles damaged by an old regex ("Langua register", and "Sta:" twice). `mapping.json` keeps the content's own titles. Recorded in BASELINE.md.
4. **No `npm test` or `npm run typecheck` script.** The baseline used `npm run test:figures` and `npx tsc --noEmit`, and every later stage uses the same two commands.
