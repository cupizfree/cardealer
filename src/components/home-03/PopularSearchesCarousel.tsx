"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import ListingCard from "@/components/listing/ListingCard";
import { allListings } from "@/data/listings";

// Migrated from ../aurexo/home-03.html lines 1117-1645 ("Popular Searches"). Unlike home-02.html's own
// 7-type-tab version (`home-02/PopularSearchesSection.tsx`), this is a single un-tabbed
// `.swiper-container.swiper-card` carousel — no `.flat-tabs`/`.menu-tab` markup anywhere in this
// section (confirmed via full source read). 6 slides repeat the first 4 canonical listings
// (ids 1-4, card 1 & 2 shown twice) — no new data needed, same conclusion as every other
// "Popular/New/Used/Trending Searches" section on the home variants so far.
//
// Retroactive fix: `assets/js/swiper.js`'s real `.swiper-card` config (lines 79-118) is
// `spaceBetween: 30` with breakpoints `0/400/767/991/1280` → `1/1/2/3/4` `slidesPerView` (each paired
// with a matching `slidesPerGroup`) — this file had wrong breakpoints (`575/767/1280` → `2/3/4`) and
// wrong `spaceBetween` (16), the same copy-paste error found in `home-02/PopularSearchesSection.tsx`
// and `home/TrendingSearchesSection.tsx` (fixed identically alongside this one).
//
// home-08.html reuses this exact same untabbed shape with its own real `.swiper-card-style-2` class
// (confirmed via `assets/js/swiper.js` — byte-identical config to `.swiper-card`: `spaceBetween: 30`,
// breakpoints `0/400/767/991/1280` → `1/1/2/3/4`, just a different class name) and its own 6-slide id
// sequence (ids 1,2,3,4,1,1 — confirmed via title read), exposed via new `slideIds`/`swiperClassName`/
// `paginationClass` props rather than forking the component.
const DEFAULT_SLIDE_IDS = [1, 2, 3, 4, 1, 2];

export default function PopularSearchesCarousel({
  slideIds = DEFAULT_SLIDE_IDS,
  swiperClassName = "swiper-card",
  paginationClass = "pagination-swiper-card-popular-03",
  cardTitleExtraClassName,
}: {
  slideIds?: number[];
  swiperClassName?: string;
  paginationClass?: string;
  /** home-08.html's own cards carry an extra `mt-1` on the title (confirmed via source diff) — a
   *  trivial 1px nudge, threaded through to `ListingCard`. */
  cardTitleExtraClassName?: string;
}) {
  const listings = slideIds.map((id, index) => ({ listing: allListings.find((l) => l.id === id)!, index }));

  return (
    <section className="py-100">
      <div className="container">
        <div className="title-section mb-40 wow fadeInUp">
          <h2>Popular Searches</h2>
          <a href="/listing-grid4-columns" className="btn btn-line-style-2 effect-line-primary  btn-large hover-fill-white">
						View All
						<svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M8.125 0C6.51803 0 4.94714 0.476523 3.611 1.36931C2.27485 2.2621 1.23344 3.53105 0.618482 5.0157C0.00352044 6.50035 -0.157382 8.13401 0.156123 9.71011C0.469628 11.2862 1.24346 12.7339 2.37976 13.8702C3.51606 15.0065 4.9638 15.7804 6.5399 16.0939C8.11599 16.4074 9.74966 16.2465 11.2343 15.6315C12.719 15.0166 13.9879 13.9752 14.8807 12.639C15.7735 11.3029 16.25 9.73197 16.25 8.125C16.2477 5.97081 15.391 3.90551 13.8677 2.38227C12.3445 0.85903 10.2792 0.00227486 8.125 0ZM11.6922 8.56719L9.19219 11.0672C9.07492 11.1845 8.91586 11.2503 8.75 11.2503C8.58415 11.2503 8.42509 11.1845 8.30782 11.0672C8.19054 10.9499 8.12466 10.7909 8.12466 10.625C8.12466 10.4591 8.19054 10.3001 8.30782 10.1828L9.74141 8.75H5C4.83424 8.75 4.67527 8.68415 4.55806 8.56694C4.44085 8.44973 4.375 8.29076 4.375 8.125C4.375 7.95924 4.44085 7.80027 4.55806 7.68306C4.67527 7.56585 4.83424 7.5 5 7.5H9.74141L8.30782 6.06719C8.19054 5.94991 8.12466 5.79085 8.12466 5.625C8.12466 5.45915 8.19054 5.30009 8.30782 5.18281C8.42509 5.06554 8.58415 4.99965 8.75 4.99965C8.91586 4.99965 9.07492 5.06554 9.19219 5.18281L11.6922 7.68281C11.7503 7.74086 11.7964 7.80979 11.8279 7.88566C11.8593 7.96154 11.8755 8.04287 11.8755 8.125C11.8755 8.20713 11.8593 8.28846 11.8279 8.36434C11.7964 8.44021 11.7503 8.50914 11.6922 8.56719Z" fill="#1C1C1C"></path>
						</svg>
					</a>
        </div>

        <div className={`swiper-container ${swiperClassName}`}>
          <Swiper
            modules={[Pagination]}
            slidesPerView={1}
            slidesPerGroup={1}
            spaceBetween={30}
            pagination={{ el: `.${paginationClass}`, clickable: true }}
            breakpoints={{
              767: { slidesPerView: 2, slidesPerGroup: 2 },
              991: { slidesPerView: 3, slidesPerGroup: 3 },
              1280: { slidesPerView: 4, slidesPerGroup: 4 },
            }}
          >
            {listings.map(({ listing, index }) => (
              <SwiperSlide key={index}>
                <ListingCard listing={listing} titleExtraClassName={cardTitleExtraClassName} />
              </SwiperSlide>
            ))}
          </Swiper>

          <div className={`swiper-pagination pagination-dark pagination-style ${paginationClass} mt-38`} />
        </div>
      </div>
    </section>
  );
}
