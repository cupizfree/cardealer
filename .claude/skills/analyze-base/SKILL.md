---
name: analyze-base
description: Deeply (re-)analyze ../luminor-nextjs to refresh or extend architecture understanding before implementing an unfamiliar pattern. Use when a Luminor implementation is unfamiliar, when architecture in docs/migration/LUMINOR_ARCHITECTURE.md seems stale or incomplete for the pattern at hand, or before migrating a page family that needs a Luminor pattern not yet documented. "analyze-base" ALWAYS means ../luminor-nextjs — never the current aurexo-nextjs project. Read-only, does not implement pages.
---

# analyze-base

Re-analyzes `../luminor-nextjs` — the Next.js architecture reference. This skill NEVER treats the current
`aurexo-nextjs` project as the base architecture source, even after many pages have been migrated into it.
"Base" means Luminor, always.

## When to use

- A Luminor implementation pattern relevant to the page/section being migrated isn't covered (or is
  covered too thinly) in `docs/migration/LUMINOR_ARCHITECTURE.md`.
- The migration needs to study how Luminor handles something specific: a particular interactive behavior,
  a data shape, a routing pattern, a styling convention.
- Something in Luminor's architecture is suspected to have been misread in the existing doc and needs
  re-verification against the actual source.

## What this skill does NOT do

- Does not modify `../luminor-nextjs` under any circumstance — read-only, always.
- Does not implement anything in `aurexo-nextjs`. It only produces findings.
- Does not treat `aurexo-nextjs`'s own code as an architecture source, even if `aurexo-nextjs` has grown
  large. If you need to know how an already-migrated Aurexo page did something, that's a codebase search in
  `aurexo-nextjs`, not an `analyze-base` run.

## Process

1. Identify the specific pattern/question to investigate (e.g. "how does Luminor implement a filter
   sidebar with a price range slider," "how does Luminor structure Server Actions for form submission").
2. Read the relevant files in `../luminor-nextjs` directly — don't rely on assumptions from the package.json
   dependency list alone. Trace actual imports and usage, not just file names.
3. Cross-reference against `docs/migration/LUMINOR_ARCHITECTURE.md` — is this pattern already documented?
   If the existing doc is wrong or incomplete, note the correction.
4. Cite real file paths for every finding.
5. If the finding is generally reusable (not just relevant to one page), update
   `docs/migration/LUMINOR_ARCHITECTURE.md` with the new section/correction, following its existing
   structure and level of concreteness (real paths, real code excerpts, no generic Next.js advice).
6. Report the concrete findings back with file paths — this is what the calling context (a `/migrate-page`
   or `/migrate-section` run, or the user directly) needs to make an implementation decision.

Never skip straight to implementing in `aurexo-nextjs` from this skill — that's `/migrate-page` or
`/migrate-section`'s job, using this skill's findings as input.
