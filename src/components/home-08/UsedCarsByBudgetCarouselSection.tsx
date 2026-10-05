"use client";

import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import ListingCardDark from "@/components/listing/ListingCardDark";
import { allListings } from "@/data/listings";

// Migrated from ../aurexo/home-08.html lines 2071-4127 ("Mobil Bekas Sesuai Anggaran", 2055 lines — the
// largest single section on this page). Genuinely different DOM from home-05.html's own "Used Cars by
// Budget" (`home-05/UsedCarsByBudgetSection.tsx`, a static grid of light `ListingCard`s): this is a
// real per-tab `.swiper-container.swiper-card` carousel (confirmed via source read — each of the 5
// price tabs has its own distinct swiper markup with a different card count, not one shared static
// grid) of the DARK/blurred `ListingCardDark` (`.card-box-style-2`) over a `bg-primary` section, with
// its own distinct tab-pill class `.car-box-style-5` (not home-05's own `.car-box`). Every title across
// all 5 tabs maps onto the existing "Trending Searches Near You" canonical listings (ids 13-15,
// confirmed via full title read) — no new data needed, same conclusion as every other tabbed listing
// section in this migration. "$20.000 - $50.000" is the source's own default-active tab.
const TABS: { label: string; ids: number[] }[] = [
  { label: "Semua Mobil", ids: [13, 14, 15, 14, 15, 14] },
  { label: "$20.000 - $50.000", ids: [13, 14, 15, 14, 13, 14] },
  { label: "$50.000 - $70.000", ids: [13, 14, 15, 14] },
  { label: "$70.000 - $100.000", ids: [13, 14, 15, 14] },
  { label: "$100.000 - $150.000", ids: [13, 14, 15, 14] },
];

export default function UsedCarsByBudgetCarouselSection() {
  const [activeTab, setActiveTab] = useState("$20.000 - $50.000");
  const tab = TABS.find((t) => t.label === activeTab) ?? TABS[1];
  const listings = tab.ids.map((id, index) => ({ listing: allListings.find((l) => l.id === id)!, index }));

  return (
    <section className="py-100 bg-primary flat-tabs">
      <div className="container">
        <h2 className="flex justify-center mb-42 text-white wow fadeInDown" data-wow-delay="0.1s">
          Mobil Bekas Sesuai Anggaran
        </h2>

        <div className="overflow-x-auto flex justify-center">
          <ul className="menu-tab menu-tab-style2 gap-10 mb-40 wow fadeIn" data-wow-delay="0.2s">
            {TABS.map((t) => (
              <li
                className={`car-box-style-5${t.label === activeTab ? " active" : ""}`}
                key={t.label}
                onClick={() => setActiveTab(t.label)}
              >
                {t.label}
              </li>
            ))}
          </ul>
        </div>

        <div className="content-tab wow fadeIn" data-wow-delay="0.3s">
          <div className="content-inner active">
            <div className="swiper-container swiper-card">
              <Swiper
                key={activeTab}
                modules={[Pagination]}
                slidesPerView={1}
                slidesPerGroup={1}
                spaceBetween={30}
                pagination={{ el: ".pagination-swiper-card-budget-08", clickable: true }}
                breakpoints={{
                  767: { slidesPerView: 2, slidesPerGroup: 2 },
                  991: { slidesPerView: 3, slidesPerGroup: 3 },
                  1280: { slidesPerView: 4, slidesPerGroup: 4 },
                }}
              >
                {listings.map(({ listing, index }) => (
                  <SwiperSlide key={index}>
                    <ListingCardDark listing={listing} titleExtraClassName="mt-1" />
                  </SwiperSlide>
                ))}
              </Swiper>

              <div className="swiper-pagination pagination-white pagination-style pagination-swiper-card-budget-08 mt-38" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
