import { useEffect } from "react";
import type { RefObject } from "react";

// Migrated from ../aurexo/assets/js/app.js's `headerFixed()` — runs on every one of the 63 source pages
// via `$(document).ready`, but was never wired into any header component here (tracked as NEEDS_REVIEW
// in COMPONENT_MAP.md's "Sticky header behavior" row). The 3 classes it toggles (`is-fixed`/`is-custom`/
// `is-visible`) already have their full CSS ported verbatim in `header.scss` — they were simply never
// applied by anything, so this hook is the only piece that was missing.
//
// Behavior (thresholds measured from the header's OWN height, matching source exactly, including its
// asymmetry): scrolling past `headerHeight + 200px` switches the header to `position: fixed` but keeps
// it translated off-screen (`is-fixed` alone); past `+300px` additionally collapses any extra chrome
// above the main nav row for headers that have one, e.g. `header-style-2`'s top bar (`is-custom`) —
// while still off-screen, so that chrome is already collapsed by the time the header becomes visible,
// avoiding a double animation; past `+600px` the header finally slides into view (`is-visible`). Below
// `headerHeight + 200px`, all 3 classes are removed and the header returns to its normal in-flow
// position. Note the 200-300px branch does NOT remove `is-custom` (only `is-visible`) — reproduced
// verbatim from the source rather than "fixed", since it's how the original site actually behaves when
// scrolling back up through that range.
//
// CONFIRMED SOURCE BUG, preserved verbatim (not fixed): on home-04.html (`Header.tsx`'s own
// `wrapperExtraClassName="header-sticky"` reuse), `.header-wrapper` is unconditionally `position: fixed`
// regardless of scroll, but the `is-fixed` class ALSO applies `translateY(-200px)` to the inner
// `<header>` itself while `is-visible` is absent (the `headerHeight+200` to `+600` range) — so the
// header visually vanishes off the top of the wrapper for that ~400px scroll range, then snaps back into
// view. Verified this is the ORIGINAL template's own real behavior, not a porting regression: served the
// raw, unmodified `../aurexo/home-04.html` locally and reproduced the exact same disappear/reappear
// glitch with Playwright before concluding this. Per the project's html-fidelity rule, real disclosed
// source bugs are reproduced, not silently corrected.
export function useHeaderScrollFixed(headerRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const headerHeight = header.offsetHeight;

    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;

      if (scrollTop > headerHeight + 600) {
        header.classList.add("is-fixed", "is-custom", "is-visible");
      } else if (scrollTop > headerHeight + 300) {
        header.classList.add("is-fixed", "is-custom");
        header.classList.remove("is-visible");
      } else if (scrollTop > headerHeight + 200) {
        header.classList.add("is-fixed");
        header.classList.remove("is-visible");
      } else {
        header.classList.remove("is-fixed", "is-visible", "is-custom");
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [headerRef]);
}
