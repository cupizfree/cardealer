---
name: verify-migration
description: Audit an already-migrated aurexo-nextjs route against BOTH Aurexo fidelity and Luminor architecture, plus engineering checks (lint/build). Manually invoked only (e.g. "/verify-migration /about-us" or "/verify-migration /"). Produces a severity-classified findings report — never silently refactors.
disable-model-invocation: true
---

# verify-migration

Usage: `/verify-migration <route>` — e.g. `/verify-migration /`, `/verify-migration /about-us`,
`/verify-migration /listing-details-2`.

Audits an already-`MIGRATED` route. Never runs on a route still `TODO`/`IN_PROGRESS` in
`docs/migration/MIGRATION_STATUS.md` — verify what actually exists.

## Verify — Aurexo fidelity

Compare the live route against the real Aurexo source page (re-read it, don't rely on a stale prior
analysis):

- All sections present, in the exact original order.
- Text, images, icons match the source.
- Semantic heading hierarchy is correct AND independent from `.h1`–`.h7` visual classes (per
  `html-fidelity.md`).
- Layout, spacing, responsive behavior at Aurexo's real breakpoints.
- Buttons, links, forms, sliders, tabs, accordions, dropdowns, modals — present and functionally correct.
- Animation and scroll interaction present where the source has it.
- Stateful UI (mobile menu, filters, modals) behaves like the source.

## Verify — Luminor architecture

Compare implementation patterns (not visuals) against `docs/migration/LUMINOR_ARCHITECTURE.md` and
`nextjs-architecture.md`:

- Route structure matches the App Router conventions in use.
- No duplicated component that should have been a `REUSE`/`REUSE_WITH_VARIANT` per
  `docs/migration/COMPONENT_MAP.md`.
- Data/types organization matches the centralized, colocated-types convention.
- Client/server boundaries are minimal (no unnecessary page-level `"use client"`).
- Images use `next/image` with explicit dimensions; imports use `@/*` alias, no barrel exports invented.
- No unexplained new dependency was introduced without following the Package Principle in
  `migration-quality.md`.

Remember: Luminor's architecture is the reference. Luminor's visual design is never the reference — do not
flag a difference from Luminor's look as a problem.

## Verify — Engineering

Run `npm run lint` and `npm run build` in `aurexo-nextjs`. Classify every finding:

- `CRITICAL` — breaks the build, breaks core functionality, or silently drops required Aurexo content/behavior.
- `HIGH` — visible fidelity or architecture violation likely to compound into other pages.
- `MEDIUM` — real but localized deviation.
- `LOW` — cosmetic/minor cleanup opportunity.

For each finding report: target file, target code/location, the Aurexo or Luminor reference it violates,
the current problem, the expected result, and a recommended fix.

## Constraints

- Do not silently refactor unrelated code while verifying — report findings, fix only what's explicitly
  asked to be fixed (or, if invoked as part of `/migrate-page` Step 16-ish validation loop, only what that
  flow owns).
- After a verification pass with no CRITICAL/HIGH findings left outstanding, update the route's row in
  `docs/migration/MIGRATION_STATUS.md` to `VERIFIED`. If findings remain, leave it at `MIGRATED` (or
  `BLOCKED` if a finding can't be resolved without a decision from the user) and list them in the Notes
  column.
