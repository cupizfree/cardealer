# Luminor Next.js — Architecture Reference

> Source: `../luminor-nextjs` (READ-ONLY). This document records ACTUAL conventions found by direct
> code inspection, not generic Next.js advice. Every claim below is backed by a real file path.
> Luminor is the reference for **HOW** to implement things in Next.js — never for what the site
> should look like. Re-run `/analyze-base` to refresh this file when a new pattern needs deeper study.

## 1. Framework

- Next.js `15.3.5`, React `^19.0.0`, TypeScript `^5`, `strict: true`, `moduleResolution: bundler`, `jsx: preserve`.
- App Router only (`src/app`), path alias `@/*` → `./src/*` (`tsconfig.json`).
- `eslint.config.mjs` is flat config using `FlatCompat`, extending only `next/core-web-vitals` and `next/typescript` — no custom rules.

## 2. Routing

Route tree under `src/app` (route groups don't affect the URL):

```
src/app/layout.tsx                                    -> root layout (the ONLY layout.tsx in the project)
src/app/page.tsx                                       -> "/"
(homes)/home02|home03|home04|home05/page.tsx
(properties)/listing-half-map-grid|listing-half-map-list|listing-left-sidebar|listing-right-sidebar|listing-topmap-grid|listing-topmap-list/page.tsx
(properties-details)/property-details-1..4/[id]/page.tsx
(blogs)/blog-grid|blog-list|blog-standard/page.tsx, blog-post-1|blog-post-2/[id]/page.tsx
(orther-page)/FAQs|about-us|contacts|login|our-pricing|privacy-policy|register/page.tsx   (typo "orther" preserved as evidence — do NOT copy this typo into aurexo-nextjs)
```

- **Only one `layout.tsx` exists in the whole tree** (root). No nested route-group layouts. Each page
  either imports a shared `Layout-defaul.tsx` wrapper (typo "defaul" preserved in the source) or composes
  its own `Header*`/`Footer*` pair directly (home variants do this).
- Root layout (`src/app/layout.tsx`) imports ALL global CSS centrally — bootstrap.min.css, photoswipe css,
  swiper css, icomoon icon font css, and `public/assets/scss/app.scss` — and mounts `<ClientScripts/>` and
  `<BackToTop/>` globally.
- **No per-page metadata anywhere.** `grep -r "export const metadata|generateMetadata" src/app` returns
  only `src/app/layout.tsx`. This is a gap in the reference project, not a pattern to copy — aurexo-nextjs
  pages should set their own `metadata` per page once real content exists.
- No `loading.tsx` / `error.tsx` / `not-found.tsx` anywhere in the project.
- Dynamic `[id]` routes are async Server Components: `params: Promise<{id: string}>`, `await params`,
  `.find()` against a static data array, plus `generateStaticParams()` over the same array. Example
  (`src/app/(properties-details)/property-details-1/[id]/page.tsx`):
  ```tsx
  type PageProps = { params: Promise<{ id: string }> };
  export default async function Page({ params }: PageProps) {
    const { id } = await params;
    const property = allProperties.find((elm) => String(elm.id) === id) || allProperties[0];
    return (<Layout><PropertyDetails1 property={property} /><Relatest /></Layout>);
  }
  export async function generateStaticParams() {
    return allProperties.map((property) => ({ id: String(property.id) }));
  }
  ```
- **Zero `page.tsx` files have `"use client"`.** All pages are Server Components.

## 3. Component Architecture

`src/components` subfolders: `blogs/, common/, footer/, header/, homes/, layouts/, otherpage/, properties/, property-details/`.

- `homes/` splits per home-page variant: `homepage-1..5/`, plus shared `LatestNews.tsx`/`TopProperties.tsx`
  directly under `homes/` (truly identical sections live ungated by variant).
- `header/` has one file PER home variant: `Header.tsx, Header2.tsx, Header3.tsx, Header4.tsx, Header5.tsx`,
  plus `Nav.tsx`, `MobileMenu.tsx`. `footer/` similarly has `Footer1.tsx, Footer2.tsx, Footer3.tsx`.
- **Naming**: PascalCase files. Numeric suffixes (`Header2`, `Properties2`) denote a *design variant*.
- **No barrel exports anywhere** (`find src -name "index.ts*"` → empty). Every import is a direct path.
- **Page-variant reuse strategy: separate components + separate data slices, NOT one prop-driven component.**
  Home 1 (`src/app/page.tsx`) imports `Hero`/`About`/`Properties` from `homepage-1/`; Home 2
  (`src/app/(homes)/home02/page.tsx`) imports its own `Hero`/`Populor`/`Properties` from `homepage-2/` and
  doesn't even use the shared `Layout` wrapper — it composes `TopBar`+`Header2`+`Footer2` directly. This is
  because Luminor's home variants are **genuinely different designs**, not the same DOM with different classes.
  → See `nextjs-architecture.md` for the rule this implies for classifying Aurexo's variants (which are
  mostly the opposite case: same DOM, different modifier classes).
- Representative reads:
  - `homes/homepage-1/Hero.tsx` — `"use client"` (Swiper hero carousel, `next/image` background, no props,
    hard-coded content).
  - `header/Header.tsx` — `"use client"` (holds `useState` for mobile menu), composes `Nav` + `Offcanvas` +
    `MobileMenu`, logo via `next/image` with explicit `width`/`height`.
  - `layouts/Layout-defaul.tsx` — Server Component wrapper (`<Header/>{children}<Footer1/>`) that freely
    renders Client Component children — standard Next.js Server-wraps-Client composition.
- Prop types are declared inline at the function signature or as a `type` alias directly above the
  component in the same file — no shared `Props` naming file convention.

## 4. Data Architecture

`src/data/{blog,footer,menu,optionfilter,properties}.ts` — **centralized, not colocated per page.**

- `properties.ts`: `type Property = {...}`, `export const properties: Property[]` (~880 lines), plus
  `export const allProperties = [...properties]` (spread copy consumed by detail pages/filter reducer).
- `blog.ts`: `type BlogPost = {...}`, `export const blogPostsLarge: BlogPost[]`.
- `menu.ts`: `type MenuItem = {...}`, `export const menuItems: MenuItem[]` — the whole nav structure,
  consumed directly by `header/Nav.tsx`.
- Consumption: components `import { properties } from "@/data/properties"` then `.slice()`/`.find()`/`.filter()`
  as needed. No fetch/CMS layer — everything static in-repo.

## 5. Types

`src/types/` holds **only ambient `.d.ts` module declarations** for untyped npm packages (`bootstrap.d.ts`,
`odometer.d.ts`, `react-modal-video.d.ts`, `splitting.d.ts`) — **not** app-domain types.

Domain types (`Property`, `BlogPost`, `MenuItem`, component prop types) are declared **inline, colocated**
with the data file or component that owns them. `type` alias is the dominant convention (`interface` appears
only once, in `common/Map.tsx`).

## 6. Styling

- Entry point: `public/assets/scss/app.scss` (SCSS lives under `public/`, not `src/styles`), imported once
  from `src/app/layout.tsx`.
  ```scss
  @use "./abstracts/index" as abstracts;
  @use "reset"; @use "./component/index"; @use "./widgets"; @use "./sections";
  ```
- Structure: `abstracts/{_index,_variable,_mixin}.scss`, `_reset.scss`, `component/_index.scss` + one
  partial per UI concern (`_accordion, _animation, _blog, _button, _footer, _form, _header, _hover, _map,
  _nice-select, _pop-up, _range-slider, _shop, _slider, _tabs, _testimonial`.scss).
- Breakpoints (`abstracts/_mixin.scss`): `sm:575px, md:767px, lg:991px, llg:1024px, xl:1199px, xxl:1440px,
  xxxl:1599px, full:1920px` via a `res($size, $type: max)` mixin, used as `@include res(lg) { ... }`.
- **No CSS Modules anywhere** — 100% global classNames (custom BEM-ish names like `tf-container`, `card-house`).
- Bootstrap CSS is imported raw from `node_modules` in the root layout — a second, independent global
  stylesheet alongside the custom SCSS (not integrated into the SCSS pipeline). Custom `tf-container`
  (not Bootstrap's `.container`) is the actual layout container class used in JSX.

## 7. Client/Server Boundaries

- `grep -rl '"use client"' src` → 61/180 files. `grep -rl '"use client"' src/app --include=page.tsx` → 0.
- Boundary is consistently pushed to the smallest leaf component: pages and layouts stay Server Components;
  interactivity (state, effects, DOM APIs, third-party client libs) is isolated in leaf/section components.
- Server Components (e.g. `Layout-defaul.tsx`) freely render Client Component children (`Header`, `Footer1`)
  without themselves becoming client components.

## 8. Interactive Behavior Patterns (with real file evidence)

| Behavior | File | Pattern |
|---|---|---|
| Swiper slider | `components/homes/homepage-1/Hero.tsx` | `"use client"`, `swiper/react` + `swiper/modules` (`Navigation`, `Autoplay`), custom nav buttons via `navigation={{nextEl,prevEl}}` |
| GSAP + ScrollTrigger + SplitText | `components/common/ClientScripts.tsx` | Single global client component mounted from root layout; `useGSAP(() => {...}, [pathname])` re-runs on every route change (acts as the app's animation re-init since there's no per-route layout to remount); `ScrollTrigger.refresh()` at the end of each block |
| Sticky header | `components/common/ClientScripts.tsx` (`headerFixed2()`) | Plain scroll listener toggling `.is-fixed` on `.header-fixed`, registered/cleaned in a `useEffect` — lives in the global script file, NOT inside `Header.tsx` itself |
| Mobile menu | `header/Header.tsx` + `common/Offcanvas.tsx` + `header/MobileMenu.tsx` | `useState` in Header, presentational Offcanvas, separate MobileMenu list |
| Accordion | `common/FAQs1.tsx` | Raw Bootstrap `data-bs-toggle="collapse"` markup, NOT a custom React accordion — relies on the globally-loaded Bootstrap JS bundle |
| Isotope filtering | `components/homes/homepage-4/Properties.tsx` | `"use client"`, dynamic `import("isotope-layout")` inside `useEffect`, `.destroy()` cleanup on unmount, second `useEffect` keyed on filter state calls `.arrange()` |
| Odometer counter | `common/Odometer.tsx` (`OdometerOnScroll`) | `"use client"`, `IntersectionObserver` (threshold 0.5) + `hasAnimatedRef` guard against re-trigger, dynamic import of `odometer` |
| Mapbox | `common/Map.tsx` | `"use client"`, one-time init `useEffect` (ref-guarded) + a second `useEffect` keyed on a `sorted` prop to update markers; cleanup via `map.current.remove()` |
| PhotoSwipe gallery | `property-details/Gallery.tsx` | `react-photoswipe-gallery` render-prop pattern (`<Item>{({ref,open}) => <Image ref={ref} onClick={open}/>}</Item>`) |
| Marquee | `common/AutoRepeatMarquee.tsx` | `react-fast-marquee` for horizontal, hand-rolled CSS `@keyframes` (styled-jsx) for vertical, `ResizeObserver` to compute repeat count |

- **No custom hooks directory exists** (no `src/hooks`, no `useXxx.ts` files) — all "hook-like" behavior is
  inlined per-component with vanilla `useEffect`/`useRef`/`useState`, or via the third-party `useGSAP` hook.

## 9. Assets

- `public/assets/{css,font,icons,images,scss}`, images subfoldered by content type (`avatar, blog, home,
  logo, page-title, section, ...`).
- **Images are referenced exclusively by string path, never statically imported** (`grep -r "from ['\"].*\.(png|jpg|jpeg|svg)"` → 0 matches). `next/image` always supplies explicit `width`/`height` since the `src`
  is a non-static string; `priority` is used for above-the-fold hero images. No `next.config.ts`
  `images.remotePatterns` (everything served from local `public/`).

## 10. Context & Actions

- `src/context/propertiesFilterReduce.ts` is **NOT a real React Context** — `grep -r "createContext" src`
  returns nothing anywhere in the project. It's a plain `type + initialState + reducer` module, instantiated
  **locally per-component** via `useReducer` (e.g. `properties/Properties1.tsx`), not shared app-wide.
- `src/actions/*.ts` (9 files) are all Next.js Server Actions (`"use server"`), `FormData`-based, manual
  field validation, simulated async delay (`setTimeout` Promise) + `console.log`/`console.error` — template
  placeholders, not real backend integration. Example shape confirmed in `loginAction.ts`.

## 11. Dependencies (confirmed via package.json + actual imports)

`gsap`, `@gsap/react`, `framer-motion`, `swiper`, `isotope-layout`(+types), `mapbox-gl`(+types), `odometer`,
`photoswipe`, `react-photoswipe-gallery`, `react-scroll-parallax`, `react-fast-marquee`, `react-parallax`,
`react-player`, `bootstrap`(+types), `react-bootstrap`, `@headlessui/react`, `sass`.

**Do not copy this dependency list wholesale into aurexo-nextjs.** Aurexo's actual behaviors differ (Google
Maps not Mapbox, no Isotope-style filtering, no Odometer-style flip-digit counters, Fancybox not PhotoSwipe,
simpleParallax not react-parallax) — each is a separate decision recorded in `COMPONENT_MAP.md` /
`migration-quality.md`, made when the relevant section is actually migrated, per the Package Principle.
