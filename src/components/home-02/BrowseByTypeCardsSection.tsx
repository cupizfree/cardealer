"use client";

import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Grid, Pagination } from "swiper/modules";

const TYPES = [
  { name: "Electric", image: "/assets/images/card/card-11.png", vehicles: 32 },
  { name: "Sedan", image: "/assets/images/card/card-12.png", vehicles: 23 },
  { name: "SUV", image: "/assets/images/card/card-13.png", vehicles: 29 },
  { name: "Pickup Truck", image: "/assets/images/card/card-14.png", vehicles: 38 },
  { name: "Luxury", image: "/assets/images/card/card-15.png", vehicles: 22 },
  { name: "Hatchback", image: "/assets/images/card/card-16.png", vehicles: 32 },
  { name: "Crossover", image: "/assets/images/card/card-17.png", vehicles: 16 },
  { name: "Coupe", image: "/assets/images/card/card-18.png", vehicles: 28 },
  { name: "Convertible", image: "/assets/images/card/card-19.png", vehicles: 32 },
  { name: "Wagon", image: "/assets/images/card/card-20.png", vehicles: 24 },
];

// Migrated from ../aurexo/home-02.html lines 1267-1379 (`.swiper-card-6`). Genuinely different DOM
// from index.html's own "Browse By Type" (`BrowseByTypeSection.tsx`, an icon-only carousel over a
// parallax banner) — this is a white card carousel with real per-type photos and vehicle counts, so
// it's its own component rather than a shared one (variant classification rule).
//
// Retroactive fix: `assets/js/swiper.js`'s real `.swiper-card-6` config uses the legacy
// `slidesPerColumn: 2`/`slidesPerColumnFill: "row"` (a real 2-row grid per page), plus breakpoints
// 550/767/991/1440 → 2/3/4/5 columns and `spaceBetween: 30` — same bug/fix pattern already found for
// `home/NewCarsSection.tsx`'s `.swiper-card-7` (COMPONENT_MAP.md #76). Reproduced via Swiper's modern
// `Grid` module (`grid={{ rows: 2, fill: "row" }}`, `swiper/css/grid` already imported globally in
// `layout.tsx`).
//
// Retroactive fix: the "Check All Car Type" button was missing its real icon (a circular-arrow SVG,
// confirmed present in home-02.html's own source) — added back as the default `checkAllIcon`.
//
// home-08.html reuses this exact same 10-type dataset (byte-identical images/vehicle counts, confirmed
// via source diff) inside a `bg-primary py-80` section instead of `background-light py-100`, with a
// white heading, a `btn-blur` "Check All Car Type" button with its own distinct 20×20 white icon (not
// the 17×17 dark one used everywhere else), `card-box-blur` cards (not `bg-white`), and
// `pagination-white` (not `pagination-dark`) — all real, confirmed per-page differences, exposed via
// props rather than forking the component.
//
// RETROACTIVE FIX (found on request, "check Browse By Type card-box-style-3 color on home-08"): the
// per-card type name (`<p>Electric</p>` etc.) always hardcoded no color class, correct for home-02.html's
// own real `card-box-style-3 bg-white` cards (dark text on a white card, confirmed via source diff) — but
// home-08.html's own real title is `h4 mb-4 text-white link` (confirmed via source diff), because its
// `card-box-blur` variant is a near-transparent `rgba(255,255,255,0.1)` card sitting directly on the
// section's own dark `bg-primary` background (`box.scss`'s `.card-box-style-3.card-box-blur` sets no
// text color of its own) — the default dark text would render at very low contrast, close to invisible.
// Fixed via a new `cardTitleColorClass` prop (default `""`, home-08 passes `"text-white"`).
const DEFAULT_ICON = (
  <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M8.125 0C6.51803 0 4.94714 0.476523 3.611 1.36931C2.27485 2.2621 1.23344 3.53105 0.618482 5.0157C0.00352044 6.50035 -0.157382 8.13401 0.156123 9.71011C0.469628 11.2862 1.24346 12.7339 2.37976 13.8702C3.51606 15.0065 4.9638 15.7804 6.5399 16.0939C8.11599 16.4074 9.74966 16.2465 11.2343 15.6315C12.719 15.0166 13.9879 13.9752 14.8807 12.639C15.7735 11.3029 16.25 9.73197 16.25 8.125C16.2477 5.97081 15.391 3.90551 13.8677 2.38227C12.3445 0.85903 10.2792 0.00227486 8.125 0ZM11.6922 8.56719L9.19219 11.0672C9.07492 11.1845 8.91586 11.2503 8.75 11.2503C8.58415 11.2503 8.42509 11.1845 8.30782 11.0672C8.19054 10.9499 8.12466 10.7909 8.12466 10.625C8.12466 10.4591 8.19054 10.3001 8.30782 10.1828L9.74141 8.75H5C4.83424 8.75 4.67527 8.68415 4.55806 8.56694C4.44085 8.44973 4.375 8.29076 4.375 8.125C4.375 7.95924 4.44085 7.80027 4.55806 7.68306C4.67527 7.56585 4.83424 7.5 5 7.5H9.74141L8.30782 6.06719C8.19054 5.94991 8.12466 5.79085 8.12466 5.625C8.12466 5.45915 8.19054 5.30009 8.30782 5.18281C8.42509 5.06554 8.58415 4.99965 8.75 4.99965C8.91586 4.99965 9.07492 5.06554 9.19219 5.18281L11.6922 7.68281C11.7503 7.74086 11.7964 7.80979 11.8279 7.88566C11.8593 7.96154 11.8755 8.04287 11.8755 8.125C11.8755 8.20713 11.8593 8.28846 11.8279 8.36434C11.7964 8.44021 11.7503 8.50914 11.6922 8.56719Z"
      fill="#1C1C1C"
    />
  </svg>
);

export default function BrowseByTypeCardsSection({
  sectionClassName = "background-light py-100",
  headingClassName,
  checkAllButtonClassName = "btn btn-line-style-2 effect-line-primary hover-fill-white btn-large",
  checkAllIcon = DEFAULT_ICON,
  cardClassName = "card-box-style-3 bg-white",
  cardTitleColorClass = "",
  paginationVariant = "pagination-dark",
}: {
  sectionClassName?: string;
  headingClassName?: string;
  checkAllButtonClassName?: string;
  checkAllIcon?: React.ReactNode;
  cardClassName?: string;
  cardTitleColorClass?: string;
  paginationVariant?: string;
}) {
  return (
    <section className={sectionClassName}>
      <div className="container">
        <div className="title-section mb-30 wow fadeInUp">
          <h2 className={headingClassName}>Browse By Type</h2>
          <Link href="/listing-grid4-columns" className={checkAllButtonClassName}>
            Check All Car Type
            {checkAllIcon}
          </Link>
        </div>

        <Swiper
          modules={[Grid, Pagination]}
          slidesPerView={1}
          spaceBetween={30}
          grid={{ rows: 2, fill: "row" }}
          pagination={{ el: ".pagination-swiper-card-6", clickable: true }}
          breakpoints={{
            550: { slidesPerView: 2 },
            767: { slidesPerView: 3 },
            991: { slidesPerView: 4 },
            1440: { slidesPerView: 5 },
          }}
          className="swiper-container swiper-card-6"
        >
          {TYPES.map((type) => (
            <SwiperSlide key={type.name}>
              <Link href="/listing-grid4-columns" className={cardClassName}>
                <div className="image">
                  <Image className="w-full" src={type.image} alt="car" width={260} height={180} />
                </div>
                <p className={`link h4 font-weight-600 mb-4${cardTitleColorClass ? ` ${cardTitleColorClass}` : ""}`}>{type.name}</p>
                <p className="text-sm text-muted">{type.vehicles} Vehicles</p>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className={`swiper-pagination ${paginationVariant} pagination-style pagination-swiper-card-6 mt-40`} />
      </div>
    </section>
  );
}
