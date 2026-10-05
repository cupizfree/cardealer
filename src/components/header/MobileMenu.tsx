"use client";

import Link from "next/link";
import { useState } from "react";
import {
  homeMenuItems,
  listingMenuColumns,
  newsMenuLinks,
  pagesMenuColumns,
} from "@/data/menu";
import { ChevronDownIcon } from "@/components/common/icons";

// Mobile accordion nav — the real `#main-nav-mobile .menu` (confirmed via source diff: `#main-nav-
// mobile` is the drawer's own outer id, now set by `Offcanvas`'s `panelId` prop one level up; this
// `<ul>` is just its `.menu` child, previously had the wrong id directly on itself — see
// `Offcanvas.tsx`'s own comment for the full bug). Aurexo's own JS nests a SECOND accordion level per
// `.sub-menu-item-listing` column inside "Katalog"/"Layanan" (their own "Listing Layout"/"Fitur"/etc.
// sub-headers); flattened here to one level (every link below is still present, just not grouped under
// its own column sub-header) — a deliberate simplification, not a content cut. The 4 top-level sections
// (Home/Listing/News/Pages) themselves are NOT mutually exclusive, matching source's own real
// `#main-nav-mobile .menu-item` click handler (see `toggle` below).
//
// RETROACTIVE FIX (×2, found by Playwright verification while fixing the drawer's own visibility bug):
// (1) the 4 top-level toggles ("Beranda"/"Katalog"/"Artikel"/"Layanan") were `<p className="menu-item-inner-
// title">` — but source's own real top-level items are `<a href="#">` (confirmed via source diff,
// byte-identical to "Beranda"'s own real markup), and `menu.scss`'s `#main-nav-mobile > ul > li > a {
// color: $white }` only matches `<a>` tags — so these 4 rendered with invisible near-black text on the
// drawer's own dark background, while "Tentang"/"Kontak" (already real `<Link>`s) rendered correctly.
// Fixed by switching to real `<a href="#">` tags with `preventDefault()` (matching source's own dead
// `href="#"` on these JS-toggled items) instead of `<p>`.
// (2) The SAME invisible-text bug one level deeper: each dropdown's sub-link `<ul>` was
// `className="sub-menu-item-inner"`, whose only white-text rule (`.menu-item-inner .sub-menu-item-inner
// a`) requires a `.menu-item-inner` ancestor `<li>` this markup never has — every sub-link (Homepage
// 01-10, the Listing/News/Pages links) was rendering `#1C1C1C` text on the drawer's own identical
// `#1C1C1C` background: not just low-contrast, literally invisible. Fixed by using the real
// `sub-menu` class instead (confirmed via source diff — every real dropdown panel, regardless of
// column count, carries this class), whose own unconditional `#main-nav-mobile .sub-menu li a {
// color: $white }` rule needs no such ancestor.
// (3) Fixing (2) revealed a 3rd bug: `menu.scss` gives `#main-nav-mobile .sub-menu` an unconditional
// `display: none` with NO CSS override for an open/active state anywhere (source's own jQuery drives
// this via `.slideToggle()`, which sets an inline style directly — there's no `.active`/`.open` class
// variant in the stylesheet at all for this specific selector, unlike the nested `.menu-item-inner
// .sub-menu-item-inner` pattern elsewhere). Conditionally *mounting* the `<ul>` alone doesn't help since
// the CSS still applies `display:none` to it whenever it IS mounted. Fixed with an explicit inline
// `style={{ display: "block" }}` on each `.sub-menu` (safe to hardcode, since the surrounding `{cond &&
// (...)}` already handles mount/unmount — this `<ul>` is only ever in the DOM when its section is open).
// (4) Verification also surfaced a React duplicate-key warning: `listingMenuColumns`/`pagesMenuColumns`
// (each a real multi-column mega-menu in source) legitimately repeat the same `href` across 2 different
// columns (e.g. "Grid Style 4 Columns"), fine for the desktop `Nav.tsx` (each column renders its own
// separate `<ul>`) but colliding once flattened into ONE list here via `flatMap`. Fixed by keying on
// `${link.href}-${index}` instead of the bare (sometimes-duplicate) `href`.
//
// RETROACTIVE FIX (found on request, "check mobileNav logic in app.js"): `openSection` used to be a
// single `string | null`, making the 4 top-level dropdowns mutually exclusive (opening "Katalog" auto-
// closed "Beranda"). Source's own real handler (`app.js`'s `$(document).on("click", "#main-nav-mobile
// .menu-item", ...)`) just does `$(this).toggleClass("active"); $(this).find(".sub-menu").first
// ().slideToggle();` on whichever item was clicked — no code anywhere collapses the others, so multiple
// dropdowns can genuinely be open at once in the real site. Fixed by tracking a `Set` of open sections
// instead of a single value.
export default function MobileMenu() {
  const [openSections, setOpenSections] = useState<Set<string>>(new Set());

  const toggle = (section: string) =>
    setOpenSections((current) => {
      const next = new Set(current);
      if (next.has(section)) {
        next.delete(section);
      } else {
        next.add(section);
      }
      return next;
    });

  return (
    <ul className="menu">
      <li className="menu-item">
        <a
          href="#"
          className="menu-item-inner-title"
          onClick={(event) => {
            event.preventDefault();
            toggle("home");
          }}
        >
          Beranda <ChevronDownIcon />
        </a>
        {openSections.has("home") && (
          <ul className="sub-menu" style={{ display: "block" }}>
            {homeMenuItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        )}
      </li>

      <li className="menu-item">
        <Link href="/about-us">Tentang</Link>
      </li>

      <li className="menu-item">
        <a
          href="#"
          className="menu-item-inner-title"
          onClick={(event) => {
            event.preventDefault();
            toggle("listing");
          }}
        >
          Katalog <ChevronDownIcon />
        </a>
        {openSections.has("listing") && (
          <ul className="sub-menu" style={{ display: "block" }}>
            {listingMenuColumns.flatMap((column) => column.links).map((link, index) => (
              <li key={`${link.href}-${index}`}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        )}
      </li>

      <li className="menu-item">
        <a
          href="#"
          className="menu-item-inner-title"
          onClick={(event) => {
            event.preventDefault();
            toggle("news");
          }}
        >
          Artikel <ChevronDownIcon />
        </a>
        {openSections.has("news") && (
          <ul className="sub-menu" style={{ display: "block" }}>
            {newsMenuLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        )}
      </li>

      <li className="menu-item">
        <a
          href="#"
          className="menu-item-inner-title"
          onClick={(event) => {
            event.preventDefault();
            toggle("pages");
          }}
        >
          Layanan <ChevronDownIcon />
        </a>
        {openSections.has("pages") && (
          <ul className="sub-menu" style={{ display: "block" }}>
            {pagesMenuColumns.flatMap((column) => column.links).map((link, index) => (
              <li key={`${link.href}-${index}`}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        )}
      </li>

      <li className="menu-item">
        <Link href="/contact-us">Kontak</Link>
      </li>
    </ul>
  );
}
