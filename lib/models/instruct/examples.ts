/**
 * Example instructions for each model: the chips under every instruction box, and the phrasings
 * the optional AI step is told to rewrite into (app/api/instruct/route.ts). Each one is parsed by
 * the model's rule parser, so the AI can only ever produce wording the site already understands.
 */
export const EXAMPLES: Record<string, string[]> = {
  "winning-number": ["turnout 65%, share 52%", "turnout 75% in Mwingi North; share 60% in Kitui Central", "scenario b: turnout 55%"],
  "polling-agents": ["2 agents per station, 10% reserve", "1 agent per station, one supervisor per 10 stations", "3 agents per station, 20% reserve"],
  "ward-priority": ["focus on register size and where he has not held office", "only polling stations", "voters 60, projects 40", "even weights"],
  "send-check": ["SMS in Kiswahili at 10am on 20 March, lodged on 17 March", "SMS in Kikamba at 6pm tomorrow, not lodged", "WhatsApp in Kikamba today at 7pm"],
  "rollout-planner": ["start 1 February; pilot 8 weeks", "waves of 2; 4 weeks per wave", "finish before the chief agents are submitted", "discovery 3 weeks, readiness 4 weeks"],
  "reach-by-channel": ["no radio, SMS 40%", "only social media at 60%", "radio 50%, ground work 30%"],
  "brief-mix": ["P1 50%, P3 50%", "no Kikamba; no TikTok", "P2 40%, P3 30%, P4 30%; minimum 20%"],
  "response-tier": ["a doctored video of him, 4,200 views, county-wide", "mentioned on vernacular radio this morning", "a rumour in 4 ward WhatsApp groups that he will favour Kitui Central"],
  "record-finder": ["completed water projects in Kyuso", "health in Mutomo, with constituency projects", "roads in Tseikuru that are not complete"],
};
