"use client";

import { useEffect, useRef, useState } from "react";

const sections = [
  {
    id: "section1",
    navLabel: "1. Terms",
    heading: "1. Terms",
    paragraphs: [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer sed euismod justo, sit amet efficitur dui. Aliquam sodales vestibulum velit, eget sollicitudin quam. Donec non aliquam eros. Etiam sit amet lectus vel justo dignissim condimentum.",
      "In malesuada neque quis libero laoreet posuere. In consequat vitae ligula quis rutrum. Morbi dolor orci, maximus a pulvinar sed, bibendum ac lacus. Suspendisse in consectetur lorem. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Aliquam elementum, est sed interdum cursus, felis ex pharetra nisi, ut elementum tortor urna eu nulla. Donec rhoncus in purus quis blandit.",
      "Etiam eleifend metus at nunc ultricies facilisis. Morbi finibus tristique interdum. Nullam vel eleifend est, eu posuere risus. Vestibulum ligula ex, ullamcorper sit amet molestie",
    ],
    list: null,
  },
  {
    id: "section2",
    navLabel: "2. Limitations",
    heading: "2. Limitations",
    paragraphs: [
      "Etiam eleifend metus at nunc ultricies facilisis. Morbi finibus tristique interdum. Nullam vel eleifend est, eu posuere risus. Vestibulum ligula ex, ullamcorper sit amet molestie a, finibus nec ex.",
    ],
    list: [
      "Aliquam elementum, est sed interdum cursus, felis ex pharetra nisi, ut elementum tortor urna eu nulla. Donec rhoncus in purus quis blandit.",
      "Etiam eleifend metus at nunc ultricies facilisis.",
      "Nullam vel eleifend est, eu posuere risus. Vestibulum ligula ex, ullamcorper sit amet molestie a, finibus nec ex.",
    ],
    trailingParagraph:
      "Etiam eleifend metus at nunc ultricies facilisis. Morbi finibus tristique interdum. Nullam vel eleifend est, eu posuere risus. Vestibulum ligula ex, ullamcorper sit amet molestie",
  },
  {
    id: "section3",
    navLabel: "3. Revisions And Errata",
    heading: "3. Revisions and errata",
    paragraphs: [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer sed euismod justo, sit amet efficitur dui. Aliquam sodales vestibulum velit, eget sollicitudin quam. Donec non aliquam eros. Etiam sit amet lectus vel justo dignissim condimentum.",
      "In malesuada neque quis libero laoreet posuere. In consequat vitae ligula quis rutrum. Morbi dolor orci, maximus a pulvinar sed, bibendum ac lacus. Suspendisse in consectetur lorem. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Aliquam elementum, est sed interdum cursus, felis ex pharetra nisi, ut elementum tortor urna eu nulla. Donec rhoncus in purus quis",
      "Etiam eleifend metus at nunc ultricies facilisis. Morbi finibus tristique interdum. Nullam vel eleifend est, eu posuere risus. Vestibulum ligula ex, ullamcorper sit amet molestie a, finibus nec ex.",
    ],
    list: null,
  },
  {
    id: "section4",
    navLabel: "4. Site Terms Of Use Modifications",
    heading: "4. Site terms of use modifications",
    paragraphs: [
      "Etiam eleifend metus at nunc ultricies facilisis. Morbi finibus tristique interdum. Nullam vel eleifend est, eu posuere risus. Vestibulum ligula ex, ullamcorper sit amet molestie",
    ],
    list: [
      "Aliquam elementum, est sed interdum cursus, felis ex pharetra nisi, ut elementum tortor urna eu nulla. Donec rhoncus in purus quis blandit.",
      "Etiam eleifend metus at nunc ultricies facilisis.",
      "Nullam vel eleifend est, eu posuere risus. Vestibulum ligula ex, ullamcorper sit amet molestie a, finibus nec ex.",
    ],
    trailingParagraph:
      "Etiam eleifend metus at nunc ultricies facilisis. Morbi finibus tristique interdum. Nullam vel eleifend est, eu posuere risus. Vestibulum ligula ex, ullamcorper sit amet molestie",
  },
  {
    id: "section5",
    navLabel: "5. Risks",
    heading: "5. Risks",
    paragraphs: [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer sed euismod justo, sit amet efficitur dui. Aliquam sodales vestibulum velit, eget sollicitudin quam. Donec non aliquam eros. Etiam sit amet lectus vel justo dignissim condimentum.",
      "In malesuada neque quis libero laoreet posuere. In consequat vitae ligula quis rutrum. Morbi dolor orci, maximus a pulvinar sed, bibendum ac lacus. Suspendisse in consectetur lorem. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Aliquam elementum, est sed interdum cursus, felis ex pharetra nisi, ut elementum tortor urna eu nulla. Donec rhoncus in purus quis",
      "Etiam eleifend metus at nunc ultricies facilisis. Morbi finibus tristique interdum. Nullam vel eleifend est, eu posuere risus. Vestibulum ligula ex, ullamcorper sit amet molestie a, finibus nec ex.",
    ],
    list: null,
  },
];

// Migrated from ../aurexo/terms.html lines 482-568. The sticky sidebar nav (`#sidebarSticky` inside
// `#scrollContainer`) is real, working functionality in source — traced `app.js`'s `scrollSidebar()`/
// `checkPosition()` in full: it's a hand-rolled scroll-listener that toggles `.menuFixed`
// (`position: fixed; top: 94px`, sticks below the header) and `.menuSticky` (`position: absolute;
// bottom: 0`, locks to the bottom of `.term-page--nav-container` once the content column has scrolled
// past) — the classic "sidebar sticks while scrolling, then stops at the bottom of its own container"
// pattern, confirmed this is the ONLY page in the whole site using this `#sidebarSticky`/
// `#scrollContainer` id pair.
//
// Initially tried a native CSS `position: sticky` replacement (no JS) since the two observable states
// looked equivalent to what `position:sticky` gives for free. Verified via Playwright that this DOESN'T
// actually work here: the site's global `#wrapper { overflow: hidden !important }` (reset.scss, present
// in source too) becomes the nearest non-visible-overflow ancestor, which makes it the containing block
// for sticky positioning — but since `#wrapper` itself never scrolls (the window/html does), the sticky
// element never re-anchors and just scrolls away with the page. Source's own approach sidesteps this
// entirely by using `position: fixed`/`position: absolute` (via `.menuFixed`/`.menuSticky`, both
// unaffected by an ancestor's `overflow: hidden`), so the scroll-listener is ported faithfully instead of
// replaced — this is a case where the "small CSS-only equivalent" call from elsewhere this session
// (FAQ accordion, Google Maps embeds) doesn't hold up under the site's actual global layout.
//
// Ported 1:1 from `checkPosition`/`scrollSidebar`: `referenceElement` = `#scrollContainer` (`.term-page`,
// stretched by flexbox to the height of the taller `.content` column), `menuSticky` = `#sidebarSticky`,
// `headerHeight` = the real rendered `.header` element's height. `totalHeight` is the scroll position at
// which the bottom of the (flex-stretched) nav container is about 100px from being reached; past that,
// the nav switches from `menuFixed` to `menuSticky` (pinned to the bottom of its own column instead of
// the viewport). No scroll-spy/active-link-highlighting exists anywhere in source for this nav (confirmed
// via search) — only the whole nav's own sticky/unstick position, not per-link state.
//
// `.section:not(:first-child) { margin-top: -60px; padding-top: 100px }` (already in the existing
// compiled CSS) is source's own anchor-scroll-offset trick accounting for the fixed header — native
// `<a href="#section1">` anchor links need no extra JS to land at the right vertical position.
export default function TermsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLUListElement>(null);
  const [stickyState, setStickyState] = useState<"" | "menuFixed" | "menuSticky">("");

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 767px)");

    const checkPosition = () => {
      const container = containerRef.current;
      const nav = navRef.current;
      const header = document.querySelector<HTMLElement>(".header");
      if (!desktop.matches || !container || !nav || !header) return;

      const headerHeight = header.offsetHeight;
      const totalHeight = container.offsetTop + container.clientHeight - nav.clientHeight - 100;
      const rectScroll = container.getBoundingClientRect();

      if (window.scrollY > totalHeight) {
        setStickyState("menuSticky");
        return;
      }
      setStickyState(rectScroll.top <= headerHeight ? "menuFixed" : "");
    };

    checkPosition();
    window.addEventListener("scroll", checkPosition);
    window.addEventListener("resize", checkPosition);
    return () => {
      window.removeEventListener("scroll", checkPosition);
      window.removeEventListener("resize", checkPosition);
    };
  }, []);

  return (
    <section className="bg-white pb-100">
      <div className="container">
        <h2 className="capitalize">Terms of use</h2>
        <div className="tf-spacing-style3" />

        <div className="term-page" id="scrollContainer" ref={containerRef}>
          <div className="term-page--nav-container">
            <ul
              className={`term-page--nav${stickyState ? ` ${stickyState}` : ""}`}
              id="sidebarSticky"
              ref={navRef}
            >
              {sections.map((section) => (
                <li key={section.id}>
                  <a href={`#${section.id}`}>{section.navLabel}</a>
                </li>
              ))}
            </ul>
          </div>
          <div className="content">
            {sections.map((section) => (
              <div className="section" id={section.id} key={section.id}>
                <p className="h4 mb-12 capitalize">{section.heading}</p>
                {section.paragraphs.map((paragraph, i) => (
                  <p
                    className={`text-body-style-2${i < section.paragraphs.length - 1 || section.list ? " mb-12" : ""}`}
                    key={i}
                  >
                    {paragraph}
                  </p>
                ))}
                {section.list && (
                  <ul className="list-style">
                    {section.list.map((item, i) => (
                      <li className="mb-12 text-body-style-2" key={i}>
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
                {section.trailingParagraph && (
                  <p className="text-body-style-2">{section.trailingParagraph}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
