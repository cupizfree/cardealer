---
name: migrate-section
description: Implement or refactor ONE Aurexo section independently, without doing a full page migration. Use for e.g. "/migrate-section index.html .section-hero" or "/migrate-section about-us.html Testimonials" when only a single section/component needs work rather than an entire page.
---

# migrate-section

Usage: `/migrate-section <filename>.html "<section selector or name>"` — e.g.
`/migrate-section index.html ".page-title"`, `/migrate-section about-us.html "Testimonials"`.

A scoped-down version of `/migrate-page` for when only one section needs implementing or refactoring —
e.g. building a shared component ahead of the page that will use it, or fixing one section after a
`/verify-migration` finding.

## Process

1. Resolve the exact Aurexo source page in `../aurexo`.
2. Resolve the exact section within that page (by selector or by content match) — read enough surrounding
   context to understand where it sits in the page's DOM order, even though only this section is in scope.
3. Read the complete section markup, not an excerpt guessed from a class name.
4. Trace the relevant SCSS partial(s) for this section specifically.
5. Trace the relevant JavaScript behavior for this section specifically (if interactive).
6. Search existing `aurexo-nextjs/src/components` for something reusable.
7. Check `docs/migration/COMPONENT_MAP.md` for a prior decision covering this section/element.
8. Inspect the `../luminor-nextjs` architectural equivalent for implementation patterns (client boundary,
   typing, hook shape) — never for visual design.
9. Reuse before creating — same hierarchy as `migrate-page` Step 5.
10. Preserve the Aurexo result exactly (`html-fidelity.md`).
11. Follow Luminor architecture conventions (`nextjs-architecture.md`).
12. Validate: `npm run lint` and `npm run build` for any route that consumes this section.
13. Update `docs/migration/COMPONENT_MAP.md` if this changes or adds an architectural decision (new
    component, new variant, resolved ambiguity).

Do not expand scope into a full page migration unless asked — if fixing this section reveals the whole page
needs work, stop and report that rather than silently continuing into `/migrate-page` territory.
