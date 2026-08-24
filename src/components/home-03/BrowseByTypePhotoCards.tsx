"use client";

import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Grid, Pagination } from "swiper/modules";

// Same circular-arrow icon reused for "View All Brand" on `home/BrandsSection.tsx` — confirmed
// byte-identical SVG path across both source buttons.
const CHECK_ALL_ICON = (
  <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M8.125 0C6.51803 0 4.94714 0.476523 3.611 1.36931C2.27485 2.2621 1.23344 3.53105 0.618482 5.0157C0.00352044 6.50035 -0.157382 8.13401 0.156123 9.71011C0.469628 11.2862 1.24346 12.7339 2.37976 13.8702C3.51606 15.0065 4.9638 15.7804 6.5399 16.0939C8.11599 16.4074 9.74966 16.2465 11.2343 15.6315C12.719 15.0166 13.9879 13.9752 14.8807 12.639C15.7735 11.3029 16.25 9.73197 16.25 8.125C16.2477 5.97081 15.391 3.90551 13.8677 2.38227C12.3445 0.85903 10.2792 0.00227486 8.125 0ZM11.6922 8.56719L9.19219 11.0672C9.07492 11.1845 8.91586 11.2503 8.75 11.2503C8.58415 11.2503 8.42509 11.1845 8.30782 11.0672C8.19054 10.9499 8.12466 10.7909 8.12466 10.625C8.12466 10.4591 8.19054 10.3001 8.30782 10.1828L9.74141 8.75H5C4.83424 8.75 4.67527 8.68415 4.55806 8.56694C4.44085 8.44973 4.375 8.29076 4.375 8.125C4.375 7.95924 4.44085 7.80027 4.55806 7.68306C4.67527 7.56585 4.83424 7.5 5 7.5H9.74141L8.30782 6.06719C8.19054 5.94991 8.12466 5.79085 8.12466 5.625C8.12466 5.45915 8.19054 5.30009 8.30782 5.18281C8.42509 5.06554 8.58415 4.99965 8.75 4.99965C8.91586 4.99965 9.07492 5.06554 9.19219 5.18281L11.6922 7.68281C11.7503 7.74086 11.7964 7.80979 11.8279 7.88566C11.8593 7.96154 11.8755 8.04287 11.8755 8.125C11.8755 8.20713 11.8593 8.28846 11.8279 8.36434C11.7964 8.44021 11.7503 8.50914 11.6922 8.56719Z"
      fill="#1C1C1C"
    />
  </svg>
);

const TYPES = [
  { name: "Electric", image: "/assets/images/card/card-27.png", vehicles: 24 },
  { name: "Sedan", image: "/assets/images/card/card-28.png", vehicles: 32 },
  { name: "SUV", image: "/assets/images/card/card-29.png", vehicles: 28 },
  { name: "Pickup Truck", image: "/assets/images/card/card-30.png", vehicles: 22 },
  { name: "Hatchback", image: "/assets/images/card/card-31.png", vehicles: 38 },
  { name: "Crossover", image: "/assets/images/card/card-32.png", vehicles: 29 },
  { name: "Coupe", image: "/assets/images/card/card-33.png", vehicles: 23 },
  { name: "Convertible", image: "/assets/images/card/card-34.png", vehicles: 32 },
];

// Migrated from ../aurexo/home-03.html lines 1723-1832 (`.swiper-card-8`, `.card-box-style-5`). A 3rd
// distinct "Browse By Type" variant — neither index.html's icon-only carousel over a parallax banner
// nor home-02.html's `.card-box-style-3`/`.swiper-card-6` white cards (confirmed via source diff: real
// photo cards, own `card-27..34.png` images, no banner, no icon SVGs, its own 8-type set without
// "Luxury"). Kept as its own component per the variant classification rule.
//
// Retroactive fix: `assets/js/swiper.js`'s real `.swiper-card-8` config uses `slidesPerColumn: 2`/
// `slidesPerColumnFill: "row"` (a real 2-row grid per page, NOT a single-row carousel) with breakpoints
// `0/400/767/991` → 1/2/3/4 columns and `spaceBetween: 30` — same bug/fix pattern already found for
// `home/NewCarsSection.tsx`'s `.swiper-card-7` (#76) and `home-02/BrowseByTypeCardsSection.tsx`'s
// `.swiper-card-6` (#78). The previous version had no row-grouping, wrong breakpoints (`575/767/1280` →
// `3/4/5`, source never reaches a 5th column), and wrong `spaceBetween` (16). Fixed identically: added
// Swiper's `Grid` module (`grid={{ rows: 2, fill: "row" }}`); `swiper/css/grid` already imported
// globally in `layout.tsx` from the #76 fix.
// home-09.html reuses this exact same 8-type dataset byte-for-byte (confirmed via source diff), just
// with its own `title-section mb-28 wow fadeInDown` (not `mb-30 wow fadeInUp`) — exposed via
// `titleSectionClassName` rather than forking the component.
//
// home-10.html reuses this same dataset again with a plain `bg-white` section (no `py-100` at all —
// this whole page uses `tf-spacing` divider divs between sections instead of section-level padding,
// confirmed via source diff) — exposed via `sectionClassName`.
//
// RETROACTIVE FIX (found while checking home-06's own "Browse By Type" button): the "Check All Car
// Type" link never rendered its real icon — confirmed present (byte-identical circular-arrow SVG,
// `fill="#1C1C1C"`) in home-03.html's own source and every other page that reuses this component
// (home-06/home-09/home-10.html) — the same icon already used for "View All Brand" on
// `home/BrandsSection.tsx`. Fixed by adding it as the default `CHECK_ALL_ICON`; this fixes all 4 pages
// at once since they all share this one component.
export default function BrowseByTypePhotoCards({
  titleSectionClassName = "mb-30 wow fadeInUp",
  sectionClassName = "py-100",
}: {
  titleSectionClassName?: string;
  sectionClassName?: string;
}) {
  return (
    <section className={sectionClassName}>
      <div className="container">
        <div className={`title-section ${titleSectionClassName}`}>
          <h2>Browse By Type</h2>
          <Link href="/listing-grid4-columns" className="btn btn-line-style-2 effect-line-primary hover-fill-white btn-large">
            Check All Car Type
            {CHECK_ALL_ICON}
          </Link>
        </div>

        <Swiper
          modules={[Grid, Pagination]}
          slidesPerView={1}
          spaceBetween={30}
          grid={{ rows: 2, fill: "row" }}
          pagination={{ el: ".pagination-swiper-card-8", clickable: true }}
          breakpoints={{
            400: { slidesPerView: 2 },
            767: { slidesPerView: 3 },
            991: { slidesPerView: 4 },
          }}
          className="swiper-container swiper-card-8"
        >
          {TYPES.map((type) => (
            <SwiperSlide key={type.name}>
              <Link href="/listing-grid4-columns" className="card-box-style-5">
                <div className="image">
                  <Image src={type.image} alt="car" width={260} height={180} />
                </div>
                <div className="content">
                  <p className="h4 link font-weight-600 mb-4">{type.name}</p>
                  <p className="text-sm text-muted">{type.vehicles} Vehicles</p>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="swiper-pagination pagination-dark pagination-style pagination-swiper-card-8 mt-40" />
      </div>
    </section>
  );
}
