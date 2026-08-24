# Aurexo — Source Architecture (Content / Visual / Behavior Truth)

> Source: `../aurexo` (READ-ONLY). This document records ACTUAL findings from direct inspection of the
> static HTML/SCSS/JS source. Aurexo controls WHAT the site looks like and how it behaves — never
> reinterpret or redesign what's recorded here. Re-run `/analyze-html <file>` before migrating any page
> not yet covered by `MIGRATION_STATUS.md`.

## 1. Page Inventory (63 HTML files, no templating/include mechanism)

Header/footer markup is copy-pasted verbatim into every single file (confirmed: exactly one `<header>` per
file, full markup duplicated, no server-side or JS include).

### Page families

- **Home variants (12)** — `index.html`, `home-02..home-11.html`. ONE design system; header/hero style
  differs per variant via CSS **modifier classes**, not structurally different markup.
- **Listing/browse (10)** — `listing-grid2-columns`, `listing-grid3-columns`, `listing-grid4-columns`,
  `listing-gridstyle-halfmap`, `listing-liststyle-halfmap`, `listing-liststyle-sidebar`,
  `listing-sidebar-left`, `listing-sidebar-right`, `listing-top-filter`, `listing-topmap`. Same card data,
  different grid/layout/filter chrome.
- **Listing details (6)** — `listing-details-1.html` … `listing-details-6.html`. Gallery/layout variants.
- **Blog** — grid variants `blog-grid-style-1|2|3.html`, plus `blog-list.html`, `blog-standard.html`;
  details `blog-details-1.html`, `blog-details-2.html`.
- **Add/Post listing (2)** — `add-listings.html`, `add-listings-2.html` — 2 layout variants of the same
  multi-step dealer submission form.
- **Dealers/Agents (4)** — `dealers-listing.html`, `dealer-details.html`, `sale-agents.html`,
  `sale-agents-details.html`.
- **Shop / e-commerce (5)** — `shop.html`, `product-details.html`, `shopping-cart.html`, `check-out.html`,
  `compare.html` — a separate mini-system from car listings.
- **User dashboard/account (7)** — `dashboard.html`, `my-listings.html`, `my-favorites.html`,
  `my-profile.html`, `message.html`, `reviews.html`, `change-password.html` — all share
  `.dashboard-container` + persistent sidebar.
- **Utility** — `calculator.html`, `financing.html`, `sell-your-car.html`.
- **Marketing/info** — `about-us.html`, `contact-us.html`, `faqs.html`, `terms.html`,
  `services-center.html`, `clients-reviews.html`.
- **System** — `404.html`, `coming-soon.html`.

Full flat list (63): `404.html, about-us.html, add-listings-2.html, add-listings.html, blog-details-1.html,
blog-details-2.html, blog-grid-style-1.html, blog-grid-style-2.html, blog-grid-style-3.html, blog-list.html,
blog-standard.html, calculator.html, change-password.html, check-out.html, clients-reviews.html,
coming-soon.html, compare.html, contact-us.html, dashboard.html, dealer-details.html, dealers-listing.html,
faqs.html, financing.html, home-02.html, home-03.html, home-04.html, home-05.html, home-06.html,
home-07.html, home-08.html, home-09.html, home-10.html, home-11.html, index.html, listing-details-1.html,
listing-details-2.html, listing-details-3.html, listing-details-4.html, listing-details-5.html,
listing-details-6.html, listing-grid2-columns.html, listing-grid3-columns.html, listing-grid4-columns.html,
listing-gridstyle-halfmap.html, listing-liststyle-halfmap.html, listing-liststyle-sidebar.html,
listing-sidebar-left.html, listing-sidebar-right.html, listing-top-filter.html, listing-topmap.html,
message.html, my-favorites.html, my-listings.html, my-profile.html, product-details.html, reviews.html,
sale-agents-details.html, sale-agents.html, sell-your-car.html, services-center.html, shop.html,
shopping-cart.html, terms.html`

Other root files: `README.md`, `vercel.json` (rewrites `/` → `/index.html`), `fake_data/product.json`
(static shop product data — precedent for a typed `src/data/shop-products.ts`).

## 2. Asset Structure

```
assets/
  app.css                   compiled output of scss/app.scss (Dart Sass CLI, no bundler)
  css/jquery.fancybox.min.css
  icons/                    136 files: 132 .svg, 3 .png, 1 stray .txt (likely bad export — flag before use)
  images/                   shared pool by CONTENT CATEGORY, not per-page:
                            avatar(20) background(1) banner(4) blog(50) brand(24) car(15) card(84)
                            dashboard(19) home(13) inner-page(26) page-title(12) pages(23) shop(19)
                            + loose: favicon.png, logo.png, logo-white.png
  js/                       18 files (see §5)
  scss/                     entry app.scss (see §3)
```
No `fonts/` folder — Google Fonts loaded via CDN `@import` (Manrope + Albert Sans), not self-hosted.

## 3. SCSS Architecture

Entry: `assets/scss/app.scss`, compiled via plain Dart Sass CLI (`sass assets/scss/app.scss:assets/app.css`)
— no bundler, no import chain in the JS sense, every HTML file manually `<link>`s the compiled `app.css`.

```scss
@use './abstracts/index' as *;
@use './reset' as *;
@use './component/index' as *;
@use './inner-page' as *;
@use './reponsive' as *;   // note: filename typo "reponsive", imported LAST so it wins cascade
```
followed by ~900 lines of Tailwind-like global utility classes directly in `app.scss`.

`component/index.scss` loads 25 partials in order: `themes, button, menu, header, swiper, page-title, tabs,
box, grid, blog, footer, widget, spacing, section, modal, progress, breadcrumb, dropdown, filter-sidebar,
animate.min (vendored WOW.js keyframes), pagination, flat-accordion, shop, select`.

**Variables** (`abstracts/variables.scss`) — naming is misleading, preserve hex values exactly, only rename
the SCSS variable identifiers if/when tokens are introduced:
```scss
$text-primary:#1C1C1C; $white:#fff; $black:#000000;
$color-main:#98BC2A;            // ← actual brand ACCENT GREEN
$color-primary:#1C1C1C;         // ← actually near-BLACK, not the accent
$border-light:#E7E7E7; $background-light:#F7F7F7; $background-blue:#D8E2EA; $background-be:#F3F7EE;
$color-hover:#98BC2A; $color-hover-opacity:#50611D;    // also the green accent family
$color-secondary:#4B4B4B; $color-muted:#9FA1A4; $color-primary-2:#98BC2A; $color-green:#4518CC;
$font-main-1:"Manrope", sans-serif; $font-main-2:"Albert Sans", sans-serif;
```

**Grid** (`component/grid.scss`) — a SECOND, independent, Bootstrap-style min-width breakpoint map used only
for `.row`/`.col-*` utilities:
```scss
$grid-breakpoints:(xs:0, sm:576px, md:768px, lg:992px, xl:1199px, xxl:1400px);
$container-max-widths:1440px; $grid-columns:12; $grid-gutter-width:30px;
```
`reset.scss` ALSO separately hardcodes `.container{max-width:1440px}` / `.container-fluid{max-width:1920px}`
— a duplicate/competing `.container` definition vs. `grid.scss`. Flagged in ambiguities (`COMPONENT_MAP.md`).

## 4. Typography Classes (h1–h7, decoupled from semantic tags)

`reset.scss` lines 111–169 pair visual classes with tags: `h1,.h1{68px/76px}`, `.text-56{56px}`,
`h2,.h2{40px/48px}`, `h3,.h3{32px}`, `h4,.h4{24px}`, `h5,.h5{20px/1.4}`, `h6,.h6{20px/1.6}`,
`h7,.h7{18px}` (`.h7` is a non-standard visual class, `<h7>` is never used as a real element — only the
class appears).

**Confirmed decoupling in real markup**: `index.html` applies `class="h5"` to a `<p>` tag purely for visual
sizing, unrelated to document outline. → In aurexo-nextjs this becomes a typography component/utility with
a `size` prop independent of the rendered tag (e.g. `<Heading as="p" size="h5">`), per `html-fidelity.md`'s
heading-semantics rule. Semantic heading level must still follow correct document outline — do not let
`.h1`/`.h2`/etc. classes dictate the tag.

Responsive overrides exist only in `reponsive.scss` under `max-width:991px` (h1→40px, h2/.h2→28px,
h3/.h3→24px); h4–h7 have no global override, only local per-component overrides at various breakpoints.

## 5. JavaScript Inventory

`assets/js/` (18 files) — jQuery-based, no bundler.

| File | Type | Purpose |
|---|---|---|
| `jquery.min.js`, `jquery.cookie.min.js` | vendor | jQuery core + cookie plugin |
| `jquery.fancybox.js` | vendor | Fancybox lightbox |
| `swiper-bundle.min.js` | vendor | Swiper core |
| `wow.min.js` | vendor | WOW.js scroll-reveal (pairs with `animate.min.scss` keyframes) |
| `simpleParallaxVanilla.umd.js` | vendor | simpleParallax.js |
| `infobox.min.js`, `marker.js` | vendor | Google Maps InfoBox + MarkerClusterer — **NOT Mapbox** |
| `countto.js` | vendor | jQuery `$.fn.countTo` number counter |
| `count-down.js` | custom | vanilla `CountDown` class (used on `coming-soon.html` only) |
| `app.js` | **custom, main, 1852 lines** | ~25 distinct behaviors, see below |
| `switcher.js` | custom | template-demo theme/color switcher panel — likely droppable, confirm before removing |
| `swiper.js` | custom | ~30 discrete `new Swiper(...)` instantiations, one per named carousel selector |
| `shop.js`, `filterCar.js` | custom | plain show/hide filtering (NOT masonry/Isotope-style reflow) |
| `maps.js` | custom | `mainMap()` — Google Maps + InfoBox + MarkerClusterer init |
| `gear-slider.js` | custom | jQuery-UI slider init for price/year range filters (no Luminor precedent) |

Load order (from `index.html`): jQuery → jquery.cookie → CDN jquery-ui (for gear-slider) → swiper-bundle →
swiper.js → gear-slider.js → wow.min → simpleParallax → app.js → switcher.js.

### `app.js` behavior inventory (all in one `(function($){"use strict"; ...})(jQuery)`)

- **headerFixed** (L35): sticky header, `window.addEventListener('scroll')`, adds `is-fixed`/`is-custom`/
  `is-visible` to `.header` at 200/300/600px scroll thresholds.
- **mobileNav** (L66): `matchMedia("(max-width:1199px)")`; `.mobile-button` click toggles `.active` +
  injects `.mobile-menu-overlay`; submenu accordions via `.menu-item-inner-title` + `slideToggle`.
- **filterToggle** (L216): `#filterToggle` → `slideToggle(300)` on `#advancedFilters`.
- **filterSidebarToggle** (L244): offcanvas filter sidebar, opens/closes via `#filterSidebarToggle` /
  `#filterSidebarClose` / overlay click / `Escape`; auto-opens on `?filterToggle=true`.
- **Dropdowns** (~L300–500): color-swatch radio dropdown, checkbox multi-select dropdown, generic
  `.core-dropdown__button` pattern — all close on outside-click.
- **tabs** (L502): `.flat-tabs` / `.menu-tab` click sets `.active`, fades in matching `.content-tab`.
- **parallax** (L554): `.parallax` → `new SimpleParallax(this, {delay:0.5, orientation:'up', scale:1.3})`.
- **flatCounter** (L568): `body.counter-scroll` gate, jQuery `countTo()` on `.counter .count-number` using
  `data-to`/`data-speed`/`data-decimals`.
- **gotop** (L604): SVG-circle back-to-top/progress ring, `stroke-dashoffset` driven by scroll %, shows past
  150px, smooth-scrolls to top on click.
- **modalPopup** (L639): generic modal system, `.open-modal[data-modal-id]` → toggles `.active` on `.modal`.
- **Preloader** (L698): `setTimeout(() => $(".preload").fadeOut("slow", remove), 0)`.
- **ratingInput**, **flatAccordion**, **passwordInput**, **collapse**, **carViewsChart** (canvas hover
  tooltip), **searchModalToggle** (`#searchToggle`→`#SearchModal`, closes on `Escape`/overlay/close-btn),
  **hoverActiveGallery**, **scrollElement** (smooth-scroll anchors offset by header height),
  **selectOptions**, **scrollSidebar** (desktop-only sticky recalculation), **newsletterModal**
  (`localStorage`-gated, shows once, 3s after preload), **compareModal**, **heartList** (wishlist toggle).

No GSAP, no Isotope/Masonry, no AOS in Aurexo. Scroll-reveal = WOW.js + `animate.min.scss` keyframes only.

## 6. Shared Site Elements

No include mechanism — header/footer are duplicated verbatim in every HTML file.

- Header: `.header-wrapper > header#header_main` (`#main-nav`, `.mobile-button`). **Confirmed same DOM
  across pages, differing only by modifier classes**: `header bg-white header-style-1` (index) vs
  `header header-style-2 bg-white` (home-02) vs `header header-style-1 header-fixed-primary
  border-bottom border-color-blur` (home-04) vs `header header-absolute header-style-1
  header-fixed-primary ...` (home-09). → `Header` should be ONE component with a `variant` prop
  (see `nextjs-architecture.md`), not numbered components.
- Footer: `.footer-top > .footer-top-inner > .footer-contact > .footer-bottom > .footer-bottom-links` —
  structurally identical across `index.html`/`home-02.html`/`about-us.html`, only copy differs slightly.
- Back-to-top: `.progress-wrap` with SVG circle progress + icon image.
- Preloader: `.preload.preload-container > img.preload--icon`.
- Search modal: `#SearchModal.search-modal` (`.search-modal__overlay`, `.search-modal__content`,
  `#searchModalClose`, `#searchModalInput`).
- Generic modal: `#<Name>Modal.modal` (`.bg-modal`, `.modal-content`, `.close-modal`), triggered by
  `.open-modal[data-modal-id="#<Name>Modal"]`.
- Filter offcanvas: `#filterSidebar.filter-sidebar.filter-sidebar-popup` (`.filter-sidebar__overlay`).

## 7. Homepage (`index.html`) Section Order (exact DOM top-to-bottom)

1. `.preload.preload-container` — preloader overlay
2. `header#header_main.header.bg-white.header-style-1` — logo, mega-menu nav, sign-in (opens `#LoginModal`), "Add Listing" CTA
3. `section.page-title.flex.h-706` — hero: Swiper `sw-single` background slider + `.search-cars` search form (`<h1 class="search-cars__title">`)
4. `section.container.py-100.flat-tabs` — "New Cars"/"Used Cars" tabs, Swiper `.swiper-card-7` carousel, CTA to `listing-grid4-columns.html`
5. `section.py-100.relative` — "Browse By Type": parallax banner + `.swiper-brand` carousel, CTA to `listing-grid4-columns.html`
6. `section.background-light.py-100` — inline "Financing Calculator" form (`.caculator-box`), posts to `calculator.html`
7. `section.py-100.bg-primary` — "Trending Searches Near You": `.swiper-card` carousel of `.card-box-style-2`
8. `section.py-100` — "Clients Reviews": `.swiper-testimonior` carousel, CTA to `clients-reviews.html`
9. `section.background-light.py-100` — "Explore Our Brands": `.swiper-outbrand` carousel, CTA to `listing-grid4-columns.html`
10. `section.bg-primary.py-100` — App-download CTA (App Store/Google Play badges)
11. `section.py-100` — "News & Reviews": `.swiper-news` carousel of `.post.post-effect-style-1`, CTA to `blog-list.html`
12. `footer.bg-primary.footer` — newsletter form, link columns, `.footer-contact`, `.footer-bottom-links`
13. Modals after `</footer>`: `#LoginModal`, `#ForgotPasswordModal`, `#SearchModal`, `#SignUpModal`, `#NewsletterModal`, `#CompareModal`
14. `.progress-wrap` — back-to-top (fixed position)

## 8. Libraries / Plugins

| Library | Evidence |
|---|---|
| Swiper | `assets/js/swiper-bundle.min.js`, `assets/js/swiper.js`, `assets/scss/swiper/swiper-bundle.min.css` |
| WOW.js | `assets/js/wow.min.js`, `assets/scss/component/animate.min.scss` |
| jQuery + jQuery UI (CDN) + jQuery Cookie | `assets/js/jquery*.js`, CDN `jquery-ui.min.js` for `gear-slider.js` |
| Fancybox | `assets/js/jquery.fancybox.js`, `assets/css/jquery.fancybox.min.css` |
| simpleParallax.js | `assets/js/simpleParallaxVanilla.umd.js` |
| Google Maps + InfoBox + MarkerClusterer | `assets/js/maps.js`, `infobox.min.js`, `marker.js` |
| jQuery countTo | `assets/js/countto.js` |

No Isotope, no Magnific Popup, no GSAP, no AOS, no nice-select, no Slick, no Mapbox. Font Awesome is
referenced only as dead CSS (`font-family:"Font Awesome 5 Pro"` in `reset.scss` L614) — no Font Awesome
stylesheet/webfont is actually linked in any HTML `<head>` — confirm and remove as dead code.

## 9. Responsive

Real breakpoints (`assets/scss/reponsive.scss`, 1958 lines, imported LAST so it wins cascade): descending
`max-width` queries at **1700 / 1440 / 1399 / 1199 / 991 / 767 / 575 / 400px**. The 1199px breakpoint is the
desktop→mobile-nav switch (matches `app.js`'s `matchMedia("(max-width:1199px)")`).

This is a **second, independent breakpoint system** from `component/grid.scss`'s Bootstrap-style min-width
map (`sm576/md768/lg992/xl1199/xxl1400`) used only for `.row`/`.col-*`. Not reconciled in the source —
flagged as an ambiguity requiring an explicit decision (see `COMPONENT_MAP.md`).

Example (dashboard sidebar becomes a slide-in offcanvas below 1199px, `reponsive.scss` L227–246):
```scss
.dashboard-container .dashboard-sidebar {
  position: fixed; left: 0; top: 0; z-index: 1001; opacity: 0; visibility: hidden;
  transform: translateX(-150%); transition: transform .3s ease;
  &.active { opacity: 1; visibility: visible; transform: translateX(0); }
}
```

## 10. Images / Icons

Images organized by content category (shared pool, not per-page). Icons: 136 files in `assets/icons/` — 132
`.svg` (both `<img src=".svg">`, majority, and inline `<svg>` where CSS needs to recolor strokes, e.g.
dark-mode path overrides in `themes.scss`), 3 `.png`, and **1 stray `.txt`** (`SlidersHorizontal.txt`) —
confirm it's a bad export before use; do not silently keep or drop it.
