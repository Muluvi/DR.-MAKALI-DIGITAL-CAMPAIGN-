"""Stage 3, X9: tab intros that repeat the navigation blurb (brief 2026-10 declutter, 5.4)."""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
from edit import cut, section

# Each intro is a "what this part covers" line. The chapter marker prints the tab's blurb directly
# above it; the facts it names are stated in full in the sections listed as its other homes.
INTROS = {
    "decision": "nav-blurb:decision|1.1",
    "evidence": "nav-blurb:evidence|2.1|2.2|2.9.1|2.8.2|2.10.1|2.10.2",
    "strategy": "nav-blurb:strategy",
    "delivery": "nav-blurb:delivery|4.3",
    "staffing": "nav-blurb:staffing",
    "measurement": "nav-blurb:measurement|5.2|5.2.1",
    "risks": "nav-blurb:risks",
}
for tab, home in INTROS.items():
    intro = section(tab, "(intro)").strip()
    assert "\n\n" not in intro, (tab, intro[:80])
    cut(tab, "(intro)", intro, kind="blurb", home=home,
        note="Tab intro: the chapter marker prints the navigation blurb directly above it (X9).")
    print(tab, "cut:", intro[:70])
