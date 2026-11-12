/**
 * Rate limits for the platform's server actions. There is no sign-in, so anyone with the link can
 * save: these limits stop one visitor flooding the records or the change history.
 *
 * A fixed window per key: at most `limit` calls in each `windowMs`. Keys are the action and the
 * caller's address. A data-pack edit opens a branch and runs the full data checks, so it carries
 * the tightest limit.
 *
 * WHAT THIS IS AND IS NOT. The counts live in the memory of one server instance. On Vercel each
 * instance keeps its own, so this stops a burst from one visitor but is not a hard global cap; a
 * shared store (a Redis or KV service) is the step that makes it one, and it is part of the
 * Readiness phase.
 *
 * Pure apart from the clock, which the tests pass in.
 */

export type Limit = { limit: number; windowMs: number };
type Slot = { count: number; resetAt: number };

const MINUTE = 60 * 1000;

/** The limits each action carries. */
export const LIMITS = {
  save: { limit: 30, windowMs: 10 * MINUTE },
  packEdit: { limit: 5, windowMs: 60 * MINUTE },
} satisfies Record<string, Limit>;

export class RateLimiter {
  private slots = new Map<string, Slot>();
  private readonly maxKeys: number;
  constructor(maxKeys = 10_000) {
    this.maxKeys = maxKeys;
  }

  /** Records one call. Returns how long to wait in ms, or 0 when the call is allowed. */
  hit(key: string, l: Limit, now: number = Date.now()): number {
    const slot = this.slots.get(key);
    if (!slot || now >= slot.resetAt) {
      if (this.slots.size >= this.maxKeys) this.sweep(now);
      this.slots.set(key, { count: 1, resetAt: now + l.windowMs });
      return 0;
    }
    if (slot.count >= l.limit) return slot.resetAt - now;
    slot.count += 1;
    return 0;
  }

  private sweep(now: number) {
    for (const [k, s] of this.slots) if (now >= s.resetAt) this.slots.delete(k);
    // Still full of live windows: drop the oldest, so memory stays bounded.
    while (this.slots.size >= this.maxKeys) this.slots.delete(this.slots.keys().next().value as string);
  }
}

/** The one limiter the server actions share. */
export const limiter = new RateLimiter();

/** The plain-language reply when a limit is hit. */
export function waitMessage(ms: number): string {
  const minutes = Math.max(1, Math.ceil(ms / MINUTE));
  return `Too many attempts from this connection. Try again in ${minutes} minute${minutes === 1 ? "" : "s"}.`;
}

/** The caller's address, from the proxy headers Vercel sets; "unknown" when there is none. */
export function callerKey(h: { get(name: string): string | null }): string {
  return (h.get("x-forwarded-for") ?? "").split(",")[0].trim() || h.get("x-real-ip") || "unknown";
}
