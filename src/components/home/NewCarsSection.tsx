"use client";

import { useState } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Grid, Pagination } from "swiper/modules";
import ListingCard from "@/components/listing/ListingCard";
import { useListings } from "@/components/common/KatalogProvider";

// Migrated from ../aurexo/index.html lines 1107-2307 (`.flat-tabs`). Both tabs' card sets exactly
// match existing canonical listings (ids 1-8, confirmed via full source title/spec/price read — the
// "Mobil Bekas" tab is a literal repeat of the first 6 "Mobil Baru" entries), so this reuses
// `ListingCard`/`allListings` directly rather than any page-local data. Real tab switch — same
// `content-tab > content-inner.active` pattern already used by `BlogGridStyle2Content.tsx`.
const NEW_CAR_IDS = [1, 2, 3, 4, 5, 6, 7, 8];
const USED_CAR_IDS = [1, 2, 3, 4, 5, 6];

export default function NewCarsSection() {
  const [activeTab, setActiveTab] = useState<"new" | "used">("new");
  const ids = activeTab === "new" ? NEW_CAR_IDS : USED_CAR_IDS;
  const listings = useListings(ids);

  return (
    <section className="container py-100 flat-tabs">
      <div className="title-section mb-30 gap-8 wow fadeInUp" data-wow-delay="0.1s">
        <ul className="menu-tab menu-tab-style2 text-white gap-40 md-gap-12">
          <li className={activeTab === "new" ? "active" : ""} onClick={() => setActiveTab("new")}>
            <h2 className="text">Mobil Baru</h2>
          </li>
          <li className={activeTab === "used" ? "active" : ""} onClick={() => setActiveTab("used")}>
            <h2 className="text">Mobil Bekas</h2>
          </li>
        </ul>
        <Link
          href="/listing-grid4-columns"
          className="btn btn-line-style-2 effect-line-primary hover-fill-white effect-line-primary btn-large"
        >
          Lihat Semua
        </Link>
      </div>

      <div className="content-tab">
        <div className="content-inner active">
          <div className="swiper-container swiper-card-7">
            {/* Reproduces `swiper.js`'s own `.swiper-card-7` config verbatim: a real 2-row grid per
                page (legacy `slidesPerColumn: 2`/`slidesPerColumnFill: "row"`, Swiper's modern `Grid`
                module equivalent — `rows: 2, fill: "row"`), NOT a single-row carousel. Found and fixed
                after a direct source/swiper.js re-check — the previous version only varied
                `slidesPerView` per breakpoint with no row-grouping at all, so New Cars' 8 cards and
                Used Cars' 6 cards rendered as one flat row instead of the real 2-row grid. */}
            <Swiper
              key={activeTab}
              modules={[Grid, Pagination]}
              slidesPerView={1}
              spaceBetween={30}
              grid={{ rows: 2, fill: "row" }}
              pagination={{ el: ".pagination-swiper-card-7-1", clickable: true }}
              breakpoints={{
                550: { slidesPerView: 1 },
                767: { slidesPerView: 2 },
                991: { slidesPerView: 3 },
                1440: { slidesPerView: 4 },
              }}
            >
              {listings.map((listing) => (
                <SwiperSlide key={listing.id}>
                  <div className="mt-10">
                    <ListingCard listing={listing} />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            <div className="swiper-pagination pagination-dark pagination-style pagination-swiper-card-7-1 mt-38" />
          </div>
        </div>
      </div>
    </section>
  );
}
