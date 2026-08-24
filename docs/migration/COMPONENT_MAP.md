# Component Map — Aurexo → aurexo-nextjs → Luminor Reference

> This is the mandatory lookup before creating ANY component or route. Search order: (1) this file,
> (2) existing code under `aurexo-nextjs/src`, (3) `../luminor-nextjs` for architecture patterns.
> Update this file at the end of every `/migrate-page` and `/migrate-section` run (add rows, correct
> classifications once real markup is diffed, never leave it stale).

Classification legend: `EXACT_REUSE` / `REUSE_WITH_DATA` / `REUSE_WITH_VARIANT` / `EXTEND_WITH_PROPS` /
`CREATE_NEW` / `STRUCTURALLY_DIFFERENT` / `NEEDS_REVIEW`.

## First page migrated: `/listing-grid4-columns` (from `listing-grid4-columns.html`)

Established the site's first real shared chrome. Components/data now available for reuse by every
future page (search here before creating anything):

| Built | Path | Classification | Notes |
|---|---|---|---|
| `Header` | `src/components/header/Header.tsx` | REUSE_WITH_VARIANT | `variant` prop (`style-1`..`style-4`) + `modifierClassName` for extra modifiers (`header-fixed-primary`, `header-absolute`, `header-blur`). **RESOLVED**: sticky-on-scroll behavior now wired via `src/components/header/useHeaderScrollFixed.ts`, colocated in `header/` and shared by all 3 header components (see the "Sticky header behavior" row below for the full writeup). |
| `Nav` | `src/components/header/Nav.tsx` | CREATE_NEW | Desktop mega-menu, data-driven from `src/data/menu.ts`. Dropdown reveal is pure CSS (`:hover`), matching source — no client state. |
| `MobileMenu` + `Offcanvas` | `src/components/header/MobileMenu.tsx`, `src/components/common/Offcanvas.tsx` | CREATE_NEW | **Known simplification**: source nests an accordion per menu column; this flattens to one accordion depth (all links under a top-level section shown at once). No content dropped, only interaction depth reduced. Revisit if a page depends on the nested behavior. |
| `Footer` | `src/components/footer/Footer.tsx` | EXACT_REUSE | Data-driven from `src/data/footer.ts`. |
| `Preloader`, `BackToTop` | `src/components/common/` | CREATE_NEW | Mounted globally in `src/app/layout.tsx`, matching Luminor's pattern of mounting always-on chrome from the root layout. |
| `ModalProvider` / `useModal` | `src/components/common/ModalProvider.tsx` | CREATE_NEW (justified Context) | A small React Context for cross-tree modal open/close state — Header's Sign In button, listing cards' Compare button, and modal-to-modal links (e.g. "Forgot password?") all need to open modals owned by a sibling subtree. Neither reference project's "avoid Context" finding rules this out; Luminor simply never had this cross-tree need. Keep this the *only* Context in the project unless another equally cross-cutting need is proven. |
| `Modal`, `LoginModal`, `ForgotPasswordModal`, `SignUpModal`, `SearchModal`, `CompareTrayModal`, `CardCompareModal` | `src/components/common/` | CREATE_NEW | All 6 modals from the source, mounted once globally via `ModalProvider`. `CardCompareModal` (`#CardModal`) has no trigger on this page (only `listing-details-*.html`'s own Compare button opens it in the source) — mounted anyway, ready for that page's migration. |
| `ListingCard` | `src/components/listing/ListingCard.tsx` | CREATE_NEW | Consumes `ListingCardData` (never a local hand-rolled type — see `LISTING_DATA_MAP.md` §"Card component consumption"). Covers the `card-box-style-1` visual; style-2/8/9 variants should extend this same prop contract when built. |
| `FilterSidebar` | `src/components/listing/FilterSidebar.tsx` | CREATE_NEW, **visual-only** | Full DOM/visual port of the advanced-search form. **Not wired to real filtering** — see Ambiguities below. |
| `ListingGridSection` | `src/components/listing/ListingGridSection.tsx` | CREATE_NEW | Owns sort state (real for price/mileage/year, no-op for fields with no backing data) and filter-sidebar open state. |

## Listing data architecture (built)

`src/data/listings.ts` exists: canonical `Listing` type + `allListings` (12 real, deduplicated records) +
`ListingCardData` (shared card-facing subset type) + `getRelatedListings()`. See
`docs/migration/LISTING_DATA_MAP.md` for the full card→canonical→detail mapping evidence, the identifier
strategy (numeric `id` + `slug`), and every documented source discrepancy/gap. **Any future page/section
touching listings, listing cards, or listing-details must consume this module — do not re-derive a parallel
dataset.** Note: `listing-details-1.html` through `-6.html` are confirmed layout variants of one detail-page
template (no card in the whole site links to `-2` through `-6`), analogous to Luminor's
`property-details-1..4` — treat future migrations of `-2` through `-6` as "new layout, same `allListings`
array," not new data.

## Variant classification rule (governs every row below)

> Classify shared elements by **verified DOM structural difference**, not by how many named CSS "skin"
> variants exist in the source HTML. If two instances share the same DOM skeleton and differ only by CSS
> modifier classes and/or data content, implement **one** component parameterized by a `variant` (or plain
> `className`) prop — do not fork into numbered/named components. Only fork into separate components when
> the actual element tree/composition differs, as verified by directly diffing the raw source HTML — never
> assume divergence from visual impression or variant naming alone.
>
> This is why Aurexo's `Header` becomes ONE component with a `variant` prop (confirmed same DOM across all
> skins) even though Luminor's OWN home variants are separate numbered files (`Header2`, `Header3`, ...) —
> Luminor forks because its home designs are confirmed genuinely different DOM trees. Different evidence,
> different conclusion; the rule, not the precedent, is what transfers.

## Shared elements

| Aurexo element | Target component | Classification | Luminor reference | Rationale |
|---|---|---|---|---|
| Header style-1/3/4 (`-fixed-primary`, `-absolute`, `-blur` modifiers) | `src/components/header/Header.tsx` (`variant` prop) | REUSE_WITH_VARIANT | `luminor-nextjs/src/components/header/Header.tsx` (pattern only) | Confirmed same single-row DOM (`.header-wrapper > header#header_main > .header-inner`, `#main-nav`, `.mobile-button`) across `index.html` and (not yet migrated) style-1/3/4 pages, differing only by modifier classes |
| Header style-2 | `src/components/header/HeaderStyle2.tsx` | CREATE_NEW | — | **Correction of this row's own earlier claim** (made before home-02.html was actually read in full): style-2 is NOT the same DOM with different modifier classes — it's a genuinely different 3-row structure (top bar w/ language dropdown+socials, a logo/search/contact-info/buttons row, then the nav row in its own `bg-primary header-fixed-primary` wrapper), confirmed via full source read of home-02.html lines 24-608. The mega-menu content itself (Home/About/Listing/News/Pages/Contact) is byte-identical to the standard header and is reused via `Nav` (with a new `listClassName` prop for the `.style-2` skin) — only the surrounding chrome differs. See COMPONENT_MAP.md #72. |
| Footer | `src/components/footer/Footer.tsx` | EXACT_REUSE | `footer/Footer1.tsx` (pattern) | `.footer-top > .footer-top-inner > .footer-contact > .footer-bottom > .footer-bottom-links` structurally identical across pages checked; only copy differs, sourced from `data/footer.ts` |
| Mobile menu / offcanvas | `src/components/header/MobileMenu.tsx` + `src/components/common/Offcanvas.tsx` | REUSE_WITH_DATA | `header/MobileMenu.tsx`, `common/Offcanvas.tsx` | State/presentational split transfers regardless of header skin; content from `data/menu.ts` |
| Back-to-top / scroll progress | `src/components/common/BackToTop.tsx` | CREATE_NEW | `common/BackToTop.tsx` (mount pattern only) | Aurexo's SVG circular progress ring has no Luminor equivalent to reuse visually |
| Preloader | `src/components/common/Preloader.tsx` | CREATE_NEW | — | No Luminor equivalent found |
| Generic modal system (Login/ForgotPassword/Search/SignUp/Newsletter/Compare) | `src/components/common/Modal.tsx` | REUSE (pattern) | `@headlessui/react` dependency (Luminor already depends on it) | Replace `data-modal-id` jQuery manager with headless `Dialog`; per-modal open state local, not global Context (matches Luminor's confirmed no-`createContext` finding) |
| Search modal | `src/components/common/SearchModal.tsx` | CREATE_NEW | uses `Modal.tsx` pattern | Consumer of the generic modal system |
| Sticky header behavior | `src/components/header/useHeaderScrollFixed.ts`, a small shared hook (colocated in `header/`, not a generic `src/hooks/`, matching the project's existing `useListingFilters.ts`/`useShopFilters.ts` colocation precedent) | RESOLVED (was NEEDS_REVIEW) | `common/ClientScripts.tsx` (`headerFixed2`, pattern only) | Ports `app.js`'s `headerFixed()` exactly: scroll-position thresholds relative to the header's own `offsetHeight` toggle `is-fixed`/`is-custom`/`is-visible` on the `<header>` element via a `ref`. All 3 classes' CSS was already ported verbatim into `header.scss` from scaffold time but never driven by any JS until now — this hook was the only missing piece. Wired into all 3 header components (`Header.tsx`, `HeaderStyle2.tsx`, `HeaderStyle4.tsx`) via a `headerRef`. **Confirmed source bug, preserved verbatim**: on home-04.html's own `header-sticky` reuse (`.header-wrapper` unconditionally `position: fixed`), the header still visually vanishes for the ~400px scroll range where `is-fixed` is set without `is-visible` (`translateY(-200px)` on the inner `<header>` overrides the wrapper's own fixed positioning) — verified this exact glitch already exists by serving the raw, unmodified `../aurexo/home-04.html` locally and reproducing it with Playwright, so it's not a porting regression; per html-fidelity, reproduced rather than fixed. **Validation**: `npx tsc --noEmit` + `npm run lint` clean; Playwright-verified scroll behavior on `/` (style-1), `/home-09` (`header-absolute`, correctly hides then reappears), `/home-02`/`/home-03` (`HeaderStyle2`, `is-custom` cleanly collapses the top bar before sliding in), `/home-05`/`/home-06` (`HeaderStyle4`, same clean collapse) — zero console errors, no duplicate headers, no layout-shift bugs anywhere. |
| Scroll-reveal (WOW.js replacement) | `src/hooks/useScrollReveal.ts` (or colocated per section) | CREATE_NEW | `common/ClientScripts.tsx` (`useGSAP` pattern, for the "trigger on scroll" shape only) | No GSAP install planned by default — see Ambiguity #2 |
| Count-up (jQuery `countTo` replacement) | `src/hooks/useCountUp.ts` | CREATE_NEW | `common/Odometer.tsx` (`IntersectionObserver` + `hasAnimatedRef` guard pattern) | Reuse the trigger-once-on-scroll pattern without the flip-digit Odometer visual (Aurexo doesn't have that look) |
| Tabs (`.flat-tabs`) | `src/components/common/Tabs.tsx` | CREATE_NEW | none (Luminor has an SCSS partial for tabs but no dedicated React component found) | Net-new, small `useState`-driven tab component |
| Accordion (`.flat-toggle`) | `src/components/common/Accordion.tsx` | CREATE_NEW | `common/FAQs1.tsx` uses raw Bootstrap markup instead of a real component — not reusable as-is | Build a real controlled React accordion since Aurexo doesn't use Bootstrap JS at all |
| Global: ThemeSwitcher (`.switcher-container` "Setting" panel, `switcher.js`) | `src/components/common/ThemeSwitcher.tsx` | CREATE_NEW (global, mounted in `layout.tsx`) | — | No Luminor equivalent. Reused-as-is source SCSS: `themes.scss` already compiled into `app.scss` (via `component/index.scss`), so the `.is_dark { ... }` color/background/border overrides needed zero porting — the component only toggles `is_dark`/`is_light` on `<html>`/`<body>` and lets existing CSS do the rest. Panel slide (source: jQuery `.animate({right})`) reimplemented as a CSS transition + `.active` class (new rule added to `themes.scss`). Theme choice persisted via a `themeMode` cookie (365 days), matching source. Icon/logo `<img>` `src` swapping (e.g. `icon-gauge.svg` → `icon-gauge-2.svg`, `logo.png` → `logo-white.png`) ported as the same DOM-querying string-replace the source uses, all target variant files confirmed present under `public/assets/icons`/`public/assets/images`; a `MutationObserver` (not present in source — a deviation needed specifically because React re-renders, unlike static HTML, can revert an already-swapped `src`) re-applies the mapping whenever React re-renders an icon/logo image after a theme toggle. Playwright-verified on `/` and `/listing-grid4-columns`: panel open/close, dark/light toggle (`is_dark`/`is_light` classes, full page re-skins correctly), logo + 5 icon variants swap correctly, cookie persists across a full reload, zero console errors. |

## Page families

| Aurexo family | Target route(s) | Classification | Luminor reference | Rationale |
|---|---|---|---|---|
| Home variants (12: `index`, `home-02..home-11`) | `src/app/page.tsx`, `src/app/(homes)/home-02.../page.tsx` | REUSE_WITH_VARIANT (chrome: Header/Footer/section components) + CREATE_NEW per-page section sequence | `(homes)/home02../page.tsx` composition style (import section components directly into `page.tsx`, no barrel) | Confirmed one design system; each page still stacks its own verified section order — don't force a shared "HomeTemplate" abstraction until 2+ homes are actually migrated and proven identical in composition |
| Listing/browse (10) | `src/app/(listings)/<slug>/page.tsx` | REUSE_WITH_VARIANT | `(properties)/listing-*` pages | Same card data confirmed, different grid/filter chrome per page |
| Listing details (6) | `src/app/(listing-details)/listing-details-N/[id]/page.tsx` | REUSE_WITH_VARIANT (shared sections) / STRUCTURALLY_DIFFERENT (gallery — verify per pair before reusing) | `(properties-details)/property-details-N/[id]/page.tsx` (`params: Promise<{id}>`, `.find()`, `generateStaticParams()`) | Dynamic-route plumbing transfers directly; gallery layout genuinely differs per the source report — diff HTML before reusing one `Gallery` component across all 6 |
| Blog (3 grid styles + list + standard + 2 details) | `src/app/(blogs)/<slug>/page.tsx` | REUSE_WITH_VARIANT (grids) / NEEDS_REVIEW (details variants — diff before reuse) | `(blogs)/blog-*` pages | Closest 1:1 family match to Luminor in the whole site |
| Add-listings (2 layouts) | `src/app/(add-listings)/add-listings[-2]/page.tsx` | REUSE_WITH_VARIANT (layout) + CREATE_NEW (multi-step form state) | `src/actions/*.ts` Server Action shape only | Confirmed same multi-step form; Luminor has no wizard UI precedent, only the `"use server"` + `FormData` + validate submission plumbing is reusable |
| Dealers/Agents (4) | `src/app/(dealers)/<slug>/page.tsx` | REUSE_WITH_DATA | property-details `[id]` lookup pattern | Structurally analogous list+detail-by-id shape |
| Shop (5) | `src/app/(shop)/<slug>/page.tsx` | STRUCTURALLY_DIFFERENT | `[id]` pattern only (weak analog) | Confirmed separate mini-system from car listings; shares outer chrome + modal system only |
| Dashboard/account (7) | `src/app/(dashboard)/layout.tsx` (nested) + pages | CREATE_NEW (shell — **deliberate, documented divergence** from Luminor's single-root-layout convention) / REUSE_WITH_DATA (page content) | none — first legitimate nested-layout case in the project | Confirmed persistent `.dashboard-container` + sidebar shared across all 7 pages is a genuine Next.js nested-layout use case; Luminor has no analogous persistent-shell family to follow, so this is Aurexo's real behavior driving a structural choice Luminor doesn't demonstrate |
| Utility (calculator, financing, sell-your-car) | `src/app/(other-pages)/<slug>/page.tsx` | CREATE_NEW | otherpage wrapper scaffolding only | No Luminor precedent for the interactive tool logic itself |
| Marketing/info (about-us, contact-us, faqs, terms, services-center, clients-reviews) | `src/app/(other-pages)/<slug>/page.tsx` | REUSE_WITH_DATA / EXACT_REUSE of page wrapper | `(orther-page)/{about-us,contacts,FAQs,privacy-policy}` (note: Luminor's folder name has a typo — do not copy it, aurexo-nextjs uses `(other-pages)` spelled correctly) | Cleanest, closest direct precedent in the whole reference project — **recommended first migration target**, see `MIGRATION_STATUS.md` |
| System (404, coming-soon) | `src/app/not-found.tsx`, `src/app/(other-pages)/coming-soon/page.tsx` | EXACT_REUSE (Next.js convention) | standard App Router convention | Use Next.js's built-in `not-found.tsx` instead of a manual 404 route |

## Data files to create (when the consuming page/section is actually migrated — not created speculatively)

| File | Shape | Consumed by |
|---|---|---|
| `src/data/listings.ts` | **Built.** Actual shape differs from the original sketch below it — see `docs/migration/LISTING_DATA_MAP.md` for the real `Listing`/`ListingCardData` types and the 12-record dataset. | `ListingCard`, `ListingGridSection`, `/listing-grid4-columns` |
| `src/data/menu.ts` | **Built.** `HomeMenuItem`, `ListingMenuColumn`, `PagesMenuColumn`, `SimpleLink` + the actual mega-menu content transcribed from the source header. | `Nav.tsx`, `MobileMenu.tsx` |
| `src/data/footer.ts` | **Built.** `FooterColumn`, `FooterLink`, `SocialLink` + the actual footer copy. | `Footer.tsx` |
| `src/data/blog.ts` | `type BlogPost = { id, slug, title, excerpt, content, image, author, date, category, tags:string[] }` + `export const posts: BlogPost[]` | Blog family, home "News & Reviews" |
| `src/data/dealers.ts` | `type Dealer = { id, slug, name, logo, location, phone, email, listingsCount, rating, bio }` + `export const dealers: Dealer[]` | Dealers/Agents family |
| `src/data/shop-products.ts` | Transcribed from `../aurexo/fake_data/product.json` into `type Product = {...}` + `export const products: Product[]` | Shop family |
| `src/data/optionfilter.ts` | Filter option lists (body type, fuel type, transmission, price/year ranges) | Listing + shop filters |

`src/types/` stays reserved for ambient `.d.ts` declarations only, matching Luminor's convention — domain
types above are colocated at the top of their owning data file.

## Ambiguities — recorded, not silently decided

These require an explicit decision at the point the relevant section is migrated (or a one-time upfront
decision where noted). Do not resolve silently; surface the choice when the relevant `/migrate-page` or
`/migrate-section` run reaches it.

1. **Maps vendor**: Mapbox (Luminor's proven pattern) vs. Google Maps + InfoBox + MarkerClusterer (Aurexo's
   actual current behavior). Different vendor, different API key/billing — a product decision, not purely technical.
2. **Scroll-reveal mechanism**: default plan is a custom `IntersectionObserver`-based `useScrollReveal` hook
   (no GSAP install) reusing the ported `animate.min.scss` keyframes — confirm before it's baked into every page.
3. **Lightbox**: Fancybox (Aurexo, note licensing terms for v5+) vs. `react-photoswipe-gallery`/PhotoSwipe
   (Luminor's proven MIT-licensed pattern).
4. **Range slider** (price/year filter, currently jQuery-UI slider via `gear-slider.js`) — zero Luminor
   precedent, fully net-new decision when listing/filter sidebar is migrated.
5. **Two non-reconciled breakpoint systems** in Aurexo (`reponsive.scss` real max-width breakpoints vs.
   `component/grid.scss` Bootstrap-style min-width breakpoints for `.row`/`.col-*` only) — reconcile into one
   scale, or preserve both independently as in the original?
6. **Suspected dead code**: unused Font Awesome CSS reference in `reset.scss` (no stylesheet actually
   linked in any HTML `<head>`), the stray `.txt` file in `assets/icons`, and the duplicate/competing
   `.container` class definitions in `reset.scss` vs. `component/grid.scss` — confirm genuinely dead/redundant
   before removing anything.
7. **SCSS variable renaming**: `$color-primary` (near-black) vs. `$color-main`/`$color-hover` (actual green
   accent) is confusing legacy naming. Preserve exact hex values; renaming the identifiers themselves (e.g.
   to `--ink`/`--accent`) is a single deliberate decision to make once, not ad hoc per-partial.
8. **RESOLVED — font strategy, and it was an actual bug, not just a style choice**: user-reported "header
   font doesn't match the HTML" led to a real-browser check (`document.fonts` + computed styles) that found
   Manrope/Albert Sans were **never loading at all** — the whole site was silently rendering in the
   browser's fallback sans-serif. Root cause: `layout.tsx` imports `swiper/css` before `app.scss`, so in the
   final bundled stylesheet the source's `@import url(fonts.googleapis.com...)` (in `reset.scss`) landed
   after other real CSS rules — invalid per the CSS spec (`@import` must be the first rule(s) in a
   stylesheet), so browsers silently drop it. Fixed by switching to `next/font/google` in `layout.tsx`
   (self-hosted `Manrope`/`Albert_Sans`, same weight/style ranges as the source's Google Fonts URL,
   exposed as CSS variables `--font-manrope`/`--font-albert-sans` applied via `className` on `<html>`),
   with `variables.scss`'s `$font-main-1`/`$font-main-2` repointed at those variables so every existing
   `font-family: $font-main-*` declaration picks it up with no other file changed. Verified post-fix:
   `document.fonts` reports Manrope actually `loaded` (was entirely absent before), computed
   `font-family` on body/header/nav resolves to it, and a visual screenshot confirms the header now
   reads in Manrope's distinct letterforms instead of a generic system font.
9. **Residual vanilla-JS islands**: whether to keep `maps.js`/`gear-slider.js` temporarily during incremental
   migration vs. commit to zero-jQuery from the section that needs them.
9a. **RESOLVED — `switcher.js` implemented, not dropped**: previously flagged here as "almost certainly
    droppable"; implemented per explicit request as `src/components/common/ThemeSwitcher.tsx`, mounted
    globally in `layout.tsx` (matching the source's own `$(document).ready` → `$("body").append(...)` on
    every one of the 63 source pages). See the "Global: ThemeSwitcher" entry under Shared elements below
    for the full behavior breakdown.
10. **RESOLVED — `@headlessui/react` removed**: installed at scaffold time for the modal system, but the
    `/listing-grid4-columns` migration built the 6 real modals with a small custom `ModalProvider` Context +
    plain conditional classNames instead (`src/components/common/Modal.tsx`) — this maps onto the already-
    ported `.modal`/`.bg-modal`/`.modal-content` SCSS directly, with no adaptation layer needed. headlessui
    ended up unused, so it was removed from `package.json` per the Package Principle (no unused
    dependencies). Re-evaluate only if a future accordion/tabs/dropdown genuinely needs real a11y primitives
    beyond what a hand-rolled component provides.
11. **Remaining `next audit` findings**: `next@15.5.23` (bumped from Luminor's pinned `15.3.5` at scaffold
    time to close 2 critical + 2 high CVEs — see `nextjs-architecture.md` "Framework baseline") still
    carries transitive high-severity `postcss`/`sharp` advisories that only resolve on Next 16 (a breaking
    major-version jump). Left on 15.5.23 for now since exposure is limited to on-demand image optimization
    of local `public/` images with no remote patterns configured — revisit if the project's threat model changes.
12. **RESOLVED — price range slider**: real browser verification (Playwright/Chromium against the dev
    server) caught that the original two-overlapping-`<input type="range">` implementation didn't visually
    read as a slider at all. Replaced with `RangeSlider.tsx`, a hand-rolled dual-handle component (pointer
    drag, no dependency) that reproduces the exact DOM/class shape the source's own CSS targets
    (`#slider-range > .ui-slider-range` + `.ui-slider-handle`, from the jQuery-UI widget
    `gear-slider.js` instantiates) — visually matches now (green connecting bar, circular bordered
    handles). Also recalibrated min/max from the source's literal `data-min="120" data-max="750"`
    ($120k–$750k, copied from a pricier demo dataset) to the real extracted range ($15,500–$45,500), since
    the literal source values bound zero of the 12 real listings — see `LISTING_DATA_MAP.md`.
13. **RESOLVED — `FilterSidebar` real filtering wired for Brand / Model / Fuel Type / Transmission / Price**:
    a full real-browser re-verification (prompted by user report of "many issues") found `assets/js/filterCar.js`
    in the source actually implements working client-side filtering by extracting text straight off each
    `.card-box` (brand from `.category`, model from the title link, fuel/transmission from tag icons, price
    parsed from `.card-box__price`) and doing a case-insensitive bidirectional-substring match — no hidden
    data fields required. `ListingGridSection.tsx`/`FilterSidebar.tsx` now reproduce that exact algorithm
    against the typed `Listing` fields (`brandLabel`/`title`/`spec.fuel`/`spec.transmission`/`price`)
    instead of re-scraping DOM text, and the "X matches" / "Showing 1 – X of Y" counters are now live.
    This faithfully inherits the source's own vocabulary mismatches rather than fixing them — e.g. checking
    "Electrical" or "Petrol" (Fuel Type) yields zero results because the real data says "EV"/"Benzin", and
    most of "Mercedes"/"Honda"/"Toyota"/"Volvo" (Brand) yield zero because none of the 12 real listings are
    those brands — same behavior a user would see on the real Aurexo demo with this same card set.
    Still OPEN and intentionally left decorative: Body Style, Door count, Cylinders, exterior/interior Color,
    and Features — verified that **zero** `.card-box` elements anywhere in the source carry the
    `data-body-style`/`data-color` attributes `filterCar.js` reads, so these are non-functional in the
    source too, not a gap unique to this port. The `#filterTags`/`#btnClearAll` ("active filter chips" +
    "Remove All") row from the source was deferred here as additive UI — since implemented, per
    explicit user request, see ambiguity #19.
14. **RESOLVED — listing-tabs column-count switcher (2/3/4 columns) implemented**: the source's
    `.listing-tabs .item-menu` icons (only visible ≥1400px viewport width — `.xl2-hidden` on the wrapper,
    reproduced as-is) switch between 3 `.content-inner` panes in the source, each hard-coded with a
    *different* placeholder card count (6/9/12) — unrelated demo padding, not 3 real datasets. Implemented
    as one pane whose grid CSS class swaps between the 3 column layouts, always backed by the same
    `allListings` (no duplicated/invented per-layout data). Default view is 4 columns, matching the page's
    own name and the source's default-active pane.
15. **RESOLVED — sort `core-dropdown` fidelity fixes**: real-browser verification found the sort dropdown
    was missing its chevron icon (`core-dropdown__icon`, present in source markup, absent from the migrated
    JSX) and had no outside-click-to-close handler, and toggled "active" on the menu element directly rather
    than the `.core-dropdown` wrapper the source's CSS actually keys off
    (`.core-dropdown.active .core-dropdown__menu`). All three fixed in `ListingGridSection.tsx`.
16. **RESOLVED — real pagination, 8 cards/page (explicit user request)**: the source's `.pagination`
    (../aurexo/listing-grid4-columns.html) is static markup with no page-switching logic anywhere in the
    theme — `filterCar.js` only shows/hides the whole pagination block based on whether any cards are
    visible, it never actually pages. Real client-side pagination (`PAGE_SIZE = 8` in
    `ListingGridSection.tsx`) was net-new work, not a ported behavior: page-number links + the source's
    "next" chevron are generated dynamically from `Math.ceil(filteredCount / 8)`, the next arrow visually
    and functionally disables on the last page (`pointer-events: none`, no source precedent for this state
    since the demo never needed one), and changing any filter/sort resets to page 1. "Showing X – Y of Z
    Listings" is now a real, live range (was static placeholder text in source, never wired to anything).
17. **RESOLVED — "Home" mega-menu thumbnail images undersized**: user-reported "check the Home submenu
    against the HTML" led to inspecting the real thumbnail JPEGs (`assets/images/home/home-1..10.jpg`,
    all 960×1128 intrinsic) against `Nav.tsx`'s `<Image>` usage, which had unrelated placeholder
    dimensions (`width={112} height={72}`, landscape — wrong aspect entirely). The source's own `<img>`
    has no width/height attributes at all; it relies purely on the global `img { max-width: 100%; height:
    auto }` rule (`reset.scss`) to fill 100% of its `.menu-item` card at any viewport. Our fixed 112px
    width never grew to fill wider cards, leaving a visible empty gap next to every thumbnail (confirmed
    via screenshot before/after). Fixed by passing the real intrinsic dimensions (`960×1128`) instead —
    next/image requires explicit numeric width/height (no source `<img>` to omit them like the original),
    but passing the true size lets the same global CSS rule scale it down correctly for any card width,
    reproducing the source's fill-the-container behavior exactly. The grid layout itself (`.sub-menu--main
    > ul { display: grid; grid-template-columns: repeat(5, 1fr) }`, bordered/padded card style) was
    already correct — `menu.scss` was ported verbatim and applies via the same class names, so this was
    purely the image-sizing bug, not a missing/wrong layout.
18. **RESOLVED — `FilterSidebar` dropdowns overlapping each other (real UI bug, not cosmetic)**:
    user-reported screenshot showed the "Select Model" dropdown's checkbox list visually interleaved
    with "Body Style"/"Fuel Type" text below it. Root cause: the earlier port's doc comment claimed
    the source's dropdown open/close was "pure CSS, no JS involved" — actually **wrong**, confirmed by
    re-reading `assets/js/app.js`'s `selectDropdown()`/`colorDropdown()` in full. The source does run
    JS on top of the checkbox-hack: opening one `.filter-select-dropdown` force-closes every other one
    (unchecks their toggle, removes `.active`) and closes on outside click. That `.active` class isn't
    cosmetic — `filter-sidebar.scss` only bumps `z-index` to 11 while `.active` (baseline 10 for every
    dropdown); without it, an open dropdown and a later DOM sibling sit at equal z-index, and the later
    one paints over the earlier one's menu. Fixed in `FilterSidebar.tsx`: a single `openDropdown` state
    (shared across all `CheckboxDropdown`/`ColorDropdown` instances, matching the source's
    single-open-at-a-time behavior exactly) drives both the `.active` class and the toggle checkbox's
    `checked` state, plus an outside-click handler that clears it — reproducing `app.js` exactly.
    Verified via Playwright: z-index reads 11 while open, opening a second dropdown auto-closes the
    first (toggle unchecks, `.active` removed), outside click closes all; screenshots confirm the
    previous full-field interleaving is gone. (The source's dynamic "N selected" button-text update and
    "All" checkbox mutual-exclusivity, also in `selectDropdown()`, were NOT part of the reported bug and
    are left as a separate, disclosed follow-up rather than expanding this fix's scope.)
19. **RESOLVED — filter tag chips (`#filterTags`/"Remove All") implemented (explicit user request)**:
    previously deferred in ambiguity #13 as "additive UI, not a fix to broken behavior" — the user
    then explicitly asked for it, matching a reference screenshot ("Sedan ×", "SUV ×", "REMOVE ALL ×").
    Read `assets/js/filterCar.js` (`createFilterTag`/`addFilter`/`removeFilter`/`clearAllFilters`) in
    full to get the real behavior right: every checked/selected value across ALL categories gets a
    removable pill (`.select-item`), including the four decorative categories (Body Style, Door count,
    Cylinders, Colors, Features) that don't narrow results — the source's tag row reflects "what's
    currently selected," not "what's filtering," so those tags render too (consistent with #13's
    documented non-function, not a new gap). `FilterState` (`FilterSidebar.tsx`) extended with
    `bodyStyle`/`doorCount`/`cylinders`/`exteriorColor`/`interiorColor`/`features` purely so they can
    drive a tag, wired the same controlled `selected`/`onToggle` pattern already used for
    brand/model/fuel/transmission; `ColorDropdown` also made controlled (was `defaultChecked`-only)
    and now auto-closes on pick, matching the source's `colorDropdown()`. Clicking a tag removes just
    that selection (and unchecks the matching sidebar input); "Remove All" resets every field
    (`clearAllFilters` in `ListingGridSection.tsx`). Deliberately NOT reproduced: the source always
    injects two extra default tags ("No accidents", "Great Price") with no backing `Listing` field —
    inventing one would violate the no-data-invention rule, so our tag list only ever contains
    selections the user actually made, and unlike the source (which hides the *entire* matches-count
    row until a filter exists, since those 2 defaults keep it always-non-empty) our "X matches" text
    always shows, with only the divider/tags/Remove-All portion conditional on having ≥1 real tag —
    a disclosed, deliberate deviation, not an oversight. Verified via Playwright: tags appear/match
    selections exactly, per-tag removal syncs the checkbox back, mixed real+decorative tags coexist
    correctly (e.g. "Audi" + "SUV"), color pick auto-closes its dropdown and tags as "Exterior Red",
    "Remove All" clears every field and unchecks every input, zero console errors throughout.
20. **RESOLVED — "Listing" mega-menu marked two entries as current instead of one**: user-reported
    screenshot showed both "Grid Style 4 Columns" (Listing Layout column) and "Listing Grid" (Listing
    Style column) highlighted green simultaneously. Root cause: `Nav.tsx` computed `current-item`
    generically (`activePath === link.href`) across every column in `listingMenuColumns`, but two
    different columns legitimately point at the same URL (`/listing-grid4-columns`) under different
    labels. The source's own static HTML only ever hardcodes `current-item` on the one entry in the
    "Listing Layout" column — the "Listing Style" column's identical-href link never gets it, even on
    the source's own `listing-grid4-columns.html`. Fixed by scoping the check to
    `column.title === "Listing Layout"`. Verified via Playwright: exactly one `.current-item` renders
    ("Grid Style 4 Columns"), screenshot confirms "Listing Grid" is plain text again.
21. **First listing-details migration — `/listing-details/[slug]` (`listing-details-1.html`)**: built as
    one dynamic route (`generateStaticParams` over all 12 `allListings`) rather than a route per layout
    variant — per LISTING_DATA_MAP.md, `listing-details-1..6.html` are layout variants of one template
    sharing one dataset, so `listing-details-2..6.html` should become alternate layouts on this same
    route/data later, not new routes. New components: `DetailsGallery` (swiper, matches
    `.swiper-listing-details` config exactly — slidesPerView 1→2, loop, custom prev/next), `FeatureTabs`
    (6-category client tab switcher), `StarRatingInput` (client, mirrors `app.js`'s star-click handler),
    `ListingDetailsContent`/`ListingDetailsSidebar` (the two-column body), `RelatedListings` (swiper
    carousel reusing the existing `ListingCard`), `CompareButton`/`LoginToReviewButton` (tiny client
    leaves wrapping `useModal()`, keeping the surrounding content Server Components).
    - **RESOLVED — `#CardModal` wired for the first time**: `CardCompareModal.tsx` was built earlier
      (scaffolded ahead of need) but had no real trigger until now; `CompareButton` opens it, verified
      via Playwright.
    - **SUPERSEDED — section-hiding for the 11 listings without detail data**: initially each section in
      `ListingDetailsContent` rendered only when its backing `Listing` field existed, so those 11 routes
      showed a visibly thinner page (4-field overview only, no Description/Features/Financing/Location/
      Reviews/Dealer). User feedback ("recheck against the HTML, the layout looks completely different
      from a migration") plus the same Luminor precedent found for the gallery fix (`Slide1.tsx` takes no
      per-property props — see below) made clear this was the wrong call: Luminor's `Description()`,
      `Overview()`, and `Comment()` *also* take zero per-property props, i.e. only title/price/spec-like
      fields vary per record there; every richer section is shared/generic across every property. Fixed
      via `withDetailFallback()` (`src/data/listings.ts`): every listing now gets the *same full section
      layout*, with only genuinely real per-listing fields left as-is (image, title, price, and
      `overview`'s 4 fields that double as `spec` — mileage/year/fuel/transmission) and every other
      optional field (the other 6 `overview` fields, description, features, location, ratingSummary,
      reviews, dealer) falling back to `allListings[0]`'s real analyzed content when absent.
      `ListingDetailsContent`/`ListingDetailsSidebar` were simplified accordingly — no more conditional
      section rendering, since the caller (`page.tsx`) now guarantees every field via the
      `ListingWithDetail` return type. Verified via Playwright: the Hyundai listing (previously the
      thinnest page) now renders all 10 overview rows, Description, Feature tabs, Financing Calculator,
      Location/Map, and Reviews — identical section set to the Audi page, real per-listing mileage/year/
      fuel/transmission and price preserved throughout.
    - **RESOLVED (superseded) — gallery fallback revised to follow Luminor's own precedent**: initially
      the 11 sparse listings fell back to a single synthesized slide, which also broke Swiper's `loop`
      option ("number of slides is not enough for loop mode" warning) and collapsed the layout to one
      image instead of the source's 4-slide carousel. Per explicit user request ("keep the HTML layout,
      just swap the first thumb"), checked how Luminor itself handles this: `Slide1.tsx` (its
      property-details gallery) takes **no per-property props at all** — every property, regardless of
      id, renders the same 6 hardcoded generic images. Applied the same idea here, one step more
      data-honest: `page.tsx`'s gallery fallback is now always 4 slides — slide 1 is the listing's own
      real card image (`listing.image`, a genuine photo of that exact car), slides 2-4 reuse the same
      generic showcase stills id 1's own analyzed gallery uses (`GENERIC_GALLERY_FILLER`), matching
      Luminor's "reuse generic filler for what isn't data-driven" pattern without ever claiming a stock
      photo is a real shot of that specific car beyond slide 1. `DetailsGallery`'s single-image branch is
      kept only as a defensive fallback (no current caller triggers it). Verified via Playwright: 4
      slides render for a sparse listing, slide 1 resolves to the correct per-listing image
      (`card-2.jpg` for the Hyundai), slide 2 resolves to the shared generic still, and the Swiper loop
      warning is gone.
22. **`listing-grid3-columns.html` migrated — confirms the grid2/3/4 "same page, different default"
    theory**: diffed byte-for-byte against `listing-grid4-columns.html`; the only real differences are
    which `.item-menu`/`.content-inner` is `active` by default and the `<h2>` text. `ListingGridSection`
    gained an `initialColumns` prop (was a hardcoded `useState(4)`) so `/listing-grid3-columns` is a ~45
    line page passing `initialColumns={3}` to the exact same shared component — no new components,
    confirming `listing-grid2-columns.html` will be equally trivial (`initialColumns={2}`) when migrated.
    **Confirmed**: `listing-grid2-columns.html` migrated next, same diff pattern, `initialColumns={2}`,
    zero new components — verified via Playwright with grid3/grid4 regression checks alongside it.
23. **`listing-gridstyle-halfmap.html` migrated — real map dependency decision, asked the user**:
    this page is genuinely different from grid2/3/4 (no breadcrumb/heading, no Footer, split
    grid+map layout, a new "List view" card style). Two real decisions came up:
    - **Map**: `assets/js/maps.js` is a full Google Maps JavaScript API integration — custom
      price-bubble markers, click-to-open info boxes, marker clustering, card↔marker hover sync. The
      source HTML has the theme author's own demo API key hardcoded (`AIzaSyCFC3...`); reusing it
      long-term isn't appropriate (not our key, could be revoked anytime, unclear billing/ToS status
      for a redistributed project). Asked the user directly rather than deciding unilaterally, given
      the real cost/ToS implications — chose a **static Google Maps embed iframe** (same technique as
      the listing-details location map: no API key, no billing) over reimplementing with Leaflet/OSM
      or wiring a real Google Maps JS API key. Trade-off, disclosed: a real map renders, but without
      per-listing markers/clustering/info-boxes — a placeholder for a future upgrade if the user later
      wants the full interactive version (with their own API key, or a Leaflet rebuild).
    - **New card style**: `.card-box-style-9` ("List view") has a genuinely different DOM shape than
      `.card-box-style-1` (`.top`/`.bottom`/`.image`/`.content` are siblings, not nested) — per the
      variant classification rule this became a new `HalfMapListingCard` component, not a `ListingCard`
      prop. Its short description blurb is the exact same placeholder text on every card instance in
      source (verified via grep) — reused as shared generic content, matching the same pattern as
      listing-details' Description/Features/Reviews (see ambiguity #21).
    - **Refactor**: extracted `useListingFilters` (hook) plus `SortDropdown`/`FilterTagsRow`/
      `ListingPagination` (components) out of `ListingGridSection` before building this page, since
      it's the second page needing the exact same ~150 lines of filter/sort/pagination state — avoids
      duplicating stateful logic that's easy to get subtly wrong twice. `ListingGridSection` itself now
      composes the same shared pieces; verified via Playwright that grid2/3/4-columns still behave
      identically post-refactor (sort, filter+tags, pagination) before moving on.
    **Confirmed**: `listing-liststyle-halfmap.html` migrated next, same diff pattern as grid2/3/4 —
    byte-for-byte the same page as gridstyle-halfmap except which view is `active` by default.
    `HalfMapListingSection` gained an `initialView` prop, this page passes `initialView="list"`, zero
    new components — verified via Playwright with a gridstyle-halfmap regression check alongside it.
24. **`listing-liststyle-sidebar.html` migrated — permanent sidebar, refactored `FilterSidebar` in two**:
    genuinely different from every listing page so far — a *permanent* inline filter column (300px,
    `.listing-sidebar-right` flex layout; the popup-only "Filters" button is `hidden md-block`, i.e.
    mobile-only here) instead of the slide-out popup, a 3-way List/Grid2/Grid3 view toggle with its
    own narrower grid breakpoints (content shares horizontal space with the sidebar — confirmed via
    direct read: `grid-cols-3 xl-grid-cols-2 lg-grid-cols-1`, not the full-width pages'
    `lg-grid-cols-2 sm-grid-cols-1`), and its List view reuses `HalfMapListingCard` (#23) rather than
    a third card component.
    - **Refactor**: extracted `FilterFields` (the actual Brand/Model/Price/.../Features fields) out of
      `FilterSidebar`, which is now just the slide-out popup shell wrapping `FilterFields`. Both the
      permanent sidebar here and the popup (still present, mobile-only) render the exact same fields
      component against the same `FilterState`/`useListingFilters` — no behavior duplicated or forked.
      Verified via Playwright that the popup still filters/tags correctly on grid4-columns post-split.
    - **OPEN — 3 decorative filter fields not reproduced**: this page's sidebar has "Drive Type",
      "Select miles", and a Min/Max Year dropdown pair not present in `FilterFields`. None have a
      corresponding `Listing` field (no drive-type/mileage-band/year-band data was ever modeled) and
      would be exactly as decorative as Body Style/Door count/Cylinders already are — transcribing 3
      more inert option lists for one page wasn't judged worth it. Revisit if a future page needs them
      for real (e.g. once mileage-band data exists) or if the user asks for full field parity here.
25. **OPEN — mobile nav accordion depth**: `MobileMenu.tsx` flattens the source's nested per-column accordion
    (open one section, then open a sub-column within it) into a single accordion depth (open one top-level
    section, see all its links at once). No links were dropped, only one layer of progressive disclosure —
    revisit if a page's content volume makes the flat list unwieldy on mobile.
26. **`listing-sidebar-left.html` migrated — confirms the sidebar-family "same page, different default"
    pattern, plus one real bug fix**: diffing against `listing-liststyle-sidebar.html` (DOM structure,
    filter fields, and the 12-listing dataset are identical) shows this is the same page family as the
    grid2/3/4-columns and gridstyle/liststyle-halfmap pairs — only the default view and one grid breakpoint
    differ. `ListingSidebarSection` gained an `initialView` prop (was hardcoded `useState("grid3")`) and a
    `gridClass` prop (was a hardcoded `GRID_CLASS` constant) so `listing-sidebar-left` can pass
    `initialView="grid2"` plus its own Grid3 breakpoint pair (`lg-grid-cols-2 sm-grid-cols-1`, vs.
    `xl-grid-cols-2 lg-grid-cols-1` on the liststyle-sidebar page) without a new component. **Bug found and
    fixed in the process**: re-checking the source while building this page revealed
    `listing-liststyle-sidebar.html`'s own shipped default view was wrong — it had been defaulting to Grid3,
    but the source's actual default `active` tab is List (confirmed via both the view-icon's `active` class
    and which `content-inner` block carries `active`). Fixed by passing the now-explicit `initialView="list"`
    to that page too; re-verified via Playwright post-fix (see MIGRATION_STATUS.md row 32). Source itself has
    a copy-paste bug unique to `listing-sidebar-left.html` (Body Style dropdown's `data-name`/input `name` is
    `BodyStyleSelectToggle` instead of `model`; Interior Color radios reuse `name="exteriorColor"`) — inert to
    us since our filtering runs on component state, not these raw HTML attribute names; not reproduced.
27. **`listing-sidebar-right.html` migrated — mirror of listing-sidebar-left.html, DOM order controls
    left/right, not CSS**: same permanent-sidebar page family, same filter fields, same 12 listings as
    `listing-sidebar-left.html`. The only structural difference: source places the `listing-sidebar-right__filter`
    div *after* `listing-sidebar-right__content` in the DOM (left variant places it before). Checked
    `assets/scss/inner-page.scss` — `.listing-sidebar-right` is `display: flex; justify-content: space-between`
    with no `order` property anywhere, so this is a pure DOM-order swap, not a CSS override — confirms the
    class name `listing-sidebar-right` is reused verbatim by source for both the left and right variants; it
    names the shared width/flex rules, not a position. Added a `sidebarPosition` ("left" default \| "right")
    prop to `ListingSidebarSection` that conditionally renders the filter panel and content panel in the
    matching order. Also extracted the Grid3 breakpoint pair shared by sidebar-left/right
    (`lg-grid-cols-2 sm-grid-cols-1`) into an exported `SIDEBAR_LR_GRID_CLASS` constant on
    `ListingSidebarSection.tsx`, replacing the near-duplicate object literal that had been declared locally
    in `listing-sidebar-left/page.tsx`. Default view is Grid3 here vs. Grid2 on sidebar-left (confirmed via
    source's active-state markers). One more one-off source inconsistency, replicated for fidelity: this
    page's `tf-spacing-style3` spacer div lacks the `md-hidden` class that sidebar-left/liststyle-sidebar have
    on the equivalent div — inert either way (empty spacer), not investigated further.
28. **`listing-topmap.html` migrated — new horizontal "hero" search bar shell, shared dropdowns
    extracted, real filter state lifted above bar+grid**: unlike every prior listing page, source
    replaces the sidebar entirely with a full-width map + a horizontal `.search-cars__filters` bar
    and a collapsible `.search-cars__advanced` panel (Brand/Model/Miles/Max Price in the bar; Fuel
    Type/Transmission/Drive Type/Color/Cylinders/Year-range/Features under Advanced) — a genuinely
    new DOM shape, not a variant of `FilterFields`/`FilterSidebar`. Built `TopSearchFilterBar.tsx`
    (the bar + panel) and `TopMapListingSection.tsx` (owns one `useListingFilters` instance shared
    by both the bar and the 2/3/4-column grid below it — they can't each own an independent hook and
    stay in sync). Extracted `CheckboxDropdown`/`ColorDropdown` out of `FilterFields.tsx` into their
    own files (`CheckboxDropdown.tsx`/`ColorDropdown.tsx`) so the new bar could reuse the exact same
    widgets instead of redeclaring them — regression-checked `listing-grid4-columns`'s popup
    `FilterSidebar` and `listing-sidebar-right` still work after the extraction.
    **Scope decision**: real filtering (matching `filterCar.js`'s own algorithm, same as every prior
    page) covers Brand/Model/Fuel Type/Transmission only. Miles, the bar's own "Max Price" select,
    Drive Type, Color, Cylinders, and the Year range slider have no corresponding `Listing` field —
    same "decorative if no per-card data" rule as Body Style/Door count/Cylinders/Colors on the
    sidebar pages (#24) — so they get local component state for visual open/close/select interaction
    only, not wired into the shared filter/tag state. The source's own ~34-item "Features" checklist
    under Advanced is NOT reproduced at all: it's pure filler, and it's internally broken in source
    itself (e.g. `id="AdjustableSteering"` paired with the label "Engine Start Stop Button", `id="WheelCovers"`
    paired with "Adjustable Steering" — a whole block of copy-paste-shifted id/label pairs), so there
    was no meaningful fidelity to preserve by transcribing it. Map is a static Google Maps embed, same
    decision as gridstyle-halfmap.html (#23).
    **Bugs found and fixed during Playwright verification** (both caught before reporting to the
    user, not after): (a) `.search-cars__advanced`'s base CSS is `display: none` — source toggles it
    via jQuery's `slideToggle()` setting an inline style directly, not a class; since the panel is
    mounted/unmounted here instead of animated, it needed an explicit `style={{ display: "block" }}`
    when open, or it stayed invisible despite being in the DOM. (b) `SortDropdown` already renders
    its own "Sort Vehicles by" label internally (see its own source) — an extra copy had been added
    around it in `TopMapListingSection`, producing a visibly duplicated label; removed the duplicate
    wrapper, matching how `ListingGridSection` already consumes `SortDropdown` (no wrapping label).
    Also note: this page's Grid3 breakpoint (`xl-grid-cols-2 sm-grid-cols-1`) differs slightly from
    `ListingGridSection`'s own grid3 class (`lg-grid-cols-2 sm-grid-cols-1`) — confirmed via direct
    source read, a real if minor source inconsistency between the two pages, not a typo introduced
    here. Source has no breadcrumb/heading section on this page (goes straight from header to the
    map) but does have a Footer — matched exactly.
29. **`listing-details-2.html` migrated — first real layout-variant detail page, confirms
    LISTING_DATA_MAP.md's plan**: own dynamic route `/listing-details-2/[slug]` (all 12 slugs),
    reusing the same `allListings`/`withDetailFallback` dataset as `/listing-details/[slug]` — not a
    new dataset, per that doc's stated plan for listing-details-2..6.html. Direct source diff against
    listing-details-1.html found the sidebar (Cash/Finance box, contact-dealer, Send Inquiry form) and
    the Description/Financing Calculator/Location/rating-box/comments sections byte-identical —
    reused verbatim; only 3 things actually differ:
    - **Gallery**: 1 large main image + a 2x2 thumbnail grid with `data-fancybox="gallery"` anchors,
      vs. v1's Swiper carousel — genuinely different DOM (variant classification rule), so a new
      `DetailsGalleryGrid` component, not a prop on `DetailsGallery`. Source bundles the real jQuery
      Fancybox plugin here (not a decorative/unused include, unlike some other jQuery plugins seen
      elsewhere) — pulling in jQuery + Fancybox for one gallery isn't proportionate (same "Package
      Principle" call as `RangeSlider` hand-rolling the price slider), so `DetailsGalleryGrid` ships a
      small local lightbox (click to enlarge, prev/next, close) instead — real click-to-view-bigger
      behavior preserved, without the dependency. Needs only 4 thumbnail filler images (a 2x2 grid)
      vs. v1's 9-slide swiper loop filler — cycles the same 3 generic stills either way.
    - **Car Overview**: a single flat `<ul class="car-overview-list">` — icon + value only, no
      "Label:" text at all (confirmed via direct source read) — vs. v1's 2-column labeled list.
    - **Feature tab default**: "Interior" instead of "Exterior" (both the tab's `active` class and the
      matching `content-inner active` sit on Interior in source), and the "add a review" section only
      ever shows the Login-gated button — no visible Name/Email/Review/Rating fields at all (v1 shows
      the full form *and* this same button beneath it).
    Since the overview-list/feature-tab/review-form differences are modest relative to how much is
    shared, extended `ListingDetailsContent` with `overviewLayout`/`featureDefaultTab`/
    `reviewFormVariant` props instead of a duplicated ~200-line file — only the gallery (a genuinely
    different DOM shape) got a separate component. Also extracted `ListingDetailsBreadcrumb` and
    `ListingDetailsTitleBar` out of the v1 route (both byte-identical between the two pages) so both
    routes share them — regression-verified `/listing-details/[slug]` still renders its own 2-column
    overview, Exterior default tab, full add-review form, and Swiper gallery correctly after the
    extraction. Per LISTING_DATA_MAP.md's no-data-invention rule, this page's own Description text (an
    unrelated "Honda HR-V" paragraph on an Audi page) and its differently-shuffled feature-item list
    were NOT transcribed — more of the same per-page filler-content drift already documented for other
    pages, not a second real dataset to preserve.
30. **`listing-details-3.html` migrated — third detail layout, Car Overview moves to the sidebar, a
    real gallery content-bug fixed rather than reproduced**: own dynamic route
    `/listing-details-3/[slug]`, same dataset. Direct source diff against v1/v2 found the Send Inquiry
    form, contact-dealer box, and Description/Financing Calculator/Location/rating-box/comments
    byte-identical — reused as-is. Real differences:
    - **Gallery**: a main-image swiper synced to a separate thumbnail-strip swiper (Swiper's `thumbs`
      module, matching `assets/js/swiper.js`'s `swiperMain`/`swiperThumbs` config exactly: main
      `loop: false`, `initialSlide: 1`, thumbs `slidesPerView: "auto"`, `spaceBetween: 12`,
      `watchSlidesProgress`) — a third distinct gallery DOM shape alongside `DetailsGallery` and
      `DetailsGalleryGrid`, hence a new `DetailsGalleryWithThumbs` component. **Source has a real
      content bug here**: all 7 main slides show the identical image (`slide-listing-details-5.jpg`)
      while the 7 thumbnails show 7 different images (6,5,7,8,9,10,11) — meaning in source, clicking
      any thumbnail would visibly do nothing (the main photo never actually changes). Since
      thumb-to-main syncing is real, load-bearing UI behavior (not decorative, unlike "Play Video"),
      `DetailsGalleryWithThumbs` renders the SAME image array for both sliders instead of reproducing
      the broken pairing — a case for fixing rather than faithfully transcribing a source bug that
      would otherwise make a real interaction silently inert.
    - **Car Overview relocated to the sidebar**: a new `car-overview-list-style2` box (icon+label on
      the left, value right-aligned via a 2-column CSS grid — a third distinct Car Overview
      presentation, after the 2-column-labeled and flat-no-label variants) sits between the
      Cash/Finance box and the contact-dealer box; the main content column has no overview section at
      all. Added as an optional `overview` prop on `ListingDetailsSidebar` (`undefined` by default, so
      v1/v2's sidebar output is completely unaffected) and `overviewLayout="none"` on
      `ListingDetailsContent` (skips the block and its trailing divider entirely, so Description
      becomes the first content section, matching source exactly).
    - **Gallery + title-bar now live inside `.listing-details--content`** itself, not a separate
      full-width section above `.listing-details` like v1/v2 — `ListingDetailsContent` gained a `bare`
      prop that returns its content without the self-wrapping div, so the page can build one
      `.listing-details--content` div containing title-bar + gallery + content together, matching
      source's actual nesting.
    - Default feature tab is "Safety"; add-review section is login-gated only (same pattern as
      listing-details-2.html).
    Regression-verified `/listing-details` and `/listing-details-2` are both unaffected by the
    `ListingDetailsContent`/`ListingDetailsSidebar` prop additions (Playwright-checked their default
    tab, overview layout, add-review variant, and absence of the new sidebar box all still match).
31. **`listing-details-4.html` migrated — 4th detail layout: click-to-expand accordion gallery, a
    real scroll-to-anchor tab bar, a 4th Car Overview presentation**: own dynamic route
    `/listing-details-4/[slug]`, same dataset. Direct source diff against v1/v2/v3 found the sidebar's
    Cash/Finance box, contact-dealer box, Send Inquiry form, and Description/Financing Calculator/
    Location/rating-box/comments unchanged — reused. (This page's contact-dealer box carries a
    `style-2` modifier class and a different dealer name/avatar — checked the SCSS, no rule keys off
    `.style-2` at all, so it's inert; same per-page filler-text drift already documented elsewhere,
    kept the canonical dealer rather than inventing a second one.) Real differences:
    - **Gallery**: a click-to-expand "accordion" of 6 panels (`.slide-gallery-list .slide-gallery`,
      each `flex: 1` except the `.active` one at `flex: 3.7`, matching `assets/js/app.js`'s
      `hoverActiveGallery()` — a real click handler despite the function name) — a 4th distinct
      gallery DOM shape, new `DetailsGalleryAccordion` component. Each panel is also a real Fancybox
      link; same Package-Principle call as `DetailsGalleryGrid`/`DetailsGalleryWithThumbs` — a small
      local lightbox instead of pulling in jQuery + Fancybox. Source's default active panel is index 1
      of 6 (kept as literal fidelity, even though — unlike v1/v2/v3 — none of these 6 images is
      privileged as "the real photo," they're all equally generic filler). Source also ships a
      mobile-only companion swiper (`hidden md-block`, shown only below `md` while the accordion is
      `md-hidden`) that is NOT reproduced: both its slides show the identical image (degenerate demo
      content, unlike the 6 distinct accordion images), and `.slide-gallery-list .slide-gallery.active`
      already has its own mobile breakpoint rule (`flex: 9` at max-width 767px in reponsive.scss), so
      the accordion degrades on its own without a broken duplicate.
    - **A real scroll-to-anchor tab bar** (`ListingDetailsScrollNav`, matching `scrollElement()`:
      smooth-scroll to the target id, offset by header height + 20px) sits above the title bar. Its
      "Inquiry" link targets the SIDEBAR's Send Inquiry box specifically — confirmed via source's own
      `id="Inquiry"` placement (on the sidebar box, not anything in main content) — wired via a new
      `sendInquiryId` prop on `ListingDetailsSidebar`. The other 4 targets (`Overview`/`Description`/
      `Infomation`/`Location`/`Reviews`) landed on each section's leading heading/wrapper via a new
      `sectionIds` + `wrapperId` prop pair on `ListingDetailsContent`, rather than reproducing source's
      exact divider-inside-vs-outside div nesting per section — the only observable effect of those
      ids is as a scroll target (no CSS keys off them), so landing on the heading is behaviorally
      identical. Source has no scroll-spy (the "Description" tab's `active` class is just static
      initial markup) — `ListingDetailsScrollNav`'s click-driven `activeId` highlight state is an
      equivalent real behavior, not an invented one.
    - **Car Overview**: a 4th presentation — a 5-column bordered-card grid
      (`car-overview-list-style3`, icon/label/value stacked vertically per card) —
      `overviewLayout="cards"`.
    - Default feature tab is "Mechanical". The "Customer Reviews" heading has no small "Write a
      review" button next to it this time (only the rating-box's own button remains, confirmed via
      source diff against v1/v2/v3 which all have both) — new `reviewsHeaderButton` prop, default
      `true`. Add-review section is login-gated only (same pattern as v2/v3).
    Regression-verified `/listing-details`, `/listing-details-2`, and `/listing-details-3` are all
    unaffected by the new `ListingDetailsContent`/`ListingDetailsSidebar` props (Playwright-checked
    Write-a-review button count, overview layout, and absence of the new `#Description`/`#Inquiry` ids
    all still match their own expected output).
32. **`listing-details-5.html` migrated — 5th detail layout: single carousel with genuine DUAL
    navigation, a 5th Car Overview presentation, and a Swiper footgun caught before reporting**: own
    dynamic route `/listing-details-5/[slug]`, same dataset. Direct source diff against v4 found the
    sidebar, `ListingDetailsScrollNav`, and the id-placement scheme (ids directly on section
    headings/wrappers, exactly matching the simplification already made for v4) all unchanged — reused.
    Real differences:
    - **Gallery**: a single-slide carousel (`.swiper-listing-details-5`) — a 4th distinct
      single-carousel config (`loop: false`, `initialSlide: 1`, `speed: 800`, no responsive breakpoint
      bump, unlike `DetailsGallery`'s looping 1-or-2-up carousel), new `DetailsGalleryCarousel`
      component. **Real dual navigation**: source gives the breadcrumb's Prev/Next `<p>` elements AND
      the gallery's own in-swiper nav buttons a shared `navigation-prev`/`navigation-next` class
      (confirmed via source read — `assets/js/swiper.js`'s `swiperListingDetails5Config` explicitly
      looks up both pairs and wires whichever it finds to the same swiper instance), so either set of
      arrows drives the one gallery. Reproduced with a new `interactiveNav` prop on
      `ListingDetailsBreadcrumb` (adds the same classes to its Prev/Next) plus Swiper's `navigation`
      config using those classes as `nextEl`/`prevEl` selectors.
      **Bug caught during Playwright verification, before reporting**: the first pass showed the
      in-gallery nav button working but the breadcrumb's Next doing nothing. Root cause: Swiper's
      top-level `uniqueNavElements` option defaults to `true` — when a selector matches multiple
      elements globally but exactly one match sits inside the swiper's own root, Swiper silently keeps
      only the in-swiper match and drops the rest. Fixed by passing `uniqueNavElements={false}` on the
      gallery's `<Swiper>`; re-verified both the breadcrumb and in-gallery buttons independently change
      the active slide. Worth remembering for any future "bind an external + internal button to the
      same Swiper instance via a shared class" case — the default silently defeats it.
    - **Car Overview**: a 5th presentation — a 4-column bordered-card grid with the icon on the LEFT
      and label+value stacked in a `<p>` to its right (`car-overview-list-style4`,
      `overviewLayout="cardsRow"`) — distinct from `"cards"` (v4's icon-on-top layout).
    - Default feature tab is "Technology".
    Regression-verified `/listing-details` (breadcrumb nav still drives its own gallery independently),
    `/listing-details-3` (main+thumb sync unaffected by the new Breadcrumb prop), and
    `/listing-details-4` (accordion gallery unaffected) all still work correctly after these additions.
33. **`listing-details-6.html` migrated — 6th detail layout: fade+autoplay gallery with floating
    thumbs, four real bugs found and fixed (one of them project-wide, not component-local)**: own
    dynamic route `/listing-details-6/[slug]`, same dataset. Direct source diff against v5 found the
    sidebar, `ListingDetailsScrollNav`, Car Overview style (`car-overview-list-style4`), and default
    feature tab ("Technology") all byte-identical — reused (this page's contact-dealer `style-2`/
    different name is the same inert filler-drift already documented for v4). The gallery is the only
    real difference: a fade-effect autoplay carousel (`swiperMain2`: `effect: "fade"`, real `autoplay`
    3s/doesn't-pause-on-interaction, clickable pagination) with a vertical 5-up thumbnail strip floating
    over the image (`position: absolute; right: 40px; top: 56px`) — a 6th distinct gallery DOM shape,
    new `DetailsGalleryFadeThumbs` component. Source does NOT wire the breadcrumb's Prev/Next to this
    gallery (unlike v5) — its dual-nav-detection script is scoped specifically to `.swiper-listing-details-5`,
    so `interactiveNav` is deliberately omitted here.
    **Four issues found and fixed via Playwright, all before reporting**:
    - Source nests `.swiper-listing-details-thumbs-style-2` INSIDE `.swiper-listing-details-main-style-2`
      (fine for vanilla Swiper). swiper/react's `<Swiper>` only special-cases direct `SwiperSlide`
      children — nesting a second, fully separate `<Swiper>` instance as a non-slide child silently
      failed to render at all. Fixed by rendering the thumb swiper as a sibling, with `relative` added
      to the shared wrapper div so its `position: absolute` still anchors to the same visual spot.
    - next/image always renders literal `width`/`height` attributes, and browsers preserve an img's
      intrinsic aspect ratio inside a flex item even under `align-items: stretch` once those attributes
      exist — unlike source's plain `<img>` (no such attributes), which stretches to fill the
      fixed-height `.listing-details-item` box with no competing hint. Needed an explicit
      `style={{ height: "100%" }}` override, or each slide rendered taller than 675px and visibly
      overlapped the pagination dots below it.
    - Nesting the nav buttons inside the main swiper (matching source, and matching every other
      single-carousel gallery variant) broke click-through here specifically: the swiper root is
      `position: relative` with Swiper's own base `z-index: 1`, establishing its OWN stacking context —
      a `z-index: 10` button nested inside it can never outrank the (sibling) thumb strip's
      `z-index: 5`, since only the swiper ROOT's z-index (1) is what's compared at the outer level.
      Raising the swiper root's z-index above 5 was tried and rejected: it fixed the button but then
      made the whole swiper rectangle (which the thumb strip visually overlaps) cover the thumb strip
      too, blocking every click on it. Fixed with a new `NavArrowButton` that hand-reproduces the
      button's CSS (`assets/scss/component/page-title.scss`'s `.swiper-button` rule, including the
      hover-to-white/primary-icon state) as a true sibling of both swipers instead of relying on the
      `.swiper-listing-details-main-style-2 .swiper-button` descendant selector — its own `z-index: 10`
      then competes directly against the thumb strip's `5` in the same stacking context. Binding still
      works via Swiper's string-selector navigation regardless of DOM position (same mechanism as
      `DetailsGalleryCarousel`'s dual-nav case in #32).
    - **Project-wide gap, not specific to this component**: `src/app/layout.tsx` had only ever imported
      base `swiper/css` — never the per-module `swiper/css/effect-fade` or `swiper/css/pagination`, since
      no earlier page actually needed the fade effect or a working `.swiper-pagination` position/z-index.
      Without effect-fade's CSS, Swiper only disables `pointer-events` on non-active fade slides via
      that stylesheet (not JS) — so every inactive slide kept `pointer-events: auto`, and since all 5
      stack at the identical position with `z-index: auto`, whichever inactive slide sat LATEST in DOM
      order silently absorbed every click on the gallery (including the lightbox trigger) — a real,
      previously-undiscovered click-hijacking bug. Without pagination's CSS, `.swiper-pagination` had no
      `z-index` at all and got covered by the swiper-wrapper sibling. Fixed by importing both globally in
      `layout.tsx` (not just for this component) — this also benefits `RelatedListings.tsx`, which
      already uses the Pagination module; regression-verified its pagination-lock behavior (hidden when
      there's nothing to paginate) is unaffected.
    Also note: `loop: true` (source's own literal config) breaks navigation in one specific sequence —
    click a thumbnail, then click Next or let autoplay fire — a known finicky `loop` + `thumbs` sync +
    `effect: "fade"` combination (loop remaps real slide indices to internal clone indices, and the
    thumbs-driven jump can leave the main swiper unable to advance further; verified even autoplay
    stopped afterward). Source's own config attempts the identical combination, so the live site may
    have this exact bug too — kept `loop={false}` rather than ship broken navigation to literally match
    a broken default; every other config value still matches source exactly.
    Regression-verified `/listing-details`, `/listing-details-3`, and `/listing-details-5`'s own
    galleries all still work correctly after the shared `ListingDetailsBreadcrumb`/global-CSS changes.

34. **about-us.html → `/about-us`, plus project-wide WOW.js wiring** (requested together: migrate the
    page AND "wire up wow.js for the whole project, keeping the wow-related classes from the HTML as-is").
    First page in a new `(other-pages)` route group. New components: `AboutHero`, `Testimonials`,
    `WhyChooseUs`, `ExecutiveTeam`, `Brands`, `SocialIcons` (all under `src/components/about-us/`), plus
    two new global modals `TeamModal`/`NewsletterModal` (`src/components/common/`).
    - `AboutHero` + `Testimonials` share ONE `<section class="pb-100">` in source (with a
      `tf-spacing-style5` divider between them) — kept as two separate components but assembled together
      under a single shared `<section>` in `page.tsx` rather than each owning its own wrapper, to match
      that nesting exactly (a wrong split here would double up on `pb-100`'s padding).
    - Stat-counter grid ("18K+ Car For Sale", etc.) renders as static text, not a real count-up: traced
      `app.js`'s `flatCounter()` and confirmed its counting logic only runs
      `if ($(document.body).hasClass("counter-scroll"))`; this page's `<body>` is plain
      `class="inner-page"` — no such class — so source itself never animates these here. The
      `data-to`/`data-speed`/`data-decimals`/`data-inviewport` attributes are preserved verbatim on the
      `<span>` anyway (harmless, faithful to source markup, and trivial to wire for real later if a future
      page's `<body>` does carry `counter-scroll`).
    - `TeamModal`: all 4 Executive Team cards' name links (`sale-agent-title open-modal`) target the exact
      same `#TeamModal`, and source shows fixed "Bessie Cooper" content no matter which was clicked —
      reproduced as one static modal, same "one modal, many identical triggers" precedent already
      established by `CardCompareModal`. Also preserves a genuine source content bug as-is, not "fixed":
      the modal heading reads "Bessie Cooper" but both bio paragraphs refer to "Oliver" and describe a
      Chief Financial Officer, mismatching both the name and the card's own "Chief Operating Officer"
      title — a real source inconsistency, left exactly as authored.
    - `NewsletterModal` (`#NewsletterModal`): traced `app.js` and found `newsletterModal()` is real,
      working behavior — after the preloader clears (polled via `.preload` disappearing), wait 100ms, then
      show once per browser via a `localStorage('suggest_subscribe')` flag, called unconditionally in
      `app.js`'s single global `$(document).ready`. Reproduced faithfully with a `useEffect` in the
      component itself (polling interval + `setTimeout` + the same flag). Deliberately mounted PER-PAGE
      (starting here) instead of in root `layout.tsx`: source calls `newsletterModal()` on literally every
      page (it just no-ops via an empty jQuery selection where `#NewsletterModal` isn't in the DOM), but
      only 11 of the 63 source pages actually include that modal's markup — mounting it in the root layout
      would make its auto-open effect fire on every route in this app (including ones source never shows
      it on), a real behavioral deviation `TeamModal`/`CardCompareModal` don't have since those only ever
      react to an explicit click, never open themselves.
    - `TeamModal` (unlike `NewsletterModal`) mounted globally in root `layout.tsx` anyway, alongside
      `CardCompareModal` — it's inert until a click triggers `openModal("TeamModal")`, so there's no
      auto-behavior risk in mounting it ahead of any other page's Executive Team section reusing the same
      trigger later.
    - **Real bug found and fixed in the global WOW.js infrastructure itself** (built as part of this same
      request, previously unverified): `WowInit.tsx`'s original `import("wowjs").then(({ WOW }) => ...)`
      threw `"WOW is not a constructor"` at runtime. Direct inspection (`Object.keys` on the resolved
      module namespace, then on its `.default`) showed the bundled module has ONLY a `default` export with
      **zero own enumerable keys** — the `wowjs` npm package has no ESM build; its UMD wrapper does
      `this.WOW = (function() {...})()` at module-evaluation time, and under this bundler that top-level
      `this` doesn't resolve to `module.exports` the way a strict CommonJS host would provide it. In
      practice the assignment behaves exactly like the source's own plain `<script src="wow.min.js">` tag
      — it lands on `window.WOW` as a side effect of merely importing the module, not as anything
      `import("wowjs")` itself returns. Fixed by keeping the dynamic `import("wowjs")` (still required so
      the package's own `window`-at-eval-time reference never runs during SSR) purely for its side effect,
      then reading the real constructor off `window.WOW` once the import settles. Added
      `src/types/wowjs.d.ts` (`declare module "wowjs";`) since the package ships no types and `tsc --noEmit`
      failed on the bare import without it.
    - Verified end-to-end via Playwright against the dev server: hero image's `wow fadeIn` element starts
      `visibility: hidden` and is visible with `animated` momentarily added then correctly auto-removed by
      WOW's own `animationend` handler once the CSS animation finishes (confirmed this is expected
      upstream behavior, not a bug, by reading `wow.min.js`'s `resetAnimation`); a stat-counter item
      scrolled into view later in the same run still showed the `animated` class mid-animation. Also
      verified: 4 testimonial slides, 6 brand slides, 4 team cards, `TeamModal` opens with the fixed
      content, `NewsletterModal` auto-opens ~3.1s after load and sets its `localStorage` flag, zero
      console/page errors. Lint and `tsc --noEmit` both clean project-wide after the fix.

35. **sale-agents.html → `/sale-agents`.** New `SaleAgentsSection` component (`src/components/sale-agents/`).
    Same `sale-agent-box` card DOM as about-us.html's Executive Team, but two real differences, not a
    prop-driven variant of `ExecutiveTeam` (different enough interaction + extra markup per card):
    - The name (`sale-agent-title`) is a plain `<a href="sale-agents-details.html">` here, not an
      `open-modal` trigger — this page never opens `TeamModal`.
    - Each card adds a `.contact` phone/email icon pair. Both are literal `href="#"` in source with no
      per-agent contact data anywhere in the site (confirmed via search) — kept as inert placeholder
      links, consistent with the "no data invention" rule, not given invented `tel:`/`mailto:` values.
    - Source's 2nd card (`Bessie Cooper`) carries a static `active` modifier class matching
      `.sale-agent-box.active`'s SCSS rule (`assets/scss/component/box.scss`) — the exact same rule the
      `:hover` state uses, so this card just renders permanently "pre-hovered" (social icons visible,
      name underlined) as a demo/screenshot effect. Reproduced verbatim (this one card only).
    - Pagination markup at the bottom (`ul.pagination`, 4 links) has zero backing JS anywhere in
      `assets/js/*.js` (confirmed via search for `pagination__link`) and all 8 agents already render in
      one grid with no page-splitting logic — initially reproduced as decorative markup only, matching
      source exactly. **Superseded by #36 below** (user explicitly asked for it to be made real).
    - No `wow` classes anywhere on this page (confirmed via source search) — nothing for the global
      `WowInit` to animate here.
    - **Moved `SocialIcons.tsx`** (the Facebook/X/Instagram/Skype/Telegram icon set) from `about-us/` to
      `common/` since this page needed the exact same 5 icons with the exact same hrefs — same
      "extract into shared files once a second feature needs it" precedent as `CheckboxDropdown`/
      `ColorDropdown` during the listing-topmap work. Updated `ExecutiveTeam.tsx`/`TeamModal.tsx` imports;
      no visual or behavioral change to about-us, re-verified via `tsc --noEmit`.
    - 3-level breadcrumb (Home > Pages > Sale Agents) vs. about-us's 2 — source's own "Pages" crumb
      literally links to `/index.html`, same target as "Home", not a real intermediate route; reproduced
      as-is (both link to `/`), not invented into a `/pages` route that doesn't exist anywhere in source.
    - Verified via Playwright: 8 cards with correct names/roles, 2nd card's `active` class present, 5
      social + 2 contact icons per card, name link resolves to `/sale-agents-details` (not yet migrated —
      expected 404 until that page exists, same convention as every other not-yet-built destination link
      this session), zero console/page errors. Lint and `tsc --noEmit` clean.

36. **sale-agents.html pagination made real + `Pagination` extracted as a shared component**
    (user-requested follow-up: "tôi muốn pagination hoạt động được, tạo component riêng để có thể dùng
    cho sau này của project có page sử dụng" — make the pagination actually work, as its own reusable
    component for future pages). This deliberately goes beyond source (source's own `.pagination__link`s
    have no backing JS at all, see #35) — an explicit user request to add real behavior overrides the
    session's usual "only build what source itself wires up" default.
    - `ListingPagination` (`src/components/listing/ListingPagination.tsx`, built for listing-grid4-columns)
      was already a fully generic, controlled `{page, totalPages, onPageChange}` component with zero
      listing-specific coupling — no need to write a second pagination component from scratch. Renamed to
      `Pagination` and moved to `src/components/common/Pagination.tsx` (same "extract into shared files
      once a second feature needs it" precedent as `SocialIcons` in #35), updating all 4 existing
      consumers' imports: `ListingGridSection`, `HalfMapListingSection`, `ListingSidebarSection`,
      `TopMapListingSection` — no behavioral change to any of them, regression-verified via Playwright
      (listing-grid4-columns' own Next-page click still advances correctly).
    - `SaleAgentsSection` became a client component (`"use client"` + `useState` for the current page) and
      now genuinely splits its 8 real agents 4-per-page (one full grid row at the page's own 4-column
      grid) — 2 real pages. Chose 4/page specifically so the split uses only the real 8 agents already in
      the dataset; source's own hardcoded "1 / 2 / 3" markup implied 3 pages, but there's no real 3rd
      page's worth of agents to show without inventing more people, so the page count now honestly
      reflects the real data instead.
    - Verified via Playwright: page 1 shows the first 4 agents (Robert Fox…Kristin Watson), page 2 shows
      the last 4 (Guy Hawkins…Eleanor Pena), clicking "2" swaps the grid content, the Next arrow correctly
      disables on page 2 (the last page), and clicking back to "1" restores the first 4 — all via the
      same shared `Pagination` component every listing page already uses. Lint and `tsc --noEmit` clean.

37. **sale-agents-details.html → `/sale-agents-details`.** New `AgentProfile`/`AgentSidebar`
    (`src/components/sale-agents-details/`). Static route with no `[id]`/`[slug]` — every one of
    sale-agents.html's 8 agent cards links to this exact same literal `sale-agents-details.html` file
    (confirmed via source read, no per-agent id anywhere), and the page itself always shows the same one
    fixed agent's content. Same "single static demo page" situation as `listing-details-1..6.html`
    before `LISTING_DATA_MAP.md` gave listings their own synthetic slug — but here there's no second
    analyzed variant and no distinct per-agent data anywhere in source to justify inventing a dynamic
    route, so it stays a plain static page (supersedes MIGRATION_STATUS.md's earlier placeholder guess
    of `/sale-agents-details/[id]`, written before this page had actually been read).
    - Source has a genuine name mismatch: the breadcrumb's last crumb reads "Mike Hanley" while the h2 +
      both bio paragraphs read "Darrell Steward" (and the hero photo is `sale-agent-9.jpg`, a 9th photo
      not used by any of sale-agents.html's 8 cards) — preserved exactly as authored, not reconciled,
      same flavor as TeamModal's "Bessie Cooper"/"Oliver" mismatch on about-us.html (#34).
    - "Dealer Inventory (3)": all 3 card titles ("Audi A6 Avant E-Tron", "2024 Hyundai Elantra", "Kia EV9
      2024") title-match real `allListings` records (ids 1-3), but this page's own copies have drifted
      from the canonical values — identical demo spec block (32500 miles/2022/EV/Manual) repeated on all
      3 cards, its own `card-44/45/46.jpg` images, and prices that don't match ($40.900/$44.900 here vs.
      the canonical $42.800/$45.500 for ids 2-3) — same "per-page filler-content drift" already
      documented for listing-details-2's Description text. Rendered via the real, already-shared
      `HalfMapListingCard` fed each listing's actual canonical `ListingCardData`, not a transcription of
      this page's drifted values — consistent with `LISTING_DATA_MAP.md`'s no-invention rule.
    - Customer Reviews (4.8 average, same 5-star distribution, same 3 reviewers — Randynox/Mista
      Nyroom/Heather Dick) is byte-identical to the canonical detail dataset every `/listing-details*`
      route already renders. Extracted a new shared `ReviewsSection` (rating-box + comments +
      add-review-form) out of `ListingDetailsContent`'s inline block into `common/`, and a new shared
      `SendInquiryForm` out of `ListingDetailsSidebar`'s inline block into `common/` — same "extract into
      shared files once a second feature needs it" precedent as `SocialIcons`/`Pagination` (#35/#36).
      Both `ListingDetailsContent` and `ListingDetailsSidebar` now just call these instead of owning a
      second copy of the markup; re-verified via Playwright that `/listing-details/[slug]` still renders
      its rating box, comments, Send Inquiry form, and add-review form correctly after the extraction —
      no behavioral change.
    - **Bug found and fixed during verification**: after extracting `SendInquiryForm`, the dev server
      threw `Error: Event handlers cannot be passed to Client Component props` on `/sale-agents-details`
      — its inline `onSubmit={(event) => event.preventDefault()}` had only ever worked because the
      surrounding `ListingDetailsSidebar` file carries its own top-level `"use client"`; once extracted
      into a standalone module rendered from server components (`AgentSidebar`/the new page), it had no
      client boundary of its own. Fixed by giving `SendInquiryForm.tsx` its own `"use client"` directive
      so it owns that boundary regardless of what renders it — a real server-render error caught and
      fixed before reporting, not shipped.
    - The Location sidebar box's map iframe/address/phone numbers are byte-identical to the canonical
      `allListings[0].location`/`.dealer.phones` values, but kept as literal values in `AgentSidebar`
      rather than importing `@/data/listings` into an agent-profile component — a coincidental demo-data
      match, not a real dependency between the sale-agents feature and the listings dataset.
    - Verified via Playwright: correct h2/breadcrumb (including the name mismatch), 3 real inventory
      cards with correct titles, rating 4.8 with 3 comments, correct Location address/phones, Compare
      button opens `CompareModal`, "Login to add a Review" opens `LoginModal`, zero console/page errors.
      Lint and `tsc --noEmit` clean.

38. **sale-agents-details made real per-agent, `/sale-agents-details/[slug]`** (user-requested
    follow-up: "cần lấy content theo item team để đổ vào single" — pull each team item's own content
    into the single detail template). Converts #37's static single-content page into a genuinely
    per-agent one.
    - New `src/data/saleAgents.ts`: canonical `SaleAgent` type (`id`/`slug`/`name`/`role`/`photo`/
      `active?`) + `allSaleAgents`, the same 8 records `SaleAgentsSection` already had inline (name/
      role/photo — the only fields source's own 8 cards actually vary) — moved to a shared data file so
      the list page and the new `[slug]` detail route consume one source of truth, same "one shared
      dataset, not per-page copies" pattern as `allListings`. `slug` is synthetic kebab-case of `name` —
      source has no working per-agent route at all (confirmed: every one of the 8 cards' links point at
      the identical literal `sale-agents-details.html` file), so this project is free to design its own,
      same reasoning as `LISTING_DATA_MAP.md`'s `Listing.slug`.
    - `SaleAgentsSection` (the list page) now imports `allSaleAgents` instead of a local array, and
      links each card's photo + name to `/sale-agents-details/${agent.slug}`. (In the process, reverted
      an interim local edit to that file that had padded the list to 12 entries — 4 of them literal
      duplicates of agents 1-4 — and bumped `AGENTS_PER_PAGE` to 8: that duplication would have produced
      two cards linking to the identical agent slug and contradicts the project's no-invented-data rule,
      so restored the real 8-agent list with `AGENTS_PER_PAGE = 4` from #36.)
    - The route moved from a plain `page.tsx` to `[slug]/page.tsx`, with `generateStaticParams` over
      `allSaleAgents` and `notFound()` for unknown slugs (verified via Playwright: a made-up slug 404s).
      `AgentProfile` now takes an `agent: SaleAgent` prop and renders its real `photo`/`name` — a useful
      side effect is that source's own name mismatch on this page (breadcrumb said "Mike Hanley",
      heading+bio said "Darrell Steward" — see #37) no longer exists, since the breadcrumb (in the
      `[slug]` page) and the heading now both read the same `agent.name`.
    - The two bio paragraphs stay source's own literal generic text (source only ever wrote ONE agent
      bio) but with the literal "Darrell Steward"/"Darrell" mentions swapped for `agent.name`/first
      name, and "his"/"him" swapped for gender-neutral "their"/"them": these synthetic agent records
      carry no gender data, so keeping source's literal masculine pronouns verbatim would silently
      assert a gender for names that don't warrant the assumption (Bessie Cooper, Kristin Watson,
      Eleanor Pena) — same reasoning as this project's own pronoun-neutrality convention. Verified via
      Playwright on `bessie-cooper` specifically that the bio text contains no "his"/"him". This is a
      name/pronoun substitution into an otherwise-unchanged generic narrative, not new biographical
      facts — Dealer Inventory and Customer Reviews are untouched (still fully shared, per #37, since no
      per-agent data exists for either anywhere in source).
    - **Two now-dangling references to the removed static `/sale-agents-details` route, found and fixed
      before reporting**: (1) about-us.html's own Executive Team cards (`ExecutiveTeam.tsx`) link their
      photo to `sale-agents-details.html` too — since those 4 names/photos are exactly `allSaleAgents`'
      first 4 records (same stock photos/names reused verbatim across both pages), each card now links
      to that real person's own `/sale-agents-details/[slug]` instead of a dead link. (2) The header's
      "Sale Agents Detail" nav-dropdown item (`src/data/menu.ts`) pointed at the bare static path — now
      points at a representative real slug (`/sale-agents-details/robert-fox`), same pattern the
      "Listing Details 1-6" nav items already use (a specific real listing slug, not a bare route).
    - Verified via Playwright: `robert-fox` and `bessie-cooper` each render that agent's own name/photo/
      breadcrumb/bio, an invalid slug 404s, `/sale-agents`'s card hrefs each resolve to the correct
      agent slug and clicking one navigates+renders correctly, about-us's Executive Team card links and
      the nav dropdown link both resolve (200) instead of 404ing, zero console/page errors. Lint and
      `tsc --noEmit` clean.

39. **dealers-listing.html → `/dealers-listing`.** New `DealersListSection`/`DealersBrandsCarousel`
    (`src/components/dealers/`) + a new canonical `allDealers` dataset (`src/data/dealers.ts`, mirrors
    `allSaleAgents`'/`allListings`' "one shared dataset" pattern).
    - `.dealer-box` (`assets/scss/component/box.scss`) is a horizontal row card — image, name+rating,
      address, phone, and a "Dealer Details" button as flex siblings — genuinely different DOM from
      `.sale-agent-box`'s photo-grid card, not a variant of it. `slug` is synthetic kebab-case of `name`:
      every one of the 8 rows' "Dealer Details" links point at the same literal `dealer-details.html`
      file in source (no per-dealer route anywhere), same reasoning as `SaleAgent.slug`.
    - Star pattern: dealer #1 (Dynamic Drive Garage) shows 5 filled `star-2.svg` icons; every other
      dealer shows 4 filled + 1 `star-5.svg` (a distinct, presumably "outline/unfilled", icon) — all 8
      still show the identical "(1,968 Ratings)" count regardless of the visual star pattern, preserved
      verbatim rather than reconciled into 8 different numbers. Modeled as a single `filledStars` field
      per record rather than inventing a numeric rating that doesn't exist in source.
    - Dealer #3 (Bavarian Experts) carries source's own static `.dealer-box.active` modifier — matches
      the identical `&.active, &:hover` SCSS shape already seen on `.sale-agent-box` (permanent
      "pre-hovered" border-color highlight, one card only) — same precedent, preserved verbatim.
    - Source nests the dealer list, a `tf-spacing` divider, and the "Dealers Brands" carousel all
      inside ONE `<section class="pb-100">` — assembled in `page.tsx` around both components rather
      than each owning its own section wrapper, same pattern as about-us's `AboutHero`/`Testimonials`
      (#34) and sale-agents' `AgentProfile`/`AgentSidebar` split.
    - Pagination markup (4 links) has zero backing JS (confirmed: no script anywhere binds
      `.pagination__link`, same check already done for sale-agents.html in #35) — initially reproduced
      as decorative markup matching source exactly. **Superseded immediately by a follow-up request**:
      the user clarified that making pagination real is now a STANDING rule — any page with pagination
      markup should have it actually work, not a one-off special case for sale-agents.html. Wired up the
      same shared `Pagination` component (`common/`) exactly as #36 did: `DealersListSection` became a
      client component with its own `page` state, splitting the 8 real dealers 4-per-page (2 real
      pages) — verified via Playwright (page 1 shows Dynamic Drive Garage…AutoLine Garage, page 2 shows
      Metro CarWorks…Titan Garage, Next disables on page 2). Going forward, every future `/migrate-page`
      should check for `.pagination`/`.pagination__link` markup and wire it up for real by default,
      choosing a per-page count that gives the real record count more than one real page where possible
      (matching #36's/this entry's 4-per-page choice), rather than waiting for an explicit per-page ask.
    - "Dealers Brands" (`.out-brand-3`: image + name + address, wrapped as one link) is a 4th distinct
      out-brand card shape — new `DealersBrandsCarousel`, config matches `.swiper-outbrand-4` in
      `assets/js/swiper.js` verbatim (spaceBetween 20, speed 800, responsive slidesPerView 1/1/2/3/5).
      Source repeats the same 5 brands twice (10 slides total) — preserved as-is, not deduplicated, same
      demo-repeat precedent as about-us's testimonial slides.
    - **Source content bug found, disclosed, and NOT fixed**: the 4th brand slide's image
      (`brand-16.png`) is visually a KIA logo (confirmed by viewing the file directly), but source's own
      literal text labels it "Toyota" — reproduced exactly as authored (same image file, same label
      text), consistent with every other preserved source name/content mismatch this session (Mike
      Hanley/Darrell Steward on sale-agents-details.html, Bessie Cooper/Oliver on about-us.html's
      TeamModal).
    - **Missing assets found and fixed**: `star-5.svg` and `location.svg` were referenced by this page
      but had never been copied into `public/assets/icons/` — the first two already-migrated pages to
      need either icon. Copied both over from `../aurexo/assets/icons/` before building the components
      (verified present in source first).
    - Verified via Playwright: 8 dealer rows with correct names/addresses/phones, the `.active` border
      on Bavarian Experts specifically, correct star patterns per dealer (screenshot-confirmed 5-star vs.
      4-star+outline), decorative pagination present, "Dealers Brands" renders all 10 slides correctly
      after WOW's fade-in settles (an initial screenshot taken mid-animation looked faded — re-checked
      after a longer wait and confirmed fully rendered, same WOW.js timing behavior already understood
      from #34, not a bug), zero console/page errors. Lint and `tsc --noEmit` clean.

40. **dealer-details.html → `/dealer-details/[slug]`** (user-requested: "áp dụng cũng giống như
    sale-agent-details" — apply the same approach as sale-agents-details.html). Unlike #37→#38's
    two-step history (static page first, converted to `[slug]` after a follow-up request), this route
    was built as a per-item `[slug]` route from the start, reusing `allDealers` (#39) directly.
    - Source's own hardcoded content ("Euro Workshop", `volvo.png` hero photo, "537 Orchard St, NY")
      doesn't match any of the 8 real dealers from dealers-listing.html either — same "single static
      demo page whose content doesn't match its own list" situation `sale-agents-details.html` had
      before #38. `generateStaticParams` over the existing `allDealers` — no changes needed to
      `src/data/dealers.ts` itself, since it already carries every field this page needed
      (`name`/`image`/`address`/`phones`).
    - Breadcrumb is 3 levels (Home > Dealer Listing > {name}) vs. sale-agents-details' 4 — confirmed
      via direct source read (no "Pages" middle crumb on this page), not a transcription slip.
    - New `DealerSidebar` has NO "Send Inquiry about Vehicle" form at all (confirmed absent via source
      search) — just the Location box, simpler than `AgentSidebar`. Its address/phones are personalized
      to the real `dealer` record; source's own sidebar instead hardcodes the SAME unrelated canonical
      dealer/location values seen on sale-agents-details.html ("6205 Peachtree Dunwoody Rd..."), which
      don't even match this page's OWN hero address ("537 Orchard St, NY") — a real source
      inconsistency, resolved by personalizing both the hero and sidebar to the one real `dealer.address`
      instead of reproducing two different demo addresses on the same page.
    - "Dealer Inventory (3)" and "Customer Reviews" are byte-identical to sale-agents-details.html's own
      (same 3 listing titles/images/drift, same 4.8/3-reviewer data) — reused via the same
      `HalfMapListingCard`/`ReviewsSection` components and the same canonical `allListings` data, not a
      third transcription. The "4.8 (751 review)" rating line has no per-dealer equivalent anywhere in
      source (`Dealer` only carries a `filledStars` 5-vs-4 visual flag, not a decimal average) — stays
      shared literal text on every dealer's page, same treatment as Inventory/Reviews.
    - Bio paragraphs get the same name/pronoun substitution as `AgentProfile` (#38): literal name
      mentions swapped for `dealer.name`, "his"/"him" swapped for gender-neutral "their"/"them" — if
      anything more clearly appropriate here than on the agent page, since a business name carries no
      gender at all and source's masculine pronouns were always a mismatch for an entity like "Bavarian
      Experts" or "Metro CarWorks".
    - "Call To Dealer" literally links to `dealer-details.html` itself in source (a real, if odd,
      content bug — not a `tel:` action) — preserved as a self-link to this same dealer's own `[slug]`
      page rather than "fixed" into a phone action source itself never wires up.
    - **Four now-dangling references to the removed static `/dealer-details` route, found and fixed
      before reporting**: `DealersListSection`'s own card-name and "Dealer Details" button links (now
      per-dealer slugs); `ListingDetailsSidebar`'s and `AgentSidebar`'s "Call To Dealer" buttons (both
      generic, page-non-specific contexts unrelated to any one of the 8 real dealers — pointed at a
      representative real slug, `dynamic-drive-garage`, same pattern as the "Listing Details 1-6"/"Sale
      Agents Detail" nav items using a specific real slug instead of a bare route); and the header's
      "Dealer Detail" nav-dropdown item (`src/data/menu.ts`), same fix. Converting `ListingDetailsSidebar`'s
      link from a plain `<a>` to `next/link`'s `<Link>` was required as part of this fix — ESLint's
      `no-html-link-for-pages` rule newly flagged the bare `<a>` once its target became a route the
      linter could actually resolve (it hadn't fired against the old bare, page-less `/dealer-details`
      path).
    - Verified via Playwright: `dynamic-drive-garage` and `bavarian-experts` each render that dealer's
      own name/photo/breadcrumb/address/bio, an invalid slug 404s, `/dealers-listing`'s card and button
      hrefs each resolve to the correct dealer slug, sidebar address/phones are genuinely per-dealer (not
      the old shared canonical values), no Send Inquiry form present, "Call To Dealer" self-links
      correctly, sale-agents-details' own "Call To Dealer" link now resolves (200) instead of 404ing,
      zero console/page errors. Lint and `tsc --noEmit` clean.

41. **calculator.html → `/calculator`.** New `CarPaymentCalculatorSection`/`BrowseByPriceSection`
    (`src/components/calculator/`) + a new shared `FaqAccordion` component (`src/components/common/`,
    built with reuse on faqs.html in mind — same `.flat-toggle` markup, confirmed via source diff).
    - `CarPaymentCalculatorSection` is a distinct, larger financing-calculator shape from the one
      already embedded in `ListingDetailsContent` — 6 fields (Car Price, Down Payment, Loan Term,
      Trade-In Value, Interest Rate, Sales Tax) vs. that one's 4, plus a separate "Loan Summary" results
      panel (Car Price/Down Payment/Trade In/Est. Interest/Est. Sales Tax/Other Fees/Total Loan
      Amount/Monthly Payment) instead of an inline 3-value row — a new component, not a variant.
      Confirmed UI_ONLY via source search (no script anywhere touches `calculatePrice`/
      `CalculatorPayment`/`CalculatorTrade`/`CalculatorInterestRate2`/`CalculatorTax`) — same treatment
      as the other financing calculator (`LISTING_DATA_MAP.md` #6). This one doesn't even have a
      "Calculate" button in source to begin with (confirmed via direct read of the form's boundaries).
    - `BrowseByPriceSection`: 15 literal `.price-box` items (label + price-range text), all linking to
      the same `listing-grid4-columns.html` in source with no real per-range filtering behind them
      (`listing-grid4-columns`'s own filter sidebar has no URL-param-driven price presets) — reproduced
      as decorative labels+links. Source repeats "Used Toyota Highlander / Under $60K" twice (items 4
      and 5) — preserved as-is, same demo-repeat precedent as about-us's testimonial slides.
    - **New shared `FaqAccordion` component — a real, single-open accordion, after an incomplete first
      analysis shipped it as non-interactive and the user caught it** ("phần flat-toggle chưa hoạt động
      giống với bản html"). `app.js`'s `flatAccordion()` actually installs TWO separate click bindings:
      an early one scoped to `$('.flat-toggle.enable .toggle-title')` — genuinely dead, `.enable`
      appears nowhere in the 63-page site — and a second, unconditional one on
      `$('.flat-accordion .toggle-title')` a few lines later, which IS the real handler: clicking any
      title closes every `.flat-toggle` in the group, then (unless the clicked one was already open)
      reopens just that one — a standard single-open accordion. The first pass only read the function's
      opening ~25 lines, found the dead `.enable` binding, and stopped there without reading the rest of
      the function — concluding the whole accordion was dead when only its first, superseded binding
      was. Caught by the user, then confirmed independently by opening the actual static
      `../aurexo/calculator.html` directly in a browser via Playwright and observing that clicking a
      closed question really does expand it there (and collapses whichever one was open). Fixed
      `FaqAccordion` to a real `useState`-backed single-open accordion (`openIndex: number | null`,
      clicking the open item sets it to `null`, clicking a different item sets it to that index) —
      re-verified: item 0 open by default, clicking item 1 opens it and closes item 0, clicking item 3
      opens it and closes item 1, clicking item 3 again closes it with nothing left open.
    - **Follow-up (user-reported): "lúc mở chưa mượt như ở html"** — the first fix toggled visibility via
      a plain `display: none`/`block` swap, an instant snap unlike source's own `.slideDown()`/
      `.slideUp()` (300ms). Animated it with the CSS grid `grid-template-rows: 0fr -> 1fr` technique
      (transition on an outer grid row's own track size, with an `overflow: hidden` inner wrapper) at
      the same 300ms duration — this handles arbitrary/unmeasured content height without any JS height
      calculation, unlike a `max-height` transition hack. Verified via Playwright by sampling the
      content's rendered height every ~60ms during an open: it interpolated smoothly (0 → 68 → 124 → 142
      → 146px) rather than jumping straight to its final height.
    - Source repeats the identical "An auto loan is a sum of money..." paragraph as the answer for FAQ
      items 2 through 7 (confirmed via direct source read) — not a transcription shortcut, source itself
      never wrote 6 distinct answers.
    - Verified via Playwright: calculator fields/summary panel show correct static values, 15 price
      boxes render correctly, FAQ accordion is genuinely interactive and single-open as described above,
      zero console/page errors. Lint and `tsc --noEmit` clean.

42. **sell-your-car.html → `/sell-your-car`.** New `SellCarHeroForm`/`HowItWorksSection`/
    `GetInTouchBanner` (`src/components/sell-your-car/`); reused `WhyChooseUs` (`about-us/`) and
    `FaqAccordion` (`common/`) as-is.
    - `SellCarHeroForm`: a real "License Plate"/"VIN" tab switch. Confirmed real (unlike the FAQ
      accordion's initial false start in #41) by reading `app.js`'s `tabs()` in full — it binds
      unconditionally to any `.flat-tabs .menu-tab` `li` child, no gating class required this time.
      Implemented with `useState`, same `menu-tab`/`content-inner active` pattern already established
      by `ListingDetailsSidebar`'s Cash/Finance tabs. Both panes have identical fields (VIN Number, Zip
      Code) under different ids per source (`VINNumber1`/`ZipCode1` vs. `VINNumber2`/`ZipCode`) —
      preserved verbatim. "Get Started" is `type="button"` with no handler anywhere in source — UI_ONLY,
      same treatment as the financing calculators (`LISTING_DATA_MAP.md` #6).
    - `HowItWorksSection`: 4 static steps; step 2 carries source's own static `.active-step` modifier — a
      pure-CSS `:has()`-driven progress-line highlight (`assets/scss/component/box.scss`), not JS-driven
      — preserved verbatim, same "one item permanently marked as the demo's current step" precedent as
      `.sale-agent-box.active`/`.dealer-box.active`.
    - "Why Choose Us" is byte-identical to about-us.html's own (same heading/checklist/stat-counters,
      confirmed via source diff) — reused the existing `WhyChooseUs` component directly instead of
      rebuilding it. Its "Find Your Car Now!" CTA already hardcodes `href="/sell-your-car"` (this exact
      page) — matches source's own self-referential link now that the destination actually exists.
    - New `GetInTouchBanner`: source's `.overlay-parallax` (a 40% black tint) + `.overlay.image` (an
      absolutely-positioned background layer) wrap a plain `<img>` that `app.js`'s `parallax()` hands to
      the third-party SimpleParallax library at runtime for full-bleed cover sizing plus a subtle scroll
      effect — not pulled in (Package Principle: one decorative scroll effect doesn't justify a new
      dependency). Reproduced as a plain `next/image` with `fill` + `object-fit: cover`, matching the
      intended full-bleed visual without the parallax motion.
    - Source's breadcrumb "Pages" crumb is a plain `<span>` here — NOT a link, unlike every other
      migrated page's clickable `<a>` "Pages" crumb — confirmed via direct source read and reproduced as
      non-interactive rather than assumed to follow the other pages' pattern.
    - FAQ section reuses `FaqAccordion` (#41, already fixed to be a real single-open accordion) with 4
      items instead of calculator.html's 7; item 1's answer is real, page-specific content ("Usually,
      you will need the current registration...") rather than the generic "An auto loan is a sum of
      money..." blurb the other 3 items (and all of calculator.html's items 2-7) reuse verbatim.
    - **Verification note**: an early pass checking single-open behavior via Playwright's `isVisible()`
      on the innermost `.toggle-content` text node showed both the just-closed and newly-opened items as
      "visible" — investigated before concluding anything, since #41's mistake made this session
      specifically wary of premature "it's still broken" conclusions. Root cause: `.toggle-content`
      itself is unconditionally `display: block` (only its grid-row ANCESTOR collapses via
      `grid-template-rows: 0fr`), and a clipped descendant's own `getBoundingClientRect()` still reports
      its natural (non-zero) size regardless of an ancestor's `overflow: hidden` — `isVisible()` doesn't
      zero out for that. Re-checked by reading the actual collapsing wrapper's own rendered height
      instead (0 for the closed item, ~146px for the open one) and confirmed the accordion was correct
      all along — a test-methodology artifact, not a component bug.
    - Verified via Playwright: tab switch swaps both the active label and which pane's inputs are
      present, 4 "How It Works" steps with step 2 highlighted, "Why Choose Us" stats present, CTA banner
      image and text render, FAQ accordion is genuinely single-open (confirmed via wrapper height, see
      above), zero console/page errors. Lint and `tsc --noEmit` clean.

43. **clients-reviews.html → `/clients-reviews`.** New `ClientsReviewsSection`
    (`src/components/clients-reviews/`), reusing the shared `Pagination` component.
    - `.testimonior-box` is the same card shape as about-us.html's testimonial swiper slides (the first
      3 entries here — Emily Johnson/Benjamin Parker/Olivia Williams — are byte-identical to that page's
      slides 1-3, confirmed via source diff), but rendered as a plain static 3-column grid here instead
      of a Swiper carousel — a genuinely different presentation, so a new component rather than a prop
      on `about-us/Testimonials`. Unlike that page's swiper (which repeats slide 1 as a 4th slide), all
      9 reviews on this page are real and distinct — no demo-repeat to disclose here.
    - Pagination built real from the start this time (standing rule, #36 — no decorative-first pass
      needed since the rule was already established before this page was migrated). Source's own
      `.pagination__link`s have zero backing JS here too (confirmed via search, consistent with every
      other page's pagination checked this session). 3 reviews/page happens to divide the 9 real
      reviews into exactly 3 pages — matching source's own literal "1 2 3" page-number markup for once,
      without inventing a 4th page's worth of content.
    - `Pagination`'s own component always wraps itself in a `<div className="container">` — rendered as
      a sibling of the review grid's container (not nested inside it), same structural trade-off already
      accepted for sale-agents.html/dealers-listing.html: source here actually has the `<ul
      class="pagination">` as a direct sibling inside the SAME container as the grid (no separate
      wrapper div), so this reproduces the established shared-component precedent over exact 1:1 DOM
      nesting — a minor, already-disclosed compromise, not a new one.
    - Source's breadcrumb "Pages" crumb is a plain `<span>` here too (not a link) — same as
      sell-your-car.html's breadcrumb (#42).
    - Verified via Playwright: 9 distinct reviews split into exactly 3 real pages of 3, each page shows
      the correct 3 names in order, Next disables on the last page, zero console/page errors. Lint and
      `tsc --noEmit` clean.

44. **financing.html → `/financing`.** New `FinancingHero`/`HowItWorksSection`/`NewsTipsSection`
    (`src/components/financing/`); reused `FaqAccordion` (`common/`) as-is.
    - `FinancingHero`'s "Already prequalified? Sign in" is a real `open-modal` trigger for `LoginModal`
      (`useModal`, same pattern reused throughout the project) — not a link. "Get Prequalified" links
      to `/contact-us` (not yet migrated), matching source's own `href="contact-us.html"`.
    - `HowItWorksSection` reuses the same `.sell-your-car-box` card DOM as sell-your-car.html's own "How
      It Works" (#42), but with source's real `.style-2` CSS modifier (3-column grid instead of 4 —
      confirmed in `assets/scss/component/box.scss`), only 3 steps instead of 4, and its own subtitle
      paragraph + `background-light py-100` section wrapper that the other page's version doesn't have
      — different enough to be a separate component rather than adding variant props to the existing one
      for a single reuse case. Step 2 keeps the same static `.active-step` modifier (pure CSS, not JS).
    - New `NewsTipsSection` (`.post-style-6`) — the first blog-card component built in this project (no
      blog page has been migrated yet). All 3 cards link to `/blog-details-1` (not yet migrated),
      matching source's own literal `blog-details-1.html` href on all 3 cards.
    - **"Auto financing FAQ" is byte-identical to sell-your-car.html's own FAQ** (#42) — the exact same 4
      questions about "selling my car" (not financing), verbatim, confirmed via source diff. A genuine
      source copy-paste mismatch (a whole page literally titled "Auto financing FAQ" whose questions
      never mention financing at all), not a transcription error introduced here — reproduced exactly
      as-is via the same shared, already-real `FaqAccordion` (#41/#42).
    - Verified via Playwright: "Sign in" opens `LoginModal`, 3 "How it works" steps with step 2
      highlighted, 3 news cards with correct titles/hrefs, FAQ accordion renders with item 1 open by
      default (confirmed via non-zero wrapper height, the same measurement technique #42 established
      after its `isVisible()` false-positive), zero console/page errors. Lint and `tsc --noEmit` clean.

45. **services-center.html → `/services-center`.** New `ServicesHero`/`FeaturesServicesSection`/
    `DownloadAppSection`/`ContactScheduleSection` (`src/components/services-center/`).
    - Source's own h2/breadcrumb literally read "Sevices Center" (missing an "r") throughout the whole
      page, and the contact section heading says "Contact Infomation" — the exact same "Infomation"
      typo already preserved on about-us.html's `TeamModal` (#34). Both are real, recurring source
      typos, not introduced here — preserved verbatim rather than silently corrected.
    - `FeaturesServicesSection`: 6 `.service-box` cards, each with its OWN unique inline SVG icon (no
      shared icon set across them, unlike the social-icon components elsewhere). Required deliberate
      care mapping each icon to its correct card during the initial build — several of the 60×60
      viewBox icons look superficially similar in a quick scan (multiple `<path>`s, similar stroke
      style), and an early draft mismatched icons 5 and 6 (assigned the AC/Heating icon's path data to
      the "Engine Diagnostics" card and vice versa) before being caught and corrected during review by
      checking each icon's actual path data against source line-by-line, not just that 6 boxes render
      with 6 icons. Source itself is inconsistent about the title links: items 1-4 ("Oil Change"/"Tire
      Rotation"/"Brake Inspection"/"Battery Testing") literally link to `href="#"` (dead), while items
      5-6 ("Engine Diagnostics"/"Air Conditioning") link to `contact-us.html` — preserved exactly as
      this split, not made consistent one way or the other.
    - `DownloadAppSection`: app-store/Google-Play buttons both link to `href="#"` in source (decorative,
      no real app) — preserved as-is. Reuses the same `banner-download-app.jpg` asset financing.html's
      hero also uses (#44), but for a different purpose/context — asset reuse only, not a component or
      content dependency between the two pages.
    - `ContactScheduleSection` reuses the same `.overlay-parallax`/`.overlay.image` full-bleed
      background pattern as sell-your-car.html's `GetInTouchBanner` (#42) — SimpleParallax not pulled in
      (Package Principle), reproduced as a plain `next/image` `fill` + `object-fit: cover` — but is
      otherwise a new component: a 2-column contact-info + form layout, not `GetInTouchBanner`'s
      centered-text-only banner. Its "Schedule A Services" form shares some field ids with the existing
      `SendInquiryForm` (`SendInquiryname`/`SendInquiryemail`/`SendInquiryphone`) but adds Date/Brand/
      Model fields and a different button label ("Schedule Services") — a genuinely different field set,
      so built as its own form rather than stretching `SendInquiryForm` with more optional props.
    - Verified via Playwright: 10-item service checklist, 6 service boxes with correct titles AND each
      one's own distinct icon (confirmed via each icon's path data, not just box count — specifically
      re-checked after the mapping mistake above), correct href split (1-4 dead, 5-6 real), download-app
      section renders, "Schedule A Services" form shows all 6 fields, CTA banner background renders
      full-bleed with the dark overlay, zero console/page errors. Lint and `tsc --noEmit` clean.

46. **faqs.html → `/faqs`.** New `FaqsAccordionSections` (`src/components/faqs/`) — the page this
    project's rules doc already flagged as "exercises `.flat-toggle` accordion", and the one page whose
    structure actually breaks the assumptions baked into the existing `FaqAccordion` (#41/#42).
    - This page has 3 separate `.flat-accordion` groups ("How To Buy?" / "Exchanges & Returns" /
      "Refund Questions", 5+4+3 = 12 questions total) — every other page that's used the accordion
      pattern so far (calculator, sell-your-car, financing) only ever had ONE group per page, so a
      per-instance `useState` inside `FaqAccordion` was indistinguishable from "global" single-open
      behavior there. This page is the first real test of that assumption, and it breaks it.
    - **Verified directly against the real static source HTML before writing any code** (not assumed
      from re-reading the JS): opened `../aurexo/faqs.html` in a browser via Playwright and confirmed (1)
      only ONE question on the ENTIRE PAGE starts open (the very first question in "How To Buy?") — the
      other two groups' own first items do NOT independently default-open, contrary to an initial
      assumption that each group would mirror the first group's "item 0 starts active" pattern; and (2)
      clicking a question in "Exchanges & Returns" actually closes whatever was open in "How To Buy?" —
      the "only one open at a time" state is genuinely GLOBAL across all 3 groups, matching
      `app.js`'s real handler selecting `$('.flat-accordion .flat-toggle')`/`.toggle-content` unqualified
      by which specific accordion instance the click came from (see `FaqAccordion`'s own header comment
      for that handler's full behavior).
    - Built as a NEW component (`FaqsAccordionSections`, taking an array of `{heading, items}` sections)
      with ONE shared `useState<string | null>` keyed by question text (globally unique across all 3
      sections) — rather than retrofitting cross-instance shared state into the already-shipped, working
      single-group `FaqAccordion`, which stays untouched and correct for its existing 3 consumers. Reuses
      the same CSS grid `grid-template-rows: 0fr -> 1fr` smooth-animation technique `FaqAccordion`
      established (#42's follow-up) for the open/close transition.
    - Source repeats the same two answer texts across 10 of the 12 questions (confirmed via direct
      source read, not a transcription shortcut): every group's own 1st question gets the same 2-
      paragraph "purchase steps" answer, every group's 2nd question gets just that answer's first
      paragraph alone, and the remaining 7 questions all get the same generic "An auto loan is a sum of
      money..." blurb already seen verbatim on calculator/sell-your-car/financing.
    - Verified via Playwright: 12 questions across 3 groups render, initial state matches source exactly
      (only the first question starts open), clicking a question in a different group closes whichever
      one was open elsewhere (confirmed globally, not just within its own group), zero console/page
      errors. Lint and `tsc --noEmit` clean.

47. **404.html → `src/app/not-found.tsx`.** Used Next.js's built-in `not-found.tsx` convention (as
    already noted as the plan in `MIGRATION_STATUS.md` before this page was actually built) instead of
    a manual `/404` route — Next.js renders this automatically both for any genuinely unmatched path and
    for every explicit `notFound()` call this project's dynamic `[slug]` routes already use (e.g.
    sale-agents-details, dealer-details).
    - Source's own 404.html has NO header/footer at all — a real, standalone bare document (confirmed:
      `.error-page` is a `height: 100vh` centered flex layout in `assets/scss/inner-page.scss`,
      consistent with there being no site chrome to make room for) — reproduced the same way, this page
      intentionally has no `<Header>`/`<Footer>`.
    - The root layout's own global mounts (`Preloader`, `WowInit`, every hidden modal, `BackToTop`)
      still wrap this page regardless, since Next.js's App Router always renders `not-found.tsx` inside
      the root layout — there is no per-page opt-out short of restructuring the entire route tree into
      route groups with separate layouts, which isn't warranted just for a 404 page. Disclosed as an
      accepted, structurally unavoidable difference from source's completely bare document rather than
      silently treated as a non-issue.
    - Verified via Playwright: navigating to a genuinely unmatched path returns a real HTTP 404 (not a
      200 masquerading as an error page), correct heading/body copy, confirmed zero `<header>`/`<footer>`
      elements in the DOM, "Back To Homepage" real-navigates to `/` (a first check raced the client-side
      navigation and looked like a no-op — re-checked with `page.waitForURL` and confirmed it does
      navigate, a test-timing artifact rather than a real bug, same category of false alarm as several
      earlier pages this session), zero unexpected console/page errors. Lint and `tsc --noEmit` clean.

48. **coming-soon.html → `/coming-soon`.** New `ComingSoonHero`/`CountdownTimer`
    (`src/components/coming-soon/`). Closes out the "System pages" category alongside #47 (28/63 pages
    migrated overall — still 35 pages remaining across the home/blog/add-listings/dealers/shop/
    dashboard/utility families, see `MIGRATION_STATUS.md`'s TODO rows).
    - **A genuinely real, working countdown** — the rare exception this session to "unwired forms/
      calculators are UI_ONLY." Traced `assets/js/count-down.js` in full (not just its opening lines,
      learning directly applied from #46's mistake): on load it computes an end time as `now +
      data-timer seconds`, builds digit markup, and re-renders every second via `setInterval` until it
      hits zero — genuinely live, not decorative. Reproduced as `CountdownTimer`, a real `useState` +
      `setInterval` component computing days/hours/mins/secs the same way (integer division, same
      remainder chain). Source's own `getTimeFormat` zero-pads hours/mins/secs to 2 digits but leaves
      `days` unpadded (`this.days.textContent = days`, no padding call) — preserved as that exact
      asymmetry, not "fixed" into padding days too for consistency.
    - `data-timer="1065550"` is literally seconds-from-page-load, not a fixed calendar target date — so
      the countdown always restarts at ~12.3 days remaining on every fresh page load. This is source's
      own literal rolling-demo behavior (confirmed via the JS: `getEndTime()` only supports `data-timer`
      OR `data-countdown`, and this page uses the seconds-based one), not a bug to "fix" into a real
      fixed launch date that doesn't exist anywhere in source.
    - Source has NO header/footer at all — a genuinely bare, `width/height: 100vw/100vh` standalone
      page (confirmed in `assets/scss/inner-page.scss`) — same situation as 404.html (#47), reproduced
      the same way (no `<Header>`/`<Footer>`), with the same accepted root-layout-still-wraps-it caveat.
    - Reuses the same `.overlay-parallax`/`.overlay.image` full-bleed background pattern already
      established for sell-your-car.html's `GetInTouchBanner` and services-center.html's
      `ContactScheduleSection` (SimpleParallax not pulled in, Package Principle) — third page to use
      this exact pattern, still no shared component extracted for it since each usage differs enough in
      surrounding layout (centered text vs. 2-column contact form vs. this page's own split-screen
      layout) that a forced abstraction wouldn't clearly pay for itself yet.
    - Source's own background image filename is `comming-soon.jpg` (double "m", a real asset-naming
      typo) — kept as the literal path, not renamed to the "correct" spelling.
    - Subscribe form (`action="#"`, confirmed no script touches `emailcoming-soon`) is UI_ONLY, same
      treatment as every other unwired form this session. Needed its own `"use client"` directive once
      the inline `onSubmit` preventDefault was added — the same class of build error `SendInquiryForm`
      and `ContactScheduleSection` hit earlier (a component with an inline event handler needs its own
      client boundary regardless of what renders it) — caught and fixed before reporting, not shipped.
    - Verified via Playwright: zero `<header>`/`<footer>` elements, countdown shows 12 days initially
      and its seconds digit genuinely decremented across a real 3-second wait (not just re-rendering the
      same static value), background image renders full-bleed, zero console/page errors. Lint and
      `tsc --noEmit` clean.

49. **terms.html → `/terms`.** New `TermsSection` (`src/components/terms/`). 29/63 pages migrated
    overall — 34 remaining across the home/blog/add-listings/dealers/shop/dashboard/utility families,
    see `MIGRATION_STATUS.md`'s TODO rows.
    - 5 static Lorem-ipsum sections (Terms / Limitations / Revisions and errata / Site terms of use
      modifications / Risks) plus a sidebar nav of anchor links (`#section1`-`#section5`) — the only new
      real behavior here is the sidebar's own sticky/unstick positioning, traced from `app.js`'s
      `checkPosition()`/`scrollSidebar()` in full (learning from #46 applied again: read the whole
      function before judging real-vs-decorative).
    - **A CSS-only `position:sticky` replacement was tried first and rejected** after Playwright caught
      it silently not working. The site's own `#wrapper{overflow:hidden!important}` (`reset.scss`,
      present in source too) becomes the containing block for any `position:sticky` descendant — but
      since `#wrapper` itself never scrolls (the window/html does), a sticky element inside it never
      re-anchors and just scrolls off with the page. This is the one place this session where the usual
      "small CSS-only equivalent beats porting legacy scroll-listener JS" call (used successfully for
      the FAQ accordion's grid-rows animation, the static Google Maps embeds) doesn't hold up once
      checked against the site's actual global layout — so the imperative scroll-listener was ported
      faithfully instead: a `"use client"` component with `useEffect` + refs on `#scrollContainer`
      (`.term-page`) and `#sidebarSticky` (the nav `<ul>`), replicating `checkPosition()`'s exact math
      (`container.offsetTop + container.clientHeight - nav.clientHeight - 100` vs. `window.scrollY`, and
      `container.getBoundingClientRect().top` vs. the real `.header` element's `offsetHeight`) to toggle
      the existing compiled `.menuFixed`/`.menuSticky` classes — both rely on `position:fixed`/
      `position:absolute`, neither of which is affected by an ancestor's `overflow:hidden`.
    - Confirmed via `grep -rl "sidebarSticky\|scrollContainer" *.html` that this id pair is used on no
      other page site-wide — a one-off, not a pattern to extract into a shared hook yet.
    - No scroll-spy/active-link-highlighting exists anywhere in source for this nav (confirmed via
      search) — only the whole nav's own sticky/unstick position toggles, individual links never get an
      "active" state. `.section:not(:first-child){margin-top:-60px;padding-top:100px}` (already in the
      existing compiled CSS) is source's own anchor-scroll-offset trick accounting for the fixed header —
      plain `<a href="#section1">` links need no extra JS to land correctly.
    - Breadcrumb's "Pages" crumb is a plain non-link `<span>`, same established pattern as
      sell-your-car.html/clients-reviews.html/financing.html/services-center.html/faqs.html. Already
      linked from `src/data/menu.ts` ("Terms of use" → `/terms`) — no nav change needed.
    - Verified via Playwright: h2/breadcrumb/all 5 nav labels/all 5 section headings match source
      exactly, clicking a nav anchor lands that section at the top of the viewport, and — critically —
      bounding-box sampling at multiple scroll depths confirmed the sidebar genuinely pins at `top:94`
      while scrolling through the content and then switches to bottom-locked within its own column once
      scrolled past (both real state transitions, not just that `position` computes to something
      plausible). Zero console/page errors. Lint and `tsc --noEmit` clean.

50. **contact-us.html → `/contact-us`.** New `ContactMap`/`ContactInfoFormSection`
    (`src/components/contact-us/`). 30/63 pages migrated overall — 33 remaining across the
    home/blog/add-listings/dealers/shop/dashboard/utility families, see `MIGRATION_STATUS.md`'s TODO
    rows. `/contact-us` itself was already a real link target site-wide (header nav's "Contact" item,
    footer's "Contact Us" link, and several CTA buttons on already-migrated pages like
    services-center.html/sell-your-car.html/financing.html/about-us.html) well before this page's own
    route existed — this migration just fills in the route those links were already pointing at.
    - **No breadcrumb section on this page** — confirmed via source grep. Every other page in the
      `(other-pages)` route group so far has had one (even if its "Pages" crumb is a dead `<span>`); this
      is the first genuine exception, not an oversight.
    - Full-bleed Google Maps `<iframe>` embed at the top of the page (`ContactMap`) — same "no real map
      library pulled in" call as `AgentSidebar`/`DealerSidebar`'s own embeds (Package Principle).
    - The "Follow Us On social media" 6-icon row is assembled from **two different pre-existing icon
      sources**, confirmed via direct path-data comparison rather than visual guessing: Facebook/TikTok/
      Amazon/Pinterest are byte-for-byte identical to `Footer.tsx`'s own social row (Facebook differs by a
      consistent ~0.004 coordinate offset — a separate icon export, visually indistinguishable, not
      preserved as a second near-duplicate asset), while the X and Instagram icons are actually the
      stroke-outline `XIcon`/`InstagramIcon` from `common/SocialIcons.tsx` (the about-us/sale-agents
      Executive Team set) — NOT the footer's fill-logo X/Instagram. Moved the shared facebook/tiktok/
      amazon/pinterest path data out of `Footer.tsx` into a new `src/data/socialIconPaths.ts` once this
      page needed the same artwork a second time (same "extract into shared files once a second feature
      needs it" precedent as `SocialIcons`/`Pagination`/`SendInquiryForm`); `Footer.tsx` now imports from
      there instead of holding its own copy, with no visual or behavioral change to the footer itself
      (re-verified via Playwright after the refactor). All 6 links on this page are source's own literal
      dead `href="#"`, preserved as-is.
    - Contact form (First Name/Last Name/Email/Phone Number/Message) is UI_ONLY — confirmed no script
      anywhere touches `Firstname`/`Lastname`/`SendInquiryemail`/`SendInquiryphone`/`message` on this
      page, same treatment as every other unwired form this session. It's a genuinely different form from
      `SendInquiryForm` (different field set/layout — separate first/last name, no subject dropdown, no
      disclaimer checkbox) despite sharing a couple of field ids/names, so it's its own component, not a
      reuse. Source's own "First Name" field is prefilled `"Tony"` (same demo-name convention as
      `SendInquiryForm`'s `"Tony Nguyen"`); "Last Name" is empty.
    - While debugging a Playwright test that couldn't find `#LoginModal`/`#SignUpModal`/etc. in the DOM on
      this (and every other) page, discovered `common/Modal.tsx` never actually applies `id={id}` to its
      wrapping `<div>` — a pre-existing gap unrelated to this task (the shared component's DOM element has
      no `id` attribute at all, on any page using it). Functionally harmless: the app opens/closes modals
      entirely through `ModalProvider`'s React context and the `.active` class, never by querying a DOM
      id, and nothing currently links to a modal via `href="#SomeModal"`-style anchor — confirmed the
      Sign In modal still opens correctly (`.modal.active` class toggles, content renders) via direct
      testing. Flagged here for visibility since it surprised a test assumption, not fixed as part of this
      page's own scope.
    - Verified via Playwright: zero breadcrumb elements, map iframe renders, info column (address/phone/
      hours + all 6 social icons) and form column both render, filling and submitting the form doesn't
      navigate away, the header's Sign In button still opens `LoginModal` correctly on this page (via the
      real `.active`-class mechanism), zero console/page errors. Lint and `tsc --noEmit` clean.

51. **compare.html → `/compare`, plus a genuine new site-wide compare feature.** New `CompareTable`
    (`src/components/compare/`), `CompareProvider` (`src/components/common/`). 31/63 pages migrated
    overall — 32 remaining across the home/blog/add-listings/dealers/shop/dashboard/utility families,
    see `MIGRATION_STATUS.md`'s TODO rows.
    - **Everything about "compare" in source is decorative.** Traced `app.js`'s `compareModal()` in
      full (learning from #46 applied again): it only removes items from a hardcoded static 3-item
      list and toggles the empty state — nothing anywhere ever adds a real clicked listing. The
      header's compare badge was a literal hardcoded `data-badge="2"`, and `compare.html` itself is a
      static 4-column table (one column, "2024 Hyundai Elantra," is literally repeated 3 times with
      different card images — a genuine source content quirk, not reproduced now that real data drives
      the page).
    - Per the user's explicit request ("dựa vào việc bấm compare ở phần card-box để thêm vào page
      compare, tôi muốn cập nhật số lượng compare ở trên thanh header"), built a real feature rather
      than just migrating the decorative demo:
      - **`CompareProvider`** — new shared Context (`compareItems`, `addToCompare`, `removeFromCompare`,
        `isComparing`), same "small shared Context for a cross-tree UI need" precedent as
        `ModalProvider`. Mounted in `layout.tsx` wrapping `ModalProvider`. Adding is idempotent (same
        listing id clicked twice doesn't duplicate) and holds real `ListingCardData`, not just ids, so
        every consumer can render without an extra lookup.
      - **`ListingCard`/`HalfMapListingCard`** — the only two components with a "Compare" trigger
        site-wide (confirmed via grep). Their click handler now calls `addToCompare(listing)` before
        `openModal("CompareModal")` (previously only the latter).
      - **`Header`** — the compare icon's `data-badge` now reads `compareItems.length` from the real
        context instead of a hardcoded string, omitted entirely (not `"0"`) when empty so no empty badge
        circle renders; required a small `header.scss` addition
        (`&:not([data-badge])::after { display: none; }`) since `content: attr(data-badge)` alone still
        renders an empty circle when the attribute is simply absent.
      - **`CompareTrayModal`** — previously a local `useState` seeded with 3 hardcoded fake "2017 BMV X1
        xDrive 20d xline" items (byte-identical demo data regardless of what was "compared" — there was
        no such thing); now reads/removes from the real `CompareProvider` state, so it shows whichever
        listings were actually clicked.
      - **`CompareTable`** (this page) — renders a dynamic N-column table (not a fixed 4) from real
        compare state. Reuses `withDetailFallback()` (`src/data/listings.ts`, already established for
        `/listing-details/[slug]`) for the Color/Location/Interior/Engine/VIN/Stock Number rows, since a
        card alone only ever carries `spec` (mileage/year/fuel/transmission) — only listing id 1 has
        real per-listing values for those 6 extra fields; every other listing falls back to that same
        template's real, source-derived values, never invented fresh. Verified this is genuinely
        per-listing where real data exists (a Genesis Electrified G80 compared alongside a Ford Mustang
        and Porsche showed its own distinct Diesel/51600-mile/2021 spec row, not copied from the others)
        and genuinely shared where it doesn't (Color/Location/Interior/Engine/VIN/Stock Number were
        identical across all 3 in that same test, as `withDetailFallback` intends). Empty state (no
        items compared) shows a message + a real "Browse Listings" link to `/listing-grid4-columns`
        rather than source's demo table with nothing to fall back to.
      - **Real bug found and fixed during verification, not source's fault**: navigating from the tray's
        "Compare" link to `/compare` is a client-side `Link` navigation that doesn't remount the root
        layout, so without an explicit `closeModal()` call the tray stayed stacked open on top of the
        destination page (a real full page load in source would have reset this for free). Fixed by
        calling `closeModal()` in the tray's own "Compare" link `onClick`.
      - **Unrelated pre-existing gap noticed while debugging Playwright selectors** (not fixed, out of
        scope): `common/Modal.tsx` never applies `id={id}` to its wrapping `<div>` on ANY modal, on any
        page — harmless today since the app opens/closes purely via `ModalProvider`'s context and the
        `.active` class, never by querying a DOM id, but it means a raw `#LoginModal`-style CSS/test
        selector will never match anything. Flagged for visibility only.
    - Breadcrumb's "Pages" crumb is a genuine `<a href="/index.html">` here — the only page site-wide
      where it's a real (if functionally pointless, it just points at home) link instead of the dead
      `<span>Pages</span>` seen on sell-your-car.html/clients-reviews.html/financing.html/
      services-center.html/faqs.html/terms.html/contact-us.html — preserved as that real href, not
      "corrected" into the dead-span pattern used everywhere else.
    - Verified via Playwright end-to-end: badge starts absent, clicking Compare on a real card shows
      that real listing in the tray (not source's fake BMW) and sets the badge to 1, adding a 2nd
      different card shows both real listings and sets the badge to 2, re-clicking an already-added
      card is idempotent (stays at 2), navigating to `/compare` renders exactly those listings in a real
      table (tested at 2 and 3 columns) with the badge still correct on that page, removing a column
      shrinks the table and decrements the badge live, removing the last one shows the empty state and
      the badge disappears, zero console/page errors. Lint and `tsc --noEmit` clean.

52. **product-details.html → `/product-details/[slug]`, plus new "Shop family" data/cart
    infrastructure.** New `src/data/products.ts` (canonical `Product`/`ProductCardData`/`allProducts`/
    `withProductDetailFallback`); `ProductGallery`/`ProductInfo`/`ProductTabs`/`ProductReviews`/
    `RelatedProducts` (`src/components/product-details/`); `CartProvider`/`ShoppingCartModal`
    (`src/components/common/`), plus a small `StarRatingInput` parameterization and a new `(shop)` route
    group. 32/63 pages migrated overall — 31 remaining across the home/blog/add-listings/dealers/
    dashboard/utility families, see `MIGRATION_STATUS.md`'s TODO rows.
    - **Data model, mirroring `listings.ts`'s established shape.** shop.html (the product grid) hasn't
      been migrated yet, so only the 4 real "Related Products" cards from this page's own carousel were
      captured as card-only stubs alongside the 1 fully-analyzed product (id 1, this page's own
      subject) — same "one fully-analyzed record + card-only stubs falling back to it" shape as
      `Listing`/`allListings`, via a new `withProductDetailFallback` mirroring `withDetailFallback`
      field-for-field. A future shop.html migration should extend `allProducts`, not re-derive its own
      dataset. Every product link in source (shop.html's grid AND this page's own carousel) points at
      the literal same static `product-details.html` file with no per-product identifier — the same
      "no working per-item route in source" situation `listing-details-1..6` had — so `id`/`slug` here
      are synthetic, same convention as `Listing`.
    - **Multiple real, disclosed source content mismatches on this one page**, all preserved verbatim
      rather than reconciled (see `products.ts`'s own field comments for each): the breadcrumb literally
      reads "Wheel/Rim for Passenger & CUV" while the actual product shown is "Fog Light Lamp
      White/Yellow Dual Colors" — notably, product id 5 in this same dataset (a related-product stub)
      IS actually titled "Wheel/Rim for Passenger & CUV", strong circumstantial evidence of what the
      breadcrumb was originally meant to reference, left as two separate unreconciled records exactly as
      found (same category of finding as the Listing data model's "Audi A6 Avant e-tron" investigation).
      The "Description" tab's content is entirely generic e-commerce shirt copy (LENZING™ ECOVERO™
      Viscose, Babaton embroidered crest) with zero connection to any car part. The "Shipping & Returns"
      tab shows a generic Privacy Policy instead. The Add-to-Cart button's own label literally reads
      "$79.99" while the real displayed price is "$90.00" (before a further "$128.99" old-price/"-25%"
      discount) — confirmed via `shop.js` that the price actually added to the cart is parsed from the
      displayed `.price` element, not this button's own text, so the button label is genuinely
      decorative/wrong, not a bug to silently correct. The gallery's main swiper shows 4 identical slides
      while its 4 thumbnails differ (only 1 pairs correctly) — same broken-pairing pattern
      `DetailsGalleryWithThumbs` already found on listing-details-3.html; reproduced with one real synced
      image set (the 4 real thumbnails) for both sliders per that same established precedent, in a new
      `ProductGallery` (no "Play Video"/"View All Photo" overlay buttons here, confirmed absent from
      source, hence its own small component rather than reusing `DetailsGalleryWithThumbs` verbatim).
    - **A genuinely new, real cart feature** — NOT scoped to this page's decorative migration by
      default, but justified because `shop.js`'s cart is itself real in source (traced in full: a
      localStorage-backed `getCartItems`/`saveCartItems`/`addCartItem`/`updateSubtotal` system,
      confirmed NOT decorative like compare.html's demo was). `CartProvider` (new Context, same
      "small shared Context" precedent as `ModalProvider`/`CompareProvider`) reproduces `addCartItem`'s
      exact same-name+price+image merge-by-quantity rule; `ShoppingCartModal` (new, mounted globally,
      added to `ModalProvider`'s `ModalId` union) replaces the modal's hardcoded empty `.your-order`/
      static "$186,99" subtotal with real items and a real computed sum; removing the last item
      auto-closes the modal, mirroring `shop.js`'s own remove handler. Deliberately scoped to what THIS
      page needs — the rest of `shop.js` (1200+ lines: shop.html's own grid-from-`product.json`
      rendering, a separate wishlist/favorites system, shopping-cart.html's own quantity-editing rows)
      is out of scope and belongs to those pages' own future migrations. The shipping progress bar
      ("free shipping" at a fixed 75%) is confirmed static/decorative in source (no script recomputes it
      from the real subtotal) and stays fixed here too.
    - **Quantity selector's +/- icons found genuinely dead in source on THIS specific page** — traced
      `app.js`/`shop.js` in full: a real, delegated `.quantity-selector__btn--plus/minus` handler exists
      and is genuinely wired elsewhere (shopping-cart.html's own item rows, the QuickViewModal) using
      the exact same widget, but this page's own markup is missing those exact classes on its +/- SVGs,
      so the generic handler never binds here — a markup oversight, not intentionally decorative.
      Reproduced as real increment/decrement (clamped to a minimum of 1, matching `addCartItem`'s own
      clamp) since it's clearly this exact widget's already-established real behavior elsewhere in the
      same source file, not new design invented for this migration.
    - **`ProductReviews` is a new component, not a reuse of `common/ReviewsSection`** — per the variant
      classification rule: a genuinely different DOM shape (`comment-box style2`, a per-review title
      line `ReviewsSection`'s shared `Review` type has no field for, a "N Comments" + sort-dropdown row
      `ReviewsSection` doesn't render, a differently-laid-out add-review form). `StarRatingInput`
      (`listing-details/`) gained optional `activeIcon`/`inactiveIcon`/`wrapperClassName` props instead
      of a duplicate file, since only its icon/wrapper skin differs here (`star-4`/`star-7`,
      `rating-input-style2` vs. the original's `star-4`/`star-3`, plain `rating-input`) — same
      click-to-set-active-star behavior either way. The "Sort by" dropdown reproduces `app.js`'s real
      `core-dropdown` open/close/label-swap widget, but source's own 3 options are literal
      "Most Recent"/"Most Recent 2"/"Most Recent 3" placeholders with no actual re-sort ever applied —
      matches that exact limitation, not a new real sort invented. `ProductTabs` defaults to the
      "Customer Reviews" tab active (confirmed via source's own `active` class placement), not
      "Description" — same "respect the page's own real `defaultActive`" precedent as `FeatureTabs`.
    - `QuickViewModal` triggers exist on `RelatedProducts`' cards (`data-modal-id="#QuickViewModal"`)
      but no such modal exists anywhere on THIS page (confirmed via search of product-details.html
      specifically) — left with no click handler here. **Correction from #53**: shop.html DOES define a
      real `#QuickViewModal` — it was simply never included on product-details.html's own page. Once
      shop.html's migration built the real `QuickViewModal` (`common/`), `RelatedProducts`' eye icon was
      NOT retrofitted to open it, since product-details.html's own source genuinely has no such modal to
      trigger — the two pages' real behavior differs here, and each is reproduced faithfully to its own
      page rather than homogenized.
    - A first Playwright run 500'd with a generic "Jest worker encountered 2 child process exceptions"
      error; a clean `.next` cache + dev server restart resolved it on the first real compile (30s cold
      compile, then clean) — a stale dev-server worker/cache artifact, not a code defect (lint and
      `tsc --noEmit` were already clean beforehand, and the route compiled and rendered correctly once
      given a fresh worker).
    - Verified via Playwright: all real/decorative distinctions above confirmed by direct interaction
      (not assumed), a stub product (`shadow-blackout-coating`) correctly shows its own real title/price
      while falling back to the template's specs/gallery/rating/reviews, an unknown slug 404s, zero
      console/page errors. Lint and `tsc --noEmit` clean.

53. **shop.html → `/shop`.** New `ShopSidebarSection`/`ShopProductCard`/`ShopFilterFields`/
    `ShopFilterTagsRow`/`useShopFilters` (`src/components/shop/`); `QuickViewModal` (`common/`); reused
    `Pagination`/`RangeSlider`/`FilterIcon` verbatim (`listing/`+`common/`); 5 new `allProducts` records
    (ids 6-10) + `ProductShopMeta`/`getShopProducts()` (`src/data/products.ts`). 33/63 pages migrated
    overall — 30 remaining across the home/blog/add-listings/dealers/dashboard/utility families, see
    `MIGRATION_STATUS.md`'s TODO rows.
    - **Major finding that reshaped this task's data model**: traced `shop.js`'s `loadProductsFromJson()`
      in full (learning from #46/#52 applied again — read the whole function, not an excerpt) and
      discovered the static 9-card `#product-list` markup in source is a dead no-JS fallback,
      unconditionally overwritten at load by `fake_data/product.json` (9 real records with real
      `category`/`branding` fields the fallback lacks). Critically, the JSON has NO `oldPrice` field at
      all and a non-empty `promotion` string for only 2 of 9 products — so the real, live shop.html
      shows fewer promo badges and zero old-price strikethroughs than the inert fallback would suggest.
      Modeled as a new `Product.shop?: ProductShopMeta` field, deliberately kept separate from each
      product's pre-existing top-level `promotion`/`oldPrice` fields (which reflect product-details.html's
      own "Related Products" carousel — genuinely static there, since that page has no `#product-list`
      id for the JSON loader to ever touch) — the exact same conceptual product legitimately shows two
      different real promo states across its two real host pages; not reconciled, both are real and
      independently disclosed in `products.ts`'s own field comments.
    - Per the user's explicit instruction ("dựa vào content ở product-details tạo data cho product chỗ
      phần thumbs thì chỉ cần thay ảnh đầu tiên của product là được"), `withProductDetailFallback`'s
      gallery fallback (`products.ts`) now swaps only slide 1 for the product's own real card photo,
      reusing the template's real remaining thumbnails (product-11/12/13.jpg) for slides 2-4 — a full
      4-slide gallery instead of collapsing to one image, matching the same "generic filler + one real
      photo" precedent already established for `/listing-details/[slug]`'s own gallery fallback.
    - **`QuickViewModal` (new, global) — genuinely real here, unlike on product-details.html** (see #52's
      correction note). Traced the click handler in full: a real, if unusual, real/static split — the
      modal's own displayed title/price/specs/gallery NEVER change per product (always the same
      "Fog Light Lamp White/Yellow Dual Colors" demo content — its OWN third distinct image set,
      product-1..5.jpg, different again from product-details.html's product-10..13.jpg gallery for that
      same demo product), while the "Add to Cart" button's total price and the item actually added to
      the cart ARE resolved from whichever real product card was clicked. Reproduced faithfully — not
      "fixed" into a real per-product quick view — via a new optional `payload` parameter on
      `ModalProvider.openModal`/`modalPayload` on its context (a minimal, backward-compatible extension:
      every existing `openModal(id)` call site is unaffected).
    - **Real category/branding/price-range filtering**, mirroring `shop.js`'s own genuinely-live
      `applyShopFilters`/`updateShopFilterTags` (category and branding checkboxes actually narrow the 9
      real products by their real `shop.category`/`shop.branding` values). Source's own `#slider-range`
      bounds are hardcoded `data-min="120" data-max="750"` regardless of the real $68-$5,983 product
      range (the cheapest and priciest real products could never be reached by that slider) — same call
      as `useListingFilters`'s own price-range recalibration: compute the real min/max from the actual
      data ($60-$5,990 rounded) instead of reproducing source's own broken, mismatched bounds.
    - **Real pagination** (standing rule for any page with `.pagination` markup) — 6 products/page splits
      the 9 real products into 2 real pages, reusing the shared `Pagination` component verbatim.
    - "Sort by" stays a decorative label-swap dropdown — confirmed via full search that `shop.js` has NO
      sort-triggering logic anywhere (unlike the Listing family's own deliberate real-sort enhancement,
      built as an explicitly disclosed net-new feature there) — not silently duplicating that enhancement
      here since it wasn't asked for and wouldn't be reproducing this page's actual real source behavior.
    - Category/Branding checkbox counts (12/43/21/5/17/27/17, 12/23/4/16) are source's own literal
      placeholder numbers, unrelated to the 9 real products' actual distribution (e.g. "Cleaning System"
      matches zero real products) — preserved verbatim as decorative labels, same "checkbox filters for
      real, count is decorative" split already applied to the Listing family's own filter fields. The
      search input has no matching handler anywhere in source (confirmed via search) — UI_ONLY. The
      mobile "Advanced Search" popup's own body is genuinely empty in source (header + close button
      only, confirmed via direct read) — preserved empty, not filled with fields it never had.
    - Verified via Playwright: real 6+3 pagination split, real "Showing X-Y of 9 Products" count,
      checking a real Category checkbox (Tools) narrows to exactly its 2 real matches, checking a real
      Branding checkbox (Fram) narrows to its 3 real matches, filter tags show/remove correctly and reset
      to the full 9, price-range shows the real computed $60-$5,990 span, Quick View opens with the
      always-static Fog Light Lamp content but a genuinely dynamic "Add to cart - $&lt;real price&gt;"
      total, and adding from there puts the REAL clicked product (confirmed NOT "Fog Light Lamp...") into
      the real cart, zero console/page errors. Lint and `tsc --noEmit` clean.

54. **shopping-cart.html → `/shopping-cart`.** New `ShoppingCartSection`/`OrderSummarySidebar`
    (`src/components/shopping-cart/`); `CartProvider` gained `updateQuantity` + real `localStorage`
    persistence; `RelatedProducts` (`product-details/`) gained `headingClassName`/`enableQuickView`
    props for its second real caller. 34/63 pages migrated overall — 29 remaining across the
    home/blog/add-listings/dealers/dashboard/utility families, see `MIGRATION_STATUS.md`'s TODO rows.
    - **Traced `renderShoppingCartItems()` in full** (learning from #46/#52/#53 applied again): its own
      opening comment reads "If no items in localStorage, keep default HTML (do nothing)" — the 3
      hardcoded rows in source's static markup are a real empty-cart FALLBACK, not decorative filler
      sitting ignorantly on top of real data. Reproduced the same way: `ShoppingCartSection` shows these
      exact 3 rows only while `CartProvider`'s real cart is empty.
    - Every one of those 3 fallback rows carries 3 mutually disconnected numbers that never agree with
      each other — row 1's unit price is "$60.00" but its own total-price text reads "1 X $120.00"; row
      2's quantity input shows "3" but its total reads "2 X $80.00"; row 3's input shows "3" but its
      total reads "1 X $60.00". Preserved as three independent literal strings per row rather than
      "fixed" into consistent math. Their quantity/remove controls render `disabled` here instead of
      wired to a second, disconnected local-state machine — source's own real handlers for these
      specific rows are equally inert in practice (`updateCartItemQuantity` looks the item up by
      `data-item-id`, which these particular rows never carry, so the real handler silently no-ops
      beyond a cosmetic `$input.val()` write) — reproducing that "looks interactive, does nothing"
      outcome wasn't worth a second disconnected state machine for demo-only rows.
    - **Traced `updateShoppingCartSubtotal()` in full**: it only ever updates the row whose first
      `<span>` text is literally "Subtotal" — Discounts and Total are never touched by any script, so
      they stay permanently static ("-$8.00", "$186,99") even once Subtotal itself goes real. Reproduced
      with that exact split — Subtotal is the only real, computed field in `OrderSummarySidebar`.
    - **Found and fixed a real persistence gap, not just a page-scope gap**: `CartProvider`'s own header
      comment already claimed to reproduce `shop.js`'s localStorage-backed cart, but it only ever held
      state in memory. Playwright caught the real regression this caused once a dedicated cart PAGE
      existed: adding an item on `/shop` and then hard-navigating to `/shopping-cart` (a real URL visit,
      not a same-session `<Link>` transition) lost the item, since in-memory Context state doesn't
      survive a real page reload the way source's actual `localStorage` does. Fixed by adding real
      `localStorage` sync under the same `shopping_cart_items` key source uses, hydrating once
      client-side after mount (so SSR/first paint still renders the empty/fallback state with no
      hydration mismatch). Worked through a subtler ordering bug during the fix itself: gating the
      persistence effect with a `useRef` flag doesn't actually work, because a ref is one mutable box
      shared across renders — the persistence effect (running in the same commit right after the
      hydration effect) would see the ref already flipped `true` while still closing over the STALE
      pre-hydration `items` from that same initial render, briefly overwriting real stored data with
      `[]` before a later render corrected it. Switched to a `useState` hydration flag instead, so both
      `isHydrated` and `items` are always read consistently from the same render — no transient
      incorrect write.
    - **Reused `RelatedProducts` verbatim rather than rebuilding it** — confirmed via direct source diff
      that shopping-cart.html's own "Related Products" carousel is byte-identical to product-details.html's
      (same 4 products, same promos/old-price, same dead `href="#"` on the 4th title). Parameterized the
      2 real per-page differences instead of duplicating: `headingClassName` (this page's heading isn't
      centered — `mb-40`, not product-details.html's `mb-40 text-center`, confirmed via source diff), and
      `enableQuickView` (this page's eye icon opens a REAL `QuickViewModal` — source defines one here,
      unlike product-details.html where the identical trigger has no matching modal at all; each page's
      own real behavior is reproduced on its own terms rather than homogenized across every reuse site).
    - Breadcrumb is only 2 crumbs (Home > Shopping Cart) — confirmed via source read, no "Pages" middle
      crumb here unlike most other pages in this route group. "Update Cart" and "Apply Coupon" have no
      matching handler anywhere in source (quantity edits already apply immediately via the real +/-
      and typed-value handlers, so there's nothing left to "commit") — both UI_ONLY. The flash-sale
      "04:48 minutes" countdown and the 50% progress bar are both confirmed static (no script touches
      either) — unlike coming-soon.html's genuinely real countdown, these never tick or recompute.
    - **Post-verification behavior change, per explicit user request**: the 3 static fallback rows
      (and `OrderSummarySidebar`'s matching static "$80.00" Subtotal) described above were removed —
      emptying the real cart now shows a genuine empty state ("Your cart is currently empty" + a
      "Continue Shopping" link to `/shop`) instead. This is a deliberate departure from source's own
      literal fallback-when-empty behavior: showing 3 unrelated demo products right after a user's own
      remove action read as confusing, and it also makes this page consistent with how
      `ShoppingCartModal`/`CheckoutOrderSummary` already handle an empty cart (nothing, not demo
      filler). Subtotal is now always real (a genuinely empty cart shows real "$0.00"); Discounts/Total
      remain permanently static, unaffected by this change.
    - Verified via Playwright (updated after the empty-state change above): a fresh/empty cart shows
      the real empty state (0 `.cart-item` rows, "Your cart is currently empty", a working "Continue
      Shopping" link to `/shop`, real "$0.00" Subtotal), adding 2 real items on `/shop` and hard-
      navigating to `/shopping-cart` shows both with a real computed Subtotal, real quantity +/- updates
      both the row total and the sidebar Subtotal live, removing every real item returns to the same
      real empty state (not the old static fallback rows), Related Products renders the same 4 products
      as product-details.html, zero console/page errors. Lint and `tsc --noEmit` clean.

55. **check-out.html → `/check-out`.** New `CheckoutForm`/`BillingDetailsForm`/`PaymentAccordion`/
    `CheckoutOrderSummary` (`src/components/checkout/`); `CustomSelect` (`common/`, generic, first
    real caller). 35/63 pages migrated overall — 28 remaining across the home/blog/add-listings/
    dealers/dashboard/utility families, see `MIGRATION_STATUS.md`'s TODO rows.
    - **Per the explicit request to pull real cart contents here**: traced `shop.js`'s `renderCartItems()`
      again — the function targeting the generic `.your-order` class (shared with `ShoppingCartModal`),
      NOT shopping-cart.html's own dedicated `#shopCartItems`/`renderShoppingCartItems()` (a different
      function with a different real fallback-to-static-demo-rows behavior, see #54). `renderCartItems()`
      unconditionally empties and repopulates `.your-order` from real data with no fallback special case
      at all, so `CheckoutOrderSummary` shows nothing when the cart is empty — a deliberate,
      source-confirmed divergence from shopping-cart.html's own page, not an inconsistency between the
      two. Traced `updateSubtotal()`/`updateShoppingCartSubtotal()` again too: neither's selector scope
      matches anything on this page, so Shipping/Discounts/Total stay permanently static regardless of
      real cart contents (only the order line items themselves are real, matching source exactly).
    - **Real bug found and fixed during verification, not just found**: the new `PaymentAccordion` (same
      single-open CSS grid-rows technique as `common/FaqAccordion`, keyed by which payment radio is
      selected rather than a question index) initially rendered its default-active "Credit Card" panel
      at zero visible height despite carrying the `active` class and `grid-template-rows: 1fr` correctly
      — caught via a Playwright bounding-box check, not assumed working from the class alone. Root cause:
      `flat-accordion.scss` gives `.toggle-content` a base `display: none` rule that source's own jQuery
      `slideDown()` overrides with an inline `display: block` directly on that element — `FaqAccordion`
      already carries this exact override (`style={{ display: "block" }}`) but it was missed when
      building this new sibling component; fixed by adding the same override, re-verified the panel
      genuinely expands (316px, not 0px).
    - Every one of the 4 payment panels' own fields (Name On Card/Card Numbers/mm-yy/CVV/Save Card
      checkbox) is identical copy-pasted markup — even Apple Pay and PayPal show literal credit-card
      fields, and the PayPal panel's own payment icon `alt` text is "paypalPayment" (not "Payment" like
      the other 3, confirmed via source diff) — preserved verbatim, not customized per payment type.
    - New `CustomSelect` (`common/`) reproduces `app.js`'s real `selectOptions()` widget (open/close +
      value selection, closes on outside click) for the Country/Region and State fields — generic (no
      page-specific typing) so a future page needing the same single-value dropdown can reuse it
      instead of re-implementing the open/close/select logic. Source's own State select reuses the
      literal same "Canada"/"Viet Nam" option list as the Country select above it (confirmed via source
      diff) — preserved verbatim, not filled with invented state/province names.
    - Breadcrumb is only 2 crumbs (Home > Check Out) — same pattern as shopping-cart.html. "Place Order"
      has no real order-processing handler anywhere in source (a static template, no backend) — UI_ONLY,
      via a small `CheckoutForm` client-boundary wrapper around just the `<form onSubmit>` so `page.tsx`
      itself could stay a server component with a real `metadata` export instead of the whole route
      needing `"use client"` for one preventDefault.
    - Verified via Playwright: empty-cart order summary shows zero items (no fallback), payment accordion
      defaults to Credit Card genuinely expanded, single-open switching confirmed by clicking Cash on
      Delivery, Country/State custom-selects genuinely update on selection, a real product added on
      `/shop` survives the hard navigation to `/check-out` and shows correctly with no fallback rows,
      Shipping/Discounts/Total stay their real static source strings, zero console/page errors. Lint and
      `tsc --noEmit` clean.

56. **blog-details-1.html → `/blog-details-1/[slug]`.** New `src/data/blogPosts.ts`
    (`BlogPost`/`BlogPostCardData`/`allBlogPosts`/`withBlogPostDetailFallback`, mirroring the established
    `listings.ts`/`products.ts` shape); `BlogDetailsBanner`/`BlogPostBody`/`BlogComments`/`BlogSidebar`/
    `RelatedArticles` (`src/components/blog-details/`). 36/63 pages migrated overall — 27 remaining across
    the home/blog/add-listings/dealers/dashboard/utility families, see `MIGRATION_STATUS.md`'s TODO rows.
    - **Same "one fully-analyzed record + real card-only stubs falling back to it" pattern as listings/
      products.** A site-wide grep confirmed every blog card anywhere in Aurexo's 63 files points at the
      single literal `blog-details-1.html` file — there is no working per-post route in source at all, the
      same situation `listings.ts`/`products.ts` were built around. Only id 1 (this page's own real
      subject, "Compact SUV vs. Full-Size SUV") has real detail content (intro/quote/sections/conclusion/
      tags/comments, all read directly from this page). Ids 2-4 are real card data — NOT invented — copied
      verbatim from `financing.html`'s `NewsTipsSection` (titles/images/categories/dates/excerpts); they
      fall back to id 1's real body content via `withBlogPostDetailFallback` while still rendering their
      own real title/category/date/breadcrumb, same precedent as `withListingDetailFallback`/
      `withProductDetailFallback`.
    - **Real cross-family reference found and deliberately left as-is, not rewired**: this page's own
      Previous/Next nav literally names 2 of those same 3 titles ("Truck vs. Minivan..."/"Tires:
      All-Season vs. Summer vs. Winter...") but its real `href` points at `blog-details-2.html` — a
      genuinely different, not-yet-analyzed template (already flagged in `MIGRATION_STATUS.md`'s TODO row
      for that file: "diff vs. blog-details-1 before assuming shared layout"). Kept as a literal
      `/blog-details-2` link instead of silently rewiring it to this page's own matching stub slug, since
      that would fabricate a routing relationship source itself doesn't have. `RelatedArticles`' 3 slides
      (all sharing source's own literal identical title, "2025 BMW 5 Series Priced From $59,375; i5 EV
      From $68,275", confirmed via direct source read — not a transcription shortcut) and `BlogSidebar`'s
      4 "Recent posts" cards do the same, both genuinely linking to `/blog-details-2` in source.
    - **Real bug found and fixed during verification**: `BlogDetailsBanner` threw `Error: Event handlers
      cannot be passed to Client Component props` on every single load (confirmed via dev-server log, not
      just a blank screenshot) — its by-author/date/category meta links are dead `href="#"` with
      `onClick={(e) => e.preventDefault()}`, but the component itself was a plain Server Component. Fixed
      by adding `"use client"`, matching the same boundary already correctly drawn on `BlogComments`/
      `BlogSidebar` (which both needed it for their own UI_ONLY form `onSubmit` handlers).
    - Also updated `financing/NewsTipsSection.tsx` now that `allBlogPosts` exists: its 3 cards previously
      all linked generically to the same `/blog-details-1` (the only option before this dataset existed);
      now each imports `allBlogPosts.slice(1, 4)` directly and links to its own real `/blog-details-1/
      [slug]`, matching the same "wire a pre-existing generic link to its own real per-item slug once real
      data exists" precedent already used for dealer-details.html.
    - `common/SocialIcons.tsx`'s `FacebookIcon`/`XIcon`/`InstagramIcon`/`SkypeIcon`/`TelegramIcon` (path
      data confirmed byte-identical to this page's own share-icons and author-box icons) reused directly
      rather than re-transcribed a 4th time; `BlogComments`' 2nd comment reproduces a real, minor source
      markup inconsistency (missing the `h5` class on that one commenter's name, present on the other 2).
    - Verified via Playwright: real title/breadcrumb/banner render for the fully-analyzed post, quote/
      4 sections/conclusion/2 tags/3 share icons all render, "03 Comments" + 3 real comments render
      (including the markup quirk above), comment form is UI_ONLY, sidebar (author box, 6 categories,
      4 recent posts, 6 type-car entries, newsletter, 9 tags) renders, Related Articles swiper renders its
      3 slides, the stub post `luxury-suvs-vs-crossovers` shows its own real title/category while falling
      back to id 1's real quote/sections, an unknown slug returns real HTTP 404, `/financing`'s cards now
      link to 3 distinct real slugs, zero console/page errors after the `BlogDetailsBanner` fix above. Lint
      and `tsc --noEmit` clean.

57. **blog-standard.html → `/blog-standard`.** New `BlogStandardList` (`src/components/blog-standard/`);
    `Pagination` (reused, `common/`); `allBlogPosts` extended with ids 5-8 (`src/data/blogPosts.ts`).
    37/63 pages migrated overall — 26 remaining across the home/blog/add-listings/dealers/dashboard/
    utility families, see `MIGRATION_STATUS.md`'s TODO rows. (Its sidebar was originally a page-specific
    `BlogStandardSidebar` — later extracted to `common/BlogListingSidebar` once blog-list.html needed the
    same thing, see #58.)
    - **Extended the blog data model with this page's own real content, not invented.** Confirmed via
      source read that every card here (the featured `.post-style-2` + all 6 `.post-style-6` grid cards)
      literally links to the same static `blog-details-1.html` file, same site-wide pattern already
      established in `blogPosts.ts`. One title exactly matches the existing id 1 ("Compact SUV vs.
      Full-Size SUV...", appearing twice in the grid with 2 different images — `post-20.jpg`/`post-24.jpg`,
      neither matching id 1's own `cardImage`, a real 3-way image mismatch for the same conceptual article
      across 3 site locations now, preserved not reconciled). The other 4 distinct titles found only on
      this page ("Sports Cars vs. Luxury Cars...", "Hybrid vs. Electric Cars...", "Diesel vs. Gasoline
      Engines...", "Manual vs. Automatic Transmission...") became new real stub entries, ids 5-8, using
      each one's most complete/prominent real occurrence for the canonical `cardImage`/`category`/`date`/
      `excerpt` — e.g. id 5's excerpt is taken from the grid's own "Sports Cars..." card (`post-21.jpg`,
      category "EXPERT REVIEW") since the featured-position occurrence of that same title has no excerpt
      text at all in source, only a title+meta row. Id 8's `cardImage` (`post-23.jpg`) happens to be the
      exact same file already used by id 4's "Tires: All-Season..." (from `NewsTipsSection`) — a second
      real image reused across two unrelated titles, also preserved as-is.
    - **Deliberately did NOT extend the sidebar's "Recent posts" widget the same way.** Its 4 cards
      (post-25..28, byte-identical to `blog-details/BlogSidebar.tsx`'s own set) are decorative filler
      repeated verbatim across every blog page analyzed so far, never once the actual subject of any
      detail page — extending `allBlogPosts` for every filler card sighted anywhere on the site would be
      unbounded scope creep beyond the page actually being migrated. Since source's own literal `href` for
      this widget on THIS page is `blog-details-1.html` (confirmed via source diff — the *same* 4 cards
      point at `blog-details-2.html` instead on `blog-details-1.html`'s own sidebar, a real per-page
      difference, not an error), all 4 link to the one real slug that file now maps to
      (`/blog-details-1/compact-suv-vs-full-size-suv`) rather than 404ing or inventing 4 more posts.
    - This page's sidebar (`BlogStandardSidebar` at the time, since folded into `common/BlogListingSidebar`
      — #58) is a separate component from `blog-details/BlogSidebar.tsx`, not a shared variant: source's
      own markup here has no author bio/social box at all (confirmed absent, not an oversight — the
      sidebar starts directly at the search form), a genuine DOM-structure difference, not just a modifier
      class, justifying the "separate component" branch of the variant-classification rule.
      Categories/Type Car/Tags links go to `blog-grid-style-1.html` here (not yet migrated) vs.
      `blog-standard.html` on the detail page's own sidebar — also preserved as a real per-page difference.
    - **Real, working pagination built per the standing rule**, despite source's own `.pagination` having
      zero backing JS anywhere in the site (confirmed via grep across `assets/js/`, same situation as
      dealers-listing.html/sale-agents.html originally were). The featured card sits above the grid and
      is NOT part of the paginated set (matches source's own DOM order — a sibling before the grid, not
      its first item). 6 real grid posts split evenly into 2-per-page, landing on exactly the 3 pages
      source's own literal "1 2 3" markup shows — no invented or dropped post needed, same lucky
      alignment as clients-reviews.html's 9 reviews/3 pages.
    - Verified via Playwright: breadcrumb's real last crumb reads "News" (mismatching the `<h2>`'s own
      "Blog Standard" text — a real, disclosed source inconsistency, not fixed), featured card and all 6
      grid posts render with correct real content, clicking page 2 and page 3 genuinely swaps the 2
      displayed grid cards each time (not just toggling an `active` class), sidebar renders with zero
      author-box elements and the correct real link targets described above, a new stub post
      (`hybrid-vs-electric-cars`) resolves and correctly falls back to id 1's real quote/sections while
      showing its own real title, zero console/page errors. Lint and `tsc --noEmit` clean.
    - **Follow-up, explicitly requested** ("click phần item recent cũng cập nhật content blog details"):
      the "Recent posts" sidebar widget (shared verbatim by this page's `BlogStandardSidebar` and
      `blog-details/BlogSidebar`) originally pointed every one of its 4 cards at a single existing real
      slug rather than inventing new stub posts for what looked like decorative filler — the user then
      asked for clicking a Recent Posts card to actually navigate to that card's own real content. Added
      4 more real stub entries (ids 9-12 in `blogPosts.ts`, post-25..28's real title/image/category/date,
      no invented fields) and updated both sidebars to link each card to its own `/blog-details-1/[slug]`.
      This is a deliberate override of `blog-details/BlogSidebar`'s previously-preserved literal
      `blog-details-2.html` href for this widget (disclosed in entry #56) — same class of explicit,
      user-requested departure from source fidelity as the shopping-cart empty-state change (#54).
      `RelatedArticles`' swiper was NOT touched in this pass (out of scope of this specific request at the
      time — see the next follow-up below, where the user asked for it too).
      Verified via Playwright: both sidebars' Recent Posts hrefs now resolve to 4 distinct `/blog-details-1/
      [slug]` routes, clicking a card on either page lands on that post's own real title (confirmed via
      `page.waitForURL` + a fresh `h1` read, after an initial race-condition false alarm where reading the
      title immediately after `.click()` without waiting for the URL to change caught the PREVIOUS page's
      stale content — not a real bug, just a test timing issue), all 4 new slugs return HTTP 200 and their
      own correct title while falling back to id 1's real body content, zero console/page errors. Lint and
      `tsc --noEmit` clean.
    - **Second follow-up, same request extended to `RelatedArticles`** ("cập nhật cho phần Related Articles
      của blog-details nữa"): that component's 3 swiper slides also originally linked to the literal
      `/blog-details-2` (a real, previously-disclosed cross-family reference to a not-yet-migrated file,
      #56). Unlike the Recent Posts widget's 4 genuinely distinct titles, `RelatedArticles`' own 3 slides
      share ONE identical literal title in source ("2025 BMW 5 Series Priced From $59,375; i5 EV From
      $68,275", confirmed via direct source read, differing only by image/category) — the same
      repeated-placeholder pattern as the "Compact SUV..." duplicate in `BlogStandardList` (#57 above).
      Since all 3 are the same conceptual article, not 3 distinct ones, added only ONE new stub entry
      (id 13 in `blogPosts.ts`, using the first slide's real image/category as canonical) rather than 3
      needlessly-identical slugs, and pointed all 3 slides at that single real
      `/blog-details-1/2025-bmw-5-series-priced`. Verified via Playwright: all 3 slide hrefs resolve to
      that one slug, the slug itself returns HTTP 200 with its own correct real title/category while
      falling back to id 1's real body content, zero console/page errors. Lint and `tsc --noEmit` clean.

58. **blog-list.html → `/blog-list`.** New `BlogListContent` (`src/components/blog-list/`); extracted
    `BlogListingSidebar` (`common/`, was page-specific `blog-standard/BlogStandardSidebar` before this
    page needed the same thing); `Pagination` (reused, `common/`). 38/63 pages migrated overall — 25
    remaining across the home/blog/add-listings/dealers/dashboard/utility families, see
    `MIGRATION_STATUS.md`'s TODO rows.
    - **`.post-style-7` is a plain `<div>`, not an anchor** — unlike blog-standard.html's fully-clickable
      `.post-style-2`/`.post-style-6` cards, only the title itself (`<a class="title">`) is a real link
      here; "Read More" is source's own literal dead `href="#"` (confirmed via grep, no backing JS
      anywhere), reproduced as inert rather than upgraded to the same real destination the title already
      has — not part of what was asked for, and source itself never wires it.
    - **All 5 titles here exactly match existing `allBlogPosts` entries** (ids 1/5/6/7/8, all added while
      migrating blog-standard.html) — no new stub posts needed this time, a genuine data-model payoff from
      that earlier work. Each occurrence still carries its own distinct real image/category/excerpt,
      differing from both the canonical `allBlogPosts` record AND blog-standard.html's own occurrence of
      the same title (e.g. "Sports Cars vs. Luxury Cars..." now has a 3rd real image — `post-23.jpg`,
      after `post-18.jpg`/`post-21.jpg` on blog-standard.html — and a 3rd distinct excerpt, its first one
      that's actually specific to sports/luxury cars rather than a generic reused blurb) — a 3rd real,
      disclosed instance of the "same conceptual article, inconsistent per-page presentation" pattern,
      preserved as literal local card data rather than reconciled into one canonical version.
    - **Extracted the sidebar into `common/BlogListingSidebar`** rather than duplicating
      `BlogStandardSidebar`: source diff confirmed the two pages' sidebars are byte-identical (same
      categories/counts, same 4 recent posts, same tags list) except ONE real difference — Tags' href is
      `blog-grid-style-1.html` on blog-standard.html vs. `blog-details-1.html` here — exposed as a
      `tagsHref` prop. Same "extract into `common/` once a second page needs it" precedent as
      `Pagination`/`SocialIcons`. This page's own literal `blog-details-1.html` Tags href (the generic
      file, not a per-tag destination) resolves to the one real slug that file now maps to
      (`/blog-details-1/compact-suv-vs-full-size-suv`), same resolution already used for Recent Posts.
    - **Real, working pagination built per the standing rule**: source's own `.pagination` has zero
      backing JS (confirmed via grep), and its 5 real posts split 2-per-page (2+2+1) across exactly the 3
      pages source's own literal "1 2 3" markup shows — no 6th post needed to fill the last page evenly.
    - Verified via Playwright: page 1 shows the correct 2 real posts with real title-link hrefs resolving
      to their existing slugs, "Read More" stays inert (`href="#"`), clicking page 2 and page 3 genuinely
      swaps the displayed cards (page 3 correctly shows only 1 card, not 2), clicking a title link
      navigates to that post's own real content (confirmed via `page.waitForURL`, after the same
      click-then-immediate-`page.url()` race-condition false alarm already seen in #57's follow-up),
      sidebar's Tags/Categories/Type Car/Recent Posts hrefs all resolve as described above, `/blog-standard`
      still renders correctly after the sidebar extraction (regression-checked), zero console/page errors.
      Lint and `tsc --noEmit` clean.

59. **blog-grid-style-1.html → `/blog-grid-style-1`.** New `BlogGridStyle1Content`
    (`src/components/blog-grid-style-1/`); `Pagination` (reused, `common/`); `allBlogPosts` extended with
    id 14 (`src/data/blogPosts.ts`). 39/63 pages migrated overall — 24 remaining across the home/blog/
    add-listings/dealers/dashboard/utility families, see `MIGRATION_STATUS.md`'s TODO rows.
    - **No sidebar on this page** — confirmed via source read, a genuinely different layout from
      blog-standard.html/blog-list.html (both have an `.innerpage__sidebar`): a single full-width
      3-column `.post-style-6` grid inside its own `.container`, matching source's real DOM exactly.
    - **8 of the 9 titles here already exist in `allBlogPosts`** (ids 1-8, previously added while
      migrating blog-standard.html/blog-list.html, plus id 2 originally sourced from financing.html's
      `NewsTipsSection`) — strong further confirmation that this handful of demo titles is the site's
      actual recurring "template article" set, not a coincidence limited to 2 pages. Only "Electric vs.
      Internal Combustion Engine (ICE) Cars" (`post-24.jpg`, category "TREND") is genuinely new, added as
      id 14. Every occurrence still carries its own distinct real image/category/excerpt (e.g. "Sports
      Cars vs. Luxury Cars..." now has its own 4th real image across the site — `post-18.jpg`, matching
      id 5's own canonical `cardImage` for once, purely coincidentally) — a 4th real, disclosed instance
      of the "same conceptual article, inconsistent per-page presentation" pattern, preserved as literal
      local card data rather than reconciled.
    - Following the sale-agents.html/dealers-listing.html precedent for a grid+pagination page with no
      shared outer wrapper needed between them: the grid gets its own `<div className="container">` and
      `Pagination` renders as a sibling (supplying its own `.container` internally) rather than nesting
      one container inside another, which source's own single shared wrapper would otherwise produce.
    - **Real, working pagination built per the standing rule**: source's own `.pagination` has zero
      backing JS (confirmed via grep), and its 9 real posts split evenly into 3-per-page across exactly
      the 3 pages source's own literal "1 2 3" markup shows — same lucky alignment as
      clients-reviews.html's 9/3.
    - Verified via Playwright: zero `.innerpage__sidebar` elements present, page 1 shows the correct 3
      real cards, clicking page 2 and page 3 genuinely swaps the displayed cards (9 posts confirmed across
      all 3 pages with no duplicates/gaps), clicking a card navigates to and correctly shows that post's
      own real title, the new stub post (`electric-vs-ice-cars`) resolves with its own real title while
      falling back to id 1's real body content, zero console/page errors. Lint and `tsc --noEmit` clean.

60. **blog-grid-style-2.html → `/blog-grid-style-2`.** New `BlogGridStyle2Content`
    (`src/components/blog-grid-style-2/`); `Pagination` (reused, `common/`). 40/63 pages migrated overall
    — 23 remaining across the home/blog/add-listings/dealers/dashboard/utility families, see
    `MIGRATION_STATUS.md`'s TODO rows.
    - **No sidebar** (confirmed via source read, same as blog-grid-style-1.html) — a full-width tabbed
      grid instead: 3 tabs ("Car Reviews"/"Maintenance Tips"/"Buying Guides") each showing their own
      `.post-style-8` grid (a 3rd distinct blog-card shape: image + white overlaid title + meta row, no
      excerpt paragraph at all, confirmed via source).
    - **Real tab switch, not decorative**: traced `app.js`'s `tabs()` again — it binds unconditionally to
      any `.flat-tabs .menu-tab` child (`li`, regardless of whether it wraps a `<span>` like this page's
      tab labels do, or an `<a>`), same confirmed-real mechanism already used for sell-your-car.html's
      License Plate/VIN tabs. Reproduced with a simple `activeTab` index state.
    - **All 9 titles across all 3 tabs already exist in `allBlogPosts`** (ids 1-8, 14 — the same set
      established across blog-standard.html/blog-list.html/blog-grid-style-1.html) — no new stub posts
      needed, further confirming this is the site's genuinely recurring template-article set, not a
      per-page coincidence. `post-19.jpg` is a new real image for "Hybrid vs. Electric Cars..." (every
      other page so far used `post-44.jpg`) — a 3rd real image for that one title across the site,
      preserved as literal per-occurrence data rather than reconciled.
    - **The 3 tabs' post lists are literal subsets of each other**, confirmed via source read: Tab 2's 6
      posts are exactly Tab 1's last 6, Tab 3's 3 posts are exactly the middle 3 of those. Reproduced as 3
      separate literal arrays matching source verbatim rather than computing Tab 2/3 as a `.slice()` of
      Tab 1 — nothing in source's own markup guarantees that relationship as a rule rather than a
      coincidence of this particular demo content, and hand-authoring each avoids silently breaking Tab 2/3
      if a future edit changes Tab 1's list without them being related.
    - **Source's own single `.pagination` sits once, entirely outside all 3 `.content-inner` tab panes**,
      with zero backing JS anywhere (confirmed via grep) — the same "decorative, no real per-page split"
      situation as every other blog listing page. Since the 3 tabs have genuinely different real post
      counts (9/6/3), one shared pagination row could never correctly represent all three at once;
      reproduced instead as real, independent per-tab pagination (3/page: Tab 1 → 3 pages, Tab 2 → 2
      pages, Tab 3 → only 1 page, so no pagination renders at all for it, matching the established
      `{totalPages > 1 && <Pagination />}` convention from `SaleAgentsSection`). Switching tabs resets
      to page 1 of that tab.
    - Verified via Playwright: zero sidebar elements, Tab 1 shows 3 real cards on page 1 with 4 pagination
      links (3 pages + next), clicking through to page 3 shows the correct final 3 cards, switching to Tab
      2 resets to page 1 and shows exactly 3 pagination links (2 pages + next) with the correct real
      cards, switching to Tab 3 shows all 3 of its cards with NO pagination element rendered at all,
      clicking a card navigates to and correctly shows that post's own real content, zero console/page
      errors. Lint and `tsc --noEmit` clean.

61. **blog-grid-style-3.html → `/blog-grid-style-3`.** New `BlogGridStyle3Content`
    (`src/components/blog-grid-style-3/`); `Pagination` (reused, `common/`). 41/63 pages migrated overall
    — 22 remaining across the home/blog/add-listings/dealers/dashboard/utility families, see
    `MIGRATION_STATUS.md`'s TODO rows.
    - **No sidebar, no tabs** (confirmed via source read) — the simplest of the 4 blog-grid-family pages
      so far: one full-width 2-column `.post-style-9` grid + pagination.
    - **`.post-style-9` is a 4th distinct blog-card shape**: same image+white-overlaid-title+meta
      structure as `.post-style-8` (blog-grid-style-2.html), but a genuinely different class and a 2-column
      (not 3-column) grid layout — a real CSS/layout difference, not just a modifier, so a separate small
      component rather than a shared variant.
    - **All 8 titles here already exist in `allBlogPosts`** (ids 1/2/3/4/5/7/8/14) — no new stub posts
      needed, a 4th confirmation (after blog-standard/blog-list/blog-grid-style-1/blog-grid-style-2) that
      this handful of titles is the site's genuinely recurring template-article set. Every title still
      carries its own distinct real image (`post-33.jpg` through `post-39.jpg`, none reused from any
      other page analyzed so far) — a continuing instance of the "same conceptual article, different
      real image per page" pattern.
    - **Real, working pagination built per the standing rule**: source's own `.pagination` has zero
      backing JS (confirmed via grep), and its 8 real posts split 3-per-page (3+3+2) across exactly the
      3 pages source's own literal "1 2 3" markup shows.
    - Verified via Playwright: zero sidebar elements, page 1 shows the correct 3 real cards, clicking
      page 2 and page 3 genuinely swaps the displayed cards (page 3 correctly shows only 2, not 3),
      clicking a card navigates to and correctly shows that post's own real content, zero console/page
      errors. Lint and `tsc --noEmit` clean.

62. **blog-details-2.html → `/blog-details-2/[slug]`.** New `BlogDetails2Banner`/`BlogDetails2Content`
    (`src/components/blog-details-2/`); `BlogComments` (reused, `blog-details/`); `RelatedArticles`
    (reused, `blog-details/`, extended with a `centered` prop). 42/63 pages migrated overall — 21
    remaining across the home/blog/add-listings/dealers/dashboard/utility families, see
    `MIGRATION_STATUS.md`'s TODO rows.
    - **Confirmed via full source diff against blog-details-1.html that this is a genuine layout variant**
      of the same detail template, not a near-duplicate — the exact relationship `MIGRATION_STATUS.md`'s
      original TODO row flagged ("diff vs. blog-details-1 before assuming shared layout") turned out to
      matter: no breadcrumb section anywhere in this file (confirmed via grep, unlike every other blog/
      listing page), no `.innerpage__sidebar` at all, a centered single-column `.bloc-details-container`
      (`max-width: 1050px`) that visually overlaps the banner image above it via a pure-CSS negative
      margin (`blog.scss`'s `margin: -78px auto 0`, no JS needed), a different meta-row markup
      (`.bloc-details-tag-style-2` — icon+text pairs, not `blog-details/BlogDetailsBanner.tsx`'s plain
      text links), and the author "Mike Hanley" box embedded directly in the main content flow instead of
      a sidebar. Same "layout variant of one shared template" relationship already established for
      `listing-details-1..6` sharing one `allListings` dataset.
    - **Body text is byte-identical to blog-details-1.html's own** (intro/quote/4 sections/conclusion/
      tags, confirmed via source diff) — sourced from the exact same `allBlogPosts`/
      `withBlogPostDetailFallback`, no new text content authored. Only the banner image
      (`blog-details-2.jpg`) and body image (`post-43.jpg`) genuinely differ from blog-details-1.html's
      own (`blog-details.jpg`/`post-40.jpg`) — hardcoded directly in `BlogDetails2Banner`/
      `BlogDetails2Content` rather than sourced from `post.bannerImage`/`post.bodyImage`, since this is a
      static layout-variant page (only id 1 was ever analyzed against it) whose own demo assets don't
      vary per-post any more than `listing-details-2..6`'s did.
    - **Previous/Next literally link to `blog-details-1.html`** (the other real layout) with the exact
      same 2 titles ("Truck vs. Minivan..."/"Tires: All-Season...") already real slugs in `blogPosts.ts`
      (ids 3/4, added while migrating blog-standard.html) — wired directly to
      `/blog-details-1/truck-vs-minivan`/`/blog-details-1/tires-all-season-vs-summer-vs-winter` rather
      than a dead `#`.
    - **Comments section reused verbatim, not re-transcribed**: confirmed byte-identical to
      blog-details-1.html's own (same 3 comments, same markup quirk on the 2nd one, same comment-form
      default values) — `blog-details/BlogComments.tsx` imported directly and rendered inside this page's
      own `.bloc-details-container` div (source nests it there too, no sidebar column to split it into).
    - **`RelatedArticles` also reused, extended with a `centered` prop** rather than duplicated: source's
      3 slides here are byte-identical in every way (same images/categories/repeated title) to
      blog-details-1.html's own — the only real difference is a centered heading (`text-center` on both
      the `h2` and the subtitle `p`). Its link target needed NO per-page override: source's own href for
      this widget on THIS page already points at `blog-details-1.html`, which is exactly what the shared
      component's existing `/blog-details-1/2025-bmw-5-series-priced` link (added in #56's follow-up)
      already resolves to — a fortunate coincidence, not a coordinated design.
    - Updated `src/data/menu.ts`'s "Blog Details 2" entry to `/blog-details-2/compact-suv-vs-full-size-suv`
      (this layout's own analyzed subject) instead of the bare `/blog-details-2`, same precedent as
      `listing-details-2..6`'s own menu entries each pointing at a specific real item's slug.
    - Verified via Playwright: zero breadcrumb/sidebar elements, banner + centered title card render with
      the correct overlap layout (confirmed visually via screenshot), meta row/quote/sections/conclusion/
      tags/author-box all render, "03 Comments" + 3 real comments render, clicking Previous navigates to
      and shows `truck-vs-minivan`'s own real content, Related Articles heading is centered and all 3
      slides resolve to the real BMW slug, a stub post (`hybrid-vs-electric-cars`) resolves with its own
      real title while falling back to id 1's real quote, an unknown slug returns real HTTP 404, zero
      console/page errors on a clean load (an initial run showed one 404 resource error that turned out
      to be from an intentional not-found test reusing the same page instance, not a real bug — confirmed
      by re-running a clean isolated load). Lint and `tsc --noEmit` clean.

63. **dashboard.html → `/dashboard`.** First page of the new Dashboard/account family. New
    `(dashboard)/layout.tsx` + `DashboardShell`/`DashboardSidebar`/`DashboardHeader` (shared shell,
    `src/components/dashboard/`); `DashboardStats`/`CarViewsChart`/`DashboardListingsTable`/
    `RecentReviews` (this page's own content, `dashboard/`); `CoreDropdown` (new, generic,
    `common/`). 43/63 pages migrated overall — 20 remaining across the home/blog/add-listings/dealers/
    dashboard/utility families, see `MIGRATION_STATUS.md`'s TODO rows.
    - **Genuinely new global layout, not a variant of anything existing**: `body class="dashboard
      overflow-hidden"`, a persistent `.dashboard-sidebar` + `.dashboard-content` app-shell (no
      `<Footer>` at all, confirmed via source), its own header missing the standard header's search/
      compare/wishlist icons and desktop "Sign In" button entirely (confirmed via source — a real user is
      presumably already inside the dashboard). `DashboardHeader` reuses the same `Nav`/`MobileMenu`/
      `Offcanvas` pieces as `header/Header.tsx` (the mega-menu itself is identical) but assembles its own
      reduced outer JSX rather than bolting more variant props onto the heavily-shared `Header` component.
    - **`body`'s per-route class problem**: Next's root `layout.tsx` owns the single shared `<body>` tag,
      but this route needs `dashboard overflow-hidden` while every other route needs a plain body.
      `DashboardShell` applies/removes those classes via `useEffect` (add on mount, remove on unmount) —
      the standard Next.js per-route body-class pattern, first needed by this page.
    - **Real mobile sidebar toggle, not decorative**: traced dashboard.html's own trailing inline
      `<script>` (page-specific, NOT in `app.js`) in full — a real, working ≤1200px sidebar toggle:
      button click toggles `active`/`sidebar-open`/`dashboard-sidebar-open` on the sidebar/container/body,
      closes on an outside click (only below 1200px), and resets on any resize back above 1200px.
      Reproduced as `useState` + `useEffect` window/document listeners in `DashboardShell`.
    - **Real bug found and fixed during verification**: the outside-click-to-close handler was initially
      scoped to `event.target` being outside the WHOLE `.dashboard-container` — which contains the
      always-visible main content too, so clicking anywhere in the content area (the vast majority of the
      viewport) never registered as "outside" and the sidebar never closed. Caught via Playwright
      (clicking outside left the `active` class in place). Fixed to check specifically against
      `.dashboard-sidebar`/`.dashboard-toggle-btn` via `closest()`, matching source's own jQuery
      `.closest('.dashboard-sidebar')`/`.closest('#dashboardToggleBtn')` scoping exactly; re-verified the
      sidebar now genuinely closes on an outside click.
    - **`CarViewsChart` reproduces a genuinely real, interactive canvas chart** — traced `app.js`'s
      `carViewsChart()` in full: real hover-tooltip behavior (nearest-point detection, smooth fade), not
      decorative. Reproduced as a plain SVG polyline + circles with the same real hover-tooltip behavior,
      rather than porting the source's manual canvas draw-loop and device-pixel-ratio scaling code
      (Package Principle — same real behavior, far simpler, SVG scales natively with no per-resize
      redraw needed). The "3/6/12 Month" range dropdown is real-but-decorative past its own label swap:
      traced the generic `.core-dropdown__option` click handler and confirmed it only ever updates the
      selected label/active class, never re-fetches or changes the chart's `data`/`months` arrays —
      matches source exactly. New `CoreDropdown` (`common/`) reproduces this generic real-open/close-
      decorative-select widget, reused for both this chart's range selector and the listings table's
      "Sort by" dropdown; deliberately NOT built on the existing `listing/SortDropdown` (which drives
      genuinely real re-sorting) or `common/CustomSelect` (different DOM classes, built for check-out.html's
      form selects) — a 3rd, distinct decorative-dropdown shape.
    - **`DashboardListingsTable`'s 3 real rows resolve to real listing slugs**: all 3 titles (Audi A6
      Avant E-Tron/Kia EV9 2024/Genesis Electrified G80) already exist in `allListings` — their "Car"
      link now goes to the real `/listing-details/[slug]` instead of source's dead `listing-details-1.html`
      every row literally uses. A real, disclosed source content bug is preserved: all 3 rows show "Audi"
      as the brand regardless of the actual car (Kia/Genesis included), and all 3 share the identical
      literal subtitle/price — not reconciled.
    - **Delete is real, not decorative**: traced dashboard.html's own trailing inline script again — a
      SECOND handler, `$(document).on('click', '.cart-item__remove', ...)`, generic and unscoped (unlike
      `shop.js`'s own `#shopCartItems .cart-item__remove` handler, which IS scoped) — confirmed it fires
      for ANY `.cart-item__remove` on the page, including this dashboard table's rows. Reproduced as real
      `useState` row removal; "Showing X to Y of Z entries" is now always computed from the real remaining
      count (replacing source's static, inflated "1 to 9 of 16 entries" — only 3 rows ever exist in
      source's own static markup), and deleting all 3 rows shows a real empty state rather than an empty
      table.
    - Search input and "Sort by" dropdown are both UI_ONLY past their own real open/close (confirmed no
      script ties either to an actual filter/re-sort of the 3 listing rows) — same treatment as other
      unwired search/sort controls already accepted elsewhere (e.g. shop.html's own "Sort by"). 4 stat
      cards (`DashboardStats`) and "Recent Reviews" (`RecentReviews`) are both static/decorative,
      confirmed via source — dead `href="#"` cards, no script touches the reviews section at all.
    - Verified via Playwright: sidebar's "Dashboard" item shows real active state (via `usePathname()`,
      not a hardcoded class), the chart's hover tooltip appears over the nearest data point with the
      correct month/value, the range dropdown opens/closes and swaps its label, deleting a row genuinely
      removes it and recomputes the entries count, deleting all 3 shows a real empty state, the mobile
      toggle button (confirmed visible only ≤1200px) opens the sidebar, an outside click and a resize back
      above 1200px both close it again, zero console/page errors. Lint and `tsc --noEmit` clean.
    - **Follow-up fix, found while migrating my-listings.html**: a real "Super Admin" user-menu dropdown
      (`.core-dropdown.user-admin` — avatar + name + chevron, opening the same 8 destinations as the
      sidebar via source's own inline SVG icons) sits in the header between the mega-menu and the "Add
      Listing" button on EVERY dashboard family page, including this one — missed entirely on first build
      (the header read stopped at the mega-menu and picked back up at the button row, skipping the ~90
      lines in between). Added new `DashboardAdminDropdown` (`dashboard/`) with real open/close and real
      active-item highlighting via `usePathname()` (source hardcodes a single `active` class instead);
      wired into `DashboardHeader`, which retroactively fixes this page too since it's the same shared
      component. Also switched `DashboardHeader`'s own `Nav` from a hardcoded `activePath="/dashboard"` to
      the real `usePathname()`, so every future sibling page highlights its own top-level nav item
      correctly instead of only ever matching dashboard.html. Re-verified via Playwright: the dropdown
      renders and opens/closes on `/dashboard`, its "Dashboard" item shows real active state there.

64. **my-listings.html → `/my-listings`.** Reuses `DashboardListingsTable` (extended with `title`/
    `initialListings` props, `dashboard/`). 44/63 pages migrated overall — 19 remaining across the home/
    blog/add-listings/dealers/dashboard/utility families, see `MIGRATION_STATUS.md`'s TODO rows.
    - **Byte-identical search/sort/table/pagination markup to dashboard.html's own "All Listing" box**
      (confirmed via source diff) — the only real differences are this page's own 5 listing rows and the
      absence of an inner "All Listing" heading (source has none here; the page-level "My Listings"
      heading, itself outside this component, already serves that role). Extracted
      `DashboardListingsTable` to accept `title`/`initialListings` props instead of duplicating the whole
      component, same "extract once a second page needs the same thing" precedent as `Pagination`/
      `SocialIcons`.
    - **4 of 5 "Car" links resolve to their real matching `allListings` slug** (Audi A6 Avant E-Tron/Kia
      EV9 2024/Chevrolet Camaro 2020/Genesis Electrified G80 all already exist there). "Lamborghini
      Aventador" has no matching record in `allListings` — rather than inventing a new listing just for
      this one dashboard row, its link falls back to the one real, fully-analyzed listing
      (`audi-a6-avant-e-tron`), same "generic fallback to one real destination" precedent already used for
      the blog family's Recent Posts widget when no per-item data exists.
    - Real, disclosed source content bugs preserved verbatim (confirmed via source read, not corrected):
      brand rarely matches the actual car — "Mustang" for the Chevrolet Camaro row, "Audi" for the
      Lamborghini row, "BMW" for the Genesis row — and every row shares the identical literal subtitle/
      price, same pattern already disclosed on dashboard.html's own table.
    - **Found the same `DashboardAdminDropdown` gap here too** — already fixed by the retroactive fix to
      `DashboardHeader` described in #63's own follow-up note above, since both pages share that component.
    - Verified via Playwright: no inner "All Listing" heading (matching source), all 5 real rows render
      with correct real content, "Car" links resolve as described above, "Showing 1 to 5 of 5 entries" is
      real, the sidebar's "My Listing" item AND the header's Super Admin dropdown's "My Listing" item both
      show real active state on this route, zero console/page errors. Lint and `tsc --noEmit` clean.

65. **add-listings-2.html → `/add-listings-2`.** New `AddListingsHeader`/`AddListingsForm`/
    `CarGallerySection`/`CarDetailsSection`/`FeaturesSection`/`CarPriceSection`/`LocationSection`/
    `VideoSection`/`AttachmentsSection`/`AddListingSelectDropdown` (all `src/components/add-listings-2/`
    at the time — `LocationSection`/`AddListingSelectDropdown` were later extracted to `common/` as
    `DealerLocationSection`/`FilterSelectDropdown` once my-profile.html needed the identical widgets, see
    #69's own note). 45/63 pages migrated overall — 18 remaining across the home/blog/add-listings/
    dealers/dashboard/utility families, see `MIGRATION_STATUS.md`'s TODO rows.
    - **Uses the exact same dashboard shell as dashboard.html/my-listings.html** (confirmed via source —
      `dashboard-container`/`dashboard-sidebar`/dashboard header, not a standalone page) — reuses
      `(dashboard)/layout.tsx` directly, no new layout needed.
    - **The original TODO note's guess was wrong, and that's worth recording**: `MIGRATION_STATUS.md`
      originally described this as "a layout variant of the same form" as add-listings.html. Reading both
      files in full for this task showed that's not true — add-listings.html's own content is a completely
      different "Your Package" pricing-tier section (2 tabbed panels), not this car-listing form at all.
      Disclosed rather than silently corrected in place; the real relationship between the two files (if
      any) will be re-examined when add-listings.html itself is migrated.
    - **All dropdown/field placeholder content is source's own literal generic demo data** ("Model 1/2/3",
      "Type 1/2/3", etc., confirmed via source read, not a transcription shortcut) — reproduced verbatim.
      Two real, disclosed source bugs preserved as-is: the "Doors*" dropdown's own 3 options are literally
      mislabeled "FuelType 1/2/3" (a direct copy-paste of the FuelType dropdown immediately above it,
      confirmed via source diff), and "Doors*" is used as a field label twice on this page — once for
      that dropdown, once for an unrelated free-text textarea at the very end of the Car Details section.
    - **New `AddListingSelectDropdown` reproduces `app.js`'s real `selectDropdown()`** (`.filter-select-
      dropdown`): traced in full — a genuine multi-select checkbox dropdown whose button text shows
      "Select" (none chosen), the single label (one chosen), or "N selected" (multiple), where opening any
      one dropdown closes every OTHER one on the page (source's own handler operates globally, not
      per-section). Deliberately not built on `listing/CheckboxDropdown` (wraps a
      `.search-cars__select-wrapper`/separate label this form's own markup doesn't have) or
      `common/CustomSelect` (single-select, different DOM entirely) — a 4th, distinct dropdown shape.
      `openDropdown` state is lifted to `AddListingsForm` specifically because the real "close all others"
      behavior spans multiple sections (Car Details' own fields AND Location's "Map Location" dropdown all
      participate in the same single-open-at-a-time group) — a per-section local state would have missed
      that cross-section coordination.
    - **Traced a real, page-specific trailing inline `<script>` (not `app.js`) for all 3 upload widgets**
      — genuinely real `FileReader`-based behavior, not decorative: Car Preview swaps its shown image via
      a real data-URL read on file selection; Car Gallery fills empty grid slots first then appends new
      ones up to a 6-image cap; Attachments really appends a new item (detecting `.pdf`/`.doc`/`.docx` by
      extension, silently skipping anything else) and its trash icon really removes that item. Reproduced
      as real React state per component rather than direct DOM mutation.
    - **Real finding via Playwright, not assumed from reading the script alone**: the Car Gallery upload
      is a genuinely real feature that is nonetheless effectively inert given source's own initial markup
      — the static gallery already ships with 7 images (all with real non-empty `src`, so the "find an
      empty slot" scan never finds one), and 7 already exceeds the script's own "only create a new slot
      below 6" cap, so a freshly uploaded file can never visibly appear in the grid as this page is
      actually authored. Reproduced exactly (the cap check starts `false` and stays that way) rather than
      "fixing" it to make uploads visibly work, since that would diverge from source's own real behavior.
    - "Save & Preview"/"List Now" are source's own literal dead `href="#"` (confirmed via grep — no
      script touches either) — UI_ONLY, matching precedent for other unwired form/CTA buttons.
    - `AddListingsHeader` needed its own `"use client"` boundary (same class of fix as
      `BlogDetailsBanner`/`DashboardStats` earlier this session) since its dead-link `onClick`
      preventDefault handlers can't live in the page's own Server Component alongside its `metadata`
      export.
    - Verified via Playwright: every dropdown opens/closes for real and correctly closes any other open
      one (confirmed across both Car Details and Location), multi-select shows "2 selected" after picking
      2 options, outside click closes an open dropdown, Car Preview upload genuinely swaps the shown image
      to a real `data:` URL, Car Gallery upload confirmed inert per the finding above (7 images before and
      after, matching source), Attachments upload genuinely adds a new item with the real uploaded file's
      name/type and the trash icon genuinely removes it (count 2→3→2), zero console/page errors. Lint and
      `tsc --noEmit` clean.

66. **my-favorites.html → `/my-favorites`.** New `WishlistProvider` (`common/`, mounted globally in
    root `layout.tsx`); `MyFavoritesGrid` (`my-favorites/`); extended `ListingCard`/`HalfMapListingCard`
    (`listing/`) and `Header.tsx`'s wishlist badge. 46/63 pages migrated overall — 17 remaining across
    the home/blog/add-listings/dealers/dashboard/utility families, see `MIGRATION_STATUS.md`'s TODO rows.
    - **A genuine new feature, not a like-for-like migration — per explicit request** ("lấy data từ việc
      product heart active"): traced `app.js`'s `heartList()` in full and confirmed source's own heart
      icon is real but shallow (`$(this).toggleClass('active')`, nothing else — no data tracking which
      listing was hearted anywhere), and `/my-favorites.html` itself is a fully static 6-card demo grid
      with zero connection to any card's heart state anywhere else in the site (same category of finding
      as `CompareProvider`'s own header comment describes for the compare feature).
    - **New `WishlistProvider` mirrors `CompareProvider`'s established shape exactly**: in-memory
      `useState<ListingCardData[]>` Context, no localStorage (same as Compare, unlike `CartProvider`,
      which does persist) — `wishlistItems`/`addToWishlist`/`removeFromWishlist`/`toggleWishlist`/
      `isWishlisted`. Mounted globally in root `layout.tsx` alongside `CompareProvider`/`CartProvider`.
    - **Wired into both existing card components with a `.heart` icon**: `ListingCard.tsx`
      (`.card-box-style-1`) and `HalfMapListingCard.tsx` (`.card-box-style-9`) — clicking the heart now
      really calls `toggleWishlist(listing)` and the `active` class is driven by `isWishlisted(listing.id)`
      instead of a bare, local `toggleClass`. `Header.tsx`'s wishlist badge (previously a hardcoded
      `data-badge="2"`, same class of pre-existing decorative-badge issue already fixed for the compare
      badge) now reads `wishlistItems.length`, `undefined` at 0 so the `::after` badge doesn't render at
      all — same `:not([data-badge])` CSS rule already in place for the compare badge.
    - **`MyFavoritesGrid` reuses `ListingCard` directly** rather than rebuilding the card — source's own
      `.card-box-style-1` markup on this page is byte-identical to the one already reproduced by that
      component (confirmed via source diff). Real empty state (`.compare-empty-state`, same shared class
      as Compare/shopping-cart's own empty states) renders when nothing is favorited; real, working
      pagination (6/page, standing rule) only renders once the real wishlist actually exceeds one page,
      replacing source's decorative static "1 2" markup.
    - Verified via Playwright end-to-end: `/my-favorites` shows the real empty state with nothing
      favorited, clicking a card's heart on `/listing-grid4-columns` genuinely toggles `.active` and
      updates the header's real badge (null → 2 after hearting 2 cards → 1 after un-hearting one, with the
      heart's own class correctly flipping back), navigating to `/my-favorites` via that same header link
      shows exactly those 2 real favorited listings with correct titles/specs/prices, removing a favorite
      from within `/my-favorites` itself (clicking its own heart there) also works and drops the count to
      1, zero console/page errors. Lint and `tsc --noEmit` clean.

67. **reviews.html → `/reviews`.** New `ReviewsSection`/`ReviewMoreMenu` (`src/components/reviews/`);
    `customerReviews` (new, `src/data/reviews.ts`, shared with `dashboard/RecentReviews`); `CoreDropdown`
    extended with optional `onChange`/`initialLabel` (`common/`). 47/63 pages migrated overall — 16
    remaining across the home/blog/add-listings/dealers/dashboard/utility families, see
    `MIGRATION_STATUS.md`'s TODO rows.
    - **Traced a real, page-specific trailing inline `<script>` (not `app.js`) in full — genuinely real
      filter/sort, unlike every other `.core-dropdown` migrated so far** (dashboard.html's chart-range/
      sort-by dropdowns, my-listings.html's sort-by — all confirmed decorative past their own label swap).
      This page's rating dropdown filters the real review list by a `data-start` attribute, and its date
      dropdown sorts by a parsed date — both real, reproduced as `useState` + `.filter()`/`.sort()` instead
      of source's own clone-and-reappend DOM approach.
    - **Extracted the 3 reviews into a shared `src/data/reviews.ts`** rather than a second hardcoded copy:
      confirmed via source diff that they're byte-identical to dashboard.html's own "Recent Reviews"
      widget (same names/avatars/dates/titles/text). `dashboard/RecentReviews.tsx` now imports from the
      same file — same "extract into a shared file once a second consumer needs it" precedent as
      `Pagination`/`SocialIcons`. Added a `dateIso` field (not in source) purely to drive the real sort,
      derived from each review's own displayed date string, not invented data.
    - **Extended the shared `CoreDropdown`** (previously label-swap-only) with two additions needed here:
      an optional `onChange` so a parent can react to a real selection (used for both the rating filter
      and the date sort), and an optional `initialLabel` to reproduce a real, disclosed source quirk — the
      date-sort dropdown displays "(Default)" with NEITHER "Desc" nor "Asc" shown as selected initially,
      even though the real default sort order is already descending internally (confirmed via source read:
      the JS variable defaults to `'desc'`, but neither option carries the source's own literal `active`
      class in the static markup). Reproduced exactly rather than "fixing" the display to match the real
      default. Both existing decorative consumers (dashboard.html/my-listings.html) are unaffected since
      neither passes the new props.
    - **All 3 real reviews are rating 5** (confirmed via source's own literal `data-start="5"` on every
      one) — filtering by 1/2/3/4 stars genuinely empties the list, matching source's real runtime
      behavior exactly, not a bug to "fix" by inventing lower-rated reviews.
    - New `ReviewMoreMenu` reproduces the per-review "..." menu (`.core-dropdown.more`) — traced `app.js`'s
      generic `coreDropdown()` handler, confirmed it opens/closes this variant for real too, but "Send
      Message"/"View Profile"/"Delete Review" are source's own literal dead `href="#"` (confirmed via grep)
      — real open/close, decorative menu items.
    - Search input is UI_ONLY (confirmed no script touches it, same treatment as other unwired search
      forms). No real pagination rendered at all — all 3 reviews always fit on one page regardless of
      filter/sort state; source's own static "1 2 3" markup had nothing behind it (only 3 reviews ever
      exist in source, same situation as dashboard.html's own listings table).
    - Verified via Playwright: filtering to "Rating 4" genuinely empties the list (0 results), "Rating 5"/
      "All Ratings" both correctly show all 3, sorting "Asc" genuinely reorders oldest-first and "Desc"
      genuinely reorders newest-first, the sort dropdown's initial label reads "(Default)" with no option
      highlighted, the per-review "..." menu genuinely opens/closes, zero console/page errors. Lint and
      `tsc --noEmit` clean.

68. **message.html → `/message`.** New `MessageContactList`/`MessageChat`/`MessageItem`/
    `MessageItemMenu`/`MessageOptionsMenu` (`src/components/message/`); `messageContacts` (new,
    `src/data/messageContacts.ts`). 48/63 pages migrated overall — 15 remaining across the home/blog/
    add-listings/dealers/dashboard/utility families, see `MIGRATION_STATUS.md`'s TODO rows.
    - **Traced this page's own real, page-specific trailing inline `<script>` in full** — two genuinely
      real features, reproduced as React state instead of source's direct DOM append/removal: sending a
      message (button click or Enter key) really appends a new sent bubble with the real current time and
      clears the input; deleting a message via its own "..." menu really removes just that message.
    - **Contacts are deliberately inert, not clickable tabs** — confirmed via grep that no script anywhere
      (`app.js` or this page's own script) ever reads any contact's real `data-contact` attribute, so
      clicking a different contact does nothing in source either. The conversation shown is permanently
      the one with John Smith (the only contact statically marked `active`). `MessageContactList` renders
      contacts with no `onClick` at all, matching that real absence of behavior rather than inventing a
      conversation-switching feature source never had.
    - **Two real, disclosed source content bugs preserved verbatim**: 2 of the 8 contact rows have an
      `<img alt>` reading "Theresa Webb" that mismatches their own visible name text ("Arlene McCoy" and
      "Brooklyn Simmons" respectively, confirmed via source read) — not corrected.
    - **Sent vs. received message bubbles have a genuinely different real DOM child order**: received
      bubbles render text then the "..." menu; sent bubbles render the menu then text (confirmed via
      source diff — a real CSS-driven alignment technique, not an authoring inconsistency) —
      `MessageItem.tsx` reproduces both orders exactly rather than picking one.
    - **Two distinct "..." menu shapes, not one shared component**: the per-message menu
      (`.message-item__options`, `MessageItemMenu`) uses an `<img>` trigger and a bare `ul.core-dropdown__menu`
      with `Reply`/real-`Delete`; the chat header's own menu (`.core-dropdown.more.style-2`,
      `MessageOptionsMenu`) uses a `<button>` trigger and a `div.core-dropdown__menu > ul.core-dropdown__list`
      with decorative `Block`/`Delete` — confirmed via source diff these are genuinely different DOM, not
      the same component with different content, so built as 2 separate small components rather than one
      over-parameterized one.
    - Attach button (paperclip icon) is source's own decorative UI_ONLY control — confirmed no script
      touches it.
    - **Post-verification fix**: `MessageContactList` initially threw `Error: Event handlers cannot be
      passed to Client Component props` — its UI_ONLY search-form `onSubmit` couldn't live in a Server
      Component, same class of fix already applied to `BlogDetailsBanner`/`AddListingsHeader` earlier this
      session — fixed by adding `"use client"`.
    - Verified via Playwright: 8 contacts render with only John Smith marked active, sending a message via
      both the send button and Enter genuinely appends a new sent bubble with the real current time and
      clears the input, deleting a message via its own "..." menu genuinely removes it (4 → 5 → 6 → 5
      across send/send/delete), the chat header's own "..." menu genuinely opens/closes, zero console/page
      errors. Lint and `tsc --noEmit` clean.

69. **my-profile.html → `/my-profile`.** New `ProfileForm`/`AvatarPosterUpload`/`ClearableInput`
    (`src/components/my-profile/`); extracted `FilterSelectDropdown`/`DealerLocationSection` to
    `common/` (shared with add-listings-2.html). 49/63 pages migrated overall — 14 remaining across the
    home/blog/add-listings/dealers/dashboard/utility families, see `MIGRATION_STATUS.md`'s TODO rows.
    - **Traced this page's own real, page-specific trailing inline `<script>` in full — two genuinely
      real features**, both reproduced as React state instead of source's own direct DOM mutation:
      (1) the avatar/poster upload really validates file size (4MB max) and type (PNG/JPG/SVG only,
      `alert()`-ing and rejecting on either failure) before reading the file via `FileReader` and swapping
      the preview image + showing the real file name; (2) every `.input-clear` field's own "X" clear
      button really shows only once that field has non-whitespace content and hides otherwise, and
      clicking it really empties the field and refocuses it.
    - **Extracted `FilterSelectDropdown` (was `add-listings-2/AddListingSelectDropdown`) and
      `DealerLocationSection` (was `add-listings-2/LocationSection`) into `common/`**: confirmed via
      source diff that this page's own "Location" section — Full Address input, "Map Location" dropdown,
      static Google Maps iframe — is byte-identical to add-listings-2.html's own, down to the literal
      `id="PriceListing"` on the address field. Same "extract into `common/` once a second page needs it"
      precedent as `Pagination`/`SocialIcons`; updated add-listings-2.html's own `AddListingsForm`/
      `CarDetailsSection` to import from the new shared location and regression-checked it still works
      (`/add-listings-2` still returns 200 and its dropdowns still function after the move).
    - **Real, disclosed source content bugs preserved verbatim** (confirmed via source read, not
      corrected): "Sales Phone*" and "Company*" both carry the literal value "themesflat@gmail.com" — an
      email address, not a phone number or company name, a direct copy-paste from "Email Address*" right
      next to them; "Phone*"'s own value has literal extra internal whitespace ("123  456  7890 ").
    - New `ClearableInput` (`my-profile/`) is a real controlled input reused for First Name/Last Name
      (plain) and all 6 Social Network fields (with their own leading platform icon via an optional
      `prefixIconSrc` prop) — one component covering both shapes rather than two near-duplicates.
    - "Become A Dealer" is source's own literal dead `href="#"` (confirmed via grep — no script touches
      it) — UI_ONLY, matching precedent for other unwired CTA buttons.
    - Verified via Playwright: the clear button on a pre-filled field ("First Name") shows immediately and
      hides after clicking clear (which also genuinely empties the field and refocuses it), an initially
      empty field's clear button appears in real time as soon as text is typed, uploading a real image
      file to both the avatar and poster inputs genuinely swaps each preview to a real `data:` URL and
      shows the real uploaded file name, zero console/page errors. Lint and `tsc --noEmit` clean.

70. **change-password.html → `/change-password`.** New `ChangePasswordForm` (`change-password/`);
    `PasswordInput` (new, `common/`, also retroactively wired into `LoginModal`/`SignUpModal`). Last page
    of the Dashboard/account family — all 7 pages now migrated. 50/63 pages migrated overall — 13
    remaining across the home/blog/add-listings/dealers/utility families, see `MIGRATION_STATUS.md`'s
    TODO rows.
    - **Traced `app.js`'s real `passwordInput()` in full**: every `.password-input` field really toggles
      between masked and plain-text on click, but ONLY when the click lands specifically within its own
      ~44px right-edge icon zone (matching a real `eye-slash.svg`/`eye.svg` CSS background-image swap
      driven by `.is-hidden`/`.is-visible` classes) — clicking anywhere else in the field is a normal text-
      input click. Reproduced with the same X-coordinate check (`event.nativeEvent.offsetX` vs.
      `input.offsetWidth - 44`) rather than a plain always-toggle button, so typing/cursor-placement clicks
      elsewhere in the field don't accidentally flip visibility.
    - **Found this was a genuine, previously-unwired site-wide gap, not specific to this page**: checked
      `LoginModal`/`SignUpModal` (both already migrated, both already carrying the `.password-input` CSS
      class for styling) and confirmed neither had ANY click handler behind it — the real toggle feature
      was simply never built when those modals were first done. Built the new shared `PasswordInput`
      component here (since this page needed it for its own 3 fields) and retroactively wired it into
      `LoginModal` (1 field) and `SignUpModal` (2 fields) too, since it's the exact same real feature all
      of them were silently missing — same class of retroactive fix as `DashboardAdminDropdown` being
      found missing from `dashboard.html`/`my-listings.html` earlier this session.
    - **Real, disclosed source content bugs preserved verbatim** (confirmed via source read, not
      corrected): all 3 password fields ("Old Password", "New password", "Retype new password") share the
      identical literal value "themesflat@2026", and the email field's own value has a literal trailing
      "|" character ("themesflat@gmail.com|").
    - "Change Password" submit is UI_ONLY — confirmed via this page's own trailing inline script that only
      the shared dashboard-sidebar-toggle logic exists (already handled globally by
      `(dashboard)/layout.tsx`); nothing validates New/Retype match or does anything else with the form.
    - Verified via Playwright: clicking the middle of "Old Password" leaves it masked (`type="password"`,
      `.is-hidden`), clicking within its own right-edge icon zone genuinely flips it to `type="text"`/
      `.is-visible` and back on a second click, same behavior confirmed on all 3 fields; separately
      re-verified `LoginModal`'s own password field (opened via a real page's Sign In button) now also
      genuinely toggles via the same icon-zone click, confirming the retroactive fix works, zero console/
      page errors. Lint and `tsc --noEmit` clean.

71. **index.html → `/` (root `src/app/page.tsx`).** The site's most complex page (per this file's own
    original recommendation), migrated after about-us.html as planned. Replaces the scaffold placeholder.
    New `src/components/home/*`: `HeroSearchSection` (background Swiper + `.search-cars` primary filters
    via `CheckboxDropdown` + advanced panel via `common/FilterSelectDropdown` + `RangeSlider`, all
    decorative-only — no real listing grid on this page, same scope decision as `TopSearchFilterBar.tsx`;
    the ~40-checkbox "Features" collapse is deliberately NOT reproduced, same precedent as
    `TopSearchFilterBar`/#28), `carTypeIcons.tsx` (shared 11-icon SVG map — source's own `Convertible`
    icon is byte-identical to `Crossover`'s, a real disclosed duplication), `NewCarsSection` (real
    New/Used Cars tab switch, reuses `ListingCard`/`allListings` ids 1-8 directly — no new data needed,
    "Used Cars" is a literal repeat of the first 6 "New Cars" entries), `BrowseByTypeSection` (parallax
    banner reproduced as a plain full-bleed `next/image`, same decision as
    `sell-your-car/GetInTouchBanner.tsx`), `FinancingCalculatorSection` (static/UI_ONLY, same conclusion
    as the near-identical inline calculator in `listing-details/ListingDetailsContent.tsx` — kept
    separate, not extracted, since the field-grid layout and companion image column genuinely differ),
    `TrendingSearchesSection` (new `ListingCardDark` for `card-box-style-2`, first use of that card
    variant), `HomeClientsReviews` + `BrandsSection` + `DownloadAppSection` + `NewsAndReviewsSection`.
    - **Added 3 new canonical listings (ids 13-15) to `src/data/listings.ts`** for "Trending Searches Near
      You" — the only section on this page whose titles weren't already in the dataset (confirmed via
      full source read: New/Used Cars, by contrast, reuse existing ids 1-8 exactly). All 3 preserve real,
      disclosed brand/title mismatches (e.g. id 13 "2015 Ford Mustang EcoBoost" labeled brand "BMW"),
      matching the pattern already established for ids 6/9/10/12.
    - **Extracted `about-us/Testimonials.tsx` into shared `common/ClientsReviewsCarousel.tsx`** once this
      page needed the identical "Clients Reviews" widget (same heading/`/clients-reviews` link/Swiper
      config) with its own 8-testimonial content and its own `star.svg` icon (about-us uses `star-6.svg`)
      — same "extract into `common/` once a second page needs it" precedent as `Pagination`/
      `BlogListingSidebar`/`FilterSelectDropdown`. Source's own content repeats "Olivia Williams / CEO
      BMW" over the identical text 6 times (only the avatar image varies) and "Benjamin Parker / CEO
      Tesla" twice — preserved verbatim, not deduplicated.
    - **One disclosed, one-off source content bug NOT promoted to a canonical record**: "Trending
      Searches"'s 4th slide reuses id 14's title text ("Mercedes-AMG C-Class") over a different
      image/brand/price (card-10.jpg/Porsche/$18.200,00) that matches no real listing — rendered as a
      literal `ListingCardData` override in `TrendingSearchesSection.tsx` itself rather than invented into
      `allListings` as a spurious 4th record.
    - Confirmed all 6 modals COMPONENT_MAP.md originally flagged for this page: 5
      (Login/ForgotPassword/SignUp/Search/Compare) were already mounted globally in `app/layout.tsx`; only
      `NewsletterModal` needed mounting on this page's own `page.tsx` (per its own "11 of 63 pages" scope).
    - Source's `<body>` carries no `inner-page` class (unlike every other migrated page so far) and
      `.header-container-fluid` carries an extra `header-primary` modifier class with zero matching CSS
      anywhere in `../aurexo/assets/scss` (grepped, confirmed dead) — neither reproduced.
    - Verified via Playwright: hero background slider (4 slides), Brand/Advanced-filter dropdowns open,
      New Cars (8 cards) → Used Cars tab switch (6 cards, real `active` class), Browse By Type (10
      slides), Financing Calculator's static values render, Trending Searches (4 distinct cards),
      Clients Reviews (8 testimonials), Explore Our Brands (6, with vehicle counts), News & Reviews (3),
      footer, Sign In → `LoginModal` opens (`.modal-login.active`), zero console/page errors. Full-page
      screenshot (after scrolling to trigger `wow` reveals) confirms every section renders correctly.
      Lint, `tsc --noEmit`, and `next build` all clean.

72. **home-02.html → `/home-02`.** The largest single source page migrated so far (5064 lines) and a
    genuinely different homepage layout from index.html, not just a header/hero skin swap — confirmed via
    full source read. New `HeaderStyle2` (`header/`, see the "Shared elements" table correction above);
    `HeroSearchSection` extended with `title`/`subtitle`/`titleCentered`/`sectionModifierClass`/
    `showNavArrows`/`categoryHref` props (real Swiper `Navigation` module wiring added for the prev/next
    arrows home-02.html has that index.html's own hero doesn't); new `src/components/home-02/`:
    `BrowseByTypeCardsSection` (`.swiper-card-6`/`.card-box-style-3` white cards with real vehicle
    counts — a different DOM from `home/BrowseByTypeSection.tsx`'s icon-only carousel), `PopularSearchesSection`
    (7 type tabs, real tab switch, reuses `ListingCard`/`allListings` ids 1-4 directly — every title across
    all 7 tabs already existed, no new data needed), `CompareTopRatedSection` (fixed static teaser pairs,
    opens the existing `CardModal`, NOT the user's live `CompareProvider` list — a different concept from
    `compare/CompareTable.tsx`), `WhyChooseUsCarousel` (a different shape from `about-us/WhyChooseUs.tsx`:
    a 4-icon-card carousel + 2-column promo banner row, not that page's image+checklist+stat-counter
    layout), `HowItWorksBoxes` (a different class family — `.box-content`/`.box-content--effect` — from
    the existing `financing`/`sell-your-car` "How It Works" components' `.sell-your-car-box` family),
    `VideoSection` (parallax banner reproduced as a plain full-bleed `next/image`, Package Principle).
    New `common/VideoModal.tsx` (added `"VideoModal"` to `ModalProvider`'s `ModalId` union) — a real
    YouTube iframe embed (a genuine, specific URL from source, not a placeholder), mounted per-page like
    `NewsletterModal`. "Trending Searches Near You" and "News & Reviews" are byte-identical in content to
    index.html's own (confirmed via source diff, down to the same images/prices/categories) — reused
    directly via `TrendingSearchesSection` (zero changes) and an extended `RelatedArticles` (new
    `heading`/`viewAllHref` props, since home-02.html swaps the subtitle paragraph for a "View All" link).
    - **Retroactive fix to `Nav.tsx`, found while wiring `activePath` for the new page**: the "Home"
      mega-menu item was never marked `current-menu-item` for ANY page (including index.html itself,
      already migrated), and none of the 10 "Homepage 0X" dropdown entries were ever marked `current-item`
      — source marks both on every home-family page. Fixed by adding `isHomeActive` (`activePath === "/"`
      or starts with `/home-`) and per-item `href === activePath` checks; also added a `listClassName` prop
      so `HeaderStyle2` can apply the `.style-2` skin class without forking the component. Retroactively
      fixed `src/app/page.tsx` to pass `activePath="/"` to `<Header>` so index.html benefits too (same
      class of retroactive fix as `DashboardAdminDropdown`/`PasswordInput` earlier this session).
    - **Real, disclosed source content bugs preserved verbatim, not reconciled**: `CompareTopRatedSection`'s
      2 teaser pairs have brand labels matching neither car in the pair ("TESLA" under both a Tesla AND a
      Ford; "Honda"/"Camry" under a Jeep/Toyota pair), and its own "2022 Toyota 4Runner Limited" uses a
      different image/price than the real listing of the same title elsewhere on this page — not
      reconciled against `allListings`. `HowItWorksBoxes`' box 2 duplicates box 1's copy verbatim instead
      of its own distinct step (source's own numbering bug, confirmed via direct read).
    - Confirmed via Playwright that the language dropdown (decorative, no real i18n in source anywhere)
      and the prominent `#search-header` search bar (no backing JS found anywhere in `app.js`) are both
      genuinely UI_ONLY — real open/close and label-swap interaction, but no functional search/translate.
    - Verified via Playwright: 3-row header renders (top bar/language-select/search/contact-info), hero
      (centered title+subtitle, real prev/next nav arrows, `/dealer-details` category links — a real,
      disclosed per-page href difference from index.html's own `/listing-grid4-columns`), Browse By Type
      (10 real cards), Popular Searches (7 tabs, default "Sedan" active with 6 cards matching source's own
      repeat pattern, switching to "SUV" genuinely swaps to its own 2 real cards), Trending Searches (4),
      Compare Top Rated Vehicles (2 pairs, "Compare" genuinely opens `CardModal` showing its real static
      comparison content), Why Choose Us (4 icon cards + 2 promo banners), How It Works (4 boxes), Video
      Section → real `VideoModal` (genuine YouTube iframe, confirmed src) opens and closes, News & Reviews
      (3, byte-identical to index.html's own), footer, and the mega-menu's own "Homepage 02" entry now
      genuinely shows `current-item` (confirming the `Nav.tsx` retroactive fix) — zero console/page errors.
      Full-page screenshot (after scrolling to trigger `wow` reveals) confirms every section renders
      correctly. Lint, `tsc --noEmit`, and `next build` all clean.

73. **home-03.html → `/home-03`.** A 3rd homepage variant (3174 lines) reusing significant chunks of both
    index.html's and home-02.html's own components, each extended with real per-page props rather than
    forked — see the "Compare Top Rated Vehicles"/"Explore Our Brands" precedent this continues.
    - **`HeaderStyle2` extended** with `topBarVariant` ("highlight"/"light"), `showSearchBar`,
      `middleRowContainerFluid`, `socialHoverClass`, `viewOnMapHref`, `extraModifierClass`,
      `wrapperClassName` props — confirmed via full source diff against home-02.html's own header that
      home-03.html reuses the identical 3-row shell but with a light (not colored) top bar, NO
      `.header-search` bar at all in the middle row (a real DOM omission, not just a skin change), a plain
      `.container` (not `.header-container-fluid max-w-1920`) wrapping that row, `.effect-svg-hover` (not
      `.effect-svg-primary`) social icons, and its own "View on map" link literally pointing at a `tel:`
      href instead of the maps URL (a real, disclosed source bug, preserved).
    - **`HeroSearchSection` extended** with a `React.ReactNode` `title` (home-03's own h1 has a literal
      mid-string `<br>`), `subtitleClassName`, `heightClass`, `bannerOrder`, `showCategoryList` props.
      **Found and fixed a real, previously-unnoticed bug while adding `heightClass`**: `h-706` had been
      hardcoded unconditionally on every home variant's hero section, but only index.html's own source
      literally carries that class — home-02.html's and home-03.html's own hero sections have NO height
      utility class at all in source, relying entirely on `page-title-style-2`/`-3`'s own SCSS
      (662px/664px). Shipping `h-706` regardless meant home-02.html's already-verified page had a stray
      706px utility silently fighting its own real 662px height rule. Fixed by making the base height
      class an explicit prop (default `"h-706"` for index.html; home-02.html's/home-03.html's own
      `page.tsx` now pass `heightClass=""`) — regression-verified `/` still has `h-706` and `/home-02` no
      longer does.
    - **New `home-03/` components**: `PopularSearchesCarousel` (untabbed — home-03's own "Popular
      Searches" has no `.flat-tabs`/`.menu-tab` at all, unlike home-02.html's 7-tab version, confirmed via
      full source read; reuses `ListingCard`/`allListings` ids 1-4, no new data), `BrowseByTypePhotoCards`
      (a 3rd distinct "Browse By Type" variant — `.swiper-card-8`/`.card-box-style-5` real photo cards
      with their own `card-27..34.png` images and 8-type set, neither index.html's icon-carousel nor
      home-02.html's white-card version), `TrendingSearchesGrid` (a static 3-card grid, `.card-box-style-1
      card-box-style-6`, genuinely different from `home/TrendingSearchesSection.tsx` — see its own
      disclosed-bugs note below), `ClientsReviewsSection` (new dataset + linked cards + promo banner).
    - **`CompareTopRatedSection` extended** with `pairs`/`cardClassName`/`titleClassName`/
      `swiperClassName`/`paginationClass` props so home-03.html could add its own 3rd pair and its own
      `card-box-style-7 style2`/`swiper-card-3` classes without forking the component; also added a
      `ctaHref` per-pair option since home-03's own pair 1 uses a real `<a href="compare.html">` link
      instead of the `open-modal`→`#CardModal` every other pair (here and on home-02.html) uses. **Also
      fixed a real, pre-existing gap while doing this**: the "Compare" button's own SVG icon (present in
      both sources) had been dropped entirely when this component was first built for home-02.html —
      added back via a shared `CompareGlyph`, benefiting home-02.html's already-shipped page too
      (regression-verified the icon now renders there).
    - **`ListingCard` extended** with `extraClassName` and `compact` props (bundling `card-box-style-6`'s
      3 real, always-together differences: `.content` drops `border-light border-top-none`, `.tag` drops
      `style2` and swaps its margin with the title's) so `TrendingSearchesGrid` could reuse it directly.
    - **Real, disclosed source content bugs preserved verbatim in `TrendingSearchesGrid`, not
      reconciled**: every slide's title/spec row matches canonical ids 1/2/3 exactly, but each slide's own
      image/price/badge is scrambled against that same canonical record — slide 1 keeps id 1's real
      price but shows `card-4.jpg` (not id 1's own `card-1.jpg`) plus a financing row id 1 doesn't have;
      slide 2 introduces a genuinely new badge value "Hot Offer" (`bg-primary`, not seen on any other
      page) with `card-7.jpg` and a price differing from id 2's canonical one; slide 3 shows a "Great
      Price" badge id 3 doesn't canonically have, with its own scrambled image/price. Confirmed via full
      source read, not a transcription error.
    - **New shared components, extracted for real 2nd-use rather than forked**: `common/WhyChooseUsSection`
      (out of `about-us/WhyChooseUs.tsx` — home-03.html needs the exact same image/checklist/CTA/stats
      content on a dark `bg-primary` background instead of light) with a real `animateCounters` prop:
      **traced `app.js`'s `flatCounter()` in full** and confirmed it only fires when `<body>` carries
      `counter-scroll` — about-us.html's body lacks that class (stays static, unaffected) but home-03.html's
      body genuinely has it, so its own 4 stat numbers are REAL scroll-triggered count-up animations, not
      decorative like every other page's identical-looking counter. Built `common/CountUpNumber`
      (`IntersectionObserver` + ref-guard, Package Principle — no jQuery `countTo` plugin) to reproduce
      this. `common/SellBuyPromoBanner` (out of `home-02/WhyChooseUsCarousel.tsx` — home-03.html needs the
      exact same 2-column promo banner after "Clients Reviews" instead of after "Why Choose Us"), extended
      with `leftTitleHref`/`rightTitleHref` props for each page's own real (and differently broken) link
      targets. `ClientsReviewsCarousel` extended with a `cardHref` prop (home-03's own testimonial cards
      are real `<a href="clients-reviews.html">` links, unlike index.html's/home-02.html's plain divs) and
      a `children` slot (so the promo banner renders inside the SAME `<section>`, matching source, instead
      of forcing callers to add a redundant wrapping section). **Also fixed a real, pre-existing gap**:
      the shared `<section>` was missing source's own `py-100` class on every existing caller — added,
      regression-verified `/` and `/about-us` both keep their same visual spacing (the class was simply
      never rendered before, so this is a pure fix, not a behavior change users would have noticed as a
      regression).
    - **`Nav.tsx`'s "Homepage 0X" current-item marking** (fixed while migrating home-02.html, see #72)
      confirmed still correct here — "Homepage 03" shows `current-item` when on `/home-03`.
    - No `NewsletterModal`/`VideoModal` on this page (confirmed via grep — genuinely absent from source,
      unlike index.html/home-02.html).
    - Verified via Playwright: 3-row header (light top bar, no search bar present, `background-light`
      class confirmed), hero (`<br>` renders inside the real h1, real nav arrows, zero `.category-list`
      elements), untabbed Popular Searches, Explore Our Brands (6), Browse By Type (8 photo cards), Why
      Choose Us counter genuinely animates 0→18 on scroll (re-confirmed `/about-us`'s own counter stays
      static "18" throughout, unaffected), Trending Searches (3, correct scrambled titles), Compare Top
      Rated (3 pairs, pair 1's `href="/compare"` real link confirmed), Clients Reviews (6 real
      `<a href="/clients-reviews">` cards) + promo banner, footer, mega-menu "Homepage 03" marked current
      — zero console/page errors. Regression-checked `/`, `/home-02`, `/about-us` all render correctly
      after every shared-component extension/fix above. Full-page screenshot confirms every section
      renders correctly. Lint, `tsc --noEmit`, and `next build` all clean.

74. **Retroactive fix: real `.tp-showcase-slider-bg` parallax on `HeroSearchSection`'s hero swiper**
    (`/`, `/home-02`, `/home-03` — every page sharing this component). User-requested check of
    `../aurexo/assets/js/swiper.js`'s own `.sw-single` config revealed this had been under-implemented:
    the hero background slider had only ever been reproduced as a plain autoplay+pagination carousel
    with a static per-slide `background-image`, but source's own `init` handler does more —
    ```js
    var swiperSingle = new Swiper(".sw-single", {
      ..., parallax: true, ...,
      on: { init: function () {
        var swiper = this;
        for (var i = 0; i < swiper.slides.length; i++) {
          var $bg = $(swiper.slides[i]).find(".tp-showcase-slider-bg");
          $bg.attr({ "data-swiper-parallax": 0.75 * swiper.width });   // real parallax layer
          var bgImage = $bg.attr("data-background");
          if (bgImage) $bg.css("background-image", "url(" + bgImage + ")");
        }
      }, resize: function () { this.update(); } },
    });
    ```
    `parallax: true` + a real `data-swiper-parallax` value (75% of the swiper's own pixel width) makes
    each background layer genuinely shift during slide transitions via Swiper's own Parallax module —
    not just a decorative fade/slide of the whole slide. Fixed by adding `Parallax` to `HeroSearchSection`'s
    `modules` array, `parallax` on the `<Swiper>`, and computing the same `0.75 * swiper.width` value via
    an `onInit` callback into a small piece of state, applied to each slide's `data-swiper-parallax`
    attribute (source itself never recomputes this value on resize either — its own `resize` handler
    only calls `swiper.update()` — so this doesn't recompute on resize, matching source exactly, not an
    oversight). Verified via Playwright on all 3 live pages: the attribute value matches
    `0.75 × viewport width` exactly, and each background layer's computed `transform` genuinely changes
    (real `matrix(...)` translation) mid-transition when the pagination bullets are used to change
    slides — confirmed on `/`, `/home-02`, and `/home-03` with zero console/page errors, plus a full
    `lint`/`tsc --noEmit`/`next build` pass.

75. **Retroactive fix: `.search-cars__filters`'s primary Brand/Model/Miles/Price fields were missing
    `bg-white` and carrying a stray `mb-18`** (`/`, `/home-02`, `/home-03`, `/listing-topmap`).
    User-requested check of `HeroSearchSection`'s `.search-cars__filters` against source revealed
    `listing/CheckboxDropdown.tsx` (shared by `HeroSearchSection` and `TopSearchFilterBar.tsx`) had only
    ever been built for its ORIGINAL vertical-sidebar context (`FilterFields.tsx`, e.g.
    `listing-sidebar-left.html`), where source really has `.search-cars__select-wrapper mb-18` and NO
    `bg-white` on `.search-cars__select` — confirmed still correct there. But source's horizontal
    hero/topmap-bar context (index.html/home-02.html/home-03.html's own hero, listing-topmap.html's own
    `TopSearchFilterBar`) is the opposite: no `mb-18` (fields sit inline in a flex row, not stacked) and
    a real `bg-white` IS present on every one of those 4 pages (confirmed via direct source diff).
    `.filter-select-dropdown`'s own base SCSS (`assets/scss/component/filter-sidebar.scss:777-787`) sets
    NO `background-color` at all — only a `background-image` for the chevron icon — so without
    `bg-white` these fields were rendering with a see-through background against the hero photo instead
    of the intended white pill, a real, user-visible bug on all 4 pages, not just a cosmetic nit. Fixed
    by adding a `layout?: "sidebar" | "bar"` prop to `CheckboxDropdown.tsx` (default `"sidebar"`,
    preserving every existing `FilterFields.tsx` caller unchanged) and passing `layout="bar"` from both
    `HeroSearchSection.tsx`'s 4 primary-filter calls and `TopSearchFilterBar.tsx`'s 4 calls. Verified via
    Playwright: computed `background-color` is now `rgb(255, 255, 255)` and computed `margin-bottom` is
    `0px` on all 4 "bar" pages; regression-checked `listing-sidebar-left`/`listing-liststyle-sidebar`
    both still show `mb-18` (18px real computed margin) and no `bg-white` — zero console/page errors
    anywhere. Screenshot of the hero's filter row confirms the 4 dropdowns + filter-toggle button now
    render as solid white pills against the background photo, matching the source design.
    - **Separate, related discrepancy found but NOT fixed in this pass (flagged for a future task)**:
      `TopSearchFilterBar.tsx`'s own Advanced Filters panel (Fuel Type/Transmission/DriveType/Cylinders)
      currently reuses `CheckboxDropdown` — but listing-topmap.html's own source markup for those exact
      fields is `<div class="bg-white filter-select-dropdown style2" data-name="...">` with NO wrapping
      `.search-cars__select-wrapper`/separate `<label>` at all (confirmed via source read) — the same
      `common/FilterSelectDropdown` shape `HeroSearchSection.tsx`'s own Advanced panel already correctly
      uses, not `CheckboxDropdown`'s sidebar-style shape. Out of scope for this pass (user's request was
      specifically the primary `.search-cars__filters` row), but documented here so it isn't lost.
76. **Retroactive fix: `home/NewCarsSection.tsx`'s `.swiper-card-7` (New Cars/Used Cars tabs on `/`)
    rendered as a single-row carousel instead of source's real 2-row grid**. User-requested re-check
    ("layout chưa đúng") led to re-reading `assets/js/swiper.js`'s own `swiperCard7Config` in full, which
    confirmed the source uses the legacy jQuery-era Swiper options `slidesPerColumn: 2` +
    `slidesPerColumnFill: 'row'` — a genuine 2-row grid per page, not a flat single row. The previous
    implementation had no row-grouping at all (only varied `slidesPerView` across breakpoints), and its
    breakpoints/spacing were also wrong: it used `575/767/1280` + `spaceBetween: 16`, while source's real
    config is `0/550: 1 col`, `767: 2 col`, `991: 3 col`, `1440: 4 col` (each always paired with
    `slidesPerColumn: 2`) + `spaceBetween: 30`. Fixed by adding Swiper's modern `Grid` module (the
    supported replacement for the legacy `slidesPerColumn` API) — `modules={[Grid, Pagination]}`,
    `grid={{ rows: 2, fill: "row" }}` — and correcting the breakpoints to `550/767/991/1440` and
    `spaceBetween` to `30`. Also added `import "swiper/css/grid";` to `src/app/layout.tsx` (same "missing
    per-module CSS import silently breaks the module" class of bug previously found for
    `effect-fade`/`pagination`, ambiguity #8 note) — without it the Grid module has no sizing/spacing rules
    and renders visually broken. Scope check via `grep -rl "swiper-card-7"`: only `index.html` (this fix),
    `home-06.html`, and `home-11.html` (not yet migrated — will inherit the corrected component
    automatically) use this class; `.swiper-card` (a different class used by `TrendingSearchesSection.tsx`/
    `PopularSearchesSection.tsx`/`PopularSearchesCarousel.tsx`) was confirmed to be a plain single-row
    carousel needing no change. Verified via Playwright: New Cars' 8 cards render at 2 distinct row Y-offsets
    (4 cards per row at desktop width, matching `swiperCard7Config`'s `1440: {slidesPerView: 4}` breakpoint),
    Used Cars' 6-card tab switch still works via the existing `key={activeTab}` remount, zero console/page
    errors. `npx tsc --noEmit`, `npm run lint`, and `npm run build` (production) all pass clean.
77. **Retroactive fix: real `simpleParallax` scroll effect implemented for every `.overlay.image`
    full-bleed background** (`/` `BrowseByTypeSection`, `/home-02` `VideoSection`, `/sell-your-car`
    `GetInTouchBanner`, `/services-center` `ContactScheduleSection`, `/coming-soon` `ComingSoonHero`).
    User-requested check ("check logic simpleParallax dựa vào simpleParallaxVanilla.umd.js") led to
    reading `assets/js/simpleParallaxVanilla.umd.js` in full: `app.js`'s `parallax()` hands every
    `.parallax` image to it with `{ delay: 0.5, orientation: "up", scale: 1.3, transition:
    "cubic-bezier(0.2, 0.8, 1, 1)" }` — a real scroll-driven effect (image scales 1.3x, clipped by an
    overflow-hidden wrapper, and translates vertically as the section crosses the viewport via a
    continuous `requestAnimationFrame` loop, gated by `IntersectionObserver` visibility), not a
    decorative/dead plugin reference. All 5 already-migrated callers had previously and explicitly
    decided to skip this ("SimpleParallax not pulled in — Package Principle") and rendered a fully static
    `next/image fill` instead — a real, confirmed behavioral gap once the actual library source was read,
    the same category of miss as the hero swiper's `tp-showcase-slider-bg` parallax (#74). Fixed via a
    new shared `common/ParallaxImage.tsx` (5th real use of this exact `.overlay.image` pattern, so
    extracted rather than duplicated) that reimplements the library's own `getTranslateValue()` linear-
    interpolation formula verbatim — `percent = clamp(0, 100, (viewportBottom - elementTop) /
    ((viewportHeight + elementHeight) / 100))`, `rangeMax = elementHeight * scale - elementHeight`,
    `translate = (percent / 100) * rangeMax - rangeMax / 2` (negated for orientation `"up"`) — as a small
    hand-rolled `requestAnimationFrame` + `IntersectionObserver` effect instead of installing the
    third-party library (Package Principle, same call as `CountUpNumber.tsx` for jQuery's `countTo`).
    All 5 callers now render `<ParallaxImage src="..." />` in place of their old static block; the 3
    callers whose only `Image` usage was that background (`BrowseByTypeSection.tsx`,
    `GetInTouchBanner.tsx`) had the now-unused `next/image` import removed, the other 3 that also use
    `Image` for unrelated icons/avatars kept it. Verified via Playwright across all 5 pages: computed
    `transform` on the wrapped image reads `matrix(1.3, 0, 0, 1.3, 0, <Y>)` (confirms the 1.3x scale is
    applied) and `<Y>` changes on scroll (e.g. index: `15.5` → `-37.6`; home-02: `21.9` → `-49.9`), wrapper
    `overflow: hidden` confirmed, zero console/page errors on any page. `/coming-soon` alone shows no
    transform change on scroll — confirmed via `document.body.scrollHeight === window.innerHeight` that
    this page has no scrollable content at all (a genuine single-viewport-height design, matching source),
    so zero motion is the correct, expected behavior there, not a bug. `npx tsc --noEmit`, `npm run lint`,
    and `npm run build` (production) all pass clean. Scope note: `home-04.html`, `home-07.html`, and
    `home-11.html` also have a `.parallax` image but aren't migrated yet — they'll get this same
    `ParallaxImage` component automatically once built, per the existing reuse-hierarchy search order.
78. **Retroactive fix: `home-02/BrowseByTypeCardsSection.tsx`'s `.swiper-card-6` (Browse By Type on
    `/home-02`) rendered as a single-row carousel instead of source's real 2-row grid** — same bug/fix
    pattern as `home/NewCarsSection.tsx`'s `.swiper-card-7` (#76), found via user-requested re-check.
    `assets/js/swiper.js`'s real `swiper-card-6` config uses `slidesPerColumn: 2`/`slidesPerColumnFill:
    "row"` with breakpoints `550/767/991/1440` → 2/3/4/5 columns and `spaceBetween: 30`; the previous
    implementation had no row-grouping at all and used wrong breakpoints (`575/767/1280` → 3/4/5) and
    wrong `spaceBetween` (16). Fixed identically to #76: added Swiper's `Grid` module
    (`grid={{ rows: 2, fill: "row" }}`), corrected breakpoints/`spaceBetween`; no new CSS import needed
    since `swiper/css/grid` is already imported globally in `layout.tsx` from the #76 fix. Verified via
    Playwright: all 10 cards render at exactly 2 distinct row Y-offsets (5 cards per row at desktop width,
    matching the `1440: {slidesPerView: 5}` breakpoint), zero console/page errors, screenshot confirms a
    real 2×5 grid. `npx tsc --noEmit`, `npm run lint`, and `npm run build` (production) all pass clean.
79. **Retroactive fix: `home-02/PopularSearchesSection.tsx`'s 7 tab icons were invisible (wrong icon set
    reused)**. User-reported "tab icon hiển thị sai" led to a source diff: this tab bar
    (`.menu-tab-style2 .car-box`, home-02.html lines 1389-1491) was reusing `home/carTypeIcons.tsx`'s
    `CAR_TYPE_ICONS` — a `stroke="white"`, `viewBox="0 0 41 40"` set purpose-built for the dark hero
    photo/parallax-banner context (`HeroSearchSection`'s `.category-list`, `BrowseByTypeSection`'s
    `.swiper-brand`). This tab bar sits directly on the plain white page background, and source's real
    icons here (confirmed via full read of all 7) are a completely different, dedicated set:
    `stroke="#1C1C1C"` (dark) with each icon's own tight viewBox (height 16 or 18, not 40) — reusing the
    white set rendered every tab icon invisibly (white-on-white). Fixed by adding a new local `TAB_ICONS`
    map in `PopularSearchesSection.tsx` itself (transcribed verbatim from source, not reused/adapted from
    `carTypeIcons.tsx`) — kept local rather than extracted to a shared file since home-02.html is
    currently the only *migrated* page using this exact `.car-box` tab pattern (home-05/07/09/10.html
    also have it but aren't migrated yet; extract to `common/` once a second real page needs the same
    icon set, per the established extract-on-second-use convention). Verified via Playwright: computed
    `stroke` on every tab icon path now resolves to `rgb(28, 28, 28)` (= `#1C1C1C`, was previously
    invisible white), tab switching still works (clicking "SUV" renders its own 2-card set), zero
    console/page errors, screenshot confirms all 7 dark car-outline icons are now visible next to their
    labels. `npx tsc --noEmit`, `npm run lint`, and `npm run build` (production) all pass clean.
80. **Retroactive fix: `header/HeaderStyle2.tsx`'s top-bar social icons used the wrong SVGs entirely**
    (`/home-02` and `/home-03`, both already-migrated). User-requested check of home-03's
    `header-top-bar` led to a full source diff that found the top bar's Facebook and X icons were
    copy-pasted from the FOOTER's `.widget-socical` (solid "f" Facebook logo, solid X-mark logo — traced
    via path-data grep to `home-02.html`'s own footer section, confirmed NOT present in either page's
    real header markup) instead of the header top bar's own dedicated outline-style icon set. Direct
    diff of `.header-top-bar--socical` on both home-02.html and home-03.html confirmed the 5 real icons
    (Facebook/X/Instagram/Skype/Telegram) are byte-identical shapes across both pages, differing only in
    `stroke` color (`white` on home-02's colored bar, `#1C1C1C` on home-03's light bar) — Instagram/
    Skype/Telegram already had the correct shapes in `HeaderStyle2.tsx` but a hardcoded `stroke="white"`
    regardless of `topBarVariant`, which would've rendered invisibly on home-03's light bar too, same
    root cause as #79's tab icons. Fixed by replacing the Facebook/X paths with the real header top-bar
    shapes (a speech-bubble/zigzag glyph for Facebook, a 3-line outline mark for X — not the classic
    solid logos) and switching all 5 icons' `stroke` to the existing `chevronStroke` variable (already
    used for the language-dropdown chevron) instead of a fixed color; Instagram's small corner dot stays
    `fill="white"` unconditionally, matching source exactly on both pages. Verified via Playwright:
    home-02's 5 icons all compute `stroke: rgb(255, 255, 255)`, home-03's all compute
    `rgb(28, 28, 28)` (= `#1C1C1C`), zero console/page errors on either page, screenshots confirm the
    correct icon shapes render in the correct color on both variants. `npx tsc --noEmit`, `npm run lint`,
    and `npm run build` (production) all pass clean.
81. **Retroactive fix: wrong `.swiper-card` breakpoints/`spaceBetween` in 3 already-migrated components**
    (`home-03/PopularSearchesCarousel.tsx`, `home-02/PopularSearchesSection.tsx`,
    `home/TrendingSearchesSection.tsx`) — user-requested check of home-03's carousel led to re-reading
    `assets/js/swiper.js`'s real `.swiper-card` config (lines 79-118): `spaceBetween: 30` with
    breakpoints `0/400/767/991/1280` → `slidesPerView` `1/1/2/3/4`, each paired with a matching
    `slidesPerGroup` (advances a full "page" of slides per swipe/pagination click, not one at a time).
    All 3 files instead had `spaceBetween: 16` and wrong breakpoints (`575/767/1280` → `2/3/4`, no
    `slidesPerGroup` at all) — the same copy-paste error repeated across all 3, meaning viewports between
    ~575-1279px showed one MORE column than source intends (e.g. a real 2-column tablet width rendered 3
    columns). Fixed all 3 identically: breakpoints corrected to `767/991/1280` → `2/3/4` (the `0`/`400`
    entries are redundant with the base `slidesPerView={1}` and omitted), `spaceBetween` corrected to 30,
    `slidesPerGroup` added matching each breakpoint's `slidesPerView`. Also brought
    `listing-details/RelatedListings.tsx` (already close — correct breakpoints/spaceBetween) up to full
    fidelity by adding the same matching `slidesPerGroup` per breakpoint, which it was missing. Verified
    via Playwright at 800px width (between the old and new 2-column breakpoints) across all 3 primary
    fixes: exactly 2 cards render within the viewport on each page (was 3 before the fix), zero
    console/page errors. `npx tsc --noEmit`, `npm run lint`, and `npm run build` (production) all pass
    clean.
82. **Retroactive fix: `home-03/BrowseByTypePhotoCards.tsx`'s `.swiper-card-8` (Browse By Type on
    `/home-03`) rendered as a single-row carousel instead of source's real 2-row grid** — same bug/fix
    pattern as `home/NewCarsSection.tsx`'s `.swiper-card-7` (#76) and
    `home-02/BrowseByTypeCardsSection.tsx`'s `.swiper-card-6` (#78), found via user-requested re-check.
    `assets/js/swiper.js`'s real `.swiper-card-8` config uses `slidesPerColumn: 2`/`slidesPerColumnFill:
    "row"` with breakpoints `0/400/767/991` → 1/2/3/4 columns and `spaceBetween: 30`; the previous
    implementation had no row-grouping, wrong breakpoints (`575/767/1280` → `3/4/5` — source never
    reaches a 5th column at all), and wrong `spaceBetween` (16). Fixed identically to #76/#78: added
    Swiper's `Grid` module (`grid={{ rows: 2, fill: "row" }}`), corrected breakpoints to `400/767/991` →
    `2/3/4`, corrected `spaceBetween` to 30; no new CSS import needed since `swiper/css/grid` is already
    imported globally in `layout.tsx`. Verified via Playwright: all 8 cards render at exactly 2 distinct
    row Y-offsets (4 cards per row at desktop width, matching the `991: {slidesPerView: 4}` breakpoint —
    source's highest), zero console/page errors, screenshot confirms a real 2×4 grid. `npx tsc --noEmit`,
    `npm run lint`, and `npm run build` (production) all pass clean.
83. **Retroactive fix: `home-02/CompareTopRatedSection.tsx`'s Swiper breakpoints were hardcoded and wrong
    for both variants** (`/home-02`'s `.swiper-card-2` AND `/home-03`'s `.swiper-card-3`, which reuses
    this same shared component). User-requested check of home-03's "Compare Top Rated Vehicles" led to
    reading both real `swiper.js` configs: `.swiper-card-2` (home-02) is `spaceBetween: 30`, 1 column
    until 991px then 2 — the component had hardcoded `767: {slidesPerView: 2}` (bumping a full breakpoint
    too early) and `spaceBetween: 16` (wrong). `.swiper-card-3` (home-03) is also `spaceBetween: 30`, 1
    column until 767px, 2 from 767px, **and a real 3rd column from 1199px** that the shared hardcoded
    breakpoints never reached at all — home-03's 3 comparison pairs were capped at 2-up on every
    viewport, never showing all 3 side by side like source does at wide desktop widths. Fixed by adding a
    `breakpoints` prop (type `Record<number, {slidesPerView, slidesPerGroup?}>`), defaulting to
    `.swiper-card-2`'s real config (`{991: {slidesPerView: 2, slidesPerGroup: 2}}`); `home-03/page.tsx`
    now passes its own real `.swiper-card-3` breakpoints (`{767: {slidesPerView: 2, slidesPerGroup: 2},
    1199: {slidesPerView: 3, slidesPerGroup: 3}}`) instead of sharing home-02's. Also corrected the
    shared `spaceBetween` to 30 and added `slidesPerGroup={1}` at the base level for both variants.
    Verified via Playwright: home-02 shows exactly 1 card at 800px width and 2 at 1100px (was previously
    2 at both); home-03 shows exactly 2 cards at 800px and all 3 at 1300px (was previously capped at 2
    everywhere) — screenshot confirms all 3 pairs render side by side on home-03 at desktop width, zero
    console/page errors on either page. `npx tsc --noEmit`, `npm run lint`, and `npm run build`
    (production) all pass clean.
84. **`home-04.html` migrated — `/home-04` (2719 lines)**. Header reuses `Header.tsx` (`style-1`) but
    with a new `bgClassName` prop (default `"bg-white"`, home-04 passes `""`) — its own header sits
    transparently over the hero via `header-fixed-primary border-bottom border-color-blur`, confirmed
    via source diff against index.html's own `bg-white header-style-1`.
    - **New hero variant — `home-04/HeroBannerSlider.tsx`**: genuinely different from
      `home/HeroSearchSection.tsx` (no search-filter bar at all). Real behavior per
      `assets/js/swiper.js`: `.sw-single` (background, real parallax at 75% swiper width, same
      mechanism as `HeroSearchSection`) is synced via Swiper's own `Controller` module to a second
      `.sw-single-thumb` fade-effect swiper holding the title/subtitle/CTA
      (`swiperSingle.controller.control = swiperThumb` and vice versa) — implemented as a real
      2-swiper Controller sync, not collapsed to static content, since other home variants sharing
      this exact `page-title-style-1` markup (home-05/06/09/10/11.html, not yet migrated) may need
      genuinely different per-slide text later. `.page-title--post-list`'s 4 spec badges are static
      links with real SVG icons. Verified via Playwright: real parallax attr present, dual-swiper sync
      confirmed, title/subtitle/CTA + all 4 badges render with their real CSS keyframe entrance
      animations (`.effect-content-slide .swiper-slide-active .effect-item` — confirmed the animation
      genuinely plays over ~0.9s-3.1s, and correctly re-triggers every ~3s as the real background
      autoplay cycles slides via the Controller sync — not a bug, matches source's real repeated-text
      carousel behavior).
    - **"Explore Our Brands" reused as-is** (`home/BrandsSection.tsx`, byte-identical 6-brand content) —
      while verifying, found and fixed its own pre-existing breakpoint/`spaceBetween` bug (see below).
    - **"Popular Searches" — new `home-04/PopularSearchesPeekCarousel.tsx`**: reuses `ListingCard`
      directly (`.card-box-style-1`, ids 1-5). Real `.swiper-card-5` config has a genuine fractional
      `slidesPerView: 4.63` at its widest breakpoint (a deliberate "peek" effect showing a sliver of the
      next card) — reproduced verbatim, not rounded.
    - **"Browse By Type" — new `home-04/BrowseByTypeGallery.tsx`**: a real click-to-expand accordion
      (`.slide-gallery-list.style2`, 6 car-type photo panels). Confirmed via `app.js` that
      `hoverActiveGallery()` (misleadingly named — a real click handler) drives this via the exact same
      `$('.slide-gallery-list .slide-gallery').click(...)` selector already reproduced for
      `listing-details/DetailsGalleryAccordion.tsx` — same mechanism, reused conceptually, no lightbox
      needed here (no Fancybox attribute on this section, each panel is a real listing-grid link
      instead). Verified via Playwright: clicking a panel expands it and correctly de-actives its
      siblings.
    - **"Why Choose Us" — extended `common/WhyChooseUsSection`**: home-04's own version is
      `.why-choose-us.outline.style2` with `gap-30` (no `counter-spacing`) stat-grid spacing even
      though its background is light — a genuine 3rd modifier combination the existing light/dark
      binary `variant` prop didn't cover. Added `wrapperClassName`/`statsGridModifierClass` override
      props (each defaulting to the existing variant's own established classes, so `about-us.html`/
      `home-03.html` are unaffected). No animated counters (`<body>` lacks `counter-scroll`).
    - **"Financing Calculator" — extended `home/FinancingCalculatorSection`**: home-04's own version has
      no companion image column and a real `simpleParallax` background (`bg-video.jpg`) instead —
      added a `parallaxBackground` prop (default `false`, index.html/home-02.html unaffected) that
      swaps in `common/ParallaxImage` and renders the empty `col-lg-6`. Source's own "Car Price" input
      here also carries a literal stray `value="$46.300|"` (trailing pipe character, confirmed via
      direct source read) — kept verbatim as a disclosed content quirk, not silently corrected.
    - **"Trending Searches Near You" — new `home-04/TrendingSearchesGridCard.tsx` +
      `TrendingSearchesGridSection.tsx`**: a genuinely different `.card-box-style-8` card shape
      (`.top`/`.bottom` sit BEFORE `.image` as flex siblings, both absolutely positioned over the image
      per `box.scss`; `.content` has no `border-light border-top-none`, no `style2` on `.tag` — a third
      combination not covered by `ListingCard`'s existing `compact` flag). Source's 6 slides are really
      3 distinct cards repeated twice (confirmed via full source read) — collapsed here, same pattern
      as `home/TrendingSearchesSection.tsx`. Each carries its own real, disclosed price/badge
      discrepancy against the canonical listing (id2: $42.500,00 vs. canonical $42.800,00; id3: a
      brand-new "Hot Offer" `bg-primary` badge + $34.200,00 vs. canonical's no-badge + $45.500,00) —
      applied as literal per-card overrides, nothing invented into `allListings`. Real
      `.swiper-card-4` config is `slidesPerColumn: 2` (a real 2-row grid, max 2 columns — reached via
      Swiper's `Grid` module, same pattern as #76/#78/#82) — verified via Playwright: 6 cards render at
      2 distinct row Y-offsets.
    - **Promo banner + icon carousel + News & Reviews, reversed order vs. home-02.html**: home-04's own
      DOM order is promo-banner → icon-carousel → news, all inside ONE shared `py-100 bg-white`
      section (confirmed via source diff — home-02.html's own order is icon-carousel → promo-banner,
      in its own separate `py-100` section, with News & Reviews as a fully separate, unrelated section
      elsewhere on that page). Reused `home-02/WhyChooseUsCarousel` (already byte-identical 4 icon
      cards) with 3 new props: `hrefs` (home-04's own 4 distinct per-card hrefs, confirmed via source
      diff — home-02.html's own real hrefs are actually all identical, not a bug there), a
      `promoBannerPosition` prop (`"before" | "after"`) controlling whether its own inner
      `SellBuyPromoBanner` renders before or after the carousel, and a `bare` prop that skips its own
      `<section>` wrapper so `home-04/page.tsx` can own one shared section across all three pieces.
      `blog-details/RelatedArticles` (`.post-style-2`) gained the same `bare` prop plus a `slides`
      override (home-04's own post-7/8/9.jpg + NEWS/Expert Review/NEWS set, vs. blog-details-1/2's
      hardcoded post-4/5/6.jpg default).
    - **RETROACTIVE FIX — `SellBuyPromoBanner`'s "List Your Car Today!" CTA was a dead link on
      home-03.html too**: while transcribing home-04's own real `sell-your-car.html` href for this
      exact CTA, re-checked home-02.html (confirmed real `href="#"`, correctly matches the existing
      hardcoded default) and home-03.html (confirmed real `sell-your-car.html` — NOT `#` as the
      component had unconditionally hardcoded for every caller). Added a `rightCtaHref` prop (default
      `undefined` → renders the real dead `href="#"`, preserving home-02's exact behavior); both
      home-03's and home-04's callers now pass `/sell-your-car` explicitly. Verified via Playwright:
      home-03's "List Your Car Today!" now resolves to `/sell-your-car` (was `#`).
    - **RETROACTIVE FIX — wrong Swiper breakpoints/`spaceBetween` on 3 more already-migrated
      components** (same root-cause category as #81, found while building this page's reused
      sections): `home/BrandsSection.tsx`'s `.swiper-outbrand` (real config: `spaceBetween: 30`,
      breakpoints `375/575/767/991/1280` → `2/2/4/5/6` — had `spaceBetween: 16` and `575: 3`, wrong),
      `home-02/WhyChooseUsCarousel.tsx`'s `.swiper-car-box` (real config: `spaceBetween: 30`,
      breakpoints `767/991/1280` → `2/3/4` with matching `slidesPerGroup` — had `spaceBetween: 16` and
      only 2 breakpoints, `575/991` → `2/4`, skipping the real 3-column tier entirely), and both
      `blog-details/RelatedArticles.tsx` + `home/NewsAndReviewsSection.tsx`'s `.swiper-news` (real
      config bumps to 3 columns at 991px, not 1280px as both had coded). All fixed identically to #81.
      Verified via Playwright regression: `/`, `/home-02`, `/home-03` all still render their correct
      card counts with zero console errors after the fixes.
    - **Validation**: `npx tsc --noEmit`, `npm run lint`, and `npm run build` (production) all pass
      clean. No known additional intentional deviations from Aurexo beyond those explicitly disclosed
      above.
85. **`home-05.html` migrated — `/home-05` (4412 lines, the largest single source page yet)**.
    - **New header variant — `header/HeaderStyle4.tsx`**: `header-style-4 header-blur`, genuinely
      different DOM from every header built so far — a real contact-info top bar (address/email/phone
      + language dropdown + socials, on `bg-primary`) sits above ONE combined row (logo + nav + Sign
      In/Add Listing + search/compare/wishlist actions), not split into separate search-bar/nav rows
      like `HeaderStyle2`. `header-blur` (`header.scss:150-153`) is just a translucent gray
      background, no extra behavior.
    - **New hero variant — `home-05/HeroSearchSliderSection.tsx`**: a genuine hybrid of two already-
      built hero patterns — `home-04/HeroBannerSlider.tsx`'s real 2-swiper `Controller`-synced
      background/content slider + real parallax (WITH real nav arrows this time, wired via the
      `Navigation` module), combined with `home/HeroSearchSection.tsx`'s full filter-bar UI
      (`CheckboxDropdown`/`FilterSelectDropdown`/`RangeSlider`, all reused directly) rendered inside
      the synced thumb swiper instead of statically. The ~40-checkbox Features collapse is deliberately
      NOT reproduced, same established reasoning (COMPONENT_MAP.md #28).
    - **"New Vehicles" reuses `home-04/PopularSearchesPeekCarousel` byte-for-byte** (same 5 ids/badges/
      prices, confirmed via source diff) — extended with `heading` (default `"Popular Searches"`) and
      `sectionClassName` (default `"py-100 bg-white"`) props so home-05 can pass `"New Vehicles"` /
      `"py-100 background-light"` without forking the component.
    - **"Explore Our Brands" — new `home-05/BrandsGridCarousel.tsx`**: a genuinely different 12-brand
      `.swiper-outbrand-3` variant (`.out-brand-2` card, not `home/BrandsSection`'s own 6-brand
      `.out-brand`/`.swiper-outbrand`) with a real 2-row grid — `swiper.js`'s `.swiper-outbrand-3`
      config uses `slidesPerColumn: 2` with breakpoints `375/575/767/991/1280` → `2/2/4/5/6` columns,
      reproduced via Swiper's `Grid` module (same pattern as #76/#78/#82/#84). Source's own brand-8
      label carries a real, disclosed typo ("Huyndai") — kept verbatim.
    - **"Browse By Type" reuses `home-04/BrowseByTypeGallery` via a new `variant` prop**
      (`"style2" | "scroll"`): the exact same real click-to-expand mechanism (`app.js`'s
      `hoverActiveGallery()`, a generic `.slide-gallery-list .slide-gallery` click selector) drives
      both, but home-05's own version uses the BASE (non-`.style2`) expand ratio (`flex: 3.7`) inside a
      horizontally-scrollable `.gallery-scroll` wrapper (`overflow-x: auto`) instead of the clipped,
      evenly-distributed `.style2` row — confirmed via direct SCSS read of `page-title.scss`/
      `reponsive.scss`.
    - **"Compare Top Rated Vehicles" reuses `home-02/CompareTopRatedSection` with zero new props**:
      home-05's own 2 pairs are the SAME Tesla pair already used as home-02's default pair 1, plus the
      SAME Porsche pair already used as home-03's pair 3 — and its classes (`card-box-style-4`/
      `swiper-card-2`) exactly match the component's own defaults, confirmed via source diff.
    - **"Used Cars by Budget" — new `home-05/UsedCarsByBudgetSection.tsx`**: a genuinely new 5-tab
      section (`.menu-tab-style2 .car-box`), each tab a real client-side-switched static
      `grid-cols-3 xl-grid-cols-2 sm-grid-cols-1` grid of `ListingCard` (the exact `.card-box-style-1`
      shape). Every title across all 5 tabs matches an existing canonical listing (ids 1-8, confirmed
      via full source title/spec/price read) — no new data needed. Default active tab is
      "$20.000 - $50.000" (index 1), matching source's own active markers. The price-range labels don't
      actually correspond to the real prices shown underneath (e.g. the "$20.000 - $50.000" tab shows a
      $45.500,00 card) — a real, disclosed source inconsistency, not filtered/enforced.
    - **"Clients Reviews" reuses `common/ClientsReviewsCarousel`** with its own 3-testimonial (repeated
      to 6, matching source's real order) dataset — 2 of the 3 (Benjamin Parker/CEO Tesla, Olivia
      Williams/CEO BMW) reuse the EXACT SAME quote text already catalogued in
      `home/HomeClientsReviews.tsx`'s own dataset (confirmed via direct text comparison, not
      duplicated/invented); only "Emily Johnson"/CEO Avitex is genuinely new content, added directly in
      `home-05/page.tsx` rather than folded into the shared dataset (no other page reuses it).
    - **"News & Reviews" — new `home-05/NewsReviewsSplitSection.tsx`**: a genuinely different, static
      (non-swiper) layout from every other News/Reviews section built so far — one large
      `.post-style-2.radius-none` card + two stacked `.post-style-3` cards, all repeating the same real
      placeholder title/stub slug already used by `RelatedArticles.tsx`/`NewsAndReviewsSection.tsx`
      rather than inventing 3 more identical articles.
    - **Footer reused as-is**; no `NewsletterModal`/`VideoModal` on this page (confirmed absent from
      source).
    - **Validation**: `npx tsc --noEmit`, `npm run lint`, and `npm run build` (production) all pass
      clean. Playwright regression-check confirmed `home-04` fully unaffected by every extended shared
      component (`PopularSearchesPeekCarousel`, `BrowseByTypeGallery`) — all default props preserved
      exactly. No known additional intentional deviations from Aurexo beyond those explicitly disclosed
      above.
86. **`home-06.html` migrated — `/home-06` (3522 lines)**. `header/HeaderStyle4` reused with
    `bg-white` (not `header-blur`) — required extending it with a large prop set
    (`bgClassName`/`wrapperClassName`/`topBarContainerClassName`/`dividerClassName`/
    `mainContainerClassName`/`logoSrc`/`topLevelChevronColor`/`actionIconStroke`/
    `addListingButtonClassName`/`addListingIconColor`/`navListClassName`/`navWrapperClassName`), each
    justified by a real, confirmed source difference (dark logo, dark nav/action icons, `btn-primary`
    Add Listing button with a white icon, different wrapper/container classes — `header-wrapper-style-5`
    not `-style-4`, `max-w-1440 px-15` not `max-w-1920 header-spacing`, `mr-50` nav margin not
    `margin-right-auto`, plain `menu menu` nav list with no `style-2` modifier).
    - **RETROACTIVE FIX — 2 real header color bugs on home-05.html, found while building these
      overrides**: (1) `Nav.tsx`'s 4 top-level chevrons (Home/Listing/News/Pages) and
      `icons.tsx`'s shared `SearchIcon`/`SignInIcon`/`CompareIcon`/`WishlistIcon` all hardcoded a fixed
      color (`#9FA1A4`/`#1C1C1C`, correct for `Header.tsx`'s own dark-icon context) — but home-05.html's
      own real source has ALL of these as `white` (confirmed via direct source diff on every instance),
      since its header sits on a dark/blurred hero. These were rendering as invisible-on-dark-background
      icons on the already-shipped `/home-05` page. (2) The OPPOSITE bug on `AddListingIcon`: its shared
      default is `"white"` (correct for `Header.tsx`'s `btn-primary` usage), but home-05.html's own
      DESKTOP Add Listing button is real `btn-white` with a real `#1C1C1C` icon — a white icon on a
      white button was rendering completely invisibly. Fixed by adding a `stroke`/`color` prop to every
      one of these icon components (all defaulting to their pre-existing correct value, so
      `Header.tsx`/`HeaderStyle2.tsx` are unaffected) and a `topLevelChevronColor` prop to `Nav.tsx`
      (default `#9FA1A4`), with `HeaderStyle4.tsx` now passing every color explicitly rather than relying
      on shared defaults tuned for a different header. Verified via Playwright regression: home-05's
      Home chevron and search icon both now compute `rgb(255, 255, 255)` (were dark before).
    - **New hero — `home-06/HeroSliderSection.tsx`**: the same real 2-swiper `Controller` sync + real
      nav arrows as `home-05/HeroSearchSliderSection.tsx`, but genuinely simpler — NO filter bar inside
      the hero section at all (confirmed via source diff).
    - **New filter bar — `home-06/FilterBarSection.tsx`**: home-06.html moves its tabs + filters into
      their own separate `bg-primary py-40` section below the hero (not inside the hero itself). The
      primary Brand/Model/Miles/Price row still reuses `CheckboxDropdown` (`layout="bar"`), but the
      Advanced panel here is genuinely simpler — plain native `<select>` elements
      (`.search-cars__select-advanced`) instead of the custom `FilterSelectDropdown` used everywhere
      else (confirmed via source diff, a real different DOM). The ~40-checkbox Features collapse is
      deliberately not reproduced (same established reasoning, #28).
    - **"New Cars"/"Used Cars" reuses `home/NewCarsSection` byte-for-byte, zero new props**: same real
      `.swiper-card-7` 2-row Grid config and same ids (1-8 New, 1-6 Used), confirmed via full source
      title/spec/price read.
    - **"Explore Our Brands" reuses `home/BrandsSection` byte-for-byte, zero new props**: same 6-brand
      `.out-brand`/`.swiper-outbrand` content.
    - **"Browse By Type" reuses `home-03/BrowseByTypePhotoCards` byte-for-byte, zero new props**: same
      8-type `.card-box-style-5`/`.swiper-card-8` content (images, labels, vehicle counts all match).
    - **"Compare Top Rated Vehicles" reuses `home-02/CompareTopRatedSection`** with home-03/05's own
      `.swiper-card-3` classes/breakpoints, but with ALL 3 known pairs (the Tesla pair, the Jeep/Toyota
      pair, and the Porsche pair already used elsewhere) rendered together — the first page to show all
      3 side by side rather than a 2-pair subset.
    - **"Financing Calculator" — extended `home/FinancingCalculatorSection` with a 3rd `variant="outline"`**:
      `bg-white py-100` (not `background-light`/parallax), `.caculator-box.bg-white.outline.radius-12`
      (a modifier neither other variant has), `h2.mb-18` (not `mb-20`), `gap-22 gap-x-16` grid gap (not
      `gap-13`), `mb-2` result labels (not `mb-4`), and a plain `caculator-box--image` companion image
      class. Also gained an `afterContent` slot — home-06.html shares this SAME `bg-white py-100` section
      with a following 2-column promo banner (confirmed via source diff, one section wraps both), so
      `afterContent` renders `common/SellBuyPromoBanner` (with the same `leftTitleHref` override already
      used by home-03/05) inside the same section rather than a separate one.
    - **"Clients Reviews" reuses `common/ClientsReviewsCarousel`** with the exact same shared
      `emilyBenjaminOliviaTestimonials` dataset as home-05.html (byte-identical 3-testimonial/6-slide
      set, confirmed via source diff) — extracted this session into `src/data/clientTestimonials.ts`
      (was inline in home-05's own `page.tsx`) once it became a real 2nd consumer, per the established
      "extract into `common`/`data` once a second page needs it" precedent.
    - **"News & Reviews" reuses `blog-details/RelatedArticles`** with its own real, distinct
      `.swiper-news-2` config (`assets/js/swiper.js`: only 2 slides, breakpoints `0/400/767` → `1/1/2`,
      not 3 slides/3 columns like every other News/Reviews section) — exposed via new
      `swiperClassName`/`paginationClass`/`breakpoints` props (each defaulting to the existing
      `.swiper-news` values, so blog-details-1/2/home-02/home-04 are unaffected).
    - **Validation**: `npx tsc --noEmit`, `npm run lint`, and `npm run build` (production) all pass
      clean. Playwright regression-checked `home-05`, `home-04`, `/`, and `home-02` — all unaffected by
      every extended shared component beyond the intentional home-05 color bug fixes described above.

87. **`home-07.html` migrated — `/home-07` (5215 lines, the largest home variant)**. `header/HeaderStyle4`
    reused with the same `bg-white` skin as home-06.html, but a THIRD distinct wrapper/container combo
    (`header-wrapper-style-6`; `max-w-1920 header-spacing` top bar/main container matching home-05's own
    values, NOT home-06's `max-w-1440 px-15`; a THIRD distinct nav wrapper value `mr-20`, matching neither
    home-05's `margin-right-auto` nor home-06's `mr-50`) — all existing `HeaderStyle4` props, no new ones
    needed. `<body class="home-06">` is a real, disclosed leftover copy-paste class from home-06.html
    (harmless, confirmed via source read — body classes aren't used for anything functional besides
    `counter-scroll` detection, which this page also lacks).
    - **Hero — extended `home/HeroSearchSection` with 6 new props**: this is the ONLY page-title hero on
      the site with NO swiper background slider at all (`showSlider={false}` — no `.page-title--slider`
      wrapper, no nav arrows, no bullet pagination in source, confirmed via grep), showing one static
      `.page-title--image` below the filter bar instead (`staticImageSrc="/assets/images/page-title/
      page-title-7.png"`). No `.category-list` either (`showCategoryList={false}`). Its own real `<h2>`
      (not `<h1>` like every other page-title hero) with extra `text-primary letter-normal` classes is a
      genuine, disclosed heading-level inconsistency (`titleTag="h2"`, `titleExtraClassName`).
      `titleCentered` reproduces its own real `text-center`/`margin-auto` tab-bar centering.
    - **RETROACTIVE FIX — "Toggle advanced filters" button's `style2` modifier wrongly coupled to
      `titleCentered`**: home-02.html's own version has BOTH `margin-auto`/`text-center` centering AND
      this button's `style2` modifier together, so the original code bundled them under one flag — but
      home-07.html's own version has the centering WITHOUT `style2` on this button (confirmed via source
      diff), proving they're independent. Split into its own `filterButtonStyle2` prop (defaulting to
      `titleCentered` so home-02.html's existing behavior is unchanged); home-07 passes
      `filterButtonStyle2={false}` explicitly.
    - **"Wide Vehicle Selection" reuses `home-02/WhyChooseUsCarousel`'s exact same 4 icon/title/
      description cards byte-for-byte (confirmed via source diff)**, via 2 new props:
      `showPromoBanner={false}` (no promo banner at all here — confirmed via source diff) and
      `containerClassName="container pb-100"` combined with `bare` (this reuse has no `<section>`
      wrapper at all in source, just a standalone `.container.pb-100` div). Each card's own href
      genuinely differs per-page here (`/listing-grid4-columns`, `/about-us`, a literal dead `#`,
      `/services-center` — confirmed via source diff), unlike home-02's/home-04's own all-same-href
      callers.
    - **New — `home-07/PopularSearchesGridSection.tsx`**: genuinely different DOM from every other
      "Popular Searches" section on the site (all of which are swiper carousels) — a single static
      `grid grid-cols-4 xl-grid-cols-3 lg-grid-cols-2 sm-grid-cols-1` of 29 `.card-box-style-1` cards
      with 7 purely decorative car-type tab pills above it (confirmed via grep — only one
      `.content-inner` exists in source, no per-tab content at all). Reuses the same dark tab-bar icon
      set as `home-02/PopularSearchesSection.tsx` — extracted to a shared `DARK_CAR_TYPE_ICONS` export in
      `home/carTypeIcons.tsx` (alongside the existing white-stroke `CAR_TYPE_ICONS`) on this 2nd use, per
      the established "extract into `common`/shared file once a 2nd page needs it" precedent; home-02's
      own component updated to import it instead of its own local copy. All 29 cards map onto the
      existing 8-listing pool in a real, irregular repeat order (not an even cycle), preserved verbatim.
      **Bug caught by Playwright verification**: the initial implementation's `.content-inner` div was
      missing the `active` class every other `.content-inner` usage in the codebase carries — per
      `tabs.scss`, `.content-inner` defaults to `opacity:0; visibility:hidden; z-index:-1` without it, so
      the entire 29-card grid rendered completely invisible (heading/tabs still showed). Fixed before
      shipping; re-verified visually (opacity 1, Compare modal opens correctly from a card in the grid).
    - **New — `home-07/BrowseByTypePillsSection.tsx`**: genuinely different DOM from
      `home/BrowseByTypeSection.tsx` (that one's a `.swiper-brand` carousel over `banner-brand.png`) —
      a static `flex flex-wrap` list of 15 `.brand-item-style-3` pills (no swiper at all) over a real
      `simpleParallax` background (`bg-fixed.jpg`, same mechanism as `common/ParallaxImage.tsx` — this
      component's own header comment already explicitly listed home-07.html as a planned reuse target),
      with a separate static `.overlay-parallax` dark-tint div (`rgba(0,0,0,0.4)`) as its own sibling, not
      part of the parallax image. All 15 pills share one repeated icon (a real, disclosed simplification,
      confirmed via source read) — unlike `home/carTypeIcons.tsx`'s per-type icon sets used elsewhere.
    - **New — `home-07/LatestForSaleSection.tsx`**: `col-lg-8` list reuses `listing/HalfMapListingCard`
      (the `.card-box-style-9` "list view" shape, already built for `listing-gridstyle-halfmap.html`) for
      4 cards mapped onto the existing listing pool (ids 1,2,3,1 — Audi A6 Avant E-Tron reused twice,
      confirmed via title read). `col-lg-4` sidebar reuses `common/SellBuyPromoBanner`'s same 2 cards
      (byte-identical images/copy/hrefs to home-03/04's own calls) via a new `layout="stack"` prop, since
      this page stacks them vertically in a sidebar column instead of the `row`/`col-lg-6` layout every
      other caller uses (confirmed via source diff) — the component was refactored to share the 2 card
      bodies between both layouts rather than duplicating them.
    - **"Why Choose Us" reuses `common/WhyChooseUsSection`'s `variant="light"` default** with its own 4th
      distinct `wrapperClassName` combo (`"style2"` alone — neither the light default's `"style2 style3"`
      nor home-04's `"outline style2"`) and home-04's own `statsGridModifierClass="gap-30"` (confirmed via
      source diff).
    - **"Clients Reviews" reuses `common/ClientsReviewsCarousel`** with the same shared
      `emilyBenjaminOliviaTestimonials` dataset as home-05/06, real `cardHref="/clients-reviews"` links
      (same pattern as home-03's own), and a new `sectionClassName` prop.
    - **RETROACTIVE FIX — `ClientsReviewsCarousel`'s own section background hardcoded, dropping 2 real
      per-page backgrounds**: this section's background class genuinely varies per page (home-05.html's
      own is `background-light py-100`, home-06.html's/home-07.html's own is `bg-white py-100`, confirmed
      via source diff), but every existing caller was hardcoded to plain `py-100` regardless — silently
      dropping the real background on the already-shipped `/home-05` and `/home-06` pages too. Fixed by
      adding a `sectionClassName` prop (default `"py-100"`, so index.html/home-02.html/home-03.html/
      about-us.html — all genuinely plain `py-100`, no bug — are unaffected); home-05 and home-06 now pass
      their own real class explicitly, and home-07 passes `"bg-white py-100"`.
    - **New — `home-07/DownloadAppCtaSection.tsx`**: genuinely different DOM from both
      `home/DownloadAppSection.tsx` and `services-center/DownloadAppSection.tsx` (both standalone
      `grid-cols-2` sections) — a `.cta-section.background-be` (`.cta--content`/`.cta--image` siblings,
      plain `<img>`, no hover-scale wrapper) nested inside the SAME `py-100 bg-white` "Clients Reviews"
      section as a trailing `tf-spacing`-separated block (confirmed via source diff — one section wraps
      both), rendered via `ClientsReviewsCarousel`'s existing `children` slot. Uses the `-primary`
      app-store/google-play icon variant, same as `services-center/DownloadAppSection.tsx`'s own.
    - **No Financing Calculator or News & Reviews section on this page at all** (confirmed absent via a
      full section-boundary scan of the source) — a real, disclosed omission, not a migration gap.
    - **Validation**: `npx tsc --noEmit` and `npm run lint` both pass clean. Playwright-verified `/home-07`
      itself (header colors/classes, static hero with no slider, all 7 body sections, Sign In/Compare
      modals) plus regression-checked `home-02`, `home-05`, `home-06` (all touched by the shared
      `WhyChooseUsCarousel`/`SellBuyPromoBanner`/`ClientsReviewsCarousel`/`HeroSearchSection`/
      `PopularSearchesSection` changes) — all unaffected beyond the intentional retroactive fixes above.

88. **`home-08.html` migrated — `/home-08` (5129 lines)**. Header reuses the base `header/Header`
    component byte-for-byte with its own default props (`variant="style-1"`, `bgClassName="bg-white"` —
    confirmed via source diff, identical to index.html's own header) — genuinely the first home variant
    since home-03.html not to need `HeaderStyle2`/`HeaderStyle4`.
    - **New hero — `home-08/HeroSplitSearchSection.tsx`**: genuinely different DOM from every other
      page-title hero — no swiper background at all (confirmed via grep, same conclusion as home-07's
      own no-slider variant), but a real 2-column FLEX split layout (`page-title.scss:69-75`:
      `.page-title-wrapper { display: flex }`) putting the filter form and a static `page-title-8.png`
      image side by side (not stacked, unlike home-07's own variant), a plain `<p class="h4">` title (not
      `<h1>`/`<h2>` like every other page-title hero), and its own distinct filter-icon button (an inline
      "sliders" SVG, not the shared `filter.svg` `<img>` every other hero uses).
    - **Bug caught by Playwright verification**: `.search-cars__advanced` is `display:none` by default in
      the compiled CSS — every other hero variant overrides it with an inline `style={{ display: "block"
      }}` when open, but this new component's first draft omitted that override, so the panel mounted in
      the DOM but stayed invisible. Fixed by adding the missing inline style; re-verified visually (panel
      now renders correctly with all 5 dropdowns + year-range slider).
    - **"Browse By Type" reuses `home-02/BrowseByTypeCardsSection`'s exact same 10-type dataset
      byte-for-byte (confirmed via source diff)**, via 5 new props for its own `bg-primary py-80`
      dark/blur skin: `sectionClassName`, `headingClassName="text-white"`, `checkAllButtonClassName`
      (`btn-blur` instead of `btn-line-style-2`), `checkAllIcon` (its own distinct 20×20 white icon, not
      the shared 17×17 dark one), `cardClassName="card-box-style-3 card-box-blur"` (not `bg-white`), and
      `paginationVariant="pagination-white"` (not `pagination-dark`).
    - **RETROACTIVE FIX — `BrowseByTypeCardsSection`'s own "Check All Car Type" button was missing its
      icon**: home-02.html's own source has a real circular-arrow SVG on this button that the component
      never rendered — added back as the default `checkAllIcon`.
    - **"Popular searches" reuses `home-03/PopularSearchesCarousel`'s untabbed shape** with its own real
      `.swiper-card-style-2` class (byte-identical config to `.swiper-card` per `assets/js/swiper.js`,
      confirmed) and its own 10-slide id sequence (`[1,2,3,4,1,1,2,3,4,1]`, confirmed via title read) —
      exposed via new `slideIds`/`swiperClassName`/`paginationClass`/`cardTitleExtraClassName` props.
      `ListingCard.tsx` gained a matching `titleExtraClassName` prop for this reuse's own real `mt-1`
      title nudge (a trivial 1px difference, confirmed via source diff).
    - **"Compare Top Rated Vehicles" reuses `home-02/CompareTopRatedSection`** with home-03/05/06/07's
      own `.swiper-card-3` classes/breakpoints and all 3 known pairs — same call shape as home-06/07.
    - **New — `home-08/UsedCarsByBudgetCarouselSection.tsx`**: genuinely different DOM from home-05's own
      "Used Cars by Budget" (`home-05/UsedCarsByBudgetSection.tsx`, a static grid of light `ListingCard`s)
      — this is a real per-tab `.swiper-container.swiper-card` carousel (confirmed via source read, each
      of the 5 price tabs has its own distinct swiper markup with a different card count) of the
      dark/blurred `ListingCardDark` over a `bg-primary` section, with its own distinct tab-pill class
      `.car-box-style-5` (not home-05's `.car-box`). All 5 tabs map onto the existing "Trending Searches
      Near You" canonical listings (ids 13-15). `ListingCardDark.tsx` gained a matching
      `titleExtraClassName` prop for the same real `mt-1` title nudge found on this reuse.
    - **"Clients Reviews" reuses `common/ClientsReviewsCarousel`** with the shared
      `emilyBenjaminOliviaTestimonials` dataset, `cardHref="/clients-reviews"`, and its `children` slot
      rendering `common/SellBuyPromoBanner` with `rightTitleHref`/`rightCtaHref="/sell-your-car"` (both
      cards here link to `/sell-your-car` — a real, distinct per-page href combo from home-02/03/04/07's
      own calls, confirmed via source diff).
    - **"Financing Calculator" — extended `home/FinancingCalculatorSection`'s `"outline"` variant with 4
      new override props** (`outlineSectionClassName`, `outlineHeadingClassName`,
      `outlinePriceRateLabelClassName`, `outlineResultLabelClassName`) rather than a 4th variant string,
      since the wrapper/grid/image shape is otherwise identical to home-06's own `"outline"` variant: this
      reuse has its own `background-light py-100` section (not `bg-white`), `h2.mb-20` (not `mb-18`),
      uniform `mb-8` on every field label (not home-06's own mixed `mb-10`/`mb-8`), and `mb-4` result
      labels (not `mb-2`) — all confirmed via source diff.
    - **New — `home-08/NewsReviewsGridSection.tsx`**: genuinely different DOM from
      `blog-details/RelatedArticles.tsx` — a static `grid grid-cols-2 gap-10` of 4 `.post-style-4` cards,
      no swiper at all (confirmed via source read). Same repeated-title placeholder pattern as every
      other News & Reviews section — all 4 cards link to the same real stub blog entry (id 13 in
      `blogPosts.ts`).
    - **Validation**: `npx tsc --noEmit`, `npm run lint`, and `npm run build` (production) all pass clean.
      Playwright-verified `/home-08` itself (header, split-layout hero + advanced-filter panel, all 8
      body sections including a real tab-switch on "Used Cars by Budget", Sign In/Compare modals) plus
      regression-checked `/`, `home-02`, `home-03`, `home-06` (all touched by the shared
      `BrowseByTypeCardsSection`/`PopularSearchesCarousel`/`FinancingCalculatorSection`/`ListingCard`/
      `ListingCardDark` changes) — all unaffected beyond the intentional fixes above.

89. **`home-09.html` migrated — `/home-09` (4582 lines)**. Header reuses `header/Header` (`variant=
    "style-1"`) with the SAME transparent/`header-fixed-primary` treatment as home-04.html, plus its own
    real `header-absolute` modifier and `max-w-1840` container (not `max-w-1920`, confirmed via source
    diff) — exposed via the newly-added `containerClassName` prop. `<body class="home-style-9">` and a
    real `radius-40` (rounded corners) modifier carried by nearly every section on this page.
    - **RETROACTIVE FIX — 3 real header color/structure bugs on the already-shipped home-04.html, found
      while building these overrides**: (1) `Header.tsx` always hardcoded the dark `logo.png`, but
      home-04.html's own real source has a WHITE logo (`logo-white.png`, confirmed via source diff) —
      invisible against its own dark transparent hero. (2) `Header.tsx` always called
      `SignInIcon`/`SearchIcon`/`CompareIcon`/`WishlistIcon`/`AddListingIcon` with no color override, so
      home-04.html's own real WHITE action icons (and its real DARK Add Listing icon, since its Add
      Listing button is `btn-white` not `btn-primary`) rendered with the wrong color — same class of bug
      already found and fixed on `HeaderStyle4`'s own home-05.html reuse. (3) `Header.tsx` always called
      `Nav` with no props, silently using `Nav.tsx`'s own defaults (`mr-18`/no `listClassName`/`#9FA1A4`
      chevrons) even though home-04.html's own real source is `margin-right-auto`/`menu menu style-2`/
      white chevrons. All 3 fixed via 6 new props (`logoSrc`, `actionIconStroke`, `addListingIconColor`,
      `signInButtonClassName`, `addListingButtonClassName`, `navWrapperClassName`/`navListClassName`/
      `navChevronColor`), each defaulting to the pre-existing value so index.html's own usage is
      unaffected.
    - **BUG CAUGHT BY PLAYWRIGHT VERIFICATION — `.header-wrapper` defeats `header-absolute`'s transparent
      overlay**: `header.scss`'s `.header-wrapper` has an unconditional `height: 94px; position:
      relative`, reserving 94px of document flow regardless of the inner `<header>`'s own `position:
      absolute` — pushing the hero down instead of letting the header float over it. home-09.html's own
      real source has NO `.header-wrapper` div at all for its `header-absolute` header (confirmed via
      source diff — the `<header>` is a direct child of `#wrapper`). Fixed via a new `noWrapper` prop on
      `Header.tsx` that omits the wrapper div entirely; home-09 passes it, home-04/index.html unaffected.
    - **SECOND bug caught by the SAME verification pass, on home-04.html**: after the icon-color fix
      above, home-04.html's real white nav/Sign-In/action-icon text rendered invisibly — white-on-white —
      because its `.header-wrapper` was missing a real `header-sticky` modifier its own source carries
      (confirmed via source diff). `.header-wrapper.header-sticky` is what actually gives this
      transparent header `position: fixed` so it overlays the hero; without it the wrapper falls back to
      its own default in-flow `position: relative`, whose transparent background shows the page's plain
      white body behind the header. Fixed via a new `wrapperExtraClassName` prop; home-04's `page.tsx`
      now passes `"header-sticky"`. (The separate scroll-driven show/hide behavior this class family
      also supports remains a deferred, tracked feature — unrelated to this positioning fix.)
    - **Hero — extended `home/HeroSearchSection` with `sliderExtraClassName="radius-40"`** (its own
      `.page-title--slider` carries the page-wide rounded-corner signature) and its own real banner order
      (`banner-9,1,2,3,5` — `banner-9.jpg` is a real, page-specific image not used elsewhere).
    - **"Browse By Type" reuses `home-03/BrowseByTypePhotoCards` byte-for-byte** (same 8-type dataset) via
      its new `titleSectionClassName` prop (`mb-28 wow fadeInDown`, not `mb-30 wow fadeInUp`).
    - **"New Vehicles" reuses `home-02/PopularSearchesSection`'s exact same 7-tab shape** (same dark
      tab-bar icons) via new `heading`/`sectionClassName`/`tabs`/`showPagination` props — 6 of 7 tabs'
      ids are byte-identical to home-02's own defaults; only "Sedan" differs (`[1,2,3,4]`, not
      `[1,2,3,4,1,2]`), and this reuse has NO bullet pagination at all (confirmed via grep).
    - **"Explore Our Brands" reuses `home-05/BrandsGridCarousel` byte-for-byte, zero new props** (same
      12-brand `.swiper-outbrand-3` dataset, confirmed via source diff).
    - **"Why Choose Us" reuses `common/WhyChooseUsSection`'s `variant="light"` default** with its own 5th
      distinct `wrapperClassName` (`"style2"` alone) + `statsGridModifierClass` (`"gap-30
      counter-spacing"`, neither the light default's `gap-130 counter-spacing` nor home-04's own plain
      `gap-30`) + new `headingClassName="mb-15"` + `sectionExtraClassName="radius-40"` props.
    - **"Compare Top Rated Vehicles" reuses `home-02/CompareTopRatedSection`** with 3 new props this
      migration added (`sectionClassName="bg-white py-100"`, `titleSectionClassName`, `contentClassName=
      "style-2"`) plus its own real `card-box-style-7 style3` card class (not `style2` like every other
      reuse) and `<br>`-containing titles for pairs 2/3 (confirmed via source diff — `title` is now typed
      `React.ReactNode`, not `string`).
    - **"Trending searches near you" reuses `home/TrendingSearchesSection`** (index.html's own "Trending
      Searches Near You" widget) with its own 5-slide sequence (l13, l14, l15, l14, l14 — no 4th
      content-mismatch slide here), lowercase heading, `radius-40` section modifier, and `mb-14` card
      dividers (not `mb-16`) via 4 new props this migration added (also retroactively added the missing
      "View All" icon SVG, confirmed present in index.html's own source but never rendered).
    - **"Financing Calculator" reuses `home/FinancingCalculatorSection`'s `"outline"` variant** with the
      SAME override values as home-08.html's own call (`bg-white py-100`/`mb-20`/`mb-8`/`mb-4`) plus a new
      5th override, `outlineImageClassName="max-w-628 ml-60 move3"` — a THIRD distinct companion-image
      animation-class variant.
    - **"Clients Reviews" reuses `common/ClientsReviewsCarousel`** with the shared
      `emilyBenjaminOliviaTestimonials` dataset, `cardHref="/clients-reviews"`, and its own real
      `.swiper-testimonior-2` config (real `loop`, max 2 columns — never reaches 3 like the base config)
      via 4 new props this migration added. Source's own slide 3 is a plain, non-linked div while the
      other 4 are real links — a real, disclosed per-card inconsistency treated as decorative demo noise
      and not reproduced at the link level.
    - **"Find Your Perfect Used Car" reuses `home-07/DownloadAppCtaSection`** via its new
      `variant="style-2"` (a real `.cta-section.style-2`/`image-effect-scale` modifier combo, not
      `.background-be`) and `standalone` (this reuse is its own `py-100 bg-white` section, not nested
      inside "Clients Reviews" like home-07's own usage).
    - **Footer reuses `footer/Footer` with its new `extraClassName="radius-40"` prop.**
    - **Validation**: `npx tsc --noEmit`, `npm run lint`, and `npm run build` (production) all pass
      clean. Playwright-verified `/home-09` itself (transparent overlay header confirmed truly overlaying
      the hero after the `noWrapper` fix, rounded-corner hero + all 9 body sections, real tab-switch on
      "New Vehicles", Sign In/Compare modals) plus regression-checked `/`, `home-02`, `home-04` (both
      header bugs fixed, verified via computed styles), `home-05`, `home-06`, `home-07`, `home-08` — all
      unaffected beyond the intentional fixes above.

90. **`home-10.html` migrated — `/home-10` (4148 lines)**. `<body class="home-style-10 background-light">`,
    `<div id="wrapper" class="bg-white">`. This whole page uses fixed-height `<div class="tf-spacing">`
    divider divs between sections instead of section-level `py-100` padding (confirmed via source diff) —
    every reused section is passed a plain `bg-white`/no-padding override accordingly, with explicit
    `tf-spacing` divs placed in `page.tsx` matching source exactly.
    - **Header reuses `header/Header`** (`variant="style-1"`, `bgClassName="bg-white"`) with its own real
      `header-absolute` modifier, `relative max-w-1440 px-15` container (not `max-w-1920`), plain `menu`
      nav list (no `style-2`), and its own distinct `header-right-style-3` modifier — the last one exposed
      via a brand-new `headerRightClassName` prop. Like home-09.html, home-10.html's own header has NO
      `.header-wrapper` div at all (confirmed via source diff) — `noWrapper` reused.
    - **RETROACTIVE FIX — `.header-right` was missing a real `header-right-style-2` modifier on the
      already-shipped home-04.html** (confirmed via source diff) — `Header.tsx` never rendered any
      `.header-right` modifier at all before this. Fixed via the new `headerRightClassName` prop; home-04's
      own `page.tsx` now passes it explicitly.
    - **Hero (`home-10/HeroTextSlider.tsx`, NEW) is a genuinely new shape** — a single swiper where each
      slide bundles its own background image AND text/CTA overlay together (`.tp-showcase-slider-bg` and
      `.page-title--slider-content` are siblings inside the same `.swiper-slide`, confirmed via source
      read — not two separately-synced swipers like home-04's `HeroBannerSlider`). All 4 slides
      (banner-10/1/2/3) repeat identical marketing copy ("Mercedes-Maybach S-Class Haute Voiture",
      "$490/Month for 24 mont (0% APR Representativ)" — both real, disclosed source typos, kept verbatim)
      — only the background image differs. No nav arrows, bullet pagination only (confirmed via grep).
    - **"Browse By Type" reuses `home-03/BrowseByTypePhotoCards` byte-for-byte** (same 8-type dataset) via
      its new `sectionClassName="bg-white"` prop (no `py-100`).
    - **"Explore Our Brands" reuses `home/BrandsSection`'s exact same 6-brand dataset byte-for-byte** via 3
      new props (`sectionClassName="bg-white"`, `titleSectionClassName="mb-42"`, `cardClassName=
      "out-brand-2"` — not `out-brand`).
    - **RETROACTIVE FIX — the "View All Brand" button on `BrandsSection` was missing its real icon** (a
      circular-arrow SVG, confirmed present in index.html's own source) — added back as the default
      `VIEW_ALL_ICON`, the 3rd occurrence of this exact missing-icon bug pattern this session (after
      `BrowseByTypeCardsSection`'s "Check All Car Type" and `TrendingSearchesSection`'s "View All").
    - **"Popular searches" (`home-10/PopularSearchesTabGridSection.tsx`, NEW) is a genuinely 3rd distinct
      "Popular Searches" shape on the site** — neither `home-02/PopularSearchesSection`'s swiper-per-tab
      carousel nor `home-07/PopularSearchesGridSection`'s single-grid-with-decorative-tabs: this is a REAL
      per-tab static grid (7 distinct `.content-inner` blocks, no `.swiper-container` anywhere in this
      section, confirmed via source read), with the same dark tab-bar icon set as `home-02`'s/home-09's own
      "New Vehicles" reuse. Heading is a plain standalone centered `<h2>` (no `.title-section` wrapper),
      unlike every other "Popular Searches" heading on the site. **Confirmed source quirk, not a migration
      bug**: home-10.html's own real "SUV" tab content is byte-for-byte identical to its "Sedan" tab, and
      "Luxury"/"Hatchback"/"Crossover" are all byte-for-byte identical to each other (confirmed via direct
      diff of all 7 `.content-inner` blocks) — preserved verbatim, flagged in the component's own comment,
      caught and correctly identified (not silently "fixed") during Playwright verification.
    - **"Compare Top Rated Vehicles" reuses `home-02/CompareTopRatedSection`** with the same
      `card-box-style-7 style3`/`content style-2`/`<br>`-title pairs as home-09.html's own reuse, but its
      own `bg-white` section (no `py-100`) and `mb-14 wow fadeInDown` title-section (not `mb-12`).
    - **"Financing Calculator" reuses `home/FinancingCalculatorSection`'s `"outline"` variant** with its
      own `bg-white` section (no `py-100`) and `max-w-628 ml-60` companion image (not `...move3` like
      home-08/09's own reuse) — otherwise the same `mb-20`/`mb-8`/`mb-4` label overrides.
    - **"Clients Reviews" reuses `common/ClientsReviewsCarousel`** with the shared
      `emilyBenjaminOliviaTestimonials` dataset, real `cardHref="/clients-reviews"` links, its own plain
      `.swiper-testimonior` base config (not home-09's own `-2` variant), and a `bg-white` section (no
      `py-100`).
    - **"All Car" is the same real 3-in-one-section composition already established for home-04.html**: the
      4 icon-box carousel (`home-02/WhyChooseUsCarousel`, all-default `/listing-grid4-columns` hrefs) + its
      promo banner (`rightCtaHref="/sell-your-car"`, the only override needed) + `blog-details/
      RelatedArticles` (byte-identical default post-4/5/6 slides) — all sharing ONE `bg-white` `<section>`
      via `bare` on both, with a `tf-spacing` div between (confirmed via source diff).
    - **Footer reused as-is.**
    - **Validation**: `npx tsc --noEmit`, `npm run lint`, and `npm run build` (production) all pass clean.
      Playwright-verified `/home-10` itself (header truly overlays with no wrapper div and correct
      `header-right-style-3`, hero slider transitions confirmed via pagination click, all 8 body sections
      present with correct `tf-spacing` gaps, real tab-switch confirmed across "Popular searches"'s 7 tabs,
      "View All Brand" icon present, Sign In modal opens, Compare icon routes to `/compare`) plus
      regression-checked `/home-04` (both header fixes verified), `/` (index, `BrandsSection` defaults
      unaffected), `/home-03` (`BrowseByTypePhotoCards` defaults unaffected), `/home-06` (`CompareTopRatedSection`/
      `FinancingCalculatorSection`/`ClientsReviewsCarousel` all unaffected) — all clean, no console/runtime
      errors, no hydration mismatches.

91. **RETROACTIVE FIX — `home-03/BrowseByTypePhotoCards`'s "Check All Car Type" button was missing its
    real icon**, found while checking home-06.html's own "Browse By Type" button on request. Confirmed
    present (byte-identical circular-arrow SVG, `viewBox="0 0 17 17"`, `fill="#1C1C1C"` — the same icon
    already used for "View All Brand" on `home/BrandsSection.tsx`) in the real source of every page that
    reuses this shared component: `home-03.html` (line 1730), `home-06.html` (line 2312), `home-09.html`
    (line 964), `home-10.html` (line 536) — all 4 byte-identical. Fixed once in the shared component
    (new `CHECK_ALL_ICON` constant), fixing all 4 already-migrated pages simultaneously. 4th occurrence
    of this exact missing-icon bug pattern this session (after `BrowseByTypeCardsSection`'s own "Check
    All Car Type", `TrendingSearchesSection`'s "View All", and `BrandsSection`'s "View All Brand").
    **Validation**: `npx tsc --noEmit` + `npm run lint` clean; confirmed via SSR HTML fetch that the
    icon's SVG path now renders on `/home-03`, `/home-06`, `/home-09`, and `/home-10`.

92. **RETROACTIVE FIX (×2) — `home-02/CompareTopRatedSection`'s "Compare Top Rated Vehicles" button**,
    found while checking home-06.html's own button on request:
    - **Missing icon** (5th occurrence of this session's missing-icon pattern): "View All" never
      rendered its real icon — confirmed present (same circular-arrow SVG) in EVERY page's own source
      that reuses this component, including `home-02.html` itself (the component's own base, line
      3942) — meaning this bug affected all 5 reuses (home-02/03/06/09/10) simultaneously, not just one
      page's override. Fixed once via a new `VIEW_ALL_ICON` constant.
    - **Wrong title-section class on home-03/home-06 specifically**: both pages' real source is `mb-42
      wow fadeInDown` (confirmed via source diff, byte-identical between the two), but neither page's
      `page.tsx` was passing `titleSectionClassName` at all, so both silently fell back to the
      component's own default (`mb-40 wow fadeInUp`) — which is only actually correct for home-02.html
      itself. Fixed by passing the real value explicitly from `home-03/page.tsx` and `home-06/page.tsx`
      (home-09/home-10 were already passing their own correct distinct values,`mb-12`/`mb-14 wow
      fadeInDown`, from their original migrations).
    **Validation**: `npx tsc --noEmit` + `npm run lint` clean; confirmed via SSR HTML fetch that the icon
    now renders on `/`, `/home-02`, `/home-03`, `/home-06`, `/home-09`, `/home-10`, and that `/home-03`
    and `/home-06` now render `title-section mb-42 wow fadeInDown` instead of the wrong default.

93. **RETROACTIVE FIX (×4) — home-07.html reported as significantly broken layout**, found via a full
    section-by-section class-name re-audit against source:
    - **Hero `flex` bug (`home/HeroSearchSection.tsx`)**: the component always hardcoded a `flex` class
      on the root `.page-title` section. home-07.html's own real source (`page-title-style-5`) has NO
      `flex` class at all (confirmed via source diff against every other page-title hero — index/home-02/
      03/09.html all genuinely do carry it) — `page-title-style-5`'s own SCSS (`padding: 87px 0 0`, no
      height/flex) is a plain padded block layout. The stray `flex` laid out `.search-cars` and the
      static-image `.container` as flex ROW siblings instead of stacked blocks — a real, significant
      layout break, and very likely the main cause of the reported issue. Fixed via a new `showFlex`
      prop (home-07 passes `false`).
    - **Hero `.search-cars` margin bug (same component, home-07 AND home-09)**: `.search-cars` always
      hardcoded `margin-top-auto margin-bottom-auto` (meaningless without the flex parent above).
      home-07.html's own real value is plain `search-cars container` (no extra classes); home-09.html's
      own is `margin-top-auto wow fadeInUp` with `data-wow-delay="0.1s"` (a real scroll-reveal animation)
      — both confirmed via source diff, found incidentally while auditing this component. Fixed via new
      `searchCarsClassName`/`searchCarsWowDelay` props; home-03/index.html/home-02.html (all genuinely
      `margin-top-auto margin-bottom-auto`) keep the default.
    - **Missing mobile spacer (same component, home-07 only, minor)**: home-07.html's own hero has one
      extra `<div class="tf-spacing-style2 lg-hidden">` (90px, large-screen-hidden) right after the
      `.page-title` section, inside the same `<form>` — confirmed absent from every other caller. Added
      via a new `showMobileSpacer` prop.
    - **"Popular searches" fake-tabs bug (`home-07/PopularSearchesGridSection.tsx`)**: this component's
      own earlier claim ("only one `.content-inner` exists, tabs are purely decorative") was wrong — a
      re-grep of the real source found 7 distinct `.content-inner` blocks (Electric=3/Sedan=8[default
      active]/SUV=4/Pickup Truck=2/Luxury=4/Hatchback=4/Crossover=4 cards = 29 total, matching the old
      total card count, which is exactly why the bug looked plausible at a glance). The previous
      component concatenated all 29 cards into ONE always-visible grid with non-functional tab pills —
      a much taller, denser grid than the real page, and almost certainly the 2nd major driver of the
      reported layout break. Fixed to real per-tab tab-switching (`useState`), matching the
      `home-10/PopularSearchesTabGridSection.tsx` pattern established earlier this session.
    **Validation**: `npx tsc --noEmit` + `npm run lint` clean. Playwright-verified `/home-07` in full:
    hero now stacks correctly (no `flex`/no margin-auto classes present, screenshot confirms normal
    block layout), "Popular searches" real tab-switch confirmed (Sedan=8 cards by default, Electric=3,
    Pickup Truck=2, card counts and highlighting genuinely change per click), and a full scroll-through
    of every remaining section (Wide Vehicle Selection, Browse by Type parallax, Latest For Sale, Why
    Choose Us + stats, Clients Reviews + CTA banner, Footer) found no further layout defects. Regression-
    checked `/`, `/home-02`, `/home-03` (all still `flex`/`margin-top-auto margin-bottom-auto`, unchanged)
    and `/home-09` (now correctly `margin-top-auto wow fadeInUp`, no `margin-bottom-auto`) — all visually
    correct, zero console errors on any of the 5 pages tested.
    - **RETROACTIVE FIX (found on a follow-up "check the tab color" request)**: the "All Car"/"New Car"/
      "Used Car" tab labels in `home/HeroSearchSection.tsx` always hardcoded `text-white` on the label
      `<span>`s, but home-07.html's own real source uses `text-primary` (dark) there (confirmed via
      source diff — every other caller genuinely is `text-white`) — because this page's hero sits on a
      pale `background-blue` (`#D8E2EA`), not a photo/dark background, so white text would render almost
      invisibly. Fixed via a new `tabTextColorClass` prop (default `"text-white"`; home-07 passes
      `"text-primary"`). Verified via SSR HTML fetch: `/home-07` now renders `text-primary` on all 3
      labels, `/` still renders the default `text-white`.
    - Also removed a stray `<div className="pb-100 relative">` that had been wrapped around this page's
      `<HeroSearchSection>` call outside this workflow — it matched no real source structure (`.page-title`
      is a direct child of `#wrapper` in home-07.html) and had inconsistent indentation; confirmed with the
      user before removing it.

94. **RETROACTIVE FIX — `home-02/BrowseByTypeCardsSection`'s per-card type name color on home-08.html**,
    found on request ("check Browse By Type card-box-style-3 color on home-08"): the card title
    (`<p>Electric</p>` etc.) always hardcoded no color class — correct for home-02.html's own real
    `card-box-style-3 bg-white` cards (dark text on a white card, confirmed via source diff) — but
    home-08.html's own real title is `h4 mb-4 text-white link` (confirmed via source diff). home-08's own
    `card-box-blur` variant (`box.scss`) is `background-color: rgba(255,255,255,0.1)` — a near-transparent
    card sitting directly on this section's own dark `bg-primary` background, with no text-color override
    of its own — so the default dark text would render at very low contrast, effectively unreadable.
    Fixed via a new `cardTitleColorClass` prop (default `""`; home-08 passes `"text-white"`).
    **Validation**: `npx tsc --noEmit` + `npm run lint` clean; confirmed via SSR HTML fetch that
    `/home-08` now renders `text-white` on all 10 card titles and `/home-02` is unaffected (still no
    color class).

95. **RETROACTIVE FIX (×2) — home-09.html "body class"/"page title" re-audit, found on request**:
    - **`home-style-9`/`home-style-10` body classes are real, functional, not decorative**: previously
      documented as merely "a real, distinct page-wide `radius-40` visual signature" — actually
      `section.scss` gives `.home-style-9` its own `padding: 40px` (scaled down at narrower breakpoints)
      and `header.scss` gives it `.home-style-9 .header.is-custom { background-color: $color-primary }`
      (relevant to the sticky-header feature added earlier this session). This was NEVER applied at all,
      since Next.js's App Router renders one shared `<body>` for every route in `layout.tsx` — no
      page-specific class was ever set. Verified by serving the raw, unmodified `../aurexo/home-09.html`
      locally with Playwright: header, hero, and `#wrapper` are ALL inset together by the same amount
      (the absolute header positions relative to `#wrapper`, which already has real `position: relative`
      in the ported `reset.scss`, so it inherits the inset automatically) — a visible "framed" page look
      completely absent without this class. Fixed via a new `src/components/common/BodyClass.tsx`
      component (imperative `document.body.classList` add/remove per-page, mounted/unmounted via
      `useEffect` — the only way to vary `<body>` per route in the App Router, matching
      `ThemeSwitcher.tsx`'s own precedent for this kind of DOM-level side effect). home-10.html's own
      analogous `home-style-10 background-light` (`padding: 0 180px`) was found to have the exact same
      gap while investigating this and fixed the same way in that page's own `page.tsx`.
    - **Hero WOW-animation delays (`home/HeroSearchSection.tsx`)**: the title/tab-bar/filters-row always
      hardcoded their own `wow fadeInUp` + staggered `data-wow-delay` (index.html's own `0.1s`/`0.3s`/
      `0.5s` sequence). home-09.html's own real hero has NO `wow` animation on any of these 3 inner
      elements at all (confirmed via source diff — only the outer `.search-cars` wrapper itself animates
      as one block). Fixed via new `titleWowDelay`/`tabsWowDelay`/`filtersWowDelay` props (`null` disables
      the animation on that element entirely). **Found incidentally while fixing this**: home-02.html's/
      home-03.html's own real sequence is `0.1s`/`0.5s`/`0.7s`, not index.html's `0.1s`/`0.3s`/`0.5s` — a
      natural consequence of their own subtitle `<p>` occupying the `0.3s` slot and shifting everything
      after it by 0.2s, which the previous hardcoded values never accounted for. Fixed by passing the real
      values from both pages' own `page.tsx`.
    **Validation**: `npx tsc --noEmit` + `npm run lint` clean. Playwright-verified `/home-09` (body class
    + ~20px computed padding applied, header/hero/`#wrapper` all inset consistently at 1440px viewport,
    title/tabs/filters confirmed to have no `wow`/`data-wow-delay` at all, full page renders with nothing
    clipped by the new padding) and `/home-10` (body class applied, computed padding present, no
    horizontal overflow, nothing clipped). Regression-checked `/` and `/home-04` (body class does NOT
    leak onto them), `/home-02`/`/home-03` (now correctly `0.5s`/`0.7s` on tabs/filters, hero renders
    fully), and confirmed `BodyClass`'s cleanup-on-unmount actually works by navigating from `/home-09`
    to `/` and observing `home-style-9` removed from `document.body.className` — zero console errors
    across all 7 pages/navigations tested.

96. **RETROACTIVE FIX (×2) — home-09.html "Clients Reviews" (testimonials), found on request ("check
    testimonials of home-09")**:
    - **Wrong breakpoints**: the section's own comment already claimed its `.swiper-testimonior-2`
      config "never reaches 3 [columns] like the base config", but the actual `page.tsx` call never
      passed a `breakpoints` override at all — silently falling back to `ClientsReviewsCarousel`'s own
      default (`0/767/991` → 1/2/3 columns), which DOES reach 3 at ≥991px. Real config
      (`assets/js/swiper.js`): `0`/`400`/`767` → 1/1/2, no 991 breakpoint at all. Fixed by passing the
      real `breakpoints` explicitly.
    - **Wrong dataset**: this page was reusing `emilyBenjaminOliviaTestimonials` (home-05/06/07.html's
      own shared 3-testimonial-repeated-to-6-slides dataset) unmodified — but home-09.html's own real
      source has only 5 slides (not 6, confirmed via slide count), and its own 3rd slide (Olivia
      Williams) has a real, disclosed content bug: it pairs Olivia's name/avatar with EMILY's own quote
      text, not Olivia's own distinct "I've bought several cars..." quote every other page uses
      (confirmed via source diff). Fixed via a new `home09ClientTestimonials` export in
      `data/clientTestimonials.ts` that reproduces this page's own real 5-slide sequence and content bug
      verbatim, per html-fidelity, rather than silently correcting it.
    **Validation**: `npx tsc --noEmit` + `npm run lint` clean. Playwright-verified `/home-09`: exactly 5
    slides render in the correct order (Emily/Benjamin/Olivia/Emily/Benjamin) with slide 3 confirmed
    showing Emily's text under Olivia's name/avatar (bug preserved, not fixed away); Swiper's own
    `breakpoints` param confirmed as `{0:{1}, 767:{2}}` with no 991 entry; measured exactly 2 visible
    cards side-by-side at both 1440px and 800px viewports (never 3). Regression-checked `/home-06`'s own
    `.swiper-testimonior` (no `-2` suffix, a different shared config): still renders all 6 slides with
    each Olivia occurrence showing her own correct distinct quote — confirming the home-09 fix didn't
    touch the shared 6-slide dataset used elsewhere. Zero console errors on either page.

97. **RETROACTIVE FIX — home-10.html's own `#wrapper.bg-white` class, found on request ("check class
    wrapper home-10")**: `<div id="wrapper" class="bg-white">` is real — home-10.html is the ONLY one of
    the 10 home variants with any class at all on `#wrapper` (every other page's is classless, confirmed
    via source diff) — but `layout.tsx` renders one shared, classless `#wrapper` div for every route, so
    this was never applied. Matters beyond plain background color: `themes.scss`'s
    `.is_dark #wrapper.bg-white { background-color: transparent }` only fires when this class is
    actually present, letting `body.is_dark`'s own dark background show through instead of an opaque
    white block — without it, toggling `ThemeSwitcher`'s dark mode on `/home-10` never got this
    override. Fixed via a new `src/components/common/WrapperClass.tsx` component (same mount-effect/
    cleanup shape as `BodyClass.tsx`, targeting `#wrapper` instead of `<body>`), mounted alongside the
    existing `BodyClass` in home-10's own `page.tsx`.
    **Validation**: `npx tsc --noEmit` + `npm run lint` clean. Playwright-verified `/home-10`:
    `#wrapper.className` includes `bg-white`; toggling dark mode via `ThemeSwitcher` sets `is_dark` on
    `<html>`/`<body>` and `#wrapper`'s own computed `background-color` correctly becomes transparent
    (`rgba(0,0,0,0)`), confirmed via a dark-mode screenshot showing a proper dark theme throughout with
    no incongruous white block; light mode also renders correctly. Regression-checked `/home-09` (no
    `bg-white` leak onto its own classless `#wrapper`) and confirmed cleanup-on-unmount by navigating
    from `/home-10` to `/` and observing `bg-white` removed from `#wrapper.className` afterward — zero
    console errors.

98. **RETROACTIVE FIX (×4) — `header/Header.tsx` header layout on home-10.html, found on request ("check
    header layout home-10 với bản html")**:
    - **`header-style-1` was silently overriding home-10's own container padding — the most significant
      fix**: `Header.tsx` always appended `header-${variant}` (`header-style-1` by default)
      unconditionally, but home-10.html's own real `<header>` has NO style-N class at all (confirmed via
      source diff against index/home-04/09.html, which all genuinely carry it). Not cosmetic:
      `header.scss`'s `.header-style-1 .header-container-fluid { padding: 0 40px }` is a 2-class
      compound selector — higher specificity than the single-class `.px-15` utility this page's own
      `containerClassName` relies on — so the stray class silently forced the wrong `0 40px` padding
      regardless of `px-15`, misaligning the header against the rest of the page's own `max-w-1440`
      sections. Fixed via a new `omitVariantClass` prop (home-10 passes `true`).
    - **Missing `navWrapperClassName`**: home-10.html's own real `<nav>` is `main-nav margin-right-auto`
      (confirmed via source diff) — home-10's own `page.tsx` never passed this prop at all, silently
      falling back to `Nav.tsx`'s own `mr-18` default (correct only for index.html). Fixed by passing it
      explicitly.
    - **Wrong header-button gap**: the Sign In/Add Listing button row always hardcoded `gap-20` —
      home-10.html's own real gap is `gap-10` (confirmed via source diff, the only page with this
      value). Fixed via a new `headerButtonGapClassName` prop.
    - **Missing `relative` on the search-toggle `<span>`**: always hardcoded plain `header-action-btn` —
      correct only for index.html's own real source; home-04/09/10.html's own real class is `relative
      header-action-btn` (confirmed via source diff on all 3, not just home-10). Fixed via a new
      `searchToggleClassName` prop, now passed explicitly by all 3 pages' own `page.tsx` (index.html
      keeps the plain default).
    **Validation**: `npx tsc --noEmit` + `npm run lint` clean. Playwright-verified `/home-10`:
    `header.className` no longer includes `header-style-1`, `.header-container-fluid` computed padding
    is now `15px` (was `40px`), header now visually lines up with the page's own `max-w-1440` body
    sections at the same edges, nav/buttons render with no overlap, Sign In still opens the login modal.
    Regression-checked `/`, `/home-04`, `/home-09`: all 3 still correctly retain `header-style-1` and
    their own `40px` container padding, unaffected, Sign In still works. Zero console errors across all
    4 pages tested.

99. **RETROACTIVE FIX (×5 modals) — `common/Modal.tsx` size-modifier placement, found on request ("check
    style of modal-login")**: source's real size modifier (`modal-sm`/`modal-lg`) lives on
    `.modal-content` itself — `modal.scss`'s sizing rule is the compound selector
    `.modal-content.modal-sm { max-width: 480px }` (base `.modal-content` is `max-width: 1450px`;
    `.modal-content.modal-lg { max-width: 920px }`) — so the class must sit on that exact element to
    match at all. Fixed by adding a new `contentClassName` prop to `Modal.tsx`, applied to `.modal-content`
    directly, and updating every affected modal:
    - **`LoginModal.tsx`/`ForgotPasswordModal.tsx`/`SignUpModal.tsx`**: all 3 previously rendered a
      same-named but structurally different nested `<div className="modal-sm">` one level further in
      (inside `.modal-inner`), which the compound selector never matches — all 3 were silently stuck at
      the full 1450px width instead of the intended compact 480px card. Fixed via
      `contentClassName="modal-sm"`.
    - **`NewsletterModal.tsx`**: omitted its own real `modal-lg` entirely (confirmed via source diff,
      `about-us.html`'s own `#NewsletterModal` markup) — same 1450px-stuck bug. Fixed via
      `contentClassName="modal-lg"`.
    - **`QuickViewModal.tsx`, a 2nd distinct bug found while auditing this**: was missing `modal-right`
      entirely on the outer `.modal` div, with `modal-lg` misplaced there instead of on `.modal-content`
      (confirmed via source diff, `shop.html`'s own `#QuickViewModal` markup: `class="modal modal-right
      quick-view"` / `class="modal-content modal-lg"`). `modal-right` isn't cosmetic:
      `.modal-right .modal-content` makes this a full-height, right-edge sliding drawer
      (`justify-content: flex-end`, `transform: translateX(100%)` → `translateX(0)` on open) — a
      completely different interaction from the centered/scaled popup it was rendering as. Fixed by
      moving `modal-right` to `className` and `modal-lg` to the new `contentClassName` prop.
    **Validation**: `npx tsc --noEmit` + `npm run lint` clean; confirmed via SSR HTML fetch that
    `.modal-content` now renders `modal-sm`/`modal-lg` correctly for all 5 modals and `#QuickViewModal`'s
    outer class is now `modal modal-right quick-view`. Playwright-verified: Login/Forgot Password/Sign Up
    all measured `.modal-content` computed `max-width`/`width` at `480px` (was effectively 1450px);
    Newsletter measured `920px`; Quick View now visibly slides in from the right edge as a full-height
    drawer (confirmed `justify-content: flex-end` + `transform` fully slid to `translateX(0)`) — its own
    measured width is `856px`, confirmed as a MORE specific pre-existing selector
    (`.modal-right.quick-view .modal-content { max-width: 856px }`) intentionally overriding the generic
    480px rule, not a leftover bug. All 5 remain fully usable (forms submit-clickable, gallery/cart
    controls present, close buttons work), zero console errors across every modal tested.

100. **CRITICAL RETROACTIVE FIX (×6) — mobile nav drawer completely non-functional site-wide, found on
     request ("check menu-mobile cho header nav dựa vào html")**. Playwright confirmed the drawer was
     totally broken on EVERY page before this fix: invisible overlay, drawer permanently parked
     off-screen, clicking a nav link did nothing. Affects all 4 header components that share this
     pattern: `header/Header.tsx`, `header/HeaderStyle2.tsx`, `header/HeaderStyle4.tsx`,
     `dashboard/DashboardHeader.tsx`.
     - **Root cause**: the real site CSS (`menu.scss`) drives this drawer via a `body.main-nav-mobile`
       class (controls the `.mobile-menu-overlay` backdrop's visibility) and an `#main-nav-mobile.active`
       ID selector (the actual sliding panel, `position:fixed` + `translateX(-100%)` → `translateX(0)`).
       The port instead toggled a `.active` class on the overlay itself (no matching CSS rule at all) and
       used a `panelClassName="mobile-menu"` that doesn't exist anywhere in the compiled stylesheet — so
       neither element could ever become visible, confirmed via direct computed-style inspection.
     - **Fix**: `common/Offcanvas.tsx` gained a new `panelId` prop (callers now pass the real
       `"main-nav-mobile"`); the overlay no longer needs its own `.active` toggle. Each header now mounts
       `common/BodyClass` reactively (`className={isMobileMenuOpen ? "main-nav-mobile" : ""}`) to drive
       the backdrop. `header/MobileMenu.tsx`'s own `<ul>` had the id directly on itself (wrong element) —
       removed, now just `.menu`.
     - **2nd bug, same investigation**: the hamburger toggle's `onClick` always called
       `setIsMobileMenuOpen(true)` — never actually toggled, so clicking it again while open (source's own
       real `.toggleClass("active")` behavior) did nothing. Fixed to a real toggle across all 4 headers.
     - **3rd bug**: the drawer's own content was missing the Sign In/Add Listing buttons —
       `app.js`'s `mobileNav()` real behavior moves `.header-button-mobile` into `#main-nav-mobile`
       (confirmed via source read), and `menu.scss`'s own `#main-nav-mobile .header-button`/`.btn` rules
       only make sense with that content present. Rendered a 2nd time inside the drawer in all 4 header
       components (not literally moved, matching this project's "convert legacy JS idiomatically" rule).
     - **4th bug** (found by the 1st verification pass): `MobileMenu.tsx`'s 4 top-level toggles
       ("Home"/"Listing"/"News"/"Pages") were `<p className="menu-item-inner-title">`, but source's own
       real top-level items are `<a href="#">` (confirmed via source diff) — `menu.scss`'s
       `#main-nav-mobile > ul > li > a { color: $white }` only matches `<a>` tags, so these 4 rendered
       invisible near-black text on the drawer's dark background. Fixed by switching to real
       `<a href="#">` tags with `preventDefault()`.
     - **5th bug** (found by the 2nd verification pass): each dropdown's sub-link `<ul>` was
       `className="sub-menu-item-inner"`, whose only white-text rule requires a `.menu-item-inner`
       ancestor `<li>` this markup never has — every sub-link (Homepage 01-10, Listing/News/Pages links)
       rendered `#1C1C1C` text on the drawer's own identical `#1C1C1C` background: literally invisible,
       not just low-contrast. Fixed by using the real `sub-menu` class instead (confirmed via source
       diff — every real dropdown panel carries this class regardless of column count), whose own
       unconditional `#main-nav-mobile .sub-menu li a { color: $white }` rule needs no such ancestor.
     - **6th bug** (found by the 3rd verification pass): fixing the 5th bug revealed `menu.scss` gives
       `#main-nav-mobile .sub-menu` an unconditional `display: none` with NO CSS override for an open
       state anywhere (source's own jQuery drives this via `.slideToggle()`, setting an inline style
       directly — there's no stylesheet `.active`/`.open` variant for this specific selector). Fixed with
       an explicit inline `style={{ display: "block" }}` on each `.sub-menu` (safe since the surrounding
       `{cond && (...)}` already handles mount/unmount). Also fixed an incidental React duplicate-key
       warning surfaced during this same verification: `listingMenuColumns`/`pagesMenuColumns` legitimately
       repeat the same `href` across 2 different mega-menu columns (fine for the desktop `Nav.tsx`, which
       renders each column separately) but collide once flattened into one mobile list — fixed by keying
       on `${link.href}-${index}` instead of the bare href.
     **Validation**: `npx tsc --noEmit` + `npm run lint` clean throughout. Playwright-verified across 3
     full rounds (each catching a new layer of the bug) on `/`, `/home-02`, `/home-05`, `/dashboard`: the
     drawer now opens fully on-screen with a real dimmed backdrop, all 6 top-level items + Sign In/Add
     Listing buttons render in white/readable text, all 4 dropdowns (Home=10 links, Listing=19,
     News=7, Pages=19) expand with visible white sub-links (confirmed via computed `display`/`color`, not
     just DOM presence), one-at-a-time accordion behavior and re-collapse work, a real sub-link click
     navigates to its real route, the toggle button genuinely closes the drawer on a 2nd click including
     after a client-side navigation to a different page, and the body class doesn't leak between pages.
     Zero console errors/warnings related to this component in the final round (only pre-existing,
     unrelated SCSS autoprefixer/Next Image aspect-ratio warnings). **Known follow-up, out of this fix's
     scope**: the final verification incidentally noticed `/home-02`'s own desktop-style nav bar
     overlapping its hero at 390px width — a `HeaderStyle2`-specific responsive-layout issue, unrelated to
     this drawer component, not investigated further here.

101. **RETROACTIVE FIX — mobile drawer's 4 top-level sections were wrongly mutually exclusive, found on
     request ("check logic mobileNav trong app.js")**: a full line-by-line re-read of `app.js`'s
     `mobileNav()` found one more real behavioral gap beyond entry #100's 6 fixes. `MobileMenu.tsx`
     tracked open state as a single `openSection: string | null`, so expanding "Listing" silently
     collapsed an already-open "Home". Source's own real handler
     (`$(document).on("click", "#main-nav-mobile .menu-item", function () { $(this).toggleClass("active");
     $(this).find(".sub-menu").first().slideToggle(); })`) only ever toggles the clicked item — nothing
     collapses the others, so multiple dropdowns can genuinely be expanded simultaneously on the real
     site. Fixed by switching to a `Set<string>` of open section names, toggled independently per item.
     (Confirmed the mobile-breakpoint check itself, `window.matchMedia("(max-width: 1199px)")`, already
     matches `reponsive.scss`'s own `.mobile-button` display breakpoint — no separate bug there.)
     **Validation**: `npx tsc --noEmit` + `npm run lint` clean. Playwright-verified: opening "Home" then
     "Listing" without closing either leaves both expanded simultaneously; closing "Home" alone leaves
     "Listing" still open; opening a 3rd section ("News") while "Listing" stays open works the same way;
     each section still toggles closed independently on a 2nd click. Zero console errors.

102. **RETROACTIVE FIX (×2) — desktop `#main-nav` never hidden below 1199px + drawer missing the logo,
     found on request ("main-nav chưa ẩn nhỏ hơn màn 1200... main-nav-mobile chưa đúng layout")**:
     - **Desktop nav not hidden on narrow viewports**: the real source has NO standalone CSS rule hiding
       `#main-nav` below 1199px at all — `app.js`'s `mobileNav()` instead physically REMOVES it from
       `.header-right` by renaming its id to `main-nav-mobile` and re-parenting it into `#header_main`
       (`.appendTo("#header_main")`), so the original location is simply empty afterward, not hidden via
       CSS. This port keeps the desktop `<Nav>` (`Nav.tsx`, real id `#main-nav`) mounted in place rather
       than literally moving DOM nodes — so without an explicit rule, the horizontal desktop nav AND the
       separate mobile drawer trigger were both visible at once below that width. Fixed by adding
       `#main-nav { display: none }` to `reponsive.scss`'s existing `@media (max-width: 1199px)` block —
       reproduces the same real end-state without literal reparenting.
     - **Drawer missing the logo**: `app.js`'s `mobileNav()` also appends `.logo-mobile` into
       `#main-nav-mobile` (in normal flow, since `.menu` is `position: absolute` there and no longer
       occupies flow space) — it's what actually fills `menu.scss`'s own `top: 150px` reserved gap above
       the nav list, alongside the Sign In/Add Listing row. Fixed by rendering `.logo-mobile` a 2nd time
       inside the drawer (not literally moved) in all 4 header components — `Header.tsx`,
       `HeaderStyle2.tsx`, `HeaderStyle4.tsx`, `dashboard/DashboardHeader.tsx`.
     **Validation**: `npx tsc --noEmit` + `npm run lint` clean. Playwright-verified all 4 header
     components (`/`, `/home-02`, `/home-05`, `/dashboard`): `#main-nav` computed `display:none` at
     390×844 (no more cluttered horizontal nav row alongside the hamburger) and correctly back to
     `display:block` at 1440×900 (desktop regression-checked, unaffected); the drawer's logo now renders
     visibly at its top in normal flow above the Sign In/Add Listing buttons, with the absolutely-
     positioned nav-link list filling the rest below — clean, non-overlapping stacking on all 4 pages.
     Zero console errors.
