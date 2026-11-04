import type { TabId } from "./heading-slug";

/**
 * One markdown file per section, named for the section it serves.
 *
 * It lives here rather than in the route because the client needs it too: on the flow, sections
 * past the first two fetch their own prose from /content/<file> as the reader approaches them,
 * and both sides have to agree on the filename.
 */
export const CONTENT_FILES: Record<TabId, string> = {
  cover: "cover.md",
  brief: "brief.md",
  kitui: "kitui.md",
  votes: "votes.md",
  needs: "needs.md",
  news: "news.md",
  race: "race.md",
  record: "record.md",
  diagnosis: "diagnosis.md",
  goal: "goal.md",
  position: "position.md",
  message: "message.md",
  voters: "voters.md",
  channels: "channels.md",
  engagement: "engagement.md",
  timeline: "timeline.md",
  workstreams: "workstreams.md",
  success: "success.md",
  lawful: "lawful.md",
  response: "response.md",
  receives: "receives.md",
  ask: "ask.md",
  "annex-evidence": "annex-evidence.md",
  "annex-playbooks": "annex-playbooks.md",
  "annex-volunteers": "annex-volunteers.md",
  "annex-technology": "annex-technology.md",
  "annex-runbooks": "annex-runbooks.md",
  "annex-terms": "annex-terms.md",
};

export const contentUrl = (tabId: TabId) => `/content/${CONTENT_FILES[tabId]}`;
