"""Stage 3, X7: the nomination window, said once (brief 2026-10 declutter, 5.4 and section 6)."""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
from edit import cut, replace, _log, first12, words

CHIP = "<window-chip></window-chip>"
HOME = "evidence:2.5.1|evidence:2.5.2"

# The home (2.5) grades the selection method but never states the timing. The one full statement of
# it moves there from the 1.1 callout, verbatim, before any restatement is cut to the chip.
moved = ("The Wiper flagbearer decision is expected to be settled by a party-run countywide selection "
         "in the final quarter of 2026 — late October to November on the reported timetable (Tier 3, Section 2.5.2).")
replace("decision", "1.1",
        "> **What sets the pace.** The Wiper flagbearer decision is expected to be settled by a party-run\n"
        "> countywide selection in the final quarter of 2026 — late October to November on the reported timetable\n"
        "> (Tier 3, Section 2.5.2). That date is not in the campaign's gift",
        f"> **What sets the pace.** {CHIP} That date is not in the campaign's gift")
replace("evidence", "2.5.1", "\nSection 1.2 opened with the claim this entire Phase −1 strategy is built on:",
        f"\n{moved}\n\nSection 1.2 opened with the claim this entire Phase −1 strategy is built on:")
_log({"file": "decision", "section": "1.1", "first12": first12(moved), "words": words(moved) + 3, "kind": "moved",
      "home": "evidence:2.5.1", "to": "evidence:2.5.1", "text": moved,
      "note": "The window's one full statement moves to its home (2.5.1), which graded the method but did not state the timing. In 1.1 it becomes the window chip (X7). The 3 extra words are the callout's > markers."})

cut("decision", "1.1",
    "The Wiper\nflagbearer decision is expected to be settled by a party-run countywide selection in the final\nquarter of 2026 (reported, Tier 3).",
    kind="chip", home=HOME, new=CHIP, note="X7: restatement of the nomination window.")
cut("decision", "1.1",
    "The ticket is expected to be settled by a party-run countywide selection in the final\nquarter of 2026 — reported, and **not confirmed by the party** (Tier 3; Section 2.5.2 sets out what\nwould confirm it).",
    kind="chip", home=HOME, new=CHIP, note="X7: restatement of the nomination window; 2.5.2 grades it 'not confirmed by party officials' and sets out what would confirm it.")
cut("decision", "1.2",
    "Wiper Patriotic Front party consensus and selection window, reported for late October to November and not confirmed by the party (Tier 3, Section 2.5).",
    kind="chip", home=HOME, new=CHIP, note="X7: restatement of the nomination window.")
cut("decision", "1.8",
    "**The decision falls in the final quarter of 2026 — late October to November.**",
    kind="chip", home=HOME, new=CHIP, note="X7: assumption 2's statement of the window.")
cut("delivery", "4.2.1",
    "flagbearer decision, which party sources indicate is intended to conclude\nwithin the final quarter of 2026.",
    kind="chip", home=HOME, new=f"flagbearer decision {CHIP}.",
    note="X7: restatement of the nomination window. 'Party sources indicate' is the report 2.5.2 grades Tier 3, single-source.")
print("window: done")
