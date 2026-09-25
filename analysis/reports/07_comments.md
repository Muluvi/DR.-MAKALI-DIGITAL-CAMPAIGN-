# Stage 7 — Comment themes and sentiment

What people say under his posts, coded by theme, sentiment and language.

*Kitui 2027 analysis pipeline · data as of 2026-09-16 · generated 2026-09-25*


## Data protection

Comments load through a filter that keeps only `post_id`, `date` and `text` and drops everything else before any analysis runs. Text is then scrubbed of handles, URLs, phone numbers and email addresses. Dates are reduced to a date, because a timestamp plus a post id can re-identify a commenter. No comment in any output is linked to a person, and no output leaves the ward-level aggregate.


## No data yet

`data/templates/comments.csv` is empty. The stage is built and will run on the first supplied export.


## How labelling will work

- Each comment gets a theme (from the pillar list in `config/assumptions.yaml`), a sentiment (positive, neutral, negative) and a language (English, Kiswahili, Kikamba or mixed).
- Up to 300 items are labelled in session, in batches. Above that, `src/label_api.py` reads ANTHROPIC_API_KEY from the environment; the item count is reported and confirmed before it runs, and the key is never printed or committed.
- Labels below 70% confidence are flagged for human review.
- A random 20% of all labels goes to review regardless of confidence, so coverage does not depend on the model's own self-assessment.
- **Every Kikamba comment goes to human review without exception.** Off-the-shelf sentiment models do not handle Kikamba, and a confident-looking score on a language the model cannot read is worse than no score. The pack's own finding that bulk SMS cannot carry Kikamba makes the Kikamba comment stream more important, not less: it is where the campaign learns what the SMS layer will never hear.


## Data gaps

- **[DATA NEEDED]** `comments.csv` — public comments with names and handles already removed at source.
- **[DATA NEEDED]** A Kikamba-speaking reviewer. This is a staffing dependency, not a data one, and it blocks the sentiment read on the language that matters most locally.
