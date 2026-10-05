"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const ITEMS = [
  { image: "/assets/images/card/card-37.jpg", label: "SUV" },
  { image: "/assets/images/card/card-38.jpg", label: "SUV" },
  { image: "/assets/images/card/card-39.jpg", label: "Pikap" },
  { image: "/assets/images/card/card-40.jpg", label: "Sedan" },
  { image: "/assets/images/card/card-41.jpg", label: "Hatchback" },
  { image: "/assets/images/card/card-42.jpg", label: "Crossover" },
];

// Migrated from ../aurexo/home-04.html lines 1115-1145 (`.slide-gallery-list.style2`). Real click-to-
// expand accordion — `assets/js/app.js`'s `hoverActiveGallery()` (despite the name, a real click
// handler, not hover) runs `$('.slide-gallery-list .slide-gallery').click(...)`, the exact same
// selector/behavior already reproduced for `listing-details/DetailsGalleryAccordion.tsx` (clicking a
// panel marks it active, removing `.active` from its siblings; `reponsive.scss`'s
// `.slide-gallery-list.style2 .slide-gallery.active` rule handles the expand width). No lightbox here
// (source has no Fancybox attribute on this section, unlike the listing-details galleries) — each
// panel's own `.brand-item-button` is a real link to the car-type listing grid. Source's own default
// active panel is the 2nd of 6 (index 1) — kept as literal fidelity.
//
// home-05.html reuses the exact same 6 panels/click-expand mechanism but with `.slide-gallery-list
// .scroll` instead of `.style2` (confirmed via source diff): a plain `.container` (not
// `.header-container-fluid`) wraps a `.container-grid-gallery.gallery-scroll` (horizontal
// `overflow-x: auto`, not `overflow: hidden`) — the base (non-`.style2`) `.slide-gallery .active` rule
// (`flex: 3.7`, `page-title.scss`) still drives the same real expand-on-click behavior, just a
// different flex ratio and a horizontally-scrollable strip instead of a clipped, evenly-distributed
// row. Exposed via a `variant` prop rather than a new component.
export default function BrowseByTypeGallery({ variant = "style2" }: { variant?: "style2" | "scroll" }) {
  const [activeIndex, setActiveIndex] = useState(1);

  const gallery = (
    <div className={`container-grid-gallery${variant === "style2" ? " overflow-hidden mx-auto" : " gallery-scroll"}`}>
      <div className={`slide-gallery-list ${variant}`}>
        {ITEMS.map((item, index) => (
          <div
            key={index}
            className={`brand-item-style-2 slide-gallery cursor-pointer${index === activeIndex ? " active" : ""}`}
            onClick={() => setActiveIndex(index)}
          >
            <Image src={item.image} alt="electric" fill style={{ objectFit: "cover" }} />
            <Link href="/listing-grid4-columns" className="brand-item-button">
              {item.label}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );

  return variant === "style2" ? <div className="header-container-fluid">{gallery}</div> : <div className="container">{gallery}</div>;
}
