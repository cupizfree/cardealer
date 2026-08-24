# aurexo-nextjs

## Project Purpose

Migrate the static Aurexo HTML/SCSS/jQuery car-dealer/listing template into this Next.js project,
page by page, preserving Aurexo's exact visual result and behavior while following the Next.js
architecture patterns demonstrated by a separate reference project.

## Project Roles

Three projects, one writable:

- **`../aurexo`** — the original static site. READ-ONLY. Source of truth for content, visuals, and behavior.
- **`../luminor-nextjs`** — an unrelated existing Next.js project. READ-ONLY. Source of truth for HOW to
  build things in Next.js (architecture/patterns only — never its visual design or content).
- **`aurexo-nextjs`** (this project) — the only read/write target. Everything gets built here.

## Read / Write Boundaries

| Path | Access |
|---|---|
| `../aurexo/**` | READ-ONLY |
| `../luminor-nextjs/**` | READ-ONLY |
| `aurexo-nextjs/**` | READ + WRITE |

Full detail and conflict-resolution rules: `.claude/rules/source-priority.md`.

## Source of Truth

```
Aurexo UI / Content / Behavior  +  Luminor Next.js Architecture/Logic  →  aurexo-nextjs
```

Aurexo answers "what must the user see and how must it behave." Luminor answers "how should that be
structured in Next.js." Never let Luminor's visual design leak in; never let Aurexo's HTML/jQuery get
pasted in verbatim.

## Core Migration Rules

See `.claude/rules/`:

- `source-priority.md` — the rule above, in full, plus conflict resolution.
- `nextjs-architecture.md` — concrete Luminor-derived conventions (routing, components, data/types,
  styling, client/server boundaries, dependencies) adapted to Aurexo's actual page inventory.
- `html-fidelity.md` — fidelity requirements; migration is not redesign; heading-semantics-vs-typography-class rule.
- `migration-quality.md` — completion criteria, search-before-create order, Package Principle.

## Architecture Reference

Read before migrating anything unfamiliar:

- `docs/migration/LUMINOR_ARCHITECTURE.md` — actual Luminor conventions, with file paths.
- `docs/migration/AUREXO_SOURCE.md` — actual Aurexo page inventory, SCSS/JS architecture, with file paths.
- `docs/migration/COMPONENT_MAP.md` — Aurexo → target component/route → Luminor reference mapping, plus the
  open ambiguities list. **Check this before creating any component.**
- `docs/migration/MIGRATION_STATUS.md` — per-page status table (`TODO`/`ANALYZED`/`IN_PROGRESS`/`MIGRATED`/`VERIFIED`/`BLOCKED`).

## Component Reuse

Search order, every time, before creating anything: (1) this codebase (`src/components`), (2)
`docs/migration/COMPONENT_MAP.md`, (3) an already-migrated related Aurexo page, (4) `../luminor-nextjs` for
architectural pattern. Never create numbered components (`Hero2`, `Header3`) just because another Aurexo
HTML variant exists — see the variant classification rule in `nextjs-architecture.md`.

## Workflow

Use Skills for migration work instead of improvising a procedure:

- `/analyze-base` — re-analyze `../luminor-nextjs` when an architecture pattern is unfamiliar or undocumented.
- `/analyze-html <file>.html` — analyze one Aurexo page before implementing it.
- `/migrate-page <file>.html` — the full page-migration workflow (manual invocation only).
- `/migrate-section <file>.html "<section>"` — scoped single-section work.
- `/verify-migration <route>` — post-migration audit against both Aurexo and Luminor (manual invocation only).

No Aurexo page has been migrated yet. Recommended first page: `about-us.html` (see
`docs/migration/COMPONENT_MAP.md` and `MIGRATION_STATUS.md` for rationale) — it exercises the header
(one skin), footer, root layout, ported SCSS, and typography conventions needed by nearly every other page,
without `index.html`'s stacked complexity (6 modals, 4 carousel types, inline calculator, parallax).

## Verification

Available checks: `npm run lint`, `npm run build` (runs TypeScript checking as part of the production
build). A migrated unit is not `MIGRATED` in `docs/migration/MIGRATION_STATUS.md` until these pass and the
criteria in `migration-quality.md` are met; not `VERIFIED` until an explicit `/verify-migration` pass finds
no outstanding CRITICAL/HIGH issues.
