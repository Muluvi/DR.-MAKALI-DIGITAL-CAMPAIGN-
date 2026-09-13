---
description: Phase 3 — the Tier 1 CSS-only motion layer plus View Transitions navigation. Zero JS animation.
---

Implement the structural motion layer. **No JavaScript animation in this phase.**

## Tier 1 — CSS only

- A scroll progress spine driven by `animation-timeline: scroll()`. One
  already exists — `.scroll-progress-fill` in `app/globals.css`, driven by
  `components/ScrollProgressBar.tsx` with a scroll-listener fallback. Extend it;
  do not build a second.
- There is no "n of 241" position indicator. `SectionStickyBar` names the
  current section and sub-section instead. In a 241-section document the
  reader's most persistent question is *where am I and how much is left* —
  answer it structurally, by making the spine carry that, not with a number in
  a corner.
- State feedback on interactive components, using the motion tokens.

**Do not add entrance reveals to sections.** Blanket fade-and-slide-up is the
generic default. If you believe a specific section earns a staged reveal, name
it and ask before adding it.

## View Transitions

Adopt the View Transitions API for section-to-section and route-to-route
navigation, so 241 sections read as one continuous object rather than a series
of page loads.

- Named transitions for the persistent chrome: header, spine, index.
- Browsers without named-element support get a plain cross-fade. That is an
  acceptable floor — do not polyfill it.
- Disabled entirely under `prefers-reduced-motion`.

## Verify

- Measure the JS delta in bytes and report it. The target for this entire phase
  is zero.
- Load a route with JavaScript disabled and confirm full functionality.
- Confirm nothing animates under `prefers-reduced-motion`.
