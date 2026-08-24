---
description: Aurexo fidelity requirements — migration is not redesign
---

# HTML Fidelity

**Migration is not redesign.** Every page migrated from `../aurexo` must preserve, unless the user
explicitly instructs otherwise:

- All content and copy (text, headings, labels, CTAs).
- All sections, and their exact top-to-bottom order.
- All images, icons, and videos — the real Aurexo assets, never placeholders.
- Semantic intent and layout.
- Responsive behavior at Aurexo's real breakpoints (`1700 / 1440 / 1399 / 1199 / 991 / 767 / 575 / 400px` —
  see `docs/migration/AUREXO_SOURCE.md` §9; do not invent new breakpoints or silently adopt the unrelated
  Bootstrap-style grid breakpoints from `component/grid.scss`).
- Interactive behavior: sliders, tabs, accordions, dropdowns, menus, mobile menus, modals, offcanvas
  panels, sticky header, scroll interactions, counters, filtering — the actual behavior traced from
  `assets/js/app.js` and friends, not a guessed reimplementation.
- Hover/active/focus states and animations.
- All links, exactly where they point in the source.

## What "preserve" does NOT mean

- It does not mean copying Aurexo's jQuery verbatim into React. Understand the behavior (trigger, selector,
  state, cleanup) first, then implement it idiomatically per `nextjs-architecture.md`.
- It does not mean keeping every legacy class name. Keep classes that materially carry visual fidelity,
  animation hooks, responsive behavior, or maintainable source-mapping back to Aurexo; don't preserve
  classes that exist only as jQuery selectors with no styling purpose once the JS is reimplemented in React
  state.
- It does not mean one giant page component. Section-by-section componentization per
  `docs/migration/COMPONENT_MAP.md` is required — see `migration-quality.md`.

## Heading semantics vs. typography classes

Aurexo's `.h1`–`.h7` classes are **visual sizing classes fully decoupled from semantic heading level**
(confirmed: `class="h5"` applied to a `<p>` tag in `index.html` for sizing, not document outline — see
`docs/migration/AUREXO_SOURCE.md` §4). Never decide the rendered tag from the class name alone.

```tsx
// Correct — visual size and semantic level are independent decisions:
<h2 className="h1">About Aurexo</h2>
<p className="h5">2025 BMW 5 Series...</p>
```

Preserve BOTH: a correct semantic heading hierarchy (one `<h1>` per page, logical nesting) AND Aurexo's
exact visual typography scale. If the source HTML has a heading-hierarchy problem, fix the outline while
keeping the visual class — don't propagate a broken outline just because Aurexo's static markup has one, but
also don't invent a redesigned visual scale to "fix" it.

## Never do this

- Never redesign, simplify, reorder, or reinterpret Aurexo content/sections/behavior without explicit
  instruction.
- Never remove functionality because it's hard to migrate (e.g. the Google Maps + InfoBox + MarkerClusterer
  setup, the canvas hover-tooltip chart, the multi-step add-listing wizard) — flag it as an ambiguity in
  `docs/migration/COMPONENT_MAP.md` if the implementation approach is genuinely unclear, don't drop it.
- Never remove responsive behavior or animation without instruction.
- Never copy entire HTML documents into React, and never use `dangerouslySetInnerHTML` as a migration
  shortcut.
- Never blindly paste legacy JavaScript into a `useEffect` without understanding what it does first.
