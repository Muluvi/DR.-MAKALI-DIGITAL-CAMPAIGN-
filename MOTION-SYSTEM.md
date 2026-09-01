# Motion system

Everything that animates imports from `lib/motion.ts`. Nothing declares its own durations.

## Why this exists

The site had 20 distinct durations and 4 easings scattered across 26 files, and fourteen
surfaces shared the same fade-and-rise. Uniform motion applied to a number, a map and a
paragraph alike is decoration — it tells the reader nothing about what they are looking at.

A shared vocabulary is what lets each surface animate in a way that means something.

## Three rules

**1. Transform and opacity only.** Never `width`, `height`, `top` or `left` — they force
layout on every frame, and the target device is a mid-range Android on a Kitui network.
Height changes use a `grid-template-rows: 0fr → 1fr` collapse, which the compositor handles.

**2. Motion encodes meaning.** Counters count. Timelines draw forward. Bars grow from their
baseline. Maps fill outward from a centre. Flows trace along their path.

**3. Never animate to the truth.** Under reduced motion a bar renders at its final
proportion, not at zero. A bar caught at zero is showing false data, and this document
cannot afford that.

## Tokens

| Token | Value | Use |
|---|---|---|
| `DURATION.micro` | 140ms | Hover, tap, toggle |
| `DURATION.fast` | 180ms | Tab and panel crossfades |
| `DURATION.medium` | 300ms | Disclosure, accordion, tooltip |
| `DURATION.entrance` | 520ms | The default entrance |
| `DURATION.deliberate` | 620ms | Charts and maps carrying many marks |
| `EASE_ENTRANCE` | `cubic-bezier(0.16, 1, 0.3, 1)` | Expo-out. Fast commit, long settle |
| `EASE_OUT` | `cubic-bezier(0.22, 1, 0.36, 1)` | Micro-interactions |
| `STAGGER.tight/normal/loose` | 60 / 75 / 90ms | Between siblings |
| `SPRING` | stiffness 300, damping 30 | Anything the user drives directly |
| `VIEWPORT` | `once: true`, `amount: 0.35`, `-10% 0px` | Scroll reveals. Never re-fires |

## Variants

| Variant | Encodes |
|---|---|
| `fadeIn` | The floor, and the reduced-motion fallback for nearly everything |
| `riseIn` | 8px rise. Genuinely enumerable groups only |
| `slideInX` / `slideInY` | Panel changes, on the axis of travel |
| `cascade(gap)` | Stagger parent |
| `flipInY` / `flipInX` | Two faces of one decision. Distinct axes so §1A and §5 don't read alike |
| `growFromBaseline(origin)` | Bars, rings, gauges. Zero is the honest origin |
| `drawPath` | SVG `pathLength`. Tracing a route |
| `collapse` | Height without touching height |

## Reduced motion

Two halves, both required:

- **CSS** (`app/globals.css`) zeroes CSS animations and transitions. On its own this reached
  nothing — every `motion.div` ignored it, so a reader with `reduce` set was getting all 22
  ambient loops and every JavaScript entrance.
- **`useReducedMotionSafe()`** (`hooks/use-reduced-motion-safe.ts`), threaded through
  `variantsFor()`, is what actually honours the preference for animated components.

Interaction feedback is deliberately exempt and shortened to ~80ms rather than removed. A
focus ring that never appears is a bug, not a preference.

### Fallbacks by class

| Class | Full | Reduced |
|---|---|---|
| Count-up, odometer | Rolls 0 → value | Final value, immediate |
| Bars, rings, gauges | Grow from baseline | Final proportion, 120ms fade |
| SVG path draw | Dashoffset travels | Complete path, fade |
| Map region fill | Ripples outward | All 40 wards filled, no stagger |
| Kinetic type | Line-by-line mask | Full quote, single fade |
| Scroll-scrubbed | Scrubs with scroll | Static, all phases visible, pin released |
| Stagger cascades | 60–90ms between siblings | Stagger → 0, group fades once |
| Ambient loops | Running | **Stopped** |
| Accordion, drawer | Height transition | Instant, focus moves to content |
| Hover, press, focus | 120–180ms | **Kept**, shortened to ~80ms |

## Ambient loop budget: 3

Looping motion is the commonest migraine and vestibular trigger, and — more important here —
it implies a running system. Nothing on this page is live: it is a proposal for work not yet
commissioned. A blinking "Live" dot is a false claim however good it looks.

The page previously ran **22** loops: 8 JavaScript `repeat: Infinity` and 14 CSS
pulse/ping/spin, most of them fake-liveness indicators.

Permitted, each pausing off-screen and stopping under `reduce`:

1. **Hero marquee** (`MarqueeCarousel`) — Tier 1 figures only.
2. **Field–digital cycle** (§10) — the source describes a continuous 4-hour loop.
3. **Language swap** (§18) — the content is three languages.

Loading states (skeleton, spinner, pre-hydration placeholder) are not ambient: they run only
while something is pending and stop when it resolves.

## Icons

`lucide-react` only. Sizes 16 / 20 / 24 / 32 / 48, stroke 1.5 (2 at 16px).

Near-duplicates are collapsed onto one canonical icon per concept, so the same idea always
looks the same: `CheckCircle → CheckCircle2`, `FileCheck → FileCheck2`, `Clock3 → Clock`,
`AlertCircle`/`AlertOctagon → AlertTriangle`, `Users2 → Users`, `Grid → Table`.

Every icon must map to a specific concept in adjacent content. One that could be swapped for
any other without loss is decoration — delete it.

## Surface signatures

No two surfaces animate alike. That is a hard requirement, not a preference: it is what makes
motion informative rather than ambient. See the audit at
`docs/AUDIT-visual-motion-overhaul.md` for the full 32-surface specification.
