# Reorganisation map

Final map, 30 October 2026. It replaces the Step 0 draft and records what the November 2026 restructure did, unit by unit. Every C-number in `inventory.md` appears once. The new location and the treatment are computed from the content as it now stands by `scripts/restructure-2026-11/render_final.py`, not restated from the plan.

Treatments: **Retained** (wording found verbatim, on the same route) · **Moved** (wording found verbatim, on a new route) · **Reworded** (house style; every token, acronym and proper name it carried is still at its new location, which `scripts/restructure-2026-11/check-preservation.mjs` proves on every `npm run verify`) · **Cx + Cy → merged** (Cy is the surviving passage; every fact from Cx is in it) · **Corrected** (the unit conflicted with verified data or the record; the new text carries a source-conflict or correction note) · **Replaced by visual** (an existing visual carries the meaning in full). A lead repeated as its section's first sentence is extractive by design (`check-leads.mjs`) and is not counted as a duplicate.

## 1. Routes

One file and route per chapter; Chapter 15 keeps its four routes. Retired routes redirect (307) to the route that now holds most of their text, in `next.config.ts`: decision → goal, evidence → news, strategy → message, delivery → timeline, staffing → team, measurement → lawful, risks → response, annex-messages → message, annex-cadence → engagement, annex-spec → annex-technology; the October retirements now point straight at their final home. Every old heading id resolves through `lib/anchors/restructure-2026-11.json` and `lib/anchors/redirects.ts` (1,704 redirects, 0 orphans).

## 2. Every unit

| C | Original location | New location | Treatment | Note |
|---|---|---|---|---|
| C1 | `content/cover.md:1` §preamble | Cover | Corrected | Counts corrected to the new six Parts and eight annexes. |
| C2 | `content/cover.md:3` §preamble | Cover | Retained |  |
| C3 | `content/cover.md:5` §preamble | Cover | Reworded |  |
| C4 | `content/cover.md:7` §preamble | Cover | Retained |  |
| C5 | `content/cover.md:12` §preamble | Cover | Retained |  |
| C6 | `content/cover.md:18` §preamble | Cover | Retained | Date is the author's call; flagged in the defect list (D-28). |
| C7 | `content/cover.md:20` §preamble | Cover | Retained |  |
| C8 | `content/cover.md:22` §preamble | 13.2 | C8 + C52 → merged | Cover keeps one line of terms; the credentials statement lives once, in 13.2. |
| C9 | `content/decision.md:3` §1.1 | 23 | Reworded |  |
| C10 | `content/decision.md:5` §1.1 | 23 | Reworded | Becomes the chapter's lead. |
| C11 | `content/decision.md:10` §1.1 | 23 | Retained |  |
| C12 | `content/decision.md:14` §1.1 | In brief | Moved | The five headline numbers become the In brief visual. |
| C13 | `content/decision.md:34` §1.1 | 23.1 | Reworded |  |
| C14 | `content/decision.md:49` §1.1 | 23 | Reworded | Plain heading. |
| C15 | `content/decision.md:51` §1.1 | 23 | Moved | 'Outstanding' cut (no number behind it); the audit sentence cross-refers to 3.7. Wording kept; cross-references renumbered. |
| C16 | `content/decision.md:58` §1.1 | 23 | Moved | Wording kept; cross-references renumbered. |
| C17 | `content/decision.md:63` §1.1 | 23 | Moved | Wording kept; cross-references renumbered. |
| C18 | `content/decision.md:72` §1.1 | 9.1 | C18 + C267 → merged | The premise is the position; stated once in 9.1. |
| C19 | `content/decision.md:76` §1.1 | 23 | C19 + C10 → merged |  |
| C20 | `content/decision.md:80` §1.1 | 23 | C20 + C14 → merged | Two headings for one ask become one. |
| C21 | `content/decision.md:82` §1.1 | 23 | C21 + C10 → merged |  |
| C22 | `content/decision.md:84` §1.1 | 23 | Moved |  |
| C23 | `content/decision.md:89` §1.1 | 13.1 | C23 + C54 → merged | The three steps live once, in the 13.1 stepper. |
| C24 | `content/decision.md:93` §1.1 | 13.2 | C24 + C52 → merged |  |
| C25 | `content/decision.md:98` §1.1 | 5.3 | C25 + C160 → merged | The rivals' 2022 results are stated once, in the 5.3 cards. |
| C26 | `content/decision.md:102` §1.1 | 22 | C26 + C97 → merged |  |
| C27 | `content/decision.md:106` §1.2 | 8.1 | Reworded |  |
| C28 | `content/decision.md:108` §1.2 | 8.1 | Moved | Becomes the chapter lead. |
| C29 | `content/decision.md:112` §1.2 | 8.1 | Reworded |  |
| C30 | `content/decision.md:114` §1.2 | 8.1 | Reworded |  |
| C31 | `content/decision.md:116` §1.2 | 8.1 | Reworded |  |
| C32 | `content/decision.md:119` §1.2 | 8.1 | Retained |  |
| C33 | `content/decision.md:121` §1.2 | 8.1 | C33 + C34 → merged | Intro sentence folds into the list. |
| C34 | `content/decision.md:122` §1.2 | 8.1 | Reworded |  |
| C35 | `content/decision.md:125` §1.2 | 8.1 | Retained |  |
| C36 | `content/decision.md:129` §1.3 | 8 | Moved |  |
| C37 | `content/decision.md:131` §1.3 | 8.2 | Retained |  |
| C38 | `content/decision.md:135` §1.3.1 | 8.2 | Reworded |  |
| C39 | `content/decision.md:137` §1.3.1 | 8.2.1 | Reworded |  |
| C40 | `content/decision.md:152` §1.3.2 | 8.2 | Reworded |  |
| C41 | `content/decision.md:154` §1.3.2 | 8.2.2 | Reworded |  |
| C42 | `content/decision.md:169` §1.3.3 | 8.2 | Reworded |  |
| C43 | `content/decision.md:171` §1.3.3 | 8.2.3 | Reworded |  |
| C44 | `content/decision.md:187` §1.3.4 | 8.2 | Reworded |  |
| C45 | `content/decision.md:189` §1.3.4 | 8.2.4 | Reworded |  |
| C46 | `content/decision.md:205` §1.3.5 | 8.2 | Reworded |  |
| C47 | `content/decision.md:207` §1.3.5 | 8.2.5 | Reworded |  |
| C48 | `content/decision.md:221` §1.4 | 13.2 | Reworded |  |
| C49 | `content/decision.md:223` §1.4 | 13.2 | Moved | Conflict C3 (7/6/2 v 6/6/2) stays marked until the author settles it. |
| C50 | `content/decision.md:227` §1.4.1 | 13.1 | Reworded |  |
| C51 | `content/decision.md:229` §1.4.1 | 13.2 | C51 + C52 → merged | Lead repeated verbatim in the paragraph beneath it. |
| C52 | `content/decision.md:233` §1.4.1 | 13.2 | Reworded | Surviving passage for the 'publishes nothing' statement (cover, 1.1, 1.4.1, 4.1.1, 4.6.2). |
| C53 | `content/decision.md:235` §1.4.1 | 13.1 | Retained |  |
| C54 | `content/decision.md:239` §1.4.1 | 13.1 | Reworded |  |
| C55 | `content/decision.md:252` §1.4.2 | 13.2 | Moved |  |
| C56 | `content/decision.md:254` §1.4.2 | 13.2 | C56 + C65 → merged |  |
| C57 | `content/decision.md:258` §1.4.2 | 13.2 | Retained |  |
| C58 | `content/decision.md:260` §1.4.2 | 13.2 | Reworded |  |
| C59 | `content/decision.md:263` §1.4.2 | 13.2 | Moved |  |
| C60 | `content/decision.md:272` §1.4.2 | 13.2 | Reworded |  |
| C61 | `content/decision.md:276` §1.4.2 | 13.2 | Reworded |  |
| C62 | `content/decision.md:278` §1.4.2 | 13.2 | Retained |  |
| C63 | `content/decision.md:282` §1.4.2 | 13.2 | Reworded |  |
| C64 | `content/decision.md:291` §1.4.2 | 13.2 | Retained |  |
| C65 | `content/decision.md:293` §1.4.2 | 13.2 | Reworded |  |
| C66 | `content/decision.md:295` §1.4.2 | 13.1 | Reworded | No credentials or past-client section, per house rules; the sentence already says so. |
| C67 | `content/decision.md:297` §1.4.3 | 13.3 | Reworded |  |
| C68 | `content/decision.md:299` §1.4.3 | 13.3 | Moved |  |
| C69 | `content/decision.md:302` §1.4.3 | 13.3 | Reworded |  |
| C70 | `content/decision.md:333` §1.5 | 21.1 | Reworded |  |
| C71 | `content/decision.md:334` §1.5.1 | 21.1 | Retained |  |
| C72 | `content/decision.md:336` §1.5.1 | 21.1.1 | C72 + C76 → merged |  |
| C73 | `content/decision.md:340` §1.5.1 | 14.4 | Reworded | The four target quantities belong with the target ladder. |
| C74 | `content/decision.md:343` §1.5.1 | 14.4 | Moved | Wording kept; cross-references renumbered. |
| C75 | `content/decision.md:360` §1.5.1 | 14.4 | Moved |  |
| C76 | `content/decision.md:363` §1.5.1 | 21.1.1 | Moved | Surviving passage; the lead above it is merged into it. |
| C77 | `content/decision.md:369` §1.5.1 | 21.1.1 | Moved | Keep-marked text: wording retained verbatim. Wording kept; cross-references renumbered. |
| C78 | `content/decision.md:373` §1.5.1 | 21.1 | Reworded |  |
| C79 | `content/decision.md:374` §1.5.1 | 21.1.1 | Moved |  |
| C80 | `content/decision.md:375` §1.5.1 | 21.1.1 | Reworded |  |
| C81 | `content/decision.md:386` §1.5.1 | 21.1 | Reworded |  |
| C82 | `content/decision.md:387` §1.5.1 | 21.1.1 | Moved |  |
| C83 | `content/decision.md:388` §1.5.1 | 21.1.1 | Reworded |  |
| C84 | `content/decision.md:398` §1.5.1 | 21.1 | Reworded |  |
| C85 | `content/decision.md:399` §1.5.1 | 21.1.1 | Moved |  |
| C86 | `content/decision.md:400` §1.5.1 | 21.1.1 | Reworded |  |
| C87 | `content/decision.md:412` §1.5.2 | 21.1 | Reworded |  |
| C88 | `content/decision.md:414` §1.5.2 | 21.1 | Retained |  |
| C89 | `content/decision.md:418` §1.5.2 | 21.1.2 | Moved |  |
| C90 | `content/decision.md:427` §1.5.3 | 21.2 | Reworded |  |
| C91 | `content/decision.md:429` §1.5.3 | 21.2 | C91 + C92 → merged | Lead repeats the passage beneath it word for word; one survives. |
| C92 | `content/decision.md:433` §1.5.3 | 21.2 | Reworded |  |
| C93 | `content/decision.md:438` §1.5.3 | 21.2 | Moved |  |
| C94 | `content/decision.md:442` §1.5.3 | 21.2 | Corrected | Keep-marked table: wording retained; its last column gave October section numbers, renumbered to the current ones with a source-conflict note. |
| C95 | `content/decision.md:464` §1.5.3 | 22.2 | Reworded | Gated deliverables sit with the campaign's dependencies. |
| C96 | `content/decision.md:475` §1.6 | 22.1 | Reworded |  |
| C97 | `content/decision.md:477` §1.6 | 22 | Reworded |  |
| C98 | `content/decision.md:480` §1.6 | 22.1 | Moved | Wording kept; cross-references renumbered. |
| C99 | `content/decision.md:496` §1.7 | 22.2 | Reworded |  |
| C100 | `content/decision.md:498` §1.7 | 22.2 | C100 + C101 → merged |  |
| C101 | `content/decision.md:500` §1.7 | 22.2 | Reworded |  |
| C102 | `content/decision.md:502` §1.7 | 22.2 | Retained |  |
| C103 | `content/decision.md:506` §1.7 | 22.2 | Reworded |  |
| C104 | `content/decision.md:521` §1.8 | 7.4 | Reworded |  |
| C105 | `content/decision.md:523` §1.8 | 7.4 | Moved |  |
| C106 | `content/decision.md:527` §1.8 | 7.4 | C106 + C105 → merged | Paragraph repeats the lead verbatim; the lead survives. |
| C107 | `content/decision.md:531` §1.8 | 7.4 | Corrected | Assumption 2 is fused into card 1's body; split into its own card and renumber 1–11 without 4a–4d. |
| C108 | `content/decision.md:562` §1.9 | 18.1 | Reworded |  |
| C109 | `content/decision.md:564` §1.9 | 18 | C109 + C723 → merged |  |
| C110 | `content/decision.md:566` §1.9 | 18.1 | Retained |  |
| C111 | `content/decision.md:570` §1.9 | 18.1 | Reworded | Cross-reference renumbered to 18.2. |
| C112 | `content/evidence.md:3` §2.1 | 2.1 | Reworded |  |
| C113 | `content/evidence.md:5` §2.1 | 2.5 | Moved | The benchmark is the 2.5 lead; Chapter 2 opens on the electorate. |
| C114 | `content/evidence.md:9` §2.1 | 2.1 | Retained |  |
| C115 | `content/evidence.md:11` §2.1 | 2.1 | Corrected | Turnout card states its base: governor valid votes ÷ register (61.7%); presidential turnout ≈62% includes rejected ballots (Source conflict note). |
| C116 | `content/evidence.md:39` §2.1 | 2.1 | Retained |  |
| C117 | `content/evidence.md:43` §2.1 | 2.1 | Reworded | Cross-reference renumbered to Annex B. |
| C118 | `content/evidence.md:45` §2.1 | 2.5 | Reworded |  |
| C119 | `content/evidence.md:47` §2.1 | 2.5 | Reworded | C8 (328,760 v 328,712) stays marked. |
| C120 | `content/evidence.md:66` §2.1 | 2.5 | Retained |  |
| C121 | `content/evidence.md:70` §2.2 | 2.2 | Reworded |  |
| C122 | `content/evidence.md:72` §2.2 | 2.2 | Moved | Chapter-section lead; the bullets below are its evidence. Presidential 2022 result added from verified data (new figure tokens). |
| C123 | `content/evidence.md:76` §2.2 | 2.2 | Reworded |  |
| C124 | `content/evidence.md:83` §2.2 | 2.2 | Retained |  |
| C125 | `content/evidence.md:87` §2.3 | 2.3 | Retained |  |
| C126 | `content/evidence.md:89` §2.3 | 2.3 | Reworded |  |
| C127 | `content/evidence.md:91` §2.3 | 2.3 | Retained |  |
| C128 | `content/evidence.md:95` §2.3 | 2.3 | Reworded | Heading becomes 'Where the votes concentrate'. |
| C129 | `content/evidence.md:113` §2.3.1 | 2.4 | Reworded |  |
| C130 | `content/evidence.md:115` §2.3.1 | 2.4 | Moved |  |
| C131 | `content/evidence.md:119` §2.3.1 | 2.4 | Reworded |  |
| C132 | `content/evidence.md:121` §2.3.1 | 2.4 | Retained |  |
| C133 | `content/evidence.md:125` §2.3.1 | 2.4 | Moved |  |
| C134 | `content/evidence.md:127` §2.3.1 | 2.4 | C134 + C130 → merged | Lead and paragraph say the same thing; one passage survives. |
| C135 | `content/evidence.md:129` §2.3.1 | 2.4 | Reworded | Heading becomes 'The four constituencies that decide it'. |
| C136 | `content/evidence.md:130` §2.3.1 | 2.4 | Reworded | 'Decides the gubernatorial election' carries no number; reworded to the share. |
| C137 | `content/evidence.md:134` §2.4 | 2.5 | Moved |  |
| C138 | `content/evidence.md:136` §2.4 | 2.5 | Moved |  |
| C139 | `content/evidence.md:140` §2.4 | 2.5 | Reworded | Last two sentences repeat the lead; cut there, kept in the lead. |
| C140 | `content/evidence.md:142` §2.4 | 2.5 | Retained |  |
| C141 | `content/evidence.md:146` §2.4 | 2.5 | Reworded |  |
| C142 | `content/evidence.md:186` §2.5 | 5.2 | Reworded |  |
| C143 | `content/evidence.md:188` §2.5 | 5.2 | Retained |  |
| C144 | `content/evidence.md:192` §2.5.1 | 5.2 | Reworded |  |
| C145 | `content/evidence.md:194` §2.5.1 | 5.2 | Moved |  |
| C146 | `content/evidence.md:198` §2.5.1 | 5.2 | C146 + C145 → merged |  |
| C147 | `content/evidence.md:200` §2.5.1 | 5.2 | Reworded | Stale cross-reference (1.2 does not state the claim); repointed to 7.4. |
| C148 | `content/evidence.md:206` §2.5.1 | 5.2 | Reworded |  |
| C149 | `content/evidence.md:211` §2.5.1 | 5.2 | Reworded |  |
| C150 | `content/evidence.md:218` §2.5.2 | 5.2 | Reworded |  |
| C151 | `content/evidence.md:220` §2.5.2 | 5.2 | Moved |  |
| C152 | `content/evidence.md:225` §2.5.2 | 5.2 | Reworded |  |
| C153 | `content/evidence.md:227` §2.5.2 | 5.2 | Reworded |  |
| C154 | `content/evidence.md:236` §2.6 | 5.3 | Reworded |  |
| C155 | `content/evidence.md:238` §2.6 | 5.3 | Reworded |  |
| C156 | `content/evidence.md:240` §2.6 | 5.3 | Reworded |  |
| C157 | `content/evidence.md:242` §2.6 | 5.3 | Retained |  |
| C158 | `content/evidence.md:246` §2.6.1 | 5.3 | Moved |  |
| C159 | `content/evidence.md:248` §2.6.1 | 5.3 | Reworded |  |
| C160 | `content/evidence.md:250` §2.6.1 | 5.3 | Reworded |  |
| C161 | `content/evidence.md:271` §2.6.1 | 10.1 | Reworded | Conflict C6 cluster: sits beside Message Pillar 3 so the policy call is made in one place. |
| C162 | `content/evidence.md:280` §2.6.1 | 5.3 | Moved |  |
| C163 | `content/evidence.md:282` §2.6.2 | 5.3 | Moved |  |
| C164 | `content/evidence.md:284` §2.6.2 | 5.3 | Reworded |  |
| C165 | `content/evidence.md:286` §2.6.2 | 5.3 | Reworded |  |
| C166 | `content/evidence.md:311` §2.6.3 | 5.1 | Reworded |  |
| C167 | `content/evidence.md:313` §2.6.3 | 5.1 | Moved | Lead. |
| C168 | `content/evidence.md:317` §2.6.3 | 5.1 | C168 + C918 → merged | Surviving passage is this one (5.1); B.5's Malombe line folds into it. Missing space after 'throughout.' fixed. |
| C169 | `content/evidence.md:319` §2.6.3 | 5.1 | Reworded |  |
| C170 | `content/evidence.md:321` §2.6.3 | 5.1 | Moved | Keep-marked text: wording retained verbatim. Wording kept; cross-references renumbered. |
| C171 | `content/evidence.md:323` §2.6.4 | 5.5 | Reworded |  |
| C172 | `content/evidence.md:325` §2.6.4 | 5.5 | C172 + C173 → merged |  |
| C173 | `content/evidence.md:329` §2.6.4 | 5.5 | Reworded |  |
| C174 | `content/evidence.md:343` §2.7 | 6 | Reworded |  |
| C175 | `content/evidence.md:346` §2.7.1 | 6.2 | Reworded |  |
| C176 | `content/evidence.md:348` §2.7.1 | 6.2 | Moved | Lead. |
| C177 | `content/evidence.md:351` §2.7.1 | 6.2 | Reworded | Name standardised (house style). |
| C178 | `content/evidence.md:358` §2.7.1 | 6.2 | Reworded |  |
| C179 | `content/evidence.md:359` §2.7.1 | 6.2 | C179 + C176 → merged |  |
| C180 | `content/evidence.md:361` §2.7.1 | 6.2 | Reworded |  |
| C181 | `content/evidence.md:363` §2.7.1 | 6.2 | Moved |  |
| C182 | `content/evidence.md:366` §2.7.1 | 6.2 | Moved |  |
| C183 | `content/evidence.md:368` §2.7.1 | 6.2 | Reworded |  |
| C184 | `content/evidence.md:381` §2.7.1 | 6.2 | C184 + C176 → merged |  |
| C185 | `content/evidence.md:383` §2.7.1 | 6.2 | Retained |  |
| C186 | `content/evidence.md:387` §2.7.2 | 6.3 | Reworded |  |
| C187 | `content/evidence.md:389` §2.7.2 | 6.3 | C187 + C188 → merged | Lead restates the two paragraphs under it. |
| C188 | `content/evidence.md:393` §2.7.2 | 6.3 | Reworded |  |
| C189 | `content/evidence.md:402` §2.7.2 | 6.3 | Reworded |  |
| C190 | `content/evidence.md:410` §2.7.2 | 6.3 | Retained |  |
| C191 | `content/evidence.md:414` §2.8 | 1 | Reworded | Becomes Chapter 1 'Kitui at a Glance'. |
| C192 | `content/evidence.md:416` §2.8.1 | 1.1 | Reworded |  |
| C193 | `content/evidence.md:418` §2.8.1 | 1 | Reworded | Becomes Chapter 1's lead (answer first). |
| C194 | `content/evidence.md:420` §2.8.1 | 1.3 | Corrected | Split: population/households → 1.1; area, density, rural/urban → 1.2; poverty and surface water → 1.3; livestock and poultry → 3.2. Rural/urban share: the site's 95.2%/4.8% (T1) conflicts with the verified-data note (urban share [VERIFY]; secondary sources ≈86% rural) — Source conflict note added; median age (17) added as new T2 token; age bands [VERIFY]. |
| C195 | `content/evidence.md:449` §2.8.1 | 1.1 | Retained |  |
| C196 | `content/evidence.md:453` §2.8.1 | 3.2 | Reworded |  |
| C197 | `content/evidence.md:455` §2.8.1 | 3.2 | Reworded | Merged in 3.2 with B.3's IPC passage (the IPC 2 / Alert facts repeat). |
| C198 | `content/evidence.md:474` §2.8.2 | 1.5 | Reworded |  |
| C199 | `content/evidence.md:476` §2.8.2 | 1.5 | C199 + C203 → merged |  |
| C200 | `content/evidence.md:480` §2.8.2 | 1.4 | Reworded | What a governor runs belongs with how the county is run. |
| C201 | `content/evidence.md:482` §2.8.2 | 1.4 | Reworded |  |
| C202 | `content/evidence.md:495` §2.8.2 | 1.5 | Reworded | Plain heading; labelled as the CFSP (not the ADP). |
| C203 | `content/evidence.md:496` §2.8.2 | 1.5 | Corrected | Labels the document (CFSP 2026/27, T3); notes the FY2026/27 budget was unapproved after 30 June 2026 (The Star, 6 July 2026); the unconfirmed ADP figure (KSh 14.27bn) is not used — Source conflict note. |
| C204 | `content/evidence.md:497` §2.8.2 | 1.5 | Reworded |  |
| C205 | `content/evidence.md:501` §2.8.2 | 1.5 | Retained |  |
| C206 | `content/evidence.md:505` §2.8.2 | 1.5 | Reworded | Its last sentence repeats the lead's Tier 3 caveat; kept once. |
| C207 | `content/evidence.md:507` §2.8.2 | 1.5 | Reworded | Plain label; the claim moves to 'what it means for the campaign'. |
| C208 | `content/evidence.md:509` §2.8.3 | 1.2 | Reworded |  |
| C209 | `content/evidence.md:511` §2.8.3 | 1.2 | Reworded |  |
| C210 | `content/evidence.md:515` §2.8.3 | 1.2 | Retained |  |
| C211 | `content/evidence.md:519` §2.8.3 | 1.2 | Corrected | Two [CHECK REF]s repointed: 'Section 4.3' → 15.3 (Workstream 9); '3.3.3' → Annex B. |
| C212 | `content/evidence.md:532` §2.9 | 4 | Reworded |  |
| C213 | `content/evidence.md:534` §2.9.1 | 4.1 | Reworded |  |
| C214 | `content/evidence.md:536` §2.9.1 | 4.1 | Reworded |  |
| C215 | `content/evidence.md:556` §2.9.1 | 4.1 | Reworded |  |
| C216 | `content/evidence.md:565` §2.9.1 | 4.1 | Reworded |  |
| C217 | `content/evidence.md:567` §2.9.1 | 4.1 | Retained |  |
| C218 | `content/evidence.md:571` §2.9.1 | 4.3 | Reworded |  |
| C219 | `content/evidence.md:573` §2.9.1 | 4.3 | Reworded |  |
| C220 | `content/evidence.md:575` §2.9.2 | 4.2 | Retained |  |
| C221 | `content/evidence.md:577` §2.9.2 | 4.2 | Reworded | Lead. |
| C222 | `content/evidence.md:581` §2.9.2 | 4.2 | C222 + C221 → merged | Repeats the lead. |
| C223 | `content/evidence.md:583` §2.9.2 | 4.2 | Reworded |  |
| C224 | `content/evidence.md:585` §2.9.2 | 4.2 | Retained |  |
| C225 | `content/evidence.md:589` §2.9.2 | 4.2 | C225 + C557 → merged | The station table moves here from 4.5.6; this pointer is no longer needed. |
| C226 | `content/evidence.md:594` §2.9.2 | 4.2 | Reworded |  |
| C227 | `content/evidence.md:597` §2.9.2 | 4.2 | Reworded |  |
| C228 | `content/evidence.md:609` §2.9.2 | 4.2 | Reworded |  |
| C229 | `content/evidence.md:614` §2.9.3 | 4.3 | Reworded |  |
| C230 | `content/evidence.md:616` §2.9.3 | 4.3 | C230 + C233 → merged | Lead repeats the passage beneath it word for word; one survives. |
| C231 | `content/evidence.md:620` §2.9.3 | 4.1 | Reworded |  |
| C232 | `content/evidence.md:622` §2.9.3 | 4.3 | Retained |  |
| C233 | `content/evidence.md:626` §2.9.3 | 4.3 | Reworded |  |
| C234 | `content/evidence.md:633` §2.9.3 | 4.3 | Reworded |  |
| C235 | `content/evidence.md:635` §2.9.3 | 4.3 | Reworded |  |
| C236 | `content/evidence.md:657` §2.9.4 | 4 | Reworded |  |
| C237 | `content/evidence.md:659` §2.9.4 | 4.4 | C237 + C238 → merged | Lead repeats the passage beneath it word for word; one survives. |
| C238 | `content/evidence.md:664` §2.9.4 | 4.4 | C238 + C237 → merged |  |
| C239 | `content/evidence.md:666` §2.9.4 | 4.4 | Reworded |  |
| C240 | `content/evidence.md:693` §2.9.4 | 4.4 | Reworded |  |
| C241 | `content/evidence.md:723` §2.10 | 6 | Reworded |  |
| C242 | `content/evidence.md:725` §2.10.1 | 6.1 | Reworded |  |
| C243 | `content/evidence.md:727` §2.10.1 | 6.1 | Moved | Lead; name per house style ('Dr. Makali Mulu' at first mention in the chapter). |
| C244 | `content/evidence.md:731` §2.10.1 | 6.1 | Reworded | Surviving passage of the record merge (2.10.1 + 3.1 + 3.1.1); first two sentences cut as they repeat the lead. |
| C245 | `content/evidence.md:733` §2.10.1 | 6.1 | Retained |  |
| C246 | `content/evidence.md:737` §2.10.1 | 6.1 | Reworded | Column heads become 'The evidence' and 'How we would use it'; every fact from 3.1.1 folded in. |
| C247 | `content/evidence.md:746` §2.10.1 | 6.1 | Moved |  |
| C248 | `content/evidence.md:752` §2.10.2 | 6.4 | Reworded |  |
| C249 | `content/evidence.md:754` §2.10.2 | 6.4 | Retained |  |
| C250 | `content/evidence.md:758` §2.10.2 | 6.4 | Reworded |  |
| C251 | `content/evidence.md:763` §2.10.3 | 6.5 | Reworded |  |
| C252 | `content/evidence.md:765` §2.10.3 | 6.5 | Reworded |  |
| C253 | `content/evidence.md:769` §2.10.3 | 6.5 | Retained |  |
| C254 | `content/evidence.md:773` §2.10.3 | 6.5 | Reworded |  |
| C255 | `content/evidence.md:793` §2.10.3 | 6.5 | Reworded |  |
| C256 | `content/evidence.md:796` §2.11 | 7.3 | Reworded |  |
| C257 | `content/evidence.md:798` §2.11 | 7.3 | Reworded | House style: plain opening. |
| C258 | `content/evidence.md:800` §2.11 | 7.3 | Reworded |  |
| C259 | `content/evidence.md:804` §2.11 | 7.3 | Retained |  |
| C260 | `content/evidence.md:810` §2.11 | 7.3 | Reworded |  |
| C261 | `content/evidence.md:812` §2.12 | 7.1 | Reworded |  |
| C262 | `content/evidence.md:814` §2.12 | 7.1 | Reworded | Split: hypothesis and 'for' → 7.1; 'against' and 'test' → 7.2. |
| C263 | `content/evidence.md:823` §2.12 | 7.1 | Retained |  |
| C264 | `content/strategy.md:3` §3.1 | 9.1 | Reworded |  |
| C265 | `content/strategy.md:5` §3.1 | 9 | Moved | Lead. |
| C266 | `content/strategy.md:9` §3.1 | 9.1 | Reworded |  |
| C267 | `content/strategy.md:11` §3.1 | 9 | C267 + C265 → merged |  |
| C268 | `content/strategy.md:14` §3.1 | 6.1 | C268 + C244 → merged | Record merge. |
| C269 | `content/strategy.md:16` §3.1 | 9.1 | Reworded |  |
| C270 | `content/strategy.md:20` §3.1.1 | 6.1 | C270 + C242 → merged | Heading id redirects to 6.1. |
| C271 | `content/strategy.md:22` §3.1.1 | 6.1 | C271 + C244 → merged | Record merge. |
| C272 | `content/strategy.md:26` §3.1.1 | 6.1 | C272 + C244 → merged | Record merge. |
| C273 | `content/strategy.md:27` §3.1.1 | 6.1 | C273 + C246 → merged | Every fact (bursaries, 71-constituency ranking, ESK, M&E Champion) folded into the 6.1 table. |
| C274 | `content/strategy.md:32` §3.1.2 | 9.2 | Reworded |  |
| C275 | `content/strategy.md:34` §3.1.2 | 9.2 | Moved |  |
| C276 | `content/strategy.md:38` §3.1.2 | 9.2 | C276 + C275 → merged |  |
| C277 | `content/strategy.md:40` §3.1.2 | 9.2 | Corrected | Envelope tier corrected from Tier 1 to Tier 3 (as in figures.ts and 1.5). |
| C278 | `content/strategy.md:41` §3.1.2 | 3.7 | C278 + C898 → merged | The four audit findings appear once, in 3.7 (as the bars visual: Replaced by visual for B.2's list). |
| C279 | `content/strategy.md:59` §3.1.2 | 9.2 | Reworded | Pending-bills figure cross-refers to 3.7; the argument sentence stays in 9.2. |
| C280 | `content/strategy.md:61` §3.1.3 | 9.3 | Reworded |  |
| C281 | `content/strategy.md:63` §3.1.3 | 9.3 | Reworded |  |
| C282 | `content/strategy.md:64` §3.1.3 | 9.3 | Reworded |  |
| C283 | `content/strategy.md:71` §3.2 | 10.1 | Reworded |  |
| C284 | `content/strategy.md:73` §3.2 | 10.1 | Reworded | Lead rewritten to the layered architecture: claim → three pillars → six themes → content types. |
| C285 | `content/strategy.md:77` §3.2 | 10.1 | C285 + C284 → merged | Pillar merge (see Duplication list, D-3). |
| C286 | `content/strategy.md:84` §3.2 | 10.1 | Reworded | Redrawn as one layered diagram: one claim, three pillars, six themes, four content types. |
| C287 | `content/strategy.md:97` §3.2.1 | 10.1 | Retained |  |
| C288 | `content/strategy.md:99` §3.2.1 | 10.1 | C288 + C290 → merged | Lead repeats the passage beneath it word for word; one survives. |
| C289 | `content/strategy.md:103` §3.2.1 | 10.1 | C289 + C284 → merged |  |
| C290 | `content/strategy.md:105` §3.2.1 | 10.1 | C290 + C288 → merged |  |
| C291 | `content/strategy.md:109` §3.2.1 | 10.1 | C291 + C294 → merged |  |
| C292 | `content/strategy.md:111` §3.2.1 | 10.1 | C292 + C295 → merged | Four campaign pillars fold into the three message pillars (the crosswalk already maps 1+4 → MP1, 3 → MP2, 1+2 → MP3); every fact kept, the verification pillar becomes MP1's proof mechanism. |
| C293 | `content/strategy.md:131` §3.2.1 | 10.1 | Retained |  |
| C294 | `content/strategy.md:135` §3.2.2 | 10.1 | Reworded |  |
| C295 | `content/strategy.md:136` §3.2.2 | 10.1 | Reworded |  |
| C296 | `content/strategy.md:161` §3.2.2 | 10.1 | Reworded | Conflict C6 cluster. |
| C297 | `content/strategy.md:173` §3.2.2 | 10.4 | C297 + C919 → merged | Annex C now lives in 10.4. |
| C298 | `content/strategy.md:177` §3.2.3 | 10.1 | Reworded |  |
| C299 | `content/strategy.md:179` §3.2.3 | 10.1 | Reworded |  |
| C300 | `content/strategy.md:183` §3.2.3 | 10.1 | C300 + C288 → merged | Cover line quoted once. |
| C301 | `content/strategy.md:187` §3.2.3 | 10.1 | Reworded | P1–P4 become the 'content types' layer of the architecture. |
| C302 | `content/strategy.md:192` §3.2.3 | 10.1 | Reworded |  |
| C303 | `content/strategy.md:195` §3.2.3 | 10.1 | Reworded |  |
| C304 | `content/strategy.md:209` §3.2.3 | 10.1 | C304 + C299 → merged |  |
| C305 | `content/strategy.md:212` §3.2.3 | 10.1 | Retained |  |
| C306 | `content/strategy.md:216` §3.2.3 | 10.1 | Moved |  |
| C307 | `content/strategy.md:219` §3.2.3 | 10.1 | C307 + C301 → merged | Content buckets A–D merge into the content-types layer. |
| C308 | `content/strategy.md:221` §3.2.3 | 10.1 | C308 + C301 → merged | Stale cross-reference (3.7 is the week calendar). |
| C309 | `content/strategy.md:225` §3.2.3 | 10.1 | C309 + C301 → merged |  |
| C310 | `content/strategy.md:229` §3.2.3 | 10.1 | C310 + C303 → merged | Each bucket's formats, tone and Kikamba name join the matching P-row; every fact kept. |
| C311 | `content/strategy.md:255` §3.2.4 | 10.1 | Reworded |  |
| C312 | `content/strategy.md:257` §3.2.4 | 10.1 | C312 + C313 → merged | Lead repeats the passage beneath it word for word; one survives. |
| C313 | `content/strategy.md:261` §3.2.4 | 10.1 | C313 + C312 → merged |  |
| C314 | `content/strategy.md:263` §3.2.4 | 3.1 | Reworded | Split: each theme's evidence → Chapter 3 (water → 3.1; economy, green grams, food share → 3.2/3.6; fiscal → 1.5 (the budget envelope) and 3.7; youth → 3.5; health → 3.3; education → 3.5); theme names and 'why it matters' → 10.1. |
| C315 | `content/strategy.md:304` §3.2.4 | 3.2 | Reworded | Border and herder insecurity sits with drought and pasture. |
| C316 | `content/strategy.md:306` §3.2.4 | 9.1 | C316 + C265 → merged | Governing line stated once in 9.1. |
| C317 | `content/strategy.md:310` §3.3 | 12 | Reworded |  |
| C318 | `content/strategy.md:312` §3.3.1 | 12.1 | Reworded |  |
| C319 | `content/strategy.md:314` §3.3.1 | 12.1 | Moved | Lead. Wording kept; cross-references renumbered. |
| C320 | `content/strategy.md:317` §3.3.1 | 12.1 | C320 + C318 → merged |  |
| C321 | `content/strategy.md:318` §3.3.1 | 12.1 | Reworded | First clause repeats the lead. |
| C322 | `content/strategy.md:319` §3.3.1 | 12.1 | Reworded |  |
| C323 | `content/strategy.md:330` §3.3.1 | 12.1 | Reworded |  |
| C324 | `content/strategy.md:333` §3.3.1 | 12.1 | C324 + C327 → merged | Orphan line becomes the figure's caption. |
| C325 | `content/strategy.md:336` §3.3.1 | 12.1 | C325 + C326 → merged | Lead repeats the coverage note. |
| C326 | `content/strategy.md:340` §3.3.1 | 12.1 | Reworded |  |
| C327 | `content/strategy.md:348` §3.3.1 | 12.1 | Retained |  |
| C328 | `content/strategy.md:352` §3.3.1 | 12.1 | Reworded |  |
| C329 | `content/strategy.md:358` §3.3.2 | 12.2 | Reworded |  |
| C330 | `content/strategy.md:360` §3.3.2 | 12.2 | Moved | Lead. |
| C331 | `content/strategy.md:364` §3.3.2 | 12.2 | Reworded |  |
| C332 | `content/strategy.md:366` §3.3.2 | 12.2 | Reworded |  |
| C333 | `content/strategy.md:371` §3.3.2 | 12.2 | Retained |  |
| C334 | `content/strategy.md:375` §3.3.2 | 12.2 | Moved |  |
| C335 | `content/strategy.md:385` §3.3.2 | 12.2 | Reworded |  |
| C336 | `content/strategy.md:387` §3.3.2 | 12.2 | Moved | Wording kept; cross-references renumbered. |
| C337 | `content/strategy.md:396` §3.3.2 | 12.2 | Reworded |  |
| C338 | `content/strategy.md:404` §3.3.3 | 12.3 | Reworded |  |
| C339 | `content/strategy.md:406` §3.3.3 | 12.3 | Reworded |  |
| C340 | `content/strategy.md:407` §3.3.3 | 12.3 | Reworded |  |
| C341 | `content/strategy.md:419` §3.4 | 11 | Reworded |  |
| C342 | `content/strategy.md:421` §3.4 | 11 | Reworded |  |
| C343 | `content/strategy.md:423` §3.4 | 11 | Retained |  |
| C344 | `content/strategy.md:427` §3.4.1 | 11.1 | Reworded |  |
| C345 | `content/strategy.md:429` §3.4.1 | 11.1 | C345 + C346 → merged |  |
| C346 | `content/strategy.md:433` §3.4.1 | 11.1 | Reworded |  |
| C347 | `content/strategy.md:438` §3.4.1 | 11.1 | Moved | Wording kept; cross-references renumbered. |
| C348 | `content/strategy.md:455` §3.4.1 | 11.1 | Reworded |  |
| C349 | `content/strategy.md:464` §3.4.2 | 11.2 | Reworded |  |
| C350 | `content/strategy.md:466` §3.4.2 | 11.2 | C350 + C351 → merged |  |
| C351 | `content/strategy.md:470` §3.4.2 | 11.2 | Reworded | Stale cross-reference (3.7 → 10.1). |
| C352 | `content/strategy.md:473` §3.4.2 | 11.2 | Reworded |  |
| C353 | `content/strategy.md:477` §3.4.2 | 11.2 | Reworded |  |
| C354 | `content/strategy.md:484` §3.4.2 | 11.2 | Reworded |  |
| C355 | `content/strategy.md:486` §3.4.2 | 11.2 | Reworded |  |
| C356 | `content/strategy.md:554` §3.4.3 | 11.3 | Reworded |  |
| C357 | `content/strategy.md:556` §3.4.3 | 11.3 | C357 + C358 → merged |  |
| C358 | `content/strategy.md:560` §3.4.3 | 11.3 | Reworded |  |
| C359 | `content/strategy.md:566` §3.4.3 | 11.3 | Reworded |  |
| C360 | `content/strategy.md:572` §3.4.3 | 11.3 | Retained |  |
| C361 | `content/strategy.md:579` §3.5 | 10.2 | Reworded |  |
| C362 | `content/strategy.md:581` §3.5 | 10.2 | C362 + C364 → merged | Wording kept; cross-references renumbered. |
| C363 | `content/strategy.md:585` §3.5 | 10.2 | Reworded |  |
| C364 | `content/strategy.md:587` §3.5 | 10.2 | Reworded |  |
| C365 | `content/strategy.md:590` §3.5 | 10.2 | Reworded |  |
| C366 | `content/strategy.md:591` §3.5 | 10.4 | Retained | Message by region joins the sample messaging. |
| C367 | `content/strategy.md:595` §3.5.1 | 10.5 | Reworded |  |
| C368 | `content/strategy.md:597` §3.5.1 | 10.5 | Retained |  |
| C369 | `content/strategy.md:604` §3.5.2 | 10.2 | Reworded |  |
| C370 | `content/strategy.md:605` §3.5.2 | 10.2 | Retained |  |
| C371 | `content/strategy.md:607` §3.5.2 | 10.2 | Reworded |  |
| C372 | `content/strategy.md:612` §3.5.2 | 10.2 | Moved | Keep-marked text: wording retained verbatim. Wording kept; cross-references renumbered. |
| C373 | `content/strategy.md:617` §3.5.2 | 10.2 | Reworded |  |
| C374 | `content/strategy.md:619` §3.5.2 | 10.2 | Reworded |  |
| C375 | `content/strategy.md:657` §3.5.2 | 10.2 | Reworded |  |
| C376 | `content/strategy.md:660` §3.5.3 | 10.3 | Reworded |  |
| C377 | `content/strategy.md:662` §3.5.3 | 10.3 | Reworded |  |
| C378 | `content/strategy.md:704` §3.6 | 12.4 | Reworded |  |
| C379 | `content/strategy.md:706` §3.6.1 | 12.4 | Reworded |  |
| C380 | `content/strategy.md:708` §3.6.1 | 12.4 | C380 + C381 → merged |  |
| C381 | `content/strategy.md:712` §3.6.1 | 12.4 | Reworded |  |
| C382 | `content/strategy.md:714` §3.6.1 | 12.4 | Reworded |  |
| C383 | `content/strategy.md:716` §3.6.1 | 12.4 | Retained |  |
| C384 | `content/strategy.md:721` §3.6.1 | 12.4 | Moved | Keep-marked text: wording retained verbatim. |
| C385 | `content/strategy.md:723` §3.6.1 | 12.4 | Moved |  |
| C386 | `content/strategy.md:725` §3.6.1 | 12.4 | Reworded | Dangling 'Working examples:' points at the proverb cards below. |
| C387 | `content/strategy.md:732` §3.6.1 | 12.4 | Moved | Wording kept; cross-references renumbered. |
| C388 | `content/strategy.md:747` §3.6.1 | 12.4 | Reworded |  |
| C389 | `content/strategy.md:764` §3.6.1 | 12.4 | Retained |  |
| C390 | `content/strategy.md:766` §3.6.1 | 12.4 | Retained |  |
| C391 | `content/strategy.md:770` §3.6.1 | 12.4 | Moved |  |
| C392 | `content/strategy.md:772` §3.6.2 | 12.5 | Reworded |  |
| C393 | `content/strategy.md:774` §3.6.2 | 12.5 | Reworded |  |
| C394 | `content/strategy.md:776` §3.6.2 | 12.5 | Retained |  |
| C395 | `content/strategy.md:780` §3.6.2 | 12.5 | Reworded |  |
| C396 | `content/strategy.md:794` §3.6.3 | 12.5 | Moved |  |
| C397 | `content/strategy.md:796` §3.6.3 | 12.5 | Reworded |  |
| C398 | `content/strategy.md:798` §3.6.3 | 12.5 | Retained |  |
| C399 | `content/strategy.md:802` §3.7 | 12.6 | Reworded |  |
| C400 | `content/strategy.md:804` §3.7 | 12.6 | Reworded |  |
| C401 | `content/strategy.md:806` §3.7 | 12.6 | Reworded |  |
| C402 | `content/strategy.md:808` §3.7 | 12.6 | Moved |  |
| C403 | `content/strategy.md:810` §3.7 | 12.6 | Reworded |  |
| C404 | `content/strategy.md:814` §3.7 | 12.6 | Retained |  |
| C405 | `content/strategy.md:818` §3.7 | 12.6 | Moved |  |
| C406 | `content/strategy.md:822` §3.7 | 12.6 | Moved |  |
| C407 | `content/strategy.md:834` §3.8 | 12.7 | Reworded |  |
| C408 | `content/strategy.md:836` §3.8 | 12.7 | Reworded | Cross-reference → 7.1. |
| C409 | `content/strategy.md:838` §3.8 | 12.7 | Reworded |  |
| C410 | `content/strategy.md:841` §3.8 | 12.7 | Retained |  |
| C411 | `content/delivery.md:3` §4.1 | 13.4 | Reworded |  |
| C412 | `content/delivery.md:4` §4.1.1 | 13.4 | Reworded |  |
| C413 | `content/delivery.md:6` §4.1.1 | 13 | Moved |  |
| C414 | `content/delivery.md:8` §4.1.1 | 13.4 | Reworded |  |
| C415 | `content/delivery.md:31` §4.1.1 | 13.4 | Reworded |  |
| C416 | `content/delivery.md:42` §4.1.2 | 13.2 | Moved |  |
| C417 | `content/delivery.md:44` §4.1.2 | 13.2 | Moved |  |
| C418 | `content/delivery.md:47` §4.1.2 | 13.2 | Moved | Keep-marked text: wording retained verbatim. |
| C419 | `content/delivery.md:64` §4.1.2 | 17.4 | Moved |  |
| C420 | `content/delivery.md:70` §4.1.2 | 13.5 | C420 + C934 → merged | Annex D now lives in 13.5. |
| C421 | `content/delivery.md:74` §4.1.3 | 13.4 | Moved |  |
| C422 | `content/delivery.md:76` §4.1.3 | 13.4 | Moved |  |
| C423 | `content/delivery.md:78` §4.1.3 | 13.4 | Retained |  |
| C424 | `content/delivery.md:82` §4.1.3 | 13.4 | Moved |  |
| C425 | `content/delivery.md:89` §4.2 | 14 | Reworded |  |
| C426 | `content/delivery.md:91` §4.2.1 | 14.1 | Reworded |  |
| C427 | `content/delivery.md:93` §4.2.1 | 14.1 | Moved |  |
| C428 | `content/delivery.md:96` §4.2.1 | 14.1 | C428 + C262 → merged | The hypothesis is stated once (7.1); 14.1 cross-refers. |
| C429 | `content/delivery.md:105` §4.2.1 | 14.1 | Retained |  |
| C430 | `content/delivery.md:109` §4.2.1 | 14.1 | Reworded |  |
| C431 | `content/delivery.md:126` §4.2.1 | 14.1 | Retained |  |
| C432 | `content/delivery.md:128` §4.2.1 | 14.1 | Moved | Wording kept; cross-references renumbered. |
| C433 | `content/delivery.md:142` §4.2.2 | 14.2 | Reworded |  |
| C434 | `content/delivery.md:144` §4.2.2 | 14.2 | Reworded |  |
| C435 | `content/delivery.md:147` §4.2.2 | 14.2 | Reworded |  |
| C436 | `content/delivery.md:162` §4.2.2 | 14.2 | Moved | Wording kept; cross-references renumbered. |
| C437 | `content/delivery.md:175` §4.2.3 | 14.3 | Reworded |  |
| C438 | `content/delivery.md:177` §4.2.3 | 14.3 | C438 + C441 → merged |  |
| C439 | `content/delivery.md:181` §4.2.3 | 14.3 | Reworded |  |
| C440 | `content/delivery.md:184` §4.2.3 | 14.3 | Retained |  |
| C441 | `content/delivery.md:188` §4.2.3 | 14.3 | Reworded |  |
| C442 | `content/delivery.md:192` §4.2.3 | 14.3 | Moved |  |
| C443 | `content/delivery.md:194` §4.2.3 | 14.3 | C443 + C107 → merged | Page-or-profile stated in 7.4 (assumption) and 14.3 (the fix); 14.3 keeps the consequences, 7.4 the risk. |
| C444 | `content/delivery.md:199` §4.2.3 | 14.3 | Moved |  |
| C445 | `content/delivery.md:202` §4.3 | 14 | Reworded |  |
| C446 | `content/delivery.md:204` §4.3 | 14 | Reworded | Becomes the chapter lead. |
| C447 | `content/delivery.md:206` §4.3 | 14 | Reworded |  |
| C448 | `content/delivery.md:209` §4.3 | 14 | Retained | Opens Chapter 14. |
| C449 | `content/delivery.md:213` §4.3.1 | 14.4 | Reworded |  |
| C450 | `content/delivery.md:215` §4.3.1 | 14.4 | Retained |  |
| C451 | `content/delivery.md:219` §4.3.1 | 14.4 | Moved | Wording kept; cross-references renumbered. |
| C452 | `content/delivery.md:276` §4.3.2 | 14.5 | Reworded |  |
| C453 | `content/delivery.md:278` §4.3.2 | 14.5 | Moved |  |
| C454 | `content/delivery.md:293` §4.3.3 | 14.6 | Reworded |  |
| C455 | `content/delivery.md:295` §4.3.3 | 14.6 | Reworded |  |
| C456 | `content/delivery.md:310` §4.3.4 | 14.7 | Reworded |  |
| C457 | `content/delivery.md:312` §4.3.4 | 14.7 | Moved | Wording kept; cross-references renumbered. |
| C458 | `content/delivery.md:327` §4.3.5 | 14.8 | Reworded |  |
| C459 | `content/delivery.md:329` §4.3.5 | 14.8 | Reworded |  |
| C460 | `content/delivery.md:336` §4.4 | 16 | Reworded |  |
| C461 | `content/delivery.md:338` §4.4 | 16.1 | C461 + C463 → merged |  |
| C462 | `content/delivery.md:341` §4.4 | 16 | Reworded |  |
| C463 | `content/delivery.md:343` §4.4 | 16.1 | Moved |  |
| C464 | `content/delivery.md:351` §4.4 | 16 | Reworded |  |
| C465 | `content/delivery.md:353` §4.4 | 16.2 | Reworded |  |
| C466 | `content/delivery.md:398` §4.4 | 16 | Retained |  |
| C467 | `content/delivery.md:400` §4.4 | 16.3 | Moved | Wording kept; cross-references renumbered. |
| C468 | `content/delivery.md:408` §4.4 | 16 | Retained |  |
| C469 | `content/delivery.md:410` §4.4 | 16.3 | Reworded |  |
| C470 | `content/workstreams-platforms.md:1` §4.5 | 15 | Retained |  |
| C471 | `content/workstreams-platforms.md:3` §4.5 | 15 | Retained |  |
| C472 | `content/workstreams-platforms.md:7` §4.5 | 15 | Retained |  |
| C473 | `content/workstreams-platforms.md:26` §4.5 | 15 | Retained | Kept together until C4 is settled (deliberate decision, docs/restructure-2026-10). |
| C474 | `content/workstreams-platforms.md:28` §4.5 | 15 | Reworded |  |
| C475 | `content/workstreams-platforms.md:40` §4.5 | 15 | Retained | Wording kept; cross-references renumbered. |
| C476 | `content/workstreams-platforms.md:54` §4.5.1 | 15.1 | Reworded |  |
| C477 | `content/workstreams-platforms.md:56` §4.5.1 | 15.1.1 | Retained |  |
| C478 | `content/workstreams-platforms.md:60` §4.5.1 | 15.1.1 | C478 + C477 → merged | Owner callouts repeat the leads in every workstream; one statement each. |
| C479 | `content/workstreams-platforms.md:68` §4.5.1 | 15.1.1 | Retained |  |
| C480 | `content/workstreams-platforms.md:71` §4.5.1 | 15.1 | Retained |  |
| C481 | `content/workstreams-platforms.md:73` §4.5.1 | 15.1.1 | C481 + C477 → merged |  |
| C482 | `content/workstreams-platforms.md:78` §4.5.1 | 15.1 | Retained |  |
| C483 | `content/workstreams-platforms.md:80` §4.5.1 | 15.1.1 | Retained |  |
| C484 | `content/workstreams-platforms.md:84` §4.5.1 | 15.1.1 | Retained |  |
| C485 | `content/workstreams-platforms.md:87` §4.5.1 | 15.1.1 | Retained |  |
| C486 | `content/workstreams-platforms.md:102` §4.5.1 | 15.1.1 | Retained |  |
| C487 | `content/workstreams-platforms.md:104` §4.5.1 | 15.1 | Retained |  |
| C488 | `content/workstreams-platforms.md:108` §4.5.1 | 15.1 | Retained |  |
| C489 | `content/workstreams-platforms.md:110` §4.5.1 | 15.1.1 | Retained | Wording kept; cross-references renumbered. |
| C490 | `content/workstreams-platforms.md:125` §4.5.1 | 15.1.1 | Retained |  |
| C491 | `content/workstreams-platforms.md:127` §4.5.1 | 15.1.1 | Retained | Wording kept; cross-references renumbered. |
| C492 | `content/workstreams-platforms.md:142` §4.5.1 | 15.1 | Retained |  |
| C493 | `content/workstreams-platforms.md:144` §4.5.1 | 15.1.1 | Corrected | [CHECK REF] 'Section 4.3' → 15.3 (Workstream 9). |
| C494 | `content/workstreams-platforms.md:148` §4.5.1 | 15.1.1 | Retained |  |
| C495 | `content/workstreams-platforms.md:150` §4.5.1 | 15.1.1 | Retained |  |
| C496 | `content/workstreams-platforms.md:152` §4.5.1 | 15.1.1 | Retained | Wording kept; cross-references renumbered. |
| C497 | `content/workstreams-platforms.md:154` §4.5.1 | 15.1.1 | Retained |  |
| C498 | `content/workstreams-platforms.md:178` §4.5.1 | 15.1 | Retained |  |
| C499 | `content/workstreams-platforms.md:180` §4.5.1 | 15.1.1 | Retained |  |
| C500 | `content/workstreams-platforms.md:189` §4.5.1 | 15.1 | Retained |  |
| C501 | `content/workstreams-platforms.md:191` §4.5.1 | 15.1.1 | Retained |  |
| C502 | `content/workstreams-platforms.md:193` §4.5.1 | 15.1 | Retained |  |
| C503 | `content/workstreams-platforms.md:197` §4.5.1 | 15.1 | Retained |  |
| C504 | `content/workstreams-platforms.md:198` §4.5.1 | 15.1.1 | Retained |  |
| C505 | `content/workstreams-platforms.md:208` §4.5.2 | 15.1 | Reworded |  |
| C506 | `content/workstreams-platforms.md:210` §4.5.2 | 15.1.2 | C506 + C507 → merged | Lead repeats the passage beneath it word for word; one survives. |
| C507 | `content/workstreams-platforms.md:214` §4.5.2 | 15.1.2 | C507 + C506 → merged |  |
| C508 | `content/workstreams-platforms.md:221` §4.5.2 | 15.1.2 | Retained | Wording kept; cross-references renumbered. |
| C509 | `content/workstreams-platforms.md:223` §4.5.2 | 15.1 | Retained |  |
| C510 | `content/workstreams-platforms.md:227` §4.5.2 | 15.1.2 | Retained | Wording kept; cross-references renumbered. |
| C511 | `content/workstreams-platforms.md:229` §4.5.2 | 15.1 | Retained |  |
| C512 | `content/workstreams-platforms.md:231` §4.5.2 | 15.1.2 | Retained |  |
| C513 | `content/workstreams-platforms.md:233` §4.5.2 | 15.1 | Retained |  |
| C514 | `content/workstreams-platforms.md:237` §4.5.2 | 15.1.2 | Retained |  |
| C515 | `content/workstreams-platforms.md:239` §4.5.2 | 15.1.2 | Retained |  |
| C516 | `content/workstreams-platforms.md:241` §4.5.2 | 15.1 | Retained |  |
| C517 | `content/workstreams-platforms.md:245` §4.5.2 | 15.1 | Retained |  |
| C518 | `content/workstreams-platforms.md:247` §4.5.2 | 15.1.2 | Retained |  |
| C519 | `content/workstreams-platforms.md:249` §4.5.2 | 15.1 | Retained |  |
| C520 | `content/workstreams-platforms.md:256` §4.5.3 | 15.1 | Reworded |  |
| C521 | `content/workstreams-platforms.md:258` §4.5.3 | 15.1.3 | C521 + C522 → merged | Lead repeats the passage beneath it word for word; one survives. |
| C522 | `content/workstreams-platforms.md:262` §4.5.3 | 15.1.3 | C522 + C521 → merged |  |
| C523 | `content/workstreams-platforms.md:268` §4.5.3 | 15.1.3 | Retained |  |
| C524 | `content/workstreams-platforms.md:270` §4.5.3 | 15.1.3 | Retained | Wording kept; cross-references renumbered. |
| C525 | `content/workstreams-platforms.md:286` §4.5.3 | 15.1 | Retained |  |
| C526 | `content/workstreams-platforms.md:288` §4.5.3 | 15.1.3 | Retained |  |
| C527 | `content/workstreams-platforms.md:296` §4.5.3 | 15.1.3 | Retained |  |
| C528 | `content/workstreams-platforms.md:298` §4.5.3 | 15.1 | Retained |  |
| C529 | `content/workstreams-platforms.md:300` §4.5.3 | 15.1.3 | Retained |  |
| C530 | `content/workstreams-platforms.md:310` §4.5.3 | 15.1 | Retained |  |
| C531 | `content/workstreams-platforms.md:312` §4.5.3 | 15.1.3 | Retained |  |
| C532 | `content/workstreams-platforms.md:324` §4.5.4 | 15.1 | Reworded |  |
| C533 | `content/workstreams-platforms.md:326` §4.5.4 | 15.1.4 | Retained |  |
| C534 | `content/workstreams-platforms.md:330` §4.5.4 | 15.1.4 | C534 + C533 → merged |  |
| C535 | `content/workstreams-platforms.md:336` §4.5.4 | 15.1.4 | Retained | Wording kept; cross-references renumbered. |
| C536 | `content/workstreams-platforms.md:338` §4.5.4 | 15.1.4 | Retained | Wording kept; cross-references renumbered. |
| C537 | `content/workstreams-platforms.md:344` §4.5.4 | 15.1 | Retained |  |
| C538 | `content/workstreams-platforms.md:346` §4.5.4 | 15.1.4 | C538 + C533 → merged |  |
| C539 | `content/workstreams-platforms.md:349` §4.5.4 | 15.1 | Retained |  |
| C540 | `content/workstreams-platforms.md:351` §4.5.4 | 15.1.4 | Retained |  |
| C541 | `content/workstreams-platforms.md:365` §4.5.4 | 15.1.4 | Retained |  |
| C542 | `content/workstreams-platforms.md:368` §4.5.4 | 15.1.4 | Retained | Wording kept; cross-references renumbered. |
| C543 | `content/workstreams-platforms.md:391` §4.5.4 | 15.1.4 | Retained |  |
| C544 | `content/workstreams-platforms.md:393` §4.5.4 | 15.1.4 | Retained |  |
| C545 | `content/workstreams-platforms.md:400` §4.5.4 | 15.1 | Retained |  |
| C546 | `content/workstreams-platforms.md:402` §4.5.4 | 15.1.4 | Retained |  |
| C547 | `content/workstreams-media.md:1` §4.5.5 | 15.2 | Reworded |  |
| C548 | `content/workstreams-media.md:3` §4.5.5 | 15.2.1 | Retained |  |
| C549 | `content/workstreams-media.md:7` §4.5.5 | 15.2.1 | C549 + C548 → merged | Also corrects 'marks it open' (4.1.3 says approved September 2026). |
| C550 | `content/workstreams-media.md:14` §4.5.5 | 15.2.1 | Retained | Wording kept; cross-references renumbered. |
| C551 | `content/workstreams-media.md:16` §4.5.6 | 15.2 | Reworded |  |
| C552 | `content/workstreams-media.md:18` §4.5.6 | 15.2.2 | Reworded |  |
| C553 | `content/workstreams-media.md:22` §4.5.6 | 15.2.2 | C553 + C552 → merged |  |
| C554 | `content/workstreams-media.md:29` §4.5.6 | 15.2.2 | Reworded |  |
| C555 | `content/workstreams-media.md:32` §4.5.6 | 4.2 | Reworded | The ownership map lives once, in 4.2. |
| C556 | `content/workstreams-media.md:34` §4.5.6 | 4.2 | C556 + C221 → merged |  |
| C557 | `content/workstreams-media.md:38` §4.5.6 | 4.2 | Moved | The governing station table; C7 (Sang'u FM, Citizen, Mwatu) stays marked. |
| C558 | `content/workstreams-media.md:51` §4.5.6 | 4.2 | Moved |  |
| C559 | `content/workstreams-media.md:53` §4.5.6 | 4.2 | Reworded |  |
| C560 | `content/workstreams-media.md:59` §4.5.6 | 4.2 | C560 + C228 → merged |  |
| C561 | `content/workstreams-media.md:64` §4.5.6 | 15.2 | Retained |  |
| C562 | `content/workstreams-media.md:66` §4.5.6 | 15.2.2 | Retained |  |
| C563 | `content/workstreams-media.md:88` §4.5.6 | 15.2.2 | Retained |  |
| C564 | `content/workstreams-media.md:92` §4.5.6 | 15.2.2 | Reworded |  |
| C565 | `content/workstreams-media.md:98` §4.5.6 | 15.2 | Retained |  |
| C566 | `content/workstreams-media.md:100` §4.5.6 | 15.2 | Retained |  |
| C567 | `content/workstreams-media.md:102` §4.5.6 | 15.2.2 | Retained |  |
| C568 | `content/workstreams-media.md:113` §4.5.6 | 15.2.2 | Retained |  |
| C569 | `content/workstreams-media.md:116` §4.5.6 | 15.2.2 | Retained |  |
| C570 | `content/workstreams-media.md:118` §4.5.6 | 15.2 | Retained |  |
| C571 | `content/workstreams-media.md:120` §4.5.6 | 15.2.2 | Retained |  |
| C572 | `content/workstreams-media.md:126` §4.5.6 | 15.2 | Retained |  |
| C573 | `content/workstreams-media.md:128` §4.5.6 | 15.2.2 | Retained |  |
| C574 | `content/workstreams-media.md:139` §4.5.6 | 15.2.2 | Retained |  |
| C575 | `content/workstreams-media.md:142` §4.5.6 | F.3 | C575 + C947 → merged | Rapid-response merge (D-2). |
| C576 | `content/workstreams-media.md:144` §4.5.6 | F.3 | Moved |  |
| C577 | `content/workstreams-media.md:147` §4.5.6 | F.3 | C577 + C949 → merged | Eight lines join the four holding positions; every line kept. Wording kept; cross-references renumbered. |
| C578 | `content/workstreams-media.md:158` §4.5.6 | 15.2 | Retained |  |
| C579 | `content/workstreams-media.md:160` §4.5.6 | 15.2.2 | Retained |  |
| C580 | `content/workstreams-media.md:177` §4.5.6 | 15.2.2 | Retained |  |
| C581 | `content/workstreams-media.md:179` §4.5.6 | 15.2 | Reworded |  |
| C582 | `content/workstreams-media.md:181` §4.5.6 | 15.2 | Retained |  |
| C583 | `content/workstreams-media.md:185` §4.5.6 | 15.2.2 | Retained |  |
| C584 | `content/workstreams-media.md:187` §4.5.6 | 15.2 | Reworded |  |
| C585 | `content/workstreams-media.md:189` §4.5.6 | 15.2 | Reworded |  |
| C586 | `content/workstreams-ground.md:1` §4.5.7 | 15.3 | Reworded |  |
| C587 | `content/workstreams-ground.md:3` §4.5.7 | 15.3.1 | Retained |  |
| C588 | `content/workstreams-ground.md:7` §4.5.7 | 15.3.1 | C588 + C587 → merged |  |
| C589 | `content/workstreams-ground.md:13` §4.5.7 | 15.3.1 | Reworded |  |
| C590 | `content/workstreams-ground.md:15` §4.5.7 | 15.3.1 | C590 + C587 → merged | Its first sentence is the lead; jargon name dropped. |
| C591 | `content/workstreams-ground.md:17` §4.5.7 | 15.3 | Retained |  |
| C592 | `content/workstreams-ground.md:21` §4.5.7 | 15.3.1 | Retained |  |
| C593 | `content/workstreams-ground.md:23` §4.5.7 | 15.3.1 | Retained | Wording kept; cross-references renumbered. |
| C594 | `content/workstreams-ground.md:25` §4.5.7 | 15.3 | Retained |  |
| C595 | `content/workstreams-ground.md:29` §4.5.7 | 15.3.1 | Retained |  |
| C596 | `content/workstreams-ground.md:44` §4.5.7 | 15.3.1 | Retained |  |
| C597 | `content/workstreams-ground.md:46` §4.5.7 | 15.3.1 | Retained |  |
| C598 | `content/workstreams-ground.md:48` §4.5.7 | 15.3 | Retained |  |
| C599 | `content/workstreams-ground.md:52` §4.5.7 | 15.3 | Retained |  |
| C600 | `content/workstreams-ground.md:54` §4.5.7 | 15.3.1 | Retained | Wording kept; cross-references renumbered. |
| C601 | `content/workstreams-ground.md:57` §4.5.7 | 15.3.1 | Retained |  |
| C602 | `content/workstreams-ground.md:59` §4.5.7 | 15.3.1 | Reworded |  |
| C603 | `content/workstreams-ground.md:89` §4.5.7 | 15.3 | Retained |  |
| C604 | `content/workstreams-ground.md:91` §4.5.7 | 15.3.1 | Retained |  |
| C605 | `content/workstreams-ground.md:93` §4.5.7 | 15.3 | Retained |  |
| C606 | `content/workstreams-ground.md:100` §4.5.8 | 15.3 | Reworded |  |
| C607 | `content/workstreams-ground.md:102` §4.5.8 | 15.3.2 | C607 + C608 → merged | Lead repeats the passage beneath it word for word; one survives. |
| C608 | `content/workstreams-ground.md:106` §4.5.8 | 15.3.2 | C608 + C607 → merged |  |
| C609 | `content/workstreams-ground.md:111` §4.5.8 | 15.3.2 | Retained |  |
| C610 | `content/workstreams-ground.md:113` §4.5.8 | 15.3.2 | Retained |  |
| C611 | `content/workstreams-ground.md:119` §4.5.8 | 15.3 | Retained |  |
| C612 | `content/workstreams-ground.md:123` §4.5.8 | 15.3.2 | Retained |  |
| C613 | `content/workstreams-ground.md:149` §4.5.8 | 15.3.2 | Retained |  |
| C614 | `content/workstreams-ground.md:151` §4.5.8 | 15.3.2 | Retained | Wording kept; cross-references renumbered. |
| C615 | `content/workstreams-ground.md:160` §4.5.9 | 15.3 | Reworded |  |
| C616 | `content/workstreams-ground.md:162` §4.5.9 | 15.3.3 | Retained |  |
| C617 | `content/workstreams-ground.md:166` §4.5.9 | 15.3.3 | Reworded | Keeps the controller point; the owner sentence is the lead. |
| C618 | `content/workstreams-ground.md:175` §4.5.9 | 15.3.3 | Retained |  |
| C619 | `content/workstreams-ground.md:177` §4.5.9 | 15.3.3 | Retained |  |
| C620 | `content/workstreams-ground.md:182` §4.5.9 | 15.3.3 | Retained |  |
| C621 | `content/workstreams-ground.md:186` §4.5.9 | 15.3.3 | Reworded |  |
| C622 | `content/workstreams-ground.md:188` §4.5.9 | 15.3.3 | Retained |  |
| C623 | `content/workstreams-ground.md:193` §4.5.9 | 15.3.3 | Retained | Wording kept; cross-references renumbered. |
| C624 | `content/workstreams-ground.md:197` §4.5.9 | 15.3 | Retained |  |
| C625 | `content/workstreams-ground.md:199` §4.5.9 | 15.3.3 | Corrected | [CHECK REF] 'Sections 4.4.11 and 5.7.4' → 19.2. |
| C626 | `content/workstreams-ground.md:207` §4.5.9 | 15.3.3 | Retained | Wording kept; cross-references renumbered. |
| C627 | `content/workstreams-ground.md:226` §4.5.9 | 15.3.3 | Retained | Keep-marked text: wording retained verbatim. |
| C628 | `content/workstreams-ground.md:228` §4.5.9 | 15.3.3 | Retained |  |
| C629 | `content/workstreams-ground.md:229` §4.5.9 | 15.3.3 | Retained |  |
| C630 | `content/workstreams-ground.md:238` §4.5.9 | 15.3.3 | Retained | Wording kept; cross-references renumbered. |
| C631 | `content/workstreams-ground.md:253` §4.5.9 | 15.3 | Retained |  |
| C632 | `content/workstreams-ground.md:255` §4.5.9 | 15.3.3 | Retained |  |
| C633 | `content/workstreams-ground.md:259` §4.5.9 | 15.3.3 | Retained |  |
| C634 | `content/workstreams-ground.md:260` §4.5.9 | 15.3 | Retained |  |
| C635 | `content/workstreams-ground.md:264` §4.5.9 | 15.3.3 | Retained | Wording kept; cross-references renumbered. |
| C636 | `content/workstreams-ground.md:270` §4.5.9 | 15.3.3 | Retained |  |
| C637 | `content/workstreams-ground.md:273` §4.5.9 | 15.3 | Retained |  |
| C638 | `content/workstreams-ground.md:275` §4.5.9 | 15.3.3 | Retained | Wording kept; cross-references renumbered. |
| C639 | `content/workstreams-ground.md:282` §4.5.9 | 15.3 | Retained |  |
| C640 | `content/workstreams-ground.md:284` §4.5.9 | 15.3.3 | Retained |  |
| C641 | `content/workstreams-ground.md:289` §4.5.9 | 15.3.3 | Retained |  |
| C642 | `content/workstreams-ground.md:299` §4.5.9 | 15.3.3 | Retained |  |
| C643 | `content/workstreams-ground.md:301` §4.5.9 | 15.3.3 | Retained |  |
| C644 | `content/workstreams-ground.md:309` §4.5.9 | 15.3.3 | Retained |  |
| C645 | `content/workstreams-ground.md:316` §4.5.10 | 15.3 | Reworded |  |
| C646 | `content/workstreams-ground.md:318` §4.5.10 | 15.3.4 | Retained |  |
| C647 | `content/workstreams-ground.md:322` §4.5.10 | 15.3.4 | C647 + C646 → merged |  |
| C648 | `content/workstreams-ground.md:329` §4.5.10 | 15.3.4 | Retained | Wording kept; cross-references renumbered. |
| C649 | `content/workstreams-data.md:1` §4.5.11 | 15.4 | Reworded |  |
| C650 | `content/workstreams-data.md:3` §4.5.11 | 15.4.1 | C650 + C651 → merged | Lead repeats the passage beneath it word for word; one survives. Wording kept; cross-references renumbered. |
| C651 | `content/workstreams-data.md:7` §4.5.11 | 15.4.1 | C651 + C650 → merged |  |
| C652 | `content/workstreams-data.md:13` §4.5.11 | 15.4 | Reworded |  |
| C653 | `content/workstreams-data.md:15` §4.5.11 | 15.4.1 | Retained | Wording kept; cross-references renumbered. |
| C654 | `content/workstreams-data.md:17` §4.5.11 | 15.4 | Retained |  |
| C655 | `content/workstreams-data.md:21` §4.5.11 | 15.4.1 | Retained |  |
| C656 | `content/workstreams-data.md:23` §4.5.11 | 15.4.1 | Retained |  |
| C657 | `content/workstreams-data.md:25` §4.5.11 | 15.4 | Retained |  |
| C658 | `content/workstreams-data.md:29` §4.5.11 | 15.4.1 | Retained |  |
| C659 | `content/workstreams-data.md:41` §4.5.11 | 15.4.1 | Retained | Wording kept; cross-references renumbered. |
| C660 | `content/workstreams-data.md:43` §4.5.12 | 15.4 | Reworded |  |
| C661 | `content/workstreams-data.md:45` §4.5.12 | 15.4.2 | C661 + C662 → merged | Lead repeats the passage beneath it word for word; one survives. Wording kept; cross-references renumbered. |
| C662 | `content/workstreams-data.md:49` §4.5.12 | 15.4.2 | C662 + C661 → merged |  |
| C663 | `content/workstreams-data.md:56` §4.5.12 | 15.4.2 | Retained | Wording kept; cross-references renumbered. |
| C664 | `content/workstreams-data.md:70` §4.5.12 | 15.4.2 | Retained |  |
| C665 | `content/workstreams-data.md:72` §4.5.12 | 15.4.2 | Retained | Wording kept; cross-references renumbered. |
| C666 | `content/workstreams-data.md:76` §4.5.13 | 15.4 | Reworded |  |
| C667 | `content/workstreams-data.md:78` §4.5.13 | 15.4.3 | Retained |  |
| C668 | `content/workstreams-data.md:82` §4.5.13 | 15.4.3 | C668 + C667 → merged |  |
| C669 | `content/workstreams-data.md:90` §4.5.13 | 15.4 | Reworded |  |
| C670 | `content/workstreams-data.md:92` §4.5.14 | 15.4 | Reworded |  |
| C671 | `content/workstreams-data.md:94` §4.5.14 | 15.4.4 | Retained |  |
| C672 | `content/workstreams-data.md:98` §4.5.14 | 15.4.4 | C672 + C671 → merged |  |
| C673 | `content/workstreams-data.md:105` §4.5.14 | 15.4.4 | Retained |  |
| C674 | `content/workstreams-data.md:107` §4.5.14 | 15.4.4 | C674 + C671 → merged |  |
| C675 | `content/workstreams-data.md:111` §4.5.14 | 15.4.4 | Retained | Wording kept; cross-references renumbered. |
| C676 | `content/workstreams-data.md:123` §4.5.14 | 15.4.4 | Retained |  |
| C677 | `content/workstreams-data.md:124` §4.5.14 | 15.4.4 | Retained | Wording kept; cross-references renumbered. |
| C678 | `content/workstreams-data.md:129` §4.5.14 | 15.4 | Retained |  |
| C679 | `content/workstreams-data.md:131` §4.5.14 | 15.4.4 | Retained | Wording kept; cross-references renumbered. |
| C680 | `content/workstreams-data.md:141` §4.5.14 | 15.4 | Retained |  |
| C681 | `content/workstreams-data.md:143` §4.5.14 | 15.4.4 | Retained |  |
| C682 | `content/workstreams-data.md:145` §4.5.14 | 15.4.4 | Retained | Wording kept; cross-references renumbered. |
| C683 | `content/workstreams-data.md:180` §4.5.14 | 15.4.4 | Retained |  |
| C684 | `content/workstreams-data.md:184` §4.5.14 | 15.4 | Retained |  |
| C685 | `content/workstreams-data.md:186` §4.5.14 | 15.4.4 | Retained |  |
| C686 | `content/workstreams-data.md:190` §4.5.14 | 15.4 | Retained |  |
| C687 | `content/workstreams-data.md:191` §4.5.14 | 15.4.4 | Retained | Wording kept; cross-references renumbered. |
| C688 | `content/workstreams-data.md:201` §4.5.14 | 15.4.4 | Reworded |  |
| C689 | `content/staffing.md:3` §4.6 | 17 | Reworded |  |
| C690 | `content/staffing.md:5` §4.6 | 17 | Reworded |  |
| C691 | `content/staffing.md:7` §4.6 | 17.1 | Reworded |  |
| C692 | `content/staffing.md:9` §4.6 | 17 | Retained |  |
| C693 | `content/staffing.md:13` §4.6 | 17.1 | Moved |  |
| C694 | `content/staffing.md:15` §4.6 | 17.1 | Reworded |  |
| C695 | `content/staffing.md:22` §4.6 | 17 | Retained |  |
| C696 | `content/staffing.md:26` §4.6 | 17.1 | Reworded |  |
| C697 | `content/staffing.md:29` §4.6 | 17.1 | Moved |  |
| C698 | `content/staffing.md:31` §4.6 | 17.1 | Moved |  |
| C699 | `content/staffing.md:42` §4.6.1 | 17.1 | Moved |  |
| C700 | `content/staffing.md:44` §4.6.1 | 17.1 | Moved |  |
| C701 | `content/staffing.md:50` §4.6.1 | 17.1 | Moved | Wording kept; cross-references renumbered. |
| C702 | `content/staffing.md:54` §4.6.2 | 17 | Reworded |  |
| C703 | `content/staffing.md:56` §4.6.2 | 17.2 | Moved | Wording kept; cross-references renumbered. |
| C704 | `content/staffing.md:63` §4.6.2 | 17.2 | Moved |  |
| C705 | `content/staffing.md:83` §4.6.3 | 17.3 | Reworded |  |
| C706 | `content/staffing.md:85` §4.6.3 | 17.3 | C706 + C708 → merged | Lead repeats the passage beneath it word for word; one survives. |
| C707 | `content/staffing.md:90` §4.6.3 | 17.3 | Moved | Keep-marked text: wording retained verbatim. Wording kept; cross-references renumbered. |
| C708 | `content/staffing.md:98` §4.6.3 | 17.3 | Moved |  |
| C709 | `content/staffing.md:102` §4.6.3 | 17.3 | Moved |  |
| C710 | `content/staffing.md:107` §4.6.4 | 17.4 | Moved |  |
| C711 | `content/staffing.md:109` §4.6.4 | 17 | Retained |  |
| C712 | `content/staffing.md:115` §4.6.5 | 17 | Retained |  |
| C713 | `content/staffing.md:117` §4.6.5 | 17 | C713 + C714 → merged |  |
| C714 | `content/staffing.md:121` §4.6.5 | 17 | Moved |  |
| C715 | `content/staffing.md:123` §4.6.5 | 17 | Retained |  |
| C716 | `content/staffing.md:127` §4.6.5 | 17 | C716 + C714 → merged |  |
| C717 | `content/staffing.md:129` §4.6.5 | 17.4 | C717 + C698 → merged | Single counterpart said twice in 4.6. |
| C718 | `content/staffing.md:135` §4.6.6 | 17 | Moved |  |
| C719 | `content/staffing.md:137` §4.6.6 | 17.5 | Moved |  |
| C720 | `content/staffing.md:139` §4.6.6 | 17.5 | Moved | Wording kept; cross-references renumbered. |
| C721 | `content/staffing.md:156` §4.6.6 | 17.5 | Moved |  |
| C722 | `content/measurement.md:3` §5.1 | 18.1 | Retained |  |
| C723 | `content/measurement.md:5` §5.1 | 18.1 | Reworded | Surviving passage of 1.9 + 5.1 intro. |
| C724 | `content/measurement.md:7` §5.1 | 18.1 | Retained |  |
| C725 | `content/measurement.md:11` §5.1.1 | 18.2 | Reworded |  |
| C726 | `content/measurement.md:13` §5.1.1 | 18.2 | Reworded |  |
| C727 | `content/measurement.md:15` §5.1.1 | 18.2 | Reworded |  |
| C728 | `content/measurement.md:17` §5.1.1 | 18.2 | Retained |  |
| C729 | `content/measurement.md:21` §5.1.1 | 18.2 | Reworded |  |
| C730 | `content/measurement.md:23` §5.1.1 | 18.2 | Reworded |  |
| C731 | `content/measurement.md:25` §5.1.1 | 18.2 | Retained |  |
| C732 | `content/measurement.md:28` §5.1.2 | 18.3 | Reworded |  |
| C733 | `content/measurement.md:30` §5.1.2 | 18.3 | C733 + C737 → merged | Wording kept; cross-references renumbered. |
| C734 | `content/measurement.md:35` §5.1.2 | 18.3 | Moved | Keep-marked text: wording retained verbatim. |
| C735 | `content/measurement.md:37` §5.1.2 | 18.3 | Reworded |  |
| C736 | `content/measurement.md:41` §5.1.2 | 18.3 | Moved | Wording kept; cross-references renumbered. |
| C737 | `content/measurement.md:77` §5.1.2 | 18.3 | Moved | Wording kept; cross-references renumbered. |
| C738 | `content/measurement.md:82` §5.1.2 | 18.3 | Moved |  |
| C739 | `content/measurement.md:87` §5.1.3 | 18.4 | Reworded |  |
| C740 | `content/measurement.md:89` §5.1.3 | 18.4 | Reworded |  |
| C741 | `content/measurement.md:91` §5.1.3 | 18.4 | Reworded |  |
| C742 | `content/measurement.md:106` §5.1.4 | 18.2 | Reworded |  |
| C743 | `content/measurement.md:108` §5.1.4 | 18.2 | Reworded |  |
| C744 | `content/measurement.md:110` §5.1.4 | 18.2 | Reworded |  |
| C745 | `content/measurement.md:123` §5.2 | 18.5 | Reworded |  |
| C746 | `content/measurement.md:125` §5.2 | 18.5 | Reworded |  |
| C747 | `content/measurement.md:127` §5.2.1 | 18.5 | Retained |  |
| C748 | `content/measurement.md:129` §5.2.1 | 18.5 | Moved |  |
| C749 | `content/measurement.md:166` §5.2.2 | 18.5 | Retained |  |
| C750 | `content/measurement.md:168` §5.2.2 | 18.5 | C750 + C751 → merged | Window dates are stale (D-29); author to confirm. |
| C751 | `content/measurement.md:172` §5.2.2 | 18.5 | Moved |  |
| C752 | `content/measurement.md:174` §5.2.2 | 18.5 | Moved |  |
| C753 | `content/measurement.md:178` §5.2.2 | 18.5 | Moved |  |
| C754 | `content/measurement.md:181` §5.2.3 | 18.5 | Retained |  |
| C755 | `content/measurement.md:183` §5.2.3 | 18.5 | C755 + C757 → merged |  |
| C756 | `content/measurement.md:187` §5.2.3 | 18.5 | Moved |  |
| C757 | `content/measurement.md:190` §5.2.3 | 18.5 | Moved |  |
| C758 | `content/measurement.md:195` §5.2.3 | 18.5 | Moved | Wording kept; cross-references renumbered. |
| C759 | `content/measurement.md:201` §5.2.4 | 18.5 | Retained |  |
| C760 | `content/measurement.md:203` §5.2.4 | 18.5 | Moved | Wording kept; cross-references renumbered. |
| C761 | `content/measurement.md:226` §5.2.5 | 18.5 | Moved |  |
| C762 | `content/measurement.md:228` §5.2.5 | 18.5 | C762 + C763 → merged |  |
| C763 | `content/measurement.md:232` §5.2.5 | 18.5 | Moved | Wording kept; cross-references renumbered. |
| C764 | `content/measurement.md:237` §5.2.6 | 18.5 | Moved |  |
| C765 | `content/measurement.md:239` §5.2.6 | 18.5 | C765 + C767 → merged |  |
| C766 | `content/measurement.md:245` §5.2.6 | 18.5 | Retained |  |
| C767 | `content/measurement.md:249` §5.2.6 | 18.5 | Reworded | 7.2 cross-refers here for the test method. Name standardised. |
| C768 | `content/measurement.md:251` §5.2.6 | 18.5 | Retained |  |
| C769 | `content/measurement.md:255` §5.3 | 19.1 | Reworded |  |
| C770 | `content/measurement.md:256` §5.3.1 | 19.1 | Reworded |  |
| C771 | `content/measurement.md:258` §5.3.1 | 19.1 | C771 + C772 → merged |  |
| C772 | `content/measurement.md:262` §5.3.1 | 19.1 | Moved | Wording kept; cross-references renumbered. |
| C773 | `content/measurement.md:268` §5.3.1 | 19.1 | Moved | Keep-marked text: wording retained verbatim. Wording kept; cross-references renumbered. |
| C774 | `content/measurement.md:273` §5.3.1 | 19.1 | Moved |  |
| C775 | `content/measurement.md:278` §5.3.1 | 19.1 | Moved | Keep-marked text: wording retained verbatim. Wording kept; cross-references renumbered. |
| C776 | `content/measurement.md:284` §5.3.1 | 19.1 | Moved | Wording kept; cross-references renumbered. |
| C777 | `content/measurement.md:298` §5.3.2 | 19.2 | Reworded |  |
| C778 | `content/measurement.md:300` §5.3.2 | 19.2 | C778 + C781 → merged |  |
| C779 | `content/measurement.md:304` §5.3.2 | 19.2 | Moved |  |
| C780 | `content/measurement.md:306` §5.3.2 | 19.2 | Moved |  |
| C781 | `content/measurement.md:328` §5.3.2 | 19.2 | Moved |  |
| C782 | `content/measurement.md:334` §5.3.2 | 19.2 | Retained |  |
| C783 | `content/measurement.md:336` §5.3.2 | 19.2 | Corrected | Compliance-measures list: [CHECK REF] '16.4' → 19.3 clause 5 (the deletion schedule). |
| C784 | `content/measurement.md:369` §5.3.2 | 19.2 | Moved |  |
| C785 | `content/measurement.md:371` §5.3.2 | 19.2 | Moved |  |
| C786 | `content/measurement.md:373` §5.3.2 | 19.2 | Retained |  |
| C787 | `content/measurement.md:377` §5.3.2 | 19.2 | Corrected | [CHECK REF] 'Section 5.2.1.4 of the DPA 2019' → the lawful-processing and consent provisions of the Act; the exact section is for the reviewer to cite. |
| C788 | `content/measurement.md:391` §5.3.3 | 19.3 | Reworded |  |
| C789 | `content/measurement.md:393` §5.3.3 | 19.3 | C789 + C791 → merged |  |
| C790 | `content/measurement.md:398` §5.3.3 | 19.3 | Moved | Keep-marked text: wording retained verbatim. |
| C791 | `content/measurement.md:401` §5.3.3 | 19.3 | Moved |  |
| C792 | `content/measurement.md:410` §5.3.3 | 19.3 | Moved | Keep-marked text: wording retained verbatim. |
| C793 | `content/measurement.md:474` §5.3.3 | 19.3 | Moved |  |
| C794 | `content/measurement.md:480` §5.3.4 | 19.2 | Retained |  |
| C795 | `content/measurement.md:482` §5.3.4 | 19.2 | C795 + C796 → merged |  |
| C796 | `content/measurement.md:486` §5.3.4 | 19.2 | Moved |  |
| C797 | `content/measurement.md:492` §5.3.4 | 19.2 | Moved | Keep-marked text: wording retained verbatim. Wording kept; cross-references renumbered. |
| C798 | `content/measurement.md:498` §5.3.4 | 19.2 | Moved |  |
| C799 | `content/measurement.md:508` §5.3.4 | 19.2 | Moved |  |
| C800 | `content/measurement.md:536` §5.3.4 | 19.2 | Moved | Keep-marked text: wording retained verbatim. Wording kept; cross-references renumbered. |
| C801 | `content/measurement.md:541` §5.3.5 | 19.4 | Reworded |  |
| C802 | `content/measurement.md:543` §5.3.5 | 19.4 | Retained |  |
| C803 | `content/measurement.md:545` §5.3.5 | 19.4 | Reworded |  |
| C804 | `content/measurement.md:547` §5.3.5 | 19.4 | Retained |  |
| C805 | `content/measurement.md:551` §5.3.5 | 19.4 | Moved |  |
| C806 | `content/measurement.md:553` §5.3.5 | 19.4 | Retained |  |
| C807 | `content/measurement.md:557` §5.3.5 | 19.4 | Moved |  |
| C808 | `content/measurement.md:559` §5.3.5 | 19.4 | Retained |  |
| C809 | `content/measurement.md:563` §5.3.6 | 19.5 | Reworded |  |
| C810 | `content/measurement.md:565` §5.3.6 | 19.5 | C810 + C811 → merged |  |
| C811 | `content/measurement.md:569` §5.3.6 | 19.5 | Reworded |  |
| C812 | `content/measurement.md:582` §5.3.6 | 19.5 | Reworded |  |
| C813 | `content/risks.md:3` §6.1 | 20.1 | Retained |  |
| C814 | `content/risks.md:5` §6.1 | 20.1 | Reworded |  |
| C815 | `content/risks.md:8` §6.1 | 20.1 | Retained |  |
| C816 | `content/risks.md:12` §6.1 | 20.1 | Moved |  |
| C817 | `content/risks.md:26` §6.1 | 20.2 | Reworded | Renumbered to Annex F, E.11 gap removed. |
| C818 | `content/risks.md:33` §6.2 | 20.2 | Reworded |  |
| C819 | `content/risks.md:35` §6.2.1 | 20.2 | Reworded |  |
| C820 | `content/risks.md:37` §6.2.1 | 20.2 | C820 + C821 → merged |  |
| C821 | `content/risks.md:41` §6.2.1 | 20.2 | Reworded | Surviving passage of the rapid-response merge (6.2.1 + E.5 + 4.5.6 lines); response tiers point to F.5, lines to F.3. |
| C822 | `content/risks.md:43` §6.2.1 | 20.2 | Corrected | [CHECK REF] 'Section A.1.1' → 20.3 (the defamation safeguards). |
| C823 | `content/risks.md:45` §6.2.1 | 20.2 | Retained |  |
| C824 | `content/risks.md:49` §6.2.1 | 20.2 | Moved | Wording kept; cross-references renumbered. |
| C825 | `content/risks.md:51` §6.2.2 | 20.2 | Moved |  |
| C826 | `content/risks.md:53` §6.2.2 | 20.2 | Reworded |  |
| C827 | `content/risks.md:55` §6.2.2 | 20.2 | Reworded |  |
| C828 | `content/risks.md:68` §6.2.3 | 20.3 | Reworded |  |
| C829 | `content/risks.md:70` §6.2.3 | 20.3 | Reworded |  |
| C830 | `content/risks.md:72` §6.2.3 | 20.3 | Reworded |  |
| C831 | `content/risks.md:86` §6.2.4 | 20.2 | Moved |  |
| C832 | `content/risks.md:88` §6.2.4 | 20.2 | Moved |  |
| C833 | `content/risks.md:91` §6.2.4 | 20.2 | Moved |  |
| C834 | `content/risks.md:92` §6.2.4 | 20.2 | Moved |  |
| C835 | `content/risks.md:98` §6.2.4 | 20.2 | Moved |  |
| C836 | `content/risks.md:100` §6.3 | 20.4 | Reworded |  |
| C837 | `content/risks.md:101` §6.3.1 | 20.4 | Moved |  |
| C838 | `content/risks.md:103` §6.3.1 | 20.4 | C838 + C840 → merged |  |
| C839 | `content/risks.md:107` §6.3.1 | 20.4 | Moved |  |
| C840 | `content/risks.md:109` §6.3.1 | 20.4 | Moved |  |
| C841 | `content/risks.md:117` §6.3.1 | 20.4 | Moved | Keep-marked text: wording retained verbatim. |
| C842 | `content/risks.md:123` §6.3.1 | 20.4 | Moved |  |
| C843 | `content/risks.md:133` §6.3.1 | 20.4 | Moved |  |
| C844 | `content/risks.md:142` §6.3.1 | 20.4 | Moved | Wording kept; cross-references renumbered. |
| C845 | `content/risks.md:161` §6.3.1 | 20.4 | Moved |  |
| C846 | `content/risks.md:167` §6.3.1 | 20.4 | Moved | Keep-marked text: wording retained verbatim. |
| C847 | `content/risks.md:173` §6.4 | 20.5 | Reworded |  |
| C848 | `content/risks.md:175` §6.4 | 20.5 | Reworded |  |
| C849 | `content/risks.md:177` §6.4.1 | 20.5 | Moved |  |
| C850 | `content/risks.md:179` §6.4.1 | 20.5 | Moved |  |
| C851 | `content/risks.md:182` §6.4.1 | 20.5 | Moved |  |
| C852 | `content/risks.md:188` §6.5 | 5.4 | Reworded |  |
| C853 | `content/risks.md:190` §6.5 | 5.4 | C853 + C854 → merged |  |
| C854 | `content/risks.md:194` §6.5 | 5.4 | Reworded |  |
| C855 | `content/risks.md:195` §6.5 | 5.4 | Reworded |  |
| C856 | `content/risks.md:208` §6.5 | A | Reworded |  |
| C857 | `content/annex-evidence.md:1` §preamble | A | Reworded | Annex A gains A.2, the full source table (data point, figure, source, year, tier, link), generated from lib/data/figures.ts. |
| C858 | `content/annex-evidence.md:3` §A.1 | A.1 | Reworded |  |
| C859 | `content/annex-evidence.md:4` §A.1.1 | A.1 | Reworded |  |
| C860 | `content/annex-evidence.md:6` §A.1.1 | A.1.1 | Reworded |  |
| C861 | `content/annex-evidence.md:8` §A.1.1 | A.1 | Retained |  |
| C862 | `content/annex-evidence.md:12` §A.1.1 | A.1 | Reworded |  |
| C863 | `content/annex-evidence.md:14` §A.1.2 | A.1 | Retained | Wording kept; cross-references renumbered. |
| C864 | `content/annex-evidence.md:16` §A.1.2 | A.1 | Reworded |  |
| C865 | `content/annex-evidence.md:18` §A.1.2 | A.1 | Retained |  |
| C866 | `content/annex-evidence.md:22` §A.1.2 | A.1.2 | Reworded |  |
| C867 | `content/annex-evidence.md:35` §A.1.2 | A.1.2 | Retained |  |
| C868 | `content/annex-evidence.md:37` §A.1.2 | A.1.2 | Retained |  |
| C869 | `content/annex-evidence.md:44` §A.1.3 | A.1 | Retained | Wording kept; cross-references renumbered. |
| C870 | `content/annex-evidence.md:46` §A.1.3 | A.1.3 | Reworded |  |
| C871 | `content/annex-evidence.md:48` §A.1.3 | A.1 | Retained |  |
| C872 | `content/annex-evidence.md:52` §A.1.3 | A.1 | Reworded |  |
| C873 | `content/annex-evidence.md:56` §A.1.4 | A.1 | Reworded |  |
| C874 | `content/annex-evidence.md:58` §A.1.4 | A.1.4 | C874 + C875 → merged | Wording kept; cross-references renumbered. |
| C875 | `content/annex-evidence.md:62` §A.1.4 | A.1.4 | Retained | Wording kept; cross-references renumbered. |
| C876 | `content/annex-evidence.md:64` §A.1.4 | A.1.4 | Retained |  |
| C877 | `content/annex-county.md:1` §preamble | B | Reworded | Annex B now holds the register only; the rest moved to Chapters 3 and 5 (cross-references in the intro). |
| C878 | `content/annex-county.md:3` §B.1 | B | Retained | Wording kept; cross-references renumbered. |
| C879 | `content/annex-county.md:5` §B.1 | B.1 | Retained |  |
| C880 | `content/annex-county.md:7` §B.1 | B.1 | Retained |  |
| C881 | `content/annex-county.md:8` §B.1 | B.1 | Retained |  |
| C882 | `content/annex-county.md:14` §B.1 | B.1 | Retained |  |
| C883 | `content/annex-county.md:15` §B.1 | B.1 | Retained |  |
| C884 | `content/annex-county.md:20` §B.1 | B.1 | Retained |  |
| C885 | `content/annex-county.md:21` §B.1 | B.1 | Retained |  |
| C886 | `content/annex-county.md:28` §B.1 | B.1 | Retained |  |
| C887 | `content/annex-county.md:29` §B.1 | B.1 | Retained |  |
| C888 | `content/annex-county.md:34` §B.1 | B.1 | Retained |  |
| C889 | `content/annex-county.md:35` §B.1 | B.1 | Retained |  |
| C890 | `content/annex-county.md:40` §B.1 | B.1 | Retained |  |
| C891 | `content/annex-county.md:41` §B.1 | B.1 | Retained |  |
| C892 | `content/annex-county.md:47` §B.1 | B.1 | Retained |  |
| C893 | `content/annex-county.md:48` §B.1 | B.1 | Retained |  |
| C894 | `content/annex-county.md:55` §B.1 | B.1 | Retained |  |
| C895 | `content/annex-county.md:56` §B.1 | B.1 | Retained |  |
| C896 | `content/annex-county.md:63` §B.2 | 3.7 | Reworded |  |
| C897 | `content/annex-county.md:65` §B.2 | 3.7 | C897 + C898 → merged |  |
| C898 | `content/annex-county.md:69` §B.2 | 3.7 | Replaced by visual | Replaced by visual: the 3.1.2 audit bars (moved to 3.7) carry all four figures with source and tier. |
| C899 | `content/annex-county.md:70` §B.2 | 3.7 | Replaced by visual | Replaced by visual: the audit bars. |
| C900 | `content/annex-county.md:75` §B.2 | 3.7 | Reworded |  |
| C901 | `content/annex-county.md:77` §B.2 | 3.7 | Moved |  |
| C902 | `content/annex-county.md:79` §B.2 | 3.7 | Moved |  |
| C903 | `content/annex-county.md:81` §B.2 | 3.7 | Moved |  |
| C904 | `content/annex-county.md:93` §B.2 | 3.7 | Reworded |  |
| C905 | `content/annex-county.md:95` §B.3 | 3.2 | Reworded |  |
| C906 | `content/annex-county.md:97` §B.3 | 3.2 | C906 + C907 → merged |  |
| C907 | `content/annex-county.md:101` §B.3 | 3.2 | Reworded |  |
| C908 | `content/annex-county.md:103` §B.3 | 3.2 | Reworded |  |
| C909 | `content/annex-county.md:105` §B.3 | 3.2 | Moved | Wording kept; cross-references renumbered. |
| C910 | `content/annex-county.md:116` §B.3 | 3.2 | Reworded |  |
| C911 | `content/annex-county.md:118` §B.4 | 3.8 | Reworded |  |
| C912 | `content/annex-county.md:120` §B.4 | 3.8 | C912 + C913 → merged |  |
| C913 | `content/annex-county.md:124` §B.4 | 3.8 | Reworded |  |
| C914 | `content/annex-county.md:126` §B.5 | 5.5 | Reworded |  |
| C915 | `content/annex-county.md:128` §B.5 | 5.5 | C915 + C916 → merged |  |
| C916 | `content/annex-county.md:132` §B.5 | 5.5 | Reworded |  |
| C917 | `content/annex-county.md:134` §B.5 | 5.5 | Reworded | Cross-reference → 5.3. |
| C918 | `content/annex-county.md:136` §B.5 | 5.5 | Reworded | Kept in the 5.5 list (it carries the audit-record citation); the term-limit sentence folds into 5.1. |
| C919 | `content/annex-messages.md:1` §preamble | 10.4 | Reworded | Framed as a demonstration: 'what Firefly would hand the team'; nothing attributed to Dr. Mulu beyond his public record. |
| C920 | `content/annex-messages.md:3` §C.1 | 10.4 | Retained | Wording kept; cross-references renumbered. |
| C921 | `content/annex-messages.md:5` §C.1 | 10.4 | Moved |  |
| C922 | `content/annex-messages.md:9` §C.1 | 10.4 | Corrected | Stale cross-reference (3.7 → 10.1). |
| C923 | `content/annex-messages.md:15` §C.1 | 10.4 | Reworded |  |
| C924 | `content/annex-messages.md:17` §C.1 | 10.4 | Corrected | 'sum to about {{sub.kitui-west.density}}%' uses a population-density token as a percentage — wrong token; to be corrected or the sentence cut if no sourced sum exists. |
| C925 | `content/annex-messages.md:33` §C.1 | 10.4 | Retained |  |
| C926 | `content/annex-messages.md:37` §C.1 | 10.4 | Reworded |  |
| C927 | `content/annex-messages.md:40` §C.1 | 10.4 | Reworded |  |
| C928 | `content/annex-messages.md:51` §C.1 | 10.4 | Reworded |  |
| C929 | `content/annex-messages.md:61` §C.1 | 10.4 | Reworded |  |
| C930 | `content/annex-messages.md:66` §C.2 | 10.4 | Retained | Wording kept; cross-references renumbered. |
| C931 | `content/annex-messages.md:68` §C.2 | 10.4 | Reworded |  |
| C932 | `content/annex-messages.md:70` §C.2 | 10.4 | Retained |  |
| C933 | `content/annex-cadence.md:1` §preamble | 13.5 | Reworded |  |
| C934 | `content/annex-cadence.md:3` §D.1 | 13.5 | Reworded |  |
| C935 | `content/annex-cadence.md:5` §D.1 | 13.5 | C935 + C937 → merged |  |
| C936 | `content/annex-cadence.md:10` §D.1 | 13.5 | Moved | Keep-marked text: wording retained verbatim. Wording kept; cross-references renumbered. |
| C937 | `content/annex-cadence.md:21` §D.1 | 13.5 | Reworded |  |
| C938 | `content/annex-cadence.md:28` §D.2 | 13.5 | Retained | Wording kept; cross-references renumbered. |
| C939 | `content/annex-cadence.md:30` §D.2 | 13.5 | Reworded |  |
| C940 | `content/annex-cadence.md:32` §D.2 | 13.5 | Retained |  |
| C941 | `content/annex-runbooks.md:1` §preamble | F | Reworded | Renumbered E.1–E.10, E.12 → F.1–F.11, no gap. |
| C942 | `content/annex-runbooks.md:3` §E.1 | F.1 | Reworded |  |
| C943 | `content/annex-runbooks.md:5` §E.1 | F.1 | Reworded |  |
| C944 | `content/annex-runbooks.md:7` §E.1 | F.1 | Retained |  |
| C945 | `content/annex-runbooks.md:11` §E.2 | F.2 | Reworded |  |
| C946 | `content/annex-runbooks.md:13` §E.2 | F.2 | Retained |  |
| C947 | `content/annex-runbooks.md:17` §E.3 | F.3 | Reworded |  |
| C948 | `content/annex-runbooks.md:19` §E.3 | F.3 | Retained |  |
| C949 | `content/annex-runbooks.md:21` §E.3 | F.3 | Retained |  |
| C950 | `content/annex-runbooks.md:25` §E.4 | F.4 | Retained | Wording kept; cross-references renumbered. |
| C951 | `content/annex-runbooks.md:27` §E.4 | F.4 | Reworded |  |
| C952 | `content/annex-runbooks.md:48` §E.5 | F.5 | Reworded |  |
| C953 | `content/annex-runbooks.md:50` §E.5 | F.5 | Retained |  |
| C954 | `content/annex-runbooks.md:70` §E.5 | F.5 | Retained |  |
| C955 | `content/annex-runbooks.md:71` §E.5 | F.5 | Retained | Wording kept; cross-references renumbered. |
| C956 | `content/annex-runbooks.md:81` §E.6 | F.6 | Retained | Wording kept; cross-references renumbered. |
| C957 | `content/annex-runbooks.md:83` §E.6 | F.6 | C957 + C959 → merged |  |
| C958 | `content/annex-runbooks.md:87` §E.6 | F.6 | Retained |  |
| C959 | `content/annex-runbooks.md:89` §E.6 | F.6 | Retained |  |
| C960 | `content/annex-runbooks.md:93` §E.6 | F.6 | Retained | Wording kept; cross-references renumbered. |
| C961 | `content/annex-runbooks.md:98` §E.6 | F.6 | Corrected | Scenarios numbered 1–5, 7: renumbered 1–6. |
| C962 | `content/annex-runbooks.md:122` §E.6 | F.6 | Retained |  |
| C963 | `content/annex-runbooks.md:128` §E.6 | F.6 | Retained |  |
| C964 | `content/annex-runbooks.md:133` §E.7 | F.7 | Retained | Wording kept; cross-references renumbered. |
| C965 | `content/annex-runbooks.md:135` §E.7 | F.7 | C965 + C966 → merged |  |
| C966 | `content/annex-runbooks.md:139` §E.7 | F.7 | Retained |  |
| C967 | `content/annex-runbooks.md:146` §E.7 | F.7 | Retained |  |
| C968 | `content/annex-runbooks.md:156` §E.8 | F.8 | Reworded |  |
| C969 | `content/annex-runbooks.md:158` §E.8 | F.8 | C969 + C971 → merged |  |
| C970 | `content/annex-runbooks.md:162` §E.8 | F.8 | Retained |  |
| C971 | `content/annex-runbooks.md:195` §E.8 | F.8 | Retained |  |
| C972 | `content/annex-runbooks.md:199` §E.9 | F.9 | Retained | Wording kept; cross-references renumbered. |
| C973 | `content/annex-runbooks.md:201` §E.9 | F.9 | Retained |  |
| C974 | `content/annex-runbooks.md:210` §E.10 | F.10 | Reworded |  |
| C975 | `content/annex-runbooks.md:212` §E.10 | F.10 | Retained |  |
| C976 | `content/annex-runbooks.md:247` §E.10 | F.10 | Retained |  |
| C977 | `content/annex-runbooks.md:252` §E.12 | F.11 | Reworded |  |
| C978 | `content/annex-runbooks.md:254` §E.12 | F.11 | C978 + C979 → merged |  |
| C979 | `content/annex-runbooks.md:258` §E.12 | F.11 | Retained |  |
| C980 | `content/annex-runbooks.md:260` §E.12 | F.11 | Retained |  |
| C981 | `content/annex-runbooks.md:268` §E.12 | F.11 | Retained |  |
| C982 | `content/annex-runbooks.md:270` §E.12 | F.4 | C982 + C951 → merged | Tool list repeats F.4; one list. |
| C983 | `content/annex-terms.md:2` §F.1 | G.1 | Reworded |  |
| C984 | `content/annex-terms.md:5` §F.1 | G.1 | Retained | Keep-marked text: wording retained verbatim. Wording kept; cross-references renumbered. |
| C985 | `content/annex-terms.md:11` §F.1 | G.1 | Retained | Keep-marked text: wording retained verbatim. |
| C986 | `content/annex-terms.md:16` §F.1 | G.1 | Retained | Keep-marked text: wording retained verbatim. |
| C987 | `content/annex-terms.md:21` §F.1 | G | Retained |  |
| C988 | `content/annex-spec.md:1` §preamble | C | Reworded | Split across Annexes C, D and E (each gets its own one-line intro). |
| C989 | `content/annex-spec.md:3` §G.1 | C.1 | Retained | Wording kept; cross-references renumbered. |
| C990 | `content/annex-spec.md:5` §G.1 | C.1 | Reworded |  |
| C991 | `content/annex-spec.md:34` §G.2 | C.2 | Reworded |  |
| C992 | `content/annex-spec.md:36` §G.2 | C.2 | C992 + C1001 → merged |  |
| C993 | `content/annex-spec.md:40` §G.2 | C.2 | Retained |  |
| C994 | `content/annex-spec.md:42` §G.2 | C.2 | Retained |  |
| C995 | `content/annex-spec.md:46` §G.2 | C.2 | Moved |  |
| C996 | `content/annex-spec.md:47` §G.2 | C.2 | Reworded |  |
| C997 | `content/annex-spec.md:48` §G.2 | C.2 | Reworded |  |
| C998 | `content/annex-spec.md:53` §G.2 | C.2 | Reworded |  |
| C999 | `content/annex-spec.md:54` §G.2 | C.2 | Reworded |  |
| C1000 | `content/annex-spec.md:56` §G.2 | C.2 | Reworded |  |
| C1001 | `content/annex-spec.md:58` §G.2 | C.2 | Moved | Wording kept; cross-references renumbered. |
| C1002 | `content/annex-spec.md:61` §G.3 | D | Reworded |  |
| C1003 | `content/annex-spec.md:63` §G.3 | D.1 | C1003 + C1008 → merged | Wording kept; cross-references renumbered. |
| C1004 | `content/annex-spec.md:67` §G.3 | D.1 | Moved |  |
| C1005 | `content/annex-spec.md:69` §G.3 | D.1 | Moved |  |
| C1006 | `content/annex-spec.md:72` §G.3 | D | Retained |  |
| C1007 | `content/annex-spec.md:74` §G.3 | D.1 | Moved | Wording kept; cross-references renumbered. |
| C1008 | `content/annex-spec.md:81` §G.3 | D.1 | Moved | Wording kept; cross-references renumbered. |
| C1009 | `content/annex-spec.md:84` §G.3 | D | Retained |  |
| C1010 | `content/annex-spec.md:86` §G.3 | D.1 | Moved |  |
| C1011 | `content/annex-spec.md:93` §G.3 | D.1 | Moved | Wording kept; cross-references renumbered. |
| C1012 | `content/annex-spec.md:99` §G.3 | D | Retained |  |
| C1013 | `content/annex-spec.md:101` §G.3 | D.1 | Moved | Wording kept; cross-references renumbered. |
| C1014 | `content/annex-spec.md:109` §G.3 | D | Retained |  |
| C1015 | `content/annex-spec.md:111` §G.3 | D.1 | Moved |  |
| C1016 | `content/annex-spec.md:121` §G.4 | E.1 | Reworded |  |
| C1017 | `content/annex-spec.md:123` §G.4 | E.1 | C1017 + C1018 → merged |  |
| C1018 | `content/annex-spec.md:127` §G.4 | E.1 | Reworded |  |
| C1019 | `content/annex-spec.md:129` §G.4 | E.1 | Corrected | 'Six core components' lists five: count corrected to five. |
| C1020 | `content/annex-spec.md:131` §G.4 | E.1 | Retained |  |
| C1021 | `content/annex-spec.md:135` §G.4 | E.1 | Moved |  |
| C1022 | `content/annex-spec.md:137` §G.4 | E.1 | Retained |  |
| C1023 | `content/annex-spec.md:141` §G.4 | E.1 | Corrected | Inside the text version: two [CHECK REF]s 'Section 5.2.3.4' → 19.2; one 'Section 5.2.4' → 15.1 (the tracker). |
| C1024 | `content/annex-spec.md:188` §G.4 | E.1 | Moved |  |
| C1025 | `content/annex-spec.md:190` §G.4 | E.1 | Retained |  |
| C1026 | `content/annex-spec.md:192` §G.4 | E.1 | Retained |  |
| C1027 | `content/annex-spec.md:196` §G.4 | E.1 | Moved |  |
| C1028 | `content/annex-spec.md:198` §G.4 | E.1 | Reworded |  |
| C1029 | `content/annex-spec.md:200` §G.4 | E.1 | Corrected | 'YubiKey or Google Authenticator' — an authenticator app is not a hardware key; aligned with F.8 (FIDO2 keys mandatory for admins, app 2FA as the floor). |
| C1030 | `content/annex-spec.md:207` §G.5 | E.2 | Reworded |  |
| C1031 | `content/annex-spec.md:209` §G.5 | E.2 | C1031 + C1036 → merged |  |
| C1032 | `content/annex-spec.md:213` §G.5 | E.2 | Moved | Wording kept; cross-references renumbered. |
| C1033 | `content/annex-spec.md:230` §G.5 | E.2 | Moved | Wording kept; cross-references renumbered. |
| C1034 | `content/annex-spec.md:235` §G.5 | E.2 | Retained |  |
| C1035 | `content/annex-spec.md:237` §G.5 | E.2 | Reworded |  |
| C1036 | `content/annex-spec.md:264` §G.5 | E.2 | Moved |  |

## 3. Changes made during the rewrite, beyond the plan

| Where | What changed |
|---|---|
| Runbook letters (20.2) | The war-room callout lettered the runbooks E.1–E.12; they are F.1–F.11. Corrected with a source-conflict note. |
| Deliverables schedule (21.2) | The last column gave October numbers (4.5.2, 4.1.1, E.12 …); renumbered to the current sections, with a note. |
| Commitments (22.1) | The two openings ('This proposal commits to a method …' and 'Firefly commits to a scope …') merged into one lead; the checklist's references to 13.2, 13.4 and Section 6 corrected to 13.4, 13.5 and 22.2, with a note. |
| Dependencies (22.2) | The dependencies figure and its text version moved ahead of the four gated deliverables so the checklist's 'listed there' points at something the reader has seen. |
| The ask (23) | The lead's second and third sentences (Firefly publishes nothing on his accounts; the method, cadence and standard) merged into 13.2 and 22.1, where they are stated in full. |
| Annex E.1 | 'Six core components' corrected to five; Google Authenticator separated from hardware keys. Both with notes. [CHECK REF] 5.2.3.4 → 19.2; 5.2.4 → 15.1.1. |
| Annex F | The F.11 tool table merged into F.4 (X lists added; the richer descriptions kept). Scenario 7 renumbered 6, with a note. |
| Annex A | The pointer to 'Annex A' from inside Annex A replaced by a lead; A.2 is generated from `lib/data/figures.ts` by `scripts/build-source-table.ts`. |
| Annex B | The intro named the audit record, drought, the Mui Basin and the legal ground, which moved to 3.7, 3.2, 3.8 and 5.5; it now says so. |
| 4.3 | The ICT source was named as the '2023/24 Kenya Continuous Household Survey and Communications Authority reports'; corrected to the CA/KNBS ICT Analytical Report on the 2023/24 Kenya Housing Survey, with a note. |
| 10.3 | The governing line, quoted in full in 9.1, is referenced rather than quoted again (the duplicate detector's one cross-chapter repetition). |
| 10.4 | The overlap sentence restored without its row numbers; the withdrawn share sum and register-applied counts recorded in one source-conflict note. |
| 19.2 | [CHECK REF] 16.4 → 19.3 clause 5; 'Section 5.2.1.4 of the DPA' → [VERIFY the section of the Act, to be cited by the Section 19.2 reviewer]. |
| 20.2 | [CHECK REF] A.1.1 → 20.3. |
| Figure captions | Registry captions (`components/figures/registry.tsx`) set to each figure's host section. |

## 4. Audit

| Treatment | Units |
|---|---:|
| Reworded | 393 |
| Retained | 324 |
| Moved | 173 |
| Merged | 125 |
| Corrected | 19 |
| Replaced by visual | 2 |

Blank cells: 0.

**Inventory items: 1036. Items in map: 1036. Discrepancy: 0**
