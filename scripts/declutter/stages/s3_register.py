"""Stage 3, X10: intensifiers deleted where they stand in a sentence that is otherwise kept.

Only deletions: no word is substituted. "Strictly" is kept where it states a prohibition ("strictly
prohibited", "strictly forbidden"), because there it is the rule, not an intensifier. The framing
the plan replaces wholesale (2.1, 2.3, 3.1, 3.5, 3.6.3, 4.5.2, 4.5.7, 5.1.1) is cut with its tab.
"""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
from edit import cut

for f, n, old, new in [
    ("annex-spec", "G.4", "while adhering strictly to", "while adhering to"),
    ("decision", "1.2", "and strictly traceable targets", "and traceable targets"),
    ("risks", "6.2.3", "are strictly bound by", "are bound by"),
    ("risks", "6.2.3", "must strictly reference", "must reference"),
]:
    cut(f, n, old, kind="register", new=new, note="X10: intensifier deleted.")
print("register: done")
