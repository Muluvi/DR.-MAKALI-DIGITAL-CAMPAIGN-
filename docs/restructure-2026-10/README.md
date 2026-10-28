# October 2026 restructure: decision-first table of contents

The approved plan is `preview.md`. Everything else in this folder records how it was carried out.

| File | What it holds |
|---|---|
| `preview.md` | The approved preview: new table of contents (section 5), mapping (6), change log (7), retained repetition (8), conflicts (10.1). |
| `mapping.json` | Preview section 6 as data: 333 rows, one per old heading. |
| `BASELINE.md`, `baseline-snapshot.json` | The state before anything moved, and what every check compares against. |
| `CHANGELOG.md` | Every decision taken in carrying out the plan, with word counts cut and conservative choices logged. |
| `OPEN-ITEMS.md` | Conflicts C1 to C8, every `[CHECK REF]`, and the content irregularities left as found. |
| `TODO-dates.md` | Dates that were in the future when the document was written and have now arrived. |
| `citations.csv` | Every cross-reference the renumbering changed, before and after. |

## Scripts

    node --experimental-strip-types scripts/heading-inventory.ts            # count headings in content/
    node --experimental-strip-types scripts/heading-inventory.ts --strict   # fail on a repeated number or a fourth numbered level
    python3 -I scripts/restructure-2026-10/parse-mapping.py                  # preview section 6 -> mapping.json
    node --experimental-strip-types scripts/renumber-citations.ts           # rewrite "Section N.N" citations to the new numbers
    node --experimental-strip-types scripts/renumber-citations.ts --check   # fail if a run would change anything
