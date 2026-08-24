"use client";

import { useState } from "react";
import Link from "next/link";
import ListingCard from "@/components/listing/ListingCard";
import { allListings } from "@/data/listings";
import { DARK_CAR_TYPE_ICONS } from "@/components/home/carTypeIcons";

const TABS: { label: string; ids: number[] }[] = [
  { label: "Electric", ids: [6, 7, 8] },
  { label: "Sedan", ids: [1, 2, 3, 4, 5, 6, 7, 8] },
  { label: "SUV", ids: [1, 2, 3, 4] },
  { label: "Pickup Truck", ids: [1, 2] },
  { label: "Luxury", ids: [1, 2, 7, 8] },
  { label: "Hatchback", ids: [1, 2, 7, 8] },
  { label: "Crossover", ids: [1, 2, 7, 8] },
];

// Migrated from ../aurexo/home-07.html lines 1181-3684 ("Popular searches"). Genuinely different DOM
// from every other "Popular Searches" tab section on the site (home/TrendingSearchesSection.tsx,
// home-02/PopularSearchesSection.tsx, home-03/PopularSearchesCarousel.tsx): those are all swiper
// carousels; this is a REAL per-tab static `grid grid-cols-4 xl-grid-cols-3 lg-grid-cols-2
// sm-grid-cols-1` of `.card-box-style-1` cards (the same shape as home-10.html's own "Popular searches",
// `home-10/PopularSearchesTabGridSection.tsx`) — the same dark tab-bar icon set as `home-02/
// PopularSearchesSection.tsx`'s own, reused via `DARK_CAR_TYPE_ICONS`. "Sedan" is the source's own
// default-active tab.
//
// CORRECTION of this component's own earlier claim ("only one `.content-inner` exists, tabs are purely
// decorative"): a direct re-grep found 7 distinct `.content-inner` blocks (lines 1303/1544/2192/2523/
// 2694/3023/3352), one per tab, each its own real grid with a different card count (3/8/4/2/4/4/4 = 29
// total) — confirmed via a full image-src read of each block. The previous version concatenated all 29
// cards into ONE always-visible grid with non-functional tabs — a real, confirmed layout bug (a much
// taller, denser single grid instead of the correct small per-tab grid), found while investigating a
// user report of home-07 rendering with significantly wrong layout. Fixed to real tab-switching
// (`useState`), matching the `home-10/PopularSearchesTabGridSection.tsx` pattern.
export default function PopularSearchesGridSection() {
  const [activeTab, setActiveTab] = useState("Sedan");
  const tab = TABS.find((t) => t.label === activeTab) ?? TABS[1];
  const listings = tab.ids.map((id, index) => ({ listing: allListings.find((l) => l.id === id)!, index }));

  return (
    <section className="py-100 flat-tabs background-light">
      <div className="container wow fadeIn" data-wow-delay="0.2s">
        <div className="title-section mb-40 wow fadeInUp" data-wow-delay="0.1s">
          <h2 className="capitalize">Popular searches</h2>
          <Link href="/listing-grid4-columns" className="btn btn-line-style-2 effect-line-primary btn-large hover-fill-white">
            View All
            <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M8.125 0C6.51803 0 4.94714 0.476523 3.611 1.36931C2.27485 2.2621 1.23344 3.53105 0.618482 5.0157C0.00352044 6.50035 -0.157382 8.13401 0.156123 9.71011C0.469628 11.2862 1.24346 12.7339 2.37976 13.8702C3.51606 15.0065 4.9638 15.7804 6.5399 16.0939C8.11599 16.4074 9.74966 16.2465 11.2343 15.6315C12.719 15.0166 13.9879 13.9752 14.8807 12.639C15.7735 11.3029 16.25 9.73197 16.25 8.125C16.2477 5.97081 15.391 3.90551 13.8677 2.38227C12.3445 0.85903 10.2792 0.00227486 8.125 0ZM11.6922 8.56719L9.19219 11.0672C9.07492 11.1845 8.91586 11.2503 8.75 11.2503C8.58415 11.2503 8.42509 11.1845 8.30782 11.0672C8.19054 10.9499 8.12466 10.7909 8.12466 10.625C8.12466 10.4591 8.19054 10.3001 8.30782 10.1828L9.74141 8.75H5C4.83424 8.75 4.67527 8.68415 4.55806 8.56694C4.44085 8.44973 4.375 8.29076 4.375 8.125C4.375 7.95924 4.44085 7.80027 4.55806 7.68306C4.67527 7.56585 4.83424 7.5 5 7.5H9.74141L8.30782 6.06719C8.19054 5.94991 8.12466 5.79085 8.12466 5.625C8.12466 5.45915 8.19054 5.30009 8.30782 5.18281C8.42509 5.06554 8.58415 4.99965 8.75 4.99965C8.91586 4.99965 9.07492 5.06554 9.19219 5.18281L11.6922 7.68281C11.7503 7.74086 11.7964 7.80979 11.8279 7.88566C11.8593 7.96154 11.8755 8.04287 11.8755 8.125C11.8755 8.20713 11.8593 8.28846 11.8279 8.36434C11.7964 8.44021 11.7503 8.50914 11.6922 8.56719Z"
                fill="#1C1C1C"
              />
            </svg>
          </Link>
        </div>
        <div className="flex items-center justify-between mb-40 gap-8 overflow-x-auto">
          <ul className="menu-tab menu-tab-style2 gap-5">
            {TABS.map((t) => (
              <li
                className={`car-box${t.label === activeTab ? " active" : ""}`}
                key={t.label}
                onClick={() => setActiveTab(t.label)}
              >
                {DARK_CAR_TYPE_ICONS[t.label]}
                {t.label}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="container wow fadeIn" data-wow-delay="0.3s">
        <div className="content-tab">
          <div className="content-inner active">
            <div className="grid grid-cols-4 xl-grid-cols-3 lg-grid-cols-2 sm-grid-cols-1 gap-x-30 gap-y-40">
              {listings.map(({ listing, index }) => (
                <ListingCard key={index} listing={listing} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
