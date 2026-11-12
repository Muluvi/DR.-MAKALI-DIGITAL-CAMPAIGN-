/**
 * Sign-in removal (November 2026): every passage that told the reader the team signs in, or that
 * team accounts exist, reworded to say what is true now. The site has no sign-in and no editing;
 * it is read-only, and Firefly makes changes at the team's request.
 *
 * Several `from` strings are exactly the wording an earlier pass wrote (docs/toc-2026-11): that
 * pass's checker treats a fix of its own as accounted for when a rewrite here starts from it.
 */
export const REWRITES = [
  // The platform in one view: the lead and the body's opening sentence.
  { f: "content/platform.md", all: true, from: "**Anyone with the link sees everything. Once the engagement starts, Dr. Mulu's team signs in to change it. Firefly keeps it running.**", to: "**Anyone with the link sees everything, with no account and no sign-in. Firefly keeps it running and makes the changes.**" },
  { f: "content/platform.md", from: "live in one place, and the team updates them itself.", to: "live in one place, and Firefly updates them at the team's request." },
  // Its contrast visual: the "Sign in to edit" side.
  { f: "content/platform.md", from: "title: \"Sign in to edit\"", to: "title: \"Read-only\"" },
  { f: "content/platform.md", from: "- { label: \"Dr. Mulu's team\", text: \"adds and changes records and data, from a phone, once team sign-in is switched on at the start of the engagement\" }", to: "- { label: \"No accounts\", text: \"there is no sign-in anywhere on the site, and nothing on it can be changed by a visitor\" }" },
  { f: "content/platform.md", from: "text: \"who, what and when, and any change can be put back exactly\"", to: "text: \"who, what and when, kept in the repository's history\"" },
  // Its stepper: an edit made on the site becomes a change asked of Firefly.
  { f: "content/platform.md", from: "title: \"How the team's edit reaches the site\"", to: "title: \"How the team's change reaches the site\"" },
  { f: "content/platform.md", from: "- { label: \"Edit\", text: \"a team member changes a figure, a record or a status\" }", to: "- { label: \"Ask\", text: \"a team member asks Firefly to change a figure, a record or a status\" }" },
  { f: "content/platform.md", from: "text: \"working records show at once; data-pack edits after the full checks pass\"", to: "text: \"the change is published once the full checks pass\"" },
  { f: "content/platform.md", from: "text: \"any change can be undone from the change history\"", to: "text: \"any change can be undone from the repository's history\"" },
  // Its cards and its checklist: no data editor, no team accounts to manage.
  { f: "content/platform.md", from: "- { title: \"Update the data\", text: \"the data editor, with the same checks the site runs\" }", to: "- { title: \"Check the data\", text: \"Explore data, every figure with its source and status\" }" },
  { f: "content/platform.md", from: "- { label: \"Team accounts: adding and removing them\" }", to: "- { label: \"Making the changes the team asks for\" }" },
  // Next steps, Week 1: Day 1 no longer opens team accounts.
  { f: "lib/register/specs/s6-nextsteps.ts", from: "{ when: \"Day 1\", title: \"The team signs in\", body: \"Team accounts opened on the platform; Firefly holds no credentials to his channels.\" },", to: "{ when: \"Day 1\", title: \"The team opens the platform\", body: \"Read-only, with no accounts to set up; Firefly holds no credentials to his channels.\" }," },
  { f: "lib/register/specs/s6-nextsteps.ts", from: "{ cells: { when: \"Day 1\", what: \"Team accounts opened on the platform\" } },", to: "{ cells: { when: \"Day 1\", what: \"The team opens the platform, read-only\" } }," },
  // The decision panel: what the campaign provides no longer includes names for team accounts.
  { f: "components/DecisionPanel.tsx", from: "{ icon: CheckCircle2, text: \"Sign-off on the service level, and the names of the team accounts to create\" },", to: "{ icon: CheckCircle2, text: \"Sign-off on the service level, and who on the team asks Firefly for changes\" }," },
];
