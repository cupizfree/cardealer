"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
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

// Migrated from ../aurexo/home-05.html lines 24-570 (`header-style-4 header-blur`). Genuinely
// different DOM from `Header.tsx` (style-1/3) and `HeaderStyle2.tsx` (style-2/3): a real contact-info
// top bar (address/email/phone + language dropdown + socials, on `bg-primary`) sits above ONE combined
// row (logo + nav + Sign In/Add Listing buttons + search/compare/wishlist actions) — not split into a
// separate search-bar row and a separate nav-only row the way `HeaderStyle2` is. `header-blur`
// (`assets/scss/component/header.scss:150-153`) is just a translucent gray background color, no extra
// behavior. Language dropdown and the inline `#searchForm` are both UI_ONLY, same conclusion as every
// other header variant (`app.js` wires `#searchToggle` to open `#SearchModal` instead). Top bar
// content (address/email/phone/language/socials) is always white regardless of skin (confirmed
// identical on home-06.html's own `bg-white` reuse below) — only the main row (nav chevrons, action
// icons, logo, Add Listing button) actually varies by skin, exposed via the props below.
//
// home-06.html reuses this exact header with `header-style-4 bg-white` instead of `header-blur`
// (confirmed via source diff, ../aurexo/home-06.html lines 24-568): dark logo, dark nav chevrons/action
// icons (since the bg is now white, not a dark blurred hero), a `btn-primary` (not `btn-white`) Add
// Listing button with a white icon, and its own distinct wrapper/container classes
// (`header-wrapper-style-5`, `max-w-1440 px-15` instead of `max-w-1920 header-spacing`).
//
// Retroactive fix: the desktop Sign In/Search/Compare/Wishlist icons and the `.divider-vertical`
// breakpoint class were left at `icons.tsx`'s shared dark default (`#1C1C1C`) even though home-05's own
// real source has them as `white` — confirmed via direct source diff. The desktop Add Listing icon had
// the OPPOSITE bug: `AddListingIcon`'s own shared default is `"white"` (correct for `Header.tsx`'s own
// `btn-primary` usage), but home-05's own desktop Add Listing button is real `btn-white` with a real
// `#1C1C1C` icon — a white icon on a white button was rendering invisibly. Both fixed by making every
// color an explicit prop here (defaulting to home-05's own real colors) rather than relying on
// `icons.tsx`'s shared defaults, which are tuned for `Header.tsx`'s own different context.
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
export default function HeaderStyle4({
  activePath,
  bgClassName = "header-blur",
  wrapperClassName = "header-wrapper-style-4",
  topBarContainerClassName = "max-w-1920 header-spacing md-w-full md-min-w-full",
  dividerClassName = "divider-vertical h-24 lg-hidden",
  mainContainerClassName = "max-w-1920 header-spacing relative min-height-header",
  logoSrc = "/assets/images/logo-white.png",
  topLevelChevronColor = "white",
  actionIconStroke = "white",
  addListingButtonClassName = "btn btn-white btn-large font-weight-600",
  addListingIconColor = "#1C1C1C",
  navListClassName = "style-2",
  navWrapperClassName = "margin-right-auto",
}: {
  activePath?: string;
  bgClassName?: string;
  wrapperClassName?: string;
  topBarContainerClassName?: string;
  dividerClassName?: string;
  mainContainerClassName?: string;
  logoSrc?: string;
  topLevelChevronColor?: string;
  actionIconStroke?: string;
  addListingButtonClassName?: string;
  addListingIconColor?: string;
  /** home-06.html's own nav list is a real `class="menu menu"` (a source copy-paste typo, no `style-2`
   *  modifier at all) — confirmed via source diff against home-05.html's own `menu style-2`. */
  navListClassName?: string;
  /** index.html's own real default is `mr-18` (matches `Nav.tsx`'s own default); home-05.html's own is
   *  `margin-right-auto` (kept as the default here since this is a `HeaderStyle4` fix, not
   *  `Nav.tsx`-wide), home-06.html's own is `mr-50`. */
  navWrapperClassName?: string;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [language, setLanguage] = useState("English");
  const headerRef = useRef<HTMLElement | null>(null);
  const { openModal } = useModal();
  const { compareItems } = useCompare();
  const { wishlistItems } = useWishlist();

  useHeaderScrollFixed(headerRef);

  return (
    <div className={wrapperClassName}>
      <header ref={headerRef} className={`header header-style-4 ${bgClassName}`} id="header_main">
        <div className="header-top-bar relative bg-primary">
          <div className={`topbar-container ${topBarContainerClassName}`}>
            <div className="flex gap-24">
              <div className="flex gap-24 md-gap-8 md">
                <a
                  target="_blank"
                  rel="noreferrer"
                  href="https://www.google.com/maps?q=123Yarranst,Punchbowl,NSW2196,Australia"
                  className="flex items-center text-white gap-8 text-sm effect-svg-hover md-text-0"
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M10 5.15625C9.41284 5.15625 8.83886 5.33036 8.35065 5.65657C7.86244 5.98278 7.48193 6.44644 7.25723 6.98891C7.03254 7.53138 6.97374 8.12829 7.08829 8.70417C7.20284 9.28006 7.48559 9.80904 7.90078 10.2242C8.31596 10.6394 8.84494 10.9222 9.42083 11.0367C9.99671 11.1513 10.5936 11.0925 11.1361 10.8678C11.6786 10.6431 12.1422 10.2626 12.4684 9.77435C12.7946 9.28614 12.9688 8.71216 12.9688 8.125C12.9688 7.33764 12.656 6.58253 12.0992 6.02578C11.5425 5.46903 10.7874 5.15625 10 5.15625ZM10 10.1562C9.59826 10.1562 9.20554 10.0371 8.8715 9.81392C8.53746 9.59073 8.27711 9.27349 8.12337 8.90233C7.96963 8.53116 7.9294 8.12275 8.00778 7.72872C8.08616 7.3347 8.27961 6.97276 8.56369 6.68869C8.84776 6.40461 9.2097 6.21116 9.60372 6.13278C9.99775 6.0544 10.4062 6.09463 10.7773 6.24837C11.1485 6.40211 11.4657 6.66246 11.6889 6.9965C11.9121 7.33054 12.0312 7.72326 12.0312 8.125C12.0312 8.66372 11.8172 9.18038 11.4363 9.56131C11.0554 9.94224 10.5387 10.1562 10 10.1562ZM10 1.40625C8.21871 1.40832 6.51097 2.11685 5.25141 3.37641C3.99185 4.63597 3.28332 6.34371 3.28125 8.125C3.28125 10.5398 4.40156 13.1047 6.52109 15.5422C7.47774 16.6478 8.55442 17.6435 9.73125 18.5109C9.81003 18.5661 9.90385 18.5956 10 18.5956C10.0961 18.5956 10.19 18.5661 10.2688 18.5109C11.4456 17.6435 12.5223 16.6478 13.4789 15.5422C15.5984 13.1047 16.7188 10.5422 16.7188 8.125C16.7167 6.34371 16.0082 4.63597 14.7486 3.37641C13.489 2.11685 11.7813 1.40832 10 1.40625ZM10 17.5398C8.82812 16.6352 4.21875 12.7828 4.21875 8.125C4.21875 6.59172 4.82784 5.12123 5.91204 4.03704C6.99623 2.95284 8.46672 2.34375 10 2.34375C11.5333 2.34375 13.0038 2.95284 14.088 4.03704C15.1722 5.12123 15.7812 6.59172 15.7812 8.125C15.7812 12.7828 11.1719 16.6352 10 17.5398Z"
                      fill="white"
                    />
                  </svg>
                  15505 Roscoe Blvd, North Hills, USA
                </a>

                <a href="mailto:themesflat@gmail.com" className="flex items-center text-white gap-8 text-sm effect-svg-hover md-text-0">
                  <svg width="16" height="13" viewBox="0 0 16 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M15.4688 0H0.46875C0.34443 0 0.225201 0.049386 0.137294 0.137294C0.049386 0.225201 0 0.34443 0 0.46875V11.0938C0 11.3838 0.115234 11.662 0.320352 11.8671C0.52547 12.0723 0.803669 12.1875 1.09375 12.1875H14.8438C15.1338 12.1875 15.412 12.0723 15.6171 11.8671C15.8223 11.662 15.9375 11.3838 15.9375 11.0938V0.46875C15.9375 0.34443 15.8881 0.225201 15.8002 0.137294C15.7123 0.049386 15.5931 0 15.4688 0ZM7.96875 6.70781L1.67344 0.9375H14.2641L7.96875 6.70781ZM5.91172 6.09375L0.9375 10.6531V1.53437L5.91172 6.09375ZM6.60547 6.72969L7.65625 7.68906C7.74266 7.76812 7.85554 7.81196 7.97266 7.81196C8.08978 7.81196 8.20265 7.76812 8.28906 7.68906L9.33594 6.72969L14.2641 11.25H1.67422L6.60547 6.72969ZM10.0258 6.09375L15 1.53437V10.6531L10.0258 6.09375Z"
                      fill="white"
                    />
                  </svg>
                  themesflat@gmail.com
                </a>
              </div>

              <div className={dividerClassName} />

              <div>
                <div className={`core-dropdown language-select${isLangOpen ? " active" : ""}`}>
                  <button
                    className="core-dropdown__button text-white"
                    type="button"
                    onClick={() => setIsLangOpen((open) => !open)}
                  >
                    <span className="core-dropdown__label text-white">{language}</span>
                    <svg
                      className="chevron-down icon-chevron"
                      width="16"
                      height="12"
                      viewBox="0 0 16 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M4 6.5L8 10.5L12 6.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
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
            </div>

            <div className="header-top-bar--socical-wrapper flex items-center gap-24">
              <a href="tel:1-555-678-8888" className="flex items-center text-white gap-8 effect-svg-hover h7 md-text-0">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M9.39063 0.972052C9.4065 0.912527 9.43395 0.856715 9.47141 0.807805C9.50886 0.758896 9.55559 0.717849 9.60892 0.687012C9.66225 0.656175 9.72113 0.636153 9.78221 0.62809C9.84328 0.620026 9.90535 0.624081 9.96485 0.640021C11.097 0.935349 12.13 1.52718 12.9574 2.35454C13.7847 3.1819 14.3766 4.21487 14.6719 5.34705C14.6878 5.40656 14.6919 5.46862 14.6838 5.5297C14.6758 5.59077 14.6557 5.64965 14.6249 5.70298C14.5941 5.75631 14.553 5.80304 14.5041 5.8405C14.4552 5.87795 14.3994 5.9054 14.3399 5.92127C14.3004 5.93179 14.2596 5.93704 14.2188 5.9369C14.1155 5.93696 14.0151 5.90291 13.9331 5.84004C13.8512 5.77718 13.7923 5.68901 13.7656 5.58924C13.5121 4.61673 13.0038 3.72942 12.2931 3.01877C11.5825 2.30811 10.6952 1.79982 9.72266 1.54627C9.66314 1.5304 9.60733 1.50295 9.55842 1.4655C9.50951 1.42804 9.46846 1.38131 9.43762 1.32798C9.40679 1.27465 9.38677 1.21577 9.3787 1.1547C9.37064 1.09362 9.37469 1.03156 9.39063 0.972052ZM9.09766 4.04627C10.2344 4.3494 10.9625 5.07752 11.2656 6.21424C11.2923 6.31401 11.3512 6.40218 11.4331 6.46504C11.5151 6.52791 11.6155 6.56196 11.7188 6.5619C11.7596 6.56204 11.8004 6.55679 11.8399 6.54627C11.8994 6.5304 11.9552 6.50295 12.0041 6.4655C12.053 6.42804 12.0941 6.38131 12.1249 6.32798C12.1557 6.27465 12.1758 6.21577 12.1838 6.1547C12.1919 6.09362 12.1878 6.03156 12.1719 5.97205C11.7813 4.51033 10.8016 3.53065 9.33985 3.14002C9.28035 3.12412 9.21829 3.12009 9.15723 3.12817C9.09617 3.13625 9.0373 3.15628 8.98398 3.18711C8.87629 3.24938 8.79775 3.35188 8.76563 3.47205C8.73352 3.59223 8.75046 3.72024 8.81272 3.82793C8.87499 3.93561 8.97749 4.01415 9.09766 4.04627ZM15.3039 11.6244C15.1701 12.6457 14.6689 13.5833 13.8941 14.2619C13.1192 14.9405 12.1238 15.3138 11.0938 15.3119C4.97657 15.3119 7.79078e-06 10.3353 7.79078e-06 4.21815C-0.00196546 3.18849 0.370961 2.19333 1.04913 1.41855C1.72729 0.643772 2.66431 0.142365 3.68516 0.00798942C3.92016 -0.0205687 4.15808 0.027887 4.36319 0.146079C4.56831 0.264271 4.72953 0.44582 4.82266 0.663458L6.4711 4.34315C6.54389 4.50973 6.574 4.69183 6.55872 4.87298C6.54345 5.05412 6.48326 5.2286 6.3836 5.38065C6.37355 5.39612 6.36259 5.41099 6.35079 5.42518L4.7047 7.38299C4.6947 7.40328 4.6895 7.4256 4.6895 7.44822C4.6895 7.47085 4.6947 7.49316 4.7047 7.51346C5.30313 8.73846 6.58751 10.0135 7.8297 10.6111C7.85044 10.6206 7.87309 10.6251 7.89587 10.6243C7.91865 10.6234 7.94093 10.6173 7.96094 10.6064L9.88985 8.9658C9.90362 8.95382 9.91824 8.94285 9.9336 8.93299C10.085 8.83207 10.2591 8.7705 10.4403 8.75386C10.6214 8.73722 10.8039 8.76603 10.9711 8.83768L14.6617 10.4916C14.8765 10.5868 15.0549 10.7485 15.1705 10.953C15.2862 11.1574 15.333 11.3937 15.3039 11.6267V11.6244ZM14.375 11.5088C14.3776 11.4761 14.3699 11.4434 14.3529 11.4154C14.336 11.3874 14.3106 11.3654 14.2805 11.3525L10.5891 9.69861C10.5689 9.69083 10.5473 9.6875 10.5257 9.68885C10.5041 9.6902 10.4831 9.69619 10.4641 9.70643L8.53594 11.3471C8.52188 11.3588 8.50704 11.3697 8.4922 11.3799C8.33492 11.4847 8.15315 11.5471 7.9646 11.5608C7.77606 11.5745 7.58719 11.539 7.41641 11.458C5.98204 10.765 4.55235 9.34861 3.85938 7.92752C3.77788 7.75773 3.7416 7.56978 3.75405 7.38186C3.76651 7.19393 3.82728 7.01241 3.93048 6.85486C3.94054 6.8392 3.95177 6.82431 3.96407 6.81033L5.60938 4.85252C5.61878 4.83206 5.62365 4.80981 5.62365 4.78729C5.62365 4.76477 5.61878 4.74251 5.60938 4.72205L3.96407 1.03924C3.95321 1.00968 3.93368 0.984095 3.90803 0.965832C3.88237 0.94757 3.8518 0.937483 3.82032 0.936896H3.80235C3.00778 1.04259 2.27883 1.43388 1.75164 2.0377C1.22445 2.64152 0.935063 3.41657 0.937508 4.21815C0.937508 9.81815 5.49376 14.3744 11.0938 14.3744C11.8954 14.3768 12.6706 14.0873 13.2744 13.56C13.8783 13.0326 14.2695 12.3035 14.375 11.5088Z"
                    fill="white"
                  />
                </svg>
                1-555-678-8888
              </a>
              <ul className="header-top-bar--socical pl-24">
                <li>
                  <a href="#" className="effect-svg-hover">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6.25 11.25L8.75 8.75L11.25 11.25L13.75 8.75" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path
                        d="M6.24382 16.4932C7.81923 17.405 9.67248 17.7127 11.458 17.359C13.2436 17.0053 14.8396 16.0143 15.9484 14.5708C17.0573 13.1273 17.6033 11.3298 17.4847 9.51341C17.3662 7.69704 16.5911 5.98577 15.304 4.69866C14.0169 3.41156 12.3056 2.63646 10.4892 2.51789C8.67284 2.39932 6.87533 2.94537 5.43182 4.05422C3.98831 5.16308 2.99733 6.75906 2.64363 8.54461C2.28993 10.3302 2.59766 12.1834 3.50944 13.7588L2.5321 16.6768C2.49538 16.7869 2.49005 16.9051 2.51671 17.0181C2.54337 17.131 2.60097 17.2344 2.68306 17.3165C2.76514 17.3985 2.86847 17.4561 2.98145 17.4828C3.09443 17.5095 3.2126 17.5041 3.32273 17.4674L6.24382 16.4932Z"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </a>
                </li>
                <li>
                  <a href="#" className="effect-svg-hover">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3.75 3.125H7.5L16.25 16.875H12.5L3.75 3.125Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M8.89687 11.2129L3.75 16.8746" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M16.2484 3.125L11.1016 8.78672" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </a>
                </li>
                <li>
                  <a href="#" className="effect-svg-hover">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M10 13.125C11.7259 13.125 13.125 11.7259 13.125 10C13.125 8.27411 11.7259 6.875 10 6.875C8.27411 6.875 6.875 8.27411 6.875 10C6.875 11.7259 8.27411 13.125 10 13.125Z"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M13.75 2.5H6.25C4.17893 2.5 2.5 4.17893 2.5 6.25V13.75C2.5 15.8211 4.17893 17.5 6.25 17.5H13.75C15.8211 17.5 17.5 15.8211 17.5 13.75V6.25C17.5 4.17893 15.8211 2.5 13.75 2.5Z"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M14.0625 6.71875C14.494 6.71875 14.8438 6.36897 14.8438 5.9375C14.8438 5.50603 14.494 5.15625 14.0625 5.15625C13.631 5.15625 13.2812 5.50603 13.2812 5.9375C13.2812 6.36897 13.631 6.71875 14.0625 6.71875Z"
                        fill="white"
                      />
                    </svg>
                  </a>
                </li>
                <li>
                  <a href="#" className="effect-svg-hover">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M7.5 11.875C7.5 12.9102 8.61953 13.75 10 13.75C11.3805 13.75 12.5 12.9102 12.5 11.875C12.5 9.375 7.63906 10.3125 7.63906 8.125C7.63906 7.08984 8.61953 6.25 10 6.25C11.0352 6.25 11.8461 6.71875 12.1875 7.39531"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M16.7185 11.4602C17.2734 12.1819 17.5469 13.0809 17.4877 13.9893C17.4286 14.8978 17.0411 15.7538 16.3973 16.3975C15.7536 17.0413 14.8976 17.4289 13.9891 17.488C13.0806 17.5471 12.1817 17.2737 11.4599 16.7188C10.3352 16.9619 9.16735 16.919 8.06341 16.5941C6.95947 16.2692 5.95465 15.6726 5.14094 14.8588C4.32722 14.0451 3.7306 13.0403 3.40567 11.9364C3.08074 10.8324 3.03789 9.66463 3.28103 8.53984C2.72612 7.81811 2.45272 6.91915 2.51182 6.01067C2.57093 5.10219 2.95851 4.24623 3.60226 3.60248C4.24601 2.95873 5.10197 2.57115 6.01045 2.51204C6.91893 2.45293 7.81789 2.72634 8.53963 3.28125C9.66441 3.0381 10.8322 3.08096 11.9362 3.40589C13.0401 3.73081 14.0449 4.32744 14.8586 5.14116C15.6723 5.95487 16.269 6.95968 16.5939 8.06362C16.9188 9.16756 16.9617 10.3354 16.7185 11.4602Z"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </a>
                </li>
                <li>
                  <a href="#" className="effect-svg-hover">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M6.24939 10.5366L13.301 16.7186C13.3822 16.7903 13.4806 16.8396 13.5867 16.8618C13.6927 16.8839 13.8027 16.8781 13.9058 16.845C14.0089 16.8118 14.1016 16.7524 14.1749 16.6726C14.2481 16.5928 14.2994 16.4953 14.3236 16.3897L17.4994 2.59521C17.5025 2.58138 17.5018 2.56696 17.4973 2.55351C17.4928 2.54006 17.4848 2.52807 17.474 2.51884C17.4633 2.50961 17.4502 2.50348 17.4362 2.5011C17.4223 2.49873 17.4079 2.5002 17.3947 2.50537L1.56189 8.70146C1.4636 8.73929 1.38023 8.80798 1.3243 8.89722C1.26837 8.98646 1.2429 9.09143 1.2517 9.19638C1.26051 9.30133 1.30312 9.4006 1.37313 9.47927C1.44315 9.55794 1.5368 9.61178 1.64001 9.63271L6.24939 10.5366Z"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path d="M6.25 10.5375L17.4539 2.50781" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path
                        d="M9.71641 13.577L7.325 16.0582C7.23859 16.1479 7.12737 16.2097 7.00561 16.2357C6.88384 16.2617 6.75708 16.2507 6.64157 16.2042C6.52607 16.1577 6.42709 16.0778 6.35732 15.9747C6.28755 15.8715 6.25018 15.7499 6.25 15.6254V10.5371"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className={`header-container-fluid ${mainContainerClassName}`}>
          <div className="header-inner" id="site-header-inner">
            <div className="logo">
              <Link href="/">
                <Image src={logoSrc} alt="logo" width={163} height={54} />
              </Link>
            </div>
            <div className="logo-mobile">
              <Link href="/">
                <Image src="/assets/images/logo-white.png" alt="logo-white.png" width={140} height={36} />
              </Link>
            </div>

            <div className="header-right gap-20 header-right-style-2 main-nav-wrapper">
              <Nav
                activePath={activePath}
                listClassName={navListClassName}
                topLevelChevronColor={topLevelChevronColor}
                wrapperClassName={navWrapperClassName}
              />

              <div className="header-button mobile-hidden-header-button flex items-center gap-20">
                <button
                  className="btn btn-line-white btn-large font-weight-600 bg-sign-in"
                  onClick={() => openModal("LoginModal")}
                >
                  <SignInIcon stroke={actionIconStroke} />
                  Sign In
                </button>

                <Link href="/add-listings-2" className={addListingButtonClassName}>
                  <AddListingIcon color={addListingIconColor} />
                  Add Listing
                </Link>
              </div>

              <div className="header-actions ml-20">
                <div className="header-search-wrapper">
                  <span className="relative header-action-btn" id="searchToggle" onClick={() => openModal("SearchModal")}>
                    <SearchIcon stroke={actionIconStroke} />
                  </span>
                </div>

                <Link
                  href="/compare"
                  className="header-action-btn header-action-icon"
                  aria-label="Compare"
                  data-badge={compareItems.length > 0 ? compareItems.length : undefined}
                >
                  <CompareIcon stroke={actionIconStroke} />
                </Link>

                <Link
                  href="/my-favorites"
                  className="header-action-btn header-action-icon"
                  aria-label="Wishlist"
                  data-badge={wishlistItems.length > 0 ? wishlistItems.length : undefined}
                >
                  <WishlistIcon stroke={actionIconStroke} />
                </Link>
                <div className={`mobile-button${isMobileMenuOpen ? " active" : ""}`} onClick={() => setIsMobileMenuOpen((prev) => !prev)}>
                  <span />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="hidden wrapper-header-button">
          <div className="header-button header-button-mobile flex items-center gap-20">
            <button className="btn btn-primary btn-large font-weight-600" onClick={() => openModal("LoginModal")}>
              <SignInIcon />
              Sign In
            </button>
            <Link href="/add-listings-2" className="btn btn-primary btn-large font-weight-600">
              <AddListingIcon />
              Add Listing
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
            <Image src="/assets/images/logo-white.png" alt="logo-white.png" width={140} height={36} />
          </Link>
        </div>
        <MobileMenu />
        <div className="header-button header-button-mobile flex items-center gap-20">
          <button className="btn btn-primary btn-large font-weight-600" onClick={() => openModal("LoginModal")}>
            <SignInIcon />
            Sign In
          </button>
          <Link href="/add-listings-2" className="btn btn-primary btn-large font-weight-600">
            <AddListingIcon />
            Add Listing
          </Link>
        </div>
      </Offcanvas>
    </div>
  );
}
