---
name: analyze-html
description: Analyze one Aurexo HTML page (e.g. "/analyze-html about-us.html") before any implementation happens — full HTML/SCSS/JS/asset inventory, section-by-section, cross-referenced against COMPONENT_MAP.md and existing aurexo-nextjs components. Use before migrating any page not yet covered in docs/migration/MIGRATION_STATUS.md, or when re-scoping a page whose analysis is stale. Analysis only — never modifies application code.
---

# analyze-html

Produces a complete migration inventory for ONE Aurexo HTML page. This is analysis only — it never writes
application code. `/migrate-page` should be preceded by this skill's output (or run it internally as its
first real step) rather than jumping straight to implementation.

## Usage

```
/analyze-html <filename>.html
```
e.g. `/analyze-html about-us.html`, `/analyze-html listing-details-3.html`.

## Process

1. **Resolve the exact source file** inside `../aurexo` (root-level `.html` files — see the full list in
   `docs/migration/AUREXO_SOURCE.md` §1 if the filename is ambiguous). Fail loudly if it doesn't exist
   rather than guessing a similarly-named file.
2. **Read the COMPLETE HTML file** — never migrate or analyze from a partial snippet or from memory of a
   similar page. Determine the exact DOM and section order top-to-bottom.
3. **Identify all sections in exact DOM order**, each with: wrapper selector/class, one-line content
   summary, whether it's page-unique or appears elsewhere.
4. **Identify shared/global elements** present on the page (header variant/skin, footer, modals, back-to-top,
   preloader) and their exact modifier classes.
5. **Trace relevant SCSS**: for each section's key classes, find the actual partial(s) in
   `../aurexo/assets/scss/component/*` or `reset.scss`/`inner-page.scss` that style it. Don't guess styling
   from class names alone.
6. **Trace relevant JavaScript**: for each interactive element on the page, find its actual behavior in
   `../aurexo/assets/js/app.js`, `swiper.js`, `filterCar.js`, `shop.js`, `maps.js`, or `gear-slider.js` (see
   `docs/migration/AUREXO_SOURCE.md` §5 for the behavior inventory already catalogued) — confirm which
   specific behaviors apply to THIS page, don't assume all of `app.js` applies everywhere.
7. **Identify page-specific assets** (images/icons referenced only by this page vs. shared pool assets).
8. **Identify libraries/plugins** this page actually uses (Swiper instance names from `swiper.js`, Fancybox,
   Google Maps, etc. — cross-check `docs/migration/AUREXO_SOURCE.md` §8).
9. **Identify responsive differences** — any breakpoint behavior specific to this page beyond the global
   rules in `reponsive.scss`.
10. **Identify page-family relationships** — which other Aurexo HTML files are variants of this one (see
    `docs/migration/AUREXO_SOURCE.md` §1 families), and whether any family member is already `MIGRATED` in
    `docs/migration/MIGRATION_STATUS.md`.
11. **Search existing `aurexo-nextjs` components** (`src/components/**`) for anything reusable before
    concluding a section needs a new component — same search-before-create order as `migration-quality.md`:
    codebase first, then the map below.
12. **Compare against `docs/migration/COMPONENT_MAP.md`** — has a classification (REUSE / VARIANT / CREATE_NEW
    / etc.) already been recorded for this page's elements? Flag any mismatch between what's recorded and
    what's actually in the HTML.
13. **Produce the migration inventory** as the skill's output: a section-by-section table (selector →
    content → SCSS source → JS behavior → reuse candidate → data/types needed), plus a summary of open
    questions or ambiguities that should be flagged rather than silently decided (cross-reference
    `docs/migration/COMPONENT_MAP.md`'s ambiguities list).

## Constraints

- Never modify `../aurexo`, `../luminor-nextjs`, or write any file under `aurexo-nextjs/src`.
- It is fine (and expected) to update `docs/migration/COMPONENT_MAP.md` or
  `docs/migration/MIGRATION_STATUS.md` (status → `ANALYZED`) as a side effect of this analysis, since those
  are documentation, not application code.
