---
name: migrate-page
description: Full migration workflow for ONE Aurexo HTML page into aurexo-nextjs — the primary, mandatory 19-step process for turning a page from ../aurexo into a Next.js route using ../luminor-nextjs architecture patterns. Manually invoked only (e.g. "/migrate-page about-us.html").
disable-model-invocation: true
---

# migrate-page

Usage: `/migrate-page <filename>.html` — e.g. `/migrate-page about-us.html`, `/migrate-page index.html`,
`/migrate-page listing-details-2.html`.

This is the primary, mandatory page-migration workflow. Do not improvise a different procedure. Follow the
steps below in order — do not start writing components at Step 0.

Read `../../CLAUDE.md` and the three rules (`source-priority.md`, `nextjs-architecture.md`,
`html-fidelity.md`, `migration-quality.md`) before starting if this is the first migration of the session.

## Step 0 — Resolve scope

Determine: the exact Aurexo HTML source file (fail loudly if it doesn't exist in `../aurexo`), the target
Next.js route (check `docs/migration/MIGRATION_STATUS.md` for the planned route), the page family it
belongs to (`docs/migration/AUREXO_SOURCE.md` §1), whether this is the first page of its family to be
migrated, and whether a related family member is already `MIGRATED`. Do not edit any code before this is
clear. Update `docs/migration/MIGRATION_STATUS.md` status to `IN_PROGRESS`.

## Step 1 — Read the complete HTML

Read the entire source file from `../aurexo`. Never migrate from a partial snippet or from a prior
analysis summary alone if that summary is stale — re-read the source. Determine the exact DOM and section
order.

## Step 2 — Build the section inventory

Before writing any code, map the whole page internally: for every section, note source selector, content,
assets, behavior, styles, responsive behavior, candidate existing target component, reuse possibility,
required data, required types. (If `/analyze-html` was already run for this page and is not stale, reuse
its output here instead of redoing the work.)

## Step 3 — Trace SCSS/CSS

For every section, locate the actual SCSS partial(s) styling it in `../aurexo/assets/scss`. Understand the
styles before porting them — don't blindly copy every rule in a partial if only part of it is relevant, but
don't drop rules that affect this page's visual fidelity either.

## Step 4 — Trace JavaScript

For every interactive section, find its actual behavior in `../aurexo/assets/js/*` (see
`docs/migration/AUREXO_SOURCE.md` §5 for the full inventory). Determine trigger, selector, state,
initialization, cleanup needs. Do not paste jQuery into a `useEffect` — understand it, then implement
idiomatically per `nextjs-architecture.md`.

## Step 5 — Search before create

In this order: (1) `aurexo-nextjs/src` for an existing component, (2) `docs/migration/COMPONENT_MAP.md` for
a prior decision, (3) an already-migrated related Aurexo page, (4) `../luminor-nextjs` for the architectural
pattern. Reuse hierarchy: `REUSE` → `REUSE_WITH_DATA` → `EXTEND_WITH_PROPS` → `CREATE_NEW` (reusable) →
page-specific component (only if genuinely unique). Never create `Hero2`/`Header3`-style numbered
components just because another HTML variant exists — apply the variant classification rule in
`nextjs-architecture.md` first.

## Step 6 — Page family / variant logic

For related pages (e.g. the 12 home variants, the 10 listing variants), prefer in this order: DATA → PROPS
→ VARIANT → NEW COMPONENT. Don't force reuse if the underlying HTML is confirmed structurally different
(diff the actual source, don't assume from visual similarity or naming).

## Step 7 — Preserve Aurexo fidelity

Apply `html-fidelity.md` in full: all sections, exact order, content, images, icons, layout, responsive
behavior, interactive behavior, animation, states, links. Migration is not redesign.

## Step 8 — Follow Luminor architecture

Implement using the conventions in `nextjs-architecture.md` / `docs/migration/LUMINOR_ARCHITECTURE.md` for
routes, components, data, types, props, metadata, images, links, imports, styles, Server/Client boundaries.
Do not introduce a different architecture.

## Step 9 — Client/Server boundaries

Do not put `"use client"` at page level because one small component is interactive. Keep static
sections/pages server-compatible; push client behavior to the smallest leaf component, per Luminor's
confirmed 0-client-pages pattern.

## Step 10 — Convert legacy JavaScript properly

Understand the behavior first (Step 4), then implement with React state/refs/effects/custom hooks
following the patterns catalogued in `docs/migration/LUMINOR_ARCHITECTURE.md` §8 (e.g. the
`IntersectionObserver` + ref-guard shape used for Odometer → reused for count-up/scroll-reveal). Handle
`useEffect` cleanup wherever the original JS registers listeners/observers/timers/third-party instances.

## Step 11 — Data architecture

Centralize static content in `src/data/*.ts` (typed arrays), not inline in `page.tsx`. See
`docs/migration/COMPONENT_MAP.md`'s data-files table for the planned shape of each domain's data file —
extend it, don't invent a parallel structure.

## Step 12 — Types

Strong typing, `type` over `interface`, colocated with the owning data/component file per
`nextjs-architecture.md`. No unexplained `any`; never suppress a type error instead of fixing it.

## Step 13 — Styling

Preserve Aurexo's appearance. Before adding any style: inspect the source Aurexo SCSS, inspect existing
`aurexo-nextjs` styles, inspect the SCSS abstracts/variables/mixins already ported. Remember `url()` paths
in ported SCSS must be absolute (`/assets/...`), not relative. Don't rename every legacy class, don't
blindly keep every legacy class either — keep what carries visual fidelity, animation hooks, or responsive
behavior.

## Step 14 — Heading semantics

Never derive the semantic tag from a `.h1`–`.h7` class. Preserve both a correct heading hierarchy and
Aurexo's visual typography scale independently, per `html-fidelity.md`.

## Step 15 — Assets

Use the real Aurexo assets already ported to `public/assets/{images,icons}`. No placeholders. If an asset
this page needs wasn't part of the initial scaffold copy, verify it exists in `../aurexo/assets` and copy it
in (read-only source, copy — not move — into `aurexo-nextjs/public/assets`).

## Step 16 — Validate

Run `npm run lint` and `npm run build` in `aurexo-nextjs`. Fix migration-created errors — never suppress
them.

## Step 17 — Update COMPONENT_MAP.md

Record reused components, extended components, newly created reusable components, variants, and any
behavior implementation decisions (especially resolved ambiguities) made during this migration.

## Step 18 — Update MIGRATION_STATUS.md

Set the page's row to `MIGRATED` (not `VERIFIED` — that requires a `/verify-migration` pass), fill in the
Reuse and Notes columns.

## Step 19 — Report results

Report clearly:

- **Route**: the route created/updated.
- **Reused components**: list.
- **Extended components**: list, with what prop/variant was added.
- **New components**: list.
- **Data**: data files created/updated.
- **Types**: type files/declarations created/updated.
- **Behaviors**: legacy JS behaviors converted and how.
- **Validation**: commands run (`lint`, `build`) and their result.
- **Deviations**: known deviations from Aurexo, if any. If none, explicitly state: "No known intentional
  deviations from Aurexo."
