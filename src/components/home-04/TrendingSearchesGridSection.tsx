"use client";

import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Grid, Pagination } from "swiper/modules";
import type { ListingCardData } from "@/data/listings";
import { allListings } from "@/data/listings";
import TrendingSearchesGridCard from "./TrendingSearchesGridCard";

const l1 = allListings.find((l) => l.id === 1)!;
const l2 = allListings.find((l) => l.id === 2)!;
const l3 = allListings.find((l) => l.id === 3)!;

// Migrated from ../aurexo/home-04.html lines 1301-2063 ("Trending Searches Near You",
// `.swiper-card-4`). Source's 6 slides are really only 3 distinct cards repeated twice (confirmed via
// full source read: card-44/45/46.jpg each appear exactly twice) — collapsed here rather than
// rendered 6 times, same pattern already used for `home/TrendingSearchesSection.tsx`. Each distinct
// card also carries its own real, disclosed price/badge discrepancy against the canonical listing:
// id1's price/badge already agree with source; id2's real price here is $42.500,00 (canonical:
// $42.800,00) with the same "Harga Bagus" badge; id3 shows a brand-new "Hot Offer" (`bg-primary`)
// badge and $34.200,00 (canonical: no badge at all, $45.500,00) — none invented into `allListings`,
// applied here as literal per-card overrides matching source exactly.
//
// Real config (`assets/js/swiper.js`'s `.swiper-card-4`): `slidesPerColumn: 2`/`slidesPerColumnFill:
// "row"` (a real 2-row grid, NOT a single-row carousel) with breakpoints `0/400/767/991` → `1/1/1/2`
// `slidesPerView` — i.e. it only ever reaches 2 columns (4 cards visible at once in the 2x2 grid),
// never more — reproduced via Swiper's `Grid` module.
const SLIDES: ListingCardData[] = [
  { ...l1, image: "/assets/images/card/card-44.jpg" },
  { ...l2, image: "/assets/images/card/card-45.jpg", price: "$42.500,00" },
  { ...l3, image: "/assets/images/card/card-46.jpg", price: "$34.200,00", badge: { text: "Hot Offer", colorClass: "bg-primary" } },
  { ...l1, image: "/assets/images/card/card-44.jpg" },
  { ...l2, image: "/assets/images/card/card-45.jpg", price: "$42.500,00" },
  { ...l3, image: "/assets/images/card/card-46.jpg", price: "$34.200,00", badge: { text: "Hot Offer", colorClass: "bg-primary" } },
];

export default function TrendingSearchesGridSection() {
  return (
    <section className="py-100 background-light">
      <div className="container wow fadeIn" data-wow-delay="0.1s">
        <div className="title-section mb-40 wow fadeInUp" data-wow-delay="0.1s">
          <h2 className="capitalize">Pencarian populer di sekitar Anda</h2>
          <Link href="/listing-grid4-columns" className="btn btn-line-style-2 effect-line-primary btn-large hover-fill-white">
            Lihat Semua
            <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M8.125 0C6.51803 0 4.94714 0.476523 3.611 1.36931C2.27485 2.2621 1.23344 3.53105 0.618482 5.0157C0.00352044 6.50035 -0.157382 8.13401 0.156123 9.71011C0.469628 11.2862 1.24346 12.7339 2.37976 13.8702C3.51606 15.0065 4.9638 15.7804 6.5399 16.0939C8.11599 16.4074 9.74966 16.2465 11.2343 15.6315C12.719 15.0166 13.9879 13.9752 14.8807 12.639C15.7735 11.3029 16.25 9.73197 16.25 8.125C16.2477 5.97081 15.391 3.90551 13.8677 2.38227C12.3445 0.85903 10.2792 0.00227486 8.125 0ZM11.6922 8.56719L9.19219 11.0672C9.07492 11.1845 8.91586 11.2503 8.75 11.2503C8.58415 11.2503 8.42509 11.1845 8.30782 11.0672C8.19054 10.9499 8.12466 10.7909 8.12466 10.625C8.12466 10.4591 8.19054 10.3001 8.30782 10.1828L9.74141 8.75H5C4.83424 8.75 4.67527 8.68415 4.55806 8.56694C4.44085 8.44973 4.375 8.29076 4.375 8.125C4.375 7.95924 4.44085 7.80027 4.55806 7.68306C4.67527 7.56585 4.83424 7.5 5 7.5H9.74141L8.30782 6.06719C8.19054 5.94991 8.12466 5.79085 8.12466 5.625C8.12466 5.45915 8.19054 5.30009 8.30782 5.18281C8.42509 5.06554 8.58415 4.99965 8.75 4.99965C8.91586 4.99965 9.07492 5.06554 9.19219 5.18281L11.6922 7.68281C11.7503 7.74086 11.7964 7.80979 11.8279 7.88566C11.8593 7.96154 11.8755 8.04287 11.8755 8.125C11.8755 8.20713 11.8593 8.28846 11.8279 8.36434C11.7964 8.44021 11.7503 8.50914 11.6922 8.56719Z"
                fill="#1C1C1C"
              />
            </svg>
          </Link>
        </div>

        <div className="swiper-container swiper-card-4">
          <Swiper
            modules={[Grid, Pagination]}
            slidesPerView={1}
            spaceBetween={30}
            grid={{ rows: 2, fill: "row" }}
            pagination={{ el: ".pagination-swiper-card-4", clickable: true }}
            breakpoints={{
              991: { slidesPerView: 2 },
            }}
          >
            {SLIDES.map((listing, index) => (
              <SwiperSlide key={index}>
                <TrendingSearchesGridCard listing={listing} />
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="swiper-pagination pagination-dark pagination-style pagination-swiper-card-4 mt-38" />
        </div>
      </div>
    </section>
  );
}
