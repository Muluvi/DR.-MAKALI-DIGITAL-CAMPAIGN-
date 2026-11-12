/**
 * The optional AI step behind every model's instruction box.
 *
 * The box first reads an instruction by rule, in the browser, for free. Only when it cannot place
 * part of it does it ask here. With no ANTHROPIC_API_KEY set this answers { enabled: false } and
 * nothing else happens: the site runs at no cost. With a key, Claude Haiku 5.5 rewrites the
 * visitor's words into the phrasings the model's rule parser already understands; the browser then
 * parses that rewrite and the model computes as always. The AI never returns a figure of its own:
 * it may only restate what the visitor said, and it says UNCLEAR rather than invent a value.
 *
 * Limits, because anyone with the link can use it: 400 characters per instruction, a per-visitor
 * rate limit, a monthly ceiling per server (AI_MONTHLY_REQUEST_LIMIT), and text carrying a phone
 * number, ID number or email address is refused before it leaves the server. Set a spend limit in
 * the Anthropic Console as well: the monthly ceiling here is per server instance.
 */
import Anthropic from "@anthropic-ai/sdk";
import { headers } from "next/headers";
import { MODELS } from "@/lib/models/catalogue";
import { EXAMPLES } from "@/lib/models/instruct/examples";
import { findPersonalData } from "@/lib/platform/personal-data";
import { callerKey, limiter, LIMITS } from "@/lib/platform/rate-limit";

export const dynamic = "force-dynamic";

const MODEL = "claude-haiku-5-5";
const MAX_CHARS = 400;
const monthly = { month: "", count: 0 };
const ceiling = () => Number(process.env.AI_MONTHLY_REQUEST_LIMIT ?? "") || 1500;

const SYSTEM = `You rewrite a visitor's request for a campaign planning model into short instructions the model's own parser understands.

Rules:
- Reply with one line only: the rewritten instruction, clauses separated by semicolons, using only the phrasings shown in the examples.
- Use only numbers, places, dates and names the visitor gave. Never add, estimate or round a figure. If the visitor's request needs a value they did not give, reply UNCLEAR.
- If the request is not about this model's options, reply UNCLEAR.
- Never include a person's name, phone number or ID number.`;

const json = (body: unknown, status = 200) => Response.json(body, { status, headers: { "Cache-Control": "no-store" } });

export async function GET() {
  return json({ enabled: Boolean(process.env.ANTHROPIC_API_KEY) });
}

export async function POST(request: Request) {
  if (!process.env.ANTHROPIC_API_KEY) return json({ enabled: false });

  let body: { slug?: unknown; text?: unknown };
  try {
    body = await request.json();
  } catch {
    return json({ enabled: true, error: "The request could not be read." }, 400);
  }
  const model = MODELS.find((m) => m.slug === body.slug);
  const text = typeof body.text === "string" ? body.text.trim() : "";
  if (!model || !text) return json({ enabled: true, error: "Name a model and an instruction." }, 400);
  if (text.length > MAX_CHARS) return json({ enabled: true, error: `Keep the instruction under ${MAX_CHARS} characters.` }, 400);
  if (findPersonalData(text)) return json({ enabled: true, error: "The instruction contains a phone number, ID number or email address, so it was not sent. Describe it without them." }, 400);

  const wait = limiter.hit(`ai|${callerKey(await headers())}`, LIMITS.ai);
  if (wait) return json({ enabled: true, error: "The AI has been asked too often from this connection. The instruction box still works by rule, and the controls always do." }, 429);
  const month = new Date().toISOString().slice(0, 7);
  if (monthly.month !== month) Object.assign(monthly, { month, count: 0 });
  if (monthly.count >= ceiling()) return json({ enabled: true, error: "The AI's monthly allowance is used up. The instruction box still works by rule, and the controls always do." }, 429);
  monthly.count += 1;

  const client = new Anthropic();
  try {
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 1024,
      output_config: { effort: "low" },
      system: SYSTEM,
      messages: [
        {
          role: "user",
          content: `Model: ${model.name}. ${model.question}\nIts options: ${model.inputs}.\nExamples of instructions it understands:\n${(EXAMPLES[model.slug] ?? []).map((e) => `- ${e}`).join("\n")}\n\nThe visitor wrote:\n${text}`,
        },
      ],
    });
    if (response.stop_reason === "refusal") return json({ enabled: true, error: "The AI declined this one. Try the wording in the examples." });
    const out = response.content.flatMap((b) => (b.type === "text" ? [b.text] : [])).join(" ").trim().split("\n")[0].trim();
    if (!out || /^UNCLEAR\b/i.test(out) || out.length > MAX_CHARS || findPersonalData(out)) return json({ enabled: true, instruction: null });
    return json({ enabled: true, instruction: out });
  } catch (error) {
    if (error instanceof Anthropic.RateLimitError) return json({ enabled: true, error: "The AI service is busy. Try again in a minute; the controls always work." }, 503);
    if (error instanceof Anthropic.AuthenticationError) return json({ enabled: true, error: "The AI service key is not valid. Firefly has to check it." }, 503);
    if (error instanceof Anthropic.APIError) return json({ enabled: true, error: "The AI service did not answer. The controls always work." }, 503);
    return json({ enabled: true, error: "The AI step failed. The controls always work." }, 500);
  }
}
