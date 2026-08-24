"use client";

// Generic slide-in panel used by the mobile nav and the filter sidebar. Mirrors Aurexo's
// `.mobile-menu-overlay` + `.active` toggle pattern (app.js `mobileNav()`), reimplemented as a
// small controlled component instead of direct DOM class manipulation.
//
// RETROACTIVE FIX (found on request, "check menu-mobile"): confirmed via source diff that
// `.mobile-menu-overlay`'s real visibility is driven by a `body.main-nav-mobile` class (`menu.scss`:
// `.main-nav-mobile .mobile-menu-overlay { visibility: visible }`) — this component previously toggled
// an `.active` class on the overlay itself, which has NO matching CSS rule at all, so the overlay's
// base `visibility: hidden` never lifted. `panelClassName` was also always `"mobile-menu"` — a class
// name that doesn't exist anywhere in the site's real compiled CSS at all (the real drawer is
// `#main-nav-mobile`, an ID selector with its own `position:fixed`/slide-in `transform` inside a
// mobile-breakpoint media query) — so the actual panel had zero real positioning and collapsed to
// `height:0`. Playwright confirmed both defects with concrete computed styles: the overlay stuck at
// `visibility:hidden`, and the real `#main-nav-mobile`-targeted element (a totally separate node,
// `MobileMenu.tsx`'s own `<ul>`) permanently parked off-screen at `translateX(-320px)` since nothing
// ever added `.active` to it. Fixed via a new `panelId` prop (the caller passes the real
// `"main-nav-mobile"` id) and by dropping the overlay's own `.active` toggle (visibility is entirely
// driven by the `body.main-nav-mobile` class the caller now sets — see `Header.tsx`'s own comment).
export default function Offcanvas({
  isOpen,
  onClose,
  children,
  panelId,
  panelClassName,
}: {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  panelId?: string;
  panelClassName?: string;
}) {
  return (
    <div className="mobile-menu-overlay" onClick={onClose}>
      <div
        id={panelId}
        className={`${panelClassName ?? ""}${isOpen ? " active" : ""}`}
        onClick={(event) => event.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
