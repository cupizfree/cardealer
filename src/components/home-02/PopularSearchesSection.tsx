"use client";

import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import ListingCard from "@/components/listing/ListingCard";
import { allListings } from "@/data/listings";
import { DARK_CAR_TYPE_ICONS } from "@/components/home/carTypeIcons";

// Migrated from ../aurexo/home-02.html lines 1381-3409 (`.flat-tabs`, "Pencarian Populer"). 7 type tabs,
// each its own swiper of `card-box-style-1` cards. Every title across all 7 tabs already matches an
// existing canonical listing (ids 1-4 only, confirmed via full source read) — no new data needed, same
// conclusion as index.html's own "Mobil Baru"/"Mobil Bekas" tabs. Tab 2 ("Sedan") is the source's own
// default-active tab.
//
// Retroactive fix: this tab's `.swiper-card` config had wrong breakpoints (`575/767/1280` → `2/3/4`)
// and wrong `spaceBetween` (16) — the real config (`assets/js/swiper.js` lines 79-118) is
// `spaceBetween: 30` with breakpoints `767/991/1280` → `2/3/4` (each paired with a matching
// `slidesPerGroup`), same copy-paste error found and fixed identically in
// `home-03/PopularSearchesCarousel.tsx` and `home/TrendingSearchesSection.tsx`.
const TABS: { label: string; ids: number[] }[] = [
  { label: "Listrik", ids: [2, 3, 4] },
  { label: "Sedan", ids: [1, 2, 3, 4, 1, 2] },
  { label: "SUV", ids: [1, 2] },
  { label: "Pikap", ids: [2, 3, 4] },
  { label: "Mewah", ids: [2, 3, 4] },
  { label: "Hatchback", ids: [1, 2] },
  { label: "Crossover", ids: [2, 3, 4] },
];

// home-09.html reuses this exact same 7-tab shape (same dark tab-bar icons, same centered heading
// wrapper) via `heading="Mobil Baru"` and its own `background-light radius-40` section skin — 6 of
// the 7 tabs' ids match byte-for-byte (Electric/SUV/Pickup Truck/Luxury/Hatchback/Crossover, confirmed
// via full title read); only "Sedan" differs (`[1,2,3,4]`, not this component's own `[1,2,3,4,1,2]`) —
// exposed via a `tabs` override prop rather than forking the component. It also has NO bullet
// pagination at all (confirmed via grep — genuinely absent), exposed via `showPagination`.
export default function PopularSearchesSection({
  heading = "Pencarian Populer",
  sectionClassName = "py-100 flat-tabs",
  tabs = TABS,
  showPagination = true,
}: {
  heading?: string;
  sectionClassName?: string;
  tabs?: { label: string; ids: number[] }[];
  showPagination?: boolean;
}) {
  const [activeTab, setActiveTab] = useState("Sedan");
  const tab = tabs.find((t) => t.label === activeTab) ?? tabs[1];
  const listings = tab.ids.map((id, index) => ({ listing: allListings.find((l) => l.id === id)!, index }));

  return (
    <section className={sectionClassName}>
      <div className="container">
        <div className="flex items-center justify-center mb-40 wow fadeInUp">
          <h2>{heading}</h2>

        </div>
        <div className="flex items-center justify-center overflow-x-auto mb-40 gap-8 wow fadeIn" data-wow-delay="0.1s">
          <ul className="menu-tab menu-tab-style2 margin-auto gap-10">
            {tabs.map((t) => (
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

      <div className="container wow fadeIn" data-wow-delay="0.2s">
        <div className="content-tab">
          <div className="content-inner active">
            <div className="swiper-container swiper-card">
              <Swiper
                key={activeTab}
                modules={[Pagination]}
                slidesPerView={1}
                slidesPerGroup={1}
                spaceBetween={30}
                pagination={showPagination ? { el: ".pagination-swiper-card-popular", clickable: true } : undefined}
                breakpoints={{
                  767: { slidesPerView: 2, slidesPerGroup: 2 },
                  991: { slidesPerView: 3, slidesPerGroup: 3 },
                  1280: { slidesPerView: 4, slidesPerGroup: 4 },
                }}
              >
                {listings.map(({ listing, index }) => (
                  <SwiperSlide key={index}>
                    <ListingCard listing={listing} />
                  </SwiperSlide>
                ))}
              </Swiper>

              {showPagination && (
                <div className="swiper-pagination pagination-dark pagination-style pagination-swiper-card-popular mt-38" />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
