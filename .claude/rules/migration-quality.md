---
description: Completion criteria for a migrated page/section, and the reuse/package principles that govern how it gets there
---

# Migration Quality

A migrated unit (page or section) is not finished until ALL of the following are true:

1. It follows the detected Luminor architecture (`docs/migration/LUMINOR_ARCHITECTURE.md`,
   `nextjs-architecture.md`) — not a different, self-invented architecture.
2. It preserves Aurexo's design, content, and behavior (`html-fidelity.md`).
3. It preserves Aurexo's responsive behavior at Aurexo's real breakpoints.
4. It reuses existing `aurexo-nextjs` components appropriately — checked against
   `docs/migration/COMPONENT_MAP.md` and the current codebase BEFORE writing anything new.
5. It uses the correct data architecture (centralized `src/data/*.ts` typed arrays, not inline datasets in
   `page.tsx`, not ad hoc per-component duplication).
6. It uses correct types (colocated with the owning data/component file, `type` over `interface`, no
   unexplained `any`).
7. Imports are correct (direct paths, `@/*` alias, no barrel exports invented where none exist elsewhere).
8. No obvious duplicated implementation exists (e.g. a second Header variant created when `variant` prop
   would have worked — see the variant classification rule in `nextjs-architecture.md`).
9. No migration-created dead code (unused imports, half-ported jQuery remnants, commented-out blocks).
10. No unnecessary new dependency was added — see the Package Principle below.
11. TypeScript passes (`tsc`/`next build` type-checking) with no suppressed errors.
12. Lint passes (`npm run lint`) with no suppressed warnings used as a shortcut.
13. `npm run build` succeeds.

If any of these isn't true, the unit is `IN_PROGRESS`, not `MIGRATED` — reflect that honestly in
`docs/migration/MIGRATION_STATUS.md`. Only mark `VERIFIED` after an actual `/verify-migration` pass.

## Search-before-create order (mandatory, every time)

1. `aurexo-nextjs` — does an existing component already do this, or nearly this with a prop/variant added?
2. `docs/migration/COMPONENT_MAP.md` — has this exact decision already been made for a related page?
3. A related, already-migrated Aurexo page (same family) — how did it solve the same problem?
4. `../luminor-nextjs` — how does it structure the equivalent *concept* architecturally?

Reuse hierarchy, in order of preference: `REUSE` → `REUSE_WITH_DATA` → `EXTEND_WITH_PROPS` →
`CREATE_NEW` (reusable) → page-specific component (only when genuinely unique to one page).

Never create `Hero2`, `Header3`, `Service2`-style numbered components just because another Aurexo HTML
variant exists — first check whether the difference is DOM-identical-different-class (→ `variant` prop) per
`nextjs-architecture.md`. A bad forced abstraction is worse than a justified separate component, but a
justified separate component requires actually diffing the source HTML first, not assuming from the file name.

## Package Principle

Before installing ANY package:

1. Check what's already a dependency in `aurexo-nextjs`.
2. Check how `../luminor-nextjs` solves the equivalent functional need (see
   `docs/migration/LUMINOR_ARCHITECTURE.md` §11 and `COMPONENT_MAP.md`'s ambiguities list).
3. Confirm Aurexo's actual behavior genuinely needs that solution — don't install a library because Luminor
   has it if Aurexo's real behavior differs (e.g. Aurexo uses Google Maps, not Mapbox; plain show/hide
   filtering, not Isotope; simple count-up, not Odometer's flip-digit visual).

Only add a dependency when a hand-rolled `IntersectionObserver`/`useEffect` hook genuinely isn't sufficient
— several of Aurexo's jQuery behaviors (scroll-reveal, count-up, plain filtering) are deliberately planned
as small custom hooks instead of new dependencies; see `docs/migration/COMPONENT_MAP.md`'s ambiguities list
before deciding otherwise.

## Client Component boundary

Interactive behavior does not mean the whole page becomes a Client Component. Keep `"use client"` on the
smallest leaf component that actually needs state/effects/DOM APIs, consistent with Luminor's confirmed
0-client-pages pattern (`docs/migration/LUMINOR_ARCHITECTURE.md` §7).

## Definition of "done" for THIS repo's tooling

Available checks (run what applies): `npm run lint`, `npm run build` (includes type-checking since
`next build` runs `tsc` as part of the production build). Fix migration-created errors — never suppress
with `// @ts-ignore`, `eslint-disable`, or `--no-verify`-style shortcuts.
