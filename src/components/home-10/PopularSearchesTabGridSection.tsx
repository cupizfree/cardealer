"use client";

import { useState } from "react";
import ListingCard from "@/components/listing/ListingCard";
import { allListings } from "@/data/listings";
import { DARK_CAR_TYPE_ICONS } from "@/components/home/carTypeIcons";

const TABS: { label: string; ids: number[] }[] = [
  { label: "Electric", ids: [6, 7, 8] },
  { label: "Sedan", ids: [1, 2, 3, 4] },
  { label: "SUV", ids: [1, 2, 3, 4] },
  { label: "Pickup Truck", ids: [1, 2] },
  { label: "Luxury", ids: [1, 2, 7, 8] },
  { label: "Hatchback", ids: [1, 2, 7, 8] },
  { label: "Crossover", ids: [1, 2, 7, 8] },
];

// Migrated from ../aurexo/home-10.html lines 726-2906 ("Popular searches", the largest single section
// on this page). Genuinely a 3rd distinct "Popular Searches" shape on the site — neither
// `home-02/PopularSearchesSection.tsx`'s swiper-per-tab carousel nor
// `home-07/PopularSearchesGridSection.tsx`'s single-grid-with-decorative-tabs: this is a REAL per-tab
// static `grid grid-cols-4 xl-grid-cols-3 lg-grid-cols-2 sm-grid-cols-1` of `.card-box-style-1` cards
// (confirmed via source read — 7 distinct `.content-inner` blocks, each its own grid, no
// `.swiper-container` anywhere in this section), with the same dark tab-bar icon set as `home-02/
// PopularSearchesSection.tsx`/`home-09.html`'s own "New Vehicles" reuse (`DARK_CAR_TYPE_ICONS`). Heading
// is also a plain standalone centered `<h2>` (no `.title-section`/flex wrapper, confirmed via source
// diff), unlike every other "Popular Searches"/"New Vehicles" heading on the site. All 7 tabs map onto
// the existing 8-listing pool — no new data needed.
//
// CONFIRMED SOURCE QUIRK (not a migration bug): home-10.html's own 7 `.content-inner` blocks are
// genuinely duplicated content in the real source — "SUV" (line 1412) is byte-for-byte identical to
// "Sedan" (line 1081, both card-1/2/3/4), and "Luxury"/"Hatchback"/"Crossover" (lines 1914/2243/2572) are
// all byte-for-byte identical to each other (all card-1/2/7/8) — confirmed via direct source diff of all
// 7 blocks. The `ids` arrays below intentionally preserve this exact duplication rather than "fixing" it,
// per the project's source-fidelity rule.
export default function PopularSearchesTabGridSection() {
  const [activeTab, setActiveTab] = useState("Sedan");
  const tab = TABS.find((t) => t.label === activeTab) ?? TABS[1];
  const listings = tab.ids.map((id, index) => ({ listing: allListings.find((l) => l.id === id)!, index }));

  return (
    <section className="flat-tabs bg-white">
      <div className="container">
        <h2 className="capitalize mb-42 text-center wow fadeInDown" data-wow-delay="0.1s">
          Popular searches
        </h2>

        <div className="overflow-x-auto flex items-center mb-40 gap-8 wow fadeIn" data-wow-delay="0.2s">
          <ul className="menu-tab menu-tab-style2 gap-10 mx-auto">
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
