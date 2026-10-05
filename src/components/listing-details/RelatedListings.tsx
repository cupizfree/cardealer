"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import type { Listing } from "@/data/listings";
import ListingCard from "@/components/listing/ListingCard";

// Matches `.swiper-card` config in ../aurexo/assets/js/swiper.js: spaceBetween 30, pagination dots,
// responsive slidesPerView 1/2/3/4. Reuses the same `ListingCard` the grid pages use — per
// docs/migration/LISTING_DATA_MAP.md, every card variant should consume `ListingCardData`, not a
// hand-rolled local type.
export default function RelatedListings({ listings }: { listings: Listing[] }) {
  return (
    <section className="py-100 background-light">
      <div className="container">
        <p className="h3 mb-40 capitalize">Anda mungkin juga suka</p>
        <Swiper
          modules={[Pagination]}
          spaceBetween={30}
          slidesPerGroup={1}
          pagination={{ el: ".pagination-swiper-card", clickable: true }}
          breakpoints={{
            0: { slidesPerView: 1, slidesPerGroup: 1 },
            767: { slidesPerView: 2, slidesPerGroup: 2 },
            991: { slidesPerView: 3, slidesPerGroup: 3 },
            1280: { slidesPerView: 4, slidesPerGroup: 4 },
          }}
          className="swiper-card"
        >
          {listings.map((listing) => (
            <SwiperSlide key={listing.id}>
              <ListingCard listing={listing} />
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="pagination-swiper-card mt-24 flex justify-center" />
      </div>
    </section>
  );
}
