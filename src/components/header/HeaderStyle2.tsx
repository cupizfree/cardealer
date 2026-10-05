"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Nav from "./Nav";
import MobileMenu from "./MobileMenu";
import Offcanvas from "@/components/common/Offcanvas";
import BodyClass from "@/components/common/BodyClass";
import { useModal } from "@/components/common/ModalProvider";
import { useCompare } from "@/components/common/CompareProvider";
import { useWishlist } from "@/components/common/WishlistProvider";
import { SearchIcon, SignInIcon, AddListingIcon, CompareIcon, WishlistIcon } from "@/components/common/icons";
import { useHeaderScrollFixed } from "./useHeaderScrollFixed";

const LANGUAGES = ["English", "Viet Nam", "Chinese", "Japanese"];

// Migrated from ../aurexo/home-02.html lines 24-608 (`header-style-2`). Genuinely different DOM from
// `Header.tsx` (3 stacked rows — top bar, logo/search/contact/buttons row, nav row — vs. the single
// `header-inner` row `Header.tsx` renders for style-1/3/4), so this is its own component per the
// variant classification rule, rather than a `variant="style-2"` branch grafted onto `Header.tsx`.
// Reuses `Nav`/`MobileMenu`/`Offcanvas`/icons — the mega-menu content itself (Home/About/Listing/News/
// Pages/Contact) is byte-identical to the standard header, confirmed via source diff, just wrapped in
// different chrome and styled via `.menu.style-2` (`Nav`'s `listClassName` prop). The bottom
// `header-actions` row (search/compare/wishlist/mobile-button) is also identical to `Header.tsx`'s own,
// reused the same way. Language dropdown is decorative (no real i18n anywhere in the source) and the
// prominent `#search-header` search bar has no backing JS anywhere in app.js — both UI_ONLY.
//
// home-03.html reuses this exact shell with BOTH `header-style-2 header-style-3` classes together
// (confirmed via source diff, ../aurexo/home-03.html lines 25-593) — `.header-style-3`'s own SCSS only
// changes the top-bar social icons' border-color (assets/scss/component/header.scss:143), but home-03
// also has several real, confirmed DOM differences alongside it: a light (not colored) top bar with dark
// text, no `.header-search` bar in the middle row, a plain `.container` (not `.header-container-fluid
// max-w-1920`) wrapping the middle row, `.effect-svg-hover` (not `.effect-svg-primary`) on social icons,
// and its own "Lihat di peta" link literally pointing at a phone `tel:` href (a real, disclosed source bug,
// not corrected) — all exposed as props below rather than forking the component.
//
// Retroactive fix: the top-bar's 5 social icons (Facebook/X/Instagram/Skype/Telegram) were rendering
// the WRONG SVGs entirely for Facebook and X — copy-pasted from the FOOTER's `.widget-socical` (solid
// "f" logo / solid X-mark logo, confirmed via a path-data grep that traced them to home-02.html's own
// footer, not its header), not the header top bar's own real outline-style icon set (confirmed via
// direct source diff of `.header-top-bar--socical` on both home-02.html and home-03.html — byte-
// identical shapes between the two pages, differing only in `stroke` color: `white` on home-02's
// colored bar vs `#1C1C1C` on home-03's light bar). Instagram/Skype/Telegram already had the right
// shapes but a hardcoded `stroke="white"` regardless of `topBarVariant`, which would've been invisible
// on home-03's light bar too. All 5 icons now use the correct source paths with `stroke={chevronStroke}`
// (the same dark/white variable already driving the language-dropdown chevron) instead of a fixed color.
//
// Sticky-on-scroll behavior (`is-fixed`/`is-custom`/`is-visible`, mirroring `app.js`'s `headerFixed()`)
// wired via the shared `useHeaderScrollFixed` hook — see that hook's own comment for the threshold logic.
//
// RETROACTIVE FIX (×3, found on request, "check menu-mobile" — same bug confirmed on all 4 header
// components): the mobile nav drawer was completely non-functional (invisible overlay, drawer parked
// off-screen), the toggle button never actually toggled, and the drawer was missing the Sign In/Add
// Listing buttons — see `header/Header.tsx`'s own comment for the full writeup (identical fix applied
// here: `BodyClass`, `Offcanvas`'s new `panelId`, real toggle, duplicated buttons inside the drawer).
// Also missing `.logo-mobile` inside the drawer, and the desktop `<Nav>` was never hidden below 1199px
// at all (fixed via a new `#main-nav { display: none }` rule in `reponsive.scss`) — see
// `header/Header.tsx`'s own comment for the full writeup of both.
export default function HeaderStyle2({
  activePath,
  extraModifierClass,
  wrapperClassName = "header-wrapper-style-2",
  topBarVariant = "highlight",
  showSearchBar = true,
  middleRowContainerFluid = true,
  socialHoverClass = "effect-svg-primary",
  viewOnMapHref = "https://www.google.com/maps?q=123Yarranst,Punchbowl,NSW2196,Australia",
}: {
  activePath?: string;
  /** home-03.html adds `header-style-3` alongside `header-style-2` on the outer `<header>`. */
  extraModifierClass?: string;
  wrapperClassName?: string;
  /** home-02.html's top bar is `.bg-highlight` (colored bg, white text); home-03.html's own is
   *  `.background-light` (light bg, dark text) — a real, confirmed skin difference. */
  topBarVariant?: "highlight" | "light";
  /** home-03.html's middle row has no `.header-search` bar at all. */
  showSearchBar?: boolean;
  /** home-03.html wraps the middle row in a plain `.container`, not `.header-container-fluid max-w-1920`. */
  middleRowContainerFluid?: boolean;
  socialHoverClass?: string;
  /** home-03.html's own "Lihat di peta" link literally points at a `tel:` href, not the maps URL — a real,
   *  disclosed source bug, preserved via this prop rather than silently corrected. */
  viewOnMapHref?: string;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [language, setLanguage] = useState("English");
  const langRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement | null>(null);
  const { openModal } = useModal();
  const { compareItems } = useCompare();
  const { wishlistItems } = useWishlist();

  useHeaderScrollFixed(headerRef);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const topBarLabelClass = topBarVariant === "highlight" ? "text-white" : "";
  // Byte-matches each variant's own real wrapper class list, confirmed via source diff:
  // home-02.html: "header-top-bar header-container-fluid max-w-1920 relative bg-highlight"
  // home-03.html: "header-top-bar relative background-light" (its own inner ".container
  // header-top-bar--wrapper" div is rendered separately below, not merged into this one).
  const topBarWrapperClass =
    topBarVariant === "highlight"
      ? "header-top-bar header-container-fluid max-w-1920 relative bg-highlight"
      : "header-top-bar relative background-light";
  const chevronStroke = topBarVariant === "highlight" ? "white" : "#1C1C1C";

  return (
    <div className={wrapperClassName}>
      <header
        ref={headerRef}
        className={`header header-style-2 bg-white${extraModifierClass ? ` ${extraModifierClass}` : ""}`}
        id="header_main"
      >
        {(() => {
          const topBarInner = (
            <>
              <p className={`header-top-bar--text flex items-center${topBarLabelClass ? ` ${topBarLabelClass}` : ""}`}>
                Temukan Mobil Impian Anda Hari Ini – Lihat Koleksi Kami Sekarang!
              </p>

              <div className="header-top-bar--socical-wrapper flex items-center gap-40 md-hidden">
                <div>
                  <div className={`core-dropdown language-select${isLangOpen ? " active" : ""}`} ref={langRef}>
                    <button
                      className="core-dropdown__button"
                      type="button"
                      onClick={() => setIsLangOpen((open) => !open)}
                    >
                      <span className={`core-dropdown__label${topBarLabelClass ? ` ${topBarLabelClass}` : ""}`}>{language}</span>
                      <svg className="icon-chevron" width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 6.5L8 10.5L12 6.5" stroke={chevronStroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                    <div className="core-dropdown__menu">
                      <ul className="core-dropdown__list">
                        {LANGUAGES.map((lang) => (
                          <li
                            className="text-sm cursor-pointer"
                            key={lang}
                            onClick={() => {
                              setLanguage(lang);
                              setIsLangOpen(false);
                            }}
                          >
                            {lang}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                <ul className="header-top-bar--socical pl-40">
                  <li>
                    <a href="https://www.facebook.com/" target="_blank" rel="noreferrer" className={socialHoverClass}>
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6.25 11.25L8.75 8.75L11.25 11.25L13.75 8.75" stroke={chevronStroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M6.24382 16.4932C7.81923 17.405 9.67248 17.7127 11.458 17.359C13.2436 17.0053 14.8396 16.0143 15.9484 14.5708C17.0573 13.1273 17.6033 11.3298 17.4847 9.51341C17.3662 7.69704 16.5911 5.98577 15.304 4.69866C14.0169 3.41156 12.3056 2.63646 10.4892 2.51789C8.67284 2.39932 6.87533 2.94537 5.43182 4.05422C3.98831 5.16308 2.99733 6.75906 2.64363 8.54461C2.28993 10.3302 2.59766 12.1834 3.50944 13.7588L2.5321 16.6768C2.49538 16.7869 2.49005 16.9051 2.51671 17.0181C2.54337 17.131 2.60097 17.2344 2.68306 17.3165C2.76514 17.3985 2.86847 17.4561 2.98145 17.4828C3.09443 17.5095 3.2126 17.5041 3.32273 17.4674L6.24382 16.4932Z" stroke={chevronStroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </a>
                  </li>
                  <li>
                    <a href="https://x.com/" target="_blank" rel="noreferrer" className={socialHoverClass}>
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3.75 3.125H7.5L16.25 16.875H12.5L3.75 3.125Z" stroke={chevronStroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M8.89687 11.2129L3.75 16.8746" stroke={chevronStroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M16.2484 3.125L11.1016 8.78672" stroke={chevronStroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </a>
                  </li>
                  <li>
                    <a href="https://www.instagram.com/" target="_blank" rel="noreferrer" className={socialHoverClass}>
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 13.125C11.7259 13.125 13.125 11.7259 13.125 10C13.125 8.27411 11.7259 6.875 10 6.875C8.27411 6.875 6.875 8.27411 6.875 10C6.875 11.7259 8.27411 13.125 10 13.125Z" stroke={chevronStroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M13.75 2.5H6.25C4.17893 2.5 2.5 4.17893 2.5 6.25V13.75C2.5 15.8211 4.17893 17.5 6.25 17.5H13.75C15.8211 17.5 17.5 15.8211 17.5 13.75V6.25C17.5 4.17893 15.8211 2.5 13.75 2.5Z" stroke={chevronStroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M14.0625 6.71875C14.494 6.71875 14.8438 6.36897 14.8438 5.9375C14.8438 5.50603 14.494 5.15625 14.0625 5.15625C13.631 5.15625 13.2812 5.50603 13.2812 5.9375C13.2812 6.36897 13.631 6.71875 14.0625 6.71875Z" fill="white" />
                      </svg>
                    </a>
                  </li>
                  <li>
                    <a href="https://secure.skype.com" target="_blank" rel="noreferrer" className={socialHoverClass}>
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7.5 11.875C7.5 12.9102 8.61953 13.75 10 13.75C11.3805 13.75 12.5 12.9102 12.5 11.875C12.5 9.375 7.63906 10.3125 7.63906 8.125C7.63906 7.08984 8.61953 6.25 10 6.25C11.0352 6.25 11.8461 6.71875 12.1875 7.39531" stroke={chevronStroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M16.7185 11.4602C17.2734 12.1819 17.5469 13.0809 17.4877 13.9893C17.4286 14.8978 17.0411 15.7538 16.3973 16.3975C15.7536 17.0413 14.8976 17.4289 13.9891 17.488C13.0806 17.5471 12.1817 17.2737 11.4599 16.7188C10.3352 16.9619 9.16735 16.919 8.06341 16.5941C6.95947 16.2692 5.95465 15.6726 5.14094 14.8588C4.32722 14.0451 3.7306 13.0403 3.40567 11.9364C3.08074 10.8324 3.03789 9.66463 3.28103 8.53984C2.72612 7.81811 2.45272 6.91915 2.51182 6.01067C2.57093 5.10219 2.95851 4.24623 3.60226 3.60248C4.24601 2.95873 5.10197 2.57115 6.01045 2.51204C6.91893 2.45293 7.81789 2.72634 8.53963 3.28125C9.66441 3.0381 10.8322 3.08096 11.9362 3.40589C13.0401 3.73081 14.0449 4.32744 14.8586 5.14116C15.6723 5.95487 16.269 6.95968 16.5939 8.06362C16.9188 9.16756 16.9617 10.3354 16.7185 11.4602Z" stroke={chevronStroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </a>
                  </li>
                  <li>
                    <a href="https://desktop.telegram.org" target="_blank" rel="noreferrer" className={socialHoverClass}>
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6.24939 10.5366L13.301 16.7186C13.3822 16.7903 13.4806 16.8396 13.5867 16.8618C13.6927 16.8839 13.8027 16.8781 13.9058 16.845C14.0089 16.8118 14.1016 16.7524 14.1749 16.6726C14.2481 16.5928 14.2994 16.4953 14.3236 16.3897L17.4994 2.59521C17.5025 2.58138 17.5018 2.56696 17.4973 2.55351C17.4928 2.54006 17.4848 2.52807 17.474 2.51884C17.4633 2.50961 17.4502 2.50348 17.4362 2.5011C17.4223 2.49873 17.4079 2.5002 17.3947 2.50537L1.56189 8.70146C1.4636 8.73929 1.38023 8.80798 1.3243 8.89722C1.26837 8.98646 1.2429 9.09143 1.2517 9.19638C1.26051 9.30133 1.30312 9.4006 1.37313 9.47927C1.44315 9.55794 1.5368 9.61178 1.64001 9.63271L6.24939 10.5366Z" stroke={chevronStroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M6.25 10.5375L17.4539 2.50781" stroke={chevronStroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M9.71641 13.577L7.325 16.0582C7.23859 16.1479 7.12737 16.2097 7.00561 16.2357C6.88384 16.2617 6.75708 16.2507 6.64157 16.2042C6.52607 16.1577 6.42709 16.0778 6.35732 15.9747C6.28755 15.8715 6.25018 15.7499 6.25 15.6254V10.5371" stroke={chevronStroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </a>
                  </li>
                </ul>
              </div>
            </>
          );

          return topBarVariant === "highlight" ? (
            <div className="bg-highlight">
              <div className={topBarWrapperClass}>{topBarInner}</div>
            </div>
          ) : (
            <div className={topBarWrapperClass}>
              <div className="container header-top-bar--wrapper">{topBarInner}</div>
            </div>
          );
        })()}

        <div
          className={`header-style-2-main relative md-hidden${
            middleRowContainerFluid ? " header-container-fluid max-w-1920" : ""
          }`}
        >
          {(() => {
            const middleRowInner = (
              <div className="header-inner header-inner-style-2 items-center w-full flex">
                <div className="logo">
                  <Link href="/">
                    <Image src="/assets/images/logo.png" alt="logo" width={66} height={54} />
                  </Link>
                </div>
                <div className="logo-mobile">
                  <Link href="/">
                    <Image src="/assets/images/logo-white.png" alt="logo-white.png" width={44} height={36} />
                  </Link>
                </div>

                {showSearchBar && (
                  <form className="header-search w-full" onSubmit={(event) => event.preventDefault()}>
                    <input
                      type="text"
                      name="search-header"
                      required
                      placeholder="The model you want as quickly as possible..."
                    />
                    <button type="submit" className="header-search-btn">
                      <SearchIcon />
                    </button>
                  </form>
                )}

                <div className="header-right">
                  <ul className="header-contact">
                    <li>
                      <span className="icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M14.25 4.5C15.5114 4.83218 16.6621 5.4932 17.5844 6.41557C18.5068 7.33793 19.1678 8.48858 19.5 9.75" stroke="#1C1C1C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M13.5 7.5C15.0488 7.91438 16.0856 8.95125 16.5 10.5" stroke="#1C1C1C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M14.6616 14.3752C14.7654 14.3061 14.8849 14.264 15.0091 14.2527C15.1334 14.2414 15.2585 14.2613 15.3731 14.3106L19.7944 16.2915C19.9434 16.3552 20.0677 16.4654 20.1489 16.6057C20.23 16.7459 20.2635 16.9087 20.2444 17.0696C20.0987 18.1581 19.5627 19.1566 18.736 19.8795C17.9093 20.6024 16.8482 21.0005 15.75 20.9996C12.3685 20.9996 9.12548 19.6563 6.73439 17.2652C4.3433 14.8741 3 11.6311 3 8.24961C2.99916 7.15143 3.3972 6.09032 4.12009 5.26361C4.84298 4.43691 5.84152 3.90089 6.93 3.75524C7.09091 3.73612 7.25368 3.76963 7.39395 3.85075C7.53422 3.93187 7.64444 4.05624 7.70813 4.20524L9.68906 8.63024C9.73774 8.74389 9.75756 8.86781 9.74676 8.99098C9.73597 9.11414 9.69489 9.23272 9.62719 9.33618L7.62375 11.7184C7.55269 11.8256 7.51066 11.9494 7.50179 12.0778C7.49291 12.2061 7.51749 12.3346 7.57313 12.4506C8.34844 14.0377 9.98906 15.6587 11.5809 16.4265C11.6975 16.4819 11.8266 16.5059 11.9553 16.4962C12.084 16.4865 12.208 16.4434 12.315 16.3712L14.6616 14.3752Z" stroke="#1C1C1C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>

                      <div>
                        <a className="text" href="tel:1-222-345-8888">1-222-345-8888</a>
                        <a className="text" href="tel:1-222-6666-8888">1-222-6666-8888</a>
                      </div>
                    </li>
                    <li>
                      <span className="icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 12.75C13.6569 12.75 15 11.4069 15 9.75C15 8.09315 13.6569 6.75 12 6.75C10.3431 6.75 9 8.09315 9 9.75C9 11.4069 10.3431 12.75 12 12.75Z" stroke="#1C1C1C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M19.5 9.75C19.5 16.5 12 21.75 12 21.75C12 21.75 4.5 16.5 4.5 9.75C4.5 7.76088 5.29018 5.85322 6.6967 4.4467C8.10322 3.04018 10.0109 2.25 12 2.25C13.9891 2.25 15.8968 3.04018 17.3033 4.4467C18.7098 5.85322 19.5 7.76088 19.5 9.75Z" stroke="#1C1C1C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>

                      <div>
                        <a
                          target="_blank"
                          rel="noreferrer"
                          className="text"
                          href="https://www.google.com/maps?q=123Yarranst,Punchbowl,NSW2196,Australia"
                        >
                          15505 Roscoe Blvd, North Hills, USA
                        </a>
                        <a target="_blank" rel="noreferrer" className="text-xs font-weight-500 uppercase" href={viewOnMapHref}>
                          Lihat di peta
                        </a>
                      </div>
                    </li>
                  </ul>
              <div className="header-button mobile-hidden-header-button flex items-center gap-20">
                <button
                  className="btn btn-line btn-large font-weight-600 bg-sign-in"
                  onClick={() => openModal("LoginModal")}
                >
                  <SignInIcon />
                  Masuk
                </button>

                <Link href="/add-listings-2" className="btn btn-primary btn-large font-weight-600">
                  <AddListingIcon />
                  Tambah Iklan
                </Link>
              </div>
            </div>
          </div>
            );

            return middleRowContainerFluid ? middleRowInner : <div className="container">{middleRowInner}</div>;
          })()}
        </div>

        <div className="bg-primary">
          <div className="header-container-fluid max-w-1920 relative bg-primary header-fixed-primary">
            <div className="header-inner flex-col container" id="site-header-inner">
              <div className="flex justify-between items-center gap-20 w-full main-nav-wrapper">
                <Nav activePath={activePath} listClassName="style-2" />

                <div className="header-actions ml-20">
                  <Link href="/">
                    <Image className="logo-mobile-header" src="/assets/images/logo-white.png" alt="logo" width={44} height={36} />
                  </Link>
                  <div className="header-search-wrapper show-tablet">
                    <span className="header-action-btn" id="searchToggle" onClick={() => openModal("SearchModal")}>
                      <SearchIcon />
                    </span>
                    {/* Same dead-inline-form finding as Header.tsx's own comment — app.js wires
                        #searchToggle to open #SearchModal; the inline .search-form dropdown here is
                        unused dead markup, not reproduced. */}
                  </div>

                  <Link
                    href="/compare"
                    className="header-action-btn header-action-icon"
                    aria-label="Bandingkan"
                    data-badge={compareItems.length > 0 ? compareItems.length : undefined}
                  >
                    <CompareIcon />
                  </Link>

                  <Link
                    href="/my-favorites"
                    className="header-action-btn header-action-icon"
                    aria-label="Favorit"
                    data-badge={wishlistItems.length > 0 ? wishlistItems.length : undefined}
                  >
                    <WishlistIcon />
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
            <Link href="/add-listings-2" className="btn btn-primary btn-large font-weight-600">
              <AddListingIcon />
              Tambah Iklan
            </Link>
          </div>
        </div>
      </header>

      <BodyClass className={isMobileMenuOpen ? "main-nav-mobile" : ""} />

      <Offcanvas
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        panelId="main-nav-mobile"
      >
        {/* Real source: app.js's mobileNav() also appends `.logo-mobile` into this drawer — see
            `header/Header.tsx`'s own comment for why. Rendered a 2nd time here (not literally moved). */}
        <div className="logo-mobile">
          <Link href="/">
            <Image src="/assets/images/logo-white.png" alt="logo-white.png" width={44} height={36} />
          </Link>
        </div>
        <MobileMenu />
        <div className="header-button header-button-mobile flex items-center gap-20">
          <button
            className="btn btn-primary btn-large font-weight-600"
            onClick={() => openModal("LoginModal")}
          >
            <SignInIcon />
            Masuk
          </button>
          <Link href="/add-listings-2" className="btn btn-primary btn-large font-weight-600">
            <AddListingIcon />
            Tambah Iklan
          </Link>
        </div>
      </Offcanvas>
    </div>
  );
}
