---
description: Content-integrity check. Run every few turns, and always before merging a phase.
---

Stop and verify. Answer each with evidence from the diff, not assurance.

1. `git diff` the branch against main, filtered to prose. Has any substantive
   sentence been changed, shortened or reworded? Quote any that have.
2. Does any visual contain a number that is not in the source content? List
   every figure you rendered and where it came from.
3. Was any Kikamba or Kiswahili string generated or altered? Diff against the
   placeholder register in `docs/visual-audit.md`.
4. Are all "Awaiting campaign decision" placeholders still present and visible?
   Count them and compare to the register.
5. Has an entrance reveal been added to any section that did not warrant one?
6. Is `noindex, nofollow` intact? Grep for any new outbound request — fonts,
   scripts, images, analytics.
7. Are you still inside the performance budget, by measurement?

If any answer is wrong, fix it before doing anything else. Do not carry a
content-integrity failure into the next turn.
