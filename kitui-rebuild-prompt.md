Kitui 2027 — Complete Rebuild Prompt

Save as: kitui-rebuild-prompt.md in the repo root. Paste the whole thing into Claude Code, opened against Muluvi/DR.-MAKALI-DIGITAL-CAMPAIGN-. This document is self-contained. It supersedes the earlier prompts. Where this document and anything already in the repo disagree, this document wins on intent and the repo wins on fact — see Phase 0.

Contents. A: Role and context · B: Non-negotiables · C: Structure · D: Visual vocabulary · E: Visual system · F: Layout and page structure · G: Imagery and media · H: Interface components · I: Motion · J: Accessibility · K: Performance · L: Kenya mobile-first · M: Chart craft rules · N: Figure register · O: Data layer, components, anchors · P: Structural rebuild checklist · Q: Quality bar · R: Process · S: Verification gates · T: Report · U: Self-check · Appendices: chart chooser, QA checklist, tools.

---

A. Role and context

You are a senior data-visualisation engineer and political-communications editor working as one person. You have shipped election graphics for a national newsroom's data desk. The standard is the Financial Times and Economist graphics desks: every chart states its finding in its title, shows its source, and survives being read on a phone. You build in Next.js with accessibility and low-bandwidth performance as defaults, not afterthoughts. You are strict with evidence: you never invent a figure, you label every modelled number, and you show missing data as missing.

You have file access to the repo. You will use it. Nothing in this prompt is a fact about the repo until you have verified it there.

What the site is. A confidential, link-only proposal from Firefly Management to Hon. Dr. Benson Makali Mulu (PhD Economics; MP for Kitui Central since 2013; 2027 Kitui gubernatorial aspirant). Live at https://dr-makali-digital-campaign.vercel.app/, with a one-page version at /full, deployed from this repo on Vercel.

Who reads it. One person: Dr. Mulu, an economist and monitoring-and-evaluation specialist. He opens the link himself, on a phone on mobile data or a laptop on wifi, with no one from Firefly present. The site makes the whole case on its own. He will notice a number that disagrees with another number.

What Firefly proposes. A three-step engagement: Analyse (Week 1, audit his channels against the race); Strategise (Weeks 2–3, define what to post, for whom, in which language, on which channel, and why); Direct (Week 4 on, his team keeps publishing; Firefly issues the weekly brief, approves the calendar, reviews performance). Firefly publishes nothing on his accounts and holds no credentials to them. The only channel Firefly operates directly is the offline layer it already holds: a WhatsApp Business API line and a USSD shortcode.

What is wrong with the current site. It opens with a verdict before evidence, then repeats itself. Numbering runs 0, 2, 1A, 3A, with §1 at the end. It leans on opinion polls throughout, yet its own §3.1.5 says the Mizani rounds published no sample size, and Firefly is commissioning no polling. The argument must rest on data that already exists: the IEBC register, certified results, the census, CA/KNBS connectivity data, county fiscal documents, the parliamentary record, the NG-CDF project record, and public channel data. It is text-heavy; visuals should carry the argument.

---

B. Non-negotiables

These override everything else. Each is enforced by the build, not by review.

1. No polls in the argument. Published polls appear only in Annex C, labelled "for reference only", each with method limits. Never join polls from different pollsters into one trend line. No poll share in the cover, objectives, analysis, strategy, models or KPIs. No weekly-gain slider. No new polling, surveys, or "commissioned recognition data". Where the site currently promises these, replace with the named data gap and the existing document that would close it.
2. No money for the engagement. No fees, costs, budgets, prices or spend figures for Firefly's work or the campaign's. No campaign-finance or spending-ceiling material. Replace "spend" with "effort", "budget commits" with "effort commits". The county's own FY2026/27 fiscal envelope is county data, not engagement cost, and stays.
3. No "remote" framing. No credentials or past-client section.
4. Prose is removed only two ways. Either the cuts-and-moves table explicitly cuts it, or a visual now does its job. In the second case, the visual plus a one-sentence takeaway replace the prose. Prose that can't be converted stays in full. Log every removal.
5. Every figure has a source and a tier (T1/T2/T3, defined in Phase 0 from the repo). Modelled figures are marked modelled. Missing data is [DATA NEEDED — source], never estimated.
6. One source of truth. Every number in prose, chart, tile or table reads from the repo's data layer. No numeric literal in copy. Where a figure in this prompt disagrees with the repo's sourced data, the sourced data wins and you report the discrepancy.
7. Don't break the live link. New branch. No merge to production. Deliver a Vercel preview.
8. Keep what works. noindex, nofollow; confidentiality notice; /full; search; print/save-as-PDF; section deep links with copy-link; the chart/table/CSV toggle pattern.
9. Every visual does a job text cannot do as well. It shows a shape, a sequence, a relationship, a place, a person or a feeling. If it only decorates, cut it.

---

C. Structure

Rebuild navigation, numbering, the /full route and all cross-references to this structure. Section titles and subtitles are final copy. Subsection titles are final unless the content you find makes one inaccurate; if so, flag it.

Cover. Kitui 2027: Analysis, Strategy and Direction for Dr. Mulu's Digital Operation — prepared for, prepared by, date, one-line confidentiality note. Full terms move to Annex G. Replace the current stat strip with four data-only figures: 605,703 registered voters (July 2026); ≈200,000–225,000 votes to win; 51.7% of the register in Mwingi and Kitui South; both Wiper rivals have already won a countywide election.

1. Objectives. What this engagement is for, and how success will be judged
1.1 The goal: the Wiper ticket first, the county second
1.2 The two deadlines: the nomination window (Q4 2026, reported) and the general election (10 August 2027)
1.3 Five objectives: be known where he isn't yet (Mwingi, Kitui South); turn his record into visible proof; build a direct line to the voters the internet doesn't reach (120,000 consented contacts); give every post a voter, a ward and a reason; hold the home base while Kitui Central runs its own race
1.4 How this proposal is built: the same order as the engagement (data, analysis, strategy, direction)
1.5 How success will be judged: measures Firefly can observe on his channels and the SMS list, not poll shares

2. The Data. What the official record shows, graded by source, with no new polling
2.1 The electorate · 2.2 How Kitui has voted · 2.3 The nomination rules and the calendar · 2.4 The county's people and economy · 2.5 The budget the next governor runs · 2.6 How people get information · 2.7 Who owns the airwaves · 2.8 Dr. Mulu's public record · 2.9 His channels today, and his rivals'

3. The Analysis. The winning number, where it lives, and why he isn't yet reaching it
3.1 The number it takes · 3.2 Where the votes are · 3.3 Four routes to the number · 3.4 Where he is known and where he isn't · 3.5 What his rivals have already proven · 3.6 Where party loyalty won't carry him · 3.7 The three regions · 3.8 What each channel can physically reach · 3.9 What his current presence shows · 3.10 What the data can't yet tell us · 3.11 The diagnosis, and the evidence that could overturn it

4. The Strategy. Each choice tied to the finding it answers
4.1 The position · 4.2 Where the effort goes · 4.3 Who we are trying to move · 4.4 What we say, and in which language · 4.5 What gets published · 4.6 Which channel does which job · 4.7 Fix first: six profile corrections · 4.8 When the plan changes

5. Implementation. Who does what, when, and how it's checked
5.1 Who owns what: fourteen workstreams · 5.2 The workstreams in detail (5.2.1 Platforms and content; 5.2.2 Publishing and earned media; 5.2.3 Ground and offline reach; 5.2.4 Data and technology) · 5.3 The first four weeks · 5.4 The phases to August 2027 · 5.5 What Dr. Mulu receives, and how often · 5.6 How progress is measured · 5.7 How decisions are made · 5.8 Risks and responses · 5.9 How the work is staffed

6. Next Steps. What the campaign provides, and the decision requested
6.1 What this needs from the campaign · 6.2 Open items · 6.3 The decision: one week and one export

Annexes. A. Evidence standard · B. County reference · C. Published opinion polls (reference only) · D. Message assignment · E. Cadence and escalation · F. Response runbooks · G. Terms and confidentiality

Cuts and moves. Old sections not itemised below move intact, then receive the visual treatment.

Old New
Hero stat strip, incl. "15.3 points behind" Four cover figures
§0.1 The ask 6.3, trimmed
§0.2 Why the answer cannot be "later" Cut; urgency restated from the calendar in 1.2
§0.3 Who owns what Merge into 5.1
§0.4 What this asks of the campaign Merge into 6.1
§0.5 Who this is for Cover and Annex G
§2.1 The mandate Cut prose; M&E/verification asset → 4.1
§2.2 Governing constraint, weekly-gain slider, poll table Cut slider and poll table; nomination calendar → 1.2 and 2.3
§2.3 Operating conditions Cut (covered in 2.6, 2.7, 3.8)
§2.4 Commitments Fold into 5.5–5.7
§1A.1–1A.3, §1A.6 Condense into 5.3 as the Week 1 plan
§1A.2.4 Channels found 2.9
§1A.2.5 Profile hygiene Findings → 3.9; fixes → 4.7
§1A.4 Decision rules 4.8
§1A.5 Four audit figures Visuals in 3.9
§3.1.1–3.1.2 Nomination method 2.3
§3.1.3–3.1.4 Party poll method; weighting Cut. One line on sample weighting may survive in 5.8 as a party-engagement risk
§3.1.5 Polling gap Annex C
§3.1.5a Home-base contest; party flow 3.6
§3.1.6 Delegate-primary contingency 5.8
§3.3.1 Candidate record 2.8 (facts); 4.1 (positioning use)
§3.3.2 The field Rebuild as 3.5 on certified results; eligibility → 5.8
§3.3.3 Register 2.1; full 40-ward list → Annex B
§3.3.4 County budget 2.5
§3.3.5 People and connectivity 2.4 and 2.6
§3.3.6 Results 2.2
§3.4.1 The number it takes 3.1
§3.4.2 Ward ranking and scenario model 3.2. Cut "current measured preference". The "competitive general election" scenario stays only if labelled modelled and not a win probability
§3.4.3 Four routes 3.3
§3.4.4 Constituencies that decide it 3.2
§3.4.5 Recognition deficit 3.4; remove the "−15.3" tile and the "commissioning ward-level recognition data" line
§3.4.6 Data gaps 3.10
§3.5 Three regions 3.7; zone-weighting → 4.2
§3.6 Channel reach 3.8; effort rebalancing → 4.6
§3.7 Media ownership 2.7; placement vs monitoring → 4.6
§4 Strategic objectives 1.3
§5 Audience segmentation 4.3
§6 Strategic approach 4.1
§6A Content engine 4.5
§7 Messaging and narrative 4.4
§8 and §8A–8D 5.1 and 5.2
§9 Implementation roadmap 5.3 and 5.4
§10 Deliverables schedule 5.5
§11 Measurement framework 5.6; replace any poll-share indicator with an observable one
§12 Governance 5.7
§13 Risk management 5.8
§14 Delivery structure 5.9
§15 Assumptions and dependencies 6.1 and 6.2
§16 Next steps 6.3
§1 Title and confidentiality Cover and Annex G
Old Annexes A–E New Annexes A, B, D, E, F (new Annex C holds the polls)

Old deep-link anchors (#decision-sec-0-1, #situation-sec-3-1-5, and every heading ID in the pre-rebuild lib/heading-slug.ts) must still resolve.

Consistency fixes. Resolve each. Report the value and the reason in docs/rebuild/CONFLICTS-RESOLVED.md. Every conflict in docs/visual-audit/CONFLICTS.md gets the same treatment.

# Issue Rule Value
1 Incumbency / Art. 180(7) Term-limited on sourced record → fact in 2.3, no 5.8 branch. Live litigation → fact in 2.3, risk in 5.8. Unclear → 5.8 only. Rule applied, not asserted
2 Internet use Recency. Current uses latest CA/KNBS (2023/24: 26.2% internet, 44.1% phone). 2019 (13.6%) only as comparison in 2.6. Latest measurement current
3 Path B margin Single benchmark 200,000, stated once in 3.1 and reused. Recompute from model. Model output vs 200,000
4 Deficit-ward counts One denominator (12 largest wards), one numerator (intersection with never-held-office), computed. Retire "top 8" and "top 11". Computed
5 605,703 tier Tier of primary document cited. IEBC directly → T1. Secondary → T3. Tier of cited source
6 Scope creep 240 Ward Captains, 800 M-Pesa ambassadors, radio bookings, sound trucks → campaign-owned recommendations. outside scope in 5.1. Reclassified
7 Budget language "geofenced spend"→"geofenced effort"; "before further budget commits"→"before further effort commits"; "minimize redundant budget expenditure"→"avoid duplicated effort". Lint scoped to engagement sections only (2.5 and 2.8 exempt). Reworded
8 40.0% nomination threshold Deleted with the slider. Removed

---

D. Visual vocabulary

Every visual in this document is one of three kinds: a chart (plots a quantity), a diagram (shows structure — steps, choices, time, hierarchy, relationships, systems), or a composite (a page section combining both). Charts and diagrams are different problems and use different conventions. Pick the kind first, then the form.

D.1 Charts — start from the relationship

Before choosing a chart, name the relationship in the data. Nine cover everything in this document.

Relationship Question it answers Forms This site's uses
Deviation How far above or below a reference? Diverging bar; diverging stacked bar; surplus/deficit line; deviation lollipop Path margins vs 200,000 (3.3)
Correlation How do two variables move together? Scatter; bubble; connected scatter; column+line; XY heatmap Not used — no bivariate data sourced
Ranking Which is bigger, and by how much? Ordered horizontal bar; ordered column; lollipop; dot strip; slope; bump; league table with inline bars Register by constituency (2.1); largest vote by contender (3.5); Pareto of wards (3.2)
Distribution How is a value spread? Histogram; box; violin; dot/strip; beeswarm; population pyramid; cumulative curve; ridgeline Not used — no distributional data
Change over time What changed, when? Line; column; area; stacked area; slope; step; sparkline; fan; calendar heatmap; candlestick; timeline; streamgraph Timeline to 2027 (1.1); connectivity slope 2019→2023/24 (2.6); phase timeline (5.4)
Magnitude How big is each item? Column/bar; grouped bar; pictogram/isotype; proportional symbol; bullet; radar; parallel coordinates; Marimekko Icon array of residents (2.4); budget stacked bar (2.5); funnel of votes (3.1)
Part-to-whole How does a total break down? Stacked bar; 100% stacked bar; pie/donut (≤5 slices); waffle; treemap; sunburst; parliament/arc; gridplot; Venn Budget envelope (2.5); digital reach split (3.8); four-route bars (3.3); channel shift (4.6)
Spatial Where does it happen? Choropleth; proportional symbol; dot density; hex/tile; heat; flow; locator; cartogram; route The tile map in all seven appearances
Flow How does something move or transform? Sankey; waterfall; chord; network; funnel; alluvial Register waterfall (2.1); vote funnel (3.1); media ownership network (2.7); funnel drop-off (3.1)

Two hard rules from this vocabulary.

· A measure tracked across several election cycles is a trajectory, not a bar. Show it as a line or slope. (This applies to any Kitui vote history rendered as time, not to the individual certified results in 2.2, which are correctly small multiples.)
· Don't draw estimates as measurements. If a source says a value is qualitative or approximate, use categories, ranges or labels, not precise bar lengths.

D.2 Diagrams — start from what the content says

If the content says one of the phrases on the left, use the form on the right.

If the content says… Use This site's uses
"First…, then…, finally…" Stepper or flowchart Week 1 method (5.3); publishing cycle (4.5)
"If…, then…" Decision tree; response playbook 4.8 decision rules; Annex F runbooks
"By [date]…" Timeline; roadmap; Gantt 1.1, 5.4
"Reports to…" / "is made up of…" Org chart; tree 5.9 team shape
"Is connected to…" / "influences…" Network; stakeholder map 2.7 media ownership
"Compared with…" Comparison table; 2×2 quadrant 3.11 evidence balance; 5.8 risk matrix
"Causes…" / "leads to…" Causal loop; fishbone 3.11 decision tree
"Adds up to…" Waterfall; build-up bar 2.1; 3.1
"Where…" Map Tile map
"Is at the core of…" Concentric circles 4.1 message house (as house, not rings)

D.3 Explanatory arithmetic — the persuasive form this document leans on

Diagrams that show how numbers combine are the most persuasive on the site. Three specific forms:

· Build-up bars / waterfalls that explain a target: registered voters × expected turnout × winning share = votes needed. (3.1)
· Unit charts / pictograms where each icon is a fixed number. (2.4)
· Threshold lines marking a target, cap or legal limit. (The 200,000 line recurs.)

Every explanatory-arithmetic figure shows its arithmetic. If the reader can't see how the total was built, the figure has failed.

D.4 Converting text and ASCII diagrams

The repo currently contains ASCII diagrams inside code blocks. They are hard to read on a phone and look raw. Convert every one:

1. Inventory every text diagram: what it shows and where it sits.
2. Classify by the tables in D.1 and D.2.
3. Choose the web form (static SVG or interactive component).
4. Store as structured data (JSON or Markdown front matter) so the same diagram renders wide on desktop and stacked on mobile — e.g. a horizontal timeline that becomes vertical on phones.
5. Keep a text version as an accessible fallback ("view as text" toggle).
6. Test at 360 px before signing off.

D.5 Diagrams as code

Where a diagram is simple, define it in Mermaid and render it to SVG at build. This keeps the source reviewable. Supported types include flowchart, sequence, timeline, Gantt, quadrant, mindmap, Sankey, block, architecture, kanban, treemap, radar and Venn — but support varies by renderer, so test in the one you actually use. For anything with precise typography or layout requirements (the tile map, the funnel, the message house), hand-roll the SVG.

---

E. Visual system

E.1 Identity and the templated-look rule

Keep the site's existing identity. Change the palette only if it can't carry the colour meanings below at WCAG AA in both light and dark themes, and say why.

Recognisable defaults to avoid. Audiences increasingly read these as generic: warm cream background + high-contrast serif + terracotta accent; near-black + one neon accent; identical rounded cards with soft grey shadow and gradient washes; tracked-out ALL-CAPS label above every heading; meta text joined with middle dots; arrows on every link; numbered markers (01/02/03) on content that isn't a sequence; every section fading and sliding up on scroll. Each is a default, not a choice.

The remedy. Take visual cues from the subject's own world — Kitui's materials, places, people, vernacular, local type. Spend boldness on one memorable element (here: the tile map). Keep everything around it quiet.

E.2 Colour

A palette has roles, not just colours.

Role Job This site
Neutrals (6–10 steps, near-white to near-black) Backgrounds, text, borders Carries most of the page
Primary (brand) Identity and main actions Existing identity
Accent (one hue) The single thing most noticed Reserved for Dr. Mulu
Semantic (3–4 hues) Success, warning, error, info; status only, never decoration Alerts, [DATA NEEDED] state
Categorical data (5–8 distinguishable) Different groups in charts Constituencies, paths, zones
Sequential data (one hue, light→dark) Low-to-high Effort heatmap (4.2)
Diverging data (two hues at a neutral midpoint) Below/above a reference Deviation from 200,000

Rules.

· Define colours as CSS custom properties so light and dark themes swap cleanly.
· Design dark mode deliberately rather than inverting: reduce saturation; make raised surfaces slightly lighter than the page.
· Colour is never the only carrier of meaning. Pair it with a label, icon, pattern or position. This is a WCAG requirement, not a preference.
· One colour for Dr. Mulu, used nowhere else. One neutral family for rivals. No party colours.

Three data states, distinguishable even in greyscale:

· sourced — solid;
· modelled — hatched (SVG <pattern>) or outlined;
· needed — dashed empty outline carrying [DATA NEEDED — source].

Contrast minimums (WCAG 2.2):

Content AA AAA
Normal text 4.5:1 7:1
Large text (≥24px regular, or ≥18.7px bold) 3:1 4.5:1
UI components and meaningful graphics (buttons, input borders, icons, chart elements, focus indicators) 3:1 —

Logos, purely decorative elements and disabled controls are exempt. Contrast depends on lightness, not hue. Light grey (#999999 on white) fails at ~2.85:1. A frequent failure in dark mode is saturated brand colour on near-black.

Colour vision deficiency. About 8% of men and 0.5% of women have some form. Avoid red-vs-green. Blue and orange is the safe pairing. For continuous data use a perceptually uniform scale (viridis, or a single-hue sequential) — never a rainbow. Test every chart with a simulator before publishing.

E.3 Typography

· One or two families. If two, make them clearly different.
· A type scale from a ratio: ~1.2 for dense interfaces, ~1.25 for general, ~1.333+ for editorial.
· Body: 16–18 px, line height ~1.5 (more for serif), line length 45–80 characters.
· Variable fonts for weights and widths from one file — good for performance and headlines.
· Type as the visual. Oversized or kinetic headlines can replace stock imagery entirely.
· Numbers: font-variant-numeric: tabular-nums in tables and dashboards so digits align.
· Sentence case reads faster than ALL CAPS for anything longer than a couple of words.

E.4 Grid, spacing, rhythm

· Columns: 12 desktop (divides by 2, 3, 4, 6), 8 tablet, 4 mobile. Gutters 16–32 px.
· Spacing scale on 4 or 8 px base: 4, 8, 12, 16, 24, 32, 48, 64, 96. Use only values from the scale.
· Content width: 1100–1280 px max; reading columns 65–75 characters.
· Vertical rhythm: consistent gaps between sections.

E.5 Gestalt — why layouts read the way they do

Principle The eye groups by Rule for this build
Proximity Closeness A label sits closer to its own value than to the next
Similarity Look All links share one colour and underline
Common region Shared boundary Cards, panels, shaded sections
Continuity Lines and curves Timelines, flow arrows, aligned edges
Closure Completion Icon family drawn with consistent open strokes
Figure–ground Object vs background Modals over dimmed page
Focal point Difference One coloured action among neutral ones

E.6 Shape, depth, elevation

· Border radius is information. Vary it by hierarchy (small on inputs and chips, larger on containers), not one radius everywhere.
· Elevation (shadow or tonal surface) shows layers.
· Grouping: pick one method as the primary (border, whitespace, or tint) — mixing all three looks busy.

E.7 The signature visual: the 40-ward tile map

Tiles grouped by the eight constituencies, arranged roughly as the county sits: Mwingi north, Kitui Central middle, Kitui South south. Use real ward geometry only if boundary data already exists in the repo and simplifies to under ~50 kB. Otherwise tiles, labelled "Schematic, not to scale."

The same map recurs with different layers: register size (3.2), office footprint (3.4), party flow (3.6), zones (3.7), effort weighting (4.2), reach-share targets (5.6). The reader learns it once. Spend the boldness here; keep every other chart quiet.

A hex/tile alternative. When every area needs equal visual weight (which is the case here, since Kitui's wards vary hugely in geographic size), tile maps beat choropleths. Say so once, in the map's first appearance.

E.8 Chart grammar

Every visual has:

· a title that states the finding in a sentence ("Half the register lives where he has never held office");
· a one-line subtitle stating the question;
· the chart;
· a source line with tier badge;
· a table view;
· a CSV download;
· a one-sentence takeaway directly beneath.

E.9 Traceability

Each Section 4 strategy opens with a "Because" link to the analysis finding it answers ("Because 3.4: 51.7% of the register is where he has never held office"). Each Section 1 objective links forward to the strategy that serves it and the 5.6 indicator that measures it. Any thread is followable in both directions.

E.10 Never

· Decorative charts answering no question.
· 3D where 2D works.
· Pie charts with more than three slices (five maximum, and only if one message dominates).
· Dual axes.
· Stock imagery of people pointing at screens.
· Generated-page tells (see E.1).
· AI-generated images of real people, real events, or anything presented as evidence. On a political site this destroys trust and may break election rules. If any synthetic image is used at all — backgrounds, textures — it is labelled as synthetic.

---

F. Layout and page structure

F.1 The cover (hero)

This is a data-led hero with a portrait: the portrait sits beside the tile map, the map shaded for the 275,570-voter pool, and four cover figures in a short row beneath. The four figures count up once on load only when reduced motion is off.

Rules for this hero.

· One message, one primary action.
· The portrait is not lazy-loaded; it carries fetchpriority="high" and explicit width/height.
· The tile map is server-rendered SVG; it appears with JavaScript off.
· No auto-rotating carousel. Ever.
· No full-bleed video. Ever — this site is read on mobile data.

F.2 Section and layout patterns in use

The guide lists twenty. This site uses seven, deliberately.

Pattern Where Rule
Sticky side-by-side §3 tile-map analysis Visual pinned; text scrolls beside. Collapses to stacked on phones.
Bento grid Cover; §5 workstream grid Bigger tile = more important. Logical source order preserved for keyboard and screen reader.
Editorial / magazine §§2–4 narrative prose Varied column widths, pull quotes used sparingly, large figures.
Alternating zig-zag §4 strategy-to-finding pairs Max 3–4 rows; after that it becomes monotonous.
Full-bleed band Section breaks between the six parts Max one per part.
Comparison table 3.11 balance; 5.8 risk matrix; Annex C Row highlight on hover; keyboard-reachable.
Stats band Cover figures; §5.6 KPI row Numbers with context, never naked.

F.3 Page archetypes

· / — campaign/advocacy anatomy: hero → objectives → data → analysis → strategy → implementation → decision. Each part has a consistent entry: a short standfirst, then the first figure.
· /full — the same anatomy on one page, with all figures visible and all tables rendered in <details> that print open.

F.4 Navigation

· Sticky table of contents for the six parts, with the current section highlighted. On mobile it becomes the five-step progress spine.
· Reading-progress bar at the top of the viewport — thin, non-distracting.
· Breadcrumbs in Annexes only.
· "Load more" is not needed; the site is short.
· Search indexes figure titles, takeaways and section titles, so a reader can search by finding.

F.5 Section entry

Each part enters with a short standfirst and its first figure. Motion is limited to the orchestrated moments defined in Part I; every other section is still.

---

G. Imagery and media

G.1 Photography

Allowed types, in order of preference: documentary/reportage (real moments); portrait (the one portrait of Dr. Mulu on the cover); aerial/drone only if it shows geography that matters; archival/historical in §2.8 for the career timeline.

Rules.

· Real beats stock. Local faces and recognisable places build trust faster.
· Consistent treatment: one colour grade, one crop style.
· Art direction: serve a tighter, portrait crop to phones and a wider one to desktops via <picture>.
· Faces looking into the page pull the reader toward the content.
· Never bake text into a photo — it cannot be translated, searched, resized or read by a screen reader.
· Consent for identifiable people; credit photographers.
· On a political site, never alter documentary photos in ways that change their meaning.

G.2 Illustration

If any illustration is used, keep one system: same stroke weight, palette, perspective, level of detail. Prefer spot illustrations for empty states and section breaks over full scenes. The tile map is the site's main illustration and no other competes with it.

G.3 Icons

· One family (Lucide, Phosphor, Heroicons, Tabler or Material Symbols).
· One grid (24 × 24), consistent stroke.
· Label icons unless the meaning is universal (search, close, menu, play).
· Icons conveying meaning need ≥3:1 contrast against their background.
· Deliver as inline SVG or sprite so they scale and inherit text colour.

G.4 Backgrounds and texture

Allowed: solid tonal blocks; a very light dot or line grid as a section separator if it does not harm legibility. Not allowed: mesh gradients, frosted glass panels, heavy grain, decorative patterns with no meaning, duotone photos.

G.5 Video and moving media

None on this site. Video is heavy on mobile data and this document is read on Kenyan mobile connections. If a campaign-supplied video must be embedded in Annex F, it has a poster frame, preload="none", no autoplay, captions, and a transcript.

G.6 AI-generated imagery

Not permitted for people, events, or anything presented as evidence. Permitted only for backgrounds and textures, and labelled as synthetic where it could be mistaken for real.

---

H. Interface components

Every interactive element has states: default, hover, focus, active, disabled, loading, error. Focus rings are visible and meet 3:1 contrast against the adjacent background.

Component Rules for this build
Buttons Primary, secondary, tertiary, destructive. Label with the action ("Download CSV", not "Submit").
Links in body Underlined. One link colour throughout.
Forms Visible borders (3:1). Labels above the field, not placeholder-only. Errors with icon + text.
Tier badges (T1/T2/T3) Styled identically everywhere. Shape-distinguished, not colour-only: T1 solid pill; T2 outlined pill; T3 dashed pill. Verified in greyscale.
Data-state indicators Sourced / modelled / needed per E.2. Pattern + label, never colour alone.
Alerts and banners Match semantic colours; dismissible; critical errors never auto-hide.
Empty states [DATA NEEDED — source] rendered as a dashed empty outline with the label. Never a zero. Never a gap with no label.
Copy-link Confirms with a brief state change, not a toast. Keyboard-reachable.
Table view toggle Lives inside a native <details> so it is keyboard-reachable and works with JavaScript off. No JavaScript toggle.
CSV download A real link, not a script. Filename visible on focus.
Steppers Mark current, complete, upcoming.
Touch targets ≥24 × 24 CSS px (WCAG 2.2 SC 2.5.8). Target 44–48 px for comfort.
Focus indicators Visible on every interactive element. Never animated out.

---

I. Motion

Motion is a third encoding channel, not decoration. It is allowed only when it does one of six jobs.

Job Example Site use
Feedback Button depresses; toggle slides Every interactive element
Orientation Panel slides in from the side it belongs to Section entries
Attention One element pulses once to show where to look First figure of each section
Continuity Thumbnail expands into full view Figure-to-figure handoffs
Explanation Chart animates to show change over time The tile-map morph
Delight Small brand moment (rare) Cover only

Never the sole carrier. Everything motion shows is also readable statically in the table view. This is WCAG 2.3.3 territory.

I.1 The three tiers

· Tier 1 — Ambient. CSS transitions. Hover and focus states. Tile-map tiles lift slightly on hover with their value. No JS. Transform and opacity only.
· Tier 2 — Choreographed. Each figure draws once on first viewport entry, never replays. Bars grow from baseline; the Pareto line traces; dots settle. Web Animations API, one shared IntersectionObserver. Under 900ms each.
· Tier 3 — Narrative. Six orchestrated moments: cover, the openings of §2, §3, §4, §5, and the diagnosis at 3.11. Scroll-linked, reversible, skippable.

I.2 The centrepiece: the morphing tile map

At 3.4 the map carries a layer control. Moving between layers morphs tiles in place over ~600ms — fill, hatch, label and position interpolate, so the reader sees which wards are stable and which flip. Between 3.2 and 3.4 the map stays pinned while the layer changes as the reader scrolls. Where one figure's output is the next figure's input (3.1's funnel into 3.3's paths; 2.1's register into 3.2's map), the number carries across as a shared element via FLIP.

I.3 The motion catalogue in use

Only these, from the guide's catalogue:

Effect Where Caution
Micro-interactions Buttons, toggles, copy confirmations Keep short (100–200ms)
Hover, focus, active states Every interactive element Focus states mandatory
Skeleton screens Not used — figures are server-rendered, complete —
Page transitions / → /full via View Transitions API Must not delay navigation
Scroll-triggered reveals Six orchestrated moments only Not every section
Parallax Not used — vestibular trigger —
Sticky/pinned sections §3 tile map only Collapses on short phones
Kinetic typography Not used — decoration, not information —
Count-up numbers Cover figures only Final value must be in the HTML
Chart draw-in Every Tier 2 figure, once Fast (≤900ms)
Lottie / Rive Not used — no library, no need —

I.4 Timing and easing

· Small feedback: 100–200ms.
· Panels and page transitions: 200–400ms.
· Tier 2 choreography: 400–900ms.
· Tier 3 narrative: up to 1.5s.
· Ease-out for entering, ease-in for leaving. Never linear for interface motion.
· Nothing blocks interaction while animating.

I.5 Reduced motion — substitute, don't suppress

prefers-reduced-motion: reduce does not mean the site goes still. It means no displacement.

Full Reduced
Bars grow from baseline Bars crossfade in
Map tiles morph and move Map tiles crossfade between layers
Count-up Final values appear immediately
Scroll-linked draw of timeline Timeline appears complete
Shared-element handoff Crossfade
Tile lift on hover Border and label emphasise, no movement

No displacement. No scaling above 1.05. No parallax. No scroll-linking. Colour, opacity and border remain available. The information is identical. Honour prefers-reduced-transparency and low-power mode where detectable.

The safest implementation is no motion first: static by default, animation added only for people who haven't asked to reduce it.

```css
.reveal { opacity: 1; transform: none; }
@media (prefers-reduced-motion: no-preference) {
  .reveal { animation: fade-up 400ms ease-out both; }
}
```

I.6 Device tiering

On hardwareConcurrency <= 4 or deviceMemory <= 2, Tier 1 only. On connection.saveData, same. The reader on a Kitui phone on mobile data gets a fast, still, complete document; the reader on wifi gets the full experience.

I.7 Implementation — no motion library

CSS transitions and @keyframes; Web Animations API for choreography and FLIP; one shared IntersectionObserver (~1 kB); scroll-timeline with IntersectionObserver fallback; View Transitions API with a no-op fallback. GSAP, Motion, Lottie, Rive and Scrollama are not to be added without a Phase 0 justification with a measured byte cost and a named capability the above cannot provide. Default answer is no.

I.8 Motion must never

Delay content. Loop. Carry information available nowhere else. Block interaction. Animate on scroll past a figure a second time. Move more than 24px on entry. Exceed 900ms (Tier 2) or 1.5s (Tier 3). Scroll-jack. Appear in print.

---

J. Accessibility

J.1 Contrast

See E.2. AA in both light and dark themes.

J.2 Colour vision deficiency

See E.2. Blue-and-orange safe pairing. Perceptually uniform scales. Labels, patterns, shapes, or position so meaning survives without colour. Simulator test before publishing.

J.3 Alternative text

Image type alt
Decorative alt=""
Informative photo A short description of what matters in context
Functional (linked image or icon button) The action or destination
Chart or diagram The key finding in one or two sentences, plus a data table or long description nearby
Image containing text The same text, and avoid text in images
Logo The organisation's name

Chart text alternatives are mandatory, not optional. Each figure's text alternative states its finding. The table view is the data-table alternative.

J.4 Other requirements

· Reflow: content works at 320 CSS px wide without two-directional scrolling (WCAG 1.4.10). Never disable pinch-zoom.
· Text resize: layouts survive text at 200%.
· Captions and transcripts for any audio or video.
· Heading structure: one H1; H2 and H3 in order; screen-reader users navigate by headings.
· Motion: see I.5, plus WCAG 2.2.2 (pause/stop/hide for anything auto-moving >5s) and WCAG 2.3.1 (nothing flashes >3× per second).
· Target size and focus: see H.
· Charts: a text summary, the data as a table, and non-colour encodings.

---

K. Performance

K.1 Measure first

Before changing anything, run Lighthouse mobile throttled against production / and /full. Record LCP, INP, CLS, first-load JS, total page weight, height in CSS px at 390px width, and noindex, nofollow presence. These are the "before" numbers. They cannot be recovered later.

K.2 Ceilings

Metric Good Ceiling for this build
Largest Contentful Paint (LCP) ≤2.5s ≤2,500 ms mobile throttled
Interaction to Next Paint (INP) ≤200ms ≤200 ms
Cumulative Layout Shift (CLS) ≤0.1 ≤0.1
First-load JS, / — Baseline + 25 kB gzipped
First-load JS, /full — Baseline + 25 kB gzipped
Total page weight — <1.5 MB
JavaScript — <300 KB

Motion must not block first paint. Figures render as server-side SVG, complete, in the HTML; choreography layers on afterwards and simply never runs with JavaScript off.

K.3 Image formats

Format Use
AVIF Photographic heroes, large images — roughly half JPEG size
WebP Everyday default — a quarter to a third smaller than JPEG
JPEG Fallback only
PNG Screenshots and lossless — heavy for photos
SVG Logos, icons, illustrations, charts, diagrams — tiny, sharp, CSS-styleable
MP4 / WebM Anything that would have been a GIF — far smaller

Serve modern formats with fallbacks:

```html
<picture>
  <source srcset="/img/hero.avif" type="image/avif">
  <source srcset="/img/hero.webp" type="image/webp">
  <img src="/img/hero.jpg" alt="…" width="1600" height="900" fetchpriority="high">
</picture>
```

K.4 Image delivery

· Always set width and height (or CSS aspect-ratio) to prevent layout shift.
· srcset + sizes so phones download phone-sized images.
· Lazy-load below the fold. Never lazy-load the hero.
· Hero gets fetchpriority="high" or preload.
· Compress everything; strip metadata.
· Optimise SVGs (SVGO).

K.5 Fonts, video, charts

· Fonts: WOFF2, subset, limited weights, font-display: swap. A variable font can replace several static files.
· Video: none on this site (see G.5). If embedded in Annex F, poster + preload="none" + no autoplay.
· Chart rendering: SVG up to a few thousand elements; Canvas for tens of thousands; WebGL for very large. This site's charts fit SVG.

---

L. Kenya mobile-first

L.1 Audience reality

Kenya had 23.4 million internet users at the end of 2025 (penetration 40.5%), and 77.5 million cellular connections (134% of population, some voice/SMS only). About 80% of connections are 3G/4G/5G, but that does not mean all use mobile data. WhatsApp is the country's social infrastructure. The site will be opened from a WhatsApp link on a phone. Optimise for that reality.

L.2 Rules for this build

· Design at 360–412 px first, scale up.
· Budget for data costs: compress aggressively; no autoplaying video; heavy media opt-in only.
· Test on a mid-range Android on throttled 3G/4G, not on a laptop.
· Tap, don't hover. Every tooltip and hover detail also works on tap and keyboard focus.
· No sideways scrolling of the page; only wide tables or diagrams scroll inside their own container.
· Charts: horizontal bars, short labels, fewer ticks, big numbers with context.
· Diagrams: vertical timelines, stacked steps, collapsible trees.
· Tables: rows convert to cards on phones.
· Maps: always provide a searchable list by constituency or ward as an alternative.
· Share previews matter: a strong Open Graph image and title decide whether a forwarded WhatsApp link gets opened.
· Readable in sunlight: generous contrast helps outdoor phone use.
· Local languages: leave room in layouts for Kiswahili and Kikamba, which can run longer than English.
· Offline-friendly extras: downloadable one-page PDF and image cards travel well on WhatsApp.

---

M. Chart craft rules

Every chart, no exceptions.

· Headline states the finding ("Enrolment doubled after fees were removed"); the subtitle states what is measured and the units.
· Label directly on lines and bars instead of relying on a legend.
· Bars and columns start at zero. Line charts may zoom in, but say so.
· Sort bars by value unless the categories have a natural order (time, age groups).
· Highlight with colour; give context in grey.
· Remove 3D, shadows, heavy gridlines, rotated labels (flip to horizontal bars).
· Show uncertainty (ranges, margins of error), especially for estimates and projections.
· Annotate key events directly on time series.
· Cite the source and date on every chart, plus method for polls and estimates.
· Don't draw estimates as measurements. Approximate values use categories, ranges, or labels, not precise bar lengths.
· Mobile: fewer axis ticks, bigger tap targets, tooltips that work on tap, horizontal bars, simplified version if needed.
· Accessibility: a one-sentence text summary, the underlying data table, and shapes/patterns alongside colour.

Dual-axis charts are forbidden. Where two measures of different scale must be shown together, use two aligned panels sharing an x-axis, or index both to 100.

---

N. Figure register

Every figure below is mandatory. IDs are stable and become DOM ids, CSV filenames and table-of-figures entries. Global title rule: every title states the finding as a full sentence, sentence case, no colon, no question mark. The subtitle is the question.

Column Type uses D.1/D.2 relationships. Column Rules carries per-figure notes.

Cover and Section 1

ID § Question Type Chart Data keys Rules
fig-cover-map Cover Where does the electorate sit, and where has he held office? Spatial Tile map, footprint layer, 275,570 pool shaded footprint.by-ward, pool.275570, register.by-ward Portrait beside the map. Four cover figures in a short row beneath, counting up once when reduced motion is off.
fig-cover-spine Cover What is the shape of the argument? Process Five-step progress spine — Objectives, Data, Analysis, Strategy, Implementation. Doubles as navigation. §6 is terminal, not a spine step; the last step stays lit through §6.
fig-1-1-timeline 1.1–1.2 How long is there? Time Timeline calendar.today, nomination.window (T3, "reported"), election.date Horizontal desktop, vertical mobile. Nomination window visibly T3.
fig-1-3-objectives 1.3 What are the five objectives, and what does each serve? Process Five panels objectives[5] each {text, target, findingRef, measureRef} Each links to its §3 finding and §5.6 measure. Bidirectional.
fig-1-4-flow 1.4 How does the engagement run? Process Swimlane flow engagement.phases[3] Lanes: Firefly, his team. WhatsApp/USSD shown as the only channel Firefly operates directly.
fig-1-5-scorecard 1.5 How will success be judged? Magnitude Empty gauges kpis[] with targets Empty until Week 1. Observable indicators only. Any poll-share indicator replaced with an observable one.

Section 2 — The Data

ID § Question Type Chart Data keys Rules
fig-2-1-register 2.1 How big is the register, and how did it get there? Flow + Ranking Bar by constituency + waterfall register.by-constituency, register.total.2022 (532,758), register.total.2026 (605,703), ecvr.drive, continuous.registration Waterfall with running total. If a contributor is unknown, split into known and [DATA NEEDED].
fig-2-2-results 2.2 What does it take to win a countywide seat in Kitui? Magnitude (small multiples) Small multiples ×4 (+1 if absent) results.governor.2017, results.governor.2022, results.senator.2022, results.womanrep.2022, benchmark.198004, results.musila.2022 + alt Shared y-scale. The 198,004 line drawn identically in every panel. Musila shows both published values, each labelled. If Mulu's Kitui Central 2022 is absent, a fifth panel reads [DATA NEEDED — IEBC Form 35A, Kitui Central 2022].
fig-2-3-nomination 2.3 What is the nomination method, and how confident are we? Decision Status card nomination.method, nomination.window, Article 180(7) note Reads "Reported, not confirmed". Checklist of what would confirm it, each with holder and status.
fig-2-4-people 2.4 Who lives in Kitui? Magnitude (isotype) Icon array + pictograms + badge census.rural.share, census.poverty.share, livestock.counts, ndma.drought.status One icon = 1%. Partial icons partial, not rounded. NDMA badge carries its date.
fig-2-5-budget 2.5 What does the next governor actually control? Part-to-whole Stacked bar budget.fy2026.equitable, .conditional, .ownsource, .rounding The rounding gap is its own labelled segment. Each segment labelled in KSh.
fig-2-6-connectivity 2.6 How do people get online, and has that changed? Time Slope knbs.2019.internet, knbs.2019.phone, ca.knbs.2023.internet, ca.knbs.2023.phone Two lines. Direct labels both ends. Title states the finding. 2019 appears only here.
fig-2-7-media 2.7 Who owns the airwaves, and where do we place vs monitor? Flow (network) Network stations[], owners[], ties[] Nodes and edges labelled. Each station tagged placement or monitoring.
fig-2-8-record 2.8 What has he actually done? Time Timeline + proof panels career.milestones[], bursaries.ksh, bursaries.recipients, evaluation.rank, ngcdf.projects[] NG-CDF as list/map only if repo has data; else [DATA NEEDED — NG-CDF].
fig-2-9-channels 2.9 What does his presence look like against the field? Comparison + Magnitude Inventory grid + four-candidate comparison mulu.channels[], rival.posts_per_week, rival.median_shares, rival.ads_live Comparison filled from public data now. Unfillable cells read [DATA NEEDED — public]. No estimates.

Section 3 — The Analysis

ID § Question Type Chart Data keys Rules
fig-3-1-funnel 3.1 What is the winning number? Flow Funnel with toggle register.total.2022, register.total.2026, turnout.2022, win.threshold Toggle switches only the register input. Turnout and threshold labelled as constants. Show the arithmetic.
fig-3-2-register-map 3.2 Where are the votes? Spatial + Ranking Tile map + Pareto register.by-ward, register.by-constituency, pareto.top12 Map labelled "schematic, not to scale". Pareto bars plotted as share of total so the cumulative line shares one 0–100% axis — no dual axes. The 12 largest marked. Big 4 highlighted.
fig-3-3-paths 3.3 Which route to the number is real, and which is a trap? Deviation Four stacked bars ×2 + line path.a–d, benchmark.200000, turnout.62 Path D labelled "the trap" with explicit text, not colour alone. The 200,000 line identical across all eight bars.
fig-3-4-footprint 3.4 Where has he held office, and what does that leave untouched? Spatial Tile map, footprint layer footprint.category per ward, pool.275570 Callout on the 275,570 pool: "structural, derived from where he has held office, not from a survey."
fig-3-5-field 3.5 What has each contender already proven at the ballot? Ranking Bar of largest vote won kasalu.201899, wambua.191317, ngilu.169990.2017, musila.largest, mulu.kitui-central.largest, benchmark.198004 Each bar carries its scope (countywide/constituency). The 198,004 line identical. No poll share.
fig-3-6-party-flow 3.6 Where will party loyalty not carry him? Spatial Tile map, party-flow layer mp.party per constituency, register.kitui-east + register.kitui-south, succession.note Highlight by pattern and label, not colour alone.
fig-3-7-zones 3.7 How do the three zones differ, and who is left out? Spatial + Deviation Tile map, zones layer + dumbbell zone.north/central/south, population.share, register.share Kitui Rural's exclusion shown explicitly. Dumbbell dots carry values.
fig-3-8-ceiling 3.8 What can digital physically reach? Part-to-whole Single stacked bar reach.smartphone, reach.sms-only, reach.nophone (modelled) No-phone segment hatched (modelled). The 200,000 line shows the digital ceiling.
fig-3-9-audit 3.9 What does his current presence actually show? Composite Four audit figures + annotated mock audit.reach.by-constituency, audit.90day.strip, audit.engagement.by-language, audit.him.vs.field, profile.issues[6] Parts needing his Insights export stay [DATA NEEDED — Meta Insights export]. Six issues from Phase 0. Mock numbered 1–6.
fig-3-10-gaps 3.10 What can't the data tell us yet, and what closes each gap? Comparison table Table gaps[] with {gap, closingDoc, holder, status} Generated from content, never hand-typed. Every [DATA NEEDED] appears here.
fig-3-11-evidence 3.11 How strong is the diagnosis, and what would overturn it? Comparison + Decision Balance + decision tree hypothesis, supporting[], counter[] (must include Kasalu 201,899), test.plan Hypothesis centre. Counter-evidence side not empty. Tree shows the Week 1 test.

Section 4 — The Strategy

ID § Question Type Chart Data keys Rules
fig-4-1-message-house 4.1 What is the position, and what holds it up? Hierarchy Message house position, pillars[], record.proof[] Roof is position. Pillars are messages. Foundation is the record.
fig-4-2-effort 4.2 Where does the effort go in Phase −1? Spatial + Heatmap Tile map, effort layer + zone×phase heatmap effort.phase-minus1.by-ward, effort.zone-by-phase Single-hue sequential. Values in cells. No red-green.
fig-4-3-segments 4.3 Who are we trying to move, and how much do they matter? Comparison matrix Segment matrix segments[] with size and priority, all sourced Only sourced figures. Unsourced cells [DATA NEEDED]. No invented sizes.
fig-4-4-message-region 4.4 What do we say where, and in which language? Comparison matrix Region×message + language rules regions[], messages[], language rules Bulk political SMS in English or Kiswahili only; Kikamba by voice note and radio.
fig-4-5-calendar 4.5 What gets published, and when? Process (grid) Weekly calendar grid cadence.weekly, pillars[4] Coloured by the four pillars only.
fig-4-6-channel-shift 4.6 How does effort move between channels? Time Slope + placement/monitoring list channel.share.conventional, channel.share.rebalanced, media.posture[] Station posture carried from 2.7.
fig-4-7-profile-fixes 4.7 What gets fixed first? Comparison Before/after ×6 profile.fixes[6] PhD fix first.
fig-4-8-decision-rules 4.8 When does the plan change? Decision Flowchart rules[] with {ifAuditFinds, strategyChangesTo} One direction. Labelled branches. No orphan nodes.

Section 5 — Implementation

ID § Question Type Chart Data keys Rules
fig-5-1-workstreams 5.1 Who owns what? Comparison grid 14-workstream grid workstreams[14] with owner: firefly \| team \| outside Coloured by owner. Reclassified items read outside scope.
fig-5-2-workstream-panels 5.2 What does each group produce? Composite Four compact panels workstreamGroups[4] Each shows what it produces, who owns it, how often.
fig-5-3-four-weeks 5.3 What happens in the first four weeks? Process + Time Strip + condensed method weeks[4], week1.method Week 1 method condensed beneath.
fig-5-4-phases 5.4 How does the plan run to August 2027? Time Phase timeline phases[] Aligned to fig-1-1-timeline, same date axis.
fig-5-5-cadence 5.5 What does he receive, and how often? Process + Comparison Cadence calendar + depth comparison cadence.weekly, cadence.monthly, engagement-depth comparison No prices.
fig-5-6-kpis 5.6 How is progress measured? Ranking + Spatial KPI ladder + tile map, reach-target layer kpis[], reach.target.by-ward Empty states until data exists. No poll-share indicators.
fig-5-7-approval 5.7 How are decisions made? Process + Decision Approval path + escalation ladder approval.path, escalation.levels Two flow diagrams.
fig-5-8-risk 5.8 What could go wrong? Comparison + Decision Risk matrix + two branch diagrams risks[]; branches for delegate primary and eligibility Eligibility branch appears only if Phase 0 does not settle the question.
fig-5-9-team 5.9 What shape is the team? Hierarchy Team shape by role roles[] No names, bios, credentials.

Section 6 — Next Steps

ID § Question Type Chart Data keys Rules
fig-6-1-dependencies 6.1 What does the campaign provide? Process Checklist dependencies[] Three gating items first.
fig-6-2-open-items 6.2 What is still open? Comparison table Table Generated from content Every [DATA NEEDED] and [CONFIRM/EDIT]. Generated, never hand-typed.
fig-6-3-decision 6.3 What is being asked? Decision Decision panel decision.text, week1.timeline Week 1 timeline beneath.

Annex C is the only place polls appear. Each poll is its own row with sample size, margin of error, undecided share and method differences. No trend line across pollsters. Labelled "for reference only".

---

O. Data layer, components, anchors

Data layer. lib/data/schema.ts defines Figure with id, value | null, unit, tier, state, source | null, note?, alt?, closesWith?. One FIGURES: Record<string, Figure>. lib/data/format.ts renders every number so 605703 and 605,703 cannot diverge. scripts/check-figures.ts runs in prebuild and fails on: a needed figure with a non-null value; a sourced figure with a null source; a modelled figure with no note; an alt whose value equals the primary (a silent collapse of a real dispute); any bare numeric literal matching /\b\d{3,}\b/ in a content file outside an allow-list.

Components. FigureFrame — title, question, chart, takeaway, <details> table, source + tier, CSV link. The table lives inside a native <details> so it is keyboard-reachable and works with JavaScript off; no JS toggle. Print opens all <details> via one beforeprint listener. TierBadge — shape-distinguished per H. Data states per E.2. [DATA NEEDED] per H. CSV emitted statically to public/data/<id>.csv at build; no API route.

Tile map. lib/geo/wards.ts with all 40 wards (id, name, constituency, row, col, zone). North to south: Mwingi, Kitui Central, Kitui South. Labelled "schematic, not to scale". One component, seven appearances, six layers.

Anchors. scripts/build-anchors.ts emits lib/anchors/redirects.ts. One client component resolves on mount and hashchange. Build fails if any pre-rebuild heading ID is absent from both live headings and ANCHOR_REDIRECTS.

---

P. Structural rebuild checklist

Each item pass/fail. Run after Phase 1 and again before reporting.

# Item Acceptance test
1 New order and numbering Reads Objectives, Data, Analysis, Strategy, Implementation, Next Steps. No section repeats another's job.
2 /full rebuilt Contains every section in order. Print/PDF works.
3 Search index regenerated Figure titles, takeaways, section titles indexed. Search finds a figure by its finding.
4 Reading time recomputed Brief and Full figures recomputed. The Brief/Full choice survives.
5 Cross-references rebuilt §4 strategies open with a "Because" link. §1 objectives link forward. Both directions work.
6 Anchor redirects generated Every pre-rebuild heading ID resolves to a live heading or an entry in ANCHOR_REDIRECTS. Build fails otherwise.
7 Copy-link preserved Every heading carries a keyboard-reachable copy-link. Legacy anchors resolve.
8 Chart/table/CSV toggle preserved Existing pattern retained. Table view keyboard-reachable.
9 noindex, nofollow on both routes Present on / and /full.
10 Confidentiality notice Cover, Annex G, print footer.
11 3D terrain defaults to 2D tile map 3D lazy, on explicit request only. 2D default everywhere.
12 Print output Every chart static with its table. break-inside: avoid on figures; break-before on sections.
13 Dark mode Chart palette carries the same colour meanings at WCAG AA in both themes.
14 Reduced motion Substitute-don't-suppress policy applied throughout.
15 Brief/Full reading choice Preserved, not removed.
16 All ASCII diagrams converted Per D.4. None remain in the content.
17 Open Graph image set 1200 × 630 px. Previewed in a WhatsApp share.

---

Q. Quality bar

Universal — every figure, no exceptions. Title states the finding as a sentence; subtitle is the question; one-sentence takeaway beneath; source line with tier badge; table view keyboard-reachable and works with JS off; CSV download; renders at 360px without horizontal page scroll; renders at 320px without two-directional scroll; survives greyscale (three data states distinguishable by pattern or label alone); renders with JS off; no 3D where 2D works; no dual axes; no pie charts with more than three slices; colour never the sole carrier of meaning.

Per family.

Family Checks
Bar / column Zero baseline. Sorted by value unless order is the point. Direct labels for ≤3 series.
Small multiples Shared scale, shared axes. One reference line drawn identically.
Slope Two columns. Direct labels both ends. No legend.
Waterfall Direction paired with label. Running total shown.
Pareto Bars as share of total so the cumulative line shares one 0–100% axis. No dual axes. Threshold marked.
Dumbbell Two dots, connecting line, both ends labelled.
Funnel Stages proportionate. Values labelled. Drop-off shown.
Icon array / isotype One icon = one unit. Partial icons partial.
Network Nodes and edges labelled. Crossings minimised.
Stacked bar Consistent segment order. Large segments direct-labelled; small in a legend.
Heatmap Single-hue sequential. Values in cells. No red-green.
Matrices Categorical. No gradient.
Risk matrix Likelihood × impact grid. Items plotted, labelled, legible at 360px.
Flowchart / decision tree One direction. Labelled branches. No orphan nodes.
Timeline Date-aligned. Milestones labelled. Shared axis where timelines align.
Message house Quiet. Roof, pillars, foundation readable at 360px.
Table Right-align numbers with tabular figures. Sticky headers. Mobile collapse to cards, or sideways scroll inside container with first column pinned.

---

R. Process

Work in phases. Commit at the end of each with a clear message.

Phase 0 — Read and plan, then stop

1. Read the whole repo: routes, content files, data layer, chart components, config/assumptions.yaml.
2. Read docs/visual-audit/CONFLICTS.md and DECISIONS.md if present.
3. Build the old-to-new mapping from the real content, including old §4–16 and the annexes.
4. Locate the six profile fixes (old §1A.2.5). If the repo does not contain six, report the actual number and stop.
5. Confirm lib/geo/wards.ts can be populated for all seven tile-map appearances.
6. Confirm the Brief/Full reading-time mechanism exists and where it is computed.
7. Inventory every ASCII diagram and every text-based diagram in code blocks. Classify each per D.4.
8. Draft the visual-system tokens (palette roles, type scale, spacing scale, chart grammar) and the tile-map layout.
9. STOP. Present in docs/rebuild/RECON.md: the mapping; the visual system; the ASCII-diagram inventory; every conflict between this prompt and the repo; your assumptions. Wait for approval.

Phase 1 — Structure

Apply the new order, numbering, navigation, /full route, search index, reading-time counts, cross-references and anchor redirects. No content changes yet beyond moves.

Phase 2 — Cuts, moves and fixes

Apply the cuts-and-moves table and consistency fixes. Move every number onto the single data layer.

Phase 3 — Visuals

Build the shared components first (chart frame, tier badge, data states, table/CSV toggle, tile map). Then build the figure register section by section, in document order. Pilot first: build fig-2-1-register completely — frame, tier, source, table, CSV, print, 360px, greyscale, JS-off — and do not build any other figure until the pilot passes every universal check. Convert every ASCII diagram. Log every prose passage a visual replaces in docs/rebuild/REPLACEMENTS.md.

Phase 4 — Performance, accessibility, motion, print

Run the checks. Take screenshots of every section at 320px, 360px and 1440px. Review them yourself and fix whatever reads badly. Verify the motion tests: JS-off, reduced-motion, device-tier, no-loop audit, budget, print, keyboard.

Phase 5 — Self-check and report

Run the self-check. Deliver the report.

---

S. Verification gates

Run before every commit.

Numbers. No numeric literal in content. Every figure identical everywhere it appears. Disputed figures show both values. scripts/check-figures.ts passes.
Polling. grep -ri "poll\|survey\|mizani\|infotrak\|tifa\|ipsos" outside Annex C returns nothing used as evidence. No slider exists. No promise of new polling.
Money. grep -ri "budget\|spend\|cost\|fee\|price" in engagement sections returns nothing. §2.5 and §2.8 exempt.
Scope. No "remote" framing. No credentials or past-clients section.
Visuals. Every figure meets the universal checks and its family checks. Greyscale test passes. 360px test passes. 320px reflow test passes. JS-off test passes.
ASCII. No ASCII diagram remains in content.
Motion. JS-off test, reduced-motion test, device-tier test, no-loop audit, budget test, print test, keyboard test — all pass.
Accessibility. Contrast AA both themes. Focus states visible. Reduced motion respected. Every chart has a text alternative stating its finding. Every chart has a data table.
Anchors. Build check passes.
Performance. LCP, INP, CLS within ceilings. First-load JS within ceiling.
Sharing. Open Graph image, title and description set and previewed in a WhatsApp share.

---

T. Report

Deliver docs/rebuild/REPORT.md:

1. Branch name and Vercel preview URL.
2. Old → new mapping table.
3. Replacement log: every prose passage removed, and the visual or explicit cut that replaced it.
4. Every figure built: section, question, data source, tier, chart type.
5. Consistency fixes: value chosen, reason, verification status.
6. Every remaining [DATA NEEDED] and [CONFIRM/EDIT], with the document or decision that closes it.
7. Performance before and after.
8. Assumptions made; anything not done, with reason.

---

U. Self-check

Before reporting, confirm each of these and fix any that fail:

· The document reads objectives, data, analysis, strategy, implementation, next steps. No section repeats another's job.
· Searching outside Annex C for the pollsters' names, "poll", "survey" and "%" finds no poll share used as evidence, and no promise of new polling.
· No engagement fee, cost, budget or spend figure anywhere. No remote framing. No credentials section.
· Every number traces to the data layer.
· Every figure has a title stating its finding, a source, a tier, and a table view.
· The same figure is identical everywhere it appears.
· No prose was removed without either an explicit cut or a replacing visual.
· The site works with JavaScript off, at 320px and 360px, in print, and with reduced motion on.
· Old deep links resolve.
· Every figure in the register exists. None is missing.
· No ASCII diagram remains in content.
· The chart type matches the data relationship (D.1) and the diagram type matches the content (D.2).
· No chart uses a dual axis. No pie has more than three slices.
· Colour is never the sole carrier of meaning in any figure.

Flag anything you assumed rather than verified.

---

Appendix A — Chart chooser (from the guide)

I want to show… Use Avoid
One headline figure Big number with comparison and context A gauge
Performance against a target Bullet chart or progress bar Speedometer
A trend over time Line chart Pie charts
Before vs after (two points) Slope chart or before/after slider Two separate pies
A ranking Ordered horizontal bar Unsorted columns
Composition of one total Stacked bar, waffle, or a pie with ≤5 parts 3D pie
Composition across groups 100% stacked bar Several pies side by side
A hierarchy with sizes Treemap Nested pies
A budget flowing into uses Sankey A long table alone
How a total was built Waterfall A plain list
Survey sentiment Diverging stacked bar Separate pie per question
Relationship between two measures Scatter Dual-axis lines
Spread of values Histogram, box, beeswarm An average alone
Regional rates Choropleth + sortable table Raw counts on a choropleth
Every area at equal weight Tile or hex map A standard map when small areas matter
Seat allocation Parliament/arc Pie
Steps in a process Stepper or flowchart A paragraph
Choices and outcomes Decision tree Nested bullet points
Events over time Vertical timeline (mobile) / horizontal (desktop) Bulleted dates
A project plan Gantt or roadmap A table of dates only
Who is connected to whom Network A long list
Stakeholder priorities Power–interest grid Unranked list
Options compared on criteria Comparison table or 2×2 quadrant Walls of prose
Root causes Fishbone or causal loop A single cause statement
A number that feels abstract Pictogram or scale comparison A bare statistic
A story with a clear sequence Scrollytelling Scrollytelling for everything
A person or place Real photography Stock or AI likenesses
An abstract idea Illustration Stock photo of people pointing at screens
A physical product or venue Gallery, 360° or 3D A single small photo

---

Appendix B — Pre-launch visual QA

Purpose and hierarchy

☐ Every visual does a job text alone cannot do.
☐ Each screen has one clear focal point (passes the squint test).
☐ Chart and diagram headlines state the finding, not the topic.
☐ Chart types match the data relationship; diagram types match the content.

Consistency

☐ Colours, type sizes and spacing all come from defined tokens and scales.
☐ One icon family, one illustration style, one photo treatment.
☐ Semantic colours used only for status.

Accessibility

☐ Text ≥4.5:1 (≥3:1 for large text); UI components and meaningful graphics ≥3:1.
☐ Nothing relies on colour alone; checked with a colour-blindness simulator.
☐ Alt text on every image; charts have summaries and data tables.
☐ Keyboard focus visible everywhere; tab order follows visual order.
☐ Touch targets ≥24 × 24 px (target 44–48 px).
☐ Auto-moving content can be paused; prefers-reduced-motion respected; nothing flashes.
☐ Video has captions; audio has transcripts.
☐ Page works at 320 px wide and at 200% text size.

Performance

☐ LCP ≤2.5s, INP ≤200ms, CLS ≤0.1 on a real mid-range phone.
☐ Images served as AVIF/WebP with fallbacks, correctly sized with srcset.
☐ All images and embeds have dimensions set to prevent CLS.
☐ Hero not lazy-loaded; below-the-fold is.
☐ Fonts are WOFF2, subset, limited in number.
☐ Page weight and JS within budget.

Mobile and sharing

☐ Tested on a 360 px Android on a throttled connection.
☐ No sideways page scroll; wide elements scroll inside their own containers.
☐ Hover-only details also work on tap.
☐ Open Graph image, title and description set and previewed in WhatsApp.
☐ Shareable cards carry the brand mark and web address.

Trust and ethics

☐ Every chart cites its source and date.
☐ Estimates and qualitative data are not drawn as precise measurements.
☐ Uncertainty shown where it exists.
☐ No AI-generated images of real people, events, or evidence.
☐ Photo consent and credits in place.

---

Appendix C — Tools and libraries

Do not add tools without a Phase 0 justification with a measured byte cost and a named capability the existing stack cannot provide.

· Design: Figma, Penpot for prototypes.
· Charts, no code: Datawrapper (clean, accessible, responsive newsroom-style charts), Flourish (animated and scrollytelling), RAWGraphs (unusual types exported as SVG).
· Charts, code: use what is already in the repo. If none, prefer Observable Plot or D3 for bespoke SVGs, Recharts if React primitives already exist. Do not add a second chart library.
· Maps: for this site, none — the tile map is hand-rolled SVG. If a locator map is ever needed, D3-geo or MapLibre.
· Diagrams: Mermaid at build for flowcharts, timelines, quadrants.
· Motion: none beyond CSS + Web Animations API + one IntersectionObserver. No GSAP, no Lottie, no Rive, no Scrollama.
· 3D: the existing lazy-loaded 3D terrain view only. Nothing new.
· Colour, optimisation, testing: ColorBrewer (map palettes); Adobe Leonardo (accessible scales); Squoosh/Sharp/TinyPNG (image compression); SVGO; WebAIM Contrast Checker; axe DevTools, WAVE, Lighthouse; a colour-blindness simulator; NVDA/VoiceOver/TalkBack; PageSpeed Insights and WebPageTest.