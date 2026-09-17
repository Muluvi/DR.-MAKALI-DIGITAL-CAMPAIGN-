# Stage 6 — Content performance

What his existing posting actually achieves, by pillar, format, language and timing.

*Kitui 2027 analysis pipeline · data as of 2026-09-16 · generated 2026-09-17*


## No data yet

`data/templates/posts.csv` is empty. This stage is built and will run on the first filled export; nothing is estimated in the meantime.


## What the pack already establishes

- The Facebook account shows **~15,000 followers and 745 posts** as at 16 Sep 2026. Both are read off a screenshot, so both carry status verify.
- It appears to be a **personal profile in professional mode**, not a Page, because a friends list is visible. This decides which analytics exist at all and must be confirmed first — a personal profile has no Professional Dashboard export.
- The posting pattern is described as **daily activity updates with no pillars, targeting or stated rationale**. That is the gap this stage measures.
- Six profile hygiene issues are already identified and need no analysis to fix: the MP start date given as Aug 2012 against a Parliament record of 2013, "Programmer Officer" for Programme Officer, a garbled "Forms of government" employer entry, Nairobi shown as current city for a county aspirant, "Incoming Governor" presuming a party poll that has not happened, and the PhD missing from a profile whose whole positioning is the Economist Governor.


## What this stage will produce

- Engagement rate by pillar, format and language.
- A median-engagement heatmap by day and hour.
- Posting cadence, weekly volume and the longest silent gap.
- Top 10 and bottom 10 posts.
- Pillar labels for untagged posts, each with a confidence score. Low-confidence labels plus a random 20% of all labels go to human review.
- A negative binomial regression of engagements on post features with log(followers) as an offset, reported as directional only below ~100 posts.


## Data gaps

- **[DATA NEEDED]** `posts.csv` — the last 90 days of public posts (pack gap 3).
- **[DATA NEEDED]** Confirmation of whether the account is a Page or a personal profile (pack gap 1). If it is a personal profile, there is no Professional Dashboard export and the audit must be a manual log instead.
- **[DATA NEEDED]** Follower count at time of posting, without which engagement rates cannot be compared across a growing account.
- **[DATA NEEDED]** Handles and follower counts for X, TikTok, Instagram and YouTube (pack gap 2).
