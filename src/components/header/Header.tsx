"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import Nav from "./Nav";
import { useHeaderScrollFixed } from "./useHeaderScrollFixed";
import MobileMenu from "./MobileMenu";
import Offcanvas from "@/components/common/Offcanvas";
import BodyClass from "@/components/common/BodyClass";
import { useModal } from "@/components/common/ModalProvider";
import { useCompare } from "@/components/common/CompareProvider";
import { useWishlist } from "@/components/common/WishlistProvider";
import { SearchIcon, SignInIcon, CompareIcon, WishlistIcon } from "@/components/common/icons";

export type HeaderVariant = "style-1" | "style-2" | "style-3" | "style-4";

export type HeaderProps = {
  /** Corresponds to Aurexo's `header-style-N` modifier class(es) — same DOM, different skin.
   *  See the variant classification rule in .claude/rules/nextjs-architecture.md. */
  variant?: HeaderVariant;
  /** Extra modifier classes seen on some pages, e.g. "header-fixed-primary header-absolute". */
  modifierClassName?: string;
  /** index.html's own header-style-1 is `bg-white`; home-04.html's own header-style-1 usage instead
   *  carries `header-fixed-primary border-bottom border-color-blur` with NO `bg-white` at all
   *  (confirmed via source diff — it sits transparently over the page-title hero). Defaults to
   *  `"bg-white"`; pass `""` to omit it. */
  bgClassName?: string;
  activePath?: string;
  /** Retroactive fix: home-04.html's own transparent/`header-fixed-primary` reuse has a real WHITE
   *  logo (`logo-white.png`, confirmed via source diff), but this component always hardcoded the dark
   *  `logo.png` — invisible against its own dark hero. home-09.html's own reuse (also transparent/
   *  `header-absolute`) needs the same white logo. Defaults to the dark logo so index.html's own usage
   *  is unaffected. */
  logoSrc?: string;
  /** home-09.html's own `.header-container-fluid` is `max-w-1840` (not `max-w-1920` like index.html's/
   *  home-04.html's own usage, confirmed via source diff) — a real, distinct per-page container width. */
  containerClassName?: string;
  /** Retroactive fix: home-04.html's/home-09.html's own transparent-header reuse has real WHITE Sign
   *  In/Search/Compare/Wishlist icons (confirmed via source diff on every instance) — this component
   *  always called those icon components with no `stroke` override, silently rendering them dark
   *  (`#1C1C1C`) against a dark/transparent hero. Defaults to the dark default so index.html's own
   *  usage is unaffected. */
  actionIconStroke?: string;
  /** index.html's own Sign In button is `btn-line`; home-04.html's/home-09.html's own is `btn-line-white`
   *  (confirmed via source diff, since it sits on a dark/transparent header). */
  signInButtonClassName?: string;
  /** Retroactive fix: this component always called `Nav` with no props, so it silently used `Nav.tsx`'s
   *  own defaults (`wrapperClassName="mr-18"`, no `listClassName`, `topLevelChevronColor="#9FA1A4"`) on
   *  every page — correct for index.html, but home-04.html's/home-09.html's own real source is
   *  `margin-right-auto`/`menu menu style-2`/white chevrons (confirmed via source diff). */
  navWrapperClassName?: string;
  navListClassName?: string;
  navChevronColor?: string;
  /** Bug found via Playwright verification while building home-09.html: `.header-wrapper` (`header.
   *  scss:9-13`) unconditionally reserves `height: 94px; position: relative`, which defeats
   *  `.header-absolute`'s intended transparent overlay-over-hero effect regardless of the inner
   *  `<header>`'s own `position: absolute` — the wrapper itself still occupies 94px of document flow,
   *  pushing the hero down. home-09.html's own real source has NO `.header-wrapper` div at all for its
   *  `header-absolute` header (confirmed via source diff — the `<header>` is a direct child of
   *  `#wrapper`), unlike index.html's/home-04.html's own `header-wrapper`-wrapped headers. `true` omits
   *  the wrapper div entirely so `header-absolute` truly overlays the hero with zero reserved space. */
  noWrapper?: boolean;
  /** Retroactive fix, found via Playwright verification: home-04.html's own real `.header-wrapper` also
   *  carries a `header-sticky` modifier (confirmed via source diff) — `header.scss`'s
   *  `.header-wrapper.header-sticky { position: fixed; width: 100% }` is what actually lets this
   *  transparent/`header-fixed-primary` header overlay its hero; without it the wrapper falls back to
   *  its own default `position: relative`, an in-flow box whose transparent background shows the page's
   *  plain white body behind it — rendering this header's real white nav/action-icon text invisible
   *  (white-on-white), not merely dark-instead-of-white as first assumed. This modifier is present
   *  unconditionally in source markup (not JS-toggled), so adding it needs no scroll-listener — the
   *  separate scroll-driven show/hide behavior noted above remains deferred. */
  wrapperExtraClassName?: string;
  /** Retroactive fix: home-04.html's own `.header-right` really carries a `header-right-style-2`
   *  modifier (confirmed via source diff) that this component never rendered (index.html's own has no
   *  modifier at all, matching the default). home-10.html's own real modifier is `header-right-style-3`
   *  — a real, distinct 3rd value. */
  headerRightClassName?: string;
  /** RETROACTIVE FIX (found on request, "check header layout home-10"): the outer `<header>` always
   *  appended `header-${variant}` (`header-style-1` by default) unconditionally — correct for index/
   *  home-04/09.html's own real source (all 3 genuinely carry it, confirmed via source diff), but
   *  home-10.html's own real `<header>` has NO `header-style-1` (or any style-N) class at all. This isn't
   *  cosmetic: `header.scss`'s `.header-style-1 .header-container-fluid { padding: 0 40px }` is a
   *  2-class compound selector, higher specificity than the single-class `.px-15` utility this page's
   *  own `containerClassName` relies on — so the stray `header-style-1` was silently overriding home-10's
   *  real `px-15` container padding with the wrong `0 40px` regardless. `true` omits the variant class
   *  entirely. */
  omitVariantClass?: boolean;
  /** RETROACTIVE FIX: the Sign In/Add Listing button row (`.header-button`) always hardcoded `gap-20` —
   *  correct for index/home-04/09.html's own real source, but home-10.html's own real gap is `gap-10`
   *  (confirmed via source diff — the only page with this distinct value). */
  headerButtonGapClassName?: string;
  /** RETROACTIVE FIX: the search-toggle `<span>` always hardcoded plain `header-action-btn` — correct
   *  only for index.html's own real source; home-04/09/10.html's own real class is `relative
   *  header-action-btn` (confirmed via source diff on all 3). Defaults to index.html's own value so it
   *  stays unaffected. */
  searchToggleClassName?: string;
};

// `"use client"` because of local state (mobile menu, search toggle) — matches Luminor's
// Header.tsx (also client for the same reason). Sticky-on-scroll behavior (`is-fixed`/`is-custom`/
// `is-visible`, mirroring `app.js`'s `headerFixed()`) is wired via `useHeaderScrollFixed` — see that
// hook's own comment for the full threshold logic; this resolves COMPONENT_MAP.md's "Sticky header
// behavior" NEEDS_REVIEW row.
//
// RETROACTIVE FIX (×3, found on request, "check menu-mobile" — same bug confirmed on all 4 header
// components, `HeaderStyle2.tsx`/`HeaderStyle4.tsx`/`dashboard/DashboardHeader.tsx` fixed identically):
// - Playwright confirmed the mobile nav drawer was completely non-functional — the overlay stuck
//   permanently invisible and the real drawer element parked off-screen — see `Offcanvas.tsx`'s own
//   comment for the full root-cause writeup (wrong id/class targeting the site's real
//   `#main-nav-mobile`/`body.main-nav-mobile` CSS contract).
// - The toggle button's `onClick` always called `setIsMobileMenuOpen(true)` — never actually toggled,
//   so clicking it again once open (source's own real `.toggleClass("active")` behavior) did nothing.
//   Fixed to a real toggle.
// - The drawer's own content was missing the Sign In/Add Listing buttons — `app.js`'s `mobileNav()`
//   real behavior moves `.header-button-mobile` into `#main-nav-mobile` (confirmed via source read),
//   and `menu.scss`'s own `#main-nav-mobile .header-button`/`.btn` rules only make sense with that
//   content present. Rendered a 2nd time inside the drawer (not literally moved, matching this
//   project's "convert legacy JS idiomatically" rule) rather than left missing.
//
// RETROACTIVE FIX (×2 more, found on a follow-up request re-reading `mobileNav()` line by line): (1)
// the drawer was ALSO missing `.logo-mobile` — the same real `mobileNav()` behavior appends it into
// `#main-nav-mobile` too (in normal flow, since `.menu` is `position: absolute` there and no longer
// occupies flow space — the logo is what actually fills `menu.scss`'s own `top: 150px` reserved gap
// above the nav list). Rendered a 2nd time here for the same reason as the buttons. (2) The desktop
// `<Nav>` (real id `#main-nav`) was never actually hidden below the 1199px breakpoint at all — source
// achieves this purely by MOVING `#main-nav` away (renaming it to `#main-nav-mobile` and re-parenting
// it), which this port doesn't do; added a `#main-nav { display: none }` rule to `reponsive.scss`'s
// existing `@media (max-width: 1199px)` block to reproduce the same end-state (desktop nav absent
// below that width) so the desktop nav and the mobile drawer trigger don't both show at once.
export default function Header({
  variant = "style-1",
  modifierClassName,
  bgClassName = "bg-white",
  activePath,
  logoSrc = "/assets/images/logo.png",
  containerClassName = "max-w-1920 relative",
  actionIconStroke = "#1C1C1C",
  signInButtonClassName = "btn btn-line btn-large font-weight-600 bg-sign-in",
  navWrapperClassName,
  navListClassName,
  navChevronColor,
  noWrapper = false,
  wrapperExtraClassName,
  headerRightClassName,
  omitVariantClass = false,
  headerButtonGapClassName = "gap-20",
  searchToggleClassName = "header-action-btn",
}: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { openModal } = useModal();
  const { compareItems } = useCompare();
  const { wishlistItems } = useWishlist();
  const headerRef = useRef<HTMLElement | null>(null);
  useHeaderScrollFixed(headerRef);

  const headerClassName = [
    "header",
    bgClassName,
    omitVariantClass ? null : `header-${variant}`,
    modifierClassName,
  ]
    .filter(Boolean)
    .join(" ");

  const content = (
    <>
      <header ref={headerRef} className={headerClassName} id="header_main">
        <div className={`header-container-fluid ${containerClassName}`}>
          <div className="header-inner" id="site-header-inner">
            <div className="logo">
              <Link href="/">
                <Image src={logoSrc} alt="logo" width={66} height={54} />
              </Link>
            </div>
            <div className="logo-mobile">
              <Link href="/">
                <Image src="/assets/images/logo-white.png" alt="logo-white.png" width={44} height={36} />
              </Link>
            </div>

            <div className={`header-right gap-20${headerRightClassName ? ` ${headerRightClassName}` : ""} main-nav-wrapper`}>
              <Nav
                activePath={activePath}
                wrapperClassName={navWrapperClassName}
                listClassName={navListClassName}
                topLevelChevronColor={navChevronColor}
              />

              <div className={`header-button mobile-hidden-header-button flex items-center ${headerButtonGapClassName}`}>
                <button
                  className={signInButtonClassName}
                  onClick={() => openModal("LoginModal")}
                >
                  <SignInIcon stroke={actionIconStroke} />
                  Masuk
                </button>
              </div>

              <div className="header-actions ml-20">
                <div className="header-search-wrapper">
                  <span
                    className={searchToggleClassName}
                    id="searchToggle"
                    onClick={() => openModal("SearchModal")}
                  >
                    <SearchIcon stroke={actionIconStroke} />
                  </span>
                  {/* Source markup also has an inline #searchForm dropdown here, but app.js's
                      searchModalToggle() actually wires #searchToggle to open #SearchModal (see
                      docs/migration/AUREXO_SOURCE.md §5) — the inline form is unused dead markup,
                      not reproduced. */}
                </div>

                {/* Source hardcodes `data-badge="2"` here regardless of what's actually compared
                    (see CompareProvider.tsx) — now reads the real count from that shared context.
                    `data-badge` is omitted entirely at 0 (not "0") so the `::after` badge doesn't
                    render at all; see the `:not([data-badge])` rule added in header.scss. */}
                <Link
                  href="/compare"
                  className="header-action-btn header-action-icon"
                  aria-label="Bandingkan"
                  data-badge={compareItems.length > 0 ? compareItems.length : undefined}
                >
                  <CompareIcon stroke={actionIconStroke} />
                </Link>

                {/* Source hardcodes `data-badge="2"` here too, regardless of what's actually favorited
                    (see WishlistProvider.tsx) — now reads the real count from that shared context, per
                    explicit request that My Favorites' data come from a real heart-click feature. */}
                <Link
                  href="/my-favorites"
                  className="header-action-btn header-action-icon"
                  aria-label="Favorit"
                  data-badge={wishlistItems.length > 0 ? wishlistItems.length : undefined}
                >
                  <WishlistIcon stroke={actionIconStroke} />
                </Link>

                <div
                  className={`mobile-button${isMobileMenuOpen ? " active" : ""}`}
                  onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                >
                  <span />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="hidden wrapper-header-button">
          <div className="header-button header-button-mobile flex items-center gap-20">
            <button
              className="btn btn-primary btn-large font-weight-600"
              onClick={() => openModal("LoginModal")}
            >
              <SignInIcon />
              Masuk
            </button>
          </div>
        </div>
      </header>

      <BodyClass className={isMobileMenuOpen ? "main-nav-mobile" : ""} />

      <Offcanvas
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        panelId="main-nav-mobile"
      >
        {/* Real source: app.js's mobileNav() also appends `.logo-mobile` into this drawer (in normal
            flow, since `.menu` is `position: absolute` and no longer occupies flow space) — it's what
            actually fills `menu.scss`'s own `top: 150px` gap reserved above the (absolutely-positioned)
            nav list, alongside the Sign In/Add Listing row below it. Rendered a 2nd time here (not
            literally moved) for the same reason as the buttons below. */}
        <div className="logo-mobile">
          <Link href="/">
            <Image src="/assets/images/logo-white.png" alt="logo-white.png" width={44} height={36} />
          </Link>
        </div>
        <MobileMenu />
        {/* Real source: app.js's mobileNav() moves `.header-button-mobile` (the same Sign In/Add
            Listing pair rendered above in the desktop-hidden `.wrapper-header-button` template) INTO
            this drawer — `menu.scss`'s `#main-nav-mobile .header-button`/`.btn` rules only make sense
            with this content actually present here. Rendered a 2nd time (not literally moved, matching
            this project's "convert legacy JS idiomatically" rule over literal DOM reparenting). */}
        <div className="header-button header-button-mobile flex items-center gap-20">
          <button
            className="btn btn-primary btn-large font-weight-600"
            onClick={() => openModal("LoginModal")}
          >
            <SignInIcon />
            Masuk
          </button>
        </div>
      </Offcanvas>
    </>
  );

  return noWrapper ? (
    content
  ) : (
    <div className={`header-wrapper${wrapperExtraClassName ? ` ${wrapperExtraClassName}` : ""}`}>{content}</div>
  );
}
