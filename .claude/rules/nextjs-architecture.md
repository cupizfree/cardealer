---
description: Concrete Next.js/React conventions to follow in aurexo-nextjs, derived from ../luminor-nextjs
---

# Next.js Architecture Conventions

These are the ACTUAL conventions found in `../luminor-nextjs` (see `docs/migration/LUMINOR_ARCHITECTURE.md`
for full evidence), adapted to Aurexo's real page inventory. This is not a generic Next.js style guide —
only conventions actually observed or explicitly decided for this migration are listed.

## Framework baseline

- Next.js `15.5.23` (patched — bumped from Luminor's pinned `15.3.5` at scaffold time to close 2 critical +
  2 high-severity CVEs; same Next 15 major/App-Router baseline, not an architecture deviation), React `19`,
  TypeScript `strict: true`, `moduleResolution: bundler`, `jsx: preserve`. Path alias `@/*` → `./src/*`.
- App Router only. ESLint flat config (`eslint.config.mjs`) extending only `next/core-web-vitals` and
  `next/typescript` — no custom rules unless a real recurring problem justifies one.

## Routing

- One root layout (`src/app/layout.tsx`) holding global CSS imports (SCSS entry, swiper css) and any
  always-mounted chrome (`Preloader`, `BackToTop`, generic `Modal` roots) — mirrors Luminor's single-layout
  pattern.
- **Deliberate exception**: `src/app/(dashboard)/layout.tsx` — a real nested layout for the 7
  dashboard/account pages that share a persistent `.dashboard-container` + sidebar shell. Luminor has no
  analogous persistent-shell page family, so this doesn't contradict "follow Luminor" — it's Aurexo's own
  confirmed behavior driving a structural choice Luminor's reference simply doesn't cover.
- Route group folder names use real English spelling (`(other-pages)`, `(listing-details)`, etc.) — do
  **not** copy Luminor's own typos (`(orther-page)`, `Layout-defaul.tsx`) into this project; those are typos
  in the reference project, not conventions with meaning.
- Dynamic detail routes (`listing-details-N/[id]`, `dealer-details/[id]`, `blog-details-N/[id]`,
  `product-details/[id]`) follow Luminor's pattern exactly: async Server Component, `params: Promise<{id:
  string}>`, `await params`, `.find()` against the static data array, `generateStaticParams()` over the same
  array.
- Set real per-page `metadata` (title/description) once actual page content exists — Luminor's reference
  has none to copy, this is a gap to close, not a pattern to follow.
- Use Next.js's built-in `not-found.tsx` instead of a manual `404` route.

## Components

- PascalCase filenames. No barrel `index.ts` exports — direct import paths always, matching Luminor.
- **Variant classification rule** (governs Header/Footer and any other repeated element): classify by
  verified DOM structural difference, not by named CSS "skin" count. Same DOM + different modifier
  classes/data → one component with a `variant` prop. Genuinely different DOM (verified by diffing the raw
  source HTML) → separate components. Full rationale and the concrete Header/Footer decision live in
  `docs/migration/COMPONENT_MAP.md`.
- Client/server boundary pushed to the smallest leaf component, matching Luminor's confirmed 0-client-pages
  pattern. Pages and layouts stay Server Components; interactivity (state, effects, DOM APIs, Swiper,
  scroll-reveal hooks, modals) lives in leaf components. Never add `"use client"` at page level because one
  small child needs it.
- Server Components may freely render Client Component children (standard Next.js composition, used
  throughout Luminor).

## Data & Types

- Centralize static content in `src/data/*.ts` as `type X = {...}` + `export const items: X[]`, matching
  Luminor exactly. No fetch/CMS layer for this migration — everything static in-repo, same as both
  reference projects.
- `type` alias is the dominant convention over `interface` (matches Luminor's near-universal usage).
- `src/types/` holds ONLY ambient `.d.ts` declarations for untyped npm packages. Domain types (the shape of
  a listing, blog post, dealer, menu item, component props) are colocated at the top of the data file or
  component file that owns them — never centralized in `src/types`.

## Styling

- SCSS lives under `public/assets/scss` (not `src/styles`), imported once from `src/app/layout.tsx` —
  matches Luminor's actual physical layout and Aurexo's own existing SCSS structure, minimizing porting
  friction.
- 100% global classNames. Do not introduce CSS Modules — neither reference project uses them, and Aurexo's
  SCSS is already 100% global.
- `url()` references inside ported SCSS must use **absolute** paths (`/assets/icons/...`), not the
  relative `./icons/...` the original static site used (which assumed a compiled-output location one level
  up). This is a required technical fix for Next.js's webpack/sass pipeline, not a design change — the
  rendered result is identical. Already applied during scaffold; keep this in mind if new SCSS partials are
  ported later.
- Images: reference by string path + `next/image` with explicit `width`/`height` (matches Luminor exactly,
  since Aurexo's assets aren't statically imported either). Use inline JSX `<svg>` only where CSS needs to
  recolor strokes/paths (confirmed real need in Aurexo's dark-mode overrides); use `next/image` for
  everything else, collapsing Aurexo's dual `<img src=".svg">`/inline-`<svg>` pattern into one clear rule.

## Dependencies

Installed at scaffold time (see `package.json`): `next`, `react`, `react-dom`, `typescript`, `sass`,
`swiper`, `@headlessui/react`, `eslint`, `eslint-config-next`. Deliberately **not** installed:
`bootstrap`/`react-bootstrap` (Aurexo has no Bootstrap dependency — its grid is self-contained SCSS),
`gsap`, `mapbox-gl`, `photoswipe`/`react-photoswipe-gallery`, `odometer`, `isotope-layout`,
`react-scroll-parallax`/`react-parallax`, `react-fast-marquee`. Before installing any of these — or any new
dependency — read the Package Principle in `migration-quality.md` and the relevant ambiguity in
`docs/migration/COMPONENT_MAP.md`.

## Context / state

- Luminor's `src/context/` is not a real React Context (no `createContext` anywhere in that project) — it's
  a plain reducer instantiated locally per-component via `useReducer`. Follow the same shape for any
  cross-field filter state (listing filters, shop filters): a `type State`, `initialState`, and `reducer`
  function, instantiated with local `useReducer` in the component that needs it — not a global Provider,
  unless a real cross-tree sharing need is proven first.
