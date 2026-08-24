"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Nav from "@/components/header/Nav";
import MobileMenu from "@/components/header/MobileMenu";
import Offcanvas from "@/components/common/Offcanvas";
import BodyClass from "@/components/common/BodyClass";
import DashboardAdminDropdown from "./DashboardAdminDropdown";
import { useModal } from "@/components/common/ModalProvider";
import { SignInIcon, AddListingIcon } from "@/components/common/icons";

// Migrated from ../aurexo/dashboard.html lines 93-567. Genuinely different from `header/Header.tsx`, not
// a variant: no `.header-actions` block at all (no search/compare/wishlist icons, confirmed via source —
// this template's dashboard shell just never carries them), and the desktop `.header-button` row shows
// only "Add Listing" (no "Sign In" — a real user is presumably already "logged in" once inside the
// dashboard), unlike every other page's header, which shows both. The main logo sits in a `.hidden
// xl-show` wrapper here (only appears at a wider breakpoint once the sidebar's own logo would be hidden,
// confirmed via `reponsive.scss`) rather than the standard header's always-visible logo. Sign In still
// appears in the mobile fallback row (`.wrapper-header-button`), matching source exactly. Reuses the
// same `Nav`/`MobileMenu`/`Offcanvas` pieces as the standard header — the mega-menu itself is identical.
// **Post-verification fix, found while migrating my-listings.html**: the real "Super Admin"
// `DashboardAdminDropdown` (a `.core-dropdown.user-admin` between the mega-menu and the "Add Listing"
// button) was missed entirely when this file was first built — added here, which retroactively fixes
// dashboard.html too since it shares this same component. Also switched `Nav`'s `activePath` from a
// hardcoded `"/dashboard"` to the real `usePathname()`, so it stays correct across every sibling page in
// this family instead of only ever matching dashboard.html.
//
// RETROACTIVE FIX (×3, found on request, "check menu-mobile" — same bug confirmed on all 4 header
// components): the mobile nav drawer was completely non-functional (invisible overlay, drawer parked
// off-screen), the toggle button never actually toggled, and the drawer was missing the Sign In/Add
// Listing buttons — see `header/Header.tsx`'s own comment for the full writeup (identical fix applied
// here: `BodyClass`, `Offcanvas`'s new `panelId`, real toggle, duplicated buttons inside the drawer).
// Also missing `.logo-mobile` inside the drawer, and the desktop `<Nav>` was never hidden below 1199px
// at all (fixed via a new `#main-nav { display: none }` rule in `reponsive.scss`) — see
// `header/Header.tsx`'s own comment for the full writeup of both.
export default function DashboardHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { openModal } = useModal();
  const pathname = usePathname();

  return (
    <header className="header bg-white" id="header_main">
      <div className="header-container-fluid relative">
        <div className="header-inner" id="site-header-inner">
          <div className="hidden xl-show">
            <Link className="logo" href="/">
              <Image src="/assets/images/logo.png" alt="logo" width={163} height={54} />
            </Link>
          </div>
          <div className="logo-mobile">
            <Link href="/">
              <Image src="/assets/images/logo-white.png" alt="logo-white.png" width={140} height={36} />
            </Link>
          </div>

          <div className="header-right gap-20 main-nav-wrapper">
            <Nav activePath={pathname} />

            <div className="flex items-center gap-4">
              <DashboardAdminDropdown />
            </div>

            <div className="header-button mobile-hidden-header-button items-center gap-4">
              <Link href="/add-listings-2" className="btn btn-primary btn-large font-weight-600">
                <AddListingIcon />
                Add Listing
              </Link>
            </div>

            <div
              className={`mobile-button${isMobileMenuOpen ? " active" : ""}`}
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            >
              <span />
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
    </header>
  );
}
