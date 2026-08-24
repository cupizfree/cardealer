---
description: Which of the three projects controls what, and how to resolve conflicts between them
---

# Source Priority

Three projects, three roles. This is not negotiable per-task — it applies to every change in this repo.

- **`../aurexo`** = visual / content / behavior truth. Answers "what must the user see and how must the
  page behave." READ-ONLY. Never modify. Never redesign, simplify, reorder, or reinterpret it without
  explicit instruction.
- **`../luminor-nextjs`** = architecture / implementation truth. Answers "how should this be built in
  Next.js." READ-ONLY. It is a **different website** — its visual design, content, and copy are never a
  target. Only its patterns (routing, component structure, data/types, client/server boundaries, styling
  architecture, dependency choices) are reference material.
- **`aurexo-nextjs`** (this project) = the only writable target. Every change lands here.

## Conflict resolution

Whenever Aurexo's result and Luminor's pattern don't line up:

1. Preserve Aurexo's visual and functional result exactly.
2. Study how Luminor implements an equivalent *concept* (not necessarily the same component).
3. Recreate the Aurexo result inside `aurexo-nextjs` using Luminor's architectural pattern.

Never make Aurexo look like Luminor because Luminor happens to have a similarly-named component. Example:
Aurexo's `.header-style-1..4` are confirmed to be ONE DOM structure with modifier classes; Luminor's
`Header2`/`Header3` are confirmed to be genuinely different designs. The correct move is not "copy
Luminor's numbered-file pattern" — it's "apply Luminor's general conventions (client boundary, typing,
naming) to build a single `Header` with a `variant` prop," because that's what Aurexo's own evidence
supports. See `nextjs-architecture.md` for the full variant-classification rule.

## Read/write boundaries

| Path | Access |
|---|---|
| `../aurexo/**` | READ-ONLY |
| `../luminor-nextjs/**` | READ-ONLY |
| `aurexo-nextjs/**` (this project) | READ + WRITE |

If a task seems to require editing `../aurexo` or `../luminor-nextjs`, stop and say so — it means the
approach is wrong, not that the restriction should be bent.

## Non-negotiables

- Migration is not a redesign. Do not simplify, reinterpret, modernize, reorder, or redesign Aurexo unless
  explicitly instructed.
- Never copy Luminor's visual design, copy, or content into `aurexo-nextjs`.
- Never treat `aurexo-nextjs`'s own current state as the architecture source of truth for `/analyze-base` —
  that skill always means `../luminor-nextjs`.
